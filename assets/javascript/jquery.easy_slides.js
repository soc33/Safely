/*
open source carousel inspired by: 
Shabanov Ivan (2017)
*/

//function to move the slider
(function ($) {

    $.fn.EasySlides = function (options) {
        var settings = $.extend({

            'stepbystep': true, // when clicking slide in the loop, it will keep the sequence of the children(Heimlich is slide 1/ suicide prevention is slide 10)
            'loop': true, //allow carousel to continue spin 
            'startslide': 0, //starts slide at first child 
            'distancetochange': 10,
            'beforeshow': function () { },
            'aftershow': function () { },

        }, options);
        return this.each(function () {
            var this_slider = this;
            var EasySlidesTimer;
            var EasySlidesCanChange = true;

            var count = $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)').length;
            var cur_slide = 0;
            // var mousedowned = false;
            var need_slide = 0;
            var slides;
            if (count > 0) {

                // appends the current slide to the left once you
                while (count < settings['show']) {
                    var html = $(this_slider).html();
                    $(html).appendTo(this_slider);
                    $(this_slider).children('.next_button:eq(0), .prev_button:eq(0), .nav_indicators:eq(0)').remove();
                    slides = $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)');

                    count = $(slides).length;
                }
                slides = $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)');


                //allows the carousel to continuesly rotate
                var EasySlidesLoopToNeeded = function () {
                    var next;
                    var left = need_slide - cur_slide;
                    var right = cur_slide - need_slide


                    if (settings['loop'] == true) {
                        if (left < 0) {
                            left = left + count;
                        }
                        if (right < 0) {
                            right = right + count;
                        }
                    }
                    if (cur_slide != need_slide) {
                        if (settings['loop'] == true) {
                            if ((left) < (right)) {
                                next = cur_slide + 1;
                            } else {
                                next = cur_slide - 1;
                            }
                        } else {
                            if (left > 0) {
                                next = cur_slide + 1;
                            } else {
                                next = cur_slide - 1;
                            }
                        }
                        EasySlidesNext(next);
                        setTimeout(EasySlidesLoopToNeeded, settings['delayaftershow']);
                    }
                }
                var EasySlidesNext = function (nextslide) {
                    if (EasySlidesCanChange) {
                        EasySlidesCanChange = false;
                        setTimeout(function () {
                            EasySlidesCanChange = true;
                        }, settings['delayaftershow']);
                        clearTimeout(EasySlidesTimer);
                        if (typeof settings['beforeshow'] == 'function') {
                            settings['beforeshow']();
                        }
                        var i = 0;
                        if (count > 0) {
                            if (typeof nextslide == 'number') {
                                cur_slide = nextslide;
                            } else {
                                cur_slide++;
                                nextslide = cur_slide;
                            }
                            if (settings['loop'] == true) {
                                while (cur_slide < 0) {
                                    cur_slide = cur_slide + count;
                                }
                                while (cur_slide >= count) {
                                    cur_slide = cur_slide - count;
                                }
                                while (nextslide < 0) {
                                    nextslide = nextslide + count;
                                }
                                while (nextslide >= count) {
                                    nextslide = nextslide - count;
                                }

                            } else {
                                if (cur_slide < 0) {
                                    cur_slide = 0;
                                }
                                if (cur_slide >= count) {
                                    cur_slide = count - 1;
                                }
                                if (nextslide < 0) {
                                    nextslide = 0;
                                }
                                if (nextslide >= count) {
                                    nextslide = count - 1;
                                }
                            }

                            $(slides).each(function () {

                                var cssclass = '';
                                var icount = 0;
                                icount = i - nextslide;
                                while (icount < 0) {
                                    icount = icount + count;
                                }

                                while (icount > count) {
                                    icount = icount - count;
                                }
                                if (icount == 0) {
                                    cssclass = 'active';
                                    $(this_slider).find('.' + cssclass + ':not(.nav_indicators ul li)').removeClass(cssclass);
                                    $(this).removeClass('hidden');
                                    $(this).addClass(cssclass);
                                    $(this).addClass("current");


                                } else if (icount < settings['show'] / 2) {
                                    cssclass = 'next' + icount;
                                    $(this_slider).find('.' + cssclass).removeClass(cssclass);
                                    $(this).removeClass('hidden');
                                    $(this).addClass(cssclass);
                                } else if (icount > count - (settings['show'] / 2)) {
                                    cssclass = 'prev' + (count - icount);
                                    $(this_slider).find('.' + cssclass).removeClass(cssclass);
                                    $(this).removeClass('hidden');
                                    $(this).addClass(cssclass);
                                } else {
                                    $(this).addClass('hidden');
                                }

                                if ((Math.abs(i - nextslide) > (settings['show'] / 2)) && (settings['loop'] == false)) {
                                    var icnt = 1;
                                    while (icnt < settings['show'] / 2) {
                                        cssclass = 'next' + icnt;
                                        if ($(this).hasClass(cssclass)) {
                                            $(this).removeClass(cssclass)
                                        };
                                        cssclass = 'prev' + icnt;
                                        if ($(this).hasClass(cssclass)) {
                                            $(this).removeClass(cssclass)
                                        };
                                        icnt++;
                                    };
                                    $(this).addClass('hidden');
                                }
                                i++;
                            });
                            if (settings['autoplay']) {
                                clearTimeout(EasySlidesTimer);
                                EasySlidesTimer = setTimeout(function () {
                                    EasySlidesNext();
                                }, settings['timeout']);
                            }
                        }
                        if (typeof settings['aftershow'] == 'function') {
                            settings['aftershow']();
                        }

                    }
                }
                EasySlidesNext(settings['startslide']);
                /*
                $(this_slider).children(':not(.next_button, .prev_button, .nav_indicators)').click(function () {
                */

                // allow you to pick another slide out of sequence
                $(slides).click(function () {
                    need_slide = $(this_slider).children().index(this);
                    if (settings['stepbystep']) {
                        EasySlidesLoopToNeeded()
                    } else {
                        EasySlidesNext(need_slide);
                    }
                });
                $(this_slider).children('.nav_indicators').find('ul').find('li').click(function () {
                    need_slide = $(this_slider).find('.nav_indicators ul li').index(this);
                    if (settings['stepbystep']) {
                        EasySlidesLoopToNeeded()
                    } else {
                        EasySlidesNext(need_slide);
                    }
                });

                // make the right arrow functional and move the slide to the right
                $(this_slider).find('.next_button').click(function () {
                    EasySlidesCanChange = true;
                    EasySlidesNext();
                });

                //makes the left arrow funtional and move the slide to the left
                $(this_slider).find('.prev_button').click(function () {
                    EasySlidesCanChange = true;
                    cur_slide--;
                    EasySlidesNext(cur_slide);
                });

            }
        });
    }

})(jQuery);


// function to add link to the carousel
var clicked1 = false;
$(document).on("click", ".slide1", ".current", function () {



    var x = $(this).attr("id");
    console.log(x);
    var carLinks = ["https://www.webmd.com/first-aid/choking-treatment#1-4", "https://www.webmd.com/first-aid/cardiopulmonary-resuscitation-cpr-treatment", "http://www.cityoforlando.net/police/", "http://www.cityoforlando.net/fire/", "https://www.redcross.org/", "http://www.cityoforlando.net/emergency/", "http://www.orangecountyanimalservicesfl.net/", "http://www.orangecountyfl.net/EmergencySafety/HurricaneGuide.aspx#.XENGPs9Kh24", "https://www.orangecountyfl.net/FamiliesHealthSocialSvcs/MentalHealth.aspx#.XENKV89Kh24", "https://suicidepreventionlifeline.org/"];

    switch (x) {
        case "s0":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[0] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s1":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[1] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s2":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[2] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s3":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[3] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s4":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[4] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s5":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[5] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s6":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[6] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s7":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[7] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s8":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[8] + "' target='_blank'>Click here for more information</a>");

            break;
        case "s9":
            $(this).find('p').empty();
            $(this).find('p').append("<a href='" + carLinks[9] + "' target='_blank'>Click here for more information</a>");

            break;
    }
});
