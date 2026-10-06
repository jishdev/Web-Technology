/* ==========================================================================
   HASH '27 — TechFest Website
   Complete JavaScript (ES6+)
   ========================================================================== */

'use strict';

// ==========================================================================
// SECURITY: escape untrusted strings before they're placed in innerHTML.
// Registration fields, task text, and the welcome name all come from user
// input — without this, a malicious value (e.g. a name like
// "<img src=x onerror=alert(1)>") would execute as script in the admin
// panel. This is a defensive measure only; nothing else changes.
// ==========================================================================
function escapeHTML(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ==========================================================================
// 1. WELCOME MESSAGE (sessionStorage) — modal dialog + toast
// ==========================================================================
(function initWelcome() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const userName = sessionStorage.getItem('hash_username');

    function showToast(name) {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.innerHTML = `Welcome, <strong>${escapeHTML(name)}</strong>!`;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    function finish(rawName) {
        const name = rawName && rawName.trim() ? rawName.trim() : 'Guest';
        sessionStorage.setItem('hash_username', name);
        showToast(name);
    }

    if (userName) {
        showToast(userName);
        return;
    }

    // --- Build the welcome modal ---
    const overlay = document.createElement('div');
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
        <div class="welcome-modal">
            <span class="welcome-modal-kicker">HASH '27 &middot; ACCESS</span>
            <h2>Welcome aboard 👋</h2>
            <p>Tell us your name so we can greet you properly.</p>
            <input type="text" id="welcomeNameInput" class="welcome-input" placeholder="Your name" autocomplete="off" maxlength="40">
            <div class="welcome-actions">
                <button type="button" id="welcomeSkipBtn" class="welcome-btn-skip">Skip</button>
                <button type="button" id="welcomeContinueBtn" class="welcome-btn-primary">
                    <span>Continue</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#welcomeNameInput');
    const continueBtn = overlay.querySelector('#welcomeContinueBtn');
    const skipBtn = overlay.querySelector('#welcomeSkipBtn');

    requestAnimationFrame(() => {
        overlay.classList.add('show');
        input.focus();
    });

    function closeModal(name) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 400);
        finish(name);
    }

    continueBtn.addEventListener('click', () => closeModal(input.value));
    skipBtn.addEventListener('click', () => closeModal(''));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') closeModal(input.value);
    });
})();


// ==========================================================================
// 2. REGISTRATION FORM VALIDATION & PARTICIPANT MANAGEMENT
// ==========================================================================
(function initRegistration() {
    const registerForm = document.querySelector('.register-form');
    if (!registerForm) return;

    // --- Add novalidate to let JS handle validation ---
    registerForm.setAttribute('novalidate', 'novalidate');
    
    // Remove inline onsubmit
    registerForm.removeAttribute('onsubmit');

    // --- Get form fields ---
    const eventSelect = registerForm.querySelector('select');
    const nameInput = registerForm.querySelector('input[type="text"]');
    const emailInput = registerForm.querySelector('input[type="email"]');
    const phoneInput = registerForm.querySelector('input[type="tel"]');
    const yearSelect = registerForm.querySelectorAll('select')[1];
    const deptInput = registerForm.querySelectorAll('input[type="text"]')[1];
    const instInput = registerForm.querySelectorAll('input[type="text"]')[2];
    const teamInput = registerForm.querySelectorAll('input[type="text"]')[3];

    // --- Create error message spans ---
    const fields = [
        eventSelect, nameInput, emailInput, phoneInput, 
        yearSelect, deptInput, instInput
    ];
    
    fields.forEach(field => {
        if (!field) return;
        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.style.cssText = `
            font-size: 0.7rem;
            color: #ff3366;
            margin-top: 4px;
            display: none;
            letter-spacing: 0.5px;
        `;
        field.parentNode.appendChild(errorSpan);
    });

    // --- Validation patterns ---
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[6-9]\d{9}$/,
        dept: /^[a-zA-Z\s]{2,30}$/,
        inst: /^[a-zA-Z\s.,'-]{2,100}$/
    };

    // --- Show/hide error ---
    function showError(field, message) {
        const errorSpan = field.parentNode.querySelector('.field-error');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
        field.style.borderColor = '#ff3366';
        field.style.boxShadow = '0 0 10px rgba(255, 51, 102, 0.2)';
    }

    function clearError(field) {
        const errorSpan = field.parentNode.querySelector('.field-error');
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
        field.style.borderColor = 'rgba(0, 194, 255, 0.35)';
        field.style.boxShadow = '0 0 10px rgba(0, 194, 255, 0.1)';
    }

    // --- Real-time validation ---
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() === '') {
            clearError(nameInput);
        } else if (!patterns.name.test(nameInput.value.trim())) {
            showError(nameInput, 'Only letters and spaces, 2-50 characters');
        } else {
            clearError(nameInput);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() === '') {
            clearError(emailInput);
        } else if (!patterns.email.test(emailInput.value.trim())) {
            showError(emailInput, 'Enter a valid email address');
        } else {
            clearError(emailInput);
        }
    });

    phoneInput.addEventListener('input', () => {
        if (phoneInput.value.trim() === '') {
            clearError(phoneInput);
        } else if (!patterns.phone.test(phoneInput.value.trim())) {
            showError(phoneInput, 'Enter a valid 10-digit Indian mobile number');
        } else {
            clearError(phoneInput);
        }
    });

    // --- Form submission ---
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate event
        if (!eventSelect.value) {
            showError(eventSelect, 'Please select an event');
            isValid = false;
        } else {
            clearError(eventSelect);
        }

        // Validate name
        if (!nameInput.value.trim() || !patterns.name.test(nameInput.value.trim())) {
            showError(nameInput, 'Name must be 2-50 letters only');
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // Validate email
        if (!emailInput.value.trim() || !patterns.email.test(emailInput.value.trim())) {
            showError(emailInput, 'Enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Validate phone
        if (!phoneInput.value.trim() || !patterns.phone.test(phoneInput.value.trim())) {
            showError(phoneInput, 'Enter a valid 10-digit Indian mobile number');
            isValid = false;
        } else {
            clearError(phoneInput);
        }

        // Validate year
        if (!yearSelect.value) {
            showError(yearSelect, 'Select your year of study');
            isValid = false;
        } else {
            clearError(yearSelect);
        }

        // Validate department
        if (!deptInput.value.trim() || !patterns.dept.test(deptInput.value.trim())) {
            showError(deptInput, 'Department is required');
            isValid = false;
        } else {
            clearError(deptInput);
        }

        // Validate institution
        if (!instInput.value.trim() || !patterns.inst.test(instInput.value.trim())) {
            showError(instInput, 'Institution name is required');
            isValid = false;
        } else {
            clearError(instInput);
        }

        if (!isValid) return;

        // --- Save participant ---
        const participant = {
            id: Date.now(),
            event: eventSelect.options[eventSelect.selectedIndex].text,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            year: yearSelect.value,
            dept: deptInput.value.trim(),
            inst: instInput.value.trim(),
            team: teamInput ? teamInput.value.trim() : '',
            registeredAt: new Date().toLocaleString()
        };

        saveParticipant(participant);
        registerForm.reset();
        fields.forEach(f => clearError(f));
        
        // Show success
        alert(`✅ ${participant.name} registered successfully for ${participant.event}!`);
    });

    // --- Participant Storage (save only — the list itself lives in /admin) ---
    function getParticipants() {
        return JSON.parse(localStorage.getItem('hash_participants')) || [];
    }

    function saveParticipant(participant) {
        const participants = getParticipants();
        participants.push(participant);
        localStorage.setItem('hash_participants', JSON.stringify(participants));
    }
})();


// ==========================================================================
// 3. ADMIN PANEL (participants list + task manager, behind /admin login)
// ==========================================================================
(function initAdminPanel() {
    const gate = document.getElementById('admin-gate');
    const dashboard = document.getElementById('admin-dashboard');
    if (!gate || !dashboard) return;

    const ADMIN_USER = 'ADMINMBCET';
    const ADMIN_PASS = 'Admin#TechFest2027';

    // --- Build the participants panel markup ---
    const participantsMount = document.getElementById('admin-participants-mount');
    if (participantsMount) {
        participantsMount.innerHTML = `
            <h2>Registration Desk</h2>
            <p class="admin-participants-intro">Everyone who has registered for HASH '27</p>
            <div class="admin-stats-row" id="admin-stats-row"></div>
            <div class="participants-header">
                <h3>Registered Participants (<span id="participant-count">0</span>)</h3>
                <div class="participants-controls">
                    <input type="text" id="participant-search" placeholder="Search participants..." class="search-input">
                    <button id="export-csv-btn" class="export-btn">⬇ Export CSV</button>
                    <button id="clear-all-btn" class="clear-all-btn">Clear All</button>
                </div>
            </div>
            <div id="participants-container" class="participants-list"></div>
        `;
    }

    // --- Build the task manager markup ---
    const tasksMount = document.getElementById('admin-tasks-mount');
    if (tasksMount) {
        tasksMount.innerHTML = `
            <div class="task-manager-section">
                <div class="task-manager-card">
                    <h3>📋 Organizer's Task Manager</h3>
                    <div class="task-input-row">
                        <input type="text" id="task-input" placeholder="Add a new task..." class="task-input">
                        <button id="task-add-btn" class="task-add-btn">Add Task</button>
                    </div>
                    <div id="task-list" class="task-list"></div>
                </div>
            </div>
        `;
    }

    // --- Build the access log markup ---
    const logMount = document.getElementById('admin-log-mount');
    if (logMount) {
        logMount.innerHTML = `
            <div class="admin-log-section">
                <div class="admin-log-card">
                    <div class="admin-log-header">
                        <h3>🛡️ Access Log</h3>
                        <button id="admin-log-clear-btn" class="clear-all-btn">Clear Log</button>
                    </div>
                    <div id="admin-log-list" class="admin-log-list"></div>
                </div>
            </div>
        `;
    }

    // --- Participant Storage ---
    function getParticipants() {
        return JSON.parse(localStorage.getItem('hash_participants')) || [];
    }

    function updateParticipant(id, updatedData) {
        let participants = getParticipants();
        participants = participants.map(p => p.id === id ? { ...p, ...updatedData } : p);
        localStorage.setItem('hash_participants', JSON.stringify(participants));
        renderParticipants();
        renderStats();
    }

    function deleteParticipant(id) {
        let participants = getParticipants();
        participants = participants.filter(p => p.id !== id);
        localStorage.setItem('hash_participants', JSON.stringify(participants));
        renderParticipants();
        renderStats();
    }

    // --- Render Participants Table ---
    function renderParticipants(filter = '') {
        const container = document.getElementById('participants-container');
        if (!container) return;

        let participants = getParticipants();

        if (filter) {
            participants = participants.filter(p =>
                p.name.toLowerCase().includes(filter.toLowerCase()) ||
                p.event.toLowerCase().includes(filter.toLowerCase()) ||
                p.email.toLowerCase().includes(filter.toLowerCase())
            );
        }

        const countSpan = document.getElementById('participant-count');
        if (countSpan) countSpan.textContent = participants.length;

        if (participants.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;">No participants registered yet.</p>';
            return;
        }

        container.innerHTML = participants.map(p => `
            <div class="participant-row" data-id="${p.id}">
                <div class="participant-info">
                    <strong>${escapeHTML(p.name)}</strong>
                    <span>${escapeHTML(p.event)}</span>
                    <small>${escapeHTML(p.email)} | ${escapeHTML(p.phone)} | ${escapeHTML(p.inst)}</small>
                </div>
                <div class="participant-actions">
                    <button class="btn-edit" data-id="${p.id}" title="Edit">✏️</button>
                    <button class="btn-delete" data-id="${p.id}" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');

        // Attach event listeners
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this participant?')) {
                    deleteParticipant(Number(btn.dataset.id));
                }
            });
        });

        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                const participants = getParticipants();
                const p = participants.find(p => p.id === id);
                if (!p) return;

                const newName = prompt('Edit name:', p.name);
                if (newName && newName.trim()) {
                    updateParticipant(id, { name: newName.trim() });
                }
            });
        });
    }

    // --- Stats strip ---
    function renderStats() {
        const statsRow = document.getElementById('admin-stats-row');
        if (!statsRow) return;

        const participants = getParticipants();
        const total = participants.length;
        const eventCounts = {};
        participants.forEach(p => {
            eventCounts[p.event] = (eventCounts[p.event] || 0) + 1;
        });

        let topEvent = '—';
        let topCount = 0;
        Object.entries(eventCounts).forEach(([ev, count]) => {
            if (count > topCount) {
                topCount = count;
                topEvent = ev;
            }
        });

        statsRow.innerHTML = `
            <div class="admin-stat-card">
                <span class="admin-stat-value">${total}</span>
                <span class="admin-stat-label">Total Registrations</span>
            </div>
            <div class="admin-stat-card">
                <span class="admin-stat-value">${Object.keys(eventCounts).length}</span>
                <span class="admin-stat-label">Events with Signups</span>
            </div>
            <div class="admin-stat-card">
                <span class="admin-stat-value">${escapeHTML(topEvent)}</span>
                <span class="admin-stat-label">Most Popular${topCount ? ` (${topCount})` : ''}</span>
            </div>
        `;
    }

    // --- CSV Export ---
    // Fields are quoted/escaped for normal CSV rules, and any value
    // starting with =, +, -, or @ gets a leading apostrophe so it can't
    // execute as a formula when the file is opened in Excel/Sheets
    // ("CSV injection" — a real, common spreadsheet-export vulnerability).
    function csvCell(value) {
        let v = String(value ?? '');
        if (/^[=+\-@]/.test(v)) v = `'${v}`;
        v = v.replace(/"/g, '""');
        if (/[",\n]/.test(v)) v = `"${v}"`;
        return v;
    }

    function exportParticipantsCSV() {
        const participants = getParticipants();
        if (participants.length === 0) {
            alert('No participants to export yet.');
            return;
        }

        const headers = ['Name', 'Event', 'Email', 'Phone', 'Year', 'Department', 'Institution', 'Team', 'Registered At'];
        const rows = participants.map(p => [
            p.name, p.event, p.email, p.phone, p.year, p.dept, p.inst, p.team, p.registeredAt
        ].map(csvCell).join(','));

        const csv = [headers.join(','), ...rows].join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hash27-participants-${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    // --- Search / Export / Clear All ---
    const searchInput = document.getElementById('participant-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderParticipants(searchInput.value);
        });
    }

    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportParticipantsCSV);
    }

    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Delete ALL registered participants? This cannot be undone.')) {
                localStorage.removeItem('hash_participants');
                renderParticipants();
                renderStats();
            }
        });
    }

    // --- Task Storage ---
    function getTasks() {
        return JSON.parse(localStorage.getItem('hash_tasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('hash_tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        const tasks = getTasks();

        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:15px;">No tasks yet. Add one!</p>';
            return;
        }

        taskList.innerHTML = tasks.map(t => `
            <div class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
                <span class="task-text">${escapeHTML(t.text)}</span>
                <div class="task-actions">
                    <button class="task-toggle" data-id="${t.id}">${t.completed ? '↩️' : '✅'}</button>
                    <button class="task-delete" data-id="${t.id}">🗑️</button>
                </div>
            </div>
        `).join('');

        taskList.querySelectorAll('.task-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const tasks = getTasks();
                const task = tasks.find(t => t.id === Number(btn.dataset.id));
                if (task) {
                    task.completed = !task.completed;
                    saveTasks(tasks);
                    renderTasks();
                }
            });
        });

        taskList.querySelectorAll('.task-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                let tasks = getTasks();
                tasks = tasks.filter(t => t.id !== Number(btn.dataset.id));
                saveTasks(tasks);
                renderTasks();
            });
        });
    }

    const addBtn = document.getElementById('task-add-btn');
    const taskInput = document.getElementById('task-input');

    if (addBtn && taskInput) {
        addBtn.addEventListener('click', () => {
            const text = taskInput.value.trim();
            if (!text) return;

            const tasks = getTasks();
            tasks.push({ id: Date.now(), text, completed: false });
            saveTasks(tasks);
            taskInput.value = '';
            renderTasks();
        });

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
    }

    // --- Access Log (persists across sessions so an organizer can review
    //     login history; never stores the password, only who/when/outcome) ---
    const AUDIT_KEY = 'hash_admin_audit';
    const AUDIT_MAX = 50;

    function getAuditLog() {
        return JSON.parse(localStorage.getItem(AUDIT_KEY)) || [];
    }

    function addAuditEntry(success, username) {
        const log = getAuditLog();
        log.unshift({
            time: new Date().toLocaleString(),
            success,
            username: username ? username.slice(0, 30) : ''
        });
        if (log.length > AUDIT_MAX) log.length = AUDIT_MAX;
        localStorage.setItem(AUDIT_KEY, JSON.stringify(log));
        renderAuditLog();
    }

    function renderAuditLog() {
        const list = document.getElementById('admin-log-list');
        if (!list) return;

        const log = getAuditLog();
        if (log.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:15px;">No access attempts logged yet.</p>';
            return;
        }

        list.innerHTML = log.map(entry => `
            <div class="admin-log-item ${entry.success ? 'success' : 'failed'}">
                <span class="admin-log-time">${escapeHTML(entry.time)}</span>
                <span class="admin-log-status">${entry.success ? '✅ Successful login' : '⛔ Failed attempt'}${entry.username ? ` — ${escapeHTML(entry.username)}` : ''}</span>
            </div>
        `).join('');
    }

    const logClearBtn = document.getElementById('admin-log-clear-btn');
    if (logClearBtn) {
        logClearBtn.addEventListener('click', () => {
            if (confirm('Clear the access log?')) {
                localStorage.removeItem(AUDIT_KEY);
                renderAuditLog();
            }
        });
    }

    // Initial render (dashboard stays hidden until login, so this is cheap/safe)
    renderParticipants();
    renderStats();
    renderTasks();
    renderAuditLog();

    // --- Password Gate ---
    const loginForm = document.getElementById('admin-login-form');
    const userInput = document.getElementById('admin-username');
    const passInput = document.getElementById('admin-password');
    const loginBtn = document.getElementById('admin-login-btn');
    const errorSpan = document.getElementById('admin-login-error');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // --- Brute-force lockout: 5 failed attempts locks the form for 60s.
    //     State lives in localStorage so it survives a page reload — a
    //     sessionStorage-only lockout could be trivially reset by reopening
    //     the tab. ---
    const LOGIN_STATE_KEY = 'hash_admin_login_state';
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_MS = 60 * 1000;
    let lockoutInterval = null;

    function getLoginState() {
        return JSON.parse(localStorage.getItem(LOGIN_STATE_KEY)) || { attempts: 0, lockoutUntil: 0 };
    }

    function saveLoginState(state) {
        localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(state));
    }

    function setFormDisabled(disabled) {
        if (userInput) userInput.disabled = disabled;
        if (passInput) passInput.disabled = disabled;
        if (loginBtn) loginBtn.disabled = disabled;
    }

    // Returns true if still locked out (and updates the countdown UI).
    function checkLockout() {
        const remaining = getLoginState().lockoutUntil - Date.now();
        if (remaining <= 0) {
            if (lockoutInterval) {
                clearInterval(lockoutInterval);
                lockoutInterval = null;
            }
            setFormDisabled(false);
            return false;
        }

        setFormDisabled(true);
        errorSpan.className = 'admin-login-error warning';
        errorSpan.textContent = `Too many failed attempts. Try again in ${Math.ceil(remaining / 1000)}s.`;
        errorSpan.style.display = 'block';

        if (!lockoutInterval) {
            lockoutInterval = setInterval(checkLockout, 1000);
        }
        return true;
    }

    checkLockout(); // in case the page was reloaded mid-lockout

    // --- Idle auto-logout: 10 minutes of no activity signs the admin out. ---
    const IDLE_LIMIT_MS = 10 * 60 * 1000;
    let idleTimer = null;

    function resetIdleTimer() {
        if (sessionStorage.getItem('hash_admin_auth') !== 'true') return;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            sessionStorage.removeItem('hash_admin_auth');
            showGate('Session expired due to inactivity. Please log in again.');
        }, IDLE_LIMIT_MS);
    }

    ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
        document.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    function showDashboard() {
        gate.style.display = 'none';
        dashboard.style.display = 'block';
        renderParticipants();
        renderStats();
        renderTasks();
        renderAuditLog();
        resetIdleTimer();
    }

    function showGate(message) {
        clearTimeout(idleTimer);
        dashboard.style.display = 'none';
        gate.style.display = 'flex';
        if (userInput) userInput.value = '';
        if (passInput) passInput.value = '';
        if (message) {
            errorSpan.className = 'admin-login-error warning';
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        } else {
            errorSpan.style.display = 'none';
        }
    }

    if (sessionStorage.getItem('hash_admin_auth') === 'true') {
        showDashboard();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (checkLockout()) return;

            const u = userInput.value.trim();
            const p = passInput.value;

            if (u === ADMIN_USER && p === ADMIN_PASS) {
                saveLoginState({ attempts: 0, lockoutUntil: 0 });
                sessionStorage.setItem('hash_admin_auth', 'true');
                addAuditEntry(true, u);
                errorSpan.className = 'admin-login-error';
                errorSpan.style.display = 'none';
                showDashboard();
            } else {
                const state = getLoginState();
                state.attempts += 1;
                addAuditEntry(false, u);

                if (state.attempts >= MAX_ATTEMPTS) {
                    state.lockoutUntil = Date.now() + LOCKOUT_MS;
                    state.attempts = 0;
                    saveLoginState(state);
                    checkLockout();
                } else {
                    saveLoginState(state);
                    errorSpan.className = 'admin-login-error';
                    errorSpan.textContent = `Invalid username or password. ${MAX_ATTEMPTS - state.attempts} attempt(s) left.`;
                    errorSpan.style.display = 'block';
                }
                passInput.value = '';
                passInput.focus();
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('hash_admin_auth');
            showGate();
        });
    }
})();


// ==========================================================================
// 4. INTERACTIVE GALLERY LIGHTBOX
// ==========================================================================
(function initGallery() {
    const galleryDeck = document.getElementById('galleryDeck');
    const lightbox = document.getElementById('lightbox');
    if (!galleryDeck || !lightbox) return;

    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const slideshowBtn = document.getElementById('slideshowBtn');
    const stopBtn = document.getElementById('stopBtn');

    const teaserCards = galleryDeck.querySelectorAll('.teaser-card');
    let currentIndex = 0;
    let slideshowInterval = null;

    // --- Open lightbox ---
    teaserCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
            lightbox.style.display = 'flex';
        });
    });

    function showImage(index) {
        const cards = galleryDeck.querySelectorAll('.teaser-card');
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        currentIndex = index;
        const imgSrc = cards[index].getAttribute('data-full');
        lightboxImg.src = imgSrc;
    }

    // --- Close lightbox ---
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        stopSlideshow();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            stopSlideshow();
        }
    });

    // --- Navigation ---
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    // --- Keyboard controls ---
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display !== 'flex') return;
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
            stopSlideshow();
        }
    });

    // --- Slideshow ---
    function startSlideshow() {
        stopSlideshow();
        slideshowInterval = setInterval(() => {
            showImage(currentIndex + 1);
        }, 3000);
        slideshowBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
    }

    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
        if (slideshowBtn) slideshowBtn.style.display = 'inline-block';
        if (stopBtn) stopBtn.style.display = 'none';
    }

    slideshowBtn.addEventListener('click', startSlideshow);
    stopBtn.addEventListener('click', stopSlideshow);
})();


// ==========================================================================
// 5. DYNAMIC EVENTS (for events.html if needed)
// ==========================================================================
(function initDynamicEvents() {
    const eventsContainer = document.querySelector('.schedule-container');
    if (!eventsContainer) return;

    // Events data can be managed from here if needed
    console.log('📅 Events page loaded — schedule is static HTML.');
})();


console.log('✅ HASH \'27 — All JavaScript modules loaded successfully.');