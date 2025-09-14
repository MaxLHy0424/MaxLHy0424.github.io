(function () {
    if (window.__TiengmingModernized) return;
    window.__TiengmingModernized = true;

    const themeColors = {
        light: {
            bgGradient: "linear-gradient(135deg, #f4f4f4, #fef2f2, #f4f0ff)",
            cardBg: "rgba(255,255,255,0.6)",
            cardBorder: "1px solid rgba(255,255,255,0.2)",
            title: "#1c1c1e",
            summary: "#444",
            meta: "#888"
        },
        dark: {
            bgGradient: "linear-gradient(135deg, #1a1a2b, #222c3a, #2e3950)",
            cardBg: "rgba(32,32,32,0.6)",
            cardBorder: "1px solid rgba(255,255,255,0.08)",
            title: "#eee",
            summary: "#aaa",
            meta: "#bbb"
        }
    };

    let isApplyingTheme = false;

    function getEffectiveMode() {
        const raw = document.documentElement.getAttribute("data-color-mode");
        if (raw === "light" || raw === "dark") return raw;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function getTextColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb) return "#fff";
        const [r, g, b] = rgb.map(Number);
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000" : "#fff";
    }

    const bg = (() => {
        const el = document.createElement("div");
        el.className = "herobgcolor";
        document.body.appendChild(el);
        const style = document.createElement("style");
        style.textContent = `
      .herobgcolor {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: -1;
        background-size: 200% 200%;
        animation: bgflow 20s ease infinite;
        transition: background 0.6s ease;
        will-change: background-position;
      }
      @keyframes bgflow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
        document.head.appendChild(style);
        return el;
    })();

    function applyTheme() {
        if (isApplyingTheme) return;
        isApplyingTheme = true;
        requestAnimationFrame(() => {
            const mode = getEffectiveMode();
            const theme = themeColors[mode];

            bg.style.background = theme.bgGradient;

            document.querySelectorAll(".post-card").forEach(card => {
                card.style.background = theme.cardBg;
                card.style.border = theme.cardBorder;
                card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";

                const title = card.querySelector(".post-title");
                const summary = card.querySelector(".post-summary");
                const meta = card.querySelector(".post-meta");

                if (title) title.style.color = theme.title;
                if (summary) summary.style.color = theme.summary;
                if (meta) meta.style.color = theme.meta;
            });

            ["#header", "#footer"].forEach(sel => {
                const el = document.querySelector(sel);
                if (el) el.style.color = mode === "dark" ? "#ddd" : "";
            });

            isApplyingTheme = false;
        });
    }

    if (document.documentElement.getAttribute("data-color-mode") === "auto") {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
    }

    new MutationObserver(() => {
        requestAnimationFrame(applyTheme);
    }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-color-mode"]
    });

    function rebuildCards() {
        const container = document.createDocumentFragment();

        document.querySelectorAll(".SideNav-item").forEach((card, i) => {
            const title = card.querySelector(".listTitle")?.innerText || "未命名文章";
            const link = card.getAttribute("href");
            const labels = [...card.querySelectorAll(".Label")];
            const time = labels.find(el => /^\d{4}/.test(el.textContent.trim()))?.textContent.trim() || "";

            const tags = labels.filter(el => el.textContent.trim() !== time).map(el => {
                const tag = el.textContent.trim();
                const bg = el.style.backgroundColor || "#999";
                const fg = getTextColor(bg);
                return `<span class="post-tag" style="background-color:${bg};color:${fg}">${tag}</span>`;
            }).join("");

            const newCard = document.createElement("a");
            newCard.href = link;
            newCard.className = "post-card";
            newCard.style.animationDelay = `${i * 60}ms`;
            newCard.innerHTML = `
        <div class="post-meta">${tags}<span class="post-date">${time}</span></div>
        <h2 class="post-title">${title}</h2>
      `;
            container.appendChild(newCard);
        });

        const sideNav = document.querySelector(".SideNav");
        if (sideNav) {
            sideNav.innerHTML = "";
            sideNav.appendChild(container);
        }

        requestAnimationFrame(applyTheme);
    }

    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", rebuildCards, { once: true });
    } else {
        rebuildCards();
    }

    document.documentElement.removeAttribute("data-ui-pending");
})();