const page_container_el = document.getElementById('page-container');

const page_cfg = {
    login: {
        title: "Login",
        element: document.getElementById('login-page'),
        class: "is-login",
        callback: login_callback,
        callback_error: login_callback_error,
    },
    signup: {
        title: "Signup",
        element: document.getElementById('signup-page'),
        class: "is-signup",
        callback: () => {},// signup_callback,
        callback_error: () => {},// signup_callback_error,
    },
    dashboard: {
        title: "Dashboard",
        element: document.getElementById('dashboard-page'),
        class: "is-dashboard",
        callback: logout_callback,
        callback_error: logout_callback_error,
    }
}

const adjust_height = () => {
    const height = page_container_el.scrollHeight;
    if (height > 675) page_container_el.style.height = "675px";
}

const open_first_page = () => {
    const logged_in = localStorage.getItem("userId");
    if (logged_in) {
        page_container_el.classList.remove('opening');
        page_container_el.classList.add(page_cfg.dashboard.class);

        document.title = page_cfg.dashboard.title;
        page_cfg.dashboard.element.classList.add('page-active');

        page_cfg.signup.element.classList.add('page-close');
        page_cfg.signup.element.classList.add('opening');

        page_cfg.login.element.classList.add('page-close');
        page_cfg.login.element.classList.add('opening');

        setTimeout(() => {
            page_container_el.classList.remove('til-open-end');
            page_cfg.signup.element.classList.remove('opening');
            page_cfg.login.element.classList.remove('opening');
        }, 400);
    } else {
        page_container_el.classList.remove('opening');
        page_container_el.classList.add(page_cfg.login.class);
        
        document.title = page_cfg.login.title;
        page_cfg.login.element.classList.add('page-active');
        
        page_cfg.signup.element.classList.add('page-close');
        page_cfg.signup.element.classList.add('opening');
        
        page_cfg.dashboard.element.classList.add('page-close');
        page_cfg.dashboard.element.classList.add('opening');
        
        adjust_height();
        setTimeout(() => {
            page_container_el.classList.remove('til-open-end');
            page_cfg.signup.element.classList.remove('opening');
            page_cfg.dashboard.element.classList.remove('opening');
        }, 400);
    }
}
open_first_page();

const open_page = async (e) => {
    e.preventDefault();

    let target = e.target;
    while (target.getAttribute("data-nav") !== 'true') target = target.parentNode;

    const old_page = target.dataset.oldpage;
    const new_page = target.dataset.newpage;
    
    const do_callback = target.dataset.docallback;
    if (do_callback === "true") {
        const cb_res = await page_cfg[old_page].callback();
        console.log(cb_res);
        
        if (!cb_res.ok) {
            page_cfg[old_page].callback_error(cb_res.error_params);
            return;
        }
    }

    if (!old_page || !new_page) {
        console.warn("A navigation target was found with no pages in the dataset.");
        return;
    }

    page_cfg[old_page].element.classList.remove('page-active');
    page_cfg[old_page].element.classList.add('page-close');

    page_cfg[new_page].element.classList.remove('page-close');
    page_cfg[new_page].element.classList.add('page-active');

    page_container_el.classList.remove(page_cfg[old_page].class);
    page_container_el.classList.add(page_cfg[new_page].class);

    document.title = page_cfg[new_page].title;

    if (new_page !== "dashboard") adjust_height();
}

const page_nav_els = document.getElementsByClassName('page-navigation');
for (let i = 0; i < page_nav_els.length; i++) {
    const el = page_nav_els[i];
    el.addEventListener('click', open_page);
}