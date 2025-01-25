"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ShowFiles;
var _react = _interopRequireWildcard(require("react"));
var _Styles = _interopRequireDefault(require("../Styles/"));
var _graphql = require("../api/graphql");
var _ai = require("react-icons/ai");
var _bs = require("react-icons/bs");
var _router = require("next/router");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // Custom backend integration
// Fetch folder name from backend
// Share files API

function ShowFiles(_ref) {
  var parentId = _ref.parentId;
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    fileList = _useState2[0],
    setFileList = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    folderName = _useState4[0],
    setFolderName = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    email = _useState6[0],
    setEmail = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    currentFileId = _useState8[0],
    setCurrentId = _useState8[1];
  var router = (0, _router.useRouter)();

  // Fetch files on mount
  _react.default.useEffect(function () {
    (0, _graphql.FetchFiles)(parentId).then(setFileList);
    (0, _graphql.fetchFolderName)(parentId).then(setFolderName);
  }, [parentId]);
  var openFile = function openFile(fileLink) {
    window.open(fileLink);
  };
  var getSharedEmails = function getSharedEmails() {
    (0, _graphql.shareFiles)(email, currentFileId);
    window.my_modal_1.close();
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: _Styles.default.parentFolder
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: _Styles.default.folderName
  }, folderName ? folderName : "Root")), /*#__PURE__*/_react.default.createElement("div", {
    className: _Styles.default.filesGrid
  }, fileList.map(function (file) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: file.id
    }, file.isFolder ? /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(_Styles.default.files)
    }, /*#__PURE__*/_react.default.createElement(_ai.AiFillFolder, {
      size: 80,
      onClick: function onClick() {
        return router.push("/folder?id=".concat(file.id, "&owner=").concat(file.userEmail));
      }
    }), /*#__PURE__*/_react.default.createElement("p", null, file.folderName), /*#__PURE__*/_react.default.createElement("div", {
      className: _Styles.default.dots
    }, /*#__PURE__*/_react.default.createElement(_bs.BsThreeDotsVertical, {
      onClick: function onClick() {
        window.my_modal_1.showModal();
        setCurrentId(file.id);
      },
      className: _Styles.default.icon,
      size: 20
    }))) : /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(_Styles.default.files, " ")
    }, /*#__PURE__*/_react.default.createElement("p", null, file.folderName), /*#__PURE__*/_react.default.createElement("img", {
      onClick: function onClick() {
        return openFile(file.imageLink);
      },
      className: _Styles.default.imageLink,
      src: file.imageLink
    }), /*#__PURE__*/_react.default.createElement("p", null, file.imageName), /*#__PURE__*/_react.default.createElement("div", {
      className: _Styles.default.dots
    }, /*#__PURE__*/_react.default.createElement(_bs.BsThreeDotsVertical, {
      onClick: function onClick() {
        window.my_modal_1.showModal();
        setCurrentId(file.id);
      },
      className: _Styles.default.icon,
      size: 20
    }))));
  })), /*#__PURE__*/_react.default.createElement("dialog", {
    id: "my_modal_1",
    className: "modal"
  }, /*#__PURE__*/_react.default.createElement("section", {
    className: "modal-box"
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "email",
    id: "email",
    placeholder: "Type here",
    value: email,
    onChange: function onChange(event) {
      return setEmail(event.target.value);
    },
    className: "input input-bordered w-full max-w-xs"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "modal-action"
  }, /*#__PURE__*/_react.default.createElement("button", {
    onClick: getSharedEmails,
    className: "btn btn-accent"
  }, "Share"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return window.my_modal_1.close();
    },
    className: "btn"
  }, "Close")))));
}