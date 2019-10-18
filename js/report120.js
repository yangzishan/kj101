var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = (getQueryString("clientType") || '');
var resource = getQueryString("resource");
var source = (getQueryString('source') || ''); //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var cannsee = (getQueryString('cannsee') || ''); //金管家 jgj
var visible = (getQueryString('visible') || 1);
var edition = 120;
var localUrl = location.href;
var reportPrintUrl = testHealthUrl+'/print/print120.html?viewType=2&reportId=';

var payStr = '';
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
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
zhuge.track('进入保险版报告首页', { //埋点t
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
			customerId: customerId,
			reportType:reportType,
			openId: openId,
			edition: edition,
			saasId: saasId,
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
			litbid:'',
			midbid:'',
			abnormalName:'',
			showRecipe:'',
			deviceReport:'',
			banData:'', //轮播广告
			deviceSnNum:'',
			banData:'',
			saasTel:'感谢您使用智能筛查机器人进行亚健康评估。现将您的评估结果汇总分析如下，如需帮助请拨打我们的健康热线<a href="tel://4006666787" style="color: #1ebeb1;">4006666787</a>，祝您健康！',
			saasName:'',saasLogo:'',
		}
	},
	mounted: function(){
		this.getData();
		this.getSaasTenantByCompanyId();
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
						if(res.data.saasTel){
							vm.saasTel = res.data.saasTel
						}
						vm.saasName = res.data.saasName
						vm.saasLogo = res.data.saasLogo
					}
				},
				error: function(){alert('getSaasTenantByCompanyId error')}
			});
		},
		// 获取首页数据
		getData: function(){
			var _this = this;
			$.ajax({
				type:"post",
				url:dataUrl + "/api/v1/reportIndex/indexAll2",
				async:true,
				dataType : 'json',
				data : {
				    reportId : reportId,
					customerId : customerId
				},
				success: function(res){
					if(res.code == 201 ){
						_this.sameUser = res.data.sameUser;
						_this.paymentType = res.data.paymentType;
						_this.participate(_this.paymentType,_this.sameUser);  //执行判断优惠券
					}else if(res.code == 200){
						if(visible == 0 || reportType == 121){
							//alert(visible)
							_this.showTip(); //不让看报告
						}else{
							_this.getReportSource();
							$('.my_view').css("visibility","visible");
							$('.load-overlay').css("display","none");
							_this.totalScore = res.data.indexPage.totalScore, //全部得分
					   		_this.inspectDate = res.data.indexPage.inspectDate, // 检测日期
					    	_this.ranking = res.data.indexPage.ranking, //排名
					    	_this.age = res.data.indexPage.age,
					  		_this.reportStr = res.data.indexPage.reportStr, //生理年龄字句
					  		_this.firstStr = res.data.indexPage.firstStr, //各个系统生理年龄
					  		_this.firstPages = res.data.firstPages, //各个系统
					  		_this.otherPages = res.data.otherPages, //其他状况
					  		_this.inspectDay = res.data.map.inspectDay,
					  		_this.deviceReport = res.data.map.deviceReport,
					  		_this.userName = res.data.map.userName,
					  		_this.sexStr = res.data.map.sexStr,
					  		_this.sex = res.data.map.sex,
					  		_this.ps = res.data.map.ps;
					  		_this.litNum = res.data.map.list2.length;
					  		_this.midNum = res.data.map.list3.length;
					  		_this.litbid = res.data.map.list2;
					  		_this.midbid = res.data.map.list3;
					  		_this.abnormalName = res.data.map.abnormalName;
					  		_this.deviceSnNum = res.data.map.deviceSnNum;
					  		_this.userId = res.data.userId;
					  		//总分动画效果
							setTimeout(function(){
								$('.guang').css("transform","rotate("+1.8*res.data.indexPage.totalScore+"deg)");
							},100)
							$('#score').animateNumber({ number: res.data.indexPage.totalScore },1100);
							_this.goToShare('goToPrint');
							$('.sy_tab span').on("click",function(){
								$(this).addClass('on').siblings().removeClass('on');
								$('.indexShow').eq($(this).index()).css("display","block").siblings('.indexShow').css("display","none");
							});
							//判断是否显示食谱入口
							var setDate = new Date('2018/09/12 15:30:00'); //设置一个日期，以上线日期为准
							var insDate = new Date(res.data.indexPage.inspectDate.replace(/\-/g, "/"));
							console.log(setDate); console.log(insDate);
							_this.showRecipe = insDate.getTime() - setDate.getTime();
							//异常器官高亮显示
							setTimeout(function(){
								for(var i=0;i<_this.firstPages.length;i++){
									if(_this.firstPages[i].targetFirstName == '循环系统' && _this.firstPages[i].score < 90){
										$('.nao').addClass('i-nao')
									};
									if(_this.firstPages[i].targetFirstName == '呼吸系统' && _this.firstPages[i].score < 90){
										$('.fei').addClass('i-fei')
									};
									if(_this.firstPages[i].targetFirstName == '消化系统' && _this.firstPages[i].score < 90){
										$('.wei').addClass('i-wei')
									};
									if(_this.firstPages[i].targetFirstName == '骨骼系统' && _this.firstPages[i].score < 90){
										$('.gu').addClass('i-gu')
									};
								}
							},1000);
							//生理年龄图
							var arraySlnl=[],arrayXt=[];
							for(var n=0;res.data.firstPages.length>n;n++){
								if(res.data.firstPages[n].physiologicalAge!=null){
									arraySlnl.push(res.data.firstPages[n].physiologicalAge);
									arrayXt.push(res.data.firstPages[n].targetFirstName);
								}
							}
							createChart(arrayXt,arraySlnl,_this.age,500);

							_this.wheelsort(_this.deviceSnNum,reportId);//轮播广告

							// 抓取滚动位置
							$(window).scroll(function(){ 
								sessionStorage.setItem("offsetTop", $(window).scrollTop());//保存滚动位置
							});
							var _offset = sessionStorage.getItem("offsetTop");
							$(document).scrollTop(_offset); // 记录滚动位置
						};
					}else{alert('indexAll code='+res.code+res.msg)}
				},
				error: function(){alert('indexAll error')}
			});
		},
		//判断 /支付
		participate: function(paymentType,sameUser){
			payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+sameUser+'&edition='+edition+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType;
			if(paymentType == 3){
				location.href="pay_byuser.html"+payStr
			}else if(paymentType == 4){
				location.href="pay_type4.html"+payStr
			}else if(paymentType == 2){
				location.href="pay_coupon.html"+payStr
			}else{
				location.href="payfor.html"+payStr
			}				
		},
		//介绍弹窗
		popTen: function(e){
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
				window.location.href = gohistoryUrl
			});
		},
		goSetUp: function(){ //个人中心
			var vm = this;
			zhuge.track('点击个人中心', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				window.location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ reportId+'&saasId='+saasId
			});	
		},
		showTip: function(){
			showMask();
			$('.daifu_d').css("display","block");	
			$('#iknow').click(function(){
				if(openId){
					//WeixinJSBridge.call('closeWindow');
					location.href = gohistoryUrl;
				}else{
					location.href = gohistoryUrl;
					/*window.opener = null;
			        window.open("", "_self", "");
			        window.close();*/
				}
			});
		},
		getSuggest: function(e){ //健康建议
			var vm = this;
			zhuge.track('点击健康建议',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'z_pop.html?reportId='+reportId
			})
		},
		getRecipesData: function(e){ //健康食谱
			var vm = this;
			zhuge.track('点击健康食谱',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'recipes.html?reportId='+reportId
			})
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
		goThird: function(e,item){
			var vm = this;
			zhuge.track('用户点击三级指标',{ //埋点
				'用户id': vm.userId,
				'指标名称':item.targetName,
				'指标得分':item.score,
				'方式' : '通过保险版本首页'
			},function(){
				location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetId + '&userId='+vm.userId
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
//弹窗
function showMask(){
	$("body").css("overflow","hidden");
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$("body").css("overflow","auto");
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
//生理年龄柱状图
function createChart (xarr,yarr,age,time){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById('ageChart'));
		var option = {
		    title: {
		       text: '',
		       show: false
		    },
		    tooltip: {},
		    legend: {
		        data:['十大系统']
		    },
		    xAxis: {
		        type:'category',
		        axisLabel:{
		            interval:0,
		            formatter:function(value){  
		               return value.split("").join("\n");  
		            } 
		        },
		        axisTick:{
		          show:false,  
		        },
		        axisLine:{
		          lineStyle:{
		              color:'#9b9b9b'
		          }
		        },
		        data: xarr
		    },
		    yAxis: {
		        name:'生理年龄（岁）',
		        nameLocation:'middle',
		        scale:true,
		        min:12,
		        axisTick:{
		            show:false,
		        },
		        axisLabel:{
		            show:false
		        },
		        axisLine:{
		            lineStyle:{
		                color:'#9b9b9b'
		            }
		        },
		        splitLine:{
		        	lineStyle:{
		        		color:'#eeeeee'
		        	}
		        }
		    },
		    series: [{
		        name: '',
		        type: 'bar',
		        color:'#1eceb7',
		        barWidth: 15,
		        label:{
		            show:true,
		            position:'top',
		            formatter:'{c}岁'
		        },
		        markLine:{
		        	lineStyle:{
		                type:'solid',
		            },
		            data:[
		                {
		                    name: '平均线',
		                    yAxis: age,
		                    symbol:'none',
		                    symbolSize:2
		                }
		            ]
		        },
		        data: yarr
		    }]
		}; 
		myChart.setOption(option);
	},time)
}

		
