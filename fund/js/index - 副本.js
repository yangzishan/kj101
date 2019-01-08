var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var edition = 100;
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
			reportId: reportId,
			openId: openId,
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
	  		sites: '', //各个系统 firstPages
	  		status: '', //身体状况 otherPages
	  		isPay:'',
		}
	},
	mounted: function(){
		this.analysisReport();
	},
	methods: {
		analysisReport: function(){
			let vm = this;
			$.ajax({
				type: "post",
				url: dataUrl + "/api/v1/reportIndex/analysisReport",
				dataType: "json",
				data:{
					reportId : reportId,
	    			openId : openId
				},
				success: function(res){
					if(res.code == 200){
						vm.getSuggest();
						vm.indexTarget();
					}else if(res.code == 402){
						window.location.href="../userInfor.html?reportId="+reportId+"&userId="+res.data.customerId+"&openId="+openId+"&edition="+edition;
					}else if(res.code == 405){
						window.location.href="../userInfor.html?reportId="+reportId+"&openId="+openId+"&edition="+edition;
					}else if(res.code == 403){
						window.location.href="../supAge.html?reportId="+reportId+"&userId="+res.data.customerId+"&openId="+openId+"&edition="+edition;
					}else if(res.code == 302){
						window.location.href="../equipmentUnable.html"
					}else{
						console.log('没有解析到新报告,' + data.msg);
						$('.load-overlay').css("display","none");
						$('#error_con').css("display","block");
					}
				},
				error: function(){alert('analysisReport error')}
			});
		},
		getSuggest: function(){
			let vm = this;
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
						vm.ps = res.data.ps
						vm.inspectDay = res.data.inspectDay
						vm.normalNum = res.data.abnormal.list1.length
						vm.lightNum = res.data.abnormal.list2.length
						vm.severeNum = res.data.abnormal.list4.length+res.data.abnormal.list3.length
						
						var userName = res.data.userName; //用户名
						if(userName == null){
							userName = '';
						};
						var sexStr = res.data.sexStr; //性别称呼
						var ps = res.data.ps; // 状态
						var inspectDay = res.data.inspectDay; // 提醒天数
						$('#dearName').text(userName+sexStr);
						if(res.data.abnormal.list1){
							$('.normalNum').text(res.data.abnormal.list1.length);
						};
						if(res.data.abnormal.list2){
							$('.lightNum').text(res.data.abnormal.list2.length);
						};
						if(res.data.abnormal.list4 || res.data.abnormal.list3){
							$('.severeNum').text(res.data.abnormal.list4.length+res.data.abnormal.list3.length)
							if(res.data.abnormal.list4.length+res.data.abnormal.list3.length==0){
								$('.midfx').css("display","none");
							};
						};
						//////	
					}else{
						console.log('首页请求getSuggest成功,但数据不正确res.code='+res.code);
					}
				},
				error: function(){alert('getSuggest error')}
			});
		},
		indexTarget: function(){
			let vm = this;
			$.ajax({
				type: "post",
				url: dataUrl + "/api/v3/reportIndex/indexTarget",
				dataType: "json",
				data:{
					reportId : reportId,
					openId : openId
				},
				success: function(res){
					if(res.code == 200){
						var userId = res.data.userId;
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						$("#age").val(res.data.indexPage.age);
						var myapp = new Vue({
							el: '#appOne',
							data: {
								totalScore: res.data.indexPage.totalScore, //全部得分
						   		inspectDate: res.data.indexPage.inspectDate, // 检测日期
						    	ranking: res.data.indexPage.ranking, //排名
						    	age: res.data.indexPage.age,//生理年龄
						  		reportStr: res.data.indexPage.reportStr, //生理年龄字句
						  		firstStr: res.data.indexPage.firstStr, //各个系统生理年龄
						  		sites: res.data.firstPages, //各个系统
						  		status: res.data.otherPages, //身体状况
						  		isPay: res.data.map.isPay
							}
						});
						//首页动画延迟
						setTimeout(function(){
							$('.delayshow').css("visibility","visible");
						},200);
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
						},400);

					    // 十大系统展示
					    $('.xqbaogao .con .lee').on("click",function(event){
					    	var oindex = $(this).parent('.con').index();
					    	sessionStorage.setItem("tenSindex",oindex);
					    	event.stopPropagation();
					    	if($(this).next('dl').css("display") == 'none'){
					    		$('.xqbaogao .con .lec').css("display","none");
								$('.xqbaogao .con .lee .or').addClass('arr');
					    		$(this).nextAll('dl').css("display","block");
					    		$(this).find('.or').removeClass('arr');
					    		sessionStorage.setItem("closeTen","show");
					    	}else{
					    		$(this).nextAll('dl').css("display","none");
					    		$(this).find('.or').addClass('arr');
					    		sessionStorage.setItem("closeTen","noShow");	
					    	};	
					    });
					    $('.xqbaogao .con .lee').each(function(){
					    	if(parseInt($(this).find('font').text())<90){
					    		$(this).addClass('low');
					    	};
					    });
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
					    
					    //三级项指标风险显示样式
					    $('.xqbaogao .con .lec dd .score').each(function(index){
					    	if($(this).val() < 90 && $(this).val() >= 80){
								$(this).parents('dd').addClass('bcolor1');
								$(this).next('.fx').text('轻度风险');
							}else if($(this).val() < 80 && $(this).val() >= 60){
								$(this).parent('dd').addClass('bcolor2');
								$(this).next('.fx').text('中度风险');
							}
					    });
					    //身体状况程度条
						$('.bdy-c2 .li_c').each(function(){
							if($(this).find('label span').text() == '情绪指数'){
								$(this).css("display","none");
								if($(this).find('input').val() == 1){
									$('#emoImg').attr("src","img/em1.jpg");$('#emoTxt').text('快乐');
								}else if($(this).find('input').val() == 2){
									$('#emoImg').attr("src","img/em2.jpg");$('#emoTxt').text('平和');
								}else if($(this).find('input').val() == 3){
									$('#emoImg').attr("src","img/em3.jpg");$('#emoTxt').text('压抑');
								}else if($(this).find('input').val() == 4){
									$('#emoImg').attr("src","img/em4.jpg");$('#emoTxt').text('焦虑');
								}else{
									$('#emoImg').attr("src","img/em5.jpg");$('#emoTxt').text('郁闷');
								}
							};
							var ilev = 6 - ($(this).find('input').val());
							$(this).find('span').find('i:lt('+ilev+')').addClass('on');
						});
					    //酸碱度
					    //$('.bdy-c2 .li_c:last p span').css("display","none");
						//$('.bdy-c2 .li_c:last p em').css("display","inline-block");
					    //指标解读判断跳转  
					    $('#go_det').on("click",function(){
					    	window.location.href = "z_pop.html?reportId="+reportId;
					    });
					    //三级指标跳转判断
					    $('.xqbaogao .con .lec dd').on("click",function(){
					    	window.location.href = 'third.html?reportId='+reportId+'&targetId='+$(this).attr("targetthirdid")+'&userId='+userId
					    });
					    //判断是否显示食谱入口
						var setDate = new Date('2018/09/12 15:30:00'); //设置一个日期，以上线日期为准
						var insDate = new Date(res.data.indexPage.inspectDate.replace(/\-/g, "/"));
						console.log(setDate);
						console.log(insDate);
						if(insDate.getTime() - setDate.getTime() > 0){
							$('#showSp').css("display","block");
							$('#go_sp').on("click",function(){
								window.location.href = "../recipes.html?reportId="+ reportId;
							});
						};
					    
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
						
						//跳转支付页
						$('#gopay').attr("href","payfor.html?reportId=" + reportId + '&openId=' + openId +"&sameUser=" +res.data.map.sameUser+ "&edition="+edition);
						//跳转历史报告页
						$('#checkHistory').attr("href","../reportHistory.html?&userId=" + userId + "&openId=" + openId + '&reportId=' + reportId);
						//跳转用户设置
						$('#goSetUp').attr("href","../personalData.html?&userId=" + userId + '&reportId='+ reportId);
						
						//介绍弹窗
						$('.openpop').on("click",function(){
							event.stopPropagation();
							showMask();
							var ohtml = $(this).next('.poptxt').html();
							$('.tc_sy .bxt').html(ohtml);
							return false;
						});
						
						
						///////
					}else{console.log('indexTarget code='+res.code)}
				},
				error: function(){alert('indexTarget error')}
			});
		},
	}
});

/*$.ajax({
	url : dataUrl + "/api/v1/reportIndex/analysisReport",
	type : "POST",
	dataType : 'json',
	data : {
	    reportId : reportId,
	    openId : openId
	},
	success: function(data){
		if(data.code == 200){
			//getSuggest
			$.ajax({
				url : dataUrl + "/api/v1/reportIndex/getSuggest",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId  
				},
				success:function(res){
					if(res.code == 200){
						var userName = res.data.userName; //用户名
						if(userName == null){
							userName = '';
						};
						var sexStr = res.data.sexStr; //性别称呼
						var ps = res.data.ps; // 状态
						var inspectDay = res.data.inspectDay; // 提醒天数
						$('#dearName').text(userName+sexStr);
						if(res.data.abnormal.list1){
							$('.normalNum').text(res.data.abnormal.list1.length);
						};
						if(res.data.abnormal.list2){
							$('.lightNum').text(res.data.abnormal.list2.length);
						};
						if(res.data.abnormal.list4 || res.data.abnormal.list3){
							$('.severeNum').text(res.data.abnormal.list4.length+res.data.abnormal.list3.length)
							if(res.data.abnormal.list4.length+res.data.abnormal.list3.length==0){
								$('.midfx').css("display","none");
							};
						};
						//////	
					}else{
						console.log('首页请求getSuggest成功,但数据不正确res.code='+res.code);
					}
				},
				error:function(xhr,status){
					console.log("首页请求getSuggest失败" + xhr.status + " " + xhr.statusText);
				}
			});
			
			//indexTarget
			$.ajax({
				url : dataUrl + "/api/v3/reportIndex/indexTarget",
				type : "POST",
				dataType : 'json',
				data : {
			    	reportId : reportId,
					openId : openId
				},
				success : function(res) {
					if(res.code == 200){
						var userId = res.data.userId;
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						$("#age").val(res.data.indexPage.age);
						var myapp = new Vue({
							el: '#appOne',
							data: {
								totalScore: res.data.indexPage.totalScore, //全部得分
						   		inspectDate: res.data.indexPage.inspectDate, // 检测日期
						    	ranking: res.data.indexPage.ranking, //排名
						    	age: res.data.indexPage.age,//生理年龄
						  		reportStr: res.data.indexPage.reportStr, //生理年龄字句
						  		firstStr: res.data.indexPage.firstStr, //各个系统生理年龄
						  		sites: res.data.firstPages, //各个系统
						  		status: res.data.otherPages, //身体状况
						  		isPay: res.data.map.isPay
							}
						});
						//首页动画延迟
						setTimeout(function(){
							$('.delayshow').css("visibility","visible");
						},200);
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
						},400);

					    // 十大系统展示
					    $('.xqbaogao .con .lee').on("click",function(event){
					    	var oindex = $(this).parent('.con').index();
					    	sessionStorage.setItem("tenSindex",oindex);
					    	event.stopPropagation();
					    	if($(this).next('dl').css("display") == 'none'){
					    		$('.xqbaogao .con .lec').css("display","none");
								$('.xqbaogao .con .lee .or').addClass('arr');
					    		$(this).nextAll('dl').css("display","block");
					    		$(this).find('.or').removeClass('arr');
					    		sessionStorage.setItem("closeTen","show");
					    	}else{
					    		$(this).nextAll('dl').css("display","none");
					    		$(this).find('.or').addClass('arr');
					    		sessionStorage.setItem("closeTen","noShow");	
					    	};	
					    });
					    $('.xqbaogao .con .lee').each(function(){
					    	if(parseInt($(this).find('font').text())<90){
					    		$(this).addClass('low');
					    	};
					    });
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
					    
					    //三级项指标风险显示样式
					    $('.xqbaogao .con .lec dd .score').each(function(index){
					    	if($(this).val() < 90 && $(this).val() >= 80){
								$(this).parents('dd').addClass('bcolor1');
								$(this).next('.fx').text('轻度风险');
							}else if($(this).val() < 80 && $(this).val() >= 60){
								$(this).parent('dd').addClass('bcolor2');
								$(this).next('.fx').text('中度风险');
							}
					    });
					    //身体状况程度条
						$('.bdy-c2 .li_c').each(function(){
							if($(this).find('label span').text() == '情绪指数'){
								$(this).css("display","none");
								if($(this).find('input').val() == 1){
									$('#emoImg').attr("src","img/em1.jpg");$('#emoTxt').text('快乐');
								}else if($(this).find('input').val() == 2){
									$('#emoImg').attr("src","img/em2.jpg");$('#emoTxt').text('平和');
								}else if($(this).find('input').val() == 3){
									$('#emoImg').attr("src","img/em3.jpg");$('#emoTxt').text('压抑');
								}else if($(this).find('input').val() == 4){
									$('#emoImg').attr("src","img/em4.jpg");$('#emoTxt').text('焦虑');
								}else{
									$('#emoImg').attr("src","img/em5.jpg");$('#emoTxt').text('郁闷');
								}
							};
							var ilev = 6 - ($(this).find('input').val());
							$(this).find('span').find('i:lt('+ilev+')').addClass('on');
						});
					    //酸碱度
					    //$('.bdy-c2 .li_c:last p span').css("display","none");
						//$('.bdy-c2 .li_c:last p em').css("display","inline-block");
					    //指标解读判断跳转  
					    $('#go_det').on("click",function(){
					    	window.location.href = "z_pop.html?reportId="+reportId;
					    });
					    //三级指标跳转判断
					    $('.xqbaogao .con .lec dd').on("click",function(){
					    	window.location.href = 'third.html?reportId='+reportId+'&targetId='+$(this).attr("targetthirdid")+'&userId='+userId
					    });
					    //判断是否显示食谱入口
						var setDate = new Date('2018/09/12 15:30:00'); //设置一个日期，以上线日期为准
						var insDate = new Date(res.data.indexPage.inspectDate.replace(/\-/g, "/"));
						console.log(setDate);
						console.log(insDate);
						if(insDate.getTime() - setDate.getTime() > 0){
							$('#showSp').css("display","block");
							$('#go_sp').on("click",function(){
								window.location.href = "../recipes.html?reportId="+ reportId;
							});
						};
					    
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
						
						//跳转支付页
						$('#gopay').attr("href","payfor.html?reportId=" + reportId + '&openId=' + openId +"&sameUser=" +res.data.map.sameUser+ "&edition="+edition);
						//跳转历史报告页
						$('#checkHistory').attr("href","../reportHistory.html?&userId=" + userId + "&openId=" + openId + '&reportId=' + reportId);
						//跳转用户设置
						$('#goSetUp').attr("href","../personalData.html?&userId=" + userId + '&reportId='+ reportId);
						
						//介绍弹窗
						$('.openpop').on("click",function(){
							event.stopPropagation();
							showMask();
							var ohtml = $(this).next('.poptxt').html();
							$('.tc_sy .bxt').html(ohtml);
							return false;
						});
						
						
						///////
					}else{console.log('indexTarget code='+res.code)}
				
				},
				error: function(xhr,status){
					console.log("请求首页收据出错" + xhr.status + " " + xhr.statusText)
				}
			});


		}else if(data.code == 402){
			window.location.href="../userInfor.html?reportId="+reportId+"&userId="+data.data.customerId+"&openId="+openId+"&edition="+edition;
		}else if(data.code == 405){
			window.location.href="../userInfor.html?reportId="+reportId+"&openId="+openId+"&edition="+edition;
		}else if(data.code == 403){
			window.location.href="../supAge.html?reportId="+reportId+"&userId="+data.data.customerId+"&openId="+openId+"&edition="+edition;
		}else if(data.code == 302){
			window.location.href="../equipmentUnable.html"
		}else{
			console.log('没有解析到新报告,' + data.msg);
			$('.load-overlay').css("display","none");
			$('#error_con').css("display","block");
		}
	},
	error: function(xhr,status){
		alert("错误提示： " + xhr.status + " " + xhr.statusText);
	}
});*/
	
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
})