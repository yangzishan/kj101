    //动态加载微信JS文件
    const head = document.head;
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
    head.appendChild(script);
    function wxShare(url,title,img,desc,dataUrl){
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.call('showOptionMenu');
        });
        $.ajax({
        	type:"get",
        	url:dataUrl,
        	data:{
        		url:url
					},
					dataType:'JSON',
        	success: function(res){
        		wx.config({
		            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		            appId: res.data.appId, // 必填，公众号的唯一标识
		            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
		            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
		            signature: res.data.signature,// 必填，签名，见附录1
		            url:'',
		            jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		
		        });
		        wx.error(function (res) {
		            alert(res.errMsg);  //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
		        });
		        wx.ready(function () {
		            // 在这里调用 API
		            wx.onMenuShareTimeline({  //例如分享到朋友圈的API
		                title: title, // 分享标题
		                link: url, // 分享链接
		                imgUrl: img, // 分享图标
		                success: function () {
		
		                },
		                cancel: function () {
		                    // 用户取消分享后执行的回调函数
		                }
		            });
		            wx.onMenuShareAppMessage({
		                title: title, // 分享标题
		                desc: desc, // 分享描述
		                link: url, // 分享链接
		                imgUrl: img, // 分享图标
		                type: '', // 分享类型,music、video或link，不填默认为link
		                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		                success: function () {
		
		                },
		                cancel: function () {
		                    // 用户取消分享后执行的回调函数
		                }
		            });
		        });
        	},
        	error: function(){}
        	
        });        
    }