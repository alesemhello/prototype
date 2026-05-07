// scripts.js - Complete file with clear on search

// Mode toggle functionality
const modeToggle = document.getElementById('mode-toggle');
if (modeToggle) {
    const modeBtns = modeToggle.querySelectorAll('.mode-btn');
    
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const mode = btn.dataset.mode;
            console.log('Mode switched to:', mode);
            // Add your mode switching logic here
        });
    });
}

// Переключение sidebar через пункт меню
const sidebarToggle = document.querySelector('[data-target="sidebar"]');
if (sidebarToggle) {
    sidebarToggle.onclick = () => {
        const sb = document.getElementById('sidebar');
        const menuText = document.querySelector('[data-target="sidebar"] .text');
        if (sb) {
            sb.classList.toggle('collapsed');
            sb.classList.toggle('expanded');
            const sidebarMenu = document.getElementById('sidebar-menu');
            if (sidebarMenu) {
                sidebarMenu.classList.toggle('collapsed');
            }
            if (menuText) {
                menuText.textContent = sb.classList.contains('collapsed') ? 'Expand' : 'Collapse';
            }
        }
    };
}

// Мобильное меню
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
    menuBtn.onclick = () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    };
}

// Функция для выполнения поиска и перехода на serp.html
function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const query = encodeURIComponent(searchInput.value.trim());
        
        // Clear the search input
        searchInput.value = '';
        
        // Redirect to serp.html with the search query as a parameter
        if (query) {
            window.location.href = 'serp.html?q=' + query;
        } else {
            window.location.href = 'serp.html';
        }
    }
}

// Поиск и pills
const searchBtn = document.querySelector('.search-btn-search');
if (searchBtn) {
    searchBtn.onclick = (e) => {
        e.preventDefault();
        performSearch();
    };
}

// Handle pill clicks - set search input value but don't redirect automatically
document.querySelectorAll('.pill').forEach(p => {
    p.onclick = e => {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = p.textContent;
        }
    };
});

// Обработка Enter в поиске на index.html и serp.html
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

// If on serp.html, populate search input with query parameter from URL
function populateSearchFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const searchInput = document.getElementById('search-input');
    if (query && searchInput) {
        searchInput.value = decodeURIComponent(query);
    }
}

// List/Map toggle functionality
const toggleBtns = document.querySelectorAll('.toggle-btn');
const placesContent = document.getElementById('places-content');
const placesMap = document.getElementById('places-map');
const pagination = document.querySelector('.pagination');

if (toggleBtns.length > 0 && placesContent && placesMap) {
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (view === 'list') {
                placesContent.style.display = 'grid';
                placesMap.style.display = 'none';
                if (pagination) {
                    pagination.style.display = 'flex';
                }
            } else if (view === 'map') {
                placesContent.style.display = 'none';
                placesMap.style.display = 'block';
                if (pagination) {
                    pagination.style.display = 'none';
                }
            }
        });
    });
}

// Range slider functionality
const rangeSliders = document.querySelectorAll('.range-slider');
rangeSliders.forEach(slider => {
    const thumb = slider.querySelector('.range-thumb');
    const fill = slider.querySelector('.range-fill');
    const track = slider.querySelector('.range-track');
    
    let isDragging = false;
    
    const updateSlider = (clientX) => {
        const rect = track.getBoundingClientRect();
        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        
        thumb.style.left = (percentage * 100) + '%';
        fill.style.width = (percentage * 100) + '%';
        
        // Update the value display if needed
        const filterItem = slider.closest('.filter-radius');
        if (filterItem) {
            const valueDisplay = filterItem.querySelector('.filter-value');
            if (valueDisplay) {
                valueDisplay.textContent = Math.round(percentage * 50);
            }
        }
    };
    
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateSlider(e.clientX);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events for mobile
    thumb.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            updateSlider(e.touches[0].clientX);
        }
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
});

// Checkbox toggle functionality
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
filterCheckboxes.forEach(checkbox => {
    const filterItem = checkbox.closest('.filter-item');
    if (filterItem) {
        filterItem.addEventListener('click', () => {
            checkbox.classList.toggle('checked');
            if (checkbox.classList.contains('checked')) {
                checkbox.style.backgroundColor = '#EF3F3B';
                checkbox.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/></svg>')";
                checkbox.style.backgroundSize = '14px 14px';
                checkbox.style.backgroundPosition = 'center';
                checkbox.style.backgroundRepeat = 'no-repeat';
            } else {
                checkbox.style.backgroundColor = 'transparent';
                checkbox.style.backgroundImage = 'none';
            }
        });
    }
});

// Run this when page loads
populateSearchFromUrl();