var reportId = getQueryString("reportId");
var viewType = getQueryString("viewType");
var go = 0;
function goPrint(n){
	if(n == 1){
		setTimeout(function(){
			window.print();
		},300)
	}
};
if(viewType == 2){
	go = 10 //随便给个数 不让调用打印
}

new Vue({
	 el: '#print',
    data:function() {
		return {
			nickName:'',
		 	sex:'',
		 	mobile:'',
		 	inspectDateStr:'',
		 	relatedNo: '',
		 	payNum:'',
			list:{},
			
		}
	},
	mounted:function() {
		//this.reverseMessage()
    },
    created:function(){
    	var _this = this 
		$.ajax({
			type:"post",
			url: dataUrl+"/api/v1/printReport/getReportPrint",
			dataType: 'json',
			data:{
				reportId:  reportId 
				//reportId:  'KJ103IS00000111181022170095084'
				//reportId:  'KJ103IS00000111181105153602889'
				
			},
			success:function(data){
				if(data.code == 200){
					$('#print').css("visibility","visible");
					if(data.data.infoView != null){
						_this.nickName = data.data.infoView.nickName,
					 	_this.sex = data.data.reportView.sex,
					 	_this.mobile = data.data.infoView.mobile,
					 	_this.relatedNo = data.data.infoView.relatedNo
						document.title = data.data.infoView.nickName + data.data.infoView.mobile
					}
				 	_this.inspectDateStr = data.data.reportView.inspectDateStr,
				 	_this.payNum = data.data.payNum,
				 	_this.list = data.data.reportView.firsts
					
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

