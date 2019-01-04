var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var edition = getQueryString('edition');
if(edition == undefined || edition == null || edition == ''){
	edition = 2;
	var indexAll_data = '/api/v1/reportIndex/indexAll'
	var targetImprove_data = '/api/v2/reportIndex/targetImprove'
}else if(edition == 500){ //适配501报告
	var indexAll_data = '/api/v5/reportData/indexAll'
	var targetImprove_data = '/api/v5/reportData/targetAnalyse'
	$('header').css("display","none")
}
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var myApp = new Vue({
	el: "#appVUE",
	data: function(){
		return {
			reportId: reportId,
			openId: openId,
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
			abnormalName:'',
			showRecipe:'',
			lastDateStr:'', 
			currentDateStr:'',
			okImproves:'',
			noImproves:''
		}
	},
	mounted: function(){
		this.analysisReport();
	},
	methods: {
		analysisReport: function(){ //解析报告
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl + "/api/v1/reportIndex/analysisReport",
				dataType:"json",
				data:{
					reportId: reportId,
					openId: openId
				},
				success:function(data){
					if(data.code == 200){
						vm.getData(); // 执行获取首页数据
					}else if(data.code == 402){
						window.location.href="userInfor.html?reportId=" + reportId+"&userId=" + data.data.customerId + "&openId=" + openId + "&edition="+edition;
					}else if(data.code == 405){
						window.location.href="userInfor.html?reportId=" + reportId + "&openId=" + openId + "&edition="+edition;
					}else if(data.code == 403){
						window.location.href="supAge.html?reportId=" + reportId+"&userId=" + data.data.customerId + "&openId=" + openId + "&edition="+edition;
					}else if(data.code == 302){
						window.location.href="equipmentUnable.html"
					}else{
						console.log('analysisReport code='+ data.code + data.msg);
						$('.load-overlay').css("display","none");
						$('#error_con').css("display","block");
					}
				},
				error: function(){alert('analysisReport error')}
			});
		},
		getData: function(){ //获取首页数据
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl + indexAll_data,
				dataType : 'json',
				data : {
				    reportId : reportId,
					openId : openId
				},
				success: function(indexData){
					if(indexData.code == 201){
						vm.participate(indexData.data.paymentType,indexData.data.sameUser);  //执行判断优惠券
					}else if(indexData.code == 200){
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						vm.totalScore = indexData.data.indexPage.totalScore, //全部得分
				   		vm.inspectDate = indexData.data.indexPage.inspectDate, // 检测日期
				    	vm.ranking = indexData.data.indexPage.ranking, //排名
				    	vm.age = indexData.data.indexPage.age,
				  		vm.reportStr = indexData.data.indexPage.reportStr, //生理年龄字句
				  		vm.firstStr = indexData.data.indexPage.firstStr, //各个系统生理年龄
				  		vm.firstPages = indexData.data.firstPages, //各个系统
				  		vm.otherPages = indexData.data.otherPages, //其他状况
				  		vm.inspectDay = indexData.data.map.inspectDay,
				  		vm.userName = indexData.data.map.userName,
				  		vm.sexStr = indexData.data.map.sexStr,
				  		vm.ps = indexData.data.map.ps;
				  		vm.litNum = indexData.data.map.list2.length;
				  		vm.midNum = indexData.data.map.list3.length;
				  		vm.abnormalName = indexData.data.map.abnormalName;
				  		vm.userId = indexData.data.userId;
				  		vm.targetImprove(vm.userId); //调用与上份报告对比
						setTimeout(function(){ //总分动画效果
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
						},200);
						//生理年龄图
						var arraySlnl=[],arrayXt=[];
						for(var n=0;indexData.data.firstPages.length>n;n++){
							if(indexData.data.firstPages[n].physiologicalAge!=null){
								arraySlnl.push(indexData.data.firstPages[n].physiologicalAge);
								arrayXt.push(indexData.data.firstPages[n].targetFirstName);
							}
						}
						creatMychart('sl_chart',arraySlnl,arrayXt,indexData.data.indexPage.age,1000);
						$(window).scroll(function(){
							if($(this).scrollTop()>1.2*$(window).height()){
								creatMychart('sl_chart',arraySlnl,arrayXt,indexData.data.indexPage.age,100);
							};
							sessionStorage.setItem("offsetTop", $(window).scrollTop());//保存滚动位置
						});
						var _offset = sessionStorage.getItem("offsetTop");
						$(document).scrollTop(_offset); // 记录滚动位置
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
				    userId : userId
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
					
						//介绍弹窗
						$('#zbgs_tc').on("click",function(event){
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
						//判断class
						setTimeout(function(){
							$('.change_list li span.s2').each(function(index){
								if($(this).text()=='正常'){
									$(this).addClass('bc1');
								}else if($(this).text()=='轻度风险'){
									$(this).addClass('bc2');
								}else if($(this).text()=='中度风险'){
									$(this).addClass('bc3');
								}
							});
							//新增
							$('.change_list li span.s1 i').each(function(){
								if($(this).text()=='1'){
									$(this).next('font').css("display","inline-block");
								}
							});
							//判断没有指标项
							$('.change_list').each(function(index){
								if($(this).find('li').length == 0){
									$(this).next('p').css("display","block");
								}
							});
						},100)
							
					}
				},
			    error : function(obj,msg){console.log(obj  + msg+':异常项改善情况 接口error');}
			});
			
			
		},
		//判断支付页面
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
			$('body').css("overflow","hidden");
			showMask();
			$(e.target).parents('.s-inf').next('.v_overlert').css({"visibility":"visible","opacity":"1"});
		},
		popSta: function(e){
			$('body').css("overflow","hidden");
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
		checkHistory: function(e){ //历史报告
			window.location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiHistory&userId=" + this.userId + "&openId=" + openId + '&reportId=' + reportId
		},
		goSetUp: function(e){ //个人中心
			window.location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + this.userId + '&reportId='+ reportId
		},
		getSuggest: function(e){ //健康建议
			window.location.href = 'z_pop.html?reportId='+reportId+'&edition='+edition
		},
		getRecipesData: function(e){ //健康食谱
			window.location.href = 'recipes.html?reportId='+reportId+'&edition='+edition
		},
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
		    		formatter:'{c}岁',
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

