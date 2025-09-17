// Uses element references from login-callback
const check_remember_me = () => {
    const username = localStorage.getItem('login-username');
    const password = localStorage.getItem('login-password');
    
    if (username && password) {
        remember_me.checked = true;
        username_login_el.value = username;
        password_login_el.value = password;
    }
}

check_remember_me();