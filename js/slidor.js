var Slidor = function (options) {
    options = options || {};
    var success = options.success,
        error = options.error,
        el = $(options.el),
        svgFilename = options.svgFilename,
        mode = options.mode || "svg",
        transitionDuration = options.transformDuration || 1000,

        mainGroup, svg, viewBox, origin = {x:0, y:0},

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
        };

    Slidor.prototype.animateWithTransformation = function (slide) {
        var m = Slidor.matrixUtil.calculateTransformationMatrix({
            container: document.body,
            slide: slide,
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

    Slidor.svgUtil.loadSvg({
        el: el,
        svgFilename: svgFilename,
        success: function (loadedSvg) {
            svg = loadedSvg;
            if (success) {
                if (mode === "css") {
                    initCssTransformation();
                } else {
                    initSvgTransformation();
                }
                success(svg);
                if (mode === "css" && transitionDuration) {
                    var transitionString = "all "+transitionDuration+"ms ease-in";
                    el
                            .css("-webkit-transition", transitionString)
                            .css("-moz-transition", transitionString)
                            .css("-o-transition", transitionString)
                            .css("transition", transitionString);
                }
            }
        },
        error: error
    });
};