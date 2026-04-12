import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client'

export function useSocket(event: string, callback: (data: any) => void) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Only connect if not already connected
    if (!socketRef.current) {
      const isMockMode = import.meta.env.VITE_USE_MOCKS === 'true'
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000', {
        path: '/ws/notifications',
        transports: ['websocket'],
        autoConnect: !isMockMode,
      })
    }
    
    const socket = socketRef.current

    if (socket) {
      socket.on(event, callback)
    }

    return () => {
      if (socket) {
        socket.off(event, callback)
      }
    }
  }, [event, callback])
  
  return socketRef.current
}
