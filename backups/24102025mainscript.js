window.addEventListener("DOMContentLoaded", (event) => {
    // LENIS
    "use strict";

    if (Webflow.env("editor") === undefined) {
        const lenis = new Lenis({
            duration: 1.2,
            //easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1,
            wheelMultiplier: 0.7,
            infinite: false,
            gestureOrientation: "vertical",
            normalizeWheel: false,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        $("[data-lenis-start]").on("click", function () {
            lenis.start();
        });
        $("[data-lenis-stop]").on("click", function () {
            lenis.stop();
        });
        $("[data-lenis-toggle]").on("click", function () {
            $(this).toggleClass("stop-scroll");
            if ($(this).hasClass("stop-scroll")) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        function connectToScrollTrigger() {
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
        }
        // Uncomment this if using GSAP ScrollTrigger
        connectToScrollTrigger();
    }

    gsap.registerPlugin(ScrollTrigger);

    //PAGE INTROS

    let tlintro = gsap
        .timeline({
            delay: 0.2,
            ease: Power4.easeInOut
        })
        .set(".nav_logo-wrapper, .nav_button-wrapper, .button-text .is-nav", {
            "will-change": "opacity, transform"
        })
        .from(".nav_logo-wrapper", {
            opacity: 0,
            yPercent: -100,
            duration: 0.6
        })
        .from(
            ".nav_button-wrapper",
            {
                opacity: 0,
                //yPercent: -100,
                duration: 0.6
            },
            "<50%"
        )
        .from(
            ".button-text .is-nav",
            {
                opacity: 0,
                yPercent: -100,
                duration: 0.6
            },
            "<75%"
        );

    //MATCHMEDIA
    let mm = gsap.matchMedia(),
        breakPoint = 800;

    mm.add(
        {
            // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
            isDesktop: `(min-width: 992px)`,
            isTablet: `(max-width: 991px)`,
            isMobile: `(max-width: 480px)`
        },
        (context) => {
            // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
            let { isDesktop, isTablet, isMobile } = context.conditions;

            // HERO VIDEO
            gsap.timeline({
                scrollTrigger: {
                    trigger: ".hero-image_track",
                    start: "top center",
                    end: "bottom bottom+=100px",
                    scrub: 0.75,
                    ease: "none",
                    defer: true,
                    lazy: true
                }
            })
                .set(".hero-video_wrapper, .hero-video_wrapper .video-horizontal", {
                    "will-change": "width, padding"
                })
                .to(".hero-video_wrapper", {
                    width: "100%"
                })
                .to(
                    ".hero-video_wrapper .video-horizontal",
                    {
                        paddingTop: isMobile ? "66%" : "100vh"
                    },
                    "<"
                );

            // CLIPPATH
            let tlClip = gsap.timeline({
                scrollTrigger: {
                    trigger: ".clippath_inside-left.is-2",
                    start: "33% bottom",
                    end: "top top",
                    scrub: 2,
                    defaults: {}
                }
            });
            tlClip.fromTo(
                ".clippath-image-1",
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                },
                {
                    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
                }
            );
            // 50 YEAR TEASER
            gsap.timeline({
                scrollTrigger: {
                    trigger: ".teaser_layout",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 5,
                    ease: "none"
                }
            }).from(".teaser-bg-text", {
                y: "100vw",
                stagger: {
                    each: 0.08
                }
            });

            return () => {
                // optionally return a cleanup function that will be called when none of the conditions match anymore (after having matched)
                // it'll automatically call context.revert() - do NOT do that here . Only put custom cleanup code here.
            };
        }
    );

    // TEXT SPLIT ANIMATION
    let typeSplit;

    // Split the text up
    function runSplit() {
        typeSplit = new SplitType("[text-split]", {
            types: "words, chars, lines",
            tagName: "span"
        });
        createAnimation();
    }
    runSplit();

    // Update on window resize
    let windowWidth = window.innerWidth;

    function checkWidth() {
        if (windowWidth !== window.innerWidth) {
            windowWidth = window.innerWidth;
            typeSplit.revert();
            runSplit();
        }
    }

    window.addEventListener("resize", checkWidth);

    function createAnimation() {
        const lines = document.querySelectorAll("[text-ani] .line");
        for (let i = 0; i < lines.length; i++) {
            const chars = lines[i].getElementsByClassName("char");
            gsap.from(chars, {
                color: "#E6EFF7",
                duration: 0.2,
                ease: Power2.easeInOut,
                stagger: {
                    each: 0.4
                },
                scrollTrigger: {
                    trigger: lines[i],
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                    defer: true,
                    lazy: true,
                    ease: "none"
                }
            });
        }
    }
    //FOOTER END
});
