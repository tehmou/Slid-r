Slidor.matrixUtil = {};

(function () {
    
    Slidor.matrixUtil.applyTransformationMatrix = function (options) {
        var $el = $(options.el),
            m = options.matrix,
            matrixString = "matrix("+m.a1+", "+m.a2+", "+m.b1+", "+m.b2+", "+m.c1+", "+m.c2+")",
            matrixStringFF = "matrix("+m.a1+", "+m.a2+", "+m.b1+", "+m.b2+", "+m.c1+"px, "+m.c2+"px)";
        $el
                .css("-moz-transform", matrixStringFF)
                .css("-webkit-transform", matrixString)
                .css("-o-transform", matrixString)
                .css("transform", matrixString)
                .css("transform-origin", "0px 0px");
    };

    Slidor.matrixUtil.applyTransformations = function (options) {
        var el = options.el,
            t = options.transformations,
            matrix = { a1:t.scaleX||1,a2:0,b1:0,b2:t.scaleY||1,c1:t.translateX||0,c2:t.translateY||0 };
        Slidor.matrixUtil.applyTransformationMatrix({ el: el, matrix: matrix });
    };

    Slidor.matrixUtil.calculateTransformations = function (options) {
        options = options || {};
        var $el = $(options.container),
            slide = options.slide,
            canvasWidth = parseFloat($el.width()),
            canvasHeight = parseFloat($el.height()),
            t = {};

        //t.scaleX = canvasWidth / slide.width;
        //t.scaleY = canvasHeight / slide.height;

        t.rotation = 0;

        t.translateX = -slide.x;
        t.translateY = -slide.y;

        return t;
    };

}());
