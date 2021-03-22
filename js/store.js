import qs from 'query-string'
import create from 'zustand'
import { MathUtils } from 'three'

function mod(n, m) {
  return ((n % m) + m) % m;
}

export function parseState(search = window.location.search) {
  return qs.parse(search, { parseNumbers: true, parseBooleans: true, arrayFormat: 'index', skipNull: true });
}


export const useBlobStore = create(set => ({
  ...parseState(),
}))


export const updateBlobState = (querystate) => {
    const state = parseState(querystate)
    useBlobStore.setState(state, true)
}

const disco = '?ambient=0&angle1=0.42&angle2=0.52&angle3=0.39&ccRougness=0.14&clearColor=rgba%28118%2C0%2C240%2C1%29&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=9.53&dist3=8.2&distort=0&dynEnv=false&envMap=0&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=0.06&gradient=rainbow&int1=1.27&int2=3&int3=2&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=1&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0&rshad=false&scale=1.04&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1.08&surfaceDistort=3.1&surfaceFrequency=0.28&surfaceSpeed=0.42&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.2&x4=3.07&y1=0.07&y2=-6.67&y3=2.67&z1=1.93&z2=5.73&z3=4.6&z4=3.53&z5=6.2'
const blackhole = '?ambient=0&angle1=0.29&clearColor=%231f1f1f&clearcoat=1&color1=%23e5eafa&dist1=8.13&distort=0.1&dynEnv=false&envMap=0.18&frequency=0.23&int1=0.57&int2=0.5&int3=0&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&roughness=0.2&rshad=false&segments=512&shadow1=false&shadowMap=false&speed=0.56&surfaceDistort=0&surfaceFrequency=0.46&surfaceSpeed=0.34&transmission=0&uv=true&x2=2.07&y1=3.2&y2=-2.67&z1=-5.07&z2=-3.87'
const cherry = '?ambient=0.1&angle1=0.42&angle2=0.55&angle3=0.46&ccRougness=0.63&clearColor=%238b2664&clearcoat=0.6&color=%23ffd1ec&color1=%23ffffff&color2=%23ffc6d9&color3=%23be6f8a&decay1=0&decay2=0.24&dist1=12.33&dist2=20&dist3=7.73&distort=0.26&dynEnv=false&envMap=0&frequency=0.09&gradient=white&int1=0.03&int2=0.87&int3=1.52&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&noise=0.22&numWaves=4.55&penum1=0.8&penum2=0.77&poleAmount=0&pp=false&roughness=0.28&rshad=false&rx=1.22&ry=-4.78&rz=-0.76&scale=0.5&scanline=0.03&segments=512&set=%28prop%2C%20val%29%20%3D%3E%20set%28%7B%0A%20%20%20%20%5Bprop%5D%3A%20val%0A%20%20%7D%29&shadow1=false&shadowFocus1=0.45&shadowMap=false&speed=1.95&surfaceDistort=10&surfaceFrequency=3.47&surfaceSpeed=0&transmission=0&useGradient=true&x1=2.07&x2=-0.07&x3=0.6&y1=7.8&y2=-3.47&y3=4.93&z1=-8.2&z2=10&z3=-1.47'
const silkworm = '?ambient=0&angle1=0.45&angle2=0.5&angle3=0.45&ccRougness=0&clearColor=rgba%2838%2C57%2C108%2C1%29&clearcoat=0&color=%23ffffff&color1=rgba%280%2C255%2C248%2C1%29&color2=%23886fff&color3=%237897ff&decay1=1&decay3=0&dist1=6.87&dist2=5.93&dist3=6.27&distort=0.5&dynEnv=false&envMap=4.62&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0.37&floorY=-0.4&frequency=2.01&gradient=white&int1=0.42&int2=0.83&int3=0.57&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=3.09&penum1=0.66&penum3=1&reflectivity=0.53&roughness=0.42&rshad=false&scale=1&segments=512&shadow1=false&shadowFocus1=1&shadowMap=false&sky=false&surfaceDistort=1.13&surfaceFrequency=0.86&surfaceSpeed=0.48&transmission=0&useGradient=true&x1=-4.2&x2=0.47&x3=0.33&y1=3.13&y2=1.2&y3=-1.33&z1=1.13&z2=4.07&z3=4.8'
const freshwater = '?ambient=0&angle1=0.32&angle2=0.52&angle3=0.41&ccRougness=0&clearColor=rgba%2845%2C76%2C160%2C1%29&clearcoat=0&color1=rgba%280%2C188%2C255%2C1%29&color2=rgba%280%2C67%2C255%2C1%29&color3=rgba%280%2C120%2C255%2C1%29&decay1=0.47&dist1=6.13&dist2=4.8&dist3=5.4&distort=0.05&dynEnv=false&envMap=5&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0.37&floorY=-0.4&frequency=0.03&gradient=white&int1=1.37&int2=1.43&int3=2.58&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.5&numWaves=2.14&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0&rshad=false&rx=-2.89&ry=0.35&rz=1.19&scale=0.95&segments=512&set=%28prop%2C%20val%29%20%3D%3E%20set%28%7B%0A%20%20%20%20%5Bprop%5D%3A%20val%0A%20%20%7D%29&shadow1=false&shadow3=false&shadowFocus1=1&shadowMap=false&sky=false&speed=3&surfaceDistort=1.73&surfaceFrequency=1.51&surfaceSpeed=0.66&transmission=1&useGradient=true&x1=-1.93&x2=2.13&x3=-2.2&y1=4.53&y2=1.2&y3=-3.07&z1=1.2&z2=2.73&z3=1.47'
const t1000 = '?ambient=0.19&angle1=0.36&angle2=0.29&angle3=0.36&ccRougness=0&clearcoat=1&color1=rgba%28236%2C176%2C239%2C1%29&color2=rgba%28225%2C247%2C252%2C1%29&color3=rgba%280%2C255%2C220%2C1%29&dist1=6&dist3=6.93&distort=0.63&dynEnv=false&envMap=0.6&frequency=0.92&int1=0.75&int2=1.2&int3=0.23&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.88&numWaves=2.71&penum3=1&roughness=0.27&rshad=false&scale=0.85&segments=512&shadow1=false&shadowMap=false&surfPoleAmount=1&surfaceDistort=1.8&surfaceSpeed=0.33&transmission=0&useGradient=true&x2=-3.6&x3=2.67&y2=4.27&y3=-2.73&z2=2.6&z3=2.2'
const firefly = '?ambient=0.35&angle1=0.54&angle2=0.54&angle3=0.31&clearColor=rgba%2856%2C11%2C22%2C1%29&clearcoat=0&color1=rgba%28237%2C0%2C255%2C1%29&color2=%23e4b85d&color3=rgba%284%2C190%2C238%2C1%29&decay1=0&dist1=4.2&dist2=3.73&dist3=5.13&distort=0.26&dynEnv=false&frequency=0.49&gradient=passion&int1=2.65&int2=5&int3=1.75&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&noise=0.22&numWaves=1&penum2=0.5&poleAmount=0&roughness=1&rshad=false&rx=0.75&ry=-0.26&rz=0.1&scale=1&scanline=0.03&segments=512&set=%28prop%2C%20val%29%20%3D%3E%20set%28%7B%0A%20%20%20%20%5Bprop%5D%3A%20val%0A%20%20%7D%29&shadow1=false&shadowMap=false&speed=1.95&surfaceDistort=2.4&surfaceFrequency=0.19&surfaceSpeed=1.47&transmission=0&useGradient=true&uv=false&x1=-1.6&x2=0&x3=4&y1=3.73&y2=0.07&y3=-2.93&z1=-1&z2=2.67&z3=2.13'
const ghost = '?ambient=0&angle1=0.32&angle2=0.52&angle3=0.26&ccRougness=0.26&clearColor=rgba%28105%2C87%2C122%2C1%29&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%280%2C120%2C255%2C1%29&decay1=1&dist1=6.87&dist2=3.2&dist3=8.2&distort=0.7&dynEnv=false&envMap=5&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0.37&floorY=-0.4&frequency=0.58&gradient=rainbow&int1=0.98&int2=3.87&int3=2.68&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.28&numWaves=5.5&penum1=0.66&penum3=1&reflectivity=0.53&roughness=0.31&rshad=false&scale=0.88&segments=512&shadow1=false&shadowFocus1=1&shadowMap=false&sky=false&surfaceDistort=1.43&surfaceFrequency=0.36&surfaceSpeed=0.68&transmission=1&useGradient=true&uv=false&x1=-2.27&x2=0.47&x3=-2.2&y1=4.53&y2=1.2&y3=-3.07&z1=-0.2&z2=2.73&z3=-5.73'
const butterfly = '?ambient=0&angle1=0.63&angle2=0.21&angle3=0.1&ccRougness=0.14&clearColor=%23080036&clearcoat=1&color1=rgba%28255%2C255%2C255%2C1%29&color2=rgba%28255%2C255%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=11.8&dist3=11.33&distort=0&dynEnv=false&envMap=0&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=0.06&gradient=deep-ocean&int1=2.37&int2=1.98&int3=3&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=1&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0&rshad=false&rx=-0.48&ry=-1.15&rz=3.19&scale=0.62&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1.08&surfPoleAmount=1&surfaceDistort=10&surfaceFrequency=5&surfaceSpeed=0.42&transmission=0&useGradient=true&uv=true&x1=-2.2&x2=-2.73&x3=2.87&x4=3.07&y1=2.73&y2=-3.53&y3=1.67&z1=-1.8&z2=5.73&z3=6.73&z4=3.53&z5=6.2'
const slime = '?ambient=0&angle1=0.42&angle2=0.52&angle3=0.34&ccRougness=0&clearColor=%23476f24&clearcoat=0&color=%23a9db80&color1=%23ffffff&color2=%23f3f2f5&color3=%23ffffff&decay1=1&dist1=8.27&dist2=9.53&dist3=8.53&distort=0.52&dynEnv=false&envMap=0.95&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=1.52&gradient=lucky-day&int1=0.85&int2=0.95&int3=0.85&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.1&numWaves=1&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0.31&rshad=false&ry=1.53&scale=0.91&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=0.33&surfaceDistort=3&surfaceFrequency=0.64&surfaceSpeed=0.33&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.47&x4=3.07&y1=0.07&y2=-6.67&y3=1.67&z1=1.93&z2=5.73&z3=5.4&z4=3.53&z5=6.2'
const molten = '?ambient=0.4&angle1=0.88&angle2=0.27&angle3=0.36&ccRougness=0&clearColor=%231b1a10&clearcoat=1&color=%23edbe32&color1=%23f3c278&color2=%23ecebe4&color3=%23fcfdfd&decay1=0.04&dist1=6&dist3=6.93&distort=0&dynEnv=false&envMap=0.87&frequency=2.11&int1=1.82&int2=2.62&int3=0.13&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.8&numWaves=2.2&penum3=1&pp=false&roughness=0.2&rshad=false&scale=1.04&segments=512&shadow1=false&shadowMap=false&speed=0.29&surfPoleAmount=0&surfaceDistort=1.5&surfaceFrequency=0.43&surfaceSpeed=0.16&transmission=0&useGradient=true&uv=true&x1=2.4&x2=-5.07&x3=2.67&y1=5&y2=-2.2&y3=-2.73&z2=2.53&z3=2.2'
const devour = '?ambient=0.15&angle1=0.3&angle2=0.2&angle3=0.36&ccRougness=0&clearColor=%23050505&clearcoat=1&color=%237e2116&color1=%23ffffd3&color2=%23ecebe4&color3=%23fcfdfd&decay1=0.44&decay2=0.51&dist1=5&dist3=6.93&distort=0&dynEnv=false&envMap=0.87&frequency=1.19&gradient=passion&int1=1.05&int2=2.62&int3=0&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.28&numWaves=0.07&penum1=0.75&penum2=1&penum3=1&pp=false&roughness=0.86&rshad=false&rx=0.43&ry=3.16&scale=1.04&segments=512&shadow1=false&shadowMap=false&speed=0.29&surfPoleAmount=0&surfaceDistort=10&surfaceFrequency=0.19&surfaceSpeed=1.99&transmission=0&useGradient=true&uv=true&x1=2.4&x2=-5.07&x3=2.67&y1=3.6&y2=-1.6&y3=-2.73&z2=2.53&z3=2.2'
const lips = '?ambient=0.31&angle1=0.77&angle2=0.27&angle3=0.39&ccRougness=0&clearColor=%23180075&clearcoat=1&color=%239509fc&color1=%23ff8600&color2=%23637cff&color3=%230700ff&decay1=0.04&decay3=0.45&dist1=11.4&dist2=6.47&dist3=4.13&distort=0.21&dynEnv=false&envMap=0.87&frequency=0.26&gradient=sunset-vibes&int1=1.5&int2=3.6&int3=1.4&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.28&numWaves=0.07&penum1=0.11&penum3=1&poleAmount=0&pp=false&roughness=0.86&rshad=false&rx=-0.29&ry=3.16&scale=1.04&segments=512&shadow1=false&shadowMap=false&speed=0&surfPoleAmount=0&surfaceDistort=10&surfaceFrequency=3.92&surfaceSpeed=3&transmission=0&useGradient=true&uv=true&x1=0.53&x2=-5.6&x3=3.2&y1=2.6&y2=-4.27&y3=-0.93&z1=0.67&z2=1.27&z3=0.47'
const rosebud = '?ambient=0.2&angle1=0.25&angle2=0.48&angle3=0.37&ccRougness=0.14&clearColor=%235480a0&clearcoat=0&color1=rgba%28255%2C255%2C255%2C1%29&color2=%23ffffff&color3=%23fff8fc&decay1=0.5&decay2=0&decay3=0.76&dist1=8.67&dist2=5.13&dist3=10.6&distort=0.38&dynEnv=false&envMap=0&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=0.09&gradient=cosmic-fusion&int1=1.47&int2=1&int3=1&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=6.13&opacity=1&penum1=1&penum3=1&poleAmount=0.45&reflectivity=1&roughness=1&rshad=false&rx=-0.16&ry=-1.64&rz=-0.03&scale=0.89&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1&surfPoleAmount=0.51&surfaceDistort=3.97&surfaceFrequency=0.51&surfaceSpeed=0.1&transmission=0&useGradient=true&uv=false&x1=0&x2=0&x3=0&x4=3.07&y1=4.27&y2=-3.87&y3=9.4&z1=7.73&z2=-2.6&z3=-2.67&z4=3.53&z5=6.2'
const metalness = '?ambient=0&angle1=0.42&angle2=0.52&angle3=0.39&ccRougness=0.63&clearColor=%23371b53&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=9.53&dist3=8.2&distort=0&dynEnv=false&envMap=5&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=3.05&gradient=cosmic-fusion&int1=1.27&int2=3&int3=2&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=1&numWaves=12.07&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0.36&rshad=false&ry=3.16&scale=1.04&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1.62&surfPoleAmount=1&surfaceDistort=1.4&surfaceFrequency=1.74&surfaceSpeed=0.32&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.2&x4=3.07&y1=0.07&y2=-6.67&y3=2.67&z1=1.93&z2=5.73&z3=4.6&z4=3.53&z5=6.2'
const twistertoy = 'https://blobmixer.14islands.com/view?ambient=0&angle1=0.42&angle2=0.52&angle3=0.39&ccRougness=0&clearColor=%23536c9b&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=9.53&dist3=8.2&distort=0&dynEnv=false&envMap=5&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=3.05&gradient=deep-ocean&int1=1.27&int2=3&int3=2&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=1&numWaves=7.2&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0.72&rshad=false&rx=1.27&ry=3.16&rz=0.73&scale=0.9&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1.62&surfPoleAmount=1&surfaceDistort=3.27&surfaceFrequency=5&surfaceSpeed=0.33&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.2&x4=3.07&y1=0.07&y2=-6.67&y3=2.67&z1=1.93&z2=5.73&z3=4.6&z4=3.53&z5=6.2'

export const useUIStore = create(set => ({
  blobs: [disco, t1000, freshwater, ghost, twistertoy, firefly, blackhole, slime, lips, metalness, rosebud, molten, devour, cherry, butterfly, silkworm],
  titles: ['Discobrain', 'T-1000', 'Freshwater',  'Ghost', 'Twistertoy', 'Firefly', 'Blackhole', 'Slimebag', 'Lipsync', 'Metalness', 'Rosebud', 'Molten', 'Devour', 'Cherry', 'Butterfly', 'Silkworm'],
  pageWidthRatio: 0.5,

  capture: false,
  showControls: false,
  aboutOpen: false,

  mouse: { x: 0, y: 0 },
  vx: 0,

  isGallery: false,
  isRemix: false,
  targetX: window.innerWidth/2,
  currentPage: 0,
  currentPageUnlimited: 0,
  currentPageDistance: 0,
  currentPageFactor: 0.5,
  currentPageX: 0,
  totalProgress: 0,

  textParallax: 0,

  isVR: false,

  // lerps towards current page center
  snapX: (lerp) => set(state => {
    const targetX = MathUtils.lerp(state.targetX, state.currentPageX + state.textParallax, lerp)
    state.updateTargetX(targetX)
  }),

  // move to next page
  gotoPage: (nextPage) => set(state => {
    const pageWidth = window.innerWidth * state.pageWidthRatio
    const margin = (window.innerWidth - pageWidth) *0.5
    const nextX = margin*2 + nextPage * pageWidth
    state.updateTargetX(nextX)
  }),

  // move to next page
  next: () => set(state => {
    state.gotoPage(state.currentPageUnlimited + 1)
  }),

  // move to previous page
  previous: () => set(state => {
    state.gotoPage(state.currentPageUnlimited - 1)
  }),

  updateTargetX: (targetX) => set(state => {
    if (isNaN(targetX)) targetX = state.targetX
    const pageWidth = window.innerWidth * state.pageWidthRatio
    const margin = (window.innerWidth - pageWidth) *0.5

    const currentPageDistance = (targetX - margin) % pageWidth
    const currentPageFactor = currentPageDistance / pageWidth    
    const currentPageUnlimited = Math.floor((targetX - margin) / pageWidth)
    const currentPage = mod(currentPageUnlimited, state.blobs.length)
    const currentPageX = margin*2 + currentPageUnlimited*pageWidth

    return ({
      targetX,  
      currentPage,
      currentPageUnlimited,
      currentPageDistance,
      currentPageFactor,
      currentPageX,
    })
  }),

}))