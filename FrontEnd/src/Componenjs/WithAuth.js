"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _router = require("next/router");
var _AuthProvider = require("../providers/AuthProvider");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// src/components/withAuth.tsx

var withAuth = function withAuth(WrappedComponent) {
  var Wrapper = function Wrapper(props) {
    var _useAuth = (0, _AuthProvider.useAuth)(),
      isAuthenticated = _useAuth.isAuthenticated,
      loading = _useAuth.loading;
    var router = (0, _router.useRouter)();
    (0, _react.useEffect)(function () {
      if (!loading) {
        if (!isAuthenticated) {
          // Redirect to login page
          router.replace('/'); // Adjust the path to your login page if different
        }
      }
    }, [isAuthenticated, loading, router]);
    if (loading) {
      // Render a loading indicator or null while checking authentication
      return null;
    }
    if (!isAuthenticated) {
      // Optionally, you can return null or a placeholder
      return null;
    }

    // If authenticated, render the wrapped component
    return /*#__PURE__*/_react.default.createElement(WrappedComponent, props);
  };
  return Wrapper;
};
var _default = exports.default = withAuth;