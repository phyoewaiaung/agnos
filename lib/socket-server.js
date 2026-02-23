const { Server } = require('socket.io')

let io = null

const initializeSocket = (server) => {
  if (io) {
    console.log('Socket.IO already initialized')
    return io
  }

  io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"]
    },
    pingTimeout: 30000,
    pingInterval: 25000,
    transports: ['polling'], // Use only polling for now
    allowEIO3: true
  })

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Patient joins their personal room
    socket.on('patient:join', (patientId) => {
      socket.join(`patient:${patientId}`)
      socket.emit('connected', { patientId })
      console.log(`Patient ${patientId} joined room`)
      
      // Notify staff that patient joined
      socket.to('staff').emit('staff:patient_joined', {
        patientId,
        timestamp: new Date().toISOString()
      })
    })

    // Staff joins to monitor patients
    socket.on('staff:join', () => {
      socket.join('staff')
      socket.emit('connected', { role: 'staff' })
      console.log('Staff member joined monitoring room')
    })

    // Patient updates a form field
    socket.on('patient:field_update', (data) => {
      console.log('Field update:', data)
      socket.to(`patient:${data.patientId}`).to('staff').emit('staff:field_updated', {
        patientId: data.patientId,
        field: data.field,
        value: data.value,
        timestamp: new Date().toISOString()
      })
    })

    // Patient status changes
    socket.on('patient:status_change', (data) => {
      console.log('Status change:', data)
      socket.to('staff').emit('staff:status_updated', {
        patientId: data.patientId,
        status: data.status,
        timestamp: new Date().toISOString()
      })
    })

    // Patient submits form
    socket.on('patient:submit', (data) => {
      console.log('Form submitted:', data.patientId)
      socket.to('staff').emit('staff:form_submitted', {
        patientId: data.patientId,
        formData: data.formData,
        timestamp: new Date().toISOString()
      })
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, reason)
      socket.to('staff').emit('staff:patient_left', {
        patientId: socket.id,
        timestamp: new Date().toISOString()
      })
    })
  })

  console.log('Socket.IO server initialized')
  return io
}

const getSocketServer = () => {
  return io
}

module.exports = {
  initializeSocket,
  getSocketServer
}
