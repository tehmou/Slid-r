Slidor.matrixUtil = {};

(function () {
    
    Slidor.matrixUtil.applyTransformationMatrix = function (options) {
        var $el = $(options.el),
            m = options.matrix,
            matrixString = "matrix("+m.a1+", "+m.a2+", "+m.b1+", "+m.b2+", "+m.c1+", "+m.c2+")",
            matrixStringFF = "matrix("+m.a1+", "+m.a2+", "+m.b1+", "+m.b2+", "+m.c1+"px, "+m.c2+"px)",
            originString = "0px 0px";//m.c1+"px "+m.c2+"px";
        $el
                .css("-moz-transform", matrixStringFF)
                .css("-webkit-transform", matrixString)
                .css("-o-transform", matrixString)
                .css("transform", matrixString)
                .css("-moz-transform-origin", originString)
                .css("-webkit-transform-origin", originString)
                .css("-o-transform-origin", originString)
                .css("transform-origin", originString);
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
            t = {},
            scaleX = canvasWidth / slide.width,
            scaleY = canvasHeight / slide.height,
            scale = Math.min(scaleX, scaleY);

        t.scaleX = scale;
        t.scaleY = scale;

        t.rotation = 0;

        var offsetX = (canvasWidth - slide.width*scale)/2;
        console.log(offsetX);
        t.translateX = -slide.x * scale + offsetX;
        t.translateY = -slide.y * scaleY;

        return t;
    };

}());
