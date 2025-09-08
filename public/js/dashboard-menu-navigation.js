const hamburger_menu_el = document.getElementById('menu-toggle');
const hamburger_span_els = hamburger_menu_el.children;
const menu_el = document.getElementById('menu');

let menu_open = false;

const toggle_menu = () => {
    menu_open = !menu_open;

    let hamnbuger_span_class = menu_open ? 'menu-open-hamburger-span' : '';

    for (let i = 0; i < hamburger_span_els.length; i++) {
        const span_el = hamburger_span_els[i];
        span_el.setAttribute('class', hamnbuger_span_class);
    }

    let menu_class = menu_open ? 'menu-open-menu' : '';
    menu_el.setAttribute('class', menu_class);
}

hamburger_menu_el.addEventListener('click', toggle_menu);

const close_menu_on_outside_click = (e) => {
    if (menu_open && !menu_el.contains(e.target) && !hamburger_menu_el.contains(e.target)) {
        menu_open = false;

        for (let i = 0; i < hamburger_span_els.length; i++) {
            const span_el = hamburger_span_els[i];
            span_el.setAttribute('class', ''); 
        }
        menu_el.setAttribute('class', '');
    }
}

document.addEventListener('click', close_menu_on_outside_click);