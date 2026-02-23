const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Create the Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Room management
const rooms = {
  staff: new Set(),
  patients: new Map()
}

// Utility functions
const logEvent = (event, data) => {
  if (dev) {
    console.log(`[${new Date().toISOString()}] ${event}:`, data)
  }
}

const broadcastToStaff = (io, event, data) => {
  io.to('staff').emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  })
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  })

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    logEvent('Client connected', { id: socket.id })

    // Patient joins their personal room
    socket.on('patient:join', (data) => {
      const { patientId, status = 'filling' } = data
      socket.join(`patient:${patientId}`)
      rooms.patients.set(patientId, { socketId: socket.id, joinedAt: new Date() })
      
      broadcastToStaff(io, 'staff:patient_joined', { patientId, status })
      logEvent('Patient joined', { patientId, status, socketId: socket.id })
    })

    // Patient field updates (debounced by client)
    socket.on('patient:field_update', (data) => {
      broadcastToStaff(io, 'staff:field_updated', data)
      logEvent('Field update', { field: data.field, patientId: data.patientId })
    })

    // Patient status changes
    socket.on('patient:status_change', (data) => {
      broadcastToStaff(io, 'staff:status_updated', data)
      logEvent('Status change', { status: data.status, patientId: data.patientId })
    })

    // Patient submits form
    socket.on('patient:submit', (data) => {
      broadcastToStaff(io, 'staff:form_submitted', data)
      logEvent('Form submitted', { patientId: data.patientId })
    })

    // Staff joins monitoring room
    socket.on('staff:join', () => {
      socket.join('staff')
      rooms.staff.add(socket.id)
      logEvent('Staff joined', { socketId: socket.id, totalStaff: rooms.staff.size })
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logEvent('Client disconnected', { id: socket.id, reason })
      
      // Find and remove patient from tracking
      for (const [patientId, patientData] of rooms.patients.entries()) {
        if (patientData.socketId === socket.id) {
          rooms.patients.delete(patientId)
          broadcastToStaff(io, 'staff:patient_left', { patientId })
          logEvent('Patient left', { patientId })
          break
        }
      }
      
      // Remove staff from tracking
      rooms.staff.delete(socket.id)
    })

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  // Server statistics
  setInterval(() => {
    if (dev) {
      console.log(`Stats: ${io.engine.clientsCount} clients, ${rooms.staff.size} staff, ${rooms.patients.size} patients`)
    }
  }, 30000) // Log every 30 seconds in development

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> Socket.IO server running on port ${port}`)
  })
})
