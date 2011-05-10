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
            transformations = {};

        transformations.scaleX = (canvasWidth / (slide.sideways ? slide.height : slide.width));
        transformations.scaleY = (canvasHeight / (slide.sideways ? slide.width : slide.height));

        transformations.rotation = slide.sideways ? Math.PI / 2 : 0;

        if (slide.sideways) {
            transformations.translateX = slide.y + canvasWidth/transformations.scaleX;
            transformations.translateY = -slide.x;
        } else {
            transformations.translateX = -slide.x;
            transformations.translateY = -slide.y;
        }
        
        return transformations;
    };

}());
