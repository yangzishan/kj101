var go = -1;
function goPrint(n){
	if(n == 3){
		setTimeout(function(){
			window.print();
		},300)
	}
};
var reportId = getQueryString("reportId");
var viewType = getQueryString("viewType");  //1 打印  2预览
var reportType = getQueryString('reportType');
var printReportType = getQueryString('printReportType');  //1结果版，2标准版 ，3价值版
if(viewType == 1){go = 0};
//var reportId = 'KJ501KT00000156190619000226482';
var myapp = new Vue({
	el:'#app',
	data:function(){
		return{
			nickName:'',
		 	sex:'',
		 	mobile:'',
		 	inspectDateStr:'',
		 	relatedNo: '',
		 	payNum:'',
			firsts:[],
			mianyiList:[],
			mianyiScore:'',
			dietList:[],
			nutritionList:[],
			motionList:[],
			daylist:[],
		}
	},
	mounted:function(){
		this.getReportPrint()
		this.queryInsureSuggest()
		this.getRecipesData()
	},
	methods:{
		getReportPrint:function(){
			var vm = this
			$.ajax({
				type:"post",
				url: dataUrl+"/api/v1/printReport/getReportPrint",
				async:true,
				dataType:'Json',
				data:{
					reportId:reportId
				},
				success:function(res){
					if(res.data.infoView != null){
						vm.nickName = res.data.infoView.nickName
					 	
					 	vm.mobile = res.data.infoView.mobile
					 	vm.relatedNo = res.data.infoView.relatedNo
						document.title = vm.nickName + vm.mobile;
						if(vm.nickName == null){document.title = vm.mobile}
						if(vm.nickName == null && vm.mobile == null){document.title = '打印报告'}
					}
					vm.payNum = res.data.payNum
					vm.sex = res.data.reportView.sex
				 	vm.inspectDateStr = res.data.reportView.inspectDateStr
				 	vm.firsts = res.data.reportView.firsts
				 	vm.firsts.forEach(function(item){
				 		if(item.targetId == 3135){
				 			vm.mianyiScore = vm.mianyiList = item.seconds[0].score
				 			vm.mianyiList = item.seconds[0].thirds
				 		}
				 	})
					go++
					goPrint(go)
				},
				error:function(){alert('getReportPrint error')}
			});
		},
		queryInsureSuggest: function(){
			var vm = this
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/reportIndex/getSuggest",
				data:{
					reportId: reportId
				},
				dataType:"Json",
				success:function(res){
					vm.dietList = res.data.healthAdviceVo.dietList,
					vm.nutritionList = res.data.healthAdviceVo.nutritionList,
					vm.motionList = res.data.healthAdviceVo.motionList
					go++
					goPrint(go)
				},
				error: function(){alert('queryInsureSuggest error')}
			});
		},
		getRecipesData: function(){
			var vm = this
			$.ajax({
				type:"post",
				url:dataUrl+"/api/v1/reportIndex/getRecipesData",
				data:{
					reportId: reportId
				},
				dataType:"Json",
				success:function(res){
					vm.daylist = res.data.dayList
					go++
					goPrint(go)
				},
				error: function(){alert('getRecipesData error')}
			});
		},

	}
});
//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};