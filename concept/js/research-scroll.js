/**
 * Research Theme Section - Enhanced Scroll Animation
 * WiFi イメージの切り替えと研究テーマカードの表示
 */

(function() {
    'use strict';

    // DOM 要素
    let wifiImages;
    let signalDots;
    let researchTopics;
    let researchSection;
    let topicsPanel;

    // 状態変数
    let currentStep = 3; // wifi3から開始

    /**
     * WiFi イメージの切り替え
     */
    function switchWifiImage(step) {
        console.log('Switching WiFi to level:', step);
        
        wifiImages.forEach(img => {
            const wifiLevel = parseInt(img.dataset.wifi);
            if (wifiLevel === step) {
                img.classList.add('active');
                console.log('Activating wifi' + wifiLevel);
            } else {
                img.classList.remove('active');
            }
        });

        // シグナルドットの更新
        signalDots.forEach(dot => {
            const signalLevel = parseInt(dot.dataset.signal);
            if (signalLevel === step) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        currentStep = step;
    }

    /**
     * 研究テーマカードを表示
     */
    function showResearchTopic(index) {
        researchTopics.forEach((topic, i) => {
            if (i === index) {
                topic.classList.add('visible');
            } else {
                topic.classList.remove('visible');
            }
        });
    }

    /**
     * スクロールイベントハンドラー (右パネル用)
     */
    function handlePanelScroll() {
        if (!topicsPanel) {
            console.warn('Topics panel not found');
            return;
        }

        // モバイルかどうか判定
        const isMobile = window.innerWidth <= 1024;
        
        let clampedIndex = 0;
        
        if (isMobile) {
            // モバイル: 横スクロールを検出
            const scrollLeft = topicsPanel.scrollLeft;
            const panelWidth = topicsPanel.offsetWidth;

            // 現在のスクロール位置を基にカードインデックスを計算
            clampedIndex = Math.round(scrollLeft / panelWidth);
            clampedIndex = Math.max(0, Math.min(clampedIndex, researchTopics.length - 1));
            
            console.log('Mobile Horizontal Scroll:', {
                scrollLeft,
                panelWidth,
                clampedIndex
            });
        } else {
            // デスクトップ: 縦スクロールを検出
            const scrollTop = topicsPanel.scrollTop;
            const panelHeight = topicsPanel.offsetHeight;
            const currentIndex = Math.round(scrollTop / panelHeight);
            clampedIndex = Math.max(0, Math.min(currentIndex, researchTopics.length - 1));
            
            console.log('Desktop Vertical Scroll:', {
                scrollTop,
                panelHeight,
                clampedIndex
            });
        }

        // WiFi イメージ変更 (index 0 = wifi3, 1 = wifi2, 2 = wifi1)
        const wifiLevel = 3 - clampedIndex;
        
        switchWifiImage(wifiLevel);

        // すべてのカードのactiveクラスを削除し、現在のカードのみactiveにする
        researchTopics.forEach((topic, i) => {
            if (i === clampedIndex) {
                topic.classList.add('active');
            } else {
                topic.classList.remove('active');
            }
        });

        // モバイルスライドインジケーターを更新
        if (isMobile) {
            updateSlideIndicators(clampedIndex);
        }
    }

    /**
     * シグナルドットクリックイベント
     */
    function setupSignalDots() {
        signalDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const signalLevel = parseInt(this.dataset.signal);
                switchWifiImage(signalLevel);

                // 該当する研究テーマにスクロール (パネル内部で)
                const topicIndex = 3 - signalLevel; // wifi3=topic0, wifi2=topic1, wifi1=topic2
                if (researchTopics[topicIndex] && topicsPanel) {
                    const isMobile = window.innerWidth <= 1024;
                    const topic = researchTopics[topicIndex];
                    
                    if (isMobile) {
                        // モバイル: 横スクロールを検出
                        const topicLeft = topic.offsetLeft;
                        topicsPanel.scrollTo({
                            left: topicLeft,
                            behavior: 'smooth'
                        });
                    } else {
                        // デスクトップ: 縦スクロールを検出
                        const topicTop = topic.offsetTop;
                        const panelHeight = topicsPanel.offsetHeight;
                        const topicHeight = topic.offsetHeight;
                        
                        topicsPanel.scrollTo({
                            top: topicTop - (panelHeight / 2) + (topicHeight / 2),
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * モバイル用スライドインジケーターの作成
     */
    function createSlideIndicators() {
        const isMobile = window.innerWidth <= 1024;
        if (!isMobile) return;

        // 既存のインジケーターを削除
        const existingIndicator = document.querySelector('.mobile-slide-indicators');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // 新しいインジケーターコンテナを作成
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'mobile-slide-indicators';
        indicatorContainer.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 100;
            padding: 10px;
        `;

        // 各カードに対するドットを生成
        researchTopics.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slide-indicator-dot';
            dot.dataset.index = index;
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transition: all 0.3s ease;
                cursor: pointer;
            `;
            
            if (index === 0) {
                dot.style.background = 'rgba(30, 144, 255, 1)';
                dot.style.width = '24px';
                dot.style.borderRadius = '4px';
            }

            // ドットクリックイベント
            dot.addEventListener('click', function() {
                const targetIndex = parseInt(this.dataset.index);
                if (researchTopics[targetIndex]) {
                    const topicLeft = researchTopics[targetIndex].offsetLeft;
                    topicsPanel.scrollTo({
                        left: topicLeft,
                        behavior: 'smooth'
                    });
                }
            });

            indicatorContainer.appendChild(dot);
        });

        const wrapper = document.querySelector('.research-content-wrapper');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.appendChild(indicatorContainer);
        }
    }

    /**
     * スライドインジケーターを更新
     */
    function updateSlideIndicators(activeIndex) {
        const dots = document.querySelectorAll('.slide-indicator-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.style.background = 'rgba(30, 144, 255, 1)';
                dot.style.width = '24px';
                dot.style.borderRadius = '4px';
            } else {
                dot.style.background = 'rgba(255, 255, 255, 0.5)';
                dot.style.width = '8px';
                dot.style.borderRadius = '50%';
            }
        });
    }

    /**
     * 初期化
     */
    function init() {
        console.log('=== Research Scroll Init ===');
        
        // DOM 要素の取得
        wifiImages = document.querySelectorAll('.wifi-image-stack .wifi-image');
        signalDots = document.querySelectorAll('.signal-dot');
        researchTopics = document.querySelectorAll('.research-topic-item');
        researchSection = document.getElementById('fh5co-counter');
        topicsPanel = document.querySelector('.research-topics-panel');
        
        console.log('✅ WiFi images:', wifiImages ? wifiImages.length : 0);
        console.log('✅ Research topics:', researchTopics ? researchTopics.length : 0);
        console.log('✅ Topics panel:', topicsPanel ? 'Found' : 'Not found');
        
        if (!topicsPanel) {
            console.error('❌ Topics panel not found!');
            return false;
        }

        if (!wifiImages || wifiImages.length === 0) {
            console.error('❌ No WiFi images found!');
            return false;
        }

        if (!researchTopics || researchTopics.length === 0) {
            console.error('❌ No research topics found!');
            return false;
        }

        console.log('✅ All elements found, initializing...');

        // 初期状態の設定
        switchWifiImage(3);
        if (researchTopics.length > 0) {
            researchTopics[0].classList.add('active');
        }

        // シグナルドット設定
        setupSignalDots();

        // モバイル用スライドインジケーターの作成
        createSlideIndicators();

        // 右側パネルのスクロールイベントリスナー (throttle適用)
        let ticking = false;
        let lastScrollTime = 0;
        topicsPanel.addEventListener('scroll', function() {
            const now = Date.now();
            // あまりにも頻繁に実行されないようにthrottle (60fps = 16ms)
            if (now - lastScrollTime < 16) return;
            lastScrollTime = now;
            
            console.log('📜 Scroll event triggered');
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handlePanelScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true }); // passive でパフォーマンス向上

        console.log('✅ Scroll listener attached');

        // パネルが初期化されたことを示す
        topicsPanel.dataset.initialized = 'true';

        // 初期スクロール位置チェック
        setTimeout(function() {
            console.log('⏰ Initial scroll check');
            handlePanelScroll();
        }, 100);

        // モバイル対応
        if (window.innerWidth <= 1024) {
            // モバイルでは最初のカードを活性化
            if (researchTopics.length > 0) {
                researchTopics[0].classList.add('active');
            }
            // タッチイベントも処理
            topicsPanel.addEventListener('touchmove', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        handlePanelScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
        
        return true;
    }

    /**
     * ウィンドウリサイズハンドラー
     */
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (topicsPanel) {
                handlePanelScroll();
                // リサイズ時にインジケーターを再生成
                createSlideIndicators();
            }
        }, 150);
    });

    // DOM ロード後初期化
    function tryInit() {
        console.log('🚀 Trying to initialize... (readyState: ' + document.readyState + ')');
        const success = init();
        if (!success) {
            console.log('⏳ Init failed, will retry...');
        }
        return success;
    }

    // さまざまなタイミングで初期化を試みる
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        // ドキュメントがすでに読み込まれているか、完了している場合
        setTimeout(tryInit, 0);
    }

    // 追加の安全装置: window.load 時にも再試行
    window.addEventListener('load', function() {
        console.log('🔄 Window loaded, checking initialization...');
        const panel = document.querySelector('.research-topics-panel');
        if (!panel || !panel.dataset.initialized) {
            console.log('🔄 Retrying init on window.load');
            setTimeout(tryInit, 100);
        }
    });

})();
