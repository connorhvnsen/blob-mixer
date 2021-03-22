import { useRef, useState, useEffect } from 'react'

import s from './VRButton.module.scss'

import { useUIStore } from '../../store'

export default function VRButton({ gl }) {
    const button = useRef()
    const xrSession = useRef(null);
    const [isSupported, setIsSupported] = useState(false)
    const [message, setMessage] = useState('')


    const onSessionStarted = async ( session ) => {

        session.addEventListener( 'end', onSessionEnded );

        setMessage('Exit VR');
        await gl.xr.setSession( session );
        xrSession.current = session;
        useUIStore.setState({ isVR: true })
    }

    function onSessionEnded( /*event*/ ) {
        xrSession.current.removeEventListener( 'end', onSessionEnded );
        setMessage('View in VR');
        xrSession.current = null;

    }

    function showEnterVR() {
        setMessage('View in VR');
        setIsSupported(true)
        useUIStore.setState({ isVR: false })
    }

    function toggleVR() {
        if (!xrSession.current) {
            // WebXR's requestReferenceSpace only works if the corresponding feature
            // was requested at session creation time. For simplicity, just ask for
            // the interesting ones as optional features, but be aware that the
            // requestReferenceSpace call will fail if it turns out to be unavailable.
            // ('local' is always available for immersive sessions and doesn't need to
            // be requested separately.)
            const sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ] };
            navigator.xr.requestSession( 'immersive-vr', sessionInit ).then(onSessionStarted);
        } else {
            xrSession.current.end();
        }
    };

    function showWebXRNotFound() {
        setMessage('Try in VR')
    }

    
    useEffect(() => {
        if ( 'xr' in navigator ) {
            navigator.xr.isSessionSupported( 'immersive-vr' ).then( function ( supported ) {
                supported ? showEnterVR() : showWebXRNotFound();
            });
        } else {
            setMessage('Try in VR');
        }
    }, [])

    return (
        <div className={s.position}>
            { !isSupported && (
                <div className={s.notSupported}>
                    <a href="https://immersiveweb.dev/" target="_blank" rel="noopener noreferrer" className={s.notSupportedLink}>{message}</a>
                    <svg width="29" height="13" viewBox="0 0 29 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={s.hmd} d="M25.9057 2.63583L25.9056 2.63582V2.64802V9.91164C25.9056 11.0668 25.0463 11.9366 24.1227 11.9366H18.5294H18.4948C17.7701 11.9366 17.1 11.5083 16.7255 10.7894C16.7253 10.7889 16.725 10.7883 16.7247 10.7878L15.8971 9.16711C15.3047 7.9859 13.6882 7.92735 13.0411 9.11756L12.1776 10.6719C11.7374 11.4643 10.9615 11.9366 10.1589 11.9366H4.87685C3.95326 11.9366 3.09399 11.0668 3.09399 9.91164V2.64802C3.09399 1.48769 3.92332 0.623047 4.87685 0.623047H24.1573C25.0862 0.623047 25.9344 1.46183 25.9057 2.63583Z" stroke="white"/>
                        <path d="M27.5471 2.61353V7.90559L28.9998 7.5943V2.95941L27.5471 2.61353Z" fill="white"/>
                        <path d="M0 7.55967L1.45272 7.87096V2.64807L0 2.95937V7.55967Z" fill="white"/>
                    </svg>
                </div>
            )}
            { isSupported && <button className={s.button} ref={button} onClick={toggleVR}>{message}</button> }
        </div>
    )
}