'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { FormField } from '../../components/forms/FormField'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { usePatientForm } from '../../hooks/usePatientForm'
import { useSocket } from '../../components/providers/SocketProvider'
import { PatientFormData } from '../../lib/types'

const formSections = [
  {
    title: 'Personal Information',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] }
    ]
  },
  {
    title: 'Contact Information',
    fields: [
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'address', label: 'Address', type: 'text' }
    ]
  },
  {
    title: 'Additional Information',
    fields: [
      { name: 'preferredLanguage', label: 'Preferred Language', type: 'text' },
      { name: 'nationality', label: 'Nationality', type: 'text' },
      { name: 'religion', label: 'Religion', type: 'text', required: false }
    ]
  },
  {
    title: 'Emergency Contact',
    fields: [
      { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text' },
      { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'tel' }
    ]
  }
]

export default function PatientForm() {
  const { patientId, status, formData, errors, handleInputChange, handleSubmit, setStatus } = usePatientForm()
  const { socket, emit } = useSocket()

  // Track inactivity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      setStatus('filling')
      if (socket?.connected) {
        emit('patient:status_change', { patientId, status: 'filling' })
      }
      
      inactivityTimer = setTimeout(() => {
        setStatus('inactive')
        if (socket?.connected) {
          emit('patient:status_change', { patientId, status: 'inactive' })
        }
      }, 3000)
    }

    const handleActivity = () => {
      resetTimer()
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keypress', handleActivity)
    resetTimer()

    return () => {
      clearTimeout(inactivityTimer)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keypress', handleActivity)
    }
  }, [setStatus, socket, emit, patientId])

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat py-4" style={{ backgroundImage: 'url(/common-page-background.webp)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <img src="/agnos-fav.ico" alt="Agnos" className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Information Form</h1>
          <p className="text-base text-slate-600 mb-2">Please fill in your details completely</p>
        </div>
        {/* <StatusBadge status={status} /> */}

        <Card>
          <CardHeader 
            title={`Patient ID: ${patientId}`} 
            subtitle="Your information is being transmitted in real-time to our staff" 
            badge={<StatusBadge status={status} />}
          />
          
          <form onSubmit={handleSubmit} className="p-4">
            {formSections.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? 'border-t border-gray-200 pt-4 mb-6' : 'mb-6'}>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{section.title}</h3>
                <div className="space-y-4">
                  {sectionIndex === 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <FormField
                          key={field.name}
                          label={field.label}
                          field={field.name}
                          type={field.type as any}
                          options={'options' in field ? field.options : undefined}
                          value={formData[field.name] || ''}
                          onChange={(value) => handleInputChange(field.name, value)}
                          error={errors[field.name]}
                          required={'required' in field ? field.required !== false : true}
                        />
                      ))}
                    </div>
                  ) : sectionIndex === 2 ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        {section.fields.slice(0, 2).map((field) => (
                          <FormField
                            key={field.name}
                            label={field.label}
                            field={field.name}
                            type={field.type as any}
                            value={formData[field.name] || ''}
                            onChange={(value) => handleInputChange(field.name, value)}
                            error={errors[field.name]}
                            required={'required' in field ? field.required !== false : true}
                          />
                        ))}
                      </div>
                      <FormField
                        label={section.fields[2].label}
                        field={section.fields[2].name}
                        type={section.fields[2].type as any}
                        value={formData[section.fields[2].name] || ''}
                        onChange={(value) => handleInputChange(section.fields[2].name, value)}
                        error={errors[section.fields[2].name]}
                        required={'required' in section.fields[2] ? section.fields[2].required !== false : true}
                      />
                    </>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <FormField
                          key={field.name}
                          label={field.label}
                          field={field.name}
                          type={field.type as any}
                          value={formData[field.name] || ''}
                          onChange={(value) => handleInputChange(field.name, value)}
                          error={errors[field.name]}
                          required={'required' in field ? field.required !== false : true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-4">
              <Button type="submit" disabled={status === 'submitted'}>
                {status === 'submitted' ? 'Form Submitted ✓' : 'Submit Form'}
              </Button>
            </div>
          </form>
        </Card>

        </div>
    </div>
  )
}
