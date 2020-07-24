var reportId = (getQueryString('reportId') || 'KJ7022019102100201911416202685');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = (getQueryString("clientType") || ''); 
var bank = (getQueryString('bank') || '');
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var cannsee = (getQueryString('cannsee') || ''); //金管家 jgj
var visible = (getQueryString('visible') || 1);
var localUrl = location.href;

var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
	//alert('now in app');
	if(bank == 'tjnsh'){
		gohistoryUrl = 'reportHistory_tjns.html?customerId='+customerId
	}else{
		gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
	}
};
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var ajaxurl = analysisreport+'/kj702/reportData/createReportData'
var myApp = new Vue({
	el: ".my_view",
	data: function(){
		return {
			reportId: reportId,
			reportType:reportType,
			openId: openId,
			customerId:customerId,
			sameUser:'',
			paymentType:'',
			customerName:'',
			mobile:'',
			sys:'',
			dia:'',
			age:'',
			sex:'',
			ranking:'',
			height:'',
			weight:'',
			userId: customerId,
			metricList:[]
		}
	},
	mounted: function(){
		this.getData();
	},
	methods: {
		getData: function(){ 
			var vm = this;
			$.ajax({
				type:"post",
				url:ajaxurl,
				dataType : 'json',
				data : {
				    reportId : reportId,
					customerId : customerId,
				},
				success: function(res){
					if(res.code == 201){
						alert('需要支付的版本')
					}else if(res.code == 200){
						$('.load-overlay').css("display","none");
						$('.my_view').css("visibility","visible");
						vm.mobile = res.data.mobile
						vm.age = res.data.age
						vm.sex = res.data.sex
						vm.height = res.data.height
						vm.weight = res.data.weight
						vm.customerName = res.data.customerName
						vm.metricList = res.data.metricList
						vm.dia = res.data.dia
						vm.sys = res.data.sys
					}else{
						alert('createReportData code='+res.code+res.msg)
					}
				},
				error: function(){alert('createReportData error')}
			});
		},
		pop: function(e){
			showMask();
			$('.v_overlert .labt').text(e.name)
			$('.v_overlert .bxt2').text(e.metricExplain)
		},
		//介绍弹窗
		popTen: function(e){
			e.stopPropagation;
			showMask();
			$(e.target).parents('.s-inf').next('.v_overlert').css({"visibility":"visible","opacity":"1"});
		},
	
		checkHistory: function(){ //历史报告
			var vm = this;
			zhuge.track('点击历史报告', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = gohistoryUrl
			});
		},
		goSetUp: function(){ //个人中心
			var vm = this;
			zhuge.track('点击个人中心', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + vm.userId + '&reportId='+ reportId+'&saasId='+saasId
			});	
		},
	}
});

//弹窗
var _bodyoffset = '';
function showMask(){
	_bodyoffset = $(window).scrollTop();
	$("body").css({"position":"fixed","top":-_bodyoffset+"px"});
	$("body").css("overflow","hidden");
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	$('.v_overlert').css({"visibility":"visible","opacity":"1"});
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$("body").css("overflow","auto");
		$("body").css("position","static");
		$(window).scrollTop(_bodyoffset);
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
/*******************************交互逻辑*****************************/


