import { ArrowUpRight, Box, Headphones, Laptop, Smartphone } from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { hardware, software } from '@/data/stack'

const icons = [Smartphone, Laptop, Headphones, Box]
export const metadata = { title: '装备', description: '长期使用的设备与软件' }

function HardwareSection() {
  return (
    <section className="stack-section">
      <div className="section-heading"><span>01</span><h2>Hardware</h2></div>
      <div className="hardware-grid">
        {hardware.map((item, index) => {
          const Icon = icons[index]
          return (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>
              <Icon />
              <div><h3>{item.name}</h3><p>{item.description}</p></div>
              <ArrowUpRight />
            </a>
          )
        })}
      </div>
    </section>
  )
}

function SoftwareSection() {
  return (
    <section className="stack-section">
      <div className="section-heading"><span>02</span><h2>Software</h2></div>
      <div className="software-groups">
        {software.map(group => (
          <div key={group.name}>
            <h3>{group.name}</h3>
            {group.items.map(item => (
              <a key={item.name} href={item.href} target="_blank" rel="noreferrer">
                <span className="software-mark">{item.name.slice(0, 1)}</span>
                <div>
                  <strong>
                    {item.name}
                    {item.recommended ? <em>推荐</em> : null}
                  </strong>
                  <p>{item.description}</p>
                </div>
                <ArrowUpRight />
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function StackPage() {
  return (
    <>
      <PageIntro
        title="趁手的工具，让注意力留给重要的事。"
        description="我在工作与生活中长期使用、愿意推荐，或正在关注的设备与软件。"
      />
      <HardwareSection />
      <SoftwareSection />
    </>
  )
}
