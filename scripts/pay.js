var GATEWAY = 'https://mapi.alipay.com/gateway.do?',
		MD5KEY = 'g7njkzjvp4vaiz04q195wqbq4obsiwhs',
		params = {
			'_input_charset': 'utf-8',
			// 'body': 'body',
			// 'it_b_pay': '30m',
			'notify_url': 'http://api.zaijiadd.com',
			'out_trade_no': '1111111',
			'partner': '2088021162892915',
			'payment_type': '1',
			'return_url': 'http://localhost:8080/success.html',
			'seller_id': '2088021162892915',
			'service': 'alipay.wap.create.direct.pay.by.user',
			// 'show_url': 'm.alipay.com',
			'subject': '测试',
			'total_fee': '0.01'
		};

var sign = md5(decodeURIComponent($.param(params)) + MD5KEY);

params.sign_type = 'MD5';
params.sign = sign;

var alipayRequest = GATEWAY + decodeURIComponent($.param(params));

console.log(alipayRequest);

$('#pay').click(function() {
	location.href = alipayRequest;

	// notify server
	// $.post('http://172.50.100.17:8080/ddhomeapp/callback/alipayCallback?is_success=T&notify_id=RqPnCoPT3K9%252Fvwbh3InVaI0EMfuLEdDWq0wfRnIrBR5%252BykwXHrH%252Ft1UhzjpOrjO6thZ2&notify_time=2015-11-07+16%3A23%3A57&notify_type=trade_status_sync&out_trade_no=1111111&payment_type=1&seller_id=2088021162892915&service=alipay.wap.create.direct.pay.by.user&subject=测试&total_fee=0.01&trade_no=2015110700001000040064433538&trade_status=TRADE_SUCCESS&sign=f3e950674315db9542d77f9eb1968b27&sign_type=MD5');
});