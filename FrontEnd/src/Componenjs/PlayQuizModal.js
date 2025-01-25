"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _client = require("@apollo/client");
var _graphql = require("../../src/api/graphql");
var _playQuizModalModule = _interopRequireDefault(require("../Styles/_play-quiz-modal.module.css"));
var _router = require("next/router");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var PlayQuizModal = function PlayQuizModal(_ref) {
  var quiz = _ref.quiz,
    onClose = _ref.onClose,
    userId = _ref.userId;
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    currentQuestionIndex = _useState2[0],
    setCurrentQuestionIndex = _useState2[1];
  var _useState3 = (0, _react.useState)(new Map()),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedAnswers = _useState4[0],
    setSelectedAnswers = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isQuizCompleted = _useState6[0],
    setIsQuizCompleted = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isSubmitting = _useState8[0],
    setIsSubmitting = _useState8[1];
  var router = (0, _router.useRouter)();
  var _useMutation = (0, _client.useMutation)(_graphql.SUBMIT_QUIZ, {
      onCompleted: function onCompleted(data) {
        var submitQuiz = data.submitQuiz;
        alert("You got ".concat(submitQuiz, " out of ").concat(selectedAnswers.size, " questions right!"));
        onClose();
      },
      onError: function onError(error) {
        console.error("Error submitting quiz:", error);
      }
    }),
    _useMutation2 = _slicedToArray(_useMutation, 1),
    submitQuiz = _useMutation2[0];
  var handleAnswerSelect = function handleAnswerSelect(answerId) {
    setSelectedAnswers(function (prev) {
      return new Map(prev).set(quiz.questions[currentQuestionIndex].id, answerId);
    });
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizCompletion();
    }
  };
  var handlePreviousQuestion = function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  var handleNextQuestion = function handleNextQuestion() {
    if (currentQuestionIndex < quiz.questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  var handleQuizCompletion = function handleQuizCompletion() {
    setIsQuizCompleted(true);
  };
  var handleSubmitQuiz = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var selectedAnswerIds, _yield$submitQuiz, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(!quiz || !userId)) {
              _context.next = 3;
              break;
            }
            alert("Missing required information to submit quiz");
            return _context.abrupt("return");
          case 3:
            _context.prev = 3;
            setIsSubmitting(true);
            selectedAnswerIds = Array.from(selectedAnswers.values()); // Perform the GraphQL mutation
            _context.next = 8;
            return submitQuiz({
              variables: {
                id: quiz.id,
                userId: userId,
                selectedAnswerIds: selectedAnswerIds
              }
            });
          case 8:
            _yield$submitQuiz = _context.sent;
            data = _yield$submitQuiz.data;
            console.log({
              quiz: JSON.stringify(quiz),
              // Send the entire quiz object
              selectedAnswers: JSON.stringify(selectedAnswerIds),
              // Send selected answers
              score: data.submitQuiz
            });
            if (data) {
              // Pass the data dynamically to the results page
              router.push({
                pathname: "/exercises/quiz/results",
                query: {
                  quiz: JSON.stringify(quiz),
                  // Send the entire quiz object
                  selectedAnswers: JSON.stringify(selectedAnswerIds),
                  // Send selected answers
                  score: data.submitQuiz // Send the score from the mutation
                }
              });
            }
            _context.next = 18;
            break;
          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](3);
            console.error("Error submitting quiz:", _context.t0);
            alert("Failed to submit quiz. Please try again.");
          case 18:
            _context.prev = 18;
            setIsSubmitting(false);
            return _context.finish(18);
          case 21:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 14, 18, 21]]);
    }));
    return function handleSubmitQuiz() {
      return _ref2.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.modal
  }, /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.modalContent
  }, /*#__PURE__*/React.createElement("button", {
    className: _playQuizModalModule.default.closeButtonTopRight,
    onClick: onClose
  }, "\xD7"), isQuizCompleted ? /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.completedMessage
  }, /*#__PURE__*/React.createElement("h2", null, "Congratulations! You have completed the quiz."), /*#__PURE__*/React.createElement("button", {
    className: _playQuizModalModule.default.submitButton,
    onClick: handleSubmitQuiz,
    disabled: isSubmitting
  }, isSubmitting ? "Submitting..." : "Submit Quiz"), /*#__PURE__*/React.createElement("button", {
    className: _playQuizModalModule.default.closeButton,
    onClick: onClose
  }, "Close")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, quiz.title), /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.questionContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.questionBox
  }, quiz.questions[currentQuestionIndex].text)), /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.answersContainer
  }, quiz.questions[currentQuestionIndex].answerOptions.map(function (option) {
    return /*#__PURE__*/React.createElement("button", {
      key: option.id,
      className: "".concat(_playQuizModalModule.default.answerBox, " ").concat(selectedAnswers.get(quiz.questions[currentQuestionIndex].id) === option.id ? _playQuizModalModule.default.selectedAnswer : ""),
      onClick: function onClick() {
        return handleAnswerSelect(option.id);
      }
    }, option.text);
  })), /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.progressBar
  }, "Question ", currentQuestionIndex + 1, " of ", quiz.questions.length), /*#__PURE__*/React.createElement("div", {
    className: _playQuizModalModule.default.pagination
  }, currentQuestionIndex > 0 && /*#__PURE__*/React.createElement("button", {
    className: _playQuizModalModule.default.paginationButton,
    onClick: handlePreviousQuestion
  }, "Previous"), currentQuestionIndex < quiz.questions.length - 1 && /*#__PURE__*/React.createElement("button", {
    className: _playQuizModalModule.default.paginationButton,
    onClick: handleNextQuestion,
    disabled: !selectedAnswers.has(quiz.questions[currentQuestionIndex].id)
  }, "Next")))));
};
var _default = exports.default = PlayQuizModal;