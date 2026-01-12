import { WatchedCard } from '@/components/ui'
import { SectionDivider } from '@/components/common'
import { watchedItems } from '@/data/watched'

export default function RecentlyWatchedSection() {
  return (
    <section>
      <h2 className="section-title">
        03 / <span className="text-foreground">RECENTLY WATCHED</span>
      </h2>
      <SectionDivider />
      
      <div className="grid md:grid-cols-2 gap-4 mx-4 md:mx-8 my-8">
        {watchedItems.map((item, index) => (
          <WatchedCard key={index} item={item} />
        ))}
      </div>
    </section>
  )
}
