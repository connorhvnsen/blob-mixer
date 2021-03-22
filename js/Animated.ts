import { defineHidden, is, createInterpolator, each, getFluidConfig, isAnimatedString, useForceUpdate } from '@react-spring/shared';
import _extends from '@babel/runtime/helpers/esm/extends';
import { frameLoop } from '@react-spring/shared/globals';
import { forwardRef, useRef, createElement } from 'react';
import { useLayoutEffect } from 'react-layout-effect';

const $node = Symbol.for('Animated:node');
const isAnimated = value => !!value && value[$node] === value;
/** Get the owner's `Animated` node. */

const getAnimated = owner => owner && owner[$node];
/** Set the owner's `Animated` node. */

const setAnimated = (owner, node) => defineHidden(owner, $node, node);
/** Get every `AnimatedValue` in the owner's `Animated` node. */

const getPayload = owner => owner && owner[$node] && owner[$node].getPayload();
class Animated {
  /** The cache of animated values */
  constructor() {
    this.payload = void 0;
    // This makes "isAnimated" return true.
    setAnimated(this, this);
  }
  /** Get the current value. Pass `true` for only animated values. */


  /** Get every `AnimatedValue` used by this node. */
  getPayload() {
    return this.payload || [];
  }

}

/** An animated number or a native attribute value */

class AnimatedValue extends Animated {
  constructor(_value) {
    super();
    this._value = _value;
    this.done = true;
    this.elapsedTime = void 0;
    this.lastPosition = void 0;
    this.lastVelocity = void 0;
    this.v0 = void 0;

    if (is.num(this._value)) {
      this.lastPosition = this._value;
    }
  }

  static create(from, _to) {
    return new AnimatedValue(from);
  }

  getPayload() {
    return [this];
  }

  getValue() {
    return this._value;
  }
  /**
   * Set the current value and optionally round it.
   *
   * The `step` argument does nothing whenever it equals `undefined` or `0`.
   * It works with fractions and whole numbers. The best use case is (probably)
   * rounding to the pixel grid with a step of:
   *
   *      1 / window.devicePixelRatio
   */


  setValue(value, step) {
    if (is.num(value)) {
      this.lastPosition = value;

      if (step) {
        value = Math.round(value / step) * step;

        if (this.done) {
          this.lastPosition = value;
        }
      }
    }

    if (this._value === value) {
      return false;
    }

    this._value = value;
    return true;
  }

  reset() {
    const {
      done
    } = this;
    this.done = false;

    if (is.num(this._value)) {
      this.elapsedTime = 0;
      this.lastPosition = this._value;
      if (done) this.lastVelocity = null;
      this.v0 = null;
    }
  }

}

class AnimatedString extends AnimatedValue {
  constructor(from, to) {
    super(0);
    this._value = void 0;
    this._string = null;
    this._toString = void 0;
    this._toString = createInterpolator({
      output: [from, to]
    });
  }

  static create(from, to = from) {
    if (is.str(from) && is.str(to)) {
      return new AnimatedString(from, to);
    }

    throw TypeError('Expected "from" and "to" to be strings');
  }

  getValue() {
    let value = this._string;
    return value == null ? this._string = this._toString(this._value) : value;
  }

  setValue(value) {
    if (!is.num(value)) {
      this._string = value;
      this._value = 1;
    } else if (super.setValue(value)) {
      this._string = null;
    } else {
      return false;
    }

    return true;
  }

  reset(goal) {
    if (goal) {
      this._toString = createInterpolator({
        output: [this.getValue(), goal]
      });
    }

    this._value = 0;
    super.reset();
  }

}

const TreeContext = {
  current: null
};

/** An object containing `Animated` nodes */
class AnimatedObject extends Animated {
  constructor(source = null) {
    super();
    this.source = void 0;
    this.setValue(source);
  }

  getValue(animated) {
    if (!this.source) return null;
    const values = {};
    each(this.source, (source, key) => {
      if (isAnimated(source)) {
        values[key] = source.getValue(animated);
      } else {
        const config = getFluidConfig(source);

        if (config) {
          values[key] = config.get();
        } else if (!animated) {
          values[key] = source;
        }
      }
    });
    return values;
  }
  /** Replace the raw object data */


  setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  }

  reset() {
    if (this.payload) {
      each(this.payload, node => node.reset());
    }
  }
  /** Create a payload set. */


  _makePayload(source) {
    if (source) {
      const payload = new Set();
      each(source, this._addToPayload, payload);
      return Array.from(payload);
    }
  }
  /** Add to a payload set. */


  _addToPayload(source) {
    const config = getFluidConfig(source);

    if (config && TreeContext.current) {
      TreeContext.current.dependencies.add(source);
    }

    const payload = getPayload(source);

    if (payload) {
      each(payload, node => this.add(node));
    }
  }

}

/** An array of animated nodes */
class AnimatedArray extends AnimatedObject {
  constructor(from, to) {
    super(null);
    this.source = void 0;
    super.setValue(this._makeAnimated(from, to));
  }

  static create(from, to) {
    return new AnimatedArray(from, to);
  }

  getValue() {
    return this.source.map(node => node.getValue());
  }

  setValue(newValue) {
    const payload = this.getPayload(); // Reuse the payload when lengths are equal.

    if (newValue && newValue.length == payload.length) {
      each(payload, (node, i) => node.setValue(newValue[i]));
    } else {
      // Remake the payload when length changes.
      this.source = this._makeAnimated(newValue);
      this.payload = this._makePayload(this.source);
    }
  }
  /** Convert the `from` and `to` values to an array of `Animated` nodes */


  _makeAnimated(from, to = from) {
    return from ? from.map((from, i) => (isAnimatedString(from) ? AnimatedString : AnimatedValue).create(from, to[i])) : [];
  }

}

class AnimatedProps extends AnimatedObject {
  /** Equals true when an update is scheduled for "end of frame" */
  constructor(update) {
    super(null);
    this.update = update;
    this.dirty = false;
  }

  setValue(props, context) {
    if (!props) return; // The constructor passes null.

    if (context) {
      TreeContext.current = context;

      if (props.style) {
        const {
          createAnimatedStyle
        } = context.host;
        props = _extends(_extends({}, props), {}, {
          style: createAnimatedStyle(props.style)
        });
      }
    }

    super.setValue(props);
    TreeContext.current = null;
  }
  /** @internal */


  onParentChange({
    type
  }) {
    if (!this.dirty && type === 'change') {
      this.dirty = true;
      frameLoop.onFrame(() => {
        this.dirty = false;
        this.update();
      });
    }
  }

}

const withAnimated = (Component, host) => forwardRef((rawProps, ref) => {
  const instanceRef = useRef(null);
  const hasInstance = // Function components must use "forwardRef" to avoid being
  // re-rendered on every animation frame.
  !is.fun(Component) || Component.prototype && Component.prototype.isReactComponent;
  const forceUpdate = useForceUpdate();
  const props = new AnimatedProps(() => {
    const instance = instanceRef.current;

    if (hasInstance && !instance) {
      return; // The wrapped component forgot to forward its ref.
    }

    const didUpdate = instance ? host.applyAnimatedValues(instance, props.getValue(true)) : false; // Re-render the component when native updates fail.

    if (didUpdate === false) {
      forceUpdate();
    }
  });
  const dependencies = new Set();
  props.setValue(rawProps, {
    dependencies,
    host
  });
  useLayoutEffect(() => {
    each(dependencies, dep => dep.addChild(props));
    return () => each(dependencies, dep => dep.removeChild(props));
  });
  return /*#__PURE__*/createElement(Component, _extends({}, host.getComponentProps(props.getValue()), {
    ref: hasInstance && (value => {
      instanceRef.current = updateRef(ref, value);
    })
  }));
});

function updateRef(ref, value) {
  if (ref) {
    if (is.fun(ref)) ref(value);else ref.current = value;
  }

  return value;
}

// For storing the animated version on the original component
const cacheKey = Symbol.for('AnimatedComponent');
const createHost = (components, {
  applyAnimatedValues = () => false,
  createAnimatedStyle = style => new AnimatedObject(style),
  getComponentProps = props => props
} = {}) => {
  const hostConfig = {
    applyAnimatedValues,
    createAnimatedStyle,
    getComponentProps
  };

  const animated = Component => {
    const displayName = getDisplayName(Component) || 'Anonymous';

    if (is.str(Component)) {
      Component = withAnimated(Component, hostConfig);
    } else {
      Component = Component[cacheKey] || (Component[cacheKey] = withAnimated(Component, hostConfig));
    }

    Component.displayName = "Animated(" + displayName + ")";
    return Component;
  };

  each(components, (Component, key) => {
    if (!is.str(key)) {
      key = getDisplayName(Component);
    }

    animated[key] = animated(Component);
  });
  return {
    animated
  };
};

const getDisplayName = arg => is.str(arg) ? arg : arg && is.str(arg.displayName) ? arg.displayName : is.fun(arg) && arg.name || null;

export { Animated, AnimatedArray, AnimatedObject, AnimatedProps, AnimatedString, AnimatedValue, createHost, getAnimated, getPayload, isAnimated, setAnimated };
//# sourceMappingURL=index.js.map
