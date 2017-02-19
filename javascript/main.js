/**
 * Created by oem on 2017-01-03.
 */

document.querySelector('.fa-caret-square-o-up').addEventListener("click", function () {
    $('html,body').animate({scrollTop: 0}, 'slow');
});

console.log('If you want see something nice, set the width on 666 and press [west]');
$(window).keydown(function (e) {
    if (e.which === 37) {
        console.log('You set width = ' + $(window).width());
        if ($(window).width() === 666) {
            console.log('Good job!');
            window.open('population.html', '_blank');
            return
        }
        console.log('I think you forgot about scroll bar...');
    }
});
