var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = (getQueryString("clientType") || '');
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var invite = getQueryString("invite");  //邀约历史查看
var localUrl = location.href;
var edition = 100;
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
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
};
/*******************************交互逻辑*****************************/
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
zhuge.track('进入福利基金版报告首页', { //埋点t
	'openId' : openId,
	'渠道' : '微信'
});
var myApp = new Vue({
	el: '#appOne',
	data: function(){
		return {
			invite:invite,
			reportId: reportId,
			openId: openId,
			customerId: customerId,
			userId: customerId,
			totalScore:'',
			inspectDate:'', //检测日期
			userName:'',
			sexStr:'', //性别称呼
			ps:'',//状态
			inspectDay:'',
			ranking:'',
			age:'',
			normalNum:'',
			lightNum:'',
			severeNum:'',
			reportStr: '', //生理年龄字句
	  		firstStr: '', //各个系统生理年龄
	  		firstPages: '', //各个系统 firstPages
	  		otherPages: '', //身体状况 otherPages
	  		isPay:'',
	  		sameUser:'',
	  		showRecipe:'',
	  		banData:'',
			deviceSnNum:''
		}
	},
	mounted: function(){
		this.indexTarget();
		this.getSuggest();
	},
	methods: {
		goToShare: function(fangfa){  //goToShare\goToPrint
			var vm = this;
			setupWebViewJavascriptBridge(function(bridge) {
				//alert('click share'+reportId);
				bridge.callHandler(fangfa, {
					'reportId':reportId,
					'reportUrl':localUrl,
					'reportPrintUrl':'',
					'reportScore': vm.totalScore,
					'reportTime': vm.inspectDate,
					'reportName': vm.ranking
				}, function responseCallback(responseData) {});
			})
		},
		getSuggest: function(){
			var vm = this;
			$.ajax({
				type: "post",
				url: dataUrl + "/api/v1/reportIndex/getSuggest",
				dataType: "json",
				data:{
					reportId : reportId
				},
				success: function(res){
					if(res.code == 200){
						vm.userName = res.data.userName
						vm.sexStr = res.data.sexStr
						vm.ps = res.data.ps// 状态
						vm.inspectDay = res.data.inspectDay // 提醒天数
						if(res.data.abnormal.list1){ vm.normalNum = res.data.abnormal.list1.length };
						if(res.data.abnormal.list2){ vm.lightNum = res.data.abnormal.list2.length };
						if(res.data.abnormal.list4 || res.data.abnormal.list3){
							vm.severeNum = res.data.abnormal.list4.length+res.data.abnormal.list3.length
							if(res.data.abnormal.list4.length+res.data.abnormal.list3.length==0){
								$('.midfx').css("display","none");
							}
						};
						vm.goToShare('goToPrint');
					}else{
						console.log('getSuggest code='+res.code);
					}
				},
				error: function(){alert('getSuggest error')}
			});
		},
		indexTarget: function(){ //首页数据
			var vm = this;
			$.ajax({
				type: "post",
				url: dataUrl + "/api/v3/reportIndex/indexTarget2",
				dataType: "json",
				data:{
					reportId : reportId,
					userId : customerId
				},
				success: function(res){
					if(res.code == 200){
						var userId = res.data.userId;
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						vm.userId = res.data.userId
						vm.totalScore = res.data.indexPage.totalScore //全部得分
				   		vm.inspectDate = res.data.indexPage.inspectDate // 检测日期
				    	vm.ranking = res.data.indexPage.ranking //排名
				    	vm.age = res.data.indexPage.age //生理年龄
				  		vm.reportStr = res.data.indexPage.reportStr //生理年龄字句
				  		vm.firstStr = res.data.indexPage.firstStr //各个系统生理年龄
				  		vm.firstPages = res.data.firstPages //各个系统
				  		vm.otherPages = res.data.otherPages //身体状况
				  		vm.isPay = res.data.map.isPay
				  		vm.sameUser = res.data.map.sameUser
				  		vm.deviceSnNum = res.data.map.deviceSnNum
						//首页动画延迟
						var rodeg = null;
						if(95<=res.data.indexPage.totalScore && res.data.indexPage.totalScore<=100){
							rodeg = -10;$('.risk').text('最佳状态');	
						}else if(90<=res.data.indexPage.totalScore && res.data.indexPage.totalScore<=94){
							rodeg = 45;$('.risk').text('良好状态');
						}else if(85<=res.data.indexPage.totalScore && res.data.indexPage.totalScore<=89){
							rodeg = 90;$('.risk').text('一级风险');
						}else if(80<=res.data.indexPage.totalScore && res.data.indexPage.totalScore<=84){
							rodeg = 135;$('.risk').text('二级风险');
						}else{
							rodeg = 190;$('.risk').text('三级风险');
						}
						setTimeout(function(){
							$('.zhen_j').css("width",res.data.indexPage.totalScore+"%");
							$('#score').animateNumber({ number: res.data.indexPage.totalScore },1000);
							$('#level').css("transform","rotate("+rodeg+"deg)")
							 //情绪指数
						    if(vm.otherPages[4].abnormalLevel == 1){
						    	$('#emoImg').attr("src","img/fuli/em1.jpg");$('#emoTxt').text('快乐');
						    }else if(vm.otherPages[4].abnormalLevel == 2){
						    	$('#emoImg').attr("src","img/fuli/em2.jpg");$('#emoTxt').text('平和');
						    }else if(vm.otherPages[4].abnormalLevel == 3){
						    	$('#emoImg').attr("src","img/fuli/em3.jpg");$('#emoTxt').text('压抑');
						    }else if(vm.otherPages[4].abnormalLevel == 4){
						    	$('#emoImg').attr("src","img/fuli/em4.jpg");$('#emoTxt').text('焦虑');
						    }else{
						    	$('#emoImg').attr("src","img/fuli/em5.jpg");$('#emoTxt').text('郁闷');
						    };
						    vm.wheelsort(vm.deviceSnNum,reportId);//轮播广告
						},400);
						
					    //记录滚动位置
					    var closeTen = sessionStorage.getItem("closeTen");
					    var tenSindex = sessionStorage.getItem("tenSindex");
					    if(closeTen == "show"){
					    	$('.xqbaogao .con').eq(tenSindex-1).find('.lee').nextAll('dl').css("display","block");
					    	$('.xqbaogao .con').eq(tenSindex-1).find('.lee').find('.or').removeClass('arr');
					    }
						$(window).scroll(function(){
							sessionStorage.setItem("offsetTop",$(window).scrollTop());
						});
						var _offset = sessionStorage.getItem("offsetTop");
						$(document).scrollTop(_offset);

					    //判断是否显示食谱入口
						var setDate = new Date('2018/09/12 15:30:00'); //设置一个日期，以上线日期为准
						var insDate = new Date(res.data.indexPage.inspectDate.replace(/\-/g, "/"));
						vm.showRecipe = insDate.getTime() - setDate.getTime();
					    
					    //异常项数组
						var oaray = new Array();
						var item_num = $(".item_num");
						for(i=0;i<item_num.length;i++){
							oaray[i] = parseInt(item_num.eq(i).text());
						}
						var docWidth = document.documentElement.clientWidth;
						if(docWidth<=750){
							var rad = 160 * (docWidth/375);
						}else{
							rad = 300;
						};
						$('#container').css('height',rad);
						var chart = null;
						//执行图表
						$('#container').highcharts({
					        chart: {
					            plotBackgroundColor: null,
					            plotBorderWidth: null,
					            plotShadow: false,
					            spacing : [0, 0 , 0, 0]
					        },
					        title: {
					            floating:true,
					            text: '评估结果',
					            style:{
					            	 "color": "#333333", "fontSize": "14px"
					            },
					        },
					        tooltip: {
					            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					        },
					        plotOptions: {
					            pie: {
					                allowPointSelect: false,
					                cursor: 'pointer',
					                dataLabels: {
					                    enabled: false,
					                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					                    style: {
					                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					                    }
					                }
					            }
					        },
					        series: [{
					            type: 'pie',
					            innerSize: '72%',
					            name: '占比',
					            data: [
					                {
					                	name:'正常', y:oaray[0], color:'#55d1c6'
					                },
					                {
					                	name:'轻度', y:oaray[1], color:'#f5c561'
					                },
					                {
					                	name:'中度', y:oaray[2], color:'#f4974d'
					                }
					            ]
					        }]
					    }, function(c) {
					        // 环形图圆心
					        var centerY = c.series[0].center[1],
					            titleHeight = parseInt(c.title.styles.fontSize);
					        c.setTitle({
					            y:centerY + titleHeight/2
					        });
					        chart = c;
					    });
						//介绍弹窗
						$('.openpop').on("click",function(){
							event.stopPropagation();
							showMask();
							var ohtml = $(this).next('.poptxt').html();
							$('.tc_sy .bxt').html(ohtml);
							return false;
						});
					}else{alert('indexTarget code='+res.code+res.msg)}
				},
				error: function(){alert('indexTarget error')}
			});
		},
		showThird: function(e,item){
			var vm = this;
			var oindex = $(e.target).parent('.con').index();
	    	sessionStorage.setItem("tenSindex",oindex);
	    	if($(e.target).next('dl').css("display") == 'none'){
	    		$('.xqbaogao .con .lec').css("display","none");
				$('.xqbaogao .con .lee .or').addClass('arr');
	    		$(e.target).nextAll('dl').css("display","block");
	    		$(e.target).find('.or').removeClass('arr');
	    		sessionStorage.setItem("closeTen","show");
	    	}else{
	    		$(e.target).nextAll('dl').css("display","none");
	    		$(e.target).find('.or').addClass('arr');
	    		sessionStorage.setItem("closeTen","noShow");	
	    	};	
			
		},
		goThird: function(e,item){
			var vm = this;
			zhuge.track('用户点击三级指标',{ //埋点
				'用户id': vm.userId,
				'指标名称':item.targetThirdName,
				'指标得分':item.score,
				'方式' : '通过福利基金报告首页'
			},function(){
				location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetThirdId + '&userId='+vm.userId
			});
		},
		goSuggest: function(e){ //健康建议
			var vm = this;
			zhuge.track('点击健康建议',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'z_pop.html?reportId='+reportId+'&edition='+edition
			})
		},
		getRecipesData: function(e){ //健康食谱
			var vm = this;
			zhuge.track('点击健康食谱',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'recipes.html?reportId='+reportId+'&edition='+edition
			})
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
				location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ reportId+'&saasId='+saasId
			});	
		},
		goPay: function(){
			var vm = this;
			zhuge.track('点击支付', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信',
				'方式': '通过福利基金首页点击'
			},function(){
				location.href = 'pay_fuli.html?reportId='+reportId+'&openId='+openId+'&userId='+customerId+'&sameUser='+vm.sameUser+'&edition='+edition+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType
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
//微信分享配置接口
var reqUrl = window.location.href;
$.ajax({
    type:"post",
    url: dataUrl+ "/weiXin/wxConfig",
    data:{
    	reqUrl: reqUrl
    },
    success:function(result){
    	$("#appId").val(result.wxParameter.appId);
		$("#nonceStr").val(result.wxParameter.nonceStr);
		$("#signature").val(result.wxParameter.signature);
		$("#timestamp").val(result.wxParameter.timestamp);
    }
});
//弹窗
var win_top = 0;
function showMask(){
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	$('.v_overlert').css({"visibility":"visible","opacity":"1"});
	win_top = $(window).scrollTop();
	$("body").css({"position":"fixed","top":-win_top+"px"});
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$("body").css("position","static");
		$(window).scrollTop(win_top);
	});
};
//截取URL
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
