var mobile_nav;
var mobile_button;


$(function () {
  initComponents();

  setTriggers();

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
