/**
 * Annotation Tool — SuperStories
 * Built-in review feedback for website projects.
 * Design: Denim City brand system (blue toolbar, red pins, Apercu Mono labels)
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
    let currentTarget = 'claude';
    let currentPriority = 'medium';
    let userName = localStorage.getItem('ss-annotation-name') || '';
    let pendingClick = null;

    // --- Storage Layer ---
    const storage = {
        async load() {
            if (API_URL) {
                try {
                    const headers = {};
                    if (API_KEY) headers['X-Annotation-Key'] = API_KEY;
                    const res = await fetch(`${API_URL}/annotations?project=${PROJECT}&page=${PAGE}`, { headers });
                    if (res.ok) {
                        annotations = await res.json();
                        return;
                    }
                } catch (e) {
                    console.warn('Annotation API unavailable, using localStorage');
                }
            }
            const stored = localStorage.getItem(STORAGE_KEY);
            annotations = stored ? JSON.parse(stored) : [];
            annotations = annotations.filter(a => a.page === PAGE);
        },

        async save(annotation) {
            if (API_URL) {
                try {
                    const headers = { 'Content-Type': 'application/json' };
                    if (API_KEY) headers['X-Annotation-Key'] = API_KEY;
                    const res = await fetch(`${API_URL}/annotations`, {
                        method: 'POST',
                        headers,
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
                    const headers = { 'Content-Type': 'application/json' };
                    if (API_KEY) headers['X-Annotation-Key'] = API_KEY;
                    const res = await fetch(`${API_URL}/annotations/${id}`, {
                        method: 'PUT',
                        headers,
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
                    const headers = {};
                    if (API_KEY) headers['X-Annotation-Key'] = API_KEY;
                    const res = await fetch(`${API_URL}/annotations/${id}`, {
                        method: 'DELETE',
                        headers
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

    // --- Inject Styles (Denim City brand) ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* ── Annotation Toolbar ── */
            #ss-toolbar {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                background: var(--primary, #1200CC);
                color: var(--bg, #FFE0DB);
                padding: 8px 16px;
                border-radius: 999px;
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 12px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.2);
            }
            #ss-toolbar button {
                background: none;
                border: none;
                color: var(--bg, #FFE0DB);
                font-size: 16px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                font-family: inherit;
                transition: background 0.15s;
            }
            #ss-toolbar button:hover {
                background: rgba(255,224,219,0.15);
            }
            #ss-toolbar .ss-active {
                background: var(--accent, #FF2B2B);
                color: white;
            }
            #ss-toolbar .ss-count {
                min-width: 20px;
                text-align: center;
            }

            /* ── Target/Priority Bar ── */
            #ss-mode-bar {
                position: fixed;
                bottom: 64px;
                right: 24px;
                z-index: 9999;
                display: none;
                align-items: center;
                gap: 6px;
                background: white;
                border: 1px solid var(--primary, #1200CC);
                padding: 6px 12px;
                border-radius: 999px;
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            }
            #ss-mode-bar.visible { display: flex; }
            #ss-mode-bar button {
                border: 1px solid var(--primary, #1200CC);
                background: none;
                color: var(--primary, #1200CC);
                padding: 4px 10px;
                border-radius: 999px;
                cursor: pointer;
                font-family: inherit;
                font-size: inherit;
                text-transform: uppercase;
                letter-spacing: inherit;
                transition: all 0.15s;
            }
            #ss-mode-bar button:hover { opacity: 0.7; }
            #ss-mode-bar button.ss-sel-claude {
                background: var(--primary, #1200CC);
                color: var(--bg, #FFE0DB);
            }
            #ss-mode-bar button.ss-sel-designer {
                background: var(--accent, #FF2B2B);
                color: white;
                border-color: var(--accent, #FF2B2B);
            }
            #ss-mode-bar button.ss-sel-pri {
                background: var(--primary, #1200CC);
                color: var(--bg, #FFE0DB);
            }
            #ss-mode-bar .ss-sep {
                color: #0000A540;
                margin: 0 2px;
            }

            /* ── Overlay (crosshair when annotating) ── */
            #ss-overlay {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 9990;
                cursor: crosshair;
            }
            body.ss-annotating #ss-overlay { display: block; }
            body.ss-annotating { cursor: crosshair; }

            /* ── Annotation Form ── */
            #ss-form {
                display: none;
                position: fixed;
                z-index: 10000;
                background: white;
                border: 1px solid var(--primary, #1200CC);
                padding: 20px;
                width: 280px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                font-family: var(--font-body, 'Apercu Pro', sans-serif);
                font-size: 14px;
            }
            #ss-form label {
                display: block;
                margin-bottom: 12px;
            }
            #ss-form label span {
                display: block;
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #0000A580;
                margin-bottom: 4px;
            }
            #ss-form input,
            #ss-form textarea {
                width: 100%;
                border: 1px solid var(--primary, #1200CC);
                padding: 8px;
                font-family: var(--font-body, 'Apercu Pro', sans-serif);
                font-size: 13px;
                background: var(--bg, #FFE0DB);
                color: var(--primary, #1200CC);
                outline: none;
                resize: vertical;
                box-sizing: border-box;
            }
            #ss-form-actions {
                display: flex;
                gap: 8px;
            }
            #ss-form-actions button {
                flex: 1;
                padding: 8px;
                border: 1px solid var(--primary, #1200CC);
                background: none;
                color: var(--primary, #1200CC);
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                cursor: pointer;
                transition: all 0.15s;
            }
            #ss-form-save {
                background: var(--primary, #1200CC) !important;
                color: var(--bg, #FFE0DB) !important;
            }
            #ss-form-save:hover {
                background: var(--accent, #FF2B2B) !important;
                border-color: var(--accent, #FF2B2B) !important;
            }

            /* ── Pins ── */
            .ss-pin {
                position: absolute;
                z-index: 9998;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transform: translate(-50%, -50%);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: transform 0.15s;
                color: white;
            }
            .ss-pin:hover {
                transform: translate(-50%, -50%) scale(1.2);
            }
            .ss-pin-claude {
                background: var(--primary, #1200CC);
            }
            .ss-pin-designer {
                background: var(--accent, #FF2B2B);
            }

            /* ── Pin Bubble ── */
            .ss-bubble {
                position: absolute;
                z-index: 9999;
                background: white;
                border: 1px solid var(--primary, #1200CC);
                padding: 16px;
                width: 260px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                font-family: var(--font-body, 'Apercu Pro', sans-serif);
                font-size: 13px;
                line-height: 1.5;
                display: none;
                transform: translate(-50%, 16px);
            }
            .ss-bubble.visible { display: block; }
            .ss-bubble-meta {
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 4px;
            }
            .ss-bubble-claude .ss-bubble-meta { color: var(--primary, #1200CC); }
            .ss-bubble-designer .ss-bubble-meta { color: var(--accent, #FF2B2B); }
            .ss-bubble-text {
                color: var(--primary, #1200CC);
            }
            .ss-bubble-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }
            .ss-bubble-actions button {
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #0000A580;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
            }
            .ss-bubble-actions button:hover {
                color: var(--accent, #FF2B2B);
            }

            /* ── Side Panel ── */
            #ss-panel {
                position: fixed;
                top: 0;
                right: 0;
                width: 340px;
                height: 100vh;
                background: white;
                border-left: 1px solid var(--primary, #1200CC);
                overflow-y: auto;
                z-index: 10001;
                font-family: var(--font-body, 'Apercu Pro', sans-serif);
                font-size: 13px;
                box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }
            #ss-panel-header {
                padding: 16px;
                border-bottom: 1px solid var(--primary, #1200CC);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            }
            #ss-panel-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: var(--primary, #1200CC);
            }
            .ss-panel-group {
                padding: 12px 16px;
                border-bottom: 1px solid #f0f0f0;
            }
            .ss-panel-group-title {
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 8px;
            }
            .ss-panel-item {
                padding: 8px 0;
                border-bottom: 1px solid #f5f5f5;
            }
            .ss-panel-item-meta {
                font-family: var(--font-mono, 'Apercu Mono', monospace);
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #0000A580;
            }
            .ss-panel-item-text {
                margin-top: 2px;
                color: var(--primary, #1200CC);
            }
        `;
        document.head.appendChild(style);
    }

    // --- Build UI ---
    function createUI() {
        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'ss-overlay';
        document.body.appendChild(overlay);

        // Toolbar (matches old design)
        const toolbar = document.createElement('div');
        toolbar.id = 'ss-toolbar';
        toolbar.innerHTML = `
            <button id="ss-toggle" title="Toggle annotations (Alt+A)">✎</button>
            <span class="ss-count" id="ss-count">0</span>
            <button id="ss-export" title="Export annotations">↓</button>
            <button id="ss-panel-btn" title="Annotation panel (Alt+P)">☰</button>
        `;
        document.body.appendChild(toolbar);

        // Mode bar (target + priority)
        const modeBar = document.createElement('div');
        modeBar.id = 'ss-mode-bar';
        modeBar.innerHTML = `
            <button class="ss-sel-claude" data-target="claude">@claude</button>
            <button data-target="designer">@designer</button>
            <span class="ss-sep">·</span>
            <button data-priority="high" style="border-color:var(--accent,#FF2B2B);color:var(--accent,#FF2B2B)">H</button>
            <button class="ss-sel-pri" data-priority="medium">M</button>
            <button data-priority="low" style="border-color:#0000A560;color:#0000A560">L</button>
        `;
        document.body.appendChild(modeBar);

        // Form
        const form = document.createElement('div');
        form.id = 'ss-form';
        form.innerHTML = `
            <label>
                <span>Name</span>
                <input type="text" id="ss-form-name" placeholder="Your name" value="${userName}">
            </label>
            <label>
                <span>Note</span>
                <textarea id="ss-form-note" rows="3" placeholder="Your annotation..."></textarea>
            </label>
            <div id="ss-form-actions">
                <button id="ss-form-save">Save</button>
                <button id="ss-form-cancel">Cancel</button>
            </div>
        `;
        document.body.appendChild(form);

        // --- Event Listeners ---

        // Toggle
        document.getElementById('ss-toggle').addEventListener('click', toggleMode);

        // Target buttons
        modeBar.querySelectorAll('[data-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentTarget = btn.dataset.target;
                modeBar.querySelectorAll('[data-target]').forEach(b => {
                    b.classList.remove('ss-sel-claude', 'ss-sel-designer');
                });
                btn.classList.add(currentTarget === 'claude' ? 'ss-sel-claude' : 'ss-sel-designer');
            });
        });

        // Priority buttons
        modeBar.querySelectorAll('[data-priority]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPriority = btn.dataset.priority;
                modeBar.querySelectorAll('[data-priority]').forEach(b => b.classList.remove('ss-sel-pri'));
                btn.classList.add('ss-sel-pri');
            });
        });

        // Panel button
        document.getElementById('ss-panel-btn').addEventListener('click', togglePanel);

        // Export
        document.getElementById('ss-export').addEventListener('click', exportAnnotations);

        // Overlay click (create annotation)
        overlay.addEventListener('click', (e) => {
            document.querySelectorAll('.ss-bubble').forEach(b => b.classList.remove('visible'));
            pendingClick = {
                x: e.clientX + window.scrollX,
                y: e.clientY + window.scrollY
            };
            const formEl = document.getElementById('ss-form');
            formEl.style.display = 'block';
            formEl.style.left = Math.min(e.clientX, window.innerWidth - 300) + 'px';
            formEl.style.top = (e.clientY + 20) + 'px';
            document.getElementById('ss-form-note').value = '';
            document.getElementById('ss-form-note').focus();
        });

        // Save
        document.getElementById('ss-form-save').addEventListener('click', async () => {
            const note = document.getElementById('ss-form-note').value.trim();
            const name = document.getElementById('ss-form-name').value.trim();
            if (!note) return;

            userName = name;
            localStorage.setItem('ss-annotation-name', userName);

            const block = detectBlock(
                document.elementFromPoint(
                    pendingClick.x - window.scrollX,
                    pendingClick.y - window.scrollY
                ) || document.body
            );

            await storage.save({
                project: PROJECT,
                page: PAGE,
                block: block,
                target: currentTarget,
                priority: currentPriority,
                text: note,
                name: userName,
                x: pendingClick.x,
                y: pendingClick.y
            });

            document.getElementById('ss-form').style.display = 'none';
            renderPins();
            updateCount();
        });

        // Cancel
        document.getElementById('ss-form-cancel').addEventListener('click', () => {
            document.getElementById('ss-form').style.display = 'none';
        });

        // Close bubbles on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ss-pin') && !e.target.closest('.ss-bubble')) {
                document.querySelectorAll('.ss-bubble').forEach(b => b.classList.remove('visible'));
            }
        });
    }

    // --- Toggle Mode ---
    function toggleMode() {
        annotationMode = !annotationMode;
        const btn = document.getElementById('ss-toggle');
        const modeBar = document.getElementById('ss-mode-bar');

        btn.classList.toggle('ss-active', annotationMode);
        document.body.classList.toggle('ss-annotating', annotationMode);
        modeBar.classList.toggle('visible', annotationMode);
    }

    // --- Update Count ---
    function updateCount() {
        const open = annotations.filter(a => a.status !== 'resolved');
        document.getElementById('ss-count').textContent = open.length;
    }

    // --- Render Pins ---
    function renderPins() {
        document.querySelectorAll('.ss-pin, .ss-bubble').forEach(el => el.remove());

        const open = annotations.filter(a => a.status !== 'resolved');
        open.forEach((ann, i) => {
            // Pin
            const pin = document.createElement('div');
            pin.className = `ss-pin ss-pin-${ann.target || 'claude'}`;
            pin.textContent = i + 1;
            pin.style.left = ann.x + 'px';
            pin.style.top = ann.y + 'px';

            // Bubble
            const bubble = document.createElement('div');
            bubble.className = `ss-bubble ss-bubble-${ann.target || 'claude'}`;
            bubble.style.left = ann.x + 'px';
            bubble.style.top = (ann.y + 12) + 'px';
            bubble.innerHTML = `
                <div class="ss-bubble-meta">@${ann.target || 'claude'} · ${ann.block || 'general'} · ${ann.priority || 'medium'} · ${ann.name || 'Anonymous'}</div>
                <div class="ss-bubble-text">${ann.text}</div>
                <div class="ss-bubble-actions">
                    <button class="ss-resolve-btn">Resolve</button>
                    <button class="ss-delete-btn">Delete</button>
                </div>
            `;

            pin.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.ss-bubble').forEach(b => b.classList.remove('visible'));
                bubble.classList.toggle('visible');
            });

            bubble.querySelector('.ss-resolve-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                await storage.resolve(ann.id);
                renderPins();
                updateCount();
                if (panelOpen) renderPanel();
            });

            bubble.querySelector('.ss-delete-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                await storage.remove(ann.id);
                renderPins();
                updateCount();
                if (panelOpen) renderPanel();
            });

            document.body.appendChild(pin);
            document.body.appendChild(bubble);
        });
    }

    // --- Panel ---
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
        if (panel) panel.remove();

        panel = document.createElement('div');
        panel.id = 'ss-panel';

        const open = annotations.filter(a => a.status !== 'resolved');
        const resolved = annotations.filter(a => a.status === 'resolved');
        const claudeOpen = open.filter(a => a.target === 'claude');
        const designerOpen = open.filter(a => a.target === 'designer');

        const order = { high: 0, medium: 1, low: 2 };
        claudeOpen.sort((a, b) => (order[a.priority] || 1) - (order[b.priority] || 1));
        designerOpen.sort((a, b) => (order[a.priority] || 1) - (order[b.priority] || 1));

        panel.innerHTML = `
            <div id="ss-panel-header">
                <span>Annotations · ${open.length} open</span>
                <button id="ss-panel-close">✕</button>
            </div>
            ${renderGroup('@claude', claudeOpen, 'var(--primary, #1200CC)')}
            ${renderGroup('@designer', designerOpen, 'var(--accent, #FF2B2B)')}
            ${resolved.length ? `<div class="ss-panel-group" style="color:#0000A560">${resolved.length} resolved</div>` : ''}
        `;

        document.body.appendChild(panel);
        document.getElementById('ss-panel-close').addEventListener('click', () => {
            panelOpen = false;
            panel.remove();
        });
    }

    function renderGroup(label, items, color) {
        if (!items.length) {
            return `<div class="ss-panel-group">
                <div class="ss-panel-group-title" style="color:${color}">${label} (0)</div>
                <div style="color:#0000A560">No open annotations</div>
            </div>`;
        }
        const rows = items.map(a => `
            <div class="ss-panel-item">
                <div class="ss-panel-item-meta">${a.block || 'general'} · ${a.priority || 'medium'} · ${a.name || 'Anonymous'}</div>
                <div class="ss-panel-item-text">${a.text}</div>
            </div>
        `).join('');
        return `<div class="ss-panel-group">
            <div class="ss-panel-group-title" style="color:${color}">${label} (${items.length})</div>
            ${rows}
        </div>`;
    }

    // --- Export ---
    function exportAnnotations() {
        const open = annotations.filter(a => a.status !== 'resolved');
        let md = `# Annotations — ${PROJECT}\n\n`;
        md += `Page: ${PAGE}\n`;
        md += `Exported: ${new Date().toLocaleDateString('nl-NL')}\n\n`;

        ['claude', 'designer'].forEach(target => {
            const items = open.filter(a => a.target === target);
            if (!items.length) return;
            md += `## @${target}\n\n`;
            items.forEach((a, i) => {
                md += `### ${i + 1}. ${a.name || 'Anonymous'} [${a.priority || 'medium'}] — ${a.block || 'general'}\n`;
                md += `${a.text}\n\n`;
            });
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `annotations-${PROJECT}.md`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'a') { e.preventDefault(); toggleMode(); }
        if (e.altKey && e.key === 'p') { e.preventDefault(); togglePanel(); }
        if (e.key === 'Escape') {
            document.getElementById('ss-form').style.display = 'none';
            if (annotationMode) toggleMode();
        }
    });

    // --- Init ---
    async function init() {
        injectStyles();
        createUI();
        await storage.load();
        renderPins();
        updateCount();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
