function checkMsg (num){
	var msg = "";
	if(num == '10'){
		msg = '状态异常或没有这个口令或卡';
	}else if(num == '11'){
		msg = '批次状态异常或没有这个批次';
	}else if(num == '12'){
		msg = '批次不在有效期';
	}else if(num == '13'){
		msg = '用户未绑定该体验卡或绑定体验卡异常';
	}else if(num == '15'){
		msg = '口令或体验卡不支持该设备';
	}else if(num == '16'){
		msg = '用户绑定体验卡不在有效期内,或次数已用完 ';
	}else if(num == '17'){
		msg = '使用失败';
	}else if(num == '20'){
		msg = '绑定失败';
	}else if(num == '21'){
		msg = '不记名年卡无法绑定';
	}else{
		msg = '请输入正确的兑换码';
	};
	return msg;
};
