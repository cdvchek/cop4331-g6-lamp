const username_login_el = document.getElementById('login-username-input');
const password_login_el = document.getElementById('login-password-input');
const login_btn_el = document.getElementById('login-btn');
const remember_me_el = document.getElementById('login-remember-me');
const error_msg_el = document.getElementById('login-error-msg');

const login_callback = async () => {
    // validating name and password
    let bad_username_input = false;
    let bad_password_input = false;

    if (username_login_el.value.trim() === "") {
        bad_username_input = true;
    }

    if (password_login_el.value.trim() === "") {
        bad_password_input = true;
    }

    if (bad_username_input || bad_password_input) return {
        ok: false,
        error_params: {
            code: "bad_input",
            bad_input: {
                bad_username: bad_username_input,
                bad_password: bad_password_input
            }
        }
    };

    const payload = {
        login: username_login_el.value.trim(),
        password: password_login_el.value,
    }

    const res = await fetch(base_url + "/API/login.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.status == "success") {
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("firstName", data.data.firstName);
        localStorage.setItem("lastName", data.data.lastName);

        if (remember_me.checked) {
            localStorage.setItem("login-username", payload.login);
            localStorage.setItem("login-password", payload.password);
        } else {
            localStorage.removeItem("login-username");
            localStorage.removeItem("login-password");
        }

        return {
            ok: true,
        }
    } else {
        return {
            ok: true,
            error_params: {
                code: "incorrect_input",
                incorrect_input: {
                    msg: data.message
                }
            }
        }
    }
}

const login_callback_error = (error_params) => {
    switch (error_params.code) {
        case "bad_input":
            if (error_params.bad_input.bad_username) {
                username_login_el.placeholder = "Username - Required";
                username_login_el.setAttribute('class', "login-input bad-login-input");
            }
            if (error_params.bad_input.bad_password) {
                password_login_el.placeholder = "Password - Required";
                password_login_el.setAttribute('class', "login-input bad-login-input");
            }
            break;
        
        case "incorrect_input":
            error_msg_el.textContent = error_params.incorrect_input.msg;
            break;
        default:
            break;
    }
}