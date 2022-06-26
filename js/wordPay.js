var reportId=getQueryString("reportId");
var reportType = getQueryString("reportType");
var packageId=getQueryString("packageId");
var userId=getQueryString("userId");
var openId=getQueryString("openId");
var saasId=getQueryString("saasId");
var clientType = getQueryString("clientType");
var relationUrl=(getQueryString("relationUrl") || '');

var reqUrl = window.location.href;
var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
	var language = zh;
	var languageStr = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = en;
    var languageStr = 'en';
    document.title = 'Health report'
}else{
	var language = en;
    var languageStr = 'en';
    document.title = 'Health report'
}

var myApp = new Vue({
	el: '.my_view',
	data: function(){
		return{
			reportId: reportId,
			reportType: reportType,
			packageId: packageId,
			userId: userId,
			openId: openId,
			saasId: saasId,
			sign:'',
			timstamp:'',
			language:languageStr
		}
	},
	methods:{
		//爱展业报告数据推送 支付成功后调用
  		azySendReportSaas: function(){
  			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl+"/weiXin/azySendReportSaas",
				dataType:'Json',
				data:{
					saasId:vm.saasId,
					reportId: vm.reportId
				},
				success: function(res){
					if(res.code == "200"){
						console.log('success')
					}
				},
				error: function(){console.log('azySendReportSaas error')}
			});
  			
  		},
		//查看报告来源
		getReportSource: function(){
			var vm = this;
			//vm.azySendReportSaas() //改后台调用 
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/report/getReportSource",
				dataType:'Json',
				data:{
					reportCode: reportId
				},
				success: function(res){
					if(res.code == "200"){
						if(relationUrl){
							location.href = "relationUrl.html?relationUrl="+relationUrl
						}else{
							if(res.data == 5){
								location.href = "jinguanjia.html"
							}else{
								vm.goReport(reportId,'',userId,openId,saasId,'')
							}
						}
					}else{
						alert('getReportSource code='+ res.code)
					}
				},
				error: function(){alert('getReportSource error')}
			});
		},
		goReport: function(report,sendCustom,user,open,saas,language){
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
						var visible = res.data.visible; //是否可查看 0不可查看
						var reportType = res.data.reportType;
						var source = res.data.source; //来源
						var reportSource = res.data.reportSource //来源 （判断金管家 5）
						var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+reportType+'&saasId='+saas+'&clientType='+clientType+'&source='+source+'&reportSource='+reportSource;
						if(visible == 0){
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('.daifu_d').css("display","block");	
							$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请您联系你的业务员');
							$('.daifu_d .tip').remove();
							$('#iknow').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
								$('.daifu_d').css("display","none");
							});
						}else{
							
							if(reportSource == 9){
								location.href = "https://www.zngst.com/code/#/bgGuide"
								return
							}
							
							
							if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
							location.href = 'report120.html'+reportUrl
							}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503){
								location.href = 'report500.html'+reportUrl
							}else if(reportType < 5){
								location.href = 'report5.html'+reportUrl
							}else{
								location.href = 'report'+reportType+'.html'+reportUrl
							}
						}
					}else{
						console.log('analysisReportFace code='+res.code+' msg='+res.msg)
					}
				},
				error: function(){alert('analysisReportFace error')}
			});
		},
		gotoSaoMa: function(){
			var vm = this;
			wx.ready(function() {
			   	wx.scanQRCode({
		            needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		            scanType : ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
		            success : function(res) {
						setTimeout(function(){
							var resultcode = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							//alert(resultcode);
							var codeType = (getParameter(resultcode,"type") || '');
							//alert(codeType);
							
							vm.sign = (getParameter(resultcode,"sign") || '');
							vm.timstamp = (getParameter(resultcode,"timstamp") || '');
							
							
							var passwd_val = (getParameter(resultcode,"passwd_val") || '');
							//alert(passwd_val);
							if(codeType == 2 || codeType == 1 || codeType == 3){
								vm.updateYearWordPay(passwd_val);
							}else if(codeType == 4){  //调杏林 预计8月31号发
								vm.updateXLYearWordPay(passwd_val);
							}else{
								vm.goMethod(resultcode);
							}
						},500)
		            },
					fail:function(result){
						alert('扫码失败,请重试')
					}
		        })
			});
		},
		//点击按钮提交
		gouseBtn: function(e){
			var vm = this;
			$(e.target).attr("disabled",true);
			var mywordNum=$.trim($('#wordNum').val());
			vm.goMethod(mywordNum);
		},
		//微信jssdk扫码用
		wxConfig: function(){
			var vm = this;
			$.ajax({
			    type:"post",
			    url: dataUrl+ "/weiXin/wxConfig",
			    data:{
			    	reqUrl: reqUrl
			    },
			    success:function(result){
			        wx.config({
				        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				        debug: false,
				        // 必填，公众号的唯一标识
				        appId: result.wxParameter.appId,
				        // 必填，生成签名的时间戳
				        timestamp:""+result.wxParameter.timestamp,
				        // 必填，生成签名的随机串
				        nonceStr:result.wxParameter.nonceStr,
				         // 必填，签名，见附录1
				         signature:result.wxParameter.signature,
				         // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				         jsApiList : [ 'checkJsApi', 'scanQRCode' ]
			         });
			      }
			});
			wx.error(function(res) {
			    alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
			});
		},
		//拿到参数执行方法 口令
		goMethod: function(resultdata){
			var vm = this;
			$.ajax({
				url : dataUrl + "/api/v1/cardPay/updateWordPay",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId,//变量reportId替换
				    packageId : packageId,
					userId : userId,
					wordNum: resultdata,
					batchType: 10,
					saasId: saasId,
					openId:openId
				},
				success : function(data) {
					if(data.code == 200){
						if(data.data == "0" || data.data == "true"){
							vm.getReportSource()
							/* zhuge.track('支付成功',{
								'方式': '口令支付'
							},function(){
								vm.getReportSource()
							}); */
						}else{
							setTimeout(function(){$('#subgo').attr("disabled",false)},1000);
							zhuge.track('支付失败',{
								'方式': '口令支付',
								'原因': checkMsg(data.data)
							});
							showMask(checkMsg(data.data));
						}
					}else if(data.code == 300){
						showMask('口令不正确');
						setTimeout(function(){$('#subgo').attr("disabled",false)},1000);
					}else{
						showMask('updateWordPay code=' + data.code);
					}
				},
			    error : function(obj,msg){showMask("updateWordPay error")}
			});
		},
		//卡号支付
		updateYearWordPay: function(resultdata){
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/cardPay/updateYearWordPay",
				dataType : 'json',
				data:{
					reportId: reportId,
					packageId: packageId,
					userId: userId,
					batchType: 20,
					saasId: saasId,
					wordNum: resultdata,
					openId:openId
				},
				success: function(data){
					if(data.code == 200){
						if(data.data == "0" || data.data == "true"){
							vm.getReportSource()
							/* zhuge.track('支付成功',{
								'方式': '口令支付'
							},function(){
								vm.getReportSource()
							}); */
						}else{
							setTimeout(function(){$('#subgo').attr("disabled",false)},1000);
							zhuge.track('支付失败',{
								'方式': '口令支付',
								'原因': checkMsg(data.data)
							});
							showMask(checkMsg(data.data));
						}
					}else if(data.code == 300){
						showMask('口令不正确');
						setTimeout(function(){$('#subgo').attr("disabled",false)},1000);
					}else{
						showMask('updateYearWordPay code=' + data.code);
					}
				},
				error: function(){showMask('updateYearWordPay error')}
			});
		},
		//卡号支付
		updateXLYearWordPay: function(resultdata){
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/cardPay/updateXLYearWordPay",
				dataType : 'json',
				data:{
					reportId: reportId,
					packageId: packageId,
					openId:openId,
					userId: userId,
					batchType: 20,
					saasId: saasId,
					sign:vm.sign,
					timstamp: vm.timstamp,
					wordNum: resultdata,
					
				},
				success: function(data){
					if(data.code == 200){
						if(data.data == "0" || data.data == "true"){
							vm.getReportSource()
							/* zhuge.track('支付成功',{
								'方式': '口令支付'
							},function(){
								vm.getReportSource()
							}); */
						}else{
							setTimeout(function(){$('#subgo').attr("disabled",false)},1000);
							zhuge.track('支付失败',{
								'方式': '口令支付',
								'原因': checkMsg(data.data)
							});
							showMask(checkMsg(data.data));
						}
					}else if(data.code == 300){
						showMask('口令不正确');
						setTimeout(function(){$('#subgo').attr("disabled",false)},1000);
					}else{
						showMask('updateXLYearWordPay code=' + data.code+'--'+data.msg);
					}
				},
				error: function(){showMask('updateXLYearWordPay error')}
			});
		},
		//app扫码
		appscanQRCode:function(){
			var vm = this;
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('QRCode', { 'code':'200' }, function responseCallback(responseData) {});
				// 注册JS方法供OC调用
				bridge.registerHandler('QRCode', function(data, responseCallback) {
					//alert('test_oc');
					//判断iOS和Android
					var u = navigator.userAgent;
					if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
						var obj = eval("("+data+")");			
					} else if (u.indexOf('iPhone') > -1) {//苹果手机
						var obj = eval(data);
					} else if (u.indexOf('Windows Phone') > -1) {//winphone手机
						alert("不支持该手机设备");
					}
					var occode = obj.QRUrl;
					//var responseData = { 'code':'200' }; responseCallback(responseData);
					if (occode != '') {
						//vm.goMethod(occode);
						
						var resultcode = occode; // 
		                //alert(resultcode);
						var codeType = (getParameter(resultcode,"type") || '');
						//alert(codeType);
						var passwd_val = (getParameter(resultcode,"passwd_val") || '');
						//alert(passwd_val);
		                if(codeType == 2){
		                	vm.updateYearWordPay(passwd_val);
		                }else{
		                	vm.goMethod(resultcode);
		                }
					}	
				})
			});
		}
	},
	mounted: function(){
		this.wxConfig();
		if(this.language == 'en' && document.title){
			document.title = 'Password payment'
		}
	}
});



//弹窗 模拟alert
function showMask(msg){ //showMask('msg');
	$('.tc-qx').each(function(){
		var w_height = $(window).height();
		var this_height = $(this).height();
		$(this).css("top",(w_height-this_height)/2.5);
	});
	$('.modal-overlay').css({"visibility":"visible","opacity":"1"});
	$('#alert').css({"visibility":"visible","opacity":"1"});
	$('#alert .pc1').empty().text(msg);
	$('#alert .subBtn').click(function(){closeMask()});
}
function closeMask(){
	$('.modal-overlay').css({"visibility":"hidden","opacity":"0"});
	$('#alert').css({"visibility":"hidden","opacity":"0"});
}

//截取URL 获取
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
//截取str 获取参数
function getParameter(str,name){
    var result = str.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};

var occode = '';
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
/*********************************************************************************/
