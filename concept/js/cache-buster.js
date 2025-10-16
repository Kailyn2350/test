/**
 * Cache Buster - HTMLファイルに簡単に追加できるミニバージョン
 * <head>タグ内で最初にロードする必要があります
 */
(function() {
	'use strict';
	
	var VERSION = '1.0.1'; // 更新時にこの値のみ変更
	var VERSION_KEY = 'site_version';
	
	try {
		var stored = localStorage.getItem(VERSION_KEY);
		
		// バージョンが異なる場合、URLにキャッシュバスティングパラメータを追加
		if (stored !== VERSION) {
			localStorage.setItem(VERSION_KEY, VERSION);
			
			var url = new URL(window.location.href);
			var urlVersion = url.searchParams.get('v');
			
			// URLバージョンが現在のバージョンと異なる場合はリダイレクト
			if (urlVersion !== VERSION) {
				url.searchParams.set('v', VERSION);
				url.searchParams.set('t', Date.now());
				
				// 無限リダイレクトを防止
				if (window.location.href !== url.href) {
					window.location.replace(url.href);
				}
			}
		}
		
		// グローバル変数としてバージョンを公開
		window.SITE_VERSION = VERSION;
		
	} catch (e) {
		console.error('Cache buster error:', e);
	}
})();
