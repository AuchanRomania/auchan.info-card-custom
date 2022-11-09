/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useFullSession } from 'vtex.session-client'

export default function useFetch() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortController = useMemo(() => new AbortController(), [])

  const { data: sessionData } = useFullSession()
  const regionID = sessionData?.session?.namespaces?.public?.regionId?.value

  const refetch = useCallback(() => {
    if (!regionID) {
      return
    }

    setLoading(true)
    setError(null)

    const request = {
      url: `/api/checkout/pub/regions/${regionID}`,
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: abortController.signal,
      },
    }

    fetch(request.url, request.options)
      .then((res) => res.json())
      .then((result) => {
        result && setData(result)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [abortController.signal, regionID])

  useEffect(() => {
    setData(null)

    refetch()

    return () => {
      abortController.abort()
    }
  }, [refetch, abortController])

  return { data, loading, error, refetch }
}
