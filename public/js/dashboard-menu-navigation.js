
document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-view");
    if (!target) return;

    document.querySelectorAll(".menu-view").forEach(view =>
        view.classList.remove("active")
    );
    document.getElementById(`menu-${target}`).classList.add("active");
})});

// Show main view by default
document.getElementById("menu-main").classList.add("active");