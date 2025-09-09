const add_contact_menu_open_el = document.getElementById('add-contact');
const search_wrapper_el = document.getElementById('search-wrapper');
const first_name_wrapper = document.getElementById('fn-add-wrapper');

let add_menu_toggle = false;

const toggle_add_menu = () => {
    add_menu_toggle = !add_menu_toggle;

    const add_btn_classname = add_menu_toggle ? 'add-open' : '';
    add_contact_menu_open_el.setAttribute('class', add_btn_classname);
    first_name_wrapper.setAttribute('class', 'add-contact-wrapper ' + add_btn_classname);

    const search_wrapper_classname = add_menu_toggle ? 'open' : '';
    search_wrapper_el.setAttribute('class', search_wrapper_classname);
}

add_contact_menu_open_el.addEventListener('click', toggle_add_menu);