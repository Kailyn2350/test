document.addEventListener('DOMContentLoaded', function() {
    // タイプライターエフェクトの関数
    function typeWriter(text, targetId, cursorId, callback) {
        const target = document.getElementById(targetId);
        const cursor = document.getElementById(cursorId);
        let i = 0;
        cursor.style.display = 'inline-block';

        function typing() {
            if (i < text.length) {
                target.innerHTML = text.substring(0, i + 1);
                i++;
                setTimeout(typing, 100); // タイピングの速度を調整（ミリ秒）
            } else {
                if (callback) callback();
            }
        }
        typing();
    }

    // メインタイトルのアニメーション
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        const titleText = mainTitle.getAttribute('data-title');
        if (titleText) {
            typeWriter(titleText, 'line1', 'cursor1');
        }
    }
});
