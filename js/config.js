// 🎁 Birthday Gift Configuration - Malaysia Timezone
// ===================================================

// 🗓️ BIRTHDAY DATE CONFIGURATION
// Change this to her actual birthday date and time
// And change the date format to be more explicit:
const BIRTHDAY_CONFIG = {
    date: '2025-07-26 00:00:00', // Keep it simple
    timezone: 'Asia/Kuala_Lumpur'
};

// Alternative timezone options for Malaysia:
// 'Asia/Kuala_Lumpur' - West Malaysia (Peninsular Malaysia)
// 'Asia/Kuching' - East Malaysia (Sabah & Sarawak) - same as Kuala Lumpur (UTC+8)

// 🎨 PERSONALIZATION SETTINGS
const PERSONAL_CONFIG = {
    // Her name (used throughout the experience)
    name: '❥Nora',
    
    // Your relationship
    relationship: 'my love',
    
    // Special nickname
    nickname: '❥Mona'
};

// 💬 MESSAGES CONFIGURATION
const MESSAGES_CONFIG = {
    // Lock screen messages
    lockScreen: {
        title: 'Something Special Awaits...',
        subtitle: 'A birthday surprise made just for you',
        message: [
            'This special gift will unlock on your birthday!',
            'Until then, the surprise waits just for you... 💕'
        ]
    },
    
    // Loading screen message
    loading: 'Preparing your surprise...',
    
    // Unlock message
    unlock: {
        title: '🎉 Happy Birthday! 🎉',
        subtitle: 'Your special gift is now ready!',
        buttonText: 'Enter Your Gift 💝'
    },
    
    // Animated messages for the typing sequence
    animatedMessages: [
        "Today is beautiful as other days...",
        "But you realize another year has gone in a blink of an eye",
        "However... Do you know?",
        "Today is just special, so special to you",
        "That's why, let's make it the best celebration ever",
        "And let me share a piece of happiness with you",
        "I made all this as a birthday present to you",
        "Thanks for being there, thanks for the friendship we made",
        "Thanks for everything",
        "I wish you all the best",
        "May your life be at ease",
        "May all your wishes come true",
        "Remember your ambitions",
        "You live as a free bird flying in the blue sky",
        "Your real story is just about to begin",
        "Don't worry, because this year will be better",
        "And I hope you'll find happiness along the way",
        "Keep your spirit up",
        "Enjoy every single moment that you experience today",
        "Fill it with your most beautiful smile",
        "And make it the best memory",
        "Lastly... I'd like to wish you one more time",
        `A very happy birthday, ${PERSONAL_CONFIG.name}! 🎉💕`
    ]
};

// 🎵 AUDIO CONFIGURATION
const AUDIO_CONFIG = {
    // Background music file path
    backgroundMusic: '/assets/audio/hbd.mp3',
    
    // Audio settings
    autoplay: false, // Set to true for autoplay (note: many browsers block autoplay)
    loop: true,
    volume: 0.5 // 0.0 to 1.0
};

// 🎨 THEME CONFIGURATION
const THEME_CONFIG = {
    // Color schemes
    colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#ff6b6b',
        success: '#feca57',
        text: '#ffffff'
    },
    
    // Animation timings (in milliseconds)
    animations: {
        fadeIn: 800,
        slideIn: 600,
        typing: 50,
        messageDelay: 2000
    }
};

// 🔧 DEVELOPMENT CONFIGURATION
const DEV_CONFIG = {
    // Set to true to skip countdown for testing
    skipCountdown: false,
    
    // Set to true to see debug information in console
    debug: true,
    
    // Test mode - reduces countdown to seconds for testing
    testMode: true,
    testCountdown: 10 // seconds
};

// 📱 RESPONSIVE BREAKPOINTS
const RESPONSIVE_CONFIG = {
    mobile: 480,
    tablet: 768,
    desktop: 1024
};

// 🕒 TIMEZONE UTILITIES
const TIMEZONE_UTILS = {
    // Get current time in Malaysia timezone
    getMalaysiaTime: () => {
        return new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kuala_Lumpur",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },
    
    // Convert date string to Malaysia timezone
    convertToMalaysiaTime: (dateString) => {
        const date = new Date(dateString + ' UTC+8');
        return date;
    },
    
    // Get timezone offset for Malaysia (should be +8)
    getMalaysiaOffset: () => {
        const now = new Date();
        const malaysiaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"}));
        const localTime = new Date(now.toLocaleString());
        return (malaysiaTime.getTime() - localTime.getTime()) / (1000 * 60 * 60);
    }
};

// Debug: Show current Malaysia time
if (DEV_CONFIG.debug) {
    console.log('🇲🇾 Current Malaysia Time:', TIMEZONE_UTILS.getMalaysiaTime());
    console.log('🌏 Malaysia Timezone Offset: UTC+' + (8) + ' hours');
    console.log('📅 Target Birthday (Malaysia Time):', BIRTHDAY_CONFIG.date);
}

// Export configurations for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BIRTHDAY_CONFIG,
        PERSONAL_CONFIG,
        MESSAGES_CONFIG,
        AUDIO_CONFIG,
        THEME_CONFIG,
        DEV_CONFIG,
        RESPONSIVE_CONFIG,
        TIMEZONE_UTILS
    };
}