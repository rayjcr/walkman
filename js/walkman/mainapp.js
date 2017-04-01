var app = angular.module("wkmapp", ["ui.router","ngAnimate"]);
//FastClick.attach(document.body);
app.directive('repeatDone', function() {
    return {
        link: function(scope, element, attrs) {
            if (scope.$last) {  // 这个判断意味着最后一个 OK
                scope.$eval(attrs.repeatDone) // 执行绑定的表达式
            }
        }
    }
})

app.directive("rolltit", function () {
    return {
    	restrict:"A",
    	template: "<div class='rtitbox'><span class='rtitspan'>{{CurTitle}}</span><span class='rtitspan'>{{CurTitle}}</span></div>",
        link:function(scope,element,attr){
        	//scope.rolltit = attr.rolltit;
        	
        	element.children(".rtitbox")[0].addEventListener("webkitAnimationEnd",function(){
				$(this).css("animation","");
				$(this).css("-webkit-animation","");
				loop();
			});
        	
        	
        	var loop = function(){
		        setTimeout(function(){
		        	templeft=element.children(".rtitbox").children(".rtitspan")[0].clientWidth;
					$(element.children(".rtitbox")).css("width",templeft*2);
					//if(element.children(".rtitbox").children("span").length<2){
						//element.children(".rtitbox").append(element.children(".rtitbox").children(".rtitspan").clone());
						$(element.children(".rtitbox").children("span")).eq(1).css("left",templeft);
					//}
					
					element.children(".rtitbox").css("animation","leftroll 5s both linear");
	        		element.children(".rtitbox").css("-webkit-animation","leftroll 5s both linear");
		        },2000)
        	}
        	loop();
        }
    }
})

app.directive("ngTouchstart", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {
            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr("ng-touchstart");
                $scope.$apply(method);
            }
        }]
    }
})



////初始化主体页面
app.controller('mainController', function ($scope, $http, $element, $rootScope, $state, $compile, $location) {
	
	//$rootScope.playing = false;	
    // $location.replace();
	$scope.pageClass = 'page-home';
	////书本
	$rootScope.bookTree=[];
	///播放列表
	$rootScope.UnitTree=[];
	///目录结构类型
	$rootScope.isModule;
	///当前播放的页
	$rootScope.curMusicNo;
	////是否需要新手引导（index页面先初始化）
	$rootScope.isGuide=true;
	$rootScope.GuideStat=[0,0];
	
	///当前播放进度
	///$rootScope.curTime;
    ////回退全局
	$scope.GoBack = function() { 
		history.back();  	
	};
    ////跳转视图
	$scope.GoTo = function (viewname) {
	    $location.path("/"+viewname)
	};

	$rootScope.UpdateBookModule = function(){
    	/////决策层级TreeName
		var TreeName=$rootScope.bookTree.SubTree[0].SubTree[0].TreeName;		
    	if(TreeName.substring(0, 1) == "P" && !isNaN(TreeName.substring(1))){
    		$rootScope.isModule=false;
    	}else{
    		$rootScope.isModule=true;
    	}
    }
	
	$rootScope.$watch('isplay',function(){
		console.log('变动了');
		console.log("$rootScope.isplay="+$rootScope.isplay);
	})
	
	$rootScope.GuideArr =[
	{ guide: ["<div class='mg_div'><div class='guide-2'></div><div class='guide-9' ng-click='guidePlayNext(2)'></div></div>", "<div class='mg_div'><div class='guide-3'></div><div class='guide-4'></div><div class='guide-1' ng-click='guidePlayNext(3)'></div></div>","<div class='mg_div'><div class='guide-7'></div><div class='guide-1' ng-click='guidePlayNext(4)'></div></div>","<div class='mg_div'><div class='guide-8'></div><div class='guide-1' ng-click='guidePlayNext(5)'></div></div>"]},
	{ guide: ["<div class='mg_div'><div class='guide-5'></div><div class='guide-6'></div><div class='guide-1' ng-click='guidePlayNext(1)'></div></div>"] },
	{guide:[]}
	];
    
    //初始化MainPage
    $scope.initMainPage = function(){
//  	if($rootScope.isGuide){
//  		$rootScope.GuideStat=[2,0];
//  		$element.append($compile("<div id='mask' class='mask'></div>")($scope));
// 			$element.append($compile($rootScope.GuideArr[$rootScope.GuideStat[0]].guide[$rootScope.GuideStat[1]])($scope));
        //  	}
        if ($state.router.urlRouter.location == "/play" && $rootScope.UnitTree.length == 0)
        {
            if ($rootScope.bookTree.length ==0) {
                $location.path('/selbook');
            } else {
                $location.path('/selunit');
            }
        }
        if ($state.router.urlRouter.location == "/selunit" && $rootScope.bookTree.length ==0) {
            $location.path('/selbook');
        }
    }
    
    $rootScope.guidePlayNext = function(num){
	if($rootScope.GuideStat[1]<$rootScope.GuideArr[$rootScope.GuideStat[0]].guide.length-1){
		$rootScope.GuideStat[1]++;
		$(".mg_div").remove();
		$element.append($compile($rootScope.GuideArr[$rootScope.GuideStat[0]].guide[$rootScope.GuideStat[1]])($scope));
    }else{
    	$(".mg_div").remove();
    	$(".Gmask").remove();
    }
	localStorage.GuideNum = num;
    }
    

	/////当前课本对象
	if(localStorage.bookTree){
    	$rootScope.bookTree=JSON.parse(localStorage.bookTree);
		$rootScope.UpdateBookModule();
	}
	/////当前播放列表
	if(localStorage.UnitTree){
    	$rootScope.UnitTree=JSON.parse(localStorage.UnitTree);
	}
	$rootScope.curMusicNo = "0,0,0";
    /////当前播放页面
	if(localStorage.curMusicNo){
		$rootScope.curMusicNo=localStorage.curMusicNo;
	}

    /////播放器相关
    ///是否播放----开启了自动播放
	$rootScope.isplay = false;
    ////歌词/封面切换
	$rootScope.isDisc = true;
    ////是否循环
	$rootScope.loop = true;
    ///是否报错
	$rootScope.iserror = false;
    /////是否播放完列表
	$rootScope.isplayover = false;
    /////是否加载完
	$rootScope.isLoaded = false;

	$rootScope.playobj = document.getElementById("player");
	
	$rootScope.playobj.addEventListener("error", function () {
	    $rootScope.iserror = true;
	    $rootScope.isplay = false;
	    //		错误提示
	    console.log($rootScope.playobj.error.code);
	    if ($rootScope.playobj.error.code == 4)
	    {
	        $rootScope.iserror = false;
	    }
	    //      console.log("找不到指定的src地址！");
	    //		1 = MEDIA_ERR_ABORTED - 取回过程被用户中止
	    //		2 = MEDIA_ERR_NETWORK - 当下载时发生错误
	    //		3 = MEDIA_ERR_DECODE - 当解码时发生错误
	    //		4 = MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持音
	}, true);
	$rootScope.playobj.addEventListener("ended", function () {
	    var crumusic = $rootScope.GetcurMusicNo("next");
	    if (crumusic == null) {
	        $rootScope.isplayover = true;
	        $rootScope.isplay = false;
	        $scope.$apply();
	    } else {
	        $rootScope.playmusic(crumusic);
	    }

	}, true);

	$rootScope.parseTime=function(sec) {
	    var m, s;
	    m = parseInt(sec / 60);
	    s = parseInt(sec - m * 60);
	    if (m < 10) {
	        m = "0" + m;
	    }
	    if (s < 10) {
	        s = "0" + s;
	    }
	    return m + ":" + s
	}
	$rootScope.playobj.addEventListener("loadeddata", function () {
	    $rootScope.iserror = false;
	    //console.log(playobj.duration);
	    $rootScope.tempsumtime = $rootScope.playobj.duration;
	    $rootScope.sumTime = $rootScope.parseTime($rootScope.tempsumtime);

	    $rootScope.playobj.currentTime = localStorage.curTime;
	    if ($rootScope.isplay) {
	        $rootScope.playobj.play();
	    } else {
	        $rootScope.playobj.pause();
	    }
	    // $rootScope.isplay = true; 
	    $rootScope.isLoaded = true;
	    $scope.$apply();
	   // alert("GG");
	});

	//$rootScope.playobj.onloadeddata = function () {
	//    //alert("Browser has loaded the current frame");
	//    $rootScope.iserror = false;
	//    //console.log(playobj.duration);
	//    $rootScope.tempsumtime = $rootScope.playobj.duration;
	//    $rootScope.sumTime = $rootScope.parseTime($rootScope.tempsumtime);
	    
	//    $rootScope.playobj.currentTime = localStorage.curTime;
	//    if ($rootScope.isplay)
	//    {
	//        $rootScope.playobj.play();
	//    }
	//    // $rootScope.isplay = true; 
	//    $rootScope.isLoaded = true;
	//    $scope.$apply();
	//}
    ////时间数组
	$rootScope.shijianshuzu = [];
    /////歌词数组
	$rootScope.gecishuzu = [];
	$rootScope.playmusic = function (curMusicNo) {
	    $rootScope.isLoaded = false;
	    localStorage.curTime = 0;
	    var curMusic = curMusicNo.split(',');
	    var page = $rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].SubTree[curMusic[2]];
	    $rootScope.CurTitle = $rootScope.UnitTree[curMusic[0]].TreeName + "\\" + $rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].TreeName + "\\" + page.TreeName;
	    var mp3url = "http://reding.91118.com/" + page.Path + "/" + page.TreeName + ".mp3";
	    $rootScope.playobj.src = mp3url;  //把数组里的保存的地址赋予给playobj对象
	    var lrcUrl = "http://walkman.91sst.com/html5/LcrTxt?jsoncallback=JSON_CALLBACK&path=" + page.Path + "/" + page.TreeName + ".lrc";
	    $rootScope.shijianshuzu = [];
	    $rootScope.gecishuzu = [];
	    $http.jsonp(lrcUrl).success(function (response) {
	        parseshuzu(decodeURIComponent(response));
	    })
	    $rootScope.curMusicNo = curMusicNo;
	    localStorage.curMusicNo = curMusicNo;

	    $rootScope.translateY = $(".lyricsBox").outerHeight() / 2; //歌词父容器的一半高度,用于歌词初始化起点
	   // $scope.$apply();
	} 

    /////组装数组
	function parseshuzu(lrc) {
	    str = lrc.split("[");	
	    for (var i = 1; i < str.length; i++) {
	        var shijian = str[i].split(']')[0];
	        var geci = str[i].split(']')[1];
	        var fen = shijian.split(":")[0];
	        var miao = shijian.split(":")[1];
	        var hmiao = shijian.split(".")[1];
	        //xx:xx.xx 时间转换成总的秒数
	        var sec = parseInt(fen) * 60 + parseInt(miao) + parseFloat("0." + hmiao);
	        //存时间
	        $rootScope.shijianshuzu[i - 1] = sec;///- localStorage.time;
	        //存歌词
	        geci = geci.replace("|", "<br/>")
	        $rootScope.gecishuzu[i - 1] = geci;
	    }
	}

    ///获取下一曲的播放标识
	$rootScope.GetcurMusicNo = function (action) {
	    var curMusic = $rootScope.curMusicNo.split(',');
	    var isempty = false;
	    switch (action) {
	        //////下一曲
	        case "next":
	            curMusic[2]++;
	            if (curMusic[2] >= $rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].SubTree.length) {
	                curMusic[2] = 0;
	                curMusic[1]++;
	                if (curMusic[1] >= $rootScope.UnitTree[curMusic[0]].SubTree.length) {
	                    curMusic[1] = 0;
	                    curMusic[0]++;
	                    if (curMusic[0] >= $rootScope.UnitTree.length) {
	                        if ($scope.loop) {
	                            curMusic[0] = 0;
	                        } else {

	                            isempty = true;
	                        }
	                    }
	                }

	            }

	            break;
	            /////上一曲
	        case "prev":
	            curMusic[2]--;
	            ///////如果小0，跳上一级
	            if (curMusic[2] < 0) {
	                curMusic[1]--;
	                /////跳完上一级如果，这级也小于0，再往上跳一级
	                if (curMusic[1] < 0) {
	                    curMusic[0]--;
	                    if (curMusic[0] < 0) {
	                        if ($scope.loop) {
	                            curMusic[0] = $rootScope.UnitTree.length - 1;
	                        } else {
	                            curMusic[0]++;
	                            isempty = true;
	                        }
	                    }

	                    curMusic[1] = $rootScope.UnitTree[curMusic[0]].SubTree.length - 1;
	                }

	                curMusic[2] = $rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].SubTree.length - 1;

	            }
	            break;
	    }

	    if (isempty) {
	        return null;

	    } else {
	        return (curMusic[0] + "," + curMusic[1] + "," + curMusic[2]);
	    }


	}

    //////重置播放信息
	$rootScope.ResetPlayInfo = function ()
	{
	    ///清空播放列表
	    localStorage.removeItem("UnitTree");
	    $rootScope.UnitTree = [];
	    $rootScope.curMusicNo = "0,0,0";
	    localStorage.removeItem("curMusicNo");
	    localStorage.removeItem("curTime");
	    ////重置播放器属性
	    $rootScope.isplay = false;
	    ///是否报错
	    $rootScope.iserror = false;
	    /////是否播放完列表
	    $rootScope.isplayover = false;
	    /////是否加载完
	    $rootScope.isLoaded = false;
	    ////清空时间歌词数组
	    $rootScope.shijianshuzu = [];
	    $rootScope.gecishuzu = [];
	    //////
	    $rootScope.playobj.pause();
	    $rootScope.playobj.src = "";
	}


    
	if (localStorage.curTime && localStorage.curMusicNo && $rootScope.UnitTree.length>0) {
	    // $rootScope.playmusic($rootScope.curMusicNo);
	    var curMusic = localStorage.curMusicNo.split(',');
	   
	    var page = $rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].SubTree[curMusic[2]];
	    $rootScope.CurTitle = $rootScope.UnitTree[curMusic[0]].TreeName + "\\" + $rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].TreeName + "\\" + page.TreeName;
	    var mp3url = "http://reding.91118.com/" + page.Path + "/" + page.TreeName + ".mp3";
	    $rootScope.playobj.src = mp3url;  //把数组里的保存的地址赋予给playobj对象
	    var lrcUrl = "http://walkman.91sst.com/html5/LcrTxt?jsoncallback=JSON_CALLBACK&path=" + page.Path + "/" + page.TreeName + ".lrc";
	    $rootScope.shijianshuzu = [];
	    $rootScope.gecishuzu = [];
	    $http.jsonp(lrcUrl).success(function (response) {
	        parseshuzu(decodeURIComponent(response));
	    })
	    $rootScope.translateY = $(".lyricsBox").outerHeight() / 2;
	}
	/////
	$rootScope.showTips = function(strtips,action){
		if($("#tipslayer").length!=0){
			$("#tipslayer").remove();
		}	
		tipslayer = "<div id='tipslayer'>"+strtips+"</div>"
		$element.append($compile(tipslayer)($scope));
		var tipsobj=document.getElementById("tipslayer");
		tipsobj.style.WebkitAnimation = "hideTips .5s 2s";
		tipsobj.style.animation = "hideTips .5s 1s";
		tipsobj.addEventListener("webkitAnimationEnd",function(){
		    $(tipsobj).remove();
		    if (action != null) {
		        $scope.$apply(action);
		    }
		});
	}
	
	
	//这里写个弹层组装的层，传递一个弹层信息对象  
    $rootScope.popInfo = function(msgobj,scope){
    	var m_title = msgobj.title||"温馨提示";
    	var m_cont = msgobj.cont;
    	var m_btnarr = msgobj.btnArr;
    	var m_btnstylearr = msgobj.btnStyleArr;
    	var m_btnfunarr = msgobj.btnFunArr;
    	var m_btnstr="";

    	for(var i=0;i<m_btnarr.length;i++){
    		m_btnstr=m_btnstr+"<div class='msgbtn btn_"+m_btnstylearr[i]+"' ng-click='"+m_btnfunarr[i]+"'>"+m_btnarr[i]+"</div>"
    	}
    	var msgLayer = "<div id='msginfo' class='msginfo' ng-class='{hide:ishide}'><div class='msgbody'><b>"+m_title+"</b><br>"+m_cont+"</div><div class='msgfoot'>"+m_btnstr+"</div></div>";
    	$element.append($compile("<div id='mask' class='mask' ng-class='{hide:ishide}'></div>")($scope));
    	$element.append($compile(msgLayer)($scope));	
    }
    
    //弹层的统一关闭的方法
    $rootScope.cancel = function(){
    	$scope.ishide = true;
    	//$scope.$apply();
    	setTimeout(function(){
    		$(".mask").remove();
			$(".msginfo").remove();
			$scope.ishide=false;
    	},500);
    }
    
    $rootScope.clearAllPop = function(){
    	$rootScope.islayer = false;
    	$(".mask").remove();
    }

	$scope.initMainPage();
});

/**选择教程的控制器**/
app.controller('SelTextBookController', function($scope,$element,$compile,$http,$rootScope,$location,$state) { 	

 	$http.get("jclist.json").success( function(response) {
	var TreeNode =	response;
 	//console.log(TreeNode);
 	$scope.jcVersion = TreeNode;
 	$scope.jcTemp = TreeNode[0].SubTree;
 	$scope.FjcTemp = TreeNode[0]; 
 	$rootScope.islayer = false; 
 	$scope.seljcBook; //用户选择的课本的对象，点击后传递给selunit页面
    
    $scope.pageClass = 'page-home';
    
    $scope.init = function(){
		$scope.selVersion(0,0);
		if (!localStorage.GuideNum) {
    		$rootScope.GuideStat=[1,0];
    		$element.append($compile("<div id='mask' class='Gmask'></div>")($scope));
			$element.append($compile($rootScope.GuideArr[$rootScope.GuideStat[0]].guide[$rootScope.GuideStat[1]])($scope));
    	}
    }
    
    $scope.doIScroll = function(){
     	myScroll = new IScroll('#wrapper', { mouseWheel: true,click:true});
    }
     
    $scope.popselbook = function(){
    	if($rootScope.islayer){
    		$rootScope.islayer = false;
    		$(".mask").remove();
    	}else{
    		//console.log($compile("<div class='mask' ng-click='clearAllPop()'></div>")($scope));
	    	$element.children(".view").append($compile("<div class='mask' ng-click='clearAllPop()'></div>")($scope))
	    	$rootScope.islayer = true;
    	}
    }
    
    $scope.selVersion = function(obj,fobj){
		if(obj==0){
			obj = $scope.jcTemp
		}
		if(fobj==0){
			fobj = $scope.FjcTemp
		}	
    	$rootScope.clearAllPop();
		$scope.selJcV = fobj.TreeName;
		$scope.jcBooks = obj;
    	//$scope.jcTemp = obj;
    	//$scope.FjcTemp = fobj;
    	$rootScope.cancel();
    }
      
    $scope.selBook = function(jcobj){
      	var msgobj = {};
      	msgobj.title="提示";
    	msgobj.cont = "确定下载使用这本书吗？";
    	msgobj.btnArr = ["确定","取消"];
    	msgobj.btnStyleArr = [1,2];
    	msgobj.btnFunArr = ['selBookOk()',"cancel()"];
      	$rootScope.popInfo(msgobj,$scope);
      	$scope.seljcBook = jcobj 
    }
   
    //自定义的2个按钮的方法
    $rootScope.selBookOk = function(){     	
    	//console.log($scope.seljcBook);
		//$location.path('selunit');
        $rootScope.cancel();
        ///更新课本
        localStorage.bookTree = JSON.stringify($scope.seljcBook);
        $rootScope.bookTree = JSON.parse(localStorage.bookTree);
        ////更新目录结构类型		
        $rootScope.UpdateBookModule();
        ////重置播放信息
        $rootScope.ResetPlayInfo();
        $location.path('/selunit');
		//$state.go('selunit',{id:$scope.seljcBook});
    }
    
    
    
    
    
    
    
    
    $scope.init();
     });
});

/**选择单元的控制器**/
app.controller('SelUnitController',function($scope,$http,$state,$stateParams,$rootScope,$location){
    
     if ($rootScope.bookTree.length == 0) {
         $location.path('/selbook');
     } 
    $scope.isPageUnit = false;
    $scope.pageClass = 'page-unit';
	$scope.selsum = 0; //用户选择单元的个数
	$scope.isCusSel = false; //是否用户多选
	//$rootScope.isModule = false; //教材是否有module单元
	//$rootScope.bookTree; //课本的数据
	$scope.isCurTab = true;
	$scope.pageArea;
    //var bookTreeObj; //课本的数据
	$scope.isSelAll = false;
	
	var count=0;
	for	(m=0;m<$rootScope.UnitTree.length;m++)
	{
		count+=$rootScope.UnitTree[0].SubTree.length;
	}
	$scope.selsum = count;
	if(count>1)
	{
		$scope.isCusSel=true;
	}
	
	document.querySelector(".unitContList").addEventListener("scroll",function(){
		
		if(this.scrollTop>0){
			$scope.isScroll = true;
		}else{
			if(this.scrollTop==0){
				$scope.isScroll = false;
			}
		}
		$scope.$apply();
	})
	
	$scope.SelAll = function(){
		if($scope.isSelAll){
			$scope.isSelAll = false;
		}else{
			$scope.isSelAll = true;
		}
	}
	
	$scope.selPageFun = function(){
		$scope.isPageUnit = true;
	}
	
	
	
	$scope.changeTab = function(num){
		if(num==0){
			$scope.isCurTab=true;
		}else{
			$scope.isCurTab=false;
			$scope.pageArea = countPage();
		}
	}
	
	
	$scope.keyin = function(num){
		console.log("123");
		$(".curpage").html($(".curpage").html()+num);
		
	}
	
	$scope.keydel = function(num){
		$(".curpage").html($(".curpage").html().substring(0,$(".curpage").html().length-1))
	}
	
	$scope.selPage = function($event){
		$(".inSelPage>.curpage").removeClass("curpage");
		$($event.target).addClass("curpage");
		//$($event.target).parent()
		isValidPage();
	}
	//////验证页码
	var isValidPage = function(){
		var s_page = parseInt($(".startPage").html());
		var e_page = parseInt($(".endPage").html());
		console.log("s_page="+s_page);
		console.log("e_page="+e_page);
		/*
		if(s_page<$scope.pageArea[0]||s_page>$scope.pageArea[1]||$(".startPage").html()==""){
			$scope.isStartErr=true;
			$rootScope.showTips("起始页码输入有误");
		}else{
			$scope.isStartErr=false;
		}
		if(e_page<$scope.pageArea[0]||e_page>$scope.pageArea[1]||$(".endPage").html()==""){
			$scope.isEndErr=true;
			$rootScope.showTips("结尾页码输入有误");
		}else{
			$scope.isEndErr=false;
		}
		if(!$scope.isStartErr&&!$scope.isEndErr){
			if(s_page>e_page){
				$scope.isStartErr=true;
				$scope.isEndErr=true;
				$rootScope.showTips("起始页码不能大于结尾页码");
			}else{
				$scope.isStartErr=false;
				$scope.isEndErr=false;
			}
		}
		*/
		
	}
	//////计算当前课本的页码范围
	var countPage = function(){
		startPage = $scope.listUnit[0].SubTree[0].SubTree[0].TreeName;	
		mudelleng=$scope.listUnit.length;	
		unitLeng =  $scope.listUnit[mudelleng-1].SubTree.length;
		pageLeng = $scope.listUnit[mudelleng-1].SubTree[unitLeng-1].SubTree.length;
		endPage = $scope.listUnit[mudelleng-1].SubTree[unitLeng-1].SubTree[pageLeng-1].TreeName;		
		startPage = parseInt(startPage.replace("P",""));
		endPage = parseInt(endPage.replace("P",""));
		return [startPage,endPage]
	}
	
	//////页码选择生成播放列表
	$scope.pagePlay = function(){
		$(".inSelPage>.curpage").removeClass("curpage");
		isValidPage();
		if(!$scope.isStartErr&&!$scope.isEndErr)
		{
			var s_page = parseInt($(".startPage").html()); 
			var e_page = parseInt($(".endPage").html());
			var tree=angular.copy($scope.listUnit);
			var SelUnitArr=[];
			for(m=0;m<tree.length;m++)
			{
				var uarry=[]; 
				for(u=0;u<tree[m].SubTree.length;u++)
				{
					var parry=[];
					for(p=0;p<tree[m].SubTree[u].SubTree.length;p++)
					{
						PageNum = parseInt(tree[m].SubTree[u].SubTree[p].TreeName.replace("P",""));
						
						if(s_page<=PageNum&&PageNum<=e_page)
						{
							parry.push(tree[m].SubTree[u].SubTree[p]);							
						}
					}
					if(parry.length>0)
					{
						tree[m].SubTree[u].SubTree=parry;
						tree[m].SubTree[u].OriginalIndex=u;
						uarry.push(tree[m].SubTree[u]);
					}
				}
				if(uarry.length>0){
					tree[m].SubTree=uarry;
					tree[m].OriginalIndex=m;
					SelUnitArr.push(tree[m]);
				}
			}
			$rootScope.ResetPlayInfo();
			localStorage.UnitTree = JSON.stringify(SelUnitArr);
			$rootScope.UnitTree=SelUnitArr;
			localStorage.curMusicNo="0,0,0";
			$rootScope.curMusicNo = "0,0,0";
			$rootScope.playmusic($rootScope.curMusicNo);
			$location.path('/play');
			
		}
	}
	
	
	
	$scope.unit_init = function(){		
		
		//if($stateParams.id!=null){
		//	/////更新课本
		//	//localStorage.bookTree=JSON.stringify($stateParams.id);				
		//	//$rootScope.bookTree = JSON.parse(localStorage.bookTree);
		//	//////更新目录结构类型		
		//	//$rootScope.UpdateBookModule();
		//	/////清空播放列表
		//	//localStorage.removeItem("UnitTree");
		//	//$rootScope.UnitTree=[]; 
		//	//localStorage.curMusicNo="0,0,0";
		//	//$rootScope.curMusicNo="0,0,0"; 
		//	//$scope.isCusSel=false;
		//}		
		if($rootScope.isModule){
			list=$rootScope.bookTree.SubTree;
		}else{
			list= new Array($rootScope.bookTree);
		}		
		var UnitSum = 0;
		for(m=0;m<$rootScope.UnitTree.length;m++)
	   {		  
		   for(s=0;s<$rootScope.UnitTree[m].SubTree.length;s++)
		   {			 
			list[$rootScope.UnitTree[m].OriginalIndex].SubTree[$rootScope.UnitTree[m].SubTree[s].OriginalIndex].IsSelectUnit=true;
		   }		
		}
		for (m = 0; m < list.length; m++)
		{
		    UnitSum += list[m].SubTree.length;
		}
	  $scope.UnitSum = UnitSum;
	  $scope.listUnit = list; 
	  
	  
	  //下载进度canvas显示
		var container = document.querySelector('.progressContainer');
		var canvas = container.querySelector('canvas');
		var progress = 0;
		var maxProcess = 101;
		var step = 0.2;
		var stoped = false;
		
		waveLoading.init({
		    showText: true,
		    callback: function () {
		        console.log('进度条走完啦！');
		        removeClass(message, 'hide');
		        stoped = true;
		        addClass(shade, 'hide');
		    }
		});
		waveLoading.draw();
		waveLoading.setProgress(50);
	  
	  
	  
	  
	  
	  
	  
	}
	
    //运行初始化

    //////播放全部
	$scope.clickAll = function ()
	{
	    $("dd[data-id]").addClass("selUnit");
	    $scope.playAll();
	}

	/**单选某首歌跳转到播放页面or选择某单元**/
	$scope.clickUnit = function($event){
		if($scope.isCusSel){	
			if($($event.target).parent().hasClass("selUnit")){
				$($event.target).parent().removeClass("selUnit");
				$scope.selsum--;
			}else{
				$($event.target).parent().addClass("selUnit")
				$scope.selsum++;
			}
		}else{
			/**播放选中的全部单元  可以把选中的存在rootScope里（同多选播放一样处理）**/
		    //console.log("播放歌曲的ID="+unitid);
		    $("dd[data-id]").removeClass("selUnit");
			$($event.target).parent().addClass("selUnit");
			$scope.playAll();
		}
	}
	
	/**播放选中的全部单元  可以把选中的存在rootScope里**/
	$scope.playAll = function () {
	    $rootScope.ResetPlayInfo();
		var SelUnitArr=[];
		/////获取父路径
	   var mainroot=$(".selUnit").siblings("dt");	   
	   for(m=0;m<mainroot.length;m++)
	   {
		   var mainindex=mainroot.eq(m).data('id');		
		   var tree=angular.copy($scope.listUnit[mainindex]);
		   tree.SubTree=[];		  
		   /////循环子集
		   var subroot=mainroot.eq(m).siblings(".selUnit");
		   for(s=0;s<subroot.length;s++)
		   {			 
			 tree.SubTree.push($scope.listUnit[mainindex].SubTree[subroot.eq(s).data('id')]);
			 tree.SubTree[s].OriginalIndex=subroot.eq(s).data('id');
		   }
		   tree.OriginalIndex=mainindex;
           SelUnitArr.push(tree);
	   }		
		localStorage.UnitTree = JSON.stringify(SelUnitArr);
		$rootScope.UnitTree=SelUnitArr;
		localStorage.curMusicNo="0,0,0";
		$rootScope.curMusicNo = "0,0,0";
		$rootScope.playmusic($rootScope.curMusicNo);

		$location.path('/play');
	}
	
	/**当当前的编号=目前正在播放的编号..歌曲前加curUnit**/
	// $scope.iscurUnit = function(unitid){
	// 	return unitid == $rootScope.curMusicNo;
	// }
   
	/**打开用户多选开关**/
	$scope.CusSel = function(){
		$scope.isCusSel = !$scope.isCusSel;
		if($scope.isCusSel){
			$scope.CusSelValue = "单选";
		}else{
			$scope.CusSelValue = "多选";
		}
		
	}
    
	$scope.unit_init(); 
})

/**播放器控制器**/
app.controller('PlayController', function ($scope, $http, $q, $element, $compile, $rootScope, $location) {

    if ($rootScope.UnitTree.length == 0) {
        if ($rootScope.bookTree.length==0) {
            $location.path('/selbook');
        } else {
            $location.path('/selunit');
        }
    }


	$scope.pageClass = 'page-play';	
	$scope.isshowplaylist = false;		
	//var UnitTreeObj; //保存播放unit列表
	$scope.playTime;
	//var musicList= []; 
   // var lrcList = new Array;	
	//var tempsumtime;
	var playbtn; 	
    var curItem=0;
    var h_parent = $(".lyricsBox").outerHeight() / 2;
    var cur_h=0;
    //var sumTime=0;
    var isDragProgress=false; //是否在拖动播放进度
    
    var touchStartY;
    var StartTranslateY;
    var lyricsHeight;
    var isLyricsMove = false;
    
    playbtn = document.getElementById('vplay');
    playtab = document.getElementById('playtab');
    lyrtab = document.getElementById('lyrtab');
    lyricsBox = document.getElementById('lyricsBox');
    lyricsMain = document.getElementById('lyricsMain');
    
    lyricsBox.addEventListener('touchstart',function(event){
    	//lyricsHeight = lyricsMain;
    	lyricsHeight = $(lyricsMain).height();
    	touchStartY = event.changedTouches[0].clientY;
    	StartTranslateY = $rootScope.translateY;
    	clearInterval($scope.playTime);
    	event.preventDefault();
    })
    lyricsBox.addEventListener('touchmove',function(event){
    	touchY=event.changedTouches[0].clientY;
    	event.preventDefault();
    	
    	/**不能低于最低h_parent也就是屏幕的一半**/
    	if($rootScope.translateY<=h_parent){
	    	$rootScope.translateY = StartTranslateY - (touchStartY-touchY);
	    	if($rootScope.translateY>=h_parent){
	    		$rootScope.translateY=h_parent;
	    	}
    	}
    	/**不能高于最高lyricsHeight + h_parent也就是自身-屏幕的一半**/
    	if($rootScope.translateY<=-lyricsHeight+h_parent){
	    		$rootScope.translateY=-lyricsHeight+h_parent;
    	}
    	$scope.$apply($rootScope.translateY);
    	
    	updataLyricsStat(h_parent,$rootScope.translateY);

    })
    
    lyricsBox.addEventListener('touchend',function(event){
    	if(isLyricsMove){
    		$rootScope.playobj.currentTime = $("#lyricsMain>.cur").attr("data-time");
    	}else{
    		 $rootScope.isDisc = !$rootScope.isDisc	
			$scope.$apply();
    	}
    	isLyricsMove=false;
    	$scope.playTime = setInterval(updateLyr,50);
    })
    
    var updataLyricsStat = function(initY,curY){
    	/**
    	 * initY = 初始化的Y值
    	 * curY = 当前的Y值
    	 * **/
    	diffY = Math.abs(curY-initY);
    	for(var i=0;i<$("#lyricsMain>p").length;i++){
    		if(diffY>$("#lyricsMain>p").eq(i).position().top){
    			if($("#lyricsMain>.cur").index()!=i){
    				$("#lyricsMain>.cur").removeClass("cur");
    				$("#lyricsMain>p").eq(i).addClass("cur");
    				isLyricsMove = true;
    			}
    		}
    	}
	
    	
    }
    
    FastClick.attach(playbtn);
    
    playbtn.addEventListener('click', function(event){
        if($rootScope.isplayover){
            $rootScope.playmusic("0,0,0");
            $rootScope.isplayover = false;
    	}else{
            if (!$rootScope.iserror) {
                if ($rootScope.isplay) {
                    $rootScope.playobj.pause();
                } else {
                    if ($rootScope.playobj.src == "")
                    {
                        $rootScope.playmusic($rootScope.curMusicNo);
                    }
                    $rootScope.playobj.play();
                }
                $rootScope.isplay = !$rootScope.isplay;
                $rootScope.$apply();
            } else {
                $rootScope.showTips("当前音频不可播放。");
            }
    	}
	}, false);
	
	var swiper = new Swiper('.discsList', {
        paginationClickable: true,
        initialSlide :1,
        speed:100,
        onTouchMove: function (swiper, even) {	      
	        $("#playtab").removeClass("playing");
	    },
	    onTouchEnd: function (swiper) {	       
	        if ($rootScope.isplay)
	        {
	            $("#playtab").addClass("playing");
	        }
	    },
	    onSlideChangeEnd: function (swiper) {
	        var No = $rootScope.GetcurMusicNo(swiper.swipeDirection);
	        if (No != null) {
	            $rootScope.playmusic(No);
	            No = $rootScope.GetcurMusicNo(swiper.swipeDirection);
	            if (No != null) {
	                swiper.slideTo(1, 0, false);
	            }
	        }	 
	    }
        
    });
	
	playtab.addEventListener('click', function(event) {
	    $rootScope.isDisc = !$rootScope.isDisc	
		$scope.$apply();
	}, false);
	
	lyrtab.addEventListener('click', function(event) {
	    $rootScope.isDisc = !$rootScope.isDisc	
		$scope.$apply();
	}, false);
	
	$scope.playSelMusic = function (mid, uid, pid) {
	    $rootScope.playmusic(mid + "," + uid + "," + pid);
	}
	
    
    $scope.iscurplay = function(mid,uid,pid){    	
    	if($rootScope.curMusicNo==mid+","+uid+","+pid){
    		return true
    	}
    }    
    
    $scope.play_init = function(){ 
        $scope.units = $rootScope.UnitTree;
    	var progressDot = document.getElementById('progressDot');
    	var progressing = document.getElementById('progressing');
    	var startX,startWidth;
    	var HtmlFontSize = parseInt($("html").css("font-size").replace("px",""));
    	
    	progressDot.addEventListener("touchstart",function(e){
    		startX = e.touches[0].clientX;
    		startWidth = $(progressing).width();
    		isDragProgress=true;    	
    	})
    	progressDot.addEventListener("touchmove",function(e){
    		posX = e.touches[0].clientX-startX;
    		posPer = posX/(5.5*HtmlFontSize);
    		$(progressing).css('width',startWidth+posX);    		
    	})
    	progressDot.addEventListener("touchend",function(e){    	
    		var dragPer = $(progressing).width()/(5.5*HtmlFontSize);
    		$rootScope.playobj.currentTime = $rootScope.tempsumtime * dragPer;
    		isDragProgress=false;
    	})
    	parse();
    	//$scope.$watch("curMusicNo", parse);
    	//$rootScope.playmusic($rootScope.curMusicNo);
    	
    	
    	//初始化判断是否加入引导
    	if (!localStorage.GuideNum||localStorage.GuideNum<5) {
    		$rootScope.GuideStat=[0,0];
    		$element.append($compile("<div id='mask' class='Gmask'></div>")($scope));
   			$element.append($compile($rootScope.GuideArr[$rootScope.GuideStat[0]].guide[$rootScope.GuideStat[1]])($scope));
    	}
    	
    	
    }

    $scope.ctrl_prev = function () {
        var No = $rootScope.GetcurMusicNo("prev");
        if (No != null) {
            $rootScope.playmusic(No);
        } else {
            $rootScope.showTips("已经是第一首歌曲。");
        }
    }
    $scope.ctrl_next = function () {
        var No = $rootScope.GetcurMusicNo("next");
        if (No !=null) {
            $rootScope.playmusic(No);
        } else {
            $rootScope.showTips("已经是最后一首歌曲。");
        }
    }
    $scope.IsLoop = function ()
    {
        $rootScope.loop = !$rootScope.loop;
       // $scope.$apply();
    }
    
    function updateMusicList(){
    	var isDelCur = true;    
		var isDelModule=true;
		var isDelUnt=true;    	
		$scope.units = $rootScope.UnitTree;
		var curmp3url = decodeURI($rootScope.playobj.src);
		var patharry=curmp3url.split('/');
		patharry.reverse();//////倒序以后第二和三
		for (i = 0; i < $rootScope.UnitTree.length; i++) {
		    for (j = 0; j < $rootScope.UnitTree[i].SubTree.length; j++) {
		        for (m = 0; m < $rootScope.UnitTree[i].SubTree[j].SubTree.length; m++) {
		            var page = $rootScope.UnitTree[i].SubTree[j].SubTree[m];
		            var pathstr="http://reding.91118.com/"+page.Path+"/"+page.TreeName+".mp3";				            
		            if(curmp3url==pathstr){				          
		            	$rootScope.curMusicNo= i+","+j+","+m;
						localStorage.curMusicNo=$rootScope.curMusicNo;
		            	isDelCur = false;
		            }

				}
		        if ($rootScope.UnitTree[i].SubTree[j].Path.indexOf(patharry[2]) > -1)
				{
					isDelUnt=false;
				}							
			
    		}
		    if ($rootScope.UnitTree[i].Path.indexOf(patharry[3]) > -1)
			{
				isDelModule=false;
			}		
    	}
    	if(isDelCur){ 			
			/////当前播放的数据被删
			var curMusic=$rootScope.curMusicNo.split(',');			
			if(isDelUnt&&isDelModule)
			{
				////如果既删除了module又删除了until
			    if ($rootScope.UnitTree.SubTree.length - 1 < curMusic[0])
				{	
					$rootScope.curMusicNo="0,0,0";
				}else{
					$rootScope.curMusicNo=curMusic[0]+",0,0";
				}
			
			}else if(isDelUnt){
				/////删除了until

			    if ($rootScope.UnitTree[curMusic[0]].SubTree.length - 1 < curMusic[1])
				{
					//////当前单元超出module的单元索引
			        var maxuntilIndex = $rootScope.UnitTree[curMusic[0]].SubTree.length - 1;
			        $rootScope.curMusicNo = curMusic[0] + "," + maxuntilIndex + "," + ($rootScope.UnitTree[curMusic[0]].SubTree[maxuntilIndex].SubTree.length - 1);
			        $rootScope.curMusicNo = $rootScope.GetcurMusicNo("next");

				}else{

					$rootScope.curMusicNo=curMusic[0]+","+curMusic[1]+",0";
				}

			}else{
				/////只删除了页面
			    if ($rootScope.UnitTree[curMusic[0]].SubTree[curMusic[1]].SubTree.length - 1 < curMusic[2])
				{
					//////当前页面超出当前单元索引
			        $rootScope.curMusicNo = $rootScope.GetcurMusicNo("next");
				}
				
			}	
			$rootScope.playmusic($rootScope.curMusicNo);
    	}
    	
    }
    
    
    // function getLrc(lrcUrl,num){
	// 	lrcList[num]="[00:00]正在读取数据";
	// 	//lrcUrl = "http://walkman.91sst.com/html5/LcrTxt?jsoncallback=JSON_CALLBACK&path="+UnitTreeObj[i].SubTree[j].Path+"/"+UnitTreeObj[i].SubTree[j].TreeName+".lrc";
	// 	$http.jsonp(lrcUrl).success(function(response){
	// 		//console.log("lrcUrl="+lrcUrl);
	// 		//console.log("response="+decodeURIComponent(response));
	// 		//console.log("num="+num);
	// 		lrcList[num]=decodeURIComponent(response);
	// 	}).error(function(){
	// 		lrcList[num]="[00:00]数据加载失败";
	// 		//console.log("12");
	// 	});
	// 	//console.log('lrcList[num]='+lrcList[num]);
    // }
    
    //播放列表操作显示和关闭
    $scope.showPlayList = function(){
    	$scope.isshowplaylist = true;
    	$scope.islayer = true;
    	$element.append($compile("<div class='mask' ng-click='clearAllPop()'></div>")($scope))
    }
    
    $scope.closePlayList = function(){
    	$scope.clearAllPop();
    }
    
    $scope.clearAllPop = function(){
    	$scope.islayer = false;
    	$(".mask").remove();
    }
   
    
    // function reStartPlay(){
    // 	$scope.curMusicNo=0;
    // 	$scope.isplayover=false;
	// 	playmusic($scope.curMusicNo);
    // 	shijianshuzu=[];
    // 	gecishuzu=[];
    // }
    
    $scope.delMusic = function(rootindex,unitindex,pindex){    	
    	if(unitindex==null&&pindex==null){
    	    $rootScope.UnitTree.splice(rootindex, 1);
    	}else if(pindex==null){
    	    $rootScope.UnitTree[rootindex].SubTree.splice(unitindex, 1);
    	    if ($rootScope.UnitTree[rootindex].SubTree.length == 0)
			{
    	        $rootScope.UnitTree.splice(rootindex, 1);
			}
    	}else{
    	    $rootScope.UnitTree[rootindex].SubTree[unitindex].SubTree.splice(pindex, 1);
    	    if ($rootScope.UnitTree[rootindex].SubTree[unitindex].SubTree.length == 0)
			{
    	        $rootScope.UnitTree[rootindex].SubTree.splice(unitindex, 1);
			}		
		}		
    	localStorage.UnitTree = JSON.stringify($rootScope.UnitTree);
    	if ($rootScope.UnitTree.length == 0) {
    	    $rootScope.ResetPlayInfo();
    	    $location.path('/selunit');
    	} else {
    	    updateMusicList();
    	}
    }

	
	
	 
    //if(!localStorage.time)
    //{
    //    localStorage.time=0;
    //}


    //////格式化歌词
    function parse()
    {
    	//console.log('lrc='+lrc);
        //str=lrc.split("[");
		//shijianshuzu=[];
		//gecishuzu=[];
        ////因为str[0]="",所以跳过它
        //for(var i=1;i<str.length;i++)
        //{
        //    var shijian=str[i].split(']')[0];
        //    var geci=str[i].split(']')[1];
        //    var fen=shijian.split(":")[0];
        //    var miao=shijian.split(":")[1];
        //    var hmiao=shijian.split(".")[1];
        //    //xx:xx.xx 时间转换成总的秒数
        //    var sec=parseInt(fen)*60+parseInt(miao)+ parseFloat("0."+hmiao);
        //    //存时间
        //    shijianshuzu[i-1]=sec-localStorage.time;
        //    //存歌词
        //    geci = geci.replace("|","<br/>")
        //    gecishuzu[i-1]=geci;  
        //}
        
          //console.log(shijianshuzu);
          //console.log(gecishuzu);
        
        //这段代码本来是用来显示所有歌词的，这里注释掉了，可以掠过不看
        //var lyrList=document.getElementById("lyricsMain");
        ////console.log();
        //lyrList.innerHTML="";
        //for (var i = 0; i < $rootScope.shijianshuzu.length; i++)
        //{
        //    if (trimStr($rootScope.gecishuzu[i]).length > 0) {
        //        lyrList.innerHTML = lyrList.innerHTML + "<p data-time=" + $rootScope.shijianshuzu[i] + " class='lrcitem'><span class='real_lyr'>" + $rootScope.gecishuzu[i] + "</span></p>";
        //   }else{
        //        lyrList.innerHTML = lyrList.innerHTML + "<p data-time=" + $rootScope.shijianshuzu[i] + " class='lrcitem blank'><span class='real_lyr'>" + $rootScope.gecishuzu[i] + "</span></p>";
        //   }
        //}
        //$("#lyricsMain").css("transform","translateY("+(h_parent/parseInt($("html").css("font-size"))-0.7)+"rem)");
        
        //cur_h=h_parent;
        $scope.playTime = setInterval(updateLyr,50);
        //上面是用来显示所有歌词的，不用看
        //定时器，隔1s更新下歌词的显示
        //setInterval(updategeci,1000);
        //<p data-time="21.02" class="j-lrcitem lrcitem" style="color: rgb(255, 255, 255);"><span class="real">It's far beyond your reach, it holds a place in time,</span><span class="trans">这远远超出你的能力，被困在了这个地方</span></p>
        
        //playobj.loop = true;
        
        
        
    }
    
    
    //每50毫秒更新歌词滚动状态
    function updateLyr() {
        if ($rootScope.isLoaded) {
            var i = getcurrent();
            var curtime = $rootScope.playobj.currentTime;
            localStorage.curTime = curtime;
            //console.log(curtime);
            $scope.curTime = $rootScope.parseTime(curtime);
            if (!isDragProgress) {
                $scope.curProgress = curtime / $rootScope.tempsumtime * 100;
            }

            //console.log(i);

            if (curItem != i) {
                curItem = i;
                //console.log("curItem="+curItem);
                $("#lyricsMain>.cur").removeClass("cur")
                $("#lyricsMain>p").eq(curItem - 1).addClass("cur");
                //console.log("curItem="+curItem0);
                posTop = $("#lyricsMain>p").eq(curItem - 1).position().top;

                if (curItem >= 2) {
                    cur_h = h_parent - posTop
                    //cur_h=cur_h-$("#lyricsMain>p").eq(curItem-2).outerHeight();
                    //$("#lyricsMain").css("transform","translateY("+cur_h+"px)");
                    $rootScope.translateY = cur_h;
                }
            }
            $scope.$apply();
        }
    }
    
    function getcurrent()
    {
        var i=0;
        for (i = 0; i < $rootScope.shijianshuzu.length; i++)
        {
            if ($rootScope.shijianshuzu[i] >= $rootScope.playobj.currentTime)
            {
                return i;
            }
        }
	    return i-1;
    }

    /////清空UnitTree
    $scope.ClearUnitTree = function () {
        /////清空播放列表
        $rootScope.ResetPlayInfo();
        ////跳到选择课本页面
        $location.path('/selunit');

    };
	
	$scope.play_init();
	
	
	
	
});

app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/play');
	$stateProvider
	.state('selbook',{
		url:'/selbook',
		templateUrl:'views/selbook.html',
		controller: 'SelTextBookController',
		onEnter:function(){
		},
		onExit:function(){
		}
	})
	.state('play',{
		url:'/play',
		templateUrl:'views/play.html',
		controller: 'PlayController',
//		resolve:{
//			viewing: function($stateParams){
//				console.log("$stateParams.id="+$stateParams.id);
//				return{
//					photoId: $stateParams.id
//				}
//			}
//		},
		onEnter:function(){
			//console.log("aaaaa");
		}
	})
	.state('selunit',{
		url:'/selunit',
		//rams:{"id":null},
		templateUrl:'views/selunit.html',
		controller: 'SelUnitController',
		onEnter:function(){
		}
	})
})

function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}












