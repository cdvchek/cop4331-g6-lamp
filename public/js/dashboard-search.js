const contact_list_el = document.getElementById('contact-list');

const create_contact_el = (name) => {
    const contact_li = document.createElement('li');
    contact_li.setAttribute('class', 'contact-entry');

    const contact_icon_div = document.createElement('div');
    contact_icon_div.setAttribute('class', 'contact-icon');

    const contact_icon_span = document.createElement('span');
    contact_icon_span.setAttribute('class', 'contact-icon-letter');
    contact_icon_span.textContent = name[0];

    const contact_name_span = document.createElement('span');
    contact_name_span.setAttribute('class', 'contact-name');
    contact_name_span.textContent = name;

    contact_icon_div.appendChild(contact_icon_span);
    contact_li.appendChild(contact_icon_div);
    contact_li.appendChild(contact_name_span);
    contact_list_el.appendChild(contact_li);
}

const search_input_el = document.getElementById('search-input');
const empty_search_el = document.getElementById('search-text');

const search_contacts = async (e) => {    
    const query = e.target.value;
    empty_search_el.style.display = (query.length <= 0) ? 'block' : 'none';
    
    for (let i = contact_list_el.children.length - 1; i >= 0; i--) {
        contact_list_el.children[i].remove();
    }

    // Uncomment when we have a searchContacts function in the backend

    // const res = await fetch(`${base_url}/API/searchContacts.php`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ userId: get_user_id(), query: query })
    // });
    // const json = await res.json();

    // if (json.status === "success") {
    //     for (let i = 0; i < json.data.length; i++) {
    //         const c = json.data[i];
    //         create_contact_el(`${c.firstName} ${c.lastName}`);
    //     }
    // } else {
    //     console.error(json.message || "Search error");
    // }
}

search_input_el.addEventListener('input', search_contacts);