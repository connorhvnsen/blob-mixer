import { useEffect, useRef } from 'react'

import { useUIStore } from '../../../store'

import s from './Pagination.module.scss'

const Pagination = ({ align, ...props}) => {
  const progress = useRef()
  
  useEffect(() => useUIStore.subscribe(
    totalProgress => {
      if (!progress.current) return
      progress.current.style.transform = `scaleX(${totalProgress})`
    },
    state => state.totalProgress
  ), [progress]) 

  return (
    <div className={s.wrapper}>
      <div ref={progress} className={s.progress}></div>
    </div>
  )
}

export default Pagination