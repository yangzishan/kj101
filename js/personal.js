$('.my_view').css("visibility","hidden");
$('.load-overlay').css("display","block");
var userId = getQueryString("userId");
var reportType = getQueryString("reportType");
var saasId = getQueryString("saasId");
var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
	var language = zh;
	var languageStr = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = en;
    var languageStr = 'en';
    document.title = 'Personal Center'
}else{
	var language = en;
    var languageStr = 'en';
    document.title = 'Personal Center'
}
if(userId){
	setTimeout(function(){
		getUserInfor(userId,reportType)
	},500)
	$('#userId').val(userId);  //修改生日用
}else{
/*******************************交互逻辑*****************************/
setupWebViewJavascriptBridge(function(bridge) {
	// 注册JS方法供OC调用
	bridge.registerHandler('getUserId', function(data, responseCallback) {
		//判断iOS和Android
		var u = navigator.userAgent;
		if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
			var obj = eval("("+data+")");	
		} else if (u.indexOf('iPhone') > -1) {//苹果手机
			var obj = eval(data);
		} else if (u.indexOf('Windows Phone') > -1) {//winphone手机
			alert("不支持该手机设备");
		}
		var appUserId = obj.userId;
		reportType = obj.reportType;
		//alert('userId='+userId+'& reportType='+reportType);
		$('#userId').val(appUserId);  //修改生日用
		//var responseData = { 'code':'200' };responseCallback(responseData);
		if (appUserId) {
			//alert('app '+appUserId)
			setTimeout(function(){
				getUserInfor(appUserId,reportType);
			},1000)
			
		};
	})
	// 为按钮注册方法
	$(document).on("click","#userImg",function(){
		//alert('hahahha');
		bridge.callHandler('upLoadIco', {'price':'100'}, function responseCallback(responseData) {});
	});
})
/*******************************交互逻辑*****************************/	
}


zhuge.track('进入个人中心页', { //埋点t
	'用户id' : userId,
	'渠道' : '微信'
});

function getUserInfor(userId,type){
	var myapp = new Vue({
		el: '#appVUE',
		data: function(){
			return{
				reportType: type,
				headimgurl: '', //用户头像
			    nickName: '', //用户昵称
			    mobile: '', //手机号
			    sex: '', //性别   1男 2女
			    birthday: '', //生日
			    birthdayStr: '',
			    height: '', //身高
			    weight: '', //体重
			    language: language,
			    userNotice:''
			}
		},
		mounted: function(){
			this.findUserById();
			this.getSaasTenantByCompanyId();
		},
		methods: {
			findUserById: function(){
				var vm = this;
				$.ajax({
					url : dataUrl + "/api/v1/reportUser/findUserById",
					type : "post",
					dataType : 'json',
				    data : {
				    	userId: userId
				    },
					success : function(userData) {
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						console.log(userData)
						vm.headimgurl = userData.data.headimgurl
					    vm.nickName = userData.data.nickName
					    vm.mobile = userData.data.mobile
					    vm.sex = userData.data.sex
					    vm.birthday = userData.data.birthday
					    vm.birthdayStr = userData.data.birthdayStr
					    vm.height = userData.data.height
					    vm.weight = userData.data.weight;
		
						//修改昵称和性别身高体重跳转
						$('#setNickName').attr("href","personal_nickname.html?userId="+userId+'&reportType='+reportType+"&nickName="+vm.nickName);
						$('#setSex').attr("href","personal_sex.html?userId="+userId+"&sex="+vm.sex+'&reportType='+reportType);
						$('#setHeight').attr("href","personal_height.html?userId="+userId+"&height="+vm.height+'&reportType='+reportType);
						$('#setWeight').attr("href","personal_weight.html?userId="+userId+"&weight="+vm.weight+'&reportType='+reportType);
						//体验卡跳转、优惠券跳转
						$('#setCard').attr("href",testHealthUrl+"/tjCard.html?userId="+userId);
						$('#setCoupon').attr("href",testHealthUrl+"/couponList.html?userId="+userId);
//						if($('#mobile .intxt').text() == ''){
//							$('#mobile').attr("href","personal_mobile.html?userId="+userId+"&reportType="+reportType)
//						}
					   	var calendar = new lCalendar();
						calendar.init({
							'trigger': '#demo1',
							'type': 'date'
						});
					    $("#demo1").focus(function(){
					        document.activeElement.blur();
					    });
					    //阅读用户须知弹出
						$('#notice').on("click",function(){
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('#showNotice').css({"visibility":"visible","opacity":"1"});
							$('#showNotice').on("touchmove",function(){
								event.stopPropagation();
							});
							$(document).on('touchmove',function(e){
								e.preventDefault();//阻止滚动
							});
						});
						$('.v_overlert .close').click(function(){
							$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
							$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
							$(document).off("touchmove");
						});
					}
				});
			},
			clickMobile: function(){
				var vm = this
				if(vm.mobile == '' || vm.mobile == null){
					location.href = "personal_mobile.html?userId="+userId+"&reportType="+reportType
				}else{
					console.log('只能修改一次')
				}
				
			},
			getSaasTenantByCompanyId: function(){//查询SaaS信息
				var vm = this;
				$.ajax({
					type:"post",
					url:saasUrl+ "/api/v1/initTenant/getSaasTenantByCompanyId",
					async:true,
					dataType: 'json',
					data: {
						saasId:saasId
					},
					success: function(res){
						if(res.code == 200){
							vm.saasName = res.data.saasName
							vm.saasLogo = res.data.saasLogo
							vm.userNotice = res.data.userNotice
						}
					},
					error: function(){ console.log('getSaasTenantByCompanyId error')}
				});
			}
			
		}
	});
};
	

function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'https://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
};	