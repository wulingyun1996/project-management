webpackJsonp([67,631],{1325:function(i,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t(207);e.default={props:{probeType:{type:Number,default:1},click:{type:Boolean,default:!0},listenScroll:{type:Boolean,default:!1},data:{type:Array,default:null},pullup:{type:Boolean,default:!1},pulldown:{type:Boolean,default:!1},beforeScroll:{type:Boolean,default:!1},refreshDelay:{type:Number,default:20},direction:{type:String,default:"vertical"},scrolling:{type:Boolean,default:!1}},mounted:function(){var i=this;setTimeout(function(){i._initScroll(),i.$route.meta.hasOwnProperty("x")&&i.scroll.scrollTo(0,i.$route.meta.y,0)},20)},methods:{_initScroll:function(){var i=this;if(this.$refs.wrapper){if(this.scroll=new a.a(this.$refs.wrapper,{probeType:this.probeType,click:this.click,scrollY:this.freeScroll||"vertical"===this.direction,scrollX:this.freeScroll||"horizontal"===this.direction,freeScroll:this.freeScroll}),this.listenScroll){var e=this;this.scroll.on("scroll",function(i){e.$emit("scroll",i)})}this.pullup&&this.scroll.on("scrollEnd",function(){i.scroll.y<=i.scroll.maxScrollY+50&&i.$emit("scrollToEnd")}),this.scrolling&&this.scroll.on("scrollEnd",function(e){i.$route.meta.y=e.y}),this.pulldown&&this.scroll.on("touchEnd",function(e){e.y>50&&i.$emit("pulldown")}),this.beforeScroll&&this.scroll.on("beforeScrollStart",function(){i.$emit("beforeScroll")})}},disable:function(){this.scroll&&this.scroll.disable()},enable:function(){this.scroll&&this.scroll.enable()},refresh:function(){this.scroll&&this.scroll.refresh()},scrollTo:function(){this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)},scrollToElement:function(){this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)}},watch:{data:function(){var i=this;setTimeout(function(){i.refresh()},this.refreshDelay)}}}},1326:function(i,e){i.exports={render:function(){var i=this,e=i.$createElement;return(i._self._c||e)("div",{ref:"wrapper"},[i._t("default")],2)},staticRenderFns:[]}},1327:function(i,e,t){var a=t(35)(t(1325),t(1326),null,null,null);i.exports=a.exports},1370:function(i,e,t){"use strict";e.a={hasClass:function(i,e){return new RegExp("(\\s|^)"+e+"(\\s|$)").test(i.className)},addClass:function(i,e){i&&(i.classList?i.classList.add(e):this.hasClass(i,e)||(i.className+=""+e))},removeClass:function(i,e){i&&(i.classList?i.classList.remove(e):this.hasClass(i,e)&&(i.className=i.className.replace(new RegExp("(\\s|^)"+e+"(\\s|$)")," ").replace(/^\s+|\s+$/g,"")))}}},1371:function(i,e,t){e=i.exports=t(707)(!1),e.push([i.i,".vux-modal-open{overflow:hidden;position:fixed;width:100%}.vux-modal-open-for-container{overflow:hidden!important}",""])},1459:function(i,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t(1461);e.default={mixins:[a.a],name:"x-dialog",model:{prop:"show",event:"change"},props:{show:{type:Boolean,default:!1},maskTransition:{type:String,default:"vux-mask"},maskZIndex:[String,Number],dialogTransition:{type:String,default:"vux-dialog"},dialogClass:{type:String,default:"weui-dialog"},hideOnBlur:Boolean,dialogStyle:Object,scroll:{type:Boolean,default:!0,validator:function(i){return!0}}},computed:{maskStyle:function(){if(void 0!==this.maskZIndex)return{zIndex:this.maskZIndex}}},mounted:function(){"undefined"!=typeof window&&window.VUX_CONFIG&&"VIEW_BOX"===window.VUX_CONFIG.$layout&&(this.layout="VIEW_BOX")},watch:{show:function(i){this.$emit("update:show",i),this.$emit(i?"on-show":"on-hide"),i?this.addModalClassName():this.removeModalClassName()}},methods:{shouldPreventScroll:function(){var i=/iPad|iPhone|iPod/i.test(window.navigator.userAgent),e=this.$el.querySelector("input")||this.$el.querySelector("textarea");if(i&&e)return!0},hide:function(){this.hideOnBlur&&(this.$emit("update:show",!1),this.$emit("change",!1),this.$emit("on-click-mask"))}},data:function(){return{layout:""}}}},1461:function(i,e,t){"use strict";var a=t(1370);e.a={methods:{getLayout:function(){return"undefined"!=typeof window&&window.VUX_CONFIG&&"VIEW_BOX"===window.VUX_CONFIG.$layout?"VIEW_BOX":""},addModalClassName:function(){"function"==typeof this.shouldPreventScroll&&this.shouldPreventScroll()||"VIEW_BOX"===this.getLayout()&&(a.a.addClass(document.body,"vux-modal-open"),a.a.addClass(document.querySelector("#vux_view_box_body"),"vux-modal-open-for-container"))},removeModalClassName:function(){"VIEW_BOX"===this.getLayout()&&(a.a.removeClass(document.body,"vux-modal-open"),a.a.removeClass(document.querySelector("#vux_view_box_body"),"vux-modal-open-for-container"))}},beforeDestroy:function(){this.removeModalClassName()},deactivated:function(){this.removeModalClassName()}}},1463:function(i,e,t){e=i.exports=t(707)(!1),e.i(t(1371),""),e.push([i.i,'.vux-fade-enter-active,.vux-fade-leave-active{opacity:1;-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.vux-fade-enter,.vux-fade-leave-to{opacity:0}.vux-dialog-enter-active{-webkit-animation:vux-dialog-in .5s;animation:vux-dialog-in .5s}.vux-dialog-leave-active{-webkit-animation:vux-dialog-out .3s;animation:vux-dialog-out .3s}@-webkit-keyframes vux-dialog-in{0%{-webkit-transform:scale(1.185);transform:scale(1.185);opacity:0}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes vux-dialog-in{0%{-webkit-transform:scale(1.185);transform:scale(1.185);opacity:0}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes vux-dialog-out{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}to{-webkit-transform:scale(.85);transform:scale(.85);opacity:0}}@keyframes vux-dialog-out{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}to{-webkit-transform:scale(.85);transform:scale(.85);opacity:0}}.vux-mask-enter,.vux-mask-leave-active{opacity:0}.vux-mask-enter-active,.vux-mask-leave-active{-webkit-transition:opacity .3s;transition:opacity .3s}.weui-mask{background:rgba(0,0,0,.6)}.weui-mask,.weui-mask_transparent{position:fixed;z-index:1000;top:0;right:0;left:0;bottom:0}.weui-dialog{position:fixed;display:table;z-index:5000;width:80%;max-width:300px;top:0;right:0;bottom:0;left:0;margin:auto;background-color:#fff;text-align:center;border-radius:3px;overflow:hidden}.weui-dialog__hd{padding:1.3em 1.6em .5em}.weui-dialog__hd.with-no-content{padding:1.7em 1.6em}.weui-dialog__title{font-weight:400;font-size:18px}.weui-dialog__bd{padding:0 1.6em .8em;min-height:40px;font-size:15px;line-height:1.3;word-wrap:break-word;word-break:break-all;color:#999}.weui-dialog__bd:first-child{padding:2.7em 20px 1.7em;color:#353535}.weui-dialog__ft{position:relative;line-height:48px;font-size:18px;display:-webkit-box;display:-webkit-flex;display:flex}.weui-dialog__ft:after{content:" ";position:absolute;left:0;top:0;right:0;height:1px;border-top:1px solid #d5d5d6;color:#d5d5d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(.5);transform:scaleY(.5)}.weui-dialog__btn{display:block;-webkit-box-flex:1;-webkit-flex:1;flex:1;color:#3cc51f;text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);position:relative}.weui-dialog__btn:active{background-color:#eee}.weui-dialog__btn:after{content:" ";position:absolute;left:0;top:0;width:1px;bottom:0;border-left:1px solid #d5d5d6;color:#d5d5d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(.5);transform:scaleX(.5)}.weui-dialog__btn:first-child:after{display:none}.weui-dialog__btn_default{color:#353535}.weui-dialog__btn_primary{color:#0bb20c}.weui-dialog__btn_warn{color:#e64340}.weui-skin_android .weui-dialog{text-align:left;box-shadow:0 6px 30px 0 rgba(0,0,0,.1)}.weui-skin_android .weui-dialog__title{font-size:21px}.weui-skin_android .weui-dialog__hd{text-align:left}.weui-skin_android .weui-dialog__bd{color:#999;padding:.25em 1.6em 2em;font-size:17px;text-align:left}.weui-skin_android .weui-dialog__bd:first-child{padding:1.6em 1.6em 2em;color:#353535}.weui-skin_android .weui-dialog__ft{display:block;text-align:right;line-height:42px;font-size:16px;padding:0 1.6em .7em}.weui-skin_android .weui-dialog__ft:after{display:none}.weui-skin_android .weui-dialog__btn{display:inline-block;vertical-align:top;padding:0 .8em}.weui-skin_android .weui-dialog__btn:after{display:none}.weui-skin_android .weui-dialog__btn:active,.weui-skin_android .weui-dialog__btn:visited{background-color:rgba(0,0,0,.06)}.weui-skin_android .weui-dialog__btn:last-child{margin-right:-.8em}.weui-skin_android .weui-dialog__btn_default{color:gray}@media screen and (min-width:1024PX){.weui-dialog{width:35%}}.vux-x-dialog-absolute .weui-dialog{position:absolute}',""])},1466:function(i,e,t){var a=t(1463);"string"==typeof a&&(a=[[i.i,a,""]]),a.locals&&(i.exports=a.locals);t(708)("5ac6b10e",a,!0,{})},1471:function(i,e){i.exports={render:function(){var i=this,e=i.$createElement,t=i._self._c||e;return t("div",{staticClass:"vux-x-dialog",class:{"vux-x-dialog-absolute":"VIEW_BOX"===i.layout}},[t("transition",{attrs:{name:i.maskTransition}},[t("div",{directives:[{name:"show",rawName:"v-show",value:i.show,expression:"show"}],staticClass:"weui-mask",style:i.maskStyle,on:{click:i.hide}})]),i._v(" "),t("transition",{attrs:{name:i.dialogTransition}},[t("div",{directives:[{name:"show",rawName:"v-show",value:i.show,expression:"show"}],class:i.dialogClass,style:i.dialogStyle},[i._t("default")],2)])],1)},staticRenderFns:[]}},1477:function(i,e,t){function a(i){t(1466)}var o=t(35)(t(1459),t(1471),a,null,null);i.exports=o.exports},1499:function(i,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t(1477),o=t.n(a);e.default={name:"confirm",components:{XDialog:o.a},props:{value:{type:Boolean,default:!1},showInput:{type:Boolean,default:!1},placeholder:{type:String,default:""},theme:{type:String,default:"ios"},hideOnBlur:{type:Boolean,default:!1},title:String,confirmText:String,cancelText:String,maskTransition:{type:String,default:"vux-fade"},maskZIndex:[Number,String],dialogTransition:{type:String,default:"vux-dialog"},content:String,closeOnConfirm:{type:Boolean,default:!0},inputAttrs:Object,showContent:{type:Boolean,default:!0},confirmType:{type:String,default:"primary"},showCancelButton:{type:Boolean,default:!0},showConfirmButton:{type:Boolean,default:!0}},created:function(){this.showValue=this.show,this.value&&(this.showValue=this.value)},watch:{value:function(i){this.showValue=i},showValue:function(i){var e=this;this.$emit("input",i),i&&(this.showInput&&(this.msg="",setTimeout(function(){e.$refs.input&&e.setInputFocus()},300)),this.$emit("on-show"))}},data:function(){return{msg:"",showValue:!1}},methods:{getInputAttrs:function(){return this.inputAttrs||{type:"text"}},setInputValue:function(i){this.msg=i},setInputFocus:function(i){i&&i.preventDefault(),this.$refs.input.focus()},_onConfirm:function(){this.showValue&&(this.closeOnConfirm&&(this.showValue=!1),this.$emit("on-confirm",this.msg))},_onCancel:function(){this.showValue&&(this.showValue=!1,this.$emit("on-cancel"))}}}},1505:function(i,e,t){e=i.exports=t(707)(!1),e.push([i.i,'.vux-fade-enter-active,.vux-fade-leave-active{opacity:1;-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.vux-fade-enter,.vux-fade-leave-to{opacity:0}.vux-dialog-enter-active{-webkit-animation:vux-dialog-in .5s;animation:vux-dialog-in .5s}.vux-dialog-leave-active{-webkit-animation:vux-dialog-out .3s;animation:vux-dialog-out .3s}@-webkit-keyframes vux-dialog-in{0%{-webkit-transform:scale(1.185);transform:scale(1.185);opacity:0}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes vux-dialog-in{0%{-webkit-transform:scale(1.185);transform:scale(1.185);opacity:0}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes vux-dialog-out{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}to{-webkit-transform:scale(.85);transform:scale(.85);opacity:0}}@keyframes vux-dialog-out{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}to{-webkit-transform:scale(.85);transform:scale(.85);opacity:0}}.vux-mask-enter,.vux-mask-leave-active{opacity:0}.vux-mask-enter-active,.vux-mask-leave-active{-webkit-transition:opacity .3s;transition:opacity .3s}.weui-mask{background:rgba(0,0,0,.6)}.weui-mask,.weui-mask_transparent{position:fixed;z-index:1000;top:0;right:0;left:0;bottom:0}.weui-dialog{position:fixed;display:table;z-index:5000;width:80%;max-width:300px;top:0;right:0;bottom:0;left:0;margin:auto;background-color:#fff;text-align:center;border-radius:3px;overflow:hidden}.weui-dialog__hd{padding:1.3em 1.6em .5em}.weui-dialog__hd.with-no-content{padding:1.7em 1.6em}.weui-dialog__title{font-weight:400;font-size:18px}.weui-dialog__bd{padding:0 1.6em .8em;min-height:40px;font-size:15px;line-height:1.3;word-wrap:break-word;word-break:break-all;color:#999}.weui-dialog__bd:first-child{padding:2.7em 20px 1.7em;color:#353535}.weui-dialog__ft{position:relative;line-height:48px;font-size:18px;display:-webkit-box;display:-webkit-flex;display:flex}.weui-dialog__ft:after{content:" ";position:absolute;left:0;top:0;right:0;height:1px;border-top:1px solid #d5d5d6;color:#d5d5d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(.5);transform:scaleY(.5)}.weui-dialog__btn{display:block;-webkit-box-flex:1;-webkit-flex:1;flex:1;color:#3cc51f;text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);position:relative}.weui-dialog__btn:active{background-color:#eee}.weui-dialog__btn:after{content:" ";position:absolute;left:0;top:0;width:1px;bottom:0;border-left:1px solid #d5d5d6;color:#d5d5d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(.5);transform:scaleX(.5)}.weui-dialog__btn:first-child:after{display:none}.weui-dialog__btn_default{color:#353535}.weui-dialog__btn_primary{color:#0bb20c}.weui-dialog__btn_warn{color:#e64340}.weui-skin_android .weui-dialog{text-align:left;box-shadow:0 6px 30px 0 rgba(0,0,0,.1)}.weui-skin_android .weui-dialog__title{font-size:21px}.weui-skin_android .weui-dialog__hd{text-align:left}.weui-skin_android .weui-dialog__bd{color:#999;padding:.25em 1.6em 2em;font-size:17px;text-align:left}.weui-skin_android .weui-dialog__bd:first-child{padding:1.6em 1.6em 2em;color:#353535}.weui-skin_android .weui-dialog__ft{display:block;text-align:right;line-height:42px;font-size:16px;padding:0 1.6em .7em}.weui-skin_android .weui-dialog__ft:after{display:none}.weui-skin_android .weui-dialog__btn{display:inline-block;vertical-align:top;padding:0 .8em}.weui-skin_android .weui-dialog__btn:after{display:none}.weui-skin_android .weui-dialog__btn:active,.weui-skin_android .weui-dialog__btn:visited{background-color:rgba(0,0,0,.06)}.weui-skin_android .weui-dialog__btn:last-child{margin-right:-.8em}.weui-skin_android .weui-dialog__btn_default{color:gray}@media screen and (min-width:1024PX){.weui-dialog{width:35%}}.vux-prompt{padding-bottom:1.6em}.vux-prompt-msgbox{width:80%;border:1px solid #dedede;border-radius:5px;padding:4px 5px;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;font-size:16px}',""])},1508:function(i,e,t){var a=t(1505);"string"==typeof a&&(a=[[i.i,a,""]]),a.locals&&(i.exports=a.locals);t(708)("01ca964e",a,!0,{})},1512:function(i,e){i.exports={render:function(){var i=this,e=i.$createElement,t=i._self._c||e;return t("div",{staticClass:"vux-confirm"},[t("x-dialog",{attrs:{"dialog-class":"android"===i.theme?"weui-dialog weui-skin_android":"weui-dialog","mask-transition":i.maskTransition,"dialog-transition":"android"===i.theme?"vux-fade":i.dialogTransition,"hide-on-blur":i.hideOnBlur,"mask-z-index":i.maskZIndex},on:{"on-hide":function(e){i.$emit("on-hide")}},model:{value:i.showValue,callback:function(e){i.showValue=e},expression:"showValue"}},[i.title?t("div",{staticClass:"weui-dialog__hd",class:{"with-no-content":!i.showContent}},[t("strong",{staticClass:"weui-dialog__title"},[i._v(i._s(i.title))])]):i._e(),i._v(" "),i.showContent?[i.showInput?t("div",{staticClass:"vux-prompt"},["checkbox"===i.getInputAttrs().type?t("input",i._b({directives:[{name:"model",rawName:"v-model",value:i.msg,expression:"msg"}],ref:"input",staticClass:"vux-prompt-msgbox",attrs:{placeholder:i.placeholder,type:"checkbox"},domProps:{checked:Array.isArray(i.msg)?i._i(i.msg,null)>-1:i.msg},on:{touchend:i.setInputFocus,change:function(e){var t=i.msg,a=e.target,o=!!a.checked;if(Array.isArray(t)){var n=i._i(t,null);a.checked?n<0&&(i.msg=t.concat([null])):n>-1&&(i.msg=t.slice(0,n).concat(t.slice(n+1)))}else i.msg=o}}},"input",i.getInputAttrs(),!1)):"radio"===i.getInputAttrs().type?t("input",i._b({directives:[{name:"model",rawName:"v-model",value:i.msg,expression:"msg"}],ref:"input",staticClass:"vux-prompt-msgbox",attrs:{placeholder:i.placeholder,type:"radio"},domProps:{checked:i._q(i.msg,null)},on:{touchend:i.setInputFocus,change:function(e){i.msg=null}}},"input",i.getInputAttrs(),!1)):t("input",i._b({directives:[{name:"model",rawName:"v-model",value:i.msg,expression:"msg"}],ref:"input",staticClass:"vux-prompt-msgbox",attrs:{placeholder:i.placeholder,type:i.getInputAttrs().type},domProps:{value:i.msg},on:{touchend:i.setInputFocus,input:function(e){e.target.composing||(i.msg=e.target.value)}}},"input",i.getInputAttrs(),!1))]):t("div",{staticClass:"weui-dialog__bd"},[i._t("default",[t("div",{domProps:{innerHTML:i._s(i.content)}})])],2)]:i._e(),i._v(" "),t("div",{staticClass:"weui-dialog__ft"},[i.showCancelButton?t("a",{staticClass:"weui-dialog__btn weui-dialog__btn_default",attrs:{href:"javascript:;"},on:{click:i._onCancel}},[i._v(i._s(i.cancelText||"取消"))]):i._e(),i._v(" "),i.showConfirmButton?t("a",{staticClass:"weui-dialog__btn",class:"weui-dialog__btn_"+i.confirmType,attrs:{href:"javascript:;"},on:{click:i._onConfirm}},[i._v(i._s(i.confirmText||"确定"))]):i._e()])],2)],1)},staticRenderFns:[]}},1515:function(i,e,t){function a(i){t(1508)}var o=t(35)(t(1499),t(1512),a,null,null);i.exports=o.exports},1803:function(i,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t(205),o=t(1327),n=t.n(o),r=t(1515),d=t.n(r);e.default={data:function(){return{name:"",image_path:"",introduce:"",data:[],show2:!1,pullup:!0,beforeScroll:!0}},created:function(){this.EditDetail()},methods:{Del:function(){this.show2=!0},confirm:function(){var i=this,e={id:this.data.id};t.i(a.c)("shop/delBrand",e).then(function(e){e.code===a.b&&(i.$vux.toast.text("删除成功"),i.$router.push("/brand"))})},changeFile:function(i){this.image_path=i.target.value},addBrand:function(){this.Addtrademark()},EditDetail:function(i){var e=this,o={id:this.$route.params.id};t.i(a.c)("shop/brandDetail",o).then(function(i){i.code===a.b&&(e.data=i.data)})},Edit:function(){var i=this,e={id:this.data.id};t.i(a.c)("shop/brandDetail",e).then(function(t){t.code===a.b&&i.$router.push("/edit-brand/"+e.id)})},Addtrademark:function(){var i={name:this.name,image_path:this.image_path,introduce:this.introduce};t.i(a.c)("shop/shopBrand",i)}},components:{Confirm:d.a,Scroll:n.a}}},1988:function(i,e,t){var a=t(709);e=i.exports=t(707)(!1),e.push([i.i,'.vux-tab{position:relative}[data-dpr="1"] .vux-tab{height:46px}[data-dpr="2"] .vux-tab{height:92px}[data-dpr="3"] .vux-tab{height:138px}.vux-tab:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .vux-tab:after{height:1px}[data-dpr="2"] .vux-tab:after{height:2px}[data-dpr="3"] .vux-tab:after{height:3px}[data-dpr="1"] .vux-tab .vux-tab-item{font-size:15px;line-height:46px}[data-dpr="2"] .vux-tab .vux-tab-item{font-size:30px;line-height:92px}[data-dpr="3"] .vux-tab .vux-tab-item{font-size:45px;line-height:138px}.vux-tab .vux-tab-ink-bar .vux-tab-bar-inner{border-radius:.266667rem;overflow:hidden}[data-dpr="1"] .vux-swipeout-item .vux-swipeout-button{font-size:12px}[data-dpr="2"] .vux-swipeout-item .vux-swipeout-button{font-size:24px}[data-dpr="3"] .vux-swipeout-item .vux-swipeout-button{font-size:36px}.discount .weui-cells input{border:1px solid #dfdfdf;margin-left:.266667rem;border-radius:.066667rem;overflow:hidden;padding-left:.133333rem}[data-dpr="1"] .discount .weui-cells input{height:25px;width:90px}[data-dpr="2"] .discount .weui-cells input{height:50px;width:180px}[data-dpr="3"] .discount .weui-cells input{height:75px;width:270px}.weui-cells{margin-top:0!important}.weui-cells:after,.weui-cells:before{display:none}.weui-cells .weui-cell{padding:0}.weui-cells .weui-textarea{width:100%;height:3.466667rem;border:1px solid #dfdfdf;border-radius:.08rem;overflow:hidden;padding:.24rem}[data-dpr="1"] .weui-cells .weui-textarea{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea{font-size:36px}.weui-cells .weui-textarea-counter{color:#ccc;position:absolute;right:.24rem;bottom:.133333rem}[data-dpr="1"] .weui-cells .weui-textarea-counter{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea-counter{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea-counter{font-size:36px}.weui-cells .weui-textarea-counter span{color:#ff8a00}[data-dpr="1"] .weui-cells .weui-label{font-size:14px;line-height:35px}[data-dpr="2"] .weui-cells .weui-label{font-size:28px;line-height:70px}[data-dpr="3"] .weui-cells .weui-label{font-size:42px;line-height:105px}.weui-cells .weui-input{display:block;width:100%;border:1px solid #ccc;padding:0 .333333rem}[data-dpr="1"] .weui-cells .weui-input{height:35px;font-size:14px}[data-dpr="2"] .weui-cells .weui-input{height:70px;font-size:28px}[data-dpr="3"] .weui-cells .weui-input{height:105px;font-size:42px}.weui-cells .weui-cell__ft{display:none}.weui-cell{height:auto!important}.vux-x-dialog .weui-dialog{width:72%;max-width:72%;border-radius:.533333rem;overflow:hidden;background:#f7f7f7}.vux-x-dialog .weui-dialog .weui-dialog__hd{padding:.56rem 0}.vux-x-dialog .weui-dialog .weui-dialog__title{color:#000}[data-dpr="1"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:51px}.vux-x-dialog .vux-prompt{padding-bottom:.48rem}.vux-x-dialog .vux-prompt-msgbox{width:88%;border:1px solid gray;color:#333;padding:.16rem;border-radius:0;overflow:hidden}[data-dpr="1"] .vux-x-dialog .vux-prompt-msgbox{font-size:13px;height:56px}[data-dpr="2"] .vux-x-dialog .vux-prompt-msgbox{font-size:26px;height:112px}[data-dpr="3"] .vux-x-dialog .vux-prompt-msgbox{font-size:39px;height:168px}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft{line-height:45px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft{line-height:90px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft{line-height:135px}.vux-x-dialog .weui-dialog__ft:after{border-width:1px;border-top-color:#09141f}.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{color:#007aff}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:51px}.vux-x-dialog .weui-dialog__btn:after{border-width:1px;border-left-color:#09141f}.big-photo .weui-dialog{width:96%;max-width:96%}.big-photo .weui-dialog img{display:block}.vux-check-icon .weui-icon-success{color:#ff8a00}[data-dpr="1"] .vux-check-icon .weui-icon-success{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-success{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-success{font-size:54px}.vux-check-icon .weui-icon-success:before{color:#ff8a00!important}.vux-check-icon .weui-icon-circle{color:#999}[data-dpr="1"] .vux-check-icon .weui-icon-circle{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-circle{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-circle{font-size:54px}.loading{-webkit-transition:margin-top .38s;transition:margin-top .38s}.loading.show{margin-top:0}.loading.hide{margin-top:-1.2rem;display:none}.publice-goods .publish-item>div{width:100%}.publice-goods .publish-item .weui-textarea{border:none;padding:0;font-family:PingFang SC,STHeitiSC-Light,Helvetica-Light,arial,sans-serif}[data-dpr="1"] .publice-goods .publish-item .weui-textarea{height:60px;font-size:14px}[data-dpr="2"] .publice-goods .publish-item .weui-textarea{height:120px;font-size:28px}[data-dpr="3"] .publice-goods .publish-item .weui-textarea{height:180px;font-size:42px}.publice-goods .publish-item .weui-textarea-counter{bottom:0}.publice-goods .weui-cells{width:100%;height:100%;padding:0;border-right:none}.publice-goods .weui-cells .weui-cell{height:100%}.publice-goods .weui-cells .weui-input{border:none;text-align:right}[data-dpr="1"] .publice-goods .weui-cells .weui-input{height:24px}[data-dpr="2"] .publice-goods .weui-cells .weui-input{height:48px}[data-dpr="3"] .publice-goods .weui-cells .weui-input{height:72px}.picker-singer .scroller-component{background:#fff}[data-dpr="1"] .picker-singer .scroller-component{height:135px}[data-dpr="2"] .picker-singer .scroller-component{height:270px}[data-dpr="3"] .picker-singer .scroller-component{height:405px}.picker-singer .scroller-indicator{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);position:relative}[data-dpr="1"] .picker-singer .scroller-indicator{height:45px}[data-dpr="2"] .picker-singer .scroller-indicator{height:90px}[data-dpr="3"] .picker-singer .scroller-indicator{height:135px}.picker-singer .scroller-indicator:before{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;top:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator:before{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator:before{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator:before{height:3px}.picker-singer .scroller-indicator:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator:after{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator:after{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator:after{height:3px}.picker-singer .scroller-content .scroller-item{color:#bcbcbc}[data-dpr="1"] .picker-singer .scroller-content .scroller-item{font-size:15px;height:45px;line-height:45px}[data-dpr="2"] .picker-singer .scroller-content .scroller-item{font-size:30px;height:90px;line-height:90px}[data-dpr="3"] .picker-singer .scroller-content .scroller-item{font-size:45px;height:135px;line-height:135px}.picker-singer .scroller-content .scroller-item.scroller-item-selected{color:#000}.commodity-spec .weui-cells .weui-input{border-color:gray;padding-left:.16rem}.weui-toast .weui-toast__content{padding:.346667rem .4rem!important}[data-dpr="1"] .weui-toast .weui-toast__content{font-size:15px;border-right:5px}[data-dpr="2"] .weui-toast .weui-toast__content{font-size:30px;border-right:10px}[data-dpr="3"] .weui-toast .weui-toast__content{font-size:45px;border-right:15px}.interval-quotation .weui-cells{position:relative;overflow:inherit}[data-dpr="1"] .interval-quotation .weui-cells .weui-input{height:32px}[data-dpr="2"] .interval-quotation .weui-cells .weui-input{height:64px}[data-dpr="3"] .interval-quotation .weui-cells .weui-input{height:96px}.scroller-mask{background:none!important}.manager-management .vux-swipeout-button-warn{background:#ff8a00}.manager-list .vux-swipeout-item{position:relative}[data-dpr="1"] .manager-list .vux-swipeout-item{height:70px}[data-dpr="2"] .manager-list .vux-swipeout-item{height:140px}[data-dpr="3"] .manager-list .vux-swipeout-item{height:210px}.manager-list .vux-swipeout-item:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .manager-list .vux-swipeout-item:after{height:1px}[data-dpr="2"] .manager-list .vux-swipeout-item:after{height:2px}[data-dpr="3"] .manager-list .vux-swipeout-item:after{height:3px}.manager-list .vux-swipeout-item .vux-swipeout-content>div,.manager-list .vux-swipeout-item>div{height:100%}[data-dpr="1"] .shop-manage .vux-tab-wrap{height:46px}[data-dpr="2"] .shop-manage .vux-tab-wrap{height:92px}[data-dpr="3"] .shop-manage .vux-tab-wrap{height:138px}.vux-tab-wrap{padding-top:0}[data-dpr="1"] .vux-tab-wrap .vux-tab-container{height:46px}[data-dpr="2"] .vux-tab-wrap .vux-tab-container{height:92px}[data-dpr="3"] .vux-tab-wrap .vux-tab-container{height:138px}.special-content .pull-list .weui-cells{width:auto;padding:.4rem .266667rem;border-right:none}.set-telephone .text-input .weui-cells{width:100%;height:100%;border-right:none}.set-telephone .text-input .weui-cells .weui-input{border:1px solid #ccc}.me-answer .answer-text .weui-cells{height:100%;width:100%;border-right:none}#shopset .weui-cells,.card-mana .weui-cells{width:100%;height:100%;padding:0;border-right:none}.addressbox .weui-cells{width:100%;padding:0}[data-dpr="1"] .addressbox .weui-cells{height:44px;line-height:44px}[data-dpr="2"] .addressbox .weui-cells{height:88px;line-height:88px}[data-dpr="3"] .addressbox .weui-cells{height:132px;line-height:132px}[data-dpr="1"] .time-begin .weui-cells,[data-dpr="1"] .time-end .weui-cells{font-size:14px}[data-dpr="2"] .time-begin .weui-cells,[data-dpr="2"] .time-end .weui-cells{font-size:28px}[data-dpr="3"] .time-begin .weui-cells,[data-dpr="3"] .time-end .weui-cells{font-size:42px}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft{display:block;text-align:left}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft:after,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft:after{content:unset}.time-begin .weui-cells .vux-datetime.weui-cell>div:first-child p,.time-end .weui-cells .vux-datetime.weui-cell>div:first-child p{color:#ccc}.vux-swipeout .vux-swipeout-item .vux-swipeout-button-box button.vux-swipeout-button{padding:2px;background-origin:content-box;background-clip:content-box}.brandinfo{background:#fff;position:fixed;width:100%;left:0;top:0;right:0;bottom:0}.brandinfo .brandbox{position:absolute;width:100%;top:0;left:0;right:0}[data-dpr="1"] .brandinfo .brandbox{bottom:50px}[data-dpr="2"] .brandinfo .brandbox{bottom:100px}[data-dpr="3"] .brandinfo .brandbox{bottom:150px}.brandinfo .brandbox .scroll{height:100%;overflow:hidden}.brandinfo .brandcheck{padding:0 .333333rem}.brandinfo .brandcheck .top{padding-top:.533333rem;border-bottom:1px solid #dfdfdf;width:100%;position:relative}.brandinfo .brandcheck .top i{background:url('+a(t(775))+') no-repeat 50%;display:block;background-size:100% auto;top:.533333rem;position:absolute;left:0}[data-dpr="1"] .brandinfo .brandcheck .top i{width:7.5px;height:13.5px}[data-dpr="2"] .brandinfo .brandcheck .top i{width:15px;height:27px}[data-dpr="3"] .brandinfo .brandcheck .top i{width:22.5px;height:40.5px}.brandinfo .brandcheck .top span{color:#333;font-weight:700;padding-left:.213333rem;top:.533333rem;position:absolute;left:.266667rem}[data-dpr="1"] .brandinfo .brandcheck .top span{fone-size:14px}[data-dpr="2"] .brandinfo .brandcheck .top span{fone-size:28px}[data-dpr="3"] .brandinfo .brandcheck .top span{fone-size:42px}.brandinfo .brandcheck .top p{color:#666;padding:1.066667rem 0 .533333rem .466667rem}[data-dpr="1"] .brandinfo .brandcheck .top p{fone-size:14px}[data-dpr="2"] .brandinfo .brandcheck .top p{fone-size:28px}[data-dpr="3"] .brandinfo .brandcheck .top p{fone-size:42px}.brandinfo .brandcheck .middle{border-bottom:1px solid #dfdfdf;width:100%;padding-bottom:.266667rem}.brandinfo .brandcheck .middle i{background:url('+a(t(775))+') no-repeat 50%;background-size:100% auto;display:inline-block;margin-top:.533333rem}[data-dpr="1"] .brandinfo .brandcheck .middle i{width:7.5px;height:13.5px}[data-dpr="2"] .brandinfo .brandcheck .middle i{width:15px;height:27px}[data-dpr="3"] .brandinfo .brandcheck .middle i{width:22.5px;height:40.5px}.brandinfo .brandcheck .middle span{color:#333;font-weight:700;padding-left:.213333rem;margin-top:.533333rem}[data-dpr="1"] .brandinfo .brandcheck .middle span{fone-size:14px}[data-dpr="2"] .brandinfo .brandcheck .middle span{fone-size:28px}[data-dpr="3"] .brandinfo .brandcheck .middle span{fone-size:42px}.brandinfo .brandcheck .middle .pic{margin:.533333rem 0 .533333rem .413333rem;display:-webkit-box;display:-webkit-flex;display:flex}.brandinfo .brandcheck .middle .pic img{overflow:hidden}[data-dpr="1"] .brandinfo .brandcheck .middle .pic img{width:102px;height:102px}[data-dpr="2"] .brandinfo .brandcheck .middle .pic img{width:204px;height:204px}[data-dpr="3"] .brandinfo .brandcheck .middle .pic img{width:306px;height:306px}.brandinfo .brandcheck .middle .pic:nth-child(2n){margin-left:1.333333rem}.brandinfo .brandcheck .content{width:100%}.brandinfo .brandcheck .content i{background:url('+a(t(775))+') no-repeat 50%;display:inline-block;margin-top:.533333rem}[data-dpr="1"] .brandinfo .brandcheck .content i{width:7.5px;height:13.5px}[data-dpr="2"] .brandinfo .brandcheck .content i{width:15px;height:27px}[data-dpr="3"] .brandinfo .brandcheck .content i{width:22.5px;height:40.5px}.brandinfo .brandcheck .content span{color:#333;font-weight:700;padding-left:.213333rem;margin-top:.533333rem}[data-dpr="1"] .brandinfo .brandcheck .content span{font-size:14px}[data-dpr="2"] .brandinfo .brandcheck .content span{font-size:28px}[data-dpr="3"] .brandinfo .brandcheck .content span{font-size:42px}.brandinfo .brandcheck .content p{padding:.533333rem .213333rem 0 .413333rem;text-indent:.666667rem;line-height:.64rem;font-size:.373333rem;color:#666}.brandinfo .managebtn{border-top:1px solid #dfdfdf;position:fixed;bottom:0;left:0;right:0;width:100%;display:-webkit-box;display:-webkit-flex;display:flex}[data-dpr="1"] .brandinfo .managebtn{height:44px;line-height:44px;font-size:18px}[data-dpr="2"] .brandinfo .managebtn{height:88px;line-height:88px;font-size:36px}[data-dpr="3"] .brandinfo .managebtn{height:132px;line-height:132px;font-size:54px}.brandinfo .managebtn .edit{display:inline-block;width:50%;background:#ff8a00;line-height:1.253333rem;text-align:center;color:#fff}[data-dpr="1"] .brandinfo .managebtn .edit{height:47px}[data-dpr="2"] .brandinfo .managebtn .edit{height:94px}[data-dpr="3"] .brandinfo .managebtn .edit{height:141px}.brandinfo .managebtn .del{display:inline-block;width:50%;background:#fff;line-height:1.253333rem;text-align:center;color:#ff8a00}[data-dpr="1"] .brandinfo .managebtn .del{height:47px}[data-dpr="2"] .brandinfo .managebtn .del{height:94px}[data-dpr="3"] .brandinfo .managebtn .del{height:141px}.vux-confirm .vux-x-dialog .weui-dialog{border-radius:.373333rem;overflow:hidden;background-color:#f7f7f7;max-width:70%}.vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__hd{padding:.6rem 0 .266667rem}.vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__hd .weui-dialog__title{color:#000;font-weight:700}[data-dpr="1"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__hd .weui-dialog__title{font-size:17px}[data-dpr="2"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__hd .weui-dialog__title{font-size:34px}[data-dpr="3"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__hd .weui-dialog__title{font-size:51px}.vux-confirm .vux-x-dialog .weui-dialog .vux-prompt{padding:0 .426667rem 1.253333rem}.vux-confirm .vux-x-dialog .weui-dialog .vux-prompt input{border:1px solid #c7c7cc;width:90%;background:#fff;color:#a6a6a6}[data-dpr="1"] .vux-confirm .vux-x-dialog .weui-dialog .vux-prompt input{height:28px;font-size:13px}[data-dpr="2"] .vux-confirm .vux-x-dialog .weui-dialog .vux-prompt input{height:56px;font-size:26px}[data-dpr="3"] .vux-confirm .vux-x-dialog .weui-dialog .vux-prompt input{height:84px;font-size:39px}.vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft{border-top:1px solid #c7c7cc}.vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn{border-left:1px solid #c7c7cc}.vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_default,.vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_primary{color:#007aff}[data-dpr="1"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="1"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:17px;height:44px;line-height:44px}[data-dpr="2"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="2"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:34px;height:88px;line-height:88px}[data-dpr="3"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="3"] .vux-confirm .vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:51px;height:132px;line-height:132px}',""])},2155:function(i,e,t){var a=t(1988);"string"==typeof a&&(a=[[i.i,a,""]]),a.locals&&(i.exports=a.locals);t(708)("bd58432e",a,!0,{})},2340:function(i,e){i.exports={render:function(){var i=this,e=i.$createElement,t=i._self._c||e;return t("div",{staticClass:"brandinfo"},[t("div",{staticClass:"brandbox"},[t("scroll",{ref:"scroll",staticClass:"scroll",attrs:{pullup:i.pullup,beforeScroll:i.beforeScroll}},[t("div",[t("div",{staticClass:"brandcheck"},[t("div",{staticClass:"top"},[t("i",{staticClass:"k"}),i._v(" "),t("span",[i._v("品牌名称")]),i._v(" "),t("P",[i._v(i._s(i.data.name))])],1),i._v(" "),t("div",{staticClass:"middle"},[t("i"),i._v(" "),t("span",[i._v("品牌LOGO")]),i._v(" "),t("div",{staticClass:"pic"},[t("img",{attrs:{src:i.data.image_path}})])]),i._v(" "),t("div",{staticClass:"content"},[t("i"),i._v(" "),t("span",[i._v("品牌介绍")]),i._v(" "),t("p",{},[i._v(i._s(i.data.introduce))])])])])])],1),i._v(" "),t("div",{staticClass:"managebtn"},[t("span",{staticClass:"edit",on:{click:i.Edit}},[i._v("编辑")]),i._v(" "),t("span",{staticClass:"del",on:{click:i.Del}},[i._v("删除")])]),i._v(" "),t("confirm",{attrs:{title:"您确认删除品牌信息吗？","confirm-text":"取消","cancel-text":"确定"},on:{"on-cancel":i.confirm},model:{value:i.show2,callback:function(e){i.show2=e},expression:"show2"}})],1)},staticRenderFns:[]}},272:function(i,e,t){function a(i){t(2155)}var o=t(35)(t(1803),t(2340),a,null,null);i.exports=o.exports},775:function(i,e){i.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAbCAYAAACjkdXHAAAAoUlEQVQ4je3PO2oCYRAA4C+eMbHXNAuJlfweYjshpYXNloFcJFUqQcQbiCAhrsWk8RlWjdsJOzDFDHzzeIhcqBmturDBDW7wXeFvdLCpg1+kGGNwKy62EIb4+C+eINtXKQJdzK/hHzxJsTrppljgEeUl3JPiq+pEKT7RP4cLKUaV8DDgDe9/8dTxn5fjGbMdXqv68/z2JdooRS6LCDdn7vUXKhVX2mb2CY4AAAAASUVORK5CYII="}});