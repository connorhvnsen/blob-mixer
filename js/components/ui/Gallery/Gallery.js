import React, { useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { MathUtils } from 'three'
import { useGesture } from 'react-use-gesture'

import { useUIStore, updateBlobState } from '../../../store'
import RemixCTA from '../RemixCTA/'
import Pagination from '../Pagination/'


export default function Gallery() {
  const btnNext = useRef()
  const btnPrev = useRef()
  const blobs = useUIStore(s => s.blobs)
  const currentPage = useUIStore(s => s.currentPage)

  const local = useRef({
    targetX: useUIStore.getState().targetX,
    mouse: { x: 0, y: 0 },
  }).current


  const showNext = () => {
    useUIStore.getState().next()
    
  }
  const showPrevious = () => {
    useUIStore.getState().previous()
  }

  const updateUIState = useCallback((targetX) => {
    useUIStore.getState().updateTargetX(targetX)
  }, [])

  // update blob state when gallery mounts
  useLayoutEffect(() => {
    updateUIState()
    updateBlobState(blobs[currentPage])
  }, [blobs, currentPage, updateUIState])


  const bind = useGesture({
    onWheel: (state) => {
      state.event.preventDefault()
      local.targetX = useUIStore.getState().targetX
      local.targetX += MathUtils.clamp(state.delta[0] + state.delta[1], -100, 100)
      updateUIState(local.targetX)
    },
    onDrag: ({ delta: [deltaX, deltaY] }) => {
      local.targetX = useUIStore.getState().targetX
      local.targetX -= (deltaX+deltaY) * 2
      updateUIState(local.targetX)
    }
  }, {
   domTarget: document.body,
   eventOptions: { passive: false },
  })

  function disableScroll(e) {
    e.preventDefault()
    e.stopImmediatePropagation()
    return false
  }

  useEffect(() => {
    useUIStore.setState({ isGallery: true })
    window.addEventListener('touchmove', disableScroll, false);
    window.addEventListener('resize', updateUIState, false);
    return () => {
      useUIStore.setState({ isGallery: false })
      window.removeEventListener('touchmove', disableScroll, false);
      window.addEventListener('resize', updateUIState, false);
    }
  }, [updateUIState])

  const onMouseMove = useCallback((e) => {
    local.mouse.x = (e.clientX - window.innerWidth/2) / window.innerWidth * 2
    local.mouse.y = (e.clientY - window.innerHeight/2) / window.innerHeight * 2
    useUIStore.setState({ mouse: local.mouse })
  }, [local])

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 38 || e.keyCode === 37) {
      useUIStore.getState().previous()
    } else if (e.keyCode === 32 || e.keyCode === 39 || e.keyCode === 40) {
      useUIStore.getState().next()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, false)
    return () => window.removeEventListener('keydown', handleKeyDown, false)
  }, [handleKeyDown])

  return (
    <div {...bind()} className="Gallery" onMouseMove={onMouseMove}>

      <Pagination />
      
      <button ref={btnNext} className="btnNext" onClick={() => showNext()} aria-label="Next blob"></button>
      <button ref={btnPrev} className="btnPrev" onClick={() => showPrevious()} aria-label="Previous blob"></button>
      
      <RemixCTA />
    </div>

  )
}
