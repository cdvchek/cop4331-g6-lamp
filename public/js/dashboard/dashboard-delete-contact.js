const delete_contact_btn = document.getElementById("dashboard-delete-contact-btn");

const delete_contact = async (e) => {
    if (selected_contact_id && confirm("Are you sure you want to delete this contact?")) {
        const payload = {
            ID: selected_contact_id,
        };

        const res = await fetch(base_url + "/API/deleteContact.php", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.status == "success") {
            toggle_edit_mode(e);
            toggle_menu();

            big_contact_icon_el.textContent = "";
            big_contact_fname.textContent = "-- -- --";
            big_contact_lname.textContent = "-- -- --";
            big_contact_email.textContent = "-- -- --";
            big_contact_phone.textContent = "-- -- --";

            selected_contact_el.remove();
            selected_contact_el = null;
            selected_contact_id = "";
        } else {
            console.warn(data.status, data.message);
        }
    } else {
        toggle_menu();
    }
}

delete_contact_btn.addEventListener('click', delete_contact);