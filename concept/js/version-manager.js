/**
 * Version Manager - キャッシュとlocalStorageの同期システム
 * サイト更新時にバージョンを上げると自動的にキャッシュを更新します
 */

(function() {
	'use strict';
	
	// ==========================================
	// バージョン設定 - サイト更新時にこの値を変更してください
	// ==========================================
	var SITE_VERSION = '1.0.1'; // 例: '1.0.0' -> '1.0.1'
	
	// バージョンキー
	var VERSION_KEY = 'site_version';
	var CACHE_TIMESTAMP_KEY = 'cache_timestamp';
	
	/**
	 * 保存されたバージョンを確認
	 */
	function checkVersion() {
		try {
			var storedVersion = localStorage.getItem(VERSION_KEY);
			var cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
			
			// バージョンが異なるか存在しない場合はキャッシュ更新が必要
			if (storedVersion !== SITE_VERSION) {
				console.log('🔄 Version update detected:', storedVersion, '->', SITE_VERSION);
				return false;
			}
			
			// バージョンは同じだがタイムスタンプがない場合は更新
			if (!cacheTimestamp) {
				console.log('⚠️ Cache timestamp missing');
				return false;
			}
			
			console.log('✅ Version check passed:', SITE_VERSION);
			return true;
		} catch (e) {
			console.error('❌ Version check error:', e);
			return false;
		}
	}
	
	/**
	 * バージョン情報を更新
	 */
	function updateVersion() {
		try {
			localStorage.setItem(VERSION_KEY, SITE_VERSION);
			localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
			console.log('✅ Version updated:', SITE_VERSION);
		} catch (e) {
			console.error('❌ Failed to update version:', e);
		}
	}
	
	/**
	 * キャッシュ更新 (hard reload)
	 */
	function refreshCache() {
		console.log('🔄 Refreshing cache...');
		
		// localStorageは維持し、バージョン関連情報のみ更新
		updateVersion();
		
		// ページをキャッシュなしでリロード
		// location.reload(true)はdeprecatedのため別の方法を使用
		if (window.performance && window.performance.navigation.type !== window.performance.navigation.TYPE_RELOAD) {
			// 初回ロード時のみ強制リフレッシュ
			window.location.href = window.location.href.split('?')[0] + '?v=' + SITE_VERSION + '&t=' + Date.now();
		}
	}
	
	/**
	 * 動的リソース読み込み (バージョンクエリパラメータを追加)
	 */
	function addVersionToResources() {
		// CSSファイルにバージョンを追加
		var cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
		for (var i = 0; i < cssLinks.length; i++) {
			var link = cssLinks[i];
			var href = link.getAttribute('href');
			// ローカルCSSファイルのみ対象 (外部CDN除外)
			if (href && href.indexOf('?') === -1 && href.indexOf('http') !== 0 && href.indexOf('//') !== 0) {
				var newHref = href + '?v=' + SITE_VERSION;
				link.setAttribute('href', newHref);
				console.log('✅ CSS versioned:', href, '->', newHref);
			}
		}
		
		// JSファイルにバージョンを追加
		var scripts = document.querySelectorAll('script[src]');
		for (var j = 0; j < scripts.length; j++) {
			var script = scripts[j];
			var src = script.getAttribute('src');
			// ローカルJSファイルのみ対象 (外部CDN、gtag除外)
			if (src && src.indexOf('?') === -1 && src.indexOf('http') !== 0 && 
			    src.indexOf('//') !== 0 && src.indexOf('gtag') === -1) {
				// 既にロードされたスクリプトは変更せず、ログのみ出力
				console.log('📝 JS file detected:', src);
			}
		}
	}
	
	/**
	 * Service Workerキャッシュをクリア (存在する場合)
	 */
	function clearServiceWorkerCache() {
		if ('serviceWorker' in navigator && 'caches' in window) {
			caches.keys().then(function(cacheNames) {
				return Promise.all(
					cacheNames.map(function(cacheName) {
						console.log('🗑️ Deleting cache:', cacheName);
						return caches.delete(cacheName);
					})
				);
			}).then(function() {
				console.log('✅ Service Worker cache cleared');
			}).catch(function(err) {
				console.error('❌ Failed to clear Service Worker cache:', err);
			});
		}
	}
	
	/**
	 * 初期化
	 */
	function init() {
		console.log('🚀 Version Manager initialized');
		console.log('📌 Current version:', SITE_VERSION);
		
		var isVersionValid = checkVersion();
		
		if (!isVersionValid) {
			console.warn('⚠️ Version mismatch detected - updating...');
			
			// Service Workerキャッシュをクリア
			clearServiceWorkerCache();
			
			// バージョン情報を更新
			updateVersion();
			
			// URLにバージョンパラメータがない場合は追加してリロード
			var urlParams = new URLSearchParams(window.location.search);
			var urlVersion = urlParams.get('v');
			
			if (urlVersion !== SITE_VERSION) {
				// 現在のURLにバージョンパラメータを追加
				var currentUrl = window.location.href.split('?')[0];
				var newUrl = currentUrl + '?v=' + SITE_VERSION + '&t=' + Date.now();
				
				// リダイレクトループを防止
				if (window.location.href !== newUrl) {
					console.log('🔄 Redirecting to:', newUrl);
					window.location.replace(newUrl);
					return;
				}
			}
		}
		
		// リソースにバージョンパラメータを追加
		addVersionToResources();
		
		// バージョン情報をwindowオブジェクトに保存
		window.SITE_VERSION = SITE_VERSION;
	}
	
	/**
	 * メタタグでバージョン情報を表示
	 */
	function addVersionMeta() {
		var meta = document.createElement('meta');
		meta.setAttribute('name', 'site-version');
		meta.setAttribute('content', SITE_VERSION);
		document.head.appendChild(meta);
	}
	
	// DOMが準備される前に実行
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			init();
			addVersionMeta();
		});
	} else {
		init();
		addVersionMeta();
	}
	
	// デバッグ用にエクスポート
	window.VersionManager = {
		version: SITE_VERSION,
		check: checkVersion,
		update: updateVersion,
		refresh: refreshCache,
		clearCache: clearServiceWorkerCache
	};
	
})();
