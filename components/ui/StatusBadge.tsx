'use client'

interface StatusBadgeProps {
  status: 'filling' | 'inactive' | 'submitted' | 'connected' | 'disconnected'
  label?: string
}

const statusConfig = {
  filling: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    animate: true
  },
  inactive: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    animate: false
  },
  submitted: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    animate: false
  },
  connected: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    animate: true
  },
  disconnected: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    animate: false
  }
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.disconnected
  const displayLabel = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown')

  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot} ${config.animate ? 'animate-pulse' : ''}`}></span>
      {displayLabel}
    </div>
  )
}
