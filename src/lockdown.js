// Console/devtools deterrent with owner bypass.
// Note: DevTools cannot be truly blocked; this hides console output,
// blocks common shortcuts, and overlays the page if DevTools is likely open.

(function () {
    const BYPASS_KEY = '__DT_ALLOW_UNTIL__';
    const BYPASS_MINUTES = 10;

    function now() {
        return Date.now();
    }

    function isBypassed() {
        try {
            const v = localStorage.getItem(BYPASS_KEY);
            return v && Number(v) > now();
        } catch (_) { return false; }
    }

    function enableBypass(minutes) {
        try { localStorage.setItem(BYPASS_KEY, String(now() + (minutes * 60 * 1000))); } catch (_) {}
    }

    function disableBypass() {
        try { localStorage.removeItem(BYPASS_KEY); } catch (_) {}
    }

    function toggleBypass() {
        if (isBypassed()) {
            disableBypass();
            toast('Devtools bypass disabled');
        } else {
            enableBypass(BYPASS_MINUTES);
            toast('Devtools bypass enabled for ' + BYPASS_MINUTES + ' min');
        }
    }

    function toast(text) {
        try {
            const el = document.createElement('div');
            el.textContent = text;
            el.style.position = 'fixed';
            el.style.right = '12px';
            el.style.bottom = '12px';
            el.style.zIndex = '2147483647';
            el.style.background = 'rgba(0,0,0,.8)';
            el.style.color = '#fff';
            el.style.padding = '8px 10px';
            el.style.borderRadius = '8px';
            el.style.font = '12px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
            document.body.appendChild(el);
            setTimeout(() => { try { el.remove(); } catch(_){} }, 1500);
        } catch (_) {}
    }

    // Owner bypass toggle: Ctrl+Alt+D
    try {
        document.addEventListener('keydown', (e) => {
            const key = (e.key || '').toUpperCase();
            if (e.ctrlKey && e.altKey && key === 'D') {
                e.preventDefault();
                e.stopPropagation();
                toggleBypass();
            }
        }, { capture: true });
    } catch (_) {}

    if (isBypassed()) {
        return; // allow devtools for owner temporarily
    }

    const noop = () => {};

    // Replace console methods with no-ops
    try {
        const methods = [
            'log','info','debug','warn','error','table','trace','dir',
            'group','groupCollapsed','groupEnd','time','timeEnd','clear'
        ];
        for (const m of methods) {
            try { console[m] = noop; } catch (_) {}
        }
        try { Object.freeze(console); } catch (_) {}
    } catch (_) {}

    // Block right-click context menu
    try {
        document.addEventListener('contextmenu', (e) => { e.preventDefault(); }, { capture: true });
    } catch (_) {}

    // Block common DevTools shortcuts
    try {
        document.addEventListener('keydown', (e) => {
            const key = (e.key || '').toUpperCase();
            const combo = (
                key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (key === 'I' || key === 'J' || key === 'C' || key === 'K')) ||
                (e.ctrlKey && !e.shiftKey && key === 'U')
            );
            if (combo) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { capture: true });
    } catch (_) {}

    // Lightweight DevTools heuristic: large difference between outer and inner window size
    (function () {
        const OVERLAY_ID = 'devtools-overlay';
        const THRESHOLD = 200; // px difference before assuming DevTools is open

        function ensureOverlay() {
            let overlay = document.getElementById(OVERLAY_ID);
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = OVERLAY_ID;
                overlay.setAttribute('aria-hidden', 'true');
                overlay.style.position = 'fixed';
                overlay.style.inset = '0';
                overlay.style.display = 'none';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.background = '#000';
                overlay.style.color = '#fff';
                overlay.style.zIndex = '2147483647';
                overlay.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
                overlay.innerHTML = '<div style="text-align:center;padding:20px;">Developer tools are disabled on this site.</div>';
                document.documentElement.appendChild(overlay);
            }
            return overlay;
        }

        function checkDevTools() {
            // Avoid false positives on very small viewports
            if (window.innerWidth <= 420 || window.innerHeight <= 300) {
                toggleOverlay(false);
                return;
            }
            const wDiff = Math.abs((window.outerWidth || 0) - (window.innerWidth || 0));
            const hDiff = Math.abs((window.outerHeight || 0) - (window.innerHeight || 0));
            const open = wDiff > THRESHOLD || hDiff > THRESHOLD;
            toggleOverlay(open);
        }

        function toggleOverlay(show) {
            const overlay = ensureOverlay();
            overlay.style.display = show ? 'flex' : 'none';
            if (show) {
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.documentElement.style.overflow = '';
            }
        }

        window.addEventListener('resize', checkDevTools);
        window.addEventListener('focus', checkDevTools);
        setInterval(checkDevTools, 1200);
        checkDevTools();
    })();
})();

