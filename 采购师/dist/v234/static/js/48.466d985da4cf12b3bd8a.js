webpackJsonp([48],{"/qJp":function(e,t){},Mydr:function(e,t){},gflL:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("mvHQ"),i=s.n(n),a=s("d7EF"),r=s.n(a),o=s("OvRC"),u=s.n(o),c=(Number,Number,{props:{stepNum:{type:Number,default:1},currentIndex:{type:Number,default:0}}}),h={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"step-container"},e._l(e.stepNum,function(t){return s("div",{key:t,staticClass:"step-item",class:{active:t!==e.stepNum}},[s("span",{staticClass:"step-nums",class:{active:t<=e.currentIndex}},[e._v(e._s(t))]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t!==e.stepNum,expression:"item !== stepNum"}],staticClass:"step-gutter",class:{active:t<e.currentIndex}})])}))},staticRenderFns:[]};var d=s("VU/8")(c,h,!1,function(e){s("j8Nh")},null,null).exports,p=(String,{props:{comfirm:{type:String,default:"开启"}},data:function(){return{isShow:!1}},methods:{show:function(){this.isShow=!0},hide:function(){this.isShow=!1,this.$emit("refreshQues")},changeAuthenType:function(){this.isShow=!1,this.$emit("changeAuthenType")}}}),v={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{directives:[{name:"show",rawName:"v-show",value:e.isShow,expression:"isShow"}],staticClass:"popup-nopass-container"},[s("div",{staticClass:"popup-nopass-body"},[s("div",{staticClass:"popup-pass-close"},[s("span",{on:{click:e.hide}})]),e._v(" "),e._m(0),e._v(" "),s("div",{staticClass:"button-wrapper"},[s("div",{staticClass:"button-left",on:{click:e.changeAuthenType}},[e._v("换种认证方式")]),e._v(" "),s("div",{staticClass:"button-right",on:{click:e.hide}},[e._v("再答题一次")])])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"popup-nopass-title"},[t("h1",[t("span"),this._v("\n        认证未通过！\n      ")])])}]};var l=s("VU/8")(p,v,!1,function(e){s("Mydr")},null,null).exports,f=s("r0TW"),w=s("fBcm"),m=s("b+jt"),_=s("DHfu"),x=(f.a,w.a,m.a,{data:function(){return{currentIndex:0,stepNum:5,answer:"",questionsList:[],answerList:[],roleInfo:{}}},computed:{index:function(){return this.currentIndex+1},identityName:function(){return this.$route.query.identityName},type:function(){return this.$route.query.type},answerLength:function(){return this.answerList.length>=5},isUnauthendOldRole:function(){return 1===this.roleInfo.is_old&&1===this.roleInfo.audit_status}},created:function(){this.getQuestions(),this.queryIdentityRole(),Object(_.b)()},methods:{queryIdentityRole:function(){var e=this;this.$http("isOldBuyer").then(function(t){t.code===e.$ok&&(e.roleInfo=t.data)})},getQuestions:function(){var e=this,t={identity_form:this.type,title:this.identityName};this.$http("identityQuestion",t).then(function(t){if(t.code===e.$ok){var s=0;t.data.forEach(function(e,t){var n=[];e.options.split("|").forEach(function(e){var t=u()(null);t.id=s,t.currentAnswer=e,n.push(t),s++}),e.option=n}),e.questionsList=t.data}})},answerNextQues:function(){if(this.answer)return this.index<this.stepNum?(this.currentIndex++,this.answerList.push(this.answer),void(this.answer="")):void(this.answerLength||(this.answerList.push(this.answer),this.submitAnswer()));this.$t("请选择答案","middle")},submitAnswer:function(){var e=this,t=r()(this.answerList,5),s={question_1:t[0],question_2:t[1],question_3:t[2],question_4:t[3],question_5:t[4]};this.$http("identityAuth",s).then(function(t){if(t.code===e.$ok){if(t.data.score<4)return void e.$refs.nopass.show();e.isUnauthendOldRole&&Object(_.j)("setIsOld",2),Object(_.j)("navigationItem",i()({})),e.$refs.pass.show()}})},refreshQues:function(){this.initStatus(),this.getQuestions()},changeAuthenType:function(){this.$router.push({name:"AuthenType"})},initStatus:function(){this.currentIndex=0,this.answer="",this.answerList.splice(0)},goHome:function(){Object(_.j)("setIdentityAuth",2),Object(_.t)()}},components:{BaseStep:d,BasePopupNopass:l,BasePopupPass:f.a,Swiper:w.a,SwiperItem:m.a}}),y={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"authen-answer-container"},[s("div",{staticClass:"authen-wrapper"},[s("div",{staticClass:"authen-answer-progress"},[s("base-step",{attrs:{stepNum:e.stepNum,currentIndex:e.index}})],1),e._v(" "),s("swiper",{attrs:{"show-dots":!1,height:"400px","min-moving-distance":5e3},model:{value:e.currentIndex,callback:function(t){e.currentIndex=t},expression:"currentIndex"}},e._l(e.questionsList,function(t,n){return s("swiper-item",{key:t.id,staticClass:"black"},[s("div",{staticClass:"authen-answer-body"},[s("div",{staticClass:"authen-answer-title"},[s("div",{staticClass:"title"},[e._v(e._s(n+1)+".")]),e._v(" "),s("p",[e._v(e._s(t.question))])]),e._v(" "),s("div",{staticClass:"authen-answer-choice"},e._l(t.option,function(n,i){return s("div",{key:i,staticClass:"form-group"},[s("label",{attrs:{for:n.id}},[s("span",{class:{active:t.id+"|"+n.currentAnswer===e.answer}}),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.answer,expression:"answer"}],attrs:{id:n.id,type:"radio"},domProps:{value:t.id+"|"+n.currentAnswer,checked:e._q(e.answer,t.id+"|"+n.currentAnswer)},on:{change:function(s){e.answer=t.id+"|"+n.currentAnswer}}}),e._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:0===i,expression:"index === 0"}]},[e._v("A、")]),e._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:1===i,expression:"index === 1"}]},[e._v("B、")]),e._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:2===i,expression:"index === 2"}]},[e._v("C、")]),e._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:3===i,expression:"index === 3"}]},[e._v("D、")]),e._v("\n                "+e._s(n.currentAnswer)+"\n              ")])])}))])])}))],1),e._v(" "),s("div",{staticClass:"authen-button",class:{"m-34":e.$isX},on:{click:e.answerNextQues}},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.index<5,expression:"index < 5"}]},[e._v("下一题")]),s("span",{directives:[{name:"show",rawName:"v-show",value:e.index>=5,expression:"index >= 5"}]},[e._v("答题完成")]),e._v(" ("+e._s(e.index)+" / 5)\n  ")]),e._v(" "),s("base-popup-pass",{ref:"pass",on:{comfirm:e.goHome}}),e._v(" "),s("base-popup-nopass",{ref:"nopass",on:{changeAuthenType:e.changeAuthenType,refreshQues:e.refreshQues}})],1)},staticRenderFns:[]};var N=s("VU/8")(x,y,!1,function(e){s("/qJp")},"data-v-568e870e",null);t.default=N.exports},j8Nh:function(e,t){}});