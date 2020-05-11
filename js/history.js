$('.my_view').css("visibility","hidden");
$('.load-overlay').css("display","block");
var userId = getQueryString("userId");
var openId = getQueryString('openId');
var isAgent = getQueryString('isAgent');
var saasId = getQueryString('saasId');
var reportType = (getQueryString('reportType')=='910'?'910':'');
var clientType = (getQueryString("clientType") || '');
var source = (getQueryString('source') || '');  //解析获得   康浩 khyapp  康加 kjyapp  康加健康：kjjkapp  //app交互返回获得
var resource = getQueryString("resource");  //无用暂留（app端自己写死的值）

if(openId == null || openId == undefined){ openId = ''}

zhuge.track('进入历史列表页', { //埋点t
	'openId' : openId,  
	'渠道' : '微信'
});

var myApp = new Vue({
	el:'#appVUE',
	data: function(){
		return{
			source: source,
			resource: resource,
			userId: userId,
			dataList: ''
		}
	},
	mounted:function(){
		this.historyByUserId();
	},
	methods:{
		historyByUserId: function(){
			var vm = this;
			$.ajax({
				url : dataUrl + "/api/v1/ne/findHistoryReport",
				type : "POST",
				dataType : 'json',
				data : {
				   	customerId : userId,
				   	companyId: saasId,
				   	reportType: reportType,
				    firstPage: '0',
				    pageSize: 50,
				    source: source
				},
				success : function(res) {
					if(res.code == 200){
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						vm.dataList = res.data
						for(var i=0;res.data.length>i;i++){
							res.data[i].mobile = geTel(res.data[i].mobile)
						}
						vm.dataList = res.data
					}else{
						//alert(res.msg+' code='+ res.code)
						//$('.v_overlay').css({"visibility":"visible","opacity":"1"});
						$('.daifu_d').css("display","block");
						$('.daifu_d .tip').remove();
						$('.daifu_d .dbtn').remove();
						$('.daifu_d .tit').text('暂未查询到历史数据');
					}
				},
				error : function(obj,msg){alert('findHistoryReport error')}
			});
		},
		gotosee: function(e,item){
			var vm = this;
			vm.analysisReportFace(item.inspectId,'',vm.userId,item.openId,saasId,'',item.reportSource)
		},
		analysisReportFace: function(report,sendCustom,user,open,saas,language,reportSource){
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
						var cansee = (reportSource == 5?'jgj':'');  //判断金管家 reportSource=5 
						var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+reportType+'&saasId='+saasId+'&clientType='+clientType+'&source='+source+'&cannsee='+cansee;
						if(visible == 0){
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('.daifu_d').css("display","block");	
							$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请您联系你的业务员');
							$('.daifu_d .tip').remove();
							$('#iknow').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
								$('.daifu_d').css("display","none");
								//WeixinJSBridge.call('closeWindow');
								//location.href = 'historyRecord.html?userId='+res.data.customerId+'&openId='+open+'&saasId='+saas;
							});
						}else{
							if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
								location.href = 'report120.html'+reportUrl
							}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505){
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
		}
	}
});
//截取URL 获取
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
//隐藏手机号
function geTel(tel){
    var reg = /^(\d{3})\d{4}(\d{4})$/;  
    return tel.replace(reg, "$1****$2");
}