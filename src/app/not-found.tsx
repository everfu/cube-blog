import Link from 'next/link'
export default function NotFound() { return <main className="not-found"><span>404</span><h1>这里没有留下内容。</h1><p>页面可能被移动，或者从未存在。</p><Link href="/" prefetch={false}>回到首页</Link></main> }
