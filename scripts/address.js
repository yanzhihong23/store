$(function() {
	var utils = new Utils(), headers = utils.getHeaders();
	var provinceId, cityId, districtId, streetId, allowEmptyStreet = false;

	var doPay = function(obj) {
		var GATEWAY = 'https://mapi.alipay.com/gateway.do?',
				MD5KEY = 'g7njkzjvp4vaiz04q195wqbq4obsiwhs',
				params = {
					'_input_charset': 'utf-8',
					// 'body': 'body',
					// 'it_b_pay': '30m',
					'notify_url': 'http://b2b.zaijiadd.com/ddhomeapp/callback/alipayCallback',
					'out_trade_no': obj.orderId || '123456789',
					'partner': '2088021162892915',
					'payment_type': '1',
					'return_url': 'http://b2b.zaijiadd.com/h5/store/success.html',
					'seller_id': '2088021162892915',
					'service': 'alipay.wap.create.direct.pay.by.user',
					// 'show_url': 'm.alipay.com',
					'subject': obj.subject || 'Test',
					'total_fee': obj.totalFee || '0.01'
				};

		var sign = md5(decodeURIComponent($.param(params)) + MD5KEY);

		params.sign_type = 'MD5';
		params.sign = sign;

		var alipayRequest = GATEWAY + decodeURIComponent($.param(params));

		console.log(alipayRequest);
		location.href = alipayRequest;
	};

	var saveReceiverInfo = function(data) {
		$.ajax({
			type: 'POST',
			url: utils.HOST + '/user/saveUserReceiveInfo',
			headers: headers,
			timeout: 10000,
			data: JSON.stringify({
				realName: data.name,
				mobile: data.mobile, 
				provinceId: data.provinceId,
				cityId: data.cityId,
				countyId: data.districtId,
				townId: data.streetId,
				street: data.street,
				address: data.address,
				postCode: data.postCode
			}),
			beforeSend: function(xhr, settings) {
				$('.loading').show();
			},
			success: function(data) {
				if(data.flag === 1) { // save success
					// init order
					addOrder();
				} else {

				}
			},
			complete: function(xhr, status) {
				$('.loading').hide();
			}
		});
	};

	var addOrder = function() {
		var packageType = localStorage.getItem('package'),
				packageData = localStorage.getItem('package' + packageType),
				productId;

		if(packageData) {
			packageData = JSON.parse(packageData);
			productId = packageData.productId;
		}

		$.ajax({
			type: 'POST',
			url: utils.HOST + '/order/addOrder',
			headers: headers,
			timeout: 5000,
			data: JSON.stringify({
				productId: productId
			}),
			beforeSend: function(xhr, settings) {
				$('.loading').show();
			},
			success: function(data) {
				if(data.flag === 1) { // order init success
					// alipay request
					doPay({
						orderId: data.orderId,
						subject: packageData.subject,
						totalFee: packageData.totalFee
						// totalFee: packageData.totalFee - packageData.coupon
					});
				} else {

				}
			},
			complete: function(xhr, status) {
				$('.loading').hide();
			}
		})
	};

	var alert = function(msg) {
		$('.alert .content').html(msg);
		$('.alert').addClass('slideInUp animated flash show');
	};

	// bind save button event handler
	$('.confirm').click(function() {
		var data = {
			name: $('#name').val(),
			mobile: $('#mobile').val(),
			postCode: $('#post_code').val(),
			provinceId: provinceId,
			cityId: cityId,
			districtId: districtId,
			streetId: streetId,
			address: $('#address').val()
		};

	 	if(!data.name || !data.mobile || !data.postCode || !data.provinceId || !data.cityId || !data.districtId || (!data.streetId && !allowEmptyStreet) || !data.address) {
	 		alert('请完善地址信息~');
	 		return;
	 	}

		saveReceiverInfo(data);
	});

	// init selector
	var initSelector = function(type) {
		var list;
		switch(type) {
			case 'province':
				$.ajax({
					type: 'GET',
					url: utils.HOST + '/system/provinceInfo',
					success: function(data) {
						if(data.flag === 1) {
							list = data.data.provinceInfo.map(function(obj) {
								return {
									name: obj.provinceName,
									id: obj.provinceId
								};
							}).sort(function(a, b) {
								return a.id - b.id;
							});
							render();
						}
					}
				});

				break;
			case 'city':
				$.ajax({
					type: 'GET',
					url: utils.HOST + '/system/cityInfo?provinceId=' + provinceId,
					success: function(data) {
						if(data.flag === 1) {
							list = data.data.cityInfo.map(function(obj) {
								return {
									name: obj.cityName,
									id: obj.cityId
								};
							}).sort(function(a, b) {
								return a.id - b.id;
							});
							render();
						}
					}
				});

				break;
			case 'district':
				$.ajax({
					type: 'GET',
					url: utils.HOST + '/system/countyInfo?cityId=' + cityId,
					success: function(data) {
						if(data.flag === 1) {
							list = data.data.countyInfo.map(function(obj) {
								return {
									name: obj.countyName,
									id: obj.countyId
								};
							}).sort(function(a, b) {
								return a.id - b.id;
							});
							render();
						}
					}
				});
			case 'street':
				$.ajax({
					type: 'GET',
					url: utils.HOST + '/system/townInfo?countyId=' + districtId,
					success: function(data) {
						if(data.flag === 1) {
							list = data.data.townInfo.map(function(obj) {
								return {
									name: obj.townName,
									id: obj.townId
								};
							}).sort(function(a, b) {
								return a.id - b.id;
							});
							render();

							allowEmptyStreet = false;
						} else if(data.flag === 0) {
							allowEmptyStreet = true;
						}
					}
				});
		}

		var render = function() {
			var fragment = document.createDocumentFragment();
			var ul = document.createElement('ul');
			for(var i=0, len=list.length; i<len; i++) {
				var tmpNode = document.createElement("li");
				tmpNode.innerHTML = list[i].name;
				tmpNode.className = 'item';
				tmpNode.setAttribute('data-id', list[i].id);
				tmpNode.setAttribute('data-type', type);
				ul.appendChild(tmpNode);
			}
			fragment.appendChild(ul);

			$('#selector').html(fragment).show();

			var myScroll = new IScroll('#selector', {click: true});
		};
		
	};
	
	$('#selector').click(function(e) {
		var type = $(e.target).data('type');
		var id = $(e.target).data('id');
		var value = $(e.target).html();

		switch(type) {
			case 'province':
				if(provinceId !== id) {
					$('#province').val(value);
					$('#city, #district, #street').val('');
					provinceId = id;
					cityId = null;
					districtId = null;
					streetId = null;
				}
				
				break;
			case 'city':
				if(cityId !== id) {
					$('#city').val(value);
					$('#district, #street').val('');
					cityId = id;
					districtId = null;
					streetId = null;
				}
				break;
			case 'district':
				if(districtId !== id) {
					$('#district').val(value);
					$('#street').val('');
					districtId = id;
					streetId = null;
				}
				break;
			case 'street':
				if(streetId !== id) {
					$('#street').val(value);
					streetId = id;
				}
		}

		$('#selector').hide();
	});

	$('#province').click(function() {
		initSelector('province');
		return false;
	});

	$('#city').click(function() {
		provinceId && initSelector('city');
		return false;
	});

	$('#district').click(function() {
		cityId && initSelector('district');
		return false;
	});

	$('#street').click(function() {
		districtId && initSelector('street');
		return false;
	});

	$('body').click(function(e) {
		if(!$(e.target).hasClass('item')) {
			$('#selector').hide();
		}
	});

	$('.alert .button').click(function(e) {
		$('.alert').removeClass('slideInUp animated flash show');
	});
});