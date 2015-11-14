$(function() {
	var utils = new Utils(),
			type = utils.getSearch().package || 'A',
			pack = localStorage.getItem('package' + type);

	var init = function() {
		if(pack) {
			pack = JSON.parse(pack);
			render(pack);
		} else {
			$.ajax({
				type: 'POST',
				url: utils.HOST + '/product/productList',
				beforeSend: function(xhr, settings) {
					$('.loading').show();
				},
				success: function(data) {
					if(data.flag === 1) {
						var data = data.data.productInfo;
						var packageA = dataFormatter(data[0].productList);
						var packageB = dataFormatter(data[1].productList);
						packageA.coupon = 1000;
						packageB.coupon = 1500;
						packageA.subject = '套餐A';
						packageB.subject = '套餐B';
						packageA.productId = data[0].productId;
						packageB.productId = data[1].productId;
						localStorage.setItem('packageA', JSON.stringify(packageA));
						localStorage.setItem('packageB', JSON.stringify(packageB));

						render(type === 'A' ? packageA : packageB);
					}
				},
				complete: function(xhr, status) {
					$('.loading').hide();
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
			console.log(totalFee);
		}

		return {
			totalFee: totalFee,
			cats: cats 
		};
	};

	var render = function(data) {
		var cats = data.cats;
		var navFragment = document.createDocumentFragment();
		var productsFragment = document.createDocumentFragment();
		var ul = document.createElement('ul');
		ul.className = 'tabs';

		// all
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.className = 'active';
		a.setAttribute('data-cat', 'all');
		a.innerHTML = '全部';
		li.appendChild(a);
		ul.appendChild(li);

		for(var key in cats) {
			var categoryName = cats[key][0].categoryName.substr(0, 2);
			// category
			var li = document.createElement('li');
			var a = document.createElement('a');
			a.setAttribute('data-cat', key);
			a.innerHTML = categoryName;
			li.appendChild(a);
			ul.appendChild(li);

			// product list

			var article = document.createElement('article');
			article.className = 'product-list';
			article.id = 'cat_' + key;

			var header = document.createElement('header');
			header.className = 'category';
			header.innerHTML = categoryName;

			article.appendChild(header);

			for(var i=0, len=cats[key].length; i<len; i++) {
				var product = cats[key][i];

				var section = document.createElement('section');
				section.className = 'detail';
				var nameDiv = document.createElement('div');
				nameDiv.className = 'name';
				nameDiv.innerHTML = product.goodsName;
				var priceDiv = document.createElement('div');
				var priceSpan1 =  document.createElement('span');
				priceSpan1.innerHTML = '￥' + product.unitPrice.toFixed(2) + ' x ' + product.count;
				var priceSpan2 = document.createElement('span');
				priceSpan2.className = 'pull-right total';
				priceSpan2.innerHTML = '￥' + product.totalAmount.toFixed(2);

				priceDiv.appendChild(priceSpan1);
				priceDiv.appendChild(priceSpan2);

				section.appendChild(nameDiv);
				section.appendChild(priceDiv);

				article.appendChild(section);
			}

			productsFragment.appendChild(article);
		}

		navFragment.appendChild(ul);

		$('nav').append(navFragment);
		$('.market').append(productsFragment);

		var totalFee = data.totalFee,
				coupon = data.coupon;
		// $('.result .pull-right').html('￥' + totalFee.toFixed(2) + ' - ' + '￥' + coupon.toFixed(2) + ' = <em>￥'  + (totalFee - coupon).toFixed(2) + '</em>');
		$('.result .pull-right').html('<em>￥'  + totalFee.toFixed(2) + '</em>');

		eventInit();
	};

	var eventInit = function() {
		// back button event
		$('.back').click(function() {
			history.back();
		});
		// tabs click event
		$('.tabs').click(function(e) {
			var cat = $(e.target).data('cat');

			$('.tabs a').removeClass('active');
			$(e.target).addClass('active');

			if(cat !== 'all') {
				$('.market .product-list').hide();
				$('#cat_' + cat).show();
			} else {
				$('.market .product-list').show();
			}
		});
	};

	init();
});