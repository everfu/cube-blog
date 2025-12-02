import Link from 'next/link'
import { SoftwareItem } from '@/data/software'

interface SoftwareCardProps {
  item: SoftwareItem
}

export default function SoftwareCard({ item }: SoftwareCardProps) {
  const content = (
    <div className="flex items-start gap-3 p-3 bg-card border border-border hover:border-primary transition-all duration-200 group">
      {/* 图标/图片 */}
      <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0">
        {item.icon ? (
          <span className={`${item.icon} text-xl`}></span>
        ) : item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
        ) : (
          <span className="i-lucide-package text-xl opacity-20 text-muted"></span>
        )}
      </div>
      
      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium mb-0.5 group-hover:opacity-70 transition-opacity flex items-center gap-2">
          {item.name}
          {item.recommended && (
            <span className="text-xs px-1.5 py-0.5 text-red-500 font-medium">
              推荐
            </span>
          )}
        </h4>
        <p className="text-xs text-muted leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  )

  if (item.url) {
    return (
      <Link 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </Link>
    )
  }

  return content
}

