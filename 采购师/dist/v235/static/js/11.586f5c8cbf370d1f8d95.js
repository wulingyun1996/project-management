webpackJsonp([11],{"162o":function(e,t,i){(function(e){var s=void 0!==e&&e||"undefined"!=typeof self&&self||window,o=Function.prototype.apply;function a(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new a(o.call(setTimeout,s,arguments),clearTimeout)},t.setInterval=function(){return new a(o.call(setInterval,s,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},a.prototype.unref=a.prototype.ref=function(){},a.prototype.close=function(){this._clearFn.call(s,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},i("mypn"),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(t,i("DuR2"))},h5Ic:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i("mvHQ"),o=i.n(s),a=i("DHfu"),n=i("162o"),c=i("X2Oc"),r={name:"Search",data:function(){return{shopName:"",HistoryList:[],noData:[]}},directives:{focus:{inserted:function(e){e.focus()}}},created:function(){var e=Object(a.d)();if("Android"===e){var t=window.android.getNativeLocalCache("infoCode");if(""===t||!t)return;this.HistoryList=t.split(",")}"iOS"===e&&Object(a.k)("getNativeLocalCache","SearchHistory"),window.callbackNativeLocalCache=this.callbackNativeLocalCache},methods:{getSearch:function(){var e=this;this.shopName&&(this.shopName=this.shopName.trim(),this.$http("adv/shopSearch",{shop_name:this.shopName,page:1,op_city:Object(c.i)("opCity")}).then(function(t){if(e.noData=t.data.data,e.noData.length){if(e.HistoryList.length>0){if(!e.noData.length)return;-1!==e.HistoryList.indexOf(e.shopName)?(e.HistoryList.splice(e.HistoryList.indexOf(e.shopName),1),e.HistoryList.unshift(e.shopName)):e.HistoryList.unshift(e.shopName)}else{if(!e.noData.length)return;e.HistoryList.unshift(e.shopName)}e.HistoryList.length>10&&e.HistoryList.pop();var i=Object(a.d)();if("Android"===i){var s=e.HistoryList.join();Object(a.k)("setNativeLocalCache",o()({infoCode:s}))}if("iOS"===i){var c=e.HistoryList.join();Object(a.k)("setNativeLocalCache",{SearchHistory:c})}e.$router.push({path:"/search-shop-list",query:{shopName:e.shopName}})}else e.$refs.infoPopup.show(),Object(n.setTimeout)(function(){e.$refs.infoPopup.hide()},3e3)}))},getClose:function(){this.shopName&&(this.shopName="")},goBack:function(){this.$router.push("/shop-list")},goSearList:function(e){this.$router.push({path:"/search-shop-list",query:{shopName:e}})},callbackNativeLocalCache:function(e){""!==e&&e&&(this.HistoryList=e.split(","))}}},l={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"shop-search-container"},[s("base-header",{attrs:{"is-show-title":!1}},[s("div",{staticClass:"header-center",attrs:{slot:"center"},slot:"center"},[s("div",{staticClass:"search"},[s("img",{attrs:{src:i("qswi"),alt:""}})]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.shopName,expression:"shopName"}],attrs:{id:"phone",type:"text",placeholder:"搜索店铺名称 "},domProps:{value:e.shopName},on:{focus:e.justifyBodyHeight,blur:e.restoreBodyHeight,input:function(t){t.target.composing||(e.shopName=t.target.value)}}}),e._v(" "),s("div",{staticClass:"close",on:{click:e.getClose}},[s("img",{attrs:{src:i("uzM/"),alt:""}})])]),e._v(" "),s("div",{staticClass:"right",on:{click:e.getSearch}},[s("span",[e._v("搜索")])])]),e._v(" "),s("div",{staticClass:"search-content"},[s("p",[e._v("最近搜索")]),e._v(" "),s("div",{staticClass:"search-list"},[s("ul",e._l(e.HistoryList,function(t,i){return s("li",{key:i,on:{click:function(i){e.goSearList(t)}}},[e._v(e._s(t))])}))])]),e._v(" "),s("base-senior-popup",{ref:"infoPopup",staticClass:"info-popup",attrs:{opacity:0,height:"auto"}},[s("p",[e._v("抱歉！")]),e._v(" "),s("p",[e._v("未搜索到相关信息，换个关键词试一试。")])])],1)},staticRenderFns:[]};var u=i("VU/8")(r,l,!1,function(e){i("wAsg")},null,null);t.default=u.exports},mypn:function(e,t,i){(function(e,t){!function(e,i){"use strict";if(!e.setImmediate){var s,o,a,n,c,r=1,l={},u=!1,h=e.document,f=Object.getPrototypeOf&&Object.getPrototypeOf(e);f=f&&f.setTimeout?f:e,"[object process]"==={}.toString.call(e.process)?s=function(e){t.nextTick(function(){d(e)})}:!function(){if(e.postMessage&&!e.importScripts){var t=!0,i=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=i,t}}()?e.MessageChannel?((a=new MessageChannel).port1.onmessage=function(e){d(e.data)},s=function(e){a.port2.postMessage(e)}):h&&"onreadystatechange"in h.createElement("script")?(o=h.documentElement,s=function(e){var t=h.createElement("script");t.onreadystatechange=function(){d(e),t.onreadystatechange=null,o.removeChild(t),t=null},o.appendChild(t)}):s=function(e){setTimeout(d,0,e)}:(n="setImmediate$"+Math.random()+"$",c=function(t){t.source===e&&"string"==typeof t.data&&0===t.data.indexOf(n)&&d(+t.data.slice(n.length))},e.addEventListener?e.addEventListener("message",c,!1):e.attachEvent("onmessage",c),s=function(t){e.postMessage(n+t,"*")}),f.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),i=0;i<t.length;i++)t[i]=arguments[i+1];var o={callback:e,args:t};return l[r]=o,s(r),r++},f.clearImmediate=p}function p(e){delete l[e]}function d(e){if(u)setTimeout(d,0,e);else{var t=l[e];if(t){u=!0;try{!function(e){var t=e.callback,s=e.args;switch(s.length){case 0:t();break;case 1:t(s[0]);break;case 2:t(s[0],s[1]);break;case 3:t(s[0],s[1],s[2]);break;default:t.apply(i,s)}}(t)}finally{p(e),u=!1}}}}}("undefined"==typeof self?void 0===e?this:e:self)}).call(t,i("DuR2"),i("W2nU"))},wAsg:function(e,t){}});