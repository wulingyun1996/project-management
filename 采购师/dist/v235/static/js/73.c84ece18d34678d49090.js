webpackJsonp([73,242],{"AAj+":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=i("bdOr"),a=i("Uwql"),s=i("9Lse"),n=i("bh5B"),c=i("TfiU"),l=(n.a,a.default,s.default,o.default,c.mixins,{components:{Scroll:n.a,checkAll:a.default,quotationItem:s.default,delItem:o.default},data:function(){return{isCheckAll:!1,quotation:[],page:0,pageSize:10,hasMore:!0,isManage:!0,amount:0,loading:!1,invalidQuotation:[],showModule:!1}},mounted:function(){this.getData()},mixins:[c.mixins],methods:{confirm:function(){for(var t="",e=0;e<this.invalidQuotation.length;e++)t+=this.invalidQuotation[e].id+",";this.$http("cart/delCart",{id:t.substr(0,t.length-1)}),this.invalidQuotation=[],this.showModule=!1},getData:function(t){var e=this;this.hasMore&&(this.page++,this.$http("cart/getCartList",{page:this.page,pageSize:this.pageSize}).then(function(t){if(e.loading=!0,200===t.code){var i=e.formatArr(t.data.list.data);e.amount=t.data.goodsTotal,e.quotation=e.quotation.concat(i),i.length<10&&(e.hasMore=!1)}else e.$t(t.message)}))},del:function(){var t=this;if(this.isSelect){var e="";this.quotation.map(function(t){t.goodsInfo.map(function(t){t.kinds.map(function(t){t.checked&&(e+=t.id+",")})})}),e=e.substr(0,e.length-1),this.$http("cart/delCart",{id:e}).then(function(e){200===e.code?(t.$t("删除成功"),Object(c.removeUnselect)(t.quotation,!0)):t.$t(e.message)})}},toggleManage:function(){this.$router.push({path:"/quotation-list"})},formatArr:function(t){var e=this;t.map(function(t){var i=[];e.$set(t,"checked",e.isCheckAll),e.$set(t,"shopName",t.shop_name),e.$set(t,"seller_id",t.seller_id),e.$set(t,"shop_id",t.shop_id),t.goodsInfo.map(function(t){if(1===t.flag){var o=e.checkResult(t,i);-1===o?i.push({goods_id:t.goods_id,goods_name:t.goods_name,goods_type:t.goods_type,goods_img:t.image_path,buy_number:t.buy_number,is_stock_good:t.is_stock_good,checked:e.isCheckAll,intervalPrice:t.intervalPrice,price_type:t.price_type,kinds:[{id:t.id,count:t.goods_num,flag:t.flag,purchase_price:t.purchase_price,promotion_price:t.promotion_price,price:t.price,title:t.title,goods_unit:t.goods_unit,one_discount:t.one_discount,svip_price:t.svip_price,identity:t.identity,max_price:t.max_price,checked:e.isCheckAll,spec_key:t.spec_key}]}):i[o].kinds.push({id:t.id,count:t.goods_num,flag:t.flag,purchase_price:t.purchase_price,promotion_price:t.promotion_price,price:t.price,title:t.title,one_discount:t.one_discount,svip_price:t.svip_price,identity:t.identity,max_price:t.max_price,goods_unit:t.goods_unit,checked:e.isCheckAll,spec_key:t.spec_key})}else e.invalidQuotation.push({goods_id:t.goods_id,goods_img:t.image_path,goods_name:t.goods_name,title:t.title,id:t.id,flag:t.flag})}),t.goodsInfo=i});for(var i=t.length-1;i>-1;i--)0===t[i].goodsInfo.length&&t.splice(i,1);return t},valid:function(t,e){/^[1-9][0-9]*$/.test(t.count)&&t.count?1===e.goods_type&&t.count>e.buy_number&&(t.count=e.buy_number):t.count=1},add:function(t){t.count++},reduce:function(t){1!==t.count&&t.count--},checkResult:function(t,e){if(0===e.length)return-1;for(var i=0;i<e.length;i++)if(t.goods_id===e[i].goods_id)return i;return-1}},computed:{isSelect:function(){return Object(c.isSelectArr)(this.quotation)},total:function(){return Object(c.calcTotal)(this.quotation)}}}),d={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return t.loading?o("div",{staticClass:"quotation"},[t.quotation.length>0||t.invalidQuotation.length>0?o("div",{staticClass:"quotation-wrapper iphone-x-container",staticStyle:{height:"100%"}},[o("header",{ref:"header"},[o("div",{staticClass:"arrow-left",on:{click:function(e){t.$router.go(-1)}}},[o("img",{attrs:{src:i("DaLP"),alt:""}})]),t._v(" "),o("div",{staticClass:"title"},[t._v("\n        购物车("+t._s(t.total.totalAmount)+")\n      ")]),t._v(" "),o("div",{staticClass:"build"},[o("span",{on:{click:t.toggleManage}},[t._v("管理")]),o("span",{staticStyle:{color:"#D0021B"}},[t._v("删除")])])]),t._v(" "),o("Scroll",{staticStyle:{flex:"1",background:"#F2F2F2"},attrs:{hasMore:t.hasMore,pullup:!0},on:{scrollToEnd:t.getData}},[t._l(t.quotation,function(e,i){return o("quotation-item",{key:i,attrs:{item:e},on:{selectShop:t.selectShop,selectGood:t.selectGood,selectKind:t.selectKind,reduce:t.reduce,add:t.add,valid:t.valid}})}),t._v(" "),!t.hasMore&&t.invalidQuotation.length>0?o("div",{staticClass:"invalid"},[o("div",{staticClass:"header"},[o("span",[t._v("失效商品（"+t._s(t.invalidQuotation.length)+"）")]),t._v(" "),o("span",{on:{click:function(e){t.showModule=!0}}},[t._v("清除全部失效商品")])]),t._v(" "),t._l(t.invalidQuotation,function(e,i){return o("div",{key:i,staticClass:"item",on:{click:function(i){t.$router.push({path:"/goods-detail",query:{goodsId:e.goods_id}})}}},[o("span",[t._v("失效")]),t._v(" "),o("div",[o("img",{attrs:{src:e.goods_img,alt:""}}),t._v(" "),o("div",{staticClass:"right"},[o("div",[t._v(t._s(e.goods_name))]),t._v(" "),o("div",[o("span",[t._v(t._s(e.title))])])])])])})],2):t._e()],2),t._v(" "),o("footer",[o("del-item",{attrs:{isCheckAll:t.isCheckAll,totalKinds:t.total.totalKinds,totalNumber:t.total.totalNumber,isSelect:t.isSelect},on:{del:t.del,checkAll:t.selectAll}})],1)],1):t._e(),t._v(" "),0===t.quotation.length&&0===t.invalidQuotation.length?o("div",{staticClass:"no-quotation quotation-wrapper iphone-x-container",staticStyle:{height:"100%"}},[o("header",[o("div",{staticClass:"arrow-left",on:{click:function(e){t.$router.go(-1)}}},[o("img",{attrs:{src:i("DaLP"),alt:""}})]),t._v(" "),o("div",{staticClass:"title",staticStyle:{color:"#000"}},[t._v("\n        报价单\n      ")]),t._v(" "),o("div",{staticClass:"build"},[o("span",{staticStyle:{color:"#000"},on:{click:t.toggleManage}},[t._v("管理")])])]),t._v(" "),o("img",{attrs:{src:i("u+cJ"),alt:""}}),t._v(" "),o("p",[t._v("报价单空空滴，快去逛逛吧！")])]):t._e(),t._v(" "),o("transition",{attrs:{name:"fade"}},[o("div",{directives:[{name:"show",rawName:"v-show",value:t.showModule,expression:"showModule"}],staticClass:"mask"},[o("div",{directives:[{name:"show",rawName:"v-show",value:t.showModule,expression:"showModule"}],staticClass:"module"},[o("div",{staticClass:"title"},[t._v("是否清除所有失效商品")]),t._v(" "),o("div",{staticClass:"btn"},[o("span",{on:{click:t.confirm}},[t._v("确定")]),t._v(" "),o("span",{on:{click:function(e){t.showModule=!1}}},[t._v("取消")])])])])])],1):t._e()},staticRenderFns:[]};var r=i("VU/8")(l,d,!1,function(t){i("WpIV")},"data-v-52d4bf06",null);e.default=r.exports},WpIV:function(t,e){},"u+cJ":function(t,e,i){t.exports=i.p+"static/img/no_order.a650fea.png"}});