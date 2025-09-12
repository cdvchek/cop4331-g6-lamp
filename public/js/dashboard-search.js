const big_contact_icon_el = document.getElementById('contact-icon-letter');
const big_contact_fname = document.getElementById('first-name');
const big_contact_lname = document.getElementById('last-name');
const big_contact_email = document.getElementById('email');
const big_contact_phone = document.getElementById('phone');

const contact_click = (e) => {
    let target = e.target;
    while (target.getAttribute('class') !== "contact-entry") target = target.parentNode;

    const first_name = target.getAttribute('data-fname');
    const last_name = target.getAttribute('data-lname');
    const email = target.getAttribute('data-email');
    const phone = target.getAttribute('data-phone');

    big_contact_icon_el.textContent = first_name[0];
    big_contact_fname.textContent = first_name;
    big_contact_lname.textContent = last_name;
    big_contact_email.textContent = email;
    big_contact_phone.textContent = phone;
}

const contact_list_el = document.getElementById('contact-list');

const create_contact_el = (first_name, last_name, email, phone) => {
    const contact_li = document.createElement('li');
    contact_li.setAttribute('class', 'contact-entry');
    contact_li.setAttribute('data-fname', first_name);
    contact_li.setAttribute('data-lname', last_name);
    contact_li.setAttribute('data-email', email);
    contact_li.setAttribute('data-phone', phone);
    contact_li.addEventListener('click', contact_click);

    const contact_icon_div = document.createElement('div');
    contact_icon_div.setAttribute('class', 'contact-icon');

    const contact_icon_span = document.createElement('span');
    contact_icon_span.setAttribute('class', 'contact-icon-letter');
    contact_icon_span.textContent = first_name[0];

    const contact_name_span = document.createElement('span');
    contact_name_span.setAttribute('class', 'contact-name');
    contact_name_span.textContent = `${first_name} ${last_name}`;

    contact_icon_div.appendChild(contact_icon_span);
    contact_li.appendChild(contact_icon_div);
    contact_li.appendChild(contact_name_span);
    contact_list_el.appendChild(contact_li);
}

const search_input_el = document.getElementById('search-input');
const empty_search_el = document.getElementById('search-text');

const search_contacts = async (e) => {    
    const query = e.target.value;
    
    for (let i = contact_list_el.children.length - 1; i >= 0; i--) {
        contact_list_el.children[i].remove();
    }
    
    empty_search_el.style.display = (query.length <= 0) ? 'block' : 'none';
    if (query.length === 0) return;
    
    const res = await fetch(`${base_url}/API/searchContact.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: get_user_id(), FName: query.toLowerCase(), LName: query.toLowerCase() })
    });
    const json = await res.json();

    if (json.status === "success") {
        for (let i = 0; i < json.data.length; i++) {
            const c = json.data[i];
            console.log(c);
            create_contact_el(c.FName, c.LName, c.Email, c.Phone);
        }
    } else {
        console.error(json.message || "Search error");
    }
}

search_input_el.addEventListener('input', search_contacts);