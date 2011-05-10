var Slidor = function (options) {
    options = options || {};
    var slidor = this,
        hideFrames = options.hideFrames,
        svgFilename = options.svgFilename,
        mode = options.mode || "svg",
        transitionDuration = options.transformDuration || 1000,
        el = $(options.el), mainGroup, svg,

        initSvgTransformation = function (options) {
            el.css("width", svg._width());
            el.css("height", svg._height());
            svg.root().setAttribute("viewBox", "0 0 " + svg._width() + " " + svg._height());
            mainGroup = $("g:first", svg.root());
        },
        initCssTransformation = function (options) {
            var viewBox = Slidor.svgUtil.readViewBox(svg);
            el.css("width", viewBox.width);
            el.css("height", viewBox.height);
            svg.root().setAttribute("width", viewBox.width);
            svg.root().setAttribute("height", viewBox.height);
        },

        slides = [],
        currentSlideIndex = -1,
        animateWithTransformation = function () {
            var t = Slidor.matrixUtil.calculateTransformations({ container: document.body, slide: slides[currentSlideIndex] });
            if (mode === "css") {
                Slidor.matrixUtil.applyTransformations({ el: el, transformations: t });
            } else {
                Slidor.svgUtil.animateWithTransformation({
                    group: mainGroup,
                    transformations: t,
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
    };

    Slidor.svgUtil.loadSvg({
        el: el,
        svgFilename: svgFilename,
        hideFrames: hideFrames,
        success: function (loadedSvg) {
            svg = loadedSvg;
            slides = Slidor.svgUtil.readSlides({ svg: svg, hideFrames: hideFrames });
            if (mode === "css") {
                initCssTransformation();
                slidor.showNextSlide();

                if (transitionDuration) {
                    setTimeout(function () {
                        var transitionString = "all "+transitionDuration+"ms ease-in";
                        el
                                .css("-webkit-transition", transitionString)
                                .css("-moz-transition", transitionString)
                                .css("-o-transition", transitionString)
                                .css("transition", transitionString);
                    }, 300);
                }
            } else {
                initSvgTransformation();
                slidor.showNextSlide();
            }
        },
        error: function () {
            alert("Error loading svg file " + svgFilename);
        }
    });
};