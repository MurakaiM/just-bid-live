"use strict";function Approval(n){var t=this;return this.dom=n,this.id=n.data("id"),this.approved=this.dom.find(".approve"),this.declined=this.dom.find(".decline"),this.approved.click(function(n){return t.sendRequest(!0)}),this.declined.click(function(n){return t.sendRequest(!1)}),this.setLoading=function(){t.approved.addClass("loading"),t.declined.addClass("loading")},this.sendRequest=function(n){t.setLoading(),POST("/admin/ab/product/approval",{id:t.id,allowed:n}).then(function(n){return t.dom.remove()}).catch(function(n){return console.log(n)})},this}function backendPost(n,t,e){$.ajax({url:n,type:"POST",contentType:"application/json",data:JSON.stringify(t),success:function(n){e(null,n)},error:function(){e(new Error("Ajax Failed"))}})}function POST(n,t){return new Promise(function(e,i){backendPost(n,t,function(n,t){return n?i(10):t.code>=10&&t.code<20?i(t):e(t)})})}$(function(n){return $("tr").each(function(n,t){return new Approval($(t))})});