var go = 0;

var view_Width = $(window).width();
 if(view_Width > 750){view_Width = 750}
console.log('window w='+view_Width);
var reportId = (getQueryString("reportId") || "KH503KS0000086U211230153600920");
var viewType = getQueryString("viewType");  //1 打印  2预览
var reportType = getQueryString('reportType');
var printReportType = getQueryString('printReportType');  //1结果版，2标准版 ，3价值版
if(viewType == 1){go = 0};
//var reportId = 'KJ501KT00000156190619000226482';
$('.load-overlay').css("display","block");
var myapp = new Vue({
	el:'#app',
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
					
					go++
					goPrint(go)
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
		
		godownloadPdf: function(){
    		var target = document.getElementsByClassName("print")[0];
			target.style.background = "#FFFFFF";
			html2canvas(target, {
			    onrendered:function(canvas) {
			        var contentWidth = canvas.width;
			        var contentHeight = canvas.height;
			
			        //一页pdf显示html页面生成的canvas高度;
			        var pageHeight = contentWidth / 592.28 * 841.89;
			        //未生成pdf的html页面高度
			        var leftHeight = contentHeight;
			        //页面偏移
			        var position = 0;
			        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
			        var imgWidth = 595.28;
			        var imgHeight = 592.28/contentWidth * contentHeight;
			
			        var pageData = canvas.toDataURL('image/jpeg', 1.0);
			
			        var pdf = new jsPDF('', 'pt', 'a4');
			
			        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
			        //当内容未超过pdf一页显示的范围，无需分页
			        if (leftHeight < pageHeight) {
			        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
			        } else {
			            while(leftHeight > 0) {
			                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
			                leftHeight -= pageHeight;
			                position -= 841.89;
			                //避免添加空白页
			                if(leftHeight > 0) {
			                  pdf.addPage();
			                }
			            }
			        }
			        pdf.save("健康报告评估.pdf");
			    }
			})
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

