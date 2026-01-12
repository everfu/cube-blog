import { ReactNode } from 'react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'note'
  title?: string
  children: ReactNode
}

const typeStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'i-lucide-info',
    iconColor: 'text-blue-500',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'i-lucide-alert-triangle',
    iconColor: 'text-yellow-500',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'i-lucide-x-circle',
    iconColor: 'text-red-500',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'i-lucide-check-circle',
    iconColor: 'text-green-500',
  },
  note: {
    bg: 'bg-muted/30',
    border: 'border-border',
    icon: 'i-lucide-pencil',
    iconColor: 'text-muted',
  },
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const styles = typeStyles[type] || typeStyles.note

  return (
    <div className={`my-4 p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
      <div className="flex gap-3">
        <span className={`${styles.icon} ${styles.iconColor} text-lg flex-shrink-0 mt-0.5`}></span>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-foreground mb-1">{title}</p>
          )}
          <div className="text-sm text-foreground/80 [&>p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
