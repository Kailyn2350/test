;(function () {
	
	'use strict';

    console.log('main.js is running!'); // Debugging log

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};


	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
				
	    	}
	    
	    	
	    }
		});

	};


	var scrollNavBar = function() {

		if ( $(window).scrollTop() > 50)  {
			$('body').addClass('scrolled');
			$('.js-fh5co-nav-toggle').removeClass('fh5co-nav-white');
		} else {
			$('body').removeClass('scrolled');
			$('.js-fh5co-nav-toggle').addClass('fh5co-nav-white');
		}

		$(window).scroll(function(){
			if ( $(window).scrollTop() > 50)  {
				$('body').addClass('scrolled');
				$('.js-fh5co-nav-toggle').removeClass('fh5co-nav-white');
			} else {
				$('body').removeClass('scrolled');
				$('.js-fh5co-nav-toggle').addClass('fh5co-nav-white');
			}
		});


	};

	var offcanvasMenu = function() {

		$('#page').prepend('<div id="fh5co-offcanvas" />');
		$('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
		var clone1 = $('.menu-1 > ul').clone();
		$('#fh5co-offcanvas').append(clone1);
		var clone2 = $('.menu-2 > ul').clone();
		$('#fh5co-offcanvas').append(clone2);

		$('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
		$('#fh5co-offcanvas')
			.find('li')
			.removeClass('has-dropdown');

		// Hover dropdown menu on mobile
		$('.offcanvas-has-dropdown').mouseenter(function(){
			var $this = $(this);

			$this
				.addClass('active')
				.find('ul')
				.slideDown(500, 'easeOutExpo');				
		}).mouseleave(function(){

			var $this = $(this);
			$this
				.removeClass('active')
				.find('ul')
				.slideUp(500, 'easeOutExpo');				
		});


		$(window).resize(function(){

			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
				
	    	}
		});
	};


	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){
			var $this = $(this);


			if ( $('body').hasClass('overflow offcanvas') ) {
				$('body').removeClass('overflow offcanvas');
			} else {
				$('body').addClass('overflow offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};



	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			// 이미 애니메이션이 적용된 요소는 스킵
			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '75%' } );
	};


	var dropdown = function() {

		$('.has-dropdown').mouseenter(function(){

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function(){
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	var resetCounter = function(){
		$('.js-counter').each(function(){
		   $(this).text($(this).data('from') || 0);    // countTo の開始値
		});
	  };
	  

	var counterWayPoint = function() {
		if ($('#fh5co-counter').length > 0 ) {
			
			$('#fh5co-counter').waypoint(function(direction){
				if( direction === 'down' ){
					counter();                 // 毎回スタート
				}else if( direction === 'up' ){
					resetCounter();            // 通り過ぎて上に戻ったときにリセット
				}
			  }, { offset: '90%' });
		}
	};

	var parallax = function() {
		if ( !isMobile.any()) {
			$(window).stellar();
		}
	};

	// タイピングアニメーション効果
	var typewriterEffect = function() {
		// 로딩 화면이 있는 경우 완료될 때까지 대기
		var loadingScreen = document.getElementById('loading-screen');
		var shouldWaitForLoading = loadingScreen && !sessionStorage.getItem('hasVisited');
		
		var titleElement = document.querySelector('#main-title');
		
		// ページURLに基づいてデフォルトテキストを決定
		var currentPage = window.location.pathname.split('/').pop();
		var defaultLines;
		
		if (currentPage === 'research.html') {
			defaultLines = [
				"Research",
				"Communications and",
				"Machine Learning Lab"
			];
		} else {
			// index.htmlおよびその他のページ用
			defaultLines = [
				"Wireless",
				"Communications and",
				"Machine Learning Lab"
			];
		}
		
		var lines = [];

		if (titleElement) {
			if (titleElement.dataset.title) {
				// data-title属性がある場合は、その値を単一の行として使用
				lines = [titleElement.dataset.title];
				console.log('Using data-title:', titleElement.dataset.title);
			} else {
				// data-title属性がない場合（index.htmlなど）は、デフォルトの複数行を使用
				var lineElements = titleElement.querySelectorAll('.typing-text');
				if (lineElements.length > 0) {
					lines = defaultLines;
					console.log('Using default lines:', defaultLines);
				}
			}
		}

		if (lines.length === 0) {
			// アニメーション対象がない場合は何もしない
			console.log('No lines to animate');
			return;
		}
		
		console.log('Starting typewriter effect with lines:', lines);

		// ページ ロード 即時 すべて の カーソル を 隠す
		function initializeCursors() {
			for (var i = 1; i <= lines.length; i++) {
				var cursor = document.querySelector('#cursor' + i);
				if (cursor) {
					cursor.style.opacity = '0';
					cursor.style.animation = 'none';
					cursor.style.display = 'inline';
					cursor.style.borderRightColor = 'transparent';
				}
			}
		}
		
		// 即時 カーソル を 隠す
		initializeCursors();
		
		var currentLine = 0;
		var currentChar = 0;
		
		function showCursor(lineNum) {
			var cursor = document.querySelector('#cursor' + (lineNum + 1));
			if (cursor) {
				cursor.style.opacity = '1';
				cursor.style.borderRightColor = 'rgba(255, 255, 255, 0.8)';
				cursor.style.animation = 'none';
				setTimeout(function() {
					if (cursor) {
						cursor.style.animation = 'blink 1s infinite';
					}
				}, 50);
			}
		}
		
		function hideCursor(lineNum) {
			var cursor = document.querySelector('#cursor' + (lineNum + 1));
			if (cursor) {
				cursor.style.animation = 'none';
				cursor.style.borderRightColor = 'transparent';
				cursor.style.opacity = '0';
			}
		}
		
		function typeWriter() {
			if (currentLine < lines.length) {
				var currentText = lines[currentLine];
				var typingElement = document.querySelector('#line' + (currentLine + 1));
				
				if (!typingElement) {
					console.error('Typing element not found: #line' + (currentLine + 1));
					return; // 要素がなければ終了
				}

				if (currentChar === 0) {
					// 新しい 行 を 開始 する とき カーソル を 表示
					console.log('Starting line', currentLine + 1, ':', currentText);
					showCursor(currentLine);
				}
				
				if (currentChar < currentText.length) {
					// 文字 を 追加
					typingElement.textContent += currentText.charAt(currentChar);
					currentChar++;
					setTimeout(typeWriter, 100);
				} else {
					// 現在 の 行 が 完了
					setTimeout(function() {
						// カーソル を 隠し て 次 の 行 へ
						hideCursor(currentLine);
						currentLine++;
						currentChar = 0;
						
						if (currentLine < lines.length) {
							// 次 の 行 を 開始
							setTimeout(typeWriter, 100);
						} else {
							// すべて の 行 が 完了
							setTimeout(function() {
								// 最後 の カーソル も 隠す
								if (currentLine > 0) {
									hideCursor(currentLine - 1);
								}
							}, 1000);
						}
					}, 200);
				}
			}
		}

		// ページ ロード 後 少し の 遅延 後 アニメーション 開始
		// 로딩 화면이 있으면 완전히 사라진 후에 타이핑 시작 (3.8초 = 2.5초 로딩 + 0.8초 페이드아웃 + 0.5초 여유)
		// 로딩 화면이 없으면 바로 시작 (500ms)
		var delay = shouldWaitForLoading ? 3800 : 500;
		setTimeout(function() {
			// 一度 すべて の カーソル を 確実 に 隠す
			initializeCursors();
			typeWriter();
		}, delay);
	};

	// マウス追従効果
	var mouseFollowEffect = function() {
		// モバイルデバイスでは無効化
		if (isMobile.any()) {
			return;
		}

		var header = document.querySelector('#fh5co-header');
		var titleElement = document.querySelector('#main-title');
		var subTitleElement = document.querySelector('#sub-title');

		if (!header || !titleElement) return;

		// パーティクル効果用のコンテナを作成
		var particleContainer = document.createElement('div');
		particleContainer.className = 'interactive-bg';
		header.appendChild(particleContainer);

		var particles = [];
		var mouseX = 0;
		var mouseY = 0;

		// マウス移動イベント
		header.addEventListener('mousemove', function(e) {
			var rect = header.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;

			// タイトルテキストの微妙な追従効果
			var moveX = (mouseX - rect.width / 2) * 0.02;
			var moveY = (mouseY - rect.height / 2) * 0.02;
			titleElement.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
			
			// サブタイトルも同じように動かす
			if (subTitleElement) {
				subTitleElement.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
			}

			// パーティクル生成（確率的に）
			if (Math.random() < 0.3) {
				createParticle(mouseX, mouseY);
			}
		});

		// パーティクル生成関数
		function createParticle(x, y) {
			var particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.left = x + 'px';
			particle.style.top = y + 'px';
			particleContainer.appendChild(particle);

			// パーティクルを配列に追加
			particles.push(particle);

			// 3秒後にパーティクルを削除
			setTimeout(function() {
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
				var index = particles.indexOf(particle);
				if (index > -1) {
					particles.splice(index, 1);
				}
			}, 3000);
		}

		// マウスがヘッダーから離れた時の処理
		header.addEventListener('mouseleave', function() {
			titleElement.style.transform = 'translate(0px, 0px)';
			if (subTitleElement) {
				subTitleElement.style.transform = 'translate(0px, 0px)';
			}
		});
	};

	
	$(function(){
		mobileMenuOutsideClick();
		scrollNavBar();
		offcanvasMenu();
		burgerMenu();
		contentWayPoint();
		dropdown();
		goToTop();
		loaderPage();
		counterWayPoint();
		parallax();
		typewriterEffect();
		mouseFollowEffect();
	});


}());