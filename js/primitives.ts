import { invalidate, addEffect, applyProps } from 'react-three-fiber';
import { FrameLoop, Globals } from '@react-spring/core';
export * from '@react-spring/core';
import { createHost } from '@react-spring/animated';
import { createStringInterpolator } from '@react-spring/shared/stringInterpolation';
import colorNames from '@react-spring/shared/colors';
import * as THREE from 'three';

const primitives = ['primitive'].concat(Object.keys(THREE).filter(key => /^[A-Z]/.test(key)).map(key => key[0].toLowerCase() + key.slice(1)));

// Let r3f drive the frameloop.
const frameLoop = new FrameLoop(() => invalidate());
addEffect(() => {
  frameLoop.advance();
  return true; // Never stop.
});
Globals.assign({
  createStringInterpolator,
  colorNames,
  frameLoop
});
const host = createHost(primitives, {
  applyAnimatedValues: applyProps
});
const animated = host.animated;

export { animated as a, animated };
//# sourceMappingURL=index.js.map
