import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'

const badgeVariants: Record<BadgeVariant, string> = {
  default:  'bg-neutral-100 text-neutral-700 border-neutral-200',
  success:  'bg-success-50 text-success-700 border-green-200',
  warning:  'bg-warning-50 text-warning-700 border-amber-200',
  danger:   'bg-danger-50 text-danger-700 border-red-200',
  info:     'bg-info-50 text-info-700 border-blue-200',
  outline:  'bg-transparent text-neutral-700 border-neutral-300',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
      badgeVariants[variant],
      className
    )}>
      {children}
    </span>
  )
}
