var mobile_nav;
var mobile_button;


$(function () {
  initComponents();

  setTriggers();

  /*
    $('.ui .stock').popup({
        inline     : true,
        hoverable  : true,
        position   : 'bottom left',
        delay: {
          show: 300,
          hide: 300
        }
      });
    */

});

function initComponents() {
  mobile_nav = $(".mobile_nav");
  mobile_button = $("#mobile_button");
}

function setTriggers() {
  mobile_button.click( () => menuButton());
}

function menuButton() {
  mobile_nav.toggleClass("opened");
  mobile_button.toggleClass("rotated");
}
