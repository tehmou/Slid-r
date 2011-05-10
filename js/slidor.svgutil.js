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

                var slides = [];
                $("rect", svg.root()).each(function (index, value) {
                    var $value = $(value),
                        slideMatch = $value.attr("id").match(/^slide([0-9]*)(.*)/);
                    if (slideMatch) {
                        var slideIndex = parseInt(slideMatch[1]),
                            slideOptions = slideMatch[2] || "",
                            slide = {
                                x: parseFloat($value.attr("x")), y: parseFloat($value.attr("y")),
                                width: parseFloat($value.attr("width")), height: parseFloat($value.attr("height")),
                                sideways: parseFloat($value.attr("height")) > parseFloat($value.attr("width"))
                            };
                        if (options.hideFrames !== false) {
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

                if (options.success) {
                    options.success(slides);
                }
            };

        $(el).svg({
            loadURL: filename,
            onLoad: loadDone,
            settings: {addTo: true, changeSize: false}
        });
    };
}());