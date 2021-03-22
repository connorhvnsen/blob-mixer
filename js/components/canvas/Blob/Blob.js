import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react'
import { useTexture, Sphere } from '@react-three/drei'
import { /*Shape, ShapeBufferGeometry,*/ WebGLCubeRenderTarget, Vector3, Quaternion, sRGBEncoding, DoubleSide } from 'three'
import { useThree, useFrame, extend } from 'react-three-fiber'
// import { RayGrab } from '@react-three/xr'
import { useControl } from 'react-three-gui';
import { a, useSpring } from 'react-spring/three'
import mergeRefs from 'react-merge-refs'

// Local components
import MagicalMaterial from './MagicalMaterial'
import PolarSphereGeometry from './PolarSphereBufferGeometry'
import MagicalDepthMaterial from './MagicalDepthMaterial'
import DebugMaterialControls from './DebugMaterialControls'
// import VideoSlide from '../VideoSlide'

import useQueryState from '../../../useQueryState'
import { useUIStore } from '../../../store'

// Assets
import envMapSrc from '../../../assets/envmap-2048.min.jpg'

// import lavaSrc from '../../../assets/lavatile.jpg'
// import alphaStripesSrc from '../../../assets/alpha-stripes.png'

import gradient0 from '../../../assets/gradients/cloudconvert/05_gradient-alert.png'
import gradient1 from '../../../assets/gradients/cloudconvert/02_gradient-primary-variation.png'
import gradient2 from '../../../assets/gradients/cloudconvert/03_gradient-secondary.png'
import gradient3 from '../../../assets/gradients/cloudconvert/04_gradient-error.png'
import gradient4 from '../../../assets/gradients/cloudconvert/06_cosmic-fusion.png'
import gradient5 from '../../../assets/gradients/cloudconvert/07_deep-ocean.png'
import gradient6 from '../../../assets/gradients/cloudconvert/08_lucky-day.png'
import gradient7 from '../../../assets/gradients/cloudconvert/09_sunset-vibes.png'

const AnimatedMagicalMaterial = a(MagicalMaterial)
const AniamtedMagicalDepthMaterial = a(MagicalDepthMaterial)

extend({ PolarSphereGeometry })

// preload assets on parse
// useTexture.preload([envMapSrc, gradient0, gradient1, gradient2, gradient3, gradient4, gradient5, gradient6, gradient7])

/**
 * Blob
 * The debug controls have been intentionally left in place to allow for easy inspection of how the materials are configured.
 * 
 * @param {bool} darkTheme Theme selection
 * @param {object} ref React ref from forwardRef
 */
function Blob({ enableShadow, position, ...props }, ref) {
  const material = useRef()
  const blob = useRef()
  const geom = useRef()
  const grabTarget = useRef()
  // const video = useRef()
  // const ground = useRef()

  const { gl, /* scene, camera, */ size } = useThree()
  const isRemix = useUIStore(s => s.isRemix)
  const isAboutOpen = useUIStore(s => s.aboutOpen)
  const isPortrait = size.height > size.width

  // resources
  const globalPos = useMemo(() => new Vector3(), [])
  const globalQuaternion = useMemo(() => new Quaternion(), [])


  // const [envMapEq, lava, alphaStripes] = useTexture([envMapSrc, lavaSrc, alphaStripesSrc])
  // const [envMapEq, lava] = useTexture([envMapSrc, lavaSrc])
  const [envMapEq] = useTexture([envMapSrc])
  // const [normalMap, colorMap] = useTexture([normalMapSrc, colorMapSrc])
  const gradients = useTexture([gradient0, gradient1, gradient2, gradient3, gradient4, gradient5, gradient6, gradient7])
  const [envMap, setEnvMap] = useState()
  const [loaded, setLoaded] = useState(false)
  const [selectedGradient, setSelectedGradient] = useState(gradients[0])


  // MATERIAL PROPERTIES
  const presenceMaterialProps = {
    roughness: useQueryState('roughness', 0.14),
    metalness: useQueryState('metalness', 0),
    envMapIntensity: useQueryState('envMap', 1),
    clearcoat: useQueryState('clearcoat', 1),
    clearcoatRoughness: useQueryState('ccRougness', 0.7),
    transmission: useQueryState('transmission', 0.0),
    ior: useQueryState('ior', 1.0),
    reflectivity: useQueryState('reflectivity', 0.5),
    opacity: useQueryState('opacity', 1),
    color: useQueryState('color', "#fff"),
    flatShading: useQueryState('flatShading', false),
    wireframe: useQueryState('wireframe', false),
    useGradient: useQueryState('useGradient', true), // smoother transition if always a texture
  }



  // const [floorVisible, setFloorVisible] = useQueryState('floor', false);
  // const [floorSize, setFloorSize] = useQueryState('floorSize', 1);
  // const [floorColor, setFloorColor] = useQueryState('floorColor', '#000');
  // const [floorOpacity, setFloorOpacity] = useQueryState('floorOpacity', 0.1);
  // const [floorRoughness, setFloorRoughness] = useQueryState('floorRoughness', 0.5);
  // const [floorMetalness, setFloorMetalness] = useQueryState('floorMetalness', 0.5);
  // const [floorEnvMap, setFloorEnvMap] = useQueryState('floorEnvMap', 0.2);
  // const [floorY, setFloorY] = useQueryState('floorY', 0);



  // useControl('Floor visible', { type: 'boolean', state: [floorVisible, setFloorVisible], group: 'Floor' });
  // useControl('Floor size', { type: 'number', state: [floorSize, setFloorSize], min: 0, max: 5, group: 'Floor' });
  // useControl('Floor color', { type: 'color', state: [floorColor, c => setFloorColor(rgba(c))], group: 'Floor', inline: true });
  // useControl('Floor opacity', { type: 'number', state: [floorOpacity, setFloorOpacity], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor roughness', { type: 'number', state: [floorRoughness, setFloorRoughness], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor metalness', { type: 'number', state: [floorMetalness, setFloorMetalness], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor envMap', { type: 'number', state: [floorEnvMap, setFloorEnvMap], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor Y', { type: 'number', state: [floorY, setFloorY], min: -10, max: 2, group: 'Floor' });
  


  // NOISE STATE / PROPS
  const [distort, setDistort] = useQueryState('distort', 0.5);
  const [frequency, setFrequency] = useQueryState('frequency', 1.5);
  const [speed, setSpeed] = useQueryState('speed', 0.33);
  const [gooPoleAmount, setGooPoleAmount] = useQueryState('poleAmount', 1);
  useControl('Distort', { type: 'number', state: [distort, setDistort], min: 0.0, max: 1.0, group: 'Blob Noise' });
  useControl('Frequency', { type: 'number', state: [frequency, setFrequency], min: 0.01, max: 5, group: 'Blob Noise' });
  useControl('Speed', { type: 'number', state: [speed, setSpeed], min: 0.0, max: 3, group: 'Blob Noise' });
  useControl('Pole amount', { type: 'number', state: [gooPoleAmount, setGooPoleAmount], min: 0, max: 1, group: 'Blob Noise' });
  
  const [surfaceDistort, setSurfaceDistort] = useQueryState('surfaceDistort', 1);
  const [surfaceFrequency, setSurfaceFrequency] = useQueryState('surfaceFrequency', 1);
  const [surfaceSpeed, setSurfaceSpeed] = useQueryState('surfaceSpeed', 1);
  const [numberOfWaves, setNumberOfWaves] = useQueryState('numWaves', 4);
  const [surfacePoleAmount, setSurfacePoleAmount] = useQueryState('surfPoleAmount', 1);
  useControl('Distort', { type: 'number', state: [surfaceDistort, setSurfaceDistort], min: 0.0, max: 10.0, group: 'Blob Surface Noise' });
  useControl('Frequency', { type: 'number', state: [surfaceFrequency, setSurfaceFrequency], min: 0.01, max: 5, group: 'Blob Surface Noise' });
  useControl('Number of waves', { type: 'number', state: [numberOfWaves, setNumberOfWaves], min: 0, max: 20, group: 'Blob Surface Noise' });
  useControl('Speed', { type: 'number', state: [surfaceSpeed, setSurfaceSpeed], min: 0.0, max: 3, group: 'Blob Surface Noise' });
  useControl('Pole amount', { type: 'number', state: [surfacePoleAmount, setSurfacePoleAmount], min: 0, max: 1, group: 'Blob Surface Noise' });


  // const [useDynamicEnv, setUseDynamicEnv] = useQueryState('dynEnv', false);
  // useControl('Use showreel video', { type: 'boolean', state: [useDynamicEnv, setUseDynamicEnv], group: 'Environment' });

  
  const [blobSegments, setBlobSegments] = useQueryState('segments', 256);
  const [blobScale, setBlobScale] = useQueryState('scale', 1);
  const [fixNormals, setFixNormals] = useQueryState('uv', true);
  const [receiveShadow/*, setReceiveShadow*/] = useQueryState('rshad', false);
  const [rotX, setRotX] = useQueryState('rx', 0);
  const [rotY, setRotY] = useQueryState('ry', 0);
  const [rotZ, setRotZ] = useQueryState('rz', 0);
  useControl('Size', { type: 'number', state: [blobScale, setBlobScale], min: 0.5, max: 1.5, group: 'Blob Geometry' });
  useControl('Segments', { type: 'number', state: [blobSegments, setBlobSegments], min: 1, max: 512, group: 'Blob Geometry' });
  useControl('Fix Normals', { type: 'boolean', state: [fixNormals, setFixNormals], group: 'Blob Geometry' });
  useControl('Rotate X', { type: 'number', state: [rotX, setRotX], scrub: true, distance: Math.PI/2, group: 'Blob Geometry' });
  useControl('Rotate Y', { type: 'number', state: [rotY, setRotY], scrub: true, distance: Math.PI/2, group: 'Blob Geometry' });
  useControl('Rotate Z', { type: 'number', state: [rotZ, setRotZ], scrub: true, distance: Math.PI/2, group: 'Blob Geometry' });

  // useControl('Self-shadow', { type: 'boolean', state: [receiveShadow, setReceiveShadow], group: 'Renderer' });
  


  /////////////////////////////////////////////////////////////////////////////
  // UTILS
  /////////////////////////////////////////////////////////////////////////////


  const blobMatProp = (prop) => {
    return presenceMaterialProps[prop][0]
  }


  // MATERIAL SPRING
  const materialSpring = useSpring({
    distort,
    frequency,
    speed,
    surfaceDistort,
    surfaceFrequency,
    surfaceSpeed,
    numberOfWaves,
    surfacePoleAmount,
    gooPoleAmount,
    fixNormals,
    color: blobMatProp('color'),
    envMapIntensity: isAboutOpen ? 0 : blobMatProp('envMapIntensity'),
    roughness: blobMatProp('roughness'),
    metalness: blobMatProp('metalness'),
    clearcoat: blobMatProp('clearcoat'),
    clearcoatRoughness: blobMatProp('clearcoatRoughness'),
    transmission: isAboutOpen? 0 : blobMatProp('transmission'),
    // config: { tension: 20, friction: 10, precision: 0.0001 } // high precision to avoid seeing glitch on Freshwater
    config: { tension: 50, friction: 20, precision: 0.00001 }
  })

  // MESH SPRING
  const meshSpring = useSpring({
    scale: [blobScale * 0.14, blobScale * 0.14, blobScale * 0.14],
    rotation: [rotX, rotY, rotZ],
    config: { tension: 50, friction: 14 },
    position: [0, isRemix && isPortrait ? 0.03 : 0, 0]
  })
  
  



 

  /////////////////////////////////////////////////////////////////////////////
  // EFFECTS
  /////////////////////////////////////////////////////////////////////////////
 
  // create Cube env map from Equirectangluar
  useEffect(() => {
    const rt = new WebGLCubeRenderTarget(envMapEq.image.height);
    rt.fromEquirectangularTexture(gl, envMapEq);
    rt.texture.encoding = sRGBEncoding; // fix rgb
    setEnvMap(rt.texture)
    envMapEq.dispose();
  }, [gl, envMapEq])


  

  /////////////////////////////////////////////////////////////////////////////
  // ANIMATION FRAME
  /////////////////////////////////////////////////////////////////////////////

  useFrame(({gl, scene, clock}) => {
    // if (useDynamicEnv) {
    //   blob.current.visible=false
    //   ground.current && (ground.current.visible  =false)
    //   const x = video.current?.scale.x
    //   video.current && (video.current.scale.x *= 8)
    //   video.current && (video.current.scale.y *= 8)
    //   cubeCamera.update(gl, scene);
    //   video.current && (video.current.scale.x = x)
    //   video.current && (video.current.scale.y = 1)
    //   blob.current.visible=true
    //   ground.current && (ground.current.visible = true)
    // }

    // move to grabTarget (better perf to raycast a small mesh)
    if (grabTarget.current) {
      grabTarget.current.getWorldQuaternion(globalQuaternion)
      grabTarget.current.getWorldPosition(globalPos)
      blob.current.position.copy(globalPos)
      blob.current.quaternion.copy(globalQuaternion)
    }

    // material.current.alphaMap.offset.y += 0.01
    // material.current.transmissionMap.offset.y += 0.01
    // console.log('a', material.current.alphaMap.offset.y)
    // alphaStripes.needsUpdate = true
    // material.current.needsUpdate = true


  })

  // useEffect(() => {
  //   lava.wrapS = RepeatWrapping;
  //   lava.wrapT = RepeatWrapping;
  //   lava.repeat.set( .1, .1 );
  // }, [lava])

  // useEffect(() => {
  //   alphaStripes.magFilter = NearestFilter;
  //   alphaStripes.wrapT = RepeatWrapping;
  //   alphaStripes.wrapS = RepeatWrapping;
  //   alphaStripes.rotation = 1.1;
  //   alphaStripes.repeat.set( 2.01, 2.01 );
  //   alphaStripes.needsUpdate = true
  //   material.current.needsUpdate = true
  //   console.log('alphaStripes', alphaStripes)
  // }, [alphaStripes])

  // dynamic cube map
  // const [cubeRenderTarget, cubeCamera] = useMemo(() => {
  //   if (!useDynamicEnv) return [null, null]
  //   const rt = new WebGLCubeRenderTarget(128, {
  //     format: RGBFormat,
  //     generateMipmaps: true,
  //     minFilter: LinearMipmapLinearFilter,
  //     encoding: sRGBEncoding
  //   })
  //   return [
  //     rt,
  //     new CubeCamera( .1, 10, rt )
  //   ]
  // }, [useDynamicEnv])

  // rounder rect shape geometry
  // const roundedRectShapeGeom = useMemo(() => {
  //   const roundedRectShape = new Shape();
  //   const size = 10;
	// 	( function roundedRect( ctx, x, y, width, height, radius ) {
  //     ctx.moveTo( x, y + radius );
  //     ctx.lineTo( x, y + height - radius );
  //     ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
  //     ctx.lineTo( x + width - radius, y + height );
  //     ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
  //     ctx.lineTo( x + width, y + radius );
  //     ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
  //     ctx.lineTo( x + radius, y );
  //     ctx.quadraticCurveTo( x, y, x, y + radius );
  //   } )( roundedRectShape, -size/2, -size/2, size, size, size/2 );
  //   return new ShapeBufferGeometry(roundedRectShape)
  // }, [])

  const sizeRatio = Math.min(1, size.width / size.height * 1.2)
  const gallerySize = 1.0 * sizeRatio
  const remixSize = 1.0 * sizeRatio
  const sceneScale = isRemix ? [remixSize, remixSize, remixSize] : [gallerySize, gallerySize, gallerySize]
  const gallerySpring = useSpring({
    scale:  !loaded ? [0,0,0] : isAboutOpen ? [1.8, 1.8, 1.8] : sceneScale,
    config: { tension: 20, friction: 10, precision: 0.001 }
  })

  useEffect(() => {
    if (envMap) {
      setLoaded(true)
      document.documentElement.classList.add('loaded')
      document.querySelector('.loaderblob').style.animation = 'blobhide .5s both 1'
      document.querySelector('.loaderprogress').style.display = 'none'
    }
  }, [envMap])

  // Reduce triangles on Oculus Quest browser
  // FIXME don't rely on user agent... how?
  let segmentsY = blobSegments
  let segmentsX = blobSegments * 1.33 //make sphere more uniform
  if (navigator.userAgent.includes('OculusBrowser')) {
    segmentsY = 128
    segmentsX = 128
  }

  return (
    <>
      <DebugMaterialControls
        material={material}
        materialProps={presenceMaterialProps}
        gradients={gradients}
        selectedGradient={selectedGradient}
        setSelectedGradient={setSelectedGradient} 
      />
        
      {/* Ball hover target - main ref */}
      {/* <RayGrab> */}
        <group ref={mergeRefs([ref, grabTarget])} position={position}>
          <Sphere args={[1, 4, 4]} scale={[blobScale*0.2, blobScale*0.2, blobScale*0.2]} material-wireframe position={[0, -.0, 0]} visible={false}/>
        </group>
      {/* </RayGrab> */}

      {/* Dynamic ball position */ }
      <a.group ref={blob} {...props} {...gallerySpring} frustumCulled={false}>
        <a.mesh
          castShadow
          receiveShadow={receiveShadow} 
          {...meshSpring}
          frustumCulled={false} // always visible
        >
          <sphereBufferGeometry args={[1, segmentsX, segmentsY]} ref={geom}/>
          {/* <polarSphereGeometry attach="geometry" args={[1, segments, segments]} ref={geom}/> */}
          <AnimatedMagicalMaterial
            ref={material}
            map={blobMatProp('useGradient') ? selectedGradient : null}
            // envMap={useDynamicEnv ? cubeRenderTarget.texture : envMap}
            envMap={envMap}
            transparent={true}
            // opacity={blobMatProp('opacity')}
            // ior={blobMatProp('ior')}
            // reflectivity={blobMatProp('reflectivity')}
            // side={DoubleSide}
            // alphaTest={.5}
            // depthTest={false}
            // depthWrite={false}
            flatShading={blobMatProp('flatShading')}
            wireframe={blobMatProp('wireframe')}
            {...materialSpring}
          />
          { enableShadow && 
            <AniamtedMagicalDepthMaterial {...materialSpring} />
          }
        </a.mesh>
      </a.group>

      {/* { floorVisible && (
        <mesh ref={ground} position={[0,floorY,0]} rotation={[-Math.PI/2,0,0]} scale={[floorSize,floorSize,floorSize]} receiveShadow>
          <primitive object={roundedRectShapeGeom} attach="geometry"/>
          <meshStandardMaterial color={floorColor}
            roughness={floorRoughness}
            metalness={floorMetalness}
            envMap={useDynamicEnv ? cubeRenderTarget.texture : envMap}
            envMapIntensity={floorEnvMap}
            roughnessMap={lava}
            transparent
            opacity={floorOpacity}
          />
        </mesh>
      )}

      {useDynamicEnv && (
        <VideoSlide ref={video} id="showreel" 
          position={[0,2.5,-5]} 
          args={[5, 5, 24, 24]} 
          lookAt={[0,2.2,0]} 
        />
      )} */}

    </>
  )
}

export default forwardRef(Blob)
