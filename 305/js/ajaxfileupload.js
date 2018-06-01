
jQuery.extend({


    createUploadIframe: function (id, uri) {
        //create frame
        var frameId = 'jUploadFrame' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
        if (window.ActiveXObject) {
            if (typeof uri == 'boolean') {
                iframeHtml += ' src="' + 'javascript:false' + '"';

            }
            else if (typeof uri == 'string') {
                iframeHtml += ' src="' + uri + '"';

            }
        }
        iframeHtml += ' />';
        jQuery(iframeHtml).appendTo(document.body);

        return jQuery('#' + frameId).get(0);
    },
    createUploadForm: function (id, fileElementId, data) {
        //create form	
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        if (data) {
            for (var i in data) {
                if (data[i].name != null && data[i].value != null) {
                    jQuery('<input type="hidden" name="' + data[i].name + '" value="' + data[i].value + '" />').appendTo(form);
                } else {
                    jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
                }
            }
        }
        
        var oldElement = jQuery('#' + fileElementId);
        var newElement = jQuery(oldElement).clone(true);
        jQuery(oldElement).attr('id', fileId);
        jQuery(oldElement).before(newElement);
        jQuery(oldElement).appendTo(form);
        
        /*var oldElement = jQuery('#' + fileElementId);  
        var newElement = oldElement.clone(true);  
        newElement[0].files=oldElement[0].files;  
        oldElement.attr('id', fileId);  
        oldElement.before(newElement);  
        oldElement.appendTo(form);*/


        //set attributes
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-1200px');
        jQuery(form).css('left', '-1200px');
        jQuery(form).appendTo('body');
        return form;
    },

    ajaxFileUpload: function (s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime()
        var form = jQuery.createUploadForm(id, s.fileElementId, (typeof (s.data) == 'undefined' ? false : s.data));
        var io = jQuery.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        // Watch for a new set of requests
        if (s.global && !jQuery.active++) {
            jQuery.event.trigger("ajaxStart");
        }
        var requestDone = false;
        // Create the request object
        var xml = {}
        if (s.global)
            jQuery.event.trigger("ajaxSend", [xml, s]);
        //开始显示进度条
        var $layout;
        if(s.event){
        	$layout=s.event.target || s.event.srcElement;
        	$layout.parent().css("position","relative");
        	if($layout){
        		this.showProgress($layout,s);
        	}
        }else if(s.loadingEle){
        	if(s.loadingEle instanceof jQuery){
        		$layout=s.loadingEle;
        	}else{
        		$layout=$(s.loadingEle);
        	}
        	if($layout){
        		this.showProgress($layout,s);
        	}
        }else{
//        	throw new Exception("pelese add attribute [event] or [loadingEle] when init ajaxFileUpload");
        }
        // Wait for a response to come back
        var uploadCallback = function (isTimeout) {
            var io = document.getElementById(frameId);
            try {
                if (io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                } else if (io.contentDocument) {
                    xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                    xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                }
            } catch (e) {
                jQuery.handleError(s, xml, null, e);
            }
            if (xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if (status != "error") {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        // If a local callback was specified, fire it and pass it the data
                        if (s.success)
                            s.success(data, status);

                        // Fire the global callback
                        if (s.global)
                            jQuery.event.trigger("ajaxSuccess", [xml, s]);
                    } else
                        jQuery.handleError(s, xml, status);
                } catch (e) {
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if (s.global)
                    jQuery.event.trigger("ajaxComplete", [xml, s]);

                // Handle the global AJAX counter
                if (s.global && ! --jQuery.active)
                    jQuery.event.trigger("ajaxStop");

                // Process result
                if (s.complete)
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function () {
                    try {
                        jQuery(io).remove();
                        jQuery(form).remove();

                    } catch (e) {
                        jQuery.handleError(s, xml, null, e);
                    }

                }, 100)

                xml = null

            }
        }
        // Timeout checker
        if (s.timeout > 0) {
            setTimeout(function () {
                // Check to see if the request is still happening
                if (!requestDone) uploadCallback("timeout");
            }, s.timeout);
        }
        try {

            var form = jQuery('#' + formId);
            jQuery(form).attr('action', s.url);
            jQuery(form).attr('method', 'POST');
            jQuery(form).attr('target', frameId);
            if (form.encoding) {
                jQuery(form).attr('encoding', 'multipart/form-data');
            }
            else {
                jQuery(form).attr('enctype', 'multipart/form-data');
            }
            jQuery(form).submit();

        } catch (e) {
            jQuery.handleError(s, xml, null, e);
        }

        jQuery('#' + frameId).load(uploadCallback);
        return { abort: function () { } };

    },

    uploadHttpData: function (r, type) {
        var data = !type;
        if (!type)
            data = r.responseText;
        if (type == "xml")
            data = r.responseXML;
        //data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if (type == "script")
            jQuery.globalEval(data);
        // Get the JavaScript object, if JSON is used.
        if (type == "json") {
            ////////////Fix the issue that it always throws the error "unexpected token '<'"///////////////  
            data = r.responseText;
            var start = data.indexOf(">");
            if (start != -1) {
                var end = data.indexOf("<", start + 1);
                if (end != -1) {
                    data = data.substring(start + 1, end);
                }
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////  
            eval("data = " + data);
        }
        // evaluate scripts within html
        if (type == "html")
            jQuery("<div>").html(data).evalScripts();

        return data;
    },
    /***
     * @caption 进度条
     * 该进度条基于事件查找元素，所以要在初始化时指定事件，也可以直接指定元素
     */
	showProgress : function($layout,s){
//		$layout.children().hide();
		var $panel;
		if($layout.is("div")){
			$layout.append(
					'<div class="gobal-progress">'+
					'<div class="gobal-progress-bar">'+
					'<span class="sr-only"></span>'+
					'</div>'+
					'</div>'+
					'<div class="gobal-progress-mb">'+
					'</div>'
			);
			$panel=$layout;
		}else{
			$layout.parents("div").eq(0).append(
					'<div class="gobal-progress">'+
					'<div class="gobal-progress-bar">'+
					'<span class="sr-only"></span>'+
					'</div>'+
					'</div>'+
					'<div class="gobal-progress-mb">'+
					'</div>'
			);
			$panel=$layout.parents("div").eq(0);
		}
		$panel.css("position","relative");
		$(".gobal-progress-mb").css({width:$panel.width(),height:$panel.height(),top:0,left:0});
		$(".gobal-progress").css({width:$(".gobal-progress-mb").width()/3,left:($(".gobal-progress-mb").width()/2-$(".gobal-progress-mb").width()/6),top:$(".gobal-progress-mb").height()/2});
		/*var refresh=setInterval(function(){
			$.ajax({
				url: rootPath+"/sysBody/process/"+s.fileName,
				dataType:"json",
				success: function(percent){
					if(percent && percent<100){
						$(".gobal-progress").find('.gobal-progress-bar').css("width",percent+"%");
					}else{
						$(".gobal-progress").find('.gobal-progress-bar').css("width","100%");
						clearInterval(refresh);
						setTimeout(function(){
							$(".gobal-progress-mb").fadeOut(200,function(){
								$(".gobal-progress").fadeOut(100,function(){
									$panel.find(".gobal-progress-mb").remove();
									$panel.find(".gobal-progress").remove();
								});
							})
						},1000);
					}
					
				},
				error :function(resp,msg,err){
					console.log(resp);
					clearInterval(refresh);
					return;
				}
			})
		},300);*/
	},

    handleError: function (s, xhr, status, e) {
        // If a local callback was specified, fire it
        if (s.error) {
            s.error.call(s.context || s, xhr, status, e);
        }

        // Fire the global callback
        if (s.global) {
            (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
        }
    }
})

