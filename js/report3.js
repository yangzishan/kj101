var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var edition = 3;
if(reportType == 501){
	$('.skin').remove();
}
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId;
if(!openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId;
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
setupWebViewJavascriptBridge(function(bridge) {
	//为按钮注册方法
	$(document).on("click","#goToShare",function(){
		//alert('click share');
		bridge.callHandler('goToShare', {'reportId':reportId}, function responseCallback(responseData) {});
	});
})
/*******************************交互逻辑*****************************/
zhuge.track('进入3.0报告首页', {//埋点t
	'userId' : customerId,
	'渠道' : '微信'
});
var _offsetTop; //存储滚动
var _bodyoffset;
new Vue({
	 el: '.all-view',
    data:function() {
		return {
			openId:openId,
			userId: customerId,
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
			banData:'',
			deviceSnNum:''
		}
	},
	mounted: function(){
		this.queryNewReportDataByReportId();
    },
	methods: {
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
					customerId : customerId
				},
				success: function(data){
					if(data.code == 200){
						$('body').css("visibility","visible");
						_this.data = data.result.reportNewThreeViems
						_this.totalScore = data.result.totalScore
						_this.ranking = data.result.ranking
						_this.sex = data.result.sex
						_this.userId = data.result.userId
						_this.headimgurl = data.result.headimgurl
						_this.inspectDate = data.result.inspectDate
						_this.deviceSnNum = data.result.deviceSnNum
						if(_this.data[3].score== null){
							_this.data[3].score = 0
						}
						// 风险等级转的度数 现在是从低到高
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
							$('.sub-health .text .pointer').css("transform","rotate("+_deg+"deg)");
							$('.klzs_c .zs_p').css("transform","rotate(-"+_klzs+"deg)");
							_this.wheelsort(_this.deviceSnNum,reportId);//轮播广告
						},300);
						
					}else if((data.code == 201)){
						//alert('queryNewReportDataByReportId code='+data.code);
						_this.sameUser = data.sameUser;
						location.href = 'payfor3.0.html?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+_this.sameUser+'&reportType='+reportType;
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
		},
		// 亚健康风险
		clickB: function(){
			this.popupB = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 睡眠质量
		clickC: function(){
			this.popupC = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// BMI
		clickD: function(){
			this.popupD = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 皮肤评估
		clickE: function(){
			this.popupE = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 快乐指数
		clickF: function(){
			this.popupF = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 实时状态
		liClick: function(index){
			Vue.set(this.isActive, index, !this.isActive[index]);
			$('body').css("overflow","hidden");
		},
		// 营养状态
		listG: function(){
			this.popupG = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 免疫能力
		listH: function(){
			this.popupH = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 消化能力
		listI: function(){
			this.popupI = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 吸收能力
		listJ: function(){
			this.popupJ = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 代谢能力
		listK: function(){
			this.popupK = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 男女性功能
		listL: function(){
			this.popupL = true
			this.noscorll();
			$('body').css("overflow","hidden");
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
				window.location.href=dataUrl+"/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ vm.reportId
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
				window.location='z_pop3.html?reportId='+reportId+'&sex='+vm.sex+'&userId='+vm.userId+'&reportType='+reportType
			});
		},
		recipeHref: function(){
			var vm = this;
			zhuge.track('点击健康食谱', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location='recipes3.html?reportId='+reportId+'&sex='+vm.sex+'&userId='+vm.userId+'&reportType='+reportType
			});
		},
		graphHref: function(){
			var vm = this;
			zhuge.track('查看3.0趋势图', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location='graph.html?reportId='+reportId+'&sex='+vm.sex+'&userId='+vm.userId+'&reportType='+reportType
			});
		},
		updateBmi: function(){
			var vm = this;
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
						vm.banData = res.data;
						banSlide(res.data.length);
					}
				},
				error: function(){console.log('wheelsort error')}
			});
		},
	},
});
//广告轮播
function banSlide(page_count){ 
	var page_now=1;
	var page_num=1; //一页显示几个
	var v_width = $('.v_content').width();
	console.log(page_count)
	console.log(v_width);
	function next(){	
		if(!$('.v_list').is(':animated')){
			if(page_now == page_count){
				$('.v_list').animate({left:'0px'},'slow');
				page_now=1;
			}else{
				$('.v_list').animate({left:'-='+v_width},'slow');
				page_now++;
			}
		}
	};
	function prev(){
		if(!$('.v_list').is(':animated')){
			if(page_now == 1){
				$('.v_list').animate({left:'-='+v_width*(page_count-1)},'slow');
				page_now=page_count;
			}else{
				$('.v_list').animate({left:'+='+v_width},'slow');
				page_now--;
			}
		}
	};
	var toNext=setInterval(next,3000);
};
// 获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
