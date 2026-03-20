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

tl.fromTo('.split-text .char', 
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


