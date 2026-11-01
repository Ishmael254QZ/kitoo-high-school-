// ===================================
// Dashboard Widgets and Tab Management
// ===================================

function initWidgets() {
    const widgetCards = document.querySelectorAll('.widget-card');
    
    widgetCards.forEach(widget => {
        widget.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                openTab(tabName);
            }
        });
    });
}

function openTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
        
        // Scroll to tab
        selectedTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add animation
        selectedTab.style.animation = 'slideInRight 0.4s ease-out';
    }
}

function closeTab(tabName) {
    const tab = document.getElementById(tabName + 'Tab');
    if (tab) {
        tab.classList.add('closing');
        setTimeout(() => {
            tab.style.display = 'none';
            tab.classList.remove('active', 'closing');
        }, 300);
    }
}

function showAddNoticeModal() {
    // In real app, this would show a modal to add a new notice
    showNotification('Add notice feature coming soon!', 'info');
}

// Initialize widgets on page load
document.addEventListener('DOMContentLoaded', function() {
    initWidgets();
    
    // Add smooth transitions to dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Make functions globally available
window.openTab = openTab;
window.closeTab = closeTab;
window.showAddNoticeModal = showAddNoticeModal;

