$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
// 获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
var reportId = getQueryString('reportId');
var customerId = getQueryString('userId');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var saasId = getQueryString('saasId');
var clientType = getQueryString("clientType");
var resource = getQueryString("resource");
var edition = 400;
var payStr = '';
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId;
if(!openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType;
}
var myApp = new Vue({
	el:'#report4',
	data: function(){
		return {
			reportId:reportId,
			customerId: customerId,
			userId: customerId,
			sex:'',
			age:'',
			inspectDateStr:'',
			parentList:'', //各个指标集合
			height:'',
			weight:'',
			showUpdateBmi: false,
		}
	},
	methods: {
		queryV4Report: function (){
			var vm = this;
			$.ajax({
				type:"post",
				url:analysisreport+"/v4/reportData/queryV4Report",
				async:true,
				dataType:'json',
				data:{
					reportId: reportId,
					customerId: customerId,
					saasId: saasId
				},
				success: function(res){
					if(res.code == 200){
						vm.sex = res.result.sex
						vm.age = res.result.age
						vm.inspectDateStr = res.result.inspectDateStr
						vm.parentList = res.result.parentList 
						$('.load-overlay').css("display","none");
						$('.my_view').css("visibility","visible");
					}else if(res.code == 201){
						vm.participate(res.paymentType,res.sameUser)
					}else{
						alert('queryV4Report code='+res.code)
					}
					
				},
				error: function(){alert('queryV4Report error')}
			});
		},
		//点击查看二级页面
		goSecond: function(e,item){
			var vm = this;
			location.href = 'category.html?reportId='+reportId+'&targetId='+item.targetId
		},
		//解释弹框
		pop: function(e,item){
			var vm = this;
			$('.v_overlert .tc_sy .bit').text(item.inspectName);
			$('.v_overlert .tc_sy .bxt').text(item.inspectContent);
			showMask();
		},
		//判断支付页面
		participate: function(paymentType,sameUser){
			payStr = '?reportId='+reportId+'&userId='+customerId+'&openId='+openId+'&sameUser='+sameUser+'&edition='+edition+'&reportType='+reportType+'&saasId='+saasId+'&clientType='+clientType
			location.href="payfor400.html"+payStr
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
				$.post(analysisreport+'/v4/reportData/updateBMIById',
					{
						reportId: reportId,
						customerId : customerId,
						customerId : customerId,
						height : vm.height,
						weight : vm.weight
					},
					function(data){
						if(data.code == 200){
							vm.queryV4Report();
							console.log('更新bmi')
						}else{
							alert('BMI更新失败 updateBMIById code='+data.code)
						}
					}
				)
			}	
		},
		checkHistory: function(){ //历史报告
			var vm = this;
			zhuge.track('点击历史报告', { //埋点 t
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = gohistoryUrl
			});
		},
		getRecipesData: function(){ //健康食谱
			var vm = this;
			zhuge.track('点击健康食谱',{
				'用户id': vm.userId,
				'渠道' : '微信'
			},function(){
				location.href = 'recipes.html?reportId='+reportId+'&edition='+edition+'&reportType='+reportType
			})
		},
	},
	mounted: function(){
		this.queryV4Report();
	}
});
//弹窗
var _bodyoffset = '';
function showMask(){
	_bodyoffset = $(window).scrollTop();
	$("body").css({"position":"fixed","top":-_bodyoffset+"px"});
	$("body").css("overflow","hidden");
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	$('.v_overlert').css({"visibility":"visible","opacity":"1"});
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$("body").css("overflow","auto");
		$("body").css("position","static");
		$(window).scrollTop(_bodyoffset);
	});
};	