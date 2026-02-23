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

  // Initialize Socket.IO - simplified approach
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  })

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Patient joins their personal room
    socket.on('patient:join', (patientId) => {
      socket.join(`patient:${patientId}`)
      socket.to('staff').emit('staff:patient_joined', {
        patientId,
        timestamp: new Date().toISOString()
      })
      console.log(`Patient ${patientId} joined room`)
    })

    // Patient field updates
    socket.on('patient:field_update', (data) => {
      socket.to('staff').emit('staff:field_updated', {
        ...data,
        timestamp: new Date().toISOString()
      })
      console.log('Field update:', data.field, '=', data.value)
    })

    // Patient status changes
    socket.on('patient:status_change', (data) => {
      socket.to('staff').emit('staff:status_updated', {
        ...data,
        timestamp: new Date().toISOString()
      })
      console.log('Status change:', data.status)
    })

    // Patient submits form
    socket.on('patient:submit', (data) => {
      socket.to('staff').emit('staff:form_submitted', {
        ...data,
        timestamp: new Date().toISOString()
      })
      console.log('Form submitted by patient:', data.patientId)
    })

    // Staff joins monitoring room
    socket.on('staff:join', () => {
      socket.join('staff')
      console.log('Staff member joined monitoring room')
    })

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, reason)
      socket.to('staff').emit('staff:patient_left', {
        patientId: socket.id,
        timestamp: new Date().toISOString()
      })
    })
  })

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
