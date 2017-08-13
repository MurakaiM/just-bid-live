!function(e,o,n,t){"use strict";o=void 0!==o&&o.Math==Math?o:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.embed=function(n){var t,r=e(this),a=r.selector||"",i=(new Date).getTime(),c=[],l=arguments[0],d="string"==typeof l,u=[].slice.call(arguments,1);return r.each(function(){var s,m=e.isPlainObject(n)?e.extend(!0,{},e.fn.embed.settings,n):e.extend({},e.fn.embed.settings),p=m.selector,f=m.className,h=m.sources,b=m.error,v=m.metadata,g=m.namespace,y=m.templates,w="."+g,P="module-"+g,C=(e(o),e(this)),E=C.find(p.placeholder),U=C.find(p.icon),j=C.find(p.embed),S=this,T=C.data(P);s={initialize:function(){s.debug("Initializing embed"),s.determine.autoplay(),s.create(),s.bind.events(),s.instantiate()},instantiate:function(){s.verbose("Storing instance of module",s),T=s,C.data(P,s)},destroy:function(){s.verbose("Destroying previous instance of embed"),s.reset(),C.removeData(P).off(w)},refresh:function(){s.verbose("Refreshing selector cache"),E=C.find(p.placeholder),U=C.find(p.icon),j=C.find(p.embed)},bind:{events:function(){s.has.placeholder()&&(s.debug("Adding placeholder events"),C.on("click"+w,p.placeholder,s.createAndShow).on("click"+w,p.icon,s.createAndShow))}},create:function(){s.get.placeholder()?s.createPlaceholder():s.createAndShow()},createPlaceholder:function(e){var o=s.get.icon(),n=s.get.url();s.generate.embed(n);e=e||s.get.placeholder(),C.html(y.placeholder(e,o)),s.debug("Creating placeholder for embed",e,o)},createEmbed:function(o){s.refresh(),o=o||s.get.url(),j=e("<div/>").addClass(f.embed).html(s.generate.embed(o)).appendTo(C),m.onCreate.call(S,o),s.debug("Creating embed object",j)},changeEmbed:function(e){j.html(s.generate.embed(e))},createAndShow:function(){s.createEmbed(),s.show()},change:function(e,o,n){s.debug("Changing video to ",e,o,n),C.data(v.source,e).data(v.id,o),n?C.data(v.url,n):C.removeData(v.url),s.has.embed()?s.changeEmbed():s.create()},reset:function(){s.debug("Clearing embed and showing placeholder"),s.remove.active(),s.remove.embed(),s.showPlaceholder(),m.onReset.call(S)},show:function(){s.debug("Showing embed"),s.set.active(),m.onDisplay.call(S)},hide:function(){s.debug("Hiding embed"),s.showPlaceholder()},showPlaceholder:function(){s.debug("Showing placeholder image"),s.remove.active(),m.onPlaceholderDisplay.call(S)},get:{id:function(){return m.id||C.data(v.id)},placeholder:function(){return m.placeholder||C.data(v.placeholder)},icon:function(){return m.icon?m.icon:void 0!==C.data(v.icon)?C.data(v.icon):s.determine.icon()},source:function(e){return m.source?m.source:void 0!==C.data(v.source)?C.data(v.source):s.determine.source()},type:function(){var e=s.get.source();return void 0!==h[e]&&h[e].type},url:function(){return m.url?m.url:void 0!==C.data(v.url)?C.data(v.url):s.determine.url()}},determine:{autoplay:function(){s.should.autoplay()&&(m.autoplay=!0)},source:function(o){var n=!1;return(o=o||s.get.url())&&e.each(h,function(e,t){if(-1!==o.search(t.domain))return n=e,!1}),n},icon:function(){var e=s.get.source();return void 0!==h[e]&&h[e].icon},url:function(){var e,o=m.id||C.data(v.id),n=m.source||C.data(v.source);return(e=void 0!==h[n]&&h[n].url.replace("{id}",o))&&C.data(v.url,e),e}},set:{active:function(){C.addClass(f.active)}},remove:{active:function(){C.removeClass(f.active)},embed:function(){j.empty()}},encode:{parameters:function(e){var o,n=[];for(o in e)n.push(encodeURIComponent(o)+"="+encodeURIComponent(e[o]));return n.join("&amp;")}},generate:{embed:function(e){s.debug("Generating embed html");var o,n,t=s.get.source();return(e=s.get.url(e))?(n=s.generate.parameters(t),o=y.iframe(e,n)):s.error(b.noURL,C),o},parameters:function(o,n){var t=h[o]&&void 0!==h[o].parameters?h[o].parameters(m):{};return(n=n||m.parameters)&&(t=e.extend({},t,n)),t=m.onEmbed(t),s.encode.parameters(t)}},has:{embed:function(){return j.length>0},placeholder:function(){return m.placeholder||C.data(v.placeholder)}},should:{autoplay:function(){return"auto"===m.autoplay?m.placeholder||void 0!==C.data(v.placeholder):m.autoplay}},is:{video:function(){return"video"==s.get.type()}},setting:function(o,n){if(s.debug("Changing setting",o,n),e.isPlainObject(o))e.extend(!0,m,o);else{if(void 0===n)return m[o];e.isPlainObject(m[o])?e.extend(!0,m[o],n):m[o]=n}},internal:function(o,n){if(e.isPlainObject(o))e.extend(!0,s,o);else{if(void 0===n)return s[o];s[o]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?s.performance.log(arguments):(s.debug=Function.prototype.bind.call(console.info,console,m.name+":"),s.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?s.performance.log(arguments):(s.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),s.verbose.apply(console,arguments)))},error:function(){m.silent||(s.error=Function.prototype.bind.call(console.error,console,m.name+":"),s.error.apply(console,arguments))},performance:{log:function(e){var o,n;m.performance&&(n=(o=(new Date).getTime())-(i||o),i=o,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:S,"Execution Time":n})),clearTimeout(s.performance.timer),s.performance.timer=setTimeout(s.performance.display,500)},display:function(){var o=m.name+":",n=0;i=!1,clearTimeout(s.performance.timer),e.each(c,function(e,o){n+=o["Execution Time"]}),o+=" "+n+"ms",a&&(o+=" '"+a+"'"),r.length>1&&(o+=" ("+r.length+")"),(void 0!==console.group||void 0!==console.table)&&c.length>0&&(console.groupCollapsed(o),console.table?console.table(c):e.each(c,function(e,o){console.log(o.Name+": "+o["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(o,n,r){var a,i,c,l=T;return n=n||u,r=S||r,"string"==typeof o&&void 0!==l&&(o=o.split(/[\. ]/),a=o.length-1,e.each(o,function(n,t){var r=n!=a?t+o[n+1].charAt(0).toUpperCase()+o[n+1].slice(1):o;if(e.isPlainObject(l[r])&&n!=a)l=l[r];else{if(void 0!==l[r])return i=l[r],!1;if(!e.isPlainObject(l[t])||n==a)return void 0!==l[t]?(i=l[t],!1):(s.error(b.method,o),!1);l=l[t]}})),e.isFunction(i)?c=i.apply(r,n):void 0!==i&&(c=i),e.isArray(t)?t.push(c):void 0!==t?t=[t,c]:void 0!==c&&(t=c),i}},d?(void 0===T&&s.initialize(),s.invoke(l)):(void 0!==T&&T.invoke("destroy"),s.initialize())}),void 0!==t?t:this},e.fn.embed.settings={name:"Embed",namespace:"embed",silent:!1,debug:!1,verbose:!1,performance:!0,icon:!1,source:!1,url:!1,id:!1,autoplay:"auto",color:"#444444",hd:!0,brandedUI:!1,parameters:!1,onDisplay:function(){},onPlaceholderDisplay:function(){},onReset:function(){},onCreate:function(e){},onEmbed:function(e){return e},metadata:{id:"id",icon:"icon",placeholder:"placeholder",source:"source",url:"url"},error:{noURL:"No URL specified",method:"The method you called is not defined"},className:{active:"active",embed:"embed"},selector:{embed:".embed",placeholder:".placeholder",icon:".icon"},sources:{youtube:{name:"youtube",type:"video",icon:"video play",domain:"youtube.com",url:"//www.youtube.com/embed/{id}",parameters:function(e){return{autohide:!e.brandedUI,autoplay:e.autoplay,color:e.color||void 0,hq:e.hd,jsapi:e.api,modestbranding:!e.brandedUI}}},vimeo:{name:"vimeo",type:"video",icon:"video play",domain:"vimeo.com",url:"//player.vimeo.com/video/{id}",parameters:function(e){return{api:e.api,autoplay:e.autoplay,byline:e.brandedUI,color:e.color||void 0,portrait:e.brandedUI,title:e.brandedUI}}}},templates:{iframe:function(e,o){var n=e;return o&&(n+="?"+o),'<iframe src="'+n+'" width="100%" height="100%" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'},placeholder:function(e,o){var n="";return o&&(n+='<i class="'+o+' icon"></i>'),e&&(n+='<img class="placeholder" src="'+e+'">'),n}},api:!1,onPause:function(){},onPlay:function(){},onStop:function(){}}}(jQuery,window,document);