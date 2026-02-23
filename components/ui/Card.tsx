'use client'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddingConfig = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

export const Card = ({ children, className = '', padding = 'md' }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${paddingConfig[padding]} ${className}`}>
    {children}
  </div>
)

interface CardHeaderProps {
  title: string
  subtitle?: string
  gradient?: boolean
  subtitleStyled?: boolean
  badge?: React.ReactNode
}

export const CardHeader = ({ title, subtitle, gradient = false, subtitleStyled = false, badge }: CardHeaderProps) => (
  <div className={`text-white rounded-xl p-4 ${gradient ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-blue-600'}`}>
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      {badge && <div className="ml-2">{badge}</div>}
    </div>
    {subtitle && (
      <p className={`text-blue-100 text-sm ${subtitleStyled ? 'font-mono bg-blue-700/30 px-2 py-1 rounded inline-block' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
)
