webpackJsonp([139],{1760:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(203);e.default={data:function(){return{tel:"",password:"",verify:""}},methods:{register:function(){var t=this,e={mobile:this.tel,password:this.password,verify:this.verify};i.i(a.c)("register",e).then(function(e){t.$vux.toast.text(e.message,"middle")})},getType:function(){var t=this,e={mobile:this.tel,type:"register"};i.i(a.c)("send",e).then(function(e){t.$vux.toast.text(e.message,"middle")})}}}},1920:function(t,e,i){e=t.exports=i(690)(!1),e.push([t.i,'.register{padding-top:1.333333rem}.box{display:-webkit-box;display:-webkit-flex;display:flex;align-item:center;padding:0 .333333rem;margin-bottom:.266667rem}[data-dpr="1"] .box{line-height:34px}[data-dpr="2"] .box{line-height:68px}[data-dpr="3"] .box{line-height:102px}[data-dpr="1"] .box label{width:50px}[data-dpr="2"] .box label{width:100px}[data-dpr="3"] .box label{width:150px}.box input{display:block;-webkit-box-flex:1;-webkit-flex:1;flex:1;border:1px solid #dfdfdf;padding-left:.133333rem}.box button{margin-left:.533333rem}[data-dpr="1"] .box button{width:100px}[data-dpr="2"] .box button{width:200px}[data-dpr="3"] .box button{width:300px}button{display:block;margin:0 auto;width:1.6rem;border:1px solid #dfdfdf}[data-dpr="1"] button{line-height:34px;font-size:13px}[data-dpr="2"] button{line-height:68px;font-size:26px}[data-dpr="3"] button{line-height:102px;font-size:39px}',""])},2073:function(t,e,i){var a=i(1920);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i(691)("7a6ef3bc",a,!0,{})},2244:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"register"},[i("div",{staticClass:"box"},[i("label",[t._v("手机号")]),i("input",{directives:[{name:"model",rawName:"v-model",value:t.tel,expression:"tel"}],attrs:{type:"text",name:"",placeholder:"手机号"},domProps:{value:t.tel},on:{input:function(e){e.target.composing||(t.tel=e.target.value)}}})]),t._v(" "),i("div",{staticClass:"box"},[i("label",[t._v("密码")]),i("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{type:"text",name:"",placeholder:"密码"},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}})]),t._v(" "),i("div",{staticClass:"box"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.verify,expression:"verify"}],attrs:{type:"text"},domProps:{value:t.verify},on:{input:function(e){e.target.composing||(t.verify=e.target.value)}}}),t._v(" "),i("button",{on:{click:t.getType}},[t._v("获取验证码")])]),t._v(" "),i("button",{on:{click:t.register}},[t._v("注册")])])},staticRenderFns:[]}},330:function(t,e,i){function a(t){i(2073)}var o=i(34)(i(1760),i(2244),a,null,null);t.exports=o.exports}});