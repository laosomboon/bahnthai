 import {isiPad,isiPhone,fullHeight,sliderMain,sliderSayings,offcanvasMenu ,mainMenuSticky,parallax,burgerMenu,scrolledWindow ,goToTop,clickMenu,navActive,navigationSection} from "./ui.js";
 import {homeAnimate,aboutAnimate,sayingsAnimate,featureAnimate,typeAnimate,foodMenusAnimate,eventsAnimate,reservationAnimate,footerAnimate} from "./animations.js";
 import { categories, formatPrice} from "./utils.js";
 import {generateStyledMenuPDF} from "./pdf.js";
 // import { initMap} from "./map.js";
    // Document on load.
    $(function() {

        fullHeight();
        sliderMain();
        sliderSayings();
        offcanvasMenu();
        mainMenuSticky();
        parallax();
        burgerMenu();
        scrolledWindow();
        clickMenu();
        navigationSection();
        goToTop();


        // Animations
        homeAnimate();
        aboutAnimate();
        sayingsAnimate();
        featureAnimate();
        typeAnimate();
        foodMenusAnimate();
        eventsAnimate();
        reservationAnimate();
        footerAnimate();


        $("#contact-form").submit(function(e) {

            var name = document.getElementById('name');
            var email = document.getElementById('email');
            var phone = document.getElementById('phone');
            var message = document.getElementById('message');

            if (!name.value || !email.value || !phone.value || !message.value) {

                alertify.error('Please check your entries');
                e.preventDefault();
                this.reset();
            } else {
                $.ajax({
                    url: "https://formspree.io/ssmarnpharb@hotmail.com",
                    method: "POST",
                    data: $(this).serialize(),
                    dataType: "json"
                });
                alertify.success('Message sent');
                this.reset();
                e.preventDefault();
            }
        });
        
        // Hook the button for generating the PDF
         $('#downloadMenu').click(generateStyledMenuPDF);


          // Instantiate MixItUp:
         $('#Container').mixItUp();

    


    });


