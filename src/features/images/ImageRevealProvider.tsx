'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

const REVEAL_INTERVAL_MS = 105
const SAME_ROW_TOLERANCE_PX = 16

type RevealEntry = {
  element: HTMLElement
  source: string
  ready: boolean
  skipped: boolean
  revealed: boolean
  reveal: (source: string) => void
}

type ImageRevealCoordinator = {
  register: (id: string, element: HTMLElement, reveal: RevealEntry['reveal']) => void
  update: (id: string, source: string, ready: boolean, skipped: boolean) => void
  unregister: (id: string) => void
}

const ImageRevealContext = createContext<ImageRevealCoordinator | null>(null)

function compareVisualOrder(left: RevealEntry, right: RevealEntry) {
  const leftRect = left.element.getBoundingClientRect()
  const rightRect = right.element.getBoundingClientRect()
  const rowDistance = leftRect.top - rightRect.top

  if (Math.abs(rowDistance) > SAME_ROW_TOLERANCE_PX) return rowDistance
  if (leftRect.left !== rightRect.left) return leftRect.left - rightRect.left

  const position = left.element.compareDocumentPosition(right.element)
  return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

function hasLayoutBox(entry: RevealEntry) {
  if (!entry.element.isConnected) return false
  const rect = entry.element.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

function ImageRevealScope({ children }: { children: ReactNode }) {
  const entriesRef = useRef(new Map<string, RevealEntry>())
  const timerRef = useRef<number | null>(null)
  const queuedRef = useRef(false)

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    entriesRef.current.clear()
    queuedRef.current = false
  }, [])

  const flush = useCallback(function processRevealQueue() {
    if (queuedRef.current || timerRef.current !== null) return
    queuedRef.current = true

    queueMicrotask(() => {
      queuedRef.current = false

      const pending = [...entriesRef.current.values()]
        .filter(entry => !entry.revealed && !entry.skipped && hasLayoutBox(entry))
        .sort(compareVisualOrder)

      if (pending.length === 0) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        pending.filter(entry => entry.ready).forEach((entry) => {
          entry.revealed = true
          entry.reveal(entry.source)
        })
        return
      }

      const next = pending[0]
      if (!next.ready) return

      next.revealed = true
      next.reveal(next.source)
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        processRevealQueue()
      }, REVEAL_INTERVAL_MS)
    })
  }, [])

  const coordinator = useMemo<ImageRevealCoordinator>(() => ({
    register(id, element, reveal) {
      entriesRef.current.set(id, {
        element,
        source: '',
        ready: false,
        skipped: false,
        revealed: false,
        reveal,
      })
    },
    update(id, source, ready, skipped) {
      const entry = entriesRef.current.get(id)
      if (!entry) return

      if (entry.source !== source) {
        entry.source = source
        entry.revealed = false
      }
      entry.ready = ready
      entry.skipped = skipped
      flush()
    },
    unregister(id) {
      entriesRef.current.delete(id)
      flush()
    },
  }), [flush])

  return (
    <ImageRevealContext.Provider value={coordinator}>
      {children}
    </ImageRevealContext.Provider>
  )
}

export function ImageRevealProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return <ImageRevealScope key={pathname}>{children}</ImageRevealScope>
}

export function useImageRevealCoordinator() {
  return useContext(ImageRevealContext)
}
