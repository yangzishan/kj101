//截取URL
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
var myReportId = GetQueryString('reportId');
var myopenId = GetQueryString('openId');
var edition = 2;
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
$.ajax({
	url : dataUrl + "/api/v1/reportIndex/analysisReport",
	type : "POST",
	dataType : 'json',
	data : {
	    reportId : myReportId,
	    openId : myopenId
	},
	success: function(data){
		if(data.code == 200){
			$.ajax({
			url : dataUrl + "/api/v1/reportIndex/indexAll",
			type : "POST",
			dataType : 'json',
			data : {
			    reportId : myReportId,
				openId : myopenId
			},
			success : function(indexData) {
				//alert('you get it')
				if(indexData.code == 201){
					var sameUser = indexData.data.sameUser;
					//var paymentType = indexData.data.paymentType;  //判断用哪个支付页面
					window.location.href="payfor.html?reportId=" + myReportId + '&openId=' + myopenId + "&sameUser=" + sameUser + "&edition="+edition;
				}else if(indexData.code == 200){
					var userId = indexData.data.userId;
					$('.my_view').css("visibility","visible");
					$('.load-overlay').css("display","none");
					$("#appId").val(indexData.wxParameter.appId);
					$("#nonceStr").val(indexData.wxParameter.nonceStr);
					$("#signature").val(indexData.wxParameter.signature);
					$("#timestamp").val(indexData.wxParameter.timestamp);
					$("#age").val(indexData.data.indexPage.age);
					var myApp = new Vue({
					  	el: '#appVUE',
					  	data: {
					    	totalScore: indexData.data.indexPage.totalScore, //全部得分
					   		inspectDate: indexData.data.indexPage.inspectDate, // 检测日期
					    	ranking: indexData.data.indexPage.ranking, //排名
					    	age: indexData.data.indexPage.age,//生理年龄
					  		reportStr: indexData.data.indexPage.reportStr, //生理年龄字句
					  		firstStr: indexData.data.indexPage.firstStr, //各个系统生理年龄
					  		sites: indexData.data.firstPages, //各个系统
					  		status: indexData.data.otherPages //身体状况
					  	},
					  	filters:{
				    		getSecondHref:function(val){
				            return 'second2.html?reportId='+myReportId+'&userId='+userId+ '&targetFirstId=' + val 
				       		}
					  	}
					});
					
					//总分动画效果
					setTimeout(function(){
						$('.guang').css("transform","rotate("+1.8*indexData.data.indexPage.totalScore+"deg)");
					},100)
					$('#score').animateNumber({ number: indexData.data.indexPage.totalScore },1100);
					//判断生理年龄和排名没有的情况
					  if(indexData.data.indexPage.ranking == 0){
					  	$('.srhRank').empty();
					  };
					  if(indexData.data.indexPage.reportStr == ''){
					  	$('.srhAge').empty();
					  	$('#noAge').css("display","none");
					  };
					//index_tab切换
					$('.sy_tab span').on("click",function(){
						$(this).addClass('on').siblings().removeClass('on');
						$('.indexShow').eq($(this).index()).css("display","block").siblings('.indexShow').css("display","none");
					});
					//系统介绍弹窗
					$('.tenSys_c a .s-inf .lab .pop').on("click",function(event){
						event.stopPropagation();
						showMask();
						$(this).parents('.s-inf').next('.v_overlert').css({"visibility":"visible","opacity":"1"});
						return false;
					});
					$('.zhuangk_c .c_li .pop').on("click",function(event){
						event.stopPropagation();
						showMask();
						$(this).prevAll('.v_overlert').css({"visibility":"visible","opacity":"1"});
						return false;
					});
					$('#slnl_tc').on("click",function(event){
						event.stopPropagation();
						showMask();
						$(this).next('.v_overlert').css({"visibility":"visible","opacity":"1"});
						return false;
					});
					$('#explain').click(function(){
						event.stopPropagation();
						showMask();
						$('#showExplain').css({"visibility":"visible","opacity":"1"});
						return false;
					});
					
					//第一个系统不显示
					$('.tenSys_c a:first').css("display","none");
					//身体状况程度条
					$('.zhuangk_c .c_li').each(function(){
						var ilev = 6 - parseInt($(this).find('.lev').text());
						$(this).find('.sta').find('i:lt('+ilev+')').addClass('on');
					})
					//酸碱度
					$('.zhuangk_c .c_li:last .sta').css("display","none");
					$('.zhuangk_c .c_li:last .sta2').css("display","inline-block");
					//十大系统指标环形进度
					setTimeout(function(){
						$('.tenSys_c a .s-chart .c_circle').each(function(index){
							var c_se ='',c_va = $(this).next('p').text();
							if(index==1){
								c_se ='#fabcb9';
							}else if(index==2){
								c_se ='#fbdc89';
							}else if(index==3){
								c_se ='#82ede3';
							}else if(index==4){
								c_se ='#f6c9e6';
							}else if(index==5){
								c_se ='#dcf0a8';
							}else if(index==6){
								c_se ='#f8e8ac';
							}else if(index==7){
								c_se ='#c8bff6';
							}else if(index==8){
								c_se ='#fad6c6';
							}else if(index==9){
								c_se ='#c1d9ff';
							}else if(index==10){
								c_se ='#ffc7da';
							};
							$(this).circleProgress({
							    value: c_va/100,
							    animation: true,
							    fill: { gradient: [c_se] },
							    emptyFill:'#ffffff',
							    size: 0.16*$(window).width(),
							    thickness: 12,
							    //lineCap: 'round',
							    startAngle: Math.PI*1.5
							});
							
							//分数低于90变色
							if(c_va<90){
								$(this).parents('.s-chart').next('.s-inf').find('.tx').css("color","#FF8800");
							};
						});
						
					},200);
					
					//跳转历史报告
					var userId = indexData.data.userId;
					$('#checkHistory').attr("href",dataUrl + "/wxUser/wxUserReport?jumpUrl=uiHistory&userId=" + userId + "&openId=" + myopenId + '&reportId=' + myReportId);
					//跳转用户设置
					$('#goSetUp').attr("href",dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + userId + '&reportId='+ myReportId);
					
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
							//alert($(window).scrollTop());
							creatMychart('sl_chart',arraySlnl,arrayXt,indexData.data.indexPage.age,100);
						};
						sessionStorage.setItem("offsetTop", $(window).scrollTop());//保存滚动位置
					});
					var _offset = sessionStorage.getItem("offsetTop");
　　					
					//请求与上份报告对比的异常项改善情况 接口
					$.ajax({
					url : dataUrl + "/api/v2/reportIndex/targetImprove",
					type : "POST",
					dataType : 'json',
					data : {
					    reportId : myReportId,
					    userId : userId
					},
					success : function(data) {
						if(data.code == 200){
							if(data.data == null){
								$('#v_change').empty();
								return
							};
							var myApp2 = new Vue({
								el:'#v_change',
								data:{
									code: data.code,
									lastDateStr: data.data.lastDateStr, //上次检测日期
									currentDateStr: data.data.currentDateStr, //当前检测日期
									okImproves: data.data.okImproves, //已改善
									noImproves: data.data.noImproves //为改善
								},
								filters:{
						    		getThirdHref:function(val){
						            return 'third.html?reportId='+myReportId+'&targetId='+ val + '&userId='+userId
						       		}
							  	}
							});
							//介绍弹窗
							$('#zbgs_tc').on("click",function(event){
								event.stopPropagation();
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
							$(document).scrollTop(_offset);
							//判断class
							$('.change_list li .s2').each(function(index){
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
						}
					},
					    error : function(obj,msg){
					    	alert(obj  + msg+'异常项改善情况 接口error');
					    }
					});
					
				}else{
					alert('没获取到报告数据');
				}
			
			},
				error: function(xhr,status){
					//alert("已解析但未获取到数据" + xhr.status + " " + xhr.statusText);
				}
			});
			
			$.ajax({
				url : dataUrl + "/api/v1/reportIndex/getSuggest",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : myReportId  //替换变量 myReportId
				},
				success: function(improvesData){
					//alert('get it');
					if(improvesData.code == 200){
						var userName = improvesData.data.userName; //用户名
						if(userName == null){
							userName = '';
						};
						var sexStr = improvesData.data.sexStr; //性别称呼
						var ps = improvesData.data.ps; // 状态
						var inspectDay = improvesData.data.inspectDay; // 提醒天数
						$('#sugDay').text(inspectDay);
						$('#bodySta').text(ps);
						$('#dearName').html(userName+sexStr);
						
						$('#list2_No').text(improvesData.data.abnormal.list2.length);
						if(improvesData.data == null || improvesData.data.abnormal == ''){
							$('.noSeg').empty()
						}else{
							var midDanger = improvesData.data.abnormal.list4.length+improvesData.data.abnormal.list3.length;
							$('#list3').text(midDanger);
							
							//重度中度都没有的情况
							if(improvesData.data.abnormal.list3.length == 0 && improvesData.data.abnormal.list4.length == 0){
								$('#segTwo').html('2、本次检测您有'+improvesData.data.abnormal.list2.length+'项为轻度风险。根据您本次检测结果，给您提供的专属健康建议与改善方案')
							};								
							if(improvesData.data.abnormalName.length == 0 || improvesData.data.abnormalName == null){
								$('#tipmsg').html('根据您本次检测结果，给您提供的专属健康建议与改善方案，');
								$('.buchong').css("display","none");
							}else{
								for(var i=0;i<improvesData.data.abnormalName.length;i++){
									var oli = document.createElement('i');
									oli.innerHTML = improvesData.data.abnormalName[i] + '、';
									if(i == improvesData.data.abnormalName.length-1){
										oli.innerHTML = improvesData.data.abnormalName[i];
									};
									$('#listAb').append(oli);
								};
							};

							$('.sy_summary .gojy').attr("href","z_pop.html?reportId="+ myReportId)
						}
					}else{
						//console.log('首页请求getSuggest成功,但数据不正确')
						$('.noSeg').empty();
					}
				},
				error: function(xhr,status){
					console.log("首页请求getSuggest失败" + xhr.status + " " + xhr.statusText);
				}
			});

		}else if(data.code == 402){
			window.location.href="userInfor.html?reportId=" + myReportId+"&userId=" + data.data.userId + "&openId=" + myopenId + "&edition="+edition;
		}else if(data.code == 403){
			window.location.href="supAge.html?reportId=" + myReportId+"&userId=" + data.data.userId + "&openId=" + myopenId + "&edition="+edition;
		}else if(data.code == 302){
			window.location.href="equipmentUnable.html"
		}else{
			console.log('没有解析到新报告,' + data.msg);
			$('.load-overlay').css("display","none");
			$('#error_con').css("display","block");
		}
		
	},
	error: function(xhr,status){
		alert("错误提示： " + xhr.status + " " + xhr.statusText);
	}
});


//弹窗
var win_top = 0;
function showMask(){
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	win_top = $(window).scrollTop();
	$("body").css({"position":"fixed","top":-win_top+"px"});
	/*$("body").on('touchmove',function(e){
		e.preventDefault();//阻止滚动， 妈的 突然不管用了
	});*/
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		/*$("body").off("touchmove");*/
		$("body").css("position","static");
		$(window).scrollTop(win_top);
	});
};
					

function creatMychart(id,arrayY,arrayX,age,msecond){
	setTimeout(function(){
	var myChart = echarts.init(document.getElementById(id));
	option = {
		/*grid:{
			left:'11%', 
			right:'10%'
		},*/
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
