const add_contact_menu_open_el = document.getElementById('add-contact');
const search_wrapper_el = document.getElementById('search-wrapper');
const first_name_wrapper = document.getElementById('fn-add-wrapper');
const last_name_wrapper = document.getElementById('ln-add-wrapper');
const phone_wrapper = document.getElementById('phone-add-wrapper');
const email_wrapper = document.getElementById('email-add-wrapper');
const add_contact_btn = document.getElementById('final-add-contact-btn');
const contact_list_el = document.getElementById('contact-list');

let add_menu_toggle = false;

const toggle_add_menu = () => {
    add_menu_toggle = !add_menu_toggle;

    const add_btn_classname = add_menu_toggle ? 'add-open' : '';
    add_contact_menu_open_el.setAttribute('class', add_btn_classname);
    first_name_wrapper.setAttribute('class', 'add-contact-wrapper ' + add_btn_classname);
    last_name_wrapper.setAttribute('class', 'add-contact-wrapper ' + add_btn_classname);
    phone_wrapper.setAttribute('class', 'add-contact-wrapper ' + add_btn_classname);
    email_wrapper.setAttribute('class', 'add-contact-wrapper ' + add_btn_classname);
    add_contact_btn.setAttribute('class', add_btn_classname);
    contact_list_el.setAttribute('class', add_btn_classname);

    const search_wrapper_classname = add_menu_toggle ? 'open' : '';
    search_wrapper_el.setAttribute('class', search_wrapper_classname);
}

add_contact_menu_open_el.addEventListener('click', toggle_add_menu);