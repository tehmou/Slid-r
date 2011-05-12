Slidor.presentation = {};

Slidor.presentation.create = function (options) {
    var autoStart = options.autoStart || false,
        autoRewind = options.autoRewind || false,
        hideFrames = options.hideFrames,

        slidor,
        presentation = this,
        slides = [],
        currentSlideIndex = -1;

    slidor = new Slidor({
        el: options.el,
        svgFilename: options.svgFilename,
        mode: options.mode,
        transitionDuration: options.transformDuration,
        success: function (loadedSvg) {
            slides = Slidor.svgUtil.readSlides({
                svg: loadedSvg,
                hideFrames: hideFrames,
                gotoCallback: presentation.gotoSlide
            });
            if (autoStart) {
                presentation.showNextSlide();
            }
        },
        error: function () {
            alert("Error loading svg file " + svgFilename);
        }
    });
    
    this.gotoSlide = function (target) {
        alert(target);
    };

    this.showPrevSlide = function () {
        for (var i = currentSlideIndex - 1; i >= 0; i--) {
            if (slides.presentationRoot[i]) {
                currentSlideIndex = i;
                slidor.animateWithTransformation(slides.presentationRoot[currentSlideIndex]);
                return;
            }
        }
    };

    this.showNextSlide = function () {
        if (slides.length === 0) {
            return;
        }
        for (var i = currentSlideIndex + 1; i < slides.presentationRoot.length; i++) {
            if (slides.presentationRoot[i]) {
                currentSlideIndex = i;
                slidor.animateWithTransformation(slides.presentationRoot[currentSlideIndex]);
                return;
            }
        }
        if (autoRewind && currentSlideIndex === slides.presentationRoot.length - 1) {
            currentSlideIndex = -1;
            this.showNextSlide();
        }
    };

    return this;
}