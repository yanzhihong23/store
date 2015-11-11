$(function() {
	var utils = new Utils(),
			search = utils.getSearch(),
			type = search.type;

	if(type === 'disabled') {
		$('.desc').html('正在建设中<br>请耐心等待~');
	}
});