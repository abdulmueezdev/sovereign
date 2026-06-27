'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { getDemoCompanionResponse } from '@/lib/use-demo-data'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
  }, [messages, isLoading])

  useEffect(() => {
    if (IS_DEMO) {
      setMessages([{ id: 'init', role: 'assistant', content: 'The void stirs. Your kingdom grows stronger with each action. What would you manifest today?' }])
      return
    }

    // Fetch history
    fetch('/api/companion/history')
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          // Remap roles if necessary from db format to frontend format
          const mappedMessages = data.messages.map((m: any) => ({
            ...m,
            role: m.role === 'companion' ? 'assistant' : m.role
          }))
          setMessages(mappedMessages)
        }
      })
      .catch(console.error)
  }, [])

  async function handleSend(messageText: string) {
    const text = messageText.trim();
    if (!text) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText: string;

      if (IS_DEMO) {
        // Simulate AI delay
        await new Promise(r => setTimeout(r, 900));
        responseText = getDemoCompanionResponse(text);
      } else {
        const res = await fetch('/api/companion/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        responseText = data.message ?? data.response ?? data.content ?? data.reply ?? 'The void stirs. Try again.';
      }

      const aegisMsg = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: responseText };
      setMessages(prev => [...prev, aegisMsg]);

    } catch (err) {
      console.error('[Companion] Send error:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'The void stirs. Try again.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText)
  }

  return (
    <div className="flex flex-col md:flex-row h-full relative -m-4 md:-m-8">
      {/* LEFT PANEL - TERMINAL */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#080808] p-4 md:p-8 h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-[#1A1A1A]">
        
        {/* Top left timestamp */}
        <div className="font-mono text-[11px] text-[#3A3A3A] mb-8 select-none">
          {timeStr}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 pb-4 pr-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-8 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              {msg.role === 'assistant' ? (
                <p
                  className="font-serif text-[20px] italic text-[#E8E6E0] leading-relaxed break-words"
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  {msg.content}
                </p>
              ) : (
                <p
                  className="font-sans text-[13px] text-[#5C5C5C] leading-relaxed inline-block break-words"
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.content}
                </p>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mb-8 text-left">
              <p className="font-serif text-[20px] italic text-[#2A2A2A] animate-pulse">
                The void stirs...
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* RIGHT PANEL - PARCHMENT */}
      <div className="w-full md:w-[35%] bg-[#F5F0E8] flex flex-col p-4 md:p-8 overflow-y-auto h-[50vh] md:h-full">
        
        {/* Right panel header — text only, no avatar */}
        <div className="p-6 border-b border-[#E8E0D0] mb-8">
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A9090] mb-1">
            COMPANION
          </p>
          <h2 className="font-serif text-[32px] font-bold text-[#1A1A1A] leading-none mb-1">
            Aegis
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9A9090]">
            ARCHITECT · LVL 42
          </p>
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
                    disabled={isLoading || !input.trim()}
                    className="font-serif italic text-[18px] text-[#C41E1E] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Transmitting...' : 'Send →'}
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
                    disabled={isLoading}
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
