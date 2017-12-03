"use strict";

function ReworkActivity() {
    var t = new Listener(GOING_TIMER),
        e = new Modal({
            id: "#waiterModal",
            middleware: function (i) {
                return i.find("button").click(function (i) {
                    t.ForceAction(), e.toggleState()
                })
            }
        });
    t.ForceStart(function (t) {
        window.WModals.signModal.isOpened() && window.WModals.signModal.toggleState(), e.toggleState()
    }), HOLDUP_POPUP = new Modal({
        id: "#errorModal",
        middleware: function (t) {
            return t.find("button").click(function (t) {
                return HOLDUP_POPUP.toggleState()
            })
        }
    })
}

function ReworkAuction() {
    GET("/auction/current").then(function (t) {
        0 == t.code && (new Auction).load(t.data)
    }).catch()
}

function Auction() {
    var t = this;
    this.appender = $(".pins"), this.empty = $(".empty"), this.storage = {};
    var e = io("/auction");
    e.on("connect", function () {
        return console.log("connection established")
    }), e.on("disconnect", function (t) {
        return e.connect()
    }), e.on("inactive", function (e) {
        "featured" != e.type && "reserved" != e.type || t.storage[e.type].inactiveItem(e), t.storage[e.category].inactiveItem(e)
    }), e.on("bid", function (e) {
        "featured" != e.type && "reserved" != e.type || t.storage[e.type].changeItem(e), t.storage[e.category].changeItem(e)
    }), e.on("end", function (e) {
        "featured" != e.type && "reserved" != e.type || t.storage[e.type].soldItem(e), t.storage[e.category].soldItem(e)
    }), e.on("new", function (e) {
        "featured" != e.type && "reserved" != e.type || t.storage[e.type].addItem(e), t.storage[e.category].addItem(e)
    }), this.load = function (e) {
        e.forEach(function (e) {
            "featured" != e.type && "reserved" != e.type || t.storage[e.type].addItem(e), t.storage[e.category].addItem(e)
        })
    }, this.push = function (e) {
        t.storage[e.id] = e
    }, $(".auction_block").each(function (e, i) {
        return t.push(new ItemController(i))
    })
}

function ItemController(t) {
    var e = this;
    this.items = {}, this.freeSolts = [], this.dom = $(t), this.empty = this.dom.find(".empty"), this.id = this.dom.data("tab"), this.addItem = function (t) {
        if (e.freeSolts.length > 0) {
            var i = e.freeSolts.shift();
            return e.items[t.id] = i, void e.items[t.id].ForceNew(t)
        }
        var n = new Item(t);
        e.items[t.id] = n, Object.keys(e.items).length > 0 && e.empty.hide(), e.dom.append(n.dom)
    }, this.changeItem = function (t) {
        e.items[t.id].ForceChange(t)
    }, this.soldItem = function (t) {
        var i = e.items[t.id];
        i.ForceEnding(t), delete e.items[t.id], setTimeout(function (n) {
            i.ForceNext(t), e.freeSolts.push(i)
        }, 2e3)
    }, this.inactiveItem = function (t) {
        var i = e.items[t.id];
        delete e.items[t.id], i.ForceNext(t), e.freeSolts.push(i)
    }
}

function Item(t) {
    var e = this;
    return this.data = t, this.dom = $(getRender(this.data)), this.intervals = {
        offset: void 0,
        static: void 0,
        progress: void 0
    }, this.timers = {
        static: this.dom.find(".timer"),
        going: this.dom.find(".placer")
    }, this.subdoms = {
        button: this.dom.find(".ui.button"),
        static: this.timers.static.find("span"),
        going: this.timers.going.find("span"),
        name: this.dom.find(".name"),
        progress: this.dom.find(".ui.progress"),
        product: this.dom.find(".product.auction"),
        img: this.dom.find("a img"),
        href: this.dom.find("a"),
        title: this.dom.find(".title"),
        rrp: this.dom.find(".rrpcost"),
        bid: this.dom.find(".bigger span"),
        shipment: this.dom.find(".smaller span")
    }, this.helpful = {
        awaiter: $('<i class="fa fa-cog fa-spin" style=""></i>')
    }, this.LoadTimer = function (t) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        e.subdoms.name.removeClass("waiting"), e.helpful.awaiter.remove();
        var i = Math.abs((new Date).getTime() - new Date(t.end).getTime()),
            n = i % 1e3,
            s = (i - n) / 1e3,
            a = s - GOING_OFFSET;
        clearTimeout(e.intervals.offset), clearInterval(e.intervals.static), t.user == window.WAuth.getData().user.uid ? e.subdoms.name.addClass("my") : e.subdoms.name.removeClass("my"), e.subdoms.name.transition("bounce", {
            silent: !0,
            duration: 800
        }), e.subdoms.name.text(t.name), e.subdoms.bid.text(t.bid / 100), e.SetDate(a, s, getTime(s - GOING_OFFSET)), e.intervals.offset = setTimeout(function (t) {
            s--, e.intervals.static = setInterval(function () {
                0 == s && clearInterval(e.intervals.static), e.SetDate(a, s, getTime(s - GOING_OFFSET)), s--
            }, 1e3)
        }, n)
    }, this.LoadWaiting = function (t) {
        var i = Math.abs((new Date).getTime() - new Date(t.end).getTime()),
            n = i % 1e3,
            s = (i - n) / 1e3,
            a = s + GOING_OFFSET;
        clearTimeout(e.intervals.offset), clearInterval(e.intervals.static), e.SetDate(a, s, getTime(s), !0), e.intervals.offset = setTimeout(function (t) {
            s--, e.intervals.static = setInterval(function () {
                0 == s && clearInterval(e.intervals.static), e.SetDate(a, s, getTime(s), !0), s--
            }, 1e3)
        }, n)
    }, this.SetTimer = function (t, i, n, s) {
        e.timers.going.hide(), e.timers.static.show(), s || e.subdoms.progress.progress({
            percent: getPercent(i, n - GOING_OFFSET)
        }), e.subdoms.static.text(t.minutes + ":" + t.seconds)
    }, this.SetText = function (t, i) {
        e.timers.static.hide(), e.timers.going.show(), e.subdoms.progress.progress({
            percent: getPercent(10, i - ("once" == t ? 10 : 0))
        }), e.subdoms.going.text(t)
    }, this.SetDate = function (t, i, n) {
        var s = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        s ? e.SetTimer(n, t, i, s) : i > GOING_OFFSET ? e.SetTimer(n, t, i, s) : i <= GOING_OFFSET && i > GOING_OFFSET / 2 ? e.SetText("once", i) : e.SetText("twice", i)
    }, this.ForceNew = function (t) {
        e.data = t, e.subdoms.img.attr("src", e.data.img), e.subdoms.href.attr("href", "/product/id" + e.data.product), e.subdoms.title.text(e.data.text), e.subdoms.rrp.text(e.data.cost), e.subdoms.bid.text(e.data.bid / 100), e.subdoms.shipment.text(e.data.shipment), e.subdoms.product.addClass(getType(t.type)), e.subdoms.static.text("Waiting for the first bid"), e.timers.static.show(), e.timers.going.hide(), e.subdoms.name.removeClass("my"), e.subdoms.name.text(""), e.subdoms.name.append(e.helpful.awaiter), e.subdoms.name.addClass("waiting"), e.subdoms.product.removeClass("loading"), e.LoadWaiting(t)
    }, this.ForceChange = function (t) {
        console.log(new Date(t.end).getTime())
        return e.LoadTimer(t, !0)
    }, this.ForceEnding = function () {
        e.subdoms.product.addClass("sold"), e.subdoms.going.text("last")
    }, this.ForceNext = function () {
        e.subdoms.product.addClass("loading"), e.subdoms.product.removeClass("sold purple orange pink reserved")
    }, this.construct = function () {
        void 0 == e.data.user ? (e.subdoms.static.text("Waiting for the first bid"), e.subdoms.name.text(""), e.subdoms.name.append(e.helpful.awaiter), e.subdoms.name.addClass("waiting"), e.LoadWaiting(e.data)) : e.LoadTimer(e.data, !1), e.subdoms.button.click(function (t) {
            POST("/auction/bid", {
                id: e.data.id
            }).then(function (t) {
                return console.log(t)
            }).catch(function (t) {
                return 11 == t.code ? HOLDUP_POPUP.toggleState() : window.WModals.signModal.toggleState()
            })
        })
    }, this.construct(), this
}

function getType(t) {
    var e = "";
    switch (t) {
        case "featured":
            e = "purple";
            break;
        case "small":
            e = "orange";
            break;
        case "big":
            e = "pink";
            break;
        case "reserved":
            e = "reserved";
            break;
        default:
            e = ""
    }
    return e
}

function getRender(t) {
    return '<div class="col-md-6 col-lg-4">\n      <div class="product auction ' + getType(t.type) + '">\n          <div class="product-content">          \n            <div class="image">  \n               <a href="/product/id' + t.product + '"> <img src="' + t.img + '" alt=""> </a>\n            </div>\n            <div class="title">\n                ' + t.title + '\n            </div>\n            <div class="name">\n                <span>' + t.name + '</span>\n            </div>\n            <div class="numbers">\n                <span class="price">\n                    <span>RRP:</span>\n                        <i class="fa fa-usd" aria-hidden="true"></i>\n                        <span class="rrpcost">' + t.cost + '</span>\n                </span>               \n            </div>\n\n            <button class="ui button blue_button">\n                <div class="bigger">BID $<span>' + t.bid / 100 + '</span></div>\n                <div class="smaller">+$<span>' + t.shipment + '</span> Shipping</div>\n            </button>       \n            \n            <div class="goingfooter">\n                <div class="ui indicating tiny progress">\n                    <div class="bar"></div>        \n                </div>\n\n                <div class="going">               \n                    <div class="timer">\n                        <i class="fa fa-clock-o" aria-hidden="true"></i>\n                        <span> 0:00</span>\n                    </div>\n                    <div class="placer" style="display:none;">\n                        Going <span>once</span>\n                        <img src="/prod/u.assets/img/justice.png">\n                    </div>\n                </div>\n            </div>\n          </div>\n     </div>'
}

function getPercent(t, e) {
    return 100 * e / t
}

function getDifference(t) {
    return Math.abs((new Date).getTime() - new Date(t).getTime())
}

function getTime(t) {
    var e = Math.floor(t / 60),
        i = t % 60;
    return t || (t = 0), e || (e = 0), {
        minutes: (e < 10 ? "0" : "") + e,
        seconds: (i < 10 ? "0" : "") + i
    }
}
var GOING_OFFSET = 20,
    GOING_TIMER = 8e4,
    HOLDUP_POPUP = void 0;
$(function () {
    $(".list_item").tab(), new Nag("usd_nag", {
        key: "usd_nag"
    }), new Nag("cookie_nag", {
        key: "cookie_nag"
    }), ReworkAuction(), ReworkActivity()
});