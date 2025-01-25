"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _image = _interopRequireDefault(require("next/image"));
var _uuid = require("uuid");
var _documentGridModule = _interopRequireDefault(require("../Styles/_documentGrid.module.css"));
var _router = require("next/router");
var _graphql = require("../api/graphql");
var _graph = require("../api/graph");
var _client = require("@apollo/client");
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
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // Apollo Client hook
var DocumentGrid = function DocumentGrid() {
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    userId = _useState2[0],
    setUserId = _useState2[1];
  (0, _react.useEffect)(function () {
    var storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  });
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    localDocuments = _useState4[0],
    setLocalDocuments = _useState4[1];
  var _useState5 = (0, _react.useState)('Untitled document'),
    _useState6 = _slicedToArray(_useState5, 2),
    newDocumentName = _useState6[0],
    setNewDocumentName = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    showModal = _useState8[0],
    setShowModal = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    editingDocumentId = _useState10[0],
    setEditingDocumentId = _useState10[1];
  var _useState11 = (0, _react.useState)(''),
    _useState12 = _slicedToArray(_useState11, 2),
    editingDocumentName = _useState12[0],
    setEditingDocumentName = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    shareDocumentId = _useState14[0],
    setShareDocumentId = _useState14[1];
  var _useState15 = (0, _react.useState)(''),
    _useState16 = _slicedToArray(_useState15, 2),
    shareEmail = _useState16[0],
    setShareEmail = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    canWrite = _useState18[0],
    setCanWrite = _useState18[1];
  var router = (0, _router.useRouter)();
  var _useAccessibleDocumen = (0, _graph.useAccessibleDocuments)(userId),
    documents = _useAccessibleDocumen.documents,
    loading = _useAccessibleDocumen.loading,
    error = _useAccessibleDocumen.error;
  var client = (0, _client.useApolloClient)(); // Get the Apollo Client instance

  (0, _react.useEffect)(function () {
    function fetchDocuments() {
      return _fetchDocuments.apply(this, arguments);
    }
    function _fetchDocuments() {
      _fetchDocuments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              try {
                if (userId) {
                  setLocalDocuments(function (prevDocs) {
                    // Only update if there are changes to avoid re-renders
                    if (JSON.stringify(prevDocs) !== JSON.stringify(documents)) {
                      console.log('Documents updated');
                      return documents; // Update only if documents are different
                    }
                    return prevDocs; // Return the previous state if no change
                  });
                }
              } catch (error) {
                console.error('Error fetching documents:', JSON.stringify(error, null, 2));
              }
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return _fetchDocuments.apply(this, arguments);
    }
    fetchDocuments();
  }, [documents, userId]);
  var generateDocumentId = function generateDocumentId() {
    return (0, _uuid.v4)();
  };
  var createDocument = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var documentId, ownerId, newDocument;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(newDocumentName.trim() && userId)) {
              _context2.next = 15;
              break;
            }
            _context2.prev = 1;
            documentId = generateDocumentId();
            ownerId = userId;
            _context2.next = 6;
            return (0, _graphql.createOrFindDocument)(documentId, newDocumentName, ownerId);
          case 6:
            newDocument = _context2.sent;
            setLocalDocuments(function (prevDocs) {
              return [].concat(_toConsumableArray(prevDocs), [newDocument]);
            });
            setNewDocumentName('');
            setShowModal(false);
            _context2.next = 15;
            break;
          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](1);
            console.error('Error creating document:', _context2.t0);
          case 15:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 12]]);
    }));
    return function createDocument() {
      return _ref.apply(this, arguments);
    };
  }();
  var handleUpdate = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var updatedDoc;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!(editingDocumentId && editingDocumentName.trim())) {
              _context3.next = 13;
              break;
            }
            _context3.prev = 1;
            _context3.next = 4;
            return (0, _graphql.updateDocument)(editingDocumentId, editingDocumentName, userId);
          case 4:
            updatedDoc = _context3.sent;
            setLocalDocuments(function (prevDocs) {
              return prevDocs.map(function (doc) {
                return doc.id === editingDocumentId ? _objectSpread(_objectSpread({}, doc), {}, {
                  name: updatedDoc.name
                }) : doc;
              });
            });
            setEditingDocumentId(null);
            setEditingDocumentName('');
            _context3.next = 13;
            break;
          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](1);
            console.error('Error updating document:', JSON.stringify(_context3.t0, null, 2));
          case 13:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[1, 10]]);
    }));
    return function handleUpdate() {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleDelete = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(id) {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _graphql.deleteDocument)(id, userId);
          case 3:
            setLocalDocuments(function (prevDocs) {
              return prevDocs.filter(function (doc) {
                return doc.id !== id;
              });
            });
            _context4.next = 9;
            break;
          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            console.error('Error deleting document:', _context4.t0);
          case 9:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 6]]);
    }));
    return function handleDelete(_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  var handleShare = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!(shareDocumentId && shareEmail.trim() && userId)) {
              _context5.next = 13;
              break;
            }
            _context5.prev = 1;
            _context5.next = 4;
            return (0, _graph.shareDocument)(client, shareDocumentId, shareEmail, canWrite, userId);
          case 4:
            alert('Document shared successfully!');

            // Reset form state after successful sharing
            setShareDocumentId(null);
            setShareEmail('');
            setCanWrite(false);
            _context5.next = 13;
            break;
          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](1);
            console.error('Error sharing document:', _context5.t0);
          case 13:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[1, 10]]);
    }));
    return function handleShare() {
      return _ref4.apply(this, arguments);
    };
  }();

  // Use Effect to control Quill based on docEnable

  var handleCardClick = function handleCardClick(id) {
    router.push("/document/".concat(id));
  };
  var filteredDocuments = localDocuments.filter(function (doc) {
    var _doc$shares;
    if (doc.ownerId === userId) return true;
    var userShare = (_doc$shares = doc.shares) === null || _doc$shares === void 0 ? void 0 : _doc$shares.find(function (share) {
      return share.userId === userId;
    });
    return (userShare === null || userShare === void 0 ? void 0 : userShare.canRead) || false;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.container
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setShowModal(true);
    },
    className: _documentGridModule.default.createButton
  }, "Create New Document"), showModal && /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modal
  }, /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modalContent
  }, /*#__PURE__*/React.createElement("h2", null, "Create New Document"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: _documentGridModule.default.modalInput,
    value: newDocumentName,
    onChange: function onChange(e) {
      return setNewDocumentName(e.target.value);
    },
    placeholder: "Enter document name"
  }), /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modalButtons
  }, /*#__PURE__*/React.createElement("button", {
    onClick: createDocument,
    className: _documentGridModule.default.confirmButton
  }, "Create"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setShowModal(false);
    },
    className: _documentGridModule.default.cancelButton
  }, "Cancel")))), /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.documentGrid
  }, loading && /*#__PURE__*/React.createElement("p", {
    className: _documentGridModule.default.loading
  }, "Loading..."), error && /*#__PURE__*/React.createElement("p", {
    className: _documentGridModule.default.error
  }, "Error fetching documents: ", JSON.stringify(error, null, 2)), localDocuments.map(function (doc) {
    return doc ? /*#__PURE__*/React.createElement("div", {
      key: doc.id,
      className: _documentGridModule.default.documentCard
    }, /*#__PURE__*/React.createElement("div", {
      className: _documentGridModule.default.imageWrapper
    }, /*#__PURE__*/React.createElement(_image.default, {
      src: "/28510.jpg",
      alt: "Document ".concat(doc.name),
      width: 200,
      height: 150,
      style: {
        objectFit: 'cover',
        width: '100%',
        height: 'auto'
      },
      onClick: function onClick() {
        return handleCardClick(doc.id);
      },
      placeholder: "empty",
      priority: true,
      className: _documentGridModule.default.documentImage
    })), /*#__PURE__*/React.createElement("h3", {
      className: _documentGridModule.default.documentTitle
    }, doc.name), /*#__PURE__*/React.createElement("p", {
      className: _documentGridModule.default.documentId
    }, "ID: ", doc.id), /*#__PURE__*/React.createElement("div", {
      className: _documentGridModule.default.buttonContainer
    }, /*#__PURE__*/React.createElement("button", {
      className: "".concat(_documentGridModule.default.updateButton),
      onClick: function onClick() {
        setEditingDocumentId(doc.id);
        setEditingDocumentName(doc.name);
      }
    }, "Update"), /*#__PURE__*/React.createElement("button", {
      className: "".concat(_documentGridModule.default.deleteButton),
      onClick: function onClick() {
        return handleDelete(doc.id);
      }
    }, "Delete"), /*#__PURE__*/React.createElement("button", {
      className: "".concat(_documentGridModule.default.shareButton),
      onClick: function onClick() {
        return setShareDocumentId(doc.id);
      }
    }, "Share"))) : null;
  })), editingDocumentId && /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modal
  }, /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modalContent
  }, /*#__PURE__*/React.createElement("h2", null, "Update Document"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: _documentGridModule.default.modalInput,
    value: editingDocumentName,
    onChange: function onChange(e) {
      return setEditingDocumentName(e.target.value);
    },
    placeholder: "Enter new document name"
  }), /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modalButtons
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleUpdate,
    className: _documentGridModule.default.confirmButton
  }, "Update"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setEditingDocumentId(null);
      setEditingDocumentName('');
    },
    className: _documentGridModule.default.cancelButton
  }, "Cancel")))), shareDocumentId && /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modal
  }, /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modalContent
  }, /*#__PURE__*/React.createElement("h2", null, "Share Document"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    className: _documentGridModule.default.modalInput,
    value: shareEmail,
    onChange: function onChange(e) {
      return setShareEmail(e.target.value);
    },
    placeholder: "Enter email to share with"
  }), /*#__PURE__*/React.createElement("label", {
    className: _documentGridModule.default.checkboxLabel
  }, /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.checkboxContainer
  }, /*#__PURE__*/React.createElement("p", null, "Can Write"), /*#__PURE__*/React.createElement("input", {
    className: _documentGridModule.default.checkInput,
    type: "checkbox",
    checked: canWrite,
    onChange: function onChange(e) {
      return setCanWrite(e.target.checked);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: _documentGridModule.default.modalButtons
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleShare,
    className: _documentGridModule.default.confirmButton
  }, "Share"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setShareDocumentId(null);
      setShareEmail('');
      setCanWrite(false);
    },
    className: _documentGridModule.default.cancelButton
  }, "Cancel")))));
};
var _default = exports.default = DocumentGrid;