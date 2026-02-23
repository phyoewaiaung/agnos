import { NextRequest } from 'next/server'
import { getSocketServer } from '../../../lib/socket-server.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SocketHandler = (req: NextRequest) => {
  const io = getSocketServer()
  
  if (io) {
    console.log('Socket.IO server is running')
    return Response.json({ success: true, message: 'Socket.IO server is running' })
  } else {
    console.log('Socket.IO server not initialized')
    return Response.json({ success: false, message: 'Socket.IO server not initialized' }, { status: 500 })
  }
}

export { SocketHandler as GET, SocketHandler as POST }