// Portfolio Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  createMobileNavToggle();
  initializeNavigation();
  initializeContactForm();
  initializeLoadingAnimations();
  initializeSmoothScrolling(); // now handles nav clicks smoothly
  showSection('about'); // initial highlight
}

function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Scroll to section smoothly
      const target = document.querySelector(`#${this.getAttribute('data-section')}`);
      target.scrollIntoView({ behavior: 'smooth' });
      updateActiveNavLink(this);
    });
  });

  // Update active nav on scroll
  window.addEventListener('scroll', function() {
    document.querySelectorAll('.content-section').forEach(section => {
      const rect = section.getBoundingClientRect();
      const link = document.querySelector(`.nav-link[data-section="${section.id}"]`);
      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        updateActiveNavLink(link);
      }
    });
  });
}

function updateActiveNavLink(activeLink) {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}
// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Trigger loading animation for section content
        triggerLoadingAnimation(targetSection);
        
        // Update page title
        updatePageTitle(sectionId);
    }
}

// Close mobile navigation
function closeMobileNav() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        
        if (toggle) {
            const icon = toggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    }
}

// Update page title based on active section
function updatePageTitle(sectionId) {
    const sectionTitles = {
        'about': 'About Me',
        'skills': 'Skills & Technologies',
        'projects': 'Projects',
        'education': 'Education',
        'experience': 'Experience & Research',
        'certifications': 'Certifications',
        'contact': 'Contact'
    };
    
    const baseTitle = 'Koyya Sruthi - AI/ML Engineer & Computer Vision Specialist';
    const sectionTitle = sectionTitles[sectionId];
    
    if (sectionTitle && sectionId !== 'about') {
        document.title = `${sectionTitle} | ${baseTitle}`;
    } else {
        document.title = baseTitle;
    }
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
}

// Handle contact form submission
function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    const formFields = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateForm(formFields)) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (since we can't actually send emails)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Message sent successfully! Thank you for reaching out.', 'success');
    }, 1500);
}

// Validate individual input
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    clearValidationError(e);
    
    if (input.hasAttribute('required') && !value) {
        showValidationError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && value && !isValidEmail(value)) {
        showValidationError(input, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Clear validation error
function clearValidationError(e) {
    const input = e.target;
    const errorElement = input.parentNode.querySelector('.validation-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.classList.remove('error');
}

// Show validation error
function showValidationError(input, message) {
    input.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    input.parentNode.appendChild(errorElement);
}

// Validate entire form
function validateForm(formFields) {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.validation-error').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
    
    // Validate each field
    Object.keys(formFields).forEach(fieldName => {
        const value = formFields[fieldName];
        const input = document.querySelector(`[name="${fieldName}"]`);
        
        if (!value || value.trim() === '') {
            showValidationError(input, 'This field is required');
            isValid = false;
        } else if (fieldName === 'email' && !isValidEmail(value)) {
            showValidationError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-${type === 'success' ? 'success' : 'error'});
        color: var(--color-white);
        padding: var(--space-16) var(--space-20);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        animation: slideInRight var(--duration-normal) var(--ease-standard);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight var(--duration-normal) var(--ease-standard)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 250);
    }, 5000);
}

// Initialize loading animations
function initializeLoadingAnimations() {
    // Add loading class to all animatable elements
    const animatableElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .certification-card');
    
    animatableElements.forEach(element => {
        element.classList.add('loading');
    });
}

// Trigger loading animation for section content
function triggerLoadingAnimation(section) {
    const animatableElements = section.querySelectorAll('.loading');
    
    animatableElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('loaded');
        }, index * 100); // Stagger animation
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    // Add smooth scrolling behavior
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }
    `;
    document.head.appendChild(style);
}

// Handle window resize
window.addEventListener('resize', function() {
    // Recreate mobile nav toggle if needed
    if (window.innerWidth <= 768) {
        createMobileNavToggle();
    } else {
        // Remove mobile nav toggle and close sidebar
        const toggle = document.querySelector('.mobile-nav-toggle');
        if (toggle) {
            toggle.remove();
        }
        
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
});

// Close mobile nav when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (window.innerWidth <= 768 && 
        sidebar && 
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) && 
        !toggle.contains(e.target)) {
        closeMobileNav();
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile nav
    if (e.key === 'Escape') {
        closeMobileNav();
    }
});

// Add intersection observer for scroll-based animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animatable elements
    document.querySelectorAll('.loading').forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations after DOM is ready
setTimeout(() => {
    initializeScrollAnimations();
}, 100);

// Add some interactive features for better UX
function addInteractiveFeatures() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });
    
    // Add click to copy functionality for email
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email address copied to clipboard!', 'success');
                });
            }
            
            // Still open email client
            window.location.href = this.getAttribute('href');
        });
    });
}

// Initialize interactive features after a short delay
setTimeout(() => {
    addInteractiveFeatures();
}, 500);

// Export functions for potential external use
window.PortfolioApp = {
    showSection,
    toggleMobileNav,
    showNotification
};
function createMobileNavToggle() {
  let toggle = document.querySelector('.mobile-nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'mobile-nav-toggle';
    toggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(toggle);
  }

  toggle.addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    const icon = toggle.querySelector('i');
    icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
  });
}
