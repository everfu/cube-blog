'use client'

import Script from "next/script"

declare global {
    interface Window {
        twikoo: {
            init: (config: { el: string; envId: string }) => void
        }
    }
}

export default function Comment() {
    return (
    <div className="px-4">
        <div id="tcomment"></div>
        <Script src="https://open.lightxi.com/cdnjs/ajax/libs/twikoo/1.6.44/twikoo.min.js" onLoad={() => {
            window.twikoo.init({
                el: '#tcomment',
                envId: 'https://tk.efu.me/',
            })
        }} />
    </div>
    )
}