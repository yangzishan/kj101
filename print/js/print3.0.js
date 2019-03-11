var reportId = getQueryString("reportId");
var viewType = getQueryString("viewType");
var go = 0;
function goPrint(n){
	if(n == 2){
		setTimeout(function(){
			window.print();
		},300)
		
	}
};
if(viewType == 2){
	go = 10 //随便给个数 不让调用打印
}
//var reportId = "KJ103IS00000111181107105663992";
//var reportId = "KJ104IS0007324C18112614202311377";

new Vue({
	 el: '#print',
    data:function() {
		return {
			reportId:'',
			nickName:'',
			age:'',
		 	sex:'',
		 	mobile:'',
		 	totalScore:'',
		 	ranking:'',
		 	inspectDateStr:'',
		 	headimgurl:'',
			height:'',
			weight:'',
			userId:'',
		 	relatedNo: '',
		 	payNum:'',
		 	titleSex:'',
		 	birthdayStr:'',
		 	cardNo:'',
		 	reportNewThreeViems: [],
			dietList:[],
			nutritionList:[],
			motionList:[],
			recipes:'',
			options:['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十五','十六']
		}
	},
    created:function(){
    	var _this = this 
		$.ajax({
			type:"post",
			url: dataUrl+"/api/v1/printReport/getReportV3Print",
			dataType: 'json',
			data:{
				reportId:  reportId 
			},
			success:function(data){
				if(data.code == 200){
					$('#print').css("visibility","visible");
					if(data.data.infoView != null){
						_this.nickName = data.data.infoView.nickName,
					 	_this.mobile = data.data.infoView.mobile,
					 	//_this.height = data.data.infoView.height,
					 	//_this.weight = data.data.infoView.weight,
					 	_this.birthdayStr = data.data.infoView.birthdayStr,
					 	_this.userId = data.data.infoView.userId
					 	document.title = data.data.infoView.nickName + data.data.infoView.mobile
					}
					_this.sex = data.data.reportBaseThreeData.sex,
				 	_this.inspectDateStr = data.data.reportBaseThreeData.inspectDateStr,
				 	_this.totalScore = data.data.reportBaseThreeData.totalScore,
				 	_this.ranking = data.data.reportBaseThreeData.ranking,
				 	_this.titleSex = data.data.reportBaseThreeData.titleSex,
				 	_this.age = data.data.reportBaseThreeData.age,
				 	_this.height = data.data.reportBaseThreeData.height,
				 	_this.weight = data.data.reportBaseThreeData.weight,
				 	_this.payNum = data.data.payNum,
				 	_this.cardNo = data.data.cardNo,
				 	
				 	_this.reportNewThreeViems = data.data.reportBaseThreeData.reportNewThreeViems,
				 	
				 	_this.recipes = data.data.recipes.daylist
				 	
					go++;
					goPrint(go);
				}
			},
			error:function(){}
		});
		//建议
		$.ajax({
			type:"post",
			url: analysisreport+"/v3/reportContent/querySuggestByReportId",
			dataType: 'json',
			data:{
				reportId:  reportId 
			},
			success:function(data){
				if(data.code == 200){
					_this.dietList = data.data.healthAdviceVo.dietList,
					_this.nutritionList = data.data.healthAdviceVo.nutritionList,
					_this.motionList = data.data.healthAdviceVo.motionList

					go++;
					goPrint(go);
				}
			},
			error:function(){}
		});
		
   },
})
// 获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

