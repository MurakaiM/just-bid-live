var blackout;
var lastPopup;
var lastPoint;

var sliderInterval;

$(function () {

  $('.product.stock').popup({
    inline     : true,
    position   : 'top left',
    delay: {
      show: 100,
      hide: 100
    }
  });


  categoriesHover();
  specialSlider();
});



function categoriesHover() {
    blackout = $('.blackout');
    blackout.hover(() => onBlackout(), () => onBlackout());

    $(".stock_list .list_item.top_level").each( (i,item) => onHoverable(item));
}

function onBlackout() {
  blackout.removeClass("opened");
  lastPopup.addClass("hidden");
  lastPopup.removeClass("opened");
}

function onHoverable(item) {
  var dom = $(item);
  var hoverableId = dom.data("popup");


  var popup = $("#"+hoverableId);
  dom.hover(() => onEnterHover(), () => {});


  function onEnterHover(){
    if(lastPopup != undefined){
      lastPopup.addClass("hidden");
      lastPopup.removeClass("opened");
    }

    popup.removeClass("hidden");
    popup.addClass("opened");
    blackout.addClass("opened");
    lastPopup = popup;
  }
}


function specialSlider() {

  var wrapper = $('.special_wrapper');
  var width = $('.special_purposes').width();
  $(".special_purpose").css('width',width);

  var points = $(".special_controlls i");
  var length = points.length;


  moveToSlide(wrapper, width,0);

  sliderInterval = setInterval(() => {
    var timing = lastPoint;

    if(timing+1 == length){
      timing=0;
    }else{
      timing++;
    }

    moveToSlide(wrapper,width,timing);
  }, 5000);


  points.each((i,item) =>  $(item).click( e => {
      clearInterval(sliderInterval);
      sliderInterval = setInterval(() => {
        var timing = lastPoint;

        if(timing+1 == length){
          timing=0;
        }else{
          timing++;
        }

        moveToSlide(wrapper,width,timing);
      }, 5000);

      moveToSlide(wrapper, width,i);
    }));


    function moveToSlide(wrapper, width, slide) {
      $(points[lastPoint]).removeClass('selected');

      wrapper.css('transform','translateX('+(-(width+1)*slide)+'px)');
      lastPoint = slide;

      var newSlide = $(points[slide]);

      newSlide.removeClass('radio');
      newSlide.addClass('radio');
      newSlide.addClass('selected');
    }

}
