webpackJsonp([57,530,531,536,537,538,550,552],{1540:function(t,e){t.exports={L:1,M:0,Q:3,H:2}},1541:function(t,e,i){function r(t,e){if(void 0==t.length)throw new Error(t.length+"/"+e);for(var i=0;i<t.length&&0==t[i];)i++;this.num=new Array(t.length-i+e);for(var r=0;r<t.length-i;r++)this.num[r]=t[r+i]}var a=i(1542);r.prototype={get:function(t){return this.num[t]},getLength:function(){return this.num.length},multiply:function(t){for(var e=new Array(this.getLength()+t.getLength()-1),i=0;i<this.getLength();i++)for(var n=0;n<t.getLength();n++)e[i+n]^=a.gexp(a.glog(this.get(i))+a.glog(t.get(n)));return new r(e,0)},mod:function(t){if(this.getLength()-t.getLength()<0)return this;for(var e=a.glog(this.get(0))-a.glog(t.get(0)),i=new Array(this.getLength()),n=0;n<this.getLength();n++)i[n]=this.get(n);for(var n=0;n<t.getLength();n++)i[n]^=a.gexp(a.glog(t.get(n))+e);return new r(i,0).mod(t)}},t.exports=r},1542:function(t,e){for(var i={glog:function(t){if(t<1)throw new Error("glog("+t+")");return i.LOG_TABLE[t]},gexp:function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return i.EXP_TABLE[t]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},r=0;r<8;r++)i.EXP_TABLE[r]=1<<r;for(var r=8;r<256;r++)i.EXP_TABLE[r]=i.EXP_TABLE[r-4]^i.EXP_TABLE[r-5]^i.EXP_TABLE[r-6]^i.EXP_TABLE[r-8];for(var r=0;r<255;r++)i.LOG_TABLE[i.EXP_TABLE[r]]=r;t.exports=i},1543:function(t,e){t.exports={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8}},1581:function(t,e,i){"use strict";function r(t){return t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1}function a(t){var e,i,r,a;for(e="",r=t.length,i=0;i<r;i++)a=t.charCodeAt(i),a>=1&&a<=127?e+=t.charAt(i):a>2047?(e+=String.fromCharCode(224|a>>12&15),e+=String.fromCharCode(128|a>>6&63),e+=String.fromCharCode(128|a>>0&63)):(e+=String.fromCharCode(192|a>>6&31),e+=String.fromCharCode(128|a>>0&63));return e}Object.defineProperty(e,"__esModule",{value:!0});var n=i(1621),o=i.n(n),s=i(1540),d=i.n(s);e.default={name:"qrcode",props:{value:String,size:{type:Number,default:160},level:{type:String,default:"L"},bgColor:{type:String,default:"#FFFFFF"},fgColor:{type:String,default:"#000000"},type:{type:String,default:"img"}},mounted:function(){var t=this;this.$nextTick(function(){t.render()})},data:function(){return{imgData:""}},watch:{value:function(){this.render()},size:function(){this.render()},level:function(){this.render()},bgColor:function(){this.render()},fgColor:function(){this.render()}},methods:{render:function(){var t=this;if(void 0!==this.value){var e=new o.a(-1,d.a[this.level]);e.addData(a(this.value)),e.make();var i=this.$refs.canvas,n=i.getContext("2d"),s=e.modules,l=this.size/s.length,c=this.size/s.length,u=(window.devicePixelRatio||1)/r(n);i.height=i.width=this.size*u,n.scale(u,u),s.forEach(function(e,i){e.forEach(function(e,r){n.fillStyle=e?t.fgColor:t.bgColor;var a=Math.ceil((r+1)*l)-Math.floor(r*l),o=Math.ceil((i+1)*c)-Math.floor(i*c);n.fillRect(Math.round(r*l),Math.round(i*c),a,o)})}),"img"===this.type&&(this.imgData=i.toDataURL("image/png"))}}}}},1619:function(t,e,i){function r(t){this.mode=a.MODE_8BIT_BYTE,this.data=t}var a=i(1543);r.prototype={getLength:function(t){return this.data.length},write:function(t){for(var e=0;e<this.data.length;e++)t.put(this.data.charCodeAt(e),8)}},t.exports=r},1620:function(t,e){function i(){this.buffer=new Array,this.length=0}i.prototype={get:function(t){var e=Math.floor(t/8);return 1==(this.buffer[e]>>>7-t%8&1)},put:function(t,e){for(var i=0;i<e;i++)this.putBit(1==(t>>>e-i-1&1))},getLengthInBits:function(){return this.length},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},t.exports=i},1621:function(t,e,i){function r(t,e){this.typeNumber=t,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}var a=i(1619),n=i(1622),o=i(1620),s=i(1623),d=i(1541),l=r.prototype;l.addData=function(t){var e=new a(t);this.dataList.push(e),this.dataCache=null},l.isDark=function(t,e){if(t<0||this.moduleCount<=t||e<0||this.moduleCount<=e)throw new Error(t+","+e);return this.modules[t][e]},l.getModuleCount=function(){return this.moduleCount},l.make=function(){if(this.typeNumber<1){var t=1;for(t=1;t<40;t++){for(var e=n.getRSBlocks(t,this.errorCorrectLevel),i=new o,r=0,a=0;a<e.length;a++)r+=e[a].dataCount;for(var a=0;a<this.dataList.length;a++){var d=this.dataList[a];i.put(d.mode,4),i.put(d.getLength(),s.getLengthInBits(d.mode,t)),d.write(i)}if(i.getLengthInBits()<=8*r)break}this.typeNumber=t}this.makeImpl(!1,this.getBestMaskPattern())},l.makeImpl=function(t,e){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var i=0;i<this.moduleCount;i++){this.modules[i]=new Array(this.moduleCount);for(var a=0;a<this.moduleCount;a++)this.modules[i][a]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(t,e),this.typeNumber>=7&&this.setupTypeNumber(t),null==this.dataCache&&(this.dataCache=r.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,e)},l.setupPositionProbePattern=function(t,e){for(var i=-1;i<=7;i++)if(!(t+i<=-1||this.moduleCount<=t+i))for(var r=-1;r<=7;r++)e+r<=-1||this.moduleCount<=e+r||(this.modules[t+i][e+r]=0<=i&&i<=6&&(0==r||6==r)||0<=r&&r<=6&&(0==i||6==i)||2<=i&&i<=4&&2<=r&&r<=4)},l.getBestMaskPattern=function(){for(var t=0,e=0,i=0;i<8;i++){this.makeImpl(!0,i);var r=s.getLostPoint(this);(0==i||t>r)&&(t=r,e=i)}return e},l.createMovieClip=function(t,e,i){var r=t.createEmptyMovieClip(e,i);this.make();for(var a=0;a<this.modules.length;a++)for(var n=1*a,o=0;o<this.modules[a].length;o++){var s=1*o,d=this.modules[a][o];d&&(r.beginFill(0,100),r.moveTo(s,n),r.lineTo(s+1,n),r.lineTo(s+1,n+1),r.lineTo(s,n+1),r.endFill())}return r},l.setupTimingPattern=function(){for(var t=8;t<this.moduleCount-8;t++)null==this.modules[t][6]&&(this.modules[t][6]=t%2==0);for(var e=8;e<this.moduleCount-8;e++)null==this.modules[6][e]&&(this.modules[6][e]=e%2==0)},l.setupPositionAdjustPattern=function(){for(var t=s.getPatternPosition(this.typeNumber),e=0;e<t.length;e++)for(var i=0;i<t.length;i++){var r=t[e],a=t[i];if(null==this.modules[r][a])for(var n=-2;n<=2;n++)for(var o=-2;o<=2;o++)this.modules[r+n][a+o]=-2==n||2==n||-2==o||2==o||0==n&&0==o}},l.setupTypeNumber=function(t){for(var e=s.getBCHTypeNumber(this.typeNumber),i=0;i<18;i++){var r=!t&&1==(e>>i&1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=r}for(var i=0;i<18;i++){var r=!t&&1==(e>>i&1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=r}},l.setupTypeInfo=function(t,e){for(var i=this.errorCorrectLevel<<3|e,r=s.getBCHTypeInfo(i),a=0;a<15;a++){var n=!t&&1==(r>>a&1);a<6?this.modules[a][8]=n:a<8?this.modules[a+1][8]=n:this.modules[this.moduleCount-15+a][8]=n}for(var a=0;a<15;a++){var n=!t&&1==(r>>a&1);a<8?this.modules[8][this.moduleCount-a-1]=n:a<9?this.modules[8][15-a-1+1]=n:this.modules[8][15-a-1]=n}this.modules[this.moduleCount-8][8]=!t},l.mapData=function(t,e){for(var i=-1,r=this.moduleCount-1,a=7,n=0,o=this.moduleCount-1;o>0;o-=2)for(6==o&&o--;;){for(var d=0;d<2;d++)if(null==this.modules[r][o-d]){var l=!1;n<t.length&&(l=1==(t[n]>>>a&1));var c=s.getMask(e,r,o-d);c&&(l=!l),this.modules[r][o-d]=l,a--,-1==a&&(n++,a=7)}if((r+=i)<0||this.moduleCount<=r){r-=i,i=-i;break}}},r.PAD0=236,r.PAD1=17,r.createData=function(t,e,i){for(var a=n.getRSBlocks(t,e),d=new o,l=0;l<i.length;l++){var c=i[l];d.put(c.mode,4),d.put(c.getLength(),s.getLengthInBits(c.mode,t)),c.write(d)}for(var u=0,l=0;l<a.length;l++)u+=a[l].dataCount;if(d.getLengthInBits()>8*u)throw new Error("code length overflow. ("+d.getLengthInBits()+">"+8*u+")");for(d.getLengthInBits()+4<=8*u&&d.put(0,4);d.getLengthInBits()%8!=0;)d.putBit(!1);for(;;){if(d.getLengthInBits()>=8*u)break;if(d.put(r.PAD0,8),d.getLengthInBits()>=8*u)break;d.put(r.PAD1,8)}return r.createBytes(d,a)},r.createBytes=function(t,e){for(var i=0,r=0,a=0,n=new Array(e.length),o=new Array(e.length),l=0;l<e.length;l++){var c=e[l].dataCount,u=e[l].totalCount-c;r=Math.max(r,c),a=Math.max(a,u),n[l]=new Array(c);for(var h=0;h<n[l].length;h++)n[l][h]=255&t.buffer[h+i];i+=c;var f=s.getErrorCorrectPolynomial(u),g=new d(n[l],f.getLength()-1),m=g.mod(f);o[l]=new Array(f.getLength()-1);for(var h=0;h<o[l].length;h++){var p=h+m.getLength()-o[l].length;o[l][h]=p>=0?m.get(p):0}}for(var v=0,h=0;h<e.length;h++)v+=e[h].totalCount;for(var A=new Array(v),w=0,h=0;h<r;h++)for(var l=0;l<e.length;l++)h<n[l].length&&(A[w++]=n[l][h]);for(var h=0;h<a;h++)for(var l=0;l<e.length;l++)h<o[l].length&&(A[w++]=o[l][h]);return A},t.exports=r},1622:function(t,e,i){function r(t,e){this.totalCount=t,this.dataCount=e}var a=i(1540);r.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r.getRSBlocks=function(t,e){var i=r.getRsBlockTable(t,e);if(void 0==i)throw new Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+e);for(var a=i.length/3,n=new Array,o=0;o<a;o++)for(var s=i[3*o+0],d=i[3*o+1],l=i[3*o+2],c=0;c<s;c++)n.push(new r(d,l));return n},r.getRsBlockTable=function(t,e){switch(e){case a.L:return r.RS_BLOCK_TABLE[4*(t-1)+0];case a.M:return r.RS_BLOCK_TABLE[4*(t-1)+1];case a.Q:return r.RS_BLOCK_TABLE[4*(t-1)+2];case a.H:return r.RS_BLOCK_TABLE[4*(t-1)+3];default:return}},t.exports=r},1623:function(t,e,i){var r=i(1543),a=i(1541),n=i(1542),o={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},s={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(t){for(var e=t<<10;s.getBCHDigit(e)-s.getBCHDigit(s.G15)>=0;)e^=s.G15<<s.getBCHDigit(e)-s.getBCHDigit(s.G15);return(t<<10|e)^s.G15_MASK},getBCHTypeNumber:function(t){for(var e=t<<12;s.getBCHDigit(e)-s.getBCHDigit(s.G18)>=0;)e^=s.G18<<s.getBCHDigit(e)-s.getBCHDigit(s.G18);return t<<12|e},getBCHDigit:function(t){for(var e=0;0!=t;)e++,t>>>=1;return e},getPatternPosition:function(t){return s.PATTERN_POSITION_TABLE[t-1]},getMask:function(t,e,i){switch(t){case o.PATTERN000:return(e+i)%2==0;case o.PATTERN001:return e%2==0;case o.PATTERN010:return i%3==0;case o.PATTERN011:return(e+i)%3==0;case o.PATTERN100:return(Math.floor(e/2)+Math.floor(i/3))%2==0;case o.PATTERN101:return e*i%2+e*i%3==0;case o.PATTERN110:return(e*i%2+e*i%3)%2==0;case o.PATTERN111:return(e*i%3+(e+i)%2)%2==0;default:throw new Error("bad maskPattern:"+t)}},getErrorCorrectPolynomial:function(t){for(var e=new a([1],0),i=0;i<t;i++)e=e.multiply(new a([1,n.gexp(i)],0));return e},getLengthInBits:function(t,e){if(1<=e&&e<10)switch(t){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:case r.MODE_KANJI:return 8;default:throw new Error("mode:"+t)}else if(e<27)switch(t){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw new Error("mode:"+t)}else{if(!(e<41))throw new Error("type:"+e);switch(t){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw new Error("mode:"+t)}}},getLostPoint:function(t){for(var e=t.getModuleCount(),i=0,r=0;r<e;r++)for(var a=0;a<e;a++){for(var n=0,o=t.isDark(r,a),s=-1;s<=1;s++)if(!(r+s<0||e<=r+s))for(var d=-1;d<=1;d++)a+d<0||e<=a+d||0==s&&0==d||o==t.isDark(r+s,a+d)&&n++;n>5&&(i+=3+n-5)}for(var r=0;r<e-1;r++)for(var a=0;a<e-1;a++){var l=0;t.isDark(r,a)&&l++,t.isDark(r+1,a)&&l++,t.isDark(r,a+1)&&l++,t.isDark(r+1,a+1)&&l++,0!=l&&4!=l||(i+=3)}for(var r=0;r<e;r++)for(var a=0;a<e-6;a++)t.isDark(r,a)&&!t.isDark(r,a+1)&&t.isDark(r,a+2)&&t.isDark(r,a+3)&&t.isDark(r,a+4)&&!t.isDark(r,a+5)&&t.isDark(r,a+6)&&(i+=40);for(var a=0;a<e;a++)for(var r=0;r<e-6;r++)t.isDark(r,a)&&!t.isDark(r+1,a)&&t.isDark(r+2,a)&&t.isDark(r+3,a)&&t.isDark(r+4,a)&&!t.isDark(r+5,a)&&t.isDark(r+6,a)&&(i+=40);for(var c=0,a=0;a<e;a++)for(var r=0;r<e;r++)t.isDark(r,a)&&c++;return i+=Math.abs(100*c/e/e-50)/5*10}};t.exports=s},1634:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("canvas",{directives:[{name:"show",rawName:"v-show",value:"canvas"===t.type,expression:"type === 'canvas'"}],ref:"canvas",style:{height:t.size+"px",width:t.size+"px"},attrs:{height:t.size,width:t.size}}),t._v(" "),"img"===t.type?i("img",{style:{height:t.size+"px",width:t.size+"px"},attrs:{src:t.imgData}}):t._e()])},staticRenderFns:[]}},1639:function(t,e,i){var r=i(34)(i(1581),i(1634),null,null,null);t.exports=r.exports},1702:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=i(1639),a=i.n(r);e.default={components:{Qrcode:a.a},data:function(){return{loading:!1,hasIdentify:!0,showModule:!1,url:"",info:{}}},mounted:function(){this.getData(),console.log("//test-sapi.cgs18.com/")},methods:{viewQRcode:function(){this.showModule=!0},getData:function(){var t=this;this.$http("card/getCradDetails").then(function(e){if(t.loading=!0,console.log(e),200===e.code){if(!e.data)return void(t.hasIdentify=!1);t.info=e.data;var i=t.info.one_discount;-1!==i.indexOf(".")&&0===parseInt(i.split(".")[1])&&(t.info.one_discount=i.split(".")[0]),t.url="http://test-c.cgs18.com",t.url=t.url+"/shop-auth/?shopId="+t.info.seller_id,console.log(t.url)}else t.$vux.toast.text(e.message,"middle")})},edit:function(){this.$router.push({path:"/card-router/identify-info",query:{one_discount:this.info.one_discount,explain:this.info.explain,id:this.info.id}})}}}},1935:function(t,e,i){e=t.exports=i(690)(!1),e.push([t.i,".card-identify .box>div img{width:100%!important;height:100%!important}",""])},1936:function(t,e,i){var r=i(692);e=t.exports=i(690)(!1),e.push([t.i,".card-identify[data-v-a7da3d9c]{height:100%;background:#f4f4f4}.card-identify>div[data-v-a7da3d9c]{background:#fff}header[data-v-a7da3d9c]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;padding:.533333rem 0 .746667rem;font-size:.373333rem}header .left[data-v-a7da3d9c]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}header .left span[data-v-a7da3d9c]:first-child{height:.346667rem;width:2px;background:#ff8a00;margin-left:.4rem}header .left span[data-v-a7da3d9c]:last-child{line-height:.533333rem;color:#333;margin-left:.16rem}header .right[data-v-a7da3d9c]{color:#ff8a00;margin-right:.373333rem;line-height:.533333rem}.card[data-v-a7da3d9c]{width:7.733333rem;height:4rem;background:url("+r(i(913))+") no-repeat;background-size:100% 100%;border-radius:.373333rem;margin:0 auto;position:relative;color:#ffe8c8;border-top:.013333rem solid transparent}.card .left[data-v-a7da3d9c]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.card .left img[data-v-a7da3d9c]{width:.32rem;height:.266667rem}.card .edit[data-v-a7da3d9c]{position:absolute;width:.64rem;height:.64rem;bottom:.16rem;right:.16rem}.card>div[data-v-a7da3d9c]:first-child{font-size:.373333rem;line-height:.533333rem;margin-top:1.386667rem;padding-left:.533333rem}.card>div[data-v-a7da3d9c]:nth-child(2){font-size:.426667rem;line-height:.586667rem;padding-left:.533333rem}.card>div[data-v-a7da3d9c]:last-child{display:-webkit-box;display:-webkit-flex;display:flex;padding-left:.533333rem;padding-right:.426667rem;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;margin-top:.426667rem}.card>div:last-child span[data-v-a7da3d9c]{font-size:.32rem;color:#cc7e1e;-webkit-transform:scale(.9);transform:scale(.9);-webkit-transform-origin:left;transform-origin:left;display:inline-block}p.explain[data-v-a7da3d9c]{color:#999;font-size:.32rem;line-height:.453333rem;padding:0 .4rem;margin-top:.746667rem}p.tips[data-v-a7da3d9c]{margin-left:.4rem;color:#ccc;font-size:.533333rem;-webkit-transform:scale(.5);transform:scale(.5);-webkit-transform-origin:left;transform-origin:left}.hr[data-v-a7da3d9c]{background:#f4f4f4;height:.266667rem;margin-top:.64rem}.goods[data-v-a7da3d9c]{display:-webkit-box;display:-webkit-flex;display:flex;padding:0 .4rem;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:1.013333rem}.goods span[data-v-a7da3d9c]{color:#333;font-size:.373333rem}.goods img[data-v-a7da3d9c]{width:.133333rem;height:.266667rem}div.mask[data-v-a7da3d9c]{position:fixed;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.5)}.module[data-v-a7da3d9c]{position:fixed;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:7.2rem;height:8.506667rem;border-radius:.266667rem;background:#fff;text-align:center}.module .title[data-v-a7da3d9c]{display:-webkit-box;display:-webkit-flex;display:flex;margin-top:.533333rem;color:#333;font-size:.346667rem;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.module .title span[data-v-a7da3d9c]:nth-child(2){margin-left:.28rem;margin-right:.28rem}.module .title span[data-v-a7da3d9c]:first-child,.module .title span[data-v-a7da3d9c]:last-child{width:.986667rem;height:1px;background:#ccc}.module p[data-v-a7da3d9c]:first-of-type{margin-top:.693333rem;color:#333;font-size:.426667rem;line-height:.586667rem}.module p[data-v-a7da3d9c]:nth-of-type(2){color:red;font-size:.48rem;line-height:.666667rem;margin-top:.053333rem}.module .box[data-v-a7da3d9c]{width:3.733333rem;height:3.733333rem;border:1px solid #ccc;margin:.533333rem auto 0;padding:.186667rem}.module .box img[data-v-a7da3d9c]{width:100%;height:100%}.module p[data-v-a7da3d9c]:nth-of-type(3){margin-top:.106667rem;color:#999;font-size:.32rem;line-height:.453333rem}.module .bottom[data-v-a7da3d9c]{margin-top:.773333rem;border-top:1px solid #ccc;color:#333;font-size:.346667rem;height:.96rem;line-height:.96rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.unIdentify[data-v-a7da3d9c]{height:100%;background:url("+r(i(919))+") no-repeat;background-size:100% 100%;overflow:hidden}.unIdentify>img[data-v-a7da3d9c]{display:block;width:9.28rem;margin:.693333rem auto 0}.unIdentify .btn[data-v-a7da3d9c]{position:fixed;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);width:6.773333rem;height:1.226667rem;border-radius:.106667rem;bottom:2.746667rem;background:#ff8a00}.unIdentify .btn>div[data-v-a7da3d9c]{display:-webkit-box;display:-webkit-flex;display:flex;height:100%;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;color:#fff;font-size:.426667rem}.unIdentify .btn>div img[data-v-a7da3d9c]{width:.4rem;height:.4rem;margin-right:.213333rem}.fade-enter-active[data-v-a7da3d9c],.fade-leave-active[data-v-a7da3d9c]{-webkit-transition:all 1s ease;transition:all 1s ease}.fade-enter[data-v-a7da3d9c],.fade-leave-to[data-v-a7da3d9c]{opacity:0}",""])},2088:function(t,e,i){var r=i(1935);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);i(691)("07b84851",r,!0,{})},2089:function(t,e,i){var r=i(1936);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);i(691)("0cc0d8f9",r,!0,{})},2261:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.loading?r("div",{staticClass:"card-identify"},[t.hasIdentify?r("div",[r("header",[t._m(0),t._v(" "),r("div",{staticClass:"right",on:{click:t.viewQRcode}},[r("img",{attrs:{src:"",alt:""}}),t._v("\n        查看二维码\n      ")])]),t._v(" "),r("div",{staticClass:"card"},[r("div",[t._v("专属特权")]),t._v(" "),r("div",[t._v("再返佣"+t._s(t.info.one_discount)+"%")]),t._v(" "),r("div",[r("div",{staticClass:"left"},[r("img",{attrs:{src:i(915),alt:""}}),t._v(" "),r("span",[t._v("认证店铺，可在原直采价基础上再返佣"+t._s(t.info.one_discount)+"%")])]),t._v(" "),r("img",{staticClass:"edit",attrs:{src:i(914),alt:""},on:{click:t.edit}})])]),t._v(" "),r("p",{staticClass:"explain"},[t._v("说明："+t._s(t.info.explain))]),t._v(" "),r("p",{staticClass:"tips"},[t._v("最终解释权归商户所有")]),t._v(" "),r("div",{staticClass:"hr"}),t._v(" "),r("div",{staticClass:"goods",on:{click:function(e){t.$router.push({path:"/identify-goods"})}}},[r("span",[t._v("特约认证活动商品"),0!==t.info.goodsCount?r("span",[t._v("（"+t._s(t.info.goodsCount)+"）")]):t._e()]),t._v(" "),r("img",{attrs:{src:i(905),alt:""}})])]):t._e(),t._v(" "),t.hasIdentify?t._e():r("div",{staticStyle:{height:"100%"}},[r("div",{staticClass:"unIdentify"},[r("img",{attrs:{src:i(920),alt:""}}),t._v(" "),r("div",{staticClass:"btn",on:{click:function(e){t.$router.push({path:"/card-router/identify-info"})}}},[t._m(1)])])]),t._v(" "),r("transition",{attrs:{name:"fade"}},[r("div",{directives:[{name:"show",rawName:"v-show",value:t.showModule,expression:"showModule"}],staticClass:"mask",on:{click:function(e){t.showModule=!1}}})]),t._v(" "),r("transition",{attrs:{name:"fade"}},[r("div",{directives:[{name:"show",rawName:"v-show",value:t.showModule,expression:"showModule"}],staticClass:"module"},[r("div",{staticClass:"title"},[r("span"),r("span",[t._v(t._s(t.info.shopName))]),r("span")]),t._v(" "),r("p",[t._v("专属特权")]),t._v(" "),r("p",[t._v("再返佣"+t._s(t.info.one_discount)+"%")]),t._v(" "),r("div",{staticClass:"box"},[r("Qrcode",{attrs:{value:t.url,type:"img"}})],1),t._v(" "),r("p",[t._v("扫描二维码立享优惠")])])])],1):t._e()},staticRenderFns:[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"left"},[i("span"),t._v(" "),i("span",[t._v("特约认证返佣")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("img",{attrs:{src:i(903),alt:""}}),t._v(" "),r("span",[t._v("点我立即设置")])])}]}},272:function(t,e,i){function r(t){i(2088),i(2089)}var a=i(34)(i(1702),i(2261),r,"data-v-a7da3d9c",null);t.exports=a.exports},903:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAABGdBTUEAALGPC/xhBQAAALdJREFUSA1jZCAD/P//nweoTQyq9RUjI+MXMowhXQvQ4lgghoFY0k1gYGAiRxM19IxaTI1QJMqM0aAmKpiooWg0qKkRikSZMfKCmgVY0jcQFTaoivSQuIFAM5SR+EQxGUFVDFEqqaxowOKYBegRazI84wHUUwvV1wykd5BqBguw9XCMVE1ocXqbHDMGLKhHLSY1uslWPxrUZAcdqRpHg5rUECNb/YAFNaiSIAd8Bmq6B9UIYg8dAABbQCmTEPzeWgAAAABJRU5ErkJggg=="},905:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAAXNSR0IArs4c6QAAAS9JREFUKBWFkr9KxEAQh2+XID5LkmewsrITCy0OizT+AzlE4SwOPRDOQjhBsTm0ECy0uUKsrHyHJIVvomji94uurEnUgd2Znfn2N5MlnTRNt/I8n+/8Y9YYk5RleQ+88Bcr8AlwljUFXvwNtmEY7gAfA84URXEHvNwGWyWjKNoHHhIGXLgBXq3Dxk9kWdYHHHGpwK/HcTxx9R+gkqj1GGEMXHLcptu58lVrBc6Y+dRau6kzqmd02VXcUFRSBpDgJsDcs4OGYkV9bmr9ba0gc25AXEqNWfcY56gBfn3MhaSA9DEnVazNmfc8iJVrrc8DdEDxEJV3VkK7aycgH2gDGgH1Cd+AukC3yvtm+M3GJHoAr6wVoKkPuDigOMfhBb8E9OAKda+f4IoHfQZ6rBf98wfpQItrw30jTwAAAABJRU5ErkJggg=="},913:function(t,e,i){t.exports=i.p+"static/img/identify_card.b069dcb.png"},914:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAABRFJREFUaAXVWl1sU2UYXtvt9OfQwVropmCECY6pEEJC9EJNxIDBBOMViTHGK028gMUsYd4YnV545RLujNcSI16YmIgxJgaDIZgFboYMyTLGKE03NkZh/Vkpxef50u/k7HB+29MzeZOn/c73+zzf+/2drw11+GOdqKYPyADdQBJQAMbTakAVuAfcBeaBPMD4lizUQmkS3NIAyUc81vUA+Ski2wAFerZmBLBXdwKDgOxhzw0bCtATk8AVwJNXvAgIo/J+YBcQA9phFVQ6AUwDdTcNuBWQQGWvACk3lfqQ5zbqOAuUnOpyM243opL9ACdmUBZHQ1uBBcBWhJOAbaiAPd8FBG2cX2yfAu5YNW4ngIVfAkJWhQOIZ9tc6YqAqQgrARw27Pm1JI/mNXsSoTngkeFkJoATlmN+LYYNmjU1duRmYBa4r89hFBBG4mtAkBNWz8cuzDmRAa4BD2VG40bUjwTHpVJRlNDbh17tTfWsj8qK3HxPXp0p/HnugulYdlO+wY0cp2R+vQCGuUnZ2vBH7+4YPf7BMTUeS9tmNEsMhervHf185LtTv97UJ+/b+3zy68+G3vz25E9/GdP0+RphcpwBxI6tF8Djge0Oq6pq+IuRD4cSsWiqVFlZLJcrPJy5tuVieWn84mVuUpqR/G/fn/i0Z/06rjYdEPCDlmgeIEdyvcRkKYAHM55tbO3IW69vJvnlYmU+PXjw42q1qo1F24IWiXryS4Xl7PDoidMWWY3R5HoVqHLS0qheihERZh+pDUnhoVKlfMdv8m+8M/Tl+MV/3HqUXIXH9ALMOLclztjzHslLTpoAquF5PhDziTy5knMnPcCAcT9AlP/mI3mSI+c+CuDm0HZzIs+9paen22tHZiiA77BtNSfybHzq/I+f3Ljw8xiXag9kupm5rccGN+RJOJNOPa0mYpueG9iqehCQpADuAW0xt+RbaFyhAMf1v5kGAiBPWmIVaoafbZmAyAsO9EDNlo3HxCDJkzsFNHWhZKYrYPKkIM5Cbs8fZpxXxZ0+OTbCUyUPZk0eD1bV5+LhHj3Au8qWjet3VOlSF5YK0wGRJ+e7XIF40TrAp1asWCzWn9h9eJjfrdTjsew8PZAHeNHasgVMnpzzchWiiMfNyFmsQiSefdzYS870AI0CHPeDucXb4mJJTcTT6fQG33ZwLr9dSmcc76f1G7lbFcHI/oNcRafrb95eQKTtrUQ8Hg/NXfplLKkmemsP6qWVlaoQZN+Wc2osqiQjkXA0m7818dSew185lxBX8OKlXn/+5m3BM4Blz9ZqtY75xcLll1/cPYCT40alqzPhB8KRcCSXX5h8/9joN9eu58oOAuihc4BY7fQeYLntwD4GnGzPrmfX9W5Ke7rYsqpzZjZX+nfquhNxWXwcgSn5YBTAOXEAcLydkxUE/M1R8jug7TVyEkseTDgLuJlIskxQ3+REbhp5NqyfA3ym8faXv4xsA4weQtSaGEmfAQrG1s0EMA9XF2ILH/4H9jc45Mx4WAlgXt4i85cR/riwVp5gz5M8r9RNzU4AC1DEHMAfFyyXV6S1wzjmzwCmPS8bdBLAfBxKs0AGiANBGFebP4BHxryxcS9DgytWP8DdWlzyGivz4Zm9PgFMAxw+juZFgKyMQ2knMAj4Nax4tmn7Xw3QxipT8MRViugD3AxHZNNMnOfxlG2gqXfzZjygMdAF6AmK4DzhVSVv+yhQeog9TIJ8/+YrrG9/t/kPvbi3DQiCMmIAAAAASUVORK5CYII="},915:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAABGdBTUEAALGPC/xhBQAAAxBJREFUOBGlVEtIlFEUPufOo7SHFVqUgTNDETnZY2YaFz2oRasIstIeltWqnYuIFoX5T0QY9CBaVYvAB5mKPaRFi6BFEIwzo5bjIsTJIBclEbXR0f/ezvmn/2deWuaFf8495/vud+49595ByBp9Ifc+qcuQQrUdFNiz4JlcHRF7QaDmb/z0Kp2E6U4kVLYfdPWcYrb0+BzmOtpsVf7GRI+5xkoQu76uRE5MfQBQq0zwfyyd5CsucGzyXRr+xuuFKSInpx7MV5y1lFIrU1opZSNBVHOdIeSgmWzelrQMTRLCPs3l0pUaoARLLWGEJj96Giz/zyQmR34ogEXCaXNtmy77ko7HIKEpqS5bMcSfwiE2CynV7QzxFKM+pkbe9UMiiNqb6SiMLSPxIRZnWCb11/04upexARj1RWXiLYmft8R5QhtWSXlLAMKODMAAoVApCEgFD5WmiYD2cZwOO2bxEFY7VWE00uQp0qXeTWqVhBVYuDlB2CUUwhPTz7bUsPI+fFRlxIW6aeKI0OLV4t9xYvoGnarUjOdYhE6Ma17nhPzVRcQDOQQOIIQDoc+VlAypcUOowG13wMYpHZajUr10UusmZq7Hl0XFjsOCdpJcKJYcIZAfWO5QEIxp7t10v+lxU78Q7m1pGE1Qje/OJE6Pq6dALD60vn540sjOSaC0pBoBn+ZmoKZKeZHjK4RoUQW2a9FQWRX9jezMx6XyveANG5pEsF4ykyP3/Q4cG2+nchxKX0wkZbM7K7ZeGY6rjmpbdDAcp9CGdI4xR3wGa4prAueiUyaWUT8GfOg+CohdJoEt9Qd1PXmB57HB3rp84lTC7mxx5mecgAM8lLbHTu+gjWpck4oQETFJTbhD2WrpW2vGDUsb8qP7OL+LjDg5eRMwiUsRi4dbqVzHshel+1TzDh96avOJM2/GBAwa9Y6Hm+nGnGA/e9Cp2n3e4Ems6dSzMdPP6IEZNC0v9HuDdSTUasYsK/Dx38SZO2sCJnASH549TWdtZp8HCmzzlwdPzbbzFHMOv/ySI1c9Fe/p4/m/Lv0NfzY3wjZaIoQAAAAASUVORK5CYII="},919:function(t,e,i){t.exports=i.p+"static/img/unIdentify_bg.101ae68.png"},920:function(t,e,i){t.exports=i.p+"static/img/unIdentify_center.0947169.png"}});