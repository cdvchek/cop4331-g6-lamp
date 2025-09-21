const logout_callback = async (e) => {
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
        toggle_edit_mode(e);
        selected_contact_el = null;
        selected_contact_id = "";

        big_contact_icon_el.textContent = "";
        big_contact_fname.textContent = "-- -- --";
        big_contact_lname.textContent = "-- -- --";
        big_contact_email.textContent = "-- -- --";
        big_contact_phone.textContent = "-- -- --";

        for (let i = contact_list_el.children.length - 1; i >= 0; i--) {
            contact_list_el.children[i].remove();
        }

        search_input_el.value = "";

        contact_selector_el.classList.add('mobile-page-active');
        contact_selector_el.classList.remove('mobile-page-close');

        contact_viewport_el.classList.add('mobile-page-close');
        contact_viewport_el.classList.remove('mobile-page-active');

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