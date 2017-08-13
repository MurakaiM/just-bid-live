!function(e,t,s,n){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.search=function(n){var i,r=e(this),a=r.selector||"",o=(new Date).getTime(),c=[],u=arguments[0],l="string"==typeof u,d=[].slice.call(arguments,1);return e(this).each(function(){var f,v=e.isPlainObject(n)?e.extend(!0,{},e.fn.search.settings,n):e.extend({},e.fn.search.settings),g=v.className,h=v.metadata,p=v.regExp,m=v.fields,b=v.selector,y=v.error,R=v.namespace,C="."+R,w=R+"-module",x=e(this),F=x.find(b.prompt),j=x.find(b.searchButton),k=x.find(b.results),A=x.find(b.result),q=x.find(b.category),S=this,E=x.data(w),T=!1,D=!1;f={initialize:function(){f.verbose("Initializing module"),f.determine.searchFields(),f.bind.events(),f.set.type(),f.create.results(),f.instantiate()},instantiate:function(){f.verbose("Storing instance of module",f),E=f,x.data(w,f)},destroy:function(){f.verbose("Destroying instance"),x.off(C).removeData(w)},refresh:function(){f.debug("Refreshing selector cache"),F=x.find(b.prompt),j=x.find(b.searchButton),q=x.find(b.category),k=x.find(b.results),A=x.find(b.result)},refreshResults:function(){k=x.find(b.results),A=x.find(b.result)},bind:{events:function(){f.verbose("Binding events to search"),v.automatic&&(x.on(f.get.inputEvent()+C,b.prompt,f.event.input),F.attr("autocomplete","off")),x.on("focus"+C,b.prompt,f.event.focus).on("blur"+C,b.prompt,f.event.blur).on("keydown"+C,b.prompt,f.handleKeyboard).on("click"+C,b.searchButton,f.query).on("mousedown"+C,b.results,f.event.result.mousedown).on("mouseup"+C,b.results,f.event.result.mouseup).on("click"+C,b.result,f.event.result.click)}},determine:{searchFields:function(){n&&void 0!==n.searchFields&&(v.searchFields=n.searchFields)}},event:{input:function(){clearTimeout(f.timer),f.timer=setTimeout(f.query,v.searchDelay)},focus:function(){f.set.focus(),v.searchOnFocus&&f.has.minimumCharacters()&&f.query(function(){f.can.show()&&f.showResults()})},blur:function(e){var t=function(){f.cancel.query(),f.remove.focus(),f.timer=setTimeout(f.hideResults,v.hideDelay)};s.activeElement===this||(D=!1,f.resultsClicked?(f.debug("Determining if user action caused search to close"),x.one("click.close"+C,b.results,function(e){f.is.inMessage(e)||T?F.focus():(T=!1,f.is.animating()||f.is.hidden()||t())})):(f.debug("Input blurred without user action, closing results"),t()))},result:{mousedown:function(){f.resultsClicked=!0},mouseup:function(){f.resultsClicked=!1},click:function(s){f.debug("Search result selected");var n=e(this),i=n.find(b.title).eq(0),r=n.is("a[href]")?n:n.find("a[href]").eq(0),a=r.attr("href")||!1,o=r.attr("target")||!1,c=(i.html(),i.length>0&&i.text()),u=f.get.results(),l=n.data(h.result)||f.get.result(c,u);if(e.isFunction(v.onSelect)&&!1===v.onSelect.call(S,l,u))return f.debug("Custom onSelect callback cancelled default select action"),void(T=!0);f.hideResults(),c&&f.set.value(c),a&&(f.verbose("Opening search link found in result",r),"_blank"==o||s.ctrlKey?t.open(a):t.location.href=a)}}},handleKeyboard:function(e){var t,s=x.find(b.result),n=x.find(b.category),i=s.filter("."+g.active),r=s.index(i),a=s.length,o=i.length>0,c=e.which,u={backspace:8,enter:13,escape:27,upArrow:38,downArrow:40};if(c==u.escape&&(f.verbose("Escape key pressed, blurring search field"),f.hideResults(),D=!0),f.is.visible())if(c==u.enter){if(f.verbose("Enter key pressed, selecting active result"),s.filter("."+g.active).length>0)return f.event.result.click.call(s.filter("."+g.active),e),e.preventDefault(),!1}else c==u.upArrow&&o?(f.verbose("Up key pressed, changing active result"),t=r-1<0?r:r-1,n.removeClass(g.active),s.removeClass(g.active).eq(t).addClass(g.active).closest(n).addClass(g.active),e.preventDefault()):c==u.downArrow&&(f.verbose("Down key pressed, changing active result"),t=r+1>=a?r:r+1,n.removeClass(g.active),s.removeClass(g.active).eq(t).addClass(g.active).closest(n).addClass(g.active),e.preventDefault());else c==u.enter&&(f.verbose("Enter key pressed, executing query"),f.query(),f.set.buttonPressed(),F.one("keyup",f.remove.buttonFocus))},setup:{api:function(t,s){var n={debug:v.debug,on:!1,cache:!0,action:"search",urlData:{query:t},onSuccess:function(e){f.parse.response.call(S,e,t),s()},onFailure:function(){f.displayMessage(y.serverError),s()},onAbort:function(e){},onError:f.error};e.extend(!0,n,v.apiSettings),f.verbose("Setting up API request",n),x.api(n)}},can:{useAPI:function(){return void 0!==e.fn.api},show:function(){return f.is.focused()&&!f.is.visible()&&!f.is.empty()},transition:function(){return v.transition&&void 0!==e.fn.transition&&x.transition("is supported")}},is:{animating:function(){return k.hasClass(g.animating)},hidden:function(){return k.hasClass(g.hidden)},inMessage:function(t){if(t.target){var n=e(t.target);return e.contains(s.documentElement,t.target)&&n.closest(b.message).length>0}},empty:function(){return""===k.html()},visible:function(){return k.filter(":visible").length>0},focused:function(){return F.filter(":focus").length>0}},get:{inputEvent:function(){var e=F[0];return void 0!==e&&void 0!==e.oninput?"input":void 0!==e&&void 0!==e.onpropertychange?"propertychange":"keyup"},value:function(){return F.val()},results:function(){return x.data(h.results)},result:function(t,s){var n=["title","id"],i=!1;return t=void 0!==t?t:f.get.value(),s=void 0!==s?s:f.get.results(),"category"===v.type?(f.debug("Finding result that matches",t),e.each(s,function(s,r){if(e.isArray(r.results)&&(i=f.search.object(t,r.results,n)[0]))return!1})):(f.debug("Finding result in results object",t),i=f.search.object(t,s,n)[0]),i||!1}},select:{firstResult:function(){f.verbose("Selecting first result"),A.first().addClass(g.active)}},set:{focus:function(){x.addClass(g.focus)},loading:function(){x.addClass(g.loading)},value:function(e){f.verbose("Setting search input value",e),F.val(e)},type:function(e){e=e||v.type,"category"==v.type&&x.addClass(v.type)},buttonPressed:function(){j.addClass(g.pressed)}},remove:{loading:function(){x.removeClass(g.loading)},focus:function(){x.removeClass(g.focus)},buttonPressed:function(){j.removeClass(g.pressed)}},query:function(t){t=e.isFunction(t)?t:function(){};var s=f.get.value(),n=f.read.cache(s);t=t||function(){},f.has.minimumCharacters()?(n?(f.debug("Reading result from cache",s),f.save.results(n.results),f.addResults(n.html),f.inject.id(n.results),t()):(f.debug("Querying for",s),e.isPlainObject(v.source)||e.isArray(v.source)?(f.search.local(s),t()):f.can.useAPI()?f.search.remote(s,t):(f.error(y.source),t())),v.onSearchQuery.call(S,s)):f.hideResults()},search:{local:function(e){var t,s=f.search.object(e,v.content);f.set.loading(),f.save.results(s),f.debug("Returned local search results",s),t=f.generateResults({results:s}),f.remove.loading(),f.addResults(t),f.inject.id(s),f.write.cache(e,{html:t,results:s})},remote:function(t,s){s=e.isFunction(s)?s:function(){},x.api("is loading")&&x.api("abort"),f.setup.api(t,s),x.api("query")},object:function(t,s,n){var i=[],r=[],a=t.toString().replace(p.escape,"\\$&"),o=new RegExp(p.beginsWith+a,"i"),c=function(t,s){var n=-1==e.inArray(s,i),a=-1==e.inArray(s,r);n&&a&&t.push(s)};return s=s||v.source,n=void 0!==n?n:v.searchFields,e.isArray(n)||(n=[n]),void 0===s||!1===s?(f.error(y.source),[]):(e.each(n,function(n,a){e.each(s,function(e,s){"string"==typeof s[a]&&(-1!==s[a].search(o)?c(i,s):v.searchFullText&&f.fuzzySearch(t,s[a])&&c(r,s))})}),e.merge(i,r))}},fuzzySearch:function(e,t){var s=t.length,n=e.length;if("string"!=typeof e)return!1;if(e=e.toLowerCase(),t=t.toLowerCase(),n>s)return!1;if(n===s)return e===t;e:for(var i=0,r=0;i<n;i++){for(var a=e.charCodeAt(i);r<s;)if(t.charCodeAt(r++)===a)continue e;return!1}return!0},parse:{response:function(e,t){var s=f.generateResults(e);f.verbose("Parsing server response",e),void 0!==e&&void 0!==t&&void 0!==e[m.results]&&(f.addResults(s),f.inject.id(e[m.results]),f.write.cache(t,{html:s,results:e[m.results]}),f.save.results(e[m.results]))}},cancel:{query:function(){f.can.useAPI()&&x.api("abort")}},has:{minimumCharacters:function(){return f.get.value().length>=v.minCharacters},results:function(){return 0!==k.length&&""!=k.html()}},clear:{cache:function(e){var t=x.data(h.cache);e?e&&t&&t[e]&&(f.debug("Removing value from cache",e),delete t[e],x.data(h.cache,t)):(f.debug("Clearing cache",e),x.removeData(h.cache))}},read:{cache:function(e){var t=x.data(h.cache);return!!v.cache&&(f.verbose("Checking cache for generated html for query",e),"object"==typeof t&&void 0!==t[e]&&t[e])}},create:{id:function(e,t){var s,n=e+1;return void 0!==t?(s=String.fromCharCode(97+t)+n,f.verbose("Creating category result id",s)):(s=n,f.verbose("Creating result id",s)),s},results:function(){0===k.length&&(k=e("<div />").addClass(g.results).appendTo(x))}},inject:{result:function(e,t,s){f.verbose("Injecting result into results");var n=void 0!==s?k.children().eq(s).children(b.result).eq(t):k.children(b.result).eq(t);f.verbose("Injecting results metadata",n),n.data(h.result,e)},id:function(t){f.debug("Injecting unique ids into results");var s=0,n=0;return"category"===v.type?e.each(t,function(t,i){n=0,e.each(i.results,function(e,t){var r=i.results[e];void 0===r.id&&(r.id=f.create.id(n,s)),f.inject.result(r,n,s),n++}),s++}):e.each(t,function(e,s){var i=t[e];void 0===i.id&&(i.id=f.create.id(n)),f.inject.result(i,n),n++}),t}},save:{results:function(e){f.verbose("Saving current search results to metadata",e),x.data(h.results,e)}},write:{cache:function(e,t){var s=void 0!==x.data(h.cache)?x.data(h.cache):{};v.cache&&(f.verbose("Writing generated html to cache",e,t),s[e]=t,x.data(h.cache,s))}},addResults:function(t){if(e.isFunction(v.onResultsAdd)&&!1===v.onResultsAdd.call(k,t))return f.debug("onResultsAdd callback cancelled default action"),!1;t?(k.html(t),f.refreshResults(),v.selectFirstResult&&f.select.firstResult(),f.showResults()):f.hideResults(function(){k.empty()})},showResults:function(t){t=e.isFunction(t)?t:function(){},D||!f.is.visible()&&f.has.results()&&(f.can.transition()?(f.debug("Showing results with css animations"),k.transition({animation:v.transition+" in",debug:v.debug,verbose:v.verbose,duration:v.duration,onComplete:function(){t()},queue:!0})):(f.debug("Showing results with javascript"),k.stop().fadeIn(v.duration,v.easing)),v.onResultsOpen.call(k))},hideResults:function(t){t=e.isFunction(t)?t:function(){},f.is.visible()&&(f.can.transition()?(f.debug("Hiding results with css animations"),k.transition({animation:v.transition+" out",debug:v.debug,verbose:v.verbose,duration:v.duration,onComplete:function(){t()},queue:!0})):(f.debug("Hiding results with javascript"),k.stop().fadeOut(v.duration,v.easing)),v.onResultsClose.call(k))},generateResults:function(t){f.debug("Generating html from response",t);var s=v.templates[v.type],n=e.isPlainObject(t[m.results])&&!e.isEmptyObject(t[m.results]),i=e.isArray(t[m.results])&&t[m.results].length>0,r="";return n||i?(v.maxResults>0&&(n?"standard"==v.type&&f.error(y.maxResults):t[m.results]=t[m.results].slice(0,v.maxResults)),e.isFunction(s)?r=s(t,m):f.error(y.noTemplate,!1)):v.showNoResults&&(r=f.displayMessage(y.noResults,"empty")),v.onResults.call(S,t),r},displayMessage:function(e,t){return t=t||"standard",f.debug("Displaying message",e,t),f.addResults(v.templates.message(e,t)),v.templates.message(e,t)},setting:function(t,s){if(e.isPlainObject(t))e.extend(!0,v,t);else{if(void 0===s)return v[t];v[t]=s}},internal:function(t,s){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===s)return f[t];f[t]=s}},debug:function(){!v.silent&&v.debug&&(v.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,v.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!v.silent&&v.verbose&&v.debug&&(v.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,v.name+":"),f.verbose.apply(console,arguments)))},error:function(){v.silent||(f.error=Function.prototype.bind.call(console.error,console,v.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,s;v.performance&&(s=(t=(new Date).getTime())-(o||t),o=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:S,"Execution Time":s})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=v.name+":",s=0;o=!1,clearTimeout(f.performance.timer),e.each(c,function(e,t){s+=t["Execution Time"]}),t+=" "+s+"ms",a&&(t+=" '"+a+"'"),r.length>1&&(t+=" ("+r.length+")"),(void 0!==console.group||void 0!==console.table)&&c.length>0&&(console.groupCollapsed(t),console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,s,n){var r,a,o,c=E;return s=s||d,n=S||n,"string"==typeof t&&void 0!==c&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(s,n){var i=s!=r?n+t[s+1].charAt(0).toUpperCase()+t[s+1].slice(1):t;if(e.isPlainObject(c[i])&&s!=r)c=c[i];else{if(void 0!==c[i])return a=c[i],!1;if(!e.isPlainObject(c[n])||s==r)return void 0!==c[n]&&(a=c[n],!1);c=c[n]}})),e.isFunction(a)?o=a.apply(n,s):void 0!==a&&(o=a),e.isArray(i)?i.push(o):void 0!==i?i=[i,o]:void 0!==o&&(i=o),a}},l?(void 0===E&&f.initialize(),f.invoke(u)):(void 0!==E&&E.invoke("destroy"),f.initialize())}),void 0!==i?i:this},e.fn.search.settings={name:"Search",namespace:"search",silent:!1,debug:!1,verbose:!1,performance:!0,type:"standard",minCharacters:1,selectFirstResult:!1,apiSettings:!1,source:!1,searchOnFocus:!0,searchFields:["title","description"],displayField:"",searchFullText:!0,automatic:!0,hideDelay:0,searchDelay:200,maxResults:7,cache:!0,showNoResults:!0,transition:"scale",duration:200,easing:"easeOutExpo",onSelect:!1,onResultsAdd:!1,onSearchQuery:function(e){},onResults:function(e){},onResultsOpen:function(){},onResultsClose:function(){},className:{animating:"animating",active:"active",empty:"empty",focus:"focus",hidden:"hidden",loading:"loading",results:"results",pressed:"down"},error:{source:"Cannot search. No source used, and Semantic API module was not included",noResults:"Your search returned no results",logging:"Error in debug logging, exiting.",noEndpoint:"No search endpoint was specified",noTemplate:"A valid template name was not specified.",serverError:"There was an issue querying the server.",maxResults:"Results must be an array to use maxResults setting",method:"The method you called is not defined."},metadata:{cache:"cache",results:"results",result:"result"},regExp:{escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,beginsWith:"(?:s|^)"},fields:{categories:"results",categoryName:"name",categoryResults:"results",description:"description",image:"image",price:"price",results:"results",title:"title",url:"url",action:"action",actionText:"text",actionURL:"url"},selector:{prompt:".prompt",searchButton:".search.button",results:".results",message:".results > .message",category:".category",result:".result",title:".title, .name"},templates:{escape:function(e){var t=/[&<>"'`]/g,s={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};return/[&<>"'`]/.test(e)?e.replace(t,function(e){return s[e]}):e},message:function(e,t){var s="";return void 0!==e&&void 0!==t&&(s+='<div class="message '+t+'">',s+="empty"==t?'<div class="header">No Results</div class="header"><div class="description">'+e+'</div class="description">':' <div class="description">'+e+"</div>",s+="</div>"),s},category:function(t,s){var n="";e.fn.search.settings.templates.escape;return void 0!==t[s.categoryResults]&&(e.each(t[s.categoryResults],function(t,i){void 0!==i[s.results]&&i.results.length>0&&(n+='<div class="category">',void 0!==i[s.categoryName]&&(n+='<div class="name">'+i[s.categoryName]+"</div>"),e.each(i.results,function(e,t){t[s.url]?n+='<a class="result" href="'+t[s.url]+'">':n+='<a class="result">',void 0!==t[s.image]&&(n+='<div class="image"> <img src="'+t[s.image]+'"></div>'),n+='<div class="content">',void 0!==t[s.price]&&(n+='<div class="price">'+t[s.price]+"</div>"),void 0!==t[s.title]&&(n+='<div class="title">'+t[s.title]+"</div>"),void 0!==t[s.description]&&(n+='<div class="description">'+t[s.description]+"</div>"),n+="</div>",n+="</a>"}),n+="</div>")}),t[s.action]&&(n+='<a href="'+t[s.action][s.actionURL]+'" class="action">'+t[s.action][s.actionText]+"</a>"),n)},standard:function(t,s){var n="";return void 0!==t[s.results]&&(e.each(t[s.results],function(e,t){t[s.url]?n+='<a class="result" href="'+t[s.url]+'">':n+='<a class="result">',void 0!==t[s.image]&&(n+='<div class="image"> <img src="'+t[s.image]+'"></div>'),n+='<div class="content">',void 0!==t[s.price]&&(n+='<div class="price">'+t[s.price]+"</div>"),void 0!==t[s.title]&&(n+='<div class="title">'+t[s.title]+"</div>"),void 0!==t[s.description]&&(n+='<div class="description">'+t[s.description]+"</div>"),n+="</div>",n+="</a>"}),t[s.action]&&(n+='<a href="'+t[s.action][s.actionURL]+'" class="action">'+t[s.action][s.actionText]+"</a>"),n)}}}}(jQuery,window,document);