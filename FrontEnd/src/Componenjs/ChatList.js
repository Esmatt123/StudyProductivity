"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _client = require("@apollo/client");
var _graphql = require("../api/graphql");
var _chatListModule = _interopRequireDefault(require("../Styles/_chatList.module.css"));
var SignalR = _interopRequireWildcard(require("@microsoft/signalr"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var ChatList = function ChatList(_ref) {
  var _data$chatRoomsByUser2;
  var setChatId = _ref.setChatId,
    chatId = _ref.chatId,
    setActiveChat = _ref.setActiveChat,
    setFriendUserId = _ref.setFriendUserId,
    friendUserId = _ref.friendUserId,
    isGroupChat = _ref.isGroupChat,
    userId = _ref.userId;
  var _useState = (0, _react.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    newGroupName = _useState2[0],
    setNewGroupName = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedFriends = _useState4[0],
    setSelectedFriends = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    groups = _useState6[0],
    setGroups = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    modalOpen = _useState8[0],
    setModalOpen = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    dropdownOpen = _useState10[0],
    setDropdownOpen = _useState10[1]; // Track open dropdown
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    addMemberDropdownOpen = _useState12[0],
    setAddMemberDropdownOpen = _useState12[1];
  var _useMutation = (0, _client.useMutation)(_graphql.DELETE_GROUP_CHAT),
    _useMutation2 = _slicedToArray(_useMutation, 1),
    deleteGroupChatMutation = _useMutation2[0];
  var _useMutation3 = (0, _client.useMutation)(_graphql.DELETE_ALL_MESSAGES),
    _useMutation4 = _slicedToArray(_useMutation3, 1),
    deleteAllMessagesMutation = _useMutation4[0];
  var _useMutation5 = (0, _client.useMutation)(_graphql.KICK_MEMBER_FROM_GROUP_CHAT),
    _useMutation6 = _slicedToArray(_useMutation5, 1),
    kickMemberMutation = _useMutation6[0];
  var _useMutation7 = (0, _client.useMutation)(_graphql.ADD_FRIEND_TO_GROUP),
    _useMutation8 = _slicedToArray(_useMutation7, 1),
    addFriendToGroupMutation = _useMutation8[0];
  var _useMutation9 = (0, _client.useMutation)(_graphql.CREATE_GROUP_CHAT),
    _useMutation10 = _slicedToArray(_useMutation9, 1),
    createGroupChatMutation = _useMutation10[0];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    connection = _useState14[0],
    setConnection = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    isConnected = _useState16[0],
    setIsConnected = _useState16[1];
  var dropdownRef = (0, _react.useRef)(null); // Ref for the dropdown menu

  var _useQuery = (0, _client.useQuery)(_graphql.GET_CHAT_ROOMS_BY_USER_IDS, {
      variables: {
        userId1: userId,
        userId2: friendUserId
      },
      skip: !userId || !friendUserId
    }),
    loading = _useQuery.loading,
    error = _useQuery.error,
    data = _useQuery.data;
  var signalRConnection = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (!userId || connection) return; // Don't create new connection if one exists

    var newConnection = new SignalR.HubConnectionBuilder().withUrl('/hubs/chat').withAutomaticReconnect().build();
    newConnection.on('UserAddedToGroup', function (userId) {
      console.log("User ".concat(userId, " added to group"));
    });
    newConnection.start().then(function () {
      console.log('SignalR connected');
      setConnection(newConnection);
      setIsConnected(true);
    }).catch(function (err) {
      return console.error('SignalR connection failed:');
    });
    return function () {
      newConnection.stop().catch(function (err) {
        return console.error('Error stopping SignalR connection:', err);
      });
    };
  }, [userId]); // Only depend on userId

  (0, _react.useEffect)(function () {
    var _data$chatRoomsByUser;
    if (data !== null && data !== void 0 && (_data$chatRoomsByUser = data.chatRoomsByUserIds[0]) !== null && _data$chatRoomsByUser !== void 0 && _data$chatRoomsByUser.chatRoomId) {
      console.log("chat is switched");
      setActiveChat(data.chatRoomsByUserIds[0].chatRoomId, isGroupChat);
    }
  }, [data === null || data === void 0 || (_data$chatRoomsByUser2 = data.chatRoomsByUserIds[0]) === null || _data$chatRoomsByUser2 === void 0 ? void 0 : _data$chatRoomsByUser2.chatRoomId]);
  var _useQuery2 = (0, _client.useQuery)(_graphql.GET_USER_FRIENDS, {
      variables: {
        userId: userId
      },
      skip: !userId
    }),
    loadingFriends = _useQuery2.loading,
    friendsError = _useQuery2.error,
    friendsData = _useQuery2.data;
  var _useQuery3 = (0, _client.useQuery)(_graphql.GET_USER_GROUP_CHATS, {
      variables: {
        userId: userId
      },
      skip: !userId
    }),
    loadingGroups = _useQuery3.loading,
    groupsError = _useQuery3.error,
    groupsData = _useQuery3.data;
  (0, _react.useEffect)(function () {
    if (groupsData) {
      setGroups(groupsData.userGroupChats);
      console.log(groupsData);
    }
  }, [groupsData]);
  (0, _react.useEffect)(function () {
    console.log('Updated selectedFriends:', selectedFriends);
  }, [selectedFriends]);

  // Close dropdown if clicked outside
  (0, _react.useEffect)(function () {
    var handleClickOutside = function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return function () {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  if (loadingFriends || loadingGroups) {
    return /*#__PURE__*/React.createElement("p", {
      className: _chatListModule.default.loading
    }, "Loading chats...");
  }
  if (friendsError) {
    console.error("Error loading friends:", friendsError);
    return /*#__PURE__*/React.createElement("p", {
      className: _chatListModule.default.error
    }, "Error loading friends");
  }
  if (groupsError) {
    console.error("Error loading groups:", groupsError);
    return /*#__PURE__*/React.createElement("p", {
      className: _chatListModule.default.error
    }, "Error loading groups");
  }
  var friends = (friendsData === null || friendsData === void 0 ? void 0 : friendsData.friends) || [];
  var handleChatClick = function handleChatClick(friend) {
    var _data$chatRoomsByUser3;
    setFriendUserId(friend.friendUserId);
    if ((data === null || data === void 0 || (_data$chatRoomsByUser3 = data.chatRoomsByUserIds) === null || _data$chatRoomsByUser3 === void 0 ? void 0 : _data$chatRoomsByUser3.length) > 0) {
      var newChatId = data.chatRoomsByUserIds[0].chatRoomId;
      setChatId(newChatId);
      setActiveChat(newChatId, false); // Pass false for individual chat
    } else {
      console.warn("Chat ID data not available; skipping update.");
    }
  };
  var handleCreateGroupChat = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var reshapedFriendIds, input, _yield$createGroupCha, _data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(!newGroupName || selectedFriends.length === 0)) {
              _context.next = 3;
              break;
            }
            console.warn('Invalid group creation data', {
              newGroupName: newGroupName,
              selectedFriends: selectedFriends
            });
            return _context.abrupt("return");
          case 3:
            _context.prev = 3;
            // Reshape selectedFriends to match the required format for the mutation
            reshapedFriendIds = selectedFriends.map(function (friendId) {
              return {
                userId: friendId
              };
            }); // Prepare the input object for the mutation
            input = {
              groupName: newGroupName,
              creatorId: userId,
              initialFriendIds: reshapedFriendIds // Pass the reshaped friend IDs as part of the input
            }; // Execute the mutation to create the group
            _context.next = 8;
            return createGroupChatMutation({
              variables: {
                input: input
              } // Pass the input object to the mutation
            });
          case 8:
            _yield$createGroupCha = _context.sent;
            _data = _yield$createGroupCha.data;
            if (!(_data !== null && _data !== void 0 && _data.createGroupChat)) {
              _context.next = 18;
              break;
            }
            // Update the groups state with the newly created group
            console.log(_data);
            setGroups(function (prevGroups) {
              return [].concat(_toConsumableArray(prevGroups), [_data.createGroupChat]);
            });

            // Close the modal after the group is created
            setModalOpen(false);

            // Join the group in SignalR after the group is created
            if (!connection) {
              _context.next = 18;
              break;
            }
            _context.next = 17;
            return connection.invoke('JoinGroup', _data.createGroupChat.id);
          case 17:
            console.log('Joined the new group:', _data.createGroupChat.id);
          case 18:
            _context.next = 23;
            break;
          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](3);
            console.error('Error creating group chat:', _context.t0);
          case 23:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 20]]);
    }));
    return function handleCreateGroupChat() {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleGroupChatClick = function handleGroupChatClick(groupId) {
    setChatId(groupId);
    setActiveChat(groupId, true); // Pass true for group chat
  };
  var handleDropdownToggle = function handleDropdownToggle(groupId) {
    setDropdownOpen(dropdownOpen === groupId ? null : groupId); // Toggle dropdown visibility
  };
  var handleAddFriendToGroup = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(groupId, friendId, friendUsername) {
      var _yield$addFriendToGro, _data2;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            // Optimistic UI update: add the friend to the group instantly
            setGroups(function (prevGroups) {
              return prevGroups.map(function (group) {
                return group.id === groupId ? _objectSpread(_objectSpread({}, group), {}, {
                  members: [].concat(_toConsumableArray(group.members), [{
                    username: friendUsername,
                    userId: friendId
                  }])
                }) : group;
              });
            });

            // Perform the GraphQL mutation to add the friend to the group
            _context2.next = 4;
            return addFriendToGroupMutation({
              variables: {
                groupId: groupId,
                friendId: friendId
              }
            });
          case 4:
            _yield$addFriendToGro = _context2.sent;
            _data2 = _yield$addFriendToGro.data;
            if (!(_data2 !== null && _data2 !== void 0 && _data2.addFriendToGroup)) {
              _context2.next = 20;
              break;
            }
            console.log("Friend ".concat(friendId, " added to group ").concat(groupId, " successfully."));

            // Ensure signalRConnection.current is valid before invoking
            if (!signalRConnection.current) {
              _context2.next = 18;
              break;
            }
            _context2.prev = 9;
            _context2.next = 12;
            return signalRConnection.current.invoke('AddUserToGroup', groupId, friendId);
          case 12:
            console.log("Friend ".concat(friendId, " is now connected to SignalR group ").concat(groupId, "."));
            _context2.next = 18;
            break;
          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](9);
            console.error('SignalR invocation failed:', _context2.t0);
          case 18:
            _context2.next = 22;
            break;
          case 20:
            console.error("Failed to add friend ".concat(friendId, " to group ").concat(groupId, "."));
            // Rollback the optimistic UI update
            rollbackGroupState(groupId, friendId);
          case 22:
            _context2.next = 28;
            break;
          case 24:
            _context2.prev = 24;
            _context2.t1 = _context2["catch"](0);
            console.error('Error adding friend to group:', _context2.t1);
            // Rollback the optimistic UI update in case of error
            rollbackGroupState(groupId, friendId);
          case 28:
            _context2.prev = 28;
            setDropdownOpen(null); // Close dropdown after action
            return _context2.finish(28);
          case 31:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 24, 28, 31], [9, 15]]);
    }));
    return function handleAddFriendToGroup(_x, _x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  // Helper function to rollback optimistic updates
  var rollbackGroupState = function rollbackGroupState(groupId, friendId) {
    setGroups(function (prevGroups) {
      return prevGroups.map(function (group) {
        return group.id === groupId ? _objectSpread(_objectSpread({}, group), {}, {
          members: group.members.filter(function (member) {
            return member.userId !== friendId;
          })
        }) : group;
      });
    });
  };

  // Function to toggle the "Add Member" dropdown
  var handleAddMemberDropdownToggle = function handleAddMemberDropdownToggle(groupId) {
    setAddMemberDropdownOpen(addMemberDropdownOpen === groupId ? null : groupId);
  };
  var handleDeleteGroupChat = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(groupId) {
      var _yield$deleteGroupCha, _data3;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            handleDeleteMessages(groupId, isGroupChat);
            _context3.next = 4;
            return deleteGroupChatMutation({
              variables: {
                groupId: groupId
              }
            });
          case 4:
            _yield$deleteGroupCha = _context3.sent;
            _data3 = _yield$deleteGroupCha.data;
            if (_data3 !== null && _data3 !== void 0 && _data3.deleteGroupChat) {
              console.log("Group ".concat(groupId, " deleted successfully"));
              // Perform additional UI updates, such as removing the group from the list
            } else {
              console.error("Failed to delete group ".concat(groupId));
            }
            _context3.next = 12;
            break;
          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.error('Error deleting group chat:', _context3.t0);
          case 12:
            setGroups(function (prev) {
              return prev.filter(function (group) {
                return group.id !== groupId;
              });
            });
            setDropdownOpen(null); // Close dropdown after action
          case 14:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 9]]);
    }));
    return function handleDeleteGroupChat(_x4) {
      return _ref4.apply(this, arguments);
    };
  }();

  // Function to handle kicking a member from a group
  var handleKickMember = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(groupId, memberId, requesterId) {
      var _yield$kickMemberMuta, _data4;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            // Optimistic UI update: remove the member instantly
            setGroups(function (prevGroups) {
              return prevGroups.map(function (group) {
                return group.id === groupId ? _objectSpread(_objectSpread({}, group), {}, {
                  members: group.members.filter(function (member) {
                    return member.userId !== memberId;
                  })
                }) : group;
              });
            });
            _context4.prev = 1;
            _context4.next = 4;
            return kickMemberMutation({
              variables: {
                groupId: groupId,
                memberId: memberId,
                requesterId: requesterId
              }
            });
          case 4:
            _yield$kickMemberMuta = _context4.sent;
            _data4 = _yield$kickMemberMuta.data;
            if (_data4 !== null && _data4 !== void 0 && _data4.kickMembersFromGroupChat) {
              console.log("Member ".concat(memberId, " kicked from group ").concat(groupId, " successfully."));
            } else {
              console.error("Failed to kick member ".concat(memberId, " from group ").concat(groupId, "."));
              rollbackGroupState(groupId, memberId);
            }
            _context4.next = 13;
            break;
          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](1);
            console.error('Error kicking member from group:', _context4.t0);
            rollbackGroupState(groupId, memberId);
          case 13:
            _context4.prev = 13;
            setDropdownOpen(null); // Close dropdown after action
            return _context4.finish(13);
          case 16:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[1, 9, 13, 16]]);
    }));
    return function handleKickMember(_x5, _x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }();

  // Function to handle deleting all messages in a chat
  var handleDeleteMessages = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(chatId, isGroupChat) {
      var _yield$deleteAllMessa, _data5;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return deleteAllMessagesMutation({
              variables: {
                chatId: chatId,
                isGroupChat: isGroupChat
              }
            });
          case 3:
            _yield$deleteAllMessa = _context5.sent;
            _data5 = _yield$deleteAllMessa.data;
            if (_data5 !== null && _data5 !== void 0 && _data5.deleteAllMessages) {
              console.log("All messages in chat ".concat(chatId, " deleted successfully"));
              // Perform additional UI updates, such as clearing the chat window
            } else {
              console.error("Failed to delete messages in chat ".concat(chatId));
            }
            _context5.next = 11;
            break;
          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](0);
            console.error('Error deleting messages:', _context5.t0);
          case 11:
            setDropdownOpen(null); // Close dropdown after action
          case 12:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[0, 8]]);
    }));
    return function handleDeleteMessages(_x8, _x9) {
      return _ref6.apply(this, arguments);
    };
  }();

  // This will run whenever selectedFriends is updated

  var handleFriendSelection = function handleFriendSelection(e, friendId) {
    var isChecked = e.target.checked;

    // Functional state update
    setSelectedFriends(function (prevSelected) {
      if (isChecked) {
        // Add friendId if not already in the array
        if (!prevSelected.includes(friendId)) {
          return [].concat(_toConsumableArray(prevSelected), [friendId]); // Always return a new array
        }
      } else {
        // Remove friendId from the array
        return prevSelected.filter(function (id) {
          return id !== friendId;
        }); // Return a new array with friendId removed
      }
      return prevSelected; // Return unchanged state if no action is needed
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: _chatListModule.default.chatList
  }, /*#__PURE__*/React.createElement("h3", {
    className: _chatListModule.default.header
  }, "Chats"), /*#__PURE__*/React.createElement("div", {
    className: _chatListModule.default.friendsSection
  }, /*#__PURE__*/React.createElement("h4", {
    className: _chatListModule.default.subHeader
  }, "Individual Chats"), friends.map(function (friend) {
    return /*#__PURE__*/React.createElement("div", {
      key: friend.friendUserId,
      className: "".concat(_chatListModule.default.chatItem),
      onClick: function onClick() {
        return handleChatClick(friend);
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: friend.friendUser.profileImageUrl || '/profile-placeholder.png',
      alt: "Friend Profile",
      className: _chatListModule.default.profileImage
    }), /*#__PURE__*/React.createElement("div", {
      className: _chatListModule.default.chatInfo
    }, /*#__PURE__*/React.createElement("p", {
      className: _chatListModule.default.friendName
    }, friend.friendUser.username)));
  })), /*#__PURE__*/React.createElement("div", {
    className: _chatListModule.default.groupsSection
  }, /*#__PURE__*/React.createElement("h4", {
    className: _chatListModule.default.subHeader
  }, "Group Chats"), groups.map(function (group) {
    var _group$members;
    return /*#__PURE__*/React.createElement("div", {
      key: group.id,
      className: "".concat(_chatListModule.default.chatItem),
      onClick: function onClick() {
        return handleGroupChatClick(group.id);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: _chatListModule.default.groupChatInfo
    }, /*#__PURE__*/React.createElement("p", {
      className: _chatListModule.default.groupName
    }, group.groupName)), /*#__PURE__*/React.createElement("div", {
      className: _chatListModule.default.menuContainer
    }, /*#__PURE__*/React.createElement("button", {
      className: _chatListModule.default.menuButton,
      onClick: function onClick() {
        return handleDropdownToggle(group.id);
      }
    }, "\u22EE "), dropdownOpen === group.id && /*#__PURE__*/React.createElement("div", {
      className: _chatListModule.default.dropdownMenu,
      ref: dropdownRef
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleAddMemberDropdownToggle(group.id);
      }
    }, "Add Member"), addMemberDropdownOpen === group.id && /*#__PURE__*/React.createElement("div", {
      className: _chatListModule.default.addMemberDropdown
    }, friends.map(function (friend) {
      var _friend$friendUser2;
      return /*#__PURE__*/React.createElement("button", {
        key: friend.friendUserId,
        onClick: function onClick() {
          var _friend$friendUser;
          return handleAddFriendToGroup(group.id, friend.friendUserId, ((_friend$friendUser = friend.friendUser) === null || _friend$friendUser === void 0 ? void 0 : _friend$friendUser.username) || 'Unknown');
        },
        className: _chatListModule.default.friendButton
      }, ((_friend$friendUser2 = friend.friendUser) === null || _friend$friendUser2 === void 0 ? void 0 : _friend$friendUser2.username) || 'Unknown');
    })), group.creatorId === userId && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleDeleteGroupChat(group.id);
      }
    }, "Delete Group"), (_group$members = group.members) === null || _group$members === void 0 ? void 0 : _group$members.filter(function (member) {
      return member.userId !== group.creatorId;
    }).map(function (member) {
      var _member$user;
      return /*#__PURE__*/React.createElement("button", {
        key: member.userId,
        onClick: function onClick() {
          return handleKickMember(group.id, member.userId, userId);
        },
        className: _chatListModule.default.memberButton
      }, "Kick ", (member === null || member === void 0 ? void 0 : member.username) || (member === null || member === void 0 || (_member$user = member.user) === null || _member$user === void 0 ? void 0 : _member$user.username) || 'Unknown');
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleDeleteMessages(chatId, isGroupChat);
      }
    }, "Clear chat"))));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModalOpen(true);
    },
    className: _chatListModule.default.createGroupButton
  }, "Create Group Chat"), modalOpen && /*#__PURE__*/React.createElement("div", {
    className: _chatListModule.default.modalOverlay
  }, /*#__PURE__*/React.createElement("div", {
    className: _chatListModule.default.modal
  }, /*#__PURE__*/React.createElement("h4", {
    className: _chatListModule.default.subHeader
  }, "Create Group Chat"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newGroupName,
    onChange: function onChange(e) {
      return setNewGroupName(e.target.value);
    },
    placeholder: "Group Name",
    className: _chatListModule.default.groupInput
  }), /*#__PURE__*/React.createElement("div", {
    className: _chatListModule.default.checkboxContainer
  }, /*#__PURE__*/React.createElement("h5", {
    className: _chatListModule.default.selectFriendsHeader
  }, "Select Friends"), friends.map(function (friend) {
    return /*#__PURE__*/React.createElement("div", {
      key: friend.friendUserId,
      className: _chatListModule.default.checkboxItem
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: "friend-".concat(friend.friendUserId),
      value: friend.friendUserId,
      checked: selectedFriends.includes(friend.friendUserId),
      onChange: function onChange(e) {
        return handleFriendSelection(e, friend.friendUserId);
      }
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "friend-".concat(friend.friendUserId)
    }, friend.friendUser.username));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleCreateGroupChat,
    className: _chatListModule.default.createButton
  }, "Create"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModalOpen(false);
    },
    className: _chatListModule.default.cancelButton
  }, "Cancel"))));
};
var _default = exports.default = ChatList;