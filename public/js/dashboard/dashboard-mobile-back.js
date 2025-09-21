const mobile_back_btn = document.getElementById('dashboard-mobile-back-btn');

const go_back = () => {
    contact_selector_el.classList.add('mobile-page-active');
    contact_selector_el.classList.remove('mobile-page-close');

    contact_viewport_el.classList.add('mobile-page-close');
    contact_viewport_el.classList.remove('mobile-page-active');
}

mobile_back_btn.addEventListener('click', go_back);