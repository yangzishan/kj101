var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = getQueryString("clientType"); 
var edition = 2;
if(reportType == 5 || reportType < 6){
	var indexAll_data = '/api/v1/reportIndex/indexAll2'
	var targetImprove_data = '/api/v2/reportIndex/targetImprove'
}else if(reportType == 500){ //适配501报告
	var indexAll_data = '/api/v5/reportData/indexAll2'
	var targetImprove_data = '/api/v5/reportData/targetAnalyse'
	$('header').css("display","none")
};
var payStr = '';
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId;
if(!openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId
};
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
setupWebViewJavascriptBridge(function(bridge) {
	//为按钮注册方法
	$(document).on("click","#goToShare",function(){
		//alert('click share');
		bridge.callHandler('goToShare', {'reportId':reportId}, function responseCallback(responseData) {});
	});
})
/*******************************交互逻辑*****************************/
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
			firstPages:'',
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
			banData:'',
			saasTel:'感谢您使用智能筛查机器人进行亚健康评估。现将您的评估结果汇总分析如下，如需帮助请拨打我们的健康热线<a href="tel://4006666787" style="color: #1ebeb1;">4006666787</a>，祝您健康！',
			saasName:'',saasLogo:'',
			language: language,  //默认中文
		}
	},
	mounted: function(){
		this.getData();
	},
	methods: {
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
						vm.saasTel = res.data.saasTel
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
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						vm.totalScore = res.data.indexPage.totalScore, //全部得分
				   		vm.inspectDate = res.data.indexPage.inspectDate, //检测日期
				    	vm.ranking = res.data.indexPage.ranking, //排名
				    	vm.age = res.data.indexPage.age,
				  		vm.reportStr = res.data.indexPage.reportStr, //生理年龄字句
				  		vm.firstStr = res.data.indexPage.firstStr, //各个系统生理年龄
				  		vm.firstPages = res.data.firstPages, //各个系统
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
						$('.sy_tab span').on("click",function(){
							$(this).addClass('on').siblings().removeClass('on');
							$('.indexShow').eq($(this).index()).css("display","block").siblings('.indexShow').css("display","none");
						});
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
							$('#sysNum').text($('.tenSys_c a').length);
						},200);
						//生理年龄图
						var arraySlnl=[],arrayXt=[];
						for(var n=0;res.data.firstPages.length>n;n++){
							if(res.data.firstPages[n].physiologicalAge!=null){
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
			payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+sameUser+'&edition='+edition+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType
			if(languageStr == 'en'){
				location.href="pay_en.html"+payStr
			}else{
				if(paymentType == 3){
					location.href="pay_byuser.html"+payStr
				}else if(paymentType == 4){
					location.href="pay_type4.html"+payStr
				}else if(paymentType == 2){
					location.href="pay_coupon.html"+payStr
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
				location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ reportId
			});	
		},
		getSuggest: function(e){ //健康建议
			var vm = this;
			zhuge.track('点击健康建议',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'z_pop.html?reportId='+reportId+'&edition='+edition+'&reportType='+reportType
			})
		},
		getRecipesData: function(e){ //健康食谱
			var vm = this;
			zhuge.track('点击健康食谱',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'recipes.html?reportId='+reportId+'&edition='+edition+'&reportType='+reportType
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
				location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetId + '&userId='+vm.userId
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
				location.href = 'second2.html?reportId='+reportId+'&userId='+vm.userId+'&targetFirstId='+item.targetFirstId
			});
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
						if(res.data.length == 0){
							$('.ban_gg').remove()
						}
					}
				},
				error: function(){console.log('wheelsort error')}
			});
		},
		
	}
});
//广告轮播
function banSlide(page_count){ 
	var page_now=1;
	var page_num=1; //一页显示几个
	var v_width = $('.v_content').width();
	console.log(page_count)
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
		$("body").css("overflow","auto");
		$("body").css("position","static");
		$(window).scrollTop(_bodyoffset);
	});
};	
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

