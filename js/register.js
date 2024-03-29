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
var saasId = (getQueryString('saasId') || '');
var reportType = getQueryString("reportType");
var userRegisterVer = (getQueryString('userRegisterVer') || '')

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

var myapp = new Vue({
	el: '.my_view',
	data: function(){
		return{
			saasId:saasId,
			reportType: reportType,
			reportType: reportType,
			language: language,
			saasName: '',
			saasLogo:'',
			userNotice:null,
			optionInt:'',//业务员选填
			userRegisterVer:userRegisterVer,
			
			nickName:'',
			age:'',
			idCardNo:'',
			relatedNo:'',
			height:'',
			weight:'',
			mobile:'',
			dxYzm:'',
		}
	},
	methods:{
		//查询SaaS信息
		getSaasTenantByCompanyId: function(){
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
						//vm.saasTel = res.data.saasTel
						vm.language.la_thanksForUse = res.data.saasTel
						vm.saasName = res.data.saasName
						vm.saasLogo = res.data.saasLogo
						vm.userNotice = res.data.userNotice
					}
				},
				error: function(){console.log('getSaasTenantByCompanyId error')}
			});
		},
		//点击发送验证码按钮
		sendMsg: function(){
			var vm = this;
			if(!(/^1[3456789]\d{9}$/.test(vm.mobile))){
				showMask('请输入正确的手机号码');
				return false;
			}else{
				time($("#sendMsg"));
				vm.getCode()
			}
		},
		getCode: function(){
			var vm = this;
			$.ajax({
				url : dataUrl + "/api/v1/messageCode/getCode",
				type : "post",
				dataType : 'json',
				data : {
					userId: userOropen
				},
				success : function(codeData) {
					if(codeData.code == 200){
						vm.kjSendMsg(codeData.data);
					}else{
						showMask('获取短信码失败 getCode code='+codeData.code);
						$("#sendMsg").attr("disabled",false)
					}
				},
				error: function(){
					alert('获取短信码 getCode error'); $("#sendMsg").attr("disabled",false)
				}
			});
		},
		kjSendMsg: function(yzmVal){
			var vm = this;
			var userInfo = {
				mobile : vm.mobile,
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
		},
		todoSub: function(num){
			var vm = this;
			$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
			$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
			if(num == 1){
				var age = parseInt($('#age').val());
				var mobile = $('#mobile').val();
				var dxYzm = $.trim($('#dxYzm').val());
				var checkCode = '';
				if(userId == null || userId == ''){
					creatUser(mobile,age,dxYzm,checkCode)
				}else{
					if(userRegisterVer == 5){
						vm.updateById()
					}else{
						subAll(mobile,age,dxYzm,checkCode)
					}
				};
			}
		},
		//不需要校验手机号的注册
		updateById: function(){
			var vm = this;
			var userInfo = {
				age : vm.age,
				userId : userId,
				height : parseInt($('#_height').val()),
				weight : parseInt($('#_weight').val()),
				nickName : $('#nickName').val(),
				relatedNo : $('#relatedNo').val(),
				idCardNo : $('#identity').val(),
				openId : openId
			}
			$.ajax({
				url : dataUrl + "/api/v1/reportUser/updateById",
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
							location.href="common.html?reportId="+reportId+"&userId="+userId+'&openId='+openId+'&faceUserId='+faceUserId+'&saasId='+saasId
						}	
					}else{
						showMask('登录失败  updateById code='+userData.code);
						//$(this).attr("disabled",false);
					}	
				},
				error : function(){alert('updateById error')}
			});
		},
		showYinsi: function(){
			//location.href = "./notice_ysxy.html"
			$('.v_overlay').css({"visibility":"visible","opacity":"1"});
			$('#showYs').css({"visibility":"visible","opacity":"1"});
		},
		closeYsxy: function(){
			$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
			$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		}
		
	},
	
	computed:{
		ableToNext: function(){
			if(userRegisterVer == 5){
				return (this.nickName && this.age && this.height && this.weight) 
			}else{
				return this.mobile && this.dxYzm
			}
		}
	},
	mounted : function(){
		this.getSaasTenantByCompanyId();
		if(reportType == 122){
			this.optionInt = "（选填）"
		}
	}
});

$('#age').blur(function(){
	setTimeout(function() {	
		const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;  //解决微信浏览器键盘收回页面下不来的问题
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));  //解决微信浏览器键盘收回页面下不来的问题

		var age = parseInt($('#age').val());
		if(age < 18 || age >110 ||  isNaN(age)){
			showMask('请输入18到110之间的有效年龄');
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
$('#identity').blur(function(){});
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
	if(age < 18 || age >110 ||  isNaN(age)){
		showMask('请输入18到110之间的有效年龄');
		return;
	}else{
		$('.v_overlay').css({"visibility":"visible","opacity":"1"});
		$('#showNotice').css({"visibility":"visible","opacity":"1"});
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
					location.href="common.html?reportId="+reportId+"&userId="+userId+'&openId='+openId+'&faceUserId='+faceUserId+'&saasId='+saasId
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
				
				
				showMask('验证码错误');
			}else{
				
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
				
				location.href="common.html?reportId="+reportId+'&openId='+openId+'&faceUserId='+faceUserId+'&saasId='+saasId
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
				
				showMask('验证码错误');
			}else{
				
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
			
			
			window.location.href="couponList.html?userId="+userId+ "&code=" + data.code;
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
			
			window.location.href="couponList.html?userId="+userId+ "&code=" + data.code;
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