"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n};!function(n,e,i,t){e=void 0!==e&&e.Math==Math?e:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),n.fn.transition=function(){var t,a=n(this),o=a.selector||"",r=(new Date).getTime(),s=[],l=arguments,d=l[0],u=[].slice.call(arguments,1),c="string"==typeof d;e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||e.msRequestAnimationFrame;return a.each(function(e){var m,f,p,g,v,b,y,h,w,C=n(this),S=this;(w={initialize:function(){m=w.get.settings.apply(S,l),g=m.className,p=m.error,v=m.metadata,h="."+m.namespace,y="module-"+m.namespace,f=C.data(y)||w,b=w.get.animationEndEvent(),c&&(c=w.invoke(d)),!1===c&&(w.verbose("Converted arguments into settings object",m),m.interval?w.delay(m.animate):w.animate(),w.instantiate())},instantiate:function(){w.verbose("Storing instance of module",w),f=w,C.data(y,f)},destroy:function(){w.verbose("Destroying previous module for",S),C.removeData(y)},refresh:function(){w.verbose("Refreshing display type on next animation"),delete w.displayType},forceRepaint:function(){w.verbose("Forcing element repaint");var n=C.parent(),e=C.next();0===e.length?C.detach().appendTo(n):C.detach().insertBefore(e)},repaint:function(){w.verbose("Repainting element");S.offsetWidth},delay:function(n){var i,t=w.get.animationDirection();t||(t=w.can.transition()?w.get.direction():"static"),n=void 0!==n?n:m.interval,i="auto"==m.reverse&&t==g.outward||1==m.reverse?(a.length-e)*m.interval:e*m.interval,w.debug("Delaying animation by",i),setTimeout(w.animate,i)},animate:function(n){if(m=n||m,!w.is.supported())return w.error(p.support),!1;if(w.debug("Preparing animation",m.animation),w.is.animating()){if(m.queue)return!m.allowRepeats&&w.has.direction()&&w.is.occurring()&&!0!==w.queuing?w.debug("Animation is currently occurring, preventing queueing same animation",m.animation):w.queue(m.animation),!1;if(!m.allowRepeats&&w.is.occurring())return w.debug("Animation is already occurring, will not execute repeated animation",m.animation),!1;w.debug("New animation started, completing previous early",m.animation),f.complete()}w.can.animate()?w.set.animating(m.animation):w.error(p.noAnimation,m.animation,S)},reset:function(){w.debug("Resetting animation to beginning conditions"),w.remove.animationCallbacks(),w.restore.conditions(),w.remove.animating()},queue:function(n){w.debug("Queueing animation of",n),w.queuing=!0,C.one(b+".queue"+h,function(){w.queuing=!1,w.repaint(),w.animate.apply(this,m)})},complete:function(n){w.debug("Animation complete",m.animation),w.remove.completeCallback(),w.remove.failSafe(),w.is.looping()||(w.is.outward()?(w.verbose("Animation is outward, hiding element"),w.restore.conditions(),w.hide()):w.is.inward()?(w.verbose("Animation is outward, showing element"),w.restore.conditions(),w.show()):(w.verbose("Static animation completed"),w.restore.conditions(),m.onComplete.call(S)))},force:{visible:function(){var n=C.attr("style"),e=w.get.userStyle(),i=w.get.displayType(),t=e+"display: "+i+" !important;",a=C.css("display"),o=void 0===n||""===n;a!==i?(w.verbose("Overriding default display to show element",i),C.attr("style",t)):o&&C.removeAttr("style")},hidden:function(){var n=C.attr("style"),e=C.css("display"),i=void 0===n||""===n;"none"===e||w.is.hidden()?i&&C.removeAttr("style"):(w.verbose("Overriding default display to hide element"),C.css("display","none"))}},has:{direction:function(e){var i=!1;return"string"==typeof(e=e||m.animation)&&(e=e.split(" "),n.each(e,function(n,e){e!==g.inward&&e!==g.outward||(i=!0)})),i},inlineDisplay:function(){var e=C.attr("style")||"";return n.isArray(e.match(/display.*?;/,""))}},set:{animating:function(n){var e;w.remove.completeCallback(),n=n||m.animation,e=w.get.animationClass(n),w.save.animation(e),w.force.visible(),w.remove.hidden(),w.remove.direction(),w.start.animation(e)},duration:function(n,e){((e="number"==typeof(e=e||m.duration)?e+"ms":e)||0===e)&&(w.verbose("Setting animation duration",e),C.css({"animation-duration":e}))},direction:function(n){(n=n||w.get.direction())==g.inward?w.set.inward():w.set.outward()},looping:function(){w.debug("Transition set to loop"),C.addClass(g.looping)},hidden:function(){C.addClass(g.transition).addClass(g.hidden)},inward:function(){w.debug("Setting direction to inward"),C.removeClass(g.outward).addClass(g.inward)},outward:function(){w.debug("Setting direction to outward"),C.removeClass(g.inward).addClass(g.outward)},visible:function(){C.addClass(g.transition).addClass(g.visible)}},start:{animation:function(n){n=n||w.get.animationClass(),w.debug("Starting tween",n),C.addClass(n).one(b+".complete"+h,w.complete),m.useFailSafe&&w.add.failSafe(),w.set.duration(m.duration),m.onStart.call(S)}},save:{animation:function(n){w.cache||(w.cache={}),w.cache.animation=n},displayType:function(n){"none"!==n&&C.data(v.displayType,n)},transitionExists:function(e,i){n.fn.transition.exists[e]=i,w.verbose("Saving existence of transition",e,i)}},restore:{conditions:function(){var n=w.get.currentAnimation();n&&(C.removeClass(n),w.verbose("Removing animation class",w.cache)),w.remove.duration()}},add:{failSafe:function(){var n=w.get.duration();w.timer=setTimeout(function(){C.triggerHandler(b)},n+m.failSafeDelay),w.verbose("Adding fail safe timer",w.timer)}},remove:{animating:function(){C.removeClass(g.animating)},animationCallbacks:function(){w.remove.queueCallback(),w.remove.completeCallback()},queueCallback:function(){C.off(".queue"+h)},completeCallback:function(){C.off(".complete"+h)},display:function(){C.css("display","")},direction:function(){C.removeClass(g.inward).removeClass(g.outward)},duration:function(){C.css("animation-duration","")},failSafe:function(){w.verbose("Removing fail safe timer",w.timer),w.timer&&clearTimeout(w.timer)},hidden:function(){C.removeClass(g.hidden)},visible:function(){C.removeClass(g.visible)},looping:function(){w.debug("Transitions are no longer looping"),w.is.looping()&&(w.reset(),C.removeClass(g.looping))},transition:function(){C.removeClass(g.visible).removeClass(g.hidden)}},get:{settings:function(e,i,t){return"object"==(void 0===e?"undefined":_typeof(e))?n.extend(!0,{},n.fn.transition.settings,e):"function"==typeof t?n.extend({},n.fn.transition.settings,{animation:e,onComplete:t,duration:i}):"string"==typeof i||"number"==typeof i?n.extend({},n.fn.transition.settings,{animation:e,duration:i}):"object"==(void 0===i?"undefined":_typeof(i))?n.extend({},n.fn.transition.settings,i,{animation:e}):"function"==typeof i?n.extend({},n.fn.transition.settings,{animation:e,onComplete:i}):n.extend({},n.fn.transition.settings,{animation:e})},animationClass:function(n){var e=n||m.animation,i=w.can.transition()&&!w.has.direction()?w.get.direction()+" ":"";return g.animating+" "+g.transition+" "+i+e},currentAnimation:function(){return!(!w.cache||void 0===w.cache.animation)&&w.cache.animation},currentDirection:function(){return w.is.inward()?g.inward:g.outward},direction:function(){return w.is.hidden()||!w.is.visible()?g.inward:g.outward},animationDirection:function(e){var i;return"string"==typeof(e=e||m.animation)&&(e=e.split(" "),n.each(e,function(n,e){e===g.inward?i=g.inward:e===g.outward&&(i=g.outward)})),i||!1},duration:function(n){return!1===(n=n||m.duration)&&(n=C.css("animation-duration")||0),"string"==typeof n?n.indexOf("ms")>-1?parseFloat(n):1e3*parseFloat(n):n},displayType:function(n){return n=void 0===n||n,m.displayType?m.displayType:(n&&void 0===C.data(v.displayType)&&w.can.transition(!0),C.data(v.displayType))},userStyle:function(n){return(n=n||C.attr("style")||"").replace(/display.*?;/,"")},transitionExists:function(e){return n.fn.transition.exists[e]},animationStartEvent:function(){var n,e=i.createElement("div"),t={animation:"animationstart",OAnimation:"oAnimationStart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"};for(n in t)if(void 0!==e.style[n])return t[n];return!1},animationEndEvent:function(){var n,e=i.createElement("div"),t={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(n in t)if(void 0!==e.style[n])return t[n];return!1}},can:{transition:function(e){var i,t,a,o,r,s,l=m.animation,d=w.get.transitionExists(l),u=w.get.displayType(!1);if(void 0===d||e){if(w.verbose("Determining whether animation exists"),i=C.attr("class"),t=C.prop("tagName"),a=n("<"+t+" />").addClass(i).insertAfter(C),o=a.addClass(l).removeClass(g.inward).removeClass(g.outward).addClass(g.animating).addClass(g.transition).css("animationName"),r=a.addClass(g.inward).css("animationName"),u||(u=a.attr("class",i).removeAttr("style").removeClass(g.hidden).removeClass(g.visible).show().css("display"),w.verbose("Determining final display state",u),w.save.displayType(u)),a.remove(),o!=r)w.debug("Direction exists for animation",l),s=!0;else{if("none"==o||!o)return void w.debug("No animation defined in css",l);w.debug("Static animation found",l,u),s=!1}w.save.transitionExists(l,s)}return void 0!==d?d:s},animate:function(){return void 0!==w.can.transition()}},is:{animating:function(){return C.hasClass(g.animating)},inward:function(){return C.hasClass(g.inward)},outward:function(){return C.hasClass(g.outward)},looping:function(){return C.hasClass(g.looping)},occurring:function(n){return n=n||m.animation,n="."+n.replace(" ","."),C.filter(n).length>0},visible:function(){return C.is(":visible")},hidden:function(){return"hidden"===C.css("visibility")},supported:function(){return!1!==b}},hide:function(){w.verbose("Hiding element"),w.is.animating()&&w.reset(),S.blur(),w.remove.display(),w.remove.visible(),w.set.hidden(),w.force.hidden(),m.onHide.call(S),m.onComplete.call(S)},show:function(n){w.verbose("Showing element",n),w.remove.hidden(),w.set.visible(),w.force.visible(),m.onShow.call(S),m.onComplete.call(S)},toggle:function(){w.is.visible()?w.hide():w.show()},stop:function(){w.debug("Stopping current animation"),C.triggerHandler(b)},stopAll:function(){w.debug("Stopping all animation"),w.remove.queueCallback(),C.triggerHandler(b)},clear:{queue:function(){w.debug("Clearing animation queue"),w.remove.queueCallback()}},enable:function(){w.verbose("Starting animation"),C.removeClass(g.disabled)},disable:function(){w.debug("Stopping animation"),C.addClass(g.disabled)},setting:function(e,i){if(w.debug("Changing setting",e,i),n.isPlainObject(e))n.extend(!0,m,e);else{if(void 0===i)return m[e];n.isPlainObject(m[e])?n.extend(!0,m[e],i):m[e]=i}},internal:function(e,i){if(n.isPlainObject(e))n.extend(!0,w,e);else{if(void 0===i)return w[e];w[e]=i}},debug:function(){!m.silent&&m.debug&&(m.performance?w.performance.log(arguments):(w.debug=Function.prototype.bind.call(console.info,console,m.name+":"),w.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?w.performance.log(arguments):(w.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),w.verbose.apply(console,arguments)))},error:function(){m.silent||(w.error=Function.prototype.bind.call(console.error,console,m.name+":"),w.error.apply(console,arguments))},performance:{log:function(n){var e,i;m.performance&&(i=(e=(new Date).getTime())-(r||e),r=e,s.push({Name:n[0],Arguments:[].slice.call(n,1)||"",Element:S,"Execution Time":i})),clearTimeout(w.performance.timer),w.performance.timer=setTimeout(w.performance.display,500)},display:function(){var e=m.name+":",i=0;r=!1,clearTimeout(w.performance.timer),n.each(s,function(n,e){i+=e["Execution Time"]}),e+=" "+i+"ms",o&&(e+=" '"+o+"'"),a.length>1&&(e+=" ("+a.length+")"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(e),console.table?console.table(s):n.each(s,function(n,e){console.log(e.Name+": "+e["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(e,i,a){var o,r,s,l=f;return i=i||u,a=S||a,"string"==typeof e&&void 0!==l&&(e=e.split(/[\. ]/),o=e.length-1,n.each(e,function(i,t){var a=i!=o?t+e[i+1].charAt(0).toUpperCase()+e[i+1].slice(1):e;if(n.isPlainObject(l[a])&&i!=o)l=l[a];else{if(void 0!==l[a])return r=l[a],!1;if(!n.isPlainObject(l[t])||i==o)return void 0!==l[t]&&(r=l[t],!1);l=l[t]}})),n.isFunction(r)?s=r.apply(a,i):void 0!==r&&(s=r),n.isArray(t)?t.push(s):void 0!==t?t=[t,s]:void 0!==s&&(t=s),void 0!==r&&r}}).initialize()}),void 0!==t?t:this},n.fn.transition.exists={},n.fn.transition.settings={name:"Transition",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"transition",interval:0,reverse:"auto",onStart:function(){},onComplete:function(){},onShow:function(){},onHide:function(){},useFailSafe:!0,failSafeDelay:100,allowRepeats:!1,displayType:!1,animation:"fade",duration:!1,queue:!0,metadata:{displayType:"display"},className:{animating:"animating",disabled:"disabled",hidden:"hidden",inward:"in",loading:"loading",looping:"looping",outward:"out",transition:"transition",visible:"visible"},error:{noAnimation:"Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.",repeated:"That animation is already occurring, cancelling repeated animation",method:"The method you called is not defined",support:"This browser does not support CSS animations"}}}(jQuery,window,document);