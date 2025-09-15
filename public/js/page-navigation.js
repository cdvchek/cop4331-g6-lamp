const page_container_el = document.getElementById('page-container');

const page_cfg = {
    login: {
        title: "Login",
        element: document.getElementById('login-page'),
        style: "width: 500px; height: 92vh; max-height: 675px; border-radius: 20px;"
    },
    signup: {
        title: "Signup",
        element: document.getElementById('signup-page'),
        style: "width: 500px; height: 92vh; max-height: 675px; border-radius: 20px;"
    },
    dashboard: {
        title: "Dashboard",
        element: document.getElementById('dashboard-page'),
        style: "width: calc(100% - 15px); height: calc(100% - 15px); border-radius: 30px;"
    }
}

const open_first_page = () => {
    page_container_el.classList.remove('opening');
    page_container_el.style = page_cfg.login.style;

    document.title = page_cfg.login.title;
    page_cfg.login.element.classList.add('page-active');

    page_cfg.signup.element.classList.add('page-close');
    page_cfg.signup.element.classList.add('opening');

    page_cfg.dashboard.element.classList.add('page-close');
    page_cfg.dashboard.element.classList.add('opening');

    setTimeout(() => {
        page_cfg.signup.element.classList.remove('opening');
        page_cfg.dashboard.element.classList.remove('opening');
    }, 400);
}
open_first_page();

const open_page = (e) => {
    let target = e.target;
    while (target.getAttribute("data-nav") !== 'true') target = target.parentNode;

    const old_page = target.dataset.oldpage;
    const new_page = target.dataset.newpage;

    if (!old_page || !new_page) {
        console.warn("A navigation target was found with no pages in the dataset.");
        return;
    }

    page_cfg[old_page].element.classList.remove('page-active');
    page_cfg[old_page].element.classList.add('page-close');

    page_cfg[new_page].element.classList.remove('page-close');
    page_cfg[new_page].element.classList.add('page-active');

    page_container_el.style = page_cfg[new_page].style;

    document.title = page_cfg[new_page].title;
}

const page_nav_els = document.getElementsByClassName('page-navigation');
for (let i = 0; i < page_nav_els.length; i++) {
    const el = page_nav_els[i];
    el.addEventListener('click', open_page);
}