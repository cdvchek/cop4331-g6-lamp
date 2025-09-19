const menu_toggle_el = document.getElementById('dashboard-menu-toggle');
const hamburger_span_els = menu_toggle_el.children;
const menu_el = document.getElementById('dashboard-menu');

let menu_open = false;

const toggle_menu = () => {
    menu_open = !menu_open;

    let hamburger_span_class = menu_open ? 'dashboard-menu-open-hamburger-span' : '';

    for (let i = 0; i < hamburger_span_els.length; i++) {
        hamburger_span_els[i].setAttribute('class', hamburger_span_class);
    }

    let menu_class = menu_open ? 'dashboard-menu-open-menu' : '';
    menu_el.setAttribute('class', menu_class);
}

menu_toggle_el.addEventListener('click', toggle_menu);

const close_menu_on_outside_click = (e) => {
    if (menu_open && !menu_el.contains(e.target) && !menu_toggle_el.contains(e.target)) {
        menu_open = false;

        for (let i = 0; i < hamburger_span_els.length; i++) {
            const span_el = hamburger_span_els[i];
            span_el.setAttribute('class', ''); 
        }
        menu_el.setAttribute('class', '');
    }
}

document.addEventListener('click', close_menu_on_outside_click);