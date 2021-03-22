import React, { useState, useRef } from 'react'
import { MeshDepthMaterial, Shader, RGBADepthPacking } from 'three'
import { useFrame } from 'react-three-fiber'

/* eslint import/no-webpack-loader-syntax: off */
import headers from "!raw-loader!glslify-loader!./headers.glsl";
import displacement from "!raw-loader!glslify-loader!./displacement.glsl";

export class MagicalDepthMaterialImpl extends MeshDepthMaterial {
  
  constructor(parameters = { depthPacking: RGBADepthPacking }) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
    this._distort = { value: 0. }
    this._radius = { value: 1 }
    this._frequency = { value: 2 }
    this._speed = { value: 0 }
    
    this._surfaceDistort = { value: 0. }
    this._surfaceFrequency = { value: 0. }
    this._surfaceTime = { value: 0 }
    this._surfaceSpeed = { value: 0 }
    this._numberOfWaves = { value: 5 }

    this._fixNormals = { value: false }
    this._surfacePoleAmount = { value: 1 }
    this._gooPoleAmount = { value: 1 }
  }

  onBeforeCompile(shader: Shader) {
    shader.uniforms.time = this._time
    shader.uniforms.radius = this._radius
    shader.uniforms.distort = this._distort
    shader.uniforms.frequency = this._frequency
    shader.uniforms.surfaceDistort = this._surfaceDistort
    shader.uniforms.surfaceFrequency = this._surfaceFrequency
    shader.uniforms.surfaceTime = this._surfaceTime
    shader.uniforms.numberOfWaves = this._numberOfWaves
    shader.uniforms.fixNormals = this._fixNormals
    shader.uniforms.surfacePoleAmount = this._surfacePoleAmount
    shader.uniforms.gooPoleAmount = this._gooPoleAmount

    shader.vertexShader = `
      ${headers}
      ${shader.vertexShader}
    `

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
        void main() {
          ${displacement}
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <displacementmap_vertex>',
      `transformed = displacedPosition;`
    )
  }

  get time() {
    return this._time.value
  }

  set time(v) {
    this._time.value = v
  }
  
  get distort() {
    return this._distort.value
  }

  set distort(v) {
    this._distort.value = v
  }
  
  get radius() {
    return this._radius.value
  }
  
  set radius(v) {
    this._radius.value = v
  }
  
  get frequency() {
    return this._frequency.value
  }
  
  set frequency(v) {
    this._frequency.value = v
  }
  
  get speed() {
    return this._speed.value
  }
  
  set speed(v) {
    this._speed.value = v
  }

  get surfaceDistort() {
    return this._surfaceDistort.value
  }

  set surfaceDistort(v) {
    this._surfaceDistort.value = v
  }

  get surfaceFrequency() {
    return this._surfaceFrequency.value
  }

  set surfaceFrequency(v) {
    this._surfaceFrequency.value = v
  }

  get surfaceTime() {
    return this._surfaceTime.value
  }

  set surfaceTime(v) {
    this._surfaceTime.value = v
  }

  get surfaceSpeed() {
    return this._surfaceSpeed.value
  }
  
  set surfaceSpeed(v) {
    this._surfaceSpeed.value = v
  }

  get numberOfWaves() {
    return this._numberOfWaves.value
  }
  
  set numberOfWaves(v) {
    this._numberOfWaves.value = v
  }

  get fixNormals() {
    return this._fixNormals.value
  }
  
  set fixNormals(v) {
    this._fixNormals.value = v
  }

  get surfacePoleAmount() {
    return this._surfacePoleAmount.value
  }
  
  set surfacePoleAmount(v) {
    this._surfacePoleAmount.value = v
  }

  get gooPoleAmount() {
    return this._gooPoleAmount.value
  }
  
  set gooPoleAmount(v) {
    this._gooPoleAmount.value = v
  }
}

const fpsInterval = 1000 / 60;
export const MagicalDepthMaterial = React.forwardRef((props, ref) => {
  const [material] = useState(() => new MagicalDepthMaterialImpl())
  const local = useRef({ lastFrame: 0 }).current
  useFrame(({ clock }) => {
    // calc elapsed time since last frame
    const now = clock.getElapsedTime() * 1000
    const delta = now - local.lastFrame;
    
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    local.lastFrame = now - (delta % fpsInterval);

    // draw
    material.time += 0.001 * 0.5 * delta * material.speed
    material.surfaceTime += 0.001 * 0.5 * delta * material.surfaceSpeed
  })
  return <primitive dispose={undefined} object={material} ref={ref} attach="customDepthMaterial" {...props} />
})

export default MagicalDepthMaterial