import { useEffect, useState } from 'react'
import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu'
import Slip from './Slip'
import { listeners, toasts, type Toast } from '../../utils/toast'

// Little printed slips in the corner
export function Toaster() {
  const [current, setCurrent] = useState<Toast[]>(toasts)

  useEffect(() => {
    listeners.add(setCurrent)
    return () => {
      listeners.delete(setCurrent)
    }
  }, [])

  return (
    <div className="toasts" role="status" aria-live="polite">
      {current.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <Slip tilt={-0.6}>
            <p className="toast__title">
              {toast.type === 'success' ? <LuCircleCheck aria-hidden /> : <LuTriangleAlert aria-hidden />}
              {toast.title}
            </p>
            {toast.description && <p className="toast__desc">{toast.description}</p>}
          </Slip>
        </div>
      ))}
    </div>
  )
}
