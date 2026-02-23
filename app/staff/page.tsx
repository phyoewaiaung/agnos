'use client'

import { StatusBadge } from '../../components/ui/StatusBadge'
import { Card, CardHeader } from '../../components/ui/Card'
import { useStaffDashboard } from '../../hooks/useStaffDashboard'
import Link from 'next/link'
import { formatDate } from '../../utils/helpers'

export default function StaffDashboard() {
  const { patients, selectedPatient, setSelectedPatient, isConnected } = useStaffDashboard()

  const selectedPatientData = patients.find(p => p.id === selectedPatient)

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat py-4" style={{ backgroundImage: 'url(/common-page-background.webp)' }}>
      <div className="max-w-7xl mx-auto px-4">
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Dashboard</h1>
          <p className="text-base text-slate-600 mb-4">Monitor patient forms in real-time</p>
          
          <div className="flex items-center justify-center">
            <StatusBadge status={isConnected ? 'connected' : 'disconnected'} label={isConnected ? 'Live Connected' : 'Disconnected'} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <CardHeader title="Active Patients" subtitle={`Total: ${patients.length}`} />
              
              <div className="p-4 pt-6">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                {patients.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No active patients</p>
                ) : (
                  patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPatient === patient.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-semibold">{patient.id}</span>
                        <StatusBadge status={patient.status} />
                      </div>
                      <div className="text-sm text-slate-600">
                        {patient.formData.firstName || 'Unknown'} {patient.formData.lastName || ''}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Last active: {formatDate(patient.lastActivity)}
                      </div>
                    </div>
                  ))
                )}
              </div>
              </div>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatientData ? (
              <Card>
                <CardHeader 
                  title={`Patient ${selectedPatientData.id}`}
                  subtitle={`Status: ${selectedPatientData.status}`}
                />
                
                <div className="p-4 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">First Name</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Last Name</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.lastName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Date of Birth</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.dateOfBirth || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Gender</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.gender || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Email</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.email || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-600">Address</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Preferred Language</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.preferredLanguage || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Nationality</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.nationality || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-600">Religion</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.religion || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Emergency Contact</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Contact Name</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.emergencyContactName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Contact Phone</label>
                        <p className="text-sm text-slate-900">{selectedPatientData.formData.emergencyContactPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-slate-600">Joined:</span>
                        <span className="ml-2 text-slate-900">{formatDate(selectedPatientData.lastActivity)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-slate-600">Last Activity:</span>
                        <span className="ml-2 text-slate-900">{formatDate(selectedPatientData.lastActivity)}</span>
                      </div>
                      {selectedPatientData.status === 'submitted' && (
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-slate-600">Form Submitted:</span>
                          <span className="ml-2 text-slate-900">{formatDate(selectedPatientData.lastActivity)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Patient</h3>
                  <p className="text-slate-500">Choose a patient from the list to view their details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
