"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _quizModalModule = _interopRequireDefault(require("../Styles/_quiz-modal.module.css"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var QuizModal = function QuizModal(_ref) {
  var existingQuiz = _ref.existingQuiz,
    onClose = _ref.onClose,
    onSubmit = _ref.onSubmit,
    isEditMode = _ref.isEditMode;
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    quizTitle = _useState2[0],
    setQuizTitle = _useState2[1];
  var _useState3 = (0, _react.useState)([{
      text: "",
      answerOptions: [{
        text: "",
        isCorrect: false
      }, {
        text: "",
        isCorrect: false
      }]
    }]),
    _useState4 = _slicedToArray(_useState3, 2),
    questions = _useState4[0],
    setQuestions = _useState4[1];
  (0, _react.useEffect)(function () {
    if (existingQuiz) {
      setQuizTitle(existingQuiz.title);
      setQuestions(existingQuiz.questions);
    } else {
      // Reset to default state when not editing
      setQuizTitle("");
      setQuestions([{
        text: "",
        answerOptions: [{
          text: "",
          isCorrect: false
        }, {
          text: "",
          isCorrect: false
        }]
      }]);
    }
  }, [existingQuiz]);
  var handleQuestionChange = function handleQuestionChange(index, value) {
    setQuestions(function (prevQuestions) {
      var updatedQuestions = _toConsumableArray(prevQuestions);
      updatedQuestions[index] = _objectSpread(_objectSpread({}, updatedQuestions[index]), {}, {
        text: value
      });
      return updatedQuestions;
    });
  };
  var handleAnswerOptionChange = function handleAnswerOptionChange(questionIndex, optionIndex, value) {
    setQuestions(function (prevQuestions) {
      var updatedQuestions = prevQuestions.map(function (question, qIdx) {
        if (qIdx !== questionIndex) return question;
        var updatedAnswerOptions = question.answerOptions.map(function (option, oIdx) {
          if (oIdx !== optionIndex) return option;
          return _objectSpread(_objectSpread({}, option), {}, {
            text: value
          });
        });
        return _objectSpread(_objectSpread({}, question), {}, {
          answerOptions: updatedAnswerOptions
        });
      });
      return updatedQuestions;
    });
  };
  var toggleCorrectAnswer = function toggleCorrectAnswer(questionIndex, optionIndex) {
    setQuestions(function (prevQuestions) {
      var updatedQuestions = prevQuestions.map(function (question, qIdx) {
        if (qIdx !== questionIndex) return question;
        var updatedAnswerOptions = question.answerOptions.map(function (option, oIdx) {
          return _objectSpread(_objectSpread({}, option), {}, {
            isCorrect: oIdx === optionIndex
          });
        });
        return _objectSpread(_objectSpread({}, question), {}, {
          answerOptions: updatedAnswerOptions
        });
      });
      return updatedQuestions;
    });
  };
  var addQuestion = function addQuestion() {
    setQuestions(function (prevQuestions) {
      return [].concat(_toConsumableArray(prevQuestions), [{
        text: "",
        answerOptions: [{
          text: "",
          isCorrect: false
        }, {
          text: "",
          isCorrect: false
        }]
      }]);
    });
  };
  var removeQuestion = function removeQuestion(questionIndex) {
    setQuestions(function (prevQuestions) {
      return prevQuestions.filter(function (_, qIdx) {
        return qIdx !== questionIndex;
      });
    });
  };
  var addAnswerOption = function addAnswerOption(questionIndex) {
    setQuestions(function (prevQuestions) {
      var updatedQuestions = prevQuestions.map(function (question, qIdx) {
        if (qIdx !== questionIndex) return question;
        if (question.answerOptions.length < 4) {
          var updatedAnswerOptions = [].concat(_toConsumableArray(question.answerOptions), [{
            text: "",
            isCorrect: false
          }]);
          return _objectSpread(_objectSpread({}, question), {}, {
            answerOptions: updatedAnswerOptions
          });
        }
        return question;
      });
      return updatedQuestions;
    });
  };
  var removeAnswerOption = function removeAnswerOption(questionIndex, optionIndex) {
    setQuestions(function (prevQuestions) {
      var updatedQuestions = prevQuestions.map(function (question, qIdx) {
        if (qIdx !== questionIndex) return question;
        var updatedAnswerOptions = question.answerOptions.filter(function (_, oIdx) {
          return oIdx !== optionIndex;
        });
        return _objectSpread(_objectSpread({}, question), {}, {
          answerOptions: updatedAnswerOptions
        });
      });
      return updatedQuestions;
    });
  };
  var handleSubmit = function handleSubmit() {
    var quizData = {
      id: existingQuiz === null || existingQuiz === void 0 ? void 0 : existingQuiz.id,
      title: quizTitle,
      questions: questions.map(function (q) {
        return _objectSpread(_objectSpread({}, q), {}, {
          id: q.id,
          answerOptions: q.answerOptions.map(function (ao) {
            return _objectSpread(_objectSpread({}, ao), {}, {
              id: ao.id
            });
          })
        });
      })
    };
    onSubmit(quizData);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: _quizModalModule.default.modalBackdrop
  }, /*#__PURE__*/React.createElement("div", {
    className: _quizModalModule.default.modalContent
  }, /*#__PURE__*/React.createElement("h2", null, isEditMode ? "Edit Quiz" : "Create a New Quiz"), /*#__PURE__*/React.createElement("label", {
    className: _quizModalModule.default.label
  }, "Quiz Title:", /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: quizTitle,
    onChange: function onChange(e) {
      return setQuizTitle(e.target.value);
    },
    className: _quizModalModule.default.titleInput
  })), /*#__PURE__*/React.createElement("div", {
    className: _quizModalModule.default.questionsContainer
  }, questions.map(function (question, qIndex) {
    return /*#__PURE__*/React.createElement("div", {
      key: qIndex,
      className: _quizModalModule.default.questionBlock
    }, /*#__PURE__*/React.createElement("label", {
      className: _quizModalModule.default.label
    }, "Question Text:", /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: question.text,
      onChange: function onChange(e) {
        return handleQuestionChange(qIndex, e.target.value);
      },
      className: _quizModalModule.default.input
    })), /*#__PURE__*/React.createElement("div", {
      className: _quizModalModule.default.answerOptionsContainer
    }, question.answerOptions.map(function (option, aIndex) {
      return /*#__PURE__*/React.createElement("div", {
        key: aIndex,
        className: _quizModalModule.default.answerOptionBlock
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        value: option.text,
        onChange: function onChange(e) {
          return handleAnswerOptionChange(qIndex, aIndex, e.target.value);
        },
        className: _quizModalModule.default.input
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick() {
          return toggleCorrectAnswer(qIndex, aIndex);
        },
        className: "".concat(_quizModalModule.default.button, " ").concat(option.isCorrect ? _quizModalModule.default.correct : "")
      }, option.isCorrect ? "Correct" : "Set Correct"), question.answerOptions.length > 2 && /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick() {
          return removeAnswerOption(qIndex, aIndex);
        },
        className: _quizModalModule.default.removeOptionButton
      }, "Remove"));
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return addAnswerOption(qIndex);
      },
      className: _quizModalModule.default.addOptionButton,
      disabled: question.answerOptions.length >= 4
    }, "Add Answer Option")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return removeQuestion(qIndex);
      },
      className: _quizModalModule.default.removeQuestionButton
    }, "Remove Question"));
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: addQuestion,
    className: _quizModalModule.default.addQuestionButton
  }, "Add Question")), /*#__PURE__*/React.createElement("div", {
    className: _quizModalModule.default.modalActions
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    className: _quizModalModule.default.submitButton
  }, isEditMode ? "Update" : "Submit"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: _quizModalModule.default.cancelButton
  }, "Cancel"))));
};
var _default = exports.default = QuizModal;