$(function() {
	var utils = new Utils(),
			search = utils.getSearch(),
			type = search.type,
      isIphone = /iPhone/.test(navigator.userAgent);

  var isFull = localStorage.getItem('isFull') == 'true';

  if(isFull) {
    $('body header').show();
  }

  if(isIphone) {
    $('body').addClass('platform-ios');
  }

	if(type === 'disabled') {
		$('.desc').html('正在建设中<br>请耐心等待~');
	}

  $('header .back').click(function(e) {
    if(window.zjddapp) {
      zjddapp.popWebViewController(); // back to app
    } else {
      alert('no zjddapp');
    }
  });
});