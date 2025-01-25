"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _router = require("next/router");
var Breadcrumbs = function Breadcrumbs(_ref) {
  var path = _ref.path;
  var router = (0, _router.useRouter)();
  return /*#__PURE__*/React.createElement("div", {
    className: "breadcrumbs"
  }, path.map(function (crumb, index) {
    return /*#__PURE__*/React.createElement("span", {
      key: crumb.id
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return router.push("/".concat(crumb.id));
      }
    }, crumb.name), index < path.length - 1 && ' / ');
  }));
};
var _default = exports.default = Breadcrumbs;