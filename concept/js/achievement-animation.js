/**
 * 3D Donut Chart for Achievement Section
 * Chart.jsを使用した3Dドーナツチャート
 */

(function() {
    'use strict';

    let chart = null;
    let animated = false;
    let currentHoverCard = null;
    let pluginRegistered = false;

    const chartData = {
        labels: ['Journal Papers', 'International Conference', 'Domestic Conference', 'MISC'],
        datasets: [{
            data: [23, 27, 46, 3],
            backgroundColor: [
                'rgba(30, 144, 255, 0.9)',    // Journal - Blue
                'rgba(135, 206, 235, 0.9)',   // International - Sky Blue  
                'rgba(255, 193, 86, 0.9)',    // Domestic - Orange/Yellow
                'rgba(236, 112, 176, 0.9)'    // MISC - Pink
            ],
            borderColor: '#ffffff',
            borderWidth: 4,
            hoverOffset: 25,
            hoverBackgroundColor: [
                'rgba(30, 144, 255, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(255, 193, 86, 1)',
                'rgba(236, 112, 176, 1)'
            ]
        }]
    };

    const cardIds = ['detail-journal', 'detail-international', 'detail-domestic', 'detail-misc'];

    /**
     * 要素が画面内に入ったかチェック
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * 0.8 &&
            rect.bottom >= 0
        );
    }

    /**
     * 詳細カードを表示（ホバー時のみ）
     */
    function showDetailCard(index) {
        // 既存のカードを非表示
        hideAllDetailCards();

        // 新しいカードを表示
        const card = document.getElementById(cardIds[index]);
        if (card) {
            card.classList.add('active');
            currentHoverCard = index;
        }
    }

    /**
     * すべての詳細カードを非表示
     */
    function hideAllDetailCards() {
        cardIds.forEach(id => {
            const card = document.getElementById(id);
            if (card) {
                card.classList.remove('active');
            }
        });
        currentHoverCard = null;
    }

    /**
     * チャートを作成
     */
    function createChart() {
        const canvas = document.getElementById('achievement-donut-chart');
        if (!canvas) {
            console.warn('Chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');

        // 플러그인을 한 번만 등록
        if (!pluginRegistered && typeof ChartDataLabels !== 'undefined') {
            Chart.register(ChartDataLabels);
            Chart.defaults.set('plugins.datalabels', {
                display: false  // 기본적으로 비활성화
            });
            pluginRegistered = true;
        }

        chart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: 30
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    },
                    datalabels: {
                        display: true,
                        color: function(context) {
                            // 호버 시 텍스트도 강조
                            const chart = context.chart;
                            const activeElements = chart.getActiveElements();
                            const isHovered = activeElements.some(el => el.index === context.dataIndex);
                            return isHovered ? '#000000' : '#2c3e50';
                        },
                        font: function(context) {
                            const percentage = (context.dataset.data[context.dataIndex] / context.dataset.data.reduce((a, b) => a + b, 0)) * 100;
                            const chart = context.chart;
                            const activeElements = chart.getActiveElements();
                            const isHovered = activeElements.some(el => el.index === context.dataIndex);
                            const label = chart.data.labels[context.dataIndex];
                            const baseSize = percentage < 5 ? 10 : 14;
                            const hoverSize = percentage < 5 ? 12 : 16;
                            const adjustment = label === 'International Conference' ? -1 : 0;
                            // 호버 시 폰트도 커지게
                            return {
                                size: isHovered ? hoverSize + adjustment : baseSize + adjustment,
                                weight: 'bold',
                                family: "'Open Sans', Arial, sans-serif"
                            };
                        },
                        formatter: function(value, context) {
                            const label = context.chart.data.labels[context.dataIndex];
                            
                            // 한 줄로 간단하게 표시
                            if (label === 'Journal Papers') {
                                return 'Journal: ' + value;
                            } else if (label === 'International Conference') {
                                return 'International: ' + value;
                            } else if (label === 'Domestic Conference') {
                                return 'Domestic: ' + value;
                            } else if (label === 'MISC') {
                                return 'MISC: ' + value;
                            }
                            return label + ': ' + value;
                        },
                        textAlign: 'center',
                        anchor: 'center',
                        align: 'center',
                        offset: 0,
                        padding: 8,
                        backgroundColor: function(context) {
                            // 호버 시 배경 강조
                            const chart = context.chart;
                            const activeElements = chart.getActiveElements();
                            const isHovered = activeElements.some(el => el.index === context.dataIndex);
                            return isHovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.85)';
                        },
                        borderRadius: 6,
                        borderWidth: 0
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                cutout: '50%',
                radius: '85%',
                rotation: -90,
                circumference: 360,
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                    
                    // ホバー時に詳細カードを表示 & チャートを更新
                    if (activeElements.length > 0) {
                        const index = activeElements[0].index;
                        if (currentHoverCard !== index) {
                            showDetailCard(index);
                            // チャートを更新してラベルの背景色を変更
                            chart.update('none');
                        }
                    } else {
                        hideAllDetailCards();
                        chart.update('none');
                    }
                }
            }
        });

        console.log('✅ 3D Donut chart created');
    }

    /**
     * チャートをアニメーション
     */
    function animateChart() {
        if (animated) return;

        const counterSection = document.getElementById('fh5co-counter');
        if (!counterSection) return;

        if (isElementInViewport(counterSection)) {
            createChart();
            animated = true;
        }
    }

    /**
     * スクロールイベントハンドラー
     */
    let ticking = false;
    function handleScroll() {
        if (!ticking && !animated) {
            window.requestAnimationFrame(() => {
                animateChart();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Chart.jsの読み込みを確認して初期化
     */
    function init() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        const counterSection = document.getElementById('fh5co-counter');
        
        if (!counterSection) {
            console.warn('Achievement counter section not found');
            return;
        }

        console.log('✅ Achievement donut chart initialized');

        // 初期チェック
        setTimeout(animateChart, 100);

        // スクロールイベントリスナー
        window.addEventListener('scroll', handleScroll);
    }

    /**
     * クリーンアップ
     */
    function cleanup() {
        window.removeEventListener('scroll', handleScroll);
        if (chart) {
            chart.destroy();
        }
    }

    // Chart.jsが読み込まれるまで待つ
    function waitForChartJs() {
        if (typeof Chart !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                setTimeout(init, 100);
            }
        } else {
            setTimeout(waitForChartJs, 100);
        }
    }

    waitForChartJs();

    // ページ離脱時のクリーンアップ
    window.addEventListener('beforeunload', cleanup);

})();
