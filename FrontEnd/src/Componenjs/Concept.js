"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _concept_module = _interopRequireDefault(require("../Styles/_concept_module.css"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var Concept = function Concept(_ref) {
  var id = _ref.id,
    title = _ref.title,
    description = _ref.description,
    onEdit = _ref.onEdit,
    onDelete = _ref.onDelete;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: _concept_module.default.concept
  }, /*#__PURE__*/_react.default.createElement("h3", null, title), /*#__PURE__*/_react.default.createElement("p", null, description), /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return onEdit(id);
    }
  }, "Edit"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return onDelete(id);
    }
  }, "Delete"));
};
var _default = exports.default = Concept;