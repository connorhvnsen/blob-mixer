import { useEffect, useRef, useCallback } from 'react'
import { useProgress } from '@react-three/drei'
import { useSpring, config } from 'react-spring/web'

export default function Loader({
  containerStyles,
  innerStyles,
  barStyles,
  dataStyles,
  dataInterpolation = (p: number) => `Loading ${p.toFixed(2)}%`,
  initialState = (active: boolean) => active,
}: Partial<LoaderOptions>) {
  const { active, progress } = useProgress()
  const domEl = useRef(document.querySelector('.loaderprogress'))
  const numberEl = useRef(document.querySelector('.loadernumber'))

  const onChange = useCallback((v) => {
    const percentage = Number(v).toFixed(0)
    const currentValue = parseInt(numberEl.current.textContent, 10)
    numberEl.current.textContent = Math.min(100, Math.max(currentValue, percentage))
  }, [])

  const [_, set] = useSpring(() => ({ val: 0, onChange, config: { tension: 280, friction: 30 } }))

  useEffect(() => {
    // if (!active && !lastProgress.current) return
    set({ val: Math.max(14, progress)})    
  }, [set, progress])

  useEffect(() => {
    if (active && domEl.current && !domEl.current.classList.contains('loading')) {
      domEl.current.classList.add('loading')
    }

  }, [active])

  return null
}