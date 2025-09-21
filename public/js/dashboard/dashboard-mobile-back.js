const mobile_back_btn = document.getElementById('dashboard-mobile-back-btn');

const go_back = (e) => {
    contact_selector_el.classList.add('mobile-page-active');
    contact_selector_el.classList.remove('mobile-page-close');

    contact_viewport_el.classList.add('mobile-page-close');
    contact_viewport_el.classList.remove('mobile-page-active');

    toggle_edit_mode(e);
    selected_contact_el = null;
    selected_contact_id = "";

    big_contact_icon_el.textContent = "";
    big_contact_fname.textContent = "-- -- --";
    big_contact_lname.textContent = "-- -- --";
    big_contact_email.textContent = "-- -- --";
    big_contact_phone.textContent = "-- -- --";
}

mobile_back_btn.addEventListener('click', go_back);