webpackJsonp([68],{BBZG:function(t,e){},HC7W:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Dd8w"),o=i.n(n),s=i("NjuA"),a=i.n(s),u=i("DHfu"),r=i("NYxO"),c=(o()({},Object(r.d)(["SET_AUTHEN_ROLE"]),{getAuditeStatus:function(){var t=this;this.$http("auditResult").then(function(e){e.code===t.$ok&&(t.roleInfo=e.data,t.SET_AUTHEN_ROLE(e.data.title))})},modifyStuff:function(){this.$router.push({path:"/identity-select",query:{flag:1}})},queryTel:function(){var t=this;this.$http("home/getCustomerInfo").then(function(e){e.code===t.$ok&&(t.telePhone=e.data.service_phone)})}}),{data:function(){return{identityToId:a.a,telePhone:"",roleInfo:{}}},computed:{id:function(){return this.identityToId[this.roleInfo.title]},pic:function(){return this.roleInfo.title&&i("neyL")("./identity"+this.identityToId[this.roleInfo.title]+".png")},identityName:function(){return this.roleInfo.title}},created:function(){Object(u.i)(),Object(u.j)("setIdentityAuth",3),this.getAuditeStatus(),this.queryTel()},methods:o()({},Object(r.d)(["SET_AUTHEN_ROLE"]),{getAuditeStatus:function(){var t=this;this.$http("auditResult").then(function(e){e.code===t.$ok&&(t.roleInfo=e.data,t.SET_AUTHEN_ROLE(e.data.title))})},modifyStuff:function(){this.$router.push({path:"/identity-select",query:{flag:1}})},queryTel:function(){var t=this;this.$http("home/getCustomerInfo").then(function(e){e.code===t.$ok&&(t.telePhone=e.data.service_phone)})}})}),d={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"audite-container personal-bg"},[i("div",{staticClass:"no-pass"},[i("div",{staticClass:"head-pic"},[i("img",{attrs:{src:t.pic,alt:""}})]),t._v(" "),i("h1",[t._v("认证未通过")]),t._v(" "),i("h2",[t._v("原因："+t._s(t.roleInfo.reject_reason))]),t._v(" "),i("p",[t._v("很抱歉，您申请的采购师身份认证审核未通过，")]),t._v(" "),i("p",[t._v("如有疑问请拨打 "+t._s(t.telePhone))]),t._v(" "),i("div",{staticClass:"btn-apply",on:{click:t.modifyStuff}},[t._v("重新申请认证")])])])},staticRenderFns:[]};var f=i("VU/8")(c,d,!1,function(t){i("BBZG")},"data-v-c387aef4",null);e.default=f.exports}});