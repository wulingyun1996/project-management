webpackJsonp([62],{1332:function(e,t,i){"use strict";t.__esModule=!0;var r=i(72),n=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e){return function(){var t=e.apply(this,arguments);return new n.default(function(e,i){function r(o,a){try{var d=t[o](a),l=d.value}catch(e){return void i(e)}if(!d.done)return n.default.resolve(l).then(function(e){r("next",e)},function(e){r("throw",e)});e(l)}return r("next")})}}},1333:function(e,t,i){var r=function(){return this}()||Function("return this")(),n=r.regeneratorRuntime&&Object.getOwnPropertyNames(r).indexOf("regeneratorRuntime")>=0,o=n&&r.regeneratorRuntime;if(r.regeneratorRuntime=void 0,e.exports=i(1334),n)r.regeneratorRuntime=o;else try{delete r.regeneratorRuntime}catch(e){r.regeneratorRuntime=void 0}},1334:function(e,t){!function(t){"use strict";function i(e,t,i,r){var o=t&&t.prototype instanceof n?t:n,a=Object.create(o.prototype),d=new f(r||[]);return a._invoke=u(e,i,d),a}function r(e,t,i){try{return{type:"normal",arg:e.call(t,i)}}catch(e){return{type:"throw",arg:e}}}function n(){}function o(){}function a(){}function d(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function l(e){function t(i,n,o,a){var d=r(e[i],e,n);if("throw"!==d.type){var l=d.arg,u=l.value;return u&&"object"==typeof u&&m.call(u,"__await")?Promise.resolve(u.__await).then(function(e){t("next",e,o,a)},function(e){t("throw",e,o,a)}):Promise.resolve(u).then(function(e){l.value=e,o(l)},a)}a(d.arg)}function i(e,i){function r(){return new Promise(function(r,n){t(e,i,r,n)})}return n=n?n.then(r,r):r()}var n;this._invoke=i}function u(e,t,i){var n=z;return function(o,a){if(n===C)throw new Error("Generator is already running");if(n===j){if("throw"===o)throw a;return g()}for(i.method=o,i.arg=a;;){var d=i.delegate;if(d){var l=s(d,i);if(l){if(l===O)continue;return l}}if("next"===i.method)i.sent=i._sent=i.arg;else if("throw"===i.method){if(n===z)throw n=j,i.arg;i.dispatchException(i.arg)}else"return"===i.method&&i.abrupt("return",i.arg);n=C;var u=r(e,t,i);if("normal"===u.type){if(n=i.done?j:E,u.arg===O)continue;return{value:u.arg,done:i.done}}"throw"===u.type&&(n=j,i.method="throw",i.arg=u.arg)}}}function s(e,t){var i=e.iterator[t.method];if(i===v){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=v,s(e,t),"throw"===t.method))return O;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return O}var n=r(i,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,O;var o=n.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=v),t.delegate=null,O):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,O)}function c(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function p(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function f(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(c,this),this.reset(!0)}function h(e){if(e){var t=e[b];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var i=-1,r=function t(){for(;++i<e.length;)if(m.call(e,i))return t.value=e[i],t.done=!1,t;return t.value=v,t.done=!0,t};return r.next=r}}return{next:g}}function g(){return{value:v,done:!0}}var v,x=Object.prototype,m=x.hasOwnProperty,w="function"==typeof Symbol?Symbol:{},b=w.iterator||"@@iterator",y=w.asyncIterator||"@@asyncIterator",_=w.toStringTag||"@@toStringTag",k="object"==typeof e,L=t.regeneratorRuntime;if(L)return void(k&&(e.exports=L));L=t.regeneratorRuntime=k?e.exports:{},L.wrap=i;var z="suspendedStart",E="suspendedYield",C="executing",j="completed",O={},N={};N[b]=function(){return this};var T=Object.getPrototypeOf,S=T&&T(T(h([])));S&&S!==x&&m.call(S,b)&&(N=S);var M=a.prototype=n.prototype=Object.create(N);o.prototype=M.constructor=a,a.constructor=o,a[_]=o.displayName="GeneratorFunction",L.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===o||"GeneratorFunction"===(t.displayName||t.name))},L.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,a):(e.__proto__=a,_ in e||(e[_]="GeneratorFunction")),e.prototype=Object.create(M),e},L.awrap=function(e){return{__await:e}},d(l.prototype),l.prototype[y]=function(){return this},L.AsyncIterator=l,L.async=function(e,t,r,n){var o=new l(i(e,t,r,n));return L.isGeneratorFunction(t)?o:o.next().then(function(e){return e.done?e.value:o.next()})},d(M),M[_]="Generator",M[b]=function(){return this},M.toString=function(){return"[object Generator]"},L.keys=function(e){var t=[];for(var i in e)t.push(i);return t.reverse(),function i(){for(;t.length;){var r=t.pop();if(r in e)return i.value=r,i.done=!1,i}return i.done=!0,i}},L.values=h,f.prototype={constructor:f,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=v,this.done=!1,this.delegate=null,this.method="next",this.arg=v,this.tryEntries.forEach(p),!e)for(var t in this)"t"===t.charAt(0)&&m.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=v)},stop:function(){this.done=!0;var e=this.tryEntries[0],t=e.completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){function t(t,r){return o.type="throw",o.arg=e,i.next=t,r&&(i.method="next",i.arg=v),!!r}if(this.done)throw e;for(var i=this,r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r],o=n.completion;if("root"===n.tryLoc)return t("end");if(n.tryLoc<=this.prev){var a=m.call(n,"catchLoc"),d=m.call(n,"finallyLoc");if(a&&d){if(this.prev<n.catchLoc)return t(n.catchLoc,!0);if(this.prev<n.finallyLoc)return t(n.finallyLoc)}else if(a){if(this.prev<n.catchLoc)return t(n.catchLoc,!0)}else{if(!d)throw new Error("try statement without catch or finally");if(this.prev<n.finallyLoc)return t(n.finallyLoc)}}}},abrupt:function(e,t){for(var i=this.tryEntries.length-1;i>=0;--i){var r=this.tryEntries[i];if(r.tryLoc<=this.prev&&m.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var n=r;break}}n&&("break"===e||"continue"===e)&&n.tryLoc<=t&&t<=n.finallyLoc&&(n=null);var o=n?n.completion:{};return o.type=e,o.arg=t,n?(this.method="next",this.next=n.finallyLoc,O):this.complete(o)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),O},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var i=this.tryEntries[t];if(i.finallyLoc===e)return this.complete(i.completion,i.afterLoc),p(i),O}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var i=this.tryEntries[t];if(i.tryLoc===e){var r=i.completion;if("throw"===r.type){var n=r.arg;p(i)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,i){return this.delegate={iterator:h(e),resultName:t,nextLoc:i},"next"===this.method&&(this.arg=v),O}}}(function(){return this}()||Function("return this")())},1335:function(e,t,i){e.exports=i(1333)},1487:function(e,t,i){"use strict";function r(e,t,i){if(e.ns="http://www.w3.org/2000/svg","foreignObject"!==i&&void 0!==t)for(var n=0;n<t.length;++n){var o=t[n].data;void 0!==o&&r(o,t[n].children,t[n].sel)}}function n(e,t,n){var d,l,u,s={};if(void 0!==n?(s=t,a.a(n)?d=n:a.b(n)?l=n:n&&n.sel&&(d=[n])):void 0!==t&&(a.a(t)?d=t:a.b(t)?l=t:t&&t.sel?d=[t]:s=t),void 0!==d)for(u=0;u<d.length;++u)a.b(d[u])&&(d[u]=i.i(o.b)(void 0,void 0,void 0,d[u],void 0));return"s"!==e[0]||"v"!==e[1]||"g"!==e[2]||3!==e.length&&"."!==e[3]&&"#"!==e[3]||r(s,d,e),i.i(o.b)(e,s,d,l,void 0)}t.a=n;var o=i(1489),a=i(1488)},1488:function(e,t,i){"use strict";function r(e){return"string"==typeof e||"number"==typeof e}i.d(t,"a",function(){return n}),t.b=r;var n=Array.isArray},1489:function(e,t,i){"use strict";function r(e,t,i,r,n){return{sel:e,data:t,children:i,text:r,elm:n,key:void 0===t?void 0:t.key}}t.b=r,t.a=r},1497:function(e,t,i){"use strict";const r={"#ef6370":"#ffffff","#fbea97":"#787150","#ffffff":"#666666","#f4f4f4":"#666666"};t.a=r},1517:function(e,t,i){"use strict";function r(e,t,r,a,d){if("Array"!==i.i(n.r)(t))throw new TypeError("data must be Array");if("String"!==i.i(n.r)(r))throw new TypeError("activityTheme must be a String");var u=r,s=o.a[r],c=[];return t.forEach(function(e){var t=void 0,r=e.type,o=e.content;switch(r){case"text":var u=[];u=o.split("").map(function(e){return"\n"===e?l("br"):e}),t=l("p.cgs-market-description",{style:{color:s}},u);break;case"image":t=l("div.cgs-market-picture",[l("img",{props:{src:o}})]);break;case"goods":if(o.length){var p=[];o.forEach(function(e){var t=void 0,r=e.id,o=e.image_path,a=e.title,d=e.purchase_price,u=e.commission,s=e.isflash,c=e.isHot,f=e.is_stock_good,h=e.boutique,g=e.material,v=i.i(n.i)(d),x=v.init,m=v.zero;t=l("div.goods-item",{dataset:{id:r}},[s?l("span.flash-icon",{dataset:{id:r}}):null,s?l("span.flash-line",{dataset:{id:r}}):null,c?l("div.hot-icon",{dataset:{id:r}}):null,c?l("div.hot-line",{dataset:{id:r}}):null,l("img",{props:{src:o},dataset:{id:r}}),l("div.goods-detail",{dataset:{id:r}},[l("h1.goods-title",{dataset:{id:r}},[l("span.txt",{dataset:{id:r}},a)]),l("div.goods-info-code",{dataset:{id:r}},[1===f?l("div.info-left",{dataset:{id:r}},"现货"):null,1===h?l("div.info-center",{dataset:{id:r}},"精品馆"):null,1===g?l("div.info-right",{dataset:{id:r}},"材料馆"):null]),l("div.goods-price",{dataset:{id:r}},[l("div.sale-price",{dataset:{id:r}},[l("span",{dataset:{id:r}},"￥"),l("span.price",{dataset:{id:r}},x),l("span",{dataset:{id:r}},"."+m)]),s?null:l("div.goods-commission",{dataset:{id:r}},[l("i",{dataset:{id:r}}),l("span",{dataset:{id:r}},"￥"+i.i(n.g)(u))])])])]),p.push(t)}),t=a?l("div.cgs-market-goods-container",{on:{click:a}},p):l("div.cgs-market-goods-container",p)}break;case"activity":var f=o.id,h=o.image_path,g=o.title,v=o.start_at,x=o.end_at,m=o.cost,w=void 0;w=l("div.cgs-market-activity",{dataset:{id:f}},[l("img",{props:{src:h},dataset:{id:f}}),l("div.activity-description",{dataset:{id:f}},[l("h2.activity-title",{dataset:{id:f}},g),l("div.activity-detail",{dataset:{id:f}},[l("p",{dataset:{id:f}},[l("i",{dataset:{id:f}}),l("span",{dataset:{id:f}},v.substr(5,11)+" 至 "+x.substr(5,11))]),"免费"===m?l("span.activity-flag",{dataset:{id:f}},m):l("span.activity-flag",{dataset:{id:f}},"￥"+i.i(n.g)(m))])])]),t=d?l("div.cgs-market-activity-container",{on:{click:d}},w):l("div.cgs-market-activity-container",w)}c.push(t)}),l(e,{style:{background:u}},c)}i.d(t,"b",function(){return d}),t.a=r;var n=i(64),o=i(1497),a=i(1538),d=a.init([i(1542).default,i(1543).default,i(1545).default,i(1546).default,i(1544).default]),l=i(1540).default},1537:function(e,t,i){"use strict";function r(e){return document.createElement(e)}function n(e,t){return document.createElementNS(e,t)}function o(e){return document.createTextNode(e)}function a(e){return document.createComment(e)}function d(e,t,i){e.insertBefore(t,i)}function l(e,t){e.removeChild(t)}function u(e,t){e.appendChild(t)}function s(e){return e.parentNode}function c(e){return e.nextSibling}function p(e){return e.tagName}function f(e,t){e.textContent=t}function h(e){return e.textContent}function g(e){return 1===e.nodeType}function v(e){return 3===e.nodeType}function x(e){return 8===e.nodeType}var m={createElement:r,createElementNS:n,createTextNode:o,createComment:a,insertBefore:d,removeChild:l,appendChild:u,parentNode:s,nextSibling:c,tagName:p,setTextContent:f,getTextContent:h,isElement:g,isText:v,isComment:x};t.a=m},1538:function(e,t,i){"use strict";function r(e){return void 0===e}function n(e){return void 0!==e}function o(e,t){return e.key===t.key&&e.sel===t.sel}function a(e){return void 0!==e.sel}function d(e,t,i){var r,n,o,a={};for(r=t;r<=i;++r)null!=(o=e[r])&&void 0!==(n=o.key)&&(a[n]=r);return a}function l(e,t){function l(e){var t=e.id?"#"+e.id:"",r=e.className?"."+e.className.split(" ").join("."):"";return i.i(u.a)(L.tagName(e).toLowerCase()+t+r,{},[],void 0,e)}function p(e,t){return function(){if(0==--t){var i=L.parentNode(e);L.removeChild(i,e)}}}function f(e,t){var i,o=e.data;void 0!==o&&n(i=o.hook)&&n(i=i.init)&&(i(e),o=e.data);var a=e.children,d=e.sel;if("!"===d)r(e.text)&&(e.text=""),e.elm=L.createComment(e.text);else if(void 0!==d){var l=d.indexOf("#"),u=d.indexOf(".",l),c=l>0?l:d.length,p=u>0?u:d.length,g=-1!==l||-1!==u?d.slice(0,Math.min(c,p)):d,v=e.elm=n(o)&&n(i=o.ns)?L.createElementNS(i,g):L.createElement(g);for(c<p&&v.setAttribute("id",d.slice(c+1,p)),u>0&&v.setAttribute("class",d.slice(p+1).replace(/\./g," ")),i=0;i<k.create.length;++i)k.create[i](h,e);if(s.a(a))for(i=0;i<a.length;++i){var x=a[i];null!=x&&L.appendChild(v,f(x,t))}else s.b(e.text)&&L.appendChild(v,L.createTextNode(e.text));i=e.data.hook,n(i)&&(i.create&&i.create(h,e),i.insert&&t.push(e))}else e.elm=L.createTextNode(e.text);return e.elm}function v(e,t,i,r,n,o){for(;r<=n;++r){var a=i[r];null!=a&&L.insertBefore(e,f(a,o),t)}}function x(e){var t,i,r=e.data;if(void 0!==r){for(n(t=r.hook)&&n(t=t.destroy)&&t(e),t=0;t<k.destroy.length;++t)k.destroy[t](e);if(void 0!==e.children)for(i=0;i<e.children.length;++i)null!=(t=e.children[i])&&"string"!=typeof t&&x(t)}}function m(e,t,i,r){for(;i<=r;++i){var o=void 0,a=void 0,d=void 0,l=t[i];if(null!=l)if(n(l.sel)){for(x(l),a=k.remove.length+1,d=p(l.elm,a),o=0;o<k.remove.length;++o)k.remove[o](l,d);n(o=l.data)&&n(o=o.hook)&&n(o=o.remove)?o(l,d):d()}else L.removeChild(e,l.elm)}}function w(e,t,i,n){for(var a,l,u,s,c=0,p=0,h=t.length-1,g=t[0],x=t[h],w=i.length-1,y=i[0],_=i[w];c<=h&&p<=w;)null==g?g=t[++c]:null==x?x=t[--h]:null==y?y=i[++p]:null==_?_=i[--w]:o(g,y)?(b(g,y,n),g=t[++c],y=i[++p]):o(x,_)?(b(x,_,n),x=t[--h],_=i[--w]):o(g,_)?(b(g,_,n),L.insertBefore(e,g.elm,L.nextSibling(x.elm)),g=t[++c],_=i[--w]):o(x,y)?(b(x,y,n),L.insertBefore(e,x.elm,g.elm),x=t[--h],y=i[++p]):(void 0===a&&(a=d(t,c,h)),l=a[y.key],r(l)?(L.insertBefore(e,f(y,n),g.elm),y=i[++p]):(u=t[l],u.sel!==y.sel?L.insertBefore(e,f(y,n),g.elm):(b(u,y,n),t[l]=void 0,L.insertBefore(e,u.elm,g.elm)),y=i[++p]));(c<=h||p<=w)&&(c>h?(s=null==i[w+1]?null:i[w+1].elm,v(e,s,i,p,w,n)):m(e,t,c,h))}function b(e,t,i){var o,a;n(o=t.data)&&n(a=o.hook)&&n(o=a.prepatch)&&o(e,t);var d=t.elm=e.elm,l=e.children,u=t.children;if(e!==t){if(void 0!==t.data){for(o=0;o<k.update.length;++o)k.update[o](e,t);o=t.data.hook,n(o)&&n(o=o.update)&&o(e,t)}r(t.text)?n(l)&&n(u)?l!==u&&w(d,l,u,i):n(u)?(n(e.text)&&L.setTextContent(d,""),v(d,null,u,0,u.length-1,i)):n(l)?m(d,l,0,l.length-1):n(e.text)&&L.setTextContent(d,""):e.text!==t.text&&L.setTextContent(d,t.text),n(a)&&n(o=a.postpatch)&&o(e,t)}}var y,_,k={},L=void 0!==t?t:c.a;for(y=0;y<g.length;++y)for(k[g[y]]=[],_=0;_<e.length;++_){var z=e[_][g[y]];void 0!==z&&k[g[y]].push(z)}return function(e,t){var i,r,n,d=[];for(i=0;i<k.pre.length;++i)k.pre[i]();for(a(e)||(e=l(e)),o(e,t)?b(e,t,d):(r=e.elm,n=L.parentNode(r),f(t,d),null!==n&&(L.insertBefore(n,t.elm,L.nextSibling(r)),m(n,[e],0,0))),i=0;i<d.length;++i)d[i].data.hook.insert(d[i]);for(i=0;i<k.post.length;++i)k.post[i]();return t}}Object.defineProperty(t,"__esModule",{value:!0}),t.init=l;var u=i(1489),s=i(1488),c=i(1537),p=i(1487);i.d(t,"h",function(){return p.a});var f=i(1539);i.d(t,"thunk",function(){return f.a});var h=i.i(u.a)("",{},[],void 0,void 0),g=["create","update","remove","destroy","pre","post"]},1539:function(e,t,i){"use strict";function r(e,t){t.elm=e.elm,e.data.fn=t.data.fn,e.data.args=t.data.args,t.data=e.data,t.children=e.children,t.text=e.text,t.elm=e.elm}function n(e){var t=e.data;r(t.fn.apply(void 0,t.args),e)}function o(e,t){var i,n=e.data,o=t.data,a=n.args,d=o.args;if(n.fn!==o.fn||a.length!==d.length)return void r(o.fn.apply(void 0,d),t);for(i=0;i<d.length;++i)if(a[i]!==d[i])return void r(o.fn.apply(void 0,d),t);r(e,t)}i.d(t,"a",function(){return d});var a=i(1487),d=function(e,t,r,d){return void 0===d&&(d=r,r=t,t=void 0),i.i(a.a)(e,{key:t,hook:{init:n,prepatch:o},fn:r,args:d})}},1540:function(e,t,i){"use strict";function r(e,t,i){if(e.ns="http://www.w3.org/2000/svg","foreignObject"!==i&&void 0!==t)for(var n=0;n<t.length;++n){var o=t[n].data;void 0!==o&&r(o,t[n].children,t[n].sel)}}function n(e,t,i){var n,d,l,u={};if(void 0!==i?(u=t,a.array(i)?n=i:a.primitive(i)?d=i:i&&i.sel&&(n=[i])):void 0!==t&&(a.array(t)?n=t:a.primitive(t)?d=t:t&&t.sel?n=[t]:u=t),void 0!==n)for(l=0;l<n.length;++l)a.primitive(n[l])&&(n[l]=o.vnode(void 0,void 0,void 0,n[l],void 0));return"s"!==e[0]||"v"!==e[1]||"g"!==e[2]||3!==e.length&&"."!==e[3]&&"#"!==e[3]||r(u,n,e),o.vnode(e,u,n,d,void 0)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(1547),a=i(1541);t.h=n,t.default=n},1541:function(e,t,i){"use strict";function r(e){return"string"==typeof e||"number"==typeof e}Object.defineProperty(t,"__esModule",{value:!0}),t.array=Array.isArray,t.primitive=r},1542:function(e,t,i){"use strict";function r(e,t){var i,r,n=t.elm,o=e.data.class,a=t.data.class;if((o||a)&&o!==a){o=o||{},a=a||{};for(r in o)a[r]||n.classList.remove(r);for(r in a)(i=a[r])!==o[r]&&n.classList[i?"add":"remove"](r)}}Object.defineProperty(t,"__esModule",{value:!0}),t.classModule={create:r,update:r},t.default=t.classModule},1543:function(e,t,i){"use strict";function r(e,t){var i,r=t.elm,o=e.data.dataset,a=t.data.dataset;if((o||a)&&o!==a){o=o||{},a=a||{};var d=r.dataset;for(i in o)a[i]||(d?i in d&&delete d[i]:r.removeAttribute("data-"+i.replace(n,"-$&").toLowerCase()));for(i in a)o[i]!==a[i]&&(d?d[i]=a[i]:r.setAttribute("data-"+i.replace(n,"-$&").toLowerCase(),a[i]))}}Object.defineProperty(t,"__esModule",{value:!0});var n=/[A-Z]/g;t.datasetModule={create:r,update:r},t.default=t.datasetModule},1544:function(e,t,i){"use strict";function r(e,t,i){if("function"==typeof e)e.call(t,i,t);else if("object"==typeof e)if("function"==typeof e[0])if(2===e.length)e[0].call(t,e[1],i,t);else{var n=e.slice(1);n.push(i),n.push(t),e[0].apply(t,n)}else for(var o=0;o<e.length;o++)r(e[o])}function n(e,t){var i=e.type,n=t.data.on;n&&n[i]&&r(n[i],t,e)}function o(){return function e(t){n(t,e.vnode)}}function a(e,t){var i,r=e.data.on,n=e.listener,a=e.elm,d=t&&t.data.on,l=t&&t.elm;if(r!==d){if(r&&n)if(d)for(i in r)d[i]||a.removeEventListener(i,n,!1);else for(i in r)a.removeEventListener(i,n,!1);if(d){var u=t.listener=e.listener||o();if(u.vnode=t,r)for(i in d)r[i]||l.addEventListener(i,u,!1);else for(i in d)l.addEventListener(i,u,!1)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.eventListenersModule={create:a,update:a,destroy:a},t.default=t.eventListenersModule},1545:function(e,t,i){"use strict";function r(e,t){var i,r,n=t.elm,o=e.data.props,a=t.data.props;if((o||a)&&o!==a){o=o||{},a=a||{};for(i in o)a[i]||delete n[i];for(i in a)r=a[i],o[i]===r||"value"===i&&n[i]===r||(n[i]=r)}}Object.defineProperty(t,"__esModule",{value:!0}),t.propsModule={create:r,update:r},t.default=t.propsModule},1546:function(e,t,i){"use strict";function r(e,t,i){u(function(){e[t]=i})}function n(e,t){var i,n,o=t.elm,a=e.data.style,d=t.data.style;if((a||d)&&a!==d){a=a||{},d=d||{};var l="delayed"in a;for(n in a)d[n]||("-"===n[0]&&"-"===n[1]?o.style.removeProperty(n):o.style[n]="");for(n in d)if(i=d[n],"delayed"===n&&d.delayed)for(var u in d.delayed)i=d.delayed[u],l&&i===a.delayed[u]||r(o.style,u,i);else"remove"!==n&&i!==a[n]&&("-"===n[0]&&"-"===n[1]?o.style.setProperty(n,i):o.style[n]=i)}}function o(e){var t,i,r=e.elm,n=e.data.style;if(n&&(t=n.destroy))for(i in t)r.style[i]=t[i]}function a(e,t){var i=e.data.style;if(!i||!i.remove)return void t();s||(getComputedStyle(document.body).transform,s=!0);var r,n,o=e.elm,a=0,d=i.remove,l=0,u=[];for(r in d)u.push(r),o.style[r]=d[r];n=getComputedStyle(o);for(var c=n["transition-property"].split(", ");a<c.length;++a)-1!==u.indexOf(c[a])&&l++;o.addEventListener("transitionend",function(e){e.target===o&&--l,0===l&&t()})}function d(){s=!1}Object.defineProperty(t,"__esModule",{value:!0});var l="undefined"!=typeof window&&window.requestAnimationFrame||setTimeout,u=function(e){l(function(){l(e)})},s=!1;t.styleModule={pre:d,create:n,update:n,destroy:o,remove:a},t.default=t.styleModule},1547:function(e,t,i){"use strict";function r(e,t,i,r,n){return{sel:e,data:t,children:i,text:r,elm:n,key:void 0===t?void 0:t.key}}Object.defineProperty(t,"__esModule",{value:!0}),t.vnode=r,t.default=r},1843:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(1335),n=i.n(r),o=i(1332),a=i.n(o),d=i(1497),l=i(1517),u=i(64);t.default={data:function(){return{flag:!1,announceDetail:"",background:"#ffffff",Vnode:"",soltTitle:"",shartData:"",identityList:[],isBeforeScroll:!0}},computed:{id:function(){return this.$route.query.id},headerTitle:function(){return i.i(u.h)(this.$route.query.title,6)},backgroundColor:function(){return{background:this.background}},textColor:function(){return{color:d.a[this.background]}}},mounted:function(){var e=this;this.$nextTick(function(){e.getData().then(function(){var t=document.getElementById("market-annnoucement");e.Vnode=t;var i=e.announceDetail,r=e.background;i&&e.vnode2html(i,r)})})},methods:{getData:function(){var e=this;return a()(n.a.mark(function t(){var i,r;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return i="adv/noticesDetail",r={id:e.id},t.next=4,e.$http(i,r).then(function(t){if(t.code===e.$ok){var i=t.data,r=i.content,n=i.rejected_reason,o=i.identity,a=i.created_at,d=i.is_delete,l=i.template;e.background=l,o.length?e.identityList=o:e.$http("adv/getPushGroup").then(function(t){t.code===e.$ok&&t.data.list.forEach(function(t){0!==t.num&&e.identityList.push(t)})}),e.announceDetail=r,e.soltTitle=n,e.shartData=a.split(" ")[0],1!==d&&e.$refs.soltPopup.show(),e.flag=!0}});case 4:case"end":return t.stop()}},t,e)}))()},vnode2html:function(e,t){var r=i.i(l.a)("div#market-annnoucement",JSON.parse(e),t);i.i(l.b)(this.Vnode,r)},goEdit:function(){this.$router.push({path:"/edit-announcement",query:{id:this.id,showDraft:1}})},goback:function(){this.$router.push({path:"/market-announcement",query:{showDraft:1,fromNative:1}})},beforeScroll:function(){var e=this.$refs.placeholder;e.style.height=e.offsetHeight+1+"px"}}}},2020:function(e,t,i){t=e.exports=i(707)(!1),t.push([e.i,'.vux-tab{position:relative}[data-dpr="1"] .vux-tab{height:46px}[data-dpr="2"] .vux-tab{height:92px}[data-dpr="3"] .vux-tab{height:138px}.vux-tab:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .vux-tab:after{height:1px}[data-dpr="2"] .vux-tab:after{height:2px}[data-dpr="3"] .vux-tab:after{height:3px}[data-dpr="1"] .vux-tab .vux-tab-item{font-size:15px;line-height:46px}[data-dpr="2"] .vux-tab .vux-tab-item{font-size:30px;line-height:92px}[data-dpr="3"] .vux-tab .vux-tab-item{font-size:45px;line-height:138px}.vux-tab .vux-tab-ink-bar .vux-tab-bar-inner{border-radius:.266667rem;overflow:hidden}[data-dpr="1"] .vux-swipeout-item .vux-swipeout-button{font-size:12px}[data-dpr="2"] .vux-swipeout-item .vux-swipeout-button{font-size:24px}[data-dpr="3"] .vux-swipeout-item .vux-swipeout-button{font-size:36px}.discount .weui-cells input{border:1px solid #dfdfdf;margin-left:.266667rem;border-radius:.066667rem;overflow:hidden;padding-left:.133333rem}[data-dpr="1"] .discount .weui-cells input{height:25px;width:90px}[data-dpr="2"] .discount .weui-cells input{height:50px;width:180px}[data-dpr="3"] .discount .weui-cells input{height:75px;width:270px}.weui-cells{margin-top:0!important}.weui-cells:after,.weui-cells:before{display:none}.weui-cells .weui-cell{padding:0}.weui-cells .weui-textarea{width:100%;height:3.466667rem;border:1px solid #dfdfdf;border-radius:.08rem;overflow:hidden;padding:.24rem}[data-dpr="1"] .weui-cells .weui-textarea{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea{font-size:36px}.weui-cells .weui-textarea-counter{color:#ccc;position:absolute;right:.24rem;bottom:.133333rem}[data-dpr="1"] .weui-cells .weui-textarea-counter{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea-counter{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea-counter{font-size:36px}.weui-cells .weui-textarea-counter span{color:#ff8a00}[data-dpr="1"] .weui-cells .weui-label{font-size:14px;line-height:35px}[data-dpr="2"] .weui-cells .weui-label{font-size:28px;line-height:70px}[data-dpr="3"] .weui-cells .weui-label{font-size:42px;line-height:105px}.weui-cells .weui-input{display:block;width:100%;border:1px solid #ccc;padding:0 .333333rem}[data-dpr="1"] .weui-cells .weui-input{height:35px;font-size:14px}[data-dpr="2"] .weui-cells .weui-input{height:70px;font-size:28px}[data-dpr="3"] .weui-cells .weui-input{height:105px;font-size:42px}.weui-cells .weui-cell__ft{display:none}.weui-cell{height:auto!important}.vux-x-dialog .weui-dialog{width:72%;max-width:72%;border-radius:.533333rem;overflow:hidden;background:#f7f7f7}.vux-x-dialog .weui-dialog .weui-dialog__hd{padding:.56rem 0}.vux-x-dialog .weui-dialog .weui-dialog__title{color:#000}[data-dpr="1"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:51px}.vux-x-dialog .vux-prompt{padding-bottom:.48rem}.vux-x-dialog .vux-prompt-msgbox{width:88%;border:1px solid gray;color:#333;padding:.16rem;border-radius:0;overflow:hidden}[data-dpr="1"] .vux-x-dialog .vux-prompt-msgbox{font-size:13px;height:56px}[data-dpr="2"] .vux-x-dialog .vux-prompt-msgbox{font-size:26px;height:112px}[data-dpr="3"] .vux-x-dialog .vux-prompt-msgbox{font-size:39px;height:168px}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft{line-height:45px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft{line-height:90px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft{line-height:135px}.vux-x-dialog .weui-dialog__ft:after{border-width:1px;border-top-color:#09141f}.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{color:#007aff}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:51px}.vux-x-dialog .weui-dialog__btn:after{border-width:1px;border-left-color:#09141f}.big-photo .weui-dialog{width:96%;max-width:96%}.big-photo .weui-dialog img{display:block}.vux-check-icon .weui-icon-success{color:#ff8a00}[data-dpr="1"] .vux-check-icon .weui-icon-success{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-success{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-success{font-size:54px}.vux-check-icon .weui-icon-success:before{color:#ff8a00!important}.vux-check-icon .weui-icon-circle{color:#999}[data-dpr="1"] .vux-check-icon .weui-icon-circle{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-circle{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-circle{font-size:54px}.loading{-webkit-transition:margin-top .38s;transition:margin-top .38s}.loading.show{margin-top:0}.loading.hide{margin-top:-1.2rem;display:none}.publice-goods .publish-item>div{width:100%}.publice-goods .publish-item .weui-textarea{border:none;padding:0;font-family:PingFang SC,STHeitiSC-Light,Helvetica-Light,arial,sans-serif}[data-dpr="1"] .publice-goods .publish-item .weui-textarea{height:60px;font-size:14px}[data-dpr="2"] .publice-goods .publish-item .weui-textarea{height:120px;font-size:28px}[data-dpr="3"] .publice-goods .publish-item .weui-textarea{height:180px;font-size:42px}.publice-goods .publish-item .weui-textarea-counter{bottom:0}.publice-goods .weui-cells{width:100%;height:100%;padding:0;border-right:none}.publice-goods .weui-cells .weui-cell{height:100%}.publice-goods .weui-cells .weui-input{border:none;text-align:right}[data-dpr="1"] .publice-goods .weui-cells .weui-input{height:24px}[data-dpr="2"] .publice-goods .weui-cells .weui-input{height:48px}[data-dpr="3"] .publice-goods .weui-cells .weui-input{height:72px}.picker-singer .scroller-component{background:#fff}[data-dpr="1"] .picker-singer .scroller-component{height:135px}[data-dpr="2"] .picker-singer .scroller-component{height:270px}[data-dpr="3"] .picker-singer .scroller-component{height:405px}.picker-singer .scroller-indicator{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);position:relative}[data-dpr="1"] .picker-singer .scroller-indicator{height:45px}[data-dpr="2"] .picker-singer .scroller-indicator{height:90px}[data-dpr="3"] .picker-singer .scroller-indicator{height:135px}.picker-singer .scroller-indicator:before{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;top:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator:before{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator:before{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator:before{height:3px}.picker-singer .scroller-indicator:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator:after{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator:after{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator:after{height:3px}.picker-singer .scroller-content .scroller-item{color:#bcbcbc}[data-dpr="1"] .picker-singer .scroller-content .scroller-item{font-size:15px;height:45px;line-height:45px}[data-dpr="2"] .picker-singer .scroller-content .scroller-item{font-size:30px;height:90px;line-height:90px}[data-dpr="3"] .picker-singer .scroller-content .scroller-item{font-size:45px;height:135px;line-height:135px}.picker-singer .scroller-content .scroller-item.scroller-item-selected{color:#000}.commodity-spec .weui-cells .weui-input{border-color:gray;padding-left:.16rem}.weui-toast .weui-toast__content{padding:.346667rem .4rem!important}[data-dpr="1"] .weui-toast .weui-toast__content{font-size:15px;border-right:5px}[data-dpr="2"] .weui-toast .weui-toast__content{font-size:30px;border-right:10px}[data-dpr="3"] .weui-toast .weui-toast__content{font-size:45px;border-right:15px}.interval-quotation .weui-cells{position:relative;overflow:inherit}[data-dpr="1"] .interval-quotation .weui-cells .weui-input{height:32px}[data-dpr="2"] .interval-quotation .weui-cells .weui-input{height:64px}[data-dpr="3"] .interval-quotation .weui-cells .weui-input{height:96px}.scroller-mask{background:none!important}.manager-management .vux-swipeout-button-warn{background:#ff8a00}.manager-list .vux-swipeout-item{position:relative}[data-dpr="1"] .manager-list .vux-swipeout-item{height:70px}[data-dpr="2"] .manager-list .vux-swipeout-item{height:140px}[data-dpr="3"] .manager-list .vux-swipeout-item{height:210px}.manager-list .vux-swipeout-item:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .manager-list .vux-swipeout-item:after{height:1px}[data-dpr="2"] .manager-list .vux-swipeout-item:after{height:2px}[data-dpr="3"] .manager-list .vux-swipeout-item:after{height:3px}.manager-list .vux-swipeout-item .vux-swipeout-content>div,.manager-list .vux-swipeout-item>div{height:100%}[data-dpr="1"] .shop-manage .vux-tab-wrap{height:46px}[data-dpr="2"] .shop-manage .vux-tab-wrap{height:92px}[data-dpr="3"] .shop-manage .vux-tab-wrap{height:138px}.vux-tab-wrap{padding-top:0}[data-dpr="1"] .vux-tab-wrap .vux-tab-container{height:46px}[data-dpr="2"] .vux-tab-wrap .vux-tab-container{height:92px}[data-dpr="3"] .vux-tab-wrap .vux-tab-container{height:138px}.special-content .pull-list .weui-cells{width:auto;padding:.4rem .266667rem;border-right:none}.set-telephone .text-input .weui-cells{width:100%;height:100%;border-right:none}.set-telephone .text-input .weui-cells .weui-input{border:1px solid #ccc}.me-answer .answer-text .weui-cells{height:100%;width:100%;border-right:none}#shopset .weui-cells,.card-mana .weui-cells{width:100%;height:100%;padding:0;border-right:none}.addressbox .weui-cells{width:100%;padding:0}[data-dpr="1"] .addressbox .weui-cells{height:44px;line-height:44px}[data-dpr="2"] .addressbox .weui-cells{height:88px;line-height:88px}[data-dpr="3"] .addressbox .weui-cells{height:132px;line-height:132px}[data-dpr="1"] .time-begin .weui-cells,[data-dpr="1"] .time-end .weui-cells{font-size:14px}[data-dpr="2"] .time-begin .weui-cells,[data-dpr="2"] .time-end .weui-cells{font-size:28px}[data-dpr="3"] .time-begin .weui-cells,[data-dpr="3"] .time-end .weui-cells{font-size:42px}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft{display:block;text-align:left}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft:after,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft:after{content:unset}.time-begin .weui-cells .vux-datetime.weui-cell>div:first-child p,.time-end .weui-cells .vux-datetime.weui-cell>div:first-child p{color:#ccc}.vux-swipeout .vux-swipeout-item .vux-swipeout-button-box button.vux-swipeout-button{padding:2px;background-origin:content-box;background-clip:content-box}.announcement-detail-container{height:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;overflow:hidden}.announcement-detail-container .announcement-detail{overflow:hidden;padding:.266667rem .4rem 0;height:100%;-webkit-box-flex:1;-webkit-flex:1;flex:1}.announcement-detail-container .announcement-detail p{font-size:.373333rem;line-height:.533333rem}.announcement-detail-container .announcement-detail .detail-user{margin-top:.266667rem;display:-webkit-box;display:-webkit-flex;display:flex;font-size:.373333rem}.announcement-detail-container .announcement-detail .detail-user p:first-child{width:25%}.announcement-detail-container .announcement-detail .detail-user p:last-child{width:75%}',""])},2187:function(e,t,i){var r=i(2020);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);i(708)("6a9328f3",r,!0,{})},2371:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"announcement-detail-container"},[i("base-header",{attrs:{title:e.headerTitle,interceptBack:!0},on:{headerBack:e.goback}}),e._v(" "),i("div",{staticClass:"announcement-detail"},[i("base-scroll",{attrs:{"has-more":!0,"before-scroll":!0},on:{beforeScroll:e.beforeScroll}},[i("div",{attrs:{id:"market-annnoucement"}}),e._v(" "),i("div",{staticClass:"detail-user",style:[e.textColor]},[i("p",[e._v("推送用户：")]),e._v(" "),i("p",e._l(e.identityList,function(t,r){return i("span",{key:r},[e._v(e._s(t.title)),i("i",{directives:[{name:"show",rawName:"v-show",value:e.identityList.length!==r+1,expression:"identityList.length !== index + 1"}]},[e._v("、")]),e._v(" "),i("i",{directives:[{name:"show",rawName:"v-show",value:e.identityList.length===r+1,expression:"identityList.length === index + 1"}]})])}))]),e._v(" "),i("div",{staticClass:"detail-user",style:[e.textColor]},[i("p",[e._v("发布时间：")]),e._v(" "),i("p",[e._v(e._s(e.shartData))])]),e._v(" "),i("div",{ref:"placeholder"})])],1),e._v(" "),i("base-footer",{attrs:{text:"编辑"},on:{footerSubmit:e.goEdit}})],1)},staticRenderFns:[]}},312:function(e,t,i){function r(e){i(2187)}var n=i(35)(i(1843),i(2371),r,null,null);e.exports=n.exports}});