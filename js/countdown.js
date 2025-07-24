// 🕒 Countdown Timer System - Malaysia Timezone
// ==============================================

class CountdownTimer {
    constructor() {
        this.birthdayDate = null;
        this.countdownInterval = null;
        this.isUnlocked = false;
        
        // DOM elements
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            lockScreen: document.getElementById('lockScreen'),
            loadingScreen: document.getElementById('loadingScreen'),
            mainContent: document.getElementById('mainContent')
        };
        
        this.init();
    }
    
    init() {
        this.setBirthdayDate();
        this.checkInitialState();
        this.startCountdown();
        
        if (DEV_CONFIG.debug) {
            console.log('🎁 Countdown Timer Initialized');
            console.log('🗓️ Birthday Date (Malaysia Time):', this.birthdayDate);
            console.log('⏰ Current Time (Malaysia Time):', this.getCurrentMalaysiaTime());
            console.log('🌏 Timezone:', BIRTHDAY_CONFIG.timezone);
        }
    }
    
    setBirthdayDate() {
    // Handle test mode
    if (DEV_CONFIG.testMode) {
        this.birthdayDate = new Date(Date.now() + (DEV_CONFIG.testCountdown * 1000));
        console.log('🧪 Test Mode: Birthday set to', DEV_CONFIG.testCountdown, 'seconds from now');
        return;
    }
    
    // Parse the configured birthday date in Malaysia timezone
    const dateString = BIRTHDAY_CONFIG.date;
    
    // Create date object with Malaysia timezone
    if (BIRTHDAY_CONFIG.timezone === 'Asia/Kuala_Lumpur' || BIRTHDAY_CONFIG.timezone === 'Asia/Kuching') {
        // Try different parsing methods
        try {
            // Method 1: Try ISO format first
            this.birthdayDate = new Date(dateString);
            
            // If that fails, try with explicit UTC+8
            if (isNaN(this.birthdayDate.getTime())) {
                this.birthdayDate = new Date(dateString + '+08:00');
            }
            
            // If still fails, try manual parsing
            if (isNaN(this.birthdayDate.getTime())) {
                const parts = dateString.split(' ');
                const datePart = parts[0]; // '2025-07-27'
                const timePart = parts[1] || '00:00:00'; // '00:00:00'
                this.birthdayDate = new Date(`${datePart}T${timePart}+08:00`);
            }
        } catch (error) {
            console.error('Date parsing error:', error);
            this.birthdayDate = new Date('2025-07-27T00:00:00+08:00'); // Fallback
        }
    } else {
        // Fallback to local timezone
        this.birthdayDate = new Date(dateString);
    }
    
    // Validate the date
    if (isNaN(this.birthdayDate.getTime())) {
        console.error('❌ Invalid birthday date format. Please use YYYY-MM-DD HH:MM:SS');
        this.birthdayDate = new Date('2025-07-27T00:00:00+08:00'); // Fallback date
    }
    
    console.log('✅ Birthday date set to:', this.birthdayDate.toLocaleString());
}
    
    getCurrentMalaysiaTime() {
        // Get current time in Malaysia timezone
        const now = new Date();
        
        if (BIRTHDAY_CONFIG.timezone === 'Asia/Kuala_Lumpur' || BIRTHDAY_CONFIG.timezone === 'Asia/Kuching') {
            // Return time adjusted for Malaysia timezone
            return new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"}));
        } else {
            return now;
        }
    }
    
    checkInitialState() {
        // Skip countdown for development
        if (DEV_CONFIG.skipCountdown) {
            this.unlockGift();
            return;
        }
        
        const now = this.getCurrentMalaysiaTime().getTime();
        const birthdayTime = this.birthdayDate.getTime();
        
        if (DEV_CONFIG.debug) {
            console.log('🕒 Time comparison:');
            console.log('   Current (Malaysia):', new Date(now).toLocaleString());
            console.log('   Birthday (Malaysia):', new Date(birthdayTime).toLocaleString());
            console.log('   Difference (ms):', birthdayTime - now);
            console.log('   Days remaining:', Math.floor((birthdayTime - now) / (1000 * 60 * 60 * 24)));
        }
        
        if (now >= birthdayTime) {
            // Birthday has already passed, unlock immediately
            console.log('🎉 Birthday has arrived! Unlocking gift...');
            this.unlockGift();
        } else {
            // Show countdown
            console.log('⏳ Countdown started...');
            this.showCountdown();
        }
    }
    
    startCountdown() {
        // Update immediately
        this.updateCountdown();
        
        // Then update every second
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = this.getCurrentMalaysiaTime().getTime();
        const birthdayTime = this.birthdayDate.getTime();
        const timeRemaining = birthdayTime - now;
        
        if (timeRemaining <= 0) {
            // Time's up! Unlock the gift
            this.stopCountdown();
            this.unlockGift();
            return;
        }
        
        // Calculate time units
        const timeUnits = this.calculateTimeUnits(timeRemaining);
        
        // Update display
        this.updateDisplay(timeUnits);
        
        // Debug info for last minute
        if (DEV_CONFIG.debug && timeRemaining < 60000) {
            console.log('⏰ Final countdown - Time remaining:', timeUnits);
        }
    }
    
    calculateTimeUnits(timeRemaining) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
    }
    
    updateDisplay(timeUnits) {
        // Add leading zeros and update elements with smooth transitions
        if (this.elements.days) {
            this.animateNumberUpdate(this.elements.days, timeUnits.days);
        }
        if (this.elements.hours) {
            this.animateNumberUpdate(this.elements.hours, timeUnits.hours);
        }
        if (this.elements.minutes) {
            this.animateNumberUpdate(this.elements.minutes, timeUnits.minutes);
        }
        if (this.elements.seconds) {
            this.animateNumberUpdate(this.elements.seconds, timeUnits.seconds);
        }
    }
    
    animateNumberUpdate(element, newValue) {
        const formattedValue = String(newValue).padStart(2, '0');
        const currentValue = element.textContent;
        
        if (currentValue !== formattedValue) {
            // Add change animation
            element.style.transform = 'scale(1.1)';
            element.style.color = '#feca57';
            
            setTimeout(() => {
                element.textContent = formattedValue;
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 150);
        }
        
        // Special pulse animation for seconds
        if (element === this.elements.seconds) {
            element.style.animation = 'numberPulse 1s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 1000);
        }
    }
    
    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
            
            if (DEV_CONFIG.debug) {
                console.log('⏹️ Countdown stopped');
            }
        }
    }
    
    showCountdown() {
        if (this.elements.lockScreen) {
            this.elements.lockScreen.classList.remove('hidden');
        }
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('hidden');
        }
        if (this.elements.mainContent) {
            this.elements.mainContent.classList.add('hidden');
        }
    }
    
    unlockGift() {
        if (this.isUnlocked) return; // Prevent multiple unlocks
        
        this.isUnlocked = true;
        
        if (DEV_CONFIG.debug) {
            console.log('🎉 GIFT UNLOCKED! Happy Birthday!');
            console.log('🇲🇾 Unlocked at Malaysia time:', this.getCurrentMalaysiaTime().toLocaleString());
        }
        
        // Hide countdown, show loading
        this.showLoadingScreen();
        
        // Simulate loading time then show main content
        setTimeout(() => {
            this.showMainContent();
        }, 3000);
    }
    
    showLoadingScreen() {
        if (this.elements.lockScreen) {
            this.elements.lockScreen.classList.add('fade-out');
        }
        
        setTimeout(() => {
            if (this.elements.lockScreen) {
                this.elements.lockScreen.classList.add('hidden');
            }
            if (this.elements.loadingScreen) {
                this.elements.loadingScreen.classList.remove('hidden');
                this.elements.loadingScreen.classList.add('fade-in');
            }
            
            // Start loading animation
            this.animateLoading();
        }, 500);
    }
    
    animateLoading() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.animation = 'progressFill 3s ease-in-out forwards';
        }
        
        // Animate gift box
        const giftBox = document.querySelector('.gift-box');
        if (giftBox) {
            setTimeout(() => {
                giftBox.classList.add('opening');
            }, 2000);
        }
    }
    
    showMainContent() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('fade-out');
        }
        
        setTimeout(() => {
            if (this.elements.loadingScreen) {
                this.elements.loadingScreen.classList.add('hidden');
            }
            if (this.elements.mainContent) {
                this.elements.mainContent.classList.remove('hidden');
                this.elements.mainContent.classList.add('fade-in');
            }
            
            // Trigger celebration effects
            this.celebrate();
        }, 500);
    }
    
    celebrate() {
        // Create confetti effect
        this.createConfetti();
        
        // Play celebration sound (if available)
        this.playCelebrationSound();
        
        // Trigger other celebration animations
        setTimeout(() => {
            this.createFloatingHearts();
        }, 1000);
    }
    
    createConfetti() {
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    animation: confettiFall 3s linear forwards;
                    z-index: 10000;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }
    
    createFloatingHearts() {
        const hearts = ['💖', '💕', '💗', '💝', '🎂', '🎉'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.className = 'floating-heart';
                heart.style.cssText = `
                    position: fixed;
                    bottom: -50px;
                    left: ${Math.random() * 100}vw;
                    font-size: 24px;
                    pointer-events: none;
                    animation: floatUp 4s ease-out forwards;
                    z-index: 10000;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 4000);
            }, i * 300);
        }
    }
    
    playCelebrationSound() {
        // This will be implemented when we add audio features
        if (DEV_CONFIG.debug) {
            console.log('🎵 Playing celebration sound...');
        }
    }
    
    // Public method to force unlock (for testing)
    forceUnlock() {
        if (DEV_CONFIG.debug) {
            console.log('🔓 Force unlocking gift...');
        }
        this.stopCountdown();
        this.unlockGift();
    }
    
    // Public method to reset countdown (for testing)
    reset() {
        this.stopCountdown();
        this.isUnlocked = false;
        this.init();
    }
    
    // Get remaining time in a readable format
    getTimeRemaining() {
        const now = this.getCurrentMalaysiaTime().getTime();
        const birthdayTime = this.birthdayDate.getTime();
        const timeRemaining = birthdayTime - now;
        
        if (timeRemaining <= 0) {
            return "Birthday has arrived! 🎉";
        }
        
        const timeUnits = this.calculateTimeUnits(timeRemaining);
        return `${timeUnits.days}d ${timeUnits.hours}h ${timeUnits.minutes}m ${timeUnits.seconds}s`;
    }
}

// Global countdown instance
let countdownTimer = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    countdownTimer = new CountdownTimer();
    
    // Add developer shortcuts (only in debug mode)
    if (DEV_CONFIG.debug) {
        window.forceUnlock = () => countdownTimer.forceUnlock();
        window.resetCountdown = () => countdownTimer.reset();
        window.getTimeRemaining = () => countdownTimer.getTimeRemaining();
        window.getMalaysiaTime = () => countdownTimer.getCurrentMalaysiaTime().toLocaleString();
        
        console.log('🧪 Debug mode enabled for Malaysia timezone.');
        console.log('💡 Available debug commands:');
        console.log('   - forceUnlock() - Skip countdown');
        console.log('   - resetCountdown() - Restart countdown');
        console.log('   - getTimeRemaining() - Check remaining time');
        console.log('   - getMalaysiaTime() - Get current Malaysia time');
        console.log('🇲🇾 Current Malaysia Time:', countdownTimer.getCurrentMalaysiaTime().toLocaleString());
    }
});