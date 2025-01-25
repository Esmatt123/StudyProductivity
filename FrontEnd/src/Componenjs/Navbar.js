"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _link = _interopRequireDefault(require("next/link"));
var _navbarModule = _interopRequireDefault(require("../Styles/_navbar.module.css"));
var _AuthProvider = require("../providers/AuthProvider");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // Navbar.tsx
var Navbar = function Navbar(_ref) {
  var userId = _ref.userId;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isMenuOpen = _useState2[0],
    setIsMenuOpen = _useState2[1];
  var _useAuth = (0, _AuthProvider.useAuth)(),
    logout = _useAuth.logout;
  var toggleMenu = function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  };
  var closeMenu = function closeMenu() {
    setIsMenuOpen(false);
  };
  return /*#__PURE__*/React.createElement("nav", {
    className: _navbarModule.default.navbar
  }, /*#__PURE__*/React.createElement("div", {
    className: _navbarModule.default.logo
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/",
    passHref: true
  }, "Logo")), /*#__PURE__*/React.createElement("div", {
    className: _navbarModule.default.hamburger,
    onClick: toggleMenu
  }, /*#__PURE__*/React.createElement("span", {
    className: "".concat(_navbarModule.default.bar, " ").concat(isMenuOpen ? _navbarModule.default.active : '')
  }), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_navbarModule.default.bar, " ").concat(isMenuOpen ? _navbarModule.default.active : '')
  }), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_navbarModule.default.bar, " ").concat(isMenuOpen ? _navbarModule.default.active : '')
  })), /*#__PURE__*/React.createElement("div", {
    className: "".concat(_navbarModule.default.navContainer, " ").concat(isMenuOpen ? _navbarModule.default.active : '')
  }, /*#__PURE__*/React.createElement("ul", {
    className: _navbarModule.default.navLinks
  }, /*#__PURE__*/React.createElement("li", {
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/home"
  }, "Home")), /*#__PURE__*/React.createElement("li", {
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/About-Us"
  }, "About")), /*#__PURE__*/React.createElement("li", {
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/faq"
  }, "FAQ")), /*#__PURE__*/React.createElement("li", {
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/contact"
  }, "Contact")), /*#__PURE__*/React.createElement("li", {
    className: _navbarModule.default.profile
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/profile/".concat(userId)
  }, "Profile"), /*#__PURE__*/React.createElement("ul", {
    className: _navbarModule.default.dropdownMenu
  }, /*#__PURE__*/React.createElement("li", {
    onClick: function onClick() {
      closeMenu();
      logout();
    }
  }, /*#__PURE__*/React.createElement("span", null, "Logout")))))));
};
var _default = exports.default = Navbar;