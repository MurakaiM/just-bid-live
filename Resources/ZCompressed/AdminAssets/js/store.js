function onLoad(){SetUpProducts(),SetUpDisabled(),SetUpAuction(),SetUpHome(),tabs=new Tabs({headers:".tabs.head",contents:".tabs.body"},{products:{onOpen:(e,t)=>table.loadInSegment("/seller/product/all",e,t),onClose:()=>table.forceDelete()},disabled:{onOpen:(e,t)=>tableDisabled.loadInSegment("/seller/product/disabled",e,t),onClose:()=>tableDisabled.forceDelete()},auctions:{onOpen:(e,t)=>tableAuctions.loadInSegment("/seller/auction/all",e,t),onClose:()=>tableAuctions.forceDelete()},home:{onOpen:(e,t)=>{dataStats.load(e,t)},onClose:()=>{}}}),$("#signout").click(e=>POST("/user/signout"))}function reworkRating(e){let t=parseInt(e||0);for(var a='<div class="ui star rating rated" >',i=1;i<=5;i++)a+=i<=t?'<i class="icon active"></i>':'<i class="icon"></i>';return a+"</div>"}function reworkStock(e){return 0==e?`\n    <td class="stock negative">\n      <i class="attention icon"></i>\n      ${e}\n    </td>`:`<td class="stock">${e}</td>`}function reworkBoolean(e){return`<td style="text-align:center;"> <i class="${e?"checkmark green":"remove red"} icon"></i> </td>`}function SetUpHome(){function e(e,t){dataStats.title.text(e.seller.title),dataStats.description.text(e.seller.description),dataStats.subtitle.text(e.seller.subtitle),dataStats.solds.text(e.allSolds?e.allSolds:0),dataStats.views.text(e.allViews?e.allViews:0),dataStats.orders.text(e.allOrders?e.allOrders:0),dataStats.products.text(e.allProducts?e.allProducts:0),e.seller.cover&&(dataStats.image.addClass("avatar"),dataStats.image.attr("src",e.seller.cover)),t.removeClass("loading")}const t=$("#homeData");dataStats={load:(t,a)=>{LoadSegment("/seller/store/statistics",t,a).then(t=>e(t.result.data,a)).catch()},wrapper:t,image:t.find("img"),title:t.find(".title"),subtitle:t.find(".subtitle"),description:t.find(".description"),solds:t.find(".allSolds"),views:t.find(".allViews"),orders:t.find(".allOrders"),products:t.find(".allProducts")}}function SetUpProducts(){function e(e,t,a,i,r,s){$(t.find(".ui.search.cat")).search({type:"category",minCharacters:2,apiSettings:{onResponse:e=>(e.results={},e.data.forEach(function(t,a){var i=t.category||"Unknown";if(a>=8)return!1;void 0===e.results[i]&&(e.results[i]={name:i,results:[]}),e.results[i].results.push({title:t.name})}),e),url:"/seller/categories/search={query}"}});const l={on:"blur",inline:!0,rules:{title:{identifier:"title",rules:[{type:"empty",prompt:"Please enter product title"}]},cost:{identifier:"cost",rules:[{type:"currency",prompt:"Please enter valid cost in format XX.XX"}]},shipment:{identifier:"shipment",rules:[{type:"shipment",prompt:"Please enter valid cost in format XX.XX (0$ - 20$)"}]},category:{identifier:"category",rules:[{type:"empty",prompt:"Please search for categories and select"}]},description:{identifier:"description",rules:[{type:"empty",prompt:"Please enter product description"},{type:"minLength[20]",prompt:"Minimum 20 symbols"}]},stock:{identifier:"stock",rules:[{type:"integer[1..99999]",prompt:"Stock should be positive number (1 - 99999)"}]},guarantee:{identifier:"guarantee",rules:[{type:"integer[1..72]",prompt:"Please enter guarantee (Months)"}]}},success:t=>{s.forceRow(t),a.forceEmpty(),i.forceEmpty(),r.setValue(""),e.toggleState()},dataMiddleware:e=>(e.types={},e.full=`${r.getValue()}`,0!=Object.keys(a.getData()).length&&(e.types.color=a.getData()),0!=Object.keys(i.getData()).length&&(e.types.size=i.getData()),e)};new Form(t.find("form"),"/seller/product/create",l)}function t(e,t,a){function i(e,a){if(!a)return;if(0==Object.keys(a).length)return;const i=$(`<div class='ui grid'></div>`);return Object.keys(a).forEach(r=>i.append(new Row(e,t,a[r]).template())),i.append(`<div class="ui divider fitted"></div>`),i}e.empty(),e.append(i("color",a.prTypes.color)),e.append(i("size",a.prTypes.size)),e.removeClass("loading")}$(".ui.small.icon.button").popup({position:"bottom center"});let a=null;const i={open:$("#productsOpen"),delete:$("#productsDelete"),create:$("#productsCreate"),auction:$("#productAuction"),edit:$("#productsEdit"),refresh:$("#productsRefresh")};Simditor.locale="en-US",toolbar=["title","bold","italic","underline","strikethrough","fontScale","color","|","ol","ul","blockquote","table","|","link","image","hr","|","indent","outdent","alignment"];const r=new Simditor({textarea:$("#createModal .wwc"),toolbar:toolbar,defaultImage:"../../GeneralAssets/img/usericons/image.png"});table=new Table("products",{defaultSort:"updatedAt",search:"#productsSearch",forPage:"#productsDrop",buttons:{previous:".left.icon.item",next:".right.icon.item",to:".ui.button.radiusless.borderless"},input:{to:".ui.left.action input"},row:e=>$(`\n        <tr>\n          <td>${e.prTitle}</td>\n          ${reworkStock(e.prStock)}\n          <td><i class="dollar icon"></i>${e.prCost}</td>          \n          <td>${reworkRating(e.prRating)}</td>\n          <td>${e.prViews}</td>\n          <td>${e.prSold}</td>       \n          <td>${new Date(e.updatedAt).toLocaleDateString()}</td>\n          <td>${new Date(e.createdAt).toLocaleDateString()}</td>         \n        </tr>\n      `),click:(e,t,r)=>{i.auction.removeClass("disabled"),i.delete.removeClass("disabled"),i.edit.removeClass("disabled"),i.open.removeClass("disabled"),a={i:e,obj:t,arr:r}},onFocusLost:()=>{i.auction.addClass("disabled"),i.delete.addClass("disabled"),i.edit.addClass("disabled"),i.open.addClass("disabled"),a=null}});const s=new Modal({id:"#deleteModal",onOpen:e=>e.find(".exact").text(a.arr[a.i].prTitle),onClose:e=>{e.find("input").val(""),e.find("button").addClass("disabled")},middleware:e=>{const t=e.find("input"),i=e.find("button");i.addClass("disabled"),t.on("change keyup paste",e=>{e.target.value==a.arr[a.i].prTitle?i.removeClass("disabled"):i.addClass("disabled")}),i.click(e=>{i.addClass("loading"),POST("/seller/product/delete",{uid:a.arr[a.i].prUid}).then(e=>{a.arr.splice(a.i,1),table.redraw(),i.removeClass("loading"),s.toggleState()}).catch(e=>{s.toggleState(),i.removeClass("loading")})})}},!0),l=new NestedList("#typesColorist",{listplace:".ui.grid",submiter:".teal",inputs:[{as:"title",name:"titleVR",valid:e=>0!=e.length},{as:"value",name:"valueVR",valid:e=>0!=e.length},{name:"color",valid:e=>!0},{name:"image",valid:e=>0!=e.length}],mockuper:(e,t)=>{const a=e.image?`<img src="${e.image}" />`:" - ";let i=$(`   \n        <div class="row">   \n          <div class="four wide column">${e.title}</div>\n          <div class="three wide column">${e.value}</div>\n          <div class="two wide column"><a class="ui circular empty label" style="background : ${e.color}; "></a> </div>\n          <div class="five wide column">${a}</div>\n          <div class="two wide column">\n            <button class="ui icon button red small"> <i class="trash outline icon"></i> </button>\n          </div>  \n        </div>      \n      `);return i.find("button").click(e=>{i.remove(),l.forceDelete(t)}),$(i)}}),n=new NestedList("#typesSize",{listplace:".ui.grid",submiter:".teal",inputs:[{as:"title",name:"titleVR",valid:e=>0!=e.length},{as:"value",name:"valueVR",valid:e=>0!=e.length}],mockuper:(e,t)=>{let a=$(`   \n        <div class="row">   \n          <div class="seven wide column">${e.title}</div>\n          <div class="seven wide column">${e.value}</div>  \n          <div class="two wide column">\n            <button class="ui icon button red small"> <i class="trash outline icon"></i> </button>\n          </div>  \n        </div>      \n      `);return a.find("button").click(e=>{a.remove(),n.forceDelete(t)}),$(a)}}),o=new Modal({id:"#createModal",closer:".closer",closable:!0,overflowed:!0,onOpen:e=>{e.find("form").form("reset"),l.forceEmpty(),n.forceEmpty(),r.setValue("")},onClose:e=>{},middleware:(t,a,i)=>e(i,t,l,n,r,table)},!1),d=new Modal({id:"#editModal",reset:!0,overflowed:!0,closer:".closer",onOpen:(e,i)=>{i.input.val(a.arr[a.i].prStock),i.name.text(a.arr[a.i].prTitle),i.types.addClass("loading"),i.types.empty(),POST("/seller/product/types",{id:a.arr[a.i].prUid}).then(e=>t(i.types,a.arr[a.i].prUid,e.data),e=>{})},onClose:(e,t)=>{},middleware:(e,t,i)=>{t.input=e.find("form").find("input"),t.types=e.find(".ui.segment"),t.name=e.find(".exact");new Form(e.find("form"),"/seller/product/stock",{on:"blur",inline:!0,rules:{stock:{identifier:"stock",rules:[{type:"integer[1..99999]",prompt:"Stock should be positive number (1 - 99999)"}]}},success:e=>{let i=a.arr[a.i];i.prStock=t.input.val(),table.forceChange(a.i,i)},dataMiddleware:e=>(e.uid=a.arr[a.i].prUid,e)})}},!0),c=new Modal({id:"#auctionNewModal",reset:!0,overflowed:!0,onOpen:(e,t)=>{t.form.removeClass("success error"),t.dropdown.dropdown("clear"),t.fee.val("Fee"),t.exp.val("Appearence"),t.ape.val("Explanation"),t.exact.text(a.arr[a.i].prTitle)},onClose:(e,t)=>{},middleware:(e,t,i)=>{const r={inline:!0,on:"blur",rules:{stock:{identifier:"stock",rules:[{type:"integer[1..99999]",prompt:"Stock should be positive number (1 - 99999)"}]},type:{identifier:"type",rules:[{type:"empty",prompt:"Select type of auction item"}]}},dataMiddleware:e=>(e.uidProduct=a.arr[a.i].prUid,e),success:e=>{},failure:e=>{}};t.form=e.find("form"),t.submit=t.form.find("button"),t.exact=e.find(".exact"),t.fee=e.find('input[name="fee"]'),t.exp=e.find('input[name="exp"]'),t.ape=e.find('input[name="ape"]'),t.dropdown=e.find(".ui.dropdown").dropdown({onChange:(e,a,i)=>{currentFees[e]&&(t.fee.val(String(currentFees[e].fee)+("dollar"==currentFees[e].type?"$":"%")),t.ape.val(currentFees[e].appearance),t.exp.val(currentFees[e].explanation))}}),t.preparedForm=new Form(t.form,"/seller/auction/create",r)}},!1);i.delete.click(e=>s.toggleState()),i.create.click(e=>o.toggleState()),i.auction.click(e=>c.toggleState()),i.edit.click(e=>d.toggleState()),i.open.click(e=>window.open(`/product/id${a.arr[a.i].prUid}`)),i.refresh.click(e=>table.loadFromCache())}function SetUpDisabled(){let e=null;const t={renew:$("#disabledRenew"),delete:$("#disabledDelete"),refresh:$("#disabledRefresh")};tableDisabled=new Table("disabled",{defaultSort:"updatedAt",search:"#disabledSearch",forPage:"#disabledDrop",buttons:{previous:".left.icon.item",next:".right.icon.item",to:".ui.button.radiusless.borderless"},input:{to:".ui.left.action input"},row:e=>$(` \n        <tr>\n          <td>${e.prTitle}</td> \n          <td>${reworkRating(e.prRating)}</td>\n          <td>${e.prViews}</td>\n          <td>${e.prSold}</td>       \n          <td>${new Date(e.updatedAt).toLocaleDateString()}</td>               \n        </tr>\n      `),click:(a,i,r)=>{t.renew.removeClass("disabled"),t.delete.removeClass("disabled"),e={i:a,obj:i,arr:r}},onFocusLost:()=>{t.renew.addClass("disabled"),t.delete.addClass("disabled"),e=null}});const a=new Modal({id:"#renewModal",onOpen:t=>t.find(".exact").text(e.arr[e.i].prTitle),onClose:e=>{e.find("input").val(""),e.find("button").addClass("disabled")},middleware:t=>{const i=t.find("input"),r=t.find("button");r.addClass("disabled"),i.on("change keyup paste",t=>{t.target.value==e.arr[e.i].prTitle?r.removeClass("disabled"):r.addClass("disabled")}),r.click(t=>{r.addClass("loading"),POST("/seller/product/renew",{uid:e.arr[e.i].prUid}).then(t=>{e.arr.splice(e.i,1),tableDisabled.redraw(),r.removeClass("loading"),a.toggleState()}).catch(e=>{a.toggleState(),r.removeClass("loading")})})}},!0),i=new Modal({id:"#finishModal",onOpen:t=>{t.find(".exact").text(e.arr[e.i].prTitle),t.find("form").removeClass("error")},onClose:e=>{e.find("input").val(""),e.find("button").addClass("disabled")},middleware:t=>{const a=t.find("input"),r=t.find("button"),s=t.find("form"),l=t.find(".error.message p");r.addClass("disabled"),a.on("change keyup paste",t=>{t.target.value==e.arr[e.i].prTitle?r.removeClass("disabled"):r.addClass("disabled")}),r.click(t=>{r.addClass("loading"),POST("/seller/product/remove",{uid:e.arr[e.i].prUid}).then(t=>{e.arr.splice(e.i,1),tableDisabled.redraw(),r.removeClass("loading"),i.toggleState()}).catch(e=>{l.text(e.reason),s.addClass("error"),r.removeClass("loading")})})}},!0);t.renew.click(e=>a.toggleState()),t.delete.click(e=>i.toggleState()),t.refresh.click(e=>tableDisabled.loadFromCache())}function SetUpAuction(){let e=null;const t={stock:$("#auctionsStock"),pause:$("#auctionsPause"),refresh:$("#auctionsRefresh")},a=new Modal({id:"#auctionUpdateModal",onOpen:(t,a)=>t.find(".exact").text(e.arr[e.i].product.prTitle),onClose:(e,t)=>e.find("input").val(""),middleware:(t,a,i)=>{let r={on:"blur",inline:!0,rules:{stock:{identifier:"stock",rules:[{type:"integer[1..99999]",prompt:"Stock should be positive number (1 - 99999)"}]}},dataMiddleware:t=>(t.uidRecord=e.arr[e.i].uidRecord,t),success:t=>{let a=e.arr[e.i];a.inStock=t,tableAuctions.forceChange(e.i,a)},failure:e=>{}};a.form=new Form(t.find("form"),"/seller/auction/stock",r)}},!0),i=new Modal({id:"#auctionPauseModal",onOpen:(t,a)=>{a.exact.text(e.arr[e.i].product.prTitle),a.current=e,e.arr[e.i].temporaryDisabled?(a.button.text("Enable"),a.button.removeClass("red"),a.button.addClass("green")):(a.button.text("Disable"),a.button.removeClass("green"),a.button.addClass("red"))},onClose:(e,t)=>t.current=null,middleware:(e,t,a)=>{const i={rules:{button:{identifier:"title",rules:[{type:"empty"}]}},dataMiddleware:e=>(e.uidRecord=t.current.arr[t.current.i].uidRecord,e.temporaryDisabled=!t.current.arr[t.current.i].temporaryDisabled,e),success:e=>{let a=t.current.arr[t.current.i];a.temporaryDisabled=!a.temporaryDisabled,tableAuctions.forceChange(t.current.i,a),redrawButton(t,a.temporaryDisabled)}};t.exact=e.find(".exact"),t.button=e.find("button"),t.form=new Form(e.find("form"),"/seller/auction/pause",i)}},!0);tableAuctions=new Table("auctions",{defaultSort:"updatedAt",search:"#auctionsSearch",forPage:"#auctionsDrop",buttons:{previous:".left.icon.item",next:".right.icon.item",to:".ui.button.radiusless.borderless"},input:{to:".ui.left.action input"},row:e=>$(` \n        <tr>\n          <td>${e.product.prTitle}</td> \n          <td>${currentFees[e.uidFee].title}</td>\n          <td>${e.inStock}</td>\n          <td><i class="dollar icon"></i>${e.currentBid/100}</td>       \n          ${reworkBoolean(e.onAuction)}\n          ${reworkBoolean(e.isCompleted)}\n          <td>${new Date(e.updatedAt).toLocaleDateString()}</td>\n          <td>${new Date(e.createdAt).toLocaleDateString()}</td>   \n        </tr>\n      `),click:(a,i,r)=>{t.stock.removeClass("disabled"),t.pause.removeClass("disabled"),e={i:a,obj:i,arr:r}},onFocusLost:()=>{t.stock.addClass("disabled"),t.pause.addClass("disabled"),e=null}}),t.refresh.click(e=>tableAuctions.loadFromCache()),t.stock.click(e=>a.toggleState()),t.pause.click(e=>i.toggleState())}function Row(e,t,a){return this.isDisabled=1==a.disable,this.generateButton=(e=>{let t={};return 1==e?(t.classes="ui button tiny green",t.title="Enable"):(t.classes="ui button tiny red",t.title="Disable"),`<button type="button" class="${t.classes}"> ${t.title} </button>`}),this.switchButton=(e=>{e.toggleClass("loading"),this.isDisabled?(e.removeClass("red"),e.addClass("green"),e.text("Enable")):(e.removeClass("green"),e.addClass("red"),e.text("Disable"))}),this.row=$(`<div class="three column row wrap">\n    <div class="column">${a.title}</div>\n    <div class="column">${a.value}</div>\n    <div class="column"> ${this.generateButton(this.isDisabled)} </div>\n  </div>`),this.button=this.row.find("button"),this.button.click(i=>{this.button.addClass("loading"),this.isDisabled=!this.isDisabled,POST("/seller/product/typesout",{uid:t,available:this.isDisabled,types:{group:e,name:a.value}}).then(e=>this.switchButton(this.button))}),this.template=(()=>this.row),this}function numberRebase(e){return e<100?e:e<1e3?parseFloat(e).toFixed(2)/1e3+"h":e<1e6?parseFloat(e).toFixed(2)/1e3+"th":void 0}function redrawButton(e,t){t?(e.button.text("Enable"),e.button.removeClass("red"),e.button.addClass("green")):(e.button.text("Disable"),e.button.removeClass("green"),e.button.addClass("red"))}let table,tableDisabled,tableAuctions,tabs,dataStats;$(e=>onLoad());let currentFees={standard:{fee:2,type:"dollar",title:"Standard Listing",explanation:"Bids Begin at $2 and bids goes up at $1 at a time",appearance:"No Color Border"},featured:{fee:3,type:"dollar",title:"Featured Listing",explanation:"Bids Begin at $3 and bids goes up at $1 at a time",appearance:"Purple Color Border"},small:{fee:5,type:"per",title:"Standard 20% Percent",explanation:"Bids Begin at $1 and bids goes up at 20% at a time",appearance:"Orange Color Border"},big:{fee:10,type:"per",title:"Big Percentage 50%",explanation:"Bids Begin at $1 and bids goes up at 50% at a time",appearance:"Pink Color Border"}};