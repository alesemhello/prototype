// DOM Elements
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Mode toggle
const modeToggle = $('#mode-toggle');
if (modeToggle) {
    const btns = $$('.mode-btn');
    btns.forEach(btn => btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log('Mode switched to:', btn.dataset.mode);
    }));
}

// Sidebar management
const sidebar = $('#sidebar');
const sidebarMenu = $('#sidebar-menu');
let overlay = null;

function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleSidebar(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.add('expanded');
        sidebar.classList.remove('collapsed');
        if (sidebarMenu) {
            sidebarMenu.classList.remove('collapsed');
            sidebarMenu.classList.add('expanded');
        }
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', closeSidebar);
        }
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        closeSidebar();
    }
}

// Mobile sidebar toggle
const mobileToggle = $('.mobile-sidebar-toggle');
if (mobileToggle) mobileToggle.onclick = toggleSidebar;

// Desktop sidebar toggle
const desktopToggle = $('[data-target="sidebar"]');
if (desktopToggle) {
    desktopToggle.onclick = (e) => {
        e.preventDefault();
        if (window.innerWidth <= 768) {
            closeSidebar();
            return;
        }
        const sb = $('#sidebar');
        const menuText = $('[data-target="sidebar"] .text');
        if (sb) {
            sb.classList.toggle('collapsed');
            if (sidebarMenu) sidebarMenu.classList.toggle('collapsed');
            if (menuText) menuText.textContent = sb.classList.contains('collapsed') ? 'Expand' : 'Collapse';
        }
    };
}

// Close sidebar on history link click
$$('.history-links a').forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
}));

// Search functionality
function performSearch() {
    const input = $('#search-input');
    if (!input) return;
    const query = encodeURIComponent(input.value.trim());
    input.value = '';
    window.location.href = query ? `serp.html?q=${query}` : 'serp.html';
}

const searchBtn = $('.search-btn-search');
if (searchBtn) searchBtn.onclick = (e) => { e.preventDefault(); performSearch(); };

$$('.pill').forEach(p => p.onclick = e => {
    e.preventDefault();
    const input = $('#search-input');
    if (input) input.value = p.textContent;
});

const searchInput = $('#search-input');
if (searchInput) searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') { e.preventDefault(); performSearch(); }
});

function populateSearchFromUrl() {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const input = $('#search-input');
    if (query && input) input.value = decodeURIComponent(query);
}

// Map image handling
function updateMapImage() {
    const map = $('#places-map');
    if (!map) return;
    const img = map.querySelector('img:not(.map-controls)');
    if (!img) return;
    const isMobile = window.innerWidth <= 768;
    img.src = isMobile ? 'images/map-mobile.png' : 'images/map.png';
    if (isMobile) {
        img.style.aspectRatio = '2/3';
        img.style.objectFit = 'cover';
    } else {
        img.style.aspectRatio = '';
        img.style.objectFit = 'cover';
    }
}

// List/Map toggle
const toggleBtns = $$('.toggle-btn');
const placesContent = $('#places-content');
const placesMap = $('#places-map');
const pagination = $('.pagination');
const loadMore = $('.btn-load-more');

function updateLoadMore() {
    if (loadMore && window.innerWidth <= 768) {
        loadMore.style.display = placesMap?.style.display !== 'none' ? 'none' : 'flex';
    }
}

if (toggleBtns.length && placesContent && placesMap) {
    toggleBtns.forEach(btn => btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const isMap = btn.dataset.view === 'map';
        placesContent.style.display = isMap ? 'none' : 'grid';
        placesMap.style.display = isMap ? 'block' : 'none';
        if (pagination) pagination.style.display = isMap ? 'none' : 'flex';
        if (isMap) updateMapImage();
        updateLoadMore();
    }));
}

// Range slider
$$('.range-slider').forEach(slider => {
    const thumb = slider.querySelector('.range-thumb');
    const fill = slider.querySelector('.range-fill');
    const track = slider.querySelector('.range-track');
    let dragging = false;
    const update = (x) => {
        const rect = track.getBoundingClientRect();
        let p = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        thumb.style.left = `${p * 100}%`;
        fill.style.width = `${p * 100}%`;
        const filterItem = slider.closest('.filter-radius');
        const val = filterItem?.querySelector('.filter-value');
        if (val) val.textContent = Math.round(p * 50);
    };
    const startDrag = (e) => { dragging = true; e.preventDefault(); };
    const doDrag = (e) => { if (dragging) update(e.clientX || e.touches?.[0]?.clientX); };
    const endDrag = () => { dragging = false; };
    thumb.addEventListener('mousedown', startDrag);
    track.addEventListener('mousedown', (e) => { startDrag(e); update(e.clientX); });
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);
    thumb.addEventListener('touchstart', startDrag);
    track.addEventListener('touchstart', (e) => { startDrag(e); update(e.touches[0].clientX); });
    document.addEventListener('touchmove', doDrag);
    document.addEventListener('touchend', endDrag);
});

// Checkbox toggle
$$('.filter-checkbox').forEach(cb => {
    const item = cb.closest('.filter-item');
    if (item) item.addEventListener('click', () => {
        cb.classList.toggle('checked');
        if (cb.classList.contains('checked')) {
            cb.style.cssText = 'background:#EF3F3B; background-image:url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/></svg>"); background-size:14px 14px; background-position:center; background-repeat:no-repeat;';
        } else {
            cb.style.cssText = 'background:transparent; background-image:none;';
        }
    });
});

// Theme settings
function createThemePopup() {
    const root = document.documentElement;
    const getVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();
    const html = `
        <div class="theme-popup-overlay" id="theme-popup-overlay">
            <div class="theme-popup">
                <h2>Theme Settings</h2>
                <h3>Colors</h3>
                <div class="input-group"><label>Primary:</label><input id="theme-primary" value="${getVar('--primary')}"></div>
                <div class="input-group"><label>Secondary:</label><input id="theme-secondary" value="${getVar('--secondary')}"></div>
                <h3>Background Levels</h3>
                <div class="input-group"><label>Level 0 (Body):</label><input id="theme-level0" value="${getVar('--level0')}"></div>
                <div class="input-group"><label>Level 1 (Cards):</label><input id="theme-level1" value="${getVar('--level1')}"></div>
                <div class="input-group"><label>Level 2 (Elements):</label><input id="theme-level2" value="${getVar('--level2')}"></div>
                <h3>Border & Text</h3>
                <div class="input-group"><label>Border:</label><input id="theme-border" value="${getVar('--border')}"></div>
                <div class="input-group"><label>Text Primary:</label><input id="theme-text-primary" value="${getVar('--text-primary')}"></div>
                <div class="input-group"><label>Text Secondary:</label><input id="theme-text-secondary" value="${getVar('--text-secondary')}"></div>
                <div class="popup-buttons">
                    <button class="reset-btn" id="theme-reset">Reset</button>
                    <button class="cancel-btn" id="theme-cancel">Cancel</button>
                    <button class="save-btn" id="theme-save">Save</button>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const defaults = {
        '--primary': '#FFFFFF', '--secondary': '#EF3F3B', '--level0': '#171615',
        '--level1': '#1E1D1B', '--level2': '#2B2A29', '--border': 'rgba(255,255,255,0.2)',
        '--text-primary': 'white', '--text-secondary': 'rgba(255,255,255,0.4)'
    };
    const overlay = $('#theme-popup-overlay');
    const inputs = {
        primary: $('#theme-primary'), secondary: $('#theme-secondary'),
        level0: $('#theme-level0'), level1: $('#theme-level1'), level2: $('#theme-level2'),
        border: $('#theme-border'), textPrimary: $('#theme-text-primary'), textSecondary: $('#theme-text-secondary')
    };
    const save = () => {
        Object.entries(inputs).forEach(([key, inp]) => root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, inp.value));
        const settings = {};
        Object.entries(inputs).forEach(([key, inp]) => settings[`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = inp.value);
        localStorage.setItem('themeSettings', JSON.stringify(settings));
        overlay.style.display = 'none';
    };
    const reset = () => {
        Object.entries(defaults).forEach(([key, val]) => root.style.setProperty(key, val));
        Object.entries(inputs).forEach(([key, inp]) => inp.value = defaults[`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`]);
        localStorage.removeItem('themeSettings');
        overlay.style.display = 'none';
    };
    $('#theme-save').addEventListener('click', save);
    $('#theme-cancel').addEventListener('click', () => overlay.style.display = 'none');
    $('#theme-reset').addEventListener('click', reset);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
    return overlay;
}

function loadSavedTheme() {
    const saved = localStorage.getItem('themeSettings');
    if (saved) {
        const theme = JSON.parse(saved);
        const root = document.documentElement;
        Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
    }
}
loadSavedTheme();

const themeBtn = $('#theme-settings-btn');
if (themeBtn) themeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let overlay = $('#theme-popup-overlay');
    if (!overlay) overlay = createThemePopup();
    overlay.style.display = 'flex';
});

// Window resize handlers
let prevWidth = window.innerWidth;
window.addEventListener('resize', () => {
    const curr = window.innerWidth;
    if (prevWidth <= 768 && curr > 768 && sidebar) closeSidebar();
    prevWidth = curr;
    updateLoadMore();
    updateMapImage();
});

// Initialize
updateLoadMore();
updateMapImage();
populateSearchFromUrl();