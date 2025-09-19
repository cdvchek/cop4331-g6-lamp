const edit_btn_el = document.getElementById('dashboard-edit-contact-btn');
const save_btn_el = document.getElementById('dashboard-save-contact-btn');
const fname_input_el = document.getElementById('dashboard-fname-input-edit');
const lname_input_el = document.getElementById('dashboard-lname-input-edit');
const email_input_el = document.getElementById('dashboard-email-input-edit');
const phone_input_el = document.getElementById('dashboard-phone-input-edit');

let edit_mode = false;
const toggle_edit_mode = () => {
    edit_mode = !edit_mode;

    if (edit_mode) toggle_menu();

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

edit_btn_el.addEventListener('click', toggle_edit_mode);

const save_contact = async () => {

}
