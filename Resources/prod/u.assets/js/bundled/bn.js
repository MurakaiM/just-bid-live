"use strict";function initComponents(){mobile_nav=$(".mobile_nav"),mobile_button=$("#mobile_button")}function setTriggers(){mobile_button.click(function(){return menuButton()})}function menuButton(){mobile_nav.toggleClass("opened"),mobile_button.toggleClass("rotated")}function initSearch(){$(".ui.search").search({minCharacters:3,duration:500,apiSettings:{onResponse:function(t){var e={results:[]};return $.each(t.data,function(t,n){if(t>=8)return!1;e.results.push({title:n.prTitle,description:n.prDescription.length>160?n.prDescription.substring(0,157)+"...":n.prDescription,url:"/product/id"+n.prUid,image:n.prTypes.colors[Object.keys(n.prTypes.colors)[0]].image})}),e},url:"/user/products/search={query}"}})}var mobile_nav,mobile_button;$(function(){initComponents(),initSearch(),setTriggers()});