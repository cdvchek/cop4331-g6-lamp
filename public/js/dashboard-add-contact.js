const add_contact_menu_open_el = document.getElementById('add-contact');
const search_wrapper_el = document.getElementById('search-wrapper');
const first_name_wrapper = document.getElementById('fn-add-wrapper');
const last_name_wrapper = document.getElementById('ln-add-wrapper');
const phone_wrapper = document.getElementById('phone-add-wrapper');
const email_wrapper = document.getElementById('email-add-wrapper');
const add_contact_btn = document.getElementById('final-add-contact-btn');
const contact_list_el_add = document.getElementById('contact-list');
const add_contact_form = document.getElementById('add-contact-form');

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
    contact_list_el_add.setAttribute('class', add_btn_classname);
    add_contact_form.setAttribute('class', add_btn_classname);

    const search_wrapper_classname = add_menu_toggle ? 'open' : '';
    search_wrapper_el.setAttribute('class', search_wrapper_classname);
}

add_contact_menu_open_el.addEventListener('click', toggle_add_menu);

const first_name_el = document.getElementById('first-name-add');
const last_name_el = document.getElementById('last-name-add');
const phone_el = document.getElementById('phone-add');
const email_el = document.getElementById('email-add');

const isNonEmpty = s => typeof s === 'string' && s.trim().length > 0;
const looksLikeEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const looksLikePhone = s => s.replace(/[^\d]/g,'').length >= 7;

const add_contact = async () => {
    console.log("trying");
    
    const f_name = first_name_el.value.trim();
    const l_name = last_name_el.value.trim();
    const phone = phone_el.value.trim();
    const email = email_el.value.trim();
    const user_id = get_user_id();


    // TODO: better error handling and get rid of toast
    if (!user_id || Number.isNaN(user_id)) {
        return toastError('You are not logged in (missing UserID).');
    }

    if (!isNonEmpty(f_name)) return toastError('First name is required.');
    if (!isNonEmpty(l_name)) return toastError('Last name is required.');
    if (!isNonEmpty(phone) || !looksLikePhone(phone)) return toastError('Enter a valid phone.');
    if (!isNonEmpty(email) || !looksLikeEmail(email)) return toastError('Enter a valid email.');

    const payload = { FName: f_name, LName: l_name, Phone: phone, Email: email, UserID: user_id };

    try {
        setBusy(true);

        const res = await fetch(base_url + '/API/addContact.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Even if res.ok is true, your PHP returns a JSON {status: "..."}
        const data = await res.json().catch(() => ({}));

        if (data.status === 'success') {
            // Clear form
            first_name_el.value = '';
            last_name_el.value = '';
            phone_el.value = '';
            email_el.value = '';

            toastOK('Contact added!');
        } else {
            // Backend error message
            toastError(data.message || 'Failed to add contact.');
        }
    } catch (err) {
        toastError('Network error adding contact.');
        console.error(err);
    } finally {
        setBusy(false);
    }

    // Simple UX helpers
    function setBusy(isBusy) {
        add_contact_btn.disabled = isBusy;
        add_contact_btn.style.opacity = isBusy ? '0.7' : '1';
        add_contact_btn.style.cursor = isBusy ? 'not-allowed' : 'pointer';
    }

    function toastOK(msg) {
        // swap this for your own toast/notification system
        console.log('[OK]', msg);
    }

    function toastError(msg) {
        console.warn('[ERROR]', msg);
        // you could also show a small inline error near the form
    }

    // Also allow Enter key in inputs to trigger add
    [first_name_el, last_name_el, phone_el, email_el].forEach(el => {
        el?.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                add_contact();
            }
        });
    });
}

add_contact_btn.addEventListener('click', add_contact);