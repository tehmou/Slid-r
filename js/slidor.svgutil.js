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

                var viewBoxArray = svg.root().getAttribute("viewBox").split(" "),
                    viewBoxX = parseFloat(viewBoxArray[0]),
                    viewBoxY = parseFloat(viewBoxArray[1]),
                    viewBoxWidth = parseFloat(viewBoxArray[2]),
                    viewBoxHeight = parseFloat(viewBoxArray[3]),
                    slides = [];

                $(el)
                        .css("width", viewBoxWidth)
                        .css("height", viewBoxHeight);

                svg.root().setAttribute("width", viewBoxWidth);
                svg.root().setAttribute("height", viewBoxHeight);


                console.log(viewBoxArray);


                $("rect", svg.root()).each(function (index, value) {
                    var $value = $(value),
                        slideMatch = $value.attr("id").match(/^slide([0-9]*)(.*)/);
                    if (slideMatch) {
                        var slideIndex = parseInt(slideMatch[1]),
                            slideOptions = slideMatch[2] || "",
                            slide = {
                                x: parseFloat($value.attr("x")) - viewBoxX,
                                y: parseFloat($value.attr("y")) - viewBoxY,
                                width: parseFloat($value.attr("width")),
                                height: parseFloat($value.attr("height"))
                            };
                        console.log(slide.x + ", " + slide.y);
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