'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function useNotifications() {
  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't auto-request, wait for user action
      console.log('Notifications available but not requested yet')
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notificações não são suportadas neste navegador')
      return false
    }

    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      toast.success('Notificações ativadas!')
      return true
    } else {
      toast.error('Permissão de notificações negada')
      return false
    }
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/app-icon.png',
        badge: '/icons/app-icon.png',
        ...options,
      })
    } else if (Notification.permission === 'default') {
      toast.info('Ative as notificações para receber lembretes')
    }
  }

  const scheduleStudyReminder = (hours: number) => {
    const milliseconds = hours * 60 * 60 * 1000
    
    setTimeout(() => {
      sendNotification('Hora de estudar! 📚', {
        body: 'Não deixe sua sequência quebrar. Continue construindo seu prédio da aprovação!',
        tag: 'study-reminder',
        requireInteraction: true,
      })
    }, milliseconds)
  }

  return {
    requestPermission,
    sendNotification,
    scheduleStudyReminder,
    isSupported: 'Notification' in window,
    permission: typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'denied',
  }
}
