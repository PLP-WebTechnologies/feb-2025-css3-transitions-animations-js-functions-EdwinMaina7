// User preferences object
const userPreferences = {
    theme: 'theme-blue',
    animationSpeed: 'speed-medium',
    lastAnimation: 'pulse'
};

// DOM Elements
const animationBox = document.getElementById('animationBox');
const themeButtons = document.querySelectorAll('.theme-options .btn');
const speedButtons = document.querySelectorAll('.animation-options .btn');
const animationButtons = document.querySelectorAll('.animation-controls .btn');
const resetButton = document.getElementById('resetBtn');
const notification = document.getElementById('notification');

// Load preferences from localStorage
function loadPreferences() {
    try {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
            const parsedPreferences = JSON.parse(savedPreferences);
            Object.assign(userPreferences, parsedPreferences);
            
            // Apply saved preferences
            applyTheme(userPreferences.theme);
            applyAnimationSpeed(userPreferences.animationSpeed);
            playAnimation(userPreferences.lastAnimation);
            
            // Update active button states
            updateActiveButtons();
            
            console.log('Preferences loaded:', userPreferences);
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Save preferences to localStorage
function savePreferences() {
    try {
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
        showNotification();
        console.log('Preferences saved:', userPreferences);
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Apply theme to body
function applyTheme(theme) {
    document.body.className = theme;
    userPreferences.theme = theme;
}

// Apply animation speed
function applyAnimationSpeed(speed) {
    document.documentElement.className = speed;
    userPreferences.animationSpeed = speed;
}

// Play animation on the animation box
function playAnimation(animationType) {
    // Clear previous animation
    animationBox.style.animation = 'none';
    
    // Trigger reflow to restart animation
    void animationBox.offsetWidth;
    
    // Set new animation
    const animationDuration = getComputedStyle(document.documentElement).getPropertyValue('--animation-speed');
    animationBox.style.animation = `${animationType} ${animationDuration} ease-in-out infinite`;
    userPreferences.lastAnimation = animationType;
}

// Update active button states based on current preferences
function updateActiveButtons() {
    // Reset all active states
    themeButtons.forEach(btn => btn.style.opacity = '1');
    speedButtons.forEach(btn => btn.style.opacity = '1');
    animationButtons.forEach(btn => btn.style.opacity = '1');
    
    // Set active theme button
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === userPreferences.theme) {
            btn.style.opacity = '0.8';
        }
    });
    
    // Set active speed button
    speedButtons.forEach(btn => {
        if (btn.dataset.speed === userPreferences.animationSpeed) {
            btn.style.opacity = '0.8';
        }
    });
    
    // Set active animation button
    animationButtons.forEach(btn => {
        if (btn.dataset.animation === userPreferences.lastAnimation) {
            btn.style.opacity = '0.8';
        }
    });
}

// Show notification
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Reset all preferences
function resetPreferences() {
    localStorage.removeItem('userPreferences');
    
    // Reset to defaults
    userPreferences.theme = 'theme-blue';
    userPreferences.animationSpeed = 'speed-medium';
    userPreferences.lastAnimation = 'pulse';
    
    // Apply default settings
    applyTheme(userPreferences.theme);
    applyAnimationSpeed(userPreferences.animationSpeed);
    playAnimation(userPreferences.lastAnimation);
    
    // Update UI
    updateActiveButtons();
    
    // Show notification
    notification.textContent = 'All preferences reset!';
    showNotification();
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load saved preferences
    loadPreferences();
    
    // Theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyTheme(button.dataset.theme);
            savePreferences();
            updateActiveButtons();
        });
    });
    
    // Animation speed buttons
    speedButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyAnimationSpeed(button.dataset.speed);
            savePreferences();
            updateActiveButtons();
            
            // Reapply current animation with new speed
            playAnimation(userPreferences.lastAnimation);
        });
    });
    
    // Animation buttons
    animationButtons.forEach(button => {
        button.addEventListener('click', () => {
            playAnimation(button.dataset.animation);
            savePreferences();
            updateActiveButtons();
        });
    });
    
    // Reset button
    resetButton.addEventListener('click', resetPreferences);
});