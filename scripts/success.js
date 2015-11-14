$(function() {
	var utils = new Utils(),
			headers = utils.getHeaders();

	$.ajax({
		type: 'GET',
		url: utils.HOST + '/store/storeNameAddrInfo',
		headers: headers,
		success: function() {
			if(data.flag === 1) {
				var storeName = data.data.storeName,
						storeAddr = data.data.storeAddr;

				$('.name').html('店铺: ' + storeName);
				$('.address').html(storeAddr);
			}
		}
	})
});