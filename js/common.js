//history.pushState(null, null, document.URL); //禁止网页返回上一页
window.addEventListener('popstate', function() { 
	
	/* wx.miniProgram.navigateTo({
	  url: '/packageMake/assessment/reportList'
	}); */
	
	
	WeixinJSBridge.call('closeWindow');
	
	//wx.miniProgram.navigateBack({})
	
	//alert('执行！')
	//window.history.back(-1); 
	//window.history.go(-1);
});
//alert(window.location.href);
var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var customerId = getQueryString('customerId');
var userId = getQueryString('customerId');
var faceUserId = getQueryString('faceUserId');
var saasId = getQueryString('saasId');
var source = getQueryString('source'); //来源  例：天津农商行:tjnsh 。解析接口增加字段
var kjInviteType = getQueryString("kjInviteType"); //康加邀约类型   暂时不用了
//var cannsee = (getQueryString('cannsee') || ''); //从第三方app点击查看报告带过来  cannsee(midPage) = zng 志农谷 如果不为空（代表已经支付过 从引导页过来）正常看报告，
var middlePage = (getQueryString('middlePage') || '');//从第三方app点击查看报告带过来  cannsee(midPage) = zng 志农谷 如果不为空（代表已经支付过 从引导页过来）正常看报告，
var sendCustomerId = ''
var clientType = '';
var resource = ''; //来接受app交互传递的数据（app自己写死的值）， 康浩 khyapp  康加 kjyapp  康加健康：kjjkapp  ···

var shareUrl = getQueryString("shareUrl") || '';  //从企业微信打开的 // == 1； 是否显示复制链接按钮（用在企业微信）==2 不显示历史按钮
console.log(reportId);
console.log(customerId);
var userRegisterVer = (getQueryString('userRegisterVer') || '')
var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
   var language = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = 'en';
}else{
	var language = 'zh';
}
console.log(language);
//alert(language)


var app = new Vue({
	el:'#vm',
	data:function(){
		return{
			reportId:reportId,
			openId:openId,
			customerId:customerId,userId:userId,faceUserId:faceUserId,
			reportUrl:'',
			reportType:'',
			source:'',
			seeReport: false, //iframe
			frameSrc: ''
		}
	},
	methods:{
		todosomething:function(){
			console.log('todo')
			var vm = this
			if(openId){
				if(kjInviteType == 'wxyy'){
					if(faceUserId){
						vm.analysisReportFace(reportId,customerId,faceUserId,'',saasId,language);
					}else{
						vm.analysisReportFace(reportId,customerId,customerId,'',saasId,language);
					}	
				}else{
					vm.analysisReportFace(reportId,'',faceUserId,openId,saasId,language);
				}	
			}else{
				if(source == 'tjnsh'){
					vm.analysisReportFace(reportId,'',customerId,'',saasId,language);
				}else if(kjInviteType){
					if(kjInviteType == 'wxyy'){
						vm.analysisReportFace(reportId,customerId,customerId,'',saasId,language);
					}else{
						if(faceUserId){
							vm.analysisReportFace(reportId,'',faceUserId,'',saasId,language);	
						}else{
							vm.analysisReportFace(reportId,'',customerId,'',saasId,language);	
						}
					}	
				}else if(customerId){
					vm.analysisReportFace(reportId,'',customerId,'',saasId,language);	
				}
			};
			/*******************************交互逻辑*****************************/
			/* setupWebViewJavascriptBridge(function(bridge) { //注册JS方法供OC调用
				bridge.registerHandler('analysisReport', function(data, responseCallback) {
					//alert('test_oc'); //判断iOS和Android
					var u = navigator.userAgent;
					//alert('u='+u);
					if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
						var obj = eval("("+data+")");
					}else if(u.indexOf('iPhone') > -1){//苹果手机
						var obj = eval(data);
					}else if(u.indexOf('Windows Phone') > -1){//winphone手机
						alert("不支持该手机设备");
					}
			
					reportId = obj.reportId;
					var versionCode = obj.reportId;
					if(versionCode){
						sendCustomerId = obj.sendCustomerId;  
						var appCustomerId = obj.customerId;
					}else{
						sendCustomerId = obj.customerId;  
						var appCustomerId = obj.sendCustomerId;	
					};
					clientType = obj.clientType;  //app
					var reportType = obj.reportType;
					resource = obj.resource; //康浩 khyapp  康加 kjyapp  //康加健康：kjjkapp  （app自己写死的值）
					
					//alert('dataUrl='+dataUrl);
					//alert('reportId='+reportId+'--sendCustomerId='+sendCustomerId+'--customerId='+appCustomerId+'--clientType='+clientType+'--reportType='+reportType+'--source='+source);
					//var responseData = { 'code':'200' }; responseCallback(responseData);  //回调客户端
					if(reportId == '000000'){
						location.href = 'report000000.html'
					}else{
						if(appCustomerId) {
							setTimeout(function(){
								vm.analysisReportFace(reportId,sendCustomerId,appCustomerId,'','',language)
							},500)
						}
					}		
				})
			}) */
		},
		delayedSendData: function(){
			var vm = this
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/reportIndex/delayedSendData",
				data:{
					reportId: reportId
				},
				dataType:"Json",
				success:function(res){
					if(res.data != null || res.data == ''){
						if(res.data.sendReportType == 0 || res.data.isVisible == 0){
							console.log('提示页')
							$('.daifu_d').css("display","block")
							$('.load-overlay').css("display","none")
						}else{
							/*if(res.data.sendReportType == 1 && res.data.sendStatus != 1){
								console.log('提示页')
								$('.daifu_d').css("display","block")
								$('.load-overlay').css("display","none")
							}else{
								vm.goReportPage(vm.reportType)
							}*/
							vm.goReportPage(vm.reportType)
							
						};
					}else{
						vm.goReportPage(vm.reportType)
					}
				},
				error: function(){alert('delayedSendData error')}
			});
		},
		analysisReportFace: function(report,sendCustom,user,open,saas,language){
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl + "/api/v1/reportIndex/analysisReportFace",
				dataType:"json",
				data:{
					reportId: report,
					sendCustomerId: sendCustom,
					customerId: user,
					openId: open,
					saasId: saas,
					language: language
				},
				success:function(res){
					if(res.code == 200){
						var visible = res.data.visible;
						var reportType = res.data.reportType;
						vm.reportType = res.data.reportType;
						var source = res.data.source; // 来源
						vm.source = res.data.source; // 来源
						var reportSource = res.data.reportSource //来源 （判断金管家 5）
						vm.reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+openId+"&reportType="+reportType+'&faceUserId='+faceUserId+'&saasId='+saasId+'&clientType='+clientType+'&resource='+resource+'&source='+source+'&reportSource='+reportSource+'&visible='+visible+'&date='+new Date().getTime()+'&language='+res.data.language+'&shareUrl='+shareUrl
						if(reportSource == 9 && middlePage ==''){
							location.href = "https://www.zngst.com/code/#/bgGuide"
							return
						}
						/*if(visible == 0){
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('.daifu_d').css("display","block");	
							$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请您联系你的业务员');
							$('.daifu_d .tip').remove();
							$('#iknow').click(function(){
								//WeixinJSBridge.call('closeWindow');
								location.href = 'historyRecord.html?userId='+res.data.customerId+'&openId='+open+'&saasId='+saas+'&clientType='+clientType+'&resource='+resource+'&source='+source;
							});
						}else{}*/
						vm.delayedSendData()
						
					}else if(res.code == 201){
						vm.goPayforPage(res.data.reportType,res.data.customerId, res.data.paymentType)
					}else if(res.code == 402){
						var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+res.data.reportType+'&faceUserId='+faceUserId+'&saasId='+saasId+'&clientType='+clientType+'&resource='+resource+'&userRegisterVer='+userRegisterVer
						location.href='register.html'+ reportUrl
					}else if(res.code == 405){
						location.href="register.html?reportId="+reportId+"&openId="+open+"&reportType="+res.data.reportType+'&faceUserId='+faceUserId+'&saasId='+saasId+'&clientType='+clientType+'&resource='+resource+'&userRegisterVer='+userRegisterVer
					}else if(res.code == 403){
						location.href="supAge.html?reportId="+reportId+"&userId="+res.data.customerId+"&openId="+open+"&reportType="+res.data.reportType+'&faceUserId='+faceUserId+'&clientType='+clientType+'&resource='+resource+'&userRegisterVer='+userRegisterVer
					}else if(res.code == 302){
						location.href="equipmentUnable.html"
					}else if(res.code == 2002){
		                alert('kj501接口调用失败  analysisReportFace  code=' + res.code)
		            }else if(res.code == 2003){
		                alert('kj501调用接口皮肤数据为空  analysisReportFace  code=' + res.code)
		            }else if(res.code == 2004){
		                alert('kj501调用接口生物电数据为空  analysisReportFace  code=' + res.code)
		            }else if(res.code == 2005){
		                alert('kj501调用接口心电数据为空  analysisReportFace  code=' + res.code)
		            }else if(res.code == 2006){
		                alert('kj501调用接口血氧数据为空  analysisReportFace  code=' + res.code)
		            }else{
						//console.log('analysisReportFace code='+res.code+' '+res.msg)
						alert('analysisReportFace code='+res.code+' '+res.msg)
					}
				},
				error: function(){alert('analysisReportFace error')}
			});
			///
		},
		goReportPage: function(reportType){
			var vm = this
			console.log('gobaogao')
			if(kjInviteType == 'wxyy'){
				vm.reportUrl = vm.reportUrl+'&invite='+'invite'
			}
			if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
				location.href = 'report120.html'+vm.reportUrl
			}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503 ){
				location.href = 'report500.html'+vm.reportUrl
			}else if(reportType < 5){
				location.href = 'report5.html'+vm.reportUrl
			}else if(reportType == 711){
				location.href = 'report710.html'+vm.reportUrl
			}else{
				//location.href = 'report'+reportType+'.html'+vm.reportUrl
				/* vm.seeReport = true;
				vm.frameSrc = 'report'+reportType+'.html'+vm.reportUrl
				$('.load-overlay').css("display","none") */
				
				location.replace('./report'+reportType+'.html'+vm.reportUrl)
			}
		},
		goPayforPage: function(reportType,customerId,paymentType){
			
			var payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType;
			if(reportType == 6){
				if(language == 'en'){
					location.href = 'pay_en.html'+payStr
				}else{
					location.href = 'payfor3.0.html'+payStr
				}
			}else if(reportType == 202){
				location.href="payfor202.html"+payStr	
			}else if(reportType == 130 || (reportType>=500 && reportType<510)){
				location.href = 'payfor501.html'+payStr
			}else if(reportType == 400){
				location.href = 'payfor400.html'+payStr
			}else{  // 5,120,151,124
				if(paymentType == 3){
					location.href="pay_byuser.html"+payStr
				}else if(paymentType == 4){
					location.href="pay_type4.html"+payStr
				}else if(paymentType == 2){
					location.href="pay_coupon.html"+payStr
				}else if(paymentType == 5){
					location.href="pay980.html"+payStr
				}else if(paymentType == 6){
					location.href="payfor701.html"+payStr
				}else{
					location.href="payfor.html"+payStr
				}
			}
		}
		
	},
	mounted:function(){
		this.todosomething()
	}
});

//app交互
function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__bridge_loaded__';
	//WVJBIframe.src = 'https://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}
//截取url
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};