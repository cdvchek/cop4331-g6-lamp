const logout_callback = async () => {
    const res = await fetch(base_url + "/API/logout.php", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    });
    const data = await res.json();

    if (data.status == "success") {
        localStorage.removeItem("userId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        toggle_menu();

        big_contact_icon_el.textContent = "";
        big_contact_fname.textContent = "-- -- --";
        big_contact_lname.textContent = "-- -- --";
        big_contact_email.textContent = "-- -- --";
        big_contact_phone.textContent = "-- -- --";

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

const logout_callback_error = (error_params) => {
    console.log(error_params.error.msg);
}