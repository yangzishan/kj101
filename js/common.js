var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var customerId = getQueryString('customerId');
var userId = getQueryString('customerId');
var clientType = '';
console.log(reportId);
console.log(openId);
console.log(customerId);
if(openId){
	analysisReport2(reportId,'',openId)
}
if(customerId){
	analysisReport2(reportId,customerId,'')
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
setupWebViewJavascriptBridge(function(bridge) { // 注册JS方法供OC调用
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
		reportType = obj.reportType;
		clientType = obj.clientType;
		customerId = obj.customerId;
		
		alert(reportId+'----'+clientType+'----'+customerId);
		//var responseData = { 'code':'200' }; responseCallback(responseData);  //回调客户端
		if (customerId) {
			setTimeout(function(){
				analysisReport2(reportId,customerId,'')
			},500)
		}	
	})
})
/*******************************交互逻辑*****************************/
function analysisReport2(report,user,open){
	$.ajax({
		type:"post",
		url:dataUrl + "/api/v1/reportIndex/analysisReport2",
		dataType:"json",
		data:{
			reportId: report,
			customerId: user,
			openId: open
		},
		success:function(res){
			if(res.code == 200){
				var reportType = res.data.reportType;
				if(reportType == 121){
					location.href = 'report120.html?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+res.data.reportType
				}else if(reportType == 501){
					location.href = 'report500.html?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+res.data.reportType
				}else{
					location.href = 'report'+res.data.reportType+'.html?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+res.data.reportType
				}
			}else if(res.code == 402){
				location.href="register.html?reportId="+reportId+"&userId="+res.data.customerId+"&openId="+open+"&reportType="+res.data.reportType
			}else if(res.code == 405){
				location.href="register.html?reportId="+reportId+"&openId="+open+"&reportType="+res.data.reportType
			}else if(res.code == 403){
				location.href="supAge.html?reportId="+reportId+"&userId="+res.data.customerId+"&openId="+open+"&reportType="+res.data.reportType
			}else if(res.code == 302){
				window.location.href="equipmentUnable.html"
			}else if(res.code == 2002){
                alert('kj501接口调用失败  analysisReport  code=' + res.code)
            }else if(res.code == 2003){
                alert('kj501调用接口皮肤数据为空  analysisReport  code=' + res.code)
            }else if(res.code == 2004){
                alert('kj501调用接口生物电数据为空  analysisReport  code=' + res.code)
            }else if(res.code == 2005){
                alert('kj501调用接口心电数据为空  analysisReport  code=' + res.code)
            }else if(res.code == 2006){
                alert('kj501调用接口血氧数据为空  analysisReport  code=' + res.code)
            }else{
				console.log('analysisReport code='+ res.code + res.msg);
				alert('analysisReport2 code='+ res.code + res.msg)
				//$('.load-overlay').css("display","none");
				//$('#error_con').css("display","block");
			}
		},
		error: function(){alert('analysisReport error')}
	});
};

//截取url
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};