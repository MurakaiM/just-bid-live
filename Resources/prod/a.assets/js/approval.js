"use strict";function setValidation(){var e={inline:!0,finishing:!0,rules:{storeName:{identifier:"storeName",rules:[{type:"empty",prompt:"Please enter store title"}]},storeSubtitle:{identifier:"storeSubtitle",rules:[{type:"empty",prompt:"Please enter store subtitle"}]},storeDescription:{identifier:"storeDescription",rules:[{type:"empty",prompt:"Please enter store description"},{type:"minLength[20]",prompt:"Minimum 20 symbols"}]},firstName:{identifier:"firstName",rules:[{type:"empty",prompt:"Please enter your first name"}]},lastName:{identifier:"lastName",rules:[{type:"empty",prompt:"Please enter your last name"}]},email:{identifier:"email",rules:[{type:"email",prompt:"Please enter valid email"}]},birthday:{identifier:"birthday",rules:[{type:"empty",prompt:"Please select your birth date"}]},fphone:{identifier:"fphone",rules:[{type:"empty",prompt:"Please select your country cody"}]},lphone:{identifier:"lphone",rules:[{type:"empty",prompt:"Please enter rest part of phone number"}]}},success:function(e,t){return setTimeout(function(e){return window.location.href="/"},3500)},failure:function(e,t){return console.log(e)}};new Form("signUp","/seller/signing/social/approval",e,!0)}function setDates(){$("#birthday").datepicker({format:"mm.dd.yyyy",endDate:new Date})}function setAvatar(){[{input:$("#fileselect1"),img:$("#fileselect1").parent().find("img")},{input:$("#fileselect2"),img:$("#fileselect2").parent().find("img")}].forEach(function(e){return e.input.on("change",function(t){return readURL(e.input,e.img)})})}function readURL(e,t){if(e[0].files[0]){var i=new FileReader;i.onload=function(e){t.addClass("avatar"),t.attr("src",e.target.result)},i.readAsDataURL(e[0].files[0])}}var phone,parent,wrongPrompt,file,validPhone=!1;$(function(){setDates(),setAvatar(),setValidation(),$(".dropdown").dropdown()});