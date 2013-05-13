var artworkInfo = '',
    slideHasVideo = false,
    tombstoneTimeout = '',
    introTimeout = '';
    
mejs.MediaFeatures.hasTouch = false;

function displayTombstone() {
    clearTimeout(tombstoneTimeout);
    if (slideHasVideo === true) {
        $('.tombstone').addClass('on-video-slide');
    } else {
        $('.tombstone').removeClass('on-video-slide');
    }
    $('.tombstone').stop(true, true).delay(250).fadeIn(150);
    tombstoneTimeout = setTimeout(function() {
        $('.tombstone').stop(true, true).fadeOut(250);
    }, 5000);
}

function hideIntro() {
    clearTimeout(introTimeout);
    $('.intro').stop(true, true).fadeOut(500);
    introTimeout = setTimeout(function() {
        $('.intro').show();
    }, 90000);
}

function swapInfo(index,slide){
    var $el = $(slide);
    $('.tombstone').html($el.children('.meta').html());  
    $('#info').html($el.children('.slide-article').html());
}

var zoomerTemplate = _.template($('#zoomer').html());
var lastSlideId = 'image-view-1';

function slideInit(){
    window.mySwipe = new Swipe(document.getElementById('slider'), {
        callback: function(index,slide) {
            if ($(slide).hasClass('video')) {
                slideHasVideo = true;
            } else {
                slideHasVideo = false;
            }
            displayTombstone();
            swapInfo(index,slide);
            if (Zoomer.zoomers[lastSlideId]) {
                console.log(lastSlideId);
                Zoomer.zoomers[lastSlideId].map.centerImageAtExtents();
            }
            var videoId = 'player' + lastSlideId;
            if ($('#' + videoId).length) {
                $(this).pause();
            }
            lastSlideId = slide.id; // record this so we know what we're leaving next time
        }
    });
    lastSlideId = window.mySwipe.slides[window.mySwipe.index].id;
    swapInfo(1, '.slide-index-0');
}

$.getJSON('javascripts/test.json', function(data) {
    slides = data.slides;
    for (variable in slides) {
        var clss = 'slide-index-' + variable;
        slides[variable].zoomer_class = clss;
        $('.swipe-wrap').append(zoomerTemplate(slides[variable]));
        if (slides[variable].type == 'zoomer') {
            Zoomer.zoom_image_by_class({'container': slides[variable].zoomer_class, 'tileURL': slides[variable].zoomer_url, 'imageWidth': slides[variable].zoomer_width, 'imageHeight': slides[variable].zoomer_height});
        }
        $('.video-container video').mediaelementplayer({
            videoWidth: 1920,
            videoHeight: 1080,
            startVolume: 1,
            features: ['progress'],
            alwaysShowControls: true
        });
    };
    setTimeout(slideInit,500); // don't initialize swipe until the zoomers are loaded
});

$(document).ready(function() {
    
    displayTombstone();
    
    $(document).on('click', function(event){
        displayTombstone();
        hideIntro();
    });
    
    $('nav a').on('click', function(event) {
        event.stopPropagation();
    });
    
    $('#colorbox').on('click', function(event) {
        event.stopPropagation();
    });
    
    $('.info-link').on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $.colorbox({
            transition: 'none',
            width: '60%',
            initialWidth: '60%',
            fadeOut: 250,
            opacity: 0.8,
            inline: true, 
            href: '#info',
            onComplete: function() {
                $('#cboxLoadedContent article').scroller({
                    customClass: 'walker-scroller',
                    trackMargin: 8,
                    handleSize: 60
                });
                if (!$('#cboxLoadedContent article').hasClass('scroller-active')) {
                    $('#cboxLoadedContent .info-wrapper').addClass('locked');
                }
            },
            onClosed: function() {
                $('.locked').removeClass('locked');
            }
        });
    });
    
});
