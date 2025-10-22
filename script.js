// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Page transition effect
    const pageTransition = document.querySelector('.page-transition');

    // Show transition on page load
    pageTransition.classList.add('active');

    // Hide transition after a delay
    setTimeout(() => {
        pageTransition.classList.remove('active');
    }, 500);

    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '0.75rem 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        }
    });

    // Menu tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    if (tabBtns.length > 0 && menuSections.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and sections
                tabBtns.forEach(btn => btn.classList.remove('active'));
                menuSections.forEach(section => section.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                // Show corresponding section
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.section-header, .about-content, .experience-item, .atmosphere-features, .atmosphere-gallery, .contact-info');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('reveal');
                element.classList.add('active');
            }
        });
    }

    // Add reveal class to all elements initially
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });

    // Call the function on load
    revealOnScroll();

    // Call the function on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Show page transition
                pageTransition.classList.add('active');

                setTimeout(() => {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Hide page transition
                    setTimeout(() => {
                        pageTransition.classList.remove('active');
                    }, 300);
                }, 300);
            }
        });
    });

    // Image hover effects for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item, .experience-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });

    // Add subtle animation to features on hover
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });

        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        });
    });

    // Add subtle animation to info cards on hover
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        });
    });
});