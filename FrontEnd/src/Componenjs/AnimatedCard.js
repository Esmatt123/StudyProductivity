"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _framerMotion = require("framer-motion");
var _react = require("react");
var _aboutModule = _interopRequireDefault(require("../Styles/_about.module.css"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var AnimatedCard = function AnimatedCard(_ref) {
  var member = _ref.member,
    index = _ref.index;
  var ref = (0, _react.useRef)(null);
  var inView = (0, _framerMotion.useInView)(ref, {
    threshold: 0.1
  });
  var controls = (0, _framerMotion.useAnimation)();
  var direction = index % 2 === 0 ? 1 : -1; // 1 for right, -1 for left

  (0, _react.useEffect)(function () {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);
  var variants = {
    hidden: {
      opacity: 0,
      x: 200 * direction
    },
    visible: {
      opacity: 1,
      x: 0
    }
  };
  return /*#__PURE__*/React.createElement(_framerMotion.motion.div, {
    ref: ref,
    className: "".concat(_aboutModule.default.box),
    variants: variants,
    animate: controls,
    initial: "hidden",
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: _aboutModule.default.teamMemberContent
  }, /*#__PURE__*/React.createElement("h3", {
    className: _aboutModule.default.teamMemberName
  }, member.name), /*#__PURE__*/React.createElement("p", {
    className: _aboutModule.default.teamMemberRole
  }, member.role)));
};
var _default = exports.default = AnimatedCard;