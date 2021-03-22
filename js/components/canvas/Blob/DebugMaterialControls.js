import { useEffect } from 'react'
import { useControl } from 'react-three-gui';
// import { TextureLoader } from 'three'

import useQueryState from '../../../useQueryState'

const gradientNames = ['white', 'purple-rain', 'rainbow', 'passion', 'cosmic-fusion', 'deep-ocean', 'lucky-day', 'sunset-vibes']

export default function DebugMaterialControls ({ gradients, selectedGradient, setSelectedGradient, materialProps, material}) {
  // Blob Material CONTROLS
  useControl('Roughness', { type: 'number', state: materialProps.roughness, min: 0.0, max: 1, group: 'Blob Material' });
  useControl('Metalness', { type: 'number', state: materialProps.metalness, min: 0.0, max: 1, group: 'Blob Material' });
  useControl('EnvMap', { type: 'number', state: materialProps.envMapIntensity, min: 0.0, max: 5, group: 'Blob Material' });
  useControl('Clearcoat', { type: 'number', state: materialProps.clearcoat, min: 0.0, max: 1.0, group: 'Blob Material' });
  useControl('Clearcoat rougness', { type: 'number', state: materialProps.clearcoatRoughness, min: 0.0, max: 1.0, group: 'Blob Material' });  
  useControl('Transmission', { type: 'number', state: materialProps.transmission, min: 0, max: 1, group: 'Blob Material' });
  // useControl('Index of Refraction (ior)', { type: 'number', state: materialProps.ior, min: 1.0, max: 2.333, group: 'Blob Material' });
  // useControl('Reflectivity', { type: 'number', state: materialProps.reflectivity, min: 0.0, max: 1.0, group: 'Blob Material' });
  // useControl('Opacity', { type: 'number', state: materialProps.opacity, min: 0.0, max: 1.0, group: 'Blob Material' });
  
  const [selectedGradientIndex, setSelectedGradientIndex] = useQueryState('gradient', 'white');
  useControl('Color', { type: 'color', state: materialProps.color, group: 'Blob Material' });
  // useControl('Use gradient', { type: 'boolean', state: materialProps.useGradient, group: 'Blob Material', onChange: () => material.current.needsUpdate = true });
  useControl('Gradient map', { type: 'select', state: [selectedGradientIndex, setSelectedGradientIndex], items: gradientNames, group: 'Blob Material' });

  useControl('Flat shading', { type: 'boolean', state: materialProps.flatShading, group: 'Blob Material' });
  useControl('Wireframe', { type: 'boolean', state: materialProps.wireframe, group: 'Blob Material' });
  
  
  // const gradientFile = useControl('Gradient file', { type: 'file', loader: new TextureLoader(), group: 'Blob Material' });

  // use uploaded gradient file
  // useEffect(() => {
  //   setSelectedGradient(gradientFile)
  // }, [setSelectedGradient, gradientFile])

  useEffect(() => {
    material.current.needsUpdate = true
  }, [materialProps.flatShading[0]])
  

  // use gradient selected from dropdown
  useEffect(() => {
    setSelectedGradient(gradients[gradientNames.indexOf(selectedGradientIndex)])
  }, [selectedGradientIndex, gradients, setSelectedGradient])
  
  return null
}