jQuery.fn.extend({
    uploadPreview: function (opts) {
        var _self = this,
            _this = $(this);
        opts = jQuery.extend({
            Img: "ImgPr",
            Width: 100,
            Height: 100,
            ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
            Callback: function () {}
        }, opts || {});
        _self.getObjectURL = function (file) {
            var url = null;
            if (window.createObjectURL != undefined) {
                url = window.createObjectURL(file)
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file)
            }
            return url
        };
        _this.change(function () {
            if (this.value) {
                if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                    alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
                    this.value = "";
                    return false
                }
                if ($.browser.msie) {
                    try {
                        $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                    } catch (e) {
                        var src = "";
                        var obj = $("#" + opts.Img);
                        var div = obj.parent("div")[0];
                        _self.select();
                        if (top != self) {
                            window.parent.document.body.focus()
                        } else {
                            _self.blur()
                        }
                        src = document.selection.createRange().text;
                        document.selection.empty();
                        obj.hide();
                        obj.parent("div").css({
                            'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
                            'width': opts.Width + 'px',
                            'height': opts.Height + 'px'
                        });
                        div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src
                    }
                } else {
                   /*  $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]));
                    $("#up").attr('src', _self.getObjectURL(this.files[0])); */
                }
                opts.Callback()
            }
        })
    }
});
//$("#up").uploadPreview({ Img: "ImgPr"});

function ajaxFileUpload(name){
	var fromData = new FormData($( "#uploadForm" )[0]);
	$.ajaxFileUpload({
		url : "http://localhost:9080/api/v1/reportUser/uploadImage?userId=101",
		secureuri : false,// 安全协议
		fileElementId : name,
		dataType:'image/png',
		type : "POST",
		data : {
    		file : name //"00-30-18-0A-9C-88201711181436" //替换变量 myReportId
		},
		jsonp : 'callback',
		jsonpCallback:"success_jsonp",
		success : function(data, status) {
			debugger
			
		},
		error:function(arg1,arg2,arg3){
			console.log(arg3);
			alert("图片过大,请重新选择");
		}
	});

}