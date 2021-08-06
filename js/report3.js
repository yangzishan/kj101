var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = getQueryString("clientType");
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var cannsee = (getQueryString('cannsee') || ''); //金管家 jgj
var invite = getQueryString("invite");  //邀约历史查看
var visible = (getQueryString('visible') || 1);
var bank = (getQueryString('bank') || '');
var localUrl = location.href;
var reportPrintUrl = testHealthUrl+'/print/print3.0.html?viewType=2&reportId=';
var edition = 3;
if(reportType == 501){
	$('.skin').remove();
}
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
	//alert('now in app');
	if(bank == 'tjnsh'){
		gohistoryUrl = 'reportHistory_tjns.html?customerId='+customerId
	}else{
		gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
	}
	
}

var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
   var language = zh;
   var languageStr = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = en;
    var languageStr = 'en';
    document.title = 'Health report'
}else{
	var language = en;
    var languageStr = 'en';
    document.title = 'Health report'
}

/*******************************交互逻辑*****************************/
function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'https://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}
/*******************************交互逻辑*****************************/
zhuge.track('进入3.0报告首页', {//埋点t
	'userId' : customerId,
	'渠道' : '微信'
});
var _offsetTop; //存储滚动
var _bodyoffset;
var myApp = new Vue({
	 el: '.all-view',
    data:function() {
		return {
			invite:invite,
			openId:openId,
			userId: customerId,
			showSex:false, //过滤两性功能模块
			isShow:false,
			isActive:[],
			popupA:false,
			popupB:false,
			popupC:false,
			popupD:false,
			popupE:false,
			popupF:false,
			popupG:false,
			popupH:false,
			popupI:false,
			popupJ:false,
			popupK:false,
			popupL:false,
			data:{},
			totalScore:{},
			sex:'',
			reportId:'',
			headimgurl:'',
			height:'',
			weight:'',
			sameUser:'',
			inspectDate:'',
			ranking:'',
			targetName:'',
			banData:[],
			banData1:[],
			banData2:[],
			deviceSnNum:'',
			language: language,  //默认中文
		}
	},
	mounted: function(){
		this.queryNewReportDataByReportId();
    },
	methods: {
		//查看报告来源
		getReportSource: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/report/getReportSource",
				dataType:'Json',
				data:{
					reportCode: reportId
				},
				success: function(res){
					if(res.code == "200"){
						if(res.data == 5 && cannsee == ''){ //金管家 5
							location.href = "jinguanjia.html?reportType="+reportType
						}else if(res.data == 6 && cannsee == ''){
							location.href = "haochezhu.html?reportType="+reportType
						}
					}
				},
				error: function(){console.log('getReportSource error')}
			});
		},
		goToShare: function(fangfa){  //goToShare\goToPrint
			var vm = this;
			setupWebViewJavascriptBridge(function(bridge) {
				//alert('click share'+reportId);
				bridge.callHandler(fangfa, {
					'reportId':reportId,
					'reportUrl':localUrl,
					'reportPrintUrl':reportPrintUrl+reportId,
					'reportScore': vm.totalScore,
					'reportTime': vm.inspectDate,
					'reportName': vm.ranking
				}, function responseCallback(responseData) {});
			})
		},
		// 获取首页数据
		queryNewReportDataByReportId: function(){
			var _this = this;
			$.ajax({
				type:"post",
				url:analysisreport + '/v3/reportContent/queryNewReportDataByReportIdAndCustomerId',
				async:true,
				dataType : 'json',
				data : {
				    reportId : reportId,
					customerId : customerId,
					saasId: saasId
				},
				success: function(data){
					if(data.code == 200){
						_this.getReportSource();
						$('body').css("visibility","visible");
						_this.data = data.result.reportNewThreeViems
						_this.totalScore = data.result.totalScore
						_this.ranking = data.result.ranking
						_this.sex = data.result.sex
						_this.userId = data.result.userId
						_this.headimgurl = data.result.headimgurl
						_this.inspectDate = data.result.inspectDate
						_this.deviceSnNum = data.result.deviceSnNum
						$('.header-img').remove();  //删除头像
						if(_this.data[3].score== null){
							_this.data[3].score = 0
						}
						// 风险等级转的度数
						if(_this.totalScore >= 95){
							var _deg = 110
						}else if(_this.totalScore <=  94&& _this.totalScore >= 90){
							var _deg = 60
						}else if(_this.totalScore <= 89 && _this.totalScore >= 85){
							var _deg = 0
						}else if(_this.totalScore <= 84 && _this.totalScore >= 80){
							var _deg = -60
						}else{
							var _deg = -120
						};
						//快乐指数 转的度数
						if(_this.data[0].childTarget[0].abLive == 4){
							var _klzs = 95
						}else if(_this.data[0].childTarget[0].abLive == 3){
							var _klzs = 76
						}else if(_this.data[0].childTarget[0].abLive == 2){
							var _klzs = 52
						}else if(_this.data[0].childTarget[0].abLive == 1){
							var _klzs = 30
						}else if(_this.data[0].childTarget[0].abLive == 0){
							var _klzs = 10
						};
						setTimeout(function(){
							$('#prcc').css("width",data.result.totalScore+'%');
							$('#score').animateNumber({ number: data.result.totalScore },1100);
							$('.sub-health .pointer').css("transform","rotate("+_deg+"deg)");
							$('.klzs_c .zs_p').css("transform","rotate(-"+_klzs+"deg)");
							_this.wheelsort(_this.deviceSnNum,reportId);//轮播广告
						},300);
						_this.goToShare('goToPrint');
					}else if((data.code == 201)){
						_this.sameUser = data.sameUser;
						var payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+_this.sameUser+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType
						if(languageStr == 'en'){
							location.href = 'pay_en.html'+payStr
						}else{
							location.href = 'payfor3.0.html'+payStr
						}
					}else{alert('queryNewReportDataByReportIdAndCustomerId,code='+data.code+data.msg)}
				},
				error: function(){alert('queryNewReportDataByReportIdAndCustomerId error')}
			});
		},
		shade: function(index){
			this.popupA = false
			this.popupB = false
			this.popupC = false
			this.popupD = false
			this.popupE = false
			this.popupF = false
			this.popupG = false
			this.popupH = false
			this.popupI = false
			this.popupJ = false
			this.popupK = false
			this.popupL = false
			Vue.set(this.isActive, index, !this.isActive[index]);
			$('body').css("overflow","auto");
			$("body").css("position","static");
			$(window).scrollTop(_bodyoffset);
		},
		// 综合健康分数
		clickA: function(){
			this.popupA = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'综合健康分数'
			});
		},
		// 亚健康风险
		clickB: function(){
			this.popupB = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'亚健康风险'
			});
		},
		// 睡眠质量
		clickC: function(){
			this.popupC = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'睡眠质量'
			});
		},
		// BMI
		clickD: function(){
			this.popupD = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'BMI'
			});
		},
		// 皮肤评估
		clickE: function(){
			this.popupE = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'皮肤评估'
			});
		},
		// 快乐指数
		clickF: function(){
			this.popupF = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'快乐指数'
			});
		},
		// 实时状态
		liClick: function(index){
			Vue.set(this.isActive, index, !this.isActive[index]);
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'实时状态'
			});
		},
		// 营养状态
		listG: function(str){
			$('#popupG').text(str)
			this.popupG = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':str
			});
		},
		// 免疫能力
		listH: function(){
			this.popupH = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'免疫能力'
			});
		},
		// 消化能力
		listI: function(){
			this.popupI = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'消化能力'
			});
		},
		// 吸收能力
		listJ: function(){
			this.popupJ = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'吸收能力'
			});
		},
		// 代谢能力
		listK: function(){
			this.popupK = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'代谢能力'
			});
		},
		// 男女性功能
		listL: function(){
			this.popupL = true
			this.noscorll();
			$('body').css("overflow","hidden");
			zhuge.track('3.0报告问号点击',{
				'问号名称':'男女性功能'
			});
		},
		// 身高体重更新
		update: function(){
			this.isShow = true
			
		},
		sure: function(){
			this.isShow = false
			this.updateBmi()
		},
		//定位滚动
		noscorll: function(){
			_bodyoffset = $(window).scrollTop();
			$("body").css({"position":"fixed","top":-_bodyoffset+"px"});
		},
		seeMore: function(){
			var vm = this;
			zhuge.track('点击了解更多',{
				'报告版本': '3.0报告'
			},function(){
				location.href = 'instructions.html?reportType='+reportType
			})
		},
		checkHistory: function(){ //历史报告
			var vm = this;
			zhuge.track('点击历史报告', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = gohistoryUrl
			});
		},
		goSetUp: function(){ //个人中心
			var vm = this;
			zhuge.track('点击个人中心', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location.href=dataUrl+"/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ vm.reportId+'&saasId='+saasId
			});	
		},
		// 导航
		indexHref: function(){
			window.location='report6.html?reportId='+reportId+'&sex='+this.sex+'&userId='+this.userId+'&reportType='+reportType
		},
		adviseHref: function(){
			var vm = this;
			zhuge.track('点击健康建议', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location='z_pop.html?reportId='+reportId+'&openId='+openId+'&sex='+vm.sex+'&userId='+vm.userId+'&reportType='+reportType
			});
		},
		recipeHref: function(){
			var vm = this;
			zhuge.track('点击健康食谱', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location='recipes3.html?reportId='+reportId+'&openId='+openId+'&sex='+vm.sex+'&userId='+vm.userId+'&reportType='+reportType
			});
		},
		graphHref: function(){
			var vm = this;
			zhuge.track('查看3.0趋势图', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location='graph.html?reportId='+reportId+'&openId='+openId+'&sex='+vm.sex+'&userId='+vm.userId+'&reportType='+reportType
			});
		},
		updateBmi: function(){
			var vm = this;
			if(vm.height == '' || vm.weight == ''){
				return;
			}
			if(parseFloat(this.height)>250 || parseInt(this.height)<50){
				alert('请输入正确的身高');
				return;
			}else if(parseFloat(this.weight)>200 || parseInt(this.weight)<20){
				alert('请输入正确的体重');
				return;
			}else{
				$.post(analysisreport+'/v3/reportData/UpdateHeightAndWeight',
					{
						reportId: reportId,
						userId : this.userId,
						height : this.height,
						weight : this.weight
					},
					function(data){
						if(data.code == 200){
							vm.queryNewReportDataByReportId();
							console.log('更新bmi')
						}else{
							alert('BMI更新失败 UpdateHeightAndWeight code='+data.code)
						}
						
					}
				)
			}	
		},
		goAdvise: function(targetId,score,arr){ //跳二级页
			console.log(targetId);
			console.log(arr);
			for(var i=0;arr.length>i;i++ ){
				if(arr[i].score<90){
					
					location.href = 'advise.html?reportId='+reportId+'&targetId='+targetId+'&reportType='+reportType
				}
			}	
		},
		wheelsort: function(deviceSn,reportId){ //广告接口
			var vm = this;
			$.ajax({
				type: "post",
				url: dataUrl + "/api/banner/wheelsort",
				async: true,
				dataType: 'json',
				data:{
					deviceSn: deviceSn,
					reportId: reportId
				},
				success: function(res){
					if(res.code == 200){
						res.data.forEach(function(el,index){
							if(el.bannerPage == 1){
								vm.banData1.push(el)
							}else if(el.bannerPage == 2){
								vm.banData2.push(el)
							}
						})
						console.log(vm.banData1,vm.banData2)
						vm.banData = res.data;
						setTimeout(function(){
							banSlide(vm.banData1.length,'.gg_head')
							banSlide(vm.banData2.length,'.gg_foot')
						},500)
					}
				},
				error: function(){console.log('wheelsort error')}
			});
		},
	},
});
//广告轮播
function banSlide(page_count,el){ 
	var page_now=1;
	var page_num=1; //一页显示几个
	var v_width = $(el).width();
	console.log(page_count)
	function next(){	
		if(!$(el+' .v_list').is(':animated')){
			if(page_now == page_count){
				$(el+' .v_list').animate({left:'0px'},'slow');
				page_now=1;
			}else{
				$(el+' .v_list').animate({left:'-='+v_width},'slow');
				page_now++;
			}
		}
	};
	function prev(){
		if(!$(el+' .v_list').is(':animated')){
			if(page_now == 1){
				$(el+' .v_list').animate({left:'-='+v_width*(page_count-1)},'slow');
				page_now=page_count;
			}else{
				$(el+' .v_list').animate({left:'+='+v_width},'slow');
				page_now--;
			}
		}
	};
	var toNext=setInterval(next,3000);
};
//查用户信息对接智齿客服
//$.ajax({
//	url : dataUrl + "/api/v1/reportUser/findUserById",
//	type : "POST",
//	dataType : 'json',
//	data : {
//	    userId : customerId
//	},
//	success : function(userData) {
//		if(userData.code == 200){
//			//初始化智齿咨询组件实例
//			var zhiManager = (getzhiSDKInstance());
//			zhiManager.set("color", '09aeb0');  //取值为0-9a-f共六位16进制字符[主题色] | 默认取后台设置的颜色
//			zhiManager.set('location',1); //位置
//			zhiManager.set('horizontal', 20); //设置水平边距，默认水平为 20 像素
//			zhiManager.set('vertical', 50); //设置垂直边距，默认垂直为 40 像素
//			zhiManager.set('powered',false); //隐藏聊天窗体底部的智齿科技冠名
//			zhiManager.set('lan', 'zh'); //支持语言
//			zhiManager.set('moduleType',3); //机器人客服优先模式
//			zhiManager.set('title', '欢迎咨询'); //咨询按钮文案   移动端无用
//			//zhiManager.set('customBtn', 'true');  //不使用默认咨询按钮
//			zhiManager.set('customMargin', 200);
//			//设置用户信息
//			zhiManager.set('uname',userData.data.userName);
//			zhiManager.set('realname',userData.data.userName);
//			zhiManager.set('tel',userData.data.mobile);
//			zhiManager.set('remark','报告ID： '+reportId);
//			zhiManager.on("load", function() {
//			    zhiManager.initBtnDOM();
//			});
//		//////
//		}
//	},
//	error : function(obj,msg){console.log(obj+msg + "findUserById error")}
//});
// 获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
