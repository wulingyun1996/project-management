webpackJsonp([23,416,439,441,445,446],{Dn1p:function(t,s,i){t.exports=i.p+"static/img/business-title.46e114c.png"},FATY:function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=i("mvHQ"),e=i.n(a),r=i("bh5B"),o=i("i3Gc"),A=i("DHfu"),n=i("msXN"),c=(window.sessionStorage.getItem("userId"),n.b,r.a,o.a,window.sessionStorage.getItem("userId")),l={mixins:[n.b],data:function(){return{hasData:!0,shareImg:""}},created:function(){this.getData(),Object(A.j)("setAppBottomTab",1),window.refreshWebView=this.refreshWebView},methods:{dev:function(){return Object(A.d)()},getData:function(){var t=this;if(this.m_hasMore){var s={page:++this.m_page,pageSize:this.m_pageSize};this.isShare&&this.opCityShare&&(s.op_city_share=this.opCityShare),this.$http("union/groupList",s).then(function(s){s.code===t.$ok&&(t.shareImg=s.data.shareImage,t.m_dataList=t.m_dataList.concat(s.data.data),t._checkMore(s.data),t.hasData=0!==t.m_dataList.length)})}},refreshWebView:function(){var t=this;Object(A.w)().then(function(s){t.m_hasMore=!0,t.m_page=0,t.m_dataList=[],t.getData()})},goDetail:function(t){this.isShare?this.goDownLoad():this.$router.push({path:"/circle-detail",query:{id:t}})},goUnionDetail:function(t){this.isShare?this.goDownLoad():this.$router.push({path:"/unionDetail",query:{id:t}})},goShopDetail:function(t){this.isShare?this.goDownLoad():this.$router.push({path:"/shop-detail",query:{id:t}})},back:function(){this.isShare?this.goDownLoad():this.$router.back()},showShare:function(){this.isShare?this.goDownLoad():this.$refs.share.show()},share:function(t){var s={};s.type=t,s.url=location.href+"?v="+ +new Date+"&op_city_share="+window.sessionStorage.getItem("opCity"),s.title="【热门商圈】",s.discriable="【建材采购师】精选热门商圈，精选大牌，品类齐全，价格抄底~",s.imgUrl=this.shareImg,1===t&&(s.title="【建材采购师】精选热门商圈，精选大牌，品类齐全，价格抄底~"),Object(A.j)("share",e()(s),t)},shareUrl:function(){var t=location.href+"?v="+ +new Date+"&op_city_share="+window.sessionStorage.getItem("opCity")+"&shareId="+c;Object(A.j)("copyToClipboard",t)},goDownLoad:function(){this.isShare&&this.$router.push({path:"/app"})}},computed:{isShare:function(){return!!this.$route.query.shareId},title:function(){return this.isShare?"热门商圈":""},isIos:function(){return"iOS"===this.dev()},opCityShare:function(){return this.$route.query.op_city_share}},components:{BaseScroll:r.a,BasePopupShare:o.a}},h={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"business-circle",class:{iphoneX:t.$isNeedFit,isIos:t.isIos}},[t.hasData?a("div",{staticClass:"share-box",class:{iphoneX:t.$isNeedFit,isIos:t.isIos},on:{click:t.showShare}},[a("img",{attrs:{src:i("p6CN"),alt:""}})]):t._e(),t._v(" "),t.hasData?a("div",{staticClass:"hasData"},[t._m(0),t._v(" "),a("div",{staticClass:"bs-scroll",class:{iphoneX:t.$isNeedFit}},[a("base-scroll",{attrs:{hasMore:t.m_hasMore,scrollPosY:t.m_scrollPosY,pullup:t.m_pullup,pulldown:t.m_pulldown,hasLoading:t.m_loading,hasRefresh:t.m_refresh,data:t.m_dataList},on:{scrollToEnd:t.getData}},[a("div",{staticClass:"bs-l-w"},t._l(t.m_dataList,function(s,e){return a("div",{key:e,staticClass:"bs-item"},[a("div",{staticClass:"bs-banner-box",on:{click:function(i){t.goDetail(s.id)}}},[a("div",{staticClass:"banner"},[a("img",{attrs:{src:s.head_img,alt:""}})]),t._v(" "),a("div",{staticClass:"bs-info"},[a("div",{staticClass:"bs-mask"}),t._v(" "),a("div",{staticClass:"bs-text"},[a("div",{staticClass:"top-num"},[t._v("Top"+t._s(e+1))]),t._v(" "),a("div",{staticClass:"bs-t-b"},[a("p",[t._v(t._s(s.group_name))]),t._v(" "),a("p",t._l(s.tab,function(s,i){return a("span",{key:i},[t._v(t._s(s))])}))]),t._v(" "),a("div",{staticClass:"bs-arrow"},[a("img",{attrs:{src:i("nzsf"),alt:""}})])])])]),t._v(" "),a("div",{staticClass:"bs-wrap"},[0!=s.act_info.length?a("div",{staticClass:"bs-act"},t._l(s.act_info,function(s,e){return a("div",{key:e,staticClass:"act-item",on:{click:function(i){t.goUnionDetail(s.id)}}},[a("div",{staticClass:"act-dot"}),t._v(" "),a("span",[t._v("活动")]),t._v(" "),a("p",[t._v(t._s(s.title))]),t._v(" "),a("div",{staticClass:"act-arrow"},[a("img",{attrs:{src:i("V4ZF"),alt:""}})])])})):t._e(),t._v(" "),a("div",{staticClass:"shop-wrap"},t._l(s.shop_list,function(s,i){return a("div",{key:i,staticClass:"shop-item",on:{click:function(i){t.goShopDetail(s.seller_id)}}},[a("div",{staticClass:"s-m-i"},[a("img",{attrs:{src:s.shop_logo_path,alt:""}})]),t._v(" "),a("p",[t._v(t._s(s.shop_name))])])}))])])}))])],1)]):a("div",{staticClass:"hasNoData"},[t._m(1),t._v(" "),t._m(2)]),t._v(" "),a("base-popup-share",{ref:"share",attrs:{isFlashSale:!0},on:{share:t.share,shareUrl:t.shareUrl}})],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"bc-t"},[s("img",{attrs:{src:i("Dn1p"),alt:""}})])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",[s("img",{attrs:{src:i("l8dw"),alt:""}})])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",[s("p",[this._v("各位看官")]),this._v(" "),s("p",[this._v("偶们的商圈正在快马加鞭搭建中")]),this._v(" "),s("p",[this._v("敬请期待哦~")])])}]};var p=i("VU/8")(l,h,!1,function(t){i("p3D8")},"data-v-f4c2759a",null);s.default=p.exports},V4ZF:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAYAAAC58NwRAAAAAXNSR0IArs4c6QAAAP1JREFUKBWVk10KgkAUhXXAJdQaigJL3EC+tIF203uL6kGhZ7GEpNZQGwgEp3PEK/43XbgMM3O+e48zo5UkySGO42uapnPLIFRRFEfoNnmehyaQchxnDyBDrkwgmy5YmWJCyAxFAtd1X9zrRglwsQsppXae571HAVOo7iCVfnVSIpSR3mkH8/IgcIoRjn4m+z2AG/TehLTWF9zVgns9S1yUYGWKkRR/kNvBDgJUo27ORwFWh/8Q1Ze2bT9Y3ff956AlEUO0Rt7xPYHcSQ+YEtNaC6jEEdb5RFqVKWbUQEecTT4NU3HZ4R8xAf5AZ4zlsx6zQaEE7+GEvJmICX0BYlCnC7J0VG4AAAAASUVORK5CYII="},l8dw:function(t,s,i){t.exports=i.p+"static/img/hasNoData.12fb746.png"},nzsf:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAPJJREFUOBGllVsKwjAQRav/7kCtqKhrcjciiAgiooiKdAnuRb8V349d1FNIoAx+dCYDl+lHzukjTRKlaVohG1KOLAXYJ1klpKR2AO0z2tWOrpMAHDzt+lYlYXCVnBzs25qL4k/C4Bo5e9r1lep7ANXJxcG+LbSSGPLqadfnWkkD8CYkM62kieAuJFOtpIXgISQTraSN4CkkY62kg+AtJCOtpIvgIyRDraSH4CskA9sSVt2awdzV/grA9o8InE3ji+Sr2DRC2H8kYPuvDGxfTMAxsS1nwH8byrLQlAPbtzTgsE0VwZHkS72tBx8swUdb0OH6A9fmXngnsWtrAAAAAElFTkSuQmCC"},p3D8:function(t,s){},p6CN:function(t,s){t.exports="data:image/png;base64,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"}});