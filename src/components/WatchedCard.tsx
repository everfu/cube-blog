import { WatchedItem } from '@/data/watched'

interface WatchedCardProps {
  item: WatchedItem
}

export default function WatchedCard({ item }: WatchedCardProps) {
  // 生成星星评分
  const fullStars = Math.floor(item.rating / 2)
  const hasHalfStar = item.rating % 2 >= 1
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="bg-card border border-border hover:border-primary transition-all duration-200 group overflow-hidden">
      {/* 移动端：背景图片布局 */}
      <div 
        className="md:hidden relative min-h-[200px] p-4 flex flex-col justify-end"
        style={{
          backgroundImage: item.image ? `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%), url(${item.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: item.image ? 'transparent' : 'var(--color-muted)'
        }}
      >
        {!item.image && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="i-lucide-film text-4xl opacity-20 text-muted"></span>
          </div>
        )}
        
        <div className="relative z-10 text-white">
          <h3 className="text-base font-medium mb-2 group-hover:opacity-70 transition-opacity">
            {item.title}
          </h3>

          {/* 评分 */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="i-lucide-star text-yellow-500 text-sm" style={{ fill: 'currentColor' }}></span>
              ))}
              {hasHalfStar && (
                <span className="i-lucide-star-half text-yellow-500 text-sm" style={{ fill: 'currentColor' }}></span>
              )}
              {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="i-lucide-star text-gray-400 text-sm opacity-50"></span>
              ))}
            </div>
            <span className="text-sm text-gray-300">{item.rating}</span>
          </div>

          {/* 详细信息 */}
          <p className="text-xs text-gray-300 leading-relaxed mb-1">
            {item.year} / {item.country} / {item.genre} / {item.director}
          </p>

          {/* 观看日期 */}
          <div className="text-xs text-gray-400">
            {item.date}
          </div>
        </div>
      </div>

      {/* 桌面端：横向布局 */}
      <div className="hidden md:flex gap-4 p-4">
        {/* 海报图片 */}
        <div className="w-24 h-36 bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <span className="i-lucide-film text-3xl opacity-20 text-muted"></span>
          )}
        </div>

        {/* 信息部分 */}
        <div className="flex-1 flex flex-col justify-between text-foreground">
          {/* 标题 */}
          <div>
            <h3 className="text-base font-medium mb-2 group-hover:opacity-70 transition-opacity">
              {item.title}
            </h3>

            {/* 评分 */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                  <span key={`full-${i}`} className="i-lucide-star text-yellow-500 text-sm" style={{ fill: 'currentColor' }}></span>
                ))}
                {hasHalfStar && (
                  <span className="i-lucide-star-half text-yellow-500 text-sm" style={{ fill: 'currentColor' }}></span>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                  <span key={`empty-${i}`} className="i-lucide-star text-muted text-sm opacity-30"></span>
                ))}
              </div>
              <span className="text-sm text-muted">{item.rating}</span>
            </div>

            {/* 详细信息 */}
            <p className="text-xs text-muted leading-relaxed">
              {item.year} / {item.country} / {item.genre} / {item.director}
            </p>
          </div>

          {/* 观看日期 */}
          <div className="text-xs text-muted opacity-70 mt-2">
            {item.date}
          </div>
        </div>
      </div>
    </div>
  )
}
