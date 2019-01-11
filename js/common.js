var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var customerId = getQueryString('customerId');
var userId = getQueryString('customerId');
console.log(reportId);
console.log(openId);
console.log(customerId);
if(openId){
	analysisReport2(reportId,'',openId)
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
		alert('test_oc');
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
		customerId = obj.customerId;
		
		alert(reportId+'----'+reportType+'----'+customerId);
		//var responseData = { 'code':'200' }; responseCallback(responseData);  //回调客户端
		if (inspectCode) {
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
			if(data.code == 200){
				var reportType == res.data.reportType;
				if(reportType == 1){
					location.href = dataUrl + '/wxUser/wxUserReport?jumpUrl=uiIndexJsp&reportId=' + report + '&userId=' + user
				}else if(reportType == 2){
					location.href = dataUrl + '/wxUser/wxUserReport?jumpUrl=uiSimpleJsp&reportId=' + report + '&userId=' + user
				}else if(reportType == 5){
					location.href = 'index2.html?reportId=' + report + '&userId=' + user
				}else if(reportType == 6){
					location.href = 'index3.html?reportId=' + item.reportCode + '&userId=' + user
				}else if(reportType == 100){
					location.href = 'index100.html?reportId=' + item.reportCode + '&userId=' + user
				}else if(reportType == 120 || res.data.reportType == 121){
					location.href = 'index120.html?reportId=' + item.reportCode + '&userId=' + user
				}
			}else if(data.code == 402){
				//window.location.href="userInfor.html?reportId=" + reportId+"&userId=" + res.data.customerId + "&openId=" + openId + "&edition="+edition;
			}else if(data.code == 405){
				//window.location.href="userInfor.html?reportId=" + reportId + "&openId=" + openId + "&edition="+edition;
			}else if(data.code == 403){
				//window.location.href="supAge.html?reportId=" + reportId+"&userId=" + res.data.customerId + "&openId=" + openId + "&edition="+edition;
			}else if(data.code == 302){
				//window.location.href="equipmentUnable.html"
			}else{
				console.log('analysisReport code='+ data.code + data.msg);
				$('.load-overlay').css("display","none");
				$('#error_con').css("display","block");
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