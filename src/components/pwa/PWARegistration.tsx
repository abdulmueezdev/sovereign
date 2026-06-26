'use client'

import { useEffect, useState } from 'react'

export function PWARegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (err) {
          console.error('[App] SW registration failed:', err)
        }
      })
    }

    // 2. Handle Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', () => {
      setShowInstall(false)
    })

    // 3. Online/Offline Status Tracking
    setIsOffline(!navigator.onLine)
    const handleOnline = () => {
      setIsOffline(false)
      syncOfflineQueue()
    }
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    setDeferredPrompt(null)
  }

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 h-8 bg-[#C41E1E] text-white flex items-center justify-center font-mono text-[10px] tracking-widest uppercase z-[100]">
          THE VOID IS SILENT (OFFLINE)
        </div>
      )}
      {showInstall && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
          <button 
            onClick={handleInstallClick}
            className="bg-[#E8E6E0] text-[#080808] px-4 py-2 font-mono text-xs tracking-widest uppercase shadow-lg shadow-black/50 hover:bg-[#C41E1E] hover:text-white transition-colors"
          >
            Install App
          </button>
        </div>
      )}
    </>
  )
}

// Background sync function
async function syncOfflineQueue() {
  const queueJson = localStorage.getItem('offlineQuestQueue')
  if (!queueJson) return

  try {
    const queue: any[] = JSON.parse(queueJson)
    if (queue.length === 0) return

    const remainingQueue = []
    
    for (const item of queue) {
      try {
        const res = await fetch(`/api/quests/${item.questId}/objective`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ objectiveId: item.objectiveId, checked: item.checked })
        })
        
        if (!res.ok) {
          throw new Error('Sync failed for item')
        }
      } catch (err) {
        remainingQueue.push(item) // Keep in queue to retry later
      }
    }

    localStorage.setItem('offlineQuestQueue', JSON.stringify(remainingQueue))
  } catch (err) {
    console.error('Failed to parse offline queue', err)
  }
}
