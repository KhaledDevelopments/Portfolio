(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Mobile menu */
    const menuBtn = document.querySelector(".menu-btn");
    const nav = document.getElementById("site-nav");
    const setMenu = (open) => {
        nav.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.textContent = open ? "Close" : "Menu";
    };
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

    /* Highlight the nav link for the section in view */
    const links = [...nav.querySelectorAll("a")];
    const targets = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => a.removeAttribute("aria-current"));
            const active = links.find((a) => a.getAttribute("href") === "#" + entry.target.id);
            if (active) active.setAttribute("aria-current", "true");
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((t) => spy.observe(t));



    /* Check that each client site is actually online right now */
    document.querySelectorAll(".live[data-check]").forEach((badge) => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        fetch(badge.dataset.check, { mode: "no-cors", cache: "no-store", signal: ctrl.signal })
            .then(() => { badge.dataset.state = "up"; badge.textContent = "Live now"; })
            .catch(() => { badge.dataset.state = "down"; badge.textContent = "Can't reach right now"; })
            .finally(() => clearTimeout(timer));
    });

    /* Copy email */
    const copyBtn = document.getElementById("copy-email");
    const status = document.getElementById("copy-status");
    copyBtn.addEventListener("click", async () => {
        const email = "kalhindi@unb.ca";
        try {
            await navigator.clipboard.writeText(email);
            copyBtn.textContent = "Copied";
            status.textContent = "Email address copied to clipboard.";
        } catch {
            copyBtn.textContent = email;
        }
        setTimeout(() => { copyBtn.textContent = "Copy email"; status.textContent = ""; }, 2000);
    });

    /* Footer year */
    document.getElementById("year").textContent = new Date().getFullYear();

    /* Portrait tilt */
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const frame = document.querySelector(".portrait-frame");
    if (!frame) return;
    let raf = null;
    window.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = null;
            const r = frame.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
            const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
            frame.style.setProperty("--ry", (dx * 14).toFixed(2) + "deg");
            frame.style.setProperty("--rx", (-dy * 14).toFixed(2) + "deg");
        });
    });
})();