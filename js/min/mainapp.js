function trimStr(e){return e.replace(/(^\s*)|(\s*$)/g,"")}var app=angular.module("wkmapp",["ui.router","ngAnimate"]);app.directive("repeatDone",function(){return{link:function(e,t,i){e.$last&&e.$eval(i.repeatDone)}}}),app.directive("rolltit",function(){return{restrict:"A",template:"<div class='rtitbox'><span class='rtitspan'>{{CurTitle}}</span><span class='rtitspan'>{{CurTitle}}</span></div>",link:function(e,t,i){t.children(".rtitbox")[0].addEventListener("webkitAnimationEnd",function(){$(this).css("animation",""),$(this).css("-webkit-animation",""),r()});var r=function(){setTimeout(function(){templeft=t.children(".rtitbox").children(".rtitspan")[0].clientWidth,$(t.children(".rtitbox")).css("width",2*templeft),$(t.children(".rtitbox").children("span")).eq(1).css("left",templeft),t.children(".rtitbox").css("animation","leftroll 5s both linear"),t.children(".rtitbox").css("-webkit-animation","leftroll 5s both linear")},2e3)};r()}}}),app.directive("ngTouchstart",function(){return{controller:["$scope","$element",function(e,t){function i(i){var r=t.attr("ng-touchstart");e.$apply(r)}t.bind("touchstart",i)}]}}),app.controller("mainController",function(e,t,i,r,n,l,a){function s(e){str=e.split("[");for(var t=1;t<str.length;t++){var i=str[t].split("]")[0],n=str[t].split("]")[1],l=i.split(":")[0],a=i.split(":")[1],s=i.split(".")[1],o=60*parseInt(l)+parseInt(a)+parseFloat("0."+s);r.shijianshuzu[t-1]=o,n=n.replace("|","<br/>"),r.gecishuzu[t-1]=n}}if(e.pageClass="page-home",r.bookTree=[],r.UnitTree=[],r.isModule,r.curMusicNo,r.isGuide=!0,r.GuideStat=[0,0],e.GoBack=function(){history.back()},e.GoTo=function(e){a.path("/"+e)},r.UpdateBookModule=function(){var e=r.bookTree.SubTree[0].SubTree[0].TreeName;"P"!=e.substring(0,1)||isNaN(e.substring(1))?r.isModule=!0:r.isModule=!1},r.GuideArr=[{guide:["<div class='mg_div'><div class='guide-2'></div><div class='guide-1' ng-click='guidePlayNext()'></div></div>","<div class='mg_div'><div class='guide-3'></div><div class='guide-4'></div><div class='guide-1' ng-click='guidePlayNext(2)'></div></div>"]},{guide:["<div class='mg_div'><div class='guide-5'></div><div class='guide-6'></div><div class='guide-1' ng-click='guidePlayNext(1)'></div></div>"]},{guide:[]}],e.initMainPage=function(){"/play"==n.router.urlRouter.location&&0==r.UnitTree.length&&(0==r.bookTree.length?a.path("/selbook"):a.path("/selunit")),"/selunit"==n.router.urlRouter.location&&0==r.bookTree.length&&a.path("/selbook")},r.guidePlayNext=function(t){r.GuideStat[1]<r.GuideArr[r.GuideStat[0]].guide.length-1?(r.GuideStat[1]++,$(".mg_div").remove(),i.append(l(r.GuideArr[r.GuideStat[0]].guide[r.GuideStat[1]])(e))):($(".mg_div").remove(),$(".Gmask").remove()),localStorage.GuideNum=t},localStorage.bookTree&&(r.bookTree=JSON.parse(localStorage.bookTree),r.UpdateBookModule()),localStorage.UnitTree&&(r.UnitTree=JSON.parse(localStorage.UnitTree)),r.curMusicNo="0,0,0",localStorage.curMusicNo&&(r.curMusicNo=localStorage.curMusicNo),r.isplay=!1,r.isDisc=!0,r.loop=!0,r.iserror=!1,r.isplayover=!1,r.isLoaded=!1,r.playobj=document.getElementById("player"),r.playobj.addEventListener("error",function(){r.iserror=!0,r.isplay=!1,console.log(r.playobj.error.code),4==r.playobj.error.code&&(r.iserror=!1)},!0),r.playobj.addEventListener("ended",function(){var t=r.GetcurMusicNo("next");null==t?(r.isplayover=!0,r.isplay=!1,e.$apply()):r.playmusic(t)},!0),r.parseTime=function(e){var t,i;return t=parseInt(e/60),i=parseInt(e-60*t),t<10&&(t="0"+t),i<10&&(i="0"+i),t+":"+i},r.playobj.addEventListener("loadeddata",function(){r.iserror=!1,r.tempsumtime=r.playobj.duration,r.sumTime=r.parseTime(r.tempsumtime),r.playobj.currentTime=localStorage.curTime,r.isplay?r.playobj.play():r.playobj.pause(),r.isLoaded=!0,e.$apply()}),r.shijianshuzu=[],r.gecishuzu=[],r.playmusic=function(e){r.isLoaded=!1,localStorage.curTime=0;var i=e.split(","),n=r.UnitTree[i[0]].SubTree[i[1]].SubTree[i[2]];r.CurTitle=r.UnitTree[i[0]].TreeName+"\\"+r.UnitTree[i[0]].SubTree[i[1]].TreeName+"\\"+n.TreeName;var l="http://reding.91118.com/"+n.Path+"/"+n.TreeName+".mp3";r.playobj.src=l;var a="http://walkman.91sst.com/html5/LcrTxt?jsoncallback=JSON_CALLBACK&path="+n.Path+"/"+n.TreeName+".lrc";r.shijianshuzu=[],r.gecishuzu=[],t.jsonp(a).success(function(e){s(decodeURIComponent(e))}),r.curMusicNo=e,localStorage.curMusicNo=e,r.translateY=$(".lyricsBox").outerHeight()/2},r.GetcurMusicNo=function(t){var i=r.curMusicNo.split(","),n=!1;switch(t){case"next":i[2]++,i[2]>=r.UnitTree[i[0]].SubTree[i[1]].SubTree.length&&(i[2]=0,i[1]++,i[1]>=r.UnitTree[i[0]].SubTree.length&&(i[1]=0,i[0]++,i[0]>=r.UnitTree.length&&(e.loop?i[0]=0:n=!0)));break;case"prev":i[2]--,i[2]<0&&(i[1]--,i[1]<0&&(i[0]--,i[0]<0&&(e.loop?i[0]=r.UnitTree.length-1:(i[0]++,n=!0)),i[1]=r.UnitTree[i[0]].SubTree.length-1),i[2]=r.UnitTree[i[0]].SubTree[i[1]].SubTree.length-1)}return n?null:i[0]+","+i[1]+","+i[2]},r.ResetPlayInfo=function(){localStorage.removeItem("UnitTree"),r.UnitTree=[],r.curMusicNo="0,0,0",localStorage.removeItem("curMusicNo"),localStorage.removeItem("curTime"),r.isplay=!1,r.iserror=!1,r.isplayover=!1,r.isLoaded=!1,r.shijianshuzu=[],r.gecishuzu=[],r.playobj.pause(),r.playobj.src=""},localStorage.curTime&&localStorage.curMusicNo&&r.UnitTree.length>0){var o=localStorage.curMusicNo.split(","),u=r.UnitTree[o[0]].SubTree[o[1]].SubTree[o[2]];r.CurTitle=r.UnitTree[o[0]].TreeName+"\\"+r.UnitTree[o[0]].SubTree[o[1]].TreeName+"\\"+u.TreeName;var c="http://reding.91118.com/"+u.Path+"/"+u.TreeName+".mp3";r.playobj.src=c;var p="http://walkman.91sst.com/html5/LcrTxt?jsoncallback=JSON_CALLBACK&path="+u.Path+"/"+u.TreeName+".lrc";r.shijianshuzu=[],r.gecishuzu=[],t.jsonp(p).success(function(e){s(decodeURIComponent(e))}),r.translateY=$(".lyricsBox").outerHeight()/2}r.showTips=function(t,r){0!=$("#tipslayer").length&&$("#tipslayer").remove(),tipslayer="<div id='tipslayer'>"+t+"</div>",i.append(l(tipslayer)(e));var n=document.getElementById("tipslayer");n.style.WebkitAnimation="hideTips .5s 2s",n.style.animation="hideTips .5s 1s",n.addEventListener("webkitAnimationEnd",function(){$(n).remove(),null!=r&&e.$apply(r)})},r.popInfo=function(t,r){for(var n=t.title||"温馨提示",a=t.cont,s=t.btnArr,o=t.btnStyleArr,u=t.btnFunArr,c="",p=0;p<s.length;p++)c=c+"<div class='msgbtn btn_"+o[p]+"' ng-click='"+u[p]+"'>"+s[p]+"</div>";var d="<div id='msginfo' class='msginfo' ng-class='{hide:ishide}'><div class='msgbody'><b>"+n+"</b><br>"+a+"</div><div class='msgfoot'>"+c+"</div></div>";i.append(l("<div id='mask' class='mask' ng-class='{hide:ishide}'></div>")(e)),i.append(l(d)(e))},r.cancel=function(){e.ishide=!0,setTimeout(function(){$(".mask").remove(),$(".msginfo").remove(),e.ishide=!1},500)},r.clearAllPop=function(){r.islayer=!1,$(".mask").remove()},e.initMainPage()}),app.controller("SelTextBookController",function(e,t,i,r,n,l,a){r.get("jclist.json").success(function(r){var a=r;console.log(a),e.jcVersion=a,e.jcTemp=a[0].SubTree,e.FjcTemp=a[0],n.islayer=!1,e.seljcBook,e.pageClass="page-home",e.init=function(){e.selVersion(0,0),localStorage.GuideNum||(n.GuideStat=[1,0],t.append(i("<div id='mask' class='Gmask'></div>")(e)),t.append(i(n.GuideArr[n.GuideStat[0]].guide[n.GuideStat[1]])(e)))},e.doIScroll=function(){myScroll=new IScroll("#wrapper",{mouseWheel:!0,click:!0})},e.popselbook=function(){n.islayer?(n.islayer=!1,$(".mask").remove()):(t.children(".view").append(i("<div class='mask' ng-click='clearAllPop()'></div>")(e)),n.islayer=!0)},e.selVersion=function(t,i){0==t&&(t=e.jcTemp),0==i&&(i=e.FjcTemp),n.clearAllPop(),e.selJcV=i.TreeName,e.jcBooks=t,n.cancel()},e.selBook=function(t){var i={};i.title="提示",i.cont="确定下载使用这本书吗？",i.btnArr=["确定","取消"],i.btnStyleArr=[1,2],i.btnFunArr=["selBookOk()","cancel()"],n.popInfo(i,e),e.seljcBook=t},n.selBookOk=function(){n.cancel(),localStorage.bookTree=JSON.stringify(e.seljcBook),n.bookTree=JSON.parse(localStorage.bookTree),n.UpdateBookModule(),n.ResetPlayInfo(),l.path("/selunit")},e.init()})}),app.controller("SelUnitController",function(e,t,i,r,n,l){0==n.bookTree.length&&l.path("/selbook"),e.pageClass="page-unit",e.selsum=0,e.isCusSel=!1,e.isCurTab=!0,e.pageArea;var a=0;for(m=0;m<n.UnitTree.length;m++)a+=n.UnitTree[0].SubTree.length;e.selsum=a,a>1&&(e.isCusSel=!0),document.querySelector(".unitContList").addEventListener("scroll",function(){this.scrollTop>0?e.isScroll=!0:0==this.scrollTop&&(e.isScroll=!1),e.$apply()}),e.changeTab=function(t){0==t?e.isCurTab=!0:(e.isCurTab=!1,e.pageArea=c())},e.keyin=function(e){$(".curpage").html($(".curpage").html()+e)},e.keydel=function(e){$(".curpage").html($(".curpage").html().substring(0,$(".curpage").html().length-1))},e.selPage=function(e){$(".inSelPage>.curpage").removeClass("curpage"),$(e.target).addClass("curpage"),o()};var o=function(){var t=parseInt($(".startPage").html()),i=parseInt($(".endPage").html());t<e.pageArea[0]||t>e.pageArea[1]||""==$(".startPage").html()?(e.isStartErr=!0,n.showTips("起始页码输入有误")):e.isStartErr=!1,i<e.pageArea[0]||i>e.pageArea[1]||""==$(".endPage").html()?(e.isEndErr=!0,n.showTips("结尾页码输入有误")):e.isEndErr=!1,e.isStartErr||e.isEndErr||(t>i?(e.isStartErr=!0,e.isEndErr=!0,n.showTips("起始页码不能大于结尾页码")):(e.isStartErr=!1,e.isEndErr=!1))},c=function(){return startPage=e.listUnit[0].SubTree[0].SubTree[0].TreeName,mudelleng=e.listUnit.length,unitLeng=e.listUnit[mudelleng-1].SubTree.length,pageLeng=e.listUnit[mudelleng-1].SubTree[unitLeng-1].SubTree.length,endPage=e.listUnit[mudelleng-1].SubTree[unitLeng-1].SubTree[pageLeng-1].TreeName,startPage=parseInt(startPage.replace("P","")),endPage=parseInt(endPage.replace("P","")),[startPage,endPage]};e.pagePlay=function(){if($(".inSelPage>.curpage").removeClass("curpage"),o(),!e.isStartErr&&!e.isEndErr){var t=parseInt($(".startPage").html()),i=parseInt($(".endPage").html()),r=angular.copy(e.listUnit),a=[];for(m=0;m<r.length;m++){var s=[];for(u=0;u<r[m].SubTree.length;u++){var c=[];for(p=0;p<r[m].SubTree[u].SubTree.length;p++)PageNum=parseInt(r[m].SubTree[u].SubTree[p].TreeName.replace("P","")),t<=PageNum&&PageNum<=i&&c.push(r[m].SubTree[u].SubTree[p]);c.length>0&&(r[m].SubTree[u].SubTree=c,r[m].SubTree[u].OriginalIndex=u,s.push(r[m].SubTree[u]))}s.length>0&&(r[m].SubTree=s,r[m].OriginalIndex=m,a.push(r[m]))}n.ResetPlayInfo(),localStorage.UnitTree=JSON.stringify(a),n.UnitTree=a,localStorage.curMusicNo="0,0,0",n.curMusicNo="0,0,0",n.playmusic(n.curMusicNo),l.path("/play")}},e.unit_init=function(){n.isModule?list=n.bookTree.SubTree:list=new Array(n.bookTree);var t=0;for(m=0;m<n.UnitTree.length;m++)for(s=0;s<n.UnitTree[m].SubTree.length;s++)list[n.UnitTree[m].OriginalIndex].SubTree[n.UnitTree[m].SubTree[s].OriginalIndex].IsSelectUnit=!0;for(m=0;m<list.length;m++)t+=list[m].SubTree.length;e.UnitSum=t,e.listUnit=list;var i=document.querySelector(".progressContainer"),r=(i.querySelector("canvas"),!1);waveLoading.init({showText:!0,callback:function(){console.log("进度条走完啦！"),removeClass(message,"hide"),r=!0,addClass(shade,"hide")}}),waveLoading.draw(),waveLoading.setProgress(50)},e.clickAll=function(){$("dd[data-id]").addClass("selUnit"),e.playAll()},e.clickUnit=function(t){e.isCusSel?$(t.target).parent().hasClass("selUnit")?($(t.target).parent().removeClass("selUnit"),e.selsum--):($(t.target).parent().addClass("selUnit"),e.selsum++):($("dd[data-id]").removeClass("selUnit"),$(t.target).parent().addClass("selUnit"),e.playAll())},e.playAll=function(){n.ResetPlayInfo();var t=[],i=$(".selUnit").siblings("dt");for(m=0;m<i.length;m++){var r=i.eq(m).data("id"),a=angular.copy(e.listUnit[r]);a.SubTree=[];var o=i.eq(m).siblings(".selUnit");for(s=0;s<o.length;s++)a.SubTree.push(e.listUnit[r].SubTree[o.eq(s).data("id")]),a.SubTree[s].OriginalIndex=o.eq(s).data("id");a.OriginalIndex=r,t.push(a)}localStorage.UnitTree=JSON.stringify(t),n.UnitTree=t,localStorage.curMusicNo="0,0,0",n.curMusicNo="0,0,0",n.playmusic(n.curMusicNo),l.path("/play")},e.CusSel=function(){e.isCusSel=!e.isCusSel,e.isCusSel?e.CusSelValue="单选":e.CusSelValue="多选"},e.unit_init()}),app.controller("PlayController",function(e,t,r,n,l,a,s){function o(){var t=!0,r=!0,n=!0;e.units=a.UnitTree;var l=decodeURI(a.playobj.src),s=l.split("/");for(s.reverse(),i=0;i<a.UnitTree.length;i++){for(j=0;j<a.UnitTree[i].SubTree.length;j++){for(m=0;m<a.UnitTree[i].SubTree[j].SubTree.length;m++){var o=a.UnitTree[i].SubTree[j].SubTree[m],u="http://reding.91118.com/"+o.Path+"/"+o.TreeName+".mp3";l==u&&(a.curMusicNo=i+","+j+","+m,localStorage.curMusicNo=a.curMusicNo,t=!1)}a.UnitTree[i].SubTree[j].Path.indexOf(s[2])>-1&&(n=!1)}a.UnitTree[i].Path.indexOf(s[3])>-1&&(r=!1)}if(t){var c=a.curMusicNo.split(",");if(n&&r)a.UnitTree.SubTree.length-1<c[0]?a.curMusicNo="0,0,0":a.curMusicNo=c[0]+",0,0";else if(n)if(a.UnitTree[c[0]].SubTree.length-1<c[1]){var p=a.UnitTree[c[0]].SubTree.length-1;a.curMusicNo=c[0]+","+p+","+(a.UnitTree[c[0]].SubTree[p].SubTree.length-1),a.curMusicNo=a.GetcurMusicNo("next")}else a.curMusicNo=c[0]+","+c[1]+",0";else a.UnitTree[c[0]].SubTree[c[1]].SubTree.length-1<c[2]&&(a.curMusicNo=a.GetcurMusicNo("next"));a.playmusic(a.curMusicNo)}}function u(){e.playTime=setInterval(c,50)}function c(){if(a.isLoaded){var t=p(),i=a.playobj.currentTime;localStorage.curTime=i,e.curTime=a.parseTime(i),b||(e.curProgress=i/a.tempsumtime*100),g!=t&&(g=t,$("#lyricsMain>.cur").removeClass("cur"),$("#lyricsMain>p").eq(g-1).addClass("cur"),posTop=$("#lyricsMain>p").eq(g-1).position().top,g>=2&&(h=T-posTop,a.translateY=h)),e.$apply()}}function p(){var e=0;for(e=0;e<a.shijianshuzu.length;e++)if(a.shijianshuzu[e]>=a.playobj.currentTime)return e;return e-1}0==a.UnitTree.length&&(0==a.bookTree.length?s.path("/selbook"):s.path("/selunit")),e.pageClass="page-play",e.isshowplaylist=!1,e.playTime;var d,g=0,T=$(".lyricsBox").outerHeight()/2,h=0,b=!1;d=document.getElementById("vplay"),playtab=document.getElementById("playtab"),lyrtab=document.getElementById("lyrtab"),FastClick.attach(d),d.addEventListener("click",function(e){a.isplayover?(a.playmusic("0,0,0"),a.isplayover=!1):a.iserror?a.showTips("当前音频不可播放。"):(a.isplay?a.playobj.pause():(""==a.playobj.src&&a.playmusic(a.curMusicNo),a.playobj.play()),a.isplay=!a.isplay,a.$apply())},!1),playtab.addEventListener("click",function(t){a.isDisc=!a.isDisc,e.$apply()},!1),lyrtab.addEventListener("click",function(t){a.isDisc=!a.isDisc,e.$apply()},!1),e.playSelMusic=function(e,t,i){a.playmusic(e+","+t+","+i)},e.iscurplay=function(e,t,i){if(a.curMusicNo==e+","+t+","+i)return!0},e.play_init=function(){e.units=a.UnitTree;var t,i,r=document.getElementById("progressDot"),s=document.getElementById("progressing"),o=parseInt($("html").css("font-size").replace("px",""));r.addEventListener("touchstart",function(e){t=e.touches[0].clientX,i=$(s).width(),b=!0}),r.addEventListener("touchmove",function(e){posX=e.touches[0].clientX-t,posPer=posX/(5.5*o),$(s).css("width",i+posX)}),r.addEventListener("touchend",function(e){var t=$(s).width()/(5.5*o);a.playobj.currentTime=a.tempsumtime*t,b=!1}),u(),(!localStorage.GuideNum||localStorage.GuideNum<2)&&(a.GuideStat=[0,0],n.append(l("<div id='mask' class='Gmask'></div>")(e)),n.append(l(a.GuideArr[a.GuideStat[0]].guide[a.GuideStat[1]])(e)))},e.ctrl_prev=function(){var e=a.GetcurMusicNo("prev");null!=e?a.playmusic(e):a.showTips("已经是第一首歌曲。")},e.ctrl_next=function(){var e=a.GetcurMusicNo("next");null!=e?a.playmusic(e):a.showTips("已经是最后一首歌曲。")},e.IsLoop=function(){a.loop=!a.loop},e.showPlayList=function(){e.isshowplaylist=!0,e.islayer=!0,n.append(l("<div class='mask' ng-click='clearAllPop()'></div>")(e))},e.closePlayList=function(){e.clearAllPop()},e.clearAllPop=function(){e.islayer=!1,$(".mask").remove()},e.delMusic=function(e,t,i){null==t&&null==i?a.UnitTree.splice(e,1):null==i?(a.UnitTree[e].SubTree.splice(t,1),0==a.UnitTree[e].SubTree.length&&a.UnitTree.splice(e,1)):(a.UnitTree[e].SubTree[t].SubTree.splice(i,1),0==a.UnitTree[e].SubTree[t].SubTree.length&&a.UnitTree[e].SubTree.splice(t,1)),localStorage.UnitTree=JSON.stringify(a.UnitTree),0==a.UnitTree.length?(a.ResetPlayInfo(),s.path("/selunit")):o()},e.ClearUnitTree=function(){a.ResetPlayInfo(),s.path("/selunit")},e.play_init()}),app.config(function(e,t){t.otherwise("/play"),e.state("selbook",{url:"/selbook",templateUrl:"views/selbook.html",controller:"SelTextBookController",onEnter:function(){},onExit:function(){}}).state("play",{url:"/play",templateUrl:"views/play.html",controller:"PlayController",onEnter:function(){}}).state("selunit",{url:"/selunit",templateUrl:"views/selunit.html",controller:"SelUnitController",onEnter:function(){}})});