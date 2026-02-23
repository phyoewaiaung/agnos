'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../components/providers/SocketProvider'
import { PatientFormData, PatientStatus } from '../../lib/types'

// Enhanced FormField with better UI/UX
const FormField = ({ label, field, type = 'text', required = true, options, value, onChange, error }: {
  label: string
  field: keyof PatientFormData
  type?: string
  required?: boolean
  options?: string[]
  value: string
  onChange: (value: string) => void
  error?: string
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        />
      )}
      {value && !error && (
        <div className="absolute right-3 top-3.5">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      )}
    </div>
    {error && (
      <div className="mt-2 flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-white text-xs">!</span>
        </span>
        {error}
      </div>
    )}
  </div>
)

const PatientForm = () => {
  const { socket, isConnected, emit, on } = useSocket()
  const [patientId] = useState(() => `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [status, setStatus] = useState<PatientStatus>('filling')
  const [formData, setFormData] = useState<Partial<PatientFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Join patient room on component mount
  useEffect(() => {
    if (isConnected && socket) {
      emit('patient:join', patientId)
      
      // Set initial status
      emit('patient:status_change', { patientId, status: 'filling' })
      
      return () => {
        emit('patient:status_change', { patientId, status: 'inactive' })
      }
    }
  }, [isConnected, patientId])

  // Track inactivity and typing status
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    let typingTimer: NodeJS.Timeout
    let isTyping = false

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      clearTimeout(typingTimer)
      
      if (!isTyping) {
        setStatus('filling')
        emit('patient:status_change', { patientId, status: 'filling' })
      }
      
      inactivityTimer = setTimeout(() => {
        setStatus('inactive')
        emit('patient:status_change', { patientId, status: 'inactive' })
        isTyping = false
      }, 3000)
    }

    const handleTyping = () => {
      if (!isTyping) {
        isTyping = true
        setStatus('filling')
        emit('patient:status_change', { patientId, status: 'filling' })
      }
      
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
        isTyping = false
      }, 1000)
    }

    const handleInput = (e: Event) => {
      handleTyping()
    }

    const form = document.querySelector('form')
    if (form) {
      form.addEventListener('input', handleInput)
    }
    
    window.addEventListener('mousemove', resetTimer)
    resetTimer()

    return () => {
      clearTimeout(inactivityTimer)
      clearTimeout(typingTimer)
      window.removeEventListener('mousemove', resetTimer)
      if (form) {
        form.removeEventListener('input', handleInput)
      }
    }
  }, [patientId])

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
    [patientId]
  )

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
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

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.dateOfBirth?.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }
    if (!formData.gender?.trim()) {
      newErrors.gender = 'Gender is required'
    }
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.preferredLanguage?.trim()) {
      newErrors.preferredLanguage = 'Preferred language is required'
    }
    if (!formData.nationality?.trim()) {
      newErrors.nationality = 'Nationality is required'
    }
    if (!formData.emergencyContactName?.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required'
    }
    if (!formData.emergencyContactPhone?.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

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
    emit('patient:submit', { patientId, formData: formData as PatientFormData })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Patient Information Form</h1>
          <p className="text-lg text-gray-600 mb-6">Please fill in your details completely</p>
          
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              status === 'filling' ? 'bg-green-100 text-green-800 border border-green-200' :
              status === 'inactive' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                status === 'filling' ? 'bg-green-500 animate-pulse' :
                status === 'inactive' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></span>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isConnected ? 'Live Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
            <p className="text-blue-100">All fields marked with * are required</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  field="firstName"
                  value={formData.firstName || ''}
                  onChange={(value) => handleInputChange('firstName', value)}
                  error={errors.firstName}
                />
                
                <FormField
                  label="Last Name"
                  field="lastName"
                  value={formData.lastName || ''}
                  onChange={(value) => handleInputChange('lastName', value)}
                  error={errors.lastName}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  label="Date of Birth"
                  field="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(value) => handleInputChange('dateOfBirth', value)}
                  error={errors.dateOfBirth}
                />
                
                <FormField
                  label="Gender"
                  field="gender"
                  type="select"
                  options={['Male', 'Female', 'Other']}
                  value={formData.gender || ''}
                  onChange={(value) => handleInputChange('gender', value)}
                  error={errors.gender}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    label="Phone Number"
                    field="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                    error={errors.phoneNumber}
                  />
                  
                  <FormField
                    label="Email"
                    field="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(value) => handleInputChange('email', value)}
                    error={errors.email}
                  />
                </div>
                
                <FormField
                  label="Address"
                  field="address"
                  value={formData.address || ''}
                  onChange={(value) => handleInputChange('address', value)}
                  error={errors.address}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  label="Preferred Language"
                  field="preferredLanguage"
                  value={formData.preferredLanguage || ''}
                  onChange={(value) => handleInputChange('preferredLanguage', value)}
                  error={errors.preferredLanguage}
                />
                
                <FormField
                  label="Nationality"
                  field="nationality"
                  value={formData.nationality || ''}
                  onChange={(value) => handleInputChange('nationality', value)}
                  error={errors.nationality}
                />
              </div>
              
              <FormField
                label="Religion"
                field="religion"
                required={false}
                value={formData.religion || ''}
                onChange={(value) => handleInputChange('religion', value)}
                error={errors.religion}
              />
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  label="Emergency Contact Name"
                  field="emergencyContactName"
                  value={formData.emergencyContactName || ''}
                  onChange={(value) => handleInputChange('emergencyContactName', value)}
                  error={errors.emergencyContactName}
                />
                
                <FormField
                  label="Emergency Contact Phone"
                  field="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(value) => handleInputChange('emergencyContactPhone', value)}
                  error={errors.emergencyContactPhone}
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={status === 'submitted'}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  status === 'submitted'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {status === 'submitted' ? 'Form Submitted ✓' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Your information is being transmitted in real-time to our staff</p>
          <p className="mt-1">Patient ID: {patientId}</p>
        </div>
      </div>
    </div>
  )
}

export default PatientForm
