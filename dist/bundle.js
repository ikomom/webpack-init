(() => {
    "use strict";
    var r = {
        424: (r, t, n) => {
            var o = n(81), e = n.n(o), a = n(645);
            n.n(a)()(e()).push([r.id, "body {\r\n    border: 2px solid red;\r\n    padding: 10px;\r\n}", ""])
        }, 645: r => {
            r.exports = function (r) {
                var t = [];
                return t.toString = function () {
                    return this.map((function (t) {
                        var n = "", o = void 0 !== t[5];
                        return t[4] && (n += "@supports (".concat(t[4], ") {")), t[2] && (n += "@media ".concat(t[2], " {")), o && (n += "@layer".concat(t[5].length > 0 ? " ".concat(t[5]) : "", " {")), n += r(t), o && (n += "}"), t[2] && (n += "}"), t[4] && (n += "}"), n
                    })).join("")
                }, t.i = function (r, n, o, e, a) {
                    "string" == typeof r && (r = [[null, r, void 0]]);
                    var c = {};
                    if (o) for (var i = 0; i < this.length; i++) {
                        var u = this[i][0];
                        null != u && (c[u] = !0)
                    }
                    for (var p = 0; p < r.length; p++) {
                        var s = [].concat(r[p]);
                        o && c[s[0]] || (void 0 !== a && (void 0 === s[5] || (s[1] = "@layer".concat(s[5].length > 0 ? " ".concat(s[5]) : "", " {").concat(s[1], "}")), s[5] = a), n && (s[2] ? (s[1] = "@media ".concat(s[2], " {").concat(s[1], "}"), s[2] = n) : s[2] = n), e && (s[4] ? (s[1] = "@supports (".concat(s[4], ") {").concat(s[1], "}"), s[4] = e) : s[4] = "".concat(e)), t.push(s))
                    }
                }, t
            }
        }, 81: r => {
            r.exports = function (r) {
                return r[1]
            }
        }
    }, t = {};

    function n(o) {
        var e = t[o];
        if (void 0 !== e) return e.exports;
        var a = t[o] = {id: o, exports: {}};
        return r[o](a, a.exports, n), a.exports
    }

    n.n = r => {
        var t = r && r.__esModule ? () => r.default : () => r;
        return n.d(t, {a: t}), t
    }, n.d = (r, t) => {
        for (var o in t) n.o(t, o) && !n.o(r, o) && Object.defineProperty(r, o, {enumerable: !0, get: t[o]})
    }, n.o = (r, t) => Object.prototype.hasOwnProperty.call(r, t), n(424)
})();