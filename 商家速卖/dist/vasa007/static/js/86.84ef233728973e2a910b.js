webpackJsonp([86,505],{1257:function(a,t,e){function d(a){e(1260)}var i=e(34)(e(1258),e(1261),d,null,null);a.exports=i.exports},1258:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{title:{type:String}},data:function(){return{flag:!1}},methods:{show:function(){this.flag=!0},hide:function(){var a=this;setTimeout(function(){a.flag=!1},2e3)}}}},1259:function(a,t,e){t=a.exports=e(690)(!1),t.push([a.i,'.pop{max-width:56%;padding:.266667rem .4rem;letter-spacing:1px;line-height:1.3;text-align:center;color:#fff;background:rgba(0,0,0,.6);position:absolute;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);z-index:300}[data-dpr="1"] .pop{font-size:15px;border-radius:5px;bottom:89px}[data-dpr="2"] .pop{font-size:30px;border-radius:10px;bottom:178px}[data-dpr="3"] .pop{font-size:45px;border-radius:15px;bottom:267px}',""])},1260:function(a,t,e){var d=e(1259);"string"==typeof d&&(d=[[a.i,d,""]]),d.locals&&(a.exports=d.locals);e(691)("0f86f12f",d,!0,{})},1261:function(a,t){a.exports={render:function(){var a=this,t=a.$createElement;return(a._self._c||t)("div",{directives:[{name:"show",rawName:"v-show",value:a.flag,expression:"flag"}],staticClass:"pop"},[a._v(a._s(a.title))])},staticRenderFns:[]}},1352:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:["text"],methods:{footBtnClick:function(){this.$emit("footBtnClick")}}}},1355:function(a,t,e){t=a.exports=e(690)(!1),t.push([a.i,'.foot-btn{position:fixed;bottom:0;left:0;right:0;text-align:center;background:#ff8a00;color:#fff}[data-dpr="1"] .foot-btn{height:44px;line-height:44px;font-size:18px}[data-dpr="2"] .foot-btn{height:88px;line-height:88px;font-size:36px}[data-dpr="3"] .foot-btn{height:132px;line-height:132px;font-size:54px}',""])},1357:function(a,t,e){var d=e(1355);"string"==typeof d&&(d=[[a.i,d,""]]),d.locals&&(a.exports=d.locals);e(691)("e62ed1d2",d,!0,{})},1365:function(a,t){a.exports={render:function(){var a=this,t=a.$createElement;return(a._self._c||t)("div",{staticClass:"foot-btn",on:{click:a.footBtnClick}},[a._v("\n  "+a._s(a.text)+"\n")])},staticRenderFns:[]}},1366:function(a,t,e){function d(a){e(1357)}var i=e(34)(e(1352),e(1365),d,null,null);a.exports=i.exports},1715:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var d=e(1366),i=e.n(d),n=e(1257),o=e.n(n),s=e(96),r=e(203);t.default={data:function(){return{inputCard:"",mess:"",messOne:"",messObj:{},noHas:!0,timerId:""}},filters:{hiddenFour:function(a){if(a){return a.substr(0,3)+"****"+a.substr(7)}}},computed:{errShow:function(){return!this.inputCard||!!this.noHas},trueShow:function(){return!this.noHas}},created:function(){window.nav_back=this.nav_back,this.nav()},methods:{nav_back:function(){e.i(s.c)()},nav:function(){var a={left:[{title:"back",function:"nav_back()"}]};e.i(s.b)(a)},isTrue:function(){var a=this;this.inputCard?(clearTimeout(this.timerId),this.timerId=setTimeout(function(){var t={active_id:a.$route.params.id,card_number:a.inputCard};e.i(r.a)("tally/hasTicket",t).then(function(t){t.code===r.e&&(a.messOne="该卡号不存在",a.noHas=!0),t.code===r.b&&(a.messObj=t.data,a.noHas=!1)})},500)):this.messOne="请输入卡号"},showMess:function(a){var t=this;this.mess=a,this.$refs.pop.show(),setTimeout(function(){t.$refs.pop.hide()},200)},isCheck:function(){return this.inputCard?!this.noHas||(this.messOne="该卡号不存在",!1):(this.messOne="请输入卡号",!1)},footBtnClick:function(){var a=this;if(this.isCheck()){var t={active_id:this.$route.params.id,card_number:this.inputCard};e.i(r.a)("tally/addSign",t).then(function(t){t.code===r.b&&(a.showMess("签到成功"),a.$route.meta.hasDone=!0,setTimeout(function(){a.$router.back()},1e3)),t.code===r.d&&a.showMess("该卡号已签到"),t.code===r.e&&a.showMess("该卡号不存在")})}return!1}},components:{FootBtn:i.a,Pop:o.a}}},1873:function(a,t,e){var d=e(692);t=a.exports=e(690)(!1),t.push([a.i,'.add-manager[data-v-44a5ec1e]{position:fixed;left:0;top:0;bottom:0;right:0;z-index:200}.add-manager .add-box[data-v-44a5ec1e]{position:absolute;top:0;left:0;right:0;background:#fff;padding:1.066667rem .88rem 0}[data-dpr="1"] .add-manager .add-box[data-v-44a5ec1e]{bottom:44px}[data-dpr="2"] .add-manager .add-box[data-v-44a5ec1e]{bottom:88px}[data-dpr="3"] .add-manager .add-box[data-v-44a5ec1e]{bottom:132px}.add-manager .add-box>div[data-v-44a5ec1e]{width:100%;position:relative}.add-manager .add-box>div .err-show[data-v-44a5ec1e]{line-height:.56rem;position:absolute;left:.426667rem;bottom:-.533333rem;color:red;padding-left:.373333rem;background:url('+d(e(941))+') no-repeat 0}[data-dpr="1"] .add-manager .add-box>div .err-show[data-v-44a5ec1e]{font-size:12px;background-size:10px 10px}[data-dpr="2"] .add-manager .add-box>div .err-show[data-v-44a5ec1e]{font-size:24px;background-size:20px 20px}[data-dpr="3"] .add-manager .add-box>div .err-show[data-v-44a5ec1e]{font-size:36px;background-size:30px 30px}.add-manager .add-box>div .mess-show[data-v-44a5ec1e]{padding:.373333rem;position:absolute;width:100%;left:0}[data-dpr="1"] .add-manager .add-box>div .mess-show[data-v-44a5ec1e]{font-size:14px}[data-dpr="2"] .add-manager .add-box>div .mess-show[data-v-44a5ec1e]{font-size:28px}[data-dpr="3"] .add-manager .add-box>div .mess-show[data-v-44a5ec1e]{font-size:42px}.add-manager .add-box>div .mess-show p[data-v-44a5ec1e]{margin-bottom:.08rem}.add-manager .add-box>div .mess-show span[data-v-44a5ec1e]{display:inline-block;width:1.533333rem;white-space:nowrap}.add-manager .add-box .add-input[data-v-44a5ec1e]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.add-manager .add-box .add-input label[data-v-44a5ec1e]{display:block;width:20%}[data-dpr="1"] .add-manager .add-box .add-input label[data-v-44a5ec1e]{font-size:14px}[data-dpr="2"] .add-manager .add-box .add-input label[data-v-44a5ec1e]{font-size:28px}[data-dpr="3"] .add-manager .add-box .add-input label[data-v-44a5ec1e]{font-size:42px}.add-manager .add-box .add-input input[data-v-44a5ec1e]{display:block;-webkit-box-flex:1;-webkit-flex:1;flex:1;border:1px solid #ccc;padding-left:.533333rem}[data-dpr="1"] .add-manager .add-box .add-input input[data-v-44a5ec1e]{height:44px}[data-dpr="2"] .add-manager .add-box .add-input input[data-v-44a5ec1e]{height:88px}[data-dpr="3"] .add-manager .add-box .add-input input[data-v-44a5ec1e]{height:132px}.gray[data-v-44a5ec1e]{background:#bcbcbc}.gray.orange[data-v-44a5ec1e]{background:#ff8a00}',""])},2026:function(a,t,e){var d=e(1873);"string"==typeof d&&(d=[[a.i,d,""]]),d.locals&&(a.exports=d.locals);e(691)("5c21bb9a",d,!0,{})},2197:function(a,t){a.exports={render:function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"add-manager"},[e("div",{staticClass:"add-box"},[e("div",[e("div",{staticClass:"add-input"},[e("input",{directives:[{name:"model",rawName:"v-model",value:a.inputCard,expression:"inputCard"}],attrs:{type:"text",placeholder:"请输入卡号",name:"name"},domProps:{value:a.inputCard},on:{keyup:a.isTrue,input:function(t){t.target.composing||(a.inputCard=t.target.value)}}})]),a._v(" "),e("p",{directives:[{name:"show",rawName:"v-show",value:a.errShow,expression:"errShow"}],staticClass:"err-show"},[a._v(a._s(a.messOne))]),a._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:a.trueShow,expression:"trueShow"}],staticClass:"mess-show"},[e("p",[e("span",[a._v("姓名：")]),a._v(a._s(a.messObj.name))]),a._v(" "),e("p",[e("span",[a._v("手机号：")]),a._v(a._s(a._f("hiddenFour")(a.messObj.mobile)))])])])]),a._v(" "),e("foot-btn",{staticClass:"gray",class:{orange:a.trueShow},attrs:{text:"确认"},on:{footBtnClick:a.footBtnClick}}),a._v(" "),e("pop",{ref:"pop",attrs:{title:a.mess}})],1)},staticRenderFns:[]}},285:function(a,t,e){function d(a){e(2026)}var i=e(34)(e(1715),e(2197),d,"data-v-44a5ec1e",null);a.exports=i.exports},941:function(a,t){a.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNC0xN1QxMTo0OTowNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDQtMTdUMTE6NDk6MTMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDQtMTdUMTE6NDk6MTMrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRCMDE0ODU2NDFGMjExRTg4NERFQzY3MkVDNkU0RTczIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRCMDE0ODU3NDFGMjExRTg4NERFQzY3MkVDNkU0RTczIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEIwMTQ4NTQ0MUYyMTFFODg0REVDNjcyRUM2RTRFNzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEIwMTQ4NTU0MUYyMTFFODg0REVDNjcyRUM2RTRFNzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4AQ0H1AAABYUlEQVR42qyVz07CQBDGp9TgSe6gxz4Hz4DacsHn0CfAxHDQxL4AFy/+eQVunDx58WAITTThSCimgSayzJBZ3NbdLcRO8uu222++bjubKQgA0FBF2sgDMkaWyBx557mANX9ydWanyAciiLTbFXEcb6Frvkeas3x+BX7DRW6QF8STk85sBoYgzTPnuHLyQBFcI5f5LGc6hYKQOVegrNDXmemiEkUmU18aVpFb+H/ckRcZBshJCYbHSJsMW9ZXHAz2MW1RqSO5RUyo22bleTZt5OBhgc6HtsfO43h7flSr2aQpvXIKJQYZTkr0m5DhW5HKSZJdDV+pKJ2iouzBhewsnzbhot8XyXC4GS26L0HF5S4RmITLMMxsG4tpoHabR6Sn+yirRiN7Xa/rZD32yPQyF7nPP5k28vdotFkdjT/NZn5lIecaG+y52mAtkMbfpWPLQlH1n/gXkDJjnuuYfgFrAQYACA9pirfq8DMAAAAASUVORK5CYII="}});