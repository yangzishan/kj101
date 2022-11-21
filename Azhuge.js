window._zhugeSdk = function(t) {
    var e = {};
    function n(i) {
        if (e[i])
            return e[i].exports;
        var r = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(r.exports, r, r.exports, n),
        r.l = !0,
        r.exports
    }
    return n.m = t,
    n.c = e,
    n.d = function(t, e, i) {
        n.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: i
        })
    }
    ,
    n.r = function(t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    n.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t['default']
        }
        : function() {
            return t
        }
        ;
        return n.d(e, "a", e),
        e
    }
    ,
    n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    n.p = "",
    n(n.s = 74)
}({
    0: function(t, e) {
        var n, i, r, o, a, s, c, u, d, f, l, h = window.navigator, p = window.document, g = h.userAgent, v = Array.prototype, m = Object.prototype, y = m.toString, w = v.forEach, _ = Array.isArray, k = v.slice, b = m.hasOwnProperty, S = {}, T = {
            each: function(t, e, n) {
                if (null != t)
                    if (w && t.forEach === w)
                        t.forEach(e, n);
                    else if (t.length === +t.length) {
                        for (var i = 0, r = t.length; i < r; i++)
                            if (i in t && e.call(n, t[i], i, t) === S)
                                return
                    } else
                        for (var o in t)
                            if (b.call(t, o) && e.call(n, t[o], o, t) === S)
                                return
            },
            extend: function(t) {
                return T.each(k.call(arguments, 1), function(e) {
                    for (var n in e)
                        void 0 !== e[n] && (t[n] = e[n])
                }),
                t
            },
            isUndefined: function(t) {
                return void 0 === t
            },
            isString: function(t) {
                return "[object String]" == y.call(t)
            },
            isArray: _ || function(t) {
                return "[object Array]" === y.call(t)
            }
            ,
            isFunction: function(t) {
                return "[object Function]" === y.call(t)
            },
            isObject: function(t) {
                return "[object Object]" === y.call(t) && void 0 !== t
            },
            hasMobileSdk: function() {
                var t = !!(window.zhugeTracker || window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.zhugeTracker);
                return {
                    flag: t,
                    track: function(e, n) {
                        t && (window.zhugeTracker ? window.zhugeTracker.trackProperty(e, T.JSONEncode(n)) : window.webkit.messageHandlers.zhugeTracker.postMessage({
                            type: "track",
                            name: e,
                            prop: n
                        }))
                    },
                    identify: function(e, n) {
                        t && (window.zhugeTracker ? window.zhugeTracker.identifyProperty(e, T.JSONEncode(n)) : window.webkit.messageHandlers.zhugeTracker.postMessage({
                            type: "identify",
                            name: e,
                            prop: n
                        }))
                    }
                }
            },
            includes: function(t, e) {
                return -1 !== t.indexOf(e)
            },
            encode: function(t) {
                var e = {};
                for (var n in t)
                    e["_" + n] = t[n];
                return e
            },
            truncate: function(t, e) {
                var n;
                return "string" == typeof t ? n = t.slice(0, e) : T.isArray(t) ? (n = [],
                T.each(t, function(t) {
                    n.push(T.truncate(t, e))
                })) : T.isObject(t) ? (n = {},
                T.each(t, function(t, i) {
                    n[i] = T.truncate(t, e)
                })) : n = t,
                n
            },
            strip_empty_properties: function(t) {
                var e = {};
                return T.each(t, function(t, n) {
                    T.isString(t) && t.length > 0 && (e[n] = t)
                }),
                e
            },
            trim: function(t) {
                return (t || "").replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "")
            },
            random: function(t, e) {
                return Math.round(Math.random() * (e - t)) + t
            },
            jsonp: function(t, e, n) {
                var i = "cb" + Math.random().toString().split(".")[1]
                  , r = p.createElement("script");
                r.src = t + "?callback=" + i,
                window[i] = function(t) {
                    e(t)
                }
                ,
                r.onerror = function() {
                    n()
                }
                ,
                p.head ? p.head.appendChild(r) : p.getElementsByTagName("head")[0].appendChild(r)
            },
            JSONEncode: function(t) {
                var e = function(t) {
                    var e = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
                      , n = {
                        "\b": "\\b",
                        "\t": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "\\": "\\\\"
                    };
                    return e.lastIndex = 0,
                    e.test(t) ? '"' + t.replace(e, function(t) {
                        var e = n[t];
                        return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                    }) + '"' : '"' + t + '"'
                }
                  , n = function(t, i) {
                    var r = ""
                      , o = 0
                      , a = ""
                      , s = ""
                      , c = 0
                      , u = r
                      , d = []
                      , f = i[t];
                    switch (f && "object" == typeof f && "function" == typeof f.toJSON && (f = f.toJSON(t)),
                    typeof f) {
                    case "string":
                        return e(f);
                    case "number":
                        return isFinite(f) ? String(f) : "null";
                    case "boolean":
                    case "null":
                        return String(f);
                    case "object":
                        if (!f)
                            return "null";
                        if (r += "    ",
                        d = [],
                        "[object Array]" === y.apply(f)) {
                            for (c = f.length,
                            o = 0; o < c; o += 1)
                                d[o] = n(o, f) || "null";
                            return s = 0 === d.length ? "[]" : r ? "[\n" + r + d.join(",\n" + r) + "\n" + u + "]" : "[" + d.join(",") + "]",
                            r = u,
                            s
                        }
                        for (a in f)
                            b.call(f, a) && (s = n(a, f)) && d.push(e(a) + (r ? ": " : ":") + s);
                        return s = 0 === d.length ? "{}" : r ? "{" + d.join(",") + u + "}" : "{" + d.join(",") + "}",
                        r = u,
                        s
                    }
                };
                return n("", {
                    "": t
                })
            },
            JSONDecode: (s = {
                '"': '"',
                "\\": "\\",
                "/": "/",
                b: "\b",
                f: "\f",
                n: "\n",
                r: "\r",
                t: "\t"
            },
            c = function(t) {
                throw {
                    name: "SyntaxError",
                    message: t,
                    at: i,
                    text: o
                }
            }
            ,
            u = function(t) {
                return t && t !== r && c("Expected '" + t + "' instead of '" + r + "'"),
                r = o.charAt(i),
                i += 1,
                r
            }
            ,
            d = function() {
                var t, e = "";
                for ("-" === r && (e = "-",
                u("-")); r >= "0" && r <= "9"; )
                    e += r,
                    u();
                if ("." === r)
                    for (e += "."; u() && r >= "0" && r <= "9"; )
                        e += r;
                if ("e" === r || "E" === r)
                    for (e += r,
                    u(),
                    "-" !== r && "+" !== r || (e += r,
                    u()); r >= "0" && r <= "9"; )
                        e += r,
                        u();
                if (t = +e,
                isFinite(t))
                    return t;
                c("Bad number")
            }
            ,
            f = function() {
                var t, e, n, i = "";
                if ('"' === r)
                    for (; u(); ) {
                        if ('"' === r)
                            return u(),
                            i;
                        if ("\\" === r)
                            if (u(),
                            "u" === r) {
                                for (n = 0,
                                e = 0; e < 4 && (t = parseInt(u(), 16),
                                isFinite(t)); e += 1)
                                    n = 16 * n + t;
                                i += String.fromCharCode(n)
                            } else {
                                if ("string" != typeof s[r])
                                    break;
                                i += s[r]
                            }
                        else
                            i += r
                    }
                c("Bad string")
            }
            ,
            l = function() {
                for (; r && r <= " "; )
                    u()
            }
            ,
            a = function() {
                switch (l(),
                r) {
                case "{":
                    return function() {
                        var t, e = {};
                        if ("{" === r) {
                            if (u("{"),
                            l(),
                            "}" === r)
                                return u("}"),
                                e;
                            for (; r; ) {
                                if (t = f(),
                                l(),
                                u(":"),
                                Object.hasOwnProperty.call(e, t) && c('Duplicate key "' + t + '"'),
                                e[t] = a(),
                                l(),
                                "}" === r)
                                    return u("}"),
                                    e;
                                u(","),
                                l()
                            }
                        }
                        c("Bad object")
                    }();
                case "[":
                    return function() {
                        var t = [];
                        if ("[" === r) {
                            if (u("["),
                            l(),
                            "]" === r)
                                return u("]"),
                                t;
                            for (; r; ) {
                                if (t.push(a()),
                                l(),
                                "]" === r)
                                    return u("]"),
                                    t;
                                u(","),
                                l()
                            }
                        }
                        c("Bad array")
                    }();
                case '"':
                    return f();
                case "-":
                    return d();
                default:
                    return r >= "0" && r <= "9" ? d() : function() {
                        switch (r) {
                        case "t":
                            return u("t"),
                            u("r"),
                            u("u"),
                            u("e"),
                            !0;
                        case "f":
                            return u("f"),
                            u("a"),
                            u("l"),
                            u("s"),
                            u("e"),
                            !1;
                        case "n":
                            return u("n"),
                            u("u"),
                            u("l"),
                            u("l"),
                            null
                        }
                        c("Unexpected '" + r + "'")
                    }()
                }
            }
            ,
            function(t) {
                var e;
                return o = t,
                i = 0,
                r = " ",
                e = a(),
                l(),
                r && c("Syntax error"),
                e
            }
            ),
            HTTPBuildQuery: function(t, e) {
                var n, i, r = [];
                return void 0 === e && (e = "&"),
                T.each(t, function(t, e) {
                    n = encodeURIComponent(t.toString()),
                    i = encodeURIComponent(e),
                    r[r.length] = i + "=" + n
                }),
                r.join(e)
            },
            getQueryParam: function(t, e) {
                e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var n = new RegExp("[\\?&#]" + e + "=([^&#]*)").exec(t);
                if (null === n || n && "string" != typeof n[1] && n[1].length)
                    return "";
                var i = n[1];
                try {
                    i = decodeURIComponent(decodeURIComponent(i)).replace(/\+/g, " ")
                } catch (t) {}
                return i
            },
            getDomain: function(t) {
                var e = t.match(/\/\/\S*?\//);
                return e && e.length ? e[0].replace(/\//g, "") : ""
            },
            register_event: function() {
                function t(e) {
                    return e && (e.preventDefault = t.preventDefault,
                    e.stopPropagation = t.stopPropagation),
                    e
                }
                return t.preventDefault = function() {
                    this.returnValue = !1
                }
                ,
                t.stopPropagation = function() {
                    this.cancelBubble = !0
                }
                ,
                function(e, n, i, r) {
                    if (e)
                        if (e.addEventListener && !r)
                            e.addEventListener(n, i, !1);
                        else {
                            var o = "on" + n
                              , a = e[o];
                            e[o] = function(e, n, i) {
                                return function(r) {
                                    if (r = r || t(window.event)) {
                                        var o, a, s = !0;
                                        return T.isFunction(i) && (o = i(r)),
                                        a = n.call(e, r),
                                        !1 !== o && !1 !== a || (s = !1),
                                        s
                                    }
                                }
                            }(e, i, a)
                        }
                    else
                        console && console.error("No valid element provided to register_event")
                }
            }(),
            cookie: {
                get: function(t) {
                    for (var e = t + "=", n = p.cookie.split(";"), i = 0; i < n.length; i++) {
                        for (var r = n[i]; " " == r.charAt(0); )
                            r = r.substring(1, r.length);
                        if (0 == r.indexOf(e))
                            return decodeURIComponent(r.substring(e.length, r.length))
                    }
                    return null
                },
                parse: function(t) {
                    var e;
                    try {
                        e = T.JSONDecode(T.cookie.get(t)) || {}
                    } catch (t) {}
                    return e
                },
                set: function(t, e, n, i, r) {
                    var o = ""
                      , a = ""
                      , s = "";
                    if (i) {
                        var c = p.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i)
                          , u = c ? c[0] : "";
                        o = u ? "; domain=." + u : ""
                    }
                    if (n) {
                        var d = new Date;
                        d.setTime(d.getTime() + 24 * n * 60 * 60 * 1e3),
                        a = "; expires=" + d.toGMTString()
                    }
                    r && (s = "; secure"),
                    p.cookie = t + "=" + encodeURIComponent(e) + a + "; path=/" + o + s
                },
                remove: function(t) {
                    var e = p.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i)
                      , n = e ? e[0] : "";
                    T.cookie.set(t, "", -1, "." + n)
                }
            },
            info: {
                campaignParams: function(t) {
                    t || (t = "{}"),
                    T.isString(t) && (t = T.JSONDecode(t));
                    var e = "utm_source utm_medium utm_campaign utm_content utm_term".split(" ")
                      , n = ""
                      , i = {};
                    return T.each(e, function(e) {
                        ((n = T.getQueryParam(p.URL, e)).length || t[e]) && (i["$" + e] = t[e] || n)
                    }),
                    i
                },
                searchEngine: function(t) {
                    return 0 === t.search("https?://(.*)google.([^/?]*)") ? "google" : 0 === t.search("https?://(.*)baidu.com") ? "baidu" : 0 === t.search("https?://(.*)sogou.com") ? "sogou" : 0 === t.search("https?://(.*)haosou.com") ? "haosou" : null
                },
                searchKeyword: function(t) {
                    var e = T.info.searchEngine(t);
                    return "google" == e ? T.getQueryParam(t, "q") : "baidu" == e ? T.getQueryParam(t, "wd") : "sogou" == e ? T.getQueryParam(t, "query") : "haosou" == e ? T.getQueryParam(t, "q") : null
                },
                referringDomain: function(t) {
                    var e = t.split("/");
                    return e.length >= 3 ? e[2] : ""
                },
                browser: function(t, e, n) {
                    e = e || "";
                    return n ? T.includes(t, "Mini") ? "Opera Mini" : "Opera" : /(BlackBerry|PlayBook|BB10)/i.test(t) ? "BlackBerry" : T.includes(t, "FBIOS") ? "Facebook Mobile" : T.includes(t, "Chrome") ? "Chrome" : T.includes(t, "CriOS") ? "Chrome iOS" : T.includes(e, "Apple") ? T.includes(t, "Mobile") ? "Mobile Safari" : "Safari" : T.includes(t, "Android") ? "Android Mobile" : T.includes(t, "Konqueror") ? "Konqueror" : T.includes(t, "Firefox") ? "Firefox" : T.includes(t, "MSIE") || T.includes(t, "Trident/") ? "Internet Explorer" : T.includes(t, "Gecko") ? "Mozilla" : ""
                },
                os: function() {
                    var t = g;
                    return /Windows/i.test(t) ? /Phone/.test(t) ? "Windows Mobile" : "Windows" : /(iPhone|iPad|iPod)/.test(t) ? "iOS" : /Android/.test(t) ? "Android" : /(BlackBerry|PlayBook|BB10)/i.test(t) ? "BlackBerry" : /Mac/i.test(t) ? "Mac OS X" : /Linux/.test(t) ? "Linux" : ""
                },
                device: function(t) {
                    return /iPad/.test(t) ? "iPad" : /iPod/.test(t) ? "iPod Touch" : /iPhone/.test(t) ? "iPhone" : /(BlackBerry|PlayBook|BB10)/i.test(t) ? "BlackBerry" : /Windows Phone/i.test(t) ? "Windows Phone" : /Android/.test(t) ? "Android" : ""
                },
                resolution: function() {
                    return screen.width + "*" + screen.height
                }
            },
            UUID: (n = function() {
                for (var t = 1 * new Date, e = 0; t == 1 * new Date; )
                    e++;
                return t.toString(16) + e.toString(16)
            }
            ,
            function() {
                var t = (screen.height * screen.width).toString(16);
                return n() + "-" + Math.random().toString(16).replace(".", "") + "-" + function(t) {
                    var e, n, i = g, r = [], o = 0;
                    function a(t, e) {
                        var n, i = 0;
                        for (n = 0; n < e.length; n++)
                            i |= r[n] << 8 * n;
                        return t ^ i
                    }
                    for (e = 0; e < i.length; e++)
                        n = i.charCodeAt(e),
                        r.unshift(255 & n),
                        r.length >= 4 && (o = a(o, r),
                        r = []);
                    return r.length > 0 && (o = a(o, r)),
                    o.toString(16)
                }() + "-" + t + "-" + n()
            }
            )
        };
        t.exports = T
    },
    1: function(t, e, n) {
        var i = n(6)
          , r = n(0);
        t.exports = r.extend({
            getRect: function(t, e) {
                var n = t.getBoundingClientRect()
                  , i = this.css(t, "position");
                return {
                    position: "fixed" === i ? "fixed" : "absolute",
                    width: t.offsetWidth,
                    height: t.offsetHeight,
                    top: n.top + ("fixed" === i || e ? 0 : window.pageYOffset),
                    bottom: n.bottom,
                    left: n.left + ("fixed" === i || e ? 0 : window.pageXOffset),
                    right: n.right
                }
            },
            getOffset: function(t) {
                for (var e = {
                    position: "fixed" === this.css(t, "position") ? "fixed" : "absolute",
                    width: t.offsetWidth,
                    height: t.offsetHeight,
                    top: t.offsetTop,
                    left: t.offsetLeft
                }; t.offsetParent; ) {
                    var n = t.offsetParent;
                    "fixed" === this.css(n, "position") && (e.position = "fixed"),
                    e.top += n.offsetTop,
                    e.left += n.offsetLeft,
                    t = n
                }
                return e
            },
            css: function(t, e) {
                if (r.isString(e))
                    return window.getComputedStyle(t)[e];
                for (var n in e)
                    t.style[n] = e[n]
            },
            addStyleRules: function(t) {
                var e, n = document.createElement("style");
                document.head ? document.head.appendChild(n) : document.getElementsByTagName("head")[0].appendChild(n),
                e = n.sheet;
                for (var i = 0, r = t.length; i < r; i++) {
                    var o = 1
                      , a = t[i]
                      , s = t[i][0]
                      , c = "";
                    "[object Array]" === Object.prototype.toString.call(a[1][0]) && (a = a[1],
                    o = 0);
                    for (var u = a.length; o < u; o++) {
                        var d = a[o];
                        c += d[0] + ":" + d[1] + (d[2] ? " !important" : "") + ";\n"
                    }
                    e.insertRule(s + "{" + c + "}", e.cssRules.length)
                }
            },
            append: function(t, e) {
                r.isString(e) ? t.insertAdjacentHTML("beforeend", e) : t.appendChild(e)
            },
            html: function(t, e) {
                t.innerHTML = e
            },
            remove: function(t) {
                t.parentNode && t.parentNode.removeChild(t)
            },
            contains: function(t, e) {
                for (var n = !1; this.getParent(e) && "body" !== i.getTagName(e); ) {
                    if (this.getParent(e) === t) {
                        n = !0;
                        break
                    }
                    e = this.getParent(e)
                }
                return n
            },
            show: function(t, e) {
                return r.isArray(t) ? t.forEach(function(t) {
                    this.css(t, {
                        display: e || "block"
                    })
                }, this) : this.css(t, {
                    display: e || "block"
                }),
                t
            },
            hide: function(t) {
                return r.isArray(t) ? t.forEach(function(t) {
                    this.css(t, {
                        display: "none"
                    })
                }, this) : this.css(t, {
                    display: "none"
                }),
                t
            },
            child: function(t) {
                for (var e = [], n = 0, i = t.childNodes.length; n < i; n++)
                    this.isTextNode(t.childNodes[n]) || e.push(t.childNodes[n]);
                return e
            },
            siblings: function(t, e) {
                var n = [];
                return this.child(this.getParent(t)).forEach(function(i) {
                    i !== t && this.is(i, e) && n.push(i)
                }, this),
                n
            },
            setContext: function(t, e) {
                t.textContent = e
            },
            delegate: function(t, e, n, i, r) {
                var o = this;
                return this.bind(t, e, function(t) {
                    var e = t.target
                      , a = o.is(e, n);
                    if (a.flag)
                        return i.call(r, t, a.target)
                }, r)
            },
            scroll: function(t) {
                i.bind(t, "mousewheel", function(e) {
                    var n = this.getRect(t).height
                      , i = t.scrollHeight;
                    (t.scrollTop === i - n && e.deltaY > 0 || 0 === t.scrollTop && e.deltaY < 0) && e.preventDefault()
                }, this)
            },
            prev: function(t) {
                var e = t.previousSibling;
                return !e || this.isTextNode(t) ? null : e
            },
            prevAll: function(t) {
                for (var e = []; this.prev(t); )
                    e.push(this.prev(t)),
                    t = this.prev(t);
                return e
            },
            fixPosition: function(t) {
                var e = this.css(t, "position");
                /absolute|fixed/.test(e) || this.css(t, {
                    position: "relative"
                })
            },
            locate: function(t, e) {
                var n = this.getRect(t, !0)
                  , i = this.getRect(e)
                  , r = {
                    top: n.top,
                    left: n.left + n.width
                };
                r.top + i.height >= window.innerHeight && (r.top = Math.max(r.top - (r.top + i.height - window.innerHeight), 0)),
                r.left + i.width >= window.innerWidth && (r.left = Math.max(n.left - i.width, 0)),
                this.css(e, {
                    top: r.top + "px",
                    left: r.left + "px"
                })
            },
            removeData: function(t, e) {
                delete (t.dataset || {})[e]
            },
            empty: function(t) {
                return t.innerHTML = "",
                t
            },
            scrollTo: function(t) {
                var e = this.getRect(this.body)
                  , n = this.getRect(t)
                  , i = n.top - e.height / 2
                  , r = n.left - e.width / 2;
                this.body.scrollTop = i,
                this.body.scrollLeft = r
            }
        }, i)
    },
    15: function(t, e) {
        t.exports.url = {
            checkLogin: "http://io.jiankangzhan.com:8080/user/checkAuthorization.jsp",
            eventList: "http://io.jiankangzhan.com:8080/data/datalist.jsp",
            loadEnvData: "http://io.jiankangzhan.com:8080/appusergroup/getEventEnvData.jsp",
            loadUserPropData: "http://io.jiankangzhan.com:8080/appusergroup/getUserPropMeta.jsp"
        },
        t.exports.analysis = {
            sessionStorageKey: "zhugeAnalysisQueryParam"
        }
    },
    25: function(t, e) {
        t.exports = {
            SESSION_KEYS: {
                PARAMS: "zhugeJsHeatMapParams"
            }
        }
    },
    5: function(t, e, n) {
        var i = n(0)
          , r = {
            UNSENT: 0,
            OPENED: 1,
            HEADERS_RECEIVED: 2,
            LOADING: 3,
            DONE: 4
        };
        function o(t) {
            var e = [];
            for (var n in t) {
                var r = t[n];
                e.push(encodeURIComponent(n) + "=" + encodeURIComponent(i.isString(r) ? r : i.JSONEncode(r)))
            }
            return e.join("&")
        }
        function a(t, e) {
            var n = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
              , a = function(t) {
                i.isFunction(e[t]) && e[t].call(e.context, function(t, e) {
                    var n = t.responseText;
                    switch (e) {
                    case "json":
                        n = i.JSONDecode(n);
                        break;
                    default:
                        console && console.error(arguments, this)
                    }
                    return n
                }(n, e.dataType))
            };
            switch (n.onreadystatechange = function() {
                if (n.readyState === r.DONE)
                    if (n.status >= 200 && n.status <= 299)
                        try {
                            a("success")
                        } catch (t) {
                            a("error")
                        }
                    else
                        a("error")
            }
            ,
            n.onerror = function() {
                a("error"),
                console && console.error(arguments, this)
            }
            ,
            n.withCredentials = !0,
            e.type.toLowerCase()) {
            case "get":
                t += "?" + o(e.data),
                n.open(e.type, t, e.sync),
                n.send();
                break;
            case "post":
                var s = o(e.data);
                n.open(e.type, t, e.sync),
                n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
                n.send(s);
                break;
            default:
                console && console.error(arguments, this)
            }
        }
        t.exports = function(t, e) {
            var n = i.extend({
                type: "post",
                data: {},
                dataType: "json",
                success: null,
                error: null,
                sync: !0,
                context: this,
                jsonp: !1
            }, e);
            n.jsonp ? function(t, e) {
                var n = function(t, n) {
                    i.isFunction(e[t]) && e[t].call(e.context, n)
                }
                  , r = document.createElement("script")
                  , a = "callback" + Math.random().toString().split(".")[1]
                  , s = t + "?";
                e.data.callback = a,
                window[a] = function(t) {
                    n("success", t)
                }
                ,
                r.src = s + o(e.data),
                r.onerror = function() {
                    n("error")
                }
                ,
                document.body.appendChild(r)
            }(t, n) : a(t, n)
        }
    },
    6: function(t, e, n) {
        var i = n(0)
          , r = {
            prefix: {
                expand: "zhuge-auto-track-",
                interface: "zhuge-interface-"
            },
            body: document.getElementsByTagName("body")[0],
            ready: function(t, e) {
                if (this.body)
                    t.call(e);
                else
                    var n = this
                      , i = setInterval(function() {
                        window.document.body && (n.body = window.document.body,
                        clearInterval(i),
                        t.call(e))
                    }, 50)
            },
            addClass: function(t, e) {
                var n = this.getAttr(t, "class") || "";
                new RegExp(e).test(n) || (n += " " + e,
                r.setAttr(t, "class", i.trim(n)))
            },
            removeClass: function(t, e) {
                var n = this.getAttr(t, "class") || "";
                r.setAttr(t, "class", i.trim(n.replace(e, "")))
            },
            bind: function(t, e, n, r) {
                r = r || t;
                var o = function(e) {
                    if ((e.target = e.target || e.srcElement,
                    i.isFunction(n)) && !1 === n.call(r, e || window.event, t))
                        return e.preventDefault && e.preventDefault(),
                        e.stopPropagation && e.stopPropagation(),
                        e.returnValue && (e.returnValue = !1),
                        e.cancelBubble && (e.cancelBubble = !0),
                        !1
                };
                if (t.addEventListener)
                    t.addEventListener(e, o, !0);
                else if (t.attachEvent)
                    t.attachEvent("on" + e, o);
                else {
                    var a = "on" + e
                      , s = t[a];
                    t[a] = function(e) {
                        return i.isFunction(s) && s.call(t, e || window.event),
                        n.call(r, e || window.event, t)
                    }
                }
                return {
                    unbind: function() {
                        t.removeEventListener ? t.removeEventListener(e, o, !0) : t.detachEvent && t.detachEvent("on" + e, o)
                    }
                }
            },
            data: function(t, e) {
                var n = t.dataset || {};
                if (i.isString(e))
                    return n[e];
                for (var r in e)
                    n[r] = e[r]
            },
            getTagName: function(t) {
                return t && t.tagName ? t.tagName.toLowerCase() : ""
            },
            getAttr: function(t, e) {
                return t && t.getAttribute ? t.getAttribute(e) : ""
            },
            setAttr: function(t, e, n) {
                if (i.isObject(e))
                    for (var r in e)
                        t.setAttribute(r, e[r]);
                else
                    t.setAttribute(e, n)
            },
            isValidLink: function(t) {
                return "a" === this.getTagName(t) && this.getAttr(t, "href") && !/^javascript:/.test(this.getAttr(t, "href"))
            },
            is: function(t, e) {
                for (var n = !1, i = this.query(e), r = t; r && !n && "body" !== this.getTagName(r); ) {
                    for (var o = 0, a = i.length; o < a; o++) {
                        if (i[o] === r) {
                            n = !0;
                            break
                        }
                    }
                    n || (r = this.getParent(r))
                }
                return {
                    flag: n,
                    target: r
                }
            },
            isClickAble: function(t, e, n) {
                if (!t || this.isTextNode(t))
                    return {
                        flag: !1
                    };
                var r = this.getTagName(t)
                  , o = this.getAttr(t, "type")
                  , a = this.isValidLink(t)
                  , s = {
                    flag: !1,
                    target: t,
                    isValidLink: a,
                    form: null
                };
                switch (r) {
                case "a":
                    if (a) {
                        s.flag = !0;
                        break
                    }
                case "button":
                    t.disabled || (s.flag = !0);
                    break;
                case "input":
                    /button|reset|submit/.test(o) && !t.disabled && (s.flag = !0,
                    "submit" === o && (s.form = t.form));
                    break;
                case "body":
                    s.flag = !1;
                    break;
                default:
                    if (this.hasBindClick(t) || i.isFunction(e) && e(t))
                        s.flag = !0;
                    else if (!n)
                        return this.isClickAble(this.getParent(t))
                }
                return s
            },
            hasBindClick: function(t) {
                return !!(t.onclick || window.jQuery && (window.jQuery._data || window.jQuery.data) && i.isFunction(window.jQuery._data || window.jQuery.data) && (window.jQuery._data || window.jQuery.data)(t, "events"))
            },
            getParent: function(t) {
                return t.parentNode
            },
            getIndexInParent: function(t) {
                for (var e = this.getParent(t), n = this.getSelector(t), i = r.query(e, n), o = 0, a = i.length; o < a; o++) {
                    if (i[o] === t)
                        return o
                }
                return 0
            },
            getSelector: function(t) {
                for (var e = this.getAttr(t, "id"), n = this.getTagName(t), r = i.trim(this.getAttr(t, "class")).split(/\s/), o = [], a = 0, s = r.length; a < s; a++)
                    new RegExp(this.prefix.interface + "|" + this.prefix.expand).test(r[a]) || o.push(r[a]);
                return o = o.join("."),
                e ? "#" + e : n + (o = o ? "." + o : "")
            },
            getUniqueSelector: function(t, e) {
                var n = this.getSelector(t);
                return /#/.test(n) || "body" === this.getTagName(t) ? (e && (n = n + ">" + e),
                n) : this.getParent(t) ? (n += ":eq(" + this.getIndexInParent(t) + ")",
                e && (n = n + ">" + e),
                this.getUniqueSelector(this.getParent(t), n)) : ""
            },
            getTextContent: function(t) {
                return t && (t.textContent || t.innerText || this.getAttr(t, "type") || t.value) || ""
            },
            query: function() {
                var t = ""
                  , e = window.document
                  , n = /:eq\(\d+\)/g;
                if (i.isString(arguments[0]) ? t = arguments[0] : (e = arguments[0] || e,
                t = arguments[1]),
                this.isTextNode(e))
                    return [];
                if (n.test(t)) {
                    for (var r = t.split(n), o = t.match(n), a = null, s = 0, c = r.length; s < c; s++) {
                        var u = r[s].replace(/^>/, ":scope>");
                        if (!u)
                            break;
                        if (a = this.query(a || e, u),
                        !(o.length > s))
                            return a;
                        var d = o[s].match(/\d+/)[0];
                        if (!(a && d < a.length))
                            return [];
                        a = a[d]
                    }
                    return [a]
                }
                if (i.isString(t)) {
                    var f = t.match(/^[a-z|>|:]*[#.]\d/);
                    if (f && f.length) {
                        var l = (f[0] || "").length - 1;
                        t = t.slice(0, l) + "\\00003" + t.slice(l)
                    }
                }
                return e.querySelectorAll(t)
            },
            isTextNode: function(t) {
                return "#text" === t.nodeName
            },
            loadJs: function(t) {
                t = i.extend({
                    async: !0,
                    src: "",
                    onLoad: null,
                    onError: null,
                    context: null
                }, t || {});
                var e = document.createElement("script");
                this.setAttr(e, {
                    async: t.async,
                    src: t.src
                }),
                this.bind(e, "load", t.onLoad, t.context),
                this.bind(e, "error", t.onError, t.context),
                this.body.appendChild(e)
            }
        };
        t.exports = r
    },
    69: function(t, e, n) {
        var i = n(0)
          , r = function(t, e) {
            this.name = t,
            this.props = {},
            this.config = i.extend({}, e),
            this.load()
        };
        r.prototype.load = function() {
            var t = i.cookie.parse(this.name);
            t && (this.props = i.extend({}, t))
        }
        ,
        r.prototype.save = function() {
            i.cookie.set(this.name, i.JSONEncode(this.props), this.config.cookie_expire_days, this.config.cookie_cross_subdomain, this.config.cookie_secure)
        }
        ,
        r.prototype.register_once = function(t, e) {
            return !!i.isObject(t) && (void 0 === e && (e = "None"),
            i.each(t, function(t, n) {
                this.props[n] && this.props[n] !== e || (this.props[n] = t)
            }, this),
            this.save(),
            !0)
        }
        ,
        r.prototype.register = function(t) {
            return !!i.isObject(t) && (i.extend(this.props, t),
            this.save(),
            !0)
        }
        ,
        t.exports = r
    },
    7: function(t, e) {
        t.exports = {
            MODE: {
                NORMAL: 0,
                CREATE: 1,
                CREATING_EVENT: 2,
                ADD_SAME: 3,
                ADDING_SAME_AUTO: 4,
                ADDING_SAME_CUSTOM: 5,
                ADD_PROPERTY: 6,
                ADDING_PROPERTY: 7
            },
            SESSION_KEYS: {
                IS_ANALYSIS_MODE: "isZhugeVisualizerMode",
                PARAMS: "jsVisualizerParam"
            }
        }
    },
    70: function(t, e, n) {
        var i = n(0)
          , r = n(1)
          , o = (n(5),
        n(25));
        function a(t, e) {
            (this.config = i.extend({
                open: !1
            }, e || {}),
            this.tracker = t,
            this.loaded = !1,
            this.config.open) && (this._init(),
            "heatMap" === (window.sessionStorage.getItem("zhugeAnalysisModeType") || "") && this._initQueryParam())
        }
        a.prototype = {
            constructor: a,
            _init: function() {
                r.ready(function() {
                    this._initEventBind()
                }, this)
            },
            _initEventBind: function() {
                r.bind(window, "message", this._onMessage, this)
            },
            _initQueryParam: function() {
                (window.opener || window.parent).postMessage({
                    command: "getHeatMapQueryParam",
                    data: {
                        rect: r.getRect(r.body)
                    }
                }, "http://io.jiankangzhan.com:8080")
            },
            _onMessage: function(t) {
                var e = t.origin
                  , n = t.data;
                if ("http://io.jiankangzhan.com:8080" === e)
                    switch (n.command) {
                    case "pageReload":
                        window.sessionStorage.removeItem("zhugeAnalysisModeType"),
                        location.reload();
                        break;
                    case "openJsHeatMap":
                        this._initQueryParam();
                        break;
                    case "getHeatMapQueryParam":
                        window.sessionStorage.setItem(o.SESSION_KEYS.PARAMS, JSON.stringify(n.params)),
                        this._loadAnalysisCode()
                    }
            },
            _loadAnalysisCode: function() {
                if (!this.loaded) {
                    this.loaded = !0,
                    window.sessionStorage.setItem("zhugeAnalysisModeType", "heatMap");
                    var t = "http://io.jiankangzhan.com:8080/webapp/lib/sdk/heatMap.min.js".replace(/\"/g, "");
                    r.loadJs({
                        src: t + "?a=" + Math.random()
                    })
                }
            }
        },
        t.exports = a
    },
    71: function(t, e, n) {
        var i = n(0)
          , r = n(6)
          , o = n(5)
          , a = n(7);
        function s(t, e) {
            this.config = i.extend({
                open: !1,
                stopTrack: null
            }, e || {}),
            this.tracker = t,
            this.eventList = [],
            this.loaded = !1,
            this.config.open && this._init()
        }
        s.prototype = {
            constructor: s,
            _init: function() {
                r.ready(function() {
                    this._initEventBind(),
                    this._loadEventList(),
                    window.sessionStorage.getItem(a.SESSION_KEYS.IS_ANALYSIS_MODE) && this._loadAnalysisCode()
                }, this)
            },
            _initEventBind: function() {
                r.bind(window, "message", this._onMessage, this)
            },
            _loadEventList: function() {
                o("http://io.jiankangzhan.com:8800/v2/visual", {
                    type: "get",
                    data: {
                        url: location.href,
                        app_key: this.tracker.getKey(),
                        platform: 3
                    },
                    context: this,
                    jsonp: !0,
                    success: function(t) {
                        10001 === t.code && (this.eventList = t.visual_events)
                    }
                })
            },
            _onMessage: function(t) {
                var e = t.origin
                  , n = t.data;
                if ("http://io.jiankangzhan.com:8080" === e)
                    switch (n.command) {
                    case "openJsVisualizer":
                        window.opener.postMessage({
                            command: "getQueryParam"
                        }, e);
                        break;
                    case "getQueryParam":
                        window.sessionStorage.setItem(a.SESSION_KEYS.PARAMS, JSON.stringify(n.data)),
                        this._loadAnalysisCode()
                    }
            },
            _loadAnalysisCode: function() {
                if (!this.loaded) {
                    this.loaded = !0,
                    this.config.stopTrack(),
                    window.sessionStorage.setItem(a.SESSION_KEYS.IS_ANALYSIS_MODE, JSON.stringify({
                        flag: !0
                    }));
                    var t = "http://io.jiankangzhan.com:8080/webapp/lib/sdk/visualizer.min.js".replace(/\"/g, "");
                    r.loadJs({
                        src: t + "?a=" + Math.random()
                    })
                }
            },
            getEvent: function(t) {
                for (var e = [], n = 0, i = this.eventList.length; n < i; n++)
                    for (var o = this.eventList[n], a = 0; a < o.element.length; a++)
                        if (r.is(t.target, o.element[a]).flag) {
                            for (var s = {
                                element_content: r.getTextContent(t.target),
                                element_link: t.isValidLink ? r.getAttr(t.target, "href") : null
                            }, c = 0; c < o.attr.length; c++) {
                                var u = o.attr[c];
                                s[u.name] = r.getTextContent(r.query(u.selector)[0])
                            }
                            var d = {
                                dt: "evt",
                                eid: o.event_name,
                                param: s
                            };
                            e.push(d)
                        }
                return e
            }
        },
        t.exports = s
    },
    72: function(t, e, n) {
        var i = n(0)
          , r = n(6)
          , o = n(8)
          , a = n(15)
          , s = n(5);
        function c(t, e) {
            this.tracker = t,
            this.config = i.extend({
                open: !1,
                isClickAble: null,
                singlePage: !1
            }, e),
            this.loaded = !1,
            this.config.open && this._init()
        }
        c.prototype = {
            constructor: c,
            _init: function() {
                this.config.singlePage && this._initHistoryHook(),
                this._onView(),
                r.ready(function() {
                    this._initEventBind(),
                    this._checkPermissions()
                }, this)
            },
            _initHistoryHook: function() {
                var t = window.history
                  , e = t.pushState
                  , n = this;
                t.pushState = function(i) {
                    var r = e.apply(t, arguments);
                    return n._onView(),
                    r
                }
            },
            _initEventBind: function() {
                r.bind(window, "message", this._onMessage, this),
                this.config.singlePage && (r.bind(window, "popstate", this._onView, this),
                r.bind(window, "hashchange", this._onView, this))
            },
            _checkPermissions: function() {
                "analysis" === window.sessionStorage.getItem("zhugeAnalysisModeType") && s(a.url.checkLogin, {
                    type: a.json ? "get" : "post",
                    context: this,
                    success: function(t) {
                        t.authorized && this._loadAnalysisCode()
                    },
                    error: function(t) {
                        console && console.error("加载分析脚本失败", t)
                    }
                })
            },
            _loadAnalysisCode: function() {
                if (!this.loaded) {
                    this.loaded = !0,
                    window.sessionStorage.setItem("zhugeAnalysisModeType", "analysis");
                    var t = "http://io.jiankangzhan.com:8080/webapp/lib/sdk/analysis.min.js".replace(/\"/g, "");
                    r.loadJs({
                        src: t + "?a=" + Math.random()
                    })
                }
            },
            _onMessage: function(t) {
                if ("http://io.jiankangzhan.com:8080" === t.origin) {
                    var e = t.data;
                    switch (e.command) {
                    case "pageReload":
                        window.sessionStorage.removeItem("zhugeAnalysisModeType"),
                        location.reload();
                        break;
                    case "authorized":
                        var n = window.opener || window.parent;
                        if (n === window)
                            return;
                        n.postMessage({
                            command: "hasOpenAutoTrackAnalysis"
                        }, "http://io.jiankangzhan.com:8080"),
                        this._loadAnalysisCode();
                        break;
                    default:
                        console && console.warn("未识别的message信息", e)
                    }
                }
            },
            _onView: function() {
                var t = {
                    $page_title: window.document.title
                };
                this.config.isLanding && (t.$landing_page = !0),
                this.tracker.batchTrack([{
                    dt: "abp",
                    eid: "pv",
                    param: t
                }])
            },
            getEvent: function(t) {
                var e = r.getUniqueSelector(t.target);
                if (e) {
                    var n = t.target
                      , i = {
                        $page_title: window.document.title,
                        $element_id: r.getAttr(n, "id"),
                        $element_content: r.getTextContent(n),
                        $element_type: r.getTagName(n),
                        $element_style: r.getAttr(n, "class"),
                        $element_selector: o(e),
                        $element_link: t.isValidLink ? r.getAttr(n, "href") : null
                    };
                    return this.config.isLanding && (i.$landing_page = !0),
                    {
                        dt: "abp",
                        eid: "click",
                        param: i
                    }
                }
            }
        },
        t.exports = c
    },
    73: function(t, e, n) {
        var i = n(0)
          , r = n(72)
          , o = n(71)
          , a = n(70)
          , s = n(6)
          , c = n(69)
          , u = []
          , d = ["identify", "track", "page"]
          , f = null
          , l = function(t) {
            this.config = {},
            i.extend(this.config, t),
            this.idle = 0,
            this.last_activity = new Date,
            this.is_landing = !1
        };
        l.prototype._init = function(t, e, n) {
            if (this._key = t,
            this._jsc = function() {}
            ,
            i.isObject(e))
                for (var r in i.extend(this.config, e),
                this.config)
                    i.isObject(this.config[r]) && (this.config[r] = i.JSONEncode(this.config[r]));
            var o = this
              , a = function(t, e) {
                o._initDid(t),
                o.cookie = new c("zg_" + o._key,o.config);
                var n = i.cookie.get("_zg");
                n && o.config.inherit_user_data ? (o.cookie.register_once(i.JSONDecode(n), ""),
                i.cookie.remove("_zg")) : o.cookie.register_once({
                    sid: 0,
                    updated: 0,
                    info: 0,
                    superProperty: o.config.superProperty,
                    platform: o.config.platform
                }, ""),
                o.cookie.register({
                    superProperty: o.config.superProperty,
                    platform: o.config.platform
                });
                var r = o._session(e);
                o.is_landing = o._checkLanding(r),
                o._info(),
                o._startPing(),
                o._initAutoTrack(),
                o.is_landing && o._initLanding()
            };
            this.config.adTrack ? (o._wrapTrackerFunction(),
            i.jsonp("http://io.jiankangzhan.com/v2/adtrack/header", function(t) {
                a(t.zg_adver_did, t.zg_adver_sid),
                n(),
                o._doTrackerQueue()
            }, function() {
                a(),
                n(),
                o._doTrackerQueue()
            })) : (a(),
            n())
        }
        ,
        l.prototype._checkLanding = function(t) {
            var e = !1
              , n = i.getDomain(location.href) !== i.getDomain(document.referrer);
            return t ? n && (e = !0,
            this.cookie.register({
                landHref: location.href
            })) : n && location.href === this.cookie.props.landHref && (e = !0),
            e
        }
        ,
        l.prototype._initLanding = function() {
            var t = this
              , e = function(e) {
                t.config.autoTrack && (f && clearTimeout(f),
                f = setTimeout(function() {
                    t.batchTrack([{
                        dt: "abp",
                        eid: "scroll",
                        param: {
                            $page_title: window.document.title,
                            $scroll: Math.floor(window.innerHeight + window.scrollY)
                        }
                    }])
                }, 50))
            };
            s.ready(function() {
                s.bind(window, "scroll", e)
            }, this)
        }
        ,
        l.prototype._wrapTrackerFunction = function() {
            var t = this
              , e = {}
              , n = ""
              , r = 0;
            for (r = 0; r < d.length; r++)
                e[n = d[r]] = l.prototype[n],
                l.prototype[n] = function(n) {
                    return function() {
                        t.cookie ? i.isFunction(e[n]) && e[n].apply(t, arguments) : u.push([e[n], arguments])
                    }
                }(n)
        }
        ,
        l.prototype._doTrackerQueue = function() {
            var t = 0
              , e = null;
            for (t = 0; t < u.length; t++)
                e = u[t] || [],
                i.isFunction(e[0]) && e[0].apply(this, e[1] || []);
            u = []
        }
        ,
        l.prototype._initAutoTrack = function() {
            var t = !0
              , e = new o(this,{
                open: this.config.visualizer,
                stopTrack: function() {
                    t = !1
                }
            })
              , n = new r(this,{
                open: this.config.autoTrack,
                isClickAble: this.config.isClickAble,
                singlePage: this.config.singlePage,
                isLanding: this.is_landing
            })
              , c = (new a(this,{
                open: this.config.autoTrack
            }),
            this)
              , u = function(r) {
                if (t) {
                    var o = s.isClickAble(r.target, c.config.isClickAble);
                    if (o.flag) {
                        var a = [];
                        if (c.config.autoTrack && !i.hasMobileSdk().flag && a.push(n.getEvent(o)),
                        c.config.visualizer && (a = e.getEvent(o).concat(a)),
                        o.form)
                            if ((!(u = s.getAttr(o.form, "target")) || "_self" === u) && c.config.redirectAfterTrack)
                                return c.batchTrack(a, function() {
                                    o.form.submit()
                                }),
                                !1;
                        if (o.isValidLink) {
                            var u, d = s.getAttr(o.target, "href");
                            if ((!(u = s.getAttr(o.target, "target")) || "_self" === u) && c.config.redirectAfterTrack)
                                return c.batchTrack(a, function() {
                                    location.href = d
                                }),
                                !1
                        }
                        a.length && c.batchTrack(a)
                    }
                }
            };
            s.ready(function() {
                s.bind(s.body, "click", u)
            }, this)
        }
        ,
        l.prototype._session = function(t) {
            var e = !1
              , n = this.cookie.props.updated
              , r = this.cookie.props.sid
              , o = 1 * new Date
              , a = new Date;
            if (0 == r || o > n + 60 * this.config.session_interval_mins * 1e3) {
                if (r > 0 && n > 0) {
                    var s = {
                        dt: "se",
                        pr: {}
                    };
                    s.pr.$ct = a.getTime(),
                    s.pr.$tz = 6e4 * -a.getTimezoneOffset(),
                    s.pr.$dru = n - r,
                    s.pr.$sid = r,
                    s.pr.$cuid = this.cookie.props.cuid,
                    this._batchTrack(s)
                }
                r = t || o,
                r *= 1;
                var c = {
                    dt: "ss",
                    pr: {}
                }
                  , u = i.info.campaignParams(this.config.utm);
                c.pr = i.extend(c.pr, u),
                this.cookie.register({
                    utm: i.JSONEncode(u)
                }, ""),
                c.pr.$ct = a.getTime(),
                c.pr.$sid = r,
                c.pr.$cuid = this.cookie.props.cuid,
                c.pr.$cn = this.config.app_channel,
                c.pr.$vn = this.config.app_version,
                c.pr.$tz = 6e4 * -a.getTimezoneOffset(),
                c.pr.$url = location.href,
                c.pr.$ref = document.referrer;
                var d = i.getDomain(document.referrer);
                c.pr.$referrer_domain = d,
                this.cookie.register({
                    referrerDomain: d
                }, ""),
                this._batchTrack(c),
                this.cookie.register({
                    sid: r
                }, ""),
                e = !0
            }
            return this.cookie.register({
                updated: o
            }, ""),
            e
        }
        ,
        l.prototype._info = function() {
            var t = this.cookie.props.info
              , e = 1 * new Date;
            if (e > t + 24 * this.config.info_upload_interval_days * 60 * 60 * 1e3) {
                var n = {
                    dt: "pl",
                    pr: {
                        $rs: i.info.resolution()
                    }
                }
                  , r = new Date;
                n.pr.$tz = 6e4 * -r.getTimezoneOffset(),
                n.pr.$ct = r.getTime(),
                n.pr.$cuid = this.cookie.props.cuid,
                n.pr = i.extend(n.pr, i.encode(i.JSONDecode(this.cookie.props.platform))),
                this._batchTrack(n),
                this.cookie.register({
                    info: e
                }, "")
            }
        }
        ,
        l.prototype.debug = function(t) {
            this.config.debug = t
        }
        ,
        l.prototype.identify = function(t, e, n) {
            t += "";
            var r = i.isObject(e) ? e : {}
              , o = i.isObject(e) ? n : e;
            this.cookie.register({
                cuid: t
            }, ""),
            this._session();
            var a = i.hasMobileSdk();
            if (a.flag)
                a.identify(t, r),
                i.isFunction(o) && o();
            else {
                var s = {
                    dt: "usr",
                    pr: {}
                }
                  , c = new Date;
                s.pr.$ct = c.getTime(),
                s.pr.$tz = 6e4 * -c.getTimezoneOffset(),
                s.pr.$cuid = t,
                s.pr.$sid = this.cookie.props.sid,
                s.pr.$url = location.href,
                s.pr.$ref = document.referrer,
                s.pr = i.extend(s.pr, i.encode(r)),
                this._batchTrack(s, o)
            }
        }
        ,
        l.prototype.setUserProperties = function(t, e) {
            this.identify(this.cookie.props.cuid, t, e)
        }
        ,
        l.prototype.page = function(t, e) {
            this._session();
            var n = document.location.href
              , i = {
                et: "pg"
            };
            i.pid = n,
            i.pn = void 0 === t ? n : t,
            i.tl = document.title,
            i.ref = document.referrer,
            i.sid = this.cookie.props.sid,
            this._batchTrack(i, e)
        }
        ,
        l.prototype.setWxProperties = function(t, e, n) {
            if (t && e) {
                var r = new Date
                  , o = {
                    dt: "um",
                    pr: {
                        $push_ch: "zgwx",
                        $wx_appid: t,
                        $wx_openid: e,
                        $ct: r.getTime(),
                        $tz: 6e4 * -r.getTimezoneOffset()
                    }
                }
                  , a = this.cookie.props.cuid;
                a && (o.pr.$cuid = a),
                this._batchTrack(o, n)
            } else
                i.isFunction(n) && n()
        }
        ,
        l.prototype.track = function(t, e, n) {
            var r = i.isObject(e) ? e : {}
              , o = i.isObject(e) ? n : e
              , a = i.hasMobileSdk();
            a.flag ? (a.track(t, r),
            i.isFunction(o) && o()) : this.batchTrack([{
                dt: "evt",
                eid: t,
                param: r
            }], o)
        }
        ,
        l.prototype.batchTrack = function(t, e) {
            this._session();
            var n = []
              , r = new Date
              , o = this.cookie.props.utm ? i.JSONDecode(this.cookie.props.utm) : {}
              , a = document.URL;
            this.is_landing && this.cookie.props.landHref && (a = this.cookie.props.landHref);
            for (var s = 0, c = t.length; s < c; s++) {
                var u = t[s];
                if (u && u.dt) {
                    var d = {
                        dt: u.dt,
                        pr: {}
                    };
                    for (var f in d.pr.$ct = r.getTime(),
                    d.pr.$tz = 6e4 * -r.getTimezoneOffset(),
                    d.pr.$cuid = this.cookie.props.cuid,
                    d.pr.$sid = this.cookie.props.sid,
                    d.pr.$url = a,
                    d.pr.$ref = document.referrer,
                    d.pr.$referrer_domain = this.cookie.props.referrerDomain,
                    d.pr.$eid = u.eid,
                    o)
                        d.pr[f] = o[f];
                    "evt" === u.dt ? d.pr = i.extend(d.pr, i.encode(u.param)) : d.pr = i.extend(d.pr, u.param),
                    d.pr = i.extend(d.pr, i.encode(i.JSONDecode(this.cookie.props.superProperty))),
                    n.push(d)
                }
            }
            n.length && this._batchTrack(n, e)
        }
        ,
        l.prototype._moved = function(t) {
            this.last_activity = new Date,
            this.idle = 0
        }
        ,
        l.prototype._startPing = function() {
            var t = this;
            i.register_event(window, "mousemove", function() {
                t._moved.apply(t, arguments)
            }),
            void 0 === this.pingInterval && (this.pingInterval = window.setInterval(function() {
                t._ping()
            }, this.config.ping_interval))
        }
        ,
        l.prototype._stopPing = function() {
            void 0 !== this.pingInterval && (window.clearInterval(this.pingInterval),
            delete this.pingInterval)
        }
        ,
        l.prototype._ping = function() {
            if (this.config.ping && this.idle < this.config.idle_timeout) {
                var t = {
                    type: "ping",
                    sdk: "web",
                    sdkv: "2.0"
                };
                t.ak = this._key,
                t.did = this.did.props.did,
                t.cuid = this.cookie.props.cuid,
                this._sendTrackRequest(t)
            } else
                this._stopPing();
            var e = new Date;
            return e - this.last_activity > this.config.idle_threshold && (this.idle = e - this.last_activity),
            this
        }
        ,
        l.prototype.getDid = function() {
            return this.did.props.did
        }
        ,
        l.prototype.getSid = function() {
            return this.cookie.props.sid
        }
        ,
        l.prototype.setSuperProperty = function(t) {
            i.isObject(t) && this.cookie.register({
                superProperty: i.JSONEncode(t)
            })
        }
        ,
        l.prototype.setPlatform = function(t) {
            i.isObject(t) && (this.cookie.register({
                platform: i.JSONEncode(t),
                info: 0
            }),
            this._info())
        }
        ,
        l.prototype._batchTrack = function(t, e) {
            if (!i.hasMobileSdk().flag) {
                var n = {}
                  , r = new Date;
                n.sln = "itn",
                n.pl = "js",
                n.sdk = "zg-js",
                n.sdkv = "2.0",
                n.owner = "zg",
                n.ut = [r.getFullYear(), r.getMonth() + 1, r.getDate()].join("-") + " " + r.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0],
                n.tz = 6e4 * -r.getTimezoneOffset(),
                n.debug = this.config.debug ? 1 : 0,
                n.ak = this._key,
                n.usr = {
                    did: this.did.props.did
                };
                var o = [];
                i.isArray(t) ? o = t : o.push(t),
                n.data = o,
                this._sendTrackRequest(n, this._prepareCallback(e, n))
            }
        }
        ,
        l.prototype._prepareCallback = function(t, e) {
            if (!i.isFunction(t))
                return null;
            return function(n) {
                t(n, e)
            }
        }
        ,
        l.prototype._initDid = function(t) {
            var e = i.cookie.get("_zg");
            t = t || i.UUID();
            e && i.JSONDecode(e).uuid && (t = i.JSONDecode(e).uuid),
            i.cookie.get("zg_did") || i.cookie.remove("zg_" + this._key),
            this.did = new c("zg_did",this.config),
            this.did.register_once({
                did: t
            }, "")
        }
        ,
        l.prototype._sendTrackRequest = function(t, e) {
            var n = i.truncate(t, 255)
              , r = {
                event: i.JSONEncode(n),
                _: (new Date).getTime().toString()
            }
              , o = {
                bac: this.config.api_host_bac + "&" + i.HTTPBuildQuery(r),
                normal: this.config.api_host + "&" + i.HTTPBuildQuery(r)
            };
            this._sendRequest(o, e)
        }
        ,
        l.prototype._sendRequest = function(t, e) {
            var n = new Image
              , i = !1
              , r = setTimeout(function() {
                !i && e && (e(),
                i = !0)
            }, 500)
              , o = function() {
                !i && e && (clearTimeout(r),
                e())
            };
            n.onload = o,
            n.onerror = function() {
                var e = new Image;
                e.onload = o,
                e.onerror = o,
                e.src = t.bac
            }
            ,
            n.src = t.normal
        }
        ,
        l.prototype.push = function(t) {
            var e = t.shift();
            this[e] && this[e].apply(this, t)
        }
        ,
        l.prototype.getKey = function() {
            return this._key
        }
        ,
        t.exports = l
    },
    74: function(t, e, n) {
        for (var i = n(73), r = n(6), o = {
            api_host: "http://io.jiankangzhan.com/web_event/web.gif?method=web_event_srv.upload",
            api_host_bac: "http://io.jiankangzhan.com/web_event/web.gif?method=web_event_srv.upload",
            debug: !1,
            inherit_user_data: !0,
            ping: !1,
            ping_interval: 12e3,
            idle_timeout: 3e5,
            idle_threshold: 1e4,
            track_link_timeout: 300,
            cookie_expire_days: 365,
            cookie_cross_subdomain: !0,
            cookie_secure: !1,
            info_upload_interval_days: 7,
            session_interval_mins: 30,
            app_channel: "js",
            app_version: "1.0",
            superProperty: "{}",
            platform: "{}",
            autoTrack: !1,
            isClickAble: null,
            redirectAfterTrack: !1,
            singlePage: !1,
            visualizer: !1,
            deepShare: !1,
            onLoadDeepShare: null,
            utm: {},
            adTrack: !1
        }, a = window.zhuge || [], s = new i(o), c = 0; c < a.length; c++)
            if ("_init" === a[c][0]) {
                var u = a.shift()
                  , d = u.shift();
                u.push(function() {
                    for (; a && a.length > 0; ) {
                        var t = a.shift()
                          , e = t.shift();
                        s[e] && s[e].apply(s, t)
                    }
                }),
                s[d] && s[d].apply(s, u);
                break
            }
        if (s.config.deepShare) {
            var f = new Date
              , l = f.getFullYear().toString() + f.getMonth().toString() + f.getDate().toString();
            r.loadJs({
                src: "http://io.jiankangzhan.com:8080/webapp/lib/sdk/deepshare.min.js?v=" + l,
                onLoad: s.config.onLoadDeepShare
            })
        }
        window.zhuge = s
    },
    8: function(t, e) {
        function n(t, e) {
            var n = (65535 & t) + (65535 & e);
            return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
        }
        function i(t, e, i, r, o, a) {
            return n((s = n(n(e, t), n(r, a))) << (c = o) | s >>> 32 - c, i);
            var s, c
        }
        function r(t, e, n, r, o, a, s) {
            return i(e & n | ~e & r, t, e, o, a, s)
        }
        function o(t, e, n, r, o, a, s) {
            return i(e & r | n & ~r, t, e, o, a, s)
        }
        function a(t, e, n, r, o, a, s) {
            return i(e ^ n ^ r, t, e, o, a, s)
        }
        function s(t, e, n, r, o, a, s) {
            return i(n ^ (e | ~r), t, e, o, a, s)
        }
        function c(t, e) {
            var i, c, u, d, f;
            t[e >> 5] |= 128 << e % 32,
            t[14 + (e + 64 >>> 9 << 4)] = e;
            var l = 1732584193
              , h = -271733879
              , p = -1732584194
              , g = 271733878;
            for (i = 0; i < t.length; i += 16)
                c = l,
                u = h,
                d = p,
                f = g,
                h = s(h = s(h = s(h = s(h = a(h = a(h = a(h = a(h = o(h = o(h = o(h = o(h = r(h = r(h = r(h = r(h, p = r(p, g = r(g, l = r(l, h, p, g, t[i], 7, -680876936), h, p, t[i + 1], 12, -389564586), l, h, t[i + 2], 17, 606105819), g, l, t[i + 3], 22, -1044525330), p = r(p, g = r(g, l = r(l, h, p, g, t[i + 4], 7, -176418897), h, p, t[i + 5], 12, 1200080426), l, h, t[i + 6], 17, -1473231341), g, l, t[i + 7], 22, -45705983), p = r(p, g = r(g, l = r(l, h, p, g, t[i + 8], 7, 1770035416), h, p, t[i + 9], 12, -1958414417), l, h, t[i + 10], 17, -42063), g, l, t[i + 11], 22, -1990404162), p = r(p, g = r(g, l = r(l, h, p, g, t[i + 12], 7, 1804603682), h, p, t[i + 13], 12, -40341101), l, h, t[i + 14], 17, -1502002290), g, l, t[i + 15], 22, 1236535329), p = o(p, g = o(g, l = o(l, h, p, g, t[i + 1], 5, -165796510), h, p, t[i + 6], 9, -1069501632), l, h, t[i + 11], 14, 643717713), g, l, t[i], 20, -373897302), p = o(p, g = o(g, l = o(l, h, p, g, t[i + 5], 5, -701558691), h, p, t[i + 10], 9, 38016083), l, h, t[i + 15], 14, -660478335), g, l, t[i + 4], 20, -405537848), p = o(p, g = o(g, l = o(l, h, p, g, t[i + 9], 5, 568446438), h, p, t[i + 14], 9, -1019803690), l, h, t[i + 3], 14, -187363961), g, l, t[i + 8], 20, 1163531501), p = o(p, g = o(g, l = o(l, h, p, g, t[i + 13], 5, -1444681467), h, p, t[i + 2], 9, -51403784), l, h, t[i + 7], 14, 1735328473), g, l, t[i + 12], 20, -1926607734), p = a(p, g = a(g, l = a(l, h, p, g, t[i + 5], 4, -378558), h, p, t[i + 8], 11, -2022574463), l, h, t[i + 11], 16, 1839030562), g, l, t[i + 14], 23, -35309556), p = a(p, g = a(g, l = a(l, h, p, g, t[i + 1], 4, -1530992060), h, p, t[i + 4], 11, 1272893353), l, h, t[i + 7], 16, -155497632), g, l, t[i + 10], 23, -1094730640), p = a(p, g = a(g, l = a(l, h, p, g, t[i + 13], 4, 681279174), h, p, t[i], 11, -358537222), l, h, t[i + 3], 16, -722521979), g, l, t[i + 6], 23, 76029189), p = a(p, g = a(g, l = a(l, h, p, g, t[i + 9], 4, -640364487), h, p, t[i + 12], 11, -421815835), l, h, t[i + 15], 16, 530742520), g, l, t[i + 2], 23, -995338651), p = s(p, g = s(g, l = s(l, h, p, g, t[i], 6, -198630844), h, p, t[i + 7], 10, 1126891415), l, h, t[i + 14], 15, -1416354905), g, l, t[i + 5], 21, -57434055), p = s(p, g = s(g, l = s(l, h, p, g, t[i + 12], 6, 1700485571), h, p, t[i + 3], 10, -1894986606), l, h, t[i + 10], 15, -1051523), g, l, t[i + 1], 21, -2054922799), p = s(p, g = s(g, l = s(l, h, p, g, t[i + 8], 6, 1873313359), h, p, t[i + 15], 10, -30611744), l, h, t[i + 6], 15, -1560198380), g, l, t[i + 13], 21, 1309151649), p = s(p, g = s(g, l = s(l, h, p, g, t[i + 4], 6, -145523070), h, p, t[i + 11], 10, -1120210379), l, h, t[i + 2], 15, 718787259), g, l, t[i + 9], 21, -343485551),
                l = n(l, c),
                h = n(h, u),
                p = n(p, d),
                g = n(g, f);
            return [l, h, p, g]
        }
        function u(t) {
            var e, n = "", i = 32 * t.length;
            for (e = 0; e < i; e += 8)
                n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
            return n
        }
        function d(t) {
            var e, n = [];
            for (n[(t.length >> 2) - 1] = void 0,
            e = 0; e < n.length; e += 1)
                n[e] = 0;
            var i = 8 * t.length;
            for (e = 0; e < i; e += 8)
                n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
            return n
        }
        function f(t) {
            var e, n, i = "";
            for (n = 0; n < t.length; n += 1)
                e = t.charCodeAt(n),
                i += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(15 & e);
            return i
        }
        function l(t) {
            return unescape(encodeURIComponent(t))
        }
        function h(t) {
            return function(t) {
                return u(c(d(t), 8 * t.length))
            }(l(t))
        }
        function p(t, e) {
            return function(t, e) {
                var n, i, r = d(t), o = [], a = [];
                for (o[15] = a[15] = void 0,
                r.length > 16 && (r = c(r, 8 * t.length)),
                n = 0; n < 16; n += 1)
                    o[n] = 909522486 ^ r[n],
                    a[n] = 1549556828 ^ r[n];
                return i = c(o.concat(d(e)), 512 + 8 * e.length),
                u(c(a.concat(i), 640))
            }(l(t), l(e))
        }
        t.exports = function(t, e, n) {
            return e ? n ? p(e, t) : f(p(e, t)) : n ? h(t) : f(h(t))
        }
    }
});
