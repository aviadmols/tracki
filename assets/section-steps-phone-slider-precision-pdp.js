$(document).ready(function(){

   console.log('Document Ready');

  console.log('Steps Slider:', $('.steps-slider').length);
  console.log('Dots:', $('.slider-dots span').length);
  
  var $wrapper = $('.step-slide-wrapper');
  var $slides  = $('.step-slide');
  var total    = $slides.length;
  var current  = 0;

  var $hand = $('.hand-indicator');

  // Wheel lock
  let wheelLocked = false;

  // Function to check if screen is large
  function isLargeScreen() {
    return $(window).width() > 769;
  }

  // Hand position
  function setHandPosition() {

    var $slide = $slides.eq(1);
    var $phone = $slide.find('.phone-frame');

    if (!$phone.length) return;

    var sectionRect = document.querySelector('.steps-slider').getBoundingClientRect();
    var phoneRect   = $phone[0].getBoundingClientRect();

    var finalX = phoneRect.left + (phoneRect.width * 0.55) - sectionRect.left;

    var finalY = phoneRect.top + (phoneRect.height * 0.12) - sectionRect.top;

    return {
      x: finalX,
      y: finalY
    };
  }

  // Slide change
  function goToSlide(index) {

    if (!isLargeScreen()) return;

    if (index < 0) index = 0;
    if (index >= total) index = total - 1;

    current = index;

    // Move slides
    $wrapper.css(
      'transform',
      'translateY(-' + (current * 100) + 'vh)'
    );

    // Active dots
    $('.slider-dots span')
      .removeClass('active')
      .eq(current)
      .addClass('active');

    // Active slide
    $('.step-slide')
      .removeClass('active')
      .eq(current)
      .addClass('active');

    // Reset hand
    $hand.removeClass('hand-animate').css({
      opacity: 0,
      transform: 'translate(-50%, -120px)'
    });

    // Hand animation on 2nd slide
    if (current === 1) {

      setTimeout(function () {

        var pos = setHandPosition();

        if (!pos) return;

        // Start position
        $hand.css({
          left: pos.x + 'px',
          top: '0px',
          opacity: 1,
          transform: 'translateX(-50%)'
        });

        $hand[0].offsetHeight;

        // Animate
        $hand.stop().animate(
          { top: pos.y },
          {
            duration: 1200,
            easing: "swing"
          }
        );

      }, 700);
    }
  }

  // Initial slide
  goToSlide(0);

  // Dot click
  $('.slider-dots span').on('click', function(){

    if (!isLargeScreen()) return;

    goToSlide($(this).index());

  });

  // Mouse wheel scroll
  $('.steps-slider-container').on('wheel', function(e){

    if (!isLargeScreen()) return;

    var delta = e.originalEvent.deltaY;

    // Prevent multiple triggers
    if (wheelLocked) {
      e.preventDefault();
      return;
    }

    // Scroll down
    if (delta > 0 && current < total - 1) {

      e.preventDefault();

      wheelLocked = true;

      goToSlide(current + 1);

      setTimeout(function () {
        wheelLocked = false;
      }, 1200);
    }

    // Scroll up
    else if (delta < 0 && current > 0) {

      e.preventDefault();

      wheelLocked = true;

      goToSlide(current - 1);

      setTimeout(function () {
        wheelLocked = false;
      }, 1200);
    }

    // IMPORTANT:
    // On first/last slide,
    // normal page scroll will work automatically
  });

  // Resize
  $(window).on('resize', function(){

    if (current === 1) {
      setHandPosition();
    }

    // Mobile reset
    if (!isLargeScreen()) {

      $wrapper.css('transform', 'translateY(0)');

      current = 0;

      $('.slider-dots span')
        .removeClass('active')
        .eq(current)
        .addClass('active');

      $('.step-slide')
        .removeClass('active')
        .eq(current)
        .addClass('active');

      $hand.removeClass('hand-animate').css({
        opacity: 0
      });
    }
  });

});