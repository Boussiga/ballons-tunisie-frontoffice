import { useEffect, useRef, useState } from 'react'
import { getErrorMessage } from './errors'

// Loads data whenever `key` (a string describing the request) changes.
// While a new request is running, the previous data stays available.
export function useApi(key, fetcher) {
  const [result, setResult] = useState({ key: null, data: null, error: '' })
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    let ignore = false
    fetcherRef
      .current()
      .then((data) => {
        if (!ignore) setResult({ key, data, error: '' })
      })
      .catch((err) => {
        if (!ignore) setResult({ key, data: null, error: getErrorMessage(err) })
      })
    return () => {
      ignore = true
    }
  }, [key])

  return { data: result.data, error: result.error, loading: result.key !== key }
}
