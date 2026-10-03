import { useState, useEffect } from 'react'

// legacyKey: an older key to read from if `key` isn't set yet; it's removed once migrated
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  legacyKey?: string,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item =
        window.localStorage.getItem(key) ??
        (legacyKey ? window.localStorage.getItem(legacyKey) : null)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
      if (legacyKey) window.localStorage.removeItem(legacyKey)
    } catch (error) {
      console.error(error)
    }
  }, [key, legacyKey, storedValue])

  return [storedValue, setStoredValue]
}
