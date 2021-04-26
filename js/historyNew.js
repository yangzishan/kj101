$('.my_view').css("visibility","hidden");
$('.load-overlay').css("display","block");
var userId = getQueryString("userId");
var openId = getQueryString('openId');
var isAgent = getQueryString('isAgent');
var saasId = (getQueryString('saasId') || '');
var reportType = (getQueryString('reportType')=='910'?'910':'');
var clientType = (getQueryString("clientType") || '');
var source = (getQueryString('source') || '');  //解析获得   康浩 khyapp  康加 kjyapp  康加健康：kjjkapp  //app交互返回获得
var resource = getQueryString("resource");  //无用暂留（app端自己写死的值）
var invite = getQueryString("invite");  //邀约历史查看
if(openId == null || openId == undefined){ openId = ''}
//默认查报告历史
var ajaxUrl = '/api/v1/ne/findHistoryReportAll';
if(invite == 'invite'){ //1本人 2邀约
	var historyType = 2 
}else{
	var historyType = 1
}

var myApp = new Vue({
	el:'#appVUE',
	data: function(){
		return{
			source: source,
			resource: resource,
			userId: userId,
			dataList: '',
			invite: invite,
			reportUrl:'',
			reportHistoryVo:{
				customerId: userId,
				companyId: saasId,
				openId: openId,
				reportType: reportType,
				source: source,
				historyType:historyType,
				startTime: "",
				endTime: "",
				deviceGroup: '',
				sort: '2',
				firstPage: 0,
				pageSize: 50,
			},
			sltime :'',
			showOption:false,
		}
	},
	mounted:function(){
		this.findHistoryReportAll();
	},
	methods:{
		handleTime(val){
			this.sltime = val
			var now = new Date()
			var year = now.getFullYear()
			var month = now.getMonth()+1
			var day = now.getDate()
			var hour = now.getHours()
			var minute = now.getMinutes()
			var second = now.getSeconds()
			var nowTimes = now.getTime()
			var nowStr = now.Format("yyyy-MM-dd HH:mm:ss"); 
			console.log(nowStr)
			var beforTime = null
			if(val == 1){
				this.reportHistoryVo.startTime = year+'-'+month+'-'+day+' '+'00:00:00'
				this.reportHistoryVo.endTime = nowStr
			}else if(val == 7){
				beforTime = new Date(nowTimes -(7*24*3600*1000))
				this.reportHistoryVo.startTime = beforTime.Format("yyyy-MM-dd HH:mm:ss"); 
				this.reportHistoryVo.endTime = nowStr
			}else if(val == 30){
				beforTime = new Date(nowTimes -(30*24*3600*1000))
				this.reportHistoryVo.startTime = beforTime.Format("yyyy-MM-dd HH:mm:ss"); 
				this.reportHistoryVo.endTime = nowStr
			}else if(val == 90){
				beforTime = new Date(nowTimes -(90*24*3600*1000))
				this.reportHistoryVo.startTime = beforTime.Format("yyyy-MM-dd HH:mm:ss"); 
				this.reportHistoryVo.endTime = nowStr
			}else if(val == 180){
				beforTime = new Date(nowTimes -(180*24*3600*1000))
				this.reportHistoryVo.startTime = beforTime.Format("yyyy-MM-dd HH:mm:ss"); 
				this.reportHistoryVo.endTime = nowStr
			}else if(val == 0){ //暂时全部 自定义没找到
				this.reportHistoryVo.endTime = ''
				this.reportHistoryVo.startTime = ''
			}else if(val == 'today'){
				this.reportHistoryVo.startTime = year+'-'+month+'-'+day+' '+'00:00:00'
				this.reportHistoryVo.endTime = nowStr
				this.findHistoryReportAll();
			}else if(val == 'week'){
				beforTime = new Date(nowTimes -(7*24*3600*1000))
				this.reportHistoryVo.startTime = beforTime.Format("yyyy-MM-dd HH:mm:ss"); 
				this.reportHistoryVo.endTime = nowStr
				this.findHistoryReportAll();
			}else if(val == 'month'){
				beforTime = new Date(nowTimes -(30*24*3600*1000))
				this.reportHistoryVo.startTime = beforTime.Format("yyyy-MM-dd HH:mm:ss"); 
				this.reportHistoryVo.endTime = nowStr
				this.findHistoryReportAll();
			}
		},
		resetOption(){
			this.sltime = ''
			this.reportHistoryVo.endTime = ''
			this.reportHistoryVo.startTime = ''
			this.reportHistoryVo.deviceGroup = ''
			this.reportHistoryVo.sort = ''
		},
		checkByoption(){
			this.findHistoryReportAll();
			this.closeOption()
		},
		handleOption(){
			this.showOption == true
			$('.choseoHis').addClass('show').removeClass('hide')
			$('.v_overlay').css({"visibility":"visible","opacity":"1"});
		},
		closeOption(){
			this.showOption == false
			$('.choseoHis').addClass('hide').removeClass('show')
			$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		},
		findHistoryReportAll: function(){
			var vm = this;
			$.ajax({
				url : dataUrl + ajaxUrl,
				type : "POST",
				dataType : 'json',
				contentType : 'application/json',
				data : JSON.stringify(vm.reportHistoryVo),
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
						var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+reportType+'&saasId='+saasId+'&clientType='+clientType+'&source='+source+'&cannsee='+cansee+'&invite='+invite;
				
						if(visible == 0){
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('.daifu_d').css("display","block");	
							$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请联系机构管理员查阅健康报告。');
							$('.daifu_d .tip').remove();
							$('#iknow').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
								$('.daifu_d').css("display","none");
								//WeixinJSBridge.call('closeWindow');
								//location.href = 'historyRecord.html?userId='+res.data.customerId+'&openId='+open+'&saasId='+saas;
							});
						}else{
							vm.delayedSendData(report,reportType,reportUrl)
						}		
					}else{
						console.log('analysisReportFace code='+res.code+' msg='+res.msg)
					}
				},
				error: function(){alert('analysisReportFace error')}
			});
		},
		delayedSendData: function(reportId,reportType,reportUrl){
			var vm = this
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/reportIndex/delayedSendData",
				data:{
					reportId: reportId
				},
				dataType:"Json",
				success:function(res){
					if(res.data != null || res.data == ''){
						if(res.data.sendReportType == 0 || res.data.isVisible == 0){
							console.log('提示页')
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('.daifu_d').css("display","block");	
							$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请联系机构管理员查阅健康报告。');
							$('.daifu_d .tip').remove();
							$('#iknow').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
								$('.daifu_d').css("display","none");
								//WeixinJSBridge.call('closeWindow');
								//location.href = 'historyRecord.html?userId='+res.data.customerId+'&openId='+open+'&saasId='+saas;
							});
						}else{
							if(res.data.sendReportType == 1 && res.data.sendStatus != 1){
								console.log('提示页')
								$('.v_overlay').css({"visibility":"visible","opacity":"1"});
								$('.daifu_d').css("display","block");	
								$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请联系机构管理员查阅健康报告。');
								$('.daifu_d .tip').remove();
								$('#iknow').click(function(){
									$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
									$('.daifu_d').css("display","none");
								});
							}else{
								vm.goReportPage(reportType,reportUrl)
							}
						};
					}else{
						vm.goReportPage(reportType,reportUrl)
					}
				},
				error: function(){alert('delayedSendData error')}
			});
		},
		goReportPage: function(reportType,reportUrl){
			var vm = this
			console.log('gobaogao')
			if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
				location.href = 'report120.html'+reportUrl
			}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503 ){
				location.href = 'report500.html'+reportUrl
			}else if(reportType == 711){
				location.href = 'report710.html'+reportUrl
			}else if(reportType < 5){
				location.href = 'report5.html'+reportUrl
			}else{
				location.href = 'report'+reportType+'.html'+reportUrl
			}
		},
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
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
