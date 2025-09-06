const f_name_el = document.getElementById('first-name-input');
const l_name_el = document.getElementById('last-name-input');
const username_el = document.getElementById('username-input');
const password_el = document.getElementById('password-input');
const signup_btn_el = document.getElementById('signup-btn');

const signup = async (e) => {
    e.preventDefault();
    
    const payload = {
        fistName: f_name_el.value.trim(),
        lastName: l_name_el.value.trim(),
        username: username_el.value.trim(),
        password_el: password_el.value
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
        console.log(data);
    } else {
        // TODO: error handling
    }

    login(username_el.value.trim(), password_el.value);
}

signup_btn_el.addEventListener('click', signup);