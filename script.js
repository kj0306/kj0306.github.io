// ===== MOBILE NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// ===== INTERSECTION OBSERVER — SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(
    '.education-card, .timeline-item, .project-card, .recommendation-card, .contact-item'
).forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
});

// ===== SKILLS INTERACTIVE DASHBOARD =====

// Skill data for the radar chart
const radarData = {
    labels: ['Languages', 'AI / ML', 'Data Eng', 'Cloud', 'Analytics'],
    values: [0.82, 0.90, 0.85, 0.85, 0.84],   // 0–1 scale
    colors: ['#C8963E', '#2D6A8C', '#3A6B1E', '#8B5A2B', '#6B3A8C']
};

// Render SVG Radar Chart
function renderRadarChart() {
    const svg = document.getElementById('radar-chart');
    if (!svg) return;

    const cx = 150, cy = 140, R = 100;
    const levels = 5;
    const n = radarData.labels.length;

    svg.innerHTML = '';

    function polarToCart(angle, r) {
        const rad = (angle - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    // Draw grid rings
    for (let l = 1; l <= levels; l++) {
        const r = (R / levels) * l;
        const pts = Array.from({ length: n }, (_, i) => {
            const p = polarToCart((360 / n) * i, r);
            return `${p.x},${p.y}`;
        }).join(' ');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', pts);
        poly.setAttribute('fill', 'none');
        poly.setAttribute('stroke', l === levels ? '#C8963E' : '#EDE5D8');
        poly.setAttribute('stroke-width', l === levels ? '1.5' : '1');
        svg.appendChild(poly);
    }

    // Draw axes
    for (let i = 0; i < n; i++) {
        const angle = (360 / n) * i;
        const end = polarToCart(angle, R);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx); line.setAttribute('y1', cy);
        line.setAttribute('x2', end.x); line.setAttribute('y2', end.y);
        line.setAttribute('stroke', '#EDE5D8');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Draw data polygon
    const dataPoints = radarData.values.map((v, i) => {
        const p = polarToCart((360 / n) * i, v * R);
        return `${p.x},${p.y}`;
    }).join(' ');

    const fill = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    fill.setAttribute('points', dataPoints);
    fill.setAttribute('fill', 'rgba(200,150,62,0.18)');
    fill.setAttribute('stroke', '#C8963E');
    fill.setAttribute('stroke-width', '2');
    svg.appendChild(fill);

    // Draw data dots + colored per axis
    radarData.values.forEach((v, i) => {
        const p = polarToCart((360 / n) * i, v * R);
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', radarData.colors[i]);
        dot.setAttribute('stroke', 'white');
        dot.setAttribute('stroke-width', '2');
        svg.appendChild(dot);
    });

    // Labels
    radarData.labels.forEach((label, i) => {
        const angle = (360 / n) * i;
        const labelR = R + 22;
        const p = polarToCart(angle, labelR);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', p.x);
        text.setAttribute('y', p.y + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#1A2B4A');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-family', 'DM Sans, sans-serif');
        text.setAttribute('font-weight', '600');
        text.textContent = label;
        svg.appendChild(text);
    });

    // Center label
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', cx);
    centerText.setAttribute('y', cy);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('dominant-baseline', 'middle');
    centerText.setAttribute('fill', '#C8963E');
    centerText.setAttribute('font-size', '10');
    centerText.setAttribute('font-family', 'Cormorant Garamond, serif');
    centerText.setAttribute('font-style', 'italic');
    centerText.textContent = 'KJ';
    svg.appendChild(centerText);
}

// Skill Tab Switching
function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.skill-bars-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            const category = tab.dataset.category;
            panels.forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`panel-${category}`);
            if (panel) {
                panel.classList.add('active');
                animateBarsInPanel(panel);
            }
        });
    });

    // Animate bars when skills section enters view
    const skillsSection = document.getElementById('skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const activePanel = document.querySelector('.skill-bars-panel.active');
            if (activePanel) animateBarsInPanel(activePanel);
            skillsObserver.disconnect();
        }
    }, { threshold: 0.3 });
    if (skillsSection) skillsObserver.observe(skillsSection);
}

function animateBarsInPanel(panel) {
    const fills = panel.querySelectorAll('.sb-fill');
    fills.forEach((fill, i) => {
        const pct = fill.dataset.pct || 0;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = `${pct}%`;
        }, i * 80 + 50);
    });
}

// ===== PROJECT CARDS TILT EFFECT =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = (y - cy) / 25;
        const rotY = (cx - x) / 25;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.18}px)`;
    }
});

// ===== INIT =====
window.addEventListener('load', () => {
    renderRadarChart();
    initSkillTabs();
    document.body.classList.add('loaded');
    console.log('%c✦ Kathy Jessica Paul — Data Scientist & AI Engineer', 'font-size:14px; color:#C8963E; font-weight:bold;');
    console.log('%c📧 kathy.jessica2000@gmail.com', 'font-size:12px; color:#1A2B4A;');
});
