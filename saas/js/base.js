//-----测试-----
/*var dataUrl = 'http://csh.jiankangzhan.com'; //数据接口
 * 
var testHealthUrl = 'http://kj101-tt.jiankangzhan.com'; //大机器

var bit_testHealthUrl = 'http://kj201-tt.jiankangzhan.com'; //小机器

var couponData = 'http://coupon-tt.jiankangzhan.com'; //优惠券*/

//---生产-----
var dataUrl='';


switch (saasId)
{
	case '100067':
	  	dataUrl='http://sc.jiankangzhan.com';
	  	break;
	case '208653':
	  	dataUrl='http://csh.jiankangzhan.com';
	  	break;
	case '215563':
	 	dataUrl='http://yst.jiankangzhan.com';
	  	break;
	case '208654':
	  	dataUrl='http://zyjk.jiankangzhan.com';
	  	break;
	case '214913':
	  	dataUrl='http://txj.jiankangzhan.com';
	  	break;
	case '215802':
	  	dataUrl='http://ackq.jiankangzhan.com';
	  	break;
	default:
		alert(saasId);
	  	dataUrl='http://wx.jiankangzhan.com';
	  
}






//var dataUrl = 'http://csh.jiankangzhan.com'; //数据接口

var testHealthUrl = 'http://kj101.jiankangzhan.com'; //大机器

var bit_testHealthUrl = 'http://kj201.jiankangzhan.com'; //小机器

var couponData = 'http://coupon.jiankangzhan.com'; //优惠券

var channel = 'http://pay.jiankangzhan.com'; //支付通道*/
//var channel = 'http://47.94.14.217:8765'; //支付通道




var shareImgUrl = 'http://image.jiankangzhan.com'; //分享图片