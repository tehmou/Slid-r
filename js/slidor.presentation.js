Slidor.presentation = {};

Slidor.presentation.createSlideStack = function (options) {
    var slides = options.slides || [],
        showCallback = options.showCallback,
        endCallback = options.endCallback,
        previousOfFirstCallback = options.previousOfFirstCallback,

        currentIndex = -1,

        show = function () {
            if (showCallback) {
                showCallback(slides[currentIndex]);
            }
        },
        previous = function () {
            for (var i = currentIndex - 1; i >= 0; i--) {
                if (slides[i]) {
                    currentIndex = i;
                    show();
                    return;
                }
            }
            if (previousOfFirstCallback) {
                previousOfFirstCallback();
            }
        },
        next = function () {
            if (slides.length === 0) {
                return;
            }
            for (var i = currentIndex + 1; i < slides.length; i++) {
                if (slides[i]) {
                    currentIndex = i;
                    show();
                    return;
                }
            }
            if (endCallback) {
                endCallback();
            }
        },
        reset = function () {
            currentIndex = -1;
            next();
        };

    return {
        show: show,
        next: next,
        previous: previous,
        reset: reset
    };
};

Slidor.presentation.create = function (options) {
    var autoStart = options.autoStart || false,
        autoRewind = options.autoRewind || false,
        hideFrames = options.hideFrames,

        slidor,
        presentation = this,
        readSlides = [],
        slideStackStack = [],

        popSlideStack = function () {
            if (slideStackStack.length > 1) {
                slideStackStack.splice(0, 1);
                slideStackStack[0].show();
                return true;
            }
            return false;
        },
        createSlideStack = function (slides) {
            return Slidor.presentation.createSlideStack({
                slides: slides,
                showCallback: function (slide) {
                    console.log(slide);
                    slidor.animateWithTransformation(slide);
                },
                previousOfFirstCallback: function () {
                    popSlideStack();
                },
                endCallback: function () {
                    if (!popSlideStack() && autoRewind) {
                        slideStackStack[0].reset();
                    }
                },
                previousOfFirstCallback: popSlideStack
            })
        };

    slidor = new Slidor({
        el: options.el,
        svgFilename: options.svgFilename,
        mode: options.mode,
        transitionDuration: options.transformDuration,
        success: function (loadedSvg) {
            readSlides = Slidor.svgUtil.readSlides({
                svg: loadedSvg,
                hideFrames: hideFrames,
                gotoCallback: presentation.gotoSlide
            });
            slideStackStack = [createSlideStack(readSlides.presentationRoot)];
            if (autoStart) {
                presentation.showNextSlide();
            }
        },
        error: function () {
            alert("Error loading svg file " + svgFilename);
        }
    });
    
    this.gotoSlide = function (target) {
        var newSlides = readSlides.slideGroups[target], slideStack;
        if (!newSlides) {
            alert("Cloud not find slide group " + target);
            return;
        }
        slideStack = createSlideStack(newSlides);
        slideStackStack.splice(0, 0, slideStack);
        presentation.showNextSlide();
    };

    this.showPrevSlide = function () {
        slideStackStack[0].previous();
    };

    this.showNextSlide = function () {
        slideStackStack[0].next();
    };

    this.reset = function () {
        slideStackStack = [slideStackStack[slideStackStack.length - 1]];
        slideStackStack[0].reset();
    };

    return this;
}