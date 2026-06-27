'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Image from 'next/image'

type Message = {
  id: string
  role: 'user' | 'companion'
  content: string
}

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeStr, setTimeStr] = useState('00:00:00:00')
  const [activeTab, setActiveTab] = useState<'log' | 'protocols'>('log')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Running clock
    const interval = setInterval(() => {
      const now = new Date()
      setTimeStr(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}`
      )
    }, 40)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-scroll
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  useEffect(() => {
    // Fetch history
    fetch('/api/companion/history')
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages)
        }
      })
      .catch(console.error)
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return
    
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)

    try {
      const res = await fetch('/api/companion/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to commune')
      
      const compMsg: Message = { id: crypto.randomUUID(), role: 'companion', content: data.reply }
      setMessages(prev => [...prev, compMsg])
    } catch (err: any) {
      console.error(err)
      const errorMsg: Message = { id: crypto.randomUUID(), role: 'companion', content: `[SYSTEM ERROR] ${err.message}` }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText)
  }

  const WordReveal = ({ text }: { text: string }) => {
    const words = text.split(' ')
    return (
      <div className="leading-relaxed">
        {words.map((word, i) => (
          <span 
            key={i} 
            className="inline-block animate-fade-in opacity-0"
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
          >
            {word}&nbsp;
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] relative pb-[56px] md:pb-0 -m-4 md:-m-8">
      {/* LEFT PANEL - TERMINAL */}
      <div className="w-full md:w-[65%] bg-[#080808] flex flex-col p-4 md:p-8 overflow-hidden h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-[#1A1A1A]">
        
        {/* Top left timestamp */}
        <div className="font-mono text-[11px] text-[#3A3A3A] mb-8 select-none">
          {timeStr}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-8 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
              {msg.role === 'user' ? (
                <div className="font-sans text-[14px] text-[#5C5C5C] animate-fade-in text-right">
                  {msg.content}
                </div>
              ) : (
                <div className="font-serif italic text-[22px] text-[#E8E6E0]">
                  <WordReveal text={msg.content} />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="self-start max-w-[85%] border-l-2 border-[#C41E1E] pl-4 py-1 animate-pulse">
              <div className="font-sans text-[12px] text-[#5C5C5C] tracking-[0.1em] uppercase flex items-center gap-1">
                PROCESSING REALITY <span className="w-2 h-3 bg-[#C41E1E] animate-pulse block" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* RIGHT PANEL - PARCHMENT */}
      <div className="w-full md:w-[35%] bg-[#F5F0E8] flex flex-col p-4 md:p-8 overflow-y-auto h-[50vh] md:h-full">
        
        {/* Profile */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-[160px] h-[160px] bg-[#E8E6E0] relative grayscale contrast-125">
            <Image
              src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Aegis&backgroundColor=E8E6E0"
              alt="Aegis"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-[32px] font-bold text-[#1A1A1A] mb-1 leading-none">AEGIS</h2>
            <div className="font-mono text-[10px] text-[#5C5C5C] tracking-widest uppercase">
              ARCHITECT · LVL 42
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-2 mb-12">
          <button 
            onClick={() => setActiveTab('log')}
            className={`flex-1 py-2 font-mono text-[10px] tracking-[0.15em] uppercase border border-[#1A1A1A] transition-colors ${
              activeTab === 'log' ? 'bg-[#1A1A1A] text-[#F5F0E8]' : 'bg-transparent text-[#1A1A1A] hover:bg-[#E8E6E0]'
            }`}
          >
            Memory Log
          </button>
          <button 
            onClick={() => setActiveTab('protocols')}
            className={`flex-1 py-2 font-mono text-[10px] tracking-[0.15em] uppercase border border-[#1A1A1A] transition-colors ${
              activeTab === 'protocols' ? 'bg-[#1A1A1A] text-[#F5F0E8]' : 'bg-transparent text-[#1A1A1A] hover:bg-[#E8E6E0]'
            }`}
          >
            Protocols
          </button>
        </div>

        {activeTab === 'log' ? (
          <>
            {/* Input Console */}
            <div className="mb-12 flex-1 flex flex-col justify-end">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Communicate your intent..."
                  className="w-full bg-transparent border-b border-[#1A1A1A] text-[#1A1A1A] pb-2 font-sans text-[14px] resize-none focus:outline-none transition-colors placeholder:text-[#A8A094]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    className="font-serif italic text-[18px] text-[#C41E1E] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Transmitting...' : 'Send →'}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Prompts */}
            <div>
              <div className="font-mono text-[10px] text-[#5C5C5C] tracking-widest uppercase mb-4">
                Quick Prompts
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Give me a quest",
                  "Analyze my week",
                  "I'm struggling",
                  "What should I focus on?"
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isProcessing}
                    className="border border-[#C8C0B4] text-[#1A1A1A] px-3 py-1.5 font-sans text-xs hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F0E8] transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 space-y-8">
            <div>
              <div className="font-mono text-[10px] text-[#5C5C5C] tracking-widest uppercase mb-4">
                Directives
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-left font-sans text-sm text-[#1A1A1A] hover:text-[#C41E1E] transition-colors underline decoration-[#C8C0B4] underline-offset-4">
                  COMMENCE QUEST
                </button>
                <button className="text-left font-sans text-sm text-[#1A1A1A] hover:text-[#C41E1E] transition-colors underline decoration-[#C8C0B4] underline-offset-4">
                  INSPECT ASSETS
                </button>
                <button className="text-left font-sans text-sm text-[#1A1A1A] hover:text-[#C41E1E] transition-colors underline decoration-[#C8C0B4] underline-offset-4">
                  DIAGNOSTICS
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
