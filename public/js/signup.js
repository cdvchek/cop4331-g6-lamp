const f_name_el = document.getElementById('first-name-input');
const l_name_el = document.getElementById('last-name-input');
const username_el = document.getElementById('username-input');
const password_el = document.getElementById('password-input');
const signup_btn_el = document.getElementById('signup-btn');

const signup = async (e) => {
    e.preventDefault();

    // validating first name
    let bad_input = false;
    if (f_name_el.value.trim() === "") {
        bad_input = true;
        f_name_el.placeholder = "First Name - Required";
        f_name_el.setAttribute('class', "signup-input bad-signup-input");
    }

    // validating last name
    if (l_name_el.value.trim() === "") {
        bad_input = true;
        l_name_el.placeholder = "Last Name - Required";
        l_name_el.setAttribute('class', "signup-input bad-signup-input");
    }

    // validating username
    if (username_el.value.trim() === "") {
        bad_input = true;
        username_el.placeholder = "Username - Required";
        username_el.setAttribute('class', "signup-input bad-signup-input");
    }

    // validating password
    if (password_el.value.trim() === "") {
        bad_input = true;
        password_el.placeholder = "Password - Required";
        password_el.setAttribute('class', "signup-input bad-signup-input");
    }

    if (bad_input) return;

    const payload = {
        firstName: f_name_el.value.trim(),
        lastName: l_name_el.value.trim(),
        username: username_el.value.trim(),
        password: password_el.value
    };

    const res = await fetch(base_url + "/API/register.php", {
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
        localStorage.setItem("firstName", payload.firstName);
        localStorage.setItem("lastName", payload.lastName);

        window.location.href = base_url + "/view/dashboard.html";
    } else {
        // TODO: error handling
    }
}

signup_btn_el.addEventListener('click', signup);