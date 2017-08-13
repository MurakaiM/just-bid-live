!function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.form=function(t){var i,r=e(this),a=r.selector||"",o=(new Date).getTime(),l=[],s=arguments[0],c=arguments[1],u="string"==typeof s,d=[].slice.call(arguments,1);return r.each(function(){var f,p,m,g,v,h,b,y,x,k,E,w,C,V,R,S,F,A,T,D=e(this),j=this,O=[],$=!1;(T={initialize:function(){T.get.settings(),u?(void 0===A&&T.instantiate(),T.invoke(s)):(void 0!==A&&A.invoke("destroy"),T.verbose("Initializing form validation",D,y),T.bindEvents(),T.set.defaults(),T.instantiate())},instantiate:function(){T.verbose("Storing instance of module",T),A=T,D.data(S,T)},destroy:function(){T.verbose("Destroying previous module",A),T.removeEvents(),D.removeData(S)},refresh:function(){T.verbose("Refreshing selector cache"),f=D.find(E.field),p=D.find(E.group),m=D.find(E.message),g=D.find(E.prompt),v=D.find(E.submit),h=D.find(E.clear),b=D.find(E.reset)},submit:function(){T.verbose("Submitting form",D),D.submit()},attachEvents:function(t,n){n=n||"submit",e(t).on("click"+F,function(e){T[n](),e.preventDefault()})},bindEvents:function(){T.verbose("Attaching form events"),D.on("submit"+F,T.validate.form).on("blur"+F,E.field,T.event.field.blur).on("click"+F,E.submit,T.submit).on("click"+F,E.reset,T.reset).on("click"+F,E.clear,T.clear),y.keyboardShortcuts&&D.on("keydown"+F,E.field,T.event.field.keydown),f.each(function(){var t=e(this),n=t.prop("type"),i=T.get.changeEvent(n,t);e(this).on(i+F,T.event.field.change)})},clear:function(){f.each(function(){var t=e(this),n=t.parent(),i=t.closest(p),r=i.find(E.prompt),a=t.data(k.defaultValue)||"",o=n.is(E.uiCheckbox),l=n.is(E.uiDropdown);i.hasClass(w.error)&&(T.verbose("Resetting error on field",i),i.removeClass(w.error),r.remove()),l?(T.verbose("Resetting dropdown value",n,a),n.dropdown("clear")):o?t.prop("checked",!1):(T.verbose("Resetting field value",t,a),t.val(""))})},reset:function(){f.each(function(){var t=e(this),n=t.parent(),i=t.closest(p),r=i.find(E.prompt),a=t.data(k.defaultValue),o=n.is(E.uiCheckbox),l=n.is(E.uiDropdown),s=i.hasClass(w.error);void 0!==a&&(s&&(T.verbose("Resetting error on field",i),i.removeClass(w.error),r.remove()),l?(T.verbose("Resetting dropdown value",n,a),n.dropdown("restore defaults")):o?(T.verbose("Resetting checkbox value",n,a),t.prop("checked",a)):(T.verbose("Resetting field value",t,a),t.val(a)))})},determine:{isValid:function(){var t=!0;return e.each(x,function(e,n){T.validate.field(n,e,!0)||(t=!1)}),t}},is:{bracketedRule:function(e){return e.type&&e.type.match(y.regExp.bracket)},empty:function(e){return!e||0===e.length||(e.is('input[type="checkbox"]')?!e.is(":checked"):T.is.blank(e))},blank:function(t){return""===e.trim(t.val())},valid:function(t){var n=!0;return t?(T.verbose("Checking if field is valid",t),T.validate.field(x[t],t,!1)):(T.verbose("Checking if form is valid"),e.each(x,function(e,t){T.is.valid(e)||(n=!1)}),n)}},removeEvents:function(){D.off(F),f.off(F),v.off(F),f.off(F)},event:{field:{keydown:function(t){var n=e(this),i=t.which,r=n.is(E.input),a=n.is(E.checkbox),o=n.closest(E.uiDropdown).length>0,l={enter:13,escape:27};i==l.escape&&(T.verbose("Escape key pressed blurring field"),n.blur()),t.ctrlKey||i!=l.enter||!r||o||a||($||(n.one("keyup"+F,T.event.field.keyup),T.submit(),T.debug("Enter pressed on input submitting form")),$=!0)},keyup:function(){$=!1},blur:function(t){var n=e(this),i=n.closest(p),r=T.get.validation(n);i.hasClass(w.error)?(T.debug("Revalidating field",n,r),r&&T.validate.field(r)):"blur"!=y.on&&"change"!=y.on||r&&T.validate.field(r)},change:function(t){var n=e(this),i=n.closest(p),r=T.get.validation(n);r&&("change"==y.on||i.hasClass(w.error)&&y.revalidate)&&(clearTimeout(T.timer),T.timer=setTimeout(function(){T.debug("Revalidating field",n,T.get.validation(n)),T.validate.field(r)},y.delay))}}},get:{ancillaryValue:function(e){return!(!e.type||!e.value&&!T.is.bracketedRule(e))&&(void 0!==e.value?e.value:e.type.match(y.regExp.bracket)[1]+"")},ruleName:function(e){return T.is.bracketedRule(e)?e.type.replace(e.type.match(y.regExp.bracket)[0],""):e.type},changeEvent:function(e,t){return"checkbox"==e||"radio"==e||"hidden"==e||t.is("select")?"change":T.get.inputEvent()},inputEvent:function(){return void 0!==n.createElement("input").oninput?"input":void 0!==n.createElement("input").onpropertychange?"propertychange":"keyup"},prompt:function(e,t){var n,i,r,a=T.get.ruleName(e),o=T.get.ancillaryValue(e),l=e.prompt||y.prompt[a]||y.text.unspecifiedRule,s=-1!==l.search("{value}"),c=-1!==l.search("{name}");return(c||s)&&(i=T.get.field(t.identifier)),s&&(l=l.replace("{value}",i.val())),c&&(r=1==(n=i.closest(E.group).find("label").eq(0)).length?n.text():i.prop("placeholder")||y.text.unspecifiedField,l=l.replace("{name}",r)),l=l.replace("{identifier}",t.identifier),l=l.replace("{ruleValue}",o),e.prompt||T.verbose("Using default validation prompt for type",l,a),l},settings:function(){if(e.isPlainObject(t)){var n,i=Object.keys(t);i.length>0&&(void 0!==t[i[0]].identifier&&void 0!==t[i[0]].rules)?(y=e.extend(!0,{},e.fn.form.settings,c),x=e.extend({},e.fn.form.settings.defaults,t),T.error(y.error.oldSyntax,j),T.verbose("Extending settings from legacy parameters",x,y)):(t.fields&&(n=Object.keys(t.fields),("string"==typeof t.fields[n[0]]||e.isArray(t.fields[n[0]]))&&e.each(t.fields,function(n,i){"string"==typeof i&&(i=[i]),t.fields[n]={rules:[]},e.each(i,function(e,i){t.fields[n].rules.push({type:i})})})),y=e.extend(!0,{},e.fn.form.settings,t),x=e.extend({},e.fn.form.settings.defaults,y.fields),T.verbose("Extending settings",x,y))}else y=e.fn.form.settings,x=e.fn.form.settings.defaults,T.verbose("Using default form validation",x,y);R=y.namespace,k=y.metadata,E=y.selector,w=y.className,C=y.regExp,V=y.error,S="module-"+R,F="."+R,A=D.data(S),T.refresh()},field:function(t){return T.verbose("Finding field with identifier",t),t=T.escape.string(t),f.filter("#"+t).length>0?f.filter("#"+t):f.filter('[name="'+t+'"]').length>0?f.filter('[name="'+t+'"]'):f.filter('[name="'+t+'[]"]').length>0?f.filter('[name="'+t+'[]"]'):f.filter("[data-"+k.validate+'="'+t+'"]').length>0?f.filter("[data-"+k.validate+'="'+t+'"]'):e("<input/>")},fields:function(t){var n=e();return e.each(t,function(e,t){n=n.add(T.get.field(t))}),n},validation:function(t){var n,i;return!!x&&(e.each(x,function(e,r){i=r.identifier||e,T.get.field(i)[0]==t[0]&&(r.identifier=i,n=r)}),n||!1)},value:function(e){var t=[];return t.push(e),T.get.values.call(j,t)[e]},values:function(t){var n={};return(e.isArray(t)?T.get.fields(t):f).each(function(t,i){var r=e(i),a=(r.prop("type"),r.prop("name")),o=r.val(),l=r.is(E.checkbox),s=r.is(E.radio),c=-1!==a.indexOf("[]"),u=!!l&&r.is(":checked");a&&(c?(a=a.replace("[]",""),n[a]||(n[a]=[]),l?u?n[a].push(o||!0):n[a].push(!1):n[a].push(o)):s?u&&(n[a]=o):n[a]=l?!!u&&(o||!0):o)}),n}},has:{field:function(e){return T.verbose("Checking for existence of a field with identifier",e),"string"!=typeof(e=T.escape.string(e))&&T.error(V.identifier,e),f.filter("#"+e).length>0||(f.filter('[name="'+e+'"]').length>0||f.filter("[data-"+k.validate+'="'+e+'"]').length>0)}},escape:{string:function(e){return(e=String(e)).replace(C.escape,"\\$&")}},add:{prompt:function(t,n){var i=T.get.field(t).closest(p),r=i.children(E.prompt),a=0!==r.length;n="string"==typeof n?[n]:n,T.verbose("Adding field error state",t),i.addClass(w.error),y.inline&&(a||(r=y.templates.prompt(n)).appendTo(i),r.html(n[0]),a?T.verbose("Inline errors are disabled, no inline error added",t):y.transition&&void 0!==e.fn.transition&&D.transition("is supported")?(T.verbose("Displaying error with css transition",y.transition),r.transition(y.transition+" in",y.duration)):(T.verbose("Displaying error with fallback javascript animation"),r.fadeIn(y.duration)))},errors:function(e){T.debug("Adding form error messages",e),T.set.error(),m.html(y.templates.error(e))}},remove:{prompt:function(t){var n=T.get.field(t).closest(p),i=n.children(E.prompt);n.removeClass(w.error),y.inline&&i.is(":visible")&&(T.verbose("Removing prompt for field",t),y.transition&&void 0!==e.fn.transition&&D.transition("is supported")?i.transition(y.transition+" out",y.duration,function(){i.remove()}):i.fadeOut(y.duration,function(){i.remove()}))}},set:{success:function(){D.removeClass(w.error).addClass(w.success)},defaults:function(){f.each(function(){var t=e(this),n=t.filter(E.checkbox).length>0?t.is(":checked"):t.val();t.data(k.defaultValue,n)})},error:function(){D.removeClass(w.success).addClass(w.error)},value:function(e,t){var n={};return n[e]=t,T.set.values.call(j,n)},values:function(t){e.isEmptyObject(t)||e.each(t,function(t,n){var i,r=T.get.field(t),a=r.parent(),o=e.isArray(n),l=a.is(E.uiCheckbox),s=a.is(E.uiDropdown),c=r.is(E.radio)&&l;r.length>0&&(o&&l?(T.verbose("Selecting multiple",n,r),a.checkbox("uncheck"),e.each(n,function(e,t){i=r.filter('[value="'+t+'"]'),a=i.parent(),i.length>0&&a.checkbox("check")})):c?(T.verbose("Selecting radio value",n,r),r.filter('[value="'+n+'"]').parent(E.uiCheckbox).checkbox("check")):l?(T.verbose("Setting checkbox value",n,a),!0===n?a.checkbox("check"):a.checkbox("uncheck")):s?(T.verbose("Setting dropdown value",n,a),a.dropdown("set selected",n)):(T.verbose("Setting field value",n,r),r.val(n)))})}},validate:{form:function(e,t){var n=T.get.values();if($)return!1;if(O=[],T.determine.isValid()){if(T.debug("Form has no validation errors, submitting"),T.set.success(),!0!==t)return y.onSuccess.call(j,e,n)}else if(T.debug("Form has errors"),T.set.error(),y.inline||T.add.errors(O),void 0!==D.data("moduleApi")&&e.stopImmediatePropagation(),!0!==t)return y.onFailure.call(j,O,n)},field:function(t,n,i){i=void 0===i||i,"string"==typeof t&&(T.verbose("Validating field",t),n=t,t=x[t]);var r=t.identifier||n,a=T.get.field(r),o=!!t.depends&&T.get.field(t.depends),l=!0,s=[];return t.identifier||(T.debug("Using field name as identifier",r),t.identifier=r),a.prop("disabled")?(T.debug("Field is disabled. Skipping",r),l=!0):t.optional&&T.is.blank(a)?(T.debug("Field is optional and blank. Skipping",r),l=!0):t.depends&&T.is.empty(o)?(T.debug("Field depends on another value that is not present or empty. Skipping",o),l=!0):void 0!==t.rules&&e.each(t.rules,function(e,n){T.has.field(r)&&!T.validate.rule(t,n)&&(T.debug("Field is invalid",r,n.type),s.push(T.get.prompt(n,t)),l=!1)}),l?(i&&(T.remove.prompt(r,s),y.onValid.call(a)),!0):(i&&(O=O.concat(s),T.add.prompt(r,s),y.onInvalid.call(a,s)),!1)},rule:function(t,n){var i=T.get.field(t.identifier),r=(n.type,i.val()),a=T.get.ancillaryValue(n),o=T.get.ruleName(n),l=y.rules[o];if(e.isFunction(l))return r=void 0===r||""===r||null===r?"":e.trim(r+""),l.call(i,r,a);T.error(V.noRule,o)}},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,y,t);else{if(void 0===n)return y[t];y[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,T,t);else{if(void 0===n)return T[t];T[t]=n}},debug:function(){!y.silent&&y.debug&&(y.performance?T.performance.log(arguments):(T.debug=Function.prototype.bind.call(console.info,console,y.name+":"),T.debug.apply(console,arguments)))},verbose:function(){!y.silent&&y.verbose&&y.debug&&(y.performance?T.performance.log(arguments):(T.verbose=Function.prototype.bind.call(console.info,console,y.name+":"),T.verbose.apply(console,arguments)))},error:function(){y.silent||(T.error=Function.prototype.bind.call(console.error,console,y.name+":"),T.error.apply(console,arguments))},performance:{log:function(e){var t,n;y.performance&&(n=(t=(new Date).getTime())-(o||t),o=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:j,"Execution Time":n})),clearTimeout(T.performance.timer),T.performance.timer=setTimeout(T.performance.display,500)},display:function(){var t=y.name+":",n=0;o=!1,clearTimeout(T.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),r.length>1&&(t+=" ("+r.length+")"),(void 0!==console.group||void 0!==console.table)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,r){var a,o,l,s=A;return n=n||d,r=j||r,"string"==typeof t&&void 0!==s&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var r=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(s[r])&&n!=a)s=s[r];else{if(void 0!==s[r])return o=s[r],!1;if(!e.isPlainObject(s[i])||n==a)return void 0!==s[i]&&(o=s[i],!1);s=s[i]}})),e.isFunction(o)?l=o.apply(r,n):void 0!==o&&(l=o),e.isArray(i)?i.push(l):void 0!==i?i=[i,l]:void 0!==l&&(i=l),o}}).initialize()}),void 0!==i?i:this},e.fn.form.settings={name:"Form",namespace:"form",debug:!1,verbose:!1,performance:!0,fields:!1,keyboardShortcuts:!0,on:"submit",inline:!1,delay:200,revalidate:!0,transition:"scale",duration:200,onValid:function(){},onInvalid:function(){},onSuccess:function(){return!0},onFailure:function(){return!1},metadata:{defaultValue:"default",validate:"validate"},regExp:{htmlID:/^[a-zA-Z][\w:.-]*$/g,bracket:/\[(.*)\]/i,decimal:/^\d+\.?\d*$/,email:/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,flags:/^\/(.*)\/(.*)?/,integer:/^\-?\d+$/,number:/^\-?\d*(\.\d+)?$/,url:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i},text:{unspecifiedRule:"Please enter a valid value",unspecifiedField:"This field"},prompt:{empty:"{name} must have a value",checked:"{name} must be checked",email:"{name} must be a valid e-mail",url:"{name} must be a valid url",regExp:"{name} is not formatted correctly",integer:"{name} must be an integer",decimal:"{name} must be a decimal number",number:"{name} must be set to a number",is:'{name} must be "{ruleValue}"',isExactly:'{name} must be exactly "{ruleValue}"',not:'{name} cannot be set to "{ruleValue}"',notExactly:'{name} cannot be set to exactly "{ruleValue}"',contain:'{name} cannot contain "{ruleValue}"',containExactly:'{name} cannot contain exactly "{ruleValue}"',doesntContain:'{name} must contain  "{ruleValue}"',doesntContainExactly:'{name} must contain exactly "{ruleValue}"',minLength:"{name} must be at least {ruleValue} characters",length:"{name} must be at least {ruleValue} characters",exactLength:"{name} must be exactly {ruleValue} characters",maxLength:"{name} cannot be longer than {ruleValue} characters",match:"{name} must match {ruleValue} field",different:"{name} must have a different value than {ruleValue} field",creditCard:"{name} must be a valid credit card number",minCount:"{name} must have at least {ruleValue} choices",exactCount:"{name} must have exactly {ruleValue} choices",maxCount:"{name} must have {ruleValue} or less choices"},selector:{checkbox:'input[type="checkbox"], input[type="radio"]',clear:".clear",field:"input, textarea, select",group:".field",input:"input",message:".error.message",prompt:".prompt.label",radio:'input[type="radio"]',reset:'.reset:not([type="reset"])',submit:'.submit:not([type="submit"])',uiCheckbox:".ui.checkbox",uiDropdown:".ui.dropdown"},className:{error:"error",label:"ui prompt label",pressed:"down",success:"success"},error:{identifier:"You must specify a string identifier for each field",method:"The method you called is not defined.",noRule:"There is no rule matching the one you specified",oldSyntax:"Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically."},templates:{error:function(t){var n='<ul class="list">';return e.each(t,function(e,t){n+="<li>"+t+"</li>"}),n+="</ul>",e(n)},prompt:function(t){return e("<div/>").addClass("ui basic red pointing prompt label").html(t[0])}},rules:{empty:function(t){return!(void 0===t||""===t||e.isArray(t)&&0===t.length)},checked:function(){return e(this).filter(":checked").length>0},email:function(t){return e.fn.form.settings.regExp.email.test(t)},url:function(t){return e.fn.form.settings.regExp.url.test(t)},regExp:function(t,n){if(n instanceof RegExp)return t.match(n);var i,r=n.match(e.fn.form.settings.regExp.flags);return r&&(n=r.length>=2?r[1]:n,i=r.length>=3?r[2]:""),t.match(new RegExp(n,i))},integer:function(t,n){var i,r,a,o=e.fn.form.settings.regExp.integer;return n&&-1===["",".."].indexOf(n)&&(-1==n.indexOf("..")?o.test(n)&&(i=r=n-0):(a=n.split("..",2),o.test(a[0])&&(i=a[0]-0),o.test(a[1])&&(r=a[1]-0))),o.test(t)&&(void 0===i||t>=i)&&(void 0===r||t<=r)},decimal:function(t){return e.fn.form.settings.regExp.decimal.test(t)},number:function(t){return e.fn.form.settings.regExp.number.test(t)},is:function(e,t){return t="string"==typeof t?t.toLowerCase():t,(e="string"==typeof e?e.toLowerCase():e)==t},isExactly:function(e,t){return e==t},not:function(e,t){return e="string"==typeof e?e.toLowerCase():e,t="string"==typeof t?t.toLowerCase():t,e!=t},notExactly:function(e,t){return e!=t},contains:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n,"i"))},containsExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n))},doesntContain:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n,"i"))},doesntContainExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n))},minLength:function(e,t){return void 0!==e&&e.length>=t},length:function(e,t){return void 0!==e&&e.length>=t},exactLength:function(e,t){return void 0!==e&&e.length==t},maxLength:function(e,t){return void 0!==e&&e.length<=t},match:function(t,n){var i;e(this);return e('[data-validate="'+n+'"]').length>0?i=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?i=e("#"+n).val():e('[name="'+n+'"]').length>0?i=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(i=e('[name="'+n+'[]"]')),void 0!==i&&t.toString()==i.toString()},different:function(t,n){var i;e(this);return e('[data-validate="'+n+'"]').length>0?i=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?i=e("#"+n).val():e('[name="'+n+'"]').length>0?i=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(i=e('[name="'+n+'[]"]')),void 0!==i&&t.toString()!==i.toString()},creditCard:function(t,n){var i,r,a={visa:{pattern:/^4/,length:[16]},amex:{pattern:/^3[47]/,length:[15]},mastercard:{pattern:/^5[1-5]/,length:[16]},discover:{pattern:/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,length:[16]},unionPay:{pattern:/^(62|88)/,length:[16,17,18,19]},jcb:{pattern:/^35(2[89]|[3-8][0-9])/,length:[16]},maestro:{pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,length:[12,13,14,15,16,17,18,19]},dinersClub:{pattern:/^(30[0-5]|^36)/,length:[14]},laser:{pattern:/^(6304|670[69]|6771)/,length:[16,17,18,19]},visaElectron:{pattern:/^(4026|417500|4508|4844|491(3|7))/,length:[16]}},o={},l=!1,s="string"==typeof n&&n.split(",");if("string"==typeof t&&0!==t.length){if(t=t.replace(/[\-]/g,""),s&&(e.each(s,function(n,i){(r=a[i])&&(o={length:-1!==e.inArray(t.length,r.length),pattern:-1!==t.search(r.pattern)}).length&&o.pattern&&(l=!0)}),!l))return!1;if((i={number:-1!==e.inArray(t.length,a.unionPay.length),pattern:-1!==t.search(a.unionPay.pattern)}).number&&i.pattern)return!0;for(var c=t.length,u=0,d=[[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],f=0;c--;)f+=d[u][parseInt(t.charAt(c),10)],u^=1;return f%10==0&&f>0}},minCount:function(e,t){return 0==t||(1==t?""!==e:e.split(",").length>=t)},exactCount:function(e,t){return 0==t?""===e:1==t?""!==e&&-1===e.search(","):e.split(",").length==t},maxCount:function(e,t){return 0!=t&&(1==t?-1===e.search(","):e.split(",").length<=t)}}}}(jQuery,window,document);