! function(a, b) {
    "use strict";

    function c() {
        if (!d.READY) {
            d.event.determineEventTypes();
            for (var a in d.gestures) d.gestures.hasOwnProperty(a) && d.detection.register(d.gestures[a]);
            d.event.onTouch(d.DOCUMENT, d.EVENT_MOVE, d.detection.detect), d.event.onTouch(d.DOCUMENT, d.EVENT_END, d.detection.detect), d.READY = !0
        }
    }
    var d = function(a, b) {
        return new d.Instance(a, b || {})
    };
    d.defaults = {
        stop_browser_behavior: {
            userSelect: "none",
            touchAction: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    }, d.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, d.HAS_TOUCHEVENTS = "ontouchstart" in a, d.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, d.NO_MOUSEEVENTS = d.HAS_TOUCHEVENTS && navigator.userAgent.match(d.MOBILE_REGEX), d.EVENT_TYPES = {}, d.DIRECTION_DOWN = "down", d.DIRECTION_LEFT = "left", d.DIRECTION_UP = "up", d.DIRECTION_RIGHT = "right", d.POINTER_MOUSE = "mouse", d.POINTER_TOUCH = "touch", d.POINTER_PEN = "pen", d.EVENT_START = "start", d.EVENT_MOVE = "move", d.EVENT_END = "end", d.DOCUMENT = document, d.plugins = {}, d.READY = !1, d.Instance = function(a, b) {
        var e = this;
        return c(), this.element = a, this.enabled = !0, this.options = d.utils.extend(d.utils.extend({}, d.defaults), b || {}), this.options.stop_browser_behavior && d.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), d.event.onTouch(a, d.EVENT_START, function(a) {
            e.enabled && d.detection.startDetect(e, a)
        }), this
    }, d.Instance.prototype = {
        on: function(a, b) {
            for (var c = a.split(" "), d = 0; d < c.length; d++) this.element.addEventListener(c[d], b, !1);
            return this
        },
        off: function(a, b) {
            for (var c = a.split(" "), d = 0; d < c.length; d++) this.element.removeEventListener(c[d], b, !1);
            return this
        },
        trigger: function(a, b) {
            var c = d.DOCUMENT.createEvent("Event");
            c.initEvent(a, !0, !0), c.gesture = b;
            var e = this.element;
            return d.utils.hasParent(b.target, e) && (e = b.target), e.dispatchEvent(c), this
        },
        enable: function(a) {
            return this.enabled = a, this
        }
    };
    var e = null,
        f = !1,
        g = !1;
    d.event = {
        bindDom: function(a, b, c) {
            for (var d = b.split(" "), e = 0; e < d.length; e++) a.addEventListener(d[e], c, !1)
        },
        onTouch: function(a, b, c) {
            var h = this;
            this.bindDom(a, d.EVENT_TYPES[b], function(i) {
                var j = i.type.toLowerCase();
                if (!j.match(/mouse/) || !g) {
                    (j.match(/touch/) || j.match(/pointerdown/) || j.match(/mouse/) && 1 === i.which) && (f = !0), j.match(/touch|pointer/) && (g = !0);
                    var k = 0;
                    f && (d.HAS_POINTEREVENTS && b != d.EVENT_END ? k = d.PointerEvent.updatePointer(b, i) : j.match(/touch/) ? k = i.touches.length : g || (k = j.match(/up/) ? 0 : 1), k > 0 && b == d.EVENT_END ? b = d.EVENT_MOVE : k || (b = d.EVENT_END), k || null === e ? e = i : i = e, c.call(d.detection, h.collectEventData(a, b, i)), d.HAS_POINTEREVENTS && b == d.EVENT_END && (k = d.PointerEvent.updatePointer(b, i))), k || (e = null, f = !1, g = !1, d.PointerEvent.reset())
                }
            })
        },
        determineEventTypes: function() {
            var a;
            a = d.HAS_POINTEREVENTS ? d.PointerEvent.getEvents() : d.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], d.EVENT_TYPES[d.EVENT_START] = a[0], d.EVENT_TYPES[d.EVENT_MOVE] = a[1], d.EVENT_TYPES[d.EVENT_END] = a[2]
        },
        getTouchList: function(a) {
            return d.HAS_POINTEREVENTS ? d.PointerEvent.getTouchList() : a.touches ? a.touches : [{
                identifier: 1,
                pageX: a.pageX,
                pageY: a.pageY,
                target: a.target
            }]
        },
        collectEventData: function(a, b, c) {
            var e = this.getTouchList(c, b),
                f = d.POINTER_TOUCH;
            return (c.type.match(/mouse/) || d.PointerEvent.matchType(d.POINTER_MOUSE, c)) && (f = d.POINTER_MOUSE), {
                center: d.utils.getCenter(e),
                timeStamp: (new Date).getTime(),
                target: c.target,
                touches: e,
                eventType: b,
                pointerType: f,
                srcEvent: c,
                preventDefault: function() {
                    this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
                },
                stopPropagation: function() {
                    this.srcEvent.stopPropagation()
                },
                stopDetect: function() {
                    return d.detection.stopDetect()
                }
            }
        }
    }, d.PointerEvent = {
        pointers: {},
        getTouchList: function() {
            var a = this,
                b = [];
            return Object.keys(a.pointers).sort().forEach(function(c) {
                b.push(a.pointers[c])
            }), b
        },
        updatePointer: function(a, b) {
            return a == d.EVENT_END ? this.pointers = {} : (b.identifier = b.pointerId, this.pointers[b.pointerId] = b), Object.keys(this.pointers).length
        },
        matchType: function(a, b) {
            if (!b.pointerType) return !1;
            var c = {};
            return c[d.POINTER_MOUSE] = b.pointerType == b.MSPOINTER_TYPE_MOUSE || b.pointerType == d.POINTER_MOUSE, c[d.POINTER_TOUCH] = b.pointerType == b.MSPOINTER_TYPE_TOUCH || b.pointerType == d.POINTER_TOUCH, c[d.POINTER_PEN] = b.pointerType == b.MSPOINTER_TYPE_PEN || b.pointerType == d.POINTER_PEN, c[a]
        },
        getEvents: function() {
            return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
        },
        reset: function() {
            this.pointers = {}
        }
    }, d.utils = {
        extend: function(a, c, d) {
            for (var e in c) a[e] !== b && d || (a[e] = c[e]);
            return a
        },
        hasParent: function(a, b) {
            for (; a;) {
                if (a == b) return !0;
                a = a.parentNode
            }
            return !1
        },
        getCenter: function(a) {
            for (var b = [], c = [], d = 0, e = a.length; e > d; d++) b.push(a[d].pageX), c.push(a[d].pageY);
            return {
                pageX: (Math.min.apply(Math, b) + Math.max.apply(Math, b)) / 2,
                pageY: (Math.min.apply(Math, c) + Math.max.apply(Math, c)) / 2
            }
        },
        getVelocity: function(a, b, c) {
            return {
                x: Math.abs(b / a) || 0,
                y: Math.abs(c / a) || 0
            }
        },
        getAngle: function(a, b) {
            var c = b.pageY - a.pageY,
                d = b.pageX - a.pageX;
            return 180 * Math.atan2(c, d) / Math.PI
        },
        getDirection: function(a, b) {
            var c = Math.abs(a.pageX - b.pageX),
                e = Math.abs(a.pageY - b.pageY);
            return c >= e ? a.pageX - b.pageX > 0 ? d.DIRECTION_LEFT : d.DIRECTION_RIGHT : a.pageY - b.pageY > 0 ? d.DIRECTION_UP : d.DIRECTION_DOWN
        },
        getDistance: function(a, b) {
            var c = b.pageX - a.pageX,
                d = b.pageY - a.pageY;
            return Math.sqrt(c * c + d * d)
        },
        getScale: function(a, b) {
            return a.length >= 2 && b.length >= 2 ? this.getDistance(b[0], b[1]) / this.getDistance(a[0], a[1]) : 1
        },
        getRotation: function(a, b) {
            return a.length >= 2 && b.length >= 2 ? this.getAngle(b[1], b[0]) - this.getAngle(a[1], a[0]) : 0
        },
        isVertical: function(a) {
            return a == d.DIRECTION_UP || a == d.DIRECTION_DOWN
        },
        stopDefaultBrowserBehavior: function(a, b) {
            var c, d = ["webkit", "khtml", "moz", "ms", "o", ""];
            if (b && a.style) {
                for (var e = 0; e < d.length; e++)
                    for (var f in b) b.hasOwnProperty(f) && (c = f, d[e] && (c = d[e] + c.substring(0, 1).toUpperCase() + c.substring(1)), a.style[c] = b[f]);
                "none" == b.userSelect && (a.onselectstart = function() {
                    return !1
                })
            }
        }
    }, d.detection = {
        gestures: [],
        current: null,
        previous: null,
        stopped: !1,
        startDetect: function(a, b) {
            this.current || (this.stopped = !1, this.current = {
                inst: a,
                startEvent: d.utils.extend({}, b),
                lastEvent: !1,
                name: ""
            }, this.detect(b))
        },
        detect: function(a) {
            if (this.current && !this.stopped) {
                a = this.extendEventData(a);
                for (var b = this.current.inst.options, c = 0, e = this.gestures.length; e > c; c++) {
                    var f = this.gestures[c];
                    if (!this.stopped && b[f.name] !== !1 && f.handler.call(f, a, this.current.inst) === !1) {
                        this.stopDetect();
                        break
                    }
                }
                return this.current && (this.current.lastEvent = a), a.eventType == d.EVENT_END && !a.touches.length - 1 && this.stopDetect(), a
            }
        },
        stopDetect: function() {
            this.previous = d.utils.extend({}, this.current), this.current = null, this.stopped = !0
        },
        extendEventData: function(a) {
            var b = this.current.startEvent;
            if (b && (a.touches.length != b.touches.length || a.touches === b.touches)) {
                b.touches = [];
                for (var c = 0, e = a.touches.length; e > c; c++) b.touches.push(d.utils.extend({}, a.touches[c]))
            }
            var f = a.timeStamp - b.timeStamp,
                g = a.center.pageX - b.center.pageX,
                h = a.center.pageY - b.center.pageY,
                i = d.utils.getVelocity(f, g, h);
            return d.utils.extend(a, {
                deltaTime: f,
                deltaX: g,
                deltaY: h,
                velocityX: i.x,
                velocityY: i.y,
                distance: d.utils.getDistance(b.center, a.center),
                angle: d.utils.getAngle(b.center, a.center),
                direction: d.utils.getDirection(b.center, a.center),
                scale: d.utils.getScale(b.touches, a.touches),
                rotation: d.utils.getRotation(b.touches, a.touches),
                startEvent: b
            }), a
        },
        register: function(a) {
            var c = a.defaults || {};
            return c[a.name] === b && (c[a.name] = !0), d.utils.extend(d.defaults, c, !0), a.index = a.index || 1e3, this.gestures.push(a), this.gestures.sort(function(a, b) {
                return a.index < b.index ? -1 : a.index > b.index ? 1 : 0
            }), this.gestures
        }
    }, d.gestures = d.gestures || {}, d.gestures.Hold = {
        name: "hold",
        index: 10,
        defaults: {
            hold_timeout: 500,
            hold_threshold: 1
        },
        timer: null,
        handler: function(a, b) {
            switch (a.eventType) {
                case d.EVENT_START:
                    clearTimeout(this.timer), d.detection.current.name = this.name, this.timer = setTimeout(function() {
                        "hold" == d.detection.current.name && b.trigger("hold", a)
                    }, b.options.hold_timeout);
                    break;
                case d.EVENT_MOVE:
                    a.distance > b.options.hold_threshold && clearTimeout(this.timer);
                    break;
                case d.EVENT_END:
                    clearTimeout(this.timer)
            }
        }
    }, d.gestures.Tap = {
        name: "tap",
        index: 100,
        defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: !0,
            doubletap_distance: 20,
            doubletap_interval: 300
        },
        handler: function(a, b) {
            if (a.eventType == d.EVENT_END) {
                var c = d.detection.previous,
                    e = !1;
                if (a.deltaTime > b.options.tap_max_touchtime || a.distance > b.options.tap_max_distance) return;
                c && "tap" == c.name && a.timeStamp - c.lastEvent.timeStamp < b.options.doubletap_interval && a.distance < b.options.doubletap_distance && (b.trigger("doubletap", a), e = !0), (!e || b.options.tap_always) && (d.detection.current.name = "tap", b.trigger(d.detection.current.name, a))
            }
        }
    }, d.gestures.Swipe = {
        name: "swipe",
        index: 40,
        defaults: {
            swipe_max_touches: 1,
            swipe_velocity: .7
        },
        handler: function(a, b) {
            if (a.eventType == d.EVENT_END) {
                if (b.options.swipe_max_touches > 0 && a.touches.length > b.options.swipe_max_touches) return;
                (a.velocityX > b.options.swipe_velocity || a.velocityY > b.options.swipe_velocity) && (b.trigger(this.name, a), b.trigger(this.name + a.direction, a))
            }
        }
    }, d.gestures.Drag = {
        name: "drag",
        index: 50,
        defaults: {
            drag_min_distance: 10,
            drag_max_touches: 1,
            drag_block_horizontal: !1,
            drag_block_vertical: !1,
            drag_lock_to_axis: !1,
            drag_lock_min_distance: 25
        },
        triggered: !1,
        handler: function(a, b) {
            if (d.detection.current.name != this.name && this.triggered) return b.trigger(this.name + "end", a), void(this.triggered = !1);
            if (!(b.options.drag_max_touches > 0 && a.touches.length > b.options.drag_max_touches)) switch (a.eventType) {
                case d.EVENT_START:
                    this.triggered = !1;
                    break;
                case d.EVENT_MOVE:
                    if (a.distance < b.options.drag_min_distance && d.detection.current.name != this.name) return;
                    d.detection.current.name = this.name, (d.detection.current.lastEvent.drag_locked_to_axis || b.options.drag_lock_to_axis && b.options.drag_lock_min_distance <= a.distance) && (a.drag_locked_to_axis = !0);
                    var c = d.detection.current.lastEvent.direction;
                    a.drag_locked_to_axis && c !== a.direction && (d.utils.isVertical(c) ? a.direction = a.deltaY < 0 ? d.DIRECTION_UP : d.DIRECTION_DOWN : a.direction = a.deltaX < 0 ? d.DIRECTION_LEFT : d.DIRECTION_RIGHT), this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), b.trigger(this.name + a.direction, a), (b.options.drag_block_vertical && d.utils.isVertical(a.direction) || b.options.drag_block_horizontal && !d.utils.isVertical(a.direction)) && a.preventDefault();
                    break;
                case d.EVENT_END:
                    this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
            }
        }
    }, d.gestures.Transform = {
        name: "transform",
        index: 45,
        defaults: {
            transform_min_scale: .01,
            transform_min_rotation: 1,
            transform_always_block: !1
        },
        triggered: !1,
        handler: function(a, b) {
            if (d.detection.current.name != this.name && this.triggered) return b.trigger(this.name + "end", a), void(this.triggered = !1);
            if (!(a.touches.length < 2)) switch (b.options.transform_always_block && a.preventDefault(), a.eventType) {
                case d.EVENT_START:
                    this.triggered = !1;
                    break;
                case d.EVENT_MOVE:
                    var c = Math.abs(1 - a.scale),
                        e = Math.abs(a.rotation);
                    if (c < b.options.transform_min_scale && e < b.options.transform_min_rotation) return;
                    d.detection.current.name = this.name, this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), e > b.options.transform_min_rotation && b.trigger("rotate", a), c > b.options.transform_min_scale && (b.trigger("pinch", a), b.trigger("pinch" + (a.scale < 1 ? "in" : "out"), a));
                    break;
                case d.EVENT_END:
                    this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
            }
        }
    }, d.gestures.Touch = {
        name: "touch",
        index: -(1 / 0),
        defaults: {
            prevent_default: !1,
            prevent_mouseevents: !1
        },
        handler: function(a, b) {
            return b.options.prevent_mouseevents && a.pointerType == d.POINTER_MOUSE ? void a.stopDetect() : (b.options.prevent_default && a.preventDefault(), void(a.eventType == d.EVENT_START && b.trigger(this.name, a)))
        }
    }, d.gestures.Release = {
        name: "release",
        index: 1 / 0,
        handler: function(a, b) {
            a.eventType == d.EVENT_END && b.trigger(this.name, a)
        }
    }, "object" == typeof module && "object" == typeof module.exports ? module.exports = d : (a.Hammer = d, "function" == typeof a.define && a.define.amd && a.define("hammer", [], function() {
        return d
    }))
}(this),
function(a, b, c) {
    "use strict";

    function d(a, b) {
        return b = b || Error,
            function() {
                var c, d, e = arguments[0],
                    f = "[" + (a ? a + ":" : "") + e + "] ",
                    g = arguments[1],
                    h = arguments;
                for (c = f + g.replace(/\{\d+\}/g, function(a) {
                        var b = +a.slice(1, -1);
                        return b + 2 < h.length ? ma(h[b + 2]) : a
                    }), c = c + "\nhttp://errors.angularjs.org/1.3.17/" + (a ? a + "/" : "") + e, d = 2; d < arguments.length; d++) c = c + (2 == d ? "?" : "&") + "p" + (d - 2) + "=" + encodeURIComponent(ma(arguments[d]));
                return new b(c)
            }
    }

    function e(a) {
        if (null == a || z(a)) return !1;
        var b = "length" in Object(a) && a.length;
        return a.nodeType === sd && b ? !0 : u(a) || ld(a) || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }

    function f(a, b, c) {
        var d, g;
        if (a)
            if (x(a))
                for (d in a) "prototype" == d || "length" == d || "name" == d || a.hasOwnProperty && !a.hasOwnProperty(d) || b.call(c, a[d], d, a);
            else if (ld(a) || e(a)) {
            var h = "object" != typeof a;
            for (d = 0, g = a.length; g > d; d++)(h || d in a) && b.call(c, a[d], d, a)
        } else if (a.forEach && a.forEach !== f) a.forEach(b, c, a);
        else
            for (d in a) a.hasOwnProperty(d) && b.call(c, a[d], d, a);
        return a
    }

    function g(a) {
        return Object.keys(a).sort()
    }

    function h(a, b, c) {
        for (var d = g(a), e = 0; e < d.length; e++) b.call(c, a[d[e]], d[e]);
        return d
    }

    function i(a) {
        return function(b, c) {
            a(c, b)
        }
    }

    function j() {
        return ++jd
    }

    function k(a, b) {
        b ? a.$$hashKey = b : delete a.$$hashKey
    }

    function l(a) {
        for (var b = a.$$hashKey, c = 1, d = arguments.length; d > c; c++) {
            var e = arguments[c];
            if (e)
                for (var f = Object.keys(e), g = 0, h = f.length; h > g; g++) {
                    var i = f[g];
                    a[i] = e[i]
                }
        }
        return k(a, b), a
    }

    function m(a) {
        return parseInt(a, 10)
    }

    function n(a, b) {
        return l(Object.create(a), b)
    }

    function o() {}

    function p(a) {
        return a
    }

    function q(a) {
        return function() {
            return a
        }
    }

    function r(a) {
        return "undefined" == typeof a
    }

    function s(a) {
        return "undefined" != typeof a
    }

    function t(a) {
        return null !== a && "object" == typeof a
    }

    function u(a) {
        return "string" == typeof a
    }

    function v(a) {
        return "number" == typeof a
    }

    function w(a) {
        return "[object Date]" === gd.call(a)
    }

    function x(a) {
        return "function" == typeof a
    }

    function y(a) {
        return "[object RegExp]" === gd.call(a)
    }

    function z(a) {
        return a && a.window === a
    }

    function A(a) {
        return a && a.$evalAsync && a.$watch
    }

    function B(a) {
        return "[object File]" === gd.call(a)
    }

    function C(a) {
        return "[object FormData]" === gd.call(a)
    }

    function D(a) {
        return "[object Blob]" === gd.call(a)
    }

    function E(a) {
        return "boolean" == typeof a
    }

    function F(a) {
        return a && x(a.then)
    }

    function G(a) {
        return !(!a || !(a.nodeName || a.prop && a.attr && a.find))
    }

    function H(a) {
        var b, c = {},
            d = a.split(",");
        for (b = 0; b < d.length; b++) c[d[b]] = !0;
        return c
    }

    function I(a) {
        return Wc(a.nodeName || a[0] && a[0].nodeName)
    }

    function J(a, b) {
        var c = a.indexOf(b);
        return c >= 0 && a.splice(c, 1), b
    }

    function K(a, b, c, d) {
        if (z(a) || A(a)) throw hd("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        if (b) {
            if (a === b) throw hd("cpi", "Can't copy! Source and destination are identical.");
            if (c = c || [], d = d || [], t(a)) {
                var e = c.indexOf(a);
                if (-1 !== e) return d[e];
                c.push(a), d.push(b)
            }
            var g;
            if (ld(a)) {
                b.length = 0;
                for (var h = 0; h < a.length; h++) g = K(a[h], null, c, d), t(a[h]) && (c.push(a[h]), d.push(g)), b.push(g)
            } else {
                var i = b.$$hashKey;
                ld(b) ? b.length = 0 : f(b, function(a, c) {
                    delete b[c]
                });
                for (var j in a) a.hasOwnProperty(j) && (g = K(a[j], null, c, d), t(a[j]) && (c.push(a[j]), d.push(g)), b[j] = g);
                k(b, i)
            }
        } else if (b = a, a)
            if (ld(a)) b = K(a, [], c, d);
            else if (w(a)) b = new Date(a.getTime());
        else if (y(a)) b = new RegExp(a.source, a.toString().match(/[^\/]*$/)[0]), b.lastIndex = a.lastIndex;
        else if (t(a)) {
            var l = Object.create(Object.getPrototypeOf(a));
            b = K(a, l, c, d)
        }
        return b
    }

    function L(a, b) {
        if (ld(a)) {
            b = b || [];
            for (var c = 0, d = a.length; d > c; c++) b[c] = a[c]
        } else if (t(a)) {
            b = b || {};
            for (var e in a)("$" !== e.charAt(0) || "$" !== e.charAt(1)) && (b[e] = a[e])
        }
        return b || a
    }

    function M(a, b) {
        if (a === b) return !0;
        if (null === a || null === b) return !1;
        if (a !== a && b !== b) return !0;
        var d, e, f, g = typeof a,
            h = typeof b;
        if (g == h && "object" == g) {
            if (!ld(a)) {
                if (w(a)) return w(b) ? M(a.getTime(), b.getTime()) : !1;
                if (y(a)) return y(b) ? a.toString() == b.toString() : !1;
                if (A(a) || A(b) || z(a) || z(b) || ld(b) || w(b) || y(b)) return !1;
                f = {};
                for (e in a)
                    if ("$" !== e.charAt(0) && !x(a[e])) {
                        if (!M(a[e], b[e])) return !1;
                        f[e] = !0
                    }
                for (e in b)
                    if (!f.hasOwnProperty(e) && "$" !== e.charAt(0) && b[e] !== c && !x(b[e])) return !1;
                return !0
            }
            if (!ld(b)) return !1;
            if ((d = a.length) == b.length) {
                for (e = 0; d > e; e++)
                    if (!M(a[e], b[e])) return !1;
                return !0
            }
        }
        return !1
    }

    function N(a, b, c) {
        return a.concat(dd.call(b, c))
    }

    function O(a, b) {
        return dd.call(a, b || 0)
    }

    function P(a, b) {
        var c = arguments.length > 2 ? O(arguments, 2) : [];
        return !x(b) || b instanceof RegExp ? b : c.length ? function() {
            return arguments.length ? b.apply(a, N(c, arguments, 0)) : b.apply(a, c)
        } : function() {
            return arguments.length ? b.apply(a, arguments) : b.call(a)
        }
    }

    function Q(a, d) {
        var e = d;
        return "string" == typeof a && "$" === a.charAt(0) && "$" === a.charAt(1) ? e = c : z(d) ? e = "$WINDOW" : d && b === d ? e = "$DOCUMENT" : A(d) && (e = "$SCOPE"), e
    }

    function R(a, b) {
        return "undefined" == typeof a ? c : (v(b) || (b = b ? 2 : null), JSON.stringify(a, Q, b))
    }

    function S(a) {
        return u(a) ? JSON.parse(a) : a
    }

    function T(a) {
        a = ad(a).clone();
        try {
            a.empty()
        } catch (b) {}
        var c = ad("<div>").append(a).html();
        try {
            return a[0].nodeType === ud ? Wc(c) : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(a, b) {
                return "<" + Wc(b)
            })
        } catch (b) {
            return Wc(c)
        }
    }

    function U(a) {
        try {
            return decodeURIComponent(a)
        } catch (b) {}
    }

    function V(a) {
        var b, c, d = {};
        return f((a || "").split("&"), function(a) {
            if (a && (b = a.replace(/\+/g, "%20").split("="), c = U(b[0]), s(c))) {
                var e = s(b[1]) ? U(b[1]) : !0;
                Xc.call(d, c) ? ld(d[c]) ? d[c].push(e) : d[c] = [d[c], e] : d[c] = e
            }
        }), d
    }

    function W(a) {
        var b = [];
        return f(a, function(a, c) {
            ld(a) ? f(a, function(a) {
                b.push(Y(c, !0) + (a === !0 ? "" : "=" + Y(a, !0)))
            }) : b.push(Y(c, !0) + (a === !0 ? "" : "=" + Y(a, !0)))
        }), b.length ? b.join("&") : ""
    }

    function X(a) {
        return Y(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
    }

    function Y(a, b) {
        return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, b ? "%20" : "+")
    }

    function Z(a, b) {
        var c, d, e = pd.length;
        for (a = ad(a), d = 0; e > d; ++d)
            if (c = pd[d] + b, u(c = a.attr(c))) return c;
        return null
    }

    function $(a, b) {
        var c, d, e = {};
        f(pd, function(b) {
            var e = b + "app";
            !c && a.hasAttribute && a.hasAttribute(e) && (c = a, d = a.getAttribute(e))
        }), f(pd, function(b) {
            var e, f = b + "app";
            !c && (e = a.querySelector("[" + f.replace(":", "\\:") + "]")) && (c = e, d = e.getAttribute(f))
        }), c && (e.strictDi = null !== Z(c, "strict-di"), b(c, d ? [d] : [], e))
    }

    function _(c, d, e) {
        t(e) || (e = {});
        var g = {
            strictDi: !1
        };
        e = l(g, e);
        var h = function() {
                if (c = ad(c), c.injector()) {
                    var a = c[0] === b ? "document" : T(c);
                    throw hd("btstrpd", "App Already Bootstrapped with this Element '{0}'", a.replace(/</, "&lt;").replace(/>/, "&gt;"))
                }
                d = d || [], d.unshift(["$provide", function(a) {
                    a.value("$rootElement", c)
                }]), e.debugInfoEnabled && d.push(["$compileProvider", function(a) {
                    a.debugInfoEnabled(!0)
                }]), d.unshift("ng");
                var f = Sa(d, e.strictDi);
                return f.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function(a, b, c, d) {
                    a.$apply(function() {
                        b.data("$injector", d), c(b)(a)
                    })
                }]), f
            },
            i = /^NG_ENABLE_DEBUG_INFO!/,
            j = /^NG_DEFER_BOOTSTRAP!/;
        return a && i.test(a.name) && (e.debugInfoEnabled = !0, a.name = a.name.replace(i, "")), a && !j.test(a.name) ? h() : (a.name = a.name.replace(j, ""), id.resumeBootstrap = function(a) {
            return f(a, function(a) {
                d.push(a)
            }), h()
        }, void(x(id.resumeDeferredBootstrap) && id.resumeDeferredBootstrap()))
    }

    function aa() {
        a.name = "NG_ENABLE_DEBUG_INFO!" + a.name, a.location.reload()
    }

    function ba(a) {
        var b = id.element(a).injector();
        if (!b) throw hd("test", "no injector found for element argument to getTestability");
        return b.get("$$testability")
    }

    function ca(a, b) {
        return b = b || "_", a.replace(qd, function(a, c) {
            return (c ? b : "") + a.toLowerCase()
        })
    }

    function da() {
        var b;
        rd || (bd = a.jQuery, bd && bd.fn.on ? (ad = bd, l(bd.fn, {
            scope: Md.scope,
            isolateScope: Md.isolateScope,
            controller: Md.controller,
            injector: Md.injector,
            inheritedData: Md.inheritedData
        }), b = bd.cleanData, bd.cleanData = function(a) {
            var c;
            if (kd) kd = !1;
            else
                for (var d, e = 0; null != (d = a[e]); e++) c = bd._data(d, "events"), c && c.$destroy && bd(d).triggerHandler("$destroy");
            b(a)
        }) : ad = ua, id.element = ad, rd = !0)
    }

    function ea(a, b, c) {
        if (!a) throw hd("areq", "Argument '{0}' is {1}", b || "?", c || "required");
        return a
    }

    function fa(a, b, c) {
        return c && ld(a) && (a = a[a.length - 1]), ea(x(a), b, "not a function, got " + (a && "object" == typeof a ? a.constructor.name || "Object" : typeof a)), a
    }

    function ga(a, b) {
        if ("hasOwnProperty" === a) throw hd("badname", "hasOwnProperty is not a valid {0} name", b)
    }

    function ha(a, b, c) {
        if (!b) return a;
        for (var d, e = b.split("."), f = a, g = e.length, h = 0; g > h; h++) d = e[h], a && (a = (f = a)[d]);
        return !c && x(a) ? P(f, a) : a
    }

    function ia(a) {
        var b = a[0],
            c = a[a.length - 1],
            d = [b];
        do {
            if (b = b.nextSibling, !b) break;
            d.push(b)
        } while (b !== c);
        return ad(d)
    }

    function ja() {
        return Object.create(null)
    }

    function ka(a) {
        function b(a, b, c) {
            return a[b] || (a[b] = c())
        }
        var c = d("$injector"),
            e = d("ng"),
            f = b(a, "angular", Object);
        return f.$$minErr = f.$$minErr || d, b(f, "module", function() {
            var a = {};
            return function(d, f, g) {
                var h = function(a, b) {
                    if ("hasOwnProperty" === a) throw e("badname", "hasOwnProperty is not a valid {0} name", b)
                };
                return h(d, "module"), f && a.hasOwnProperty(d) && (a[d] = null), b(a, d, function() {
                    function a(a, c, d, e) {
                        return e || (e = b),
                            function() {
                                return e[d || "push"]([a, c, arguments]), j
                            }
                    }
                    if (!f) throw c("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", d);
                    var b = [],
                        e = [],
                        h = [],
                        i = a("$injector", "invoke", "push", e),
                        j = {
                            _invokeQueue: b,
                            _configBlocks: e,
                            _runBlocks: h,
                            requires: f,
                            name: d,
                            provider: a("$provide", "provider"),
                            factory: a("$provide", "factory"),
                            service: a("$provide", "service"),
                            value: a("$provide", "value"),
                            constant: a("$provide", "constant", "unshift"),
                            animation: a("$animateProvider", "register"),
                            filter: a("$filterProvider", "register"),
                            controller: a("$controllerProvider", "register"),
                            directive: a("$compileProvider", "directive"),
                            config: i,
                            run: function(a) {
                                return h.push(a), this
                            }
                        };
                    return g && i(g), j
                })
            }
        })
    }

    function la(a) {
        var b = [];
        return JSON.stringify(a, function(a, c) {
            if (c = Q(a, c), t(c)) {
                if (b.indexOf(c) >= 0) return "<<already seen>>";
                b.push(c)
            }
            return c
        })
    }

    function ma(a) {
        return "function" == typeof a ? a.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof a ? "undefined" : "string" != typeof a ? la(a) : a
    }

    function na(b) {
        l(b, {
            bootstrap: _,
            copy: K,
            extend: l,
            equals: M,
            element: ad,
            forEach: f,
            injector: Sa,
            noop: o,
            bind: P,
            toJson: R,
            fromJson: S,
            identity: p,
            isUndefined: r,
            isDefined: s,
            isString: u,
            isFunction: x,
            isObject: t,
            isNumber: v,
            isElement: G,
            isArray: ld,
            version: yd,
            isDate: w,
            lowercase: Wc,
            uppercase: Yc,
            callbacks: {
                counter: 0
            },
            getTestability: ba,
            $$minErr: d,
            $$csp: od,
            reloadWithDebugInfo: aa
        }), cd = ka(a);
        try {
            cd("ngLocale")
        } catch (c) {
            cd("ngLocale", []).provider("$locale", qb)
        }
        cd("ng", ["ngLocale"], ["$provide", function(a) {
            a.provider({
                $$sanitizeUri: Wb
            }), a.provider("$compile", Za).directive({
                a: Ee,
                input: Ve,
                textarea: Ve,
                form: Je,
                script: Lf,
                select: Of,
                style: Qf,
                option: Pf,
                ngBind: Ye,
                ngBindHtml: $e,
                ngBindTemplate: Ze,
                ngClass: af,
                ngClassEven: cf,
                ngClassOdd: bf,
                ngCloak: df,
                ngController: ef,
                ngForm: Ke,
                ngHide: Ff,
                ngIf: hf,
                ngInclude: jf,
                ngInit: lf,
                ngNonBindable: zf,
                ngPluralize: Af,
                ngRepeat: Bf,
                ngShow: Ef,
                ngStyle: Gf,
                ngSwitch: Hf,
                ngSwitchWhen: If,
                ngSwitchDefault: Jf,
                ngOptions: Nf,
                ngTransclude: Kf,
                ngModel: wf,
                ngList: mf,
                ngChange: _e,
                pattern: Sf,
                ngPattern: Sf,
                required: Rf,
                ngRequired: Rf,
                minlength: Uf,
                ngMinlength: Uf,
                maxlength: Tf,
                ngMaxlength: Tf,
                ngValue: Xe,
                ngModelOptions: yf
            }).directive({
                ngInclude: kf
            }).directive(Fe).directive(ff), a.provider({
                $anchorScroll: Ta,
                $animate: Wd,
                $browser: Wa,
                $cacheFactory: Xa,
                $controller: bb,
                $document: cb,
                $exceptionHandler: db,
                $filter: gc,
                $interpolate: ob,
                $interval: pb,
                $http: kb,
                $httpBackend: mb,
                $location: Eb,
                $log: Fb,
                $parse: Qb,
                $rootScope: Vb,
                $q: Rb,
                $$q: Sb,
                $sce: $b,
                $sceDelegate: Zb,
                $sniffer: _b,
                $templateCache: Ya,
                $templateRequest: ac,
                $$testability: bc,
                $timeout: cc,
                $window: fc,
                $$rAF: Ub,
                $$asyncCallback: Ua,
                $$jqLite: Na
            })
        }])
    }

    function oa() {
        return ++Ad
    }

    function pa(a) {
        return a.replace(Dd, function(a, b, c, d) {
            return d ? c.toUpperCase() : c
        }).replace(Ed, "Moz$1")
    }

    function qa(a) {
        return !Id.test(a)
    }

    function ra(a) {
        var b = a.nodeType;
        return b === sd || !b || b === wd
    }

    function sa(a, b) {
        var c, d, e, g, h = b.createDocumentFragment(),
            i = [];
        if (qa(a)) i.push(b.createTextNode(a));
        else {
            for (c = c || h.appendChild(b.createElement("div")), d = (Jd.exec(a) || ["", ""])[1].toLowerCase(), e = Ld[d] || Ld._default, c.innerHTML = e[1] + a.replace(Kd, "<$1></$2>") + e[2], g = e[0]; g--;) c = c.lastChild;
            i = N(i, c.childNodes), c = h.firstChild, c.textContent = ""
        }
        return h.textContent = "", h.innerHTML = "", f(i, function(a) {
            h.appendChild(a)
        }), h
    }

    function ta(a, c) {
        c = c || b;
        var d;
        return (d = Hd.exec(a)) ? [c.createElement(d[1])] : (d = sa(a, c)) ? d.childNodes : []
    }

    function ua(a) {
        if (a instanceof ua) return a;
        var b;
        if (u(a) && (a = md(a), b = !0), !(this instanceof ua)) {
            if (b && "<" != a.charAt(0)) throw Gd("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
            return new ua(a)
        }
        b ? Ea(this, ta(a)) : Ea(this, a)
    }

    function va(a) {
        return a.cloneNode(!0)
    }

    function wa(a, b) {
        if (b || ya(a), a.querySelectorAll)
            for (var c = a.querySelectorAll("*"), d = 0, e = c.length; e > d; d++) ya(c[d])
    }

    function xa(a, b, c, d) {
        if (s(d)) throw Gd("offargs", "jqLite#off() does not support the `selector` argument");
        var e = za(a),
            g = e && e.events,
            h = e && e.handle;
        if (h)
            if (b) f(b.split(" "), function(b) {
                if (s(c)) {
                    var d = g[b];
                    if (J(d || [], c), d && d.length > 0) return
                }
                Cd(a, b, h), delete g[b]
            });
            else
                for (b in g) "$destroy" !== b && Cd(a, b, h), delete g[b]
    }

    function ya(a, b) {
        var d = a.ng339,
            e = d && zd[d];
        if (e) {
            if (b) return void delete e.data[b];
            e.handle && (e.events.$destroy && e.handle({}, "$destroy"), xa(a)), delete zd[d], a.ng339 = c
        }
    }

    function za(a, b) {
        var d = a.ng339,
            e = d && zd[d];
        return b && !e && (a.ng339 = d = oa(), e = zd[d] = {
            events: {},
            data: {},
            handle: c
        }), e
    }

    function Aa(a, b, c) {
        if (ra(a)) {
            var d = s(c),
                e = !d && b && !t(b),
                f = !b,
                g = za(a, !e),
                h = g && g.data;
            if (d) h[b] = c;
            else {
                if (f) return h;
                if (e) return h && h[b];
                l(h, b)
            }
        }
    }

    function Ba(a, b) {
        return a.getAttribute ? (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ") > -1 : !1
    }

    function Ca(a, b) {
        b && a.setAttribute && f(b.split(" "), function(b) {
            a.setAttribute("class", md((" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + md(b) + " ", " ")))
        })
    }

    function Da(a, b) {
        if (b && a.setAttribute) {
            var c = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            f(b.split(" "), function(a) {
                a = md(a), -1 === c.indexOf(" " + a + " ") && (c += a + " ")
            }), a.setAttribute("class", md(c))
        }
    }

    function Ea(a, b) {
        if (b)
            if (b.nodeType) a[a.length++] = b;
            else {
                var c = b.length;
                if ("number" == typeof c && b.window !== b) {
                    if (c)
                        for (var d = 0; c > d; d++) a[a.length++] = b[d]
                } else a[a.length++] = b
            }
    }

    function Fa(a, b) {
        return Ga(a, "$" + (b || "ngController") + "Controller")
    }

    function Ga(a, b, d) {
        a.nodeType == wd && (a = a.documentElement);
        for (var e = ld(b) ? b : [b]; a;) {
            for (var f = 0, g = e.length; g > f; f++)
                if ((d = ad.data(a, e[f])) !== c) return d;
            a = a.parentNode || a.nodeType === xd && a.host
        }
    }

    function Ha(a) {
        for (wa(a, !0); a.firstChild;) a.removeChild(a.firstChild)
    }

    function Ia(a, b) {
        b || wa(a);
        var c = a.parentNode;
        c && c.removeChild(a)
    }

    function Ja(b, c) {
        c = c || a, "complete" === c.document.readyState ? c.setTimeout(b) : ad(c).on("load", b)
    }

    function Ka(a, b) {
        var c = Nd[b.toLowerCase()];
        return c && Od[I(a)] && c
    }

    function La(a, b) {
        var c = a.nodeName;
        return ("INPUT" === c || "TEXTAREA" === c) && Pd[b]
    }

    function Ma(a, b) {
        var c = function(c, d) {
            c.isDefaultPrevented = function() {
                return c.defaultPrevented
            };
            var e = b[d || c.type],
                f = e ? e.length : 0;
            if (f) {
                if (r(c.immediatePropagationStopped)) {
                    var g = c.stopImmediatePropagation;
                    c.stopImmediatePropagation = function() {
                        c.immediatePropagationStopped = !0, c.stopPropagation && c.stopPropagation(), g && g.call(c)
                    }
                }
                c.isImmediatePropagationStopped = function() {
                    return c.immediatePropagationStopped === !0
                }, f > 1 && (e = L(e));
                for (var h = 0; f > h; h++) c.isImmediatePropagationStopped() || e[h].call(a, c)
            }
        };
        return c.elem = a, c
    }

    function Na() {
        this.$get = function() {
            return l(ua, {
                hasClass: function(a, b) {
                    return a.attr && (a = a[0]), Ba(a, b)
                },
                addClass: function(a, b) {
                    return a.attr && (a = a[0]), Da(a, b)
                },
                removeClass: function(a, b) {
                    return a.attr && (a = a[0]), Ca(a, b)
                }
            })
        }
    }

    function Oa(a, b) {
        var c = a && a.$$hashKey;
        if (c) return "function" == typeof c && (c = a.$$hashKey()), c;
        var d = typeof a;
        return c = "function" == d || "object" == d && null !== a ? a.$$hashKey = d + ":" + (b || j)() : d + ":" + a
    }

    function Pa(a, b) {
        if (b) {
            var c = 0;
            this.nextUid = function() {
                return ++c
            }
        }
        f(a, this.put, this)
    }

    function Qa(a) {
        var b = a.toString().replace(Td, ""),
            c = b.match(Qd);
        return c ? "function(" + (c[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn"
    }

    function Ra(a, b, c) {
        var d, e, g, h;
        if ("function" == typeof a) {
            if (!(d = a.$inject)) {
                if (d = [], a.length) {
                    if (b) throw u(c) && c || (c = a.name || Qa(a)), Ud("strictdi", "{0} is not using explicit annotation and cannot be invoked in strict mode", c);
                    e = a.toString().replace(Td, ""), g = e.match(Qd), f(g[1].split(Rd), function(a) {
                        a.replace(Sd, function(a, b, c) {
                            d.push(c)
                        })
                    })
                }
                a.$inject = d
            }
        } else ld(a) ? (h = a.length - 1, fa(a[h], "fn"), d = a.slice(0, h)) : fa(a, "fn", !0);
        return d
    }

    function Sa(a, b) {
        function d(a) {
            return function(b, c) {
                return t(b) ? void f(b, i(a)) : a(b, c)
            }
        }

        function e(a, b) {
            if (ga(a, "service"), (x(b) || ld(b)) && (b = A.instantiate(b)), !b.$get) throw Ud("pget", "Provider '{0}' must define $get factory method.", a);
            return z[a + v] = b
        }

        function g(a, b) {
            return function() {
                var c = C.invoke(b, this);
                if (r(c)) throw Ud("undef", "Provider '{0}' must return a value from $get factory method.", a);
                return c
            }
        }

        function h(a, b, c) {
            return e(a, {
                $get: c !== !1 ? g(a, b) : b
            })
        }

        function j(a, b) {
            return h(a, ["$injector", function(a) {
                return a.instantiate(b)
            }])
        }

        function k(a, b) {
            return h(a, q(b), !1)
        }

        function l(a, b) {
            ga(a, "constant"), z[a] = b, B[a] = b
        }

        function m(a, b) {
            var c = A.get(a + v),
                d = c.$get;
            c.$get = function() {
                var a = C.invoke(d, c);
                return C.invoke(b, null, {
                    $delegate: a
                })
            }
        }

        function n(a) {
            var b, c = [];
            return f(a, function(a) {
                function d(a) {
                    var b, c;
                    for (b = 0, c = a.length; c > b; b++) {
                        var d = a[b],
                            e = A.get(d[0]);
                        e[d[1]].apply(e, d[2])
                    }
                }
                if (!y.get(a)) {
                    y.put(a, !0);
                    try {
                        u(a) ? (b = cd(a), c = c.concat(n(b.requires)).concat(b._runBlocks), d(b._invokeQueue), d(b._configBlocks)) : x(a) ? c.push(A.invoke(a)) : ld(a) ? c.push(A.invoke(a)) : fa(a, "module")
                    } catch (e) {
                        throw ld(a) && (a = a[a.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), Ud("modulerr", "Failed to instantiate module {0} due to:\n{1}", a, e.stack || e.message || e)
                    }
                }
            }), c
        }

        function p(a, c) {
            function d(b, d) {
                if (a.hasOwnProperty(b)) {
                    if (a[b] === s) throw Ud("cdep", "Circular dependency found: {0}", b + " <- " + w.join(" <- "));
                    return a[b]
                }
                try {
                    return w.unshift(b), a[b] = s, a[b] = c(b, d)
                } catch (e) {
                    throw a[b] === s && delete a[b], e
                } finally {
                    w.shift()
                }
            }

            function e(a, c, e, f) {
                "string" == typeof e && (f = e, e = null);
                var g, h, i, j = [],
                    k = Sa.$$annotate(a, b, f);
                for (h = 0, g = k.length; g > h; h++) {
                    if (i = k[h], "string" != typeof i) throw Ud("itkn", "Incorrect injection token! Expected service name as string, got {0}", i);
                    j.push(e && e.hasOwnProperty(i) ? e[i] : d(i, f))
                }
                return ld(a) && (a = a[g]), a.apply(c, j)
            }

            function f(a, b, c) {
                var d = Object.create((ld(a) ? a[a.length - 1] : a).prototype || null),
                    f = e(a, d, b, c);
                return t(f) || x(f) ? f : d
            }
            return {
                invoke: e,
                instantiate: f,
                get: d,
                annotate: Sa.$$annotate,
                has: function(b) {
                    return z.hasOwnProperty(b + v) || a.hasOwnProperty(b)
                }
            }
        }
        b = b === !0;
        var s = {},
            v = "Provider",
            w = [],
            y = new Pa([], !0),
            z = {
                $provide: {
                    provider: d(e),
                    factory: d(h),
                    service: d(j),
                    value: d(k),
                    constant: d(l),
                    decorator: m
                }
            },
            A = z.$injector = p(z, function(a, b) {
                throw id.isString(b) && w.push(b), Ud("unpr", "Unknown provider: {0}", w.join(" <- "))
            }),
            B = {},
            C = B.$injector = p(B, function(a, b) {
                var d = A.get(a + v, b);
                return C.invoke(d.$get, d, c, a)
            });
        return f(n(a), function(a) {
            C.invoke(a || o)
        }), C
    }

    function Ta() {
        var a = !0;
        this.disableAutoScrolling = function() {
            a = !1
        }, this.$get = ["$window", "$location", "$rootScope", function(b, c, d) {
            function e(a) {
                var b = null;
                return Array.prototype.some.call(a, function(a) {
                    return "a" === I(a) ? (b = a, !0) : void 0
                }), b
            }

            function f() {
                var a = h.yOffset;
                if (x(a)) a = a();
                else if (G(a)) {
                    var c = a[0],
                        d = b.getComputedStyle(c);
                    a = "fixed" !== d.position ? 0 : c.getBoundingClientRect().bottom
                } else v(a) || (a = 0);
                return a
            }

            function g(a) {
                if (a) {
                    a.scrollIntoView();
                    var c = f();
                    if (c) {
                        var d = a.getBoundingClientRect().top;
                        b.scrollBy(0, d - c)
                    }
                } else b.scrollTo(0, 0)
            }

            function h() {
                var a, b = c.hash();
                b ? (a = i.getElementById(b)) ? g(a) : (a = e(i.getElementsByName(b))) ? g(a) : "top" === b && g(null) : g(null)
            }
            var i = b.document;
            return a && d.$watch(function() {
                return c.hash()
            }, function(a, b) {
                (a !== b || "" !== a) && Ja(function() {
                    d.$evalAsync(h)
                })
            }), h
        }]
    }

    function Ua() {
        this.$get = ["$$rAF", "$timeout", function(a, b) {
            return a.supported ? function(b) {
                return a(b)
            } : function(a) {
                return b(a, 0, !1)
            }
        }]
    }

    function Va(a, b, d, e) {
        function g(a) {
            try {
                a.apply(null, O(arguments, 1))
            } finally {
                if (y--, 0 === y)
                    for (; z.length;) try {
                        z.pop()()
                    } catch (b) {
                        d.error(b)
                    }
            }
        }

        function h(a) {
            var b = a.indexOf("#");
            return -1 === b ? "" : a.substr(b)
        }

        function i(a, b) {
            ! function c() {
                f(B, function(a) {
                    a()
                }), A = b(c, a)
            }()
        }

        function j() {
            l(), m()
        }

        function k() {
            try {
                return t.state
            } catch (a) {}
        }

        function l() {
            C = k(), C = r(C) ? null : C, M(C, J) && (C = J), J = C
        }

        function m() {
            (E !== p.url() || D !== C) && (E = p.url(),
                D = C, f(H, function(a) {
                    a(p.url(), C)
                }))
        }

        function n(a) {
            try {
                return decodeURIComponent(a)
            } catch (b) {
                return a
            }
        }
        var p = this,
            q = b[0],
            s = a.location,
            t = a.history,
            v = a.setTimeout,
            w = a.clearTimeout,
            x = {};
        p.isMock = !1;
        var y = 0,
            z = [];
        p.$$completeOutstandingRequest = g, p.$$incOutstandingRequestCount = function() {
            y++
        }, p.notifyWhenNoOutstandingRequests = function(a) {
            f(B, function(a) {
                a()
            }), 0 === y ? a() : z.push(a)
        };
        var A, B = [];
        p.addPollFn = function(a) {
            return r(A) && i(100, v), B.push(a), a
        };
        var C, D, E = s.href,
            F = b.find("base"),
            G = null;
        l(), D = C, p.url = function(b, c, d) {
            if (r(d) && (d = null), s !== a.location && (s = a.location), t !== a.history && (t = a.history), b) {
                var f = D === d;
                if (E === b && (!e.history || f)) return p;
                var g = E && vb(E) === vb(b);
                return E = b, D = d, !e.history || g && f ? ((!g || G) && (G = b), c ? s.replace(b) : g ? s.hash = h(b) : s.href = b) : (t[c ? "replaceState" : "pushState"](d, "", b), l(), D = C), p
            }
            return G || s.href.replace(/%27/g, "'")
        }, p.state = function() {
            return C
        };
        var H = [],
            I = !1,
            J = null;
        p.onUrlChange = function(b) {
            return I || (e.history && ad(a).on("popstate", j), ad(a).on("hashchange", j), I = !0), H.push(b), b
        }, p.$$checkUrlChange = m, p.baseHref = function() {
            var a = F.attr("href");
            return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, "") : ""
        };
        var K = {},
            L = "",
            N = p.baseHref();
        p.cookies = function(a, b) {
            var e, f, g, h, i;
            if (!a) {
                if (q.cookie !== L)
                    for (L = q.cookie, f = L.split("; "), K = {}, h = 0; h < f.length; h++) g = f[h], i = g.indexOf("="), i > 0 && (a = n(g.substring(0, i)), K[a] === c && (K[a] = n(g.substring(i + 1))));
                return K
            }
            b === c ? q.cookie = encodeURIComponent(a) + "=;path=" + N + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : u(b) && (e = (q.cookie = encodeURIComponent(a) + "=" + encodeURIComponent(b) + ";path=" + N).length + 1, e > 4096 && d.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + e + " > 4096 bytes)!"))
        }, p.defer = function(a, b) {
            var c;
            return y++, c = v(function() {
                delete x[c], g(a)
            }, b || 0), x[c] = !0, c
        }, p.defer.cancel = function(a) {
            return x[a] ? (delete x[a], w(a), g(o), !0) : !1
        }
    }

    function Wa() {
        this.$get = ["$window", "$log", "$sniffer", "$document", function(a, b, c, d) {
            return new Va(a, d, b, c)
        }]
    }

    function Xa() {
        this.$get = function() {
            function a(a, c) {
                function e(a) {
                    a != m && (n ? n == a && (n = a.n) : n = a, f(a.n, a.p), f(a, m), m = a, m.n = null)
                }

                function f(a, b) {
                    a != b && (a && (a.p = b), b && (b.n = a))
                }
                if (a in b) throw d("$cacheFactory")("iid", "CacheId '{0}' is already taken!", a);
                var g = 0,
                    h = l({}, c, {
                        id: a
                    }),
                    i = {},
                    j = c && c.capacity || Number.MAX_VALUE,
                    k = {},
                    m = null,
                    n = null;
                return b[a] = {
                    put: function(a, b) {
                        if (j < Number.MAX_VALUE) {
                            var c = k[a] || (k[a] = {
                                key: a
                            });
                            e(c)
                        }
                        if (!r(b)) return a in i || g++, i[a] = b, g > j && this.remove(n.key), b
                    },
                    get: function(a) {
                        if (j < Number.MAX_VALUE) {
                            var b = k[a];
                            if (!b) return;
                            e(b)
                        }
                        return i[a]
                    },
                    remove: function(a) {
                        if (j < Number.MAX_VALUE) {
                            var b = k[a];
                            if (!b) return;
                            b == m && (m = b.p), b == n && (n = b.n), f(b.n, b.p), delete k[a]
                        }
                        delete i[a], g--
                    },
                    removeAll: function() {
                        i = {}, g = 0, k = {}, m = n = null
                    },
                    destroy: function() {
                        i = null, h = null, k = null, delete b[a]
                    },
                    info: function() {
                        return l({}, h, {
                            size: g
                        })
                    }
                }
            }
            var b = {};
            return a.info = function() {
                var a = {};
                return f(b, function(b, c) {
                    a[c] = b.info()
                }), a
            }, a.get = function(a) {
                return b[a]
            }, a
        }
    }

    function Ya() {
        this.$get = ["$cacheFactory", function(a) {
            return a("templates")
        }]
    }

    function Za(a, d) {
        function e(a, b) {
            var c = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,
                d = {};
            return f(a, function(a, e) {
                var f = a.match(c);
                if (!f) throw Xd("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", b, e, a);
                d[e] = {
                    mode: f[1][0],
                    collection: "*" === f[2],
                    optional: "?" === f[3],
                    attrName: f[4] || e
                }
            }), d
        }

        function g(a) {
            var b = a.charAt(0);
            if (!b || b !== Wc(b)) throw Xd("baddir", "Directive name '{0}' is invalid. The first character must be a lowercase letter", a);
            return a
        }
        var h = {},
            j = "Directive",
            k = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
            m = /(([\w\-]+)(?:\:([^;]+))?;?)/,
            r = H("ngSrc,ngSrcset,src,srcset"),
            v = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
            w = /^(on[a-z]+|formaction)$/;
        this.directive = function z(b, c) {
            return ga(b, "directive"), u(b) ? (g(b), ea(c, "directiveFactory"), h.hasOwnProperty(b) || (h[b] = [], a.factory(b + j, ["$injector", "$exceptionHandler", function(a, c) {
                var d = [];
                return f(h[b], function(f, g) {
                    try {
                        var h = a.invoke(f);
                        x(h) ? h = {
                            compile: q(h)
                        } : !h.compile && h.link && (h.compile = q(h.link)), h.priority = h.priority || 0, h.index = g, h.name = h.name || b, h.require = h.require || h.controller && h.name, h.restrict = h.restrict || "EA", t(h.scope) && (h.$$isolateBindings = e(h.scope, h.name)), d.push(h)
                    } catch (i) {
                        c(i)
                    }
                }), d
            }])), h[b].push(c)) : f(b, i(z)), this
        }, this.aHrefSanitizationWhitelist = function(a) {
            return s(a) ? (d.aHrefSanitizationWhitelist(a), this) : d.aHrefSanitizationWhitelist()
        }, this.imgSrcSanitizationWhitelist = function(a) {
            return s(a) ? (d.imgSrcSanitizationWhitelist(a), this) : d.imgSrcSanitizationWhitelist()
        };
        var y = !0;
        this.debugInfoEnabled = function(a) {
            return s(a) ? (y = a, this) : y
        }, this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function(a, d, e, g, i, q, s, z, B, C, D) {
            function E(a, b) {
                try {
                    a.addClass(b)
                } catch (c) {}
            }

            function F(a, b, c, d, e) {
                a instanceof ad || (a = ad(a)), f(a, function(b, c) {
                    b.nodeType == ud && b.nodeValue.match(/\S+/) && (a[c] = ad(b).wrap("<span></span>").parent()[0])
                });
                var g = H(a, b, a, c, d, e);
                F.$$addScopeClass(a);
                var h = null;
                return function(b, c, d) {
                    ea(b, "scope"), d = d || {};
                    var e = d.parentBoundTranscludeFn,
                        f = d.transcludeControllers,
                        i = d.futureParentElement;
                    e && e.$$boundTransclude && (e = e.$$boundTransclude), h || (h = G(i));
                    var j;
                    if (j = "html" !== h ? ad($(h, ad("<div>").append(a).html())) : c ? Md.clone.call(a) : a, f)
                        for (var k in f) j.data("$" + k + "Controller", f[k].instance);
                    return F.$$addScopeInfo(j, b), c && c(j, b), g && g(b, j, j, e), j
                }
            }

            function G(a) {
                var b = a && a[0];
                return b && "foreignobject" !== I(b) && b.toString().match(/SVG/) ? "svg" : "html"
            }

            function H(a, b, d, e, f, g) {
                function h(a, d, e, f) {
                    var g, h, i, j, k, l, m, n, q;
                    if (o) {
                        var r = d.length;
                        for (q = new Array(r), k = 0; k < p.length; k += 3) m = p[k], q[m] = d[m]
                    } else q = d;
                    for (k = 0, l = p.length; l > k;) i = q[p[k++]], g = p[k++], h = p[k++], g ? (g.scope ? (j = a.$new(), F.$$addScopeInfo(ad(i), j)) : j = a, n = g.transcludeOnThisElement ? K(a, g.transclude, f, g.elementTranscludeOnThisElement) : !g.templateOnThisElement && f ? f : !f && b ? K(a, b) : null, g(h, j, i, e, n)) : h && h(a, i.childNodes, c, f)
                }
                for (var i, j, k, l, m, n, o, p = [], q = 0; q < a.length; q++) i = new ga, j = L(a[q], [], i, 0 === q ? e : c, f), k = j.length ? Q(j, a[q], i, b, d, null, [], [], g) : null, k && k.scope && F.$$addScopeClass(i.$$element), m = k && k.terminal || !(l = a[q].childNodes) || !l.length ? null : H(l, k ? (k.transcludeOnThisElement || !k.templateOnThisElement) && k.transclude : b), (k || m) && (p.push(q, k, m), n = !0, o = o || k), g = null;
                return n ? h : null
            }

            function K(a, b, c, d) {
                var e = function(d, e, f, g, h) {
                    return d || (d = a.$new(!1, h), d.$$transcluded = !0), b(d, e, {
                        parentBoundTranscludeFn: c,
                        transcludeControllers: f,
                        futureParentElement: g
                    })
                };
                return e
            }

            function L(a, b, c, d, e) {
                var f, g, h = a.nodeType,
                    i = c.$attr;
                switch (h) {
                    case sd:
                        S(b, $a(I(a)), "E", d, e);
                        for (var j, l, n, o, p, q, r = a.attributes, s = 0, v = r && r.length; v > s; s++) {
                            var w = !1,
                                x = !1;
                            j = r[s], l = j.name, p = md(j.value), o = $a(l), (q = la.test(o)) && (l = l.replace(Yd, "").substr(8).replace(/_(.)/g, function(a, b) {
                                return b.toUpperCase()
                            }));
                            var y = o.replace(/(Start|End)$/, "");
                            U(y) && o === y + "Start" && (w = l, x = l.substr(0, l.length - 5) + "end", l = l.substr(0, l.length - 6)), n = $a(l.toLowerCase()), i[n] = l, (q || !c.hasOwnProperty(n)) && (c[n] = p, Ka(a, n) && (c[n] = !0)), aa(a, b, p, n, q), S(b, n, "A", d, e, w, x)
                        }
                        if (g = a.className, t(g) && (g = g.animVal), u(g) && "" !== g)
                            for (; f = m.exec(g);) n = $a(f[2]), S(b, n, "C", d, e) && (c[n] = md(f[3])), g = g.substr(f.index + f[0].length);
                        break;
                    case ud:
                        Z(b, a.nodeValue);
                        break;
                    case vd:
                        try {
                            f = k.exec(a.nodeValue), f && (n = $a(f[1]), S(b, n, "M", d, e) && (c[n] = md(f[2])))
                        } catch (z) {}
                }
                return b.sort(X), b
            }

            function N(a, b, c) {
                var d = [],
                    e = 0;
                if (b && a.hasAttribute && a.hasAttribute(b)) {
                    do {
                        if (!a) throw Xd("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", b, c);
                        a.nodeType == sd && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--), d.push(a), a = a.nextSibling
                    } while (e > 0)
                } else d.push(a);
                return ad(d)
            }

            function P(a, b, c) {
                return function(d, e, f, g, h) {
                    return e = N(e[0], b, c), a(d, e, f, g, h)
                }
            }

            function Q(a, g, h, j, k, l, m, n, o) {
                function p(a, b, c, d) {
                    a && (c && (a = P(a, c, d)), a.require = z.require, a.directiveName = B, (I === z || z.$$isolateScope) && (a = da(a, {
                        isolateScope: !0
                    })), m.push(a)), b && (c && (b = P(b, c, d)), b.require = z.require, b.directiveName = B, (I === z || z.$$isolateScope) && (b = da(b, {
                        isolateScope: !0
                    })), n.push(b))
                }

                function r(a, b, c, d) {
                    var e, g, h = "data",
                        i = !1,
                        j = c;
                    if (u(b)) {
                        if (g = b.match(v), b = b.substring(g[0].length), g[3] && (g[1] ? g[3] = null : g[1] = g[3]), "^" === g[1] ? h = "inheritedData" : "^^" === g[1] && (h = "inheritedData", j = c.parent()), "?" === g[2] && (i = !0), e = null, d && "data" === h && (e = d[b]) && (e = e.instance), e = e || j[h]("$" + b + "Controller"), !e && !i) throw Xd("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", b, a);
                        return e || null
                    }
                    return ld(b) && (e = [], f(b, function(b) {
                        e.push(r(a, b, c, d))
                    })), e
                }

                function s(a, b, e, j, k) {
                    function l(a, b, d) {
                        var e;
                        return A(a) || (d = b, b = a, a = c), U && (e = v), d || (d = U ? x.parent() : x), k(a, b, e, d, D)
                    }
                    var o, p, s, t, u, v, w, x, z;
                    if (g === e ? (z = h, x = h.$$element) : (x = ad(e), z = new ga(x, h)), I && (u = b.$new(!0)), k && (w = l, w.$$boundTransclude = k), H && (y = {}, v = {}, f(H, function(a) {
                            var c, d = {
                                $scope: a === I || a.$$isolateScope ? u : b,
                                $element: x,
                                $attrs: z,
                                $transclude: w
                            };
                            t = a.controller, "@" == t && (t = z[a.name]), c = q(t, d, !0, a.controllerAs), v[a.name] = c, U || x.data("$" + a.name + "Controller", c.instance), y[a.name] = c
                        })), I) {
                        F.$$addScopeInfo(x, u, !0, !(J && (J === I || J === I.$$originalDirective))), F.$$addScopeClass(x, !0);
                        var B = y && y[I.name],
                            C = u;
                        B && B.identifier && I.bindToController === !0 && (C = B.instance), f(u.$$isolateBindings = I.$$isolateBindings, function(a, c) {
                            var e, f, g, h, j = a.attrName,
                                k = a.optional,
                                l = a.mode;
                            switch (l) {
                                case "@":
                                    z.$observe(j, function(a) {
                                        C[c] = a
                                    }), z.$$observers[j].$$scope = b, z[j] && (C[c] = d(z[j])(b));
                                    break;
                                case "=":
                                    if (k && !z[j]) return;
                                    f = i(z[j]), h = f.literal ? M : function(a, b) {
                                        return a === b || a !== a && b !== b
                                    }, g = f.assign || function() {
                                        throw e = C[c] = f(b), Xd("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", z[j], I.name)
                                    }, e = C[c] = f(b);
                                    var m = function(a) {
                                        return h(a, C[c]) || (h(a, e) ? g(b, a = C[c]) : C[c] = a), e = a
                                    };
                                    m.$stateful = !0;
                                    var n;
                                    n = a.collection ? b.$watchCollection(z[j], m) : b.$watch(i(z[j], m), null, f.literal), u.$on("$destroy", n);
                                    break;
                                case "&":
                                    f = i(z[j]), C[c] = function(a) {
                                        return f(b, a)
                                    }
                            }
                        })
                    }
                    for (y && (f(y, function(a) {
                            a()
                        }), y = null), o = 0, p = m.length; p > o; o++) s = m[o], fa(s, s.isolateScope ? u : b, x, z, s.require && r(s.directiveName, s.require, x, v), w);
                    var D = b;
                    for (I && (I.template || null === I.templateUrl) && (D = u), a && a(D, e.childNodes, c, k), o = n.length - 1; o >= 0; o--) s = n[o], fa(s, s.isolateScope ? u : b, x, z, s.require && r(s.directiveName, s.require, x, v), w)
                }
                o = o || {};
                for (var w, y, z, B, C, D, E, G = -Number.MAX_VALUE, H = o.controllerDirectives, I = o.newIsolateScopeDirective, J = o.templateDirective, K = o.nonTlbTranscludeDirective, Q = !1, S = !1, U = o.hasElementTranscludeDirective, X = h.$$element = ad(g), Z = l, _ = j, aa = 0, ca = a.length; ca > aa; aa++) {
                    z = a[aa];
                    var ea = z.$$start,
                        ha = z.$$end;
                    if (ea && (X = N(g, ea, ha)), C = c, G > z.priority) break;
                    if ((E = z.scope) && (z.templateUrl || (t(E) ? (Y("new/isolated scope", I || w, z, X), I = z) : Y("new/isolated scope", I, z, X)), w = w || z), B = z.name, !z.templateUrl && z.controller && (E = z.controller, H = H || {}, Y("'" + B + "' controller", H[B], z, X), H[B] = z), (E = z.transclude) && (Q = !0, z.$$tlb || (Y("transclusion", K, z, X), K = z), "element" == E ? (U = !0, G = z.priority, C = X, X = h.$$element = ad(b.createComment(" " + B + ": " + h[B] + " ")), g = X[0], ba(k, O(C), g), _ = F(C, j, G, Z && Z.name, {
                            nonTlbTranscludeDirective: K
                        })) : (C = ad(va(g)).contents(), X.empty(), _ = F(C, j))), z.template)
                        if (S = !0, Y("template", J, z, X), J = z, E = x(z.template) ? z.template(X, h) : z.template, E = ka(E), z.replace) {
                            if (Z = z, C = qa(E) ? [] : ab($(z.templateNamespace, md(E))), g = C[0], 1 != C.length || g.nodeType !== sd) throw Xd("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", B, "");
                            ba(k, X, g);
                            var ia = {
                                    $attr: {}
                                },
                                ja = L(g, [], ia),
                                la = a.splice(aa + 1, a.length - (aa + 1));
                            I && R(ja), a = a.concat(ja).concat(la), V(h, ia), ca = a.length
                        } else X.html(E);
                    if (z.templateUrl) S = !0, Y("template", J, z, X), J = z, z.replace && (Z = z), s = W(a.splice(aa, a.length - aa), X, h, k, Q && _, m, n, {
                        controllerDirectives: H,
                        newIsolateScopeDirective: I,
                        templateDirective: J,
                        nonTlbTranscludeDirective: K
                    }), ca = a.length;
                    else if (z.compile) try {
                        D = z.compile(X, h, _), x(D) ? p(null, D, ea, ha) : D && p(D.pre, D.post, ea, ha)
                    } catch (ma) {
                        e(ma, T(X))
                    }
                    z.terminal && (s.terminal = !0, G = Math.max(G, z.priority))
                }
                return s.scope = w && w.scope === !0, s.transcludeOnThisElement = Q, s.elementTranscludeOnThisElement = U, s.templateOnThisElement = S, s.transclude = _, o.hasElementTranscludeDirective = U, s
            }

            function R(a) {
                for (var b = 0, c = a.length; c > b; b++) a[b] = n(a[b], {
                    $$isolateScope: !0
                })
            }

            function S(b, d, f, g, i, k, l) {
                if (d === i) return null;
                var m = null;
                if (h.hasOwnProperty(d))
                    for (var o, p = a.get(d + j), q = 0, r = p.length; r > q; q++) try {
                        o = p[q], (g === c || g > o.priority) && -1 != o.restrict.indexOf(f) && (k && (o = n(o, {
                            $$start: k,
                            $$end: l
                        })), b.push(o), m = o)
                    } catch (s) {
                        e(s)
                    }
                return m
            }

            function U(b) {
                if (h.hasOwnProperty(b))
                    for (var c, d = a.get(b + j), e = 0, f = d.length; f > e; e++)
                        if (c = d[e], c.multiElement) return !0;
                return !1
            }

            function V(a, b) {
                var c = b.$attr,
                    d = a.$attr,
                    e = a.$$element;
                f(a, function(d, e) {
                    "$" != e.charAt(0) && (b[e] && b[e] !== d && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]))
                }), f(b, function(b, f) {
                    "class" == f ? (E(e, b), a["class"] = (a["class"] ? a["class"] + " " : "") + b) : "style" == f ? (e.attr("style", e.attr("style") + ";" + b), a.style = (a.style ? a.style + ";" : "") + b) : "$" == f.charAt(0) || a.hasOwnProperty(f) || (a[f] = b, d[f] = c[f])
                })
            }

            function W(a, b, c, d, e, h, i, j) {
                var k, l, m = [],
                    o = b[0],
                    p = a.shift(),
                    q = n(p, {
                        templateUrl: null,
                        transclude: null,
                        replace: null,
                        $$originalDirective: p
                    }),
                    r = x(p.templateUrl) ? p.templateUrl(b, c) : p.templateUrl,
                    s = p.templateNamespace;
                return b.empty(), g(r).then(function(g) {
                        var n, u, v, w;
                        if (g = ka(g), p.replace) {
                            if (v = qa(g) ? [] : ab($(s, md(g))), n = v[0], 1 != v.length || n.nodeType !== sd) throw Xd("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", p.name, r);
                            u = {
                                $attr: {}
                            }, ba(d, b, n);
                            var x = L(n, [], u);
                            t(p.scope) && R(x), a = x.concat(a), V(c, u)
                        } else n = o, b.html(g);
                        for (a.unshift(q), k = Q(a, n, c, e, b, p, h, i, j), f(d, function(a, c) {
                                a == n && (d[c] = b[0])
                            }), l = H(b[0].childNodes, e); m.length;) {
                            var y = m.shift(),
                                z = m.shift(),
                                A = m.shift(),
                                B = m.shift(),
                                C = b[0];
                            if (!y.$$destroyed) {
                                if (z !== o) {
                                    var D = z.className;
                                    j.hasElementTranscludeDirective && p.replace || (C = va(n)), ba(A, ad(z), C), E(ad(C), D)
                                }
                                w = k.transcludeOnThisElement ? K(y, k.transclude, B) : B, k(l, y, C, d, w)
                            }
                        }
                        m = null
                    }),
                    function(a, b, c, d, e) {
                        var f = e;
                        b.$$destroyed || (m ? m.push(b, c, d, f) : (k.transcludeOnThisElement && (f = K(b, k.transclude, e)), k(l, b, c, d, f)))
                    }
            }

            function X(a, b) {
                var c = b.priority - a.priority;
                return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
            }

            function Y(a, b, c, d) {
                if (b) throw Xd("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", b.name, c.name, a, T(d))
            }

            function Z(a, b) {
                var c = d(b, !0);
                c && a.push({
                    priority: 0,
                    compile: function(a) {
                        var b = a.parent(),
                            d = !!b.length;
                        return d && F.$$addBindingClass(b),
                            function(a, b) {
                                var e = b.parent();
                                d || F.$$addBindingClass(e), F.$$addBindingInfo(e, c.expressions), a.$watch(c, function(a) {
                                    b[0].nodeValue = a
                                })
                            }
                    }
                })
            }

            function $(a, c) {
                switch (a = Wc(a || "html")) {
                    case "svg":
                    case "math":
                        var d = b.createElement("div");
                        return d.innerHTML = "<" + a + ">" + c + "</" + a + ">", d.childNodes[0].childNodes;
                    default:
                        return c
                }
            }

            function _(a, b) {
                if ("srcdoc" == b) return B.HTML;
                var c = I(a);
                return "xlinkHref" == b || "form" == c && "action" == b || "img" != c && ("src" == b || "ngSrc" == b) ? B.RESOURCE_URL : void 0
            }

            function aa(a, b, c, e, f) {
                var g = _(a, e);
                f = r[e] || f;
                var h = d(c, !0, g, f);
                if (h) {
                    if ("multiple" === e && "select" === I(a)) throw Xd("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", T(a));
                    b.push({
                        priority: 100,
                        compile: function() {
                            return {
                                pre: function(a, b, i) {
                                    var j = i.$$observers || (i.$$observers = {});
                                    if (w.test(e)) throw Xd("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                    var k = i[e];
                                    k !== c && (h = k && d(k, !0, g, f), c = k), h && (i[e] = h(a), (j[e] || (j[e] = [])).$$inter = !0, (i.$$observers && i.$$observers[e].$$scope || a).$watch(h, function(a, b) {
                                        "class" === e && a != b ? i.$updateClass(a, b) : i.$set(e, a)
                                    }))
                                }
                            }
                        }
                    })
                }
            }

            function ba(a, c, d) {
                var e, f, g = c[0],
                    h = c.length,
                    i = g.parentNode;
                if (a)
                    for (e = 0, f = a.length; f > e; e++)
                        if (a[e] == g) {
                            a[e++] = d;
                            for (var j = e, k = j + h - 1, l = a.length; l > j; j++, k++) l > k ? a[j] = a[k] : delete a[j];
                            a.length -= h - 1, a.context === g && (a.context = d);
                            break
                        }
                i && i.replaceChild(d, g);
                var m = b.createDocumentFragment();
                m.appendChild(g), ad(d).data(ad(g).data()), bd ? (kd = !0, bd.cleanData([g])) : delete ad.cache[g[ad.expando]];
                for (var n = 1, o = c.length; o > n; n++) {
                    var p = c[n];
                    ad(p).remove(), m.appendChild(p), delete c[n]
                }
                c[0] = d, c.length = 1
            }

            function da(a, b) {
                return l(function() {
                    return a.apply(null, arguments)
                }, a, b)
            }

            function fa(a, b, c, d, f, g) {
                try {
                    a(b, c, d, f, g)
                } catch (h) {
                    e(h, T(c))
                }
            }
            var ga = function(a, b) {
                if (b) {
                    var c, d, e, f = Object.keys(b);
                    for (c = 0, d = f.length; d > c; c++) e = f[c], this[e] = b[e]
                } else this.$attr = {};
                this.$$element = a
            };
            ga.prototype = {
                $normalize: $a,
                $addClass: function(a) {
                    a && a.length > 0 && C.addClass(this.$$element, a)
                },
                $removeClass: function(a) {
                    a && a.length > 0 && C.removeClass(this.$$element, a)
                },
                $updateClass: function(a, b) {
                    var c = _a(a, b);
                    c && c.length && C.addClass(this.$$element, c);
                    var d = _a(b, a);
                    d && d.length && C.removeClass(this.$$element, d)
                },
                $set: function(a, b, d, g) {
                    var h, i = this.$$element[0],
                        j = Ka(i, a),
                        k = La(i, a),
                        l = a;
                    if (j ? (this.$$element.prop(a, b), g = j) : k && (this[k] = b, l = k), this[a] = b, g ? this.$attr[a] = g : (g = this.$attr[a], g || (this.$attr[a] = g = ca(a, "-"))), h = I(this.$$element), "a" === h && "href" === a || "img" === h && "src" === a) this[a] = b = D(b, "src" === a);
                    else if ("img" === h && "srcset" === a) {
                        for (var m = "", n = md(b), o = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, p = /\s/.test(n) ? o : /(,)/, q = n.split(p), r = Math.floor(q.length / 2), s = 0; r > s; s++) {
                            var t = 2 * s;
                            m += D(md(q[t]), !0), m += " " + md(q[t + 1])
                        }
                        var u = md(q[2 * s]).split(/\s/);
                        m += D(md(u[0]), !0), 2 === u.length && (m += " " + md(u[1])), this[a] = b = m
                    }
                    d !== !1 && (null === b || b === c ? this.$$element.removeAttr(g) : this.$$element.attr(g, b));
                    var v = this.$$observers;
                    v && f(v[l], function(a) {
                        try {
                            a(b)
                        } catch (c) {
                            e(c)
                        }
                    })
                },
                $observe: function(a, b) {
                    var c = this,
                        d = c.$$observers || (c.$$observers = ja()),
                        e = d[a] || (d[a] = []);
                    return e.push(b), s.$evalAsync(function() {
                            !e.$$inter && c.hasOwnProperty(a) && b(c[a])
                        }),
                        function() {
                            J(e, b)
                        }
                }
            };
            var ha = d.startSymbol(),
                ia = d.endSymbol(),
                ka = "{{" == ha || "}}" == ia ? p : function(a) {
                    return a.replace(/\{\{/g, ha).replace(/}}/g, ia)
                },
                la = /^ngAttr[A-Z]/;
            return F.$$addBindingInfo = y ? function(a, b) {
                var c = a.data("$binding") || [];
                ld(b) ? c = c.concat(b) : c.push(b), a.data("$binding", c)
            } : o, F.$$addBindingClass = y ? function(a) {
                E(a, "ng-binding")
            } : o, F.$$addScopeInfo = y ? function(a, b, c, d) {
                var e = c ? d ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope";
                a.data(e, b)
            } : o, F.$$addScopeClass = y ? function(a, b) {
                E(a, b ? "ng-isolate-scope" : "ng-scope")
            } : o, F
        }]
    }

    function $a(a) {
        return pa(a.replace(Yd, ""))
    }

    function _a(a, b) {
        var c = "",
            d = a.split(/\s+/),
            e = b.split(/\s+/);
        a: for (var f = 0; f < d.length; f++) {
            for (var g = d[f], h = 0; h < e.length; h++)
                if (g == e[h]) continue a;
            c += (c.length > 0 ? " " : "") + g
        }
        return c
    }

    function ab(a) {
        a = ad(a);
        var b = a.length;
        if (1 >= b) return a;
        for (; b--;) {
            var c = a[b];
            c.nodeType === vd && ed.call(a, b, 1)
        }
        return a
    }

    function bb() {
        var a = {},
            b = !1,
            e = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function(b, c) {
            ga(b, "controller"), t(b) ? l(a, b) : a[b] = c
        }, this.allowGlobals = function() {
            b = !0
        }, this.$get = ["$injector", "$window", function(f, g) {
            function h(a, b, c, e) {
                if (!a || !t(a.$scope)) throw d("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", e, b);
                a.$scope[b] = c
            }
            return function(d, i, j, k) {
                var m, n, o, p;
                if (j = j === !0, k && u(k) && (p = k), u(d)) {
                    if (n = d.match(e), !n) throw Zd("ctrlfmt", "Badly formed controller string '{0}'. Must match `__name__ as __id__` or `__name__`.", d);
                    o = n[1], p = p || n[3], d = a.hasOwnProperty(o) ? a[o] : ha(i.$scope, o, !0) || (b ? ha(g, o, !0) : c), fa(d, o, !0)
                }
                if (j) {
                    var q = (ld(d) ? d[d.length - 1] : d).prototype;
                    return m = Object.create(q || null), p && h(i, p, m, o || d.name), l(function() {
                        return f.invoke(d, m, i, o), m
                    }, {
                        instance: m,
                        identifier: p
                    })
                }
                return m = f.instantiate(d, i, o), p && h(i, p, m, o || d.name), m
            }
        }]
    }

    function cb() {
        this.$get = ["$window", function(a) {
            return ad(a.document)
        }]
    }

    function db() {
        this.$get = ["$log", function(a) {
            return function(b, c) {
                a.error.apply(a, arguments)
            }
        }]
    }

    function eb(a, b) {
        if (u(a)) {
            var c = a.replace(ce, "").trim();
            if (c) {
                var d = b("Content-Type");
                (d && 0 === d.indexOf($d) || fb(c)) && (a = S(c))
            }
        }
        return a
    }

    function fb(a) {
        var b = a.match(ae);
        return b && be[b[0]].test(a)
    }

    function gb(a) {
        var b, c, d, e = ja();
        return a ? (f(a.split("\n"), function(a) {
            d = a.indexOf(":"), b = Wc(md(a.substr(0, d))), c = md(a.substr(d + 1)), b && (e[b] = e[b] ? e[b] + ", " + c : c)
        }), e) : e
    }

    function hb(a) {
        var b = t(a) ? a : c;
        return function(c) {
            if (b || (b = gb(a)), c) {
                var d = b[Wc(c)];
                return void 0 === d && (d = null), d
            }
            return b
        }
    }

    function ib(a, b, c, d) {
        return x(d) ? d(a, b, c) : (f(d, function(d) {
            a = d(a, b, c)
        }), a)
    }

    function jb(a) {
        return a >= 200 && 300 > a
    }

    function kb() {
        var a = this.defaults = {
                transformResponse: [eb],
                transformRequest: [function(a) {
                    return !t(a) || B(a) || D(a) || C(a) ? a : R(a)
                }],
                headers: {
                    common: {
                        Accept: "application/json, text/plain, */*"
                    },
                    post: L(_d),
                    put: L(_d),
                    patch: L(_d)
                },
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN"
            },
            b = !1;
        this.useApplyAsync = function(a) {
            return s(a) ? (b = !!a, this) : b
        };
        var e = this.interceptors = [];
        this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function(g, i, j, k, m, n) {
            function o(b) {
                function e(a) {
                    var b = l({}, a);
                    return a.data ? b.data = ib(a.data, a.headers, a.status, i.transformResponse) : b.data = a.data, jb(a.status) ? b : m.reject(b)
                }

                function g(a) {
                    var b, c = {};
                    return f(a, function(a, d) {
                        x(a) ? (b = a(), null != b && (c[d] = b)) : c[d] = a
                    }), c
                }

                function h(b) {
                    var c, d, e, f = a.headers,
                        h = l({}, b.headers);
                    f = l({}, f.common, f[Wc(b.method)]);
                    a: for (c in f) {
                        d = Wc(c);
                        for (e in h)
                            if (Wc(e) === d) continue a;
                        h[c] = f[c]
                    }
                    return g(h)
                }
                if (!id.isObject(b)) throw d("$http")("badreq", "Http request configuration must be an object.  Received: {0}", b);
                var i = l({
                    method: "get",
                    transformRequest: a.transformRequest,
                    transformResponse: a.transformResponse
                }, b);
                i.headers = h(b), i.method = Yc(i.method);
                var j = function(b) {
                        var d = b.headers,
                            g = ib(b.data, hb(d), c, b.transformRequest);
                        return r(g) && f(d, function(a, b) {
                            "content-type" === Wc(b) && delete d[b]
                        }), r(b.withCredentials) && !r(a.withCredentials) && (b.withCredentials = a.withCredentials), v(b, g).then(e, e)
                    },
                    k = [j, c],
                    n = m.when(i);
                for (f(A, function(a) {
                        (a.request || a.requestError) && k.unshift(a.request, a.requestError), (a.response || a.responseError) && k.push(a.response, a.responseError)
                    }); k.length;) {
                    var o = k.shift(),
                        p = k.shift();
                    n = n.then(o, p)
                }
                return n.success = function(a) {
                    return fa(a, "fn"), n.then(function(b) {
                        a(b.data, b.status, b.headers, i)
                    }), n
                }, n.error = function(a) {
                    return fa(a, "fn"), n.then(null, function(b) {
                        a(b.data, b.status, b.headers, i)
                    }), n
                }, n
            }

            function p(a) {
                f(arguments, function(a) {
                    o[a] = function(b, c) {
                        return o(l(c || {}, {
                            method: a,
                            url: b
                        }))
                    }
                })
            }

            function q(a) {
                f(arguments, function(a) {
                    o[a] = function(b, c, d) {
                        return o(l(d || {}, {
                            method: a,
                            url: b,
                            data: c
                        }))
                    }
                })
            }

            function v(d, e) {
                function f(a, c, d, e) {
                    function f() {
                        h(c, a, d, e)
                    }
                    n && (jb(a) ? n.put(w, [a, c, gb(d), e]) : n.remove(w)), b ? k.$applyAsync(f) : (f(), k.$$phase || k.$apply())
                }

                function h(a, b, c, e) {
                    b = Math.max(b, 0), (jb(b) ? q.resolve : q.reject)({
                        data: a,
                        status: b,
                        headers: hb(c),
                        config: d,
                        statusText: e
                    })
                }

                function j(a) {
                    h(a.data, a.status, L(a.headers()), a.statusText)
                }

                function l() {
                    var a = o.pendingRequests.indexOf(d); - 1 !== a && o.pendingRequests.splice(a, 1)
                }
                var n, p, q = m.defer(),
                    u = q.promise,
                    v = d.headers,
                    w = y(d.url, d.params);
                if (o.pendingRequests.push(d), u.then(l, l), !d.cache && !a.cache || d.cache === !1 || "GET" !== d.method && "JSONP" !== d.method || (n = t(d.cache) ? d.cache : t(a.cache) ? a.cache : z), n && (p = n.get(w), s(p) ? F(p) ? p.then(j, j) : ld(p) ? h(p[1], p[0], L(p[2]), p[3]) : h(p, 200, {}, "OK") : n.put(w, u)), r(p)) {
                    var x = ec(d.url) ? i.cookies()[d.xsrfCookieName || a.xsrfCookieName] : c;
                    x && (v[d.xsrfHeaderName || a.xsrfHeaderName] = x), g(d.method, w, e, f, v, d.timeout, d.withCredentials, d.responseType)
                }
                return u
            }

            function y(a, b) {
                if (!b) return a;
                var c = [];
                return h(b, function(a, b) {
                    null === a || r(a) || (ld(a) || (a = [a]), f(a, function(a) {
                        t(a) && (a = w(a) ? a.toISOString() : R(a)), c.push(Y(b) + "=" + Y(a))
                    }))
                }), c.length > 0 && (a += (-1 == a.indexOf("?") ? "?" : "&") + c.join("&")), a
            }
            var z = j("$http"),
                A = [];
            return f(e, function(a) {
                A.unshift(u(a) ? n.get(a) : n.invoke(a))
            }), o.pendingRequests = [], p("get", "delete", "head", "jsonp"), q("post", "put", "patch"), o.defaults = a, o
        }]
    }

    function lb() {
        return new a.XMLHttpRequest
    }

    function mb() {
        this.$get = ["$browser", "$window", "$document", function(a, b, c) {
            return nb(a, lb, a.defer, b.angular.callbacks, c[0])
        }]
    }

    function nb(a, b, d, e, g) {
        function h(a, b, c) {
            var d = g.createElement("script"),
                f = null;
            return d.type = "text/javascript", d.src = a, d.async = !0, f = function(a) {
                Cd(d, "load", f), Cd(d, "error", f), g.body.removeChild(d), d = null;
                var h = -1,
                    i = "unknown";
                a && ("load" !== a.type || e[b].called || (a = {
                    type: "error"
                }), i = a.type, h = "error" === a.type ? 404 : 200), c && c(h, i)
            }, Bd(d, "load", f), Bd(d, "error", f), g.body.appendChild(d), f
        }
        return function(g, i, j, k, l, m, n, p) {
            function q() {
                u && u(), v && v.abort()
            }

            function r(b, e, f, g, h) {
                y !== c && d.cancel(y), u = v = null, b(e, f, g, h), a.$$completeOutstandingRequest(o)
            }
            if (a.$$incOutstandingRequestCount(), i = i || a.url(), "jsonp" == Wc(g)) {
                var t = "_" + (e.counter++).toString(36);
                e[t] = function(a) {
                    e[t].data = a, e[t].called = !0
                };
                var u = h(i.replace("JSON_CALLBACK", "angular.callbacks." + t), t, function(a, b) {
                    r(k, a, e[t].data, "", b), e[t] = o
                })
            } else {
                var v = b();
                v.open(g, i, !0), f(l, function(a, b) {
                    s(a) && v.setRequestHeader(b, a)
                }), v.onload = function() {
                    var a = v.statusText || "",
                        b = "response" in v ? v.response : v.responseText,
                        c = 1223 === v.status ? 204 : v.status;
                    0 === c && (c = b ? 200 : "file" == dc(i).protocol ? 404 : 0), r(k, c, b, v.getAllResponseHeaders(), a)
                };
                var w = function() {
                    r(k, -1, null, null, "")
                };
                if (v.onerror = w, v.onabort = w, n && (v.withCredentials = !0), p) try {
                    v.responseType = p
                } catch (x) {
                    if ("json" !== p) throw x
                }
                v.send(j || null)
            }
            if (m > 0) var y = d(q, m);
            else F(m) && m.then(q)
        }
    }

    function ob() {
        var a = "{{",
            b = "}}";
        this.startSymbol = function(b) {
            return b ? (a = b, this) : a
        }, this.endSymbol = function(a) {
            return a ? (b = a, this) : b
        }, this.$get = ["$parse", "$exceptionHandler", "$sce", function(c, d, e) {
            function f(a) {
                return "\\\\\\" + a
            }

            function g(f, g, m, n) {
                function o(c) {
                    return c.replace(j, a).replace(k, b)
                }

                function p(a) {
                    try {
                        return a = D(a), n && !s(a) ? a : E(a)
                    } catch (b) {
                        var c = de("interr", "Can't interpolate: {0}\n{1}", f, b.toString());
                        d(c)
                    }
                }
                n = !!n;
                for (var q, t, u, v = 0, w = [], y = [], z = f.length, A = [], B = []; z > v;) {
                    if (-1 == (q = f.indexOf(a, v)) || -1 == (t = f.indexOf(b, q + h))) {
                        v !== z && A.push(o(f.substring(v)));
                        break
                    }
                    v !== q && A.push(o(f.substring(v, q))), u = f.substring(q + h, t), w.push(u), y.push(c(u, p)), v = t + i, B.push(A.length), A.push("")
                }
                if (m && A.length > 1) throw de("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", f);
                if (!g || w.length) {
                    var C = function(a) {
                            for (var b = 0, c = w.length; c > b; b++) {
                                if (n && r(a[b])) return;
                                A[B[b]] = a[b]
                            }
                            return A.join("")
                        },
                        D = function(a) {
                            return m ? e.getTrusted(m, a) : e.valueOf(a)
                        },
                        E = function(a) {
                            if (null == a) return "";
                            switch (typeof a) {
                                case "string":
                                    break;
                                case "number":
                                    a = "" + a;
                                    break;
                                default:
                                    a = R(a)
                            }
                            return a
                        };
                    return l(function(a) {
                        var b = 0,
                            c = w.length,
                            e = new Array(c);
                        try {
                            for (; c > b; b++) e[b] = y[b](a);
                            return C(e)
                        } catch (g) {
                            var h = de("interr", "Can't interpolate: {0}\n{1}", f, g.toString());
                            d(h)
                        }
                    }, {
                        exp: f,
                        expressions: w,
                        $$watchDelegate: function(a, b, c) {
                            var d;
                            return a.$watchGroup(y, function(c, e) {
                                var f = C(c);
                                x(b) && b.call(this, f, c !== e ? d : f, a), d = f
                            }, c)
                        }
                    })
                }
            }
            var h = a.length,
                i = b.length,
                j = new RegExp(a.replace(/./g, f), "g"),
                k = new RegExp(b.replace(/./g, f), "g");
            return g.startSymbol = function() {
                return a
            }, g.endSymbol = function() {
                return b
            }, g
        }]
    }

    function pb() {
        this.$get = ["$rootScope", "$window", "$q", "$$q", function(a, b, c, d) {
            function e(e, g, h, i) {
                var j = b.setInterval,
                    k = b.clearInterval,
                    l = 0,
                    m = s(i) && !i,
                    n = (m ? d : c).defer(),
                    o = n.promise;
                return h = s(h) ? h : 0, o.then(null, null, e), o.$$intervalId = j(function() {
                    n.notify(l++), h > 0 && l >= h && (n.resolve(l), k(o.$$intervalId), delete f[o.$$intervalId]), m || a.$apply()
                }, g), f[o.$$intervalId] = n, o
            }
            var f = {};
            return e.cancel = function(a) {
                return a && a.$$intervalId in f ? (f[a.$$intervalId].reject("canceled"), b.clearInterval(a.$$intervalId), delete f[a.$$intervalId], !0) : !1
            }, e
        }]
    }

    function qb() {
        this.$get = function() {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [{
                        minInt: 1,
                        minFrac: 0,
                        maxFrac: 3,
                        posPre: "",
                        posSuf: "",
                        negPre: "-",
                        negSuf: "",
                        gSize: 3,
                        lgSize: 3
                    }, {
                        minInt: 1,
                        minFrac: 2,
                        maxFrac: 2,
                        posPre: "¤",
                        posSuf: "",
                        negPre: "(¤",
                        negSuf: ")",
                        gSize: 3,
                        lgSize: 3
                    }],
                    CURRENCY_SYM: "$"
                },
                DATETIME_FORMATS: {
                    MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    AMPMS: ["AM", "PM"],
                    medium: "MMM d, y h:mm:ss a",
                    "short": "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a",
                    ERANAMES: ["Before Christ", "Anno Domini"],
                    ERAS: ["BC", "AD"]
                },
                pluralCat: function(a) {
                    return 1 === a ? "one" : "other"
                }
            }
        }
    }

    function rb(a) {
        for (var b = a.split("/"), c = b.length; c--;) b[c] = X(b[c]);
        return b.join("/")
    }

    function sb(a, b) {
        var c = dc(a);
        b.$$protocol = c.protocol, b.$$host = c.hostname, b.$$port = m(c.port) || fe[c.protocol] || null
    }

    function tb(a, b) {
        var c = "/" !== a.charAt(0);
        c && (a = "/" + a);
        var d = dc(a);
        b.$$path = decodeURIComponent(c && "/" === d.pathname.charAt(0) ? d.pathname.substring(1) : d.pathname), b.$$search = V(d.search), b.$$hash = decodeURIComponent(d.hash), b.$$path && "/" != b.$$path.charAt(0) && (b.$$path = "/" + b.$$path)
    }

    function ub(a, b) {
        return 0 === b.indexOf(a) ? b.substr(a.length) : void 0
    }

    function vb(a) {
        var b = a.indexOf("#");
        return -1 == b ? a : a.substr(0, b)
    }

    function wb(a) {
        return a.replace(/(#.+)|#$/, "$1")
    }

    function xb(a) {
        return a.substr(0, vb(a).lastIndexOf("/") + 1)
    }

    function yb(a) {
        return a.substring(0, a.indexOf("/", a.indexOf("//") + 2))
    }

    function zb(a, b) {
        this.$$html5 = !0, b = b || "";
        var d = xb(a);
        sb(a, this), this.$$parse = function(a) {
            var b = ub(d, a);
            if (!u(b)) throw ge("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', a, d);
            tb(b, this), this.$$path || (this.$$path = "/"), this.$$compose()
        }, this.$$compose = function() {
            var a = W(this.$$search),
                b = this.$$hash ? "#" + X(this.$$hash) : "";
            this.$$url = rb(this.$$path) + (a ? "?" + a : "") + b, this.$$absUrl = d + this.$$url.substr(1)
        }, this.$$parseLinkUrl = function(e, f) {
            if (f && "#" === f[0]) return this.hash(f.slice(1)), !0;
            var g, h, i;
            return (g = ub(a, e)) !== c ? (h = g, i = (g = ub(b, g)) !== c ? d + (ub("/", g) || g) : a + h) : (g = ub(d, e)) !== c ? i = d + g : d == e + "/" && (i = d), i && this.$$parse(i), !!i
        }
    }

    function Ab(a, b) {
        var c = xb(a);
        sb(a, this), this.$$parse = function(d) {
            function e(a, b, c) {
                var d, e = /^\/[A-Z]:(\/.*)/;
                return 0 === b.indexOf(c) && (b = b.replace(c, "")), e.exec(b) ? a : (d = e.exec(a), d ? d[1] : a)
            }
            var f, g = ub(a, d) || ub(c, d);
            r(g) || "#" !== g.charAt(0) ? this.$$html5 ? f = g : (f = "", r(g) && (a = d, this.replace())) : (f = ub(b, g), r(f) && (f = g)), tb(f, this), this.$$path = e(this.$$path, f, a), this.$$compose()
        }, this.$$compose = function() {
            var c = W(this.$$search),
                d = this.$$hash ? "#" + X(this.$$hash) : "";
            this.$$url = rb(this.$$path) + (c ? "?" + c : "") + d, this.$$absUrl = a + (this.$$url ? b + this.$$url : "")
        }, this.$$parseLinkUrl = function(b, c) {
            return vb(a) == vb(b) ? (this.$$parse(b), !0) : !1
        }
    }

    function Bb(a, b) {
        this.$$html5 = !0, Ab.apply(this, arguments);
        var c = xb(a);
        this.$$parseLinkUrl = function(d, e) {
            if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;
            var f, g;
            return a == vb(d) ? f = d : (g = ub(c, d)) ? f = a + b + g : c === d + "/" && (f = c), f && this.$$parse(f), !!f
        }, this.$$compose = function() {
            var c = W(this.$$search),
                d = this.$$hash ? "#" + X(this.$$hash) : "";
            this.$$url = rb(this.$$path) + (c ? "?" + c : "") + d, this.$$absUrl = a + b + this.$$url
        }
    }

    function Cb(a) {
        return function() {
            return this[a]
        }
    }

    function Db(a, b) {
        return function(c) {
            return r(c) ? this[a] : (this[a] = b(c), this.$$compose(), this)
        }
    }

    function Eb() {
        var a = "",
            b = {
                enabled: !1,
                requireBase: !0,
                rewriteLinks: !0
            };
        this.hashPrefix = function(b) {
            return s(b) ? (a = b, this) : a
        }, this.html5Mode = function(a) {
            return E(a) ? (b.enabled = a, this) : t(a) ? (E(a.enabled) && (b.enabled = a.enabled), E(a.requireBase) && (b.requireBase = a.requireBase), E(a.rewriteLinks) && (b.rewriteLinks = a.rewriteLinks), this) : b
        }, this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function(c, d, e, f, g) {
            function h(a, b, c) {
                var e = j.url(),
                    f = j.$$state;
                try {
                    d.url(a, b, c), j.$$state = d.state()
                } catch (g) {
                    throw j.url(e), j.$$state = f, g
                }
            }

            function i(a, b) {
                c.$broadcast("$locationChangeSuccess", j.absUrl(), a, j.$$state, b)
            }
            var j, k, l, m = d.baseHref(),
                n = d.url();
            if (b.enabled) {
                if (!m && b.requireBase) throw ge("nobase", "$location in HTML5 mode requires a <base> tag to be present!");
                l = yb(n) + (m || "/"), k = e.history ? zb : Bb
            } else l = vb(n), k = Ab;
            j = new k(l, "#" + a), j.$$parseLinkUrl(n, n), j.$$state = d.state();
            var o = /^\s*(javascript|mailto):/i;
            f.on("click", function(a) {
                if (b.rewriteLinks && !a.ctrlKey && !a.metaKey && !a.shiftKey && 2 != a.which && 2 != a.button) {
                    for (var e = ad(a.target);
                        "a" !== I(e[0]);)
                        if (e[0] === f[0] || !(e = e.parent())[0]) return;
                    var h = e.prop("href"),
                        i = e.attr("href") || e.attr("xlink:href");
                    t(h) && "[object SVGAnimatedString]" === h.toString() && (h = dc(h.animVal).href), o.test(h) || !h || e.attr("target") || a.isDefaultPrevented() || j.$$parseLinkUrl(h, i) && (a.preventDefault(), j.absUrl() != d.url() && (c.$apply(), g.angular["ff-684208-preventDefault"] = !0))
                }
            }), wb(j.absUrl()) != wb(n) && d.url(j.absUrl(), !0);
            var p = !0;
            return d.onUrlChange(function(a, b) {
                c.$evalAsync(function() {
                    var d, e = j.absUrl(),
                        f = j.$$state;
                    j.$$parse(a), j.$$state = b, d = c.$broadcast("$locationChangeStart", a, e, b, f).defaultPrevented, j.absUrl() === a && (d ? (j.$$parse(e), j.$$state = f, h(e, !1, f)) : (p = !1, i(e, f)))
                }), c.$$phase || c.$digest()
            }), c.$watch(function() {
                var a = wb(d.url()),
                    b = wb(j.absUrl()),
                    f = d.state(),
                    g = j.$$replace,
                    k = a !== b || j.$$html5 && e.history && f !== j.$$state;
                (p || k) && (p = !1, c.$evalAsync(function() {
                    var b = j.absUrl(),
                        d = c.$broadcast("$locationChangeStart", b, a, j.$$state, f).defaultPrevented;
                    j.absUrl() === b && (d ? (j.$$parse(a), j.$$state = f) : (k && h(b, g, f === j.$$state ? null : j.$$state), i(a, f)))
                })), j.$$replace = !1
            }), j
        }]
    }

    function Fb() {
        var a = !0,
            b = this;
        this.debugEnabled = function(b) {
            return s(b) ? (a = b, this) : a
        }, this.$get = ["$window", function(c) {
            function d(a) {
                return a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line)), a
            }

            function e(a) {
                var b = c.console || {},
                    e = b[a] || b.log || o,
                    g = !1;
                try {
                    g = !!e.apply
                } catch (h) {}
                return g ? function() {
                    var a = [];
                    return f(arguments, function(b) {
                        a.push(d(b))
                    }), e.apply(b, a)
                } : function(a, b) {
                    e(a, null == b ? "" : b)
                }
            }
            return {
                log: e("log"),
                info: e("info"),
                warn: e("warn"),
                error: e("error"),
                debug: function() {
                    var c = e("debug");
                    return function() {
                        a && c.apply(b, arguments)
                    }
                }()
            }
        }]
    }

    function Gb(a, b) {
        if ("__defineGetter__" === a || "__defineSetter__" === a || "__lookupGetter__" === a || "__lookupSetter__" === a || "__proto__" === a) throw ie("isecfld", "Attempting to access a disallowed field in Angular expressions! Expression: {0}", b);
        return a
    }

    function Hb(a, b) {
        if (a) {
            if (a.constructor === a) throw ie("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", b);
            if (a.window === a) throw ie("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", b);
            if (a.children && (a.nodeName || a.prop && a.attr && a.find)) throw ie("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", b);
            if (a === Object) throw ie("isecobj", "Referencing Object in Angular expressions is disallowed! Expression: {0}", b)
        }
        return a
    }

    function Ib(a, b) {
        if (a) {
            if (a.constructor === a) throw ie("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", b);
            if (a === je || a === ke || a === le) throw ie("isecff", "Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}", b)
        }
    }

    function Jb(a) {
        return a.constant
    }

    function Kb(a, b, c, d, e) {
        Hb(a, e), Hb(b, e);
        for (var f, g = c.split("."), h = 0; g.length > 1; h++) {
            f = Gb(g.shift(), e);
            var i = 0 === h && b && b[f] || a[f];
            i || (i = {}, a[f] = i), a = Hb(i, e)
        }
        return f = Gb(g.shift(), e), Hb(a[f], e), a[f] = d, d
    }

    function Lb(a) {
        return "constructor" == a
    }

    function Mb(a, b, d, e, f, g, h) {
        Gb(a, g), Gb(b, g), Gb(d, g), Gb(e, g), Gb(f, g);
        var i = function(a) {
                return Hb(a, g)
            },
            j = h || Lb(a) ? i : p,
            k = h || Lb(b) ? i : p,
            l = h || Lb(d) ? i : p,
            m = h || Lb(e) ? i : p,
            n = h || Lb(f) ? i : p;
        return function(g, h) {
            var i = h && h.hasOwnProperty(a) ? h : g;
            return null == i ? i : (i = j(i[a]), b ? null == i ? c : (i = k(i[b]), d ? null == i ? c : (i = l(i[d]), e ? null == i ? c : (i = m(i[e]), f ? null == i ? c : i = n(i[f]) : i) : i) : i) : i)
        }
    }

    function Nb(a, b) {
        return function(c, d) {
            return a(c, d, Hb, b)
        }
    }

    function Ob(a, b, d) {
        var e = b.expensiveChecks,
            g = e ? se : re,
            h = g[a];
        if (h) return h;
        var i = a.split("."),
            j = i.length;
        if (b.csp) h = 6 > j ? Mb(i[0], i[1], i[2], i[3], i[4], d, e) : function(a, b) {
            var f, g = 0;
            do f = Mb(i[g++], i[g++], i[g++], i[g++], i[g++], d, e)(a, b), b = c, a = f; while (j > g);
            return f
        };
        else {
            var k = "";
            e && (k += "s = eso(s, fe);\nl = eso(l, fe);\n");
            var l = e;
            f(i, function(a, b) {
                Gb(a, d);
                var c = (b ? "s" : '((l&&l.hasOwnProperty("' + a + '"))?l:s)') + "." + a;
                (e || Lb(a)) && (c = "eso(" + c + ", fe)", l = !0), k += "if(s == null) return undefined;\ns=" + c + ";\n"
            }), k += "return s;";
            var m = new Function("s", "l", "eso", "fe", k);
            m.toString = q(k), l && (m = Nb(m, d)), h = m
        }
        return h.sharedGetter = !0, h.assign = function(b, c, d) {
            return Kb(b, d, a, c, a)
        }, g[a] = h, h
    }

    function Pb(a) {
        return x(a.valueOf) ? a.valueOf() : te.call(a)
    }

    function Qb() {
        var a = ja(),
            b = ja();
        this.$get = ["$filter", "$sniffer", function(c, d) {
            function e(a) {
                var b = a;
                return a.sharedGetter && (b = function(b, c) {
                    return a(b, c)
                }, b.literal = a.literal, b.constant = a.constant, b.assign = a.assign), b
            }

            function g(a, b) {
                for (var c = 0, d = a.length; d > c; c++) {
                    var e = a[c];
                    e.constant || (e.inputs ? g(e.inputs, b) : -1 === b.indexOf(e) && b.push(e))
                }
                return b
            }

            function h(a, b) {
                return null == a || null == b ? a === b : "object" == typeof a && (a = Pb(a), "object" == typeof a) ? !1 : a === b || a !== a && b !== b
            }

            function i(a, b, c, d) {
                var e, f = d.$$inputs || (d.$$inputs = g(d.inputs, []));
                if (1 === f.length) {
                    var i = h;
                    return f = f[0], a.$watch(function(a) {
                        var b = f(a);
                        return h(b, i) || (e = d(a), i = b && Pb(b)), e
                    }, b, c)
                }
                for (var j = [], k = 0, l = f.length; l > k; k++) j[k] = h;
                return a.$watch(function(a) {
                    for (var b = !1, c = 0, g = f.length; g > c; c++) {
                        var i = f[c](a);
                        (b || (b = !h(i, j[c]))) && (j[c] = i && Pb(i))
                    }
                    return b && (e = d(a)), e
                }, b, c)
            }

            function j(a, b, c, d) {
                var e, f;
                return e = a.$watch(function(a) {
                    return d(a)
                }, function(a, c, d) {
                    f = a, x(b) && b.apply(this, arguments), s(a) && d.$$postDigest(function() {
                        s(f) && e()
                    })
                }, c)
            }

            function k(a, b, c, d) {
                function e(a) {
                    var b = !0;
                    return f(a, function(a) {
                        s(a) || (b = !1)
                    }), b
                }
                var g, h;
                return g = a.$watch(function(a) {
                    return d(a)
                }, function(a, c, d) {
                    h = a, x(b) && b.call(this, a, c, d), e(a) && d.$$postDigest(function() {
                        e(h) && g()
                    })
                }, c)
            }

            function l(a, b, c, d) {
                var e;
                return e = a.$watch(function(a) {
                    return d(a)
                }, function(a, c, d) {
                    x(b) && b.apply(this, arguments), e()
                }, c)
            }

            function m(a, b) {
                if (!b) return a;
                var c = a.$$watchDelegate,
                    d = c !== k && c !== j,
                    e = d ? function(c, d) {
                        var e = a(c, d);
                        return b(e, c, d)
                    } : function(c, d) {
                        var e = a(c, d),
                            f = b(e, c, d);
                        return s(e) ? f : e
                    };
                return a.$$watchDelegate && a.$$watchDelegate !== i ? e.$$watchDelegate = a.$$watchDelegate : b.$stateful || (e.$$watchDelegate = i, e.inputs = [a]), e
            }
            var n = {
                    csp: d.csp,
                    expensiveChecks: !1
                },
                p = {
                    csp: d.csp,
                    expensiveChecks: !0
                };
            return function(d, f, g) {
                var h, q, r;
                switch (typeof d) {
                    case "string":
                        r = d = d.trim();
                        var s = g ? b : a;
                        if (h = s[r], !h) {
                            ":" === d.charAt(0) && ":" === d.charAt(1) && (q = !0, d = d.substring(2));
                            var t = g ? p : n,
                                u = new pe(t),
                                v = new qe(u, c, t);
                            h = v.parse(d), h.constant ? h.$$watchDelegate = l : q ? (h = e(h), h.$$watchDelegate = h.literal ? k : j) : h.inputs && (h.$$watchDelegate = i), s[r] = h
                        }
                        return m(h, f);
                    case "function":
                        return m(d, f);
                    default:
                        return m(o, f)
                }
            }
        }]
    }

    function Rb() {
        this.$get = ["$rootScope", "$exceptionHandler", function(a, b) {
            return Tb(function(b) {
                a.$evalAsync(b)
            }, b)
        }]
    }

    function Sb() {
        this.$get = ["$browser", "$exceptionHandler", function(a, b) {
            return Tb(function(b) {
                a.defer(b)
            }, b)
        }]
    }

    function Tb(a, b) {
        function e(a, b, c) {
            function d(b) {
                return function(c) {
                    e || (e = !0, b.call(a, c))
                }
            }
            var e = !1;
            return [d(b), d(c)]
        }

        function g() {
            this.$$state = {
                status: 0
            }
        }

        function h(a, b) {
            return function(c) {
                b.call(a, c)
            }
        }

        function i(a) {
            var d, e, f;
            f = a.pending, a.processScheduled = !1, a.pending = c;
            for (var g = 0, h = f.length; h > g; ++g) {
                e = f[g][0], d = f[g][a.status];
                try {
                    x(d) ? e.resolve(d(a.value)) : 1 === a.status ? e.resolve(a.value) : e.reject(a.value)
                } catch (i) {
                    e.reject(i), b(i)
                }
            }
        }

        function j(b) {
            !b.processScheduled && b.pending && (b.processScheduled = !0, a(function() {
                i(b)
            }))
        }

        function k() {
            this.promise = new g, this.resolve = h(this, this.resolve), this.reject = h(this, this.reject), this.notify = h(this, this.notify)
        }

        function l(a) {
            var b = new k,
                c = 0,
                d = ld(a) ? [] : {};
            return f(a, function(a, e) {
                c++, r(a).then(function(a) {
                    d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d))
                }, function(a) {
                    d.hasOwnProperty(e) || b.reject(a)
                })
            }), 0 === c && b.resolve(d), b.promise
        }
        var m = d("$q", TypeError),
            n = function() {
                return new k
            };
        g.prototype = {
            then: function(a, b, c) {
                var d = new k;
                return this.$$state.pending = this.$$state.pending || [], this.$$state.pending.push([d, a, b, c]), this.$$state.status > 0 && j(this.$$state), d.promise
            },
            "catch": function(a) {
                return this.then(null, a)
            },
            "finally": function(a, b) {
                return this.then(function(b) {
                    return q(b, !0, a)
                }, function(b) {
                    return q(b, !1, a)
                }, b)
            }
        }, k.prototype = {
            resolve: function(a) {
                this.promise.$$state.status || (a === this.promise ? this.$$reject(m("qcycle", "Expected promise to be resolved with value other than itself '{0}'", a)) : this.$$resolve(a))
            },
            $$resolve: function(a) {
                var c, d;
                d = e(this, this.$$resolve, this.$$reject);
                try {
                    (t(a) || x(a)) && (c = a && a.then), x(c) ? (this.promise.$$state.status = -1, c.call(a, d[0], d[1], this.notify)) : (this.promise.$$state.value = a, this.promise.$$state.status = 1, j(this.promise.$$state))
                } catch (f) {
                    d[1](f), b(f)
                }
            },
            reject: function(a) {
                this.promise.$$state.status || this.$$reject(a)
            },
            $$reject: function(a) {
                this.promise.$$state.value = a, this.promise.$$state.status = 2, j(this.promise.$$state)
            },
            notify: function(c) {
                var d = this.promise.$$state.pending;
                this.promise.$$state.status <= 0 && d && d.length && a(function() {
                    for (var a, e, f = 0, g = d.length; g > f; f++) {
                        e = d[f][0], a = d[f][3];
                        try {
                            e.notify(x(a) ? a(c) : c)
                        } catch (h) {
                            b(h)
                        }
                    }
                })
            }
        };
        var o = function(a) {
                var b = new k;
                return b.reject(a), b.promise
            },
            p = function(a, b) {
                var c = new k;
                return b ? c.resolve(a) : c.reject(a), c.promise
            },
            q = function(a, b, c) {
                var d = null;
                try {
                    x(c) && (d = c())
                } catch (e) {
                    return p(e, !1)
                }
                return F(d) ? d.then(function() {
                    return p(a, b)
                }, function(a) {
                    return p(a, !1)
                }) : p(a, b)
            },
            r = function(a, b, c, d) {
                var e = new k;
                return e.resolve(a), e.promise.then(b, c, d)
            },
            s = function u(a) {
                function b(a) {
                    d.resolve(a)
                }

                function c(a) {
                    d.reject(a)
                }
                if (!x(a)) throw m("norslvr", "Expected resolverFn, got '{0}'", a);
                if (!(this instanceof u)) return new u(a);
                var d = new k;
                return a(b, c), d.promise
            };
        return s.defer = n, s.reject = o, s.when = r, s.all = l, s
    }

    function Ub() {
        this.$get = ["$window", "$timeout", function(a, b) {
            function c() {
                for (var a = 0; a < k.length; a++) {
                    var b = k[a];
                    b && (k[a] = null, b())
                }
                j = k.length = 0
            }

            function d(a) {
                var b = k.length;
                return j++, k.push(a), 0 === b && (i = h(c)),
                    function() {
                        b >= 0 && (k[b] = null, b = null, 0 === --j && i && (i(), i = null, k.length = 0))
                    }
            }
            var e = a.requestAnimationFrame || a.webkitRequestAnimationFrame,
                f = a.cancelAnimationFrame || a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame,
                g = !!e,
                h = g ? function(a) {
                    var b = e(a);
                    return function() {
                        f(b)
                    }
                } : function(a) {
                    var c = b(a, 16.66, !1);
                    return function() {
                        b.cancel(c)
                    }
                };
            d.supported = g;
            var i, j = 0,
                k = [];
            return d
        }]
    }

    function Vb() {
        function a(a) {
            function b() {
                this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null, this.$$listeners = {}, this.$$listenerCount = {}, this.$id = j(), this.$$ChildScope = null
            }
            return b.prototype = a, b
        }
        var b = 10,
            c = d("$rootScope"),
            g = null,
            h = null;
        this.digestTtl = function(a) {
            return arguments.length && (b = a), b
        }, this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser", function(d, i, k, l) {
            function m(a) {
                a.currentScope.$$destroyed = !0
            }

            function n() {
                this.$id = j(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this.$root = this, this.$$destroyed = !1, this.$$listeners = {}, this.$$listenerCount = {}, this.$$isolateBindings = null
            }

            function p(a) {
                if (y.$$phase) throw c("inprog", "{0} already in progress", y.$$phase);
                y.$$phase = a
            }

            function q() {
                y.$$phase = null
            }

            function s(a, b, c) {
                do a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c]; while (a = a.$parent)
            }

            function u() {}

            function v() {
                for (; B.length;) try {
                    B.shift()()
                } catch (a) {
                    i(a)
                }
                h = null
            }

            function w() {
                null === h && (h = l.defer(function() {
                    y.$apply(v)
                }))
            }
            n.prototype = {
                constructor: n,
                $new: function(b, c) {
                    var d;
                    return c = c || this, b ? (d = new n, d.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = a(this)), d = new this.$$ChildScope), d.$parent = c, d.$$prevSibling = c.$$childTail, c.$$childHead ? (c.$$childTail.$$nextSibling = d, c.$$childTail = d) : c.$$childHead = c.$$childTail = d, (b || c != this) && d.$on("$destroy", m), d
                },
                $watch: function(a, b, c) {
                    var d = k(a);
                    if (d.$$watchDelegate) return d.$$watchDelegate(this, b, c, d);
                    var e = this,
                        f = e.$$watchers,
                        h = {
                            fn: b,
                            last: u,
                            get: d,
                            exp: a,
                            eq: !!c
                        };
                    return g = null, x(b) || (h.fn = o), f || (f = e.$$watchers = []), f.unshift(h),
                        function() {
                            J(f, h), g = null
                        }
                },
                $watchGroup: function(a, b) {
                    function c() {
                        i = !1, j ? (j = !1, b(e, e, h)) : b(e, d, h)
                    }
                    var d = new Array(a.length),
                        e = new Array(a.length),
                        g = [],
                        h = this,
                        i = !1,
                        j = !0;
                    if (!a.length) {
                        var k = !0;
                        return h.$evalAsync(function() {
                                k && b(e, e, h)
                            }),
                            function() {
                                k = !1
                            }
                    }
                    return 1 === a.length ? this.$watch(a[0], function(a, c, f) {
                        e[0] = a, d[0] = c, b(e, a === c ? e : d, f)
                    }) : (f(a, function(a, b) {
                        var f = h.$watch(a, function(a, f) {
                            e[b] = a, d[b] = f, i || (i = !0, h.$evalAsync(c))
                        });
                        g.push(f)
                    }), function() {
                        for (; g.length;) g.shift()()
                    })
                },
                $watchCollection: function(a, b) {
                    function c(a) {
                        f = a;
                        var b, c, d, h, i;
                        if (!r(f)) {
                            if (t(f))
                                if (e(f)) {
                                    g !== n && (g = n, q = g.length = 0, l++), b = f.length, q !== b && (l++, g.length = q = b);
                                    for (var j = 0; b > j; j++) i = g[j], h = f[j], d = i !== i && h !== h, d || i === h || (l++, g[j] = h)
                                } else {
                                    g !== o && (g = o = {}, q = 0, l++), b = 0;
                                    for (c in f) f.hasOwnProperty(c) && (b++, h = f[c], i = g[c], c in g ? (d = i !== i && h !== h, d || i === h || (l++, g[c] = h)) : (q++, g[c] = h, l++));
                                    if (q > b) {
                                        l++;
                                        for (c in g) f.hasOwnProperty(c) || (q--, delete g[c])
                                    }
                                }
                            else g !== f && (g = f, l++);
                            return l
                        }
                    }

                    function d() {
                        if (p ? (p = !1, b(f, f, i)) : b(f, h, i), j)
                            if (t(f))
                                if (e(f)) {
                                    h = new Array(f.length);
                                    for (var a = 0; a < f.length; a++) h[a] = f[a]
                                } else {
                                    h = {};
                                    for (var c in f) Xc.call(f, c) && (h[c] = f[c])
                                }
                        else h = f
                    }
                    c.$stateful = !0;
                    var f, g, h, i = this,
                        j = b.length > 1,
                        l = 0,
                        m = k(a, c),
                        n = [],
                        o = {},
                        p = !0,
                        q = 0;
                    return this.$watch(m, d)
                },
                $digest: function() {
                    var a, d, e, f, j, k, m, n, o, r, s = b,
                        t = this,
                        w = [];
                    p("$digest"), l.$$checkUrlChange(), this === y && null !== h && (l.defer.cancel(h), v()), g = null;
                    do {
                        for (k = !1, n = t; z.length;) {
                            try {
                                r = z.shift(), r.scope.$eval(r.expression, r.locals)
                            } catch (B) {
                                i(B)
                            }
                            g = null
                        }
                        a: do {
                            if (f = n.$$watchers)
                                for (j = f.length; j--;) try {
                                    if (a = f[j])
                                        if ((d = a.get(n)) === (e = a.last) || (a.eq ? M(d, e) : "number" == typeof d && "number" == typeof e && isNaN(d) && isNaN(e))) {
                                            if (a === g) {
                                                k = !1;
                                                break a
                                            }
                                        } else k = !0, g = a, a.last = a.eq ? K(d, null) : d, a.fn(d, e === u ? d : e, n), 5 > s && (o = 4 - s, w[o] || (w[o] = []), w[o].push({
                                            msg: x(a.exp) ? "fn: " + (a.exp.name || a.exp.toString()) : a.exp,
                                            newVal: d,
                                            oldVal: e
                                        }))
                                } catch (B) {
                                    i(B)
                                }
                            if (!(m = n.$$childHead || n !== t && n.$$nextSibling))
                                for (; n !== t && !(m = n.$$nextSibling);) n = n.$parent
                        } while (n = m);
                        if ((k || z.length) && !s--) throw q(), c("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", b, w)
                    } while (k || z.length);
                    for (q(); A.length;) try {
                        A.shift()()
                    } catch (B) {
                        i(B)
                    }
                },
                $destroy: function() {
                    if (!this.$$destroyed) {
                        var a = this.$parent;
                        if (this.$broadcast("$destroy"), this.$$destroyed = !0, this !== y) {
                            for (var b in this.$$listenerCount) s(this, this.$$listenerCount[b], b);
                            a.$$childHead == this && (a.$$childHead = this.$$nextSibling), a.$$childTail == this && (a.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = o, this.$on = this.$watch = this.$watchGroup = function() {
                                return o
                            }, this.$$listeners = {}, this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null
                        }
                    }
                },
                $eval: function(a, b) {
                    return k(a)(this, b)
                },
                $evalAsync: function(a, b) {
                    y.$$phase || z.length || l.defer(function() {
                        z.length && y.$digest()
                    }), z.push({
                        scope: this,
                        expression: a,
                        locals: b
                    })
                },
                $$postDigest: function(a) {
                    A.push(a)
                },
                $apply: function(a) {
                    try {
                        return p("$apply"), this.$eval(a)
                    } catch (b) {
                        i(b)
                    } finally {
                        q();
                        try {
                            y.$digest()
                        } catch (b) {
                            throw i(b), b
                        }
                    }
                },
                $applyAsync: function(a) {
                    function b() {
                        c.$eval(a)
                    }
                    var c = this;
                    a && B.push(b), w()
                },
                $on: function(a, b) {
                    var c = this.$$listeners[a];
                    c || (this.$$listeners[a] = c = []), c.push(b);
                    var d = this;
                    do d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++; while (d = d.$parent);
                    var e = this;
                    return function() {
                        var d = c.indexOf(b); - 1 !== d && (c[d] = null, s(e, 1, a))
                    }
                },
                $emit: function(a, b) {
                    var c, d, e, f = [],
                        g = this,
                        h = !1,
                        j = {
                            name: a,
                            targetScope: g,
                            stopPropagation: function() {
                                h = !0
                            },
                            preventDefault: function() {
                                j.defaultPrevented = !0
                            },
                            defaultPrevented: !1
                        },
                        k = N([j], arguments, 1);
                    do {
                        for (c = g.$$listeners[a] || f, j.currentScope = g, d = 0, e = c.length; e > d; d++)
                            if (c[d]) try {
                                c[d].apply(null, k)
                            } catch (l) {
                                i(l)
                            } else c.splice(d, 1), d--, e--;
                        if (h) return j.currentScope = null, j;
                        g = g.$parent
                    } while (g);
                    return j.currentScope = null, j
                },
                $broadcast: function(a, b) {
                    var c = this,
                        d = c,
                        e = c,
                        f = {
                            name: a,
                            targetScope: c,
                            preventDefault: function() {
                                f.defaultPrevented = !0
                            },
                            defaultPrevented: !1
                        };
                    if (!c.$$listenerCount[a]) return f;
                    for (var g, h, j, k = N([f], arguments, 1); d = e;) {
                        for (f.currentScope = d, g = d.$$listeners[a] || [], h = 0, j = g.length; j > h; h++)
                            if (g[h]) try {
                                g[h].apply(null, k)
                            } catch (l) {
                                i(l)
                            } else g.splice(h, 1), h--, j--;
                        if (!(e = d.$$listenerCount[a] && d.$$childHead || d !== c && d.$$nextSibling))
                            for (; d !== c && !(e = d.$$nextSibling);) d = d.$parent
                    }
                    return f.currentScope = null, f
                }
            };
            var y = new n,
                z = y.$$asyncQueue = [],
                A = y.$$postDigestQueue = [],
                B = y.$$applyAsyncQueue = [];
            return y
        }]
    }

    function Wb() {
        var a = /^\s*(https?|ftp|mailto|tel|file):/,
            b = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function(b) {
            return s(b) ? (a = b, this) : a
        }, this.imgSrcSanitizationWhitelist = function(a) {
            return s(a) ? (b = a, this) : b
        }, this.$get = function() {
            return function(c, d) {
                var e, f = d ? b : a;
                return e = dc(c).href, "" === e || e.match(f) ? c : "unsafe:" + e
            }
        }
    }

    function Xb(a) {
        if ("self" === a) return a;
        if (u(a)) {
            if (a.indexOf("***") > -1) throw ue("iwcard", "Illegal sequence *** in string matcher.  String: {0}", a);
            return a = nd(a).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), new RegExp("^" + a + "$")
        }
        if (y(a)) return new RegExp("^" + a.source + "$");
        throw ue("imatcher", 'Matchers may only be "self", string patterns or RegExp objects')
    }

    function Yb(a) {
        var b = [];
        return s(a) && f(a, function(a) {
            b.push(Xb(a))
        }), b
    }

    function Zb() {
        this.SCE_CONTEXTS = ve;
        var a = ["self"],
            b = [];
        this.resourceUrlWhitelist = function(b) {
            return arguments.length && (a = Yb(b)), a
        }, this.resourceUrlBlacklist = function(a) {
            return arguments.length && (b = Yb(a)), b
        }, this.$get = ["$injector", function(d) {
            function e(a, b) {
                return "self" === a ? ec(b) : !!a.exec(b.href)
            }

            function f(c) {
                var d, f, g = dc(c.toString()),
                    h = !1;
                for (d = 0, f = a.length; f > d; d++)
                    if (e(a[d], g)) {
                        h = !0;
                        break
                    }
                if (h)
                    for (d = 0, f = b.length; f > d; d++)
                        if (e(b[d], g)) {
                            h = !1;
                            break
                        }
                return h
            }

            function g(a) {
                var b = function(a) {
                    this.$$unwrapTrustedValue = function() {
                        return a
                    }
                };
                return a && (b.prototype = new a), b.prototype.valueOf = function() {
                    return this.$$unwrapTrustedValue()
                }, b.prototype.toString = function() {
                    return this.$$unwrapTrustedValue().toString()
                }, b
            }

            function h(a, b) {
                var d = m.hasOwnProperty(a) ? m[a] : null;
                if (!d) throw ue("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", a, b);
                if (null === b || b === c || "" === b) return b;
                if ("string" != typeof b) throw ue("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", a);
                return new d(b)
            }

            function i(a) {
                return a instanceof l ? a.$$unwrapTrustedValue() : a
            }

            function j(a, b) {
                if (null === b || b === c || "" === b) return b;
                var d = m.hasOwnProperty(a) ? m[a] : null;
                if (d && b instanceof d) return b.$$unwrapTrustedValue();
                if (a === ve.RESOURCE_URL) {
                    if (f(b)) return b;
                    throw ue("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", b.toString())
                }
                if (a === ve.HTML) return k(b);
                throw ue("unsafe", "Attempting to use an unsafe value in a safe context.")
            }
            var k = function(a) {
                throw ue("unsafe", "Attempting to use an unsafe value in a safe context.")
            };
            d.has("$sanitize") && (k = d.get("$sanitize"));
            var l = g(),
                m = {};
            return m[ve.HTML] = g(l), m[ve.CSS] = g(l), m[ve.URL] = g(l), m[ve.JS] = g(l), m[ve.RESOURCE_URL] = g(m[ve.URL]), {
                trustAs: h,
                getTrusted: j,
                valueOf: i
            }
        }]
    }

    function $b() {
        var a = !0;
        this.enabled = function(b) {
            return arguments.length && (a = !!b), a
        }, this.$get = ["$parse", "$sceDelegate", function(b, c) {
            if (a && 8 > _c) throw ue("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
            var d = L(ve);
            d.isEnabled = function() {
                return a
            }, d.trustAs = c.trustAs, d.getTrusted = c.getTrusted, d.valueOf = c.valueOf, a || (d.trustAs = d.getTrusted = function(a, b) {
                return b
            }, d.valueOf = p), d.parseAs = function(a, c) {
                var e = b(c);
                return e.literal && e.constant ? e : b(c, function(b) {
                    return d.getTrusted(a, b)
                })
            };
            var e = d.parseAs,
                g = d.getTrusted,
                h = d.trustAs;
            return f(ve, function(a, b) {
                var c = Wc(b);
                d[pa("parse_as_" + c)] = function(b) {
                    return e(a, b)
                }, d[pa("get_trusted_" + c)] = function(b) {
                    return g(a, b)
                }, d[pa("trust_as_" + c)] = function(b) {
                    return h(a, b)
                }
            }), d
        }]
    }

    function _b() {
        this.$get = ["$window", "$document", function(a, b) {
            var c, d, e = {},
                f = m((/android (\d+)/.exec(Wc((a.navigator || {}).userAgent)) || [])[1]),
                g = /Boxee/i.test((a.navigator || {}).userAgent),
                h = b[0] || {},
                i = /^(Moz|webkit|ms)(?=[A-Z])/,
                j = h.body && h.body.style,
                k = !1,
                l = !1;
            if (j) {
                for (var n in j)
                    if (d = i.exec(n)) {
                        c = d[0], c = c.substr(0, 1).toUpperCase() + c.substr(1);
                        break
                    }
                c || (c = "WebkitOpacity" in j && "webkit"), k = !!("transition" in j || c + "Transition" in j), l = !!("animation" in j || c + "Animation" in j), !f || k && l || (k = u(h.body.style.webkitTransition), l = u(h.body.style.webkitAnimation))
            }
            return {
                history: !(!a.history || !a.history.pushState || 4 > f || g),
                hasEvent: function(a) {
                    if ("input" === a && 11 >= _c) return !1;
                    if (r(e[a])) {
                        var b = h.createElement("div");
                        e[a] = "on" + a in b
                    }
                    return e[a]
                },
                csp: od(),
                vendorPrefix: c,
                transitions: k,
                animations: l,
                android: f
            }
        }]
    }

    function ac() {
        this.$get = ["$templateCache", "$http", "$q", "$sce", function(a, b, c, d) {
            function e(f, g) {
                function h(a) {
                    if (!g) throw Xd("tpload", "Failed to load template: {0}", f);
                    return c.reject(a)
                }
                e.totalPendingRequests++, u(f) && a.get(f) || (f = d.getTrustedResourceUrl(f));
                var i = b.defaults && b.defaults.transformResponse;
                ld(i) ? i = i.filter(function(a) {
                    return a !== eb
                }) : i === eb && (i = null);
                var j = {
                    cache: a,
                    transformResponse: i
                };
                return b.get(f, j)["finally"](function() {
                    e.totalPendingRequests--
                }).then(function(a) {
                    return a.data
                }, h)
            }
            return e.totalPendingRequests = 0, e
        }]
    }

    function bc() {
        this.$get = ["$rootScope", "$browser", "$location", function(a, b, c) {
            var d = {};
            return d.findBindings = function(a, b, c) {
                var d = a.getElementsByClassName("ng-binding"),
                    e = [];
                return f(d, function(a) {
                    var d = id.element(a).data("$binding");
                    d && f(d, function(d) {
                        if (c) {
                            var f = new RegExp("(^|\\s)" + nd(b) + "(\\s|\\||$)");
                            f.test(d) && e.push(a)
                        } else -1 != d.indexOf(b) && e.push(a)
                    })
                }), e
            }, d.findModels = function(a, b, c) {
                for (var d = ["ng-", "data-ng-", "ng\\:"], e = 0; e < d.length; ++e) {
                    var f = c ? "=" : "*=",
                        g = "[" + d[e] + "model" + f + '"' + b + '"]',
                        h = a.querySelectorAll(g);
                    if (h.length) return h
                }
            }, d.getLocation = function() {
                return c.url()
            }, d.setLocation = function(b) {
                b !== c.url() && (c.url(b), a.$digest())
            }, d.whenStable = function(a) {
                b.notifyWhenNoOutstandingRequests(a)
            }, d
        }]
    }

    function cc() {
        this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function(a, b, c, d, e) {
            function f(f, h, i) {
                var j, k = s(i) && !i,
                    l = (k ? d : c).defer(),
                    m = l.promise;
                return j = b.defer(function() {
                    try {
                        l.resolve(f())
                    } catch (b) {
                        l.reject(b), e(b)
                    } finally {
                        delete g[m.$$timeoutId]
                    }
                    k || a.$apply()
                }, h), m.$$timeoutId = j, g[j] = l, m
            }
            var g = {};
            return f.cancel = function(a) {
                return a && a.$$timeoutId in g ? (g[a.$$timeoutId].reject("canceled"), delete g[a.$$timeoutId], b.defer.cancel(a.$$timeoutId)) : !1
            }, f
        }]
    }

    function dc(a) {
        var b = a;
        return _c && (we.setAttribute("href", b), b = we.href), we.setAttribute("href", b), {
            href: we.href,
            protocol: we.protocol ? we.protocol.replace(/:$/, "") : "",
            host: we.host,
            search: we.search ? we.search.replace(/^\?/, "") : "",
            hash: we.hash ? we.hash.replace(/^#/, "") : "",
            hostname: we.hostname,
            port: we.port,
            pathname: "/" === we.pathname.charAt(0) ? we.pathname : "/" + we.pathname
        }
    }

    function ec(a) {
        var b = u(a) ? dc(a) : a;
        return b.protocol === xe.protocol && b.host === xe.host
    }

    function fc() {
        this.$get = q(a)
    }

    function gc(a) {
        function b(d, e) {
            if (t(d)) {
                var g = {};
                return f(d, function(a, c) {
                    g[c] = b(c, a)
                }), g
            }
            return a.factory(d + c, e)
        }
        var c = "Filter";
        this.register = b, this.$get = ["$injector", function(a) {
            return function(b) {
                return a.get(b + c)
            }
        }], b("currency", kc), b("date", xc), b("filter", hc), b("json", yc), b("limitTo", zc), b("lowercase", Ce), b("number", lc), b("orderBy", Ac), b("uppercase", De)
    }

    function hc() {
        return function(a, b, c) {
            if (!ld(a)) return a;
            var d, e, f = null !== b ? typeof b : "null";
            switch (f) {
                case "function":
                    d = b;
                    break;
                case "boolean":
                case "null":
                case "number":
                case "string":
                    e = !0;
                case "object":
                    d = ic(b, c, e);
                    break;
                default:
                    return a
            }
            return a.filter(d)
        }
    }

    function ic(a, b, c) {
        var d, e = t(a) && "$" in a;
        return b === !0 ? b = M : x(b) || (b = function(a, b) {
            return r(a) ? !1 : null === a || null === b ? a === b : t(a) || t(b) ? !1 : (a = Wc("" + a), b = Wc("" + b), -1 !== a.indexOf(b))
        }), d = function(d) {
            return e && !t(d) ? jc(d, a.$, b, !1) : jc(d, a, b, c)
        }
    }

    function jc(a, b, c, d, e) {
        var f = null !== a ? typeof a : "null",
            g = null !== b ? typeof b : "null";
        if ("string" === g && "!" === b.charAt(0)) return !jc(a, b.substring(1), c, d);
        if (ld(a)) return a.some(function(a) {
            return jc(a, b, c, d)
        });
        switch (f) {
            case "object":
                var h;
                if (d) {
                    for (h in a)
                        if ("$" !== h.charAt(0) && jc(a[h], b, c, !0)) return !0;
                    return e ? !1 : jc(a, b, c, !1)
                }
                if ("object" === g) {
                    for (h in b) {
                        var i = b[h];
                        if (!x(i) && !r(i)) {
                            var j = "$" === h,
                                k = j ? a : a[h];
                            if (!jc(k, i, c, j, j)) return !1
                        }
                    }
                    return !0
                }
                return c(a, b);
            case "function":
                return !1;
            default:
                return c(a, b)
        }
    }

    function kc(a) {
        var b = a.NUMBER_FORMATS;
        return function(a, c, d) {
            return r(c) && (c = b.CURRENCY_SYM), r(d) && (d = b.PATTERNS[1].maxFrac), null == a ? a : mc(a, b.PATTERNS[1], b.GROUP_SEP, b.DECIMAL_SEP, d).replace(/\u00A4/g, c)
        }
    }

    function lc(a) {
        var b = a.NUMBER_FORMATS;
        return function(a, c) {
            return null == a ? a : mc(a, b.PATTERNS[0], b.GROUP_SEP, b.DECIMAL_SEP, c)
        }
    }

    function mc(a, b, c, d, e) {
        if (!isFinite(a) || t(a)) return "";
        var f = 0 > a;
        a = Math.abs(a);
        var g = a + "",
            h = "",
            i = [],
            j = !1;
        if (-1 !== g.indexOf("e")) {
            var k = g.match(/([\d\.]+)e(-?)(\d+)/);
            k && "-" == k[2] && k[3] > e + 1 ? a = 0 : (h = g, j = !0)
        }
        if (j) e > 0 && 1 > a && (h = a.toFixed(e), a = parseFloat(h));
        else {
            var l = (g.split(ye)[1] || "").length;
            r(e) && (e = Math.min(Math.max(b.minFrac, l), b.maxFrac)), a = +(Math.round(+(a.toString() + "e" + e)).toString() + "e" + -e);
            var m = ("" + a).split(ye),
                n = m[0];
            m = m[1] || "";
            var o, p = 0,
                q = b.lgSize,
                s = b.gSize;
            if (n.length >= q + s)
                for (p = n.length - q, o = 0; p > o; o++)(p - o) % s === 0 && 0 !== o && (h += c), h += n.charAt(o);
            for (o = p; o < n.length; o++)(n.length - o) % q === 0 && 0 !== o && (h += c), h += n.charAt(o);
            for (; m.length < e;) m += "0";
            e && "0" !== e && (h += d + m.substr(0, e))
        }
        return 0 === a && (f = !1), i.push(f ? b.negPre : b.posPre, h, f ? b.negSuf : b.posSuf), i.join("")
    }

    function nc(a, b, c) {
        var d = "";
        for (0 > a && (d = "-", a = -a), a = "" + a; a.length < b;) a = "0" + a;
        return c && (a = a.substr(a.length - b)), d + a
    }

    function oc(a, b, c, d) {
        return c = c || 0,
            function(e) {
                var f = e["get" + a]();
                return (c > 0 || f > -c) && (f += c), 0 === f && -12 == c && (f = 12), nc(f, b, d)
            }
    }

    function pc(a, b) {
        return function(c, d) {
            var e = c["get" + a](),
                f = Yc(b ? "SHORT" + a : a);
            return d[f][e]
        }
    }

    function qc(a) {
        var b = -1 * a.getTimezoneOffset(),
            c = b >= 0 ? "+" : "";
        return c += nc(Math[b > 0 ? "floor" : "ceil"](b / 60), 2) + nc(Math.abs(b % 60), 2)
    }

    function rc(a) {
        var b = new Date(a, 0, 1).getDay();
        return new Date(a, 0, (4 >= b ? 5 : 12) - b)
    }

    function sc(a) {
        return new Date(a.getFullYear(), a.getMonth(), a.getDate() + (4 - a.getDay()))
    }

    function tc(a) {
        return function(b) {
            var c = rc(b.getFullYear()),
                d = sc(b),
                e = +d - +c,
                f = 1 + Math.round(e / 6048e5);
            return nc(f, a)
        }
    }

    function uc(a, b) {
        return a.getHours() < 12 ? b.AMPMS[0] : b.AMPMS[1]
    }

    function vc(a, b) {
        return a.getFullYear() <= 0 ? b.ERAS[0] : b.ERAS[1]
    }

    function wc(a, b) {
        return a.getFullYear() <= 0 ? b.ERANAMES[0] : b.ERANAMES[1]
    }

    function xc(a) {
        function b(a) {
            var b;
            if (b = a.match(c)) {
                var d = new Date(0),
                    e = 0,
                    f = 0,
                    g = b[8] ? d.setUTCFullYear : d.setFullYear,
                    h = b[8] ? d.setUTCHours : d.setHours;
                b[9] && (e = m(b[9] + b[10]), f = m(b[9] + b[11])), g.call(d, m(b[1]), m(b[2]) - 1, m(b[3]));
                var i = m(b[4] || 0) - e,
                    j = m(b[5] || 0) - f,
                    k = m(b[6] || 0),
                    l = Math.round(1e3 * parseFloat("0." + (b[7] || 0)));
                return h.call(d, i, j, k, l), d
            }
            return a
        }
        var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(c, d, e) {
            var g, h, i = "",
                j = [];
            if (d = d || "mediumDate", d = a.DATETIME_FORMATS[d] || d, u(c) && (c = Be.test(c) ? m(c) : b(c)), v(c) && (c = new Date(c)), !w(c)) return c;
            for (; d;) h = Ae.exec(d), h ? (j = N(j, h, 1), d = j.pop()) : (j.push(d), d = null);
            return e && "UTC" === e && (c = new Date(c.getTime()), c.setMinutes(c.getMinutes() + c.getTimezoneOffset())), f(j, function(b) {
                g = ze[b], i += g ? g(c, a.DATETIME_FORMATS) : b.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            }), i
        }
    }

    function yc() {
        return function(a, b) {
            return r(b) && (b = 2), R(a, b)
        }
    }

    function zc() {
        return function(a, b) {
            return v(a) && (a = a.toString()), ld(a) || u(a) ? (b = Math.abs(Number(b)) === 1 / 0 ? Number(b) : m(b), b ? b > 0 ? a.slice(0, b) : a.slice(b) : u(a) ? "" : []) : a
        }
    }

    function Ac(a) {
        return function(b, c, d) {
            function f(a, b) {
                for (var d = 0; d < c.length; d++) {
                    var e = c[d](a, b);
                    if (0 !== e) return e
                }
                return 0
            }

            function g(a, b) {
                return b ? function(b, c) {
                    return a(c, b)
                } : a
            }

            function h(a) {
                switch (typeof a) {
                    case "number":
                    case "boolean":
                    case "string":
                        return !0;
                    default:
                        return !1
                }
            }

            function i(a) {
                return null === a ? "null" : "function" == typeof a.valueOf && (a = a.valueOf(), h(a)) ? a : "function" == typeof a.toString && (a = a.toString(), h(a)) ? a : ""
            }

            function j(a, b) {
                var c = typeof a,
                    d = typeof b;
                return c === d && "object" === c && (a = i(a), b = i(b)), c === d ? ("string" === c && (a = a.toLowerCase(), b = b.toLowerCase()), a === b ? 0 : b > a ? -1 : 1) : d > c ? -1 : 1
            }
            return e(b) ? (c = ld(c) ? c : [c], 0 === c.length && (c = ["+"]), c = c.map(function(b) {
                var c = !1,
                    d = b || p;
                if (u(b)) {
                    if (("+" == b.charAt(0) || "-" == b.charAt(0)) && (c = "-" == b.charAt(0), b = b.substring(1)), "" === b) return g(j, c);
                    if (d = a(b), d.constant) {
                        var e = d();
                        return g(function(a, b) {
                            return j(a[e], b[e])
                        }, c)
                    }
                }
                return g(function(a, b) {
                    return j(d(a), d(b))
                }, c)
            }), dd.call(b).sort(g(f, d))) : b
        }
    }

    function Bc(a) {
        return x(a) && (a = {
            link: a
        }), a.restrict = a.restrict || "AC", q(a)
    }

    function Cc(a, b) {
        a.$name = b
    }

    function Dc(a, b, d, e, g) {
        var h = this,
            i = [],
            j = h.$$parentForm = a.parent().controller("form") || Ge;
        h.$error = {}, h.$$success = {}, h.$pending = c, h.$name = g(b.name || b.ngForm || "")(d), h.$dirty = !1, h.$pristine = !0, h.$valid = !0, h.$invalid = !1, h.$submitted = !1, j.$addControl(h), h.$rollbackViewValue = function() {
            f(i, function(a) {
                a.$rollbackViewValue()
            })
        }, h.$commitViewValue = function() {
            f(i, function(a) {
                a.$commitViewValue()
            })
        }, h.$addControl = function(a) {
            ga(a.$name, "input"), i.push(a), a.$name && (h[a.$name] = a)
        }, h.$$renameControl = function(a, b) {
            var c = a.$name;
            h[c] === a && delete h[c], h[b] = a, a.$name = b
        }, h.$removeControl = function(a) {
            a.$name && h[a.$name] === a && delete h[a.$name], f(h.$pending, function(b, c) {
                h.$setValidity(c, null, a)
            }), f(h.$error, function(b, c) {
                h.$setValidity(c, null, a)
            }), f(h.$$success, function(b, c) {
                h.$setValidity(c, null, a)
            }), J(i, a)
        }, Sc({
            ctrl: this,
            $element: a,
            set: function(a, b, c) {
                var d = a[b];
                if (d) {
                    var e = d.indexOf(c); - 1 === e && d.push(c)
                } else a[b] = [c]
            },
            unset: function(a, b, c) {
                var d = a[b];
                d && (J(d, c), 0 === d.length && delete a[b])
            },
            parentForm: j,
            $animate: e
        }), h.$setDirty = function() {
            e.removeClass(a, pf), e.addClass(a, qf), h.$dirty = !0, h.$pristine = !1, j.$setDirty()
        }, h.$setPristine = function() {
            e.setClass(a, pf, qf + " " + He), h.$dirty = !1, h.$pristine = !0, h.$submitted = !1, f(i, function(a) {
                a.$setPristine()
            })
        }, h.$setUntouched = function() {
            f(i, function(a) {
                a.$setUntouched()
            })
        }, h.$setSubmitted = function() {
            e.addClass(a, He), h.$submitted = !0, j.$setSubmitted()
        }
    }

    function Ec(a) {
        a.$formatters.push(function(b) {
            return a.$isEmpty(b) ? b : b.toString()
        })
    }

    function Fc(a, b, c, d, e, f) {
        Gc(a, b, c, d, e, f), Ec(d)
    }

    function Gc(a, b, c, d, e, f) {
        var g = Wc(b[0].type);
        if (!e.android) {
            var h = !1;
            b.on("compositionstart", function(a) {
                h = !0
            }), b.on("compositionend", function() {
                h = !1, i()
            })
        }
        var i = function(a) {
            if (j && (f.defer.cancel(j), j = null), !h) {
                var e = b.val(),
                    i = a && a.type;
                "password" === g || c.ngTrim && "false" === c.ngTrim || (e = md(e)), (d.$viewValue !== e || "" === e && d.$$hasNativeValidators) && d.$setViewValue(e, i)
            }
        };
        if (e.hasEvent("input")) b.on("input", i);
        else {
            var j, k = function(a, b, c) {
                j || (j = f.defer(function() {
                    j = null, b && b.value === c || i(a)
                }))
            };
            b.on("keydown", function(a) {
                var b = a.keyCode;
                91 === b || b > 15 && 19 > b || b >= 37 && 40 >= b || k(a, this, this.value)
            }), e.hasEvent("paste") && b.on("paste cut", k)
        }
        b.on("change", i), d.$render = function() {
            b.val(d.$isEmpty(d.$viewValue) ? "" : d.$viewValue)
        }
    }

    function Hc(a, b) {
        if (w(a)) return a;
        if (u(a)) {
            Re.lastIndex = 0;
            var c = Re.exec(a);
            if (c) {
                var d = +c[1],
                    e = +c[2],
                    f = 0,
                    g = 0,
                    h = 0,
                    i = 0,
                    j = rc(d),
                    k = 7 * (e - 1);
                return b && (f = b.getHours(), g = b.getMinutes(), h = b.getSeconds(), i = b.getMilliseconds()), new Date(d, 0, j.getDate() + k, f, g, h, i)
            }
        }
        return NaN
    }

    function Ic(a, b) {
        return function(c, d) {
            var e, g;
            if (w(c)) return c;
            if (u(c)) {
                if ('"' == c.charAt(0) && '"' == c.charAt(c.length - 1) && (c = c.substring(1, c.length - 1)), Le.test(c)) return new Date(c);
                if (a.lastIndex = 0, e = a.exec(c)) return e.shift(), g = d ? {
                    yyyy: d.getFullYear(),
                    MM: d.getMonth() + 1,
                    dd: d.getDate(),
                    HH: d.getHours(),
                    mm: d.getMinutes(),
                    ss: d.getSeconds(),
                    sss: d.getMilliseconds() / 1e3
                } : {
                    yyyy: 1970,
                    MM: 1,
                    dd: 1,
                    HH: 0,
                    mm: 0,
                    ss: 0,
                    sss: 0
                }, f(e, function(a, c) {
                    c < b.length && (g[b[c]] = +a)
                }), new Date(g.yyyy, g.MM - 1, g.dd, g.HH, g.mm, g.ss || 0, 1e3 * g.sss || 0)
            }
            return NaN
        }
    }

    function Jc(a, b, d, e) {
        return function(f, g, h, i, j, k, l) {
            function m(a) {
                return a && !(a.getTime && a.getTime() !== a.getTime())
            }

            function n(a) {
                return s(a) ? w(a) ? a : d(a) : c
            }
            Kc(f, g, h, i), Gc(f, g, h, i, j, k);
            var o, p = i && i.$options && i.$options.timezone;
            if (i.$$parserName = a, i.$parsers.push(function(a) {
                    if (i.$isEmpty(a)) return null;
                    if (b.test(a)) {
                        var e = d(a, o);
                        return "UTC" === p && e.setMinutes(e.getMinutes() - e.getTimezoneOffset()), e
                    }
                    return c
                }), i.$formatters.push(function(a) {
                    if (a && !w(a)) throw uf("datefmt", "Expected `{0}` to be a date", a);
                    if (m(a)) {
                        if (o = a, o && "UTC" === p) {
                            var b = 6e4 * o.getTimezoneOffset();
                            o = new Date(o.getTime() + b)
                        }
                        return l("date")(a, e, p)
                    }
                    return o = null, ""
                }), s(h.min) || h.ngMin) {
                var q;
                i.$validators.min = function(a) {
                    return !m(a) || r(q) || d(a) >= q
                }, h.$observe("min", function(a) {
                    q = n(a), i.$validate()
                })
            }
            if (s(h.max) || h.ngMax) {
                var t;
                i.$validators.max = function(a) {
                    return !m(a) || r(t) || d(a) <= t
                }, h.$observe("max", function(a) {
                    t = n(a), i.$validate()
                })
            }
        }
    }

    function Kc(a, b, d, e) {
        var f = b[0],
            g = e.$$hasNativeValidators = t(f.validity);
        g && e.$parsers.push(function(a) {
            var d = b.prop(Vc) || {};
            return d.badInput && !d.typeMismatch ? c : a
        })
    }

    function Lc(a, b, d, e, f, g) {
        if (Kc(a, b, d, e), Gc(a, b, d, e, f, g), e.$$parserName = "number", e.$parsers.push(function(a) {
                return e.$isEmpty(a) ? null : Oe.test(a) ? parseFloat(a) : c;
            }), e.$formatters.push(function(a) {
                if (!e.$isEmpty(a)) {
                    if (!v(a)) throw uf("numfmt", "Expected `{0}` to be a number", a);
                    a = a.toString()
                }
                return a
            }), s(d.min) || d.ngMin) {
            var h;
            e.$validators.min = function(a) {
                return e.$isEmpty(a) || r(h) || a >= h
            }, d.$observe("min", function(a) {
                s(a) && !v(a) && (a = parseFloat(a, 10)), h = v(a) && !isNaN(a) ? a : c, e.$validate()
            })
        }
        if (s(d.max) || d.ngMax) {
            var i;
            e.$validators.max = function(a) {
                return e.$isEmpty(a) || r(i) || i >= a
            }, d.$observe("max", function(a) {
                s(a) && !v(a) && (a = parseFloat(a, 10)), i = v(a) && !isNaN(a) ? a : c, e.$validate()
            })
        }
    }

    function Mc(a, b, c, d, e, f) {
        Gc(a, b, c, d, e, f), Ec(d), d.$$parserName = "url", d.$validators.url = function(a, b) {
            var c = a || b;
            return d.$isEmpty(c) || Me.test(c)
        }
    }

    function Nc(a, b, c, d, e, f) {
        Gc(a, b, c, d, e, f), Ec(d), d.$$parserName = "email", d.$validators.email = function(a, b) {
            var c = a || b;
            return d.$isEmpty(c) || Ne.test(c)
        }
    }

    function Oc(a, b, c, d) {
        r(c.name) && b.attr("name", j());
        var e = function(a) {
            b[0].checked && d.$setViewValue(c.value, a && a.type)
        };
        b.on("click", e), d.$render = function() {
            var a = c.value;
            b[0].checked = a == d.$viewValue
        }, c.$observe("value", d.$render)
    }

    function Pc(a, b, c, e, f) {
        var g;
        if (s(e)) {
            if (g = a(e), !g.constant) throw d("ngModel")("constexpr", "Expected constant expression for `{0}`, but saw `{1}`.", c, e);
            return g(b)
        }
        return f
    }

    function Qc(a, b, c, d, e, f, g, h) {
        var i = Pc(h, a, "ngTrueValue", c.ngTrueValue, !0),
            j = Pc(h, a, "ngFalseValue", c.ngFalseValue, !1),
            k = function(a) {
                d.$setViewValue(b[0].checked, a && a.type)
            };
        b.on("click", k), d.$render = function() {
            b[0].checked = d.$viewValue
        }, d.$isEmpty = function(a) {
            return a === !1
        }, d.$formatters.push(function(a) {
            return M(a, i)
        }), d.$parsers.push(function(a) {
            return a ? i : j
        })
    }

    function Rc(a, b) {
        return a = "ngClass" + a, ["$animate", function(c) {
            function d(a, b) {
                var c = [];
                a: for (var d = 0; d < a.length; d++) {
                    for (var e = a[d], f = 0; f < b.length; f++)
                        if (e == b[f]) continue a;
                    c.push(e)
                }
                return c
            }

            function e(a) {
                if (ld(a)) return a;
                if (u(a)) return a.split(" ");
                if (t(a)) {
                    var b = [];
                    return f(a, function(a, c) {
                        a && (b = b.concat(c.split(" ")))
                    }), b
                }
                return a
            }
            return {
                restrict: "AC",
                link: function(g, h, i) {
                    function j(a) {
                        var b = l(a, 1);
                        i.$addClass(b)
                    }

                    function k(a) {
                        var b = l(a, -1);
                        i.$removeClass(b)
                    }

                    function l(a, b) {
                        var c = h.data("$classCounts") || {},
                            d = [];
                        return f(a, function(a) {
                            (b > 0 || c[a]) && (c[a] = (c[a] || 0) + b, c[a] === +(b > 0) && d.push(a))
                        }), h.data("$classCounts", c), d.join(" ")
                    }

                    function m(a, b) {
                        var e = d(b, a),
                            f = d(a, b);
                        e = l(e, 1), f = l(f, -1), e && e.length && c.addClass(h, e), f && f.length && c.removeClass(h, f)
                    }

                    function n(a) {
                        if (b === !0 || g.$index % 2 === b) {
                            var c = e(a || []);
                            if (o) {
                                if (!M(a, o)) {
                                    var d = e(o);
                                    m(d, c)
                                }
                            } else j(c)
                        }
                        o = L(a)
                    }
                    var o;
                    g.$watch(i[a], n, !0), i.$observe("class", function(b) {
                        n(g.$eval(i[a]))
                    }), "ngClass" !== a && g.$watch("$index", function(c, d) {
                        var f = 1 & c;
                        if (f !== (1 & d)) {
                            var h = e(g.$eval(i[a]));
                            f === b ? j(h) : k(h)
                        }
                    })
                }
            }
        }]
    }

    function Sc(a) {
        function b(a, b, i) {
            b === c ? d("$pending", a, i) : e("$pending", a, i), E(b) ? b ? (l(h.$error, a, i), k(h.$$success, a, i)) : (k(h.$error, a, i), l(h.$$success, a, i)) : (l(h.$error, a, i), l(h.$$success, a, i)), h.$pending ? (f(tf, !0), h.$valid = h.$invalid = c, g("", null)) : (f(tf, !1), h.$valid = Tc(h.$error), h.$invalid = !h.$valid, g("", h.$valid));
            var j;
            j = h.$pending && h.$pending[a] ? c : h.$error[a] ? !1 : h.$$success[a] ? !0 : null, g(a, j), m.$setValidity(a, j, h)
        }

        function d(a, b, c) {
            h[a] || (h[a] = {}), k(h[a], b, c)
        }

        function e(a, b, d) {
            h[a] && l(h[a], b, d), Tc(h[a]) && (h[a] = c)
        }

        function f(a, b) {
            b && !j[a] ? (n.addClass(i, a), j[a] = !0) : !b && j[a] && (n.removeClass(i, a), j[a] = !1)
        }

        function g(a, b) {
            a = a ? "-" + ca(a, "-") : "", f(nf + a, b === !0), f( of +a, b === !1)
        }
        var h = a.ctrl,
            i = a.$element,
            j = {},
            k = a.set,
            l = a.unset,
            m = a.parentForm,
            n = a.$animate;
        j[ of ] = !(j[nf] = i.hasClass(nf)), h.$setValidity = b
    }

    function Tc(a) {
        if (a)
            for (var b in a) return !1;
        return !0
    }
    var Uc = /^\/(.+)\/([a-z]*)$/,
        Vc = "validity",
        Wc = function(a) {
            return u(a) ? a.toLowerCase() : a
        },
        Xc = Object.prototype.hasOwnProperty,
        Yc = function(a) {
            return u(a) ? a.toUpperCase() : a
        },
        Zc = function(a) {
            return u(a) ? a.replace(/[A-Z]/g, function(a) {
                return String.fromCharCode(32 | a.charCodeAt(0))
            }) : a
        },
        $c = function(a) {
            return u(a) ? a.replace(/[a-z]/g, function(a) {
                return String.fromCharCode(-33 & a.charCodeAt(0))
            }) : a
        };
    "i" !== "I".toLowerCase() && (Wc = Zc, Yc = $c);
    var _c, ad, bd, cd, dd = [].slice,
        ed = [].splice,
        fd = [].push,
        gd = Object.prototype.toString,
        hd = d("ng"),
        id = a.angular || (a.angular = {}),
        jd = 0;
    _c = b.documentMode, o.$inject = [], p.$inject = [];
    var kd, ld = Array.isArray,
        md = function(a) {
            return u(a) ? a.trim() : a
        },
        nd = function(a) {
            return a.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
        },
        od = function() {
            if (s(od.isActive_)) return od.isActive_;
            var a = !(!b.querySelector("[ng-csp]") && !b.querySelector("[data-ng-csp]"));
            if (!a) try {
                new Function("")
            } catch (c) {
                a = !0
            }
            return od.isActive_ = a
        },
        pd = ["ng-", "data-ng-", "ng:", "x-ng-"],
        qd = /[A-Z]/g,
        rd = !1,
        sd = 1,
        td = 2,
        ud = 3,
        vd = 8,
        wd = 9,
        xd = 11,
        yd = {
            full: "1.3.17",
            major: 1,
            minor: 3,
            dot: 17,
            codeName: "tsktskskly-euouae"
        };
    ua.expando = "ng339";
    var zd = ua.cache = {},
        Ad = 1,
        Bd = function(a, b, c) {
            a.addEventListener(b, c, !1)
        },
        Cd = function(a, b, c) {
            a.removeEventListener(b, c, !1)
        };
    ua._data = function(a) {
        return this.cache[a[this.expando]] || {}
    };
    var Dd = /([\:\-\_]+(.))/g,
        Ed = /^moz([A-Z])/,
        Fd = {
            mouseleave: "mouseout",
            mouseenter: "mouseover"
        },
        Gd = d("jqLite"),
        Hd = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        Id = /<|&#?\w+;/,
        Jd = /<([\w:]+)/,
        Kd = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Ld = {
            option: [1, '<select multiple="multiple">', "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    Ld.optgroup = Ld.option, Ld.tbody = Ld.tfoot = Ld.colgroup = Ld.caption = Ld.thead, Ld.th = Ld.td;
    var Md = ua.prototype = {
            ready: function(c) {
                function d() {
                    e || (e = !0, c())
                }
                var e = !1;
                "complete" === b.readyState ? setTimeout(d) : (this.on("DOMContentLoaded", d), ua(a).on("load", d))
            },
            toString: function() {
                var a = [];
                return f(this, function(b) {
                    a.push("" + b)
                }), "[" + a.join(", ") + "]"
            },
            eq: function(a) {
                return ad(a >= 0 ? this[a] : this[this.length + a])
            },
            length: 0,
            push: fd,
            sort: [].sort,
            splice: [].splice
        },
        Nd = {};
    f("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(a) {
        Nd[Wc(a)] = a
    });
    var Od = {};
    f("input,select,option,textarea,button,form,details".split(","), function(a) {
        Od[a] = !0
    });
    var Pd = {
        ngMinlength: "minlength",
        ngMaxlength: "maxlength",
        ngMin: "min",
        ngMax: "max",
        ngPattern: "pattern"
    };
    f({
        data: Aa,
        removeData: ya
    }, function(a, b) {
        ua[b] = a
    }), f({
        data: Aa,
        inheritedData: Ga,
        scope: function(a) {
            return ad.data(a, "$scope") || Ga(a.parentNode || a, ["$isolateScope", "$scope"])
        },
        isolateScope: function(a) {
            return ad.data(a, "$isolateScope") || ad.data(a, "$isolateScopeNoTemplate")
        },
        controller: Fa,
        injector: function(a) {
            return Ga(a, "$injector")
        },
        removeAttr: function(a, b) {
            a.removeAttribute(b)
        },
        hasClass: Ba,
        css: function(a, b, c) {
            return b = pa(b), s(c) ? void(a.style[b] = c) : a.style[b]
        },
        attr: function(a, b, d) {
            var e = a.nodeType;
            if (e !== ud && e !== td && e !== vd) {
                var f = Wc(b);
                if (Nd[f]) {
                    if (!s(d)) return a[b] || (a.attributes.getNamedItem(b) || o).specified ? f : c;
                    d ? (a[b] = !0, a.setAttribute(b, f)) : (a[b] = !1, a.removeAttribute(f))
                } else if (s(d)) a.setAttribute(b, d);
                else if (a.getAttribute) {
                    var g = a.getAttribute(b, 2);
                    return null === g ? c : g
                }
            }
        },
        prop: function(a, b, c) {
            return s(c) ? void(a[b] = c) : a[b]
        },
        text: function() {
            function a(a, b) {
                if (r(b)) {
                    var c = a.nodeType;
                    return c === sd || c === ud ? a.textContent : ""
                }
                a.textContent = b
            }
            return a.$dv = "", a
        }(),
        val: function(a, b) {
            if (r(b)) {
                if (a.multiple && "select" === I(a)) {
                    var c = [];
                    return f(a.options, function(a) {
                        a.selected && c.push(a.value || a.text)
                    }), 0 === c.length ? null : c
                }
                return a.value
            }
            a.value = b
        },
        html: function(a, b) {
            return r(b) ? a.innerHTML : (wa(a, !0), void(a.innerHTML = b))
        },
        empty: Ha
    }, function(a, b) {
        ua.prototype[b] = function(b, d) {
            var e, f, g = this.length;
            if (a !== Ha && (2 == a.length && a !== Ba && a !== Fa ? b : d) === c) {
                if (t(b)) {
                    for (e = 0; g > e; e++)
                        if (a === Aa) a(this[e], b);
                        else
                            for (f in b) a(this[e], f, b[f]);
                    return this
                }
                for (var h = a.$dv, i = h === c ? Math.min(g, 1) : g, j = 0; i > j; j++) {
                    var k = a(this[j], b, d);
                    h = h ? h + k : k
                }
                return h
            }
            for (e = 0; g > e; e++) a(this[e], b, d);
            return this
        }
    }), f({
        removeData: ya,
        on: function Vf(a, b, c, d) {
            if (s(d)) throw Gd("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            if (ra(a)) {
                var e = za(a, !0),
                    f = e.events,
                    g = e.handle;
                g || (g = e.handle = Ma(a, f));
                for (var h = b.indexOf(" ") >= 0 ? b.split(" ") : [b], i = h.length; i--;) {
                    b = h[i];
                    var j = f[b];
                    j || (f[b] = [], "mouseenter" === b || "mouseleave" === b ? Vf(a, Fd[b], function(a) {
                        var c = this,
                            d = a.relatedTarget;
                        (!d || d !== c && !c.contains(d)) && g(a, b)
                    }) : "$destroy" !== b && Bd(a, b, g), j = f[b]), j.push(c)
                }
            }
        },
        off: xa,
        one: function(a, b, c) {
            a = ad(a), a.on(b, function d() {
                a.off(b, c), a.off(b, d)
            }), a.on(b, c)
        },
        replaceWith: function(a, b) {
            var c, d = a.parentNode;
            wa(a), f(new ua(b), function(b) {
                c ? d.insertBefore(b, c.nextSibling) : d.replaceChild(b, a), c = b
            })
        },
        children: function(a) {
            var b = [];
            return f(a.childNodes, function(a) {
                a.nodeType === sd && b.push(a)
            }), b
        },
        contents: function(a) {
            return a.contentDocument || a.childNodes || []
        },
        append: function(a, b) {
            var c = a.nodeType;
            if (c === sd || c === xd) {
                b = new ua(b);
                for (var d = 0, e = b.length; e > d; d++) {
                    var f = b[d];
                    a.appendChild(f)
                }
            }
        },
        prepend: function(a, b) {
            if (a.nodeType === sd) {
                var c = a.firstChild;
                f(new ua(b), function(b) {
                    a.insertBefore(b, c)
                })
            }
        },
        wrap: function(a, b) {
            b = ad(b).eq(0).clone()[0];
            var c = a.parentNode;
            c && c.replaceChild(b, a), b.appendChild(a)
        },
        remove: Ia,
        detach: function(a) {
            Ia(a, !0)
        },
        after: function(a, b) {
            var c = a,
                d = a.parentNode;
            b = new ua(b);
            for (var e = 0, f = b.length; f > e; e++) {
                var g = b[e];
                d.insertBefore(g, c.nextSibling), c = g
            }
        },
        addClass: Da,
        removeClass: Ca,
        toggleClass: function(a, b, c) {
            b && f(b.split(" "), function(b) {
                var d = c;
                r(d) && (d = !Ba(a, b)), (d ? Da : Ca)(a, b)
            })
        },
        parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== xd ? b : null
        },
        next: function(a) {
            return a.nextElementSibling
        },
        find: function(a, b) {
            return a.getElementsByTagName ? a.getElementsByTagName(b) : []
        },
        clone: va,
        triggerHandler: function(a, b, c) {
            var d, e, g, h = b.type || b,
                i = za(a),
                j = i && i.events,
                k = j && j[h];
            k && (d = {
                preventDefault: function() {
                    this.defaultPrevented = !0
                },
                isDefaultPrevented: function() {
                    return this.defaultPrevented === !0
                },
                stopImmediatePropagation: function() {
                    this.immediatePropagationStopped = !0
                },
                isImmediatePropagationStopped: function() {
                    return this.immediatePropagationStopped === !0
                },
                stopPropagation: o,
                type: h,
                target: a
            }, b.type && (d = l(d, b)), e = L(k), g = c ? [d].concat(c) : [d], f(e, function(b) {
                d.isImmediatePropagationStopped() || b.apply(a, g)
            }))
        }
    }, function(a, b) {
        ua.prototype[b] = function(b, c, d) {
            for (var e, f = 0, g = this.length; g > f; f++) r(e) ? (e = a(this[f], b, c, d), s(e) && (e = ad(e))) : Ea(e, a(this[f], b, c, d));
            return s(e) ? e : this
        }, ua.prototype.bind = ua.prototype.on, ua.prototype.unbind = ua.prototype.off
    }), Pa.prototype = {
        put: function(a, b) {
            this[Oa(a, this.nextUid)] = b
        },
        get: function(a) {
            return this[Oa(a, this.nextUid)]
        },
        remove: function(a) {
            var b = this[a = Oa(a, this.nextUid)];
            return delete this[a], b
        }
    };
    var Qd = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        Rd = /,/,
        Sd = /^\s*(_?)(\S+?)\1\s*$/,
        Td = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
        Ud = d("$injector");
    Sa.$$annotate = Ra;
    var Vd = d("$animate"),
        Wd = ["$provide", function(a) {
            this.$$selectors = {}, this.register = function(b, c) {
                var d = b + "-animation";
                if (b && "." != b.charAt(0)) throw Vd("notcsel", "Expecting class selector starting with '.' got '{0}'.", b);
                this.$$selectors[b.substr(1)] = d, a.factory(d, c)
            }, this.classNameFilter = function(a) {
                return 1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null), this.$$classNameFilter
            }, this.$get = ["$$q", "$$asyncCallback", "$rootScope", function(a, b, c) {
                function d(b) {
                    var d, e = a.defer();
                    return e.promise.$$cancelFn = function() {
                        d && d()
                    }, c.$$postDigest(function() {
                        d = b(function() {
                            e.resolve()
                        })
                    }), e.promise
                }

                function e(a, b) {
                    var c = [],
                        d = [],
                        e = ja();
                    return f((a.attr("class") || "").split(/\s+/), function(a) {
                        e[a] = !0
                    }), f(b, function(a, b) {
                        var f = e[b];
                        a === !1 && f ? d.push(b) : a !== !0 || f || c.push(b)
                    }), c.length + d.length > 0 && [c.length ? c : null, d.length ? d : null]
                }

                function g(a, b, c) {
                    for (var d = 0, e = b.length; e > d; ++d) {
                        var f = b[d];
                        a[f] = c
                    }
                }

                function h() {
                    return j || (j = a.defer(), b(function() {
                        j.resolve(), j = null
                    })), j.promise
                }

                function i(a, b) {
                    if (id.isObject(b)) {
                        var c = l(b.from || {}, b.to || {});
                        a.css(c)
                    }
                }
                var j;
                return {
                    animate: function(a, b, c) {
                        return i(a, {
                            from: b,
                            to: c
                        }), h()
                    },
                    enter: function(a, b, c, d) {
                        return i(a, d), c ? c.after(a) : b.prepend(a), h()
                    },
                    leave: function(a, b) {
                        return i(a, b), a.remove(), h()
                    },
                    move: function(a, b, c, d) {
                        return this.enter(a, b, c, d)
                    },
                    addClass: function(a, b, c) {
                        return this.setClass(a, b, [], c)
                    },
                    $$addClassImmediately: function(a, b, c) {
                        return a = ad(a), b = u(b) ? b : ld(b) ? b.join(" ") : "", f(a, function(a) {
                            Da(a, b)
                        }), i(a, c), h()
                    },
                    removeClass: function(a, b, c) {
                        return this.setClass(a, [], b, c)
                    },
                    $$removeClassImmediately: function(a, b, c) {
                        return a = ad(a), b = u(b) ? b : ld(b) ? b.join(" ") : "", f(a, function(a) {
                            Ca(a, b)
                        }), i(a, c), h()
                    },
                    setClass: function(a, b, c, f) {
                        var h = this,
                            i = "$$animateClasses",
                            j = !1;
                        a = ad(a);
                        var k = a.data(i);
                        k ? f && k.options && (k.options = id.extend(k.options || {}, f)) : (k = {
                            classes: {},
                            options: f
                        }, j = !0);
                        var l = k.classes;
                        return b = ld(b) ? b : b.split(" "), c = ld(c) ? c : c.split(" "), g(l, b, !0), g(l, c, !1), j && (k.promise = d(function(b) {
                            var c = a.data(i);
                            if (a.removeData(i), c) {
                                var d = e(a, c.classes);
                                d && h.$$setClassImmediately(a, d[0], d[1], c.options)
                            }
                            b()
                        }), a.data(i, k)), k.promise
                    },
                    $$setClassImmediately: function(a, b, c, d) {
                        return b && this.$$addClassImmediately(a, b), c && this.$$removeClassImmediately(a, c), i(a, d), h()
                    },
                    enabled: o,
                    cancel: o
                }
            }]
        }],
        Xd = d("$compile");
    Za.$inject = ["$provide", "$$sanitizeUriProvider"];
    var Yd = /^((?:x|data)[\:\-_])/i,
        Zd = d("$controller"),
        $d = "application/json",
        _d = {
            "Content-Type": $d + ";charset=utf-8"
        },
        ae = /^\[|^\{(?!\{)/,
        be = {
            "[": /]$/,
            "{": /}$/
        },
        ce = /^\)\]\}',?\n/,
        de = d("$interpolate"),
        ee = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
        fe = {
            http: 80,
            https: 443,
            ftp: 21
        },
        ge = d("$location"),
        he = {
            $$html5: !1,
            $$replace: !1,
            absUrl: Cb("$$absUrl"),
            url: function(a) {
                if (r(a)) return this.$$url;
                var b = ee.exec(a);
                return (b[1] || "" === a) && this.path(decodeURIComponent(b[1])), (b[2] || b[1] || "" === a) && this.search(b[3] || ""), this.hash(b[5] || ""), this
            },
            protocol: Cb("$$protocol"),
            host: Cb("$$host"),
            port: Cb("$$port"),
            path: Db("$$path", function(a) {
                return a = null !== a ? a.toString() : "", "/" == a.charAt(0) ? a : "/" + a
            }),
            search: function(a, b) {
                switch (arguments.length) {
                    case 0:
                        return this.$$search;
                    case 1:
                        if (u(a) || v(a)) a = a.toString(), this.$$search = V(a);
                        else {
                            if (!t(a)) throw ge("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                            a = K(a, {}), f(a, function(b, c) {
                                null == b && delete a[c]
                            }), this.$$search = a
                        }
                        break;
                    default:
                        r(b) || null === b ? delete this.$$search[a] : this.$$search[a] = b
                }
                return this.$$compose(), this
            },
            hash: Db("$$hash", function(a) {
                return null !== a ? a.toString() : ""
            }),
            replace: function() {
                return this.$$replace = !0, this
            }
        };
    f([Bb, Ab, zb], function(a) {
        a.prototype = Object.create(he), a.prototype.state = function(b) {
            if (!arguments.length) return this.$$state;
            if (a !== zb || !this.$$html5) throw ge("nostate", "History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");
            return this.$$state = r(b) ? null : b, this
        }
    });
    var ie = d("$parse"),
        je = Function.prototype.call,
        ke = Function.prototype.apply,
        le = Function.prototype.bind,
        me = ja();
    f({
        "null": function() {
            return null
        },
        "true": function() {
            return !0
        },
        "false": function() {
            return !1
        },
        undefined: function() {}
    }, function(a, b) {
        a.constant = a.literal = a.sharedGetter = !0, me[b] = a
    }), me["this"] = function(a) {
        return a
    }, me["this"].sharedGetter = !0;
    var ne = l(ja(), {
            "+": function(a, b, d, e) {
                return d = d(a, b), e = e(a, b), s(d) ? s(e) ? d + e : d : s(e) ? e : c
            },
            "-": function(a, b, c, d) {
                return c = c(a, b), d = d(a, b), (s(c) ? c : 0) - (s(d) ? d : 0)
            },
            "*": function(a, b, c, d) {
                return c(a, b) * d(a, b)
            },
            "/": function(a, b, c, d) {
                return c(a, b) / d(a, b)
            },
            "%": function(a, b, c, d) {
                return c(a, b) % d(a, b)
            },
            "===": function(a, b, c, d) {
                return c(a, b) === d(a, b)
            },
            "!==": function(a, b, c, d) {
                return c(a, b) !== d(a, b)
            },
            "==": function(a, b, c, d) {
                return c(a, b) == d(a, b)
            },
            "!=": function(a, b, c, d) {
                return c(a, b) != d(a, b)
            },
            "<": function(a, b, c, d) {
                return c(a, b) < d(a, b)
            },
            ">": function(a, b, c, d) {
                return c(a, b) > d(a, b)
            },
            "<=": function(a, b, c, d) {
                return c(a, b) <= d(a, b)
            },
            ">=": function(a, b, c, d) {
                return c(a, b) >= d(a, b)
            },
            "&&": function(a, b, c, d) {
                return c(a, b) && d(a, b)
            },
            "||": function(a, b, c, d) {
                return c(a, b) || d(a, b)
            },
            "!": function(a, b, c) {
                return !c(a, b)
            },
            "=": !0,
            "|": !0
        }),
        oe = {
            n: "\n",
            f: "\f",
            r: "\r",
            t: "	",
            v: "",
            "'": "'",
            '"': '"'
        },
        pe = function(a) {
            this.options = a
        };
    pe.prototype = {
        constructor: pe,
        lex: function(a) {
            for (this.text = a, this.index = 0, this.tokens = []; this.index < this.text.length;) {
                var b = this.text.charAt(this.index);
                if ('"' === b || "'" === b) this.readString(b);
                else if (this.isNumber(b) || "." === b && this.isNumber(this.peek())) this.readNumber();
                else if (this.isIdent(b)) this.readIdent();
                else if (this.is(b, "(){}[].,;:?")) this.tokens.push({
                    index: this.index,
                    text: b
                }), this.index++;
                else if (this.isWhitespace(b)) this.index++;
                else {
                    var c = b + this.peek(),
                        d = c + this.peek(2),
                        e = ne[b],
                        f = ne[c],
                        g = ne[d];
                    if (e || f || g) {
                        var h = g ? d : f ? c : b;
                        this.tokens.push({
                            index: this.index,
                            text: h,
                            operator: !0
                        }), this.index += h.length
                    } else this.throwError("Unexpected next character ", this.index, this.index + 1)
                }
            }
            return this.tokens
        },
        is: function(a, b) {
            return -1 !== b.indexOf(a)
        },
        peek: function(a) {
            var b = a || 1;
            return this.index + b < this.text.length ? this.text.charAt(this.index + b) : !1
        },
        isNumber: function(a) {
            return a >= "0" && "9" >= a && "string" == typeof a
        },
        isWhitespace: function(a) {
            return " " === a || "\r" === a || "	" === a || "\n" === a || "" === a || " " === a
        },
        isIdent: function(a) {
            return a >= "a" && "z" >= a || a >= "A" && "Z" >= a || "_" === a || "$" === a
        },
        isExpOperator: function(a) {
            return "-" === a || "+" === a || this.isNumber(a)
        },
        throwError: function(a, b, c) {
            c = c || this.index;
            var d = s(b) ? "s " + b + "-" + this.index + " [" + this.text.substring(b, c) + "]" : " " + c;
            throw ie("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", a, d, this.text)
        },
        readNumber: function() {
            for (var a = "", b = this.index; this.index < this.text.length;) {
                var c = Wc(this.text.charAt(this.index));
                if ("." == c || this.isNumber(c)) a += c;
                else {
                    var d = this.peek();
                    if ("e" == c && this.isExpOperator(d)) a += c;
                    else if (this.isExpOperator(c) && d && this.isNumber(d) && "e" == a.charAt(a.length - 1)) a += c;
                    else {
                        if (!this.isExpOperator(c) || d && this.isNumber(d) || "e" != a.charAt(a.length - 1)) break;
                        this.throwError("Invalid exponent")
                    }
                }
                this.index++
            }
            this.tokens.push({
                index: b,
                text: a,
                constant: !0,
                value: Number(a)
            })
        },
        readIdent: function() {
            for (var a = this.index; this.index < this.text.length;) {
                var b = this.text.charAt(this.index);
                if (!this.isIdent(b) && !this.isNumber(b)) break;
                this.index++
            }
            this.tokens.push({
                index: a,
                text: this.text.slice(a, this.index),
                identifier: !0
            })
        },
        readString: function(a) {
            var b = this.index;
            this.index++;
            for (var c = "", d = a, e = !1; this.index < this.text.length;) {
                var f = this.text.charAt(this.index);
                if (d += f, e) {
                    if ("u" === f) {
                        var g = this.text.substring(this.index + 1, this.index + 5);
                        g.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + g + "]"), this.index += 4, c += String.fromCharCode(parseInt(g, 16))
                    } else {
                        var h = oe[f];
                        c += h || f
                    }
                    e = !1
                } else if ("\\" === f) e = !0;
                else {
                    if (f === a) return this.index++, void this.tokens.push({
                        index: b,
                        text: d,
                        constant: !0,
                        value: c
                    });
                    c += f
                }
                this.index++
            }
            this.throwError("Unterminated quote", b)
        }
    };
    var qe = function(a, b, c) {
        this.lexer = a, this.$filter = b, this.options = c
    };
    qe.ZERO = l(function() {
        return 0
    }, {
        sharedGetter: !0,
        constant: !0
    }), qe.prototype = {
        constructor: qe,
        parse: function(a) {
            this.text = a, this.tokens = this.lexer.lex(a);
            var b = this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), b.literal = !!b.literal, b.constant = !!b.constant, b
        },
        primary: function() {
            var a;
            this.expect("(") ? (a = this.filterChain(), this.consume(")")) : this.expect("[") ? a = this.arrayDeclaration() : this.expect("{") ? a = this.object() : this.peek().identifier && this.peek().text in me ? a = me[this.consume().text] : this.peek().identifier ? a = this.identifier() : this.peek().constant ? a = this.constant() : this.throwError("not a primary expression", this.peek());
            for (var b, c; b = this.expect("(", "[", ".");) "(" === b.text ? (a = this.functionCall(a, c), c = null) : "[" === b.text ? (c = a, a = this.objectIndex(a)) : "." === b.text ? (c = a, a = this.fieldAccess(a)) : this.throwError("IMPOSSIBLE");
            return a
        },
        throwError: function(a, b) {
            throw ie("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", b.text, a, b.index + 1, this.text, this.text.substring(b.index))
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw ie("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0]
        },
        peek: function(a, b, c, d) {
            return this.peekAhead(0, a, b, c, d)
        },
        peekAhead: function(a, b, c, d, e) {
            if (this.tokens.length > a) {
                var f = this.tokens[a],
                    g = f.text;
                if (g === b || g === c || g === d || g === e || !b && !c && !d && !e) return f
            }
            return !1
        },
        expect: function(a, b, c, d) {
            var e = this.peek(a, b, c, d);
            return e ? (this.tokens.shift(), e) : !1
        },
        consume: function(a) {
            if (0 === this.tokens.length) throw ie("ueoe", "Unexpected end of expression: {0}", this.text);
            var b = this.expect(a);
            return b || this.throwError("is unexpected, expecting [" + a + "]", this.peek()), b
        },
        unaryFn: function(a, b) {
            var c = ne[a];
            return l(function(a, d) {
                return c(a, d, b)
            }, {
                constant: b.constant,
                inputs: [b]
            })
        },
        binaryFn: function(a, b, c, d) {
            var e = ne[b];
            return l(function(b, d) {
                return e(b, d, a, c)
            }, {
                constant: a.constant && c.constant,
                inputs: !d && [a, c]
            })
        },
        identifier: function() {
            for (var a = this.consume().text; this.peek(".") && this.peekAhead(1).identifier && !this.peekAhead(2, "(");) a += this.consume().text + this.consume().text;
            return Ob(a, this.options, this.text)
        },
        constant: function() {
            var a = this.consume().value;
            return l(function() {
                return a
            }, {
                constant: !0,
                literal: !0
            })
        },
        statements: function() {
            for (var a = [];;)
                if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && a.push(this.filterChain()), !this.expect(";")) return 1 === a.length ? a[0] : function(b, c) {
                    for (var d, e = 0, f = a.length; f > e; e++) d = a[e](b, c);
                    return d
                }
        },
        filterChain: function() {
            for (var a, b = this.expression(); a = this.expect("|");) b = this.filter(b);
            return b
        },
        filter: function(a) {
            var b, d, e = this.$filter(this.consume().text);
            if (this.peek(":"))
                for (b = [], d = []; this.expect(":");) b.push(this.expression());
            var f = [a].concat(b || []);
            return l(function(f, g) {
                var h = a(f, g);
                if (d) {
                    d[0] = h;
                    for (var i = b.length; i--;) d[i + 1] = b[i](f, g);
                    return e.apply(c, d)
                }
                return e(h)
            }, {
                constant: !e.$stateful && f.every(Jb),
                inputs: !e.$stateful && f
            })
        },
        expression: function() {
            return this.assignment()
        },
        assignment: function() {
            var a, b, c = this.ternary();
            return (b = this.expect("=")) ? (c.assign || this.throwError("implies assignment but [" + this.text.substring(0, b.index) + "] can not be assigned to", b), a = this.ternary(), l(function(b, d) {
                return c.assign(b, a(b, d), d)
            }, {
                inputs: [c, a]
            })) : c
        },
        ternary: function() {
            var a, b, c = this.logicalOR();
            if ((b = this.expect("?")) && (a = this.assignment(), this.consume(":"))) {
                var d = this.assignment();
                return l(function(b, e) {
                    return c(b, e) ? a(b, e) : d(b, e)
                }, {
                    constant: c.constant && a.constant && d.constant
                })
            }
            return c
        },
        logicalOR: function() {
            for (var a, b = this.logicalAND(); a = this.expect("||");) b = this.binaryFn(b, a.text, this.logicalAND(), !0);
            return b
        },
        logicalAND: function() {
            for (var a, b = this.equality(); a = this.expect("&&");) b = this.binaryFn(b, a.text, this.equality(), !0);
            return b
        },
        equality: function() {
            for (var a, b = this.relational(); a = this.expect("==", "!=", "===", "!==");) b = this.binaryFn(b, a.text, this.relational());
            return b
        },
        relational: function() {
            for (var a, b = this.additive(); a = this.expect("<", ">", "<=", ">=");) b = this.binaryFn(b, a.text, this.additive());
            return b
        },
        additive: function() {
            for (var a, b = this.multiplicative(); a = this.expect("+", "-");) b = this.binaryFn(b, a.text, this.multiplicative());
            return b
        },
        multiplicative: function() {
            for (var a, b = this.unary(); a = this.expect("*", "/", "%");) b = this.binaryFn(b, a.text, this.unary());
            return b
        },
        unary: function() {
            var a;
            return this.expect("+") ? this.primary() : (a = this.expect("-")) ? this.binaryFn(qe.ZERO, a.text, this.unary()) : (a = this.expect("!")) ? this.unaryFn(a.text, this.unary()) : this.primary()
        },
        fieldAccess: function(a) {
            var b = this.identifier();
            return l(function(d, e, f) {
                var g = f || a(d, e);
                return null == g ? c : b(g)
            }, {
                assign: function(c, d, e) {
                    var f = a(c, e);
                    return f || a.assign(c, f = {}, e), b.assign(f, d)
                }
            })
        },
        objectIndex: function(a) {
            var b = this.text,
                d = this.expression();
            return this.consume("]"), l(function(e, f) {
                var g, h = a(e, f),
                    i = d(e, f);
                return Gb(i, b), h ? g = Hb(h[i], b) : c
            }, {
                assign: function(c, e, f) {
                    var g = Gb(d(c, f), b),
                        h = Hb(a(c, f), b);
                    return h || a.assign(c, h = {}, f), h[g] = e
                }
            })
        },
        functionCall: function(a, b) {
            var d = [];
            if (")" !== this.peekToken().text)
                do d.push(this.expression()); while (this.expect(","));
            this.consume(")");
            var e = this.text,
                f = d.length ? [] : null;
            return function(g, h) {
                var i = b ? b(g, h) : s(b) ? c : g,
                    j = a(g, h, i) || o;
                if (f)
                    for (var k = d.length; k--;) f[k] = Hb(d[k](g, h), e);
                Hb(i, e), Ib(j, e);
                var l = j.apply ? j.apply(i, f) : j(f[0], f[1], f[2], f[3], f[4]);
                return f && (f.length = 0), Hb(l, e)
            }
        },
        arrayDeclaration: function() {
            var a = [];
            if ("]" !== this.peekToken().text)
                do {
                    if (this.peek("]")) break;
                    a.push(this.expression())
                } while (this.expect(","));
            return this.consume("]"), l(function(b, c) {
                for (var d = [], e = 0, f = a.length; f > e; e++) d.push(a[e](b, c));
                return d
            }, {
                literal: !0,
                constant: a.every(Jb),
                inputs: a
            })
        },
        object: function() {
            var a = [],
                b = [];
            if ("}" !== this.peekToken().text)
                do {
                    if (this.peek("}")) break;
                    var c = this.consume();
                    c.constant ? a.push(c.value) : c.identifier ? a.push(c.text) : this.throwError("invalid key", c), this.consume(":"), b.push(this.expression())
                } while (this.expect(","));
            return this.consume("}"), l(function(c, d) {
                for (var e = {}, f = 0, g = b.length; g > f; f++) e[a[f]] = b[f](c, d);
                return e
            }, {
                literal: !0,
                constant: b.every(Jb),
                inputs: b
            })
        }
    };
    var re = ja(),
        se = ja(),
        te = Object.prototype.valueOf,
        ue = d("$sce"),
        ve = {
            HTML: "html",
            CSS: "css",
            URL: "url",
            RESOURCE_URL: "resourceUrl",
            JS: "js"
        },
        Xd = d("$compile"),
        we = b.createElement("a"),
        xe = dc(a.location.href);
    gc.$inject = ["$provide"], kc.$inject = ["$locale"], lc.$inject = ["$locale"];
    var ye = ".",
        ze = {
            yyyy: oc("FullYear", 4),
            yy: oc("FullYear", 2, 0, !0),
            y: oc("FullYear", 1),
            MMMM: pc("Month"),
            MMM: pc("Month", !0),
            MM: oc("Month", 2, 1),
            M: oc("Month", 1, 1),
            dd: oc("Date", 2),
            d: oc("Date", 1),
            HH: oc("Hours", 2),
            H: oc("Hours", 1),
            hh: oc("Hours", 2, -12),
            h: oc("Hours", 1, -12),
            mm: oc("Minutes", 2),
            m: oc("Minutes", 1),
            ss: oc("Seconds", 2),
            s: oc("Seconds", 1),
            sss: oc("Milliseconds", 3),
            EEEE: pc("Day"),
            EEE: pc("Day", !0),
            a: uc,
            Z: qc,
            ww: tc(2),
            w: tc(1),
            G: vc,
            GG: vc,
            GGG: vc,
            GGGG: wc
        },
        Ae = /((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
        Be = /^\-?\d+$/;
    xc.$inject = ["$locale"];
    var Ce = q(Wc),
        De = q(Yc);
    Ac.$inject = ["$parse"];
    var Ee = q({
            restrict: "E",
            compile: function(a, b) {
                return b.href || b.xlinkHref || b.name ? void 0 : function(a, b) {
                    if ("a" === b[0].nodeName.toLowerCase()) {
                        var c = "[object SVGAnimatedString]" === gd.call(b.prop("href")) ? "xlink:href" : "href";
                        b.on("click", function(a) {
                            b.attr(c) || a.preventDefault()
                        })
                    }
                }
            }
        }),
        Fe = {};
    f(Nd, function(a, b) {
        if ("multiple" != a) {
            var c = $a("ng-" + b);
            Fe[c] = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    link: function(a, d, e) {
                        a.$watch(e[c], function(a) {
                            e.$set(b, !!a)
                        })
                    }
                }
            }
        }
    }), f(Pd, function(a, b) {
        Fe[b] = function() {
            return {
                priority: 100,
                link: function(a, c, d) {
                    if ("ngPattern" === b && "/" == d.ngPattern.charAt(0)) {
                        var e = d.ngPattern.match(Uc);
                        if (e) return void d.$set("ngPattern", new RegExp(e[1], e[2]))
                    }
                    a.$watch(d[b], function(a) {
                        d.$set(b, a)
                    })
                }
            }
        }
    }), f(["src", "srcset", "href"], function(a) {
        var b = $a("ng-" + a);
        Fe[b] = function() {
            return {
                priority: 99,
                link: function(c, d, e) {
                    var f = a,
                        g = a;
                    "href" === a && "[object SVGAnimatedString]" === gd.call(d.prop("href")) && (g = "xlinkHref", e.$attr[g] = "xlink:href", f = null), e.$observe(b, function(b) {
                        return b ? (e.$set(g, b), void(_c && f && d.prop(f, e[g]))) : void("href" === a && e.$set(g, null))
                    })
                }
            }
        }
    });
    var Ge = {
            $addControl: o,
            $$renameControl: Cc,
            $removeControl: o,
            $setValidity: o,
            $setDirty: o,
            $setPristine: o,
            $setSubmitted: o
        },
        He = "ng-submitted";
    Dc.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
    var Ie = function(a) {
            return ["$timeout", function(b) {
                var d = {
                    name: "form",
                    restrict: a ? "EAC" : "E",
                    controller: Dc,
                    compile: function(d, e) {
                        d.addClass(pf).addClass(nf);
                        var f = e.name ? "name" : a && e.ngForm ? "ngForm" : !1;
                        return {
                            pre: function(a, d, e, g) {
                                if (!("action" in e)) {
                                    var h = function(b) {
                                        a.$apply(function() {
                                            g.$commitViewValue(), g.$setSubmitted()
                                        }), b.preventDefault()
                                    };
                                    Bd(d[0], "submit", h), d.on("$destroy", function() {
                                        b(function() {
                                            Cd(d[0], "submit", h)
                                        }, 0, !1)
                                    })
                                }
                                var i = g.$$parentForm;
                                f && (Kb(a, null, g.$name, g, g.$name), e.$observe(f, function(b) {
                                    g.$name !== b && (Kb(a, null, g.$name, c, g.$name), i.$$renameControl(g, b), Kb(a, null, g.$name, g, g.$name))
                                })), d.on("$destroy", function() {
                                    i.$removeControl(g), f && Kb(a, null, e[f], c, g.$name), l(g, Ge)
                                })
                            }
                        }
                    }
                };
                return d
            }]
        },
        Je = Ie(),
        Ke = Ie(!0),
        Le = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
        Me = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        Ne = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
        Oe = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
        Pe = /^(\d{4})-(\d{2})-(\d{2})$/,
        Qe = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
        Re = /^(\d{4})-W(\d\d)$/,
        Se = /^(\d{4})-(\d\d)$/,
        Te = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
        Ue = {
            text: Fc,
            date: Jc("date", Pe, Ic(Pe, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
            "datetime-local": Jc("datetimelocal", Qe, Ic(Qe, ["yyyy", "MM", "dd", "HH", "mm", "ss", "sss"]), "yyyy-MM-ddTHH:mm:ss.sss"),
            time: Jc("time", Te, Ic(Te, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
            week: Jc("week", Re, Hc, "yyyy-Www"),
            month: Jc("month", Se, Ic(Se, ["yyyy", "MM"]), "yyyy-MM"),
            number: Lc,
            url: Mc,
            email: Nc,
            radio: Oc,
            checkbox: Qc,
            hidden: o,
            button: o,
            submit: o,
            reset: o,
            file: o
        },
        Ve = ["$browser", "$sniffer", "$filter", "$parse", function(a, b, c, d) {
            return {
                restrict: "E",
                require: ["?ngModel"],
                link: {
                    pre: function(e, f, g, h) {
                        h[0] && (Ue[Wc(g.type)] || Ue.text)(e, f, g, h[0], b, a, c, d)
                    }
                }
            }
        }],
        We = /^(true|false|\d+)$/,
        Xe = function() {
            return {
                restrict: "A",
                priority: 100,
                compile: function(a, b) {
                    return We.test(b.ngValue) ? function(a, b, c) {
                        c.$set("value", a.$eval(c.ngValue))
                    } : function(a, b, c) {
                        a.$watch(c.ngValue, function(a) {
                            c.$set("value", a)
                        })
                    }
                }
            }
        },
        Ye = ["$compile", function(a) {
            return {
                restrict: "AC",
                compile: function(b) {
                    return a.$$addBindingClass(b),
                        function(b, d, e) {
                            a.$$addBindingInfo(d, e.ngBind), d = d[0], b.$watch(e.ngBind, function(a) {
                                d.textContent = a === c ? "" : a
                            })
                        }
                }
            }
        }],
        Ze = ["$interpolate", "$compile", function(a, b) {
            return {
                compile: function(d) {
                    return b.$$addBindingClass(d),
                        function(d, e, f) {
                            var g = a(e.attr(f.$attr.ngBindTemplate));
                            b.$$addBindingInfo(e, g.expressions), e = e[0], f.$observe("ngBindTemplate", function(a) {
                                e.textContent = a === c ? "" : a
                            })
                        }
                }
            }
        }],
        $e = ["$sce", "$parse", "$compile", function(a, b, c) {
            return {
                restrict: "A",
                compile: function(d, e) {
                    var f = b(e.ngBindHtml),
                        g = b(e.ngBindHtml, function(a) {
                            return (a || "").toString()
                        });
                    return c.$$addBindingClass(d),
                        function(b, d, e) {
                            c.$$addBindingInfo(d, e.ngBindHtml), b.$watch(g, function() {
                                d.html(a.getTrustedHtml(f(b)) || "")
                            })
                        }
                }
            }
        }],
        _e = q({
            restrict: "A",
            require: "ngModel",
            link: function(a, b, c, d) {
                d.$viewChangeListeners.push(function() {
                    a.$eval(c.ngChange)
                })
            }
        }),
        af = Rc("", !0),
        bf = Rc("Odd", 0),
        cf = Rc("Even", 1),
        df = Bc({
            compile: function(a, b) {
                b.$set("ngCloak", c), a.removeClass("ng-cloak")
            }
        }),
        ef = [function() {
            return {
                restrict: "A",
                scope: !0,
                controller: "@",
                priority: 500
            }
        }],
        ff = {},
        gf = {
            blur: !0,
            focus: !0
        };
    f("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(a) {
        var b = $a("ng-" + a);
        ff[b] = ["$parse", "$rootScope", function(c, d) {
            return {
                restrict: "A",
                compile: function(e, f) {
                    var g = c(f[b], null, !0);
                    return function(b, c) {
                        c.on(a, function(c) {
                            var e = function() {
                                g(b, {
                                    $event: c
                                })
                            };
                            gf[a] && d.$$phase ? b.$evalAsync(e) : b.$apply(e)
                        })
                    }
                }
            }
        }]
    });
    var hf = ["$animate", function(a) {
            return {
                multiElement: !0,
                transclude: "element",
                priority: 600,
                terminal: !0,
                restrict: "A",
                $$tlb: !0,
                link: function(c, d, e, f, g) {
                    var h, i, j;
                    c.$watch(e.ngIf, function(c) {
                        c ? i || g(function(c, f) {
                            i = f, c[c.length++] = b.createComment(" end ngIf: " + e.ngIf + " "), h = {
                                clone: c
                            }, a.enter(c, d.parent(), d)
                        }) : (j && (j.remove(), j = null), i && (i.$destroy(), i = null), h && (j = ia(h.clone), a.leave(j).then(function() {
                            j = null
                        }), h = null))
                    })
                }
            }
        }],
        jf = ["$templateRequest", "$anchorScroll", "$animate", function(a, b, c) {
            return {
                restrict: "ECA",
                priority: 400,
                terminal: !0,
                transclude: "element",
                controller: id.noop,
                compile: function(d, e) {
                    var f = e.ngInclude || e.src,
                        g = e.onload || "",
                        h = e.autoscroll;
                    return function(d, e, i, j, k) {
                        var l, m, n, o = 0,
                            p = function() {
                                m && (m.remove(), m = null), l && (l.$destroy(), l = null), n && (c.leave(n).then(function() {
                                    m = null
                                }), m = n, n = null)
                            };
                        d.$watch(f, function(f) {
                            var i = function() {
                                    !s(h) || h && !d.$eval(h) || b()
                                },
                                m = ++o;
                            f ? (a(f, !0).then(function(a) {
                                if (m === o) {
                                    var b = d.$new();
                                    j.template = a;
                                    var h = k(b, function(a) {
                                        p(), c.enter(a, null, e).then(i)
                                    });
                                    l = b, n = h, l.$emit("$includeContentLoaded", f), d.$eval(g)
                                }
                            }, function() {
                                m === o && (p(), d.$emit("$includeContentError", f))
                            }), d.$emit("$includeContentRequested", f)) : (p(), j.template = null)
                        })
                    }
                }
            }
        }],
        kf = ["$compile", function(a) {
            return {
                restrict: "ECA",
                priority: -400,
                require: "ngInclude",
                link: function(c, d, e, f) {
                    return /SVG/.test(d[0].toString()) ? (d.empty(), void a(sa(f.template, b).childNodes)(c, function(a) {
                        d.append(a)
                    }, {
                        futureParentElement: d
                    })) : (d.html(f.template), void a(d.contents())(c))
                }
            }
        }],
        lf = Bc({
            priority: 450,
            compile: function() {
                return {
                    pre: function(a, b, c) {
                        a.$eval(c.ngInit)
                    }
                }
            }
        }),
        mf = function() {
            return {
                restrict: "A",
                priority: 100,
                require: "ngModel",
                link: function(a, b, d, e) {
                    var g = b.attr(d.$attr.ngList) || ", ",
                        h = "false" !== d.ngTrim,
                        i = h ? md(g) : g,
                        j = function(a) {
                            if (!r(a)) {
                                var b = [];
                                return a && f(a.split(i), function(a) {
                                    a && b.push(h ? md(a) : a)
                                }), b
                            }
                        };
                    e.$parsers.push(j), e.$formatters.push(function(a) {
                        return ld(a) ? a.join(g) : c;
                    }), e.$isEmpty = function(a) {
                        return !a || !a.length
                    }
                }
            }
        },
        nf = "ng-valid",
        of = "ng-invalid",
        pf = "ng-pristine",
        qf = "ng-dirty",
        rf = "ng-untouched",
        sf = "ng-touched",
        tf = "ng-pending",
        uf = new d("ngModel"),
        vf = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function(a, b, d, e, g, h, i, j, k, l) {
            this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$$rawModelValue = c, this.$validators = {}, this.$asyncValidators = {}, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$untouched = !0, this.$touched = !1, this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$error = {}, this.$$success = {}, this.$pending = c, this.$name = l(d.name || "", !1)(a);
            var m, n = g(d.ngModel),
                p = n.assign,
                q = n,
                t = p,
                u = null,
                w = this;
            this.$$setOptions = function(a) {
                if (w.$options = a, a && a.getterSetter) {
                    var b = g(d.ngModel + "()"),
                        c = g(d.ngModel + "($$$p)");
                    q = function(a) {
                        var c = n(a);
                        return x(c) && (c = b(a)), c
                    }, t = function(a, b) {
                        x(n(a)) ? c(a, {
                            $$$p: w.$modelValue
                        }) : p(a, w.$modelValue)
                    }
                } else if (!n.assign) throw uf("nonassign", "Expression '{0}' is non-assignable. Element: {1}", d.ngModel, T(e))
            }, this.$render = o, this.$isEmpty = function(a) {
                return r(a) || "" === a || null === a || a !== a
            };
            var y = e.inheritedData("$formController") || Ge,
                z = 0;
            Sc({
                ctrl: this,
                $element: e,
                set: function(a, b) {
                    a[b] = !0
                },
                unset: function(a, b) {
                    delete a[b]
                },
                parentForm: y,
                $animate: h
            }), this.$setPristine = function() {
                w.$dirty = !1, w.$pristine = !0, h.removeClass(e, qf), h.addClass(e, pf)
            }, this.$setDirty = function() {
                w.$dirty = !0, w.$pristine = !1, h.removeClass(e, pf), h.addClass(e, qf), y.$setDirty()
            }, this.$setUntouched = function() {
                w.$touched = !1, w.$untouched = !0, h.setClass(e, rf, sf)
            }, this.$setTouched = function() {
                w.$touched = !0, w.$untouched = !1, h.setClass(e, sf, rf)
            }, this.$rollbackViewValue = function() {
                i.cancel(u), w.$viewValue = w.$$lastCommittedViewValue, w.$render()
            }, this.$validate = function() {
                if (!v(w.$modelValue) || !isNaN(w.$modelValue)) {
                    var a = w.$$lastCommittedViewValue,
                        b = w.$$rawModelValue,
                        d = w.$valid,
                        e = w.$modelValue,
                        f = w.$options && w.$options.allowInvalid;
                    w.$$runValidators(b, a, function(a) {
                        f || d === a || (w.$modelValue = a ? b : c, w.$modelValue !== e && w.$$writeModelToScope())
                    })
                }
            }, this.$$runValidators = function(a, b, d) {
                function e() {
                    var a = w.$$parserName || "parse";
                    return m !== c ? (m || (f(w.$validators, function(a, b) {
                        i(b, null)
                    }), f(w.$asyncValidators, function(a, b) {
                        i(b, null)
                    })), i(a, m), m) : (i(a, null), !0)
                }

                function g() {
                    var c = !0;
                    return f(w.$validators, function(d, e) {
                        var f = d(a, b);
                        c = c && f, i(e, f)
                    }), c ? !0 : (f(w.$asyncValidators, function(a, b) {
                        i(b, null)
                    }), !1)
                }

                function h() {
                    var d = [],
                        e = !0;
                    f(w.$asyncValidators, function(f, g) {
                        var h = f(a, b);
                        if (!F(h)) throw uf("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", h);
                        i(g, c), d.push(h.then(function() {
                            i(g, !0)
                        }, function(a) {
                            e = !1, i(g, !1)
                        }))
                    }), d.length ? k.all(d).then(function() {
                        j(e)
                    }, o) : j(!0)
                }

                function i(a, b) {
                    l === z && w.$setValidity(a, b)
                }

                function j(a) {
                    l === z && d(a)
                }
                z++;
                var l = z;
                return e() && g() ? void h() : void j(!1)
            }, this.$commitViewValue = function() {
                var a = w.$viewValue;
                i.cancel(u), (w.$$lastCommittedViewValue !== a || "" === a && w.$$hasNativeValidators) && (w.$$lastCommittedViewValue = a, w.$pristine && this.$setDirty(), this.$$parseAndValidate())
            }, this.$$parseAndValidate = function() {
                function b() {
                    w.$modelValue !== g && w.$$writeModelToScope()
                }
                var d = w.$$lastCommittedViewValue,
                    e = d;
                if (m = r(e) ? c : !0)
                    for (var f = 0; f < w.$parsers.length; f++)
                        if (e = w.$parsers[f](e), r(e)) {
                            m = !1;
                            break
                        }
                v(w.$modelValue) && isNaN(w.$modelValue) && (w.$modelValue = q(a));
                var g = w.$modelValue,
                    h = w.$options && w.$options.allowInvalid;
                w.$$rawModelValue = e, h && (w.$modelValue = e, b()), w.$$runValidators(e, w.$$lastCommittedViewValue, function(a) {
                    h || (w.$modelValue = a ? e : c, b())
                })
            }, this.$$writeModelToScope = function() {
                t(a, w.$modelValue), f(w.$viewChangeListeners, function(a) {
                    try {
                        a()
                    } catch (c) {
                        b(c)
                    }
                })
            }, this.$setViewValue = function(a, b) {
                w.$viewValue = a, (!w.$options || w.$options.updateOnDefault) && w.$$debounceViewValueCommit(b)
            }, this.$$debounceViewValueCommit = function(b) {
                var c, d = 0,
                    e = w.$options;
                e && s(e.debounce) && (c = e.debounce, v(c) ? d = c : v(c[b]) ? d = c[b] : v(c["default"]) && (d = c["default"])), i.cancel(u), d ? u = i(function() {
                    w.$commitViewValue()
                }, d) : j.$$phase ? w.$commitViewValue() : a.$apply(function() {
                    w.$commitViewValue()
                })
            }, a.$watch(function() {
                var b = q(a);
                if (b !== w.$modelValue && (w.$modelValue === w.$modelValue || b === b)) {
                    w.$modelValue = w.$$rawModelValue = b, m = c;
                    for (var d = w.$formatters, e = d.length, f = b; e--;) f = d[e](f);
                    w.$viewValue !== f && (w.$viewValue = w.$$lastCommittedViewValue = f, w.$render(), w.$$runValidators(b, f, o))
                }
                return b
            })
        }],
        wf = ["$rootScope", function(a) {
            return {
                restrict: "A",
                require: ["ngModel", "^?form", "^?ngModelOptions"],
                controller: vf,
                priority: 1,
                compile: function(b) {
                    return b.addClass(pf).addClass(rf).addClass(nf), {
                        pre: function(a, b, c, d) {
                            var e = d[0],
                                f = d[1] || Ge;
                            e.$$setOptions(d[2] && d[2].$options), f.$addControl(e), c.$observe("name", function(a) {
                                e.$name !== a && f.$$renameControl(e, a)
                            }), a.$on("$destroy", function() {
                                f.$removeControl(e)
                            })
                        },
                        post: function(b, c, d, e) {
                            var f = e[0];
                            f.$options && f.$options.updateOn && c.on(f.$options.updateOn, function(a) {
                                f.$$debounceViewValueCommit(a && a.type)
                            }), c.on("blur", function(c) {
                                f.$touched || (a.$$phase ? b.$evalAsync(f.$setTouched) : b.$apply(f.$setTouched))
                            })
                        }
                    }
                }
            }
        }],
        xf = /(\s+|^)default(\s+|$)/,
        yf = function() {
            return {
                restrict: "A",
                controller: ["$scope", "$attrs", function(a, b) {
                    var d = this;
                    this.$options = a.$eval(b.ngModelOptions), this.$options.updateOn !== c ? (this.$options.updateOnDefault = !1, this.$options.updateOn = md(this.$options.updateOn.replace(xf, function() {
                        return d.$options.updateOnDefault = !0, " "
                    }))) : this.$options.updateOnDefault = !0
                }]
            }
        },
        zf = Bc({
            terminal: !0,
            priority: 1e3
        }),
        Af = ["$locale", "$interpolate", function(a, b) {
            var c = /{}/g,
                d = /^when(Minus)?(.+)$/;
            return {
                restrict: "EA",
                link: function(e, g, h) {
                    function i(a) {
                        g.text(a || "")
                    }
                    var j, k = h.count,
                        l = h.$attr.when && g.attr(h.$attr.when),
                        m = h.offset || 0,
                        n = e.$eval(l) || {},
                        o = {},
                        p = b.startSymbol(),
                        q = b.endSymbol(),
                        r = p + k + "-" + m + q,
                        s = id.noop;
                    f(h, function(a, b) {
                        var c = d.exec(b);
                        if (c) {
                            var e = (c[1] ? "-" : "") + Wc(c[2]);
                            n[e] = g.attr(h.$attr[b])
                        }
                    }), f(n, function(a, d) {
                        o[d] = b(a.replace(c, r))
                    }), e.$watch(k, function(b) {
                        var c = parseFloat(b),
                            d = isNaN(c);
                        d || c in n || (c = a.pluralCat(c - m)), c === j || d && isNaN(j) || (s(), s = e.$watch(o[c], i), j = c)
                    })
                }
            }
        }],
        Bf = ["$parse", "$animate", function(a, g) {
            var h = "$$NG_REMOVED",
                i = d("ngRepeat"),
                j = function(a, b, c, d, e, f, g) {
                    a[c] = d, e && (a[e] = f), a.$index = b, a.$first = 0 === b, a.$last = b === g - 1, a.$middle = !(a.$first || a.$last), a.$odd = !(a.$even = 0 === (1 & b))
                },
                k = function(a) {
                    return a.clone[0]
                },
                l = function(a) {
                    return a.clone[a.clone.length - 1]
                };
            return {
                restrict: "A",
                multiElement: !0,
                transclude: "element",
                priority: 1e3,
                terminal: !0,
                $$tlb: !0,
                compile: function(d, m) {
                    var n = m.ngRepeat,
                        o = b.createComment(" end ngRepeat: " + n + " "),
                        p = n.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                    if (!p) throw i("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", n);
                    var q = p[1],
                        r = p[2],
                        s = p[3],
                        t = p[4];
                    if (p = q.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/), !p) throw i("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", q);
                    var u = p[3] || p[1],
                        v = p[2];
                    if (s && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(s) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(s))) throw i("badident", "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", s);
                    var w, x, y, z, A = {
                        $id: Oa
                    };
                    return t ? w = a(t) : (y = function(a, b) {
                            return Oa(b)
                        }, z = function(a) {
                            return a
                        }),
                        function(a, b, d, m, p) {
                            w && (x = function(b, c, d) {
                                return v && (A[v] = b), A[u] = c, A.$index = d, w(a, A)
                            });
                            var q = ja();
                            a.$watchCollection(r, function(d) {
                                var m, r, t, w, A, B, C, D, E, F, G, H, I = b[0],
                                    J = ja();
                                if (s && (a[s] = d), e(d)) E = d, D = x || y;
                                else {
                                    D = x || z, E = [];
                                    for (var K in d) d.hasOwnProperty(K) && "$" != K.charAt(0) && E.push(K);
                                    E.sort()
                                }
                                for (w = E.length, G = new Array(w), m = 0; w > m; m++)
                                    if (A = d === E ? m : E[m], B = d[A], C = D(A, B, m), q[C]) F = q[C], delete q[C], J[C] = F, G[m] = F;
                                    else {
                                        if (J[C]) throw f(G, function(a) {
                                            a && a.scope && (q[a.id] = a)
                                        }), i("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", n, C, B);
                                        G[m] = {
                                            id: C,
                                            scope: c,
                                            clone: c
                                        }, J[C] = !0
                                    }
                                for (var L in q) {
                                    if (F = q[L], H = ia(F.clone), g.leave(H), H[0].parentNode)
                                        for (m = 0, r = H.length; r > m; m++) H[m][h] = !0;
                                    F.scope.$destroy()
                                }
                                for (m = 0; w > m; m++)
                                    if (A = d === E ? m : E[m], B = d[A], F = G[m], F.scope) {
                                        t = I;
                                        do t = t.nextSibling; while (t && t[h]);
                                        k(F) != t && g.move(ia(F.clone), null, ad(I)), I = l(F), j(F.scope, m, u, B, v, A, w)
                                    } else p(function(a, b) {
                                        F.scope = b;
                                        var c = o.cloneNode(!1);
                                        a[a.length++] = c, g.enter(a, null, ad(I)), I = c, F.clone = a, J[F.id] = F, j(F.scope, m, u, B, v, A, w)
                                    });
                                q = J
                            })
                        }
                }
            }
        }],
        Cf = "ng-hide",
        Df = "ng-hide-animate",
        Ef = ["$animate", function(a) {
            return {
                restrict: "A",
                multiElement: !0,
                link: function(b, c, d) {
                    b.$watch(d.ngShow, function(b) {
                        a[b ? "removeClass" : "addClass"](c, Cf, {
                            tempClasses: Df
                        })
                    })
                }
            }
        }],
        Ff = ["$animate", function(a) {
            return {
                restrict: "A",
                multiElement: !0,
                link: function(b, c, d) {
                    b.$watch(d.ngHide, function(b) {
                        a[b ? "addClass" : "removeClass"](c, Cf, {
                            tempClasses: Df
                        })
                    })
                }
            }
        }],
        Gf = Bc(function(a, b, c) {
            a.$watch(c.ngStyle, function(a, c) {
                c && a !== c && f(c, function(a, c) {
                    b.css(c, "")
                }), a && b.css(a)
            }, !0)
        }),
        Hf = ["$animate", function(a) {
            return {
                restrict: "EA",
                require: "ngSwitch",
                controller: ["$scope", function() {
                    this.cases = {}
                }],
                link: function(c, d, e, g) {
                    var h = e.ngSwitch || e.on,
                        i = [],
                        j = [],
                        k = [],
                        l = [],
                        m = function(a, b) {
                            return function() {
                                a.splice(b, 1)
                            }
                        };
                    c.$watch(h, function(c) {
                        var d, e;
                        for (d = 0, e = k.length; e > d; ++d) a.cancel(k[d]);
                        for (k.length = 0, d = 0, e = l.length; e > d; ++d) {
                            var h = ia(j[d].clone);
                            l[d].$destroy();
                            var n = k[d] = a.leave(h);
                            n.then(m(k, d))
                        }
                        j.length = 0, l.length = 0, (i = g.cases["!" + c] || g.cases["?"]) && f(i, function(c) {
                            c.transclude(function(d, e) {
                                l.push(e);
                                var f = c.element;
                                d[d.length++] = b.createComment(" end ngSwitchWhen: ");
                                var g = {
                                    clone: d
                                };
                                j.push(g), a.enter(d, f.parent(), f)
                            })
                        })
                    })
                }
            }
        }],
        If = Bc({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(a, b, c, d, e) {
                d.cases["!" + c.ngSwitchWhen] = d.cases["!" + c.ngSwitchWhen] || [], d.cases["!" + c.ngSwitchWhen].push({
                    transclude: e,
                    element: b
                })
            }
        }),
        Jf = Bc({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(a, b, c, d, e) {
                d.cases["?"] = d.cases["?"] || [], d.cases["?"].push({
                    transclude: e,
                    element: b
                })
            }
        }),
        Kf = Bc({
            restrict: "EAC",
            link: function(a, b, c, e, f) {
                if (!f) throw d("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", T(b));
                f(function(a) {
                    b.empty(), b.append(a)
                })
            }
        }),
        Lf = ["$templateCache", function(a) {
            return {
                restrict: "E",
                terminal: !0,
                compile: function(b, c) {
                    if ("text/ng-template" == c.type) {
                        var d = c.id,
                            e = b[0].text;
                        a.put(d, e)
                    }
                }
            }
        }],
        Mf = d("ngOptions"),
        Nf = q({
            restrict: "A",
            terminal: !0
        }),
        Of = ["$compile", "$parse", function(a, d) {
            var e = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
                h = {
                    $setViewValue: o
                };
            return {
                restrict: "E",
                require: ["select", "?ngModel"],
                controller: ["$element", "$scope", "$attrs", function(a, b, c) {
                    var d, e, f = this,
                        g = {},
                        i = h;
                    f.databound = c.ngModel, f.init = function(a, b, c) {
                        i = a, d = b, e = c
                    }, f.addOption = function(b, c) {
                        ga(b, '"option value"'), g[b] = !0, i.$viewValue == b && (a.val(b), e.parent() && e.remove()), c && c[0].hasAttribute("selected") && (c[0].selected = !0)
                    }, f.removeOption = function(a) {
                        this.hasOption(a) && (delete g[a], i.$viewValue === a && this.renderUnknownOption(a))
                    }, f.renderUnknownOption = function(b) {
                        var c = "? " + Oa(b) + " ?";
                        e.val(c), a.prepend(e), a.val(c), e.prop("selected", !0)
                    }, f.hasOption = function(a) {
                        return g.hasOwnProperty(a)
                    }, b.$on("$destroy", function() {
                        f.renderUnknownOption = o
                    })
                }],
                link: function(h, i, j, k) {
                    function l(a, b, c, d) {
                        c.$render = function() {
                            var a = c.$viewValue;
                            d.hasOption(a) ? (y.parent() && y.remove(), b.val(a), "" === a && o.prop("selected", !0)) : null == a && o ? b.val("") : d.renderUnknownOption(a)
                        }, b.on("change", function() {
                            a.$apply(function() {
                                y.parent() && y.remove(), c.$setViewValue(b.val())
                            })
                        })
                    }

                    function m(a, b, c) {
                        var d;
                        c.$render = function() {
                            var a = new Pa(c.$viewValue);
                            f(b.find("option"), function(b) {
                                b.selected = s(a.get(b.value))
                            })
                        }, a.$watch(function() {
                            M(d, c.$viewValue) || (d = L(c.$viewValue), c.$render())
                        }), b.on("change", function() {
                            a.$apply(function() {
                                var a = [];
                                f(b.find("option"), function(b) {
                                    b.selected && a.push(b.value)
                                }), c.$setViewValue(a)
                            })
                        })
                    }

                    function n(b, h, i) {
                        function j(a, c, d) {
                            return M[B] = d, E && (M[E] = c), a(b, M)
                        }

                        function k() {
                            b.$apply(function() {
                                var a, c = H(b) || [];
                                if (r) a = [], f(h.val(), function(b) {
                                    b = J ? K[b] : b, a.push(l(b, c[b]))
                                });
                                else {
                                    var d = J ? K[h.val()] : h.val();
                                    a = l(d, c[d])
                                }
                                i.$setViewValue(a), y()
                            })
                        }

                        function l(a, b) {
                            if ("?" === a) return c;
                            if ("" === a) return null;
                            var d = D ? D : G;
                            return j(d, a, b)
                        }

                        function m() {
                            var a, c = H(b);
                            if (c && ld(c)) {
                                a = new Array(c.length);
                                for (var d = 0, e = c.length; e > d; d++) a[d] = j(A, d, c[d]);
                                return a
                            }
                            if (c) {
                                a = {};
                                for (var f in c) c.hasOwnProperty(f) && (a[f] = j(A, f, c[f]))
                            }
                            return a
                        }

                        function n(a) {
                            var b;
                            if (r)
                                if (J && ld(a)) {
                                    b = new Pa([]);
                                    for (var c = 0; c < a.length; c++) b.put(j(J, null, a[c]), !0)
                                } else b = new Pa(a);
                            else J && (a = j(J, null, a));
                            return function(c, d) {
                                var e;
                                return e = J ? J : D ? D : G, r ? s(b.remove(j(e, c, d))) : a === j(e, c, d)
                            }
                        }

                        function o() {
                            v || (b.$$postDigest(y), v = !0)
                        }

                        function q(a, b, c) {
                            a[b] = a[b] || 0, a[b] += c ? 1 : -1
                        }

                        function y() {
                            v = !1;
                            var a, c, d, e, k, l, m, o, t, y, z, B, C, D, G, I, N, O = {
                                    "": []
                                },
                                P = [""],
                                Q = i.$viewValue,
                                R = H(b) || [],
                                S = E ? g(R) : R,
                                T = {},
                                U = n(Q),
                                V = !1;
                            for (K = {}, B = 0; y = S.length, y > B; B++) m = B, E && (m = S[B], "$" === m.charAt(0)) || (o = R[m], a = j(F, m, o) || "", (c = O[a]) || (c = O[a] = [], P.push(a)), C = U(m, o), V = V || C, I = j(A, m, o), I = s(I) ? I : "", N = J ? J(b, M) : E ? S[B] : B, J && (K[N] = m), c.push({
                                id: N,
                                label: I,
                                selected: C
                            }));
                            for (r || (u || null === Q ? O[""].unshift({
                                    id: "",
                                    label: "",
                                    selected: !V
                                }) : V || O[""].unshift({
                                    id: "?",
                                    label: "",
                                    selected: !0
                                })), z = 0, t = P.length; t > z; z++) {
                                for (a = P[z], c = O[a], L.length <= z ? (e = {
                                        element: x.clone().attr("label", a),
                                        label: c.label
                                    }, k = [e], L.push(k), h.append(e.element)) : (k = L[z], e = k[0], e.label != a && e.element.attr("label", e.label = a)), D = null, B = 0, y = c.length; y > B; B++) d = c[B], (l = k[B + 1]) ? (D = l.element, l.label !== d.label && (q(T, l.label, !1), q(T, d.label, !0), D.text(l.label = d.label), D.prop("label", l.label)), l.id !== d.id && D.val(l.id = d.id), D[0].selected !== d.selected && (D.prop("selected", l.selected = d.selected), _c && D.prop("selected", l.selected))) : ("" === d.id && u ? G = u : (G = w.clone()).val(d.id).prop("selected", d.selected).attr("selected", d.selected).prop("label", d.label).text(d.label), k.push(l = {
                                    element: G,
                                    label: d.label,
                                    id: d.id,
                                    selected: d.selected
                                }), q(T, d.label, !0), D ? D.after(G) : e.element.append(G), D = G);
                                for (B++; k.length > B;) d = k.pop(), q(T, d.label, !1), d.element.remove()
                            }
                            for (; L.length > z;) {
                                for (c = L.pop(), B = 1; B < c.length; ++B) q(T, c[B].label, !1);
                                c[0].element.remove()
                            }
                            f(T, function(a, b) {
                                a > 0 ? p.addOption(b) : 0 > a && p.removeOption(b)
                            })
                        }
                        var z;
                        if (!(z = t.match(e))) throw Mf("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", t, T(h));
                        var A = d(z[2] || z[1]),
                            B = z[4] || z[6],
                            C = / as /.test(z[0]) && z[1],
                            D = C ? d(C) : null,
                            E = z[5],
                            F = d(z[3] || ""),
                            G = d(z[2] ? z[1] : B),
                            H = d(z[7]),
                            I = z[8],
                            J = I ? d(z[8]) : null,
                            K = {},
                            L = [
                                [{
                                    element: h,
                                    label: ""
                                }]
                            ],
                            M = {};
                        u && (a(u)(b), u.removeClass("ng-scope"), u.remove()), h.empty(), h.on("change", k), i.$render = y, b.$watchCollection(H, o), b.$watchCollection(m, o), r && b.$watchCollection(function() {
                            return i.$modelValue
                        }, o)
                    }
                    if (k[1]) {
                        for (var o, p = k[0], q = k[1], r = j.multiple, t = j.ngOptions, u = !1, v = !1, w = ad(b.createElement("option")), x = ad(b.createElement("optgroup")), y = w.clone(), z = 0, A = i.children(), B = A.length; B > z; z++)
                            if ("" === A[z].value) {
                                o = u = A.eq(z);
                                break
                            }
                        p.init(q, u, y), r && (q.$isEmpty = function(a) {
                            return !a || 0 === a.length
                        }), t ? n(h, i, q) : r ? m(h, i, q) : l(h, i, q, p)
                    }
                }
            }
        }],
        Pf = ["$interpolate", function(a) {
            var b = {
                addOption: o,
                removeOption: o
            };
            return {
                restrict: "E",
                priority: 100,
                compile: function(c, d) {
                    if (r(d.value)) {
                        var e = a(c.text(), !0);
                        e || d.$set("value", c.text())
                    }
                    return function(a, c, d) {
                        var f = "$selectController",
                            g = c.parent(),
                            h = g.data(f) || g.parent().data(f);
                        h && h.databound || (h = b), e ? a.$watch(e, function(a, b) {
                            d.$set("value", a), b !== a && h.removeOption(b), h.addOption(a, c)
                        }) : h.addOption(d.value, c), c.on("$destroy", function() {
                            h.removeOption(d.value)
                        })
                    }
                }
            }
        }],
        Qf = q({
            restrict: "E",
            terminal: !1
        }),
        Rf = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, c, d) {
                    d && (c.required = !0, d.$validators.required = function(a, b) {
                        return !c.required || !d.$isEmpty(b)
                    }, c.$observe("required", function() {
                        d.$validate()
                    }))
                }
            }
        },
        Sf = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, e, f) {
                    if (f) {
                        var g, h = e.ngPattern || e.pattern;
                        e.$observe("pattern", function(a) {
                            if (u(a) && a.length > 0 && (a = new RegExp("^" + a + "$")), a && !a.test) throw d("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", h, a, T(b));
                            g = a || c, f.$validate()
                        }), f.$validators.pattern = function(a) {
                            return f.$isEmpty(a) || r(g) || g.test(a)
                        }
                    }
                }
            }
        },
        Tf = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, c, d) {
                    if (d) {
                        var e = -1;
                        c.$observe("maxlength", function(a) {
                            var b = m(a);
                            e = isNaN(b) ? -1 : b, d.$validate()
                        }), d.$validators.maxlength = function(a, b) {
                            return 0 > e || d.$isEmpty(b) || b.length <= e
                        }
                    }
                }
            }
        },
        Uf = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, c, d) {
                    if (d) {
                        var e = 0;
                        c.$observe("minlength", function(a) {
                            e = m(a) || 0, d.$validate()
                        }), d.$validators.minlength = function(a, b) {
                            return d.$isEmpty(b) || b.length >= e
                        }
                    }
                }
            }
        };
    a.angular.bootstrap || (da(), na(id), ad(b).ready(function() {
        $(b, _)
    }))
}(window, document), !window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>'), "undefined" != typeof module && "undefined" != typeof exports && module.exports === exports && (module.exports = "ui.router"),
    function(a, b, c) {
        "use strict";

        function d(a, b) {
            return M(new(M(function() {}, {
                prototype: a
            })), b)
        }

        function e(a) {
            return L(arguments, function(b) {
                b !== a && L(b, function(b, c) {
                    a.hasOwnProperty(c) || (a[c] = b)
                })
            }), a
        }

        function f(a, b) {
            var c = [];
            for (var d in a.path) {
                if (a.path[d] !== b.path[d]) break;
                c.push(a.path[d])
            }
            return c
        }

        function g(a) {
            if (Object.keys) return Object.keys(a);
            var c = [];
            return b.forEach(a, function(a, b) {
                c.push(b)
            }), c
        }

        function h(a, b) {
            if (Array.prototype.indexOf) return a.indexOf(b, Number(arguments[2]) || 0);
            var c = a.length >>> 0,
                d = Number(arguments[2]) || 0;
            for (d = 0 > d ? Math.ceil(d) : Math.floor(d), 0 > d && (d += c); c > d; d++)
                if (d in a && a[d] === b) return d;
            return -1
        }

        function i(a, b, c, d) {
            var e, i = f(c, d),
                j = {},
                k = [];
            for (var l in i)
                if (i[l].params && (e = g(i[l].params), e.length))
                    for (var m in e) h(k, e[m]) >= 0 || (k.push(e[m]), j[e[m]] = a[e[m]]);
            return M({}, j, b)
        }

        function j(a, b, c) {
            if (!c) {
                c = [];
                for (var d in a) c.push(d)
            }
            for (var e = 0; e < c.length; e++) {
                var f = c[e];
                if (a[f] != b[f]) return !1
            }
            return !0
        }

        function k(a, b) {
            var c = {};
            return L(a, function(a) {
                c[a] = b[a]
            }), c
        }

        function l(a) {
            var b = {},
                c = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
            for (var d in a) - 1 == h(c, d) && (b[d] = a[d]);
            return b
        }

        function m(a, b) {
            var c = K(a),
                d = c ? [] : {};
            return L(a, function(a, e) {
                b(a, e) && (d[c ? d.length : e] = a)
            }), d
        }

        function n(a, b) {
            var c = K(a) ? [] : {};
            return L(a, function(a, d) {
                c[d] = b(a, d)
            }), c
        }

        function o(a, b) {
            var d = 1,
                f = 2,
                i = {},
                j = [],
                k = i,
                m = M(a.when(i), {
                    $$promises: i,
                    $$values: i
                });
            this.study = function(i) {
                function n(a, c) {
                    if (s[c] !== f) {
                        if (r.push(c), s[c] === d) throw r.splice(0, h(r, c)), new Error("Cyclic dependency: " + r.join(" -> "));
                        if (s[c] = d, I(a)) q.push(c, [function() {
                            return b.get(a)
                        }], j);
                        else {
                            var e = b.annotate(a);
                            L(e, function(a) {
                                a !== c && i.hasOwnProperty(a) && n(i[a], a)
                            }), q.push(c, a, e)
                        }
                        r.pop(), s[c] = f
                    }
                }

                function o(a) {
                    return J(a) && a.then && a.$$promises
                }
                if (!J(i)) throw new Error("'invocables' must be an object");
                var p = g(i || {}),
                    q = [],
                    r = [],
                    s = {};
                return L(i, n), i = r = s = null,
                    function(d, f, g) {
                        function h() {
                            --u || (v || e(t, f.$$values), r.$$values = t, r.$$promises = r.$$promises || !0, delete r.$$inheritedValues, n.resolve(t))
                        }

                        function i(a) {
                            r.$$failure = a, n.reject(a)
                        }

                        function j(c, e, f) {
                            function j(a) {
                                l.reject(a), i(a)
                            }

                            function k() {
                                if (!G(r.$$failure)) try {
                                    l.resolve(b.invoke(e, g, t)), l.promise.then(function(a) {
                                        t[c] = a, h()
                                    }, j)
                                } catch (a) {
                                    j(a)
                                }
                            }
                            var l = a.defer(),
                                m = 0;
                            L(f, function(a) {
                                s.hasOwnProperty(a) && !d.hasOwnProperty(a) && (m++, s[a].then(function(b) {
                                    t[a] = b, --m || k()
                                }, j))
                            }), m || k(), s[c] = l.promise
                        }
                        if (o(d) && g === c && (g = f, f = d, d = null), d) {
                            if (!J(d)) throw new Error("'locals' must be an object")
                        } else d = k;
                        if (f) {
                            if (!o(f)) throw new Error("'parent' must be a promise returned by $resolve.resolve()")
                        } else f = m;
                        var n = a.defer(),
                            r = n.promise,
                            s = r.$$promises = {},
                            t = M({}, d),
                            u = 1 + q.length / 3,
                            v = !1;
                        if (G(f.$$failure)) return i(f.$$failure), r;
                        f.$$inheritedValues && e(t, l(f.$$inheritedValues, p)), M(s, f.$$promises), f.$$values ? (v = e(t, l(f.$$values, p)), r.$$inheritedValues = l(f.$$values, p), h()) : (f.$$inheritedValues && (r.$$inheritedValues = l(f.$$inheritedValues, p)), f.then(h, i));
                        for (var w = 0, x = q.length; x > w; w += 3) d.hasOwnProperty(q[w]) ? h() : j(q[w], q[w + 1], q[w + 2]);
                        return r
                    }
            }, this.resolve = function(a, b, c, d) {
                return this.study(a)(b, c, d)
            }
        }

        function p(a, b, c) {
            this.fromConfig = function(a, b, c) {
                return G(a.template) ? this.fromString(a.template, b) : G(a.templateUrl) ? this.fromUrl(a.templateUrl, b) : G(a.templateProvider) ? this.fromProvider(a.templateProvider, b, c) : null
            }, this.fromString = function(a, b) {
                return H(a) ? a(b) : a
            }, this.fromUrl = function(c, d) {
                return H(c) && (c = c(d)), null == c ? null : a.get(c, {
                    cache: b,
                    headers: {
                        Accept: "text/html"
                    }
                }).then(function(a) {
                    return a.data
                })
            }, this.fromProvider = function(a, b, d) {
                return c.invoke(a, null, d || {
                    params: b
                })
            }
        }

        function q(a, b, e) {
            function f(b, c, d, e) {
                if (q.push(b), o[b]) return o[b];
                if (!/^\w+(-+\w+)*(?:\[\])?$/.test(b)) throw new Error("Invalid parameter name '" + b + "' in pattern '" + a + "'");
                if (p[b]) throw new Error("Duplicate parameter name '" + b + "' in pattern '" + a + "'");
                return p[b] = new O.Param(b, c, d, e), p[b]
            }

            function g(a, b, c) {
                var d = ["", ""],
                    e = a.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
                if (!b) return e;
                switch (c) {
                    case !1:
                        d = ["(", ")"];
                        break;
                    case !0:
                        d = ["?(", ")?"];
                        break;
                    default:
                        d = ["(" + c + "|", ")?"]
                }
                return e + d[0] + b + d[1]
            }

            function h(c, e) {
                var f, g, h, i, j;
                return f = c[2] || c[3], j = b.params[f], h = a.substring(m, c.index), g = e ? c[4] : c[4] || ("*" == c[1] ? ".*" : null), i = O.type(g || "string") || d(O.type("string"), {
                    pattern: new RegExp(g)
                }), {
                    id: f,
                    regexp: g,
                    segment: h,
                    type: i,
                    cfg: j
                }
            }
            b = M({
                params: {}
            }, J(b) ? b : {});
            var i, j = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
                k = /([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
                l = "^",
                m = 0,
                n = this.segments = [],
                o = e ? e.params : {},
                p = this.params = e ? e.params.$$new() : new O.ParamSet,
                q = [];
            this.source = a;
            for (var r, s, t;
                (i = j.exec(a)) && (r = h(i, !1), !(r.segment.indexOf("?") >= 0));) s = f(r.id, r.type, r.cfg, "path"), l += g(r.segment, s.type.pattern.source, s.squash), n.push(r.segment), m = j.lastIndex;
            t = a.substring(m);
            var u = t.indexOf("?");
            if (u >= 0) {
                var v = this.sourceSearch = t.substring(u);
                if (t = t.substring(0, u), this.sourcePath = a.substring(0, m + u), v.length > 0)
                    for (m = 0; i = k.exec(v);) r = h(i, !0), s = f(r.id, r.type, r.cfg, "search"), m = j.lastIndex
            } else this.sourcePath = a, this.sourceSearch = "";
            l += g(t) + (b.strict === !1 ? "/?" : "") + "$", n.push(t), this.regexp = new RegExp(l, b.caseInsensitive ? "i" : c), this.prefix = n[0], this.$$paramNames = q
        }

        function r(a) {
            M(this, a)
        }

        function s() {
            function a(a) {
                return null != a ? a.toString().replace(/\//g, "%2F") : a
            }

            function e(a) {
                return null != a ? a.toString().replace(/%2F/g, "/") : a
            }

            function f(a) {
                return this.pattern.test(a)
            }

            function i() {
                return {
                    strict: t,
                    caseInsensitive: p
                }
            }

            function j(a) {
                return H(a) || K(a) && H(a[a.length - 1])
            }

            function k() {
                for (; x.length;) {
                    var a = x.shift();
                    if (a.pattern) throw new Error("You cannot override a type's .pattern at runtime.");
                    b.extend(v[a.name], o.invoke(a.def))
                }
            }

            function l(a) {
                M(this, a || {})
            }
            O = this;
            var o, p = !1,
                t = !0,
                u = !1,
                v = {},
                w = !0,
                x = [],
                y = {
                    string: {
                        encode: a,
                        decode: e,
                        is: f,
                        pattern: /[^\/]*/
                    },
                    "int": {
                        encode: a,
                        decode: function(a) {
                            return parseInt(a, 10)
                        },
                        is: function(a) {
                            return G(a) && this.decode(a.toString()) === a
                        },
                        pattern: /\d+/
                    },
                    bool: {
                        encode: function(a) {
                            return a ? 1 : 0
                        },
                        decode: function(a) {
                            return 0 !== parseInt(a, 10)
                        },
                        is: function(a) {
                            return a === !0 || a === !1
                        },
                        pattern: /0|1/
                    },
                    date: {
                        encode: function(a) {
                            return this.is(a) ? [a.getFullYear(), ("0" + (a.getMonth() + 1)).slice(-2), ("0" + a.getDate()).slice(-2)].join("-") : c
                        },
                        decode: function(a) {
                            if (this.is(a)) return a;
                            var b = this.capture.exec(a);
                            return b ? new Date(b[1], b[2] - 1, b[3]) : c
                        },
                        is: function(a) {
                            return a instanceof Date && !isNaN(a.valueOf())
                        },
                        equals: function(a, b) {
                            return this.is(a) && this.is(b) && a.toISOString() === b.toISOString()
                        },
                        pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
                        capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
                    },
                    json: {
                        encode: b.toJson,
                        decode: b.fromJson,
                        is: b.isObject,
                        equals: b.equals,
                        pattern: /[^\/]*/
                    },
                    any: {
                        encode: b.identity,
                        decode: b.identity,
                        is: b.identity,
                        equals: b.equals,
                        pattern: /.*/
                    }
                };
            s.$$getDefaultValue = function(a) {
                if (!j(a.value)) return a.value;
                if (!o) throw new Error("Injectable functions cannot be called at configuration time");
                return o.invoke(a.value)
            }, this.caseInsensitive = function(a) {
                return G(a) && (p = a), p
            }, this.strictMode = function(a) {
                return G(a) && (t = a), t
            }, this.defaultSquashPolicy = function(a) {
                if (!G(a)) return u;
                if (a !== !0 && a !== !1 && !I(a)) throw new Error("Invalid squash policy: " + a + ". Valid policies: false, true, arbitrary-string");
                return u = a, a
            }, this.compile = function(a, b) {
                return new q(a, M(i(), b))
            }, this.isMatcher = function(a) {
                if (!J(a)) return !1;
                var b = !0;
                return L(q.prototype, function(c, d) {
                    H(c) && (b = b && G(a[d]) && H(a[d]))
                }), b
            }, this.type = function(a, b, c) {
                if (!G(b)) return v[a];
                if (v.hasOwnProperty(a)) throw new Error("A type named '" + a + "' has already been defined.");
                return v[a] = new r(M({
                    name: a
                }, b)), c && (x.push({
                    name: a,
                    def: c
                }), w || k()), this
            }, L(y, function(a, b) {
                v[b] = new r(M({
                    name: b
                }, a))
            }), v = d(v, {}), this.$get = ["$injector", function(a) {
                return o = a, w = !1, k(), L(y, function(a, b) {
                    v[b] || (v[b] = new r(a))
                }), this
            }], this.Param = function(a, b, d, e) {
                function f(a) {
                    var b = J(a) ? g(a) : [],
                        c = -1 === h(b, "value") && -1 === h(b, "type") && -1 === h(b, "squash") && -1 === h(b, "array");
                    return c && (a = {
                        value: a
                    }), a.$$fn = j(a.value) ? a.value : function() {
                        return a.value
                    }, a
                }

                function i(b, c, d) {
                    if (b.type && c) throw new Error("Param '" + a + "' has two type configurations.");
                    return c ? c : b.type ? b.type instanceof r ? b.type : new r(b.type) : "config" === d ? v.any : v.string
                }

                function k() {
                    var b = {
                            array: "search" === e ? "auto" : !1
                        },
                        c = a.match(/\[\]$/) ? {
                            array: !0
                        } : {};
                    return M(b, c, d).array
                }

                function l(a, b) {
                    var c = a.squash;
                    if (!b || c === !1) return !1;
                    if (!G(c) || null == c) return u;
                    if (c === !0 || I(c)) return c;
                    throw new Error("Invalid squash policy: '" + c + "'. Valid policies: false, true, or arbitrary string")
                }

                function p(a, b, d, e) {
                    var f, g, i = [{
                        from: "",
                        to: d || b ? c : ""
                    }, {
                        from: null,
                        to: d || b ? c : ""
                    }];
                    return f = K(a.replace) ? a.replace : [], I(e) && f.push({
                        from: e,
                        to: c
                    }), g = n(f, function(a) {
                        return a.from
                    }), m(i, function(a) {
                        return -1 === h(g, a.from)
                    }).concat(f)
                }

                function q() {
                    if (!o) throw new Error("Injectable functions cannot be called at configuration time");
                    return o.invoke(d.$$fn)
                }

                function s(a) {
                    function b(a) {
                        return function(b) {
                            return b.from === a
                        }
                    }

                    function c(a) {
                        var c = n(m(w.replace, b(a)), function(a) {
                            return a.to
                        });
                        return c.length ? c[0] : a
                    }
                    return a = c(a), G(a) ? w.type.decode(a) : q()
                }

                function t() {
                    return "{Param:" + a + " " + b + " squash: '" + z + "' optional: " + y + "}"
                }
                var w = this;
                d = f(d), b = i(d, b, e);
                var x = k();
                b = x ? b.$asArray(x, "search" === e) : b, "string" !== b.name || x || "path" !== e || d.value !== c || (d.value = "");
                var y = d.value !== c,
                    z = l(d, y),
                    A = p(d, x, y, z);
                M(this, {
                    id: a,
                    type: b,
                    location: e,
                    array: x,
                    squash: z,
                    replace: A,
                    isOptional: y,
                    value: s,
                    dynamic: c,
                    config: d,
                    toString: t
                })
            }, l.prototype = {
                $$new: function() {
                    return d(this, M(new l, {
                        $$parent: this
                    }))
                },
                $$keys: function() {
                    for (var a = [], b = [], c = this, d = g(l.prototype); c;) b.push(c), c = c.$$parent;
                    return b.reverse(), L(b, function(b) {
                        L(g(b), function(b) {
                            -1 === h(a, b) && -1 === h(d, b) && a.push(b)
                        })
                    }), a
                },
                $$values: function(a) {
                    var b = {},
                        c = this;
                    return L(c.$$keys(), function(d) {
                        b[d] = c[d].value(a && a[d])
                    }), b
                },
                $$equals: function(a, b) {
                    var c = !0,
                        d = this;
                    return L(d.$$keys(), function(e) {
                        var f = a && a[e],
                            g = b && b[e];
                        d[e].type.equals(f, g) || (c = !1)
                    }), c
                },
                $$validates: function(a) {
                    var b, c, d, e = !0,
                        f = this;
                    return L(this.$$keys(), function(g) {
                        d = f[g], c = a[g], b = !c && d.isOptional, e = e && (b || !!d.type.is(c))
                    }), e
                },
                $$parent: c
            }, this.ParamSet = l
        }

        function t(a, d) {
            function e(a) {
                var b = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);
                return null != b ? b[1].replace(/\\(.)/g, "$1") : ""
            }

            function f(a, b) {
                return a.replace(/\$(\$|\d{1,2})/, function(a, c) {
                    return b["$" === c ? 0 : Number(c)]
                })
            }

            function g(a, b, c) {
                if (!c) return !1;
                var d = a.invoke(b, b, {
                    $match: c
                });
                return G(d) ? d : !0
            }

            function h(d, e, f, g) {
                function h(a, b, c) {
                    return "/" === p ? a : b ? p.slice(0, -1) + a : c ? p.slice(1) + a : a
                }

                function m(a) {
                    function b(a) {
                        var b = a(f, d);
                        return b ? (I(b) && d.replace().url(b), !0) : !1
                    }
                    if (!a || !a.defaultPrevented) {
                        var e = o && d.url() === o;
                        if (o = c, e) return !0;
                        var g, h = j.length;
                        for (g = 0; h > g; g++)
                            if (b(j[g])) return;
                        k && b(k)
                    }
                }

                function n() {
                    return i = i || e.$on("$locationChangeSuccess", m)
                }
                var o, p = g.baseHref(),
                    q = d.url();
                return l || n(), {
                    sync: function() {
                        m()
                    },
                    listen: function() {
                        return n()
                    },
                    update: function(a) {
                        return a ? void(q = d.url()) : void(d.url() !== q && (d.url(q), d.replace()))
                    },
                    push: function(a, b, e) {
                        d.url(a.format(b || {})), o = e && e.$$avoidResync ? d.url() : c, e && e.replace && d.replace()
                    },
                    href: function(c, e, f) {
                        if (!c.validates(e)) return null;
                        var g = a.html5Mode();
                        b.isObject(g) && (g = g.enabled);
                        var i = c.format(e);
                        if (f = f || {}, g || null === i || (i = "#" + a.hashPrefix() + i), i = h(i, g, f.absolute), !f.absolute || !i) return i;
                        var j = !g && i ? "/" : "",
                            k = d.port();
                        return k = 80 === k || 443 === k ? "" : ":" + k, [d.protocol(), "://", d.host(), k, j, i].join("")
                    }
                }
            }
            var i, j = [],
                k = null,
                l = !1;
            this.rule = function(a) {
                if (!H(a)) throw new Error("'rule' must be a function");
                return j.push(a), this
            }, this.otherwise = function(a) {
                if (I(a)) {
                    var b = a;
                    a = function() {
                        return b
                    }
                } else if (!H(a)) throw new Error("'rule' must be a function");
                return k = a, this
            }, this.when = function(a, b) {
                var c, h = I(b);
                if (I(a) && (a = d.compile(a)), !h && !H(b) && !K(b)) throw new Error("invalid 'handler' in when()");
                var i = {
                        matcher: function(a, b) {
                            return h && (c = d.compile(b), b = ["$match", function(a) {
                                return c.format(a)
                            }]), M(function(c, d) {
                                return g(c, b, a.exec(d.path(), d.search()))
                            }, {
                                prefix: I(a.prefix) ? a.prefix : ""
                            })
                        },
                        regex: function(a, b) {
                            if (a.global || a.sticky) throw new Error("when() RegExp must not be global or sticky");
                            return h && (c = b, b = ["$match", function(a) {
                                return f(c, a)
                            }]), M(function(c, d) {
                                return g(c, b, a.exec(d.path()))
                            }, {
                                prefix: e(a)
                            })
                        }
                    },
                    j = {
                        matcher: d.isMatcher(a),
                        regex: a instanceof RegExp
                    };
                for (var k in j)
                    if (j[k]) return this.rule(i[k](a, b));
                throw new Error("invalid 'what' in when()")
            }, this.deferIntercept = function(a) {
                a === c && (a = !0), l = a
            }, this.$get = h, h.$inject = ["$location", "$rootScope", "$injector", "$browser"]
        }

        function u(a, e) {
            function f(a) {
                return 0 === a.indexOf(".") || 0 === a.indexOf("^")
            }

            function l(a, b) {
                if (!a) return c;
                var d = I(a),
                    e = d ? a : a.name,
                    g = f(e);
                if (g) {
                    if (!b) throw new Error("No reference point given for path '" + e + "'");
                    b = l(b);
                    for (var h = e.split("."), i = 0, j = h.length, k = b; j > i; i++)
                        if ("" !== h[i] || 0 !== i) {
                            if ("^" !== h[i]) break;
                            if (!k.parent) throw new Error("Path '" + e + "' not valid for state '" + b.name + "'");
                            k = k.parent
                        } else k = b;
                    h = h.slice(i).join("."), e = k.name + (k.name && h ? "." : "") + h
                }
                var m = y[e];
                return !m || !d && (d || m !== a && m.self !== a) ? c : m
            }

            function m(a, b) {
                z[a] || (z[a] = []), z[a].push(b)
            }

            function o(a) {
                for (var b = z[a] || []; b.length;) p(b.shift())
            }

            function p(b) {
                b = d(b, {
                    self: b,
                    resolve: b.resolve || {},
                    toString: function() {
                        return this.name
                    }
                });
                var c = b.name;
                if (!I(c) || c.indexOf("@") >= 0) throw new Error("State must have a valid name");
                if (y.hasOwnProperty(c)) throw new Error("State '" + c + "'' is already defined");
                var e = -1 !== c.indexOf(".") ? c.substring(0, c.lastIndexOf(".")) : I(b.parent) ? b.parent : J(b.parent) && I(b.parent.name) ? b.parent.name : "";
                if (e && !y[e]) return m(e, b.self);
                for (var f in B) H(B[f]) && (b[f] = B[f](b, B.$delegates[f]));
                return y[c] = b, !b[A] && b.url && a.when(b.url, ["$match", "$stateParams", function(a, c) {
                    x.$current.navigable == b && j(a, c) || x.transitionTo(b, a, {
                        inherit: !0,
                        location: !1
                    })
                }]), o(c), b
            }

            function q(a) {
                return a.indexOf("*") > -1
            }

            function r(a) {
                var b = a.split("."),
                    c = x.$current.name.split(".");
                if ("**" === b[0] && (c = c.slice(h(c, b[1])), c.unshift("**")), "**" === b[b.length - 1] && (c.splice(h(c, b[b.length - 2]) + 1, Number.MAX_VALUE), c.push("**")), b.length != c.length) return !1;
                for (var d = 0, e = b.length; e > d; d++) "*" === b[d] && (c[d] = "*");
                return c.join("") === b.join("")
            }

            function s(a, b) {
                return I(a) && !G(b) ? B[a] : H(b) && I(a) ? (B[a] && !B.$delegates[a] && (B.$delegates[a] = B[a]), B[a] = b, this) : this
            }

            function t(a, b) {
                return J(a) ? b = a : b.name = a, p(b), this
            }

            function u(a, e, f, h, m, o, p, s, t) {
                function u(b, c, d, f) {
                    var g = a.$broadcast("$stateNotFound", b, c, d);
                    if (g.defaultPrevented) return p.update(), D;
                    if (!g.retry) return null;
                    if (f.$retry) return p.update(), E;
                    var h = x.transition = e.when(g.retry);
                    return h.then(function() {
                        return h !== x.transition ? B : (b.options.$retry = !0, x.transitionTo(b.to, b.toParams, b.options))
                    }, function() {
                        return D
                    }), p.update(), h
                }

                function z(a, c, d, g, i, j) {
                    var l = d ? c : k(a.params.$$keys(), c),
                        n = {
                            $stateParams: l
                        };
                    i.resolve = m.resolve(a.resolve, n, i.resolve, a);
                    var o = [i.resolve.then(function(a) {
                        i.globals = a
                    })];
                    return g && o.push(g), L(a.views, function(c, d) {
                        var e = c.resolve && c.resolve !== a.resolve ? c.resolve : {};
                        e.$template = [function() {
                            return f.load(d, {
                                view: c,
                                locals: n,
                                params: l,
                                notify: j.notify
                            }) || ""
                        }], o.push(m.resolve(e, n, i.resolve, a).then(function(f) {
                            if (H(c.controllerProvider) || K(c.controllerProvider)) {
                                var g = b.extend({}, e, n);
                                f.$$controller = h.invoke(c.controllerProvider, null, g)
                            } else f.$$controller = c.controller;
                            f.$$state = a, f.$$controllerAs = c.controllerAs, i[d] = f
                        }))
                    }), e.all(o).then(function(a) {
                        return i
                    })
                }
                var B = e.reject(new Error("transition superseded")),
                    C = e.reject(new Error("transition prevented")),
                    D = e.reject(new Error("transition aborted")),
                    E = e.reject(new Error("transition failed"));
                return w.locals = {
                    resolve: null,
                    globals: {
                        $stateParams: {}
                    }
                }, x = {
                    params: {},
                    current: w.self,
                    $current: w,
                    transition: null
                }, x.reload = function() {
                    return x.transitionTo(x.current, o, {
                        reload: !0,
                        inherit: !1,
                        notify: !0
                    })
                }, x.go = function(a, b, c) {
                    return x.transitionTo(a, b, M({
                        inherit: !0,
                        relative: x.$current
                    }, c))
                }, x.transitionTo = function(b, c, f) {
                    c = c || {}, f = M({
                        location: !0,
                        inherit: !1,
                        relative: null,
                        notify: !0,
                        reload: !1,
                        $retry: !1
                    }, f || {});
                    var g, j = x.$current,
                        m = x.params,
                        n = j.path,
                        q = l(b, f.relative);
                    if (!G(q)) {
                        var r = {
                                to: b,
                                toParams: c,
                                options: f
                            },
                            s = u(r, j.self, m, f);
                        if (s) return s;
                        if (b = r.to, c = r.toParams, f = r.options, q = l(b, f.relative), !G(q)) {
                            if (!f.relative) throw new Error("No such state '" + b + "'");
                            throw new Error("Could not resolve '" + b + "' from state '" + f.relative + "'")
                        }
                    }
                    if (q[A]) throw new Error("Cannot transition to abstract state '" + b + "'");
                    if (f.inherit && (c = i(o, c || {}, x.$current, q)), !q.params.$$validates(c)) return E;
                    c = q.params.$$values(c), b = q;
                    var t = b.path,
                        y = 0,
                        D = t[y],
                        F = w.locals,
                        H = [];
                    if (!f.reload)
                        for (; D && D === n[y] && D.ownParams.$$equals(c, m);) F = H[y] = D.locals, y++, D = t[y];
                    if (v(b, j, F, f)) return b.self.reloadOnSearch !== !1 && p.update(), x.transition = null, e.when(x.current);
                    if (c = k(b.params.$$keys(), c || {}), f.notify && a.$broadcast("$stateChangeStart", b.self, c, j.self, m).defaultPrevented) return p.update(), C;
                    for (var I = e.when(F), J = y; J < t.length; J++, D = t[J]) F = H[J] = d(F), I = z(D, c, D === b, I, F, f);
                    var K = x.transition = I.then(function() {
                        var d, e, g;
                        if (x.transition !== K) return B;
                        for (d = n.length - 1; d >= y; d--) g = n[d], g.self.onExit && h.invoke(g.self.onExit, g.self, g.locals.globals), g.locals = null;
                        for (d = y; d < t.length; d++) e = t[d], e.locals = H[d], e.self.onEnter && h.invoke(e.self.onEnter, e.self, e.locals.globals);
                        return x.transition !== K ? B : (x.$current = b, x.current = b.self, x.params = c, N(x.params, o), x.transition = null, f.location && b.navigable && p.push(b.navigable.url, b.navigable.locals.globals.$stateParams, {
                            $$avoidResync: !0,
                            replace: "replace" === f.location
                        }), f.notify && a.$broadcast("$stateChangeSuccess", b.self, c, j.self, m), p.update(!0), x.current)
                    }, function(d) {
                        return x.transition !== K ? B : (x.transition = null, g = a.$broadcast("$stateChangeError", b.self, c, j.self, m, d), g.defaultPrevented || p.update(), e.reject(d))
                    });
                    return K
                }, x.is = function(a, b, d) {
                    d = M({
                        relative: x.$current
                    }, d || {});
                    var e = l(a, d.relative);
                    return G(e) ? x.$current !== e ? !1 : b ? j(e.params.$$values(b), o) : !0 : c
                }, x.includes = function(a, b, d) {
                    if (d = M({
                            relative: x.$current
                        }, d || {}), I(a) && q(a)) {
                        if (!r(a)) return !1;
                        a = x.$current.name
                    }
                    var e = l(a, d.relative);
                    return G(e) ? G(x.$current.includes[e.name]) ? b ? j(e.params.$$values(b), o, g(b)) : !0 : !1 : c
                }, x.href = function(a, b, d) {
                    d = M({
                        lossy: !0,
                        inherit: !0,
                        absolute: !1,
                        relative: x.$current
                    }, d || {});
                    var e = l(a, d.relative);
                    if (!G(e)) return null;
                    d.inherit && (b = i(o, b || {}, x.$current, e));
                    var f = e && d.lossy ? e.navigable : e;
                    return f && f.url !== c && null !== f.url ? p.href(f.url, k(e.params.$$keys(), b || {}), {
                        absolute: d.absolute
                    }) : null
                }, x.get = function(a, b) {
                    if (0 === arguments.length) return n(g(y), function(a) {
                        return y[a].self
                    });
                    var c = l(a, b || x.$current);
                    return c && c.self ? c.self : null
                }, x
            }

            function v(a, b, c, d) {
                return a !== b || (c !== b.locals || d.reload) && a.self.reloadOnSearch !== !1 ? void 0 : !0
            }
            var w, x, y = {},
                z = {},
                A = "abstract",
                B = {
                    parent: function(a) {
                        if (G(a.parent) && a.parent) return l(a.parent);
                        var b = /^(.+)\.[^.]+$/.exec(a.name);
                        return b ? l(b[1]) : w
                    },
                    data: function(a) {
                        return a.parent && a.parent.data && (a.data = a.self.data = M({}, a.parent.data, a.data)), a.data
                    },
                    url: function(a) {
                        var b = a.url,
                            c = {
                                params: a.params || {}
                            };
                        if (I(b)) return "^" == b.charAt(0) ? e.compile(b.substring(1), c) : (a.parent.navigable || w).url.concat(b, c);
                        if (!b || e.isMatcher(b)) return b;
                        throw new Error("Invalid url '" + b + "' in state '" + a + "'")
                    },
                    navigable: function(a) {
                        return a.url ? a : a.parent ? a.parent.navigable : null
                    },
                    ownParams: function(a) {
                        var b = a.url && a.url.params || new O.ParamSet;
                        return L(a.params || {}, function(a, c) {
                            b[c] || (b[c] = new O.Param(c, null, a, "config"))
                        }), b
                    },
                    params: function(a) {
                        return a.parent && a.parent.params ? M(a.parent.params.$$new(), a.ownParams) : new O.ParamSet
                    },
                    views: function(a) {
                        var b = {};
                        return L(G(a.views) ? a.views : {
                            "": a
                        }, function(c, d) {
                            d.indexOf("@") < 0 && (d += "@" + a.parent.name), b[d] = c
                        }), b
                    },
                    path: function(a) {
                        return a.parent ? a.parent.path.concat(a) : []
                    },
                    includes: function(a) {
                        var b = a.parent ? M({}, a.parent.includes) : {};
                        return b[a.name] = !0, b
                    },
                    $delegates: {}
                };
            w = p({
                name: "",
                url: "^",
                views: null,
                "abstract": !0
            }), w.navigable = null, this.decorator = s, this.state = t, this.$get = u, u.$inject = ["$rootScope", "$q", "$view", "$injector", "$resolve", "$stateParams", "$urlRouter", "$location", "$urlMatcherFactory"]
        }

        function v() {
            function a(a, b) {
                return {
                    load: function(c, d) {
                        var e, f = {
                            template: null,
                            controller: null,
                            view: null,
                            locals: null,
                            notify: !0,
                            async: !0,
                            params: {}
                        };
                        return d = M(f, d), d.view && (e = b.fromConfig(d.view, d.params, d.locals)), e && d.notify && a.$broadcast("$viewContentLoading", d), e
                    }
                }
            }
            this.$get = a, a.$inject = ["$rootScope", "$templateFactory"]
        }

        function w() {
            var a = !1;
            this.useAnchorScroll = function() {
                a = !0
            }, this.$get = ["$anchorScroll", "$timeout", function(b, c) {
                return a ? b : function(a) {
                    c(function() {
                        a[0].scrollIntoView()
                    }, 0, !1)
                }
            }]
        }

        function x(a, c, d, e) {
            function f() {
                return c.has ? function(a) {
                    return c.has(a) ? c.get(a) : null
                } : function(a) {
                    try {
                        return c.get(a)
                    } catch (b) {
                        return null
                    }
                }
            }

            function g(a, b) {
                var c = function() {
                    return {
                        enter: function(a, b, c) {
                            b.after(a), c()
                        },
                        leave: function(a, b) {
                            a.remove(), b()
                        }
                    }
                };
                if (j) return {
                    enter: function(a, b, c) {
                        var d = j.enter(a, null, b, c);
                        d && d.then && d.then(c)
                    },
                    leave: function(a, b) {
                        var c = j.leave(a, b);
                        c && c.then && c.then(b)
                    }
                };
                if (i) {
                    var d = i && i(b, a);
                    return {
                        enter: function(a, b, c) {
                            d.enter(a, null, b), c()
                        },
                        leave: function(a, b) {
                            d.leave(a), b()
                        }
                    }
                }
                return c()
            }
            var h = f(),
                i = h("$animator"),
                j = h("$animate"),
                k = {
                    restrict: "ECA",
                    terminal: !0,
                    priority: 400,
                    transclude: "element",
                    compile: function(c, f, h) {
                        return function(c, f, i) {
                            function j() {
                                l && (l.remove(), l = null), n && (n.$destroy(), n = null), m && (r.leave(m, function() {
                                    l = null
                                }), l = m, m = null)
                            }

                            function k(g) {
                                var k, l = z(c, i, f, e),
                                    s = l && a.$current && a.$current.locals[l];
                                if (g || s !== o) {
                                    k = c.$new(), o = a.$current.locals[l];
                                    var t = h(k, function(a) {
                                        r.enter(a, f, function() {
                                            n && n.$emit("$viewContentAnimationEnded"), (b.isDefined(q) && !q || c.$eval(q)) && d(a)
                                        }), j()
                                    });
                                    m = t, n = k, n.$emit("$viewContentLoaded"), n.$eval(p)
                                }
                            }
                            var l, m, n, o, p = i.onload || "",
                                q = i.autoscroll,
                                r = g(i, c);
                            c.$on("$stateChangeSuccess", function() {
                                k(!1)
                            }), c.$on("$viewContentLoading", function() {
                                k(!1)
                            }), k(!0)
                        }
                    }
                };
            return k
        }

        function y(a, b, c, d) {
            return {
                restrict: "ECA",
                priority: -400,
                compile: function(e) {
                    var f = e.html();
                    return function(e, g, h) {
                        var i = c.$current,
                            j = z(e, h, g, d),
                            k = i && i.locals[j];
                        if (k) {
                            g.data("$uiView", {
                                name: j,
                                state: k.$$state
                            }), g.html(k.$template ? k.$template : f);
                            var l = a(g.contents());
                            if (k.$$controller) {
                                k.$scope = e;
                                var m = b(k.$$controller, k);
                                k.$$controllerAs && (e[k.$$controllerAs] = m), g.data("$ngControllerController", m), g.children().data("$ngControllerController", m)
                            }
                            l(e)
                        }
                    }
                }
            }
        }

        function z(a, b, c, d) {
            var e = d(b.uiView || b.name || "")(a),
                f = c.inheritedData("$uiView");
            return e.indexOf("@") >= 0 ? e : e + "@" + (f ? f.state.name : "")
        }

        function A(a, b) {
            var c, d = a.match(/^\s*({[^}]*})\s*$/);
            if (d && (a = b + "(" + d[1] + ")"), c = a.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/), !c || 4 !== c.length) throw new Error("Invalid state ref '" + a + "'");
            return {
                state: c[1],
                paramExpr: c[3] || null
            }
        }

        function B(a) {
            var b = a.parent().inheritedData("$uiView");
            return b && b.state && b.state.name ? b.state : void 0
        }

        function C(a, c) {
            var d = ["location", "inherit", "reload"];
            return {
                restrict: "A",
                require: ["?^uiSrefActive", "?^uiSrefActiveEq"],
                link: function(e, f, g, h) {
                    var i = A(g.uiSref, a.current.name),
                        j = null,
                        k = B(f) || a.$current,
                        l = null,
                        m = "A" === f.prop("tagName"),
                        n = "FORM" === f[0].nodeName,
                        o = n ? "action" : "href",
                        p = !0,
                        q = {
                            relative: k,
                            inherit: !0
                        },
                        r = e.$eval(g.uiSrefOpts) || {};
                    b.forEach(d, function(a) {
                        a in r && (q[a] = r[a])
                    });
                    var s = function(c) {
                        if (c && (j = b.copy(c)), p) {
                            l = a.href(i.state, j, q);
                            var d = h[1] || h[0];
                            return d && d.$$setStateInfo(i.state, j), null === l ? (p = !1, !1) : void g.$set(o, l)
                        }
                    };
                    i.paramExpr && (e.$watch(i.paramExpr, function(a, b) {
                        a !== j && s(a)
                    }, !0), j = b.copy(e.$eval(i.paramExpr))), s(), n || f.bind("click", function(b) {
                        var d = b.which || b.button;
                        if (!(d > 1 || b.ctrlKey || b.metaKey || b.shiftKey || f.attr("target"))) {
                            var e = c(function() {
                                a.go(i.state, j, q)
                            });
                            b.preventDefault();
                            var g = m && !l ? 1 : 0;
                            b.preventDefault = function() {
                                g-- <= 0 && c.cancel(e)
                            }
                        }
                    })
                }
            }
        }

        function D(a, b, c) {
            return {
                restrict: "A",
                controller: ["$scope", "$element", "$attrs", function(b, d, e) {
                    function f() {
                        g() ? d.addClass(j) : d.removeClass(j)
                    }

                    function g() {
                        return "undefined" != typeof e.uiSrefActiveEq ? h && a.is(h.name, i) : h && a.includes(h.name, i)
                    }
                    var h, i, j;
                    j = c(e.uiSrefActiveEq || e.uiSrefActive || "", !1)(b), this.$$setStateInfo = function(b, c) {
                        h = a.get(b, B(d)), i = c, f()
                    }, b.$on("$stateChangeSuccess", f)
                }]
            }
        }

        function E(a) {
            var b = function(b) {
                return a.is(b)
            };
            return b.$stateful = !0, b
        }

        function F(a) {
            var b = function(b) {
                return a.includes(b)
            };
            return b.$stateful = !0, b
        }
        var G = b.isDefined,
            H = b.isFunction,
            I = b.isString,
            J = b.isObject,
            K = b.isArray,
            L = b.forEach,
            M = b.extend,
            N = b.copy;
        b.module("ui.router.util", ["ng"]), b.module("ui.router.router", ["ui.router.util"]), b.module("ui.router.state", ["ui.router.router", "ui.router.util"]), b.module("ui.router", ["ui.router.state"]), b.module("ui.router.compat", ["ui.router"]), o.$inject = ["$q", "$injector"], b.module("ui.router.util").service("$resolve", o), p.$inject = ["$http", "$templateCache", "$injector"], b.module("ui.router.util").service("$templateFactory", p);
        var O;
        q.prototype.concat = function(a, b) {
            var c = {
                caseInsensitive: O.caseInsensitive(),
                strict: O.strictMode(),
                squash: O.defaultSquashPolicy()
            };
            return new q(this.sourcePath + a + this.sourceSearch, M(c, b), this)
        }, q.prototype.toString = function() {
            return this.source
        }, q.prototype.exec = function(a, b) {
            function c(a) {
                function b(a) {
                    return a.split("").reverse().join("")
                }

                function c(a) {
                    return a.replace(/\\-/, "-")
                }
                var d = b(a).split(/-(?!\\)/),
                    e = n(d, b);
                return n(e, c).reverse()
            }
            var d = this.regexp.exec(a);
            if (!d) return null;
            b = b || {};
            var e, f, g, h = this.parameters(),
                i = h.length,
                j = this.segments.length - 1,
                k = {};
            if (j !== d.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");
            for (e = 0; j > e; e++) {
                g = h[e];
                var l = this.params[g],
                    m = d[e + 1];
                for (f = 0; f < l.replace; f++) l.replace[f].from === m && (m = l.replace[f].to);
                m && l.array === !0 && (m = c(m)), k[g] = l.value(m)
            }
            for (; i > e; e++) g = h[e], k[g] = this.params[g].value(b[g]);
            return k
        }, q.prototype.parameters = function(a) {
            return G(a) ? this.params[a] || null : this.$$paramNames
        }, q.prototype.validates = function(a) {
            return this.params.$$validates(a)
        }, q.prototype.format = function(a) {
            function b(a) {
                return encodeURIComponent(a).replace(/-/g, function(a) {
                    return "%5C%" + a.charCodeAt(0).toString(16).toUpperCase()
                })
            }
            a = a || {};
            var c = this.segments,
                d = this.parameters(),
                e = this.params;
            if (!this.validates(a)) return null;
            var f, g = !1,
                h = c.length - 1,
                i = d.length,
                j = c[0];
            for (f = 0; i > f; f++) {
                var k = h > f,
                    l = d[f],
                    m = e[l],
                    o = m.value(a[l]),
                    p = m.isOptional && m.type.equals(m.value(), o),
                    q = p ? m.squash : !1,
                    r = m.type.encode(o);
                if (k) {
                    var s = c[f + 1];
                    if (q === !1) null != r && (j += K(r) ? n(r, b).join("-") : encodeURIComponent(r)), j += s;
                    else if (q === !0) {
                        var t = j.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
                        j += s.match(t)[1]
                    } else I(q) && (j += q + s)
                } else {
                    if (null == r || p && q !== !1) continue;
                    K(r) || (r = [r]), r = n(r, encodeURIComponent).join("&" + l + "="), j += (g ? "&" : "?") + (l + "=" + r), g = !0
                }
            }
            return j
        }, r.prototype.is = function(a, b) {
            return !0
        }, r.prototype.encode = function(a, b) {
            return a
        }, r.prototype.decode = function(a, b) {
            return a
        }, r.prototype.equals = function(a, b) {
            return a == b
        }, r.prototype.$subPattern = function() {
            var a = this.pattern.toString();
            return a.substr(1, a.length - 2)
        }, r.prototype.pattern = /.*/, r.prototype.toString = function() {
            return "{Type:" + this.name + "}"
        }, r.prototype.$asArray = function(a, b) {
            function d(a, b) {
                function d(a, b) {
                    return function() {
                        return a[b].apply(a, arguments)
                    }
                }

                function e(a) {
                    return K(a) ? a : G(a) ? [a] : []
                }

                function f(a) {
                    switch (a.length) {
                        case 0:
                            return c;
                        case 1:
                            return "auto" === b ? a[0] : a;
                        default:
                            return a
                    }
                }

                function g(a) {
                    return !a
                }

                function h(a, b) {
                    return function(c) {
                        c = e(c);
                        var d = n(c, a);
                        return b === !0 ? 0 === m(d, g).length : f(d)
                    }
                }

                function i(a) {
                    return function(b, c) {
                        var d = e(b),
                            f = e(c);
                        if (d.length !== f.length) return !1;
                        for (var g = 0; g < d.length; g++)
                            if (!a(d[g], f[g])) return !1;
                        return !0
                    }
                }
                this.encode = h(d(a, "encode")), this.decode = h(d(a, "decode")), this.is = h(d(a, "is"), !0), this.equals = i(d(a, "equals")), this.pattern = a.pattern, this.$arrayMode = b
            }
            if (!a) return this;
            if ("auto" === a && !b) throw new Error("'auto' array mode is for query parameters only");
            return new d(this, a)
        }, b.module("ui.router.util").provider("$urlMatcherFactory", s), b.module("ui.router.util").run(["$urlMatcherFactory", function(a) {}]), t.$inject = ["$locationProvider", "$urlMatcherFactoryProvider"], b.module("ui.router.router").provider("$urlRouter", t), u.$inject = ["$urlRouterProvider", "$urlMatcherFactoryProvider"], b.module("ui.router.state").value("$stateParams", {}).provider("$state", u), v.$inject = [], b.module("ui.router.state").provider("$view", v), b.module("ui.router.state").provider("$uiViewScroll", w), x.$inject = ["$state", "$injector", "$uiViewScroll", "$interpolate"], y.$inject = ["$compile", "$controller", "$state", "$interpolate"], b.module("ui.router.state").directive("uiView", x), b.module("ui.router.state").directive("uiView", y), C.$inject = ["$state", "$timeout"], D.$inject = ["$state", "$stateParams", "$interpolate"], b.module("ui.router.state").directive("uiSref", C).directive("uiSrefActive", D).directive("uiSrefActiveEq", D), E.$inject = ["$state"], F.$inject = ["$state"], b.module("ui.router.state").filter("isState", E).filter("includedByState", F)
    }(window, window.angular),
    function() {
        "use strict";
        var a = angular.module("LocalStorageModule", []);
        a.provider("localStorageService", function() {
            this.prefix = "ls", this.storageType = "localStorage", this.cookie = {
                expiry: 30,
                path: "/"
            }, this.notify = {
                setItem: !0,
                removeItem: !1
            }, this.setPrefix = function(a) {
                this.prefix = a
            }, this.setStorageType = function(a) {
                this.storageType = a
            }, this.setStorageCookie = function(a, b) {
                this.cookie = {
                    expiry: a,
                    path: b
                }
            }, this.setStorageCookieDomain = function(a) {
                this.cookie.domain = a
            }, this.setNotify = function(a, b) {
                this.notify = {
                    setItem: a,
                    removeItem: b
                }
            }, this.$get = ["$rootScope", "$window", "$document", function(a, b, c) {
                var d, e = this,
                    f = e.prefix,
                    g = e.cookie,
                    h = e.notify,
                    i = e.storageType;
                c ? c[0] && (c = c[0]) : c = document, "." !== f.substr(-1) && (f = f ? f + "." : "");
                var j = function(a) {
                        return f + a
                    },
                    k = function() {
                        try {
                            var c = i in b && null !== b[i],
                                e = j("__" + Math.round(1e7 * Math.random()));
                            return c && (d = b[i], d.setItem(e, ""), d.removeItem(e)), c
                        } catch (f) {
                            return i = "cookie", a.$broadcast("LocalStorageModule.notification.error", f.message), !1
                        }
                    }(),
                    l = function(b, c) {
                        if (!k || "cookie" === e.storageType) return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), h.setItem && a.$broadcast("LocalStorageModule.notification.setitem", {
                            key: b,
                            newvalue: c,
                            storageType: "cookie"
                        }), r(b, c);
                        "undefined" == typeof c && (c = null);
                        try {
                            (angular.isObject(c) || angular.isArray(c)) && (c = angular.toJson(c)), d && d.setItem(j(b), c), h.setItem && a.$broadcast("LocalStorageModule.notification.setitem", {
                                key: b,
                                newvalue: c,
                                storageType: e.storageType
                            })
                        } catch (f) {
                            return a.$broadcast("LocalStorageModule.notification.error", f.message), r(b, c)
                        }
                        return !0
                    },
                    m = function(b) {
                        if (!k || "cookie" === e.storageType) return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), s(b);
                        var c = d ? d.getItem(j(b)) : null;
                        return c && "null" !== c ? "{" === c.charAt(0) || "[" === c.charAt(0) ? angular.fromJson(c) : c : null
                    },
                    n = function(b) {
                        if (!k) return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), h.removeItem && a.$broadcast("LocalStorageModule.notification.removeitem", {
                            key: b,
                            storageType: "cookie"
                        }), t(b);
                        try {
                            d.removeItem(j(b)), h.removeItem && a.$broadcast("LocalStorageModule.notification.removeitem", {
                                key: b,
                                storageType: e.storageType
                            })
                        } catch (c) {
                            return a.$broadcast("LocalStorageModule.notification.error", c.message), t(b)
                        }
                        return !0
                    },
                    o = function() {
                        if (!k) return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), !1;
                        var b = f.length,
                            c = [];
                        for (var e in d)
                            if (e.substr(0, b) === f) try {
                                c.push(e.substr(b))
                            } catch (g) {
                                return a.$broadcast("LocalStorageModule.notification.error", g.Description), []
                            }
                        return c
                    },
                    p = function(b) {
                        b = b || "";
                        var c = f.slice(0, -1),
                            e = new RegExp(c + "." + b);
                        if (!k) return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), u();
                        var g = f.length;
                        for (var h in d)
                            if (e.test(h)) try {
                                n(h.substr(g))
                            } catch (i) {
                                return a.$broadcast("LocalStorageModule.notification.error", i.message), u()
                            }
                        return !0
                    },
                    q = function() {
                        try {
                            return navigator.cookieEnabled || "cookie" in c && (c.cookie.length > 0 || (c.cookie = "test").indexOf.call(c.cookie, "test") > -1)
                        } catch (b) {
                            return a.$broadcast("LocalStorageModule.notification.error", b.message), !1
                        }
                    },
                    r = function(b, d) {
                        if ("undefined" == typeof d) return !1;
                        if (!q()) return a.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"), !1;
                        try {
                            var e = "",
                                f = new Date,
                                h = "";
                            if (null === d ? (f.setTime(f.getTime() + -864e5), e = "; expires=" + f.toGMTString(), d = "") : 0 !== g.expiry && (f.setTime(f.getTime() + 24 * g.expiry * 60 * 60 * 1e3), e = "; expires=" + f.toGMTString()), b) {
                                var i = "; path=" + g.path;
                                g.domain && (h = "; domain=" + g.domain), c.cookie = j(b) + "=" + encodeURIComponent(d) + e + i + h
                            }
                        } catch (k) {
                            return a.$broadcast("LocalStorageModule.notification.error", k.message), !1
                        }
                        return !0
                    },
                    s = function(b) {
                        if (!q()) return a.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"), !1;
                        for (var d = c.cookie && c.cookie.split(";") || [], e = 0; e < d.length; e++) {
                            for (var g = d[e];
                                " " === g.charAt(0);) g = g.substring(1, g.length);
                            if (0 === g.indexOf(j(b) + "=")) return decodeURIComponent(g.substring(f.length + b.length + 1, g.length))
                        }
                        return null
                    },
                    t = function(a) {
                        r(a, null)
                    },
                    u = function() {
                        for (var a = null, b = f.length, d = c.cookie.split(";"), e = 0; e < d.length; e++) {
                            for (a = d[e];
                                " " === a.charAt(0);) a = a.substring(1, a.length);
                            var g = a.substring(b, a.indexOf("="));
                            t(g)
                        }
                    },
                    v = function() {
                        return i
                    },
                    w = function(a, b, c) {
                        var d = m(b);
                        null === d && angular.isDefined(c) ? d = c : angular.isObject(d) && angular.isObject(c) && (d = angular.extend(c, d)), a[b] = d, a.$watchCollection(b, function(a) {
                            l(b, a)
                        })
                    };
                return {
                    isSupported: k,
                    getStorageType: v,
                    set: l,
                    add: l,
                    get: m,
                    keys: o,
                    remove: n,
                    clearAll: p,
                    bind: w,
                    deriveKey: j,
                    cookie: {
                        set: r,
                        add: r,
                        get: s,
                        remove: t,
                        clearAll: u
                    }
                }
            }]
        })
    }.call(this);
var duScrollDefaultEasing = function(a) {
    "use strict";
    return .5 > a ? Math.pow(2 * a, 2) / 2 : 1 - Math.pow(2 * (1 - a), 2) / 2
};
angular.module("duScroll", ["duScroll.scrollspy", "duScroll.smoothScroll", "duScroll.scrollContainer", "duScroll.spyContext", "duScroll.scrollHelpers"]).value("duScrollDuration", 350).value("duScrollSpyWait", 100).value("duScrollGreedy", !1).value("duScrollOffset", 0).value("duScrollEasing", duScrollDefaultEasing), angular.module("duScroll.scrollHelpers", ["duScroll.requestAnimation"]).run(["$window", "$q", "cancelAnimation", "requestAnimation", "duScrollEasing", "duScrollDuration", "duScrollOffset", function(a, b, c, d, e, f, g) {
        "use strict";
        var h = angular.element.prototype,
            i = function(a) {
                return "undefined" != typeof HTMLDocument && a instanceof HTMLDocument || a.nodeType && a.nodeType === a.DOCUMENT_NODE
            },
            j = function(a) {
                return "undefined" != typeof HTMLElement && a instanceof HTMLElement || a.nodeType && a.nodeType === a.ELEMENT_NODE
            },
            k = function(a) {
                return j(a) || i(a) ? a : a[0]
            };
        h.scrollTo = function(b, c, d, e) {
            var f;
            if (angular.isElement(b) ? f = this.scrollToElement : d && (f = this.scrollToAnimated), f) return f.apply(this, arguments);
            var g = k(this);
            return i(g) ? a.scrollTo(b, c) : (g.scrollLeft = b, void(g.scrollTop = c))
        };
        var l, m;
        h.scrollToAnimated = function(a, f, g, h) {
            g && !h && (h = e);
            var i = this.scrollLeft(),
                j = this.scrollTop(),
                k = Math.round(a - i),
                n = Math.round(f - j),
                o = null,
                p = this,
                q = "scroll mousedown mousewheel touchmove keydown",
                r = function(a) {
                    (!a || a.which > 0) && (p.unbind(q, r), c(l), m.reject(), l = null)
                };
            if (l && r(), m = b.defer(), !k && !n) return m.resolve(), m.promise;
            var s = function(a) {
                null === o && (o = a);
                var b = a - o,
                    c = b >= g ? 1 : h(b / g);
                p.scrollTo(i + Math.ceil(k * c), j + Math.ceil(n * c)), 1 > c ? l = d(s) : (p.unbind(q, r), l = null, m.resolve())
            };
            return p.scrollTo(i, j), p.bind(q, r), l = d(s), m.promise
        }, h.scrollToElement = function(a, b, c, d) {
            var e = k(this);
            (!angular.isNumber(b) || isNaN(b)) && (b = g);
            var f = this.scrollTop() + k(a).getBoundingClientRect().top - b;
            return j(e) && (f -= e.getBoundingClientRect().top), this.scrollTo(0, f, c, d)
        };
        var n = {
            scrollLeft: function(b, c, d) {
                if (angular.isNumber(b)) return this.scrollTo(b, this.scrollTop(), c, d);
                var e = k(this);
                return i(e) ? a.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft : e.scrollLeft
            },
            scrollTop: function(b, c, d) {
                if (angular.isNumber(b)) return this.scrollTo(this.scrollTop(), b, c, d);
                var e = k(this);
                return i(e) ? a.scrollY || document.documentElement.scrollTop || document.body.scrollTop : e.scrollTop
            }
        };
        h.scrollToElementAnimated = function(a, b, c, d) {
            return this.scrollToElement(a, b, c || f, d)
        }, h.scrollTopAnimated = function(a, b, c) {
            return this.scrollTop(a, b || f, c)
        }, h.scrollLeftAnimated = function(a, b, c) {
            return this.scrollLeft(a, b || f, c)
        };
        var o = function(a, b) {
            return function(c, d, e) {
                return d ? b.apply(this, arguments) : a.apply(this, arguments)
            }
        };
        for (var p in n) h[p] = h[p] ? o(h[p], n[p]) : n[p]
    }]), angular.module("duScroll.polyfill", []).factory("polyfill", ["$window", function(a) {
        "use strict";
        var b = ["webkit", "moz", "o", "ms"];
        return function(c, d) {
            if (a[c]) return a[c];
            for (var e, f = c.substr(0, 1).toUpperCase() + c.substr(1), g = 0; g < b.length; g++)
                if (e = b[g] + f, a[e]) return a[e];
            return d
        }
    }]), angular.module("duScroll.requestAnimation", ["duScroll.polyfill"]).factory("requestAnimation", ["polyfill", "$timeout", function(a, b) {
        "use strict";
        var c = 0,
            d = function(a, d) {
                var e = (new Date).getTime(),
                    f = Math.max(0, 16 - (e - c)),
                    g = b(function() {
                        a(e + f)
                    }, f);
                return c = e + f, g
            };
        return a("requestAnimationFrame", d)
    }]).factory("cancelAnimation", ["polyfill", "$timeout", function(a, b) {
        "use strict";
        var c = function(a) {
            b.cancel(a)
        };
        return a("cancelAnimationFrame", c)
    }]), angular.module("duScroll.spyAPI", ["duScroll.scrollContainerAPI"]).factory("spyAPI", ["$rootScope", "$timeout", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", function(a, b, c, d, e) {
        "use strict";
        var f = function(c) {
                var f = !1,
                    g = !1,
                    h = function() {
                        g = !1;
                        var b = c.container,
                            e = b[0],
                            f = 0;
                        ("undefined" != typeof HTMLElement && e instanceof HTMLElement || e.nodeType && e.nodeType === e.ELEMENT_NODE) && (f = e.getBoundingClientRect().top);
                        var h, i, j, k, l, m;
                        for (k = c.spies, i = c.currentlyActive, j = void 0, h = 0; h < k.length; h++) l = k[h], m = l.getTargetPosition(), m && m.top + l.offset - f < 20 && -1 * m.top + f < m.height && (!j || j.top < m.top) && (j = {
                            top: m.top,
                            spy: l
                        });
                        j && (j = j.spy), i === j || d && !j || (i && (i.$element.removeClass("active"), a.$broadcast("duScrollspy:becameInactive", i.$element)), j && (j.$element.addClass("active"), a.$broadcast("duScrollspy:becameActive", j.$element)), c.currentlyActive = j)
                    };
                return e ? function() {
                    f ? g = !0 : (h(), f = b(function() {
                        f = !1, g && h()
                    }, e, !1))
                } : h
            },
            g = {},
            h = function(a) {
                var b = a.$id,
                    c = {
                        spies: []
                    };
                return c.handler = f(c), g[b] = c, a.$on("$destroy", function() {
                    i(a)
                }), b
            },
            i = function(a) {
                var b = a.$id,
                    c = g[b],
                    d = c.container;
                d && d.off("scroll", c.handler), delete g[b]
            },
            j = h(a),
            k = function(a) {
                return g[a.$id] ? g[a.$id] : a.$parent ? k(a.$parent) : g[j]
            },
            l = function(a) {
                var b, c, d = a.$element.scope();
                if (d) return k(d);
                for (c in g)
                    if (b = g[c], -1 !== b.spies.indexOf(a)) return b
            },
            m = function(a) {
                for (; a.parentNode;)
                    if (a = a.parentNode, a === document) return !0;
                return !1
            },
            n = function(a) {
                var b = l(a);
                b && (b.spies.push(a), b.container && m(b.container) || (b.container && b.container.off("scroll", b.handler), b.container = c.getContainer(a.$element.scope()), b.container.on("scroll", b.handler).triggerHandler("scroll")))
            },
            o = function(a) {
                var b = l(a);
                a === b.currentlyActive && (b.currentlyActive = null);
                var c = b.spies.indexOf(a); - 1 !== c && b.spies.splice(c, 1)
            };
        return {
            addSpy: n,
            removeSpy: o,
            createContext: h,
            destroyContext: i,
            getContextForScope: k
        }
    }]), angular.module("duScroll.scrollContainerAPI", []).factory("scrollContainerAPI", ["$document", function(a) {
        "use strict";
        var b = {},
            c = function(a, c) {
                var d = a.$id;
                return b[d] = c, d
            },
            d = function(a) {
                return b[a.$id] ? a.$id : a.$parent ? d(a.$parent) : void 0
            },
            e = function(c) {
                var e = d(c);
                return e ? b[e] : a
            },
            f = function(a) {
                var c = d(a);
                c && delete b[c]
            };
        return {
            getContainerId: d,
            getContainer: e,
            setContainer: c,
            removeContainer: f
        }
    }]), angular.module("duScroll.smoothScroll", ["duScroll.scrollHelpers", "duScroll.scrollContainerAPI"]).directive("duSmoothScroll", ["duScrollDuration", "duScrollOffset", "scrollContainerAPI", function(a, b, c) {
        "use strict";
        return {
            link: function(d, e, f) {
                e.on("click", function(e) {
                    if (f.href && -1 !== f.href.indexOf("#")) {
                        var g = document.getElementById(f.href.replace(/.*(?=#[^\s]+$)/, "").substring(1));
                        if (g && g.getBoundingClientRect) {
                            e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
                            var h = f.offset ? parseInt(f.offset, 10) : b,
                                i = f.duration ? parseInt(f.duration, 10) : a,
                                j = c.getContainer(d);
                            j.scrollToElement(angular.element(g), isNaN(h) ? 0 : h, isNaN(i) ? 0 : i)
                        }
                    }
                })
            }
        }
    }]), angular.module("duScroll.spyContext", ["duScroll.spyAPI"]).directive("duSpyContext", ["spyAPI", function(a) {
        "use strict";
        return {
            restrict: "A",
            scope: !0,
            compile: function(b, c, d) {
                return {
                    pre: function(b, c, d, e) {
                        a.createContext(b)
                    }
                }
            }
        }
    }]), angular.module("duScroll.scrollContainer", ["duScroll.scrollContainerAPI"]).directive("duScrollContainer", ["scrollContainerAPI", function(a) {
        "use strict";
        return {
            restrict: "A",
            scope: !0,
            compile: function(b, c, d) {
                return {
                    pre: function(b, c, d, e) {
                        d.$observe("duScrollContainer", function(d) {
                            angular.isString(d) && (d = document.getElementById(d)), d = angular.isElement(d) ? angular.element(d) : c, a.setContainer(b, d), b.$on("$destroy", function() {
                                a.removeContainer(b)
                            })
                        })
                    }
                }
            }
        }
    }]), angular.module("duScroll.scrollspy", ["duScroll.spyAPI"]).directive("duScrollspy", ["spyAPI", "duScrollOffset", "$timeout", "$rootScope", function(a, b, c, d) {
        "use strict";
        var e = function(a, b, c) {
            angular.isElement(a) ? this.target = a : angular.isString(a) && (this.targetId = a), this.$element = b, this.offset = c
        };
        return e.prototype.getTargetElement = function() {
            return !this.target && this.targetId && (this.target = document.getElementById(this.targetId)), this.target
        }, e.prototype.getTargetPosition = function() {
            var a = this.getTargetElement();
            return a ? a.getBoundingClientRect() : void 0
        }, e.prototype.flushTargetCache = function() {
            this.targetId && (this.target = void 0)
        }, {
            link: function(f, g, h) {
                var i, j = h.ngHref || h.href;
                j && -1 !== j.indexOf("#") ? i = j.replace(/.*(?=#[^\s]+$)/, "").substring(1) : h.duScrollspy && (i = h.duScrollspy), i && c(function() {
                    var c = new e(i, g, -(h.offset ? parseInt(h.offset, 10) : b));
                    a.addSpy(c), f.$on("$destroy", function() {
                        a.removeSpy(c)
                    }), f.$on("$locationChangeSuccess", c.flushTargetCache.bind(c)), d.$on("$stateChangeSuccess", c.flushTargetCache.bind(c))
                }, 0, !1)
            }
        }
    }]),
    function(a, b, c) {
        var d = b.module("hmTouchEvents", []),
            e = ["hmHold:hold", "hmTap:tap", "hmDoubletap:doubletap", "hmDrag:drag", "hmDragstart:dragstart", "hmDragend:dragend", "hmDragup:dragup", "hmDragdown:dragdown", "hmDragleft:dragleft", "hmDragright:dragright", "hmSwipe:swipe", "hmSwipeup:swipeup", "hmSwipedown:swipedown", "hmSwipeleft:swipeleft", "hmSwiperight:swiperight", "hmTransform:transform", "hmTransformstart:transformstart", "hmTransformend:transformend", "hmRotate:rotate", "hmPinch:pinch", "hmPinchin:pinchin", "hmPinchout:pinchout", "hmTouch:touch", "hmRelease:release"];
        b.forEach(e, function(a) {
            var b = a.split(":"),
                e = b[0],
                f = b[1];
            d.directive(e, ["$parse", "$window", function(a, b) {
                return {
                    restrict: "A, C",
                    link: function(d, g, h) {
                        var i, j = a(h[e]),
                            k = function(a) {
                                d.$apply(function() {
                                    j(d, {
                                        $event: a
                                    })
                                })
                            },
                            l = a(h.hmOptions)(d, {});
                        return "undefined" != typeof c && b.addEventListener ? ((i = g.data("hammer")) || (i = c(g[0], l), g.data("hammer", i)), i.on(f, k), void d.$on("$destroy", function() {
                            i.off(f, k)
                        })) : ("hmTap" === e && g.bind("click", k), void("hmDoubletap" === e && g.bind("dblclick", k)))
                    }
                }
            }])
        })
    }(window, window.angular, window.Hammer),
    function(a, b, c) {
        "use strict";
        var d = b.module("modGoogleAnalytics", []);
        d.value("modGaPathPrefix", {
            path: ""
        }), d.value("modGaDefaultCategory", {
            category: ""
        }), d.directive("modGaPath", function() {
            return {
                controller: ["$attrs", function(a) {
                    this.path = a.modGaPath
                }]
            }
        }), d.directive("modGaCategory", function() {
            return {
                controller: ["$attrs", function(a) {
                    this.category = a.modGaCategory
                }]
            }
        }), d.directive("modGaTrack", ["modGoogleAnalytics", "modGaPathPrefix", "modGaDefaultCategory", function(a, c, d) {
            return {
                require: ["?^modGaCategory", "?^modGaPath"],
                link: function(e, f, g, h) {
                    f.on("click", function() {
                        if (b.isDefined(g.modGaTrack)) {
                            var e = "Button",
                                f = h[0],
                                i = h[1];
                            b.isDefined(g.href) && ((0 === g.href.indexOf("//") || 0 === g.href.indexOf("http")) && (e = "Outgoing"), 0 === g.href.indexOf("mailto") && (e = "Mailto"));
                            var j = g.modGaTrack[0].toUpperCase() + g.modGaTrack.substr(1),
                                k = f ? f.category : d.category,
                                l = g.modGaAction ? g.modGaAction : e,
                                m = i ? i.path + " > [" + j + "]" : c.path ? c.path + " > [" + j + "]" : j;
                            a.trackEvent({
                                hitType: "event",
                                eventCategory: k,
                                eventAction: l,
                                eventLabel: m
                            })
                        }
                    })
                }
            }
        }]), d.provider("modGoogleAnalytics", [function() {
            var c, d = "auto",
                e = !1,
                f = !1,
                g = !1,
                h = !1,
                i = "$routeChangeSuccess",
                j = this;
            j.trackECommerce = function() {
                g = !0
            }, j.setAccountId = function(a) {
                c = a
            }, j.setAccount = j.setAccountId, j.setCookieConfig = function(a, c, e) {
                d = b.isUndefined(a.cookieName) ? {
                    cookieName: a,
                    cookieDomain: c,
                    cookieExpires: e
                } : a
            }, j.forceSSL = function() {
                e = !0
            }, j.setLocalMode = function() {
                d = {
                    cookieDomain: "none"
                }
            }, j.setDomain = function(a, c) {
                d = d || {}, b.isObject(d) && (d.cookieDomain = a, b.isDefined(c) && (d.cookieName = c))
            }, j.trackRoutes = function(a) {
                b.isDefined(a) && (i = a), f = !0
            }, j.trackFirstLoad = function() {
                h = !0
            }, j.$get = ["$window", "$rootScope", "$location", function(e, j, k) {
                var l = this,
                    m = function() {
                        ! function(a, b, c, d, e, f, g) {
                            a.GoogleAnalyticsObject = e, a[e] = a[e] || function() {
                                (a[e].q = a[e].q || []).push(arguments)
                            }, a[e].l = 1 * new Date, f = b.createElement(c), g = b.getElementsByTagName(c)[0], f.async = 1, f.src = d, g.parentNode.insertBefore(f, g)
                        }(a, document, "script", "//www.google-analytics.com/analytics.js", "ga"), e.ga("create", c, d)
                    };
                c && m(), l.trackPage = function(a, c) {
                    var d = {
                        hitType: "pageview",
                        page: a
                    };
                    b.isDefined(c) && (d.title = c), b.isDefined(e.ga) && e.ga("send", d)
                }, l.trackEvent = function(a, c, d, f) {
                    var g;
                    b.isDefined(a.eventCategory) ? (c = a.eventAction, d = a.eventLabel, f = a.eventValue, g = a.eventCategory) : g = a, b.isUndefined(a) || b.isUndefined(c) || (b.isUndefined(f) && (f = 0), e.ga("send", {
                        hitType: "event",
                        eventCategory: g,
                        eventAction: c,
                        eventLabel: d,
                        eventValue: f
                    }))
                }, l.trackSocial = function(a, c, d, f) {
                    b.isDefined(a.socialNetwork) && (c = a.socialAction, d = a.socialTarget, f = a.page, a = a.socialNetwork), b.isUndefined(a) || b.isUndefined(c) || (b.isUndefined(d) && (d = k.protocol() + "://" + k.host()), b.isUndefined(f) && (f = k.path()), e.ga("send", {
                        hitType: "social",
                        socialNetwork: a,
                        socialAction: c,
                        socialTarget: d,
                        page: f
                    }))
                }, l.send = function(a) {
                    e.ga("send", a)
                };
                var n = function() {
                    e.ga("require", "ecommerce", "ecommerce.js"), l.addTrans = function(a, c, d, f, g, h) {
                        b.isDefined(a.id) && e.ga("ecommerce:addTransaction", a), e.ga("ecommerce:addTransaction", {
                            id: a,
                            affiliation: c,
                            revenue: d,
                            tax: f,
                            shipping: g,
                            currency: h || "USD"
                        })
                    }, l.addItem = function(a, c, d, f, g, h) {
                        b.isDefined(a.id) && e.ga("ecommerce:addTransaction", a), e.ga("ecommerce:addItem", {
                            id: a,
                            name: c,
                            sku: d,
                            category: f,
                            price: g,
                            quantity: h
                        })
                    }, l.applyTrans = function() {
                        e.ga("ecommerce:send")
                    }, l.clearTrans = function() {
                        e.ga("ecommerce:clear")
                    }
                };
                g && n(), h && l.trackPage(k.path());
                var o = function() {
                    j.$on(i, function() {
                        l.trackPage(k.path())
                    })
                };
                return f && o(), l
            }]
        }])
    }(window, window.angular),
    function(a, b, c) {
        "use strict";
        var d = b.module("modInfinitySlider", []);
        d.directive("modInfinitySlider", ["$interval", "$window", "$timeout", "$rootScope", function(a, c, d, e) {
            return {
                templateUrl: "lib/mod-infinity-slider/infinity-slider.html",
                replace: !0,
                transclude: !0,
                scope: {
                    slidesArray: "=?",
                    sliderNum: "@",
                    eventName: "@",
                    slideIf: "=?",
                    slideInterval: "@",
                    sliderSize: "@",
                    windowWidth: "@",
                    showImgPreloader: "=?"
                },
                link: function(f, g) {
                    b.isUndefined(f.sliderSize) ? f.sliderSize = 320 : f.sliderSize = parseInt(f.sliderSize, 10);
                    var h, i, j, k, l, m, n, o, p = [],
                        q = [],
                        r = 3;
                    if (b.isDefined(f.slidesArray)) f.sliderNum = f.slidesArray.length, f.range = f.slidesArray, f.isArray = b.isArray, f.imagesLoaded = [];
                    else {
                        f.range = [];
                        for (var s = 0; s < parseInt(f.sliderNum, 10); ++s) f.range[s] = s
                    }
                    d(function() {
                        i = g.find("ul"), h = i.find("li"), j = h.length, l = !1, m = !1, n = 0, o = 0;
                        var a = g.find("img");
                        b.forEach(a, function(a, c) {
                            var d = c;
                            b.element(a).on("load", function() {
                                var a = d;
                                f.imagesLoaded[a] = !0
                            })
                        }), k = b.isDefined(f.windowWidth) ? c.innerWidth : Math.min(c.innerWidth, f.sliderSize), f.currentSize = k, f.sliderWidth = j + 2 * r;
                        for (var d = 0; r > d; ++d) p[d] = b.element(h[d % j]), p[r + d] = b.element(h[(2 * j - r + d) % j]), q[r + d] = i[0].insertBefore(p[r + d].clone()[0], b.element(h[0])[0]),
                            q[d] = i[0].appendChild(p[d].clone()[0]);
                        f.slideCurrent = n
                    });
                    var t = function(a) {
                            l || (i.css({
                                transition: "-webkit-transform ease-out 0.5s",
                                "-o-transition": "-o-transform ease-out 0.5s",
                                "-ms-transition": "-ms-transform ease-out 0.5s",
                                "-moz-transition": "-moz-transform ease-out 0.5s",
                                "-webkit-transition": "-webkit-transform ease-out 0.5s"
                            }), m || (m = !0, o += a * -k, i.css({
                                transform: "translateX(" + o + "px)",
                                "-o-transform": "translateX(" + o + "px)",
                                "-ms-transform": "translateX(" + o + "px)",
                                "-moz-transform": "translateX(" + o + "px)",
                                "-webkit-transform": "translateX(" + o + "px)"
                            }), d(function() {
                                n += a, (0 > n || n >= j) && (o = 0 > n ? (j - 1) * -k : 0, n = 0 > n ? j - 1 : 0, i.css({
                                    transition: "none",
                                    "-o-transition": "none",
                                    "-ms-transition": "none",
                                    "-moz-transition": "none",
                                    "-webkit-transition": "none",
                                    transform: "translateX(" + o + "px)",
                                    "-o-transform": "translateX(" + o + "px)",
                                    "-ms-transform": "translateX(" + o + "px)",
                                    "-moz-transform": "translateX(" + o + "px)",
                                    "-webkit-transform": "translateX(" + o + "px)"
                                })), f.slideCurrent = n, m = !1
                            }, 500)))
                        },
                        u = function(a) {
                            l = !0, i.css({
                                transition: "-webkit-transform ease-out 0.5s",
                                "-o-transition": "-o-transform ease-out 0.5s",
                                "-ms-transition": "-ms-transform ease-out 0.5s",
                                "-moz-transition": "-moz-transform ease-out 0.5s",
                                "-webkit-transition": "-webkit-transform ease-out 0.5s"
                            }), m = !0, o = a * -k, i.css({
                                transform: "translateX(" + o + "px)",
                                "-o-transform": "translateX(" + o + "px)",
                                "-ms-transform": "translateX(" + o + "px)",
                                "-moz-transform": "translateX(" + o + "px)",
                                "-webkit-transform": "translateX(" + o + "px)"
                            }), d(function() {
                                n = a, (0 > n || n >= j) && (o = 0 > n ? (j - 1) * -k : 0, n = 0 > n ? j - 1 : 0, i.css({
                                    transition: "none",
                                    "-o-transition": "none",
                                    "-ms-transition": "none",
                                    "-moz-transition": "none",
                                    "-webkit-transition": "none",
                                    transform: "translateX(" + o + "px)",
                                    "-o-transform": "translateX(" + o + "px)",
                                    "-ms-transform": "translateX(" + o + "px)",
                                    "-moz-transform": "translateX(" + o + "px)",
                                    "-webkit-transform": "translateX(" + o + "px)"
                                })), f.slideCurrent = n, m = !1, d(function() {
                                    l = !1
                                }, 2500)
                            }, 500)
                        },
                        v = function() {
                            if (!b.isUndefined(h)) {
                                if (!l) {
                                    k = b.isDefined(f.windowWidth) ? c.innerWidth : Math.min(c.innerWidth, f.sliderSize), f.currentSize = k, o = n * -k;
                                    for (var d = 0; d < q.length; d++) b.element(q[d]).css({
                                        width: k + "px",
                                        height: k + "px"
                                    });
                                    i.css({
                                        left: -(k * r) + "px",
                                        "-webkit-transition": "none",
                                        transition: "none",
                                        "-o-transition": "none",
                                        "-ms-transition": "none",
                                        "-moz-transition": "none",
                                        "-webkit-transform": "translateX(" + n * -k + "px)",
                                        transform: "translateX(" + n * -k + "px)",
                                        "-o-transform": "translateX(" + n * -k + "px)",
                                        "-ms-transform": "translateX(" + n * -k + "px)",
                                        "-moz-transform": "translateX(" + n * -k + "px)"
                                    })
                                }
                                if (b.isDefined(f.slideInterval) && f.slideIf !== !1) {
                                    var e = parseInt(f.slideInterval, 10);
                                    return a(function() {
                                        t(1)
                                    }, e)
                                }
                            }
                        };
                    f.slideTo = function(a) {
                        u(a)
                    };
                    var w;
                    f.$watch("slideIf", function() {
                        f.slideIf === !0 && (w = v()), f.slideIf === !1 && a.cancel(w)
                    }), d(function() {
                        w = v(), b.element(c).on("resize", function() {
                            a.cancel(w), w = v(), f.$apply()
                        })
                    });
                    var x = f.eventName ? f.eventName : "slide";
                    e.$on("modInfinitySlider:" + x, function(a, c) {
                        c && (b.isNumber(c) || isFinite(c)) && u(c)
                    })
                }
            }
        }])
    }(window, window.angular),
    function(a, b, c) {
        "use strict";
        var d = b.element,
            e = b.isFunction,
            f = b.isString,
            g = b.forEach,
            h = {
                "`": "~",
                1: "!",
                2: "@",
                3: "#",
                4: "$",
                5: "%",
                6: "^",
                7: "&",
                8: "*",
                9: "(",
                0: ")",
                "-": "_",
                "=": "+",
                ";": ":",
                "'": '"',
                ",": "<",
                ".": ">",
                "/": "?",
                "\\": "|"
            },
            i = {
                esc: 27,
                escape: 27,
                tab: 9,
                space: 32,
                "return": 13,
                enter: 13,
                backspace: 8,
                scrolllock: 145,
                scroll_lock: 145,
                scroll: 145,
                capslock: 20,
                caps_lock: 20,
                caps: 20,
                numlock: 144,
                num_lock: 144,
                num: 144,
                pause: 19,
                "break": 19,
                insert: 45,
                home: 36,
                "delete": 46,
                end: 35,
                pageup: 33,
                page_up: 33,
                pu: 33,
                pagedown: 34,
                page_down: 34,
                pd: 34,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                f1: 112,
                f2: 113,
                f3: 114,
                f4: 115,
                f5: 116,
                f6: 117,
                f7: 118,
                f8: 119,
                f9: 120,
                f10: 121,
                f11: 122,
                f12: 123
            },
            j = b.module("modKeyboardManager", []);
        j.factory("modKeyboardManager", ["$window", "$timeout", function(a, j) {
            var k = {
                    keyboardEventBindings: {}
                },
                l = {
                    eventType: "keydown",
                    propagate: !0,
                    inputDisabled: !0,
                    holded: !1,
                    target: a.document,
                    keyCode: c
                },
                m = function(a) {
                    var b = k.keyboardEventBindings[a];
                    b.target.off(b.eventOptions.eventType, b.callback), delete k.keyboardEventBindings[a]
                },
                n = function(c, g, m, n) {
                    e(g) && (n = m, m = g, g = null), n = b.extend({}, l, n), n.bindingId = Math.floor(1e16 * Math.random()), c = c.toLowerCase(), g = g || n.target, f(g) && (g = document.getElementById(g)), g = d(g);
                    var o = function(b) {
                            if (!n.holded) {
                                b = b || a.event;
                                var d = c.split("+");
                                if (n.inputDisabled) {
                                    var e = b.target || b.srcElement;
                                    if (3 === e.nodeType && (e = e.parentNode), "INPUT" === e.tagName || "TEXTAREA" === e.tagName || e.contentEditable === !0 || "true" === e.contentEditable) return
                                }
                                var f;
                                b.keyCode ? f = b.keyCode : b.which && (f = b.which);
                                var g = String.fromCharCode(f).toLowerCase();
                                188 === f && (g = ","), 190 === f && (g = ".");
                                for (var k, l = 0, o = {
                                        shift: {
                                            wanted: !1,
                                            pressed: b.shiftKey ? !0 : !1
                                        },
                                        ctrl: {
                                            wanted: !1,
                                            pressed: b.ctrlKey ? !0 : !1
                                        },
                                        alt: {
                                            wanted: !1,
                                            pressed: b.altKey ? !0 : !1
                                        },
                                        meta: {
                                            wanted: !1,
                                            pressed: b.metaKey ? !0 : !1
                                        }
                                    }, p = 0, q = d.length; q > p; p++) {
                                    switch (k = d[p]) {
                                        case "ctrl":
                                        case "control":
                                            l++, o.ctrl.wanted = !0;
                                            break;
                                        case "shift":
                                        case "alt":
                                        case "meta":
                                            l++, o[k].wanted = !0
                                    }
                                    k.length > 1 ? i[k] === f && l++ : n.keyCode ? n.keyCode === f && l++ : g === k ? l++ : h[g] && b.shiftKey && (g = h[g], g === k && l++)
                                }
                                return l !== d.length || o.ctrl.pressed !== o.ctrl.wanted || o.shift.pressed !== o.shift.wanted || o.alt.pressed !== o.alt.wanted || o.meta.pressed !== o.meta.wanted || (j(function() {
                                    m(b)
                                }), n.propagate) ? void 0 : (b.cancelBubble = !0, b.returnValue = !1, b.stopPropagation && (b.stopPropagation(), b.preventDefault()), !1)
                            }
                        },
                        p = {
                            shortcut: c,
                            eventOptions: n,
                            target: g,
                            callback: o,
                            userCallback: m
                        };
                    return k.keyboardEventBindings[n.bindingId] = p, !g.attr("tabindex") && e(g[0].setAttribute) && g.attr("tabindex", 0), e(g[0].focus) && j(function() {
                        g[0].focus()
                    }), g.on(n.eventType, o), n.bindingId
                },
                o = {};
            return k.on = function(a) {
                return {
                    holdBinding: function(b) {
                        !o[a] || !o[a].length, g(o[a], function(a) {
                            k.keyboardEventBindings[a].shortcut === b && (k.keyboardEventBindings[a].eventOptions.holded = !0)
                        })
                    },
                    unholdBinding: function(c) {
                        !o[a] || !o[a].length, g(o[a], function(a) {
                            (b.isUndefined(c) || k.keyboardEventBindings[a].shortcut === c) && (k.keyboardEventBindings[a].eventOptions.holded = !1)
                        })
                    },
                    bind: function(b, c, d, e) {
                        var f = n(b, c, d, e);
                        return o[a] = o[a] || [], o[a].push(f),
                            function() {
                                m(f)
                            }
                    },
                    unbindAll: function() {
                        !o[a] || !o[a].length, g(o[a], function(a) {
                            m(a)
                        }), delete o[a]
                    }
                }
            }, k.bind = function(a, b, c, d) {
                return k.on("undefined").bind(a, b, c, d)
            }, k
        }])
    }(window, window.angular),
    function(a, b, c) {
        "use strict";
        var d = b.forEach,
            e = b.isArray,
            f = b.isDefined,
            g = b.isObject,
            h = b.isString,
            i = b.module("modLayer", ["modKeyboardManager", "modUtils"]),
            j = 200;
        i.factory("modLayerService", ["$rootScope", "$filter", "$timeout", "modKeyboardManager", function(a, c, f, i) {
            var k = {
                layers: [],
                showingCounter: 0,
                shownCounter: 0
            };
            k.get = function() {
                return k.layers
            }, k.register = function(a) {
                if (!g(a)) throw "Invalid layer data format";
                if (!h(a.name)) throw "Missing or invalid layer name";
                if (c("filter")(k.layers, {
                        name: a.name
                    }).length) throw "Layer with that name already registered";
                return h(a.type) || (a.type = "regular"), k.layers.push(a), !0
            };
            var l = function() {
                    k.layers.sort(function(a, b) {
                        return a.isShown && !b.isShown ? -1 : !a.isShown && b.isShown ? 1 : a.shownTimestamp < b.shownTimestamp ? -1 : a.shownTimestamp > b.shownTimestamp ? 1 : 0
                    })
                },
                m = function(a) {
                    var b = a;
                    g(a) && (b = a.name);
                    for (var c = -1, d = 0; d < k.layers.length; ++d) {
                        var e = k.layers[d];
                        if (e.name === b) {
                            c = d;
                            break
                        }
                    }
                    return -1 === c ? !1 : c
                };
            return k.open = function(c) {
                var g = m(c);
                if (g === !1 && k.register(c) && (g = m(c)), g === !1) return !1;
                var j = k.layers[g];
                return j.isShown && !j.closingTimeout ? !1 : (a.$emit("modLayer:open", j), j.isShowing = !0, k.showingCounter++, j.closingTimeout ? f.cancel(j.closingTimeout) : (j.isShown = !0, k.shownCounter++), j.shownTimestamp = (new Date).valueOf(), b.isDefined(j.toolbar) && (j.toolbar.actions && (j.toolbar.actions && !e(j.toolbar.actionsOrder) && (j.toolbar.actionsOrder = [], d(j.toolbar.actions, function(a, b) {
                    j.toolbar.actionsOrder.push(b)
                })), d(j.toolbar.actions, function(a) {
                    h(a.shortcut) && i.on("modLayer_" + j.name).bind(a.shortcut, function() {
                        a.action(a, j)
                    }, a.shortcutOptions)
                })), j.toolbar.main && d(j.toolbar.main, function(a) {
                    h(a.shortcut) && i.on("modLayer_" + j.name).bind(a.shortcut, function() {
                        a.action(a, j)
                    }, a.shortcutOptions)
                })), l(), !0)
            }, k.hasOpenedChild = function(a) {
                var b = m(a);
                if (b === !1) return !1;
                var c = k.layers[b];
                for (var d in k.layers) {
                    var e = k.layers[d];
                    if ((e.isShown || e.isShowing) && e.parentLayerName === c.name) return !0
                }
                return !1
            }, k.close = function(b, c) {
                var d = m(b);
                if (d === !1) return !1;
                var e = k.layers[d];
                return e.isShown && e.isShowing ? k.hasOpenedChild(b) ? !1 : (e.isShowing = !1, k.showingCounter--, a.$emit("modLayer:close", e), k.showingCounter <= 0 && a.$emit("modLayer:closeLast", e), e.closingTimeout = f(function() {
                    e.closingTimeout = null, e.isShown = !1, k.shownCounter--, c && k.layers.splice(m(b), 1)
                }, j), i.on("modLayer_" + e.name).unbindAll(), l(), !0) : !1
            }, k
        }]), i.directive("modLayer", ["modLayerService", function(a) {
            return {
                scope: {},
                replace: !0,
                templateUrl: "lib/mod-layer/layer.html",
                controller: ["$scope", function(b) {
                    b.$watch(function() {
                        return a.shownCounter
                    }, function(c) {
                        b.layers = a.layers, b.shownCounter = c
                    })
                }]
            }
        }]), i.directive("bindHtmlCompile", ["$compile", function(a) {
            return {
                restrict: "A",
                link: function(b, c, d) {
                    b.$watch(function() {
                        return b.$eval(d.bindHtmlCompile)
                    }, function(e) {
                        c.html(e && e.toString());
                        var f = b;
                        d.bindHtmlScope && (f = b.$eval(d.bindHtmlScope)), a(c.contents())(f)
                    })
                }
            }
        }]), i.directive("modLayerInner", ["modTraversableFieldValue", function(a) {
            return {
                scope: {
                    layer: "=modLayerInner"
                },
                replace: !0,
                template: ['<div class="mod-layer-inner">', '<div class="mod-layer-inner-content" ng-show="layer.template" bind-html-compile="layer.template"></div>', '<div class="mod-layer-inner-content" ng-show="layer.templateUrl" ng-include="layer.templateUrl"></div>', "</div>"].join(""),
                controller: ["$scope", "$timeout", function(c, d) {
                    b.isDefined(c.layer.modelData) && (f(c.layer.modelData.modelKey) && c.$watch(function() {
                        return a.get(c.layer.modelData.obj, c.layer.modelData.modelKey)
                    }, function(a) {
                        !c.layer.isShowing && c.layer.isShown ? d(function() {
                            c.layer.model = a
                        }, j) : c.layer.model = a
                    }), f(c.layer.modelData.modelPreviousKey) && c.$watch(function() {
                        return a.get(c.layer.modelData.obj, c.layer.modelData.modelPreviousKey)
                    }, function(a) {
                        !c.layer.isShowing && c.layer.isShown ? d(function() {
                            c.layer.modelPrevious = a
                        }, j) : c.layer.modelPrevious = a
                    }), f(c.layer.modelData.modelNextKey) && c.$watch(function() {
                        return a.get(c.layer.modelData.obj, c.layer.modelData.modelNextKey)
                    }, function(a) {
                        !c.layer.isShowing && c.layer.isShown ? d(function() {
                            c.layer.modelNext = a
                        }, j) : c.layer.modelNext = a
                    }), f(c.layer.modelData.stateKey) && c.$watch(function() {
                        return a.get(c.layer.modelData.obj, c.layer.modelData.stateKey)
                    }, function(a) {
                        !c.layer.isShowing && c.layer.isShown ? d(function() {
                            c.layer.state = a
                        }, j) : c.layer.state = a
                    }))
                }]
            }
        }])
    }(window, window.angular),
    function(a, b, c) {
        "use strict";
        var d = b.module("modUiIcons", []);
        d.factory("modUiIconsService", ["$rootScope", function(a) {
            var c = {
                    svgData: [],
                    iconIdFileMap: {},
                    initialized: !1
                },
                d = {};
            return d.addIcons = function(a) {
                var d = a;
                if (c.svgData.length) {
                    var e = b.element(d.data).find("symbol");
                    if (e.length)
                        for (var f = 0; f < e.length; f++) c.svgData[0].appendChild(e[f])
                } else c.svgData = b.element(d.data);
                for (var g = b.element(d.data).find("symbol"), h = 0; h < g.length; h++) c.iconIdFileMap[g[h].id] = d.config.url.trim()
            }, d.setInitialized = function() {
                c.initialized = !0, a.$emit("modUiIconsInitCompleted")
            }, d.getSvgData = function() {
                return c.svgData
            }, d.getIconFile = function(a) {
                if (c.initialized && !c.iconIdFileMap[a]) throw new Error("No such icon: " + a);
                return c.iconIdFileMap[a]
            }, d
        }]), d.directive("modUiIconsInit", ["$http", "modUiIconsService", function(a, b) {
            return {
                restrict: "AE",
                link: function(c, d, e) {
                    var f = e.urls.split(","),
                        g = function() {
                            var a = b.getSvgData();
                            navigator.appVersion.indexOf("Trident/") > 0 && d.replaceWith(a[0])
                        },
                        h = 0,
                        i = function(a) {
                            h++, b.addIcons(a), h >= f.length && (g(), b.setInitialized())
                        },
                        j = function(a) {};
                    if (f.length)
                        for (var k = 0; k < f.length; k++) a.get(f[k].trim()).then(i, j)
                }
            }
        }]), d.directive("modUiIcon", ["$timeout", "$location", "$rootScope", "modUiIconsService", function(a, c, d, e) {
            return {
                restrict: "AE",
                templateNamespace: "svg",
                priority: 800,
                compile: function(a, c) {
                    if (!b.isUndefined(c.iconId)) {
                        var f = b.isDefined(c.viewBox) ? c.viewBox ? 'viewBox="' + c.viewBox + '"' : "" : 'viewBox="0 0 24 24"',
                            g = c.width ? 'width="' + c.width + '"' : "",
                            h = c.height ? 'height="' + c.height + '"' : "",
                            i = c.iconId,
                            j = c["class"],
                            k = "<svg " + f + " " + g + " " + h + '><use xlink:href="" ></use></svg>';
                        return a[0].outerHTML = k,
                            function(a, b, c) {
                                var f = "xlink:href";
                                b.addClass("ui-icon"), j && b.addClass(j);
                                var g = function(a) {
                                    if (a) {
                                        b.removeClass(i), b.addClass(a);
                                        var c;
                                        c = navigator.appVersion.indexOf("Trident/") > 0 ? "#" + a : e.getIconFile(a) + "#" + a, b.find("use").attr(f, c), i = a
                                    }
                                };
                                d.$on("modUiIconsInitCompleted", function() {
                                    g(c.iconId)
                                }), c.$observe("iconId", g)
                            }
                    }
                }
            }
        }])
    }(window, window.angular),
    function(a, b, c) {
        "use strict";
        var d = b.module("modUiState", ["LocalStorageModule"]);
        d.factory("modUiStateService", ["$rootScope", "localStorageService", function(a, c) {
            var d = {},
                e = {},
                f = null;
            return d.get = function(a) {
                return b.isUndefined(e[a]) && (e[a] = null), e[a]
            }, d.set = function(b, d) {
                e[b] = d, c.set(f, e), a.context.ui[b] = e[b]
            }, d.toggle = function(a) {
                b.isUndefined(e[a]) && (e[a] = !1), d.set(a, !e[a])
            }, d.init = function(d) {
                f = d;
                var g = c.get(f);
                null === g && (g = {}), a.context.ui = b.extend(e, g)
            }, d
        }])
    }(window, window.angular),
    function(a, b, c) {
        "use strict";
        var d = b.forEach,
            e = b.copy,
            f = b.extend,
            g = b.isDefined,
            h = b.isFunction,
            i = b.isObject,
            j = b.isArray,
            k = b.isString,
            l = b.module("modUtils", []);
        l.provider("modDeepExtend", function() {
            var a = function(b) {
                    return d(arguments, function(c) {
                        c !== b && d(c, function(c, d) {
                            c === !1 ? b[d] = !1 : b[d] && i(b[d]) ? a(b[d], c) : b[d] = c
                        })
                    }), b
                },
                b = { of: a
                };
            return f({
                $get: function() {
                    return b
                }
            }, b)
        }), l.provider("modTraversableFieldValue", function() {
            var a = function(a, b) {
                    if (!g(b)) return a;
                    if (!i(a)) return a;
                    if (0 === b.length) return a;
                    if (k(b) && (b = b.split(".")), j(b) || i(b)) {
                        for (var d in b)
                            if (b.hasOwnProperty(d)) {
                                var f = b[d];
                                if (!j(a) || isFinite(f)) try {
                                    if (!g(a[f])) return c;
                                    if (h(a[f])) {
                                        a = a[f]();
                                        continue
                                    }
                                    a = a[f]
                                } catch (l) {
                                    return a
                                } else {
                                    a = e(a);
                                    for (var m = 0; m < a.length; m++) a[m] = a[m][f]
                                }
                            }
                        return a
                    }
                    return a
                },
                b = function(a, b, c) {
                    if (!g(b)) throw new Error("Undefined: fields");
                    if (!i(a)) throw new Error("Not an object: obj: " + a);
                    if (0 === b.length) throw new Error("Do not use modTraversableFieldValue for simple assignments: " + a + ", " + b + ", " + c);
                    if (k(b) && (b = b.split(".")), !j(b)) throw new Error("Incorrect fields specification: " + b);
                    for (var d, e = 0; e < b.length - 1; ++e) {
                        if (d = b[e], !g(a[d])) {
                            if (!i(a)) throw new Error("Cannot set field on a non-object: " + a + ", " + d);
                            a[d] = {}
                        }
                        a = a[d]
                    }
                    if (e = b.length - 1, d = b[e], j(a) && !isFinite(d))
                        for (var f = 0; f < a.length; f++) a[f][d] = c;
                    else a[d] = c
                },
                d = {
                    get: a,
                    set: b
                };
            return f({
                $get: function() {
                    return d
                }
            }, d)
        })
    }(window, window.angular);