!function(n,i,e,t){"use strict";i=void 0!==i&&i.Math==Math?i:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),n.fn.transition=function(){var t,a=n(this),o=a.selector||"",r=(new Date).getTime(),s=[],l=arguments,d=l[0],u=[].slice.call(arguments,1),c="string"==typeof d;i.requestAnimationFrame||i.mozRequestAnimationFrame||i.webkitRequestAnimationFrame||i.msRequestAnimationFrame;return a.each(function(i){var m,f,p,g,v,b,y,h,w,C=n(this),A=this;(w={initialize:function(){m=w.get.settings.apply(A,l),g=m.className,p=m.error,v=m.metadata,h="."+m.namespace,y="module-"+m.namespace,f=C.data(y)||w,b=w.get.animationEndEvent(),c&&(c=w.invoke(d)),!1===c&&(w.verbose("Converted arguments into settings object",m),m.interval?w.delay(m.animate):w.animate(),w.instantiate())},instantiate:function(){w.verbose("Storing instance of module",w),f=w,C.data(y,f)},destroy:function(){w.verbose("Destroying previous module for",A),C.removeData(y)},refresh:function(){w.verbose("Refreshing display type on next animation"),delete w.displayType},forceRepaint:function(){w.verbose("Forcing element repaint");var n=C.parent(),i=C.next();0===i.length?C.detach().appendTo(n):C.detach().insertBefore(i)},repaint:function(){w.verbose("Repainting element");A.offsetWidth},delay:function(n){var e,t=w.get.animationDirection();t||(t=w.can.transition()?w.get.direction():"static"),n=void 0!==n?n:m.interval,e="auto"==m.reverse&&t==g.outward||1==m.reverse?(a.length-i)*m.interval:i*m.interval,w.debug("Delaying animation by",e),setTimeout(w.animate,e)},animate:function(n){if(m=n||m,!w.is.supported())return w.error(p.support),!1;if(w.debug("Preparing animation",m.animation),w.is.animating()){if(m.queue)return!m.allowRepeats&&w.has.direction()&&w.is.occurring()&&!0!==w.queuing?w.debug("Animation is currently occurring, preventing queueing same animation",m.animation):w.queue(m.animation),!1;if(!m.allowRepeats&&w.is.occurring())return w.debug("Animation is already occurring, will not execute repeated animation",m.animation),!1;w.debug("New animation started, completing previous early",m.animation),f.complete()}w.can.animate()?w.set.animating(m.animation):w.error(p.noAnimation,m.animation,A)},reset:function(){w.debug("Resetting animation to beginning conditions"),w.remove.animationCallbacks(),w.restore.conditions(),w.remove.animating()},queue:function(n){w.debug("Queueing animation of",n),w.queuing=!0,C.one(b+".queue"+h,function(){w.queuing=!1,w.repaint(),w.animate.apply(this,m)})},complete:function(n){w.debug("Animation complete",m.animation),w.remove.completeCallback(),w.remove.failSafe(),w.is.looping()||(w.is.outward()?(w.verbose("Animation is outward, hiding element"),w.restore.conditions(),w.hide()):w.is.inward()?(w.verbose("Animation is outward, showing element"),w.restore.conditions(),w.show()):(w.verbose("Static animation completed"),w.restore.conditions(),m.onComplete.call(A)))},force:{visible:function(){var n=C.attr("style"),i=w.get.userStyle(),e=w.get.displayType(),t=i+"display: "+e+" !important;",a=C.css("display"),o=void 0===n||""===n;a!==e?(w.verbose("Overriding default display to show element",e),C.attr("style",t)):o&&C.removeAttr("style")},hidden:function(){var n=C.attr("style"),i=C.css("display"),e=void 0===n||""===n;"none"===i||w.is.hidden()?e&&C.removeAttr("style"):(w.verbose("Overriding default display to hide element"),C.css("display","none"))}},has:{direction:function(i){var e=!1;return"string"==typeof(i=i||m.animation)&&(i=i.split(" "),n.each(i,function(n,i){i!==g.inward&&i!==g.outward||(e=!0)})),e},inlineDisplay:function(){var i=C.attr("style")||"";return n.isArray(i.match(/display.*?;/,""))}},set:{animating:function(n){var i;w.remove.completeCallback(),n=n||m.animation,i=w.get.animationClass(n),w.save.animation(i),w.force.visible(),w.remove.hidden(),w.remove.direction(),w.start.animation(i)},duration:function(n,i){((i="number"==typeof(i=i||m.duration)?i+"ms":i)||0===i)&&(w.verbose("Setting animation duration",i),C.css({"animation-duration":i}))},direction:function(n){(n=n||w.get.direction())==g.inward?w.set.inward():w.set.outward()},looping:function(){w.debug("Transition set to loop"),C.addClass(g.looping)},hidden:function(){C.addClass(g.transition).addClass(g.hidden)},inward:function(){w.debug("Setting direction to inward"),C.removeClass(g.outward).addClass(g.inward)},outward:function(){w.debug("Setting direction to outward"),C.removeClass(g.inward).addClass(g.outward)},visible:function(){C.addClass(g.transition).addClass(g.visible)}},start:{animation:function(n){n=n||w.get.animationClass(),w.debug("Starting tween",n),C.addClass(n).one(b+".complete"+h,w.complete),m.useFailSafe&&w.add.failSafe(),w.set.duration(m.duration),m.onStart.call(A)}},save:{animation:function(n){w.cache||(w.cache={}),w.cache.animation=n},displayType:function(n){"none"!==n&&C.data(v.displayType,n)},transitionExists:function(i,e){n.fn.transition.exists[i]=e,w.verbose("Saving existence of transition",i,e)}},restore:{conditions:function(){var n=w.get.currentAnimation();n&&(C.removeClass(n),w.verbose("Removing animation class",w.cache)),w.remove.duration()}},add:{failSafe:function(){var n=w.get.duration();w.timer=setTimeout(function(){C.triggerHandler(b)},n+m.failSafeDelay),w.verbose("Adding fail safe timer",w.timer)}},remove:{animating:function(){C.removeClass(g.animating)},animationCallbacks:function(){w.remove.queueCallback(),w.remove.completeCallback()},queueCallback:function(){C.off(".queue"+h)},completeCallback:function(){C.off(".complete"+h)},display:function(){C.css("display","")},direction:function(){C.removeClass(g.inward).removeClass(g.outward)},duration:function(){C.css("animation-duration","")},failSafe:function(){w.verbose("Removing fail safe timer",w.timer),w.timer&&clearTimeout(w.timer)},hidden:function(){C.removeClass(g.hidden)},visible:function(){C.removeClass(g.visible)},looping:function(){w.debug("Transitions are no longer looping"),w.is.looping()&&(w.reset(),C.removeClass(g.looping))},transition:function(){C.removeClass(g.visible).removeClass(g.hidden)}},get:{settings:function(i,e,t){return"object"==typeof i?n.extend(!0,{},n.fn.transition.settings,i):"function"==typeof t?n.extend({},n.fn.transition.settings,{animation:i,onComplete:t,duration:e}):"string"==typeof e||"number"==typeof e?n.extend({},n.fn.transition.settings,{animation:i,duration:e}):"object"==typeof e?n.extend({},n.fn.transition.settings,e,{animation:i}):"function"==typeof e?n.extend({},n.fn.transition.settings,{animation:i,onComplete:e}):n.extend({},n.fn.transition.settings,{animation:i})},animationClass:function(n){var i=n||m.animation,e=w.can.transition()&&!w.has.direction()?w.get.direction()+" ":"";return g.animating+" "+g.transition+" "+e+i},currentAnimation:function(){return!(!w.cache||void 0===w.cache.animation)&&w.cache.animation},currentDirection:function(){return w.is.inward()?g.inward:g.outward},direction:function(){return w.is.hidden()||!w.is.visible()?g.inward:g.outward},animationDirection:function(i){var e;return"string"==typeof(i=i||m.animation)&&(i=i.split(" "),n.each(i,function(n,i){i===g.inward?e=g.inward:i===g.outward&&(e=g.outward)})),e||!1},duration:function(n){return!1===(n=n||m.duration)&&(n=C.css("animation-duration")||0),"string"==typeof n?n.indexOf("ms")>-1?parseFloat(n):1e3*parseFloat(n):n},displayType:function(n){return n=void 0===n||n,m.displayType?m.displayType:(n&&void 0===C.data(v.displayType)&&w.can.transition(!0),C.data(v.displayType))},userStyle:function(n){return(n=n||C.attr("style")||"").replace(/display.*?;/,"")},transitionExists:function(i){return n.fn.transition.exists[i]},animationStartEvent:function(){var n,i=e.createElement("div"),t={animation:"animationstart",OAnimation:"oAnimationStart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"};for(n in t)if(void 0!==i.style[n])return t[n];return!1},animationEndEvent:function(){var n,i=e.createElement("div"),t={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(n in t)if(void 0!==i.style[n])return t[n];return!1}},can:{transition:function(i){var e,t,a,o,r,s,l=m.animation,d=w.get.transitionExists(l),u=w.get.displayType(!1);if(void 0===d||i){if(w.verbose("Determining whether animation exists"),e=C.attr("class"),t=C.prop("tagName"),a=n("<"+t+" />").addClass(e).insertAfter(C),o=a.addClass(l).removeClass(g.inward).removeClass(g.outward).addClass(g.animating).addClass(g.transition).css("animationName"),r=a.addClass(g.inward).css("animationName"),u||(u=a.attr("class",e).removeAttr("style").removeClass(g.hidden).removeClass(g.visible).show().css("display"),w.verbose("Determining final display state",u),w.save.displayType(u)),a.remove(),o!=r)w.debug("Direction exists for animation",l),s=!0;else{if("none"==o||!o)return void w.debug("No animation defined in css",l);w.debug("Static animation found",l,u),s=!1}w.save.transitionExists(l,s)}return void 0!==d?d:s},animate:function(){return void 0!==w.can.transition()}},is:{animating:function(){return C.hasClass(g.animating)},inward:function(){return C.hasClass(g.inward)},outward:function(){return C.hasClass(g.outward)},looping:function(){return C.hasClass(g.looping)},occurring:function(n){return n=n||m.animation,n="."+n.replace(" ","."),C.filter(n).length>0},visible:function(){return C.is(":visible")},hidden:function(){return"hidden"===C.css("visibility")},supported:function(){return!1!==b}},hide:function(){w.verbose("Hiding element"),w.is.animating()&&w.reset(),A.blur(),w.remove.display(),w.remove.visible(),w.set.hidden(),w.force.hidden(),m.onHide.call(A),m.onComplete.call(A)},show:function(n){w.verbose("Showing element",n),w.remove.hidden(),w.set.visible(),w.force.visible(),m.onShow.call(A),m.onComplete.call(A)},toggle:function(){w.is.visible()?w.hide():w.show()},stop:function(){w.debug("Stopping current animation"),C.triggerHandler(b)},stopAll:function(){w.debug("Stopping all animation"),w.remove.queueCallback(),C.triggerHandler(b)},clear:{queue:function(){w.debug("Clearing animation queue"),w.remove.queueCallback()}},enable:function(){w.verbose("Starting animation"),C.removeClass(g.disabled)},disable:function(){w.debug("Stopping animation"),C.addClass(g.disabled)},setting:function(i,e){if(w.debug("Changing setting",i,e),n.isPlainObject(i))n.extend(!0,m,i);else{if(void 0===e)return m[i];n.isPlainObject(m[i])?n.extend(!0,m[i],e):m[i]=e}},internal:function(i,e){if(n.isPlainObject(i))n.extend(!0,w,i);else{if(void 0===e)return w[i];w[i]=e}},debug:function(){!m.silent&&m.debug&&(m.performance?w.performance.log(arguments):(w.debug=Function.prototype.bind.call(console.info,console,m.name+":"),w.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?w.performance.log(arguments):(w.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),w.verbose.apply(console,arguments)))},error:function(){m.silent||(w.error=Function.prototype.bind.call(console.error,console,m.name+":"),w.error.apply(console,arguments))},performance:{log:function(n){var i,e;m.performance&&(e=(i=(new Date).getTime())-(r||i),r=i,s.push({Name:n[0],Arguments:[].slice.call(n,1)||"",Element:A,"Execution Time":e})),clearTimeout(w.performance.timer),w.performance.timer=setTimeout(w.performance.display,500)},display:function(){var i=m.name+":",e=0;r=!1,clearTimeout(w.performance.timer),n.each(s,function(n,i){e+=i["Execution Time"]}),i+=" "+e+"ms",o&&(i+=" '"+o+"'"),a.length>1&&(i+=" ("+a.length+")"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(i),console.table?console.table(s):n.each(s,function(n,i){console.log(i.Name+": "+i["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(i,e,a){var o,r,s,l=f;return e=e||u,a=A||a,"string"==typeof i&&void 0!==l&&(i=i.split(/[\. ]/),o=i.length-1,n.each(i,function(e,t){var a=e!=o?t+i[e+1].charAt(0).toUpperCase()+i[e+1].slice(1):i;if(n.isPlainObject(l[a])&&e!=o)l=l[a];else{if(void 0!==l[a])return r=l[a],!1;if(!n.isPlainObject(l[t])||e==o)return void 0!==l[t]&&(r=l[t],!1);l=l[t]}})),n.isFunction(r)?s=r.apply(a,e):void 0!==r&&(s=r),n.isArray(t)?t.push(s):void 0!==t?t=[t,s]:void 0!==s&&(t=s),void 0!==r&&r}}).initialize()}),void 0!==t?t:this},n.fn.transition.exists={},n.fn.transition.settings={name:"Transition",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"transition",interval:0,reverse:"auto",onStart:function(){},onComplete:function(){},onShow:function(){},onHide:function(){},useFailSafe:!0,failSafeDelay:100,allowRepeats:!1,displayType:!1,animation:"fade",duration:!1,queue:!0,metadata:{displayType:"display"},className:{animating:"animating",disabled:"disabled",hidden:"hidden",inward:"in",loading:"loading",looping:"looping",outward:"out",transition:"transition",visible:"visible"},error:{noAnimation:"Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.",repeated:"That animation is already occurring, cancelling repeated animation",method:"The method you called is not defined",support:"This browser does not support CSS animations"}}}(jQuery,window,document);