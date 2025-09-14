const params = new URLSearchParams(location.search);
const animation = params.get('anim') || 'default';

const body_el = document.querySelector('body');
const opening_div = document.getElementById('opening-animation');
const login_form = document.getElementById('login-form');

const on_body_background_image_loaded = (callback) => {
    const style = getComputedStyle(body_el);
    let url = style.backgroundImage;

    if (!url || url === "none") return;
    
    url = url.slice(4, -1).replace(/["']/g, "");

    const img = new Image();
    img.onload = () => callback();
    img.onerror = () => console.warn("Background image failed to load!");
    img.src = url;
}

const start_open_animation = () => {
    const children = login_form.children;
    switch (animation) {
        case 'signup':
        case 'dashboard':
            opening_div.remove();
            login_form.style.transition = "none";
            login_form.style.opacity = "1";
            login_form.style.transform = "translateY(0)";

            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child.style.transition = "opacity 1s ease";
                child.style.opacity = "1";
            }
            break;
    
        default:
            opening_div.classList.add("open-default");
            login_form.classList.add("open-default");
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child.style.opacity = "1";
            }
            break;
    }
    
    setTimeout(() => {
        opening_div.remove();
    }, 1000);
}

on_body_background_image_loaded(start_open_animation);

