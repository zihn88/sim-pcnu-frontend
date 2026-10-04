// ========================================================
// API ENGINE & AUTH STATE
// ========================================================

// !!! GANTI DENGAN URL WEB APP DARI GOOGLE APPS SCRIPT ANDA !!!
const API_URL = "https://script.google.com/macros/s/AKfycbzFa-wH4032Li_gJLUfXhgPMOivfdMsFEYxWm97rnwi3G0nmRxDc40S-2I2o8NH943kEQ/exec"; 

// Fungsi Utama Fetch API
async function fetchAPI(action, payload = {}) {
    const token = sessionStorage.getItem('sim_token') || "";
    
    const requestBody = {
        action: action,
        token: token,
        payload: payload
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        // Handle auto-logout jika token expired/invalid
        if (result.success === false && result.message.includes("Token tidak valid")) {
            sessionStorage.clear();
            window.location.href = 'login.html';
            return null;
        }

        return result;
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "Koneksi ke server gagal. Periksa jaringan Anda." };
    }
}

// Cek status login saat halaman dimuat (Kecuali halaman login)
function checkAuth() {
    const token = sessionStorage.getItem('sim_token');
    const path = window.location.pathname;
    
    if (!token && !path.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (token && path.includes('login.html')) {
        window.location.href = 'index.html';
    }

    // Set nama user di Topbar
    const userNameEl = document.getElementById('user_name');
    const userRoleEl = document.getElementById('user_role');
    if (userNameEl) userNameEl.innerText = sessionStorage.getItem('sim_user_name');
    if (userRoleEl) userRoleEl.innerText = sessionStorage.getItem('sim_role');
}

// Global Toast Notification
function showToast(message, isError = false) {
    let toast = document.getElementById('toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.className = isError ? 'error show' : 'show';
    toast.innerText = message;
    
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Logout Global
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}
