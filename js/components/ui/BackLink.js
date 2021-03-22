import { Link } from "react-router-dom";
import classNames from 'classnames/bind'

import { useUIStore } from '../../store'

import s from './BackLink.module.scss'
var cx = classNames.bind(s);

const BackLink = ({ align, ...props}) => {
  const isGallery = useUIStore(s => s.isGallery)

  return (
      <Link to="/" data-external className={cx(s.wrapper, { isGallery })}>
        <svg className={s.icon} width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.8534 18C9.96375 18 9.25206 18 8.58484 18C7.20593 13.7494 4.62603 10.8 -1.18311e-06 9.71566C-1.1414e-06 9.23855 -1.0959e-06 8.71807 -1.0466e-06 8.15422C4.49259 7.15663 7.16145 4.2506 8.58484 2.97444e-07C9.25206 3.55774e-07 9.91927 4.14104e-07 10.8534 4.95766e-07C10.1417 3.42651 8.18451 5.89879 5.38221 8.0241C12.5437 8.0241 19.7496 8.0241 27 8.0241C27 8.6747 27 9.15181 27 9.84578C19.7496 9.84578 12.5437 9.84578 5.33773 9.84578C5.29324 9.93253 5.29324 10.0193 5.24876 10.106C8.09555 12.0145 10.0972 14.4867 10.8534 18Z" fill="white"/>
        </svg>
        <h1 className={cx(s.title, 'underlink')}>
          <span className={s.lblGallery}>Blob gallery</span><span className={s.lblMixer}>Blobmixer</span>
        </h1>
      </Link>
  )
}

export default BackLink
