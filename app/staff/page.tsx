'use client'

import { useState, useEffect } from 'react'
import { useSocket } from '../../components/providers/SocketProvider'
import { Patient, PatientFormData, PatientStatus, RealtimeUpdate, StatusUpdate } from '../../lib/types'

const StaffDashboard = () => {
  const { socket, isConnected, emit, on, off } = useSocket()
  const [patients, setPatients] = useState<Record<string, Patient>>({})
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  // Join staff room on component mount
  useEffect(() => {
    if (isConnected && socket) {
      emit('staff:join', null)
      
      // Listen for real-time updates
      const handleFieldUpdate = (data: RealtimeUpdate) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            ...prev[data.patientId],
            id: data.patientId,
            formData: {
              ...prev[data.patientId]?.formData,
              [data.field]: data.value
            },
            lastActivity: data.timestamp
          }
        }))
      }

      const handleStatusUpdate = (data: StatusUpdate) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            ...prev[data.patientId],
            id: data.patientId,
            status: data.status,
            lastActivity: data.timestamp
          }
        }))
      }

      const handlePatientJoined = (data: { patientId: string, timestamp: string }) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            id: data.patientId,
            status: 'filling',
            formData: {},
            lastActivity: data.timestamp,
            joinedAt: data.timestamp
          }
        }))
      }

      const handleFormSubmitted = (data: { patientId: string, formData: PatientFormData, timestamp: string }) => {
        setPatients(prev => ({
          ...prev,
          [data.patientId]: {
            ...prev[data.patientId],
            id: data.patientId,
            status: 'submitted',
            formData: data.formData,
            lastActivity: data.timestamp
          }
        }))
      }

      const handlePatientLeft = (data: { patientId: string, timestamp: string }) => {
        setPatients(prev => {
          const updated = { ...prev }
          if (updated[data.patientId]) {
            updated[data.patientId] = {
              ...updated[data.patientId],
              status: 'inactive',
              lastActivity: data.timestamp
            }
          }
          return updated
        })
      }

      // Register event listeners
      on('staff:field_updated', handleFieldUpdate)
      on('staff:status_updated', handleStatusUpdate)
      on('staff:patient_joined', handlePatientJoined)
      on('staff:form_submitted', handleFormSubmitted)
      on('staff:patient_left', handlePatientLeft)

      // Cleanup
      return () => {
        off('staff:field_updated', handleFieldUpdate)
        off('staff:status_updated', handleStatusUpdate)
        off('staff:patient_joined', handlePatientJoined)
        off('staff:form_submitted', handleFormSubmitted)
        off('staff:patient_left', handlePatientLeft)
      }
    }
  }, [isConnected, on, off]) // Remove socket and emit from dependencies

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case 'filling':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: PatientStatus) => {
    switch (status) {
      case 'filling':
        return 'Actively Filling'
      case 'inactive':
        return 'Inactive'
      case 'submitted':
        return 'Submitted'
      default:
        return 'Unknown'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        selectedPatient === patient.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedPatient(patient.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {patient.formData?.firstName || 'Unknown'} {patient.formData?.lastName || ''}
          </h3>
          <p className="text-sm text-gray-600">ID: {patient.id}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
          {getStatusText(patient.status)}
        </span>
      </div>
      
      <div className="text-sm text-gray-500">
        Last activity: {formatTimestamp(patient.lastActivity)}
      </div>

      {patient.formData?.email && (
        <div className="text-sm text-gray-600 mt-1">
          Email: {patient.formData.email}
        </div>
      )}
    </div>
  )

  const PatientDetailView = ({ patient }: { patient: Patient }) => {
    const fieldLabels: Record<keyof PatientFormData, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      middleName: 'Middle Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      phoneNumber: 'Phone Number',
      email: 'Email',
      address: 'Address',
      preferredLanguage: 'Preferred Language',
      nationality: 'Nationality',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
      religion: 'Religion'
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Patient Details - {patient.formData?.firstName || 'Unknown'} {patient.formData?.lastName || 'Unknown'}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
            {getStatusText(patient.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">First Name:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.firstName || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Middle Name:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.middleName || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Name:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.lastName || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date of Birth:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.dateOfBirth || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Gender:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.gender || '-'}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Phone Number:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.phoneNumber || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.email || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.address || '-'}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Preferred Language:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.preferredLanguage || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Nationality:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.nationality || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Religion:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.religion || '-'}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Emergency Contact</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Contact Name:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.emergencyContactName || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Contact Phone:</span>
                <span className="ml-2 text-gray-900">{patient.formData?.emergencyContactPhone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div>Patient ID: {patient.id}</div>
            <div>Joined: {formatTimestamp(patient.joinedAt || patient.lastActivity)}</div>
            <div>Last Activity: {formatTimestamp(patient.lastActivity)}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Staff Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">Monitor patient form progress in real-time</p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isConnected ? 'Live Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <h2 className="text-2xl font-semibold mb-2">Active Patients</h2>
                <p className="text-green-100">Patients currently filling forms</p>
              </div>
              
              <div className="p-6">
                {Object.values(patients).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-gray-500">No active patients</p>
                    <p className="text-sm text-gray-400 mt-1">Waiting for patients to join...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.values(patients).map(patient => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              (() => {
                const patient = patients[selectedPatient]
                return patient ? (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-semibold mb-2">Patient Details</h2>
                          <p className="text-blue-100">Real-time form information</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          patient.status === 'filling' ? 'bg-green-100 text-green-800' :
                          patient.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <PatientDetailView patient={patient} />
                    </div>
                  </div>
                ) : null
              })()
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white p-6">
                  <h2 className="text-2xl font-semibold mb-2">Select a Patient</h2>
                  <p className="text-gray-200">Choose a patient from the list to view details</p>
                </div>
                
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patient Selected</h3>
                  <p className="text-gray-500">Select a patient from the Active Patients list to view their form details in real-time.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{Object.values(patients).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">✏️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Currently Filling</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(patients).filter(p => p.status === 'filling').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(patients).filter(p => p.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StaffPage() {
  return <StaffDashboard />
}
