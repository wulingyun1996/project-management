webpackJsonp([75,386],{A8Bg:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=s("DHfu"),i={name:"HoneyRole",data:function(){return{isBeforeScroll:!0}},mounted:function(){this.$refs.role.show()},methods:{goBack:function(){this.isFromNative?Object(o.c)():this.$back()},beforeScroll:function(){if(this.isBeforeScroll){var e=this.$refs.img;e.style.height=e.offsetHeight+1+"px",this.isBeforeScroll=!1}}}},r={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"honey-role-container"},[t("base-senior-popup",{ref:"role",staticClass:"role-container",attrs:{width:"100%",height:"100%"}},[t("base-scroll",{attrs:{"has-more":!0,beforeScroll:!0},on:{beforeScroll:this.beforeScroll}},[t("img",{ref:"img",attrs:{src:s("Rok/"),alt:""}})])],1),this._v(" "),t("div",{staticClass:"icon-close",class:{active:this.$isX},on:{click:this.goBack}})],1)},staticRenderFns:[]};var c=s("VU/8")(i,r,!1,function(e){s("sv3Y")},null,null);t.default=c.exports},"Rok/":function(e,t,s){e.exports=s.p+"static/img/bg-role.9b87f45.png"},sv3Y:function(e,t){}});