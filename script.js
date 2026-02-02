document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    switchTab('about');

    
    function updateThemeIcon(isDark) {
    if (!themeIcon) return;
    if (isDark) {
        themeIcon.className = 'fas fa-moon theme-toggle-icon';
    } else {
        themeIcon.className = 'fas fa-sun theme-toggle-icon';
    }
}
});

//Tabs 
function switchTab(tabId) {
    window.switchTab = switchTab;
    //hide all content
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
    });

    //show active tab
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
        activeContent.classList.remove('hidden');
        activeContent.classList.remove('animate-fade-in', 'animate-slide-up');
        void activeContent.offsetWidth;
        activeContent.classList.add(tabId === 'about' ? 'animate-fade-in' : 'animate-slide-up');
    }


    //update nav tab
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-tab') === tabId;
        const iconBg = btn.querySelector('.nav-icon-bg');
        const indicator = btn.querySelector('.active-indicator');

        if (isActive) {
            btn.classList.add('active');
            btn.classList.remove('text-slate-500', 'dark:text-slate-400', 'hover:text-slate-700', 'dark:hover:text-slate-200');
            btn.classList.add('text-primary-600', 'dark:text-primary-400', 'font-medium');
            iconBg.classList.add('bg-primary-100', 'dark:bg-primary-500/10', 'scale-110');
            iconBg.classList.remove('group-hover:bg-slate-100', 'dark:group-hover:bg-slate-700/50');
            indicator.classList.remove('hidden');
        } else {
            btn.classList.remove('active');
            btn.classList.remove('text-primary-600', 'dark:text-primary-400', 'font-medium');
            btn.classList.add('text-slate-500', 'dark:text-slate-400', 'hover:text-slate-700', 'dark:hover:text-slate-200');
            iconBg.classList.remove('bg-primary-100', 'dark:bg-primary-500/10', 'scale-110');
            iconBg.classList.add('group-hover:bg-slate-100', 'dark:group-hover:bg-slate-700/50');
            indicator.classList.add('hidden');
        }
    });


    //scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.switchTab = switchTab;

//Theme
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    if (!themeIcon) return;
    if (isDark) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}


//Background
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const particleCount = width < 768 ? 50 : 100;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 1.5,
            });
        }
    }

    function animate() {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.clearRect(0, 0, width, height);
        
        const connectionDistance = 120;
        const mouseDistance = 200;

        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? 'rgba(56, 232, 255, 0.6)' : 'rgba(14, 165, 233, 0.6)';
            ctx.fill();

            // Connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = isDark 
                        ? `rgba(56, 232, 255, ${0.15 * (1 - dist / connectionDistance)})` 
                        : `rgba(14, 165, 233, ${0.15 * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                };
            }

            //mouse connection
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseDistance) {
                 p.x -= dx * 0.01;
                 p.y -= dy * 0.01;
                 
                 ctx.beginPath();
                 ctx.strokeStyle = isDark 
                   ? `rgba(56, 232, 255, ${0.25 * (1 - dist / mouseDistance)})` 
                   : `rgba(14, 165, 233, ${0.25 * (1 - dist / mouseDistance)})`;
                 ctx.lineWidth = 1;
                 ctx.moveTo(p.x, p.y);
                 ctx.lineTo(mouse.x, mouse.y);
                 ctx.stroke();
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY;
    
    });
    window.addEventListener('touchmove', e => {
        if(e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    resize();
    animate();
})();