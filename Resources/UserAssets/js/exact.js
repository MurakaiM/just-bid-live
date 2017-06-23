var shapeDom;


$(function () {
  $('.menu .item').tab();

  addProduct();
  setSlider();
  dropdownListen();
});

function addProduct() {
  $("#cart").click( () => Cart.show());
}

function dropdownListen() {
  var color = $("#color").dropdown({
    onChange: (value, text, $selectedItem) => {
      shapeDom.shape('set next side', '#'+value).shape('flip up');
    }
  });
  var size = $("#size").dropdown();
}

function setSlider(){
  if(!Props.isMobile){
    $('.exactly.aller').sticky({
      context: '.col-md-4.col-lg-4'
    });
    var currentHeight = $('.exactly.aller');
  }


  shapeDom = $('.shape');
  shapeDom.shape({ duration : 500});


  var heightImg = $(".exactly.image").width() * 1.2;
  var widthImg = $(".exactly.image").width() -15;


  $(".exactly.image img").css({
    width : widthImg,
    height : heightImg
  });


  $("#next_slide").click( () => shapeDom.shape('flip back'));
  $("#previous_slide").click( () => shapeDom.shape('flip over'));
}
