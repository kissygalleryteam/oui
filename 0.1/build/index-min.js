/*! oui - v0.1 - 2013-09-27 12:32:02 PM
* Copyright (c) 2013 goto100; Licensed  */
KISSY.add("gallery/oui/0.1/handler",function(a,b){var c=b.Class,d=new c({handleNew:function(){},handleMeta:function(){},handleMember:function(){},handleInitialize:function(){}});return d},{requires:["gallery/oop/0.1/index"]}),KISSY.add("gallery/oui/0.1/schemas/options",function(a,b,c){function d(a){var c=b.property(function(){return this.getOption(c.__name__)||a},function(a){this.setOption(c.__name__,a)});return c.uitype=arguments.callee,c}var e=new b.Class(c,{handleNew:function(a,b,c,d){d.getOption=this.getOption,d.setOption=this.setOption},setOption:function(a,b){self["__"+a]=b},getOption:function(a){return self["__"+a]}});return{option:d,OptionsHandler:e}},{requires:["gallery/oop/0.1/index","../handler"]}),KISSY.add("gallery/oui/0.1/schemas/accessors",function(a,b){function c(a,c){var d=b.property(function(){return this.node.one(a)});return d.uitype=arguments.callee,d.selector=a,d.options=c,d}function d(a,c){var d=b.property(function(){return this.node.all(a)});return d.uitype=arguments.callee,d.selector=a,d.options=c,d}return b.Class,{define1:c,define:d}},{requires:["gallery/oop/0.1/index","../handler"]}),KISSY.add("gallery/oui/0.1/schemas/promise",function(a,b){function c(a){return function(){var c=new b.Defer,d=Array.prototype.slice.call(arguments,0);return d.push(c.resolve.bind(c)),a.apply(this,d),c.promise}}return{promise:c}},{requires:["promise"]}),KISSY.add("gallery/oui/0.1/schemas/time",function(a,b){function c(a){return function(b){var c,e,f,g,h,i,j=d(function(){h=g=!1},a);return function(){c=this,e=arguments;var d=function(){f=null,h&&(i=b.apply(c,e)),j()};return f||(f=setTimeout(d,a)),g?h=!0:(g=!0,i=b.apply(c,e)),j(),i}}}function d(a,b){return function(c){var d,e;return function(){var f=this,g=arguments,h=function(){d=null,b||(e=c.apply(f,g))},i=b&&!d;return clearTimeout(d),d=setTimeout(h,a),i&&(e=c.apply(f,g)),e}}}function e(b){return function(c){var d=function(){d.timer=setInterval(a.bind(c,this),d.time)};return d.time=b,d.stop=function(){clearInterval(d.timer)},d}}function f(a,b){return b||(a=0,b=a),function(c){var d=function(){if(!d.timer){var a=this,b=arguments,e=Math.floor(Math.random()*(d.time[1]-d.time[0])+d.time[0]);d.timer=setTimeout(function(){c.apply(a,b),d.stop(),d.apply(a,b)},e)}};return d.time=[a,b],d.stop=function(){clearTimeout(d.timer),d.timer=null},d}}var g=b.Class,h=new g({__signal:!1,__actived:!1,__activeTimer:null,__deactiveTimer:null,wait:0,active:function(a){var b=this;clearTimeout(b.__deactiveTimer),b.__deactiveTimer=null,b.__actived?a():(b.__signal=!0,b.__activeTimer=setTimeout(function(){b.__signal&&(a(),b.__actived=!0),b.__activeTimer=null},b.activeWait))},deactive:function(a){var b=this;clearTimeout(b.__activeTimer),b.__activeTimer=null,b.__signal=!1,b.__deactiveTimer=setTimeout(function(){b.__signal||(a(),b.__actived=!1),b.__deactiveTimer=null},b.deactiveWait)},activate:function(a){var b=this;return b.activeWait=a,function(a){return function(){var c=this,d=arguments;b.active(function(){a.apply(c,d)})}}},deactivate:function(a){var b=this;return b.deactiveWait=a,function(a){return function(){var c=this,d=arguments;b.deactive(function(){a.apply(c,d)})}}},hold:function(){var a=this;return function(){a.__signal||(a.__signal=!0)}}});return{throttle:c,debounce:d,interval:e,randomInterval:f,DelayActivator:h}},{requires:["gallery/oop/0.1/index"]}),KISSY.add("gallery/oui/0.1/schemas/data",function(a,b,c,d,e,f,g){function h(a){return a.charAt(0).toUpperCase()+a.slice(1)}function i(a){var c=b.property(function(){return this["_"+c.__name__]},function(a){this["_"+c.__name__]=a});return c.uitype=arguments.callee,c.options=a,c}var j=b.Class,k=new j(c,{handleMember:function(a,c,j){if(j&&j.__class__==b.property&&j.uitype==i){var k="load"+h(c),l=j.options,m=function(a,b){var c={url:l.api,jsonp:l.jsonp,type:l.method,dataType:l.dataType,scriptCharset:l.scriptCharset,data:g.to_html(l.data,a),success:b};f(c)};l.debounce&&(m=e.debounce(l.debounce,l.immediate)(m)),l.throttle&&(m=e.throttle(l.throttle)(m)),a.__setattr__(k,d.promise(m))}}});return{data:i,DataHandler:k}},{requires:["gallery/oop/0.1/index","../handler","./promise","./time","ajax","brix/gallery/mu/index"]}),KISSY.add("gallery/oui/0.1/schemas/events",function(a,b,c,d,e){var f=b.Class,g=new f(c,{handleNew:function(a,b,c,d){d.meta.bindEvents=[]},handleMember:function(a,b){b.match(/^on(.*)/)&&a.meta.bindEvents.push({name:RegExp.$1,method:b})},handleInitialize:function(a){a.meta.bindEvents.forEach(function(b){a.node.on(b.name,a[b.method].bind(a))})}}),h=new f(c,{handleNew:function(a,b,c,d){d.meta.subEvents=[]},handleMember:function(a,b,c){c&&(c.uitype==d.define||c.uitype==d.define1)&&c.options&&c.options.bind?Object.keys(c.options.bind).forEach(function(d){var e=c.options.bind[d].split(/\s*,\s*/);a.meta.subEvents.push({sub:b,name:d,func:function(b){var c=this;e.forEach(function(d){var e=d.match(/^(.*?)(?:\((.*)\))?$/),f=e[1],g=e[2],h=[];g&&("$event"==g?h.push(b):"$target"==g&&h.push(b.target)),a.prototype[f].apply(c,h)})}})}):b.match(/^(.+)_on(.+)$/)&&a.meta.subEvents.push({sub:RegExp.$1,name:RegExp.$2,method:b})},handleInitialize:function(a){a.meta.subEvents.forEach(function(b){var c=a.__properties__[b.sub].selector;~["blur","valuechange"].indexOf(b.name)?e.on(c,b.name,function(c){b.method?a[b.method](c):b.func&&b.func.call(a,c)},a.node):e.delegate(a.node,b.name,c,function(c){b.method?a[b.method](c):b.func&&b.func.call(a,c)})})}});return{BindEventHandler:g,SubEventHandler:h}},{requires:["gallery/oop/0.1/index","../handler","./accessors","event"]}),KISSY.add("gallery/oui/0.1/schemas/factory",function(a,b,c,d,e,f){var g=b.Class,h=new g(c,{handleMember:function(a,b,c){if("__factory"==b){var g=c.meta;g.data&&g.data.forEach(function(b){a.__setattr__(b,d.data(c[b]))}),g.define&&g.define.forEach(function(b){a.__setattr__(b,e.define(c[b].selector,c[b]))}),g.define1&&g.define1.forEach(function(b){a.__setattr__(b,e.define1(c[b].selector,c[b]))}),g.options&&g.options.forEach(function(b){a.__setattr__(b,f.option(c[b]))})}},handleInitialize:function(a){var b=a.__factory;!b}});return{FactoryHandler:h}},{requires:["gallery/oop/0.1/index","../handler","./data","./accessors","./options"]}),KISSY.add("gallery/oui/0.1/schemas/keyboard",function(a,b,c){function d(a){var b;return"number"==typeof a&&(a=[a]),function(d){return b=c.promise(function(a,c){~b.keyCodes.indexOf(a.keyCode)?d.apply(this,arguments):c&&c()}),b.keyCodes=a,b}}return{keycode:d}},{requires:["gallery/oop/0.1/index","./promise"]}),KISSY.add("gallery/oui/0.1/index",function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(){}var o={options:f,accessors:g,data:h,events:i,promise:j,factory:k,time:l,keyboard:m},p=d.Class,q=new p(d.Type,{__new__:function(a,b,c,e){var f,g={};return e.uses?(f=[],e.uses.forEach(function(a){f.push(new a)}),e.handlers=f):f=c.handlers,e.meta=g,e.__constructed=!1,f.forEach(function(d){d.handleNew(a,b,c,e)}),d.Type.__new__(a,b,c,e)},initialize:function(a,b,c){var d=this;d.__constructed=!0,d.handlers&&Object.keys(c).forEach(function(a){var b=c[a];d.handlers.forEach(function(c){c.handleMember(d,a,b)})})},__setattr__:function(a,b){var c=this;d.Type.prototype.__setattr__.call(c,a,b),c.__constructed&&c.handlers&&c.handlers.forEach(function(d){d.handleMember(c,a,b)})}});n.prototype=b.Target;var r=new p({__metaclass__:q,__mixins__:[n],uses:[f.OptionsHandler,i.BindEventHandler,i.SubEventHandler,h.DataHandler,k.FactoryHandler],initialize:function(a){this.node=a,this.handlers.forEach(function(a){a.handleInitialize(this)},this)},render:j.promise(function(b,d,f){var g=a.one(this.__properties__[b].options["template-from"]),h=g.html(),i=e.to_html(h,d);g?c.insertBefore(a.one(i),g):this.node.append(i),f()})}),s={};return s.Component=r,s.option=f.option,s.define1=g.define1,s.define=g.define,s.data=h.data,s.schemas=o,s},{requires:["event","dom","gallery/oop/0.1/index","brix/gallery/mu/index","./schemas/options","./schemas/accessors","./schemas/data","./schemas/events","./schemas/promise","./schemas/factory","./schemas/time","./schemas/keyboard"]});