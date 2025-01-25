// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        }
    },
    retina_detect: true
});

let countdownInterval;
let isRunning = false;

// Initialize date and time inputs
function initializeDateTimeInputs() {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Set default to 1 hour from now
    
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    
    document.getElementById('date-input').value = dateStr;
    document.getElementById('time-input').value = timeStr;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDateTimeInputs();
    
    document.getElementById('start-btn').addEventListener('click', startCountdown);
    document.getElementById('stop-btn').addEventListener('click', stopCountdown);
    document.getElementById('reset-btn').addEventListener('click', resetCountdown);
});

function startCountdown() {
    if (isRunning) return;
    
    const dateInput = document.getElementById('date-input').value;
    const timeInput = document.getElementById('time-input').value;
    
    if (!dateInput || !timeInput) {
        showNotification('Please select both date and time!', 'error');
        return;
    }
    
    const targetDate = new Date(`${dateInput}T${timeInput}`).getTime();
    const now = new Date().getTime();
    
    if (targetDate <= now) {
        showNotification('Please select a future date and time!', 'error');
        return;
    }
    
    isRunning = true;
    updateButtonStates(true);
    updateCountdown(targetDate);
    countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
}

function updateCountdown(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        stopCountdown();
        showNotification('Countdown finished!', 'success');
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    updateTimeUnit('days', days);
    updateTimeUnit('hours', hours);
    updateTimeUnit('minutes', minutes);
    updateTimeUnit('seconds', seconds);
    
    // Add special effects for last minute
    if (distance < 60000) {
        document.querySelectorAll('.time-card').forEach(card => {
            card.style.animation = 'pulse 1s infinite';
        });
    }
}

function updateTimeUnit(id, value) {
    const element = document.getElementById(id);
    const currentValue = element.textContent;
    const newValue = String(value).padStart(2, '0');
    
    if (currentValue !== newValue) {
        const card = element.closest('.time-card');
        card.classList.remove('animate');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('animate');
        element.textContent = newValue;
    }
}


function stopCountdown() {
    if (!isRunning) return;
    
    clearInterval(countdownInterval);
    isRunning = false;
    updateButtonStates(false);
    
    // Remove any special effects
    document.querySelectorAll('.time-card').forEach(card => {
        card.style.animation = '';
    });
}

function resetCountdown() {
    stopCountdown();
    
    // Reset all time values
    ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
        document.getElementById(unit).textContent = '00';
    });
    
    // Reset date and time inputs
    initializeDateTimeInputs();
    
    // Remove all animations and effects
    document.querySelectorAll('.time-card').forEach(card => {
        card.classList.remove('animate');
        card.style.animation = '';
    });
    
    showNotification('Countdown reset successfully', 'info');
}

function updateButtonStates(isCountdownRunning) {
    document.getElementById('start-btn').disabled = isCountdownRunning;
    document.getElementById('stop-btn').disabled = !isCountdownRunning;
    
    // Add visual feedback
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    if (isCountdownRunning) {
        startBtn.classList.add('disabled');
        stopBtn.classList.remove('disabled');
    } else {
        startBtn.classList.remove('disabled');
        stopBtn.classList.add('disabled');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    const icon = document.createElement('i');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    notification.appendChild(icon);
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    notification.appendChild(messageSpan);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add these styles to your CSS file for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: -300px;
        padding: 15px 25px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(-320px);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification.success {
        border-left: 4px solid var(--secondary-color);
    }
    
    .notification.error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification.info {
        border-left: 4px solid var(--primary-color);
    }
`;
document.head.appendChild(notificationStyles);

// Add hover effects for time cards
document.querySelectorAll('.time-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = 'none';
    });
});

// Update current user display
document.querySelector('.user-info h2').textContent = 'Mahmoud Nazmy';

// Set current date/time as minimum
const now = new Date('2025-01-25T17:08:26');
document.getElementById('date-input').min = now.toISOString().split('T')[0];

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});