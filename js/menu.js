jQuery(document).ready(function () {
    "use strict"; // Start of use strict
    hidden_menu();
});

// Hidden menu function
function hidden_menu () {    
    if (jQuery('.inner-nav').hasClass('hidden-nav')) {
        jQuery('.inner-nav.hidden-nav').each(function(){
            jQuery(this).find('.menu-button').on( 'click', function(){
                jQuery(this).parent('.inner-nav.hidden-nav').toggleClass('menu-opened');
            });
        })
    };
};