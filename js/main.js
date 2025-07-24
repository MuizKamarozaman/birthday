// 🎁 Main Application Controller
// ===============================

class BirthdayGiftApp {
    constructor() {
        this.currentPage = 'lock';
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.bindEvents();
        this.setupResponsiveHandling();
        this.loadPersonalization();
        this.preloadAssets();
        this.setupAudio();
        this.isInitialized = true;
        
        if (DEV_CONFIG.debug) {
            console.log('🎁 Birthday Gift App Initialized');
            console.log('📱 Device Type:', this.getDeviceType());
            console.log('🎨 Theme Config:', THEME_CONFIG.colors);
        }
    }
    setupAudio() {
    const audio = document.getElementById('birthdayAudio');
    if (!audio) return;
    audio.volume = AUDIO_CONFIG.volume || 0.5;
    audio.loop = AUDIO_CONFIG.loop !== false;
    // Only play after user interaction (required by browsers)
    document.body.addEventListener('click', function playOnce() {
        audio.play().catch(() => {});
        document.body.removeEventListener('click', playOnce);
    });
    // Optionally autoplay if allowed by browser and config
    if (AUDIO_CONFIG.autoplay) {
        audio.play().catch(() => {});
    }
}
    bindEvents() {
        // Enter gift button
        const enterGiftBtn = document.getElementById('enterGiftBtn');
        if (enterGiftBtn) {
            enterGiftBtn.addEventListener('click', () => this.enterMainGift());
        }
        
        // Keyboard shortcuts (debug mode only)
        if (DEV_CONFIG.debug) {
            document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        }
        
        // Window resize handling
        window.addEventListener('resize', () => this.handleResize());
        
        // Visibility change (when user switches tabs)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    loadPersonalization() {
        // Update personalized content
        this.updatePersonalizedText();
        this.applyThemeColors();
    }
    
    updatePersonalizedText() {
        // Update lock screen messages
        const lockTitle = document.querySelector('.lock-title');
        if (lockTitle && MESSAGES_CONFIG.lockScreen.title) {
            lockTitle.textContent = MESSAGES_CONFIG.lockScreen.title;
        }
        
        const lockSubtitle = document.querySelector('.lock-subtitle');
        if (lockSubtitle && MESSAGES_CONFIG.lockScreen.subtitle) {
            lockSubtitle.textContent = MESSAGES_CONFIG.lockScreen.subtitle;
        }
        
        // Update unlock message
        const unlockTitle = document.querySelector('.unlock-message h1');
        if (unlockTitle && MESSAGES_CONFIG.unlock.title) {
            unlockTitle.textContent = MESSAGES_CONFIG.unlock.title;
        }
        
        const unlockSubtitle = document.querySelector('.unlock-message p');
        if (unlockSubtitle && MESSAGES_CONFIG.unlock.subtitle) {
            unlockSubtitle.textContent = MESSAGES_CONFIG.unlock.subtitle;
        }
        
        const enterBtn = document.getElementById('enterGiftBtn');
        if (enterBtn && MESSAGES_CONFIG.unlock.buttonText) {
            enterBtn.textContent = MESSAGES_CONFIG.unlock.buttonText;
        }
    }
    
    applyThemeColors() {
        // Apply CSS custom properties for theming
        const root = document.documentElement;
        const colors = THEME_CONFIG.colors;
        
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-accent', colors.accent);
        root.style.setProperty('--color-success', colors.success);
        root.style.setProperty('--color-text', colors.text);
    }
    
    enterMainGift() {
        if (DEV_CONFIG.debug) {
            console.log('🎉 Entering main gift experience...');
        }
        
        // Add celebration effect before transition
        this.createCelebrationEffect();
        
        // Show loading transition
        this.showTransitionLoading();
        
        // Navigate to birthday card after brief celebration
        setTimeout(() => {
            this.navigateToBirthdayCard();
        }, 1500);
    }
    
    createCelebrationEffect() {
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#ff7675', '#74b9ff'];
        
        // Create confetti burst
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 100);
        }
        
        // Add button animation
        const enterBtn = document.getElementById('enterGiftBtn');
        if (enterBtn) {
            enterBtn.style.transform = 'scale(1.1)';
            enterBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)';
            enterBtn.style.backgroundSize = '300% 300%';
            enterBtn.style.animation = 'gradientShift 0.5s ease infinite';
            
            setTimeout(() => {
                enterBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Utils.random(8, 12)}px;
            height: ${Utils.random(8, 12)}px;
            background: ${color};
            left: ${Math.random() * 100}vw;
            top: -20px;
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 10000;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 4000);
    }
    
    showTransitionLoading() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.5s ease-out;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div class="gift-box-loader" style="
                    width: 80px;
                    height: 80px;
                    background: var(--color-accent);
                    border-radius: 10px;
                    margin: 0 auto 20px;
                    position: relative;
                    animation: bounce 1s infinite;
                ">
                    <div style="
                        position: absolute;
                        top: -5px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 90px;
                        height: 20px;
                        background: var(--color-success);
                        border-radius: 5px;
                    "></div>
                    <div style="
                        position: absolute;
                        top: 15px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 10px;
                        height: 50px;
                        background: var(--color-success);
                        border-radius: 5px;
                    "></div>
                </div>
                <h2 style="font-family: var(--font-secondary); margin-bottom: 10px; font-size: 1.5rem;">
                    Opening Your Gift... 🎁
                </h2>
                <p style="font-size: 1rem; opacity: 0.9;">
                    Get ready for something special!
                </p>
                <div class="loading-dots" style="
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 20px;
                ">
                    <span style="
                        width: 8px;
                        height: 8px;
                        background: white;
                        border-radius: 50%;
                        animation: dotBounce 1.4s ease-in-out infinite both;
                        animation-delay: 0s;
                    "></span>
                    <span style="
                        width: 8px;
                        height: 8px;
                        background: white;
                        border-radius: 50%;
                        animation: dotBounce 1.4s ease-in-out infinite both;
                        animation-delay: 0.2s;
                    "></span>
                    <span style="
                        width: 8px;
                        height: 8px;
                        background: white;
                        border-radius: 50%;
                        animation: dotBounce 1.4s ease-in-out infinite both;
                        animation-delay: 0.4s;
                    "></span>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Store reference for cleanup
        this.transitionOverlay = overlay;
    }
    
    navigateToBirthdayCard() {
        if (DEV_CONFIG.debug) {
            console.log('🎂 Navigating to birthday card...');
        }
        
        try {
            // Try different navigation methods
            if (typeof window !== 'undefined') {
                // Method 1: Direct navigation
                window.location.href = '/pages/birthday-card.html';
                
                // Fallback methods in case the first doesn't work
                setTimeout(() => {
                    if (window.location.href.indexOf('/pages/birthday-card.html') === -1) {
                        // Method 2: Replace current location
                        window.location.replace('/pages/birthday-card.html');
                    }
                }, 500);
                
                setTimeout(() => {
                    if (window.location.href.indexOf('/pages/birthday-card.html') === -1) {
                        // Method 3: Assign location
                        window.location.assign('/pages/birthday-card.html');
                    }
                }, 1000);
            }
        } catch (error) {
            this.handleError(error, 'Navigation to birthday card');
            
            // Fallback: Show manual navigation
            this.showManualNavigation();
        }
    }
    
    showManualNavigation() {
        if (this.transitionOverlay) {
            this.transitionOverlay.innerHTML = `
                <div style="text-align: center; color: white; max-width: 400px; padding: 20px;">
                    <h2 style="font-family: var(--font-secondary); margin-bottom: 20px;">
                        🎂 Your Birthday Card is Ready!
                    </h2>
                    <p style="margin-bottom: 20px; opacity: 0.9;">
                        Click the button below to view your special birthday card:
                    </p>
                    <a href="/pages/birthday-card.html" style="
                        display: inline-block;
                        padding: 15px 30px;
                        background: var(--color-accent);
                        color: white;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 500;
                        font-size: 1.1rem;
                        transition: all 0.3s ease;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.3)'"
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'">
                        🎁 Open Birthday Card
                    </a>
                    <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.7;">
                        Or copy this link: birthday-card.html
                    </p>
                </div>
            `;
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Debug shortcuts
        if (e.ctrlKey && e.shiftKey) {
            switch(e.key) {
                case 'U': // Ctrl+Shift+U - Force unlock
                    e.preventDefault();
                    if (window.forceUnlock) window.forceUnlock();
                    break;
                case 'R': // Ctrl+Shift+R - Reset
                    e.preventDefault();
                    if (window.resetCountdown) window.resetCountdown();
                    break;
                case 'D': // Ctrl+Shift+D - Toggle debug info
                    e.preventDefault();
                    this.toggleDebugInfo();
                    break;
                case 'C': // Ctrl+Shift+C - Go to card directly
                    e.preventDefault();
                    this.navigateToBirthdayCard();
                    break;
            }
        }
    }
    
    toggleDebugInfo() {
        let debugPanel = document.getElementById('debugPanel');
        
        if (!debugPanel) {
            debugPanel = this.createDebugPanel();
            document.body.appendChild(debugPanel);
        } else {
            debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 999999;
            max-width: 300px;
            border: 1px solid #333;
            backdrop-filter: blur(10px);
        `;
        
        panel.innerHTML = `
            <h4>🧪 Debug Panel</h4>
            <p><strong>Current Time:</strong> <span id="debugCurrentTime"></span></p>
            <p><strong>Birthday Date:</strong> ${BIRTHDAY_CONFIG.date}</p>
            <p><strong>Test Mode:</strong> ${DEV_CONFIG.testMode}</p>
            <p><strong>Skip Countdown:</strong> ${DEV_CONFIG.skipCountdown}</p>
            <hr style="margin: 10px 0; border-color: #333;">
            <button onclick="forceUnlock()" style="margin: 2px; padding: 5px; font-size: 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">Force Unlock</button>
            <button onclick="resetCountdown()" style="margin: 2px; padding: 5px; font-size: 10px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">Reset</button>
            <button onclick="birthdayApp.navigateToBirthdayCard()" style="margin: 2px; padding: 5px; font-size: 10px; background: #E91E63; color: white; border: none; border-radius: 3px; cursor: pointer;">Go to Card</button>
            <button onclick="this.parentElement.style.display='none'" style="margin: 2px; padding: 5px; font-size: 10px; background: #757575; color: white; border: none; border-radius: 3px; cursor: pointer;">Close</button>
        `;
        
        // Update current time every second
        setInterval(() => {
            const timeElement = panel.querySelector('#debugCurrentTime');
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleString();
            }
        }, 1000);
        
        return panel;
    }
    
    setupResponsiveHandling() {
        this.updateResponsiveElements();
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateResponsiveElements();
        }, 150);
    }
    
    updateResponsiveElements() {
        const deviceType = this.getDeviceType();
        document.body.setAttribute('data-device', deviceType);
        
        if (DEV_CONFIG.debug) {
            console.log('📱 Device type updated:', deviceType);
        }
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        
        if (width <= RESPONSIVE_CONFIG.mobile) {
            return 'mobile';
        } else if (width <= RESPONSIVE_CONFIG.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden (user switched tabs)
        if (DEV_CONFIG.debug) {
            console.log('👁️ Page hidden');
        }
    } else {
        // Page is visible again
        if (DEV_CONFIG.debug) {
            console.log('👁️ Page visible');
        }

        // Refresh countdown when page becomes visible again
        if (
            window.countdownTimer &&
            typeof window.countdownTimer.updateCountdown === 'function' &&
            !window.countdownTimer.isUnlocked
        ) {
            window.countdownTimer.updateCountdown();
        }
    }
}
    // Utility method to create particles effect
    createParticles() {
        const particleContainer = document.querySelector('.particles');
        if (!particleContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${3 + Math.random() * 4}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            particleContainer.appendChild(particle);
        }
    }
    
    // Method to preload assets
    preloadAssets() {
        const assets = [
            '/pages/birthday-card.html', // Preload the birthday card page
            // Add other assets as needed
            // 'assets/images/background.jpg',
            '/assets/audio/hbd.mp3'
        ];
        
        assets.forEach(asset => {
            if (asset.includes('.html')) {
                // Preload HTML page
                fetch(asset).catch(e => {
                    if (DEV_CONFIG.debug) {
                        console.log(`Could not preload ${asset}:`, e);
                    }
                });
            } else if (asset.includes('.mp3') || asset.includes('.wav')) {
                // Preload audio
                const audio = new Audio(asset);
                audio.preload = 'auto';
            } else if (asset.includes('.jpg') || asset.includes('.png') || asset.includes('.gif')) {
                // Preload images
                const img = new Image();
                img.src = asset;
            }
        });
    }
    
    // Error handling
    handleError(error, context) {
        console.error(`❌ Error in ${context}:`, error);
        
        if (DEV_CONFIG.debug) {
            // Show error to user in debug mode
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4757;
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 999999;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            `;
            errorDiv.innerHTML = `
                <h3>🚨 Debug Error</h3>
                <p><strong>Context:</strong> ${context}</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <button onclick="this.parentElement.remove()" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: white;
                    color: #ff4757;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">Close</button>
            `;
            document.body.appendChild(errorDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
    }
}

// Animation helpers
class AnimationHelpers {
    static fadeIn(element, duration = 800) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 800) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideInFromBottom(element, duration = 600) {
        element.style.transform = 'translateY(100%)';
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            
            const translateY = 100 - (percent * 100);
            element.style.transform = `translateY(${translateY}%)`;
            element.style.opacity = percent;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Utility functions
const Utils = {
    // Format time with leading zeros
    padTime: (num) => String(num).padStart(2, '0'),
    
    // Check if device is mobile
    isMobile: () => window.innerWidth <= RESPONSIVE_CONFIG.mobile,
    
    // Generate random number between min and max
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Debounce function calls
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Create element with styles
    createElement: (tag, className, styles = {}) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        Object.assign(element.style, styles);
        return element;
    }
};

// Add required CSS animations
const requiredStyles = document.createElement('style');
requiredStyles.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes dotBounce {
        0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -20px, 0);
        }
        70% {
            transform: translate3d(0, -10px, 0);
        }
        90% {
            transform: translate3d(0, -4px, 0);
        }
    }
`;
document.head.appendChild(requiredStyles);

// Global error handler
window.addEventListener('error', (e) => {
    if (window.birthdayApp) {
        window.birthdayApp.handleError(e.error, 'Global Error');
    }
});

// Initialize the app
let birthdayApp = null;

document.addEventListener('DOMContentLoaded', () => {
    try {
        birthdayApp = new BirthdayGiftApp();
        window.birthdayApp = birthdayApp; // Make it globally accessible
        
        if (DEV_CONFIG.debug) {
            console.log('🎁 Birthday Gift App fully loaded');
            console.log('💡 Available debug commands: forceUnlock(), resetCountdown(), birthdayApp.navigateToBirthdayCard()');
            console.log('⌨️  Keyboard shortcuts: Ctrl+Shift+U (unlock), Ctrl+Shift+R (reset), Ctrl+Shift+D (debug panel), Ctrl+Shift+C (go to card)');
        }
    } catch (error) {
        console.error('❌ Failed to initialize Birthday Gift App:', error);
    }
});