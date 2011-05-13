Slidor.svgUtil = {};

(function() {
    Slidor.svgUtil.loadSvg = function (options) {
        options = options || {};
        var el = options.el,
            filename = options.svgFilename,
            loadDone = function (svg, error) {
                if (error) {
                    if (options.error) {
                        options.error(error);
                    }
                    return;
                }

                if (options.success) {
                    options.success(svg);
                }
            };

        $(el).svg({
            loadURL: filename,
            onLoad: loadDone,
            settings: {addTo: true, changeSize: false}
        });
    };

    Slidor.svgUtil.readViewBox = function (svg) {
        var viewBoxArray = svg.root().getAttribute("viewBox").split(" ");
        return {
            x: parseFloat(viewBoxArray[0]),
            y: parseFloat(viewBoxArray[1]),
            width: parseFloat(viewBoxArray[2]),
            height: parseFloat(viewBoxArray[3])
        }
    };

    var slideMatcher = /^slide([0-9]*)(.*)/,
        gotoMatcher = /^goto([a-zA-Z0-9]*)/,
        slideGroupMatcher = /^slidegroup([a-zA-Z0-9]*)/;

    Slidor.svgUtil.readSlides = function (options) {
        var svg = options.svg,
            hideFrames = options.hideFrames,
            gotoCallback = options.gotoCallback,
            slides = {
                presentationRoot: [],
                slideGroups: {}
            };

        $("rect", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideMatch = $value.attr("id").match(slideMatcher);

            if (slideMatch) {
                var slideIndex = parseInt(slideMatch[1]),
                    slideOptions = slideMatch[2] || "",
                    slide = Slidor.svgUtil.createSlide($value, slideOptions);
                if (hideFrames !== false) {
                    $value.remove();
                }
                slides.presentationRoot[slideIndex-1] = slide;
                if (slideOptions.indexOf("menu") !== -1) {
                    slides.menuIndex = slideIndex-1;
                    console.log("menu: " + slides.menuIndex);
                }
            }
        });

        $("rect, g", svg.root()).each(function (index, value) {
            var $value = $(value), id = $value.attr("id"),
                gotoMatch = id.match(gotoMatcher);

            if (gotoMatch) {
                $value.click(function () {
                    var gotoTarget = gotoMatch[1];
                    if (gotoCallback) {
                        gotoCallback(gotoTarget);
                    }
                });
            }
        });

        $("g", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideGroupMatch = $value.attr("id").match(slideGroupMatcher);
            if (slideGroupMatch) {
                var slideGroupId = "slidegroup" + slideGroupMatch[1];
                slides.slideGroups[slideGroupId] = {
                    $el: $value,
                    slides: []
                };
                $value.children().each(function (index, value) {
                    var slide = Slidor.svgUtil.createSlide(value, {});
                    slides.slideGroups[slideGroupId].slides.push(slide);
                    slide.$el.detach();
                });
            }
        });

        return slides;
    };

    Slidor.svgUtil.createSlide = function (slideEl, options) {
        var slide = {}, transform, matrix;

        slide.$el = $(slideEl);
        slide.width = parseFloat(slide.$el.attr("width"));
        slide.height = parseFloat(slide.$el.attr("height"));
        slide.options = options;

        transform = slide.$el.attr("transform");
        matrix = transform && transform.match(/matrix\(([-0-9.,]*)\)/);
        if (matrix) {
            var matrixString = matrix[1],
                matrixArray = matrixString.split(",");
            slide.x = matrixArray[4];
            slide.y = matrixArray[5];
            slide.width *= matrixArray[0];
            slide.height *= matrixArray[3];
        } else {
            slide.x = parseFloat(slide.$el.attr("x"));
            slide.y = parseFloat(slide.$el.attr("y"));
        }

        return slide;
    };

    Slidor.svgUtil.animateWithTransformation = function (options) {
        var group = options.group,
            duration = options.duration,
            m = options.matrix,
            transformationString = "matrix("+m.a1+" "+m.a2+" "+m.b1+" "+m.b2+" "+m.c1+" "+m.c2+")";

        group.animate({ svgTransform: transformationString }, duration);
    };

}());