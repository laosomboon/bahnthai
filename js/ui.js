// iPad and iPod detection	
    export function isiPad() {
        return (navigator.platform.indexOf("iPad") != -1);
    };

     export function isiPhone() {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

     export function fullHeight() {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function() {
                $('.js-fullheight').css('height', $(window).height());
            })
        }


    };




     export function sliderMain() {

        $('#fh5co-home .flexslider').flexslider({
            animation: "fade",
            slideshowSpeed: 5000
        });

        $('#fh5co-home .flexslider .slides > li').css('height', $(window).height());
        $(window).resize(function() {
            $('#fh5co-home .flexslider .slides > li').css('height', $(window).height());
        });

    };

     export function sliderSayings() {
        $('#fh5co-sayings .flexslider').flexslider({
            animation: "slide",
            slideshowSpeed: 5000,
            directionNav: false,
            controlNav: true,
            smoothHeight: true,
            reverse: true
        });
    }

     export function offcanvasMenu(){
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.fh5co-main-nav .fh5co-menu-1 a, .fh5co-main-nav .fh5co-menu-2 a').each(function() {

            var $this = $(this);

            $('#fh5co-offcanvas').append($this.clone());

        });
        // $('#fh5co-offcanvas').append
    };

    export function mainMenuSticky() {

        var sticky = $('.js-sticky');

        sticky.css('height', sticky.height());
        $(window).resize(function() {
            sticky.css('height', sticky.height());
        });

        var $section = $('.fh5co-main-nav');

        $section.waypoint(function(direction) {

            if (direction === 'down') {

                $section.css({
                    'position': 'fixed',
                    'top': 0,
                    'width': '100%',
                    'z-index': 99999
                }).addClass('fh5co-shadow');;

            }

        }, {
            offset: '0px'
        });

        $('.js-sticky').waypoint(function(direction) {
            if (direction === 'up') {
                $section.attr('style', '').removeClass('fh5co-shadow');
            }
        }, {
            offset: function() { return -$(this.element).height() + 69; }
        });

    };

    // Parallax
     export function parallax() {

        $(window).stellar();

    };


    // Burger Menu
     export function burgerMenu() {

        $('body').on('click', '.js-fh5co-nav-toggle', function(event) {

            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });

    };

     export function scrolledWindow() {

        $(window).scroll(function() {

            var scrollPos = $(this).scrollTop();


            $('#fh5co-home .fh5co-text').css({
                'opacity': 1 - (scrollPos / 300),
                'margin-top': (-212) + (scrollPos / 1)
            });

            $('#fh5co-home .flexslider .fh5co-overlay').css({
                'opacity': (.5) + (scrollPos / 2000)
            });

            if (scrollPos > 300) {
                $('#fh5co-home .fh5co-text').css('display', 'none');
            } else {
                $('#fh5co-home .fh5co-text').css('display', 'block');
            }


        });

        $(window).resize(function() {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

    };


     export function goToTop() {

        $('.js-gotop').on('click', function(event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Page Nav
     export function clickMenu() {
        var topVal = ($(window).width() < 769) ? 0 : 58;

        $(window).resize(function() {
            topVal = ($(window).width() < 769) ? 0 : 58;
        });
        $('.fh5co-main-nav a:not([class="external"]), #fh5co-offcanvas a:not([class="external"])').click(function(event) {
            var section = $(this).data('nav-section');

            if ($('div[data-section="' + section + '"]').length) {

                $('html, body').animate({
                    scrollTop: $('div[data-section="' + section + '"]').offset().top - topVal
                }, 500);

            }

            event.preventDefault();

            // return false;
        });


    };

    // Reflect scrolling in navigation
     export function navActive(section) {

        $('.fh5co-main-nav a[data-nav-section], #fh5co-offcanvas a[data-nav-section]').removeClass('active');
        $('.fh5co-main-nav, #fh5co-offcanvas').find('a[data-nav-section="' + section + '"]').addClass('active');

    };

     export function navigationSection() {

        var $section = $('div[data-section]');

        $section.waypoint(function(direction) {
            if (direction === 'down') {
                navActive($(this.element).data('section'));
            }

        }, {
            offset: '150px'
        });

        $section.waypoint(function(direction) {
            if (direction === 'up') {
                navActive($(this.element).data('section'));
            }
        }, {
            offset: function() { return -$(this.element).height() + 155; }
        });

    };