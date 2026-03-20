// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tl = gsap.timeline();

// Split text animation for Hero by words then chars to prevent wrapping breaking mid-word
const title = document.querySelector('.split-text');
const text = title.innerText;
title.innerHTML = '';
text.split(' ').forEach((word, index, arr) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';
    word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        charSpan.className = 'char';
        charSpan.style.display = 'inline-block';
        wordSpan.appendChild(charSpan);
    });
    title.appendChild(wordSpan);
    if (index < arr.length - 1) {
        const space = document.createElement('span');
        space.innerText = '\u00A0';
        space.style.display = 'inline-block';
        title.appendChild(space);
    }
});

tl.fromTo('.reveal-image',
    { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0 },
    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
)
.fromTo('.split-text .char', 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power4.out' },
    '-=0.6' // Start slightly before logo finishes
)
.fromTo('.fade-up-text',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
    '-=0.4'
);

// Scroll Animations
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title,
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1,
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
            }
        }
    );
});

gsap.utils.toArray('.collection-item').forEach((item, i) => {
    gsap.fromTo(item,
        { y: 100, opacity: 0 },
        {
            y: 0, opacity: 1,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.collection-grid',
                start: 'top 75%',
            }
        }
    );
});

// Parallax for About Images
gsap.to('.img-1', {
    y: -50,
    ease: "none",
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

gsap.to('.img-2', {
    y: 50,
    ease: "none",
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// MARAUDER'S MAP - ELEGANT ORGANIC GROWING VINES
const canvas = document.getElementById('marauder-vines');
const ctx = canvas.getContext('2d');

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

const colorGold = '#eaaeb2';
const colorLeaf = '#b8c5b9'; 
const colorPink = '#ffffff';

let vines = [];
let flowers = [];

class Vine {
    constructor(x, y, angle, width, life, isMain = true) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = width;
        this.life = life;
        this.maxLife = life;
        this.age = 0;
        this.speed = 1.0;
        this.isMain = isMain;
        
        // Gentle undulating wave for organic but structured growth
        this.waveOffset = Math.random() * Math.PI * 2;
        this.waveSpeed = 0.02 + Math.random() * 0.01;
        this.waveAmplitude = 0.03;
    }

    update() {
        this.age++;
        if (this.age > this.life) return false;

        // Elegant undulating curve instead of random noise
        this.angle += Math.sin(this.age * this.waveSpeed + this.waveOffset) * this.waveAmplitude;
        
        const nextX = this.x + Math.cos(this.angle) * this.speed;
        const nextY = this.y + Math.sin(this.angle) * this.speed;

        // Distance to center to prevent interfering with text
        const dx = nextX - canvas.width / 2;
        const dy = nextY - canvas.height / 2;
        const distFromCenter = Math.sqrt(dx*dx + dy*dy);
        const maxDist = Math.max(canvas.width, canvas.height) / 2;
        
        // Fade out as it approaches the center
        let alpha = 1;
        const safeZone = window.innerWidth < 768 ? maxDist * 0.7 : maxDist * 0.5;
        if (distFromCenter < safeZone) {
            alpha = Math.max(0, (distFromCenter - safeZone * 0.5) / (safeZone * 0.5));
            if (alpha <= 0.01) return false; // Stop growing when completely faded
        }

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(nextX, nextY);
        const currentWidth = this.width * (1 - this.age / this.life);
        ctx.lineWidth = currentWidth;
        ctx.strokeStyle = colorGold;
        ctx.globalAlpha = alpha;
        ctx.lineCap = 'round';
        ctx.stroke();

        this.x = nextX;
        this.y = nextY;

        // Structured Branching (More organized)
        // Main vines branch out regularly, sub-vines branch less
        if (this.isMain && this.age % 40 === 0 && currentWidth > 1.5) {
            // Alternate left and right branching
            const branchSide = (this.age / 40) % 2 === 0 ? 1 : -1;
            const branchAngle = this.angle + branchSide * 0.6;
            vines.push(new Vine(this.x, this.y, branchAngle, currentWidth * 0.7, this.life - this.age, false));
        }

        // Leaves cleanly placed on branches
        if (this.age % 25 === 0 && currentWidth > 0.5) {
            const leafSide = (this.age / 25) % 2 === 0 ? 1 : -1;
            flowers.push(new Leaf(this.x, this.y, this.angle + leafSide * 0.8, currentWidth * 3, alpha));
        }

        // Blossoms at the ends of sub-branches
        if (!this.isMain && this.age === this.life - 10 && alpha > 0.2) {
            flowers.push(new Flower(this.x, this.y, currentWidth * 8, alpha));
        }

        return true;
    }
}

class Leaf {
    constructor(x, y, angle, size, maxAlpha) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.targetSize = size;
        this.size = 0;
        this.maxAlpha = maxAlpha * 0.6;
    }
    update() {
        if (this.size < this.targetSize) {
            this.size += 0.2;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size / 2, -this.size / 2, this.size, 0);
            ctx.quadraticCurveTo(this.size / 2, this.size / 2, 0, 0);
            ctx.fillStyle = colorLeaf;
            ctx.globalAlpha = this.maxAlpha;
            ctx.fill();
            ctx.restore();
            return true;
        }
        return false;
    }
}

class Flower {
    constructor(x, y, size, maxAlpha) {
        this.x = x;
        this.y = y;
        this.targetRadius = size;
        this.radius = 0;
        this.rotation = Math.random() * Math.PI;
        this.maxAlpha = maxAlpha * 0.8;
    }
    update() {
        if (this.radius < this.targetRadius) {
            this.radius += 0.15;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation + this.radius * 0.1);
            ctx.fillStyle = colorPink;
            ctx.globalAlpha = this.maxAlpha;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.ellipse(this.radius, 0, this.radius, this.radius/2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.rotate((Math.PI * 2) / 5);
            }
            
            // Inner golden core
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = colorGold;
            ctx.globalAlpha = this.maxAlpha;
            ctx.fill();
            
            ctx.restore();
            return true;
        }
        return false;
    }
}

function startGrowth() {
    vines = [];
    flowers = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Start vines from corners growing inward
    vines.push(new Vine(0, 0, Math.PI/4, 6, 400));
    vines.push(new Vine(canvas.width, 0, Math.PI*3/4, 6, 400));
    vines.push(new Vine(0, canvas.height, -Math.PI/4, 6, 400));
    vines.push(new Vine(canvas.width, canvas.height, -Math.PI*3/4, 6, 400));
    
    // Sides
    if(window.innerWidth > 800) {
        vines.push(new Vine(0, canvas.height/2, 0, 4, 300));
        vines.push(new Vine(canvas.width, canvas.height/2, Math.PI, 4, 300));
    }
    
    animateGrowth();
}

function animateGrowth() {
    let growing = false;
    
    for (let i = vines.length - 1; i >= 0; i--) {
        if (vines[i].update()) {
            growing = true;
        } else {
            vines.splice(i, 1);
        }
    }
    
    for (let i = flowers.length - 1; i >= 0; i--) {
        if (flowers[i].update()) {
            growing = true;
        } else {
            flowers.splice(i, 1);
        }
    }
    
    if (growing) {
        requestAnimationFrame(animateGrowth);
    }
}

// Start growth animation immediately
setTimeout(startGrowth, 300);
