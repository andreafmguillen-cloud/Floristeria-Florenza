document.addEventListener("DOMContentLoaded", () => {
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial loader animation
    const tlLoader = gsap.timeline();
    
    tlLoader.to(".loader-logo", {
        opacity: 1,
        y: -20,
        duration: 1,
        ease: "power3.out"
    })
    .to(".loader-logo", {
        opacity: 0,
        y: -40,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.in"
    })
    .to(".loader", {
        height: 0,
        duration: 1,
        ease: "power4.inOut"
    }, "-=0.2")
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.2")
    .from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.6")
    .from(".hero-action", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6");

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // Force scrolled on load to prevent jumping? Actually let's just add/remove
            if(window.scrollY < 10) navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Placeholder for full screen mobile menu
            alert("Menú móvil en construcción. Por favor deslice para navegar.");
        });
    }

    // Parallax Effects on Images
    gsap.utils.toArray('.img-parallax').forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    gsap.utils.toArray('.img-parallax-reverse').forEach(img => {
        gsap.to(img, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Parallax CTA Background
    gsap.to('.cta-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".cta-parallax",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Reveal Animations
    const fadeUps = document.querySelectorAll('.gs-fade-up');
    fadeUps.forEach(element => {
        gsap.from(element, {
            y: 30,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });
    });

    // Zoom Cards
    const zoomCards = document.querySelectorAll('.gs-zoom');
    zoomCards.forEach((card, i) => {
        gsap.from(card, {
            y: 50,
            scale: 0.95,
            opacity: 0,
            duration: 1,
            delay: card.classList.contains('gs-delay-1') ? 0.2 : (card.classList.contains('gs-delay-2') ? 0.4 : 0),
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".collections-grid",
                start: "top 80%",
            }
        });
    });

    const slideUps = document.querySelectorAll('.gs-slide-up');
    slideUps.forEach(element => {
        gsap.from(element, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 80%"
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
