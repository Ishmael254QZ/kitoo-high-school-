// ===================================
// Dark Mode Toggle
// ===================================

function initDarkMode() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateDarkModeIcon(false);
    }
    
    // Setup toggle button
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateDarkModeIcon(isDarkMode);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Show notification
    showNotification(
        isDarkMode ? 'Dark mode enabled' : 'Light mode enabled',
        'success'
    );
}

function updateDarkModeIcon(isDarkMode) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
        darkModeToggle.title = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', initDarkMode);

