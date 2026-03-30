/**
 * Annotation Tool — SuperStories
 * Built-in review feedback for website projects.
 *
 * Two audiences:
 *   @claude   — blue dots — feedback for Claude Code
 *   @designer — red dots  — feedback for external designer
 *
 * Storage: API (annotations.superstories.com) when configured,
 *          localStorage as fallback.
 *
 * Config via window.SS_ANNOTATIONS:
 *   { api: 'https://...', project: 'denimcity' }
 * No API key needed in frontend — API uses Origin header for browser auth.
 */

(function () {
    'use strict';

    // --- Config ---
    const config = window.SS_ANNOTATIONS || {};
    const PROJECT = config.project || 'default';
    const API_URL = config.api || null;
    const API_KEY = config.key || '';
    const PAGE = window.location.pathname || '/index.html';
    const STORAGE_KEY = `ss-annotations-${PROJECT}`;

    // --- State ---
    let annotations = [];
    let annotationMode = false;
    let panelOpen = false;
    let currentTarget = 'claude'; // 'claude' or 'designer'
    let currentPriority = 'medium';
    let userName = localStorage.getItem('ss-annotation-name') || '';

    // --- Colors ---
    const COLORS = {
        claude: { dot: '#1200CC', bg: '#1200CC15', label: '@claude' },
        designer: { dot: '#FF2B2B', bg: '#FF2B2B15', label: '@designer' }
    };

    // --- Storage Layer ---
    const storage = {
        async load() {
            if (API_URL) {
                try {
                    const res = await fetch(`${API_URL}/annotations?project=${PROJECT}&page=${PAGE}`, {
                        headers: { 'X-Annotation-Key': API_KEY }
                    });
                    if (res.ok) {
                        annotations = await res.json();
                        return;
                    }
                } catch (e) {
                    console.warn('Annotation API unavailable, using localStorage');
                }
            }
            // Fallback: localStorage
            const stored = localStorage.getItem(STORAGE_KEY);
            annotations = stored ? JSON.parse(stored) : [];
            annotations = annotations.filter(a => a.page === PAGE);
        },

        async save(annotation) {
            if (API_URL) {
                try {
                    const res = await fetch(`${API_URL}/annotations`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Annotation-Key': API_KEY
                        },
                        body: JSON.stringify(annotation)
                    });
                    if (res.ok) {
                        const saved = await res.json();
                        annotations.push(saved);
                        return saved;
                    }
                } catch (e) {
                    console.warn('Annotation API unavailable, saving to localStorage');
                }
            }
            // Fallback: localStorage
            annotation.id = Date.now();
            annotation.status = 'open';
            annotation.created_at = new Date().toISOString();
            annotations.push(annotation);
            this._saveLocal();
            return annotation;
        },

        async resolve(id) {
            if (API_URL) {
                try {
                    const res = await fetch(`${API_URL}/annotations/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Annotation-Key': API_KEY
                        },
                        body: JSON.stringify({ status: 'resolved' })
                    });
                    if (res.ok) {
                        const updated = await res.json();
                        const idx = annotations.findIndex(a => a.id === id);
                        if (idx !== -1) annotations[idx] = updated;
                        return;
                    }
                } catch (e) {
                    console.warn('Annotation API unavailable');
                }
            }
            // Fallback: localStorage
            const ann = annotations.find(a => a.id === id);
            if (ann) {
                ann.status = 'resolved';
                ann.resolved_in = new Date().toISOString().split('T')[0];
            }
            this._saveLocal();
        },

        async remove(id) {
            if (API_URL) {
                try {
                    const res = await fetch(`${API_URL}/annotations/${id}`, {
                        method: 'DELETE',
                        headers: { 'X-Annotation-Key': API_KEY }
                    });
                    if (res.ok) {
                        annotations = annotations.filter(a => a.id !== id);
                        return;
                    }
                } catch (e) {
                    console.warn('Annotation API unavailable');
                }
            }
            annotations = annotations.filter(a => a.id !== id);
            this._saveLocal();
        },

        _saveLocal() {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const otherPages = all.filter(a => a.page !== PAGE);
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherPages, ...annotations]));
        }
    };

    // --- Detect Block ---
    function detectBlock(el) {
        let current = el;
        while (current && current !== document.body) {
            if (current.dataset && current.dataset.block) return current.dataset.block;
            if (current.id) return current.id;
            const cls = current.className;
            if (typeof cls === 'string') {
                const match = cls.match(/\b(hero|store|academy|lab|tours|agenda|footer|mission|place|nav|education|collaborate)\b/i);
                if (match) return match[1].toLowerCase();
            }
            current = current.parentElement;
        }
        return 'general';
    }

    // --- UI: Toolbar ---
    function createToolbar() {
        const bar = document.createElement('div');
        bar.id = 'ss-annotation-toolbar';
        bar.innerHTML = `
            <style>
                #ss-annotation-toolbar {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 99999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 13px;
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }
                #ss-annotation-toolbar button {
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 13px;
                    transition: opacity 0.15s;
                }
                #ss-annotation-toolbar button:hover { opacity: 0.8; }
                .ss-btn-toggle {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #1200CC;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
                }
                .ss-btn-toggle.active { background: #FF2B2B; }
                .ss-btn-small {
                    height: 32px;
                    padding: 0 12px;
                    border-radius: 16px;
                    background: white;
                    color: #1200CC;
                    border: 1px solid #1200CC !important;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                }
                .ss-btn-small.active { background: #1200CC; color: white; }
                .ss-mode-bar {
                    display: none;
                    gap: 6px;
                    align-items: center;
                }
                .ss-mode-bar.visible { display: flex; }
                .ss-target-claude { border-color: #1200CC !important; }
                .ss-target-claude.active { background: #1200CC; }
                .ss-target-designer { border-color: #FF2B2B !important; color: #FF2B2B; }
                .ss-target-designer.active { background: #FF2B2B; color: white; }
            </style>
            <div class="ss-mode-bar" id="ss-mode-bar">
                <button class="ss-btn-small ss-target-claude active" data-target="claude">@claude</button>
                <button class="ss-btn-small ss-target-designer" data-target="designer">@designer</button>
                <span style="color:#999;margin:0 2px">|</span>
                <button class="ss-btn-small" data-priority="high" style="color:#FF2B2B;border-color:#FF2B2B!important">H</button>
                <button class="ss-btn-small active" data-priority="medium">M</button>
                <button class="ss-btn-small" data-priority="low" style="color:#999;border-color:#999!important">L</button>
                <span style="color:#999;margin:0 2px">|</span>
                <button class="ss-btn-small" id="ss-btn-panel">☰</button>
            </div>
            <button class="ss-btn-toggle" id="ss-btn-toggle" title="Toggle annotation mode (Alt+A)">✏️</button>
        `;
        document.body.appendChild(bar);

        // Toggle annotation mode
        document.getElementById('ss-btn-toggle').addEventListener('click', toggleMode);

        // Target buttons
        bar.querySelectorAll('[data-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentTarget = btn.dataset.target;
                bar.querySelectorAll('[data-target]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Priority buttons
        bar.querySelectorAll('[data-priority]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPriority = btn.dataset.priority;
                bar.querySelectorAll('[data-priority]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Panel button
        document.getElementById('ss-btn-panel').addEventListener('click', togglePanel);
    }

    function toggleMode() {
        annotationMode = !annotationMode;
        const btn = document.getElementById('ss-btn-toggle');
        const modeBar = document.getElementById('ss-mode-bar');

        if (annotationMode) {
            btn.classList.add('active');
            modeBar.classList.add('visible');
            document.body.style.cursor = 'crosshair';
        } else {
            btn.classList.remove('active');
            modeBar.classList.remove('visible');
            document.body.style.cursor = '';
        }
    }

    // --- UI: Dots ---
    function renderDots() {
        document.querySelectorAll('.ss-dot').forEach(el => el.remove());

        annotations.forEach(ann => {
            if (ann.status === 'resolved') return;

            const dot = document.createElement('div');
            dot.className = 'ss-dot';
            dot.dataset.id = ann.id;
            const colors = COLORS[ann.target] || COLORS.claude;

            dot.style.cssText = `
                position: absolute;
                left: ${ann.x}%;
                top: ${ann.y}px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${colors.dot};
                border: 2px solid white;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                cursor: pointer;
                z-index: 99998;
                transform: translate(-50%, -50%);
                transition: transform 0.15s;
            `;

            // Priority indicator
            if (ann.priority === 'high') {
                dot.style.boxShadow = `0 0 0 3px ${colors.dot}40, 0 1px 4px rgba(0,0,0,0.3)`;
            }

            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
                showTooltip(dot, ann);
            });
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
                hideTooltip();
            });
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showDotMenu(ann);
            });

            document.body.appendChild(dot);
        });
    }

    // --- UI: Tooltip ---
    let tooltipEl = null;

    function showTooltip(dot, ann) {
        hideTooltip();
        const colors = COLORS[ann.target] || COLORS.claude;
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'ss-tooltip';
        tooltipEl.style.cssText = `
            position: absolute;
            left: ${ann.x}%;
            top: ${ann.y - 10}px;
            transform: translate(-50%, -100%);
            background: white;
            border: 1px solid ${colors.dot};
            border-radius: 6px;
            padding: 8px 12px;
            max-width: 280px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 12px;
            color: #333;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 99999;
            pointer-events: none;
        `;
        tooltipEl.innerHTML = `
            <div style="font-weight:600;color:${colors.dot};margin-bottom:2px">${colors.label} · ${ann.block} · ${ann.priority}</div>
            <div>${ann.text}</div>
            <div style="color:#999;margin-top:4px;font-size:11px">${ann.name} · ${new Date(ann.created_at).toLocaleDateString()}</div>
        `;
        document.body.appendChild(tooltipEl);
    }

    function hideTooltip() {
        if (tooltipEl) {
            tooltipEl.remove();
            tooltipEl = null;
        }
    }

    // --- UI: Dot Menu (click on dot) ---
    function showDotMenu(ann) {
        closeDotMenu();
        const colors = COLORS[ann.target] || COLORS.claude;
        const menu = document.createElement('div');
        menu.id = 'ss-dot-menu';
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid ${colors.dot};
            border-radius: 8px;
            padding: 16px;
            width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 13px;
            color: #333;
            box-shadow: 0 4px 24px rgba(0,0,0,0.2);
            z-index: 100000;
        `;
        menu.innerHTML = `
            <div style="font-weight:600;color:${colors.dot};margin-bottom:8px">${colors.label} · ${ann.block} · ${ann.priority}</div>
            <div style="margin-bottom:12px">${ann.text}</div>
            <div style="color:#999;font-size:11px;margin-bottom:12px">${ann.name} · ${new Date(ann.created_at).toLocaleDateString()}</div>
            <div style="display:flex;gap:8px">
                <button id="ss-resolve-btn" style="flex:1;padding:8px;border:1px solid #1200CC;background:#1200CC;color:white;border-radius:4px;cursor:pointer;font-size:13px">✓ Resolve</button>
                <button id="ss-delete-btn" style="flex:1;padding:8px;border:1px solid #FF2B2B;background:white;color:#FF2B2B;border-radius:4px;cursor:pointer;font-size:13px">Delete</button>
                <button id="ss-close-btn" style="padding:8px 12px;border:1px solid #ccc;background:white;color:#666;border-radius:4px;cursor:pointer;font-size:13px">✕</button>
            </div>
        `;
        document.body.appendChild(menu);

        document.getElementById('ss-resolve-btn').addEventListener('click', async () => {
            await storage.resolve(ann.id);
            closeDotMenu();
            renderDots();
            if (panelOpen) renderPanel();
        });
        document.getElementById('ss-delete-btn').addEventListener('click', async () => {
            await storage.remove(ann.id);
            closeDotMenu();
            renderDots();
            if (panelOpen) renderPanel();
        });
        document.getElementById('ss-close-btn').addEventListener('click', closeDotMenu);
    }

    function closeDotMenu() {
        const menu = document.getElementById('ss-dot-menu');
        if (menu) menu.remove();
    }

    // --- UI: Create Annotation Form ---
    function showCreateForm(x, y) {
        closeCreateForm();

        // Ask for name if not set
        if (!userName) {
            userName = prompt('Your name:');
            if (!userName) return;
            localStorage.setItem('ss-annotation-name', userName);
        }

        const form = document.createElement('div');
        form.id = 'ss-create-form';
        const colors = COLORS[currentTarget];
        form.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}px;
            transform: translate(-50%, 10px);
            background: white;
            border: 2px solid ${colors.dot};
            border-radius: 8px;
            padding: 16px;
            width: 300px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 13px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.2);
            z-index: 100000;
        `;
        form.innerHTML = `
            <div style="font-weight:600;color:${colors.dot};margin-bottom:8px">${colors.label} · ${currentPriority}</div>
            <textarea id="ss-form-text" placeholder="Your feedback..." style="width:100%;height:60px;border:1px solid #ddd;border-radius:4px;padding:8px;font-family:inherit;font-size:13px;resize:vertical;box-sizing:border-box"></textarea>
            <div style="display:flex;gap:8px;margin-top:8px">
                <button id="ss-form-save" style="flex:1;padding:8px;background:${colors.dot};color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px">Save</button>
                <button id="ss-form-cancel" style="padding:8px 12px;background:white;color:#666;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:13px">Cancel</button>
            </div>
        `;
        document.body.appendChild(form);

        const textarea = document.getElementById('ss-form-text');
        textarea.focus();

        document.getElementById('ss-form-save').addEventListener('click', async () => {
            const text = textarea.value.trim();
            if (!text) return;

            const block = detectBlock(document.elementFromPoint(
                (x / 100) * window.innerWidth,
                y - window.scrollY
            ) || document.body);

            await storage.save({
                project: PROJECT,
                page: PAGE,
                block: block,
                target: currentTarget,
                priority: currentPriority,
                text: text,
                name: userName,
                x: Math.round(x),
                y: Math.round(y)
            });

            closeCreateForm();
            renderDots();
            if (panelOpen) renderPanel();
        });

        document.getElementById('ss-form-cancel').addEventListener('click', closeCreateForm);

        // Enter to save, Escape to cancel
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('ss-form-save').click();
            }
            if (e.key === 'Escape') closeCreateForm();
        });
    }

    function closeCreateForm() {
        const form = document.getElementById('ss-create-form');
        if (form) form.remove();
    }

    // --- UI: Side Panel ---
    function togglePanel() {
        panelOpen = !panelOpen;
        if (panelOpen) {
            renderPanel();
        } else {
            const panel = document.getElementById('ss-panel');
            if (panel) panel.remove();
        }
    }

    function renderPanel() {
        let panel = document.getElementById('ss-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'ss-panel';
            panel.style.cssText = `
                position: fixed;
                top: 0;
                right: 0;
                width: 360px;
                height: 100vh;
                background: white;
                border-left: 1px solid #ddd;
                overflow-y: auto;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 13px;
                box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(panel);
        }

        const open = annotations.filter(a => a.status !== 'resolved');
        const resolved = annotations.filter(a => a.status === 'resolved');

        const claudeOpen = open.filter(a => a.target === 'claude');
        const designerOpen = open.filter(a => a.target === 'designer');

        panel.innerHTML = `
            <div style="padding:16px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center">
                <strong>Annotations</strong>
                <button onclick="document.getElementById('ss-panel').remove()" style="border:none;background:none;cursor:pointer;font-size:18px;color:#999">✕</button>
            </div>
            ${renderPanelGroup('@claude', claudeOpen, '#1200CC')}
            ${renderPanelGroup('@designer', designerOpen, '#FF2B2B')}
            ${resolved.length ? `
                <div style="padding:12px 16px;border-top:1px solid #ddd;color:#999">
                    <strong>${resolved.length} resolved</strong>
                </div>
            ` : ''}
        `;

        // Close button
        panel.querySelector('button').addEventListener('click', () => {
            panelOpen = false;
        });
    }

    function renderPanelGroup(label, items, color) {
        if (!items.length) return `
            <div style="padding:12px 16px;border-bottom:1px solid #f0f0f0">
                <div style="color:${color};font-weight:600;margin-bottom:4px">${label} (0)</div>
                <div style="color:#999">No open annotations</div>
            </div>
        `;

        // Sort by priority: high → medium → low
        const order = { high: 0, medium: 1, low: 2 };
        items.sort((a, b) => (order[a.priority] || 1) - (order[b.priority] || 1));

        const rows = items.map(ann => `
            <div style="padding:8px 0;border-bottom:1px solid #f5f5f5" data-ann-id="${ann.id}">
                <div style="display:flex;justify-content:space-between;align-items:start">
                    <div>
                        <span style="color:#999;font-size:11px">${ann.block} · ${ann.priority}</span>
                        <div style="margin-top:2px">${ann.text}</div>
                        <div style="color:#999;font-size:11px;margin-top:2px">${ann.name} · ${new Date(ann.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div style="padding:12px 16px;border-bottom:1px solid #f0f0f0">
                <div style="color:${color};font-weight:600;margin-bottom:8px">${label} (${items.length})</div>
                ${rows}
            </div>
        `;
    }

    // --- Click Handler ---
    function handlePageClick(e) {
        if (!annotationMode) return;

        // Don't annotate the toolbar or existing annotations
        if (e.target.closest('#ss-annotation-toolbar') ||
            e.target.closest('.ss-dot') ||
            e.target.closest('#ss-create-form') ||
            e.target.closest('#ss-dot-menu') ||
            e.target.closest('#ss-panel')) return;

        e.preventDefault();
        e.stopPropagation();

        const x = (e.pageX / document.documentElement.scrollWidth) * 100;
        const y = e.pageY;

        showCreateForm(x, y);
    }

    // --- Keyboard Shortcuts ---
    function handleKeyboard(e) {
        // Alt+A: toggle annotation mode
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            toggleMode();
        }
        // Alt+P: toggle panel
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            togglePanel();
        }
        // Escape: close everything
        if (e.key === 'Escape') {
            closeCreateForm();
            closeDotMenu();
            if (annotationMode) toggleMode();
        }
    }

    // --- Init ---
    async function init() {
        createToolbar();
        await storage.load();
        renderDots();

        document.addEventListener('click', handlePageClick);
        document.addEventListener('keydown', handleKeyboard);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
