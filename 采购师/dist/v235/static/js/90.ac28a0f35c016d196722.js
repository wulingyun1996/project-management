webpackJsonp([90],{"4Fmq":function(t,o){},Tg8k:function(t,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var e=i("mvHQ"),s=i.n(e),n=i("bdOr"),a=i("Uwql"),r=i("qIUM"),c=i("bh5B"),u=i("DHfu"),l=i("X2Oc"),d=i("TfiU"),h=i("7yMz"),p=i("DC4n"),v=i("dA1k"),m=(d.mixins,l.p,n.default,a.default,r.default,c.a,h.a,p.a,v.a,{mixins:[d.mixins],data:function(){return{isFirstEnter:!1,quotation:[],hasSelect:!1,showModule:!1,name:"",isCheckAll:!1,isManage:!0,id:"",buyer_id:"",showConfirm:!1,invalidQuotation:[],tempInvalidQuotation:[],isShowSharePopup:!1,isShowWarnPopup:!1,limitMoreClick:!0,nickName:"",mobile:"",person:""}},computed:{quotationId:function(){return this.$route.query.id},sameQuotat:function(){return this.$route.query.sameQuotat},isInvalidGoods:function(){return!!this.invalidQuotation.length},quotationLength:function(){return!!this.quotation.length},isSelect:function(){return Object(d.isSelectArr)(this.quotation)},total:function(){var t=this,o=0,i=0,e=0,s=0,n=0;return this.quotation.length>0&&this.quotation.map(function(a){a.goodsInfo.map(function(a){n+=1,a.kinds.map(function(n){if(t.hasSelect){if(n.checked){if(1===a.goods_type)o=Object(d.solove)(o,Object(d.solove)(n.count,n.price,"*"),"+"),s+=0;else if(0===a.price_type)o=Object(d.solove)(o,Object(d.solove)(n.count,n.promotion_price,"*"),"+"),s=n.svip_price?Object(d.solove)(s,Object(d.solove)(n.count,Object(d.formatCommission)(Object(d.solove)(Object(d.solove)(n.promotion_price,n.purchase_price,"-"),Object(d.solove)(1,n.one_discount,"+"),"*")),"*"),"+"):Object(d.solove)(s,Object(d.solove)(n.count,Object(d.solove)(n.promotion_price,n.purchase_price,"-"),"*"),"+");else{var r=Object(d.totalNum)(a.kinds),c=Object(d.resultPrice)(r,a.intervalPrice,n,t.hasSelect,n.checked);if(o=Object(d.solove)(o,Object(d.solove)(n.count,c.promotion_price,"*"),"+"),n.svip_price){var u=Object(d.formatCommission)(Object(d.solove)(Object(d.solove)(c.promotion_price,c.purchase_price,"-"),Object(d.solove)(1,n.one_discount,"+"),"*"));s=Object(d.solove)(s,Object(d.solove)(n.count,u,"*"),"+")}else s=Object(d.solove)(s,Object(d.solove)(n.count,Object(d.solove)(c.promotion_price,c.purchase_price,"-"),"*"),"+")}e++,i+=n.count}}else{if(1===a.goods_type)o=Object(d.solove)(o,Object(d.solove)(n.count,n.price,"*"),"+"),s+=0;else if(0===a.price_type)o=Object(d.solove)(o,Object(d.solove)(n.count,n.promotion_price,"*"),"+"),s=n.svip_price?Object(d.solove)(s,Object(d.solove)(n.count,Object(d.formatCommission)(Object(d.solove)(Object(d.solove)(n.promotion_price,n.purchase_price,"-"),Object(d.solove)(1,n.one_discount,"+"),"*")),"*"),"+"):Object(d.solove)(s,Object(d.solove)(n.count,Object(d.solove)(n.promotion_price,n.purchase_price,"-"),"*"),"+");else{var l=Object(d.totalNum)(a.kinds,t.hasSelect),h=Object(d.resultPrice)(l,a.intervalPrice,n,t.hasSelect,n.checked);if(o=Object(d.solove)(o,Object(d.solove)(n.count,h.promotion_price,"*"),"+"),n.svip_price){var p=Object(d.formatCommission)(Object(d.solove)(Object(d.solove)(h.promotion_price,h.purchase_price,"-"),Object(d.solove)(1,n.one_discount,"+"),"*"));s=Object(d.solove)(s,Object(d.solove)(n.count,p,"*"),"+")}else s=Object(d.solove)(s,Object(d.solove)(n.count,Object(d.solove)(h.promotion_price,h.purchase_price,"-"),"*"),"+")}e++,i+=n.count}})})}),{totalAmount:n,totalPrice:o,totalNumber:i,totalKinds:e,totalCommission:s}},selectTotal:function(){var t=0,o=0;return this.quotation.length>0&&this.quotation.map(function(i){i.goodsInfo.map(function(i){i.kinds.map(function(i){i.checked&&(o++,t+=i.count)})})}),{totalNumber:t,totalKinds:o}}},created:function(){if(sessionStorage.editQuotation){this.quotation=sessionStorage.editQuotation?JSON.parse(sessionStorage.editQuotation):[],this.invalidQuotation=sessionStorage.invalidQuotation?JSON.parse(sessionStorage.invalidQuotation):[],this.name=sessionStorage.name;for(var t=sessionStorage.addQuotation?JSON.parse(sessionStorage.addQuotation):[],o=0;o<t.length;o++){var i=this.checkResult(t[o],this.quotation,"seller_id");if(-1===i)this.quotation.push(t[o]);else for(var e=0;e<t[o].goodsInfo.length;e++){var n=this.checkResult(t[o].goodsInfo[e],this.quotation[i].goodsInfo,"goods_id");if(-1===n)this.quotation[i].goodsInfo.push(t[o].goodsInfo[e]);else for(var a=0;a<t[o].goodsInfo[e].kinds.length;a++)this.quotation[i].goodsInfo[n].kinds.push(t[o].goodsInfo[e].kinds[a])}}sessionStorage.editQuotation=s()(this.quotation),sessionStorage.addQuotation="",this.quotation.map(function(t){t.checked=!1,t.goodsInfo.map(function(t){t.checked=!1,t.kinds.map(function(t){t.checked=!1})})}),this.isFirstEnter=!0}else this.getData()},methods:{showSharePopup:function(){this.isShowSharePopup=!0},hideSharePopup:function(){this.isShowSharePopup=!1,this.$router.push({name:"QuotationList"})},shareQuotation:function(){this.nickName?this.person=this.nickName:this.person=this.mobile;var t=Object(u.d)(),o={type:4,url:"/pages/quotationDetail/main?id="+this.id+"&buyer_id="+this.buyer_id,title:'这是"'+this.person+'"采购师为您制定的专属报价单，点此购买省更多！！！',discriable:"这是您的专属报价单，点此购买省更多！！！",imgUrl:Object(l.s)(this.quotation[0].goodsInfo[0].goods_img,200,200),from:2,shopCartId:this.id};try{if("Android"===t)return void window.android.share(s()(o));"iOS"===t&&window.webkit.messageHandlers.share.postMessage(s()(o))}catch(t){}this.hideSharePopup()},addQuotation:function(){sessionStorage.editQuotation=s()(this.quotation),this.tempInvalidQuotation.length>0&&(sessionStorage.invalidQuotation=s()(this.tempInvalidQuotation)),sessionStorage.name=this.name,this.$router.push({path:"/add-quotation"})},isEnough:function(){for(var t=0;t<this.quotation.length;t++)for(var o=0;o<this.quotation[t].goodsInfo.length;o++)for(var i=0;i<this.quotation[t].goodsInfo[o].kinds.length;i++){if(1!==this.quotation[t].goodsInfo[o].goods_type)if(Object(d.totalNum)(this.quotation[t].goodsInfo[o].kinds,!1)<this.quotation[t].goodsInfo[o].buy_number)return this.$t("["+this.quotation[t].goodsInfo[o].goods_name+"]起批量至少为："+this.quotation[t].goodsInfo[o].buy_number+"件","bottom"),!0}return!1},getData:function(){var t=this,o={id:this.quotationId,sameQuotat:this.sameQuotat};this.$http("cart/offerDetail",o).then(function(o){if(200===o.code)return t.name=o.data.offer_name,t.quotation=t.formatArr(o.data.list),void(t.isFirstEnter=!0);t.$t(o.message,"middle")})},confirm:function(){for(var t="",o=0;o<this.invalidQuotation.length;o++)t+=this.invalidQuotation[o].id+",";this.$http("cart/delCart",{id:t.substr(0,t.length-1)}),this.invalidQuotation=[],this.showModule1=!1},checkResult:function(t,o,i){if(0===o.length)return-1;for(var e=0;e<o.length;e++)if(t[i]===o[e][i])return e;return-1},checkResults:function(t,o){if(0===o.length)return-1;for(var i=0;i<o.length;i++)if(t.goods_id===o[i].goods_id)return i;return-1},formatArr:function(t){var o=this;t.map(function(t){var i=[];o.$set(t,"checked",o.isCheckAll),o.$set(t,"shopName",t.shop_name),o.$set(t,"seller_id",t.seller_id),o.$set(t,"shop_id",t.shop_id),t.goodsInfo.map(function(t){if(1===t.flag){var e=o.checkResults(t,i);-1===e?i.push({goods_id:t.goods_id,goods_name:t.goods_name,goods_type:t.goods_type,goods_img:t.image_path,buy_number:t.buy_number,is_stock_good:t.is_stock_good,checked:o.isCheckAll,intervalPrice:t.intervalPrice,price_type:t.price_type,kinds:[{id:t.id,count:t.goods_num,flag:t.flag,purchase_price:t.purchase_price,promotion_price:t.promotion_price,price:t.price,title:t.title,goods_unit:t.goods_unit,one_discount:t.one_discount,svip_price:t.svip_price,identity:t.identity,max_price:t.max_price,checked:o.isCheckAll,spec_key:t.spec_key}]}):i[e].kinds.push({id:t.id,count:t.goods_num,flag:t.flag,purchase_price:t.purchase_price,promotion_price:t.promotion_price,price:t.price,title:t.title,one_discount:t.one_discount,svip_price:t.svip_price,identity:t.identity,max_price:t.max_price,goods_unit:t.goods_unit,checked:o.isCheckAll,spec_key:t.spec_key})}else o.invalidQuotation.push({goods_id:t.goods_id,goods_img:t.image_path,goods_name:t.goods_name,title:t.title,id:t.id,flag:t.flag})}),t.goodsInfo=i});for(var i=t.length-1;i>-1;i--)0===t[i].goodsInfo.length&&t.splice(i,1);return this.tempInvalidQuotation=JSON.parse(s()(this.invalidQuotation)),t},jump:function(){this.$router.push({path:"/register-boot-page"})},save:function(){var t=this;if(this.limitMoreClick)if(""!==this.name.trim())if(0!==this.quotation.length){if(this.isInvalidGoods)this.showWarnPopup();else if(!this.isEnough()){var o=[];this.quotation.map(function(t){t.goodsInfo.map(function(i){i.kinds.map(function(e){o.push({goods_num:e.count,seller_id:t.seller_id,goods_id:i.goods_id,spec_key:e.spec_key})})})});var i={offer_name:this.name,id:this.quotationId,sameQuotat:this.sameQuotat,goodsInfo:s()(o)};this.$http("cart/offerEdit",i).then(function(o){if(200===o.code)return t.limitMoreClick=!1,t.isShowSharePopup=!0,t.id=o.data.id,t.buyer_id=o.data.buyer_id,t.mobile=o.data.buyer_mobile,void(t.nickName=o.data.buyer_nickname);t.$t(o.message,"middle")})}}else this.$t("报价单无商品");else this.$t("请输入报价单名称")},showWarnPopup:function(){var t=this;this.isShowWarnPopup=!0,setTimeout(function(){t.isShowWarnPopup=!1},3e3)},deleteInvalidQuotation:function(t){this.invalidQuotation.some(function(o,i,e){if(o.id===t)return e.splice(i,1),!0})},goGoodsDetail:function(t){this.$router.push({path:"/goods-detail",query:{goodsId:t}})},toggleDel:function(){this.hasSelect=!0},formatPrice:function(t){return Object(d.formatPrice)(t)},valid:function(t,o){/^[1-9][0-9]*$/.test(t.count)&&t.count?1===o.goods_type&&t.count>o.buy_number&&(t.count=o.buy_number):t.count=1},add:function(t){this.hasSelect||t.count++},reduce:function(t){if(!this.hasSelect){if(1===t.count)return;t.count--}},finish:function(){this.hasSelect=!1},del:function(t,o,i,e){this.checkQuotationList(o,i,e)},checkQuotationList:function(t,o,i){console.log(this.quotation[i].goodsInfo[o]);var e=this.quotation[i].goodsInfo[o].kinds.length,s=this.quotation[i].goodsInfo.length;e<=1?s<=1?this.quotation.splice(i,1):this.quotation[i].goodsInfo.splice(o,1):this.quotation[i].goodsInfo[o].kinds.splice(t,1)},formatCommission:function(t){return Object(d.formatCommission)(t)},goBack:function(){Object(u.k)("nativeGoHomeNormalTab",0)}},beforeRouteLeave:function(t,o,i){"/quotation-list"===t.path&&(sessionStorage.editQuotation="",sessionStorage.addQuotation=""),i()},filters:{retainTwoDecimal:l.p},components:{delItem:n.default,checkAll:a.default,quotationItem:r.default,Scroll:c.a,Swipeout:h.a,SwipeoutItem:p.a,SwipeoutButton:v.a}}),_={render:function(){var t=this,o=t.$createElement,e=t._self._c||o;return e("div",{staticClass:"make-quotation iphone-x-container"},[e("header",{ref:"header"},[e("div",{staticClass:"arrow-left",on:{click:function(o){t.showConfirm=!0}}},[e("img",{attrs:{src:i("DaLP"),alt:""}})]),t._v(" "),e("div",{staticClass:"title"},[t._v("\n      制作报价单\n    ")]),t._v(" "),e("div",{staticClass:"build"},[e("span",{staticClass:"add-icon"}),t._v(" "),e("span",{on:{click:t.goBack}},[t._v("添加商品")])])]),t._v(" "),e("div",{staticClass:"quotation-title"},[e("span",[t._v("报价单名称")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],attrs:{type:"text",placeholder:"请输入报价单名称 最多12个字",maxlength:"12"},domProps:{value:t.name},on:{input:function(o){o.target.composing||(t.name=o.target.value)}}})]),t._v(" "),e("scroll",{directives:[{name:"show",rawName:"v-show",value:t.isFirstEnter&&(t.quotationLength||t.isInvalidGoods),expression:"isFirstEnter && (quotationLength || isInvalidGoods)"}],staticStyle:{flex:"1",background:"#F2F2F2"}},[e("div",{staticClass:"list"},[t._l(t.quotation,function(o,i){return e("quotation-item",{key:i,attrs:{item:o,"quotation-index":i,hasSelect:t.hasSelect},on:{jump:t.jump,selectShop:t.selectShop,selectGood:t.selectGood,selectKind:t.selectKind,add:t.add,reduce:t.reduce,valid:t.valid,deleteQuotationItem:t.del}})}),t._v(" "),t.invalidQuotation.length>0?e("div",{staticClass:"invalid"},[e("div",{staticClass:"header"},[e("span",[t._v("失效商品（"+t._s(t.invalidQuotation.length)+"）")])]),t._v(" "),e("swipeout",t._l(t.invalidQuotation,function(o,i){return e("swipeout-item",{key:i},[e("div",{attrs:{slot:"right-menu"},slot:"right-menu"},[e("swipeout-button",{attrs:{type:"primary","background-color":"#CB0000",width:70},nativeOn:{click:function(i){t.deleteInvalidQuotation(o.id)}}},[t._v("删除")])],1),t._v(" "),e("div",{staticClass:"item",attrs:{slot:"content"},on:{click:function(i){t.goGoodsDetail(o.goods_id)}},slot:"content"},[e("span",[t._v("失效")]),t._v(" "),e("div",[e("img",{attrs:{src:o.goods_img,alt:""}}),t._v(" "),e("div",{staticClass:"right"},[e("div",[t._v(t._s(o.goods_name))]),t._v(" "),e("div",[e("span",[t._v(t._s(o.title))])])])])])])}))],1):t._e()],2)]),t._v(" "),e("footer",{directives:[{name:"show",rawName:"v-show",value:t.quotationLength&&t.isFirstEnter,expression:"quotationLength && isFirstEnter"}]},[e("check-all",{attrs:{title:"总金额",hasSelect:t.hasSelect,totalPrice:t.total.totalPrice,totalCommission:t.total.totalCommission,totalKinds:t.total.totalKinds,totalNumber:t.total.totalNumber}}),t._v(" "),e("div",{staticClass:"btn-area",on:{click:t.save}},[t._v("\n      保存并分享报价单\n    ")])],1),t._v(" "),e("transition",{attrs:{name:"slide"}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowSharePopup,expression:"isShowSharePopup"}],staticClass:"share-popup",on:{click:function(o){return o.target!==o.currentTarget?null:t.hideSharePopup(o)}}},[e("div",{staticClass:"share-popup-wrapper"},[e("h1",{staticClass:"share-title"},[t._v("分享报价单")]),t._v(" "),e("span",{staticClass:"share-close",on:{click:t.hideSharePopup}}),t._v(" "),e("div",{staticClass:"share-body"},[e("p",[t._v("您只需要将此报价单分享出去，不用囤货，不用发货，无额外费用，产生成交就有佣金拿，多劳多得，上不封顶哦！")]),t._v(" "),e("h5",[e("span",{staticClass:"share-title-text"},[t._v("分享可赚取佣金：")]),t._v(" "),e("span",{staticClass:"share-title-comission"},[t._v("￥"+t._s(t._f("retainTwoDecimal")(t.total.totalCommission)))])]),t._v(" "),e("h2",[e("span",{staticClass:"share-icons"}),t._v(" "),e("span",{staticClass:"share-text"},[t._v(t._s(t.name))])]),t._v(" "),e("div",{staticClass:"share-info"},[e("div",{staticClass:"item"},[e("span",{staticClass:"item-text"},[t._v("店铺数：")]),t._v(" "),e("span",{staticClass:"item-number"},[t._v(t._s(t.quotation.length))])]),t._v(" "),e("div",{staticClass:"item"},[e("span",{staticClass:"item-text"},[t._v("商品数：")]),t._v(" "),e("span",{staticClass:"item-number"},[t._v(t._s(t.total.totalAmount))])]),t._v(" "),e("div",{staticClass:"item"},[e("span",{staticClass:"item-text"},[t._v("家装业主购买价：")]),t._v(" "),e("span",{staticClass:"item-number"},[t._v("￥"+t._s(t._f("retainTwoDecimal")(t.total.totalPrice)))])])])]),t._v(" "),e("div",{staticClass:"share-icon",on:{click:t.shareQuotation}},[e("img",{attrs:{src:i("McnM"),alt:""}}),t._v(" "),e("p",[t._v("微信好友")])])])])]),t._v(" "),e("transition",{attrs:{name:"fade"}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.showConfirm,expression:"showConfirm"}],staticClass:"mask1"},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.showConfirm,expression:"showConfirm"}],staticClass:"module1"},[e("div",{staticClass:"title1"},[t._v("是否放弃本次报价单编辑")]),t._v(" "),e("div",{staticClass:"btn"},[e("span",{on:{click:function(o){t.$router.go(-1)}}},[t._v("确定")]),t._v(" "),e("span",{on:{click:function(o){t.showConfirm=!1}}},[t._v("取消")])])])])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.quotationLength&&!t.isInvalidGoods&&t.isFirstEnter,expression:"!quotationLength && !isInvalidGoods && isFirstEnter"}],staticClass:"quotation-no-quotation"},[e("img",{attrs:{src:i("1Cmb"),alt:""}}),t._v(" "),e("p",[t._v("报价单内没有商品哦，快去添加商品吧！")]),t._v(" "),e("div",{staticClass:"add-quotation",on:{click:t.addQuotation}},[e("span",{staticClass:"add-icon"}),t._v(" "),e("span",{staticClass:"add-text"},[t._v("添加商品")])])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowWarnPopup,expression:"isShowWarnPopup"}],staticClass:"warn-popup"},[t._m(0)])],1)},staticRenderFns:[function(){var t=this.$createElement,o=this._self._c||t;return o("div",{staticClass:"warn-wrapper"},[o("h1",[this._v("报价单内商品"),o("span",[this._v("库存不足")]),this._v("或"),o("span",[this._v("下架")]),this._v("，请修改后再分享")])])}]};var f=i("VU/8")(m,_,!1,function(t){i("4Fmq")},"data-v-1db9d0cc",null);o.default=f.exports}});