webpackJsonp([139,595],{1744:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(203),o=i(35),d=i(218);i(74).a.use(d.a),e.default={data:function(){return{name:"",image_path:"",introduce:""}},created:function(){window.album=this.album},computed:{isActive:function(){return this.name&&this.image_path&&this.introduce}},methods:{load:function(){var t=this,e=i.i(o.b)();"Android"===e?window.android.selectPic():"iOS"===e?i.i(o.d)("","selectPic").then(function(e){t.image_path=e}):console.log("ll")},album:function(t){this.image_path=t},changeFile:function(t){this.image_path=t.target.value},addBrand:function(){this.name.trim()?this.image_path?this.introduce.trim()?this.Addtrademark():this.$vux.toast.text("品牌介绍不得为空"):this.$vux.toast.text("请上传图片"):this.$vux.toast.text("品牌名称不得为空")},Addtrademark:function(){var t=this,e={name:this.name.trim(),image_path:this.image_path,introduce:this.introduce};i.i(a.c)("/shop/shopBrand",e).then(function(e){e.code===a.b?(t.$vux.toast.text("添加成功"),t.$router.replace("/brand")):t.$vux.toast.text(e.message)})}},components:{}}},1887:function(t,e,i){var a=i(698);e=t.exports=i(696)(!1),e.push([t.i,'.vux-tab{position:relative}[data-dpr="1"] .vux-tab{height:46px}[data-dpr="2"] .vux-tab{height:92px}[data-dpr="3"] .vux-tab{height:138px}.vux-tab:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .vux-tab:after{height:1px}[data-dpr="2"] .vux-tab:after{height:2px}[data-dpr="3"] .vux-tab:after{height:3px}[data-dpr="1"] .vux-tab .vux-tab-item{font-size:15px;line-height:46px}[data-dpr="2"] .vux-tab .vux-tab-item{font-size:30px;line-height:92px}[data-dpr="3"] .vux-tab .vux-tab-item{font-size:45px;line-height:138px}.vux-tab .vux-tab-ink-bar .vux-tab-bar-inner{border-radius:.266667rem;overflow:hidden}[data-dpr="1"] .vux-swipeout-item .vux-swipeout-button{font-size:12px}[data-dpr="2"] .vux-swipeout-item .vux-swipeout-button{font-size:24px}[data-dpr="3"] .vux-swipeout-item .vux-swipeout-button{font-size:36px}.discount .weui-cells input{border:1px solid #dfdfdf;margin-left:.266667rem;border-radius:.066667rem;overflow:hidden;padding-left:.133333rem}[data-dpr="1"] .discount .weui-cells input{height:25px;width:90px}[data-dpr="2"] .discount .weui-cells input{height:50px;width:180px}[data-dpr="3"] .discount .weui-cells input{height:75px;width:270px}.weui-cells{margin-top:0!important}.weui-cells:after,.weui-cells:before{display:none}.weui-cells .weui-cell{padding:0}.weui-cells .weui-textarea{width:100%;height:3.466667rem;border:1px solid #dfdfdf;border-radius:.08rem;overflow:hidden;padding:.24rem}[data-dpr="1"] .weui-cells .weui-textarea{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea{font-size:36px}.weui-cells .weui-textarea-counter{color:#ccc;position:absolute;right:.24rem;bottom:.133333rem}[data-dpr="1"] .weui-cells .weui-textarea-counter{font-size:12px}[data-dpr="2"] .weui-cells .weui-textarea-counter{font-size:24px}[data-dpr="3"] .weui-cells .weui-textarea-counter{font-size:36px}.weui-cells .weui-textarea-counter span{color:#ff8a00}[data-dpr="1"] .weui-cells .weui-label{font-size:14px;line-height:35px}[data-dpr="2"] .weui-cells .weui-label{font-size:28px;line-height:70px}[data-dpr="3"] .weui-cells .weui-label{font-size:42px;line-height:105px}.weui-cells .weui-input{display:block;width:100%;border:1px solid #ccc;padding:0 .333333rem}[data-dpr="1"] .weui-cells .weui-input{height:35px;font-size:14px}[data-dpr="2"] .weui-cells .weui-input{height:70px;font-size:28px}[data-dpr="3"] .weui-cells .weui-input{height:105px;font-size:42px}.weui-cells .weui-cell__ft{display:none}.weui-cell{height:auto!important}.vux-x-dialog .weui-dialog{width:72%;max-width:72%;border-radius:.533333rem;overflow:hidden;background:#f7f7f7}.vux-x-dialog .weui-dialog .weui-dialog__hd{padding:.56rem 0}.vux-x-dialog .weui-dialog .weui-dialog__title{color:#000}[data-dpr="1"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog .weui-dialog__title{font-size:51px}.vux-x-dialog .vux-prompt{padding-bottom:.48rem}.vux-x-dialog .vux-prompt-msgbox{width:88%;border:1px solid gray;color:#333;padding:.16rem;border-radius:0;overflow:hidden}[data-dpr="1"] .vux-x-dialog .vux-prompt-msgbox{font-size:13px;height:56px}[data-dpr="2"] .vux-x-dialog .vux-prompt-msgbox{font-size:26px;height:112px}[data-dpr="3"] .vux-x-dialog .vux-prompt-msgbox{font-size:39px;height:168px}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft{line-height:45px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft{line-height:90px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft{line-height:135px}.vux-x-dialog .weui-dialog__ft:after{border-width:1px;border-top-color:#09141f}.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,.vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{color:#007aff}[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="1"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:17px}[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="2"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:34px}[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_default,[data-dpr="3"] .vux-x-dialog .weui-dialog__ft .weui-dialog__btn_primary{font-size:51px}.vux-x-dialog .weui-dialog__btn:after{border-width:1px;border-left-color:#09141f}.big-photo .weui-dialog{width:96%;max-width:96%}.big-photo .weui-dialog img{display:block}.vux-check-icon .weui-icon-success{color:#ff8a00}[data-dpr="1"] .vux-check-icon .weui-icon-success{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-success{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-success{font-size:54px}.vux-check-icon .weui-icon-success:before{color:#ff8a00!important}.vux-check-icon .weui-icon-circle{color:#999}[data-dpr="1"] .vux-check-icon .weui-icon-circle{font-size:18px}[data-dpr="2"] .vux-check-icon .weui-icon-circle{font-size:36px}[data-dpr="3"] .vux-check-icon .weui-icon-circle{font-size:54px}.loading{-webkit-transition:margin-top .38s;transition:margin-top .38s}.loading.show{margin-top:0}.loading.hide{margin-top:-1.2rem;display:none}.publice-goods .publish-item>div{width:100%}.publice-goods .publish-item .weui-textarea{border:none;padding:0;font-family:PingFang SC,STHeitiSC-Light,Helvetica-Light,arial,sans-serif}[data-dpr="1"] .publice-goods .publish-item .weui-textarea{height:60px;font-size:14px}[data-dpr="2"] .publice-goods .publish-item .weui-textarea{height:120px;font-size:28px}[data-dpr="3"] .publice-goods .publish-item .weui-textarea{height:180px;font-size:42px}.publice-goods .publish-item .weui-textarea-counter{bottom:0}.publice-goods .weui-cells{width:100%;height:100%;padding:0;border-right:none}.publice-goods .weui-cells .weui-cell{height:100%}.publice-goods .weui-cells .weui-input{border:none;text-align:right}[data-dpr="1"] .publice-goods .weui-cells .weui-input{height:24px}[data-dpr="2"] .publice-goods .weui-cells .weui-input{height:48px}[data-dpr="3"] .publice-goods .weui-cells .weui-input{height:72px}.picker-singer .scroller-component{background:#fff}[data-dpr="1"] .picker-singer .scroller-component{height:135px}[data-dpr="2"] .picker-singer .scroller-component{height:270px}[data-dpr="3"] .picker-singer .scroller-component{height:405px}.picker-singer .scroller-indicator{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);position:relative}[data-dpr="1"] .picker-singer .scroller-indicator{height:45px}[data-dpr="2"] .picker-singer .scroller-indicator{height:90px}[data-dpr="3"] .picker-singer .scroller-indicator{height:135px}.picker-singer .scroller-indicator:before{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;top:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator:before{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator:before{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator:before{height:3px}.picker-singer .scroller-indicator:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .picker-singer .scroller-indicator:after{height:1px}[data-dpr="2"] .picker-singer .scroller-indicator:after{height:2px}[data-dpr="3"] .picker-singer .scroller-indicator:after{height:3px}.picker-singer .scroller-content .scroller-item{color:#bcbcbc}[data-dpr="1"] .picker-singer .scroller-content .scroller-item{font-size:15px;height:45px;line-height:45px}[data-dpr="2"] .picker-singer .scroller-content .scroller-item{font-size:30px;height:90px;line-height:90px}[data-dpr="3"] .picker-singer .scroller-content .scroller-item{font-size:45px;height:135px;line-height:135px}.picker-singer .scroller-content .scroller-item.scroller-item-selected{color:#000}.commodity-spec .weui-cells .weui-input{border-color:gray;padding-left:.16rem}.weui-toast .weui-toast__content{padding:.346667rem .4rem!important}[data-dpr="1"] .weui-toast .weui-toast__content{font-size:15px;border-right:5px}[data-dpr="2"] .weui-toast .weui-toast__content{font-size:30px;border-right:10px}[data-dpr="3"] .weui-toast .weui-toast__content{font-size:45px;border-right:15px}.interval-quotation .weui-cells{position:relative;overflow:inherit}[data-dpr="1"] .interval-quotation .weui-cells .weui-input{height:32px}[data-dpr="2"] .interval-quotation .weui-cells .weui-input{height:64px}[data-dpr="3"] .interval-quotation .weui-cells .weui-input{height:96px}.scroller-mask{background:none!important}.manager-management .vux-swipeout-button-warn{background:#ff8a00}.manager-list .vux-swipeout-item{position:relative}[data-dpr="1"] .manager-list .vux-swipeout-item{height:70px}[data-dpr="2"] .manager-list .vux-swipeout-item{height:140px}[data-dpr="3"] .manager-list .vux-swipeout-item{height:210px}.manager-list .vux-swipeout-item:after{content:"";width:200%;background:#dfdfdf;position:absolute;left:0;bottom:0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scale(.5);transform:scale(.5)}[data-dpr="1"] .manager-list .vux-swipeout-item:after{height:1px}[data-dpr="2"] .manager-list .vux-swipeout-item:after{height:2px}[data-dpr="3"] .manager-list .vux-swipeout-item:after{height:3px}.manager-list .vux-swipeout-item .vux-swipeout-content>div,.manager-list .vux-swipeout-item>div{height:100%}[data-dpr="1"] .shop-manage .vux-tab-wrap{height:46px}[data-dpr="2"] .shop-manage .vux-tab-wrap{height:92px}[data-dpr="3"] .shop-manage .vux-tab-wrap{height:138px}.vux-tab-wrap{padding-top:0}[data-dpr="1"] .vux-tab-wrap .vux-tab-container{height:46px}[data-dpr="2"] .vux-tab-wrap .vux-tab-container{height:92px}[data-dpr="3"] .vux-tab-wrap .vux-tab-container{height:138px}.special-content .pull-list .weui-cells{width:auto;padding:.4rem .266667rem;border-right:none}.set-telephone .text-input .weui-cells{width:100%;height:100%;border-right:none}.set-telephone .text-input .weui-cells .weui-input{border:1px solid #ccc}.me-answer .answer-text .weui-cells{height:100%;width:100%;border-right:none}#shopset .weui-cells,.card-mana .weui-cells{width:100%;height:100%;padding:0;border-right:none}.addressbox .weui-cells{width:100%;padding:0}[data-dpr="1"] .addressbox .weui-cells{height:44px;line-height:44px}[data-dpr="2"] .addressbox .weui-cells{height:88px;line-height:88px}[data-dpr="3"] .addressbox .weui-cells{height:132px;line-height:132px}[data-dpr="1"] .time-begin .weui-cells,[data-dpr="1"] .time-end .weui-cells{font-size:14px}[data-dpr="2"] .time-begin .weui-cells,[data-dpr="2"] .time-end .weui-cells{font-size:28px}[data-dpr="3"] .time-begin .weui-cells,[data-dpr="3"] .time-end .weui-cells{font-size:42px}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft{display:block;text-align:left}.time-begin .weui-cells .vux-datetime.weui-cell .weui-cell__ft:after,.time-end .weui-cells .vux-datetime.weui-cell .weui-cell__ft:after{content:unset}.time-begin .weui-cells .vux-datetime.weui-cell>div:first-child p,.time-end .weui-cells .vux-datetime.weui-cell>div:first-child p{color:#ccc}.vux-swipeout .vux-swipeout-item .vux-swipeout-button-box button.vux-swipeout-button{padding:2px;background-origin:content-box;background-clip:content-box}body{background:#fff}.box{padding:0 .333333rem!important;position:relative}.box .brand{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%;padding-top:.533333rem}.box .brand .shape{display:inline-block;background:#ff8a00;font-size:.373333rem;color:#333}[data-dpr="1"] .box .brand .shape{width:4px;height:12px}[data-dpr="2"] .box .brand .shape{width:8px;height:24px}[data-dpr="3"] .box .brand .shape{width:12px;height:36px}.box .brand .name{padding-left:.24rem}.box .brand .ipt{margin-left:.32rem;width:75%;height:auto;border-radius:.026667rem;overflow:hidden;border:1px solid #dfdfdf;position:relative}.box .brand .ipt input{text-indent:.24rem;padding:.32rem 0;width:78%;height:100%;color:#333}[data-dpr="1"] .box .brand .ipt input{font-size:14px}[data-dpr="2"] .box .brand .ipt input{font-size:28px}[data-dpr="3"] .box .brand .ipt input{font-size:42px}.box .brand .ipt input::-webkit-input-placeholder{color:#bcbcbc}[data-dpr="1"] .box .brand .ipt input::-webkit-input-placeholder{font-size:14px}[data-dpr="2"] .box .brand .ipt input::-webkit-input-placeholder{font-size:28px}[data-dpr="3"] .box .brand .ipt input::-webkit-input-placeholder{font-size:42px}.box .brand .ipt input:-moz-placeholder{color:#bcbcbc}[data-dpr="1"] .box .brand .ipt input:-moz-placeholder{font-size:14px}[data-dpr="2"] .box .brand .ipt input:-moz-placeholder{font-size:28px}[data-dpr="3"] .box .brand .ipt input:-moz-placeholder{font-size:42px}.box .brand .ipt input:focus{outline:none;border:none}.box .brand .ipt .number{color:#bcbcbc;position:absolute;right:.24rem;top:40%}[data-dpr="1"] .box .brand .ipt .number{font-size:12px}[data-dpr="2"] .box .brand .ipt .number{font-size:24px}[data-dpr="3"] .box .brand .ipt .number{font-size:36px}.box .brand .ipt .number i{color:#ff8a00;font-style:normal}.box .logo{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;margin-top:1.066667rem;width:100%}[data-dpr="1"] .box .logo{height:70px}[data-dpr="2"] .box .logo{height:140px}[data-dpr="3"] .box .logo{height:210px}.box .logo .shape{display:inline-block;background:#ff8a00;font-size:.373333rem;color:#333}[data-dpr="1"] .box .logo .shape{width:4px;height:12px}[data-dpr="2"] .box .logo .shape{width:8px;height:24px}[data-dpr="3"] .box .logo .shape{width:12px;height:36px}.box .logo .name{padding-left:.24rem}.box .logo .upload{padding-left:.32rem;position:relative}.box .logo .upload .uploadJia{border:1px dashed #ccc;position:relative}[data-dpr="1"] .box .logo .upload .uploadJia{width:70px;height:70px}[data-dpr="2"] .box .logo .upload .uploadJia{width:140px;height:140px}[data-dpr="3"] .box .logo .upload .uploadJia{width:210px;height:210px}.box .logo .upload .uploadJia i{display:inline-block;background:url('+a(i(749))+') no-repeat;background-size:100% auto;position:absolute;left:.666667rem;top:.533333rem}[data-dpr="1"] .box .logo .upload .uploadJia i{width:19.5px;height:20px}[data-dpr="2"] .box .logo .upload .uploadJia i{width:39px;height:40px}[data-dpr="3"] .box .logo .upload .uploadJia i{width:58.5px;height:60px}.box .logo .upload .uploadJia span{color:#999;position:absolute;bottom:.2rem;left:.266667rem}[data-dpr="1"] .box .logo .upload .uploadJia span{font-size:12px}[data-dpr="2"] .box .logo .upload .uploadJia span{font-size:24px}[data-dpr="3"] .box .logo .upload .uploadJia span{font-size:36px}.box .logo .upload .size{color:#999;padding-top:.32rem}[data-dpr="1"] .box .logo .upload .size{font-size:12px}[data-dpr="2"] .box .logo .upload .size{font-size:24px}[data-dpr="3"] .box .logo .upload .size{font-size:36px}.box .introduce{display:-webkit-box;display:-webkit-flex;display:flex;padding-top:1.066667rem;width:100%}.box .introduce .shape{display:inline-block;background:#ff8a00;font-size:.373333rem;color:#333;margin-top:.32rem}[data-dpr="1"] .box .introduce .shape{width:4px;height:12px}[data-dpr="2"] .box .introduce .shape{width:8px;height:24px}[data-dpr="3"] .box .introduce .shape{width:12px;height:36px}.box .introduce .name{padding-left:.24rem;margin-top:.32rem}.box .introduce .txt{width:75%;border-radius:.026667rem;border:1px solid #dfdfdf;margin-left:.32rem;overflow:hidden;position:relative}[data-dpr="1"] .box .introduce .txt{height:190px}[data-dpr="2"] .box .introduce .txt{height:380px}[data-dpr="3"] .box .introduce .txt{height:570px}.box .introduce .txt textarea{padding-left:.32rem;color:#333;padding-top:.32rem;border:0;position:relative;width:100%;height:88%;resize:none}[data-dpr="1"] .box .introduce .txt textarea{font-size:14px}[data-dpr="2"] .box .introduce .txt textarea{font-size:28px}[data-dpr="3"] .box .introduce .txt textarea{font-size:42px}.box .introduce .txt textarea::-webkit-input-placeholder{color:#bcbcbc}[data-dpr="1"] .box .introduce .txt textarea::-webkit-input-placeholder{font-size:14px}[data-dpr="2"] .box .introduce .txt textarea::-webkit-input-placeholder{font-size:28px}[data-dpr="3"] .box .introduce .txt textarea::-webkit-input-placeholder{font-size:42px}.box .introduce .txt textarea:-moz-placeholder{color:#bcbcbc}[data-dpr="1"] .box .introduce .txt textarea:-moz-placeholder{font-size:14px}[data-dpr="2"] .box .introduce .txt textarea:-moz-placeholder{font-size:28px}[data-dpr="3"] .box .introduce .txt textarea:-moz-placeholder{font-size:42px}.box .introduce .txt textarea:focus{outline:none;border:none}.box .introduce .txt .number{color:#bcbcbc;position:absolute;right:.266667rem;bottom:.266667rem}[data-dpr="1"] .box .introduce .txt .number{font-size:12px}[data-dpr="2"] .box .introduce .txt .number{font-size:24px}[data-dpr="3"] .box .introduce .txt .number{font-size:36px}.box .introduce .txt .number i{color:#ff8a00;font-style:normal}.savebrand{position:fixed;bottom:0;left:0;right:0;text-align:center;background:#bcbcbc;color:#fff}[data-dpr="1"] .savebrand{height:47px;line-height:47px;font-size:18px}[data-dpr="2"] .savebrand{height:94px;line-height:94px;font-size:36px}[data-dpr="3"] .savebrand{height:141px;line-height:141px;font-size:54px}.savebrand.active{background:#ff8a00}.weui-toast{top:50%}.weui-toast .weui-toast__content{padding:.266667rem!important}[data-dpr="1"] .weui-toast .weui-toast__content{font-size:16px}[data-dpr="2"] .weui-toast .weui-toast__content{font-size:32px}[data-dpr="3"] .weui-toast .weui-toast__content{font-size:48px}',""])},2042:function(t,e,i){var a=i(1887);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i(697)("1c1dd3b9",a,!0,{})},2214:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"shop"},[i("div",{staticClass:"box"},[i("div",{staticClass:"brand"},[i("span",{staticClass:"shape"}),t._v(" "),i("span",{staticClass:"name",on:{click:t.album}},[t._v("品牌名称")]),t._v(" "),i("div",{staticClass:"ipt"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],attrs:{type:"text",maxlength:"10",placeholder:"请输入品牌名称"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),t._v(" "),i("span",{staticClass:"number"},[i("i",[t._v(t._s(this.name.length))]),t._v("/10")])])]),t._v(" "),i("div",{staticClass:"logo"},[i("span",{staticClass:"shape"}),t._v(" "),i("span",{staticClass:"name"},[t._v("品牌LOGO")]),t._v(" "),i("div",{staticClass:"upload",on:{click:t.load}},[i("div",{staticClass:"uploadJia"},[i("i",{directives:[{name:"show",rawName:"v-show",value:!this.image_path,expression:"!this.image_path"}]}),t._v(" "),i("img",{attrs:{src:t.image_path}}),t._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:!this.image_path,expression:"!this.image_path"}]},[t._v("上传照片")])]),t._v(" "),i("div",{staticClass:"size"},[t._v("尺寸432PX*432PX")])])]),t._v(" "),i("div",{staticClass:"introduce"},[i("span",{staticClass:"shape"}),t._v(" "),i("span",{staticClass:"name"},[t._v("品牌介绍")]),t._v(" "),i("div",{staticClass:"txt"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.introduce,expression:"introduce"}],attrs:{type:"text",placeholder:"请输入品牌介绍",maxlength:"300"},domProps:{value:t.introduce},on:{input:function(e){e.target.composing||(t.introduce=e.target.value)}}}),t._v(" "),i("span",{staticClass:"number"},[i("i",[t._v(t._s(this.introduce.length))]),t._v("/300")])])])]),t._v(" "),i("div",{staticClass:"savebrand",class:{active:t.isActive},on:{click:t.addBrand}},[t._v("保存\n")])])},staticRenderFns:[]}},269:function(t,e,i){function a(t){i(2042)}var o=i(34)(i(1744),i(2214),a,null,null);t.exports=o.exports},749:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAYAAAB99ePgAAAAdUlEQVRYhe3QsQ3DMAwF0S/tlUk0QRaKN/AkKblT3KRNc2BgFfcAth8HjqpKk1eSZ5KV5OwYnB0j/2IcZRxlHGUcZRxlHGUcZRy1ddyoqs/dET+8t/7cTDKa7vhurqa9x/af25ZxlHGUcZRxlHGUcZRxlHHUBdl6CizIIcFRAAAAAElFTkSuQmCC"}});