'use client'

import { useEffect, useState } from 'react'

export interface ToastItem {
  id: string;
  type: 'xp' | 'building' | 'achievement';
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed top-8 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-[#080808] border-l-2 border-[#C41E1E] py-3 px-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-slide-in-right flex items-center"
          style={{ animation: 'slideInRight 200ms var(--ease-out-expo) both' }}
        >
          <span className="font-mono text-[14px] text-[#C41E1E]">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  )
}

// Global toast manager for simplicity without React Context (in a real app we'd use Sonner or Context)
// We'll export a custom hook instead
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
