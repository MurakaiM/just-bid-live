"use strict";function setValidation(){var e={inline:!0,finishing:!0,rules:{firstName:{identifier:"firstName",rules:[{type:"empty",prompt:"Please enter your first name"}]},lastName:{identifier:"lastName",rules:[{type:"empty",prompt:"Please enter your last name"}]},birthday:{identifier:"birthday",rules:[{type:"empty",prompt:"Please select your birth date"}]},fphone:{identifier:"fphone",rules:[{type:"empty",prompt:"Please select your country cody"}]},lphone:{identifier:"lphone",rules:[{type:"empty",prompt:"Please enter rest part of phone number"}]}},success:function(e,t){return setTimeout(function(e){return window.location.href="/"},3500)},failure:function(e,t){return console.log(e)}};new Form("signUp","/user/signing/social/approval",e,!0)}function setDates(){$("#birthday").datepicker({format:"mm.dd.yyyy",endDate:new Date,startDate:new Date("01.01.1900")})}function setAvatar(){fileselect=$("#fileselect"),fileselect.on("change",function(){fileselect.addClass("avatar"),readURL(fileselect)})}function readURL(e){if(e[0].files[0]){var t=new FileReader;t.onload=function(e){$(".ui.avatar").attr("src",e.target.result)},t.readAsDataURL(e[0].files[0])}}var phone,parent,wrongPrompt,file,validPhone=!1;$(function(){setDates(),setAvatar(),setValidation(),$(".ui.dropdown").dropdown()});