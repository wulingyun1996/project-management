webpackJsonp([25,339,340,349,356,358,360],{"4UtU":function(t,s,a){t.exports=a.p+"static/img/honeyShop.5293bfa.png"},JmTt:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAAAwtJREFUWAntV01ME1EQnnnbWigx/OilISYSf2KQkxh/IhIpiIlE1IM/MTHxYBA1RDlQ0HjYgzEUTdT4h39no9whKFYsQYNgonIxEc6NwYsIC0u77zlLwMO6r13rrl547aZ9b2a+b9+8mdlZrL2UU5Kc4/dAiEoAyKUru4EwoSA73hfVe50AYFXEPwACKhDZIwQx4cTIqsMFHAQQGxDAAMaaY1H9llXHOsdwxD8NAhOxq3NrrUKn83DLsmcCxCFATJDnQojQWRnc0aSq/SkZBhMCkD5cpvAn6z7w1SNiD2E2xqcHe+va8gtl9kwmyGadK8bkis3799GObwiA8AyfGaq+EFhvh+UqsUnQdbjLiHUkm5FBgxBiNU/xoZq2nBoruevEiwSxaPKhoii1FHDc4EZPdSRwZlFm/npGbIL3tc/2Q4BtoeAd44LfqWrx31bVXT7PiU2C2GV9XGF52yjizfw+G9cGuw+oBQXz7KbC3wxhZgVFE/l0hNLztwzhYsqEn/cuRfzuSU2Lu0JMaXTNwOQEcTO65IMOnL5HKOjKpMQkxOq2nEZCyZMhISqvX7Zrwy86tBHSMa+Mg4pNBVW5Iinx3tZgsRD8blokFE9IfiytjkQoJV61pvTrl/HRp+SaNDuGbgluxmUp8YNT75NkfTQjQpYKnuZxuntaIk7nHVdl0uAyWapal21kHEuyZkTQdwa3v7JrCKTENa2F+YaY+kC1UKqT8YaojA1Mvz1PejetulLQitxzP+LaledUh20f5FYg27mAWcHYsJ1MSqyqqlns6+yM3FhbSic3vOgIQ3rGpvWei8EQT0GxIyQbJYEpvS86N2ojAilxfWTl8qnU9zHqGIJ2ho7WKJ3CkcDpWIfeadWXEm8Kls3EtTefAcU6q5HjuQCdHqvjdvpS4oVqU25n5Mba/0snet2gYzR7sH8ziGt+sz7684mot1Jbep34v3lJT2+URbTPUuojP9IZsxPUET+mvriJBIqXxORdepWGd7Tnk79c3HC/3J9IJPxeEodCoeRCL+clTXrsnxfD/nCuTaGpAAAAAElFTkSuQmCC"},MYX5:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=a("Xxa5"),o=a.n(i),e=a("Gu7T"),r=a.n(e),n=a("exGp"),c=a.n(n),h=a("msXN"),l=(h.b,{name:"MyHoney",mixins:[h.b],data:function(){return{honyTab:0,sortTab:3,hasData:!1,honeyNumber:0,sortShow:!1,type:0}},created:function(){this.getHoney(),this.getData()},computed:{isHoney:function(){return this.$route.query.number},scrollHeight:function(){return this.$refs.infoTop.offsetHeight+this.$refs.tabHeight.offsetHeight+this.$refs.bgHeight.offsetHeight}},methods:{shopTab:function(t){this.honyTab!==t&&(this.honyTab=t,this.m_page=0,this.m_loading=!1,this.m_hasMore=!0,this.$refs.delegateScroll.scrollTo(0,0,0,0),0===t?(this.sortShow=!1,this.sortTab=3,this.m_dataList=[],this.type=0,this.getData()):1===t?(this.sortShow=!1,this.sortTab=3,this.m_dataList=[],this.type=1,this.getData()):(this.sortShow=!1,this.sortTab=3,this.m_dataList=[],this.type=3,this.getData()))},goHeader:function(){this.$refs.delegateScroll.scrollTo(0,0,0,0),this.sortShow=!1},sortesTab:function(t){2===this.honyTab&&this.sortTab!==t&&(this.sortTab=t,this.m_page=0,this.m_loading=!1,this.m_hasMore=!0,this.$refs.delegateScroll.scrollTo(0,0,0,0),3===t?(this.sortShow=!1,this.m_dataList=[],this.type=3,this.getData()):4===t&&(this.sortShow=!1,this.m_dataList=[],this.type=2,this.getData()))},getHoney:function(){var t=this;this.$http("integral/my").then(function(s){s.code===t.$ok&&(t.honeyNumber=s.data.credits)})},getData:function(){var t=this;return c()(o.a.mark(function s(){var a,i;return o.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(t.m_hasMore){s.next=2;break}return s.abrupt("return");case 2:return a="integralGoods/list",i={page:++t.m_page,pageSize:t.m_pageSize,sort_type:t.type},s.next=6,t.$http(a,i).then(function(s){s.code===t.$ok&&(t.m_dataList=[].concat(r()(t.m_dataList),r()(s.data.data)),t._checkMore(s.data),t.m_dataList.length||(t.hasData=!0,t.m_hasMore=!0))});case 6:case"end":return s.stop()}},s,t)}))()},ruleShow:function(){this.$router.push("/honey-rule")},goodsDetail:function(t){this.$router.push({name:"ShopDetails",query:{goodsId:t}})},gotoExchange:function(){this.$router.push("/exchange-record")},gotoDetails:function(){this.$router.push("/honey-details")},scroll:function(t){t.y<-this.scrollHeight?this.sortShow=!0:this.sortShow=!1}},activated:function(){this.getHoney()}}),v={render:function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"my-honey-container"},[i("base-header",{attrs:{"is-show-title":!1}},[i("div",{staticClass:"header-center",attrs:{slot:"center"},on:{click:t.goHeader},slot:"center"},[t._v("\n      我的蜂蜜\n    ")])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.sortShow,expression:"sortShow"}],staticClass:"honey-tab-info"},[i("div",{staticClass:"merchant-left-tab",class:{merchantActive:0===t.honyTab},on:{click:function(s){t.shopTab(0)}}},[t._v("综合")]),t._v(" "),i("img",{attrs:{src:a("whxG"),alt:""}}),t._v(" "),i("div",{staticClass:"merchant-center-tab",class:{merchantActive:1===t.honyTab},on:{click:function(s){t.shopTab(1)}}},[t._v("新品")]),t._v(" "),i("img",{attrs:{src:a("whxG"),alt:""}}),t._v(" "),i("div",{staticClass:"merchant-right-tab",class:{merchantActive:2===t.honyTab},on:{click:function(s){t.shopTab(2)}}},[t._v("\n      蜂蜜\n      "),i("div",{staticClass:"arrow"},[i("div",{staticClass:"first-arrow",on:{click:function(s){t.sortesTab(3)}}},[i("div",{staticClass:"arrow-top",class:{upActive:3===t.sortTab}})]),t._v(" "),i("div",{staticClass:"last-arrow",on:{click:function(s){t.sortesTab(4)}}},[i("div",{staticClass:"arrow-bottom",class:{downActive:4===t.sortTab}})])])])]),t._v(" "),i("base-scroll",{ref:"delegateScroll",attrs:{message:"未找到喜欢的商品？可线下到建材采购师体验馆再逛逛哦~",data:t.m_dataList,pullup:t.m_pullup,probeType:3,listenScroll:!0,pulldown:t.m_pulldown,hasLoading:t.m_loading,hasMore:t.m_hasMore,hasRefresh:t.m_refresh},on:{scroll:t.scroll,scrollToEnd:t.getData,pulldown:t.pullDownRefresh}},[i("div",{ref:"infoTop",staticClass:"honey-info-top"},[i("div",{staticClass:"honey-info-container"},[i("div",{staticClass:"honey-images"},[i("img",{attrs:{src:a("sUob"),alt:""}})]),t._v(" "),i("div",{staticClass:"name"},[t._v("我的蜂蜜：")]),t._v(" "),i("div",{staticClass:"price"},[t._v(t._s(t.honeyNumber))])]),t._v(" "),i("div",{staticClass:"rule",on:{click:t.ruleShow}},[t._v("蜂蜜规则")])]),t._v(" "),i("div",{ref:"tabHeight",staticClass:"honey-shop"},[i("div",{staticClass:"shop-left"},[i("img",{attrs:{src:a("JmTt"),alt:""}}),t._v(" "),i("span",{on:{click:t.gotoDetails}},[t._v("蜂蜜明细")])]),t._v(" "),i("div",{staticClass:"shop-right"},[i("img",{attrs:{src:a("Z/Gg"),alt:""}}),t._v(" "),i("span",{on:{click:t.gotoExchange}},[t._v("兑换记录")])])]),t._v(" "),i("div",{ref:"bgHeight",staticClass:"honey-shopping"},[i("img",{attrs:{src:a("4UtU"),alt:""}})]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.sortShow,expression:"!sortShow"}],staticClass:"merchant-tab"},[i("div",{staticClass:"merchant-left-tab",class:{merchantActive:0===t.honyTab},on:{click:function(s){t.shopTab(0)}}},[t._v("综合")]),t._v(" "),i("img",{attrs:{src:a("whxG"),alt:""}}),t._v(" "),i("div",{staticClass:"merchant-center-tab",class:{merchantActive:1===t.honyTab},on:{click:function(s){t.shopTab(1)}}},[t._v("新品")]),t._v(" "),i("img",{attrs:{src:a("whxG"),alt:""}}),t._v(" "),i("div",{staticClass:"merchant-right-tab",class:{merchantActive:2===t.honyTab},on:{click:function(s){t.shopTab(2)}}},[t._v("\n      蜂蜜\n      "),i("div",{staticClass:"arrow"},[i("div",{staticClass:"first-arrow",on:{click:function(s){t.sortesTab(3)}}},[i("div",{staticClass:"arrow-top",class:{upActive:3===t.sortTab}})]),t._v(" "),i("div",{staticClass:"last-arrow",on:{click:function(s){t.sortesTab(4)}}},[i("div",{staticClass:"arrow-bottom",class:{downActive:4===t.sortTab}})])])])]),t._v(" "),i("ul",{staticClass:"honey-hot-list"},t._l(t.m_dataList,function(s){return i("li",{key:s.hot_id,on:{click:function(a){t.goodsDetail(s.id)}}},[i("div",{staticClass:"shop-img"},[i("img",{attrs:{src:s.image,alt:""}})]),t._v(" "),i("p",[t._v(t._s(s.title))]),t._v(" "),i("div",{staticClass:"shop-list-bottom"},[i("div",{staticClass:"honey-images"},[i("img",{attrs:{src:a("az1X"),alt:""}})]),t._v(" "),i("div",{staticClass:"name"},[t._v(t._s(s.integral_sum))]),t._v(" "),i("div",{staticClass:"price"},[t._v("蜂蜜")])])])})),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.hasData,expression:"hasData"}],staticClass:"no-data"},[i("img",{attrs:{src:a("Zbpn"),alt:""}}),t._v(" "),i("p",[t._v("暂无可兑换商品，可线下到体验馆逛逛哦")])])]),t._v(" "),i("base-senior-popup",{ref:"rulePopup",staticClass:"rule-popup",attrs:{height:"auto"}},[i("img",{attrs:{src:a("NRu9"),alt:""}})])],1)},staticRenderFns:[]};var A=a("VU/8")(l,v,!1,function(t){a("jMgP")},null,null);s.default=A.exports},NRu9:function(t,s,a){t.exports=a.p+"static/img/rule.9b87f45.png"},"Z/Gg":function(t,s){t.exports="data:image/png;base64,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"},Zbpn:function(t,s,a){t.exports=a.p+"static/img/kong.7046ddd.png"},jMgP:function(t,s){},whxG:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAoCAYAAADUgSt0AAAAAXNSR0IArs4c6QAAABlJREFUGBljfPHixX8GIGACESAwyqBFIAAAad8EB/x0RKoAAAAASUVORK5CYII="}});