"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _SelfTestQuestionForm = _interopRequireDefault(require("./SelfTestQuestionForm"));
var _selfTestListModule = _interopRequireDefault(require("../Styles/_selfTestList.module.css"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// SelfTestList.tsx

// Import the SCSS module

var SelfTestList = function SelfTestList(_ref) {
  var selfTests = _ref.selfTests,
    onEditSelfTest = _ref.onEditSelfTest,
    onDeleteSelfTest = _ref.onDeleteSelfTest,
    onDeleteQuestion = _ref.onDeleteQuestion,
    addingQuestionTo = _ref.addingQuestionTo,
    setAddingQuestionTo = _ref.setAddingQuestionTo,
    userId = _ref.userId,
    refetch = _ref.refetch;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: _selfTestListModule.default.selfTestList
  }, selfTests.map(function (selfTest) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: selfTest.id,
      className: _selfTestListModule.default.selfTestItem
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: _selfTestListModule.default.selfTestHeader
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: _selfTestListModule.default.selfTestTitle
    }, selfTest.title), /*#__PURE__*/_react.default.createElement("div", {
      className: _selfTestListModule.default.buttonGroup
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: _selfTestListModule.default.button,
      onClick: function onClick() {
        return onEditSelfTest(selfTest);
      }
    }, "Edit"), /*#__PURE__*/_react.default.createElement("button", {
      className: _selfTestListModule.default.button,
      onClick: function onClick() {
        return onDeleteSelfTest(selfTest.id);
      }
    }, "Delete"))), /*#__PURE__*/_react.default.createElement("p", {
      className: _selfTestListModule.default.selfTestId
    }, "ID: ", selfTest.id), /*#__PURE__*/_react.default.createElement("h4", {
      className: _selfTestListModule.default.questionsHeader
    }, "Questions:"), selfTest.selfTestQuestions.length === 0 ? /*#__PURE__*/_react.default.createElement("p", {
      className: _selfTestListModule.default.noQuestions
    }, "No questions found for this self-test.") : /*#__PURE__*/_react.default.createElement("ul", {
      className: _selfTestListModule.default.questionsList
    }, selfTest.selfTestQuestions.map(function (question) {
      return /*#__PURE__*/_react.default.createElement("li", {
        key: question.id,
        className: _selfTestListModule.default.questionItem
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: _selfTestListModule.default.questionContent
      }, /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("strong", null, "Q:"), " ", question.text), /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("strong", null, "A:"), " ", question.correctAnswer)), /*#__PURE__*/_react.default.createElement("div", {
        className: _selfTestListModule.default.buttonGroup
      }, /*#__PURE__*/_react.default.createElement("button", {
        className: _selfTestListModule.default.button,
        onClick: function onClick() {
          return setAddingQuestionTo(question.id);
        }
      }, "Edit"), /*#__PURE__*/_react.default.createElement("button", {
        className: _selfTestListModule.default.button,
        onClick: function onClick() {
          return onDeleteQuestion(question.id);
        }
      }, "Delete")));
    })), addingQuestionTo === selfTest.id && /*#__PURE__*/_react.default.createElement(_SelfTestQuestionForm.default, {
      selfTestId: selfTest.id,
      userId: userId,
      onCompleted: function onCompleted() {
        setAddingQuestionTo(null);
        refetch();
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      className: _selfTestListModule.default.addQuestionButton,
      onClick: function onClick() {
        return setAddingQuestionTo(selfTest.id);
      }
    }, addingQuestionTo === selfTest.id ? "Cancel" : "Add Question"));
  }));
};
var _default = exports.default = SelfTestList;