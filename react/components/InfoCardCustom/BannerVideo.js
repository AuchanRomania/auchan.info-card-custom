import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

import styles from './styles.css'

// Plays over the banner image, which stays the LCP element and the fallback.
// The source is set only after the page load event and while visible.
const BannerVideo = ({ src, width, height }) => {
  const ref = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current

    if (!video || !src || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const saveData = navigator.connection && navigator.connection.saveData

    if (prefersReducedMotion || saveData) {
      return undefined
    }

    let observer = null

    const start = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (video.getAttribute('src') !== src) {
              video.setAttribute('src', src)
            }

            video.muted = true
            const playing = video.play()

            if (playing && playing.catch) {
              playing.catch(() => {})
            }
          } else {
            video.pause()
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(video)
    }

    if (document.readyState === 'complete') {
      start()
    } else {
      window.addEventListener('load', start, { once: true })
    }

    return () => {
      window.removeEventListener('load', start)

      if (observer) {
        observer.disconnect()
      }
    }
  }, [src])

  return (
    <video
      ref={ref}
      className={`${styles.infoCardVideo} ${
        isPlaying ? styles['infoCardVideo--playing'] : ''
      }`}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setIsPlaying(true)}
    />
  )
}

BannerVideo.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default BannerVideo
