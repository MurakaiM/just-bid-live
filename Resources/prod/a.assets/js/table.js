"use strict";function Table(e,t){function r(e,t,r){e.sort(function(e,a){var n=e[t],i=a[t];return r?n<i?-1:n>i?1:0:n>i?-1:n<i?1:0})}var a=this;this.table=$("#"+e),this.tbody=this.table.find("tbody"),this.tpagins=[],this.tactive,this.maxPages,this.forPage=10,this.total=this.table.find(".ui.label.total"),this.currentPage,this.currentRow,this.currentSortableId=null,this.currentSortableBool=null,this.currentSortableHeader=null,this.data={current:[]},this.searched=null,this.createSortable=function(e){var r=e.data("field");r==t.defaultSort&&(e.addClass("down"),a.currentSortableId=r,a.currentSortableHeader=e,a.currentSortableBool=!1),e.append($('\n        <div class="arrows">\n            <i class="chevron up icon"></i>\n            <i class="chevron down icon"></i>\n        </div>')),e.click(function(t){a.currentSortableId==r?(a.currentSortableBool=!a.currentSortableBool,a.sortBy(r,a.currentSortableBool),a.currentSortableHeader.removeClass("up down"),a.currentSortableBool?a.currentSortableHeader.addClass("up"):a.currentSortableHeader.addClass("down")):(a.currentSortableHeader&&a.currentSortableHeader.removeClass("up down"),a.currentSortableHeader=e,a.currentSortableHeader.addClass("down"),a.currentSortableId=r,a.currentSortableBool=!1,a.sortBy(r,!1))})},this.forceDelete=function(){a.searched=null,a.data.current=[],a.forPage=10,a.forceClearSortable()},this.forceClearSortable=function(){a.currentSortableHeader.removeClass("up down"),a.currentSortableId=t.defaultSort,a.currentSortableBool=!1,a.currentSortableHeader=$('.ui.table thead th[data-field="'+t.defaultSort+'"]'),a.currentSortableHeader.addClass("down")},this.forceLoad=function(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];t.transformation&&r&&(e=e.map(t.transformation)),a.searched=null,a.data.current=e,a.forPage=10,a.recalculatePages(),a.pagination(1)},this.forceRow=function(e){a.data.current.unshift(e),a.sortBy(t.defaultSort),a.forceLoad(a.data.current)},this.forceChange=function(e,r){a.data.current[e]=r,a.sortBy(t.defaultSort),a.forceLoad(a.data.current,!1)},this.redraw=function(){return a.pagination(a.currentPage)},this.changeFor=function(e){a.forPage=parseInt(e),a.recalculatePages(),a.displayPage(a.currentPage,a.searched?a.searched:a.data.current),$(t.input.to).val(a.currentPage)},this.recalculatePages=function(){var e=a.searched?a.searched.length:a.data.current.length;a.maxPages=Math.ceil(e/a.forPage),a.total.text(" / "+a.maxPages),a.currentPage>a.maxPage&&(a.currentPage=a.maxPage)},this.displayPage=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a.data.current;if(e>a.maxPages&&(e=a.maxPages),a.tbody.empty(),t.onFocusLost&&t.onFocusLost(),0!=r.length)for(var n=(e-1)*a.forPage;n<e*a.forPage;n++)!function(e){if(r[e]){var n=t.row?t.row(r[e]):function(e){var t="<tr>";return Object.values(e).forEach(function(e){return t+="<td>"+e+"</td>"}),t+="</tr>",$(t)}(r[e]);n.click(function(i){a.currentRow&&a.currentRow.removeClass("selected"),n.addClass("selected"),t.click(e,n,r),a.currentRow=n}),a.tbody.append(n)}}(n);else a.tbody.append('<tr> <td colspan="10"> <div class="emptypage"> There are no records </div> </td> </tr>');a.currentPage=e},this.sortBy=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];a.searched?(r(a.searched,e,t),a.displayPage(a.currentPage,a.searched)):(r(a.data.current,e,t),a.displayPage(a.currentPage))},this.disableSort=function(){a.sortBy(t.defaultSort),a.recalculatePages(),a.displayPage(a.currentPage,a.searched?a.searched:a.data.current),a.forceClearSortable()},this.search=function(e){a.searched=null,a.searched=[],a.searched=a.data.current.filter(function(t){return Object.keys(t).some(function(r){return"createdAt"==r||"updatedAt"==r?new Date(t[r]).toLocaleDateString().toLowerCase().indexOf(e)>-1:String(t[r]).toLowerCase().indexOf(e.toLowerCase())>-1})}),a.sortBy(a.currentSortableId,a.currentSortableBool),a.recalculatePages(),a.displayPage(1,a.searched)},this.disableSearch=function(){a.searched=null,a.recalculatePages(),a.displayPage(1),a.disableSort()},this.pagination=function(e){e<=0?e=a.maxPages>=1?1:0:e>a.maxPages&&(e=a.maxPages),a.currentPage=e,a.searched?a.displayPage(e,a.searched):a.displayPage(e,a.data.current),$(t.input.to).val(e)},this.bNext=function(){a.currentPage=a.currentPage+1,a.pagination(a.currentPage)},this.bPrevious=function(){a.currentPage=a.currentPage-1,a.pagination(a.currentPage)},this.setUpUi=function(){$(t.search).on("change keyup",function(e){0==e.target.value.length?a.disableSearch():a.search(e.target.value)}),$(t.forPage).dropdown("set selected",10),$(t.forPage).dropdown({onChange:function(){return a.changeFor($(t.forPage).dropdown("get value"))}}),a.table.find(t.buttons.next).click(function(e){return a.bNext()}),a.table.find(t.buttons.previous).click(function(e){return a.bPrevious()});var e=a.table.find(t.input.to);$(t.buttons.to).click(function(t){var r=parseInt(e.val());isNaN(r)&&(r=1),a.pagination(r)}),a.table.find("thead th[data-field]").each(function(e,t){return a.createSortable($(t))})},this.loadInSegment=function(e,t,r,n){a.hashed={url:e,head:t,segment:r},LoadSegment(e,t,r).then(function(e){a.forceLoad(e.result.data),r.removeClass("loading")})},this.loadFromCache=function(){a.forceClearSortable(),LoadSegment(a.hashed.url,a.hashed.head,a.hashed.segment).then(function(e){a.hashed.segment.toggleClass("loading"),a.forceLoad(e.result.data)})},this.setUpUi(),this.getData=function(){return a.data.current},this.hashed}function NestedList(e,t){var r=this;this.body=$(e),this.place=this.body.find(t.listplace),this.submiter=this.body.find(t.submiter),this.result={},this.files={},this.current=0,t.isFiled&&(this.files.path=this.body.find("input[name="+t.isFiled.pathName+"]"),this.files.input=this.body.find("input[name="+t.isFiled.inputName+"]"),this.files.button=this.body.find("button[name="+t.isFiled.buttonName+"]"),this.files.button.click(function(e){return r.files.input.click()}),this.files.input.on("change",function(e){return r.readFile(r.files.input,r.files.path,r.loadUri)})),this.validate=function(){var e={},a=!0;return t.inputs.forEach(function(t){var n=$(r.body.find("input[name="+t.name+"]")),i=n.parent();t.valid(n.val())?(i.removeClass("error"),e[t.as?t.as:t.name]=n.val()):(i.addClass("error"),a=!1)}),1==a&&t.inputs.forEach(function(e){return $(r.body.find("input[name="+e.name+"]").val(""))}),t.isFiled&&(e.image=r.files.currentFile,e.uri=r.files.currentUrl),{valid:a,data:e}},this.submiter.click(function(e){var a=r.validate();a.valid&&(r.result[a.data.value]||(r.result[a.data.value]=a.data,r.place.append(t.mockuper(a.data,a.data.value)),t.maxSize&&t.maxSize==Object.keys(r.result).length&&r.submiter.addClass("disabled"),t.onAdd&&t.onAdd(r.getData())))}),this.getData=function(){return r.result},this.forceDelete=function(e){delete r.result[e],t.maxSize&&t.maxSize>Object.keys(r.result).length&&r.submiter.removeClass("disabled"),t.onDelete&&t.onDelete(e)},this.forceEmpty=function(){r.result={},r.place.empty(),r.submiter.removeClass("disabled"),t.onEmpty&&t.onEmpty()},this.readFile=function(e,t,a){var n=new FileReader;r.files.currentFile=e[0].files[0],e[0].files[0]&&(t.val(e[0].files[0].name),n.onload=function(e){return a(e.target.result)},n.readAsDataURL(e[0].files[0]))},this.loadUri=function(e){return r.files.currentUrl=e},this.setChangers=function(e,r){t.onAdd=e,t.onDelete=r}}function NestedCreator(e,t,r){var a=this;this.form,this.currentIds={},this.just=$(r).find(".ui.grid"),this.setForm=function(e){return a.form=e},this.appendNew=function(e,t){a.currentIds[t]||(a.currentIds[t]=a.createRender(e,t),a.just.append(a.currentIds[t]),a.form.addField({identifier:t,rules:[{type:"integer[1..99999]",prompt:"Please enter valid stock number"}]}))},this.dissapendNew=function(e){a.currentIds[e].remove(),a.form.removeField(e)},this.onAdd=function(){a.just.find("input").each(function(e,t){a.form.removeField($(t).data("name")),$(t).remove()}),a.just.empty(),a.currentIds={};var r=Object.keys(e.getData()),n=Object.keys(t.getData());if(0==n.length&&r.length>0){var i=!0,o=!1,s=void 0;try{for(var l,d=r[Symbol.iterator]();!(i=(l=d.next()).done);i=!0){S=l.value;a.appendNew(e.getData()[S].title,S)}}catch(e){o=!0,s=e}finally{try{!i&&d.return&&d.return()}finally{if(o)throw s}}}if(0==r.length&&n.length>0){var u=!0,c=!1,f=void 0;try{for(var h,g=n[Symbol.iterator]();!(u=(h=g.next()).done);u=!0){S=h.value;a.appendNew(t.getData()[S].title,S)}}catch(e){c=!0,f=e}finally{try{!u&&g.return&&g.return()}finally{if(c)throw f}}}if(r.length>0&&n.length>0){var p=!0,b=!1,v=void 0;try{for(var m,y=r[Symbol.iterator]();!(p=(m=y.next()).done);p=!0){var S=m.value,P=!0,w=!1,C=void 0;try{for(var x,D=n[Symbol.iterator]();!(P=(x=D.next()).done);P=!0){var F=x.value,k=S+F,B=e.getData()[S].title+", "+t.getData()[F].title;a.appendNew(B,k)}}catch(e){w=!0,C=e}finally{try{!P&&D.return&&D.return()}finally{if(w)throw C}}}}catch(e){b=!0,v=e}finally{try{!p&&y.return&&y.return()}finally{if(b)throw v}}}},this.onDelete=function(e){return Object.keys(a.currentIds).forEach(function(t){t.indexOf(e)>-1&&a.dissapendNew(t)})},this.forceEmpty=function(){a.just.find("input").each(function(e,t){return a.form.removeField($(t).data("name"))}),a.just.empty()},this.createRender=function(e,t){return $('\n          <div class="eight wide column">\n            <div class="fields" data-nested='+t+'>\n                <div class="eight wide field">\n                    <input type="text" class="partlydisabled" value="'+e+'">\n                </div>\n                <div class="eight wide field">\n                    <input type="text" name='+t+' placeholder="Stock">\n                </div>\n            </div>\n          </div>  \n        ')},e.setChangers(function(){return a.onAdd()},function(e){return a.onDelete(e)}),t.setChangers(function(){return a.onAdd()},function(e){return a.onDelete(e)})}