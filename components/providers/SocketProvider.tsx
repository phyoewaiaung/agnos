'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  emit: (event: string, data: any) => void
  on: (event: string, callback: (data: any) => void) => void
  off: (event: string, callback: (data: any) => void) => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:3000'

    const newSocket = io(socketUrl, {
      path: '/api/socket',
      transports: ['polling'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error)
      setIsConnected(false)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }, [])

  const off = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }, [])

  const value: SocketContextType = {
    socket,
    isConnected,
    emit,
    on,
    off,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
