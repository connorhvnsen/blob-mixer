import { useRef, useState, useEffect } from 'react'
import { useUpdate } from 'react-three-fiber'
import { CameraHelper, SpotLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import { useControl } from 'react-three-gui';
import { a, useSpring } from 'react-spring/three'

import useQueryState from '../../useQueryState'
import { useUIStore } from '../../store'

// softShadows({
//   // frustrum: 3.2,
//   // // frustrum: 3.75,
//   // // size: 0.005,
//   // size: 0.01,
//   // // near: 80.5,
//   // samples: 10,
//   // // rings: 11,
// })

function rgba(c) {
  if (typeof c === 'object') {
    return `rgba(${c.r},${c.g},${c.b},${c.a || 1})`
  }
  return c
}

function DebugSpotlight({ light }) {
  useHelper(light, SpotLightHelper, 'white')
  return null
}
function DebugSpotlightShadow({ camera }) {
  useHelper(camera, CameraHelper, 'white')
  return null
}


function Spotlight({id, target, onDelete, center }) {
  const group = 'Spotlight#'+id
  const shadowCam = useRef()
  const isAboutOpen = useUIStore(s => s.aboutOpen)
  const firstLoad = useRef(true)

  const [spotlightIntensity, setSpotlightIntensity] = useQueryState('int'+id, 0.5);
  const [shadow/*, setShadow*/] = useQueryState('shadow'+id, false);
  const [shadowBias/*, setShadowBias*/] = useQueryState('shadowBias'+id, -0.01);
  const [angle, setAngle] = useQueryState('angle'+id, Math.PI/4);
  const [distance, setDistance] = useQueryState('dist'+id, 7);
  const [penumbra, setPenumbra] = useQueryState('penum'+id, 1);
  const [decay, setDecay] = useQueryState('decay'+id, 0.5);
  const [shadowFocus/*, setShadowFocus*/] = useQueryState('shadowFocus'+id, 1);
  
  // dynamic auto positions for new spotlights
  const alt = (id%2)*2 -1 // alternate -1 and 1
  const altHalf = (Math.floor(id*0.5)%2)*2 -1 // alternate -1 and 1 every other time
  const [posX, setPosX] = useQueryState('x'+id, -3 * alt);
  const [posY, setPosY] = useQueryState('y'+id, 3 * altHalf);
  const [posZ, setPosZ] = useQueryState('z'+id, -1 + id);
  const [color, setColor] = useQueryState('color'+id, '#fff');
  
  
  useControl('Intensity', { type: 'number', state: [spotlightIntensity, setSpotlightIntensity], min: 0, max: 5, group });
  useControl('Angle', { type: 'number', state: [angle, setAngle], min: 0, max: Math.PI/2, group });
  useControl('Distance', { type: 'number', state: [distance, setDistance], min: 0, max: 20, group });
  useControl('Penumbra', { type: 'number', state: [penumbra, setPenumbra], min: 0, max: 1, group });
  useControl('Decay', { type: 'number', state: [decay, setDecay], min: 0, max: 1, group });
  useControl('Pos X', { type: 'number', state: [posX, setPosX], min: -10, max: 10, group });
  useControl('Pos Y', { type: 'number', state: [posY, setPosY], min: -10, max: 10, group });
  useControl('Pos Z', { type: 'number', state: [posZ, setPosZ], min: -10, max: 10, group });
  useControl('Color', { type: 'color', state: [color, c => setColor(rgba(c))], inline: false, group });
  
  // useControl('Cast Shadow', { type: 'boolean', state: [shadow, setShadow], group });
  // useControl('Shadow focus', { type: 'number', state: [shadowFocus, setShadowFocus], min: 0, max: 1, group });
  // useControl('Shadow bias', { type: 'number', state: [shadowBias, setShadowBias], min: -0.1, max: 0.1, group });
  const debug = useControl('Debug', { type: 'boolean', value: false, group });
  useControl('Delete spotlight', { type: 'button', onClick: () => onDelete(id), group });


  const light = useUpdate(light => {
    if (shadow) {
      debug && (shadowCam.current = light.shadow.camera)
      light.shadow.camera.far= 100
      light.shadow.needsUpdate = true
      light.shadow.camera.fov = 50
      light.shadow.camera.updateProjectionMatrix()
    }
  }, [debug, distance])

  const [on, setOn] = useState(false)

  // Intro delay timer
  useEffect(() => {
    const delay = firstLoad.current ? 1000 : 0
    let timer
    if (!isAboutOpen) {
      timer = setTimeout(() => setOn(true), delay + 500*id)
    } else {
      setOn(false)
    }
    firstLoad.current = false
    return () => clearTimeout(timer)
  }, [id, isAboutOpen])

  // MATERIAL SPRING
  const lightSpring = useSpring({
    angle: angle,
    intensity: (on ? spotlightIntensity : 0),
    color: color,
    distance: distance*0.1,
    decay: decay,
    penumbra: penumbra,
    position: [center[0] + posX*0.1, center[1] + posY*0.1, center[2] + posZ*0.1],
    config: { tension: 100, friction: 20 }
  })

  return (
    <>
      <a.spotLight
        ref={light}
        {...lightSpring}
        castShadow={shadow}
        shadow-bias={shadowBias * 0.1}
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-near={.5}
        shadow-focus={shadowFocus}
        target={target.current}
      />
      { debug && <DebugSpotlight light={light} /> }
      { (debug && shadow) && <DebugSpotlightShadow camera={shadowCam} /> }
    </>
  )
}

/**
 * Lights are positioned in relation to the base `position` and rotated to follow the target as it moves in the scene.
 */
function Lights ({ position =[0,0,0], target }) {
  const isAboutOpen = useUIStore(s => s.aboutOpen)

  const [ambientIntensity, setAmbientIntensity] = useQueryState('ambient', .2);
  const [spotlights, setSpotlights] = useQueryState('lights', [1,2,3]);

  function addSpot() {
    setSpotlights(spotlights => {
      const newId = spotlights.length ? spotlights[spotlights.length-1]+1 : 1
      return [...spotlights, newId]
    })
  }

  function removeSpot(id) {
    setSpotlights(spotlights => {
      return spotlights.filter(item => item !== id)
    })
  }

  useControl('Add spotlight', { type: 'button', onClick: addSpot});
  useControl('Ambient', { type: 'number', state: [ambientIntensity, setAmbientIntensity], min: 0, max: 2, group: 'Environment' });

  const ambientSpring = useSpring({
    intensity: isAboutOpen ? 0 : ambientIntensity,
    config: { tension: 50, friction: 10 }
  })

  return (
    <>
      <a.ambientLight {...ambientSpring} color={"white"}/>

      { spotlights && spotlights.map(id => (
        <Spotlight key={id} id={id} target={target} onDelete={removeSpot} center={position}/>
      ))}
    </>
  )
}

export default Lights