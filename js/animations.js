 // Animations
    export function homeAnimate() {
        if ($('#fh5co-home').length > 0) {

            $('#fh5co-home').waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        $('#fh5co-home .to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);


                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };



   export function aboutAnimate(){
        var about = $('#fh5co-about');
        if (about.length > 0) {

            about.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        about.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function() {
                        about.find('.to-animate-2').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeIn animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);



                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

    export function sayingsAnimate() {
        var sayings = $('#fh5co-sayings');
        if (sayings.length > 0) {

            sayings.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        sayings.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);


                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

    export function featureAnimate() {
        var feature = $('#fh5co-featured');
        if (feature.length > 0) {

            feature.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        feature.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function() {
                        feature.find('.to-animate-2').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('bounceIn animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 500);


                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

    export function typeAnimate() {
        var type = $('#fh5co-type');
        if (type.length > 0) {

            type.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        type.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

    export function foodMenusAnimate(){
        var menus = $('#fh5co-menus');
        if (menus.length > 0) {

            menus.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        menus.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function() {
                        menus.find('.to-animate-2').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeIn animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 500);

                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };


    export function eventsAnimate() {
        var events = $('#fh5co-events');
        if (events.length > 0) {

            events.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        events.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeIn animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function() {
                        events.find('.to-animate-2').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 500);

                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

    export function reservationAnimate() {
        var contact = $('#fh5co-contact');
        if (contact.length > 0) {

            contact.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        contact.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeIn animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function() {
                        contact.find('.to-animate-2').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 500);

                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

    export function footerAnimate() {
        var footer = $('#fh5co-footer');
        if (footer.length > 0) {

            footer.waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {


                    setTimeout(function() {
                        footer.find('.to-animate').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeIn animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function() {
                        footer.find('.to-animate-2').each(function(k) {
                            var el = $(this);

                            setTimeout(function() {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 500);

                    $(this.element).addClass('animated');

                }
            }, { offset: '80%' });

        }
    };

