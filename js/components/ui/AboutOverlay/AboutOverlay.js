import { useCallback, useEffect } from 'react'
import classNames from 'classnames/bind'
import { useTransition } from 'react-spring/three'
import { a } from 'react-spring/web'

import { useUIStore } from '../../../store'

import s from './AboutOverlay.module.scss'
var cx = classNames.bind(s);



const Link = ({ href, children }) => <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>
const ExtLink = ({ href, children }) => <a href={href} target="_blank" rel="noreferrer noopener" data-external>{children}</a>

const Overlay = () => {

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 27) { // ESC
      useUIStore.setState({ aboutOpen: false })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, false)
    return () => window.removeEventListener('keydown', handleKeyDown, false)
  }, [handleKeyDown])

  return (
    <div className={cx(s.overlay)}>
      <svg className={s.btnClose} width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg"
        onClick={() => useUIStore.setState({ aboutOpen: false })}
      >
        <line x1="26.8096" y1="0.353553" x2="1.35376" y2="25.8094" stroke="white"/>
        <line x1="26.1025" y1="25.8094" x2="0.64666" y2="0.353518" stroke="white"/>
      </svg>

      <div className={s.grid}>
        <p>
          The <Link href="https://twitter.com/search?q=%23blobmixer&src=typed_query">#blobmixer</Link> is a toy for creating your own 3D art, view it in VR, download, and share with friends.
        </p>
        <p>
          It was born with the <Link href="https://14islands.com">14islands</Link> brand as an abstraction of islands surrounded by water. The blob is never perfectly round and always changing shape, just like an island that changes with tides and waves.
        </p>
        <p className={s.details}>
          Built using <ExtLink href="https://threejs.org/">three</ExtLink>, <ExtLink href="https://github.com/pmndrs/react-three-fiber">react-three-fiber</ExtLink>, <ExtLink href="https://www.react-spring.io/">react-spring</ExtLink>, <ExtLink href="https://use-gesture.netlify.app/">react-use-gesture</ExtLink>, <ExtLink href="https://github.com/pmndrs/react-three-fiber">@react-three/drei</ExtLink>, <ExtLink href="https://github.com/protectwise/troika/tree/master/packages/troika-three-text">troika-three-text</ExtLink>, <ExtLink href="https://github.com/pmndrs/react-xr">@react-three/xr</ExtLink>, <ExtLink href="https://github.com/birkir/react-three-gui">react-three-gui</ExtLink>, <ExtLink href="https://github.com/pmndrs/react-postprocessing">@react-three/postprocessing</ExtLink>, <ExtLink href="https://github.com/RenaudRohlinger/r3f-perf">r3f-perf</ExtLink>, <ExtLink href="https://github.com/pmndrs/zustand">zustand</ExtLink>. Environment map photo by <ExtLink href="http://www.flickr.com/photos/jonragnarsson/2294472375/">Jón Ragnarsson</ExtLink>. Thank you all 💜 <a className={s.licence} target="_blank" rel="license noreferrer noopener" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style={{borderWidth:0}} src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a>
        </p>
      </div>
    </div>
  )
}

export default function AboutOverlay() {
  const isOpen = useUIStore(s => s.aboutOpen)

  // useTransition makes FPS 120 :scream:
  const transition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 }
  })

  const fragment = transition((style, item) => {
      return item && <a.div  style={style}><Overlay/></a.div>
  })
  return fragment
}