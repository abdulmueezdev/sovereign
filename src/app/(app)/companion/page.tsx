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
      requestAnimationFrame(() => {
        setMessages([{ id: 'init', role: 'assistant', content: 'The void stirs. Your kingdom grows stronger with each action. What would you manifest today?' }])
      })
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

  async function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;
    
    setMessages(prev => [...prev, {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    } as any]);
    setInput('');
    setIsLoading(true);
    
    try {
      let reply: string;
      if (IS_DEMO) {
        await new Promise(r => setTimeout(r, 900));
        reply = getDemoCompanionResponse(trimmed);
      } else {
        const res = await fetch('/api/companion/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed }),
        });
        const data = await res.json();
        reply = data.reply ?? data.message ?? data.content ?? 'The void stirs. Try again.';
      }
      
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      } as any]);
    } catch {
      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: 'The void stirs. Try again.',
        timestamp: new Date().toISOString(),
      } as any]);
    } finally {
      setIsLoading(false);
    }
  }

  const formatTime = (iso?: string) => {
    if (!iso) return timeStr;
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText)
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-48px)] -m-4 md:-m-8">
      {/* Left panel — chat */}
      <div className="flex-1 flex flex-col min-h-0 md:w-[60%] bg-[#080808]">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-8 space-y-8">
          {messages.map((msg: any) => (
            msg.role === 'user' ? (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] bg-[#1A1A1A] px-5 py-3 border border-[#2A2A2A]">
                  <p className="font-sans text-[13px] text-[#E8E6E0] leading-relaxed" style={{ wordBreak: 'break-word' }}>
                    {msg.content}
                  </p>
                  <p className="font-mono text-[9px] text-[#3A3A3A] mt-2 text-right tracking-[0.1em]">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[80%]">
                  <p className="font-serif text-[20px] italic text-[#E8E6E0] leading-relaxed" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {msg.content}
                  </p>
                  <p className="font-mono text-[9px] text-[#3A3A3A] mt-2 tracking-[0.1em]">
                    AEGIS · {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            )
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <p className="font-serif text-[20px] italic text-[#2A2A2A] animate-pulse">
                The void stirs...
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1A1A1A] px-6 py-4 bg-[#080808]">
          <div className="md:hidden px-0 py-2 space-y-2 mb-4">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#767676] mb-3">QUICK PROMPTS</p>
            {['Suggest a quest', 'Analyze my week', 'I am struggling'].map(prompt => (
              <button key={prompt} onClick={() => handleSend(prompt)}
                className="block w-full text-left font-sans text-[12px] text-[#767676] hover:text-[#E8E6E0] py-2 border-b border-[#1A1A1A] transition-colors">
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Speak to the void..."
              className="flex-1 bg-transparent border border-[#2A2A2A] px-4 py-3 font-sans text-[13px] text-[#E8E6E0] placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#767676] transition-colors"
              style={{ borderRadius: 0 }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-[#C41E1E] text-white w-10 h-10 flex items-center justify-center hover:bg-[#E8282B] disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-all duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Right panel — Aegis profile */}
      <div className="hidden md:block md:w-[40%] bg-[#F5F0E8] border-l border-[#E0D8CC]">
        <div className="p-6 border-b border-[#E0D8CC]">
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8A7A] mb-1">COMPANION</p>
          <h2 className="font-serif text-[32px] font-bold text-[#1A1A1A] leading-none mb-1">
            Aegis
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9A8A7A]">ARCHITECT · LVL 42</p>
        </div>
        
        <div className="px-6 py-4 space-y-2">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#9A8A7A] mb-3">QUICK PROMPTS</p>
          {['Suggest a quest', 'Analyze my week', 'I am struggling'].map(prompt => (
            <button key={prompt} onClick={() => handleSend(prompt)}
              className="block w-full text-left font-sans text-[12px] text-[#767676] hover:text-[#1A1A1A] py-2 border-b border-[#E0D8CC] transition-colors">
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
