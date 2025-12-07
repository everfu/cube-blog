import { SectionDivider } from '@/components/common'

interface RoadmapItem {
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned'
  date?: string
}

const roadmapItems: RoadmapItem[] = [
  {
    title: '博客基础框架',
    description: '使用 Next.js 15 + React 19 搭建博客基础框架，支持 MDX 文章渲染',
    status: 'completed',
    date: '2024-12',
  },
  {
    title: '深色/浅色主题',
    description: '支持系统主题跟随和手动切换',
    status: 'completed',
    date: '2024-12',
  },
  {
    title: 'Stack 页面',
    description: '展示硬件设备和软件工具',
    status: 'completed',
    date: '2024-12',
  },
  {
    title: '相册功能',
    description: '支持相册分类、年份筛选和 Lightbox 预览',
    status: 'completed',
    date: '2024-12',
  },
  {
    title: '观影记录',
    description: '展示最近观看的电影和电视剧',
    status: 'completed',
    date: '2024-12',
  },
  {
    title: 'RSS 订阅',
    description: '支持 Atom 格式的 RSS 订阅',
    status: 'in-progress',
  },
  {
    title: '文章搜索',
    description: '支持全文搜索功能',
    status: 'planned',
  },
  {
    title: '评论系统',
    description: '集成 Giscus 评论系统',
    status: 'planned',
  },
  {
    title: '文章目录',
    description: '文章页面显示目录导航',
    status: 'planned',
  },
]

const statusConfig = {
  completed: {
    label: '已完成',
    dotClass: 'bg-green-500',
    textClass: 'text-green-500',
  },
  'in-progress': {
    label: '进行中',
    dotClass: 'bg-yellow-500',
    textClass: 'text-yellow-500',
  },
  planned: {
    label: '计划中',
    dotClass: 'bg-muted',
    textClass: 'text-muted',
  },
}

export default function RoadmapPage() {
  const completedItems = roadmapItems.filter(item => item.status === 'completed')
  const inProgressItems = roadmapItems.filter(item => item.status === 'in-progress')
  const plannedItems = roadmapItems.filter(item => item.status === 'planned')

  return (
    <div className="space-y-0">
      {/* 01 / ROADMAP */}
      <section>
        <h2 className="section-title">
          01 / <span className="text-foreground">ROADMAP</span>
        </h2>
        <SectionDivider />
        
        <div className="mx-4 md:mx-8 my-8">
          <p className="text-sm text-muted leading-relaxed">
            这里记录了博客的开发计划和进度，包括已完成的功能、正在进行的工作以及未来的规划。
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* 02 / IN PROGRESS */}
      {inProgressItems.length > 0 && (
        <>
          <section>
            <h2 className="section-title">
              02 / <span className="text-foreground">IN PROGRESS</span>
            </h2>
            <SectionDivider />
            
            <div className="mx-4 md:mx-8 my-8 space-y-4">
              {inProgressItems.map((item, index) => (
                <RoadmapCard key={index} item={item} />
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* 03 / PLANNED */}
      {plannedItems.length > 0 && (
        <>
          <section>
            <h2 className="section-title">
              {inProgressItems.length > 0 ? '03' : '02'} / <span className="text-foreground">PLANNED</span>
            </h2>
            <SectionDivider />
            
            <div className="mx-4 md:mx-8 my-8 space-y-4">
              {plannedItems.map((item, index) => (
                <RoadmapCard key={index} item={item} />
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* 04 / COMPLETED */}
      {completedItems.length > 0 && (
        <section>
          <h2 className="section-title">
            {inProgressItems.length > 0 && plannedItems.length > 0 ? '04' : 
             inProgressItems.length > 0 || plannedItems.length > 0 ? '03' : '02'} / <span className="text-foreground">COMPLETED</span>
          </h2>
          <SectionDivider />
          
          <div className="mx-4 md:mx-8 my-8 space-y-4">
            {completedItems.map((item, index) => (
              <RoadmapCard key={index} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const config = statusConfig[item.status]
  
  return (
    <div className="bg-card border border-border p-4 hover:border-primary transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
            <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">{item.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-medium ${config.textClass}`}>{config.label}</span>
          {item.date && <span className="text-xs text-muted">{item.date}</span>}
        </div>
      </div>
    </div>
  )
}
