"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SidebarContext = void 0;
var _react = require("react");
var _link = _interopRequireDefault(require("next/link"));
var _lucideReact = require("lucide-react");
var _sidebarModule = _interopRequireDefault(require("../styles/_sidebar.module.css"));
var _useMediaQuery = _interopRequireDefault(require("../hooks/useMediaQuery"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var SidebarContext = exports.SidebarContext = /*#__PURE__*/(0, _react.createContext)({
  expanded: true
});
var Sidebar = function Sidebar() {
  var _useState = (0, _react.useState)(true),
    _useState2 = _slicedToArray(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var isMobile = (0, _useMediaQuery.default)('(max-width: 768px)'); // Add this hook

  (0, _react.useEffect)(function () {
    if (isMobile) {
      setExpanded(true);
    }
  }, [isMobile]);
  return /*#__PURE__*/React.createElement("aside", {
    className: "".concat(_sidebarModule.default.container, " ").concat(expanded ? _sidebarModule.default.expanded : _sidebarModule.default.collapsed)
  }, /*#__PURE__*/React.createElement("nav", {
    className: _sidebarModule.default.nav
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.navHeader
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://img.logoipsum.com/243.svg",
    className: "".concat(_sidebarModule.default.logo, " ").concat(expanded ? _sidebarModule.default.expandedLogo : _sidebarModule.default.collapsedLogo),
    alt: "Logo"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setExpanded(function (curr) {
        return !curr;
      });
    },
    className: _sidebarModule.default.toggleButton
  }, expanded ? /*#__PURE__*/React.createElement(_lucideReact.ChevronFirst, null) : /*#__PURE__*/React.createElement(_lucideReact.ChevronLast, null))), /*#__PURE__*/React.createElement("ul", {
    className: _sidebarModule.default.menu
  }, /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/home",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.Home, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "Home")))), /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/document/",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.FileText, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "Documents")))), /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/studymeetup",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.Users, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "Study Meetup")))), /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/chat",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.MessageCircle, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "Chats")))), /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/files",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.Folder, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "File Share")))), /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/exercises",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.Clipboard, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "Exercises")))), /*#__PURE__*/React.createElement("li", {
    className: _sidebarModule.default.menuItem
  }, /*#__PURE__*/React.createElement(_link.default, {
    href: "/todo",
    passHref: true
  }, /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.menuLink
  }, /*#__PURE__*/React.createElement("span", {
    className: _sidebarModule.default.linkIcon
  }, /*#__PURE__*/React.createElement(_lucideReact.CheckSquare, null)), /*#__PURE__*/React.createElement("span", {
    className: "".concat(_sidebarModule.default.linkText, " ").concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, "To dos")))))));
};
var _default = exports.default = Sidebar;