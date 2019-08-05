//alert(window.location.href);
var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var customerId = getQueryString('customerId');
var userId = getQueryString('customerId');
var faceUserId = getQueryString('faceUserId');
var saasId = getQueryString('saasId');
var source = getQueryString('source'); //来源  例：天津农商行:tjnsh
var kjInviteType = getQueryString("kjInviteType"); //康加邀约类型   暂时不用了
var sendCustomerId = ''
var clientType = '';
var resource = ''; //康浩 khyapp  康加 kjyapp  //康加健康：kjjkapp

console.log(reportId);
console.log(openId);
console.log(customerId);

var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
   var language = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = 'en';
}
console.log(language);

if(openId){
	analysisReportFace(reportId,'',faceUserId,openId,saasId,language);
}else{
	if(source == 'tjnsh'){
		analysisReportFace(reportId,'',customerId,'',saasId,language);
	}else if(kjInviteType){
		if(faceUserId){
			analysisReportFace(reportId,'',faceUserId,'',saasId,language);	
		}else{
			analysisReportFace(reportId,'',customerId,'',saasId,language);	
		}
	}else{
		//analysisReportFace(reportId,customerId,faceUserId,'',saasId,language);	
	}
}


/*******************************交互逻辑*****************************/
setupWebViewJavascriptBridge(function(bridge) { //注册JS方法供OC调用
	bridge.registerHandler('analysisReport', function(data, responseCallback) {
		//alert('test_oc');
		//判断iOS和Android
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
		resource = obj.resource;   
		
		//alert('dataUrl='+dataUrl);
		//alert('reportId='+reportId+'--sendCustomerId='+sendCustomerId+'--customerId='+appCustomerId+'--clientType='+clientType+'--reportType='+reportType+'--resource='+resource);
		//var responseData = { 'code':'200' }; responseCallback(responseData);  //回调客户端
		if(reportId == '000000'){
			location.href = 'report000000.html'
		}else{
			if(appCustomerId) {
				setTimeout(function(){
					analysisReportFace(reportId,sendCustomerId,appCustomerId,'','',language)
				},500)
			}
		}
				
	})
})
/*******************************交互逻辑end***************************/
function analysisReportFace(report,sendCustom,user,open,saas,language){
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
				var source = res.data.source;
				var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+reportType+'&faceUserId='+faceUserId+'&saasId='+saasId+'&clientType='+clientType+'&resource='+resource+'&source='+source;
				if(visible == 0){
					$('.v_overlay').css({"visibility":"visible","opacity":"1"});
					$('.daifu_d').css("display","block");	
					$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请您联系你的业务员');
					$('.daifu_d .tip').remove();
					$('#iknow').click(function(){
						//WeixinJSBridge.call('closeWindow');
						location.href = 'historyRecord.html?userId='+res.data.customerId+'&openId='+open+'&saasId='+saas+'&clientType='+clientType+'&resource='+resource+'&source='+source;
					});
				}else{
					if(reportType == 121 || reportType == 122){
					location.href = 'report120.html'+reportUrl
					}else if(reportType == 501 || reportType == 502 ){
						location.href = 'report500.html'+reportUrl
					}else if(reportType < 5){
						location.href = 'report5.html'+reportUrl
					}else{
						location.href = 'report'+reportType+'.html'+reportUrl
					}
				}

			}else if(res.code == 402){
				var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+res.data.reportType+'&faceUserId='+faceUserId+'&saasId='+saasId+'&clientType='+clientType+'&resource='+resource
				location.href='register.html'+ reportUrl
			}else if(res.code == 405){
				location.href="register.html?reportId="+reportId+"&openId="+open+"&reportType="+res.data.reportType+'&faceUserId='+faceUserId+'&saasId='+saasId+'&clientType='+clientType+'&resource='+resource
			}else if(res.code == 403){
				location.href="supAge.html?reportId="+reportId+"&userId="+res.data.customerId+"&openId="+open+"&reportType="+res.data.reportType+'&faceUserId='+faceUserId+'&clientType='+clientType+'&resource='+resource
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
};

//app交互
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
//截取url
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};