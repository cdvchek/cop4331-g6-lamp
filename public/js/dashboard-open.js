const opener_el = document.getElementById('opener');

opener_el.setAttribute('class', 'end');

const body_open_el = document.getElementById('body');

body_open_el.setAttribute('class', 'end');

setTimeout(() => {
    opener_el.setAttribute('class', 'end done');
}, 1500);