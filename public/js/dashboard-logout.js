const logout_btn_el = document.getElementById('logout-btn');

const logout = async () => {
    // TODO: once sessions are implemented in the backend
    // Hit logout endpoint
    // On successful logout, go to base_url + /view/login.html
    
    // For now, just go to base_url + /view/login.html
    window.location.href = base_url + "/view/login.html";
}

logout_btn_el.addEventListener('click', logout);