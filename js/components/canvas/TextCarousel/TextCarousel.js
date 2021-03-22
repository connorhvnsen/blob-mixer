import React, { memo, useEffect, useRef, forwardRef, useCallback } from 'react'
import { Text, shaderMaterial } from '@react-three/drei'
import { MathUtils, Color, DoubleSide, FrontSide } from 'three';
import { useThree, useFrame, extend, useResource } from 'react-three-fiber';

import { useUIStore } from '../../../store'

import Select from '../Select'

/* eslint import/no-webpack-loader-syntax: off */
import vertShader from "!raw-loader!glslify-loader!./vertShader.glsl";

// import fontSrc from '../../../assets/fonts/Aften_Screen.ttf'
import fontSrc from '../../../assets/fonts/aften_screen.woff'

const TextMaterial = shaderMaterial(
  { time: 0, color: new Color(1, 1, 1), opacity: 1, fulltime: 0, heightFactor: 1 },
  vertShader,
  // fragment shader
  `
    uniform float fulltime;
    uniform vec3 color;
    uniform float opacity;

    // varying vec3 vTroikaGlyphColor;
    
    #define M_PI 3.1415926538

    void main() {
      gl_FragColor.rgba = vec4(color, max(sin((fulltime)*M_PI), 0.2) * opacity);
    }
  `
);

extend({ TextMaterial });

function mod(n, m) {
  return ((n % m) + m) % m;
}

export const TextTitle = memo(({ y, title, page = 0, standalone, enabled = true}) => {
  const { viewport, size } = useThree()
  const text = useRef()
  const textMat = useResource()
  
  const pageWidthRatio = useUIStore(s => s.pageWidthRatio)
  const blobs = useUIStore(s => s.blobs)

  const local = useRef({
    targetX: useUIStore.getState().targetX,
    currentPage: useUIStore.getState().currentPage,
    textParallax: useUIStore.getState().textParallax,
  }).current
  const pageWidth = size.width * pageWidthRatio
  const totalDistance =  pageWidth * blobs.length
  const margin = (size.width - pageWidth) * 0.5

  const getMyPos = (fullwidth) => {
    if (standalone) return 0.5;
    const shift = pageWidth * Math.floor(blobs.length/2) // dont flip objects at the edges where visible
    if (fullwidth) {
      const x = mod(local.targetX - page * size.width + shift, totalDistance) - shift
      return x / size.width
    } else {
      const x = mod(local.targetX - margin - page * pageWidth + shift, totalDistance) - shift
      return x / pageWidth
    }
  }

  useEffect(() => useUIStore.subscribe(
    ({ targetX, currentPage, textParallax }) => {
      local.targetX = targetX;
      local.currentPage = currentPage
      local.textParallax = textParallax
    }
  ), [local])

  const isPrevPage = useCallback(() => {
    const current = mod(local.currentPage - page, blobs.length) - Math.floor(blobs.length/2) 
    return 0 > current + 3 // hide 3 from edge
  }, [local, blobs, page])

  const isNextPage = useCallback(() => {
    const current = mod(local.currentPage - page, blobs.length) - Math.floor(blobs.length/2) 
    return 0 < current - 3 // hide 3 from edge
  }, [local, blobs, page])


  useFrame(({clock}) => {
    if (text.current) {

      let isCurrentPage = standalone ? true : page === local.currentPage
      
      let lerp = enabled ? 0.05 : 0.1

      const myPos = getMyPos()
      
      // calc position
      const pos = (viewport.width * pageWidthRatio * 0.5 - myPos * viewport.width * pageWidthRatio) *0.4;
      
      if (!standalone) {
        const visible = isCurrentPage || isPrevPage() || isNextPage()
       
        if (visible && !text.current.visible) {
          text.current.visible = true
        }
        else if (!visible && text.current.visible) {
          text.current.visible = false
        }
        
        // velocity
        const vx = (text.current.position.x - pos) * 0.5
        const vxAvg = vx * 0.8 +  useUIStore.getState().vx * 0.2 // rolling average
        if (isCurrentPage) {
          useUIStore.setState({ vx: vxAvg })
        }

        // move immediately if not visible
        if (!visible) lerp = 1

        // lerp position
        const parallax = isCurrentPage ? local.textParallax : local.textParallax * 0.2 
        text.current.position.x = MathUtils.lerp(text.current.position.x, pos + parallax, lerp)
        text.current.position.y = MathUtils.lerp(text.current.position.y, y, lerp)

        text.current.scale.setScalar(1)
      } else {
        text.current.scale.setScalar(.7)
      }

      // MATERIAL UNIFORMS
      text.current.material.opacity = MathUtils.lerp(text.current.material.opacity, enabled ? 1 : 0, enabled ? 0.05 : 0.2)
      // textMat.current.time = MathUtils.lerp( textMat.current.time, myPos, lerp)
  
      const fulltime = MathUtils.mapLinear(!enabled && isCurrentPage ? (standalone ? 0 : 1) : myPos, isCurrentPage ? -0.7 : -0.5, isCurrentPage ? 1.7 : 1.5, 0, 1)// + (isCurrentPage ? local.textParallax*10 : 0)
      const textLerp = (isCurrentPage && clock.getElapsedTime() < 3) ? 0.022 : lerp
      textMat.current.fulltime = MathUtils.lerp( textMat.current.fulltime, fulltime, textLerp)

      // slow snap to current page
      if (!standalone && isCurrentPage) {
        useUIStore.getState().snapX(0.01)
        // update progress
        const totalProgress = mod((useUIStore.getState().targetX - pageWidth*0.5), totalDistance) / totalDistance
        useUIStore.setState({ totalProgress })
      }
    }
  })

  const isPortrait = size.height > size.width
  const isVR = useUIStore(s => s.isVR)
  
  return (
    <Select
      onSelectStart={(e) => {
        if (isNextPage()) {
          useUIStore.getState().next()
        }
        if (isPrevPage()) {
          useUIStore.getState().previous()
        }
      }}
    >
      <textMaterial ref={textMat}
        depthTest={false}
        side={standalone && !isPortrait ? FrontSide : DoubleSide}
        opacity={standalone ? 1 : -3}
        heightFactor={viewport.width * 0.04}
        transparent
      />
      <Text
        ref={text}
        anchorX="center" // default
        anchorY="middle" // default
        color={"white"}
        fontSize={viewport.width * 0.04}
        letterSpacing={-.5*0.06}
        // position={[viewport.width*pageWidthRatio*0.5 - getMyPos() * viewport.width, y, 0]}
        position={[0, y, isPortrait ? 0 : isVR ? -0.5 : .14]}
        // renderOrder={10}
        font={fontSrc}
        material={textMat.current}
        glyphGeometryDetail={20}
        transparent
      >
        { title }
      </Text>
    </Select>
  )
})

const TextCarousel = ({ y, visible }, ref) => {
  const titles = useUIStore(s => s.titles)
  return (
    <mesh ref={ref}>
      { titles.map((title, index) => (
        <TextTitle key={index} y={y} title={titles[index]} page={index} enabled={visible} />
      ))}
      {/* <TextTitle key={0} y={y} title={'test'} page={14} enabled={visible} /> */}
    </mesh>
  )
}

export default memo(forwardRef(TextCarousel))