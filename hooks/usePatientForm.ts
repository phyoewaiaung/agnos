'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../components/providers/SocketProvider'

export const usePatientForm = () => {
  const { socket, isConnected, emit } = useSocket()
  const [patientId] = useState(() => {
    // Generate a shorter, user-friendly patient ID
    const timestamp = Date.now().toString(36).slice(-4).toUpperCase()
    const random = Math.random().toString(36).slice(-3).toUpperCase()
    return `P-${timestamp}${random}`
  })
  const [status, setStatus] = useState<'filling' | 'inactive' | 'submitted'>('filling')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Join patient room on component mount
  useEffect(() => {
    if (isConnected && socket) {
      emit('patient:join', { patientId, status: 'filling' })
      emit('patient:status_change', { patientId, status: 'filling' })
      
      return () => {
        emit('patient:status_change', { patientId, status: 'inactive' })
      }
    }
  }, [isConnected, patientId, emit])

  // Debounced field update
  const debouncedEmit = useCallback(
    (() => {
      const timers: Record<string, NodeJS.Timeout> = {}
      
      return (field: string, value: any) => {
        const timerKey = `field_${field}`
        if (timers[timerKey]) {
          clearTimeout(timers[timerKey])
        }
        
        timers[timerKey] = setTimeout(() => {
          emit('patient:field_update', { patientId, field, value })
        }, 50)
      }
    })(),
    [patientId, emit]
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (debouncedEmit) {
      debouncedEmit(field, value)
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'gender',
      'phoneNumber', 'email', 'address', 'preferredLanguage',
      'nationality', 'emergencyContactName', 'emergencyContactPhone'
    ]

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`
      }
    })

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setStatus('submitted')
    emit('patient:status_change', { patientId, status: 'submitted' })
    emit('patient:submit', { patientId, formData })
  }

  return {
    patientId,
    status,
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    setStatus
  }
}
