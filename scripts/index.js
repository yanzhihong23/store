$(function() {
	var utils = new Utils(),
			search = utils.getSearch(),
			zjtoken = search.zjtoken, //'64C8B923-8ABE-42CE-ABF5-AEBACDA09DF3-75022-00009F62C13819AC`AATmZNU1hZX/rUCJTc2o4Z5bMbj9Ab7I`1',
			store_id = search.store_id, // 7,
			headers = {
				'Content-Type': 'application/json',
				zjtoken: zjtoken,
				store_id: store_id
			};

	if(zjtoken && store_id) {
		localStorage.setItem('headers', JSON.stringify(headers));
	}

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
			headers: headers,
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