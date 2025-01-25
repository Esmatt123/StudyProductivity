"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var SelfTestPlayer = function SelfTestPlayer(_ref) {
  var selfTest = _ref.selfTest,
    onCompleted = _ref.onCompleted;
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    userAnswers = _useState2[0],
    setUserAnswers = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    submitted = _useState4[0],
    setSubmitted = _useState4[1];
  var questions = selfTest.selfTestQuestions;

  // Initialize userAnswers with empty strings for each question
  (0, _react.useEffect)(function () {
    setUserAnswers(questions.map(function () {
      return '';
    }));
  }, [questions]);
  var handleAnswerChange = function handleAnswerChange(index, value) {
    var newAnswers = _toConsumableArray(userAnswers);
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };
  var handleSubmit = function handleSubmit() {
    setSubmitted(true);
  };
  var handleRetake = function handleRetake() {
    setUserAnswers(questions.map(function () {
      return '';
    }));
    setSubmitted(false);
  };
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h1", null, selfTest.title), !submitted ? /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handleSubmit();
    }
  }, questions.map(function (question, index) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: question.id
    }, /*#__PURE__*/_react.default.createElement("p", null, "Q", index + 1, ": ", question.text), /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      value: userAnswers[index],
      onChange: function onChange(e) {
        return handleAnswerChange(index, e.target.value);
      }
    }));
  }), /*#__PURE__*/_react.default.createElement("button", {
    type: "submit"
  }, "Submit Answers"), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    onClick: onCompleted
  }, "Cancel")) : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h2", null, "Results"), questions.map(function (question, index) {
    var correct = question.correctAnswer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase();
    return /*#__PURE__*/_react.default.createElement("div", {
      key: question.id,
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/_react.default.createElement("p", null, "Q", index + 1, ": ", question.text), /*#__PURE__*/_react.default.createElement("p", null, "Your Answer: ", userAnswers[index]), /*#__PURE__*/_react.default.createElement("p", null, "Correct Answer: ", question.correctAnswer), /*#__PURE__*/_react.default.createElement("p", {
      style: {
        color: correct ? 'green' : 'red'
      }
    }, correct ? 'Correct!' : 'Incorrect'));
  }), /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleRetake
  }, "Retake Test"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: onCompleted
  }, "Back to Self Tests")));
};
var _default = exports.default = SelfTestPlayer;