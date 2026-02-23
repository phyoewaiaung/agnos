export interface PatientFormData {
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phoneNumber: string
  email: string
  address: string
  preferredLanguage: string
  nationality: string
  emergencyContactName: string
  emergencyContactPhone: string
  religion?: string
}

export type PatientStatus = 'filling' | 'inactive' | 'submitted'

export interface Patient {
  id: string
  status: PatientStatus
  formData: Partial<PatientFormData>
  lastActivity: string
  joinedAt: string
}

export interface SocketEvents {
  // Client to Server
  'patient:join': (patientId: string) => void
  'staff:join': () => void
  'patient:field_update': (data: { patientId: string, field: string, value: any }) => void
  'patient:status_change': (data: { patientId: string, status: PatientStatus }) => void
  'patient:submit': (data: { patientId: string, formData: PatientFormData }) => void

  // Server to Client
  'connected': (data: { patientId?: string, role?: string }) => void
  'staff:field_updated': (data: { patientId: string, field: string, value: any, timestamp: string }) => void
  'staff:status_updated': (data: { patientId: string, status: PatientStatus, timestamp: string }) => void
  'staff:patient_joined': (data: { patientId: string, timestamp: string }) => void
  'staff:form_submitted': (data: { patientId: string, formData: PatientFormData, timestamp: string }) => void
  'staff:patient_left': (data: { patientId: string, timestamp: string }) => void
}

export interface RealtimeUpdate {
  patientId: string
  field: string
  value: any
  timestamp: string
}

export interface StatusUpdate {
  patientId: string
  status: PatientStatus
  timestamp: string
}
