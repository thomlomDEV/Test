"use strict";
var app = angular.module("appHistoryOfIconsClientWebApp", ["ui.router", "duScroll", "duScroll.scrollspyExpander", "LocalStorageModule", "hmTouchEvents", "modDuHammerScroll", "modGoogleAnalytics", "modInfinitySlider", "modKeyboardManager", "modLayer", "modUiIcons", "modUiState"]);
app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "modGoogleAnalyticsProvider", function(a, b, c, d) {
        c.html5Mode({
            enabled: !0,
            requireBase: !0
        }), d.setAccount("UA-60369330-1"), d.setDomain("historyoficons.com"), b.otherwise("/"), a.state("dashboard", {
            url: "/",
            templateUrl: "pages/dashboard/dashboard.html",
            controller: "dashboard"
        }).state("info", {
            parent: "dashboard",
            url: "info",
            layer: !0,
            views: {
                "layer@": {
                    templateUrl: "pages/info/info.html"
                }
            }
        }).state("share-layer", {
            parent: "dashboard",
            url: "share-layer",
            layer: !0,
            views: {
                "layer@": {
                    templateUrl: "pages/share-layer/share-layer.html"
                }
            }
        })
    }]), app.run(["$rootScope", "$state", "$timeout", "$window", "$location", "modLayerService", "modGoogleAnalytics", function(a, b, c, d, e, f, g) {
        a.context = {
            ui: {},
            currState: b.current
        }, a.licencesIconNumber = 16 * parseInt(d.licensesInfo.extra.stats.free.icons, 10);
        var h = function() {
                return angular.isDefined(d.Modernizr) && d.Modernizr.touch === !0 && navigator.userAgent.indexOf("Firefox") < 0 || "ontouchstart" in document.documentElement || "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch
            },
            i = function() {
                d.innerWidth >= 1600 && d.innerHeight >= 780 ? (a.context.responsive = "big", a.context.imgSize = "big", a.context.sliderSize = 768) : d.innerWidth >= 1280 && d.innerHeight >= 780 ? (a.context.responsive = "middle", a.context.imgSize = "middle", a.context.sliderSize = 576) : d.innerWidth >= 896 ? (a.context.responsive = "small", a.context.imgSize = "small", a.context.sliderSize = 448) : (a.context.responsive = "mobile", a.context.imgSize = "small", a.context.sliderSize = d.innerWidth), a.context.svgDisabled = d.innerWidth <= 448, a.isTouchable = h()
            };
        i(), angular.element(d).on("resize", function() {
            i(), a.$apply()
        }), a.$on("$stateChangeStart", function(a, d) {
            d.layer === !0 && f.open({
                name: d.name,
                template: '<div ui-view="layer"></div>',
                toolbar: {
                    main: {
                        close: {
                            action: function() {
                                f.close(d.name), c(function() {
                                    b.go("^")
                                }, 300)
                            },
                            icon: "i-cancel",
                            shortcut: "esc"
                        }
                    }
                }
            })
        }), a.$on("$stateChangeSuccess", function() {
            g.trackPage(e.path(), b.current.name)
        }), a.openInWindow = function(a, b, c) {
            b = b || 520, c = c || 350;
            var e = window.innerHeight / 2 - c / 2,
                f = window.innerWidth / 2 - b / 2;
            d.open(a, "sharer", "top=" + e + ",left=" + f + ",toolbar=0,status=0,width=" + b + ",height=" + c)
        }, a.$on("$stateChangeStart", function(b, c) {
            a.context.currState = c
        })
    }]), angular.module("appHistoryOfIconsClientWebApp").factory("settings", function() {
        var a = {};
        return a
    }),
    function(a, b, c) {
        var d = b.module("duScroll.scrollspyExpander", ["duScroll"]);
        d.directive("duScrollspyExpander", ["$rootScope", function(a) {
            return {
                link: function(b, c) {
                    a.$on("duScrollspy:becameActive", function() {
                        c[0].querySelector(".active") && c.addClass("expanded")
                    }), a.$on("duScrollspy:becameInactive", function() {
                        c[0].querySelector(".active") || c.removeClass("expanded")
                    })
                }
            }
        }])
    }(window, window.angular),
    function(a, b, c) {
        var d = b.module("modDuHammerScroll", ["duScroll", "hmTouchEvents"]),
            e = {
                easeOutQuad: function(a) {
                    return a * (2 - a)
                }
            };
        d.directive("modScrollSwipe", ["$rootScope", function(a) {
            return {
                link: function(c, d, f) {
                    if (!a.isTouchable) {
                        b.isUndefined(f.hmDrag);
                        var g, h, i, j, k, l, m, n = b.isDefined(f.proportion) ? f.proportion : .5,
                            o = d[0].scrollWidth > d[0].clientWidth && f.modScrollSwipe === "horizontal".trim(),
                            p = d[0].scrollHeight > d[0].clientHeight;
                        d.on("dragstart", function() {
                            g = 0, k = d.scrollTop(), h = d.scrollLeft(), l = 0, i = 0, m = 0, j = 0, d.addClass("dragging")
                        }), d.on("drag", function(a) {
                            if (a.target.draggable !== !0) {
                                var b = p ? k - a.gesture.deltaY : 0,
                                    c = o ? h - a.gesture.deltaX : 0;
                                d.scrollTo(c, b)
                            }
                        }), d.on("dragend", function() {
                            if (0 !== l || 0 !== i) {
                                var a = p && l ? d.scrollTop() + (l > 0 ? -1 : 1) * m * 1e3 * n : k,
                                    b = o && i ? d.scrollTop() + (i > 0 ? -1 : 1) * j * 1e3 * n : h;
                                d.scrollTo(b, a, 1e3 * n, e.easeOutQuad)
                            }
                            d.removeClass("dragging")
                        }), d.on("swipe", function(a) {
                            g = a.gesture.deltaTime, l = a.gesture.deltaY, m = a.gesture.velocityY, i = a.gesture.deltaX, j = a.gesture.velocityX
                        })
                    }
                }
            }
        }])
    }(window, window.angular), app.directive("watchScroll", ["$window", function(a) {
        return {
            scope: {
                watchOffset: "@",
                watchScroll: "@",
                watchScrollIf: "=?"
            },
            link: function(b, c, d) {
                if (b.watchScrollIf !== !1) {
                    for (var e, f, g = function(a) {
                            var b = a.currentStyle || window.getComputedStyle(a, ""),
                                c = a.scrollHeight > a.clientHeight;
                            return c && ("auto" === b.overflow || "scroll" === b.overflow || "auto" === b.overflowY || "scroll" === b.overflowY)
                        }, h = angular.element(a), i = c.parent(); !g(i[0]) && !i.hasClass("watch-scroll-container");) i = i.parent();
                    var j = b.watchScroll && angular.isString(b.watchScroll) ? b.watchScroll : "";
                    if (j) {
                        var k = j + "Init";
                        c.addClass(k)
                    }
                    var l = function() {
                        f = c[0].offsetTop;
                        for (var a = c.parent(); !g(a[0]) && !a.hasClass("watch-scroll-container");) f += a[0].offsetTop, a = a.parent()
                    };
                    h.on("resize", l), l();
                    var m = d.watchScrollCallback,
                        n = function() {
                            e = angular.isDefined(d.watchOffset) ? isFinite(d.watchOffset) && "" !== d.watchOffset ? f - parseInt(d.watchOffset, 10) - a.innerHeight : f - a.innerHeight : f - a.innerHeight / 1.3;
                            var g = i.scrollTop();
                            if (g > e && (angular.isDefined(m) && b.$parent.$eval(m), j)) {
                                c.addClass(j);
                                var o = function() {
                                    c.removeClass(j), c.removeClass(k), h.off("resize", l), c.off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd"), i.off("scroll", n)
                                };
                                c.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", o)
                            }
                        };
                    i.on("scroll", n)
                }
            }
        }
    }]), app.factory("infinitySliderData", function() {
        var a = [
            [{
                url: "/assets/css/images/xerox-8010-star.svg",
                alt: "xerox 8010 star",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/01-xerox-1-1024.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star 8010 icons on a desktop.",
                captionsub: ""
            }, {
                url: "/assets/css/images/01-xerox-2-1024.png",
                alt: "xerox 8010 star",
                caption: "A bit-mapped screen dump of a Xerox Star.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/01-xerox-3-1024.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star – ViewPoint desktop. Xerox 6085, 1985",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/01-xerox-4-1024.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star 8010 workstation's screen (1981).",
                captionsub: "SOURCE Wikipedia, Author: Digibarn Computer Museum"
            }],
            [{
                url: "/assets/css/images/xerox-8010-star.svg",
                alt: "xerox 8010 star",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/01-xerox-1-1280.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star 8010 icons on a desktop.",
                captionsub: ""
            }, {
                url: "/assets/css/images/01-xerox-2-1280.png",
                alt: "xerox 8010 star",
                caption: "A bit-mapped screen dump of a Xerox Star.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/01-xerox-3-1280.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star – ViewPoint desktop. Xerox 6085, 1985",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/01-xerox-4-1280.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star 8010 workstation's screen (1981).",
                captionsub: "SOURCE Wikipedia, Author: Digibarn Computer Museum"
            }],
            [{
                url: "/assets/css/images/xerox-8010-star.svg",
                alt: "xerox 8010 star",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/01-xerox-1-1600.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star 8010 icons on a desktop.",
                captionsub: ""
            }, {
                url: "/assets/css/images/01-xerox-2-1600.png",
                alt: "xerox 8010 star",
                caption: "A bit-mapped screen dump of a Xerox Star.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/01-xerox-3-1600.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star – ViewPoint desktop. Xerox 6085, 1985",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/01-xerox-4-1600.png",
                alt: "xerox 8010 star",
                caption: "Xerox Star 8010 workstation's screen (1981).",
                captionsub: "SOURCE Wikipedia, Author: Digibarn Computer Museum"
            }],
            [{
                url: "/assets/css/images/apple-lisa-computer-icon.svg",
                alt: "apple lisa - computer icon",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/02-lisa-1-1024.png",
                alt: "apple lisa - computer icon",
                caption: "Desktop with applications in Lisa OS 1.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/02-lisa-2-1024.png",
                alt: "apple lisa - computer icon",
                caption: "Apple LISA II Macintosh-XL, 1983.",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/apple-lisa-computer-icon.svg",
                alt: "apple lisa - computer icon",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/02-lisa-1-1280.png",
                alt: "apple lisa - computer icon",
                caption: "Desktop with applications in Lisa OS 1.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/02-lisa-2-1280.png",
                alt: "apple lisa - computer icon",
                caption: "Apple LISA II Macintosh-XL, 1983.",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/apple-lisa-computer-icon.svg",
                alt: "apple lisa - computer icon",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/02-lisa-1-1600.png",
                alt: "apple lisa - computer icon",
                caption: "Desktop with applications in Lisa OS 1.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/02-lisa-2-1600.png",
                alt: "apple lisa - computer icon",
                caption: "Apple LISA II Macintosh-XL, 1983.",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/macintosh-1.svg",
                alt: "macintosh 1",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/03-mac1-1-1024.png",
                alt: "macintosh 1",
                caption: "The original Macintosh, released in January 1984.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/03-mac1-2-1024.png",
                alt: "macintosh 1",
                caption: "Desktop with applications in Mac OS System 1.1.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/03-mac1-3-1024.png",
                alt: "macintosh 1",
                caption: "MacOS 1.1, 1984",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/03-mac1-4-1024.png",
                alt: "macintosh 1",
                caption: "File manager in Mac OS System 1.1 (Finder)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/macintosh-1.svg",
                alt: "macintosh 1",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/03-mac1-1-1280.png",
                alt: "macintosh 1",
                caption: "The original Macintosh, released in January 1984.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/03-mac1-2-1280.png",
                alt: "macintosh 1",
                caption: "Desktop with applications in Mac OS System 1.1.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/03-mac1-3-1280.png",
                alt: "macintosh 1",
                caption: "MacOS 1.1, 1984",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/03-mac1-4-1280.png",
                alt: "macintosh 1",
                caption: "File manager in Mac OS System 1.1 (Finder)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/macintosh-1.svg",
                alt: "macintosh 1",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/03-mac1-1-1600.png",
                alt: "macintosh 1",
                caption: "The original Macintosh, released in January 1984.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/03-mac1-2-1600.png",
                alt: "macintosh 1",
                caption: "Desktop with applications in Mac OS System 1.1.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/03-mac1-3-1600.png",
                alt: "macintosh 1",
                caption: "MacOS 1.1, 1984",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/03-mac1-4-1600.png",
                alt: "macintosh 1",
                caption: "File manager in Mac OS System 1.1 (Finder)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/windows-1-0.svg",
                alt: "windows 1.0",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/04-win1-1-1024.png",
                alt: "windows 1.0",
                caption: "Microsoft Windows 1.0 operating environment",
                captionsub: "SOURCE Wikipedia."
            }, {
                url: "/assets/css/images/04-win1-2-1024.png",
                alt: "windows 1.0",
                caption: "Microsoft Windows 1.0 operating environment",
                captionsub: "SOURCE Wikipedia."
            }],
            [{
                url: "/assets/css/images/windows-1-0.svg",
                alt: "windows 1.0",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/04-win1-1-1280.png",
                alt: "windows 1.0",
                caption: "Microsoft Windows 1.0 operating environment",
                captionsub: "SOURCE Wikipedia."
            }, {
                url: "/assets/css/images/04-win1-2-1280.png",
                alt: "windows 1.0",
                caption: "Microsoft Windows 1.0 operating environment",
                captionsub: "SOURCE Wikipedia."
            }],
            [{
                url: "/assets/css/images/windows-1-0.svg",
                alt: "windows 1.0",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/04-win1-1-1600.png",
                alt: "windows 1.0",
                caption: "Microsoft Windows 1.0 operating environment",
                captionsub: "SOURCE Wikipedia."
            }, {
                url: "/assets/css/images/04-win1-2-1600.png",
                alt: "windows 1.0",
                caption: "Microsoft Windows 1.0 operating environment",
                captionsub: "SOURCE Wikipedia."
            }],
            [{
                url: "/assets/css/images/atari-t-o-s.svg",
                alt: "atari TOS",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/05-tos-1-1024.png",
                alt: "atari TOS",
                caption: "Atari 1040STF 16-bit computer (1986)",
                captionsub: "SOURCE Wikipedia, ©Bill Bertram, 2006"
            }, {
                url: "/assets/css/images/05-tos-2-1024.png",
                alt: "atari TOS",
                caption: "Atari TOS Version 1.0, 1985.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/atari-t-o-s.svg",
                alt: "atari TOS",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/05-tos-1-1280.png",
                alt: "atari TOS",
                caption: "Atari 1040STF 16-bit computer (1986)",
                captionsub: "SOURCE Wikipedia, ©Bill Bertram, 2006"
            }, {
                url: "/assets/css/images/05-tos-2-1280.png",
                alt: "atari TOS",
                caption: "Atari TOS Version 1.0, 1985.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/atari-t-o-s.svg",
                alt: "atari TOS",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/05-tos-1-1600.png",
                alt: "atari TOS",
                caption: "Atari 1040STF 16-bit computer (1986)",
                captionsub: "SOURCE Wikipedia, ©Bill Bertram, 2006"
            }, {
                url: "/assets/css/images/05-tos-2-1600.png",
                alt: "atari TOS",
                caption: "Atari TOS Version 1.0, 1985.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/amiga-workbench.svg",
                alt: "amiga workbench",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/06-amigawb-1-1024.png",
                alt: "amiga workbench",
                caption: "The Amiga 500 (1987) with monitor, keyboard, mouse and floppy disk drive.",
                captionsub: "SOURCE Wikipedia, ©Bill Bertram 2006"
            }, {
                url: "/assets/css/images/06-amigawb-2-1024.png",
                alt: "amiga workbench",
                caption: "Desktop with applications in Amiga Workbench 1.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/amiga-workbench.svg",
                alt: "amiga workbench",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/06-amigawb-1-1280.png",
                alt: "amiga workbench",
                caption: "The Amiga 500 (1987) with monitor, keyboard, mouse and floppy disk drive.",
                captionsub: "SOURCE Wikipedia, ©Bill Bertram 2006"
            }, {
                url: "/assets/css/images/06-amigawb-2-1280.png",
                alt: "amiga workbench",
                caption: "Desktop with applications in Amiga Workbench 1.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/amiga-workbench.svg",
                alt: "amiga workbench",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/06-amigawb-1-1600.png",
                alt: "amiga workbench",
                caption: "The Amiga 500 (1987) with monitor, keyboard, mouse and floppy disk drive.",
                captionsub: "SOURCE Wikipedia, ©Bill Bertram 2006"
            }, {
                url: "/assets/css/images/06-amigawb-2-1600.png",
                alt: "amiga workbench",
                caption: "Desktop with applications in Amiga Workbench 1.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/geos.svg",
                alt: "geos",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/07-geos-1-1024.png",
                alt: "geos",
                caption: "GEOS for the Commodore 64.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/07-geos-2-1024.png",
                alt: "geos",
                caption: "Desktop with applications in GEOS 2 for C64",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/geos.svg",
                alt: "geos",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/07-geos-1-1280.png",
                alt: "geos",
                caption: "GEOS for the Commodore 64.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/07-geos-2-1280.png",
                alt: "geos",
                caption: "Desktop with applications in GEOS 2 for C64",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/geos.svg",
                alt: "geos",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/07-geos-1-1600.png",
                alt: "geos",
                caption: "GEOS for the Commodore 64.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/07-geos-2-1600.png",
                alt: "geos",
                caption: "Desktop with applications in GEOS 2 for C64",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/apple-gs-os.svg",
                alt: "apple gs/os",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/08-applegsos-1-1024.png",
                alt: "apple gs/os",
                caption: "GS/OS screenshot, ran under the KEGS emulator.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/08-applegsos-2-1024.png",
                alt: "apple gs/os",
                caption: "Desktop with applications in GS/OS 5.0.4. (1991)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/apple-gs-os.svg",
                alt: "apple gs/os",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/08-applegsos-1-1280.png",
                alt: "apple gs/os",
                caption: "GS/OS screenshot, ran under the KEGS emulator.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/08-applegsos-2-1280.png",
                alt: "apple gs/os",
                caption: "Desktop with applications in GS/OS 5.0.4. (1991)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/apple-gs-os.svg",
                alt: "apple gs/os",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/08-applegsos-1-1600.png",
                alt: "apple gs/os",
                caption: "GS/OS screenshot, ran under the KEGS emulator.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/08-applegsos-2-1600.png",
                alt: "apple gs/os",
                caption: "Desktop with applications in GS/OS 5.0.4. (1991)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/nextstep-08.svg",
                alt: "NeXTSTEP 0.8",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/nextstep-1024-1.png",
                alt: "NeXTSTEP 0.8",
                caption: "Terminal application",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1024-2.png",
                alt: "NeXTSTEP 0.8",
                caption: "NeXTSTEP 0.8 desktop",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1024-3.png",
                alt: "NeXTSTEP 0.8",
                caption: "user interface controls available under NeXTSTEP",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1024-4.png",
                alt: "NeXTSTEP 0.8",
                caption: "Example of a display control panel",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }],
            [{
                url: "/assets/css/images/nextstep-08.svg",
                alt: "NeXTSTEP 0.8",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/nextstep-1280-1.png",
                alt: "NeXTSTEP 0.8",
                caption: "Terminal application",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1280-2.png",
                alt: "NeXTSTEP 0.8",
                caption: "NeXTSTEP 0.8 desktop",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1280-3.png",
                alt: "NeXTSTEP 0.8",
                caption: "The Interface Builder application gives a good idea of the standard user interface controls available under NeXTSTEP",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1280-4.png",
                alt: "NeXTSTEP 0.8",
                caption: "Example of a display control panel",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }],
            [{
                url: "/assets/css/images/nextstep-08.svg",
                alt: "NeXTSTEP 0.8",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/nextstep-1600-1.png",
                alt: "NeXTSTEP 0.8",
                caption: "Terminal application",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1600-2.png",
                alt: "NeXTSTEP 0.8",
                caption: "NeXTSTEP 0.8 desktop",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1600-3.png",
                alt: "NeXTSTEP 0.8",
                caption: "The Interface Builder application gives a good idea of the standard user interface controls available under NeXTSTEP",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }, {
                url: "/assets/css/images/nextstep-1600-4.png",
                alt: "NeXTSTEP 0.8",
                caption: "Example of a display control panel",
                captionsub: "Courtesy of Nathan Lineback, www.toastytech.com"
            }],
            [{
                url: "/assets/css/images/windows-3-and-os-2.svg",
                alt: "windows 3 and os/2",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/09-win3-1-1024.png",
                alt: "windows 3 and os/2",
                caption: "Screenshot of the Windows 3.0 workspace.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/09-win3-2-1024.png",
                alt: "windows 3 and os/2",
                caption: "Desktop with applications in Windows 3.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/windows-3-and-os-2.svg",
                alt: "windows 3 and os/2",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/09-win3-1-1280.png",
                alt: "windows 3 and os/2",
                caption: "Screenshot of the Windows 3.0 workspace.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/09-win3-2-1280.png",
                alt: "windows 3 and os/2",
                caption: "Desktop with applications in Windows 3.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/windows-3-and-os-2.svg",
                alt: "windows 3 and os/2",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/09-win3-1-1600.png",
                alt: "windows 3 and os/2",
                caption: "Screenshot of the Windows 3.0 workspace.",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/09-win3-2-1600.png",
                alt: "windows 3 and os/2",
                caption: "Desktop with applications in Windows 3.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/macintosh-system-7.svg",
                alt: "macintosh system 7",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/10-mac7-1-1024.png",
                alt: "macintosh system 7",
                caption: "Desktop with applications in System 7.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/10-mac7-2-1024.png",
                alt: "macintosh system 7",
                caption: "Desktop with applications in System 7.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/10-mac7-3-1024.png",
                alt: "macintosh system 7",
                caption: "MacOS 7.5.5 control panel folder. (1996)",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/macintosh-system-7.svg",
                alt: "macintosh system 7",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/10-mac7-1-1280.png",
                alt: "macintosh system 7",
                caption: "Desktop with applications in System 7.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/10-mac7-2-1280.png",
                alt: "macintosh system 7",
                caption: "Desktop with applications in System 7.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/10-mac7-3-1280.png",
                alt: "macintosh system 7",
                caption: "MacOS 7.5.5 control panel folder. (1996)",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/macintosh-system-7.svg",
                alt: "macintosh system 7",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/10-mac7-1-1600.png",
                alt: "macintosh system 7",
                caption: "Desktop with applications in System 7.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/10-mac7-2-1600.png",
                alt: "macintosh system 7",
                caption: "Desktop with applications in System 7.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/10-mac7-3-1600.png",
                alt: "macintosh system 7",
                caption: "MacOS 7.5.5 control panel folder. (1996)",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/geoworks-ensemble-2.svg",
                alt: "geoworks ensemble 2",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/11-geoworks-1-1024.png",
                alt: "geoworks ensemble 2",
                caption: "Desktop with applications in GeoWorks Ensemble 2.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/11-geoworks-2-1024.png",
                alt: "geoworks ensemble 2",
                caption: "First run in GeoWorks Ensemble 2.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/geoworks-ensemble-2.svg",
                alt: "geoworks ensemble 2",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/11-geoworks-1-1280.png",
                alt: "geoworks ensemble 2",
                caption: "Desktop with applications in GeoWorks Ensemble 2.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/11-geoworks-2-1280.png",
                alt: "geoworks ensemble 2",
                caption: "First run in GeoWorks Ensemble 2.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/geoworks-ensemble-2.svg",
                alt: "geoworks ensemble 2",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/11-geoworks-1-1600.png",
                alt: "geoworks ensemble 2",
                caption: "Desktop with applications in GeoWorks Ensemble 2.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/11-geoworks-2-1600.png",
                alt: "geoworks ensemble 2",
                caption: "First run in GeoWorks Ensemble 2.0.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/beos.svg",
                alt: "beos",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/12-beos-1-1024.png",
                alt: "beos",
                caption: "BeOS 5.0 Personal Edition (2000)",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/12-beos-2-1024.png",
                alt: "beos",
                caption: "Desktop with applications in BeOS R5.0.1 PE. (2000)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/12-beos-3-1024.png",
                alt: "beos",
                caption: "Settings menu in BeOS R5.0.1 PE (Preferences) (2000)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/beos.svg",
                alt: "beos",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/12-beos-1-1280.png",
                alt: "beos",
                caption: "BeOS 5.0 Personal Edition (2000)",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/12-beos-2-1280.png",
                alt: "beos",
                caption: "Desktop with applications in BeOS R5.0.1 PE. (2000)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/12-beos-3-1280.png",
                alt: "beos",
                caption: "Settings menu in BeOS R5.0.1 PE (Preferences) (2000)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/beos.svg",
                alt: "beos",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/12-beos-1-1600.png",
                alt: "beos",
                caption: "BeOS 5.0 Personal Edition (2000)",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/12-beos-2-1600.png",
                alt: "beos",
                caption: "Desktop with applications in BeOS R5.0.1 PE. (2000)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/12-beos-3-1600.png",
                alt: "beos",
                caption: "Settings menu in BeOS R5.0.1 PE (Preferences) (2000)",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/irix.svg",
                alt: "irix",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/13-irix-1-1024.png",
                alt: "irix",
                caption: "First run in IRIX 5.3 (1994) with thanks to Ian Young.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/13-irix-2-1024.png",
                alt: "irix",
                caption: "Settings menu in IRIX 5.3 (1994) with thanks to Ian Young.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/irix.svg",
                alt: "irix",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/13-irix-1-1280.png",
                alt: "irix",
                caption: "First run in IRIX 5.3 (1994) with thanks to Ian Young.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/13-irix-2-1280.png",
                alt: "irix",
                caption: "Settings menu in IRIX 5.3 (1994) with thanks to Ian Young.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/irix.svg",
                alt: "irix",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/13-irix-1-1600.png",
                alt: "irix",
                caption: "First run in IRIX 5.3 (1994) with thanks to Ian Young.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/13-irix-2-1600.png",
                alt: "irix",
                caption: "Settings menu in IRIX 5.3 (1994) with thanks to Ian Young.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }],
            [{
                url: "/assets/css/images/rhapsody.svg",
                alt: "rhapsody",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/13-rhapsody-1-1024.png",
                alt: "rhapsody",
                caption: "Desktop with applications in Rhapsody DR2.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/13-rhapsody-2-1024.png",
                alt: "rhapsody",
                caption: "Rhapsody Developer Release 2.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/rhapsody.svg",
                alt: "rhapsody",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/13-rhapsody-1-1280.png",
                alt: "rhapsody",
                caption: "Desktop with applications in Rhapsody DR2.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/13-rhapsody-2-1280.png",
                alt: "rhapsody",
                caption: "Rhapsody Developer Release 2.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/rhapsody.svg",
                alt: "rhapsody",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/13-rhapsody-1-1600.png",
                alt: "rhapsody",
                caption: "Desktop with applications in Rhapsody DR2.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/13-rhapsody-2-1600.png",
                alt: "rhapsody",
                caption: "Rhapsody Developer Release 2.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/amiga-os-3-5.svg",
                alt: "amiga os 3.5",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/14-amiga35-1-1024.png",
                alt: "amiga os 3.5",
                caption: "AmigaOS 3.5.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/amiga-os-3-5.svg",
                alt: "amiga os 3.5",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/14-amiga35-1-1280.png",
                alt: "amiga os 3.5",
                caption: "AmigaOS 3.5.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/amiga-os-3-5.svg",
                alt: "amiga os 3.5",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/14-amiga35-1-1600.png",
                alt: "amiga os 3.5",
                caption: "AmigaOS 3.5.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/mac-os-x.svg",
                alt: "mac os x",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/15-macosx-1-1024.png",
                alt: "mac os x",
                caption: "Desktop with applications in Mac OS X Public Beta.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/15-macosx-2-1024.png",
                alt: "mac os x",
                caption: "Screenshot of Mac OS X v10.0",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/mac-os-x.svg",
                alt: "mac os x",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/15-macosx-1-1280.png",
                alt: "mac os x",
                caption: "Desktop with applications in Mac OS X Public Beta.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/15-macosx-2-1280.png",
                alt: "mac os x",
                caption: "Screenshot of Mac OS X v10.0",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/mac-os-x.svg",
                alt: "mac os x",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/15-macosx-1-1600.png",
                alt: "mac os x",
                caption: "Desktop with applications in Mac OS X Public Beta.",
                captionsub: "Courtesy of Marcin Wichary, www.guidebookgallery.org"
            }, {
                url: "/assets/css/images/15-macosx-2-1600.png",
                alt: "mac os x",
                caption: "Screenshot of Mac OS X v10.0",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/windows-xp.svg",
                alt: "windows xp",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/16-winxp-1-1024.png",
                alt: "windows xp",
                caption: " First run in Windows XP.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/16-winxp-2-1024.png",
                alt: "windows xp",
                caption: "Windows XP Professional with Service Pack 3 installed.",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/windows-xp.svg",
                alt: "windows xp",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/16-winxp-1-1280.png",
                alt: "windows xp",
                caption: " First run in Windows XP.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/16-winxp-2-1280.png",
                alt: "windows xp",
                caption: "Windows XP Professional with Service Pack 3 installed.",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/windows-xp.svg",
                alt: "windows xp",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/16-winxp-1-1600.png",
                alt: "windows xp",
                caption: " First run in Windows XP.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/16-winxp-2-1600.png",
                alt: "windows xp",
                caption: "Windows XP Professional with Service Pack 3 installed.",
                captionsub: "SOURCE Wikipedia"
            }],
            [{
                url: "/assets/css/images/windows-vista.svg",
                alt: "windows vista",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/17-vista-1-1024.png",
                alt: "windows vista",
                caption: "Windows Vista Ultimate using the Windows Aero theme, 2007",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/17-vista-2-1024.png",
                alt: "windows vista",
                caption: "Windows Vista control panel.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/windows-vista.svg",
                alt: "windows vista",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/17-vista-1-1280.png",
                alt: "windows vista",
                caption: "Windows Vista Ultimate using the Windows Aero theme, 2007",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/17-vista-2-1280.png",
                alt: "windows vista",
                caption: "Windows Vista control panel.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/windows-vista.svg",
                alt: "windows vista",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/17-vista-1-1600.png",
                alt: "windows vista",
                caption: "Windows Vista Ultimate using the Windows Aero theme, 2007",
                captionsub: "SOURCE Wikipedia"
            }, {
                url: "/assets/css/images/17-vista-2-1600.png",
                alt: "windows vista",
                caption: "Windows Vista control panel.",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }],
            [{
                url: "/assets/css/images/ios.svg",
                alt: "ios",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/18-ios-1-1024.png",
                alt: "ios",
                caption: "iPhone OS 3.0",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/ios.svg",
                alt: "ios",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/18-ios-1-1280.png",
                alt: "ios",
                caption: "iPhone OS 3.0",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/ios.svg",
                alt: "ios",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/18-ios-1-1600.png",
                alt: "ios",
                caption: "iPhone OS 3.0",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/android.svg",
                alt: "android",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/19-android-1-1024.png",
                alt: "android",
                caption: "Android v. 2.2 (Froyo)",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/android.svg",
                alt: "android",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/19-android-1-1280.png",
                alt: "android",
                caption: "Android v. 2.2 (Froyo)",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/android.svg",
                alt: "android",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/19-android-1-1600.png",
                alt: "android",
                caption: "Android v. 2.2 (Froyo)",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/windows-phone-7.svg",
                alt: "windows phone 7",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/20-winph7-1-1024.png",
                alt: "windows phone 7",
                caption: "Windows Phone 7 OS",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/windows-phone-7.svg",
                alt: "windows phone 7",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/20-winph7-1-1280.png",
                alt: "windows phone 7",
                caption: "Windows Phone 7 OS",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/windows-phone-7.svg",
                alt: "windows phone 7",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/20-winph7-1-1600.png",
                alt: "windows phone 7",
                caption: "Windows Phone 7 OS",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/apps-web.svg",
                alt: "apps web",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/21-flat-1-1024.png",
                alt: "apps web",
                caption: "Windows 8 Service Pack 1 screen shots",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/21-flat-2-1024.png",
                alt: "apps web",
                caption: "Comarch Smart Finances by Modulus",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/apps-web.svg",
                alt: "apps web",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/21-flat-1-1280.png",
                alt: "apps web",
                caption: "Windows 8 Service Pack 1 screen shots",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/21-flat-2-1280.png",
                alt: "apps web",
                caption: "Comarch Smart Finances by Modulus",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/apps-web.svg",
                alt: "apps web",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/21-flat-1-1600.png",
                alt: "apps web",
                caption: "Windows 8 Service Pack 1 screen shots",
                captionsub: "Courtesy of Nathan Lineback, http://toastytech.com"
            }, {
                url: "/assets/css/images/21-flat-2-1600.png",
                alt: "apps web",
                caption: "Comarch Smart Finances by Modulus",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/16-styles.svg",
                alt: "16-styles",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/16-styles-1.svg",
                alt: "16-styles",
                caption: "",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/icon-system.png",
                alt: "icon system",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/icon-system-1.gif",
                alt: "icon system",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/icon-system-3.jpg",
                alt: "icon system",
                caption: "",
                captionsub: ""
            }],
            [{
                url: "/assets/css/images/awards.svg",
                alt: "awards",
                caption: "",
                captionsub: ""
            }, {
                url: "/assets/css/images/awards-1.png",
                alt: "awards",
                caption: "",
                captionsub: ""
            }]
        ];
        return a
    }), app.directive("pagePreloader", ["$location", "$timeout", "$rootScope", function(a, b, c) {
        return {
            replace: !0,
            transclude: !0,
            templateUrl: "common/components/page-preloader.html",
            link: function(d, e) {
                if (d.isLoaded = !1, "/" !== a.path()) return d.isLoaded = !0, e.remove(), void angular.element(document).ready(function() {
                    b(function() {
                        c.isTouchable || angular.element(document.getElementById("slide-0")).addClass("set-intro-animation")
                    })
                });
                var f = document.getElementsByClassName("wrapper"),
                    g = angular.element(f),
                    h = document.getElementsByTagName("main"),
                    i = angular.element(h);
                g.css({
                    visibility: "hidden"
                }), angular.element(document).ready(function() {
                    g.css({
                        visibility: "visible"
                    }), b(function() {
                        e.addClass("start-animation-preloader"), i.addClass("start-animation-main"), c.isTouchable || angular.element(document.getElementById("slide-0")).addClass("set-intro-animation")
                    }, 1500), i.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
                        d.isLoaded = !0, i.off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd"), e.remove()
                    })
                })
            }
        }
    }]), app.controller("dashboard", ["$scope", "$rootScope", "$timeout", "infinitySliderData", function(a, b, c, d) {
        var e = ["introMoveTop0", "introMoveTop1", "introMoveTop2", "introMoveTop3", "introMoveTop4", "introMoveTop5", "introMoveTop6", "introMoveTop7", "introMoveTop8"];
        angular.element(document.getElementById("slide-0")).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(a) {
            e.forEach(function(b) {
                -1 !== a.target.className.search(b) && (angular.element(document.getElementsByClassName(b)).addClass("flyAnimation"), angular.element(document.getElementsByClassName(b)).removeClass(b))
            })
        }), angular.element(document.querySelector("main")).addClass("fixed-needed"), b.$on("$routeChangeStart", function() {
            angular.element(document.querySelector("main")).removeClass("fixed-needed")
        }), b.scrollToTop = function() {
            angular.element(document.querySelector(".browser")).scrollTo(0, 0, 400)
        }, a.scrollTo = function(a) {
            angular.element(document.querySelector(".browser")).scrollTo(document.getElementById(a), 0, 400)
        }, a.scroll = {
            slideCurrVisible: -1,
            infSliderVisible: -1
        }, a.flipPromises = {}, a.autoSlide = function(b) {
            a[b] = !a[b], a.flipPromises[b] = c(function() {
                a.autoSlide(b)
            }, 5e3)
        }, a.flipSlide = function(b) {
            a[b] = !a[b], c.cancel(a.flipPromises[b]), a.flipPromises[b] = c(function() {
                a.autoSlide(b)
            }, 5e3)
        }, a.infinitySlides = d, c(function() {
            a.autoSlide("slideIn1s")
        }, 1e3), c(function() {
            a.autoSlide("slideIn2s")
        }, 2e3), c(function() {
            a.autoSlide("slideIn3s")
        }, 3e3), c(function() {
            a.autoSlide("slideIn4s")
        }, 4e3), c(function() {
            a.autoSlide("slideIn5s")
        }, 5e3), c(function() {
            a.autoSlide("slideIn6s")
        }, 5e3), a.$on("$destroy", function() {
            angular.forEach(a.flipPromises, function(a) {
                c.cancel(a)
            })
        })
    }]), app.controller("shareLayer", ["$scope", "$window", function(a, b) {
        a.openInWindow = function(a, c, d) {
            c = c || 520, d = d || 350;
            var e = window.innerHeight / 2 - d / 2,
                f = window.innerWidth / 2 - c / 2;
            b.open(a, "sharer", "top=" + e + ",left=" + f + ",toolbar=0,status=0,width=" + c + ",height=" + d)
        }
    }]);