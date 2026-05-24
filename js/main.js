/* ===================================================
   School Management System - JavaScript
   =================================================== */

'use strict';

// ---- Sidebar Toggle (Mobile) --------------------------------
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay && sidebarOverlay.classList.toggle('show');
    });
}
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar && sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    });
}

// ---- Password Visibility Toggle ----------------------------
document.querySelectorAll('.toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.closest('.input-icon-wrap').querySelector('input');
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.classList.toggle('fa-eye', isText);
        btn.classList.toggle('fa-eye-slash', !isText);
    });
});

// ---- Password Strength Meter --------------------------------
const pwdInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

if (pwdInput && strengthBar) {
    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', '#ff4d6d', '#ffb347', '#6c63ff', '#00e5a0'];
        const pct = (score / 4) * 100;

        strengthBar.style.width = pct + '%';
        strengthBar.style.background = colors[score];
        if (strengthText) {
            strengthText.textContent = score > 0 ? levels[score] : '';
            strengthText.style.color = colors[score];
        }
    });
}

// ---- Confirm Password Validation ---------------------------
const confirmPwd = document.getElementById('confirm_password');
if (confirmPwd && pwdInput) {
    confirmPwd.addEventListener('input', () => {
        if (confirmPwd.value !== pwdInput.value) {
            confirmPwd.style.borderColor = 'var(--danger)';
        } else {
            confirmPwd.style.borderColor = 'var(--success)';
        }
    });
}

// ---- Register Role Dynamic Fields --------------------------
const roleSelect = document.getElementById('role');
const teacherFields = document.getElementById('teacherFields');
const studentFields = document.getElementById('studentFields');

function toggleRoleFields() {
    if (!roleSelect) return;
    const role = roleSelect.value;
    if (teacherFields) teacherFields.style.display = role === 'teacher' ? '' : 'none';
    if (studentFields) studentFields.style.display = role === 'student' ? '' : 'none';
}

if (roleSelect) {
    roleSelect.addEventListener('change', toggleRoleFields);
    toggleRoleFields();
}

// ---- Auto-dismiss alerts -----------------------------------
document.querySelectorAll('.alert-glass[data-autodismiss]').forEach(alert => {
    const delay = parseInt(alert.dataset.autodismiss) || 4000;
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(-10px)';
        alert.style.transition = 'all 0.4s ease';
        setTimeout(() => alert.remove(), 400);
    }, delay);
});

// ---- Table Search Filter -----------------------------------
document.querySelectorAll('[data-search]').forEach(searchInput => {
    const targetId = searchInput.dataset.search;
    const table = document.getElementById(targetId);
    if (!table) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
});

// ---- Confirm Delete ----------------------------------------
document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', e => {
        const msg = el.dataset.confirm || 'Are you sure you want to delete this record?';
        if (!confirm(msg)) e.preventDefault();
    });
});

// ---- Number Counter Animation ------------------------------
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 1200;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    });
}

// ---- Animate progress bars ---------------------------------
function animateProgressBars() {
    document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
        setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
        }, 200);
    });
}

// ---- Chart.js Defaults ------------------------------------
function setChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = 'rgba(255,255,255,0.5)';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
    Chart.defaults.font.family = "'Outfit', sans-serif";
}

// ---- Attendance Doughnut Chart ----------------------------
function initAttendanceChart(present, absent, late) {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent', 'Late'],
            datasets: [{
                data: [present, absent, late],
                backgroundColor: ['#00e5a0', '#ff4d6d', '#ffb347'],
                borderColor: 'transparent',
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyleWidth: 8
                    }
                },
                tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } }
            }
        }
    });
}

// ---- Grades Bar Chart ----------------------------------------
function initGradesChart(labels, data) {
    const ctx = document.getElementById('gradesChart');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Marks Obtained',
                data,
                backgroundColor: 'rgba(108, 99, 255, 0.6)',
                borderColor: 'rgba(108, 99, 255, 1)',
                borderWidth: 1,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(139, 133, 255, 0.8)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { callback: v => v + '%' }
                },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// ---- Init on DOM ready ------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    setChartDefaults();
    animateCounters();
    animateProgressBars();

    // Init charts from data attributes
    const aChart = document.getElementById('attendanceChart');
    if (aChart) {
        const p = parseInt(aChart.dataset.present || 0);
        const a = parseInt(aChart.dataset.absent || 0);
        const l = parseInt(aChart.dataset.late || 0);
        initAttendanceChart(p, a, l);
    }

    const gChart = document.getElementById('gradesChart');
    if (gChart) {
        const labels = JSON.parse(gChart.dataset.labels || '[]');
        const vals   = JSON.parse(gChart.dataset.values || '[]');
        initGradesChart(labels, vals);
    }
});
