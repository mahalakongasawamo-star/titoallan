import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import ParticleField from './ParticleField'
import FloatingOrbs from './FloatingOrbs'
import CursorFollower from './CursorFollower'

/**
 * HeroOverlay — mounts INSIDE the existing hero section.
 * Adds particle field, floating orbs, and cursor follower
 * as visual layers without replacing any HTML content.
 */
function HeroOverlay() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(pointer: coarse)')
    setIsMobile(mq.matches)

    if (mq.matches) return

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Particle network (desktop only) */}
      {!isMobile && <ParticleField mouseRef={mouseRef} />}

      {/* Breathing orbs that repel from cursor */}
      <FloatingOrbs mouseRef={mouseRef} />
    </>
  )
}

// Mount the hero overlay inside #hero-root (which sits inside .hero__frame)
const heroRoot = document.getElementById('hero-root')
if (heroRoot) {
  ReactDOM.createRoot(heroRoot).render(
    <React.StrictMode>
      <HeroOverlay />
    </React.StrictMode>
  )
}

// Mount cursor follower on a separate root at body level
const cursorDiv = document.createElement('div')
cursorDiv.id = 'cursor-root'
document.body.appendChild(cursorDiv)
ReactDOM.createRoot(cursorDiv).render(
  <React.StrictMode>
    <CursorFollower />
  </React.StrictMode>
)
