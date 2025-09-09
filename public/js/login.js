// Grab the html elements we want
const username_login_el = document.getElementById('username-input');
const password_login_el = document.getElementById('password-input');
const login_btn_el = document.getElementById('login-btn');

// Function that runs when form is submitted or login button is pushed
const login = async (e) => {
    e.preventDefault();
    
    // Package the data to send to the back end
    const payload = {
        login: username_login_el.value.trim(),
        password: password_login_el.value
    };

    // Send the package to the backend and await the response (res)
    const res = await fetch(base_url + "/API/login.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    console.log(res);
    
    // Read the response for error handling
    if (!res.ok) {
        // TODO: error handling
    }

    // Get the data from the response
    const data = await res.json();

    // Save the data locally in the browser
    console.log(data);
    
    if (data.status == "success") {
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("firstName", data.data.firstName);
        localStorage.setItem("lastName", data.data.lastName);

        // window.location.href = base_url + "/view/dashboard.html";
    } else {
        // TODO: error handling
    }
}

// Assign the login button an on "click" event that runs the login function
login_btn_el.addEventListener('click', login);