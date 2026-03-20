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

// Split text animation for Hero simply using GSAP staggers
const title = document.querySelector('.split-text');
const chars = title.innerText.split('');
title.innerHTML = '';
chars.forEach(char => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    title.appendChild(span);
});

tl.fromTo('.split-text span', 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.5 }
)
.fromTo('.fade-up-text',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
    '-=0.5'
)
.fromTo('.reveal-image',
    { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.5, ease: 'power4.inOut' },
    '-=1'
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

// Three.js 3D Background Setup (Floating Petals)
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles / Petals
const particlesCount = 300;
const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);
const colorArray = new Float32Array(particlesCount * 3);

const colorPrimary = new THREE.Color('#ae8b62'); // Gold
const colorSecondary = new THREE.Color('#faece8'); // Light pink
const colorAccent = new THREE.Color('#e8cdc5'); // darker pink

for (let i = 0; i < particlesCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 15; // x
    posArray[i+1] = (Math.random() - 0.5) * 15; // y
    posArray[i+2] = (Math.random() - 0.5) * 10; // z
}

for (let i = 0; i < particlesCount; i++) {
    scaleArray[i] = Math.random();
    
    // Mix colors
    const colorMix = new THREE.Color();
    const rand = Math.random();
    if(rand < 0.33) colorMix.copy(colorPrimary);
    else if(rand < 0.66) colorMix.copy(colorSecondary);
    else colorMix.copy(colorAccent);
    
    colorArray[i*3] = colorMix.r;
    colorArray[i*3+1] = colorMix.g;
    colorArray[i*3+2] = colorMix.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));
geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

// Custom Shader Material for softer look
const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

const animate = () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    // Interaction
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    
    // Float slowly upwards
    const positions = particlesMesh.geometry.attributes.position.array;
    for(let i = 1; i < particlesCount * 3; i+=3) {
        positions[i] += Math.sin(elapsedTime * 0.5 + positions[i-1]) * 0.002;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};

animate();

// Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
