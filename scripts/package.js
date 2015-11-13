$(function() {
	var type, utils = new Utils();

	var initPackageData = function() {
		if(!localStorage.getItem('packageA')) {
			$.ajax({
				type: 'POST',
				url: utils.HOST + '/product/productList',
				beforeSend: function(xhr, settings) {
					// $('.loading').show();
				},
				success: function(data) {
					if(data.flag === 1) {
						var data = data.data.productInfo;
						var packageA = dataFormatter(data[0].productList);
						var packageB = dataFormatter(data[1].productList);
						// packageA.coupon = 1000;
						// packageB.coupon = 1500;
						packageA.subject = '套餐A';
						packageB.subject = '套餐B';
						packageA.productId = data[0].productId;
						packageB.productId = data[1].productId;
						localStorage.setItem('packageA', JSON.stringify(packageA));
						localStorage.setItem('packageB', JSON.stringify(packageB));
					}
				},
				complete: function(xhr, status) {
					// $('.loading').hide();
				}
			});
		}
	};

	var dataFormatter = function(data) {
		var cats = {}, totalFee = 0;
		for(var i=0, len=data.length; i<len; i++) {
			var catCode = data[i].categoryCode;
			cats[catCode] = cats[catCode] || [];
			cats[catCode].push(data[i]);

			totalFee += +data[i].totalAmount;
		}

		return {
			totalFee: totalFee,
			cats: cats 
		};
	};

	initPackageData();

	$('.package').click(function(e) {
		if($(e.target).hasClass('detailA')) {
			location.href = 'detail.html?package=A';
		} else if($(e.target).hasClass('detailB')) {
			location.href = 'detail.html?package=B';
		} else if($(e.target).hasClass('couponA')) {
			type = 'A';
			$(e.target).attr('src', 'images/10k-selected@2x.png');
			$('.couponB').attr('src', 'images/15k-disabled@2x.png');
			$('.select').html('确认选择: A套餐').removeAttr('disabled');
		} else if($(e.target).hasClass('couponB')) {
			type = 'B';
			$(e.target).attr('src', 'images/15k-selected@2x.png');
			$('.couponA').attr('src', 'images/10k-disabled@2x.png');
			$('.select').html('确认选择: B套餐').removeAttr('disabled');
		}
	});

	$('.select').click(function() {
		localStorage.setItem('package', type);
		location.href = 'address.html';
	});
});