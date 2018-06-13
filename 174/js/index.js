//截取URL 获取reportId
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
var myReportId = GetQueryString('reportId');
var myopenId = GetQueryString('openId');

$('.my_view').css("display","none");
$('.load-overlay').css("display","block");

//模拟滚动条效果
function touchScroll(id) {
	var el = document.getElementById(id);
	var scrollStartPos = 0;
	document.getElementById(id).addEventListener("touchstart",
		function(event) {
			scrollStartPos = this.scrollTop + event.touches[0].pageY;
			//event.preventDefault();
		},false);
	document.getElementById(id).addEventListener("touchmove",
		function(event) {
			this.scrollTop = scrollStartPos - event.touches[0].pageY;
			//event.preventDefault();
		},false);	
}

$.ajax({
	url : dataUrl + "/api/v1/reportIndex/analysisReport",
	type : "POST",
	dataType : 'json',
	data : {
	    reportId : myReportId,  //替换变量 myReportId
	    openId : myopenId
	},
	success: function(data){
		if(data.code == 200){
			$.ajax({
			url : dataUrl + "/api/v1/reportIndex/indexAll",
			type : "POST",
			dataType : 'json',
			data : {
			    reportId : myReportId,  //替换变量 myReportId
				openId : myopenId
			},
			success : function(indexData) {
				//alert('you get it')
				if(indexData.code == 201){
					var sameUser = indexData.data.sameUser;
					var paymentType = indexData.data.paymentType;
					var agentId = indexData.data.agentId;

					if(paymentType == 1){
						window.location.href="../../agent/payforOld.html?reportId=" + myReportId + '&openId=' + myopenId + "&sameUser=" + sameUser+"&agentId=" + agentId;
					}else if(paymentType == 2){
						window.location.href="../../agent/payfor.html?reportId=" + myReportId + '&openId=' + myopenId + "&sameUser=" + sameUser+"&agentId=" + agentId;
					};
				}else if(indexData.code == 200){
					var userId = indexData.data.userId;
					$('.my_view').css("display","block");
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
				            return 'second.html?reportId='+myReportId+'&userId='+userId+ '&targetFirstId=' + val 
				       	}
					  }
					  
					});
					//总得分环形进度效果
					var score = indexData.data.indexPage.totalScore;
					$('.circle').circleProgress({
					    value: score/100,
					    size: 140,
					    thickness: 5,
					    lineCap: 'round',
					    startAngle: Math.PI*1.5,
					    //fill: { gradient: ["#fff", "#fff"] }
					}).on('circle-animation-progress', function(event, progress) {
					    $(this).find('strong').html(parseInt(score * progress));
					    $(this).find('i').html('总分');
				
					});
					//判断多少天复测
					/*if(score <= 86){
						$('#sugDay').text(7);
					}else if(score >= 87 && score <= 89){
						$('#sugDay').text(10);
					}else if(score >= 90 && score <= 91){
						$('#sugDay').text(15);
					}else if(score >= 92){
						$('#sugDay').text(20);
					}*/
					//判断生理年龄和排名没有的情况
					  if(indexData.data.indexPage.ranking == 0){
					  	$('.srhRank').empty();
					  };
					  if(indexData.data.indexPage.reportStr == ''){
					  	$('.slnl_d').remove();
					  	$('.srhAge').empty();
					  	$('.slhide').remove();
					  }

					//index_tab切换
					$('.index_tab span').on("click",function(){
						$(this).addClass('on').siblings().removeClass('on');
						$('.indexShow').eq($(this).index()).css("display","block").siblings('.indexShow').css("display","none");
					});

					//系统介绍弹窗
					function showMask(){
						$('.v_overlay').css({"visibility":"visible","opacity":"1"});
						$(document).on('touchmove',function(e){
							e.preventDefault();//阻止滚动
						})
					}
					$('.zhibiao_c .c_li .pop').on("click",function(event){
						event.stopPropagation();
						showMask();
						$(this).next('.v_overlert').css({"visibility":"visible","opacity":"1"});
						return false;
					});
					$('.zhuangk_c .c_li .pop').on("click",function(event){
						event.stopPropagation();
						showMask();
						$(this).next('.v_overlert').css({"visibility":"visible","opacity":"1"});
						return false;
					});
					$('#notice').click(function(){
						showMask();
						event.stopPropagation();
						$('body').css("position","fixed")
						$('#showNotice').css({"visibility":"visible","opacity":"1"});
						$('#showNotice').on("touchmove",function(){
							event.stopPropagation();
						})
						//touchScroll('showNotice');
						//alert(2)
					});
					$('.v_overlay,.v_overlert .close').click(function(){
						$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
						$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
						$(document).off("touchmove");
						$('body').css("position","static");
					});
					
					
					//第一个系统不显示
					$('.zhibiao_c .c_li:first').css("display","none");
					//身体状况程度条
					$('.zhuangk_c .c_li').each(function(){
						var ilev = 6 - parseInt($(this).find('.lev').text());
						$(this).find('.sta').find('i:lt('+ilev+')').addClass('on');
					})
					//酸碱度
					$('.zhuangk_c .c_li:last .sta').css("display","none");
					$('.zhuangk_c .c_li:last .sta2').css("display","inline-block");
					
					//跳转历史报告
					var userId = indexData.data.userId;
					$('#checkHistory').attr("href",dataUrl + "/wxUser/wxUserReport?jumpUrl=uiHistory&userId=" + userId + "&openId=" + myopenId + '&reportId=' + myReportId);
					//$('#checkHistory').attr("href","reportHistory.html?&userId=" + userId + "&openId=" + myopenId + '&reportId=' + myReportId);
					
					//跳转用户设置
					$('#goSetUp').attr("href",dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + userId + '&reportId='+ myReportId);
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
							//重度异常
							if(improvesData.data.abnormal.list4.length == 0 || improvesData.data.abnormal.list4 == null){
								$('.list4').css("display","none");
							}else{
								for(var i=0;i<improvesData.data.abnormal.list4.length;i++){
									var oli = document.createElement('i');
									oli.innerHTML = improvesData.data.abnormal.list4[i] + '、';
									if(i == improvesData.data.abnormal.list4.length-1){
										oli.innerHTML = improvesData.data.abnormal.list4[i];
									};
									$('#list4').append(oli);
								};
							};
							//中度异常	
							if(improvesData.data.abnormal.list3.length == 0 || improvesData.data.abnormal.list3 == null){
								$('.list3').css("display","none");
							}else{
								for(var i=0;i<improvesData.data.abnormal.list3.length;i++){
									var oli = document.createElement('i');
									oli.innerHTML = improvesData.data.abnormal.list3[i] + '、';
									if(i == improvesData.data.abnormal.list3.length-1){
										oli.innerHTML = improvesData.data.abnormal.list3[i];
									};
									$('#list3').append(oli);
								};
							};
							//重度中度都没有的情况
							if(improvesData.data.abnormal.list3.length == 0 && improvesData.data.abnormal.list4.length == 0){
								$('#segTwo').html('2、本次检测您有'+improvesData.data.abnormal.list2.length+'项为轻度异常。希望能够引起您的关注；')
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
								
							
							
							$('.sy_summary .sstxt .inpv').attr("href","proposal.html?reportId="+ myReportId)
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
			window.location.href="userInfor.html?reportId=" + myReportId+"&userId=" + data.data.userId + "&openId=" + myopenId;
		}else if(data.code == 403){
			window.location.href="supAge.html?reportId=" + myReportId+"&userId=" + data.data.userId + "&openId=" + myopenId + "&edition=";
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

			
    	