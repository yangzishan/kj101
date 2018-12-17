//获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

var saasId = getQueryString('saasId'); //代理商id 

var reportId = getQueryString("reportId");

var openId = getQueryString("openId");

var agentId = getQueryString('agentId');  //代理商id  代理商报告用  康加报告不用

var sameUser = getQueryString("sameUser");

var userId = getQueryString("userId");

var userOropen = userId;
if(userId == null || userId == ''){userOropen = openId};

var edition=getQueryString("edition");
if(edition==null){edition = ''};

var indexUrl = window.location.href;

var packageId=getQueryString("packageId");

var orderNum=getQueryString("orderNum");

var payChannelId=getQueryString("payChannelId");

var payChannelType=getQueryString("payChannelType");  //1微信 7招行一网通
if(payChannelType == 1){
	var payTypeName = '微信支付'
}else if(payChannelType == 7){
	var payTypeName = '一网通支付'
}else{
	var payTypeName = '支付'
};

var tp=getQueryString("tp");  //判断kj201

var myurl = window.location;
var useurl = decodeURI(myurl);
var start =useurl.indexOf('name=');
var stop =useurl.indexOf('&',start);
var myname = useurl.substring(start+5,stop);
var myprice=getQueryString("price");

var targetFirstId=getQueryString("targetFirstId"); //二级页面

var targetId = getQueryString("targetId");  // 三级页面

//个人中心设置
