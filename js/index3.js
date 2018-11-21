var edition = 3;
var reportId = getQueryString("reportId");
var openId = getQueryString("openId");
console.log(reportId);
console.log(openId);
var _offsetTop; //存储滚动
var _bodyoffset;
new Vue({
	 el: '.all-view',
    data:function() {
		return {
			isShow:false,
			isActive:[],
			popupA:false,
			popupB:false,
			popupC:false,
			popupD:false,
			popupE:false,
			popupF:false,
			popupG:false,
			popupH:false,
			popupI:false,
			popupJ:false,
			popupK:false,
			popupL:false,
			data:{},
			totalScore:{},
			sex:'',
			reportId:'',
			headimgurl:'',
			height:'',
			weight:'',
			userId:'',
			openId:'',
			sameUser:'',
			inspectDate:'',
			ranking:'',
			targetName:''
		}
	},
	mounted: function(){
		this.reverseMessage()
    },
	methods: {
		reverseMessage: function() {
			var _this = this;
			$.post(dataUrl+'/api/v1/reportIndex/analysisReport',
				{
					reportId: reportId /*? this.reportId :"KJ103IS00000111180917204581528"*/,
					openId : openId /*? this.openId : "onzW6w5RTnI0hVmwI8JtiHKV-vM8"*/
				},
				function (data) {
					if(data.code == 200){
						$.post(analysisreport+'/v3/reportContent/queryNewReportDataByReportId',
							{
								reportId: reportId /*? this.reportId :"KJ103IS00000111180917204581528"*/,
								openId: openId /*? this.openId : "onzW6w5RTnI0hVmwI8JtiHKV-vM8"*/
							},
							function (data) {
								if(data.code == 200){
									$('body').css("visibility","visible");
									_this.data = data.result.reportNewThreeViems
									_this.totalScore = data.result.totalScore
									_this.ranking = data.result.ranking
									_this.sex = data.result.sex
									_this.userId = data.result.userId
									_this.headimgurl = data.result.headimgurl
									_this.inspectDate = data.result.inspectDate
									if(_this.data[3].score== null){
										_this.data[3].score = 0
									};
									$('#score').animateNumber({ number: indexData.data.indexPage.totalScore },1100);
								}else if((data.code == 201)){
									console.log('需要支付');
									_this.sameUser = data.sameUser;
									window.location.href="payfor3.0.html?reportId=" + reportId + '&openId=' + openId + "&sameUser=" + _this.sameUser+"&edition="+edition;
								}else{console.log('queryNewReportDataByReportId,code='+data.code);}
							}
						).error(function(){alert('queryNewReportDataByReportId error')});
					}else if(data.code == 402){
						alert(402);
						console.log('需完善用户信息');
						_this.userId = data.data.userId;
						window.location.href="userInfor3.html?reportId="+reportId+"&userId="+_this.userId+"&openId="+openId+"&edition="+edition;
					}else if(data.code == 405){
						alert(405);
						console.log('需创建用户');
						window.location.href="userInfor3.html?reportId="+reportId+"&openId="+openId+"&edition="+edition;
					}else if(data.code == 403){
						alert(403);
						console.log('没有年龄');
						_this.userId = data.data.userId;
						window.location.href="supAge.html?reportId="+reportId+"&userId="+_this.userId +"&openId="+openId+"&edition="+edition;
					}else if(data.code == 302){
						alert(302);
						console.log('设备未激活');
						window.location.href="equipmentUnable.html"
					}else{alert('analysisReport code='+data.code+' '+data.msg)}
				}
			).error(function(){alert('analysisReport error')});
		},
		shade: function(index){
			this.popupA = false
			this.popupB = false
			this.popupC = false
			this.popupD = false
			this.popupE = false
			this.popupF = false
			this.popupG = false
			this.popupH = false
			this.popupI = false
			this.popupJ = false
			this.popupK = false
			this.popupL = false
			Vue.set(this.isActive, index, !this.isActive[index]);
			$('body').css("overflow","auto");
			$("body").css("position","static");
			$(window).scrollTop(_bodyoffset);
		},
		// 综合健康分数
		clickA: function(){
			this.popupA = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 亚健康风险
		clickB: function(){
			this.popupB = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 睡眠质量
		clickC: function(){
			this.popupC = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// BMI
		clickD: function(){
			this.popupD = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 皮肤评估
		clickE: function(){
			this.popupE = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 快乐指数
		clickF: function(){
			this.popupF = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 实时状态
		liClick: function(index){
			Vue.set(this.isActive, index, !this.isActive[index]);
			$('body').css("overflow","hidden");
		},
		// 营养状态
		listG: function(){
			this.popupG = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 免疫能力
		listH: function(){
			this.popupH = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 消化能力
		listI: function(){
			this.popupI = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 吸收能力
		listJ: function(){
			this.popupJ = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 代谢能力
		listK: function(){
			this.popupK = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 男女性功能
		listL: function(){
			this.popupL = true
			this.noscorll();
			$('body').css("overflow","hidden");
		},
		// 身高体重更新
		update: function(){
			this.isShow = true
			
		},
		sure: function(){
			this.isShow = false
			this.updateBmi()
			this.reverseMessage()
		},
		//定位滚动
		noscorll: function(){
			_bodyoffset = $(window).scrollTop();
			$("body").css({"position":"fixed","top":-_bodyoffset+"px"});
		},
		// 点击下一页
		next: function(){
			//window.location=`graph.html?sex=${this.sex}&userId=${this.userId}`
		},
		// 个人中心
		goSet: function(){
			window.location.href=dataUrl+"/wxUser/wxUserReport?jumpUrl=uiUser&userId=" + this.userId + '&reportId='+ this.reportId
		},
		// 历史报告
		checkHistory: function(){
			window.location.href=dataUrl+"/wxUser/wxUserReport?jumpUrl=uiHistory&userId=" + this.userId + "&openId=" + this.openId + '&reportId=' + this.reportId
		},
		// 导航
		indexHref: function(){
			window.location='index3.html?reportId='+reportId+'&openId='+openId+'&sex='+this.sex+'&userId='+this.userId
		},
		adviseHref: function(){
			window.location='z_pop3.html?reportId='+reportId+'&openId='+openId+'&sex='+this.sex+'&userId='+this.userId
		},
		recipeHref: function(){
			window.location='recipes3.html?reportId='+reportId+'&openId='+openId+'&sex='+this.sex+'&userId='+this.userId
		},
		graphHref: function(){
			window.location='graph.html?reportId='+reportId+'&openId='+openId+'&sex='+this.sex+'&userId='+this.userId
		},
		updateBmi: function(){
			$.post(analysisreport+'/v3/reportData/UpdateHeightAndWeight',
				{
					reportId: reportId,
					userId : this.userId,
					height : this.height,
					weight : this.weight
				},
				function(data){console.log('更新bmi')}
			)
		}
	},
})

// 获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
