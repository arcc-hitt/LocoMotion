import type { FC, ReactNode } from 'react'

interface CardProps {
  title?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const Card: FC<CardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm ${className}`}>
    {(title || icon) && (
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        {icon}
        {title && <span className="font-medium text-sm">{title}</span>}
      </div>
    )}
    <div>{children}</div>
  </div>
)

export default Card 