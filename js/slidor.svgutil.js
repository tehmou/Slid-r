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

    Slidor.svgUtil.readSlides = function (options) {
        var svg = options.svg,
            hideFrames = options.hideFrames,
            slides = [];

        $("rect", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideMatch = $value.attr("id").match(/^slide([0-9]*)(.*)/);
            if (slideMatch) {
                var slideIndex = parseInt(slideMatch[1]),
                    slideOptions = slideMatch[2] || "",
                    slide = Slidor.svgUtil.createSlide($value, slideOptions);
                if (hideFrames !== false) {
                    $value.remove();
                }
                slides[slideIndex-1] = slide;
            }
        });

        $("g", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideGroupMatch = $value.attr("id").match(/slidegroup([0-9.]*)/);
            if (slideGroupMatch) {
                $value.children().each(function (index, value) {
                    var slide = Slidor.svgUtil.createSlide($(value), {});
                    slides.push(slide);
                });
            }
        });

        return slides;
    };

    Slidor.svgUtil.createSlide = function ($slideEl, options) {
        var slide = {}, transform, matrix;

        slide.width = parseFloat($slideEl.attr("width"));
        slide.height = parseFloat($slideEl.attr("height"));
        slide.options = options;

        transform = $slideEl.attr("transform");
        matrix = transform && transform.match(/matrix\(([-0-9.,]*)\)/);
        if (matrix) {
            var matrixString = matrix[1],
                matrixArray = matrixString.split(",");
            slide.x = matrixArray[4];
            slide.y = matrixArray[5];
            slide.width *= matrixArray[0];
            slide.height *= matrixArray[3];
        } else {
            slide.x = parseFloat($slideEl.attr("x"));
            slide.y = parseFloat($slideEl.attr("y"));
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