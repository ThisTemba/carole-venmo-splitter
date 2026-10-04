import { useId, type CSSProperties, type ReactNode } from 'react'
import { seedFrom, tearFor } from '../../utils/tear'

interface SlipProps {
  children: ReactNode
  // A slight tilt, as if dropped on the desk
  tilt?: number
  className?: string
  slipClassName?: string
  // The bottom runs into something (the envelope) instead of a torn edge
  openBottom?: boolean
  as?: 'div' | 'article' | 'aside' | 'section'
  'aria-label'?: string
}

// A piece of thermal paper, cut straight at the top and torn at the bottom;
// every slip tears a little differently
export default function Slip({
  children,
  tilt = 0,
  className = '',
  slipClassName = '',
  openBottom,
  as: Tag = 'div',
  ...rest
}: SlipProps) {
  const style = { '--tilt': `${tilt}deg`, '--tear': tearFor(seedFrom(useId())) } as CSSProperties
  return (
    <Tag className={`slip-wrap ${className}`} style={style} {...rest}>
      <div className={`slip ${openBottom ? 'slip--open-bottom' : ''} ${slipClassName}`}>
        {children}
        {/* Thermal print fades unevenly; this lies over the ink */}
        <div className="slip__fade" aria-hidden />
      </div>
    </Tag>
  )
}
