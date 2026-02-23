'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '../components/providers/SocketProvider'

interface Patient {
  id: string
  formData: Record<string, string>
  status: 'filling' | 'inactive' | 'submitted'
  lastActivity: Date
}

export const useStaffDashboard = () => {
  const { socket, isConnected, emit } = useSocket()
  const [patients, setPatients] = useState<Record<string, Patient>>({} as Record<string, Patient>)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && socket) {
      emit('staff:join', {})

      const handlePatientJoined = (data: { patientId: string; timestamp: string }) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            id: data.patientId,
            formData: {},
            status: 'filling',
            lastActivity: new Date(data.timestamp)
          }
        }))
      }

      const handleFieldUpdated = (data: { patientId: string; field: string; value: any }) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            ...prev[data.patientId],
            formData: {
              ...prev[data.patientId]?.formData,
              [data.field]: data.value
            },
            lastActivity: new Date()
          }
        }))
      }

      const handleStatusUpdated = (data: { patientId: string; status: string }) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            ...prev[data.patientId],
            status: data.status as 'filling' | 'inactive' | 'submitted',
            lastActivity: new Date()
          }
        }))
      }

      const handleFormSubmitted = (data: { patientId: string; formData: Record<string, string> }) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            ...prev[data.patientId],
            formData: data.formData,
            status: 'submitted',
            lastActivity: new Date()
          }
        }))
      }

      const handlePatientLeft = (data: { patientId: string }) => {
        setPatients(prev => {
          const newPatients = { ...prev }
          delete newPatients[data.patientId]
          return newPatients
        })
        
        if (selectedPatient === data.patientId) {
          setSelectedPatient(null)
        }
      }

      socket.on('staff:patient_joined', handlePatientJoined)
      socket.on('staff:field_updated', handleFieldUpdated)
      socket.on('staff:status_updated', handleStatusUpdated)
      socket.on('staff:form_submitted', handleFormSubmitted)
      socket.on('staff:patient_left', handlePatientLeft)

      return () => {
        socket.off('staff:patient_joined', handlePatientJoined)
        socket.off('staff:field_updated', handleFieldUpdated)
        socket.off('staff:status_updated', handleStatusUpdated)
        socket.off('staff:form_submitted', handleFormSubmitted)
        socket.off('staff:patient_left', handlePatientLeft)
      }
    }
  }, [isConnected, socket, emit, selectedPatient])

  return {
    patients: Object.values(patients),
    selectedPatient,
    setSelectedPatient,
    isConnected
  }
}
