import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

// 将 directive 转换为 JSX 组件
export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const name = node.name
        
        // 支持的 callout 类型
        if (['note', 'info', 'warning', 'error', 'success', 'tip'].includes(name)) {
          const data = node.data || (node.data = {})
          const attributes = node.attributes || {}
          
          // 转换为 Callout 组件
          data.hName = 'Callout'
          data.hProperties = {
            type: name === 'tip' ? 'info' : name,
            title: attributes.title || undefined,
          }
        }
      }
    })
  }
}
