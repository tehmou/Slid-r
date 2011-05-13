Slidor.presentation = {};

Slidor.presentation.create = function (options) {
    var hideFrames = options.hideFrames,

        slidor,
        presentation = this,
        readSlides = [],
        slideStackStack = Slidor.presentation.createSlideStackStack(),

        createNormalSlideStack = function (slides) {
            return Slidor.presentation.createSlideStack({
                slides: slides,
                showCallback: function (slide) {
                    slidor.animateWithTransformation(slide);
                }
            });
        },
        createGroupSlideStack = function (slideGroup) {
            var currentSlide;

            return Slidor.presentation.createSlideStack({
                slides: slideGroup.slides,
                showCallback: function (slide) {
                    var previousSlide = currentSlide;
                    if (slideGroup.$el.children().length === 0) {
                        slideGroup.$el.css("opacity", 1.0);
                        slidor.animateWithTransformation(slide);
                    }
                    slide.$el.css("opacity", 0).animate({ opacity: 1.0 }, {
                        duration: 300,
                        complete: function () {
                            if (previousSlide) {
                                previousSlide.$el.detach();
                            }
                        }
                    });
                    slideGroup.$el.append(slide.$el);
                    currentSlide = slide;
                },
                endCallback: function () {
                    slideStackStack.pop();
                },
                previousOfFirstCallback: function () {
                    slideStackStack.pop();
                },
                hideCallback: function () {
                    slideGroup.$el.animate({ opacity: 0.0 }, {
                        duration: 300,
                        complete: function () {
                            for (var key in slideGroup.slides) {
                                slideGroup.slides[key].$el.detach();
                            }
                        }
                    })
                }
            });
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
            slideStackStack.push(createNormalSlideStack(readSlides.presentationRoot));
        },
        error: function () {
            alert("Error loading svg file " + svgFilename);
        }
    });
    
    this.gotoSlide = function (target) {
        var newSlides = readSlides.slideGroups[target];
        if (!newSlides) {
            alert("Cloud not find slide group " + target);
            return;
        }
        slideStackStack.push(createGroupSlideStack(newSlides));
    };

    this.showPrevSlide = function () {
        slideStackStack.peek().previous();
    };

    this.showNextSlide = function () {
        slideStackStack.peek().next();
    };

    this.showMenu = function () {
        slideStackStack.collapse();
        slideStackStack.peek().show(readSlides.menuIndex);
    };

    this.reset = function () {
        slideStackStack.collapse();
        slideStackStack.peek().rewind();
    };

    return this;
};


Slidor.presentation.createSlideStackStack = function () {
    var slideStackStack = [],
        peek = function () {
            return slideStackStack[slideStackStack.length-1];
        },
        pop = function () {
            if (slideStackStack.length > 1) {
                peek().hide();
                slideStackStack.pop();
                peek().show();
                return true;
            }
            return false;
        },
        push = function (slideStack) {
            slideStackStack.push(slideStack);
            peek().next();
        },
        collapse = function () {
            peek().end();
            slideStackStack = [slideStackStack[0]];
        };

    return {
        peek: peek,
        pop: pop,
        push: push,
        collapse: collapse
    }
};


Slidor.presentation.createSlideStack = function (options) {
    var slides = options.slides || [],
        showCallback = options.showCallback,
        endCallback = options.endCallback,
        hideCallback = options.hideCallback,
        previousOfFirstCallback = options.previousOfFirstCallback,

        currentIndex = -1,

        show = function (index) {
            if (typeof(index) !== "undefined") {
                currentIndex = index;
            }
            if (showCallback) {
                showCallback(slides[currentIndex]);
            }
        },
        end = function () {
            if (endCallback) {
                endCallback();
            }
        },
        hide = function () {
            if (hideCallback) {
                hideCallback();
            }
        },
        previous = function () {
            if (slides.length === 0) {
                return;
            }
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
            end();
        },
        rewind = function () {
            currentIndex = -1;
        };

    return {
        show: show,
        next: next,
        previous: previous,
        rewind: rewind,
        end: end,
        hide: hide
    };
};

