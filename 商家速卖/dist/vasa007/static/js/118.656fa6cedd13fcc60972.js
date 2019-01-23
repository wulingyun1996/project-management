webpackJsonp([118],{1248:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=e(205);t.default={props:{probeType:{type:Number,default:1},click:{type:Boolean,default:!0},listenScroll:{type:Boolean,default:!1},data:{type:Array,default:null},pullup:{type:Boolean,default:!1},pulldown:{type:Boolean,default:!1},beforeScroll:{type:Boolean,default:!1},refreshDelay:{type:Number,default:20},direction:{type:String,default:"vertical"},scrolling:{type:Boolean,default:!1}},mounted:function(){var a=this;setTimeout(function(){a._initScroll(),a.$route.meta.hasOwnProperty("x")&&a.scroll.scrollTo(0,a.$route.meta.y,0)},20)},methods:{_initScroll:function(){var a=this;if(this.$refs.wrapper){if(this.scroll=new i.a(this.$refs.wrapper,{probeType:this.probeType,click:this.click,scrollY:this.freeScroll||"vertical"===this.direction,scrollX:this.freeScroll||"horizontal"===this.direction,freeScroll:this.freeScroll}),this.listenScroll){var t=this;this.scroll.on("scroll",function(a){t.$emit("scroll",a)})}this.pullup&&this.scroll.on("scrollEnd",function(){a.scroll.y<=a.scroll.maxScrollY+50&&a.$emit("scrollToEnd")}),this.scrolling&&this.scroll.on("scrollEnd",function(t){a.$route.meta.y=t.y}),this.pulldown&&this.scroll.on("touchEnd",function(t){t.y>50&&a.$emit("pulldown")}),this.beforeScroll&&this.scroll.on("beforeScrollStart",function(){a.$emit("beforeScroll")})}},disable:function(){this.scroll&&this.scroll.disable()},enable:function(){this.scroll&&this.scroll.enable()},refresh:function(){this.scroll&&this.scroll.refresh()},scrollTo:function(){this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)},scrollToElement:function(){this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)}},watch:{data:function(){var a=this;setTimeout(function(){a.refresh()},this.refreshDelay)}}}},1249:function(a,t){a.exports={render:function(){var a=this,t=a.$createElement;return(a._self._c||t)("div",{ref:"wrapper"},[a._t("default")],2)},staticRenderFns:[]}},1250:function(a,t,e){var i=e(34)(e(1248),e(1249),null,null,null);a.exports=i.exports},1287:function(a,t,e){a.exports=e.p+"static/img/logo-small.581d886.png"},1678:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=e(1250),d=e.n(i),r=e(203);t.default={name:"allianceShopDetail",components:{Scroll:d.a},data:function(){return{detail:{},addr:{}}},computed:{id:function(){return this.$route.params.id}},created:function(){this.getDetail()},methods:{goShopList:function(){this.$router.push("/shop-to-alliance-list/"+this.id)},getDetail:function(){var a=this,t={group_id:this.id};e.i(r.c)("group/getGroupDetail",t).then(function(t){t.code===r.b&&(a.detail=t.data,a.addr=t.data.addr)})}}}},1919:function(a,t,e){t=a.exports=e(690)(!1),t.push([a.i,'.vux-tab[data-v-7c846f4a]{position:relative}[data-dpr="1"] .vux-tab[data-v-7c846f4a]{height:46px}[data-dpr="2"] .vux-tab[data-v-7c846f4a]{height:92px}[data-dpr="3"] .vux-tab[data-v-7c846f4a]{height:138px}.vux-tab[data-v-7c846f4a]:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .vux-tab[data-v-7c846f4a]:after{height:1px}[data-dpr="2"] .vux-tab[data-v-7c846f4a]:after{height:2px}[data-dpr="3"] .vux-tab[data-v-7c846f4a]:after{height:3px}[data-dpr="1"] .vux-tab .vux-tab-item[data-v-7c846f4a]{font-size:15px;line-height:46px}[data-dpr="2"] .vux-tab .vux-tab-item[data-v-7c846f4a]{font-size:30px;line-height:92px}[data-dpr="3"] .vux-tab .vux-tab-item[data-v-7c846f4a]{font-size:45px;line-height:138px}.vux-tab .vux-tab-ink-bar .vux-tab-bar-inner[data-v-7c846f4a]{border-radius:.266667rem;overflow:hidden}[data-dpr="1"] .vux-swipeout-item .vux-swipeout-button[data-v-7c846f4a]{font-size:12px}[data-dpr="2"] .vux-swipeout-item .vux-swipeout-button[data-v-7c846f4a]{font-size:24px}[data-dpr="3"] .vux-swipeout-item .vux-swipeout-button[data-v-7c846f4a]{font-size:36px}.discount .weui-cells input[data-v-7c846f4a]{border:1px solid #dfdfdf;margin-left:.266667rem;border-radius:.066667rem;overflow:hidden;padding-left:.133333rem}[data-dpr="1"] .discount .weui-cells input[data-v-7c846f4a]{height:25px;width:90px}[data-dpr="2"] .discount .weui-cells input[data-v-7c846f4a]{height:50px;width:180px}[data-dpr="3"] .discount .weui-cells input[data-v-7c846f4a]{height:75px;width:270px}.weui-cells[data-v-7c846f4a]{margin-top:0!important}.weui-cells[data-v-7c846f4a]:after,.weui-cells[data-v-7c846f4a]:before{display:none}.weui-cells .weui-cell[data-v-7c846f4a]{padding:0}.weui-cells .weui-textarea[data-v-7c846f4a]{width:100%;height:3.466667rem;border:1px solid #dfdfdf;border-radius:.08rem;overflow:hidden;padding:.24rem}[data-dpr="1"] .weui-cells .weui-textarea[data-v-7c846f4a]{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea[data-v-7c846f4a]{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea[data-v-7c846f4a]{font-size:36px}.weui-cells .weui-textarea-counter[data-v-7c846f4a]{color:#ccc;position:absolute;right:.24rem;bottom:.133333rem}[data-dpr="1"] .weui-cells .weui-textarea-counter[data-v-7c846f4a]{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea-counter[data-v-7c846f4a]{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea-counter[data-v-7c846f4a]{font-size:36px}.weui-cells .weui-textarea-counter span[data-v-7c846f4a]{color:#ff8a00}[data-dpr="1"] .weui-cells .weui-label[data-v-7c846f4a]{font-size:14px;line-height:35px}[data-dpr="2"] .weui-cells .weui-label[data-v-7c846f4a]{font-size:28px;line-height:70px}[data-dpr="3"] .weui-cells .weui-label[data-v-7c846f4a]{font-size:42px;line-height:105px}.weui-cells .weui-input[data-v-7c846f4a]{display:block;width:100%;border:1px solid #ccc;padding:0 .333333rem}[data-dpr="1"] .weui-cells .weui-input[data-v-7c846f4a]{height:35px;font-size:14px}[data-dpr="2"] .weui-cells .weui-input[data-v-7c846f4a]{height:70px;font-size:28px}[data-dpr="3"] .weui-cells .weui-input[data-v-7c846f4a]{height:105px;font-size:42px}.weui-cells .weui-cell__ft[data-v-7c846f4a]{display:none}.weui-cell[data-v-7c846f4a]{height:auto!important}.vux-x-dialog .weui-dialog[data-v-7c846f4a]{width:72%;max-width:72%;border-radius:.533333rem;overflow:hidden;background:#f7f7f7}.vux-x-dialog .weui-dialog .weui-dialog__hd[data-v-7c846f4a]{padding:.56rem 0}.vux-x-dialog .weui-dialog .weui-dialog__title[data-v-7c846f4a]{color:#000}[data-dpr="1"] .vux-x-dialog .weui-dialog .weui-dialog__title[data-v-7c846f4a]{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog .weui-dialog__title[data-v-7c846f4a]{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog .weui-dialog__title[data-v-7c846f4a]{font-size:51px}.vux-x-dialog .vux-prompt[data-v-7c846f4a]{padding-bottom:.48rem}.vux-x-dialog .vux-prompt-msgbox[data-v-7c846f4a]{width:88%;border:1px solid gray;color:#333;padding:.16rem;border-radius:0;overflow:hidden}[data-dpr="1"] .vux-x-dialog .vux-prompt-msgbox[data-v-7c846f4a]{font-size:13px;height:56px}[data-dpr="2"] .vux-x-dialog .vux-prompt-msgbox[data-v-7c846f4a]{font-size:26px;height:112px}[data-dpr="3"] .vux-x-dialog .vux-prompt-msgbox[data-v-7c846f4a]{font-size:39px;height:168px}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft[data-v-7c846f4a]{line-height:45px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft[data-v-7c846f4a]{line-height:90px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft[data-v-7c846f4a]{line-height:135px}.vux-x-dialog .weui-dialog__ft[data-v-7c846f4a]:after{border-width:1px;border-top-color:#09141f}.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default[data-v-7c846f4a],.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary[data-v-7c846f4a]{color:#007aff}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default[data-v-7c846f4a],[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary[data-v-7c846f4a]{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default[data-v-7c846f4a],[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary[data-v-7c846f4a]{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default[data-v-7c846f4a],[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary[data-v-7c846f4a]{font-size:51px}.vux-x-dialog .weui-dialog__btn[data-v-7c846f4a]:after{border-width:1px;border-left-color:#09141f}.big-photo .weui-dialog[data-v-7c846f4a]{width:96%;max-width:96%}.big-photo .weui-dialog img[data-v-7c846f4a]{display:block}.vux-check-icon .weui-icon-success[data-v-7c846f4a]{color:#ff8a00}[data-dpr="1"] .vux-check-icon .weui-icon-success[data-v-7c846f4a]{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-success[data-v-7c846f4a]{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-success[data-v-7c846f4a]{font-size:54px}.vux-check-icon .weui-icon-success[data-v-7c846f4a]:before{color:#ff8a00!important}.vux-check-icon .weui-icon-circle[data-v-7c846f4a]{color:#999}[data-dpr="1"] .vux-check-icon .weui-icon-circle[data-v-7c846f4a]{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-circle[data-v-7c846f4a]{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-circle[data-v-7c846f4a]{font-size:54px}.loading[data-v-7c846f4a]{-webkit-transition:margin-top .38s;transition:margin-top .38s}.loading.show[data-v-7c846f4a]{margin-top:0}.loading.hide[data-v-7c846f4a]{margin-top:-1.2rem;display:none}.publice-goods .publish-item>div[data-v-7c846f4a]{width:100%}.publice-goods .publish-item .weui-textarea[data-v-7c846f4a]{border:none;padding:0;font-family:PingFang SC,STHeitiSC-Light,Helvetica-Light,arial,sans-serif}[data-dpr="1"] .publice-goods .publish-item .weui-textarea[data-v-7c846f4a]{height:60px;font-size:14px}[data-dpr="2"] .publice-goods .publish-item .weui-textarea[data-v-7c846f4a]{height:120px;font-size:28px}[data-dpr="3"] .publice-goods .publish-item .weui-textarea[data-v-7c846f4a]{height:180px;font-size:42px}.publice-goods .publish-item .weui-textarea-counter[data-v-7c846f4a]{bottom:0}.publice-goods .weui-cells[data-v-7c846f4a]{width:100%;height:100%;padding:0;border-right:none}.publice-goods .weui-cells .weui-cell[data-v-7c846f4a]{height:100%}.publice-goods .weui-cells .weui-input[data-v-7c846f4a]{border:none;text-align:right}[data-dpr="1"] .publice-goods .weui-cells .weui-input[data-v-7c846f4a]{height:24px}[data-dpr="2"] .publice-goods .weui-cells .weui-input[data-v-7c846f4a]{height:48px}[data-dpr="3"] .publice-goods .weui-cells .weui-input[data-v-7c846f4a]{height:72px}.picker-singer .scroller-component[data-v-7c846f4a]{background:#fff}[data-dpr="1"] .picker-singer .scroller-component[data-v-7c846f4a]{height:135px}[data-dpr="2"] .picker-singer .scroller-component[data-v-7c846f4a]{height:270px}[data-dpr="3"] .picker-singer .scroller-component[data-v-7c846f4a]{height:405px}.picker-singer .scroller-indicator[data-v-7c846f4a]{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);position:relative}[data-dpr="1"] .picker-singer .scroller-indicator[data-v-7c846f4a]{height:45px}[data-dpr="2"] .picker-singer .scroller-indicator[data-v-7c846f4a]{height:90px}[data-dpr="3"] .picker-singer .scroller-indicator[data-v-7c846f4a]{height:135px}.picker-singer .scroller-indicator[data-v-7c846f4a]:before{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;top:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator[data-v-7c846f4a]:before{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator[data-v-7c846f4a]:before{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator[data-v-7c846f4a]:before{height:3px}.picker-singer .scroller-indicator[data-v-7c846f4a]:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator[data-v-7c846f4a]:after{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator[data-v-7c846f4a]:after{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator[data-v-7c846f4a]:after{height:3px}.picker-singer .scroller-content .scroller-item[data-v-7c846f4a]{color:#bcbcbc}[data-dpr="1"] .picker-singer .scroller-content .scroller-item[data-v-7c846f4a]{font-size:15px;height:45px;line-height:45px}[data-dpr="2"] .picker-singer .scroller-content .scroller-item[data-v-7c846f4a]{font-size:30px;height:90px;line-height:90px}[data-dpr="3"] .picker-singer .scroller-content .scroller-item[data-v-7c846f4a]{font-size:45px;height:135px;line-height:135px}.picker-singer .scroller-content .scroller-item.scroller-item-selected[data-v-7c846f4a]{color:#000}.commodity-spec .weui-cells .weui-input[data-v-7c846f4a]{border-color:gray;padding-left:.16rem}.weui-toast .weui-toast__content[data-v-7c846f4a]{padding:.346667rem .4rem!important}[data-dpr="1"] .weui-toast .weui-toast__content[data-v-7c846f4a]{font-size:15px;border-right:5px}[data-dpr="2"] .weui-toast .weui-toast__content[data-v-7c846f4a]{font-size:30px;border-right:10px}[data-dpr="3"] .weui-toast .weui-toast__content[data-v-7c846f4a]{font-size:45px;border-right:15px}.interval-quotation .weui-cells[data-v-7c846f4a]{position:relative;overflow:inherit}[data-dpr="1"] .interval-quotation .weui-cells .weui-input[data-v-7c846f4a]{height:32px}[data-dpr="2"] .interval-quotation .weui-cells .weui-input[data-v-7c846f4a]{height:64px}[data-dpr="3"] .interval-quotation .weui-cells .weui-input[data-v-7c846f4a]{height:96px}.scroller-mask[data-v-7c846f4a]{background:none!important}.manager-management .vux-swipeout-button-warn[data-v-7c846f4a]{background:#ff8a00}.manager-list .vux-swipeout-item[data-v-7c846f4a]{position:relative}[data-dpr="1"] .manager-list .vux-swipeout-item[data-v-7c846f4a]{height:70px}[data-dpr="2"] .manager-list .vux-swipeout-item[data-v-7c846f4a]{height:140px}[data-dpr="3"] .manager-list .vux-swipeout-item[data-v-7c846f4a]{height:210px}.manager-list .vux-swipeout-item[data-v-7c846f4a]:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .manager-list .vux-swipeout-item[data-v-7c846f4a]:after{height:1px}[data-dpr="2"] .manager-list .vux-swipeout-item[data-v-7c846f4a]:after{height:2px}[data-dpr="3"] .manager-list .vux-swipeout-item[data-v-7c846f4a]:after{height:3px}.manager-list .vux-swipeout-item .vux-swipeout-content>div[data-v-7c846f4a],.manager-list .vux-swipeout-item>div[data-v-7c846f4a]{height:100%}[data-dpr="1"] .shop-manage .vux-tab-wrap[data-v-7c846f4a]{height:46px}[data-dpr="2"] .shop-manage .vux-tab-wrap[data-v-7c846f4a]{height:92px}[data-dpr="3"] .shop-manage .vux-tab-wrap[data-v-7c846f4a]{height:138px}.vux-tab-wrap[data-v-7c846f4a]{padding-top:0}[data-dpr="1"] .vux-tab-wrap .vux-tab-container[data-v-7c846f4a]{height:46px}[data-dpr="2"] .vux-tab-wrap .vux-tab-container[data-v-7c846f4a]{height:92px}[data-dpr="3"] .vux-tab-wrap .vux-tab-container[data-v-7c846f4a]{height:138px}.special-content .pull-list .weui-cells[data-v-7c846f4a]{width:auto;padding:.4rem .266667rem;border-right:none}.set-telephone .text-input .weui-cells[data-v-7c846f4a]{width:100%;height:100%;border-right:none}.set-telephone .text-input .weui-cells .weui-input[data-v-7c846f4a]{border:1px solid #ccc}.me-answer .answer-text .weui-cells[data-v-7c846f4a]{height:100%;width:100%;border-right:none}#shopset .weui-cells[data-v-7c846f4a],.card-mana .weui-cells[data-v-7c846f4a]{width:100%;height:100%;padding:0;border-right:none}.addressbox .weui-cells[data-v-7c846f4a]{width:100%;padding:0}[data-dpr="1"] .addressbox .weui-cells[data-v-7c846f4a]{height:44px;line-height:44px}[data-dpr="2"] .addressbox .weui-cells[data-v-7c846f4a]{height:88px;line-height:88px}[data-dpr="3"] .addressbox .weui-cells[data-v-7c846f4a]{height:132px;line-height:132px}[data-dpr="1"] .time-begin .weui-cells[data-v-7c846f4a],[data-dpr="1"] .time-end .weui-cells[data-v-7c846f4a]{font-size:14px}[data-dpr="2"] .time-begin .weui-cells[data-v-7c846f4a],[data-dpr="2"] .time-end .weui-cells[data-v-7c846f4a]{font-size:28px}[data-dpr="3"] .time-begin .weui-cells[data-v-7c846f4a],[data-dpr="3"] .time-end .weui-cells[data-v-7c846f4a]{font-size:42px}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft[data-v-7c846f4a],.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft[data-v-7c846f4a]{display:block;text-align:left}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft[data-v-7c846f4a]:after,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft[data-v-7c846f4a]:after{content:unset}.time-begin .weui-cells .vux-datetime.weui-cell>div:first-child p[data-v-7c846f4a],.time-end .weui-cells .vux-datetime.weui-cell>div:first-child p[data-v-7c846f4a]{color:#ccc}.vux-swipeout .vux-swipeout-item .vux-swipeout-button-box button.vux-swipeout-button[data-v-7c846f4a]{padding:2px;background-origin:content-box;background-clip:content-box}.container .alliance-list-wrapper[data-v-7c846f4a]{height:100%;background:#fff;overflow:hidden;padding-top:.64rem;padding-left:.853333rem;color:#333}[data-dpr="1"] .container .alliance-list-wrapper[data-v-7c846f4a]{font-size:14px}[data-dpr="2"] .container .alliance-list-wrapper[data-v-7c846f4a]{font-size:28px}[data-dpr="3"] .container .alliance-list-wrapper[data-v-7c846f4a]{font-size:42px}.container .group[data-v-7c846f4a]{margin-bottom:.4rem;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.container .group.pic[data-v-7c846f4a]{-webkit-box-align:start;-webkit-align-items:flex-start;align-items:flex-start}.container .group .label[data-v-7c846f4a]{width:2.666667rem;height:.533333rem;line-height:.533333rem;text-align:right}.container .group .logo[data-v-7c846f4a]{width:2.453333rem;height:2.453333rem;border-radius:.266667rem;overflow:hidden}.container .group .logo img[data-v-7c846f4a]{width:100%;height:100%}.btn_look[data-v-7c846f4a]{height:.693333rem;line-height:.693333rem;margin-left:.426667rem;background:#ff8a00;padding:0 .426667rem;border-radius:.133333rem;overflow:hidden;color:#fff}[data-dpr="1"] .btn_look[data-v-7c846f4a]{font-size:12px}[data-dpr="2"] .btn_look[data-v-7c846f4a]{font-size:24px}[data-dpr="3"] .btn_look[data-v-7c846f4a]{font-size:36px}.use[data-v-7c846f4a]{color:#46b308}.disable[data-v-7c846f4a]{color:red}',""])},2072:function(a,t,e){var i=e(1919);"string"==typeof i&&(i=[[a.i,i,""]]),i.locals&&(a.exports=i.locals);e(691)("af07f1e6",i,!0,{})},2243:function(a,t,e){a.exports={render:function(){var a=this,t=a.$createElement,i=a._self._c||t;return i("div",{staticClass:"container"},[i("scroll",{staticClass:"alliance-list-wrapper",attrs:{scrolling:!0,pulldown:!0}},[i("div",{staticClass:"srcoll-container"},[i("div",{staticClass:"group"},[i("span",{staticClass:"label"},[a._v("商圈名称：")]),a._v(" "),i("span",[a._v(a._s(a.detail.union_name))])]),a._v(" "),i("div",{staticClass:"group"},[i("span",{staticClass:"label"},[a._v("圈内商家：")]),a._v(" "),i("span",[a._v(a._s(a.detail.sellerCount)+" "),i("input",{staticClass:"btn_look",attrs:{type:"button",value:"查看"},on:{click:a.goShopList}})])]),a._v(" "),i("div",{staticClass:"group pic"},[i("span",{staticClass:"label"},[a._v("商圈LOGO：")]),a._v(" "),i("span",{staticClass:"logo"},[a.detail.image?i("img",{attrs:{src:a.detail.image,alt:""}}):i("img",{attrs:{src:e(1287),alt:""}})])]),a._v(" "),i("div",{staticClass:"group"},[i("span",{staticClass:"label"},[a._v("服务城市：")]),a._v(" "),i("span",[a._v(a._s(a.addr.province))]),a._v("  \n        "),i("span",[a._v(a._s(a.addr.city))]),a._v("  \n        "),i("span",[a._v(a._s(a.addr.area))])]),a._v(" "),i("div",{staticClass:"group"},[i("span",{staticClass:"label"},[a._v("状态：")]),a._v(" "),i("span",{class:[{disable:3===a.detail.status},"use"]},[a._v(a._s(a.detail.status_str))])]),a._v(" "),i("div",{staticClass:"group"},[i("span",{staticClass:"label"},[a._v("创建时间：")]),a._v(" "),i("span",[a._v(a._s(a.detail.created_at))])])])])],1)},staticRenderFns:[]}},248:function(a,t,e){function i(a){e(2072)}var d=e(34)(e(1678),e(2243),i,"data-v-7c846f4a",null);a.exports=d.exports}});