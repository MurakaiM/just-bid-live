"use strict";function setValidation(){new Form("signUp","/user/signup",{inline:!0,finishing:!0,rules:{firstName:{identifier:"firstName",rules:[{type:"empty",prompt:"Please enter your first name"}]},lastName:{identifier:"lastName",rules:[{type:"empty",prompt:"Please enter your last name"}]},email:{identifier:"email",rules:[{type:"email",prompt:"Please enter valid email"}]},birthday:{identifier:"birthday",rules:[{type:"empty",prompt:"Please select your birth date"}]},fphone:{identifier:"fphone",rules:[{type:"empty",prompt:"Please select your country cody"}]},lphone:{identifier:"lphone",rules:[{type:"empty",prompt:"Please enter rest part of phone number"}]},password:{identifier:"password",rules:[{type:"minLength[6]",prompt:"Minimum 6 symbols"}]},repeated_password:{identifier:"repeated_password",rules:[{type:"match[password]",prompt:"Passwords must be similar"}]}}},!0)}function setDates(){$("#birthday").datepicker({format:"mm.dd.yyyy",endDate:new Date,startDate:new Date("01.01.1900")})}function setAvatar(){fileselect=$("#fileselect"),fileselect.on("change",function(){$(".ui.image").addClass("avatar"),readURL(fileselect)})}function readURL(e){if(e[0].files[0]){var t=new FileReader;t.onload=function(e){$(".ui.avatar").attr("src",e.target.result)},t.readAsDataURL(e[0].files[0])}}var phone,parent,wrongPrompt,file,validPhone=!1;$(function(){setDates(),setAvatar(),setValidation(),$(".ui.dropdown").dropdown()});