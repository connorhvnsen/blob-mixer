import React, { useEffect, useState, useLayoutEffect } from 'react'
import copy from 'copy-to-clipboard';
import qs from 'query-string'
import { useHistory } from "react-router-dom";

import { updateBlobState, useBlobStore, useUIStore } from '../../../store'

import s from './Remixer.module.scss'

const Button = ({children, ...props}) => (
  <button className={s.button} {...props}>
    { children }
  </button>
)

function copyToClipboard() {
    const query = useBlobStore.getState()
    const path = qs.stringify(query, {skipNull: true, arrayFormat: 'index'})
    copy(window.location.protocol + '//' + window.location.host + '/view?' + path)
}

const LABEL_SHARE = 'Share'
const LABEL_COPIED = 'URL copied'

const Remixer = () => {
  const history = useHistory();
  const [shareLabel, setShareLabel] = useState(LABEL_SHARE)

  // remix without querystring goes to view (to avoid ugly shares)
  useLayoutEffect(() => {
    const remixWithQuery = window.location.href.includes("remix?")
    if (history && remixWithQuery) {
      history.push('/view' + window.location.search);
    }
  }, [history])

    useEffect(() => {
      let timer
      if (shareLabel !== LABEL_SHARE) {
        timer = setTimeout(() => setShareLabel(LABEL_SHARE), 3000)
      }
      return () => clearTimeout(timer)  
    }, [shareLabel])


    useEffect(() => {
        // update blob if there are query params (history nav)
        window.location.search && updateBlobState()
        document.documentElement.classList.add('remix')
        useUIStore.setState({ showControls: true, isRemix: true })
        return () =>  {
            useUIStore.setState({ showControls: false, isRemix: false })
            document.documentElement.classList.remove('remix')
        }
    }, [])
    return (
        <>
        <div className={s.toolbar}>
            <Button onClick={() => useUIStore.setState({ capture: true})}>Download</Button>
            <Button onClick={() => {
              copyToClipboard()
              setShareLabel(LABEL_COPIED)
            }}>{shareLabel}</Button>
        </div>
        </>
    )
}

export default Remixer