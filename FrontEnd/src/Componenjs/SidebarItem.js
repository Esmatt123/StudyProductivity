"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SidebarItem = SidebarItem;
var _react = require("react");
var _sidebarModule = _interopRequireDefault(require("../Styles/_sidebar.module.css"));
var _Sidebar = require("./Sidebar");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function SidebarItem(_ref) {
  var icon = _ref.icon,
    text = _ref.text,
    active = _ref.active,
    alert = _ref.alert;
  var _useContext = (0, _react.useContext)(_Sidebar.SidebarContext),
    expanded = _useContext.expanded;
  return /*#__PURE__*/React.createElement("li", {
    className: "".concat(_sidebarModule.default.menuItem, " ").concat(active ? _sidebarModule.default.activeItem : _sidebarModule.default.inactiveItem)
  }, icon, /*#__PURE__*/React.createElement("span", {
    className: "".concat(expanded ? _sidebarModule.default.expandedText : _sidebarModule.default.collapsedText)
  }, text), alert && /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.alertDot
  }), !expanded && /*#__PURE__*/React.createElement("div", {
    className: _sidebarModule.default.tooltip
  }, text));
}