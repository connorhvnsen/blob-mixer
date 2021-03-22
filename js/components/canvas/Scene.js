import { useRef, useEffect, useState } from 'react'
import { MathUtils } from 'three';
// import { Sky } from '@react-three/drei'
import { useThree, useFrame } from 'react-three-fiber'
import { useControl } from 'react-three-gui';
import { useSpring } from 'react-spring/three'

import { useUIStore } from '../../store'
import useQueryState from '../../useQueryState'

import Lights from './Lights'
import Blob from './Blob'
import TextCarousel, { TextTitle } from './TextCarousel'
import PostProcess from './PostProcess'
import Screenshot from './Screenshot'


const CustomTitle = ({ y, visible }) => {
  const [customTitle, setCustomTitle] = useQueryState('title', 'Your title');
  useControl('Title', { type: 'string', state: [customTitle, setCustomTitle], group: '' });
  return <TextTitle y={y} title={customTitle} standalone enabled={visible} />
}

export default function Scene ({ center, enableShadowMap }) {
  const blob = useRef()
  const textCarousel = useRef()
  const { gl, size } = useThree()
  const local = useRef({
    currentPageUnlimited: useUIStore.getState().currentPageUnlimited,
    currentPageFactor: useUIStore.getState().currentPageFactor,
    mouse: useUIStore.getState().mouse,
    vx: 0,
  }).current

  const isGallery = useUIStore(s => s.isGallery)
  const isAboutOpen = useUIStore(s => s.aboutOpen)

  
  const notLoadedBg = '#141518' 
  const [isLoaded, setLoaded] = useState(false)

  const [clearColor, setClearColor] = useQueryState('clearColor', '#657174');
  // const [enableSky, setEnableSky] = useQueryState('sky', false);
  
  useControl('Background color', { type: 'color', state: [clearColor, setClearColor], group: 'Environment' });
  // useControl('Sky environment', { type: 'boolean', state: [enableSky, setEnableSky], group: 'Environment' });
  // const cameraFOV = useControl('Camera FOV', { type: 'number', value: camera.fov, min: 1, max: 150, group: 'Camera' });
  
  // const uploadedBackground = useControl('Scene bg', { type: 'file', loader: new TextureLoader(), group: 'Environment' });


  useSpring({
    clearColor: isAboutOpen ? '#141518' : isLoaded ? clearColor : notLoadedBg,
    config: { tension: 50, friction: 10, clamp: true },
    onChange: ({clearColor}) => gl.setClearColor(clearColor, 1.0)
  })

  useEffect(() => {
    gl.setClearColor(notLoadedBg, 1.0)
    setLoaded(true)
  }, [gl])

  // update camera fov if changed
  // useEffect(() => {
  //   camera.fov = cameraFOV
  //   camera.updateProjectionMatrix()
  // }, [camera, cameraFOV])

  // set scene background
  // useEffect(() => {
  //   // sometimes texture image is not set, delaying 1s because... 
  //   setTimeout(() => {
  //     if (uploadedBackground instanceof Texture && uploadedBackground.image) {
  //       const rt = new WebGLCubeRenderTarget(uploadedBackground.image.height);
  //       rt.fromEquirectangularTexture(gl, uploadedBackground);
  //       rt.texture.encoding = sRGBEncoding; // fix rgb
  //       scene.background = rt.texture
  //       uploadedBackground.dispose();
  //     }
  //   }, 1000)
  // }, [gl, scene, uploadedBackground, uploadedBackground.image])

  useEffect(() => useUIStore.subscribe(
    ({ currentPageUnlimited, currentPageFactor, mouse, vx }) => {
      local.currentPageUnlimited = currentPageUnlimited
      local.currentPageFactor = currentPageFactor;
      local.mouse = mouse;
      local.vx = vx;
    }
  ), [local])

  useFrame(() => {
    if (!blob.current) return
    const turns = 2*Math.PI*(local.currentPageUnlimited + (!isGallery ? 1 : 0) + (isAboutOpen ? 0.5 : 0))
    const parallax = Math.PI
    let rot = -turns
    let blobX = 0
    // let blobY = center[1]

    const mouseLerp = 0.05
    const scrollLerp = 0.033
    const mouseParallax = 0.01

    if (isGallery) {
      const pageDist = local.currentPageFactor < 0 ? 1 + local.currentPageFactor : local.currentPageFactor
      rot = (parallax*0.5 - pageDist * parallax)  - turns

      // send parallax to inner components
      useUIStore.setState({ textParallax: -local.mouse.x * mouseParallax })
      
      textCarousel.current.position.y = MathUtils.lerp(textCarousel.current.position.y, local.mouse.y * mouseParallax, mouseLerp)
      blobX = local.mouse.x * -mouseParallax * 0.5 - MathUtils.clamp(local.vx, -.1, .1)
      // blobY += local.mouse.y * mouseParallax * 0.5
    }
    blob.current.position.x = MathUtils.lerp(blob.current.position.x, blobX, mouseLerp)
    // disable y parallax - interferes with responsive position
    // blob.current.position.y = MathUtils.lerp(blob.current.position.y, blobY, mouseLerp)
    
    blob.current.rotation.y = MathUtils.lerp(blob.current.rotation.y, rot, scrollLerp)
  })

  const [postprocess, setPostprocess] = useQueryState('pp', false)
  useControl('Postprocess', { type: 'boolean', state: [postprocess, setPostprocess], group: 'Post-processing' });

  const isVR = useUIStore(s => s.isVR)
  const isPortrait = size.height > size.width
  const blobPos = [center[0], center[1] + (isPortrait ? .0 : 0), center[2] + isVR ? -.7 : 0]
  const textY = center[1] + (isPortrait ? .14 : 0)

  return (
    <>
      
      { postprocess && <PostProcess/> }

      <Screenshot postprocess={postprocess} />
      
      <Blob ref={blob} position={blobPos} enableShadow={enableShadowMap} />
      
      {/* { enableSky &&
        <Sky
        turbidity={8}
        rayleigh={0}
        mieCoefficient={0.023}
        mieDirectionalG={0.7}
        inclination={0}
        exposure={1}
        />
      } */}

      <TextCarousel ref={textCarousel} y={textY} visible={!isAboutOpen && isGallery} getVelocity={v => console.log(v)}/>
      
      <Lights target={blob} position={blobPos} />

      <CustomTitle y={textY} visible={!isAboutOpen && !isGallery} />
      
    </>
  )
}