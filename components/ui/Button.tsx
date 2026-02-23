'use client'

interface ButtonProps {
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

const sizeConfig = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

const variantConfig = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
  secondary: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
}

export const Button = ({
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  children,
  onClick
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
      disabled 
        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
        : variantConfig[variant]
    } ${sizeConfig[size]}`}
  >
    {children}
  </button>
)
