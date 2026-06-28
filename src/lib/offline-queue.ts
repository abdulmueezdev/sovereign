const QUEUE_KEY = 'sovereign_offline_queue';

export interface QueuedAction {
  id: string;
  type: 'complete_quest' | 'manifest_building' | 'send_message' | 'update_profile';
  payload: unknown;
  timestamp: string;
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function queueAction(action: Omit<QueuedAction, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const queue = getQueue();
  const newAction: QueuedAction = {
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  queue.push(newAction);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueue(): QueuedAction[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearQueue(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUEUE_KEY);
}

export function processQueue(): Promise<void> {
  return new Promise((resolve) => {
    const queue = getQueue();
    if (queue.length === 0) {
      resolve();
      return;
    }
    
    // In demo mode, just clear. In real mode, send each to API.
    clearQueue();
    resolve();
  });
}
