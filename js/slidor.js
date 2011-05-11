var Slidor = function (options) {
    options = options || {};
    var slidor = this,
        hideFrames = options.hideFrames,
        svgFilename = options.svgFilename,
        mode = options.mode || "svg",
        autoStart = options.autoStart || false,
        autoRewind = options.autoRewind || false,
        transitionDuration = options.transformDuration || 1000,
        el = $(options.el), mainGroup, svg, viewBox, origin = {x:0, y:0},

        initSvgTransformation = function () {
            svg.root().setAttribute("viewBox", "0 0 " + el.width() + " " + el.height());
            mainGroup = $("g:first", svg.root());
        },
        initCssTransformation = function () {
            viewBox = Slidor.svgUtil.readViewBox(svg);
            el.css("width", viewBox.width);
            el.css("height", viewBox.height);
            svg.root().setAttribute("width", viewBox.width);
            svg.root().setAttribute("height", viewBox.height);
            origin.x = viewBox.x;
            origin.y = viewBox.y;
        },

        slides = [],
        currentSlideIndex = -1,
        animateWithTransformation = function () {
            var m = Slidor.matrixUtil.calculateTransformationMatrix({
                container: document.body,
                slide: slides[currentSlideIndex],
                origin: origin
            });
            if (mode === "css") {
                Slidor.matrixUtil.applyTransformationMatrix({ el: el, matrix: m });
            } else {
                Slidor.svgUtil.animateWithTransformation({
                    group: mainGroup,
                    matrix: m,
                    duration: transitionDuration
                });
            }
        };

    this.showPrevSlide = function () {
        for (var i = currentSlideIndex - 1; i >= 0; i--) {
            if (slides[i]) {
                currentSlideIndex = i;
                animateWithTransformation();
                return;
            }
        }
    };

    this.showNextSlide = function () {
        for (var i = currentSlideIndex + 1; i < slides.length; i++) {
            if (slides[i]) {
                currentSlideIndex = i;
                animateWithTransformation();
                return;
            }
        }
        if (autoRewind && currentSlideIndex === slides.length - 1) {
            currentSlideIndex = -1;
            this.showNextSlide();
        }
    };

    Slidor.svgUtil.loadSvg({
        el: el,
        svgFilename: svgFilename,
        hideFrames: hideFrames,
        success: function (loadedSvg) {
            svg = loadedSvg;
            if (mode === "css") {
                initCssTransformation();
            } else {
                initSvgTransformation();
            }
            slides = Slidor.svgUtil.readSlides({ svg: svg, hideFrames: hideFrames });
            if (autoStart) {
                slidor.showNextSlide();
            }

            if (mode === "css" && transitionDuration) {
                var transitionString = "all "+transitionDuration+"ms ease-in";
                el
                        .css("-webkit-transition", transitionString)
                        .css("-moz-transition", transitionString)
                        .css("-o-transition", transitionString)
                        .css("transition", transitionString);
            }
        },
        error: function () {
            alert("Error loading svg file " + svgFilename);
        }
    });
};