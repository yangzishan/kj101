var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var customerId = getQueryString('userId');
var reportType = getQueryString('reportType');
var saasId = getQueryString('saasId');
var clientType = getQueryString("clientType");
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var edition = 500;
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(!openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
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
setupWebViewJavascriptBridge(function(bridge) {
	//为按钮注册方法
	$(document).on("click","#goToShare",function(){
		//alert('click share');
		bridge.callHandler('goToShare', {'reportId':reportId}, function responseCallback(responseData) {});
	});
})
/*******************************交互逻辑*****************************/
var urlSearch = '';
new Vue({
    el:'#app_501',
    data:{
    	openId:openId,
       "totalScore": '',
       "skinTotalScore": '',
       "inspectDate": '',
       "reportCode": "",
       "ps": "",
       userId:''
    },
    methods:{
        zhuan:function(){
            var  that = this;
            var  w = $(window).width();
            if(w>750){
                w = 750;
            }
            $('.jkbaogao .circle_pro').circleProgress({
                  value: that.totalScore/100,
                  size:w * 0.16 ,
            	    startAngle: Math.PI*1.5,
            	    emptyFill: '#edf6fb',
            	    fill:{
            	    	color: '#f6fbfe',
            	    	image: './img/skin/quan_501.png'
            	    }
            	}).on('circle-animation-progress', function(event, progress) {
            	    $(this).find('em').html(parseInt(that.totalScore * progress));
            	});
            $('#angle1').css("transform","rotate("+ that.totalScore/100*360 +"deg)");      
              // no2
            $('.skin .circle_pro').circleProgress({
                  value: that.skinTotalScore/100,
                  size:w * 0.16 ,
            	    startAngle: Math.PI*1.5,
            	    emptyFill: '#edf6fb',
            	    fill:{
            	    	color: '#f6fbfe',
            	    	image: './img/skin/quan_5011.png'
            	    }
            	}).on('circle-animation-progress', function(event, progress) {
            	    $(this).find('em').html(parseInt(that.skinTotalScore * progress));
            	});
            $('#angle2').css("transform","rotate("+ that.skinTotalScore/100*360 +"deg)");       
        },
        inspectIndex:function(){
            var  that = this;
            $.ajax({
                url: dataUrl + '/api/v5/inspectSkinIndex/inspectIndex2',
                data:{
                    userId:customerId,
                    reportCode: reportId
                },
                type:'POST',
                success:function(res){
                   if(res.code == 200){
                        that.totalScore = res.data.totalScore;
                        that.ps = res.data.ps;
                        that.inspectDate = new Date(res.data.inspectDate).getFullYear() + '-' + that.buWei(parseInt(new Date(res.data.inspectDate).getMonth()+1)) + '-' + that.buWei(new Date(res.data.inspectDate).getDate()) + ' ' + that.buWei(new Date(res.data.inspectDate).getHours()) + ':' + that.buWei(new Date(res.data.inspectDate).getMinutes()) + ':' + that.buWei(new Date(res.data.inspectDate).getSeconds());
                        that.reportCode = res.data.reportCode;
                        that.skinTotalScore = res.data.skinTotalScore;
                        that.totalScore = res.data.totalScore;
                        that.userId = res.data.userId;
                        setTimeout(function(){
                            $('#app_501').css({'display':'block'});
                            $('.loadmore.loading').css({'display':'none'});
                            that.zhuan();
                        },100)
                        urlSearch = '?' + 'reportId=' + reportId+ '&edition=' + edition+'&userId='+ customerId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId;
                   }else if(res.code == 201){
                        location.href = 'payfor501.html?reportId='+reportId+'&openId='+openId+'&userId='+customerId+'&reportType='+reportType+'&edition='+edition+'&sameUser='+res.data.sameUser+'&saasId='+saasId
                   }else{
                   		alert('inspectIndex2 code='+res.code+res.msg)
                   }
                }
            });
        },
        buWei:function(date){
            if(date<10){
                return '0'+date;
            }
            return date;
        },
        checkHistory: function(e){ //历史报告
            location.href = gohistoryUrl
        },
        goSetUp: function(e){ //个人中心
            window.location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + this.userId + '&reportId='+ reportId + '&edition=' + edition+'&saasId='+saasId;
        },
    },
    mounted:function(){
        this.inspectIndex();
    }
});
$('.content').on('click','.list',function(){
    if($(this).hasClass('jkbaogao')){
    	if(reportType == 500){
    		window.location.href = 'report5.html' + urlSearch;
    	}else if(reportType == 501 || reportType == 502){
    		window.location.href = 'report6.html' + urlSearch+'&terminal=app';
    	}
    }else if($(this).hasClass('heart')){
        window.location.href = 'heart.html' + urlSearch;
    }else if($(this).hasClass('loop')){
        window.location.href = 'loop.html' + urlSearch;
    }else if($(this).hasClass('skin')){
        if(reportType == 502 || reportType == 500){
            window.location.href = 'skin_new.html' + urlSearch;
        }else{
            window.location.href = 'skin.html' + urlSearch;
        }
        }
    })
   // 获取url参数方法
   function getQueryString(name) {
        var   result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};