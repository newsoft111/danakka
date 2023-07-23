import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const usePreserveScroll = (): void => {
  const router = useRouter()
  const scrollPositions = useRef<Record<string, number>>({})

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      scrollPositions.current[router.asPath] = window.scrollY
    }

    const handleRouteChangeComplete = (url: string) => {
      if (scrollPositions.current[url] !== undefined) {
        window.scrollTo(0, scrollPositions.current[url])
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router])
}

export default usePreserveScroll
