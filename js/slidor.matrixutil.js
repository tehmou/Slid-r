Slidor.matrixUtil = {};

(function () {
    
    Slidor.matrixUtil.applyTransformationMatrix = function (options) {
        var $el = $(options.el),
            m = options.matrix,
            matrixString = "matrix("+m.a1+", "+m.a2+", "+m.b1+", "+m.b2+", "+m.c1+", "+m.c2+")",
            matrixStringFF = "matrix("+m.a1+", "+m.a2+", "+m.b1+", "+m.b2+", "+m.c1+"px, "+m.c2+"px)",
            transformOriginString = "0px 0px";//m.c1+"px "+m.c2+"px";
        $el
                .css("-moz-transform", matrixStringFF)
                .css("-webkit-transform", matrixString)
                .css("-o-transform", matrixString)
                .css("transform", matrixString)
                .css("-moz-transform-origin", transformOriginString)
                .css("-webkit-transform-origin", transformOriginString)
                .css("-o-transform-origin", transformOriginString)
                .css("transform-origin", transformOriginString);
    };

    Slidor.matrixUtil.calculateTransformationMatrix = function (options) {
        options = options || {};
        var $el = $(options.container),
            slide = options.slide,
            origin = options.origin || {x:0, y:0},
            canvasWidth = parseFloat($el.width()),
            canvasHeight = parseFloat($el.height()),
            scaleX = canvasWidth / slide.width,
            scaleY = canvasHeight / slide.height
            scale = Math.min(scaleX, scaleY),
            t = {};

        t.scaleX = scale;
        t.scaleY = scale;

        t.rotation = 0;

        t.translateX = -(slide.x-origin.x)*scale + (canvasWidth - scale*slide.width) / 2;
        t.translateY = -(slide.y-origin.y)*scale + (canvasHeight - scale*slide.height) / 2;

        return { a1:t.scaleX||1,a2:0,b1:0,b2:t.scaleY||1,c1:t.translateX||0,c2:t.translateY||0 };
    };

}());
