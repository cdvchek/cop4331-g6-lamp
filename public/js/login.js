const username_login_el = document.getElementById('username-input');
const password_login_el = document.getElementById('password-input');
const login_btn_el = document.getElementById('login-btn');

const login = async (username, password) => {
    const payload = {
        login: username,
        password: password
    };

    const res = await fetch(base_url + "/API/login.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        // TODO: error handling
    }

    const data = await res.json();
    if (data.status == "success") {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);

        window.location.href = base_url + "/view/dashboard.html"
    } else {
        // TODO: error handling
    }
}

const doLogin = (e) => {
    e.preventDefault();
    login(username_login_el.value.trim(), password_login_el.value);
}

if (login_btn_el) login_btn_el.addEventListener('click', doLogin);