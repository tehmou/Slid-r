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
            hideFrames = options.hideFrames || true,
            viewBox = Slidor.svgUtil.readViewBox(svg),
            slides = [];

        $("rect", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideMatch = $value.attr("id").match(/^slide([0-9]*)(.*)/);
            if (slideMatch) {
                var slideIndex = parseInt(slideMatch[1]),
                    slideOptions = slideMatch[2] || "",
                    slide = {
                        x: parseFloat($value.attr("x")) - viewBox.x,
                        y: parseFloat($value.attr("y")) - viewBox.y,
                        width: parseFloat($value.attr("width")),
                        height: parseFloat($value.attr("height"))
                    };
                console.log(slide.x + ", " + slide.y);
                if (hideFrames !== false) {
                    $value.remove();
                }
                slides[slideIndex-1] = slide;
            }
        });

        for (var i = 1; i < slides.length; i++) {
            if (slides[i - 1].sideways && slides[i].sideways) {
                alert("Does not currently support multiple sideways slides after each other (" + (i - 1) + " and " + i + ")");
            }
        }

        return slides;
    };

    Slidor.svgUtil.animateWithTransformation = function (options) {
        var group = options.group,
            duration = options.duration,
            t = options.transformations,
            transformationString = "matrix("+t.a1+" "+t.a2+" "+t.b1+" "+t.b2+" "+t.c1+" "+t.c2+")";
            group.animate({ svgTransform: transformationString }, duration);
    };

}());