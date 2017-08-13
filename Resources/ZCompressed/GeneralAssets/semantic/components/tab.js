!function(e,t,a,n){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.tab=function(n){var i,o=e(e.isFunction(this)?t:this),r=o.selector||"",s=(new Date).getTime(),c=[],l=arguments[0],d="string"==typeof l,u=[].slice.call(arguments,1),b=!1;return o.each(function(){var g,f,h,p,v,m,y=e.isPlainObject(n)?e.extend(!0,{},e.fn.tab.settings,n):e.extend({},e.fn.tab.settings),T=y.className,L=y.metadata,x=y.selector,A=y.error,P="."+y.namespace,C="module-"+y.namespace,F=e(this),S={},j=!0,E=0,O=this,w=F.data(C);v={initialize:function(){v.debug("Initializing tab menu item",F),v.fix.callbacks(),v.determineTabs(),v.debug("Determining tabs",y.context,f),y.auto&&v.set.auto(),v.bind.events(),y.history&&!b&&(v.initializeHistory(),b=!0),v.instantiate()},instantiate:function(){v.verbose("Storing instance of module",v),w=v,F.data(C,v)},destroy:function(){v.debug("Destroying tabs",F),F.removeData(C).off(P)},bind:{events:function(){e.isWindow(O)||(v.debug("Attaching tab activation events to element",F),F.on("click"+P,v.event.click))}},determineTabs:function(){var t;"parent"===y.context?(F.closest(x.ui).length>0?(t=F.closest(x.ui),v.verbose("Using closest UI element as parent",t)):t=F,g=t.parent(),v.verbose("Determined parent element for creating context",g)):y.context?(g=e(y.context),v.verbose("Using selector for tab context",y.context,g)):g=e("body"),y.childrenOnly?(f=g.children(x.tabs),v.debug("Searching tab context children for tabs",g,f)):(f=g.find(x.tabs),v.debug("Searching tab context for tabs",g,f))},fix:{callbacks:function(){e.isPlainObject(n)&&(n.onTabLoad||n.onTabInit)&&(n.onTabLoad&&(n.onLoad=n.onTabLoad,delete n.onTabLoad,v.error(A.legacyLoad,n.onLoad)),n.onTabInit&&(n.onFirstLoad=n.onTabInit,delete n.onTabInit,v.error(A.legacyInit,n.onFirstLoad)),y=e.extend(!0,{},e.fn.tab.settings,n))}},initializeHistory:function(){if(v.debug("Initializing page state"),void 0===e.address)return v.error(A.state),!1;if("state"==y.historyType){if(v.debug("Using HTML5 to manage state"),!1===y.path)return v.error(A.path),!1;e.address.history(!0).state(y.path)}e.address.bind("change",v.event.history.change)},event:{click:function(t){var a=e(this).data(L.tab);void 0!==a?(y.history?(v.verbose("Updating page state",t),e.address.value(a)):(v.verbose("Changing tab",t),v.changeTab(a)),t.preventDefault()):v.debug("No tab specified")},history:{change:function(t){var a=t.pathNames.join("/")||v.get.initialPath(),n=y.templates.determineTitle(a)||!1;v.performance.display(),v.debug("History change event",a,t),m=t,void 0!==a&&v.changeTab(a),n&&e.address.title(n)}}},refresh:function(){h&&(v.debug("Refreshing tab",h),v.changeTab(h))},cache:{read:function(e){return void 0!==e&&S[e]},add:function(e,t){e=e||h,v.debug("Adding cached content for",e),S[e]=t},remove:function(e){e=e||h,v.debug("Removing cached content for",e),delete S[e]}},set:{auto:function(){var t="string"==typeof y.path?y.path.replace(/\/$/,"")+"/{$tab}":"/{$tab}";v.verbose("Setting up automatic tab retrieval from server",t),e.isPlainObject(y.apiSettings)?y.apiSettings.url=t:y.apiSettings={url:t}},loading:function(e){var t=v.get.tabElement(e);t.hasClass(T.loading)||(v.verbose("Setting loading state for",t),t.addClass(T.loading).siblings(f).removeClass(T.active+" "+T.loading),t.length>0&&y.onRequest.call(t[0],e))},state:function(t){e.address.value(t)}},changeTab:function(a){var n=t.history&&t.history.pushState&&y.ignoreFirstLoad&&j,i=y.auto||e.isPlainObject(y.apiSettings),o=i&&!n?v.utilities.pathToArray(a):v.get.defaultPathArray(a);a=v.utilities.arrayToPath(o),e.each(o,function(t,r){var s,c,l,d,u=o.slice(0,t+1),b=v.utilities.arrayToPath(u),f=v.is.tab(b),x=t+1==o.length,P=v.get.tabElement(b);if(v.verbose("Looking for tab",r),f){if(v.verbose("Tab was found",r),h=b,p=v.utilities.filterArray(o,u),x?d=!0:(c=o.slice(0,t+2),l=v.utilities.arrayToPath(c),(d=!v.is.tab(l))&&v.verbose("Tab parameters found",c)),d&&i)return n?(v.debug("Ignoring remote content on first tab load",b),j=!1,v.cache.add(a,P.html()),v.activate.all(b),y.onFirstLoad.call(P[0],b,p,m),y.onLoad.call(P[0],b,p,m)):(v.activate.navigation(b),v.fetch.content(b,a)),!1;v.debug("Opened local tab",b),v.activate.all(b),v.cache.read(b)||(v.cache.add(b,!0),v.debug("First time tab loaded calling tab init"),y.onFirstLoad.call(P[0],b,p,m)),y.onLoad.call(P[0],b,p,m)}else{if(-1!=a.search("/")||""===a)return v.error(A.missingTab,F,g,b),!1;if(s=e("#"+a+', a[name="'+a+'"]'),b=s.closest("[data-tab]").data(L.tab),P=v.get.tabElement(b),s&&s.length>0&&b)return v.debug("Anchor link used, opening parent tab",P,s),P.hasClass(T.active)||setTimeout(function(){v.scrollTo(s)},0),v.activate.all(b),v.cache.read(b)||(v.cache.add(b,!0),v.debug("First time tab loaded calling tab init"),y.onFirstLoad.call(P[0],b,p,m)),y.onLoad.call(P[0],b,p,m),!1}})},scrollTo:function(t){var n=!!(t&&t.length>0)&&t.offset().top;!1!==n&&(v.debug("Forcing scroll to an in-page link in a hidden tab",n,t),e(a).scrollTop(n))},update:{content:function(t,a,n){var i=v.get.tabElement(t),o=i[0];n=void 0!==n?n:y.evaluateScripts,"string"==typeof y.cacheType&&"dom"==y.cacheType.toLowerCase()&&"string"!=typeof a?i.empty().append(e(a).clone(!0)):n?(v.debug("Updating HTML and evaluating inline scripts",t,a),i.html(a)):(v.debug("Updating HTML",t,a),o.innerHTML=a)}},fetch:{content:function(t,a){var n,i,o=v.get.tabElement(t),r={dataType:"html",encodeParameters:!1,on:"now",cache:y.alwaysRefresh,headers:{"X-Remote":!0},onSuccess:function(e){"response"==y.cacheType&&v.cache.add(a,e),v.update.content(t,e),t==h?(v.debug("Content loaded",t),v.activate.tab(t)):v.debug("Content loaded in background",t),y.onFirstLoad.call(o[0],t,p,m),y.onLoad.call(o[0],t,p,m),y.loadOnce?v.cache.add(a,!0):"string"==typeof y.cacheType&&"dom"==y.cacheType.toLowerCase()&&o.children().length>0?setTimeout(function(){var e=o.children().clone(!0);e=e.not("script"),v.cache.add(a,e)},0):v.cache.add(a,o.html())},urlData:{tab:a}},s=o.api("get request")||!1,c=s&&"pending"===s.state();a=a||t,i=v.cache.read(a),y.cache&&i?(v.activate.tab(t),v.debug("Adding cached content",a),y.loadOnce||("once"==y.evaluateScripts?v.update.content(t,i,!1):v.update.content(t,i)),y.onLoad.call(o[0],t,p,m)):c?(v.set.loading(t),v.debug("Content is already loading",a)):void 0!==e.api?(n=e.extend(!0,{},y.apiSettings,r),v.debug("Retrieving remote content",a,n),v.set.loading(t),o.api(n)):v.error(A.api)}},activate:{all:function(e){v.activate.tab(e),v.activate.navigation(e)},tab:function(e){var t=v.get.tabElement(e),a="siblings"==y.deactivate?t.siblings(f):f.not(t),n=t.hasClass(T.active);v.verbose("Showing tab content for",t),n||(t.addClass(T.active),a.removeClass(T.active+" "+T.loading),t.length>0&&y.onVisible.call(t[0],e))},navigation:function(e){var t=v.get.navElement(e),a="siblings"==y.deactivate?t.siblings(o):o.not(t),n=t.hasClass(T.active);v.verbose("Activating tab navigation for",t,e),n||(t.addClass(T.active),a.removeClass(T.active+" "+T.loading))}},deactivate:{all:function(){v.deactivate.navigation(),v.deactivate.tabs()},navigation:function(){o.removeClass(T.active)},tabs:function(){f.removeClass(T.active+" "+T.loading)}},is:{tab:function(e){return void 0!==e&&v.get.tabElement(e).length>0}},get:{initialPath:function(){return o.eq(0).data(L.tab)||f.eq(0).data(L.tab)},path:function(){return e.address.value()},defaultPathArray:function(e){return v.utilities.pathToArray(v.get.defaultPath(e))},defaultPath:function(e){var t=o.filter("[data-"+L.tab+'^="'+e+'/"]').eq(0).data(L.tab)||!1;if(t){if(v.debug("Found default tab",t),E<y.maxDepth)return E++,v.get.defaultPath(t);v.error(A.recursion)}else v.debug("No default tabs found for",e,f);return E=0,e},navElement:function(e){return e=e||h,o.filter("[data-"+L.tab+'="'+e+'"]')},tabElement:function(e){var t,a,n,i;return e=e||h,n=v.utilities.pathToArray(e),i=v.utilities.last(n),t=f.filter("[data-"+L.tab+'="'+e+'"]'),a=f.filter("[data-"+L.tab+'="'+i+'"]'),t.length>0?t:a},tab:function(){return h}},utilities:{filterArray:function(t,a){return e.grep(t,function(t){return-1==e.inArray(t,a)})},last:function(t){return!!e.isArray(t)&&t[t.length-1]},pathToArray:function(e){return void 0===e&&(e=h),"string"==typeof e?e.split("/"):[e]},arrayToPath:function(t){return!!e.isArray(t)&&t.join("/")}},setting:function(t,a){if(v.debug("Changing setting",t,a),e.isPlainObject(t))e.extend(!0,y,t);else{if(void 0===a)return y[t];e.isPlainObject(y[t])?e.extend(!0,y[t],a):y[t]=a}},internal:function(t,a){if(e.isPlainObject(t))e.extend(!0,v,t);else{if(void 0===a)return v[t];v[t]=a}},debug:function(){!y.silent&&y.debug&&(y.performance?v.performance.log(arguments):(v.debug=Function.prototype.bind.call(console.info,console,y.name+":"),v.debug.apply(console,arguments)))},verbose:function(){!y.silent&&y.verbose&&y.debug&&(y.performance?v.performance.log(arguments):(v.verbose=Function.prototype.bind.call(console.info,console,y.name+":"),v.verbose.apply(console,arguments)))},error:function(){y.silent||(v.error=Function.prototype.bind.call(console.error,console,y.name+":"),v.error.apply(console,arguments))},performance:{log:function(e){var t,a;y.performance&&(a=(t=(new Date).getTime())-(s||t),s=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:O,"Execution Time":a})),clearTimeout(v.performance.timer),v.performance.timer=setTimeout(v.performance.display,500)},display:function(){var t=y.name+":",a=0;s=!1,clearTimeout(v.performance.timer),e.each(c,function(e,t){a+=t["Execution Time"]}),t+=" "+a+"ms",r&&(t+=" '"+r+"'"),(void 0!==console.group||void 0!==console.table)&&c.length>0&&(console.groupCollapsed(t),console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,a,n){var o,r,s,c=w;return a=a||u,n=O||n,"string"==typeof t&&void 0!==c&&(t=t.split(/[\. ]/),o=t.length-1,e.each(t,function(a,n){var i=a!=o?n+t[a+1].charAt(0).toUpperCase()+t[a+1].slice(1):t;if(e.isPlainObject(c[i])&&a!=o)c=c[i];else{if(void 0!==c[i])return r=c[i],!1;if(!e.isPlainObject(c[n])||a==o)return void 0!==c[n]?(r=c[n],!1):(v.error(A.method,t),!1);c=c[n]}})),e.isFunction(r)?s=r.apply(n,a):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}},d?(void 0===w&&v.initialize(),v.invoke(l)):(void 0!==w&&w.invoke("destroy"),v.initialize())}),void 0!==i?i:this},e.tab=function(){e(t).tab.apply(this,arguments)},e.fn.tab.settings={name:"Tab",namespace:"tab",silent:!1,debug:!1,verbose:!1,performance:!0,auto:!1,history:!1,historyType:"hash",path:!1,context:!1,childrenOnly:!1,maxDepth:25,deactivate:"siblings",alwaysRefresh:!1,cache:!0,loadOnce:!1,cacheType:"response",ignoreFirstLoad:!1,apiSettings:!1,evaluateScripts:"once",onFirstLoad:function(e,t,a){},onLoad:function(e,t,a){},onVisible:function(e,t,a){},onRequest:function(e,t,a){},templates:{determineTitle:function(e){}},error:{api:"You attempted to load content without API module",method:"The method you called is not defined",missingTab:"Activated tab cannot be found. Tabs are case-sensitive.",noContent:"The tab you specified is missing a content url.",path:"History enabled, but no path was specified",recursion:"Max recursive depth reached",legacyInit:"onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.",legacyLoad:"onTabLoad has been renamed to onLoad in 2.0. Please adjust your code",state:"History requires Asual's Address library <https://github.com/asual/jquery-address>"},metadata:{tab:"tab",loaded:"loaded",promise:"promise"},className:{loading:"loading",active:"active"},selector:{tabs:".ui.tab",ui:".ui"}}}(jQuery,window,document);