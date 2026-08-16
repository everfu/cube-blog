import { isValidElement, type ReactNode } from 'react'

export function childText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(childText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return childText(node.props.children)
  return ''
}
