webpackJsonp([143],{1706:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(138),n=i.n(a),o=i(96),r=i(35);e.default={data:function(){return{info:{ratio:"1",text:"专属返佣特权仅开放给认证采购师，点击认证即可进入认证流程，认证申请通过后即可享受特权返佣；此优惠仅限本店使用。此优惠不包含限时抢购、特殊活动商品；最终解释权归商户所有。"}}},mounted:function(){window.nav_alert_back=this.nav_alert_back,window.back=this.back,this.nav(),this.$route.query.one_discount&&(this.info.ratio=this.$route.query.one_discount,this.info.text=this.$route.query.explain)},methods:{back:function(){this.$router.back()},nav:function(){var t={left:[{title:"back",function:"nav_alert_back()"}]};i.i(o.b)(t)},nav_alert_back:function(){var t={title:"提示",message:"您确认放弃特约卡设置吗?",confirm:"back()",cancel:""},e=i.i(r.b)();try{"Android"===e?window.android.nativeAlterBack(n()(t)):"iOS"===e&&window.webkit.messageHandlers.nativeAlertBack.postMessage(t)}catch(t){console.warn(t)}},input:function(){1===this.info.ratio.length&&"0"===this.info.ratio&&(this.info.ratio="1")},submit:function(){var t=this;if(""===this.info.ratio.trim())return void this.$vux.toast.text("请输入返佣比例","middle");this.check()&&(this.$route.query.one_discount?this.$http("card/addCard",{one_discount:this.info.ratio,explain:this.info.text,id:this.$route.query.id}).then(function(e){200===e.code?(t.$vux.toast.text("修改成功","middle"),t.$router.back()):t.$vux.toast.text(e.message,"middle")}):this.$http("card/addCard",{one_discount:this.info.ratio,explain:this.info.text}).then(function(e){200===e.code?(t.$vux.toast.text("添加成功","middle"),t.$router.back()):t.$vux.toast.text(e.message,"middle")}))},check:function(){return/^[1-9]\d?$|^[1-9]\d?\.[1-9]$|0\.[1-9]$/.test(this.info.ratio)?!(this.info.ratio>70)||(this.$vux.toast.text("数字在1~70之间","middle"),!1):(this.$vux.toast.text("请输入0-70的数字，可保留一位小数","middle"),!1)}}}},1910:function(t,e,i){e=t.exports=i(690)(!1),e.push([t.i,".identify-info[data-v-6de95850]{height:100%;background:#fff}.tip[data-v-6de95850]{background:#ffeeda;height:.8rem;line-height:.8rem;color:#ff8a00;padding-left:.4rem}footer[data-v-6de95850]{position:fixed;width:100%;height:1.333333rem;line-height:1.333333rem;bottom:0;left:0;color:#fff;background:#ff8a00;font-size:.426667rem;text-align:center}.title[data-v-6de95850]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;margin-bottom:.32rem}.title span[data-v-6de95850]:first-child{width:2px;height:.346667rem;background:#ff8a00;margin-left:.4rem;margin-right:.16rem}.title span[data-v-6de95850]:nth-child(2){font-size:.373333rem;color:#333;line-height:.533333rem}.title span[data-v-6de95850]:last-child{color:#999;margin-left:.133333rem;line-height:.533333rem}.freedom[data-v-6de95850]{padding:.346667rem 0;border-bottom:.266667rem solid #f4f4f4}.freedom .ratio[data-v-6de95850]{padding-left:.64rem;margin-top:.266667rem}.freedom .ratio span[data-v-6de95850]:last-child{color:#999;line-height:.533333rem}.freedom .input[data-v-6de95850]{padding-left:.64rem;margin-top:.293333rem}.freedom .input span[data-v-6de95850]:first-child{font-size:.373333rem;color:#333;height:.96rem;display:inline-block;line-height:.96rem}.freedom .input input[data-v-6de95850]{margin-left:.213333rem;width:2.666667rem;height:.96rem;border:1px solid #ccc;border-radius:2px}.freedom .input span[data-v-6de95850]{vertical-align:bottom}.freedom .tips[data-v-6de95850]{color:#999;line-height:.453333rem;padding-left:.906667rem;padding-right:.986667rem;margin-top:.586667rem}.freedom .calc[data-v-6de95850]{margin-top:.373333rem;text-align:center;color:red}.explain[data-v-6de95850]{padding-top:.346667rem}.explain .text[data-v-6de95850]{margin-top:.186667rem;position:relative;font-size:.373333rem;line-height:.533333rem;width:9.226667rem;margin:0 auto;color:#ccc}.explain .text textarea[data-v-6de95850]{width:100%;height:3.92rem;border:.013333rem solid #ccc}.explain .text span[data-v-6de95850]{position:absolute;right:.16rem;bottom:.106667rem}",""])},2063:function(t,e,i){var a=i(1910);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i(691)("2c9357c8",a,!0,{})},2234:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"identify-info"},[i("div",{staticClass:"tip"},[t._v("\n    采购师提交认证申请商户审核通过即可享受此优惠\n  ")]),t._v(" "),i("div",{staticClass:"freedom"},[t._m(0),t._v(" "),i("div",{staticClass:"input"},[i("span",[t._v("特约认证返佣百分比")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.info.ratio,expression:"info.ratio"}],ref:"input",attrs:{type:"text",maxlength:"4"},domProps:{value:t.info.ratio},on:{blur:t.check,input:[function(e){e.target.composing||t.$set(t.info,"ratio",e.target.value)},t.input]}}),i("span",[t._v("%")])]),t._v(" "),t._m(1),t._v(" "),i("div",{staticClass:"tips"},[t._v("\n      设置此优惠后，采购师认证通过可在原佣金基础上再累加享受此百分百返佣优惠\n    ")]),t._v(" "),i("div",{staticClass:"calc"},[t._v("\n      认证佣金金额 = （零售底价-原直采价）*（1+店铺返佣百分比%）\n    ")])]),t._v(" "),i("div",{staticClass:"explain"},[t._m(2),t._v(" "),i("div",{staticClass:"text"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.info.text,expression:"info.text"}],attrs:{name:"",id:"",cols:"30",rows:"10",maxlength:"100"},domProps:{value:t.info.text},on:{input:function(e){e.target.composing||t.$set(t.info,"text",e.target.value)}}}),t._v(" "),i("span",[t._v(t._s(t.info.text.length)+"/100")])])]),t._v(" "),i("footer",{on:{click:t.submit}},[t._v("\n    提交\n  ")])])},staticRenderFns:[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"title"},[i("span"),t._v(" "),i("span",[t._v("专属特权")]),t._v(" "),i("span",[t._v("(采购师)")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ratio"},[i("span",[t._v("百分比数值区间为（1%-70%）")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"title"},[i("span"),t._v(" "),i("span",[t._v("特权说明")]),t._v(" "),i("span",{staticStyle:{color:"#FF0000",margin:"0"}},[t._v("*")])])}]}},276:function(t,e,i){function a(t){i(2063)}var n=i(34)(i(1706),i(2234),a,"data-v-6de95850",null);t.exports=n.exports}});