import { useXR, useXREvent } from '@react-three/xr'
import React, { useRef, useEffect, useCallback } from 'react'

/**
 * Modified version of react-xr Select that also fires selectstart and selectend events
 */
export default function Select({ onSelect, onSelectEnd, onSelectStart, children }) {
  const ref = useRef()
  const { addInteraction } = useXR()
  const hoveredHandedness = useRef(new Set())

  const onEnd = useCallback(
    (e) => {
      if (hoveredHandedness.current.has(e.controller.inputSource?.handedness)) {
        onSelect && onSelect()
      }
      onSelectEnd && onSelectEnd()
    },
    [onSelect, onSelectEnd]
  )
  const onStart = useCallback(
    (e) => {
      if (hoveredHandedness.current.has(e.controller.inputSource?.handedness)) {
        onSelectStart && onSelectStart()
      }
    },
    [onSelectStart]
  )

  useXREvent('selectend', onEnd)
  useXREvent('selectstart', onStart)

  useEffect(() => {
    addInteraction(ref.current, 'onHover', (e) => {
      hoveredHandedness.current.add(e.controller.inputSource?.handedness)
    })
    addInteraction(ref.current, 'onBlur', (e) => {
      hoveredHandedness.current.delete(e.controller.inputSource?.handedness)
    })
  }, [addInteraction])

  return <group ref={ref}>{children}</group>
}
