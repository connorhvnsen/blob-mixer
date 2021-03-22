import React from 'react';
import ReactDOM from 'react-dom';

// import './index.css'; // import from html for faster styles
import App from './App';

// import showreelSrc from './assets/14Islands_showreel_Master_V4-HD_min_1280.mp4'

// const Video = ({id, src}) => <video id={id} src={src} loop autoPlay muted playsInline style={{
//       position: 'fixed',
//       top: 0,
//       opacity: 0,
//       // width: '2px',
//       // height: '2px'
//       width: '300px',
//       height: 'auto',
//       pointerEvents: 'none'
//     }}/>

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//     <Video src={showreelSrc} id="showreel" />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// Concurrent
ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <Video src={showreelSrc} id="showreel" /> */}
  </React.StrictMode>
)
