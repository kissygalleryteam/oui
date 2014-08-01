/*! oui - v2.0.0 - 2013-11-15 9:41:46 AM
* Copyright (c) 2013 goto100; Licensed  */
KISSY.add("kg/oui/2.0.0/handler",function(a,b){var c=b.Class,d=new c({handleNew:function(){},handleMeta:function(){},handleMember:function(){},handleInitialize:function(){},handleInstance:function(){}});return d},{requires:["kg/oop/0.1/index"]}),KISSY.add("kg/oui/2.0.0/schemas/options",function(a,b,c){function d(a,b){return b in a.__properties__?a.__properties__[b]:a[b]}function e(a,b){Object.keys(b).forEach(function(c){a[c]=b[c]})}function f(a,c){var d=b.property(function(){return this.getOption(d.__name__)||d.defaultValue},function(a){this.setOption(d.__name__,a)});return d.uitype=arguments.callee,d.defaultValue=a,e(d,c||{}),d}var g=new b.Class(c,{handleNew:function(a,b,c,d){d.getOption=this.getOption,d.setOption=this.setOption},setOption:function(a,b){var c=this,e=d(c,a);e&&(b&&"object"==typeof b?Object.keys(b).forEach(function(d){var f=b[d];"value"==d&&e.writable?c[a]=f:e[d]=f}):c["__"+a]=b)},getOption:function(b){var c,e=this,f=d(e,b),g=f.defaultValue.constructor;return e["__"+b]?c=g(e["__"+b]):f.attribute&&(c=g(a.one(e.node).attr(b))),c}});return{option:f,OptionsHandler:g}},{requires:["kg/oop/0.1/index","../handler"]}),KISSY.add("kg/oui/2.0.0/schemas/accessors",function(a,b){function c(c,d){d=d||{};var e=b.property(function(){var b=e.method||"all",c=a.one(this.node)[b](e.selector);if("parent"==b||"one"==b)return f(c[0]);if("all"==b){var d=[];return c.each(function(a){d.push(f(a[0]))}),d}});return e.uitype=arguments.callee,e.selector=c,Object.keys(d).forEach(function(a){e[a]=d[a]}),e}function d(a,b){return b=b||{},b.method="one",c(a,b)}function e(a,b){return b=b||{},b.method="parent",c(a,b)}var f;return b.Class,{define1:d,define:c,parent:e,bind:function(a){f=a}}},{requires:["kg/oop/0.1/index","../handler"]}),KISSY.add("kg/oui/2.0.0/schemas/binding",function(a,b,c){function d(a){this.__hooks__={},this.__object__=a}function e(a){this.path=a,this.parts=this.path.split("."),this.name=this.parts.slice(-1)}function f(a){if(a.__object__)return a;var b;return a&&"object"==typeof a&&(b=new d(a),Object.keys(a).forEach(function(c){var e=a[c];e&&"object"==typeof e?b[c]=f(e):d.defineProperty(b,c)})),b}d.prototype.get=function(a){return this.__object__[a]},d.prototype.set=function(a,b){this.__object__[a]=b,this.__hooks__[a].forEach(function(a){a(b)})},d.register=function(a,b,c){a.__hooks__[b].push(c),c(a.__object__[b])},d.defineProperty=function(a,b){a.__hooks__[b]=[],Object.defineProperty(a,b,{enumerable:!0,get:d.prototype.get.bind(this,b),set:d.prototype.set.bind(this,b)})},e.prototype.getTarget=function(a){var b=a;return this.parts.slice(0,-1).forEach(function(a){b=b[a]}),b},e.get=function(a){return new e(a)};var g=new b.Class(c,{handleNew:function(b,c,f,g){g.bind=function(b,c,f){var g=this;if(!c.__object__)throw new Error("model must be wraped");f=e.get(f);var h=f.getTarget(c);d.register(h,f.name,function(a){g.node[b]=a}),a.one(g.node).on("input",function(){h.set(f.name,g.node.value)})}}});return{BindingHandler:g,wrap:f}},{requires:["kg/oop/0.1/index","../handler"]}),KISSY.add("kg/oui/2.0.0/schemas/promise",function(a,b){function c(a){return function(){var c=new b.Defer,d=Array.prototype.slice.call(arguments,0);return d.push(c.resolve.bind(c)),a.apply(this,d),c.promise}}return{promise:c}},{requires:["promise"]}),KISSY.add("kg/oui/2.0.0/schemas/time",function(a,b){function c(a){return function(b){var c,e,f,g,h,i,j=d(function(){h=g=!1},a);return function(){c=this,e=arguments;var d=function(){f=null,h&&(i=b.apply(c,e)),j()};return f||(f=setTimeout(d,a)),g?h=!0:(g=!0,i=b.apply(c,e)),j(),i}}}function d(a,b){return function(c){var d,e;return function(){var f=this,g=arguments,h=function(){d=null,b||(e=c.apply(f,g))},i=b&&!d;return clearTimeout(d),d=setTimeout(h,a),i&&(e=c.apply(f,g)),e}}}function e(a,b){return function(c){var d=function(){var a=this,e=arguments;b&&c.apply(this,arguments),d.timer=setInterval(function(){c.apply(a,e)},d.time)};return d.time=a,d.stop=function(){clearInterval(d.timer)},d}}function f(a,b){return b||(a=0,b=a),function(c){var d=function(){if(!d.timer){var a=this,b=arguments,e=Math.floor(Math.random()*(d.time[1]-d.time[0])+d.time[0]);d.timer=setTimeout(function(){c.apply(a,b),d.stop(),d.apply(a,b)},e)}};return d.time=[a,b],d.stop=function(){clearTimeout(d.timer),d.timer=null},d}}var g=b.Class,h=new g({__actived:null,__activeMode:0,__activations:{},enableActiveMode:!0,active:function(a,b){function c(){d.active(),d.activeTimer=null,e.enableActiveMode&&e.__activeMode++}var d,e=this;b?"object"==typeof b?(d=b.activation||{},b.activation=d):(d=e.__activations[b]||{},e.__activations[b]=d):d={},d.active=a,e.__actived=d,d.deactiveTimer?e.stopDeactive():e.__activeMode?c():d.activeTimer=setTimeout(c,e.activeWait)},deactive:function(a){function b(){d.deactive(),d.deactiveTimer=null,c.enableActiveMode&&c.__activeMode--}var c=this,d=c.__actived;d.deactive=a,d.activeTimer?c.stopActive():c.deactiveWait?d.deactiveTimer=setTimeout(b,c.deactiveWait):b()},hold:function(){var a=this;a.stopDeactive()},release:function(){var a=this,b=a.__actived;a.deactive(b.deactive)},stopActive:function(){var a=this,b=a.__actived;clearTimeout(b.activeTimer),b.activeTimer=null},stopDeactive:function(){var a=this,b=a.__actived;clearTimeout(b.deactiveTimer),b.deactiveTimer=null},activate:function(a){var b=this;return b.activeWait=a,function(a){return function(c){var d=this,e=arguments;b.active(function(){a.apply(d,e)},c)}}},deactivate:function(a){function b(){var a=this,b=arguments;d.deactive(function(){c.apply(a,b)})}var c,d=this;return"function"==typeof a?(c=a,b):(d.deactiveWait=a,function(a){return c=a,b})}});return{throttle:c,debounce:d,interval:e,randomInterval:f,DelayActivator:h}},{requires:["kg/oop/0.1/index"]}),KISSY.add("kg/oui/2.0.0/schemas/data",function(a,b,c,d,e,f,g,h){function i(a){return a.charAt(0).toUpperCase()+a.slice(1)}function j(a){a=a||{};var c={};return c.__class__=b.property,c.writable=!0,c.uitype=arguments.callee,Object.keys(a).forEach(function(b){c[b]=a[b]}),c.value&&(c.value=d.wrap(c.value)),c}var k=b.Class,l=new k(c,{handleMember:function(a,c,d){if(d&&d.__class__==b.property&&d.uitype==j){var k=a.meta;k.data||(k.data=[]),~k.data.indexOf(c)||k.data.push(c);var l="load"+i(c),m=function(a,b){var c={url:d.api,jsonp:d.jsonp,type:d.method,dataType:d.dataType,scriptCharset:d.scriptCharset,data:h.to_html(d.data,a),success:b};g(c)};d.debounce&&(m=f.debounce(d.debounce,d.immediate)(m)),d.throttle&&(m=f.throttle(d.throttle)(m)),a.__setattr__(l,e.promise(m))}},handleInstance:function(a){(a.meta.data||[]).forEach(function(b){var c=a.__properties__[b],d=a[b];c.bind&&Object.keys(c.bind).forEach(function(b){a.bind(b,d,c.bind[b])})})}});return{data:j,DataHandler:l}},{requires:["kg/oop/0.1/index","../handler","./binding","./promise","./time","ajax","brix/kg/mu/index"]}),KISSY.add("kg/oui/2.0.0/Handler",function(a,b){var c=b.Class,d=new c({handleNew:function(){},handleMeta:function(){},handleMember:function(){},handleInitialize:function(){},handleInstance:function(){}});return d},{requires:["kg/oop/0.1/index"]}),KISSY.add("kg/oui/2.0.0/schemas/template",function(a,b,c,d,e,f){function g(a){var b={};return(a.meta.data||[]).forEach(function(c){b[c]=a.get(c)}),(a.meta.options||[]).forEach(function(c){b[c]=a.get(c)}),b}var h=new b.Class(d,{getTemplate:function(b){b=b||{};var c;return b.template?c=b.template:b["template-from"]?c=a.one(b["template-from"]).html():b["template-module"]&&(c=a.require(b["template-module"])),c},getRenderPoint:function(b){return a.one(b["template-from"])},getShadowRoot:function(b,c){var d=a.one("<div>"+f.to_html(c,g(b))+"</div>")[0],e=a.all("content",d);e.each(function(c){var d="> "+(c.attr("select")||"*"),e=a.all(d,b.node);e.length||(e=c.children()),c.replaceWith(e)});for(var h,i=document.createDocumentFragment();h=d.firstChild;)i.appendChild(h);return i},renderShadow:function(b){var c,d,e,f=this,g=f.getTemplate(b.meta);if(g){for(c=f.getShadowRoot(b,g),d=document.createDocumentFragment();e=b.node.firstChild;)d.appendChild(e);b.temp=d,b.shadowRoot=c,b.node.appendChild(c),a.one(b.node).addClass("oui-loaded")}},handleNew:function(b,d,g,h){var i=this,j=function(b,c,d){var g=this.__properties__[b],h=i.getTemplate(g),j=f.to_html(h,c),k=i.getRenderPoint(g);k?e.insertBefore(a.one(j),k):this.append(j),d()};h.render=c.promise(j)},handleInstance:function(a){var b=this;b.renderShadow(a)}});return{TemplateHandler:h}},{requires:["kg/oop/0.1/index","./promise","../Handler","dom","brix/kg/mu/index","sizzle"]}),KISSY.add("kg/oui/2.0.0/schemas/events",function(a,b,c,d,e){var f=b.Class,g=new f(c,{handleNew:function(a,b,c,d){d.meta.bindEvents=[]},handleMember:function(a,b){b.match(/^on(.*)/)&&a.meta.bindEvents.push({name:RegExp.$1.toLowerCase(),method:b})},handleInstance:function(b){b.meta.bindEvents.forEach(function(c){a.one(b.node).on(c.name,b[c.method].bind(b))})}}),h=new f(c,{handleNew:function(a,b,c,d){d.meta.subEvents=[]},handleMember:function(a,b){b.match(/^(.+)_on(.+)$/)&&a.meta.subEvents.push({sub:RegExp.$1,name:RegExp.$2.toLowerCase(),method:b})},handleInstance:function(a){var b=a.meta,c=[].concat(a.meta.subEvents),d=[].concat(b.define||[]).concat(b.define1||[]).concat(b.parent||[]);d.forEach(function(b){var d=a.__properties__[b];d&&d.bind&&Object.keys(d.bind).forEach(function(e){var f=d.bind[e].split(/\s*,\s*/);c.push({sub:b,name:e,func:function(b){var c=this;f.forEach(function(d){var e=d.match(/^(.*?)(?:\((.*)\))?$/),f=e[1],g=e[2],h=[];g&&("$event"==g?h.push(b):"$target"==g&&h.push(b.target)),a[f].apply(c,h)})}})})}),c.forEach(function(b){var c=a.__properties__[b.sub],d=c.selector;~["blur","valuechange"].indexOf(b.name)?e.on(d,b.name,function(c){b.method?a[b.method](c):b.func&&b.func.call(a,c)},a.node):e.delegate(a.node,b.name,d,function(c){b.method?a[b.method](c):b.func&&b.func.call(a,c)})})}});return{BindEventHandler:g,SubEventHandler:h}},{requires:["kg/oop/0.1/index","../handler","./accessors","event"]}),KISSY.add("kg/oui/2.0.0/schemas/register",function(a,b,c){function d(b){Object.keys(f).forEach(function(c){a.all(c,b).each(function(a){var b=a.nodeName(),c=f[b];new c(a)})})}function e(b){var c=f[b];if(!c)throw new Error(b+" not registed");var d,e=c.meta,g=e.baseTag,h=(e.namespace||"x")+"-"+e.tag;return d=g?a.one("<"+g+'is="'+h+'" />')[0]:a.one("<"+h+"/>")[0],new c(d),d}var f={},g=new b.Class(c,{handleInitialize:function(a){var b=(a.meta.namespace||"x")+"-"+a.meta.tag;a.meta.tag&&(f[b]=a,document.createElement(b))}});return{customTags:f,RegisterHandler:g,bootstrap:d,create:e}},{requires:["kg/oop/0.1/index","../Handler"]}),KISSY.add("kg/oui/2.0.0/schemas/factory",function(a,b,c,d,e,f){var g=b.Class,h=new g(c,{mergeMeta:function(a,b){return Object.keys(b).forEach(function(c){a.meta[c]=b[c]}),a.meta},handleMember:function(a,b,c){"__meta"==b?this.handleMeta(a,c):"__factory"==b&&this.handleFactory(a,c)},handleInstance:function(a){var b=a.__factory;b&&Object.keys(b).forEach(function(c){if("meta"!=c){var d=b[c];a.setOption(c,d)}})},handleMeta:function(a,b){var c=this;b=c.mergeMeta(a,b)},handleFactory:function(a,b){var c=this.mergeMeta(a,b.meta);c.data&&c.data.forEach(function(b){a.__setattr__(b,d.data())}),c.define&&c.define.forEach(function(b){a.__setattr__(b,e.define())}),c.define1&&c.define1.forEach(function(b){a.__setattr__(b,e.define1())}),c.parent&&c.parent.forEach(function(b){a.__setattr__(b,e.parent())}),c.options&&c.options.forEach(function(b){a.__setattr__(b,f.option())})}});return{FactoryHandler:h}},{requires:["kg/oop/0.1/index","../handler","./data","./accessors","./options"]}),KISSY.add("kg/oui/2.0.0/schemas/keyboard",function(a,b,c){function d(a){var b;return"number"==typeof a&&(a=[a]),function(d){return b=c.promise(function(a,c){~b.keyCodes.indexOf(a.keyCode)?d.apply(this,arguments):c&&c()}),b.keyCodes=a,b}}return{keycode:d}},{requires:["kg/oop/0.1/index","./promise"]}),KISSY.add("kg/oui/2.0.0/index",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){function p(){}function q(a){k.bootstrap(a)}function r(a){var b;return a.component?a.component:a.nodeName?(b=k.customTags[a.nodeName.toLowerCase()]||u,new b(a)):a}var s=d.Class,t=new s(d.Type,{__new__:function(a,b,c,f){var j,m,n=f.meta||{};return f.__mixins__=[p],j=f.uses||c.uses||[l.FactoryHandler,e.OptionsHandler,i.BindEventHandler,i.SubEventHandler,g.DataHandler,h.TemplateHandler,k.RegisterHandler,o.BindingHandler],m=[],j.forEach(function(a){m.push(new a)}),f.handlers=m,f.meta=n,f.__constructed=!1,m.forEach(function(d){d.handleNew(a,b,c,f)}),d.Type.__new__(a,b,c,f)},initialize:function(a,b,c){var d=this;d.__constructed=!0,d.handlers&&(Object.keys(c).forEach(function(a){var b=c[a];d.handlers.forEach(function(c){c.handleMember(d,a,b)})}),d.handlers.forEach(function(a){a.handleInitialize(d)}))},__setattr__:function(a,b){var c=this;d.Type.prototype.__setattr__.call(c,a,b),c.__constructed&&c.handlers&&c.handlers.forEach(function(d){d.handleMember(c,a,b)})}});p.prototype=b.Target;var u=new s({__metaclass__:t,initialize:function(b){var d=this,e=c(b);if(b=e[0],b.component){if(b.component.__class__===d.__class__)return b.component;if(!(d instanceof b.component.__class__))throw new Error("node has already wraped")}var f,g=d.meta;g.baseTag&&g.baseTag!=b.nodeName.toLowerCase()&&(f=a.one("<"+g.baseTag+' is="'+g.tag+'" />'),a.each(b.attributes,function(a){f.attr(a.name,a.value)}),e.children().appendTo(f),e.replaceWith(f),b=f[0]),d.node=b,d.node.component=d,d.handlers.forEach(function(a){a.handleInstance(d)}),a.one(d.node).fireHandler("created")}});!function(){var b=c.one;a.one=c.one=function(a){var c=Array.prototype.slice.call(arguments,0);a&&a.node&&(c[0]=a.node);var d=b.apply(this,c);return d&&d[0]&&r(d[0]),d}}();var v={options:e,accessors:f,data:g,template:h,events:i,promise:j,register:k,factory:l,time:m,keyboard:n,binding:o};f.bind(r);var w={};return w.Component=u,w.option=e.option,w.define1=f.define1,w.define=f.define,w.parent=f.parent,w.data=g.data,w.schemas=v,w.bootstrap=q,w.wrap=r,w},{requires:["event","node","kg/oop/0.1/index","./schemas/options","./schemas/accessors","./schemas/data","./schemas/template","./schemas/events","./schemas/promise","./schemas/register","./schemas/factory","./schemas/time","./schemas/keyboard","./schemas/binding"]});