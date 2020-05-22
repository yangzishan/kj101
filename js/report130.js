$('.my_view').css("display","none");
$('.load-overlay').css("display","block");
var reportId = getQueryString('reportId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = getQueryString("clientType");
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var invite = getQueryString("invite");  //邀约历史查看
var localUrl = location.href;
var reportPrintUrl = testHealthUrl+'/print/print130_kh2.html?viewType=2&reportId=';
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&source=khyapp'+'&resource='+resource+'&clientType='+clientType+'&source='+source
};

var myApp = new Vue({
	el: '.my_view',
	data: function(){
		return{
			invite:invite,
			reportId:reportId,openId:openId,reportType:reportType,customerId:customerId,saasId:saasId,clientType:clientType,
			result:{},
			totalScore:'',
			healthExplain:'',
			sex:'',
			ranking:'',
			userId: '',
			inspectDateStr:'',
			customerAge:'',
			age:'',
			physicalAge:'',
			firsts:[], //18系统
			mild:[], //中度异常
			moderate:[], //轻度度异常
			conditions:[], //身体状况
			bmi:'',
			bmiexplain: '',
			activeRiskItems : 1,
			inspectSkinView:{ //皮肤
				age:'',
				skinTypeResult:'',
				color:'',
				diseaseExplain:'',
				majorList:[],
				awaitList:[],
				continueList:[],
				minList:[],
				fileName:''
			},
			skinColor:{
                'toubai':'透白',
                'baixi':'白皙',
                'ziran':'自然',
                'xiaomai':'小麦',
                'anchen':'暗沉',
                'youhei':'黝黑',
            },
            diseaseResultArr:{
                'CC':'痤疮',
                'MGJF':'敏感皮肤',
                'PY':'皮炎',
                'NONE':'健康'
            },
            diseaseResult:[],
			showUpdateBmi: false,
			height:'',
			weight:''
		}
	},
	methods:{
		queryInsureIndex: function(){
			var vm = this
			$.ajax({
				type:"post",
				url:analysisreport + "/insure/report/queryInsureIndex",
				dataType: 'json',
				data: {
					reportId: reportId,
					customerId: customerId,
					saasId: saasId
				},
				success: function(res){
					if(res.code == 200){
						$('.my_view').css("display","block");
						$('.load-overlay').css("display","none");
						vm.result = res.data 
						vm.totalScore = res.data.totalScore
						vm.inspectDateStr = res.data.inspectDateStr
						vm.healthExplain = res.data.healthExplain
						vm.sex = res.data.sex
						vm.ranking = res.data.ranking
						//vm.customerAge = res.data.customerAge
						vm.customerAge = res.data.age
						vm.physicalAge = res.data.physicalAge
						vm.firsts = res.data.firsts
						vm.mild = res.data.abnormalTarget.mild
						vm.moderate = res.data.abnormalTarget.moderate
						vm.conditions = res.data.conditions
						vm.bmi = res.data.bmi
						vm.bmiexplain = res.data.bmiexplain
						vm.inspectSkinView = res.data.inspectSkinView
						if(vm.inspectSkinView){
							$.each(vm.inspectSkinView.diseaseResult.split(','),function(index,item){
	                            vm.diseaseResult.push(vm.diseaseResultArr[vm.inspectSkinView.diseaseResult.split(',')[index]]);
	                        })
						}	
						if(vm.totalScore >=95){
							var du = -105
						}else if(vm.totalScore>=90 && vm.totalScore<95){
							var du = -54
						}else if(vm.totalScore>=85 && vm.totalScore<90){
							var du = 0
						}else if(vm.totalScore>=80 && vm.totalScore<85){
							var du = 53
						}else{
							var du = 106
						}
						setTimeout(function(){
							$('#pointer').css("transform","rotate("+du+"deg)");
							vm.zhuan(vm.totalScore);
						},100)
						vm.goToShare('goToPrint')
					}else if(res.code == 201){
						vm.goPay(res.paymentType,res.sameUser)
					}else{
						console.log('queryInsureIndex code='+res.code);
						alert('queryInsureIndex,code='+res.code+',msg='+res.msg)
					}
				},
				error: function(){console.log('queryInsureIndex error')}
			});
		},
		zhuan:function(score){
			var vm = this
			//var  w = document.documentElement.clientWidth;
			var  w = $('.toscore').width();
            //if(w>750){w = 750}
			$('.toscore').circleProgress({
			    value: score/100,
			    size: w,
			    startAngle: Math.PI*1.5,
        	    emptyFill: '#edf6fb',
        	    thickness: w/28,
        	    fill:{
        	    	color: '#428FE8',
        	    }
			}).on('circle-animation-progress', function(event, progress) {
			    $(this).find('span').html(parseInt(score * progress));
			});
			$('.dian').css("transform","rotate("+ score/100*360 +"deg)"); 
		},
		goPay: function(paymentType,sameUser){
			var vm = this
			var payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+sameUser+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType
			location.href = 'payfor501.html'+payStr
		},
		popExplain:function(tit,txt){
			$('.v_overlert .tc_sy .labt').text(tit);
			$('.v_overlert .tc_sy .bxt').text(txt)
			showMask()
			showAlert()
		},
		goSecond: function(item){
			var vm = this
			if(item.targetId == 'A3585'){
				location.href = 'loop_kh.html?reportId='+reportId+'&targetId='+item.targetId
			}else{
				location.href = 'second_kh.html?reportId='+reportId+'&targetId='+item.targetId
			}
		},
		goThird: function(item){
			var vm = this
			location.href = 'third_kh.html?reportId='+reportId+'&targetId='+item.targetId+'&secondTargetId'
		},
		showRiskItems: function(key){ //切换展示
			var vm = this
			vm.activeRiskItems = key
		},
		checkHistory: function(){ //历史报告
			var vm = this;
			zhuge.track('点击历史报告', { //埋点 t
				'用户id': vm.customerId,
				'渠道' : '微信'
			},function(){
				location.href = gohistoryUrl
			});
		},
		goToShare: function(fangfa){  //goToShare\goToPrint
			var vm = this;
			setupWebViewJavascriptBridge(function(bridge) {
				//alert('click share'+reportId);
				bridge.callHandler(fangfa, {
					'reportId':reportId,
					'reportUrl':localUrl,
					'reportPrintUrl':reportPrintUrl+reportId,
					'reportScore': vm.totalScore,
					'reportTime': vm.inspectDateStr,
					'reportName': vm.ranking
				}, function responseCallback(responseData) {});
			})
		},
		goSetUp: function(){ //个人中心
			var vm = this;
			zhuge.track('点击个人中心', { //埋点 t
				'用户id': vm.customerId,
				'渠道' : '微信'
			},function(){
				location.href = dataUrl + "/wxUser/wxUserReport?jumpUrl=uiUser&userId="+vm.customerId+'&reportId='+reportId+'&saasId='+saasId
			});	
		},
		getSuggest: function(e){ //健康建议
			var vm = this;
			zhuge.track('点击健康建议',{
				'用户id': vm.customerId,
				'渠道' : '微信'
			},function(){
				location.href = 'advice.html?reportId='+reportId+'&reportType='+reportType
			})
		},
		getRecipesData: function(e){ //健康食谱
			var vm = this;
			zhuge.track('点击健康食谱',{
				'用户id': vm.customerId,
				'渠道' : '微信'
			},function(){
				location.href = 'recipes.html?reportId='+reportId+'&reportType='+reportType
			})
		},
		originImg: function(){
			showMask()
			$('.orginImg').css({"visibility":"visible","opacity":"1"})
		},
		showskinQe: function(txt){ //皮肤问题
			txt = txt.replace('/n','<br>')
			showMask()
			$('.v_overlert .tc_sy .bit').remove();
			$('.v_overlert .tc_sy .bxt').html(txt);
			showAlert()
		},
		gotoSkin:function(){
			var vm = this
			location.href = 'skin_new.html?reportId='+reportId+'&reportType='+reportType+'&clientType='+clientType
			
		},
		//调出bmi更新框
		goUpdate: function(){
			this.showUpdateBmi = true
		},
		//更新BMI
		updateBmi: function(){
			var vm = this;
			if(vm.height == '' || vm.weight == ''){
				vm.showUpdateBmi = false;
				return;
			}
			if(parseFloat(vm.height)>250 || parseInt(vm.height)<50){
				alert('请输入正确的身高');
				return;
			}else if(parseFloat(vm.weight)>200 || parseInt(vm.weight)<20){
				alert('请输入正确的体重');
				return;
			}else{
				vm.showUpdateBmi = false;
				$.post(analysisreport+'/insure/report/updateBMIById',
					{
						reportId: reportId,
						customerId : customerId,
						height : vm.height,
						weight : vm.weight
					},
					function(data){
						if(data.code == 200){
							vm.queryInsureIndex();
							console.log('更新bmi')
						}else{
							alert('BMI更新失败 updateBMIById code='+data.code)
						}
					}
				)
			}	
		},
	},
	mounted: function(){
		this.queryInsureIndex()
	}
});

//app交互
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
//截取url
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
//弹窗
var _bodyoffset = '';
function showMask(){
	_bodyoffset = $(window).scrollTop();
	$("body").css({"position":"fixed","top":-_bodyoffset+"px"});
	$("body").css("overflow","hidden");
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	closeMask();
};
function showAlert(){
	$('.v_overlert').css({"visibility":"visible","opacity":"1"})
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$('.orginImg').css({"visibility":"hidden","opacity":"0"});
		$("body").css("overflow","auto");
		$("body").css("position","static");
		$(window).scrollTop(_bodyoffset);
	});
};	