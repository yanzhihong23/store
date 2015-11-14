$(function() {
	var utils = new Utils();
	utils.init();

	// tmp
	// location.href = 'progress.html?type=disabled';

	var switchCheck = function() {
		$.ajax({
			type: 'GET',
			url: utils.HOST	+ '/system/activitySwitch',
			timeout: 5000,
			beforeSend: function(xhr, settings) {
				$('.loading').show();
			},
			success: function(data) {
				if(data.flag === 1) { // enabled
					userTypeCheck();
				} else {
					location.href = 'progress.html?type=disabled';
				}
			},
			error: function(err) {
				console.log('ajax error');
			},
			complete: function(xhr, status) {
				$('.loading').hide();
			}
		})
	};

	var userTypeCheck = function() {
		$.ajax({
			type: 'POST',
			url: utils.HOST + '/authen/authenUserType',
			headers: utils.getHeaders(),
			timeout: 5000,
			beforeSend: function(xhr, settings) {
				$('.loading').show();
			},
			success: function(data) {
				if(data.flag === 1) { // new
					location.href = 'package.html';
				} else { // bought
					location.href = 'progress.html';
				}
			},
			error: function(err) {
				console.log('ajax error');
			},
			complete: function(xhr, status) {
				$('.loading').hide();
			}
		});
	};

	switchCheck();
	
});