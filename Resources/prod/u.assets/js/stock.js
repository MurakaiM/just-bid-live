"use strict";function Expandable(o){var e={};return this.init=function(){return $(".open_product").click(function(){return console.log("hello")}),$("#expandable_body").click(function(){return e.body.removeClass("opened"),e.hot.addClass("closed"),e.pop.addClass("closed"),void e.new.addClass("closed")}),e.body=$("#expandable_body"),e.img=e.body.find("img"),e.a=e.body.find("a"),e.hot=e.body.find(".hot"),e.pop=e.body.find(".pop"),e.new=e.body.find(".new"),void $(".product.stock").each(function(o,n){return function(o){var n,t=$(o).find(".image"),a=$(o).find(".label");n=a.hasClass("hot")?"hot":a.hasClass("pop")?"pop":a.hasClass("new")?"new":"none";var s=t.find("img").attr("src");t.click(function(){return void(window.WProps.isMobile||(currentDom=t,function(o,n,t){e.body.addClass("opened"),e.img.attr("src",o),e.a.attr("href","/product/idSomeid"),e[t].removeClass("closed")}(s,0,n)))})}(n)})},this}function categoriesHover(){(blackout=$(".blackout")).hover(function(){return onBlackout()},function(){return onBlackout()}),$(".stock_list .list_item.top_level").each(function(o,e){return onHoverable(e)}),$(".stock_list .list_item.down_level").each(function(o,e){return onExit(e)})}function onBlackout(){blackout.removeClass("opened"),void 0!=lastPopup&&(lastPopup.addClass("hidden"),lastPopup.removeClass("opened"))}function onExit(o){$(o).hover(function(){return onBlackout()},function(){})}function onHoverable(o){var e=$(o),n=e.data("popup"),t=$("#"+n);e.hover(function(){return void 0!=lastPopup&&(lastPopup.addClass("hidden"),lastPopup.removeClass("opened")),t.removeClass("hidden"),t.addClass("opened"),blackout.addClass("opened"),void(lastPopup=t)},function(){})}function specialSlider(){function o(o,e,n){$(t[lastPoint]).removeClass("selected"),o.css("transform","translateX("+-(e+1)*n+"px)"),lastPoint=n;var a=$(t[n]);a.removeClass("radio"),a.addClass("radio"),a.addClass("selected")}var e=$(".special_wrapper"),n=$(".special_purposes").width();$(".special_purpose").css("width",n),$(window).resize(function(){n=$(".special_purposes").width(),$(".special_purpose").css("width",n)});var t=$(".special_controlls i"),a=t.length;o(e,n,0),sliderInterval=setInterval(function(){var t=lastPoint;t+1==a?t=0:t++,o(e,n,t)},5e3),t.each(function(t,s){return $(s).click(function(s){clearInterval(sliderInterval),sliderInterval=setInterval(function(){var t=lastPoint;t+1==a?t=0:t++,o(e,n,t)},5e3),o(e,n,t)})})}var blackout,lastPopup,lastPoint,body,currentDom,sliderInterval;$(function(){(new Expandable).init(),categoriesHover(),specialSlider();$(".expandable_body .img_holder").tilt()});