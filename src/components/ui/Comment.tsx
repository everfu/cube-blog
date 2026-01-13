'use client'

import Script from "next/script"
import { useEffect, useRef } from "react"

declare global {
    interface Window {
        twikoo: {
            init: (config: { el: string; envId: string }) => void
        }
    }
}

export default function Comment() {
    const initialized = useRef(false)

    useEffect(() => {
        // 如果已经初始化过且 twikoo 已加载，直接初始化
        if (window.twikoo && !initialized.current) {
            const container = document.getElementById('tcomment')
            if (container) {
                container.innerHTML = '' // 清空旧内容
                window.twikoo.init({
                    el: '#tcomment',
                    envId: 'https://api.efu.me/tk/',
                })
                initialized.current = true
            }
        }
    }, [])

    const handleScriptLoad = () => {
        if (!initialized.current) {
            window.twikoo.init({
                el: '#tcomment',
                envId: 'https://api.efu.me/tk/',
            })
            initialized.current = true
        }
    }

    return (
        <div className="px-4 pb-4">
            <div id="tcomment"></div>
            <Script 
                src="https://cdn.bootcdn.net/ajax/libs/twikoo/1.6.44/twikoo.min.js" 
                strategy="lazyOnload"
                onLoad={handleScriptLoad} 
            />
        </div>
    )
}
