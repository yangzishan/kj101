var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = (getQueryString("clientType") || ''); 
var bank = (getQueryString('bank') || '');
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var cannsee = (getQueryString('cannsee') || ''); //金管家 jgj
var visible = (getQueryString('visible') || 1);
var invite = getQueryString("invite");  //邀约历史查看
var languageStr = (getQueryString('language') || '');
var localUrl = location.href;
var reportPrintUrl = testHealthUrl+'/print/print2.0.html?viewType=2&reportId=';
var edition = 2;

var indexAll_data = '/api/v1/reportIndex/indexAll2'
var targetImprove_data = '/api/v2/reportIndex/targetImprove'
if(reportType == 500 || reportType == 503){ //适配501报告
	var indexAll_data = '/api/v5/reportData/indexAll2'
	var targetImprove_data = '/api/v5/reportData/targetAnalyse'
	$('header').css("display","none")
}
var payStr = '';
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
	//alert('now in app');
	if(bank == 'tjnsh'){
		gohistoryUrl = 'reportHistory_tjns.html?customerId='+customerId
	}else{
		gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
	}
};

var language = zh;
if(languageStr == 'zh'){
	language = zh;
}else if(languageStr == 'en'){
	language = en;
}else{
	var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
	if(JsSrc.indexOf('zh')>=0){
		language = zh;
		languageStr = 'zh';
	}else if(JsSrc.indexOf('en')>=0){
	    language = en;
	    languageStr = 'en';
	    document.title = 'Health report'
	}else{
		language = zh;
	    languageStr = 'zh';
	    //document.title = 'Health report'
	    console.log(JsSrc)
	}
};

zhuge.track('进入2.0报告首页', {//埋点t
	'用户id' : customerId,
	'渠道' : '微信'
});
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var myApp = new Vue({
	el: "#appVUE",
	data: function(){
		return {
			invite:invite,
			reportId: reportId,
			reportType:reportType,
			openId: openId,
			customerId:customerId,
			sameUser:'',
			paymentType:'',
			totalScore:'',
			age:'',
			sex:'',
			ranking:'',
			headimgurl:'',
			height:'',
			weight:'',
			userId: customerId,
			inspectDate:'',
			firstPages:[],
			otherPages:'',
			inspectDay:'',
			ps:'',
			userName:'',
			sexStr:'',
			midNum:'',
			litNum:'',
			abnormalName:'',
			showRecipe:'',
			lastDateStr:'', 
			currentDateStr:'',
			okImproves:'',
			noImproves:'',
			deviceSnNum:'',
			banData:[],
			banData1:[],
			banData2:[],
			banData3:{}, //3 企业微信
			showBanData3: false,
			saasTel:'感谢您使用智能筛查机器人进行亚健康评估。现将您的评估结果汇总分析如下，如需帮助请拨打我们的健康热线<a href="tel://4006666787" style="color: #1ebeb1;">4006666787</a>，祝您健康！',
			saasName:'',saasLogo:'',
			language: language,  //默认中文
			jiazhuangScore:'',
			someTit:'', //弹框用
			someTxt:'', //弹框用
			jiazhuangxian:{},
			thirdBids:[],
			showTab: 1,
			show_change: true, //显示改善指标
		}
	},
	mounted: function(){
		this.getData();
		if(reportType == 503){
			this.findReportTotalScore()
		}
	},
	methods: {
		selectTab: function(n){
			this.showTab = n;
		},
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
		findReportTotalScore: function(){ //报告总分历史趋势
			var vm = this;
			$.ajax({
				url : dataUrl + "/api/v1/ne/findReportTotalScore",
				type : "POST",
				dataType : 'json',
				data : {
				    customerId : customerId,
				    saasId : saasId,
				    reportType:reportType
				},
				success : function(trendData) {
					if(trendData.code == 200){
						var arryDate = [],arryVal = [];
						for(var i=0;i<trendData.data.length;i++){
							arryDate.push(trendData.data[i].inspectDateStr);
							arryVal.push(trendData.data[i].totalScore);
						};
						console.log(arryDate);
						console.log(arryVal);
						intchart('ichart','',arryDate,arryVal);
					}
				},
				error : function(obj,msg){alert(obj  + msg);}
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
		targetProposal: function(){ //查询甲状腺
			var vm = this
			$.ajax({
				url : dataUrl + "/api/v1/reportIndex/targetProposal",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId,
				    targetId : 3122
				},
				success : function(res) {
					if(res.code == 200){
						vm.jiazhuangxian = res.data.guideThirdVo
						vm.jiazhuangScore = res.data.guideThirdVo.score
					}
				},
				error : function(obj,msg){alert("targetProposal error")}
			});
		},
		findAllThird: function(){ //查三级指标
			var vm = this
			$.ajax({
				url : dataUrl + "/api/v2/reportThird/findAllThird",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId,
				},
				success : function(res) {
					if(res.code == 200){
						vm.thirdBids = res.data
					}
				},
				error : function(obj,msg){alert("findAllThird error")}
			});
		},
		goThird2: function(e,item){
			var vm = this;
			zhuge.track('用户点击三级指标',{ //埋点
				'用户id': vm.userId,
				'指标名称':item.targetThirdName,
				'指标得分':item.score,
				'方式' : '通过保险版本首页'
			},function(){
				if(item.targetThirdId == '3230'){
					console.log('不跳')
				}else{
					location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetThirdId + '&userId='+vm.userId+'&deviceSn='+vm.deviceSnNum+'&languageStr='+languageStr
				}
			});
		},
		showSome: function(tit,txt){
			txt = txt.replace(/\/n|\\n/g,'<br>')
			this.someTit = tit
			this.someTxt = txt
			showMask();
			$('#showSome').css({"visibility":"visible","opacity":"1"});
		},
		getSaasTenantByCompanyId: function(){//查询SaaS信息
			var vm = this;
			$.ajax({
				type:"post",
				url:saasUrl+ "/api/v1/initTenant/getSaasTenantByCompanyId",
				async:true,
				dataType: 'json',
				data: {
					saasId:saasId
				},
				success: function(res){
					if(res.code == 200){
						//vm.saasTel = res.data.saasTel
						vm.language.la_thanksForUse = res.data.saasTel
						vm.saasName = res.data.saasName
						vm.saasLogo = res.data.saasLogo
					}
				},
				error: function(){}
			});
		},
		getData: function(){ //获取首页数据
			var vm = this;
			if(saasId){  //如果有saasId调用查询 SaaS信息
				vm.getSaasTenantByCompanyId()
			};
			$.ajax({
				type:"post",
				url:dataUrl + indexAll_data,
				dataType : 'json',
				data : {
				    reportId : reportId,
					customerId : customerId,
					saasId: saasId,
					language: languageStr
				},
				success: function(res){
					if(res.code == 201){
						vm.participate(res.data.paymentType,res.data.sameUser);  //执行判断优惠券
					}else if(res.code == 200){
						//vm.firstPages = res.data.firstPages; //各个系统
						res.data.firstPages.forEach(function(el){
							vm.firstPages.push(el)
						})
						
						vm.getReportSource();
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						vm.targetProposal();
						vm.findAllThird();
						vm.totalScore = res.data.indexPage.totalScore, //全部得分
				   		vm.inspectDate = res.data.indexPage.inspectDate, //检测日期
				    	vm.ranking = res.data.indexPage.ranking, //排名
				    	vm.age = res.data.indexPage.age,
				  		vm.reportStr = res.data.indexPage.reportStr, //生理年龄字句
				  		vm.firstStr = res.data.indexPage.firstStr, //各个系统生理年龄
				  		
				  		vm.otherPages = res.data.otherPages, //其他状况
				  		vm.inspectDay = res.data.map.inspectDay,
				  		vm.userName = res.data.map.userName,
				  		vm.sexStr = res.data.map.sexStr,
				  		vm.ps = res.data.map.ps;
				  		vm.litNum = res.data.map.list2.length;
				  		vm.midNum = res.data.map.list3.length;
				  		vm.abnormalName = res.data.map.abnormalName;
				  		vm.deviceSnNum = res.data.map.deviceSnNum;
				  		vm.userId = res.data.userId;
				  		vm.targetImprove(vm.userId); //调用与上份报告对比
						setTimeout(function(){ //总分动画效果
							$('.guang').css("transform","rotate("+1.8*res.data.indexPage.totalScore+"deg)");
						},100)
						$('#score').animateNumber({ number: res.data.indexPage.totalScore },1100);
						vm.goToShare('goToPrint');
						
						//判断是否显示食谱入口
						var setDate = new Date('2018/09/12 15:30:00'); //设置一个日期，以上线日期为准
						var insDate = new Date(res.data.indexPage.inspectDate.replace(/\-/g, "/"));
						console.log(setDate); console.log(insDate);
						vm.showRecipe = insDate.getTime() - setDate.getTime();
						//十大系统指标环形进度
						var w_cir = $(window).width();
						if($(window).width() > 750){
							w_cir = 750;
						};
						setTimeout(function(){
							vm.firstPages.forEach(function(el,index){
								if(el.targetFirstId == '1001'){
									$('#item1001').css("display","none");
								}else{
									let c_se = '';
									if(el.targetFirstId == '3087'){
										c_se ='#fabcb9';
									}else if(el.targetFirstId=='3095'){
										c_se ='#fbdc89';
									}else if(el.targetFirstId=='3108'){
										c_se ='#82ede3';
									}else if(el.targetFirstId=='3115'){
										c_se ='#f6c9e6';
									}else if(el.targetFirstId=='3127'){
										c_se ='#dcf0a8';
									}else if(el.targetFirstId=='3135'){
										c_se ='#f8e8ac';
									}else if(el.targetFirstId=='3143'){
										c_se ='#c8bff6';
									}else if(el.targetFirstId=='3163'){
										c_se ='#fad6c6';
									}else if(el.targetFirstId=='3195'){
										c_se ='#c1d9ff';
									}else if(el.targetFirstId=='3244'){
										c_se ='#ffc7da';
									};
									$('#item'+el.targetFirstId).circleProgress({
											value: el.score/100,
											animation: true,
											fill: { gradient: [c_se] },
											emptyFill:'#ffffff',
											size: 0.16*w_cir,
											thickness: 16,
											startAngle: Math.PI*1.5
									});
								}
							});
						},220)
							
						
						
						/* setTimeout(function(){
							$('.tenSys_c a').each(function(index){
								//无效系统不显示 1001
								if($(this).find('.tarid').text() == '1001'){
									$(this).css("display","none");
								};
								var c_se ='',c_va = $(this).find('.s-chart').find('.s-score').text();
								if($(this).find('.tarid').text()==3087){
									c_se ='#fabcb9';
								}else if($(this).find('.tarid').text()=='3095'){
									c_se ='#fbdc89';
								}else if($(this).find('.tarid').text()=='3108'){
									c_se ='#82ede3';
								}else if($(this).find('.tarid').text()=='3115'){
									c_se ='#f6c9e6';
								}else if($(this).find('.tarid').text()=='3127'){
									c_se ='#dcf0a8';
								}else if($(this).find('.tarid').text()=='3135'){
									c_se ='#f8e8ac';
								}else if($(this).find('.tarid').text()=='3143'){
									c_se ='#c8bff6';
								}else if($(this).find('.tarid').text()=='3163'){
									c_se ='#fad6c6';
								}else if($(this).find('.tarid').text()=='3195'){
									c_se ='#c1d9ff';
								}else if($(this).find('.tarid').text()=='3244'){
									c_se ='#ffc7da';
								};
								$(this).find('.s-chart').find('.c_circle').circleProgress({
								    value: c_va/100,
								    animation: true,
								    fill: { gradient: [c_se] },
								    emptyFill:'#ffffff',
								    size: 0.16*w_cir,
								    thickness: 16,
								    startAngle: Math.PI*1.5
								});
								if(c_va<90){//分数低于90变色
									$(this).find('.s-inf').find('.tx').css("color","#FF8800");
								};
							});
							
						},200); */
						//生理年龄图
						var arraySlnl=[],arrayXt=[];
						for(var n=0;res.data.firstPages.length>n;n++){
							if(res.data.firstPages[n].physiologicalAge!=null && res.data.firstPages[n].targetFirstId != 3195 && res.data.firstPages[n].targetFirstId != 3163 && res.data.firstPages[n].targetFirstId != 3143){
								arraySlnl.push(res.data.firstPages[n].physiologicalAge);
								arrayXt.push(res.data.firstPages[n].targetFirstName);
							}
						}
						creatMychart('sl_chart',arraySlnl,arrayXt,res.data.indexPage.age,1000);
						vm.wheelsort(vm.deviceSnNum,reportId);//轮播广告
						$(window).scroll(function(){
							if($(this).scrollTop()>1.2*$(window).height()){
								creatMychart('sl_chart',arraySlnl,arrayXt,res.data.indexPage.age,100);
							};
							sessionStorage.setItem("offsetTop", $(window).scrollTop());//保存滚动位置
						});
						var _offset = sessionStorage.getItem("offsetTop");
						$(document).scrollTop(_offset); // 记录滚动位置
					}else{
						alert('indexAll code='+res.code+res.msg)
					}
				},
				error: function(){alert('indexAll error')}
			});
		},
		//与上份报告对比
		targetImprove: function(userId){
			var vm = this;
			$.ajax({
				url : dataUrl + targetImprove_data,
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId,
				    userId : userId,
				    language:languageStr
				},
				success : function(data) {
					if(data.code == 200){
						if(data.data == null){
							$('#v_change').empty();
							vm.show_change = false;
							return
						}else{
							vm.lastDateStr = data.data.lastDateStr, //上次检测日期
							vm.currentDateStr = data.data.currentDateStr, //当前检测日期
							vm.okImproves = data.data.okImproves, //已改善
							vm.noImproves = data.data.noImproves //为改善
						}
						$('#zbgs_tc').on("click",function(event){ //介绍弹窗
							showMask();
							$(this).next('.v_overlert').css({"visibility":"visible","opacity":"1"});
							return false;
						});
						//tab
						$('.change_tab span').on("click",function(){
							$(this).addClass('on').siblings().removeClass('on');
							$('.changeShow').eq($(this).index()).css("display","block").siblings('.changeShow').css("display","none");
							sessionStorage.setItem("changeTab", $(this).index());//保存滚动位置
						});
						var changeVal = sessionStorage.getItem("changeTab");
						$('.change_tab span').eq(changeVal).addClass('on').siblings().removeClass('on');
						$('.changeShow').eq(changeVal).css("display","block").siblings('.changeShow').css("display","none");
						//$(document).scrollTop(_offset);	
					}
				},
			    error : function(obj,msg){console.log('targetImprove error')}
			});

		},
		//判断支付页面
		participate: function(paymentType,sameUser){
			payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+sameUser+'&edition='+edition+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType+'&paymentType='+paymentType+'&languageStr='+languageStr
			if(languageStr == 'en'){
				location.href="pay_en.html"+payStr
			}else{
				if(paymentType == 3){
					location.href="pay_byuser.html"+payStr
				}else if(paymentType == 4){
					location.href="pay_type4.html"+payStr
				}else if(paymentType == 2){
					location.href="pay_coupon.html"+payStr
				}else if(paymentType == 5){
					location.href="pay980.html"+payStr
				}else{
					location.href="payfor.html"+payStr
				}
			}			
		},
		seeMore: function(){
			var vm = this;
			zhuge.track('点击了解更多',{
				'报告版本': '2.0报告'
			},function(){
				location.href = 'instructions.html?reportType='+ reportType
			})
		},
		//介绍弹窗
		popTen: function(e){
			e.stopPropagation;
			showMask();
			$(e.target).parents('.s-inf').next('.v_overlert').css({"visibility":"visible","opacity":"1"});
		},
		popSta: function(e){
			showMask();
			$(e.target).prevAll('.v_overlert').css({"visibility":"visible","opacity":"1"});
		},
		explain: function(){ //说明
			showMask();
			$('#showExplain').css({"visibility":"visible","opacity":"1"});
		},
		phyage: function(e){ //生理年龄解释
			showMask();
			$(e.target).next('.v_overlert').css({"visibility":"visible","opacity":"1"});
		},
		checkHistory: function(){ //健康档案
			var vm = this;
			zhuge.track('点击健康档案', { //埋点 t
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
				location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ reportId+'&saasId='+saasId+'&languageStr='+languageStr
			});	
		},
		getSuggest: function(e){ //健康建议
			var vm = this;
			zhuge.track('点击健康建议',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'z_pop.html?reportId='+reportId+'&edition='+edition+'&reportType='+reportType+'&languageStr='+languageStr
			})
		},
		getRecipesData: function(e){ //健康食谱
			var vm = this;
			zhuge.track('点击健康食谱',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'recipes.html?reportId='+reportId+'&edition='+edition+'&reportType='+reportType+'&languageStr='+languageStr
			})
		},
		goThird: function(e,item){
			var vm = this;
			zhuge.track('用户点击三级指标',{ //埋点
				'用户id': vm.userId,
				'指标名称':item.tagetName,
				'指标得分':item.score,
				'方式' : '通过2.0版本首页'
			},function(){
				location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetId + '&userId='+vm.userId+'&deviceSn='+vm.deviceSnNum+'&languageStr='+languageStr
			});
		},
		goSecond: function(e,item){ //埋点  十大系统点击
			var vm = this;
			zhuge.track('点击十大系统',{
				'用户id': vm.userId,
				'系统名称':item.targetFirstName,
				'系统分数':item.score,
				'渠道' : '微信'
			},function(){
				location.href = 'second2.html?reportId='+reportId+'&userId='+vm.userId+'&targetFirstId='+item.targetFirstId+'&reportType='+reportType+'&deviceSn='+vm.deviceSnNum+'&languageStr='+languageStr
			});
		},
		showQiyeewm: function(){
			showMask();
			$('.qy_ewm').css({"visibility":"visible","opacity":"1"});
		},
		closeQiye: function(){
			closeMask();
			$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
			$('.qy_ewm').css({"visibility":"hidden","opacity":"0"});
			$("body").css("overflow","auto");
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
							}else if(el.bannerPage == 3){
								vm.banData3 = el;
								vm.showBanData3 = true;
								console.log(vm.showBanData3)
							}
						})
						console.log(vm.banData1,vm.banData2)
						vm.banData = res.data;
						setTimeout(function(){
							banSlide(vm.banData1.length,'.gg_head')
							banSlide(vm.banData2.length,'.gg_foot')
						},200)	
					}
				},
				error: function(){console.log('wheelsort error')}
			});
		},
		
	}
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
$.ajax({
	url : dataUrl + "/api/v1/reportUser/findUserById",
	type : "POST",
	dataType : 'json',
	data : {
	    userId : customerId
	},
	success : function(userData) {
		if(userData.code == 200){
			//初始化智齿咨询组件实例
			var zhiManager = (getzhiSDKInstance());
			zhiManager.set("color", '09aeb0');  //取值为0-9a-f共六位16进制字符[主题色] | 默认取后台设置的颜色
			zhiManager.set('location',1); //位置
			zhiManager.set('horizontal', 20); //设置水平边距，默认水平为 20 像素
			zhiManager.set('vertical', 50); //设置垂直边距，默认垂直为 40 像素
			zhiManager.set('powered',false); //隐藏聊天窗体底部的智齿科技冠名
			zhiManager.set('lan', 'zh'); //支持语言
			zhiManager.set('moduleType',3); //机器人客服优先模式
			zhiManager.set('title', '欢迎咨询'); //咨询按钮文案   移动端无用
			zhiManager.set('customBtn', 'true');  //不使用默认咨询按钮
			zhiManager.set('customMargin', 200);
			//设置用户信息
			zhiManager.set('uname',userData.data.userName);
			zhiManager.set('realname',userData.data.userName);
			zhiManager.set('tel',userData.data.mobile);
			zhiManager.set('remark','报告ID： '+reportId);
			zhiManager.on("load", function() {
			    zhiManager.initBtnDOM();
			});
		//////
		}
	},
	error : function(obj,msg){console.log(obj+msg + "findUserById error")}
});
//弹窗
var _bodyoffset = '';
function showMask(){
	_bodyoffset = $(window).scrollTop();
	$("body").css({"position":"fixed","top":-_bodyoffset+"px"});
	$("body").css("overflow","hidden");
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$('#showQiye').css({"visibility":"hidden","opacity":"0"});
		$("body").css("overflow","auto");
		$("body").css("position","static");
		$(window).scrollTop(_bodyoffset);
	});
};	

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

//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
function creatMychart(id,arrayY,arrayX,age,msecond){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById(id));
		option = {
		    xAxis: {
		        type: 'category',
		        boundaryGap: ['3%','3%'],
		        scale:false,
		        axisLabel:{
		        	interval:0,
		        	//rotate:-90,
		        	//width:15
		        	formatter:function(value){  
	                   return value.split("").join("\n");  
	                } 
		        },
		        data: arrayX,
		        axisTick:{
		        	show: false
		        }
		    },
		    yAxis: {
		        type: 'value',
		        scale:true,
		        interval:2,
		        boundaryGap:['10%','10%'],
		        axisLabel:{
		        	//formatter: '{value}岁'
		        	formatter: function (value, index) {           
	                	return value.toFixed(0) + "岁";      
	                }  
		        },
		        splitLine:{
		        	//show: false
		        	lineStyle:{
		        		opacity:0.5
		        	}
		        },
		        axisTick:{
		        	show: false
		        }
		    },
		    series: [{
		    	type: 'line',
		    	symbol:'emptyCircle',
		    	symbolSize:8,
		        data: arrayY,
		        label:{
		    		show:true,
		    		formatter:'{c}',//formatter:'{c}岁',
		    		color:'#000',
		    		fontSize:15
		    	},
		        markLine: {
		        	data:[]
		        },
		        color:['#1ccfba','#2f4554', '#61a0a8'],
		        markLine:{
		        	lineStyle:{
		        		width:2,
		        		opacity:0.5,
		        		type:'dotted'
		        	},
		        	data:[
                        [
                            {
                                name:'     '+age+'岁',
                                coord:[0,age],
                                symbol:'pin',
                                symbolSize:2
                            },{
                                coord:[7, age],
                                symbol:'pin',
                                symbolSize:2,
                                label:{
                                	position:'end'
                                }
                            }
                        ]
                    ]
		        }
		    }]
		};
		myChart.setOption(option);
	},msecond)
};
function intchart(el,tit,arryDate,arryVal){
	var myChart = echarts.init(document.getElementById(el));
	option = {
	    title: {
	    	//show: false,
	        text: tit
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	    	show:false
	    },
	    grid: {
	        left: '3%',
	        right: '10%',
	        bottom: '10%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        axisLabel:{
	            textStyle:{
	                color:"#222"
	        }},
	        data: arryDate
	    },
	    yAxis: {
	        type: 'value',
	        scale:true,
		    boundaryGap:['10%','0%'],
		    max:100
	    },
	    series: [
	        {
	            name:'得分',
	            type:'line',
	            stack: '总量',
	            data:arryVal,
	            itemStyle:{
	                normal:{
	                    color:'#2c886f',  
	                    lineStyle:{  
	                        color:'#2c886f'  
	                    }  
	                }
	            }
	        }
	        
	    ]
	};
	myChart.setOption(option);
}

