$(function(){
	setTimeout(function(){
		init();
	},1000)
	//alert(location.href.split('#')[0]);
})

function init(){
	var appId = $("#appId").val();
	var timestamp = $("#timestamp").val();
	var nonceStr = $("#nonceStr").val();
	var age = $("#age").val();
	//var share = $("#share").val();
	var signature = $("#signature").val();
	
	wx.config({  
	    debug: false,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: appId, // 必填，公众号的唯一标识
	    timestamp: timestamp, // 必填，生成签名的时间戳
	    nonceStr: nonceStr, // 必填，生成签名的随机串
	    signature: signature,// 必填，签名，见附录1
	    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 功能列表，我们要使用JS-SDK的什么功能  
	});  
	
	// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在 页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready 函数中。  
	wx.ready(function(){
		
		var basePath = testHealthUrl + "/share2.html?reportId="+ myReportId + "&openId=" + myopenId + "&edition="+edition;

		var titleShare = "生理年龄";
		if (age != null && age != "" && age != "undefined" && age != 0) {
			titleShare = "我的生理年龄是"+age+"岁";
		}
		var descShare = "健康报告生理年龄";
		var linkShare = basePath;//这里是跳转路径
		var imgUrlShare = shareImgUrl + "/12312312311231231/20170908/35409651-636a-4b36-9db0-ead2266d9891.png"; 
		
		// 获取"分享到朋友圈"按钮点击状态及自定义分享内容接口  
	    wx.onMenuShareTimeline({  
	        title: titleShare, // 分享标题  
	        link: linkShare,  
	        imgUrl: imgUrlShare // 分享图标  
	    });
	    
	 // 获取"分享给朋友"按钮点击状态及自定义分享内容接口  
	    wx.onMenuShareAppMessage({  
	        title: titleShare, // 分享标题  
	        desc: descShare, // 分享描述  
	        link: linkShare,  
	        imgUrl: imgUrlShare, // 分享图标  
	        type: 'link' // 分享类型,music、video或link，不填默认为link  
	    });  
	      
	    //获取"分享到QQ"按钮点击状态及自定义分享内容接口  
	    wx.onMenuShareQQ({  
		    title: titleShare, // 分享标题  
		    desc: descShare, // 分享描述  
		    link: linkShare, // 分享链接  
		    imgUrl: imgUrlShare // 分享图标  
	    });  
	      
	    //获取"分享到QQ空间"按钮点击状态及自定义分享内容接口  
	    wx.onMenuShareQZone({  
		    title: titleShare, // 分享标题  
		    desc: descShare, // 分享描述  
		    link: linkShare, // 分享链接  
		    imgUrl: imgUrlShare // 分享图标  
	    });
	});  
}
