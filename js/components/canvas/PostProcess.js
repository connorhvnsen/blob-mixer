
import React, { useLayoutEffect } from 'react'
import { useControl } from 'react-three-gui';
import { useThree } from 'react-three-fiber';
import { EffectComposer, Bloom, Noise, Glitch, Vignette, Scanline } from "@react-three/postprocessing"
import { OverrideMaterialManager, BlendFunction } from 'postprocessing'
import { useQueryState } from '../../useQueryState'

export default function PostProcess() {
  const [bloomStrength, setBloomStrength] = useQueryState('bloom', .5)
  useControl('Bloom strength', { type: 'number', state: [bloomStrength, setBloomStrength], min:0, max: 10, group: 'Post-processing' });
  
  const [noiseStrength, setNoiseStrength] = useQueryState('noise', 0.1)
  useControl('Noise strength', { type: 'number', state: [noiseStrength, setNoiseStrength], min:0, max: 1, group: 'Post-processing' });
 
  const [scanlineStrength, setScanlineStrength] = useQueryState('scanline', 0.1)
  useControl('Scanline strength', { type: 'number', state: [scanlineStrength, setScanlineStrength], min:0, max: 1, group: 'Post-processing' });
  
  const [vignetteStrength, setVignetteStrength] = useQueryState('vignette', 0.5)
  useControl('Vignette strength', { type: 'number', state: [vignetteStrength, setVignetteStrength], min:0, max: 1, group: 'Post-processing' });
  
  const [glitch, setGlitch] = useQueryState('glitch', false)
  useControl('Glitch', { type: 'boolean', state: [glitch, setGlitch], group: 'Post-processing' });
 
  const { gl } = useThree()

  useLayoutEffect(() => {
    OverrideMaterialManager.workaroundEnabled = true
    return () => {
      gl.autoClear = true;
    }
  }, [gl])

  return (
    <EffectComposer key={noiseStrength+vignetteStrength+glitch+scanlineStrength+bloomStrength}>
      { bloomStrength && <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.5} height={300} opacity={bloomStrength} />}
      { scanlineStrength && <Scanline density={1} opacity={scanlineStrength} /> }
      { noiseStrength && <Noise opacity={noiseStrength} 
        blendFunction={BlendFunction.MULTIPLY}
        /> }
      { vignetteStrength &&<Vignette eskil={false} offset={0.5} darkness={vignetteStrength} /> }
      <Glitch active={glitch} duration={[0.01, .3]} />
    </EffectComposer>
  )
}
