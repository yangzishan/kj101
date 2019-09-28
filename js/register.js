var reportId = getQueryString("reportId");
var openId = getQueryString('openId');
var userId = getQueryString("userId"); 
var faceUserId = getQueryString("faceUserId");
var resource = getQueryString("resource");   //暂时不用，用户注册在app里已经完成
var clientType = getQueryString("clientType"); //暂时不用，用户注册在app里已经完成
var userOropen = userId;
if(userId == null || userId == ''){
	userOropen = openId;
};
var edition=getQueryString("edition");  //暂时没用了
var saasId = getQueryString('saasId');
var reportType = getQueryString("reportType");

/*扫码转增优惠券用  带userId*/
var voucherId = getQueryString("voucherId"); //优惠券id
var customerId = getQueryString("customerId"); //转增人id
/*扫码获得优惠券用 带userId*/
var spreadUserId = getQueryString("spreadUserId");  //优惠券发券人ID
var ruleId = getQueryString("ruleId");  //规则ID

var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
	var language = zh;
	var languageStr = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = en;
    var languageStr = 'en';
    document.title = 'Complete the information'
}else{
	var language = en;
    var languageStr = 'en';
    document.title = 'Complete the information'
}

//埋点 t
zhuge.track('进入注册页面', {
	'openId' : openId,
	'渠道' : '微信'
});

var myapp = new Vue({
	el: '.my_view',
	data: function(){
		return{
			reportType: reportType,
			language: language,
			optionInt:'' //业务员选填
		}
	}
});
if(reportType == 122){
	myapp.optionInt = "（选填）"
}

$('#age').blur(function(){
	setTimeout(function() {	
		const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;  //解决微信浏览器键盘收回页面下不来的问题
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));  //解决微信浏览器键盘收回页面下不来的问题

		var age = parseInt($('#age').val());
		if(age < 18 || age >80 ||  isNaN(age)){
			showMask('请输入18到80之间的有效年龄');
			return;
		}
	}, 100);
});
$('#_height').blur(function(){
	if(parseFloat($(this).val())>250 || parseInt($(this).val())<50){
		alert('请输入正确的身高');
		return;
	}
});
$('#_weight').blur(function(){
	if(parseFloat($(this).val())>200 || parseInt($(this).val())<20){
		alert('请输入正确的体重');
		return;
	}
});
$('#identity').blur(function(){
	
});

//点击获取短信验证码
$('#sendMsg').on("click",function(){
	//手机号校验
	var mobile = $('#mobile').val();
	if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
		showMask('请输入正确的手机号码');
		return false;
	}else{
		//$(this).attr("disabled",true);
		time($("#sendMsg"));
		$.ajax({
			url : dataUrl + "/api/v1/messageCode/getCode",
			type : "post",
			dataType : 'json',
	        data : {
	        	userId: userOropen
	        },
			success : function(codeData) {
				if(codeData.code == 200){
					$('#getCode').val(codeData.data);
					getYzm();
				}else{
					showMask('获取短信码失败 getCode code='+codeData.code);
					$("#sendMsg").attr("disabled",false)
				}
			},
			error: function(){
				alert('获取短信码 getCode error'); $("#sendMsg").attr("disabled",false)
			}
		});  
	}	
});

function getYzm(){
	var yzmVal = $('#getCode').val();
	var mobile = $('#mobile').val();
	var userInfo = {
		mobile : mobile,
		code : yzmVal,
		userId : userOropen
	};
	$.ajax({
		url : dataUrl + "/api/v1/messageCode/kjSendMsg",
		type : "post",
		dataType : 'json',
        data : userInfo,
		success : function(userData){
			if(userData.code == 200){
				console.log('发送短信成功');
				//time($("#sendMsg"));
			}else if(userData.code == 300){
				showMask('发送短信验证码失败');
				$("#sendMsg").attr("disabled",false);
			}else{
				showMask('发送短信失败的code ' + userData.code);
				$("#sendMsg").attr("disabled",false);
			}
		},
		error : function(){alert('kjSendMsg error')}
	});
};

$('#dxYzm').on("change focus keyup keypress propertychange oninput",function(){ 
	var dxYzm = $('#dxYzm').val();
	if(dxYzm != ''){
		$('#nextAll').removeClass('off').attr("disabled",false);
	}else{
		$('#nextAll').addClass('off').attr("disabled",true);
	}
});
$('#dxYzm , #mobile, #_height, #_weight').blur(function(){
	setTimeout(function() {	
		const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;  //解决微信浏览器键盘收回页面下不来的问题
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));  //解决微信浏览器键盘收回页面下不来的问题
	}, 100);
});

$('#nextAll').on("click",function(){
	if($('#nickName').length > 0){
		if($('#nickName').val() == ''){
			showMask('请输入您的姓名');	
			return ;
		}
	};
	if($('#_height').length > 0){
		if($('#_height').val() == ''){
			showMask('请输入您的身高');	
			return ;
		}
	};
	if($('#_weight').length > 0){
		if($('#_weight').val() == ''){
			showMask('请输入您的体重');	
			return ;
		}
	};
	if($('#identity').length > 0 && reportType == 12001){
		if($('#identity').val().length == 15 || $('#identity').val().length == 18){
			if($('#identity').val().length == 15 && !(/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/.test($('#identity').val()))){
				alert("您输入的身份证号码不是有效格式 ");
				return;
			}else if($('#identity').val().length == 18 && !(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test($('#identity').val()))){
				alert("您输入的身份证号码不是有效格式");
				return;
			}
		}else{
			alert("您输入的身份证号码不是有效格式");
			return;
		}
	};
	var age = parseInt($('#age').val());
	if(age < 18 || age >80 ||  isNaN(age)){
		showMask('请输入18到80之间的有效年龄');
		return;
	}else{
		$('.v_overlay').css({"visibility":"visible","opacity":"1"});
		$('#showNotice').css({"visibility":"visible","opacity":"1"});
	}
});

$('.tongyifo span').on("click",function(){
	$(this).addClass('on').siblings().removeClass('on');
	var tongyifo = $(this).index();
	if(tongyifo ==0){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
	}else if(tongyifo ==1){	
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});		
		var age = parseInt($('#age').val());
		var mobile = $('#mobile').val();
		var dxYzm = $.trim($('#dxYzm').val());
		var checkCode = '';
		if(userId == null || userId == ''){
			creatUser(mobile,age,dxYzm,checkCode)
		}else{
			subAll(mobile,age,dxYzm,checkCode)
		}
	}
});

//完善用户
function subAll(mobile,age,dxYzm,checkCode){
	var userInfo = {
		mobile : mobile,
		age : age,
		userId : userId,
		height : parseInt($('#_height').val()),
		weight : parseInt($('#_weight').val()),
		nickName : $('#nickName').val(),
		relatedNo : $('#relatedNo').val(),
		idCardNo : $('#identity').val(),
		openId : openId
	}
	$.ajax({
		url : dataUrl + "/api/v1/reportUser/perfectUserInfo?code="+dxYzm+"&checkCode="+checkCode,
		type : "post",
		dataType : 'json',
		contentType : 'application/json',
        data : JSON.stringify(userInfo),
		success : function(userData) {
			console.log('请求完善用户接口');
			if(userData.code == 200){
				//判断是否是通过优惠券扫码过来
				if(voucherId){
					turnCouponByWeChat(mobile) //转增优惠券接口
				}else if(spreadUserId){
					SendCouponByFlushQR(mobile) //扫码得优惠券接口 一码多用
				}else{
					zhuge.identify(mobile, { //埋点 i  实名用户信息
						'用户id': userId,
						'openId': openId
					});
					zhuge.setWxProperties('wxd989a0c91b372901',openId);
					zhuge.track('注册成功', { //埋点 t   完善用户信息注册成功 然后跳转
						'方式': '完善用户信息',
						'用户id': userId,
						'openId': openId,
						'渠道' : '微信'
					},function(){
						location.href="common.html?reportId="+reportId+"&userId="+userId+'&openId='+openId+'&faceUserId='+faceUserId+'&saasId='+saasId
					});
				}	
			}else if(userData.code == 1003){
				showFirm('该手机号已被绑定');
				$('#Firm .psub a').on("click",function(){
					var oindex = $(this).index();
					closeMask();
					if(oindex == 1){ //创建新用户
						subAll(mobile,age,dxYzm,'CNU')
					}else{ //更新用户信息
						subAll(mobile,age,dxYzm,'UOY')
					}
				});		
			}else if(userData.code == 303){
				zhuge.track('注册失败', { //埋点 t 注册失败
					'原因':'验证码错误 code='+userData.code,
					'openId': openId,
					'渠道' : '微信'
				});
				showMask('验证码错误');
			}else{
				zhuge.track('注册失败', { //埋点 t 注册失败
					'原因':'code = '+userData.code,
					'openId': openId,
					'渠道' : '微信'
				});
				showMask('登录失败  perfectUserInfo code='+userData.code);
				//$(this).attr("disabled",false);
			}	
		},
		error : function(){alert('perfectUserInfo error')}
	})
};
//创建用户
function creatUser(mobile,age,dxYzm,checkCode){
	var userInfo = {
		mobile : mobile,
		age : age,
		height : parseInt($('#_height').val()),
		weight : parseInt($('#_weight').val()),
		userName : $('#nickName').val(),
		relatedNo : $('#relatedNo').val(),
		idCardNo : $('#identity').val(),
		openId : openId
	}
	$.ajax({
		url : dataUrl + "/api/v1/reportUser/createUserBySmsCode?code="+dxYzm+"&checkCode="+checkCode,
		type : "post",
		dataType : 'json',
		contentType : 'application/json',
        data : JSON.stringify(userInfo),
		success : function(userData) {
			console.log('请求创建用户接口');
			if(userData.code == 200){
				zhuge.identify(mobile, { //埋点 i  用户信息
					'用户id': userData.customerId, //要拿返回的数据才对
					'openId': openId
				});
				zhuge.setWxProperties('wxd989a0c91b372901',openId);
				zhuge.track('注册成功', { //埋点 t   创建用户 注册成功 然后跳转
					'方式':'创建用户',
					'用户id': userData.customerId, //要拿返回的数据才对
					'openId': openId,
					'渠道' : '微信'
				},function(){
					location.href="common.html?reportId="+reportId+'&openId='+openId+'&faceUserId='+faceUserId+'&saasId='+saasId
				});
			}else if(userData.code == 1003){
				showFirm('该手机号已被绑定');
				$('#Firm .psub a').on("click",function(){
					var oindex = $(this).index();
					closeMask();
					if(oindex == 1){ //创建新用户
						creatUser(mobile,age,dxYzm,'CNU')
					}else{ //更新用户信息
						creatUser(mobile,age,dxYzm,'UOY')
					}
				});	
			}else if(userData.code == 303){
				zhuge.track('注册失败', { //埋点 t 注册失败
					'原因':'验证码错误 code = '+userData.code,
					'openId': openId,
					'渠道' : '微信'
				});
				showMask('验证码错误');
			}else{
				zhuge.track('注册失败', { //埋点 t 注册失败
					'原因':'code = '+userData.code,
					'openId': openId,
					'渠道' : '微信'
				});
				showMask('登录失败  createUserBySmsCode code='+userData.code);
				//$(this).attr("disabled",false);
			}	
		},
		error : function(){alert('createUserBySmsCode error')}
	})
}

//转增优惠券接口
function turnCouponByWeChat(mobile){
	$.ajax({
		url: couponData+ '/vi/send/coupon/turnCouponByWeChat',
		type: "post",
		dataType :'json',
		data : {
		   	voucherId : voucherId,
		   	customerId : customerId,
		   	openId : openId
		},
		success : function(data){
			//埋点 i  通过扫描优惠券注册
			zhuge.identify(mobile, {
				'用户id': userId,
				'openId': openId
			});
			//埋点 t   通过扫描优惠券注册成功 然后跳转
			zhuge.track('注册成功', {
				'方式': '通过扫描优惠券',
				'用户id': userId,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				window.location.href="couponList.html?userId="+userId+ "&code=" + data.code;
			});
		},
		error:function(){alert('turnCouponByWeChat error')}
	});
}

//扫码获得优惠券接口 一码多用
function SendCouponByFlushQR(mobile){
	$.ajax({
		url: couponData+ '/vi/send/coupon/SendCouponByFlushQR',
		type: "post",
		dataType :'json',
		data : {
		   	spreadUserId : spreadUserId,
		   	ruleId : ruleId,
		   	userId : userId
		},
		success : function(data){
			//埋点 i  通过扫描优惠券注册
			zhuge.identify(mobile, {
				'用户id': userId,
				'openId': openId
			});
			//埋点 t 通过扫描优惠券注册成功 然后跳转
			zhuge.track('注册成功', {
				'方式': '通过扫描优惠券',
				'用户id': userId,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				window.location.href="couponList.html?userId="+userId+ "&code=" + data.code;
			});
		},
		error:function(){alert('SendCouponByFlushQR error')}
	});
}

//倒计时读秒
var wait=60;
function time(tm){
	if(wait==0){
		tm.removeAttr("disabled",false);
		tm.text('获取验证码');
		wait=60;
		tm.css({"color":"#1ebeb1","border":"#1ebeb1 solid .02rem"}); //控制样式
	}else{
		tm.css({"color":"#999","border":"#999 solid .02rem"}); //控制样式
		tm.attr("disabled",true);
		tm.text(wait + "秒后重新发送")
		wait--;
		setTimeout(function(){time(tm);},1000);
	}
};

const windowHeightSize = String(document.documentElement.clientHeight || document.body.clientHeight );
if (!(localStorage.getItem('windowHeight'))) {
  localStorage.setItem('windowHeight' , windowHeightSize);
}
const historyWindowHeight = Number(localStorage.getItem('windowHeight'));
console.log('缓存 列表最小高度' + historyWindowHeight);
$('body').css('min-height', historyWindowHeight);



//弹窗 模拟alert
function showMask(msg){
	$('body').css("min-height",historyWindowHeight);
	setTimeout(function(){
		$('.tc-qx').each(function(){
			var w_height = $(window).height();
			var this_height = $(this).height();
			$(this).css("top",(w_height-this_height)/2);
		});
		$('.modal-overlay').css({"visibility":"visible","opacity":"1"});
		$('#alert').css({"visibility":"visible","opacity":"1"});
		$('#alert .pc1').empty().text(msg);
		$('#alert .subBtn').click(function(){closeMask()});
	},20)
	
}//showMask('哈哈哈哈');
function showFirm(msg){
	$('body').css("min-height",historyWindowHeight);
	setTimeout(function(){
		$('.tc-qx').each(function(){
			var w_height = $(window).height();
			var this_height = $(this).height();
			$(this).css("top",(w_height-this_height)/2);
		});
		$('.modal-overlay').css({"visibility":"visible","opacity":"1"});
		$('#Firm').css({"visibility":"visible","opacity":"1"});
		$('#Firm .pc1').empty().text(msg);
	},20)		
}
function closeMask(){
	$('body').css({"position":"static"});
	$('.modal-overlay').css({"visibility":"hidden","opacity":"0"});
	$('.tc-qx').css({"visibility":"hidden","opacity":"0"});
}
//截取URL 获取
function getQueryString(name){
     var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};