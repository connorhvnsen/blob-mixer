import React, { useCallback } from 'react'
import { useFrame } from 'react-three-fiber';

import { useUIStore } from '../../store'

export default function Screenshot ({ postprocess }) {
  var strMime = "image/jpeg";

  const capture = useUIStore(s => s.capture)

  var saveFile = useCallback((strData, filename) => {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    }
  }, [])

  const Capture = ({ postprocess, onCaptured }) => {
    useFrame(({ gl, scene, camera}) => {
      if (!postprocess) {
        gl.render(scene, camera)
      }
      const imgData = gl.domElement.toDataURL(strMime);
      onCaptured(imgData)
    }, 10) // after pp composer or take over renderer for one frame
    return null
  }

  if (!capture) return null
  return (
    <Capture postprocess={postprocess} onCaptured={imgData => {
      saveFile(imgData.replace(strMime, "image/octet-stream"), "my-blob.jpg");
      useUIStore.setState({ capture: false })
    }}/>
  )
}