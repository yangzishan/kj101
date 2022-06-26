var openId = getQueryString('openId');
var saasId = getQueryString('saasId');
var deviceSn = getQueryString('deviceSn');
var jumpUrl = getQueryString('jumpUrl');
var userRegisterVer = getQueryString('userRegisterVer')
var unlockVersion = getQueryString('unlockVersion') //新加参数 问嘉伟 2021 06 10
// 判断
//if(saasId == 218051 || saasId == 216549){
//	window.location.href = './unlock1.html?openId='+openId+'&saasId='+saasId+'&deviceSn='+deviceSn+'&jumpUrl='+jumpUrl
//}

var info = {
	openId: openId,saasId: saasId,deviceSn: deviceSn,jumpUrl: jumpUrl	
}

var myApp = new Vue({
	el: '#vm',
	data: function(){
		return{
			openId: openId,saasId: saasId,deviceSn: deviceSn,jumpUrl: jumpUrl
		}
	},
	methods: {
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
						if(res.data.isSupportInvite == 1){
							window.location.href = './unlock1.html?openId='+openId+'&saasId='+saasId+'&deviceSn='+deviceSn+'&jumpUrl='+jumpUrl+'&userRegisterVer='+userRegisterVer
						}else{
							// if(userRegisterVer == 4){
							// 	window.location.href = './unlockXgy.html?openId='+openId+'&saasId='+saasId+'&deviceSn='+deviceSn+'&jumpUrl='+jumpUrl+'&userRegisterVer='+userRegisterVer
							// }
						}
					}
				},
				error: function(){console.log('getSaasTenantByCompanyId error')}
			});
		},
		unlock: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: saasUrl+ "/api/v1/ne/neUnlock",
				dataType: 'json',
				contentType : 'application/json',
				data : JSON.stringify(info),
				success: function(res){
					console.log('success')
					if(res == 40010){
						alert('该链接已失效，请扫码重试！')
					}else if(res == 40053){
						alert('设备已过期或次数已使用完')
					}else{
						WeixinJSBridge.call('closeWindow');
					}
					
				},
				error: function(){alert('unlock error')}
				
			});
		}
	},
	mounted: function(){
		if(unlockVersion == 2){
			window.location.href = 'unlock_yy.html'
		}else if(userRegisterVer == 4){
				window.location.href = './unlockXgy.html?openId='+openId+'&saasId='+saasId+'&deviceSn='+deviceSn+'&jumpUrl='+jumpUrl+'&userRegisterVer='+userRegisterVer
		}else{
			this.getSaasTenantByCompanyId()
		}

	}
});

	
//获取url参数
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}