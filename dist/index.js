/*!
 * ez-otp-input v0.0.6
 * (c) Kim Joshua C. Advincula
 * Released under the MIT License.
 */
'use strict';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'EzOtpInput',
  props: {
    value: {
      type: String
    },
    length: {
      type: Number,
      "default": function _default() {
        return 4;
      },
      validator: function validator(v) {
        return v > 0;
      }
    },
    disable: {
      type: Boolean,
      "default": false
    },
    placeholder: {
      type: String,
      "default": '--'
    },
    autoSubmit: {
      type: Boolean,
      "default": true
    }
  },
  data: function data() {
    return {
      otpArray: new Array(this.length),
      validRegex: /^[0-9]$/
    };
  },
  methods: {
    onInput: function onInput(event, refKey) {
      if (!this.validRegex.test(event.data)) {
        event.target.value = '';
        this.$set(this.otpArray, refKey - 1, '');
        return;
      }

      this.$set(this.otpArray, refKey - 1, event.data);

      if (refKey) {
        this.focusInputByRef(refKey + 1);
      }

      this.$emit('input', this.otpArray.join(''));
    },
    onDelete: function onDelete(event, refKey) {
      var val = event.target.value;
      var hasValue = typeof val === 'string' && val.length > 0;
      this.$set(this.otpArray, refKey - 1, '');

      if (refKey && !hasValue) {
        this.$set(this.otpArray, refKey - 2, '');
        this.focusInputByRef(refKey - 1);
      }

      this.$emit('input', this.otpArray.join(''));
    },
    onPaste: function onPaste(event) {
      var clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
      var pastedData = clipboardData.getData('Text');
      var arrayOfNumbers = pastedData.split('').filter(function (v) {
        return !isNaN(parseInt(v));
      }).slice(0, this.length);
      this.otpArray = arrayOfNumbers;
      this.focusInputByRef(arrayOfNumbers.length < this.length ? arrayOfNumbers.length + 1 : this.length);
      this.$emit('input', this.otpArray.join(''));
    },
    focusInputByRef: function focusInputByRef(refKey) {
      var ref = this.$refs["otpInput".concat(refKey)];

      if (ref) {
        ref[0] && ref[0].focus();
      }
    }
  },
  watch: {
    value: function value(to) {
      if (this.autoSubmit && to && to.length === this.length) {
        this.$emit('filled');
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "ez-otp-input"
  }, _vm._l(_vm.length, function (i) {
    return _c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.otpArray[i - 1],
        expression: "otpArray[i - 1]"
      }],
      key: i,
      ref: "otpInput" + i,
      refInFor: true,
      staticClass: "ez-otp-input__field",
      attrs: {
        "type": "number",
        "autofocus": i === 1,
        "placeholder": _vm.placeholder,
        "disabled": _vm.disable
      },
      domProps: {
        "value": _vm.otpArray[i - 1]
      },
      on: {
        "input": [function ($event) {
          if ($event.target.composing) {
            return;
          }

          _vm.$set(_vm.otpArray, i - 1, $event.target.value);
        }, function ($event) {
          return _vm.onInput($event, i);
        }],
        "keydown": [function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "right", 39, $event.key, ["Right", "ArrowRight"])) {
            return null;
          }

          if ('button' in $event && $event.button !== 2) {
            return null;
          }

          $event.preventDefault();
          return _vm.focusInputByRef(i + 1);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "left", 37, $event.key, ["Left", "ArrowLeft"])) {
            return null;
          }

          if ('button' in $event && $event.button !== 0) {
            return null;
          }

          $event.preventDefault();
          return _vm.focusInputByRef(i - 1);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "delete", [8, 46], $event.key, ["Backspace", "Delete", "Del"])) {
            return null;
          }

          return _vm.onDelete($event, i);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"]) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
            return null;
          }

          $event.preventDefault();
        }],
        "paste": function paste($event) {
          $event.preventDefault();
          return _vm.onPaste($event);
        }
      }
    });
  }), 0);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-6fda6877_0", {
    source: ".ez-otp-input__field[data-v-6fda6877]{width:2em;height:2em;text-align:center;border:none;transition:all .3s ease}.ez-otp-input__field[data-v-6fda6877]:not(:first-child){margin-left:.5em}.ez-otp-input__field[data-v-6fda6877]:not(:last-child){margin-right:.5em}.ez-otp-input__field[data-v-6fda6877]:focus{outline:0}.ez-otp-input__field[data-v-6fda6877]::-webkit-inner-spin-button,.ez-otp-input__field[data-v-6fda6877]::-webkit-outer-spin-button{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-6fda6877";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

var EzOtpInput = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var index = {
  install: function install(Vue, options) {
    Vue.component('ez-otp-input', EzOtpInput);
  },
  // Components
  EzOtpInput: EzOtpInput
};

module.exports = index;
