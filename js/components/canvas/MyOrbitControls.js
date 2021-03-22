import React, { useState, useEffect, useRef, useCallback } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useControl } from 'react-three-gui';
import { useFrame } from 'react-three-fiber';
import { MathUtils } from 'three';

import { useUIStore } from '../../store'

const ShowResetControl = ({ resetControls }) => {
  useControl('Reset Camera', { type: 'button', onClick: resetControls });
  return null
}

const MyOrbitControls = ({ target, cameraPosition }) => {
  const controls = useRef()
  const isGallery = useUIStore(s => s.isGallery)
  const [showReset, setShowReset] = useState(false)
  const firstChange = useRef(true)

  const resetControls = () => {
    const pos = controls.current.object.position
    pos.x = cameraPosition[0]
    pos.y = cameraPosition[1]
    pos.z = cameraPosition[2]
    firstChange.current = true
    setShowReset(false)
  } 

  const onChange = useCallback((e) => {
    if (showReset || firstChange.current) {
      firstChange.current = false
      return
    }
    controls.current?.removeEventListener('change', onChange)
    setShowReset(true)
  }, [controls, showReset])

  useEffect(() => {
    const cntrl = controls.current
    if (!showReset) {
      controls.current?.addEventListener('change', onChange)
    }
    return () => cntrl?.removeEventListener('change', onChange)
  }, [showReset, onChange])

  useFrame(() => {
    if (isGallery && controls.current) {
      const pos = controls.current.object.position
      pos.x = MathUtils.lerp(pos.x, cameraPosition[0], 0.1)
      pos.y = MathUtils.lerp(pos.y, cameraPosition[1], 0.1)
      pos.z = MathUtils.lerp(pos.z, cameraPosition[2], 0.1)
    }
  })

  return (
    <>
      <OrbitControls
        ref={controls}
        target={target}
        enabled={!isGallery}
        enablePan={false}
        minDistance={.5}
        maxDistance={2}
      />
      { showReset && <ShowResetControl resetControls={resetControls}/> }
    </>
  )
}

export default MyOrbitControls