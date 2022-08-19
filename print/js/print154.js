var go = 0;

var view_Width = $(window).width();
 if(view_Width > 750){view_Width = 750}
console.log('window w='+view_Width);
var reportId = (getQueryString("reportId") || "KH503KS0000086U211230153600920");
var viewType = getQueryString("viewType");  //1 打印  2预览
var reportType = getQueryString('reportType');
var printReportType = getQueryString('printReportType');  //1结果版，2标准版 ，3价值版
if(viewType == 1){go = 0};
$('.load-overlay').css("display","block");
var myapp = new Vue({
	el:'#content-box',
	data:function(){
		return{
			showAll:false,
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
			
			loopSys:[],
			mianyili:{},
			feiGongneng:{},
			bloodOxygenValue:{},
			heartLines:[],
			xlist:[],
			yylist:[],
			
			nutritionList:[],
			motionList:[],
			daylist:[],
			inspectSkinView:{
				totalScore:'',
				majorList:[],
				awaitList:[],
				continueList:[],
				color:'',
				age:'',
				skinTypeResult:''
			},
			skinColor:{
				'toubai':'透白',
				'baixi':'白皙',
				'ziran':'自然',
				'xiaomai':'小麦',
				'anchen':'暗沉',
				'youhei':'黝黑',
			},
			diseases:[],
			bloodOxygen:{},
			ecg:{},
			localUrl:window.location.href

		}	///return
	},
	mounted:function(){
		this.getReportPrint()
		this.queryInsureSuggest()
		this.getRecipesData()
	},
	methods:{
		//复制链接
		copyLocalUrl: function(){
			var vm = this;
			var clipboard = new ClipboardJS('#copyurl',{
				text: () => {
							return vm.localUrl;
						}
			});　　//先实例化
　　　clipboard.on('success', function(e) {
　　　　 　alert(`已复制:${e.text}`);　　//复制成功区间
					//alert(vm.localUrl)
　　　});
　　　clipboard.on('error', function(e) {
				alert('try again')
　　　});
		},
		getReportPrint:function(){
			var vm = this
			$.ajax({
				type:"post",
				url: dataUrl+"/api/azy/reportData/getReportPrint",
				async:true,
				dataType:'Json',
				data:{
					reportId:reportId
				},
				success:function(res){
					vm.showAll = true
					if(res.data.infoView != null){
						vm.nickName = (res.data.infoView.nickName?res.data.infoView.nickName:'')	
					 	vm.mobile = (res.data.infoView.mobile?res.data.infoView.mobile:'')
					 	vm.sex = res.data.reportAZYView.sex
					 	vm.relatedNo = res.data.infoView.relatedNo
						document.title = vm.nickName + vm.mobile;
						//if(vm.nickName == null){document.title = vm.mobile}
						if(vm.nickName == null && vm.mobile == null){document.title = '打印报告'}
					}
					vm.payNum = res.data.payNum,
				 	vm.inspectDateStr = res.data.reportAZYView.inspectDateStr,
				 	//vm.firsts = res.data.reportAZYView.reportView.firsts
				 	vm.diseases = res.data.reportAZYView.reportView.diseases.splice(0,6)
					res.data.reportAZYView.reportView.firsts.forEach(function(item,index,arr){
						if(item.targetId == 3135){
							vm.mianyiScore = item.seconds[0].score
							vm.mianyiList = item.seconds[0].thirds
						 };
						 if(item.targetId == 3087){
							  item.seconds[0].thirds.forEach(function(el){
								  if(el.targetId != 3207){
										 vm.loopSys.push(el)
								  }
							  });
						 };
						 if(item.targetId == 3108){
								vm.feiGongneng = item.seconds[0]
						 };
						 if(item.targetId == 3135){
						 		vm.mianyili = item.seconds[0]
						 };
						 if(item.targetId != 3087 && item.targetId != 9001){
							 vm.firsts.push(item); 
						 }
					})
					
					vm.filterData()
				 	vm.inspectSkinView = res.data.reportAZYView.inspectSkinView
				 	vm.bloodOxygen = res.data.reportAZYView.bloodOxygenValue
					vm.bloodOxygenValue = res.data.reportAZYView.bloodOxygenValue
				 	vm.ecg = res.data.reportAZYView.ecg
					
					go++;
					goPrint(go);
					
					bookConfig.start = true;
					
				},
				error:function(){alert('queryInsurePrint error')}
			});
		},
		filterData: function(){
			var vm = this
			vm.firsts.forEach(function(item){
				if(item.seconds){
					item.seconds.forEach(function(n){
						if(n.thirds){
							n.thirds.forEach(function(j){
								if(j.healthAdviceVo.dietList){
									var cashList = []
									j.healthAdviceVo.dietList.forEach(function(k){
										if(k.personality){
											cashList.push(k)
										}
									})
									j.healthAdviceVo.dietList = cashList
									console.log(cashList)
								}
							})
						}
					})
				}
			})
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

function goPrint(n){
	if(n == 3){
		$('.load-overlay').css("display","none");
		if(viewType == 1){
			setTimeout(function(){
				window.print();
			},800)
		}
			
	}
};

//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};

