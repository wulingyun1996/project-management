webpackJsonp([62,306],{Pbqz:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("OvRC"),a=i.n(n),s=i("mvHQ"),o=i.n(s),r=i("Dd8w"),u=i.n(r),d=i("r0TW"),l=i("aPNe"),h=i.n(l),c=i("DHfu"),v=i("NYxO"),f=(u()({},Object(v.e)(["authenRole"]),{isAuthendRole:function(){return 1===this.roleInfo.is_old&&2===this.roleInfo.audit_status},isFromAuditingPage:function(){return!!this.$route.query.flag}}),u()({},Object(v.d)(["SET_AUTHEN_ROLE"]),{queryIdentityRole:function(){var t=this;this.$http("isOldBuyer").then(function(e){if(e.code===t.$ok){var i=e.data,n=i.audit_status,a=i.is_old;if(2!==n||0!==a&&2!==a||(t.ispassedAuthend=!0,2===a&&Object(c.k)("setIsOld",2)),3===n&&!t.isFromAuditingPage)return void t.$router.push("/auditing");t.roleInfo=e.data}})},oldRoleAuthen:function(){var t=this,e={title:this.roleName};this.$http("oldBuyerIdentity",e).then(function(e){if(e.code===t.$ok)return t.ispassedAuthend=!0,Object(c.k)("navigationItem",o()({})),void Object(c.k)("setIsOld",2);t.$t(e.message,"middle")})},goExplainIdentity:function(){this.$router.push({name:"ExplainIdentity"})},chooseRoleName:function(t){this.roleName=t},goAuthen:function(){this.roleName?(this.SET_AUTHEN_ROLE(this.roleName),this.isAuthendRole?this.oldRoleAuthen():this.$router.push("/authen-type")):this.$t("请选择身份","middle")},returnAndroidSavedRole:function(){var t=Object(c.d)();try{if("Android"===t){var e=window.android.nativeReturnData();return void this.parseSavedData(e)}"iOS"===t&&Object(c.a)("","nativeReturnData")}catch(t){}},returnIOSSavedContent:function(t){this.parseSavedData(t)},parseSavedData:function(t){if(t){var e=(t=JSON.parse(t)).savedRole;this.roleName=e}},goHome:function(){this.isAuthendRole||Object(c.k)("setIdentityAuth",2),Object(c.u)()}}),d.a,{message:"您还未完成认证，确定要放弃吗？",left:"放弃",right:"继续认证"}),m={data:function(){return{identity:h.a,roleName:null,roleInfo:{},ispassedAuthend:!1}},computed:u()({},Object(v.e)(["authenRole"]),{isAuthendRole:function(){return 1===this.roleInfo.is_old&&2===this.roleInfo.audit_status},isFromAuditingPage:function(){return!!this.$route.query.flag}}),created:function(){this.queryIdentityRole(),this.returnAndroidSavedRole(),window.returnIOSSavedContent=this.returnIOSSavedContent,this.roleName=this.authenRole,Object(c.r)(f,0)},methods:u()({},Object(v.d)(["SET_AUTHEN_ROLE"]),{queryIdentityRole:function(){var t=this;this.$http("isOldBuyer").then(function(e){if(e.code===t.$ok){var i=e.data,n=i.audit_status,a=i.is_old;if(2!==n||0!==a&&2!==a||(t.ispassedAuthend=!0,2===a&&Object(c.k)("setIsOld",2)),3===n&&!t.isFromAuditingPage)return void t.$router.push("/auditing");t.roleInfo=e.data}})},oldRoleAuthen:function(){var t=this,e={title:this.roleName};this.$http("oldBuyerIdentity",e).then(function(e){if(e.code===t.$ok)return t.ispassedAuthend=!0,Object(c.k)("navigationItem",o()({})),void Object(c.k)("setIsOld",2);t.$t(e.message,"middle")})},goExplainIdentity:function(){this.$router.push({name:"ExplainIdentity"})},chooseRoleName:function(t){this.roleName=t},goAuthen:function(){this.roleName?(this.SET_AUTHEN_ROLE(this.roleName),this.isAuthendRole?this.oldRoleAuthen():this.$router.push("/authen-type")):this.$t("请选择身份","middle")},returnAndroidSavedRole:function(){var t=Object(c.d)();try{if("Android"===t){var e=window.android.nativeReturnData();return void this.parseSavedData(e)}"iOS"===t&&Object(c.a)("","nativeReturnData")}catch(t){}},returnIOSSavedContent:function(t){this.parseSavedData(t)},parseSavedData:function(t){if(t){var e=(t=JSON.parse(t)).savedRole;this.roleName=e}},goHome:function(){this.isAuthendRole||Object(c.k)("setIdentityAuth",2),Object(c.u)()}}),beforeRouteLeave:function(t,e,i){var n=a()(null);n.savedRole=this.roleName,Object(c.k)("nativeSaveData",o()(n)),i()},watch:{$route:function(t,e){"IdentitySelect"===t.name&&Object(c.r)(f,0)}},components:{BasePopupPass:d.a}},p={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"register-container"},[n("div",{staticClass:"regitster-identity-nav",on:{click:t.goExplainIdentity}},[t._m(0)]),t._v(" "),n("div",{staticClass:"regitster-identity-body"},[n("h1",[t._v("请选择您的身份")]),t._v(" "),n("h2",[t._v("请根据您的从业内容合理选择您的身份")]),t._v(" "),n("div",{staticClass:"identity-container"},[t._l(t.identity,function(e,i){return n("div",{key:i,staticClass:"identity-item",class:{active:t.roleName===e.name},on:{click:function(i){t.chooseRoleName(e.name)}}},[t._v("\n        "+t._s(e.name)+"\n      ")])}),t._v(" "),n("img",{attrs:{src:i("Zq5C"),alt:""}})],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.roleName,expression:"roleName"}],staticClass:"register-button",on:{click:t.goAuthen}},[t._v("\n      下一步\n    ")])]),t._v(" "),n("base-popup-pass",{directives:[{name:"show",rawName:"v-show",value:t.ispassedAuthend,expression:"ispassedAuthend"}],on:{comfirm:t.goHome}}),t._v(" "),n("router-view")],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("h2",[e("span",{staticClass:"question-symbol"}),this._v(" "),e("span",{staticClass:"nav-text"},[this._v("不清楚您的身份，没关系！看看身份说明")]),this._v(" "),e("span",{staticClass:"finger-nav"})])}]};var O=i("VU/8")(m,p,!1,function(t){i("alqT")},"data-v-f05f00dc",null);e.default=O.exports},Zq5C:function(t,e,i){t.exports=i.p+"static/img/big-logo.3372f78.png"},alqT:function(t,e){}});