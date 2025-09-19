const edit_btn_el = document.getElementById('dashboard-edit-contact-btn');
const cancel_btn_el = document.getElementById('dashboard-cancel-btn');
const save_btn_el = document.getElementById('dashboard-save-btn');
const fname_input_el = document.getElementById('dashboard-fname-input-edit');
const lname_input_el = document.getElementById('dashboard-lname-input-edit');
const email_input_el = document.getElementById('dashboard-email-input-edit');
const phone_input_el = document.getElementById('dashboard-phone-input-edit');

const toggle_span_inputs = (edit_mode) => {
    const span_display = edit_mode ? "none" : "block";
    const input_display = edit_mode ? "block" : "none";
    
    big_contact_fname.style.display = span_display;
    big_contact_lname.style.display = span_display;
    big_contact_email.style.display = span_display;
    big_contact_phone.style.display = span_display;

    fname_input_el.style.display = input_display;
    lname_input_el.style.display = input_display;
    email_input_el.style.display = input_display;
    phone_input_el.style.display = input_display;
}

const toggle_edit_inputs = (edit_mode) => {
    if (edit_mode) {
        fname_input_el.value = big_contact_fname.textContent;
        lname_input_el.value = big_contact_lname.textContent;
        email_input_el.value = big_contact_email.textContent;
        phone_input_el.value = big_contact_phone.textContent;
    } else {
        fname_input_el.value = "";
        lname_input_el.value = "";
        email_input_el.value = "";
        phone_input_el.value = "";
    }
}

const toggle_cancel_save_btns = (edit_mode) => {
    if (edit_mode) {
        save_btn_el.classList.add("edit");
        cancel_btn_el.classList.add("edit");
    } else {
        save_btn_el.classList.remove("edit");
        cancel_btn_el.classList.remove("edit");
    }
}

let edit_mode = false;
const toggle_edit_mode = (e) => {
    const target = e.target;
    while (target.getAttribute('data-edit') !== 'true') target = target.parentNode;
    const button = target.getAttribute('data-edit-source');

    if (button === "menu-edit") {
        toggle_menu();
        if (edit_mode || selected_contact_id === "") return;
    }
    
    edit_mode = (button === "logout") ? false : !edit_mode;

    toggle_edit_inputs(edit_mode);
    toggle_span_inputs(edit_mode);
    toggle_cancel_save_btns(edit_mode);
}

edit_btn_el.addEventListener('click', toggle_edit_mode);
cancel_btn_el.addEventListener('click', toggle_edit_mode);

const sync_contact_icon_letter = (e) => {
    const value = e.target.value;
    const icon_letter = value.length > 0 ? value[0] : "";

    big_contact_icon_el.textContent = icon_letter;
    // TODO: move this to save_contact // selected_contact_el.children[0].children[0].textContent = icon_letter;
}

fname_input_el.addEventListener('input', sync_contact_icon_letter);

const save_contact = async (e) => {

    toggle_edit_mode(e);
}

save_btn_el.addEventListener('click', save_contact);
