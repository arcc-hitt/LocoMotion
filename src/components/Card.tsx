import type { FC, ReactNode } from 'react'
import { memo } from 'react'

interface CardProps {
  title?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

// Card style variants
const CARD_VARIANTS = {
  default: 'bg-gray-50 border border-gray-200 shadow-sm',
  elevated: 'bg-white border border-gray-200 shadow-md',
  outlined: 'bg-transparent border-2 border-gray-200',
} as const

// Card size variants
const CARD_SIZES = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const

const Card: FC<CardProps> = memo(({ 
  title, 
  icon, 
  children, 
  className = '',
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200'
  const variantClasses = CARD_VARIANTS[variant]
  const sizeClasses = CARD_SIZES[size]
  const interactiveClasses = onClick && !disabled 
    ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' 
    : ''
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${interactiveClasses} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          {icon}
          {title && <span className="font-medium text-sm">{title}</span>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
})

Card.displayName = 'Card'

export default Card 