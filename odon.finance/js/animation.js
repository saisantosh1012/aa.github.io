/* CONVERT FUNCTION FOR INITIAL SUPPLY */

const formatCash = n => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

const dotDecimals = function() {
    initialSupply = initialSupply / Math.pow(10, 18);
}


// animations

setTimeout(canvas, 2200);

function canvas() {
    (function() {
        var Util,
            __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            };

        Util = (function() {
            function Util() {}

            Util.prototype.extend = function(custom, defaults) {
                var key, value;
                for (key in custom) {
                    value = custom[key];
                    if (value != null) {
                        defaults[key] = value;
                    }
                }
                return defaults;
            };

            Util.prototype.isMobile = function(agent) {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
            };

            return Util;

        })();

        this.WOW = (function() {
            WOW.prototype.defaults = {
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: true
            };

            function WOW(options) {
                if (options == null) {
                    options = {};
                }
                this.scrollCallback = __bind(this.scrollCallback, this);
                this.scrollHandler = __bind(this.scrollHandler, this);
                this.start = __bind(this.start, this);
                this.scrolled = true;
                this.config = this.util().extend(options, this.defaults);
            }

            WOW.prototype.init = function() {
                var _ref;
                this.element = window.document.documentElement;
                if ((_ref = document.readyState) === "interactive" || _ref === "complete") {
                    return this.start();
                } else {
                    return document.addEventListener('DOMContentLoaded', this.start);
                }
            };

            WOW.prototype.start = function() {
                var box, _i, _len, _ref;
                this.boxes = this.element.getElementsByClassName(this.config.boxClass);
                if (this.boxes.length) {
                    if (this.disabled()) {
                        return this.resetStyle();
                    } else {
                        _ref = this.boxes;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            box = _ref[_i];
                            this.applyStyle(box, true);
                        }
                        window.addEventListener('scroll', this.scrollHandler, false);
                        window.addEventListener('resize', this.scrollHandler, false);
                        return this.interval = setInterval(this.scrollCallback, 50);
                    }
                }
            };

            WOW.prototype.stop = function() {
                window.removeEventListener('scroll', this.scrollHandler, false);
                window.removeEventListener('resize', this.scrollHandler, false);
                if (this.interval != null) {
                    return clearInterval(this.interval);
                }
            };

            WOW.prototype.show = function(box) {
                this.applyStyle(box);
                return box.className = "" + box.className + " " + this.config.animateClass;
            };

            WOW.prototype.applyStyle = function(box, hidden) {
                var delay, duration, iteration;
                duration = box.getAttribute('data-wow-duration');
                delay = box.getAttribute('data-wow-delay');
                iteration = box.getAttribute('data-wow-iteration');
                return box.setAttribute('style', this.customStyle(hidden, duration, delay, iteration));
            };

            WOW.prototype.resetStyle = function() {
                var box, _i, _len, _ref, _results;
                _ref = this.boxes;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    box = _ref[_i];
                    _results.push(box.setAttribute('style', 'visibility: visible;'));
                }
                return _results;
            };

            WOW.prototype.customStyle = function(hidden, duration, delay, iteration) {
                var style;
                style = hidden ? "visibility: hidden; -webkit-animation-name: none; -moz-animation-name: none; animation-name: none;" : "visibility: visible;";
                if (duration) {
                    style += "-webkit-animation-duration: " + duration + "; -moz-animation-duration: " + duration + "; animation-duration: " + duration + ";";
                }
                if (delay) {
                    style += "-webkit-animation-delay: " + delay + "; -moz-animation-delay: " + delay + "; animation-delay: " + delay + ";";
                }
                if (iteration) {
                    style += "-webkit-animation-iteration-count: " + iteration + "; -moz-animation-iteration-count: " + iteration + "; animation-iteration-count: " + iteration + ";";
                }
                return style;
            };

            WOW.prototype.scrollHandler = function() {
                return this.scrolled = true;
            };

            WOW.prototype.scrollCallback = function() {
                var box;
                if (this.scrolled) {
                    this.scrolled = false;
                    this.boxes = (function() {
                        var _i, _len, _ref, _results;
                        _ref = this.boxes;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            box = _ref[_i];
                            if (!(box)) {
                                continue;
                            }
                            if (this.isVisible(box)) {
                                this.show(box);
                                continue;
                            }
                            _results.push(box);
                        }
                        return _results;
                    }).call(this);
                    if (!this.boxes.length) {
                        return this.stop();
                    }
                }
            };

            WOW.prototype.offsetTop = function(element) {
                var top;
                top = element.offsetTop;
                while (element = element.offsetParent) {
                    top += element.offsetTop;
                }
                return top;
            };

            WOW.prototype.isVisible = function(box) {
                var bottom, offset, top, viewBottom, viewTop;
                offset = box.getAttribute('data-wow-offset') || this.config.offset;
                viewTop = window.pageYOffset;
                viewBottom = viewTop + this.element.clientHeight - offset;
                top = this.offsetTop(box);
                bottom = top + box.clientHeight;
                return top <= viewBottom && bottom >= viewTop;
            };

            WOW.prototype.util = function() {
                return this._util || (this._util = new Util());
            };

            WOW.prototype.disabled = function() {
                return !this.config.mobile && this.util().isMobile(navigator.userAgent);
            };

            return WOW;

        })();

    }).call(this);


    wow = new WOW({
        animateClass: 'animated',
        offset: 100
    });
    wow.init();
};


var waypoint = new Waypoint({
    element: document.getElementById('token-sale'),
    handler: function() {

        const obj2 = document.getElementById("counter2");
        animateValueCounters(obj2, 0, initialSupply, 2500);

        //const obj3 = document.getElementById("counter3");
        //animateValueCounters(obj3, 0, 256739, 2500);

        //const obj4 = document.getElementById("counter4");
        //animateValueCounters(obj4, 0, 18, 2500);

        /* the top 3 are for div in token-sale and index */
        //this.destroy();
    }
}, {
    triggerOnce: true
})


/* API FOR TOTAL HOLDERS */

var totalHolders = 0;
var totalSupply = 0;
var initialSupply = 0;

fetch('https://api.covalenthq.com/v1/56/tokens/0x04486A7b832c5270B24d1c4B4E86F17b74B88549/token_holders/?quote-currency=USD&format=JSON&key=ckey_e2bc4cc873214ce39f56c774e20')
    // Handle success
    .then(response => response.json()) // convert to json

    .then(

        json => {
            console.log(json),
                totalHolders = json.data.items.length,
                totalSupply = json.data.items[0].total_supply,
                totalSupply = totalSupply.slice(0, 8),
                initialSupply = json.data.items[12].balance,
                initialSupply = initialSupply / Math.pow(10, 18)

        }

    ) //print data to console

    .catch(err => console.log('Request Failed', err)); // Catch errors  

waypoint = new Waypoint({
    element: document.getElementById('token-sale'),
    handler: function() {

        //const obj2 = document.getElementById("counter2");
        //animateValueCounters(obj2, 0, 12, 2500);

        const obj3 = document.getElementById("counter3");
        animateValueCounters(obj3, 0, totalHolders, 2500);

        //const obj4 = document.getElementById("counter4");
        //animateValueCounters(obj4, 0, 18, 2500);

        /* the top 3 are for div in token-sale and index */
        //this.destroy();
    }
}, {
    triggerOnce: true
})

waypoint = new Waypoint({
    element: document.getElementById('token-sale'),
    handler: function() {

        //const obj2 = document.getElementById("counter2");
        //animateValueCounters(obj2, 0, 12, 2500);

        //const obj3 = document.getElementById("counter3");
        //animateValueCounters(obj3, 0, 256739, 2500);

        const obj4 = document.getElementById("counter4");

        animateValueCounters(obj4, 0, totalSupply, 2500);

        /* the top 3 are for div in token-sale and index */
        //this.destroy();
    }
}, {
    triggerOnce: true
})

waypoint = new Waypoint({

    element: document.getElementById('animation1'),
    handler: function() {


        var items = document.getElementsByClassName("fade-item1");
        for (let i = 0; i < items.length; ++i) {
            fadeIn(items[i], i * 500)
        }

        function fadeIn(item, delay) {
            setTimeout(() => {
                item.classList.add('fadein1')
            }, delay)
        }

        // this.destroy();
    }
}, {
    triggerOnce: true
})

function animateValueCounters(obj, start, end, duration) {

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

var click1 = false;
active2.addEventListener('click', () => {

    if (!click1) {
        document.getElementById("active2").classList.add('active1');
        click1 = true;
    } else {
        document.getElementById("active2").classList.remove('active1');
        click1 = false;
    }
});