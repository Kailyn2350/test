/**
 * Particle Repel Effect
 * 마우스를 피해가는 입자 효과
 */

(function() {
    'use strict';

    // Canvas 설정
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2';

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    // 입자 클래스
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.originalX = x;
            this.originalY = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(30, 144, 255, ${Math.random() * 0.5 + 0.3})`;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // 마우스와의 거리 계산
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 마우스가 가까이 있으면 밀어냄
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                this.x -= Math.cos(angle) * force * 5;
                this.y -= Math.sin(angle) * force * 5;
            } else {
                // 원래 위치로 천천히 복귀
                const returnForce = 0.05;
                this.x += (this.originalX - this.x) * returnForce;
                this.y += (this.originalY - this.y) * returnForce;
            }

            // 기본 움직임
            this.x += this.speedX;
            this.y += this.speedY;

            // 경계 체크
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
            }

            this.draw();
        }
    }

    // Canvas 초기화
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 입자 생성
    function createParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }

    // 애니메이션 루프
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 연결선 그리기
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(30, 144, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // 입자 업데이트
        particles.forEach(particle => particle.update());

        animationId = requestAnimationFrame(animate);
    }

    // 마우스 이벤트
    function handleMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    function handleMouseLeave() {
        mouse.x = null;
        mouse.y = null;
    }

    // 리사이즈 이벤트
    function handleResize() {
        initCanvas();
        createParticles();
    }

    // 초기화
    function init() {
        const header = document.getElementById('fh5co-header');
        if (!header) {
            console.warn('Header not found for particle effect');
            return;
        }

        // Canvas를 header에 추가
        header.style.position = 'relative';
        header.insertBefore(canvas, header.firstChild);

        initCanvas();
        createParticles();
        animate();

        // 이벤트 리스너
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        console.log('✅ Particle repel effect initialized');
    }

    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    // cleanup
    window.addEventListener('beforeunload', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
    });

})();
