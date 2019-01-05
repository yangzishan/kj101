//截取URL
function GetQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
var reportId = GetQueryString('reportId');
var openId = GetQueryString('openId');
var edition = 120;
zhuge.track('进入保险版报告首页', { //埋点t
	'openId' : openId,
	'渠道' : '微信'
});
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var myApp = new Vue({
	el: "#appVUE",
	data: function(){
		return {
			reportId: reportId,
			openId: openId,
			edition: edition,
			sameUser:'',
			paymentType:'',
			totalScore:'',
			age:'',
			sex:'',
			ranking:'',
			headimgurl:'',
			height:'',
			weight:'',
			userId:'',
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
			deviceReport:''
		}
	},
	mounted: function(){
		this.analysisReport();
	},
	methods: {
		// 解析报告
		analysisReport: function(){
			var _this = this;
			$.ajax({
				type:"post",
				url:dataUrl + "/api/v1/reportIndex/analysisReport",
				async:true,
				dataType:"json",
				data:{
					reportId: reportId,
					openId: openId
				},
				success:function(data){
					if(data.code == 200){
						_this.getData(); // 执行获取首页数据
					}else if(data.code == 402){
						window.location.href="userInfor"+edition+".html?reportId=" + reportId+"&userId=" + data.data.customerId + "&openId=" + openId + "&edition="+edition;
					}else if(data.code == 405){
						window.location.href="userInfor"+edition+".html?reportId=" + reportId + "&openId=" + openId + "&edition="+edition;
					}else if(data.code == 403){
						window.location.href="supAge.html?reportId=" + reportId+"&userId=" + data.data.customerId + "&openId=" + openId + "&edition="+edition;
					}else if(data.code == 302){
						window.location.href="equipmentUnable.html"
					}else{
						console.log('没有解析到新报告,' + data.msg);
						$('.load-overlay').css("display","none");
						$('#error_con').css("display","block");
					}
				},
				error: function(){alert('analysisReport error')}
			});
		},
		// 获取首页数据
		getData: function(){
			var _this = this;
			$.ajax({
				type:"post",
				url:dataUrl + "/api/v1/reportIndex/indexAll",
				async:true,
				dataType : 'json',
				data : {
				    reportId : reportId,
					openId : openId
				},
				success: function(indexData){
					if(indexData.code == 201){
						_this.sameUser = indexData.data.sameUser;
						_this.paymentType = indexData.data.paymentType;
						_this.participate(_this.paymentType,_this.sameUser);  //执行判断优惠券
					}else if(indexData.code == 200){
						if(indexData.data.map.deviceReport == 121){
							_this.showTip(); //不让看报告
						}else{
							$('.my_view').css("visibility","visible");
							$('.load-overlay').css("display","none");
							_this.totalScore = indexData.data.indexPage.totalScore, //全部得分
					   		_this.inspectDate = indexData.data.indexPage.inspectDate, // 检测日期
					    	_this.ranking = indexData.data.indexPage.ranking, //排名
					    	_this.age = indexData.data.indexPage.age,
					  		_this.reportStr = indexData.data.indexPage.reportStr, //生理年龄字句
					  		_this.firstStr = indexData.data.indexPage.firstStr, //各个系统生理年龄
					  		_this.firstPages = indexData.data.firstPages, //各个系统
					  		_this.otherPages = indexData.data.otherPages, //其他状况
					  		_this.inspectDay = indexData.data.map.inspectDay,
					  		_this.deviceReport = indexData.data.map.deviceReport,
					  		_this.userName = indexData.data.map.userName,
					  		_this.sexStr = indexData.data.map.sexStr,
					  		_this.sex = indexData.data.map.sex,
					  		_this.ps = indexData.data.map.ps;
					  		_this.litNum = indexData.data.map.list2.length;
					  		_this.midNum = indexData.data.map.list3.length;
					  		_this.litbid = indexData.data.map.list2;
					  		_this.midbid = indexData.data.map.list3;
					  		_this.abnormalName = indexData.data.map.abnormalName;
					  		_this.userId = indexData.data.userId;
					  		//总分动画效果
							setTimeout(function(){
								$('.guang').css("transform","rotate("+1.8*indexData.data.indexPage.totalScore+"deg)");
							},100)
							$('#score').animateNumber({ number: indexData.data.indexPage.totalScore },1100);
							$('.sy_tab span').on("click",function(){
								$(this).addClass('on').siblings().removeClass('on');
								$('.indexShow').eq($(this).index()).css("display","block").siblings('.indexShow').css("display","none");
							});
							//判断是否显示食谱入口
							var setDate = new Date('2018/09/12 15:30:00'); //设置一个日期，以上线日期为准
							var insDate = new Date(indexData.data.indexPage.inspectDate.replace(/\-/g, "/"));
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
							for(var n=0;indexData.data.firstPages.length>n;n++){
								if(indexData.data.firstPages[n].physiologicalAge!=null){
									arraySlnl.push(indexData.data.firstPages[n].physiologicalAge);
									arrayXt.push(indexData.data.firstPages[n].targetFirstName);
								}
							}
							createChart(arrayXt,arraySlnl,_this.age,500);
							
							_this.goLook(_this.userId);

							// 抓取滚动位置
							$(window).scroll(function(){ 
								sessionStorage.setItem("offsetTop", $(window).scrollTop());//保存滚动位置
							});
							var _offset = sessionStorage.getItem("offsetTop");
							$(document).scrollTop(_offset); // 记录滚动位置
						};
		
					}
				},
				error: function(){alert('indexAll error')}
			});
		},
		//判断 /支付
		participate: function(paymentType,sameUser){
			if(paymentType == 3){
				window.location.href="pay_byuser.html?reportId=" + reportId + '&openId=' + openId + "&sameUser=" + sameUser + "&edition="+edition;
			}else if(paymentType == 4){
				window.location.href="pay_type4.html?reportId=" + reportId + '&openId=' + openId + "&sameUser=" + sameUser + "&edition="+edition;
			}else if(paymentType == 2){
				window.location.href="pay_coupon.html?reportId=" + reportId + '&openId=' + openId + "&sameUser=" + sameUser + "&edition="+edition;
			}else{
				window.location.href="payfor.html?reportId=" + reportId + '&openId=' + openId + "&sameUser=" + sameUser + "&edition="+edition;
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
			let vm = this;
			zhuge.track('点击历史报告', { //埋点 t
				'用户id': vm.userId,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				window.location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiHistory&userId=" + this.userId + "&openId=" + openId + '&reportId=' + reportId
			});
		},
		goSetUp: function(){ //个人中心
			let vm = this;
			zhuge.track('点击个人中心', { //埋点 t
				'用户id': vm.userId,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				window.location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + this.userId + '&reportId='+ reportId
			});	
		},
		showTip: function(){
			showMask();
			$('.daifu_d').css("display","block");	
			$('#iknow').click(function(){
				WeixinJSBridge.call('closeWindow');
			});
		},
		goLook: function(userId){ //埋点 建议 食谱
			$('.golook li a').click(function(){
				let link = $(this);
				zhuge.track('点击'+link.find('em').text(),{
					'用户id': userId,
					'openId': openId,
					'渠道' : '微信'
				},function(){
					location.href = link.attr('href');
				});
			});
		},
		goSecond: function(e,item){ //埋点  十大系统点击
			let vm = this;
			zhuge.track('点击十大系统',{
				'用户id': vm.userId,
				'系统名称':item.targetFirstName,
				'得分':item.score,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				location.href = 'second2.html?reportId='+reportId+'&userId='+vm.userId+'&targetFirstId='+item.targetFirstId
			});
		}
	}
});

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

		
