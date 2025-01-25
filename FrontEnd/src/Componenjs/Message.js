"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _messageModule = _interopRequireDefault(require("../Styles/_message.module.css"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Adjust the path according to your file structure

var Message = function Message(_ref) {
  var message = _ref.message,
    currentUserId = _ref.currentUserId;
  var isCurrentUser = message.userId === currentUserId;
  return /*#__PURE__*/React.createElement("div", {
    className: _messageModule.default.messageContainer
  }, /*#__PURE__*/React.createElement("p", {
    className: "".concat(_messageModule.default.senderName, " ").concat(isCurrentUser ? _messageModule.default.outgoingName : _messageModule.default.incomingName)
  }, isCurrentUser ? 'You' : message.sender, " "), /*#__PURE__*/React.createElement("div", {
    className: "".concat(_messageModule.default.messageBubble, " ").concat(isCurrentUser ? _messageModule.default.outgoing : _messageModule.default.incoming)
  }, /*#__PURE__*/React.createElement("p", null, message.content)));
};
var _default = exports.default = Message;