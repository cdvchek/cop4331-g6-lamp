const first_name_signup_el = document.getElementById('signup-first-name-input');
const last_name_signup_el = document.getElementById('signup-last-name-input');
const username_signup_el = document.getElementById('signup-username-input');
const password_signup_el= document.getElementById('signup-password-input-first');
const password_confirm_signup_el = document.getElementById('signup-password-input-confirm');
const signup_btn_el = document.getElementById('login-btn');
const signup_error_msg_el = document.getElementById('signup-error-msg');

const signup_callback = async () => {    
    // validating name and password
    let bad_fname_input = false;
    let bad_lname_input = false;
    let bad_username_input = false;
    let bad_password_input = false;
    let bad_password_confirm_input = false;
    let passwords_dont_match = false;

    if (first_name_signup_el.value.trim() === "") {
        bad_fname_input = true;
    }

    if (last_name_signup_el.value.trim() === "") {
        bad_lname_input = true;
    }

    if (username_signup_el.value.trim() === "") {
        bad_username_input = true;
    }

    if (password_signup_el.value === "") {
        bad_password_input = true;
    }

    if (password_confirm_signup_el.value === "") {
        bad_password_confirm_input = true;
    }

    if (password_signup_el.value !== password_confirm_signup_el.value) {
        passwords_dont_match = true;
    }

    if (bad_fname_input || bad_lname_input || bad_username_input || bad_password_input || bad_password_confirm_input) return {
        ok: false,
        error_params: {
            code: "bad_input",
            bad_input: {
                bad_fname: bad_fname_input,
                bad_lname: bad_lname_input,
                bad_username: bad_username_input,
                bad_password: bad_password_input,
                bad_password_confirm: bad_password_confirm_input,
                passwords_dont_match: passwords_dont_match
            }
        }
    };

    const payload = {
        firstName: first_name_signup_el.value.trim(),
        lastName: last_name_signup_el.value.trim(),
        username: username_login_el.value.trim(),
        password: password_login_el.value
    }

    const res = await fetch(base_url + "/API/register.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.status == "success") {
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("firstName", data.data.firstName);
        localStorage.setItem("lastName", data.data.lastName);

        return {
            ok: true,
        }
    } else {
        return {
            ok: false,
            error_params: {
                code: "error",
                error: {
                    msg: data.message
                }
            }
        }
    }
}

const signup_callback_error = (error_params) => {
    switch (error_params.code) {
        case "bad_input":
            if (error_params.bad_input.bad_fname) {
                first_name_signup_el.placeholder = "First name - Required";
                first_name_signup_el.setAttribute('class', "form-input bad-form-input");
            }
            if (error_params.bad_input.bad_lname) {
                last_name_signup_el.placeholder = "Last name - Required";
                last_name_signup_el.setAttribute('class', "form-input bad-form-input");
            }
            if (error_params.bad_input.bad_username) {
                username_signup_el.placeholder = "Username - Required";
                username_signup_el.setAttribute('class', "form-input bad-form-input");
            }
            if (error_params.bad_input.bad_password) {
                password_signup_el.placeholder = "Password - Required";
                password_signup_el.setAttribute('class', "form-input bad-form-input");
            }
            if (error_params.bad_input.bad_password_confirm) {
                password_confirm_signup_el.placeholder = "Password confirm - Required";
                password_confirm_signup_el.setAttribute('class', 'form-input bad-form-input');
            }
            if (error_params.bad_input.passwords_dont_match) {
                signup_error_msg_el.textContent = "Passwords don't match"
            }
            break;
        
        case "error":
            signup_error_msg_el.textContent = error_params.error.msg;
            break;
        default:
            break;
    }
}