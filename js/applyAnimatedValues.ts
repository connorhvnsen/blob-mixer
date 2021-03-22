import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { Globals as Globals$1 } from '@react-spring/core';
export * from '@react-spring/core';
import { unstable_batchedUpdates } from 'react-dom';
import { createStringInterpolator } from '@react-spring/shared/stringInterpolation';
import colorNames from '@react-spring/shared/colors';
import { AnimatedObject, createHost } from '@react-spring/animated';
import { Globals, each, is, toArray, FluidValue, getFluidValue, getFluidConfig } from '@react-spring/shared';

const isCustomPropRE = /^--/;

function dangerousStyleValue(name, value) {
  if (value == null || typeof value === 'boolean' || value === '') return '';
  if (typeof value === 'number' && value !== 0 && !isCustomPropRE.test(name) && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers

  return ('' + value).trim();
}

const attributeCache = {};
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }

  const isFilterElement = instance.nodeName === 'filter' || instance.parentNode && instance.parentNode.nodeName === 'filter';

  const _ref = props,
        {
    style,
    children,
    scrollTop,
    scrollLeft
  } = _ref,
        attributes = _objectWithoutPropertiesLoose(_ref, ["style", "children", "scrollTop", "scrollLeft"]);

  const values = Object.values(attributes);
  const names = Object.keys(attributes).map(name => isFilterElement || instance.hasAttribute(name) ? name : attributeCache[name] || (attributeCache[name] = name.replace(/([A-Z])/g, // Attributes are written in dash case
  n => '-' + n.toLowerCase())));
  Globals.frameLoop.onWrite(() => {
    if (children !== void 0) {
      instance.textContent = children;
    } // Apply CSS styles


    for (let name in style) {
      if (style.hasOwnProperty(name)) {
        const value = dangerousStyleValue(name, style[name]);
        if (name === 'float') name = 'cssFloat';else if (isCustomPropRE.test(name)) {
          instance.style.setProperty(name, value);
        } else {
          instance.style[name] = value;
        }
      }
    } // Apply DOM attributes


    names.forEach((name, i) => {
      instance.setAttribute(name, values[i]);
    });

    if (scrollTop !== void 0) {
      instance.scrollTop = scrollTop;
    }

    if (scrollLeft !== void 0) {
      instance.scrollLeft = scrollLeft;
    }
  });
}
let isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

const prefixKey = (prefix, key) => prefix + key.charAt(0).toUpperCase() + key.substring(1);

const prefixes = ['Webkit', 'Ms', 'Moz', 'O'];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
  prefixes.forEach(prefix => acc[prefixKey(prefix, prop)] = acc[prop]);
  return acc;
}, isUnitlessNumber);

/** The transform-functions
 * (https://developer.mozilla.org/fr/docs/Web/CSS/transform-function)
 * that you can pass as keys to your animated component style and that will be
 * animated. Perspective has been left out as it would conflict with the
 * non-transform perspective style.
 */

const domTransforms = /^(matrix|translate|scale|rotate|skew)/; // These keys have "px" units by default

const pxTransforms = /^(translate)/; // These keys have "deg" units by default

const degTransforms = /^(rotate|skew)/;

/** Add a unit to the value when the value is unit-less (eg: a number) */
const addUnit = (value, unit) => is.num(value) && value !== 0 ? value + unit : value;
/**
 * Checks if the input value matches the identity value.
 *
 *     isValueIdentity(0, 0)              // => true
 *     isValueIdentity('0px', 0)          // => true
 *     isValueIdentity([0, '0px', 0], 0)  // => true
 */


const isValueIdentity = (value, id) => is.arr(value) ? value.every(v => isValueIdentity(v, id)) : is.num(value) ? value === id : parseFloat(value) === id;

/**
 * This AnimatedStyle will simplify animated components transforms by
 * interpolating all transform function passed as keys in the style object
 * including shortcuts such as x, y and z for translateX/Y/Z
 */
class AnimatedStyle extends AnimatedObject {
  constructor(_ref) {
    let {
      x,
      y,
      z
    } = _ref,
        style = _objectWithoutPropertiesLoose(_ref, ["x", "y", "z"]);

    /**
     * An array of arrays that contains the values (static or fluid)
     * used by each transform function.
     */
    const inputs = [];
    /**
     * An array of functions that take a list of values (static or fluid)
     * and returns (1) a CSS transform string and (2) a boolean that's true
     * when the transform has no effect (eg: an identity transform).
     */

    const transforms = []; // Combine x/y/z into translate3d

    if (x || y || z) {
      inputs.push([x || 0, y || 0, z || 0]);
      transforms.push(xyz => ["translate3d(" + xyz.map(v => addUnit(v, 'px')).join(',') + ")", // prettier-ignore
      isValueIdentity(xyz, 0)]);
    } // Pluck any other transform-related props


    each(style, (value, key) => {
      if (key === 'transform') {
        inputs.push([value || '']);
        transforms.push(transform => [transform, transform === '']);
      } else if (domTransforms.test(key)) {
        delete style[key];
        if (is.und(value)) return;
        const unit = pxTransforms.test(key) ? 'px' : degTransforms.test(key) ? 'deg' : '';
        inputs.push(toArray(value));
        transforms.push(key === 'rotate3d' ? ([x, y, z, deg]) => ["rotate3d(" + x + "," + y + "," + z + "," + addUnit(deg, unit) + ")", isValueIdentity(deg, 0)] : input => [key + "(" + input.map(v => addUnit(v, unit)).join(',') + ")", isValueIdentity(input, key.startsWith('scale') ? 1 : 0)]);
      }
    });

    if (inputs.length) {
      style.transform = new FluidTransform(inputs, transforms);
    }

    super(style);
  }

}
/** @internal */

class FluidTransform extends FluidValue {
  constructor(inputs, transforms) {
    super();
    this.inputs = inputs;
    this.transforms = transforms;
    this._value = null;
    this._children = new Set();
  }

  get() {
    return this._value || (this._value = this._get());
  }

  _get() {
    let transform = '';
    let identity = true;
    each(this.inputs, (input, i) => {
      const arg1 = getFluidValue(input[0]);
      const [t, id] = this.transforms[i](is.arr(arg1) ? arg1 : input.map(getFluidValue));
      transform += ' ' + t;
      identity = identity && id;
    });
    return identity ? 'none' : transform;
  }

  addChild(child) {
    if (!this._children.size) {
      // Start observing our inputs once we have an observer.
      each(this.inputs, input => each(input, value => {
        const config = getFluidConfig(value);
        if (config) config.addChild(this);
      }));
    }

    this._children.add(child);
  }

  removeChild(child) {
    this._children.delete(child);

    if (!this._children.size) {
      // Stop observing our inputs once we have no observers.
      each(this.inputs, input => each(input, value => {
        const config = getFluidConfig(value);
        if (config) config.removeChild(this);
      }));
    }
  }

  onParentChange(event) {
    if (event.type == 'change') {
      this._value = null;
    }

    each(this._children, child => {
      child.onParentChange(event);
    });
  }

}

const primitives = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

Globals$1.assign({
  colorNames,
  createStringInterpolator,
  batchedUpdates: unstable_batchedUpdates
});
const host = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: style => new AnimatedStyle(style),
  getComponentProps: (_ref) => {
    let props = _objectWithoutPropertiesLoose(_ref, ["scrollTop", "scrollLeft"]);

    return props;
  }
});
const animated = host.animated;

export { animated as a, animated };
//# sourceMappingURL=index.js.map
