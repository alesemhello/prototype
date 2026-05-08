// scripts.js - Complete file with mobile sidebar support and map view load more button hiding

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

// Mobile sidebar toggle (the expand icon in top bar)
const mobileSidebarToggle = document.querySelector('.mobile-sidebar-toggle');
if (mobileSidebarToggle) {
    mobileSidebarToggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const sidebar = document.getElementById('sidebar');
        const sidebarMenu = document.getElementById('sidebar-menu');
        let overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.toggle('open');
            
            // On mobile, always show expanded sidebar
            if (sidebar.classList.contains('open')) {
                sidebar.classList.add('expanded');
                sidebar.classList.remove('collapsed');
                if (sidebarMenu) {
                    sidebarMenu.classList.remove('collapsed');
                    sidebarMenu.classList.add('expanded');
                }
            }
            
            // Create overlay if it doesn't exist
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            // Toggle overlay
            if (sidebar.classList.contains('open')) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            } else {
                overlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        }
    };
}

// Sidebar toggle from menu item (existing desktop functionality)
const sidebarToggle = document.querySelector('[data-target="sidebar"]');
if (sidebarToggle) {
    sidebarToggle.onclick = (e) => {
        e.preventDefault();
        
        // Check if we're on mobile
        if (window.innerWidth <= 768) {
            // On mobile, just close the sidebar
            const sb = document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sb) {
                sb.classList.remove('open');
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
            return;
        }
        
        // Desktop behavior
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

// Mobile menu button (hamburger menu - placeholder for future menu)
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
    menuBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Placeholder for future menu functionality
        console.log('Menu button clicked - future menu will go here');
    };
}

// Close sidebar when clicking on history links in mobile
document.querySelectorAll('.history-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar) {
                sidebar.classList.remove('open');
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        }
    });
});

// Close sidebar on window resize if it's open and we're on mobile
let previousWidth = window.innerWidth;
window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // If resizing from mobile to desktop, close mobile sidebar
    if (previousWidth <= 768 && currentWidth > 768 && sidebar) {
        sidebar.classList.remove('open');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    previousWidth = currentWidth;
    
    // Update map image when resizing
    updateMapImage();
});

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

// Function to update map image based on screen size
function updateMapImage() {
    const placesMap = document.getElementById('places-map');
    if (!placesMap) return;
    
    const mapImage = placesMap.querySelector('img:not(.map-controls)');
    if (!mapImage) return;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Use mobile map image
        if (mapImage.src && !mapImage.src.includes('map-mobile.png')) {
            mapImage.src = 'images/map-mobile.png';
        } else if (!mapImage.src) {
            mapImage.src = 'images/map-mobile.png';
        }
        // Set 2:3 aspect ratio for mobile
        mapImage.style.aspectRatio = '2 / 3';
        mapImage.style.objectFit = 'cover';
    } else {
        // Use desktop map image
        if (mapImage.src && !mapImage.src.includes('map.png')) {
            mapImage.src = 'images/map.png';
        } else if (!mapImage.src) {
            mapImage.src = 'images/map.png';
        }
        // Remove aspect ratio constraint for desktop
        mapImage.style.aspectRatio = '';
        mapImage.style.objectFit = 'cover';
    }
}

// List/Map toggle functionality with Load More button visibility
const toggleBtns = document.querySelectorAll('.toggle-btn');
const placesContent = document.getElementById('places-content');
const placesMap = document.getElementById('places-map');
const pagination = document.querySelector('.pagination');
const loadMoreBtn = document.querySelector('.btn-load-more');

function updateLoadMoreForView() {
    if (loadMoreBtn && window.innerWidth <= 768) {
        const isMapActive = placesMap && placesMap.style.display !== 'none';
        loadMoreBtn.style.display = isMapActive ? 'none' : 'flex';
    }
}

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
                // Update map image when showing map view
                updateMapImage();
            }
            
            // Update load more button visibility
            updateLoadMoreForView();
        });
    });
}

// Initial call to set correct state
updateLoadMoreForView();
updateMapImage();

// Update on window resize
window.addEventListener('resize', () => {
    updateLoadMoreForView();
    updateMapImage();
});

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