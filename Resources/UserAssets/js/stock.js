var blackout;
var lastPopup,lastPoint;
var body;
var currentDom;

var sliderInterval;



//options.selector = ".product.stock"
//options.img_selector = ".image"
//options.expandable_target = ".expandable_body .header"

$(function () {
  var products = new Expandable();
  products.init();

  categoriesHover();
  specialSlider();

  const tilt = $('.expandable_body .img_holder').tilt();
});

function Expandable(options) {
  var expandable = {};
  this.init = () => expandingProduct(options);

  function expandingProduct(options) {
    $(".open_product").click( () => console.log("hello"));
    $("#expandable_body").click( () => expandClose(expandable));

    expandable.body = $("#expandable_body");
    expandable.img =  expandable.body.find("img");
    expandable.a =  expandable.body.find("a");

    expandable.hot = expandable.body.find('.hot');
    expandable.pop = expandable.body.find('.pop');
    expandable.new = expandable.body.find('.new');


    $(".product.stock").each( (i,item) => reworkProduct(item));
    function reworkProduct(item) {
      var dom = $(item).find('.image');
      var label = $(item).find('.label');

      var label_name;

      if(label.hasClass('hot')){
        label_name = 'hot';
      }else if(label.hasClass('pop')){
        label_name = 'pop';
      }else if(label.hasClass('new')){
        label_name = 'new';
      }else{
        label_name = 'none';
      }


      var img = dom.find('img').attr('src');
      var url = "";
      dom.click(() => expand());

      function expand() {
        if(!WProps.isMobile){
          currentDom = dom;
          expandOpen(img,url,label_name);
        }
      }
    }

    function expandOpen(img,url,label_name) {

      expandable.body.addClass('opened');
      expandable.img.attr('src',img);
      expandable.a.attr('href',"/product/idSomeid");

      expandable[label_name].removeClass("closed");

    }

    function expandClose() {

      expandable.body.removeClass('opened');

      expandable.hot.addClass('closed');
      expandable.pop.addClass('closed');
      expandable.new.addClass('closed');
    }

  }

  return this;
}






function categoriesHover() {
    blackout = $('.blackout');
    blackout.hover(() => onBlackout(), () => onBlackout());

    $(".stock_list .list_item.top_level").each( (i,item) => onHoverable(item));
    $(".stock_list .list_item.down_level").each( (i,item) => onExit(item));

}

function onBlackout() {
  blackout.removeClass("opened");

  if(lastPopup != undefined){
    lastPopup.addClass("hidden");
    lastPopup.removeClass("opened");
  }
}

function onExit(item) {
    var dom = $(item);
    dom.hover( () =>onBlackout(), () => {});
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

  $(window).resize( () => {
    width = $('.special_purposes').width();
    $(".special_purpose").css('width',width);
  });

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
