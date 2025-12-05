var p = function() {
  var n = this, o = n.$createElement, s = n._self._c || o;
  return s("div", [n._v(" 我是测试npm组件 ")]);
}, m = [];
function C(n, o, s, d, i, _, a, v) {
  var e = typeof n == "function" ? n.options : n;
  o && (e.render = o, e.staticRenderFns = s, e._compiled = !0), d && (e.functional = !0), _ && (e._scopeId = "data-v-" + _);
  var r;
  if (a ? (r = function(t) {
    t = t || // cached call
    this.$vnode && this.$vnode.ssrContext || // stateful
    this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !t && typeof __VUE_SSR_CONTEXT__ < "u" && (t = __VUE_SSR_CONTEXT__), i && i.call(this, t), t && t._registeredComponents && t._registeredComponents.add(a);
  }, e._ssrRegister = r) : i && (r = v ? function() {
    i.call(
      this,
      (e.functional ? this.parent : this).$root.$options.shadowRoot
    );
  } : i), r)
    if (e.functional) {
      e._injectStyles = r;
      var c = e.render;
      e.render = function(h, u) {
        return r.call(u), c(h, u);
      };
    } else {
      var f = e.beforeCreate;
      e.beforeCreate = f ? [].concat(f, r) : [r];
    }
  return {
    exports: n,
    options: e
  };
}
const $ = {}, l = {};
var R = /* @__PURE__ */ C(
  $,
  p,
  m,
  !1,
  T,
  null,
  null,
  null
);
function T(n) {
  for (let o in l)
    this[o] = l[o];
}
const N = /* @__PURE__ */ function() {
  return R.exports;
}();
export {
  N as TestNpmTest,
  N as default
};
