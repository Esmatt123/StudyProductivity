"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _quill = _interopRequireDefault(require("quill"));
require("quill/dist/quill.snow.css");
var _signalr = require("@microsoft/signalr");
var _router = require("next/router");
var _core = require("quill/core");
var _graphql = require("../api/graphql");
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
// Constants
var SAVE_INTERVAL_MS = 2000;
var TOOLBAR_OPTIONS = [[{
  header: [1, 2, 3, 4, 5, 6, false]
}], [{
  font: []
}], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["bold", "italic", "underline"], [{
  color: []
}, {
  background: []
}], [{
  script: "sub"
}, {
  script: "super"
}], [{
  align: []
}], ["image", "blockquote", "code-block"], ["clean"]];
var DocumentEditor = function DocumentEditor() {
  var router = (0, _router.useRouter)();
  var documentId = router.query.id;
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    connection = _useState2[0],
    setConnection = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    quill = _useState4[0],
    setQuill = _useState4[1];
  var _useState5 = (0, _react.useState)(new Map()),
    _useState6 = _slicedToArray(_useState5, 2),
    userCursors = _useState6[0],
    setUserCursors = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    canWrite = _useState8[0],
    setCanWrite = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    currentUserId = _useState10[0],
    setCurrentUserId = _useState10[1];
  var _useState11 = (0, _react.useState)(true),
    _useState12 = _slicedToArray(_useState11, 2),
    isLoading = _useState12[0],
    setIsLoading = _useState12[1];
  var BACKEND_URL = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;
  (0, _react.useEffect)(function () {
    var userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
  }, []);

  // Initialize SignalR connection
  (0, _react.useEffect)(function () {
    var newConnection = new _signalr.HubConnectionBuilder().withUrl("".concat(BACKEND_URL, "/hubs/document"), {
      skipNegotiation: false,
      // Important for Azure SignalR
      transport: _signalr.HttpTransportType.WebSockets
    }).withAutomaticReconnect().build();
    newConnection.start().then(function () {
      console.log('Connected to SignalR');

      // Request the document and permissions
      newConnection.invoke('GetDocument', documentId, currentUserId).catch(function (err) {
        return console.error('Error requesting document: ', err);
      });

      // Listen for document load and permissions
      newConnection.on('LoadDocument', function (data) {
        console.log('Document loaded:', data);
        if (quill) {
          var _JSON$parse = JSON.parse(data),
            content = _JSON$parse.content; // Assuming 'permissions' includes 'canWrite'
          quill.setContents(content); // Load the document data into Quill

          quill.disable();
        }
      });

      // Listen for changes sent by other clients
      newConnection.on('ReceiveChanges', function (delta) {
        if (quill) {
          quill.updateContents(delta);
        }
      });

      // Listen for cursor position updates
      newConnection.on('ReceiveCursorPosition', function (currentUserId, index) {
        setUserCursors(function (prev) {
          return new Map(prev).set(currentUserId, index);
        });
      });
      setConnection(newConnection);
    }).catch(function () {
      console.log('connection disconnected');
    });
    return function () {
      newConnection.stop();
    };
  }, [currentUserId, documentId, quill, router]);
  (0, _react.useEffect)(function () {
    if (connection == null || quill == null || !documentId) return;
    var changeHandler = function changeHandler(delta, oldDelta, source) {
      if (source !== 'user') return;
      connection.invoke('SendChanges', documentId, delta).catch(function (err) {
        return console.error('Error sending changes: ', err);
      });
    };
    quill.on('text-change', changeHandler);
    return function () {
      quill.off('text-change', changeHandler);
    };
  }, [connection, quill, documentId]);
  (0, _react.useEffect)(function () {
    if (!documentId || !currentUserId) return;
    var fetchPermissions = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var permission;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _graphql.fetchCanWritePermission)(documentId, currentUserId);
            case 3:
              permission = _context.sent;
              setCanWrite(permission);
              if (quill) {
                if (permission) {
                  quill.enable();
                } else {
                  quill.disable();
                }
              }
              _context.next = 11;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              console.error('Error fetching permissions:', _context.t0);
            case 11:
              _context.prev = 11;
              setIsLoading(false);
              return _context.finish(11);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 8, 11, 14]]);
      }));
      return function fetchPermissions() {
        return _ref.apply(this, arguments);
      };
    }();
    fetchPermissions();
  }, [documentId, currentUserId, quill]);

  // Load document and enable Quill
  (0, _react.useEffect)(function () {
    if (connection == null || quill == null || !documentId || !currentUserId) return;
    connection.on("LoadDocument", function (documentData) {
      console.log('Received document data:', documentData);
      try {
        if (!documentData) {
          quill.setContents([{
            insert: '\n'
          }]);
          return;
        }
        var parsedData = JSON.parse(documentData);

        // Check if we have content
        if (parsedData.content) {
          var content = typeof parsedData.content === 'string' ? JSON.parse(parsedData.content) : parsedData.content;
          quill.setContents(content);
        } else {
          quill.setContents([{
            insert: '\n'
          }]);
        }

        // Update Quill state based on permissions
        if (canWrite) {
          quill.enable();
        } else {
          quill.disable();
        }
      } catch (e) {
        console.error('Error parsing document data:', e);
        quill.setContents([{
          insert: '\n'
        }]);
      }
    });
    return function () {
      connection.off("LoadDocument");
    };
  }, [connection, quill, documentId, canWrite, currentUserId]);

  // Auto-save document at intervals
  (0, _react.useEffect)(function () {
    if (connection == null || quill == null || !documentId) return;
    var interval = setInterval(function () {
      var contents = quill.getContents();
      connection.invoke("SaveDocument", documentId, JSON.stringify(contents)).catch(function (err) {
        return console.error('Error saving document: ', err);
      });
    }, SAVE_INTERVAL_MS);
    return function () {
      return clearInterval(interval);
    };
  }, [connection, quill, documentId]);

  // Initialize Quill editor
  var wrapperRef = (0, _react.useCallback)(function (wrapper) {
    if (wrapper == null) return;
    wrapper.innerHTML = '';
    var editor = document.createElement('div');
    wrapper.append(editor);
    var q = new _quill.default(editor, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS
      }
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
    q.setText('');
  }, []);
  var renderCursors = (0, _react.useCallback)(function () {
    if (quill) {
      userCursors.forEach(function (index, currentUserId) {
        var bounds = quill.getBounds(index);
        if (bounds) {
          var cursorElement = document.querySelector(".cursor-".concat(currentUserId));
          var editor = document.querySelector('.ql-editor');
          var qlContainer = document.querySelector('.ql-container');
          var docEdContainer = document.querySelector('.docEdContainer');

          // Initialize cursor element if it doesn't exist
          if (!cursorElement) {
            cursorElement = document.createElement('div');
            cursorElement.className = "cursor-".concat(currentUserId);
            cursorElement.style.position = 'absolute';
            cursorElement.style.width = '2px';
            cursorElement.style.zIndex = '500';
            cursorElement.style.backgroundColor = getColorForUser(currentUserId);
            cursorElement.style.transition = 'left 0.01s, top 0.01s';
            docEdContainer === null || docEdContainer === void 0 || docEdContainer.appendChild(cursorElement);
          }
          var editorBounds = editor === null || editor === void 0 ? void 0 : editor.getBoundingClientRect();
          var qlContainerBounds = qlContainer === null || qlContainer === void 0 ? void 0 : qlContainer.getBoundingClientRect();
          if (qlContainerBounds) {
            // Calculate left and top based on the bounds and editor position
            var left = bounds.left - 1 + qlContainerBounds.left;
            var top = bounds.top + qlContainerBounds.top;

            // Constrain cursor position within the editor's bounds
            var constrainedLeft = Math.max(editorBounds.left, Math.min(left, editorBounds.right - 96));
            var constrainedTop = Math.max(editorBounds.top, Math.min(top, editorBounds.bottom - bounds.height));

            // Apply constrained positions to the cursor element
            cursorElement.style.left = "".concat(constrainedLeft, "px");
            cursorElement.style.top = "".concat(constrainedTop, "px");
            cursorElement.style.height = "".concat(bounds.height, "px");
            cursorElement.style.width = '2px';
          }
        } else {
          console.error('Bounds is null for user:', currentUserId);
        }
      });
    }
  }, [quill, userCursors]);

  // Use ResizeObserver to handle window and editor resizing
  (0, _react.useEffect)(function () {
    renderCursors();
    if (connection == null || quill == null || !documentId || currentUserId == null) return;
    var handleCursorChange = function handleCursorChange() {
      if (quill) {
        var range = quill.getSelection();
        if (range) {
          console.log("User: ".concat(currentUserId, ", Cursor Position: ").concat(range.index));
          if ((connection === null || connection === void 0 ? void 0 : connection.state) === 'Connected') {
            connection.invoke("UpdateCursorPosition", documentId, currentUserId, range.index).catch(function (err) {
              return console.error('Error updating cursor position: ', err);
            });
          } else {
            console.error('Connection is not in Connected state:', connection.state);
          }
        }
      }
    };
    var mainContent = document.querySelector('.mainContent');
    var handleEvent = function handleEvent() {
      renderCursors();
    };
    if (connection) connection.on('ReceiveChanges', handleEvent);
    if (mainContent) {
      mainContent.addEventListener('scroll', handleEvent);
      window.addEventListener('resize', handleEvent);
    }
    quill.on("editor-change", handleCursorChange);
    return function () {
      quill.off("editor-change", handleCursorChange);
      if (connection) connection.off('ReceiveChanges', handleEvent);
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleEvent);
        window.removeEventListener('resize', handleEvent);
      }
    };
  }, [connection, documentId, quill, renderCursors, router, currentUserId]);

  // Function to assign a color to each user
  var getColorForUser = function getColorForUser(userId) {
    var colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow'];
    var index = Array.from(userId).reduce(function (acc, char) {
      return acc + char.charCodeAt(0);
    }, 0) % colors.length;
    return colors[index];
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "docEdContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    ref: wrapperRef
  }));
};
var _default = exports.default = DocumentEditor;