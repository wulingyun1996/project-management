webpackJsonp([53,89],{"0Ane":function(t,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var n=e("Gu7T"),i=e.n(n),a=e("mvHQ"),s=e.n(a),l=e("bdOr"),c=e("mLV7"),r=e("Uwql"),d=e("9Lse"),u=e("bh5B"),f=e("TfiU"),g=e("DHfu"),h=(u.a,r.default,d.default,l.default,c.default,f.mixins,[]),v={components:{Scroll:u.a,checkAll:r.default,quotationItem:d.default,delItem:l.default,add:c.default},data:function(){return{isCheckAll:!1,quotation:[],page:0,pageSize:10,hasMore:!0,loading:!1,selectArr:[]}},beforeRouteEnter:function(t,o,e){e(function(t){t.getData(o.path)})},mixins:[f.mixins],methods:{addQuotation:function(){this.isSelect?(Object(f.removeUnselect)(this.quotation),sessionStorage.quotation=s()([].concat(i()(this.quotation),i()(h))),sessionStorage.editQuotation=s()([].concat(i()(this.quotation),i()(h))),this.$router.back()):this.$t("请选择商品")},getData:function(t){var o=this;if(h="/edit-quotation"===t?sessionStorage.editQuotation?JSON.parse(sessionStorage.editQuotation):[]:sessionStorage.quotation?JSON.parse(sessionStorage.quotation):[],this.hasMore){var e=this;this.page++,this.$http("cart/getCartList",{page:this.page,pageSize:this.pageSize}).then(function(t){if(o.loading=!0,200===t.code){var n=Object(f.formatArr)(t.data.list.data,e);n.length<10&&(o.hasMore=!1),o.quotation=o.quotation.concat(n),o.removeExisted(h,o.quotation)}else o.$t(t.message)})}},checkResult:function(t,o){if(0===o.length)return-1;for(var e=0;e<o.length;e++)if(t.goods_id===o[e].goods_id)return e;return-1},toggleManage:function(){this.$router.push({path:"/quotation-list"})},splitSelect:function(t,o){for(var e=0;e<t.length;e++)for(var n=0;n<t[e].goodsInfo.length;n++)for(var i=0;i<t[e].goodsInfo[n].kinds.length;i++)this.splitById(t[e].goodsInfo[n].kinds[i],o)},splitById:function(t,o){for(var e=o.length-1;e>-1;e--){for(var n=o[e].goodsInfo.length-1;n>-1;n--){for(var i=o[e].goodsInfo[n].kinds.length-1;i>-1;i--)o[e].goodsInfo[n].kinds[i].id===t.id&&o[e].goodsInfo[n].kinds.splice(i,1);0===o[e].goodsInfo[n].kinds.length&&o[e].goodsInfo.splice(n,1)}0===o[e].goodsInfo.length&&o.splice(e,1)}},removeExisted:function(t,o){for(var e=0;e<t.length;e++)for(var n=0;n<t[e].goodsInfo.length;n++)for(var i=0;i<t[e].goodsInfo[n].kinds.length;i++)this.splitBySpecKey(t[e].goodsInfo[n].kinds[i],t[e].goodsInfo[n].goods_id,o)},splitBySpecKey:function(t,o,e){for(var n=e.length-1;n>-1;n--){for(var i=e[n].goodsInfo.length-1;i>-1;i--){for(var a=e[n].goodsInfo[i].kinds.length-1;a>-1;a--)e[n].goodsInfo[i].kinds[a].spec_key===t.spec_key&&e[n].goodsInfo[i].goods_id===o&&e[n].goodsInfo[i].kinds.splice(a,1);0===e[n].goodsInfo[i].kinds.length&&e[n].goodsInfo.splice(i,1)}0===e[n].goodsInfo.length&&e.splice(n,1)}},jump:function(t){},add:function(t){t.count++},reduce:function(t){1!==t.count&&t.count--},editCurrentGoods:function(t){var o={id:t.id,goods_num:t.count};this.$http("cart/editCart",o)},goHome:function(){Object(g.l)("nativeGoHomeNormalTab",0)}},computed:{isSelect:function(){return Object(f.isSelectArr)(this.quotation)},total:function(){return Object(f.calcTotal)(this.quotation)}}},p={render:function(){var t=this,o=t.$createElement,n=t._self._c||o;return t.loading?n("div",{staticClass:"iphone-x-container",staticStyle:{height:"100%"}},[t.quotation.length?n("div",{staticClass:"quotation",staticStyle:{height:"100%"}},[n("header",{ref:"header"},[n("div",{staticClass:"arrow-left",on:{click:function(o){t.$router.go(-1)}}},[n("img",{attrs:{src:e("DaLP"),alt:""}})]),t._v(" "),n("div",{staticClass:"title"},[t._v("\n        购物车("+t._s(t.total.totalAmount)+")\n      ")])]),t._v(" "),n("Scroll",{staticClass:"add-quatation-scroll",attrs:{hasMore:t.hasMore,pullup:!0,pulldown:!0},on:{scrollToEnd:t.getData}},t._l(t.quotation,function(o,e){return n("quotation-item",{key:e,attrs:{item:o},on:{selectShop:t.selectShop,selectGood:t.selectGood,selectKind:t.selectKind,reduce:t.reduce,add:t.add,jump:t.jump}})})),t._v(" "),n("footer",[n("add",{attrs:{totalNumber:t.total.totalNumber,totalKinds:t.total.totalKinds,isCheckAll:t.isCheckAll},on:{checkAll:t.selectAll,addQuotation:t.addQuotation}})],1)],1):t._e(),t._v(" "),t.quotation.length?t._e():n("div",{staticClass:"no-quotation",staticStyle:{height:"100%"}},[n("header",[n("div",{staticClass:"arrow-left",on:{click:function(o){t.$router.go(-1)}}},[n("img",{attrs:{src:e("DaLP"),alt:""}})]),t._v(" "),n("div",{staticClass:"title",staticStyle:{color:"#000"}},[t._v("\n        购物车\n      ")]),t._v(" "),n("div",{staticClass:"build"},[n("span",{staticStyle:{color:"#000"},on:{click:t.toggleManage}},[t._v("管理")])])]),t._v(" "),t._m(0)])]):t._e()},staticRenderFns:[function(){var t=this.$createElement,o=this._self._c||t;return o("div",{staticClass:"quotation-no-data"},[o("img",{attrs:{src:e("S1ey"),alt:""}}),this._v(" "),o("p",[this._v("\n        把商品加入购物车，不仅方便自购结算，\n        还可快速制作报价单分享给您的业主们，\n        赶快行动吧！\n      ")])])}]};var m=e("VU/8")(v,p,!1,function(t){e("Q+dd")},"data-v-a711bc68",null);o.default=m.exports},"5K8x":function(t,o){},"Q+dd":function(t,o){},mLV7:function(t,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});Boolean,Number,Number;var n={props:{isCheckAll:{type:Boolean,default:!1},totalKinds:{type:Number,default:0},totalNumber:{type:Number,default:0}},methods:{addQuotation:function(){this.$emit("addQuotation")},checkAll:function(){this.$emit("checkAll")}}},i={render:function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",{staticClass:"del"},[n("div",{staticClass:"left"},[n("img",{attrs:{src:t.isCheckAll?e("vScA"):e("BE87"),alt:""},on:{click:t.checkAll}}),t._v(" "),n("span",[t._v("全选")]),t._v(" "),n("span",[t._v("共"+t._s(t.totalKinds)+"种"+t._s(t.totalNumber)+"件")])]),t._v(" "),n("div",{staticClass:"right can-del",on:{click:t.addQuotation}},[t._v("\n    添加\n  ")])])},staticRenderFns:[]};var a=e("VU/8")(n,i,!1,function(t){e("5K8x")},"data-v-3e1c33ee",null);o.default=a.exports}});