/**
 * Research Theme Section - Enhanced Scroll Animation
 * WiFi 이미지와 연구 테마 카드의 동적 스크롤 효과
 */

(function() {
    'use strict';

    // DOM 요소 - 나중에 초기화
    let wifiImages;
    let signalDots;
    let researchTopics;
    let researchSection;
    let topicsPanel;

    // 현재 활성화된 단계
    let currentStep = 3; // wifi3부터 시작

    /**
     * WiFi 이미지 전환
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

        // 시그널 도트 업데이트
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
     * 연구 테마 카드 표시
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
     * 스크롤 이벤트 핸들러 (오른쪽 패널용)
     */
    function handlePanelScroll() {
        if (!topicsPanel) {
            console.warn('Topics panel not found');
            return;
        }

        // 모바일 디바이스인지 확인
        const isMobile = window.innerWidth <= 1024;
        
        let clampedIndex = 0;
        
        if (isMobile) {
            // 모바일: 가로 스크롤 감지
            const scrollLeft = topicsPanel.scrollLeft;
            const panelWidth = topicsPanel.offsetWidth;
            
            // 현재 스크롤 위치를 기반으로 카드 인덱스 계산
            clampedIndex = Math.round(scrollLeft / panelWidth);
            clampedIndex = Math.max(0, Math.min(clampedIndex, researchTopics.length - 1));
            
            console.log('Mobile Horizontal Scroll:', {
                scrollLeft,
                panelWidth,
                clampedIndex
            });
        } else {
            // 데스크톱: 세로 스크롤
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
        
        // WiFi 이미지 변경 (index 0 = wifi3, 1 = wifi2, 2 = wifi1)
        const wifiLevel = 3 - clampedIndex;
        
        switchWifiImage(wifiLevel);
        
        // 모든 카드의 active 클래스 제거 후 현재 카드만 active
        researchTopics.forEach((topic, i) => {
            if (i === clampedIndex) {
                topic.classList.add('active');
            } else {
                topic.classList.remove('active');
            }
        });

        // 모바일 슬라이드 인디케이터 업데이트
        if (isMobile) {
            updateSlideIndicators(clampedIndex);
        }
    }

    /**
     * 시그널 도트 클릭 이벤트
     */
    function setupSignalDots() {
        signalDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const signalLevel = parseInt(this.dataset.signal);
                switchWifiImage(signalLevel);
                
                // 해당 연구 테마로 스크롤 (패널 내부에서)
                const topicIndex = 3 - signalLevel; // wifi3=topic0, wifi2=topic1, wifi1=topic2
                if (researchTopics[topicIndex] && topicsPanel) {
                    const isMobile = window.innerWidth <= 1024;
                    const topic = researchTopics[topicIndex];
                    
                    if (isMobile) {
                        // 모바일: 가로 스크롤
                        const topicLeft = topic.offsetLeft;
                        topicsPanel.scrollTo({
                            left: topicLeft,
                            behavior: 'smooth'
                        });
                    } else {
                        // 데스크톱: 세로 스크롤
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
     * 모바일 슬라이드 인디케이터 생성
     */
    function createSlideIndicators() {
        const isMobile = window.innerWidth <= 1024;
        if (!isMobile) return;

        // 기존 인디케이터 제거
        const existingIndicator = document.querySelector('.mobile-slide-indicators');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // 새 인디케이터 컨테이너 생성
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

        // 각 카드에 대한 도트 생성
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

            // 도트 클릭 이벤트
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
     * 슬라이드 인디케이터 업데이트
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
     * 초기화
     */
    function init() {
        console.log('=== Research Scroll Init ===');
        
        // DOM 요소 다시 가져오기
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

        // 초기 상태 설정
        switchWifiImage(3);
        if (researchTopics.length > 0) {
            researchTopics[0].classList.add('active');
        }
        
        // 시그널 도트 설정
        setupSignalDots();

        // 모바일 슬라이드 인디케이터 생성
        createSlideIndicators();

        // 오른쪽 패널의 스크롤 이벤트 리스너 (throttle 적용)
        let ticking = false;
        let lastScrollTime = 0;
        topicsPanel.addEventListener('scroll', function() {
            const now = Date.now();
            // 너무 자주 실행되지 않도록 throttle (60fps = 16ms)
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
        }, { passive: true }); // passive 옵션으로 성능 개선

        console.log('✅ Scroll listener attached');
        
        // 패널이 초기화되었음을 표시
        topicsPanel.dataset.initialized = 'true';

        // 초기 스크롤 위치 체크
        setTimeout(function() {
            console.log('⏰ Initial scroll check');
            handlePanelScroll();
        }, 100);

        // 모바일에서는 초기 스크롤 동작 개선
        if (window.innerWidth <= 1024) {
            // 모바일에서는 첫 번째 카드를 활성화
            if (researchTopics.length > 0) {
                researchTopics[0].classList.add('active');
            }
            // 터치 이벤트도 처리
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
     * 윈도우 리사이즈 핸들러
     */
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (topicsPanel) {
                handlePanelScroll();
                // 리사이즈 시 인디케이터 재생성
                createSlideIndicators();
            }
        }, 150);
    });

    // DOM 로드 후 초기화
    function tryInit() {
        console.log('🚀 Trying to initialize... (readyState: ' + document.readyState + ')');
        const success = init();
        if (!success) {
            console.log('⏳ Init failed, will retry...');
        }
        return success;
    }
    
    // 여러 시점에서 초기화 시도
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        // 문서가 이미 로드 중이거나 완료된 경우
        setTimeout(tryInit, 0);
    }
    
    // 추가 안전장치: window.load 시에도 재시도
    window.addEventListener('load', function() {
        console.log('🔄 Window loaded, checking initialization...');
        const panel = document.querySelector('.research-topics-panel');
        if (!panel || !panel.dataset.initialized) {
            console.log('🔄 Retrying init on window.load');
            setTimeout(tryInit, 100);
        }
    });

})();
