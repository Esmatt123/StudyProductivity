"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var signalR = _interopRequireWildcard(require("@microsoft/signalr"));
var _chatwindowModule = _interopRequireDefault(require("../Styles/_chatwindow.module.css"));
var _uuid = require("uuid");
var _graphql = require("../api/graphql");
var _Message = _interopRequireDefault(require("./Message"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var ChatWindow = function ChatWindow(_ref) {
  var chatId = _ref.chatId,
    isGroupChat = _ref.isGroupChat,
    friendUserId = _ref.friendUserId,
    userId = _ref.userId;
  var _useState = (0, _react.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    newMessageText = _useState2[0],
    setNewMessageText = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    messages = _useState4[0],
    setMessages = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    displayedMessages = _useState6[0],
    setDisplayedMessages = _useState6[1];
  var _useState7 = (0, _react.useState)(true),
    _useState8 = _slicedToArray(_useState7, 2),
    hasMoreMessages = _useState8[0],
    setHasMoreMessages = _useState8[1];
  var _useState9 = (0, _react.useState)(true),
    _useState10 = _slicedToArray(_useState9, 2),
    loading = _useState10[0],
    setLoading = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    connection = _useState12[0],
    setConnection = _useState12[1];
  var messageListRef = (0, _react.useRef)(null);
  var limit = 10;
  var _useState13 = (0, _react.useState)(''),
    _useState14 = _slicedToArray(_useState13, 2),
    error = _useState14[0],
    setError = _useState14[1];
  var _useState15 = (0, _react.useState)(null),
    _useState16 = _slicedToArray(_useState15, 2),
    previousChatId = _useState16[0],
    setPreviousChatId = _useState16[1];
  var BACKEND_URL = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;
  var isMounted = (0, _react.useRef)(true);

  // Add this function to handle safe connection operations
  var safeConnectionOperation = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(operation) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            if (!((connection === null || connection === void 0 ? void 0 : connection.state) === signalR.HubConnectionState.Connected)) {
              _context.next = 4;
              break;
            }
            _context.next = 4;
            return operation();
          case 4:
            _context.next = 9;
            break;
          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            console.error('Connection operation failed:', _context.t0);
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 6]]);
    }));
    return function safeConnectionOperation(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var fetchInitialMessages = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var response, _yield$response$json, data, processedMessages;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setLoading(true);
            _context2.prev = 1;
            _context2.next = 4;
            return fetch("".concat(BACKEND_URL, "/graphql"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer ".concat(localStorage.getItem("token"))
              },
              body: JSON.stringify({
                query: _graphql.FETCH_MESSAGES_QUERY,
                variables: {
                  chatId: chatId === null || chatId === void 0 ? void 0 : chatId.toString(),
                  offset: 0,
                  limit: limit
                }
              })
            });
          case 4:
            response = _context2.sent;
            if (!response.ok) {
              _context2.next = 16;
              break;
            }
            _context2.next = 8;
            return response.json();
          case 8:
            _yield$response$json = _context2.sent;
            data = _yield$response$json.data;
            processedMessages = data.messages.map(function (msg) {
              return {
                id: msg.messageId,
                text: msg.content,
                sender: msg.user.username,
                userId: msg.user.userId,
                chatId: msg.chatRoomId || msg.groupChatId,
                sentAt: new Date().toLocaleString()
              };
            }).reverse();
            setDisplayedMessages(processedMessages);
            setMessages(processedMessages);
            setTimeout(function () {
              var _messageListRef$curre;
              (_messageListRef$curre = messageListRef.current) === null || _messageListRef$curre === void 0 || _messageListRef$curre.scrollTo(0, messageListRef.current.scrollHeight);
            }, 0);
            _context2.next = 18;
            break;
          case 16:
            console.error("Error fetching messages: ".concat(response.statusText));
            setError('Failed to load messages');
          case 18:
            _context2.next = 24;
            break;
          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](1);
            console.error('Error fetching messages:', _context2.t0);
            setError('Failed to load messages');
          case 24:
            _context2.prev = 24;
            setLoading(false);
            return _context2.finish(24);
          case 27:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 20, 24, 27]]);
    }));
    return function fetchInitialMessages() {
      return _ref3.apply(this, arguments);
    };
  }();
  var setupEventHandlers = function setupEventHandlers(newConnection) {
    newConnection.on('LoadGroupMessages', function (groupId, messages) {
      if (groupId === chatId) {
        var processedMessages = messages.map(function (msg) {
          return {
            id: msg.messageId.toString(),
            text: msg.content,
            sender: msg.username,
            userId: msg.userId,
            chatId: groupId,
            sentAt: new Date(msg.sentAt).toLocaleString()
          };
        });
        setDisplayedMessages(processedMessages);
        setTimeout(function () {
          var _messageListRef$curre2;
          (_messageListRef$curre2 = messageListRef.current) === null || _messageListRef$curre2 === void 0 || _messageListRef$curre2.scrollTo(0, messageListRef.current.scrollHeight);
        }, 0);
      }
    });
    newConnection.on('ReceivePrivateMessage', handlePrivateMessage);
    newConnection.on('ReceiveGroupMessage', handleGroupMessage);
    newConnection.on('Error', function (errorMessage) {
      console.error('SignalR Error:', errorMessage);
      setError(errorMessage);
    });

    // Add connection state handlers
    newConnection.onreconnecting(function () {
      console.log('Connection reconnecting...');
      setConnectionState('Reconnecting');
    });
    newConnection.onreconnected(function () {
      console.log('Connection reestablished');
      setConnectionState('Connected');
    });
    newConnection.onclose(function () {
      console.log('Connection closed');
      setConnectionState('Disconnected');
    });
  };

  // Move setupSignalRConnection outside of useEffect
  var setupSignalRConnection = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var token, newConnection, groupIdString;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            if (!connection) {
              _context3.next = 11;
              break;
            }
            _context3.prev = 2;
            _context3.next = 5;
            return connection.stop();
          case 5:
            setConnection(null);
            _context3.next = 11;
            break;
          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](2);
            console.error('Error stopping existing connection:', _context3.t0);
          case 11:
            token = localStorage.getItem("token");
            newConnection = new signalR.HubConnectionBuilder().withUrl("".concat(BACKEND_URL, "/hubs/chat"), {
              accessTokenFactory: function accessTokenFactory() {
                return token || '';
              },
              skipNegotiation: false,
              transport: signalR.HttpTransportType.WebSockets
            }).withAutomaticReconnect({
              nextRetryDelayInMilliseconds: function nextRetryDelayInMilliseconds(retryContext) {
                if (retryContext.previousRetryCount === 0) return 1000;
                if (retryContext.previousRetryCount < 3) return 3000;
                return 5000;
              }
            }).configureLogging(signalR.LogLevel.Information).build();
            setupEventHandlers(newConnection);

            // Start the connection and wait for it to be established
            _context3.next = 16;
            return newConnection.start();
          case 16:
            console.log('SignalR Connected');

            // Wait a short moment to ensure connection is stable
            _context3.next = 19;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });
          case 19:
            if (!(newConnection.state === signalR.HubConnectionState.Connected)) {
              _context3.next = 35;
              break;
            }
            if (!(isGroupChat && chatId)) {
              _context3.next = 32;
              break;
            }
            _context3.prev = 21;
            groupIdString = chatId.toString().trim();
            console.log('Joining group:', groupIdString);
            _context3.next = 26;
            return newConnection.invoke('JoinGroup', groupIdString);
          case 26:
            console.log('Successfully joined group:', groupIdString);
            _context3.next = 32;
            break;
          case 29:
            _context3.prev = 29;
            _context3.t1 = _context3["catch"](21);
            console.error('Error joining group:', _context3.t1);
            // Don't throw here, we still want to set the connection
          case 32:
            if (isMounted.current) {
              setConnection(newConnection);
              setError(''); // Clear any existing connection errors
            }
            _context3.next = 36;
            break;
          case 35:
            throw new Error('Connection not established after start');
          case 36:
            _context3.next = 43;
            break;
          case 38:
            _context3.prev = 38;
            _context3.t2 = _context3["catch"](0);
            console.error('Connection failed:', _context3.t2);
            if (isMounted.current) {
              setError('Failed to establish connection');
            }
            throw _context3.t2;
          case 43:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 38], [2, 8], [21, 29]]);
    }));
    return function setupSignalRConnection() {
      return _ref4.apply(this, arguments);
    };
  }();

  // Update previousChatId when chatId changes
  (0, _react.useEffect)(function () {
    setPreviousChatId(chatId);
  }, [chatId]);
  var handleNewMessage = function handleNewMessage(senderUserId, senderUsername, receivedMessage, incomingChatId) {
    var newMessage = {
      id: (0, _uuid.v4)(),
      text: receivedMessage,
      sender: senderUsername,
      userId: senderUserId,
      chatId: incomingChatId
    };
    setMessages(function (prev) {
      return [].concat(_toConsumableArray(prev), [newMessage]);
    });
    setDisplayedMessages(function (prev) {
      return [].concat(_toConsumableArray(prev), [newMessage]);
    });
    setTimeout(function () {
      var _messageListRef$curre3;
      (_messageListRef$curre3 = messageListRef.current) === null || _messageListRef$curre3 === void 0 || _messageListRef$curre3.scrollTo(0, messageListRef.current.scrollHeight);
    }, 0);
  };
  var handlePrivateMessage = function handlePrivateMessage(senderUserId, senderUsername, receivedMessage, incomingChatRoomId) {
    if (incomingChatRoomId === chatId) {
      handleNewMessage(senderUserId, senderUsername, receivedMessage, incomingChatRoomId);
    }
  };
  var handleGroupMessage = function handleGroupMessage(senderUserId, senderUsername, receivedMessage, incomingGroupChatId) {
    if (incomingGroupChatId === chatId) {
      handleNewMessage(senderUserId, senderUsername, receivedMessage, incomingGroupChatId);
    }
  };

  // Add cleanup when switching chats
  (0, _react.useEffect)(function () {
    if (previousChatId !== chatId && connection) {
      var switchChat = /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                if (!(previousChatId && isGroupChat)) {
                  _context4.next = 4;
                  break;
                }
                _context4.next = 4;
                return safeConnectionOperation(function () {
                  return connection.invoke('LeaveGroup', previousChatId.toString());
                });
              case 4:
                if (!(chatId && isGroupChat)) {
                  _context4.next = 7;
                  break;
                }
                _context4.next = 7;
                return safeConnectionOperation(function () {
                  return connection.invoke('JoinGroup', chatId.toString());
                });
              case 7:
                _context4.next = 9;
                return fetchInitialMessages();
              case 9:
                _context4.next = 14;
                break;
              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                console.error('Error switching chats:', _context4.t0);
              case 14:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[0, 11]]);
        }));
        return function switchChat() {
          return _ref5.apply(this, arguments);
        };
      }();
      switchChat();
    }
  }, [chatId, isGroupChat]); // Include bot

  (0, _react.useEffect)(function () {
    var initializeChat = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return setupSignalRConnection();
            case 2:
              if (!chatId) {
                _context5.next = 5;
                break;
              }
              _context5.next = 5;
              return fetchInitialMessages();
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function initializeChat() {
        return _ref6.apply(this, arguments);
      };
    }();
    initializeChat();
    return function () {
      if (connection) {
        if (isGroupChat && chatId) {
          connection.invoke('LeaveGroup', chatId.toString()).catch(function (err) {
            return console.error('Error leaving group:', err);
          });
        }
        connection.stop().catch(function (err) {
          return console.error('Error stopping connection:', err);
        });
      }
    };
  }, []);
  (0, _react.useEffect)(function () {
    isMounted.current = true;
    var cleanup = /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!connection) {
                _context6.next = 13;
                break;
              }
              _context6.prev = 1;
              if (!(isGroupChat && chatId)) {
                _context6.next = 5;
                break;
              }
              _context6.next = 5;
              return safeConnectionOperation(function () {
                return connection.invoke('LeaveGroup', chatId.toString());
              });
            case 5:
              _context6.next = 7;
              return connection.stop();
            case 7:
              if (isMounted.current) {
                setConnection(null);
              }
              _context6.next = 13;
              break;
            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](1);
              console.error('Error during cleanup:', _context6.t0);
            case 13:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[1, 10]]);
      }));
      return function cleanup() {
        return _ref7.apply(this, arguments);
      };
    }();
    return function () {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  // Add forced disconnect handler
  (0, _react.useEffect)(function () {
    if (connection) {
      connection.on("ForceDisconnect", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return connection.stop();
            case 3:
              setConnection(null);
              console.log("Disconnected by server");

              // Attempt to reconnect
              setupSignalRConnection();
              _context7.next = 12;
              break;
            case 8:
              _context7.prev = 8;
              _context7.t0 = _context7["catch"](0);
              console.error("Error during forced disconnect:", _context7.t0);
              setError("Connection was forcibly closed");
            case 12:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[0, 8]]);
      })));
      return function () {
        connection.off("ForceDisconnect");
      };
    }
  }, [connection]);
  var handleSendMessage = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var newMessage;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            if (newMessageText.trim()) {
              _context10.next = 2;
              break;
            }
            return _context10.abrupt("return");
          case 2:
            if (!(!connection || connection.state !== signalR.HubConnectionState.Connected)) {
              _context10.next = 17;
              break;
            }
            _context10.prev = 3;
            console.log('Connection not ready, attempting to reconnect...');
            _context10.next = 7;
            return setupSignalRConnection();
          case 7:
            if (!(!connection || connection.state !== signalR.HubConnectionState.Connected)) {
              _context10.next = 10;
              break;
            }
            setError('Unable to send message: Connection not established');
            return _context10.abrupt("return");
          case 10:
            _context10.next = 17;
            break;
          case 12:
            _context10.prev = 12;
            _context10.t0 = _context10["catch"](3);
            console.error('Failed to establish connection:', _context10.t0);
            setError('Unable to send message: Connection failed');
            return _context10.abrupt("return");
          case 17:
            newMessage = {
              id: (0, _uuid.v4)(),
              text: newMessageText,
              sender: "You",
              userId: userId,
              chatId: chatId,
              sentAt: new Date().toLocaleString()
            };
            _context10.prev = 18;
            if (!isGroupChat) {
              _context10.next = 25;
              break;
            }
            console.log("Sending to Group chat:", newMessageText);
            _context10.next = 23;
            return safeConnectionOperation( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
              return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return connection.invoke('SendMessageToGroup', chatId, newMessageText);
                  case 2:
                  case "end":
                    return _context8.stop();
                }
              }, _callee8);
            })));
          case 23:
            _context10.next = 28;
            break;
          case 25:
            console.log("Sending to private chat:", newMessageText);
            _context10.next = 28;
            return safeConnectionOperation( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
              return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return connection.invoke('SendPrivateMessage', friendUserId, newMessageText, chatId);
                  case 2:
                    // For private messages, we can add it locally
                    setDisplayedMessages(function (prev) {
                      return [].concat(_toConsumableArray(prev), [newMessage]);
                    });
                  case 3:
                  case "end":
                    return _context9.stop();
                }
              }, _callee9);
            })));
          case 28:
            setNewMessageText('');
            _context10.next = 44;
            break;
          case 31:
            _context10.prev = 31;
            _context10.t1 = _context10["catch"](18);
            console.error('Failed to send message:', _context10.t1);
            setError('Failed to send message. Please try again.');

            // Optionally try to reconnect on failure
            if (!_context10.t1.message.includes('not in the \'Connected\' State')) {
              _context10.next = 44;
              break;
            }
            _context10.prev = 36;
            _context10.next = 39;
            return setupSignalRConnection();
          case 39:
            _context10.next = 44;
            break;
          case 41:
            _context10.prev = 41;
            _context10.t2 = _context10["catch"](36);
            console.error('Failed to reconnect:', _context10.t2);
          case 44:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[3, 12], [18, 31], [36, 41]]);
    }));
    return function handleSendMessage() {
      return _ref9.apply(this, arguments);
    };
  }();
  (0, _react.useEffect)(function () {
    var checkInterval;
    if (connection) {
      checkInterval = setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              if (!(connection.state !== signalR.HubConnectionState.Connected)) {
                _context11.next = 10;
                break;
              }
              console.log('Connection lost, attempting to reconnect...');
              _context11.prev = 2;
              _context11.next = 5;
              return setupSignalRConnection();
            case 5:
              _context11.next = 10;
              break;
            case 7:
              _context11.prev = 7;
              _context11.t0 = _context11["catch"](2);
              console.error('Failed to reconnect:', _context11.t0);
            case 10:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[2, 7]]);
      })), 5000);

      // Add connection state change handler
      connection.onclose( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              console.log('Connection closed, attempting to reconnect...');
              _context12.prev = 1;
              _context12.next = 4;
              return setupSignalRConnection();
            case 4:
              _context12.next = 9;
              break;
            case 6:
              _context12.prev = 6;
              _context12.t0 = _context12["catch"](1);
              console.error('Failed to reconnect after close:', _context12.t0);
            case 9:
            case "end":
              return _context12.stop();
          }
        }, _callee12, null, [[1, 6]]);
      })));
    }
    return function () {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [connection]);
  var _useState17 = (0, _react.useState)('Disconnected'),
    _useState18 = _slicedToArray(_useState17, 2),
    connectionState = _useState18[0],
    setConnectionState = _useState18[1];
  (0, _react.useEffect)(function () {
    if (connection) {
      var updateConnectionState = function updateConnectionState() {
        setConnectionState(connection.state);
      };
      connection.onreconnecting(function () {
        return setConnectionState('Reconnecting');
      });
      connection.onreconnected(function () {
        return setConnectionState('Connected');
      });
      connection.onclose(function () {
        return setConnectionState('Disconnected');
      });

      // Initial state
      updateConnectionState();
    }
  }, [connection]);
  var loadMoreMessages = /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      var _messageListRef$curre4;
      var currentScrollHeight, response, _yield$response$json2, data, additionalMessages;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            if (!(loading || !hasMoreMessages)) {
              _context13.next = 2;
              break;
            }
            return _context13.abrupt("return");
          case 2:
            setLoading(true);
            console.log("loadmoremessages is invoked");
            // Capture scroll height before loading more messages
            currentScrollHeight = ((_messageListRef$curre4 = messageListRef.current) === null || _messageListRef$curre4 === void 0 ? void 0 : _messageListRef$curre4.scrollHeight) || 0;
            _context13.next = 7;
            return fetch("".concat(BACKEND_URL, "/graphql"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer ".concat(localStorage.getItem("token"))
              },
              body: JSON.stringify({
                query: _graphql.FETCH_MESSAGES_QUERY,
                variables: {
                  chatId: chatId === null || chatId === void 0 ? void 0 : chatId.toString(),
                  offset: displayedMessages.length,
                  limit: limit
                }
              })
            });
          case 7:
            response = _context13.sent;
            if (!response.ok) {
              _context13.next = 18;
              break;
            }
            _context13.next = 11;
            return response.json();
          case 11:
            _yield$response$json2 = _context13.sent;
            data = _yield$response$json2.data;
            additionalMessages = data.messages.map(function (msg) {
              return {
                id: msg.messageId,
                text: msg.content,
                sender: msg.user.username,
                userId: msg.user.userId,
                chatRoomId: msg.chatRoomId,
                groupChatId: msg.groupChatId
              };
            });
            if (additionalMessages.length < limit) setHasMoreMessages(false);

            // Reverse additional messages before appending to keep the order with latest at the bottom
            setMessages(function (prev) {
              return [].concat(_toConsumableArray(additionalMessages.reverse()), _toConsumableArray(prev));
            });
            setDisplayedMessages(function (prev) {
              return [].concat(_toConsumableArray(additionalMessages.reverse()), _toConsumableArray(prev));
            });

            // Adjust scroll after loading older messages
            setTimeout(function () {
              if (messageListRef.current) {
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight - currentScrollHeight;
              }
            }, 0);
          case 18:
            setLoading(false);
          case 19:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return function loadMoreMessages() {
      return _ref14.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: _chatwindowModule.default.chatWindow
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: messageListRef,
    className: _chatwindowModule.default.messageList,
    onScroll: function onScroll(e) {
      if (e.currentTarget.scrollTop === 0 && hasMoreMessages) loadMoreMessages();
    }
  }, displayedMessages.map(function (msg) {
    return /*#__PURE__*/_react.default.createElement(_Message.default, {
      key: msg.id,
      message: {
        id: msg.id,
        sender: msg.userId === userId ? "You" : msg.sender,
        userId: msg.userId,
        content: msg.text,
        sentAt: new Date().toLocaleString()
      },
      currentUserId: userId
    });
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: _chatwindowModule.default.inputContainer
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    value: newMessageText,
    onChange: function onChange(e) {
      return setNewMessageText(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === 'Enter' && handleSendMessage();
    },
    placeholder: "Type a message...",
    className: _chatwindowModule.default.messageInput
  }), /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleSendMessage,
    className: _chatwindowModule.default.sendButton
  }, "Send")));
};
var _default = exports.default = ChatWindow;