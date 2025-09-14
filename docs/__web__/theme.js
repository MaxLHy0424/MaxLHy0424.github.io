(function () {
    if (window.__TiengmingModernized) return;
    window.__TiengmingModernized = true;

    const themeColors = {
        light: {
            bgGradient: "linear-gradient(135deg, #f4f4f4, #fef2f2, #f4f0ff)",
            cardBg: "rgba(255,255,255,0.25)",
            cardBorder: "1px solid rgba(255,255,255,0.2)",
            title: "#1c1c1e",
            summary: "#444",
            meta: "#888"
        },
        dark: {
            bgGradient: "linear-gradient(135deg, #1a1a2b, #222c3a, #2e3950)",
            cardBg: "rgba(32,32,32,0.3)",
            cardBorder: "1px solid rgba(255,255,255,0.08)",
            title: "#eee",
            summary: "#aaa",
            meta: "#bbb"
        }
    };

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
      :root {
        --hue: 0deg;
      }
      .herobgcolor {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: -1;
        background-size: 200% 200%;
        transform: translateZ(0); /* 提升为合成层 */
        animation: bgflow 90s linear infinite;
        transition: background 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: background-position; /* 只用于动画属性 */
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
        const mode = getEffectiveMode();
        const theme = themeColors[mode];

        bg.style.background = theme.bgGradient;

        document.querySelectorAll(".post-card").forEach(card => {
            card.style.background = theme.cardBg;
            card.style.border = theme.cardBorder;
            card.style.backdropFilter = "blur(10px)";
            card.style.webkitBackdropFilter = "blur(10px)";
            card.style.transform = "translateZ(0)";
            card.style.willChange = "opacity, transform"; // 仅用于动画
            card.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
            card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";

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
    }

    if (document.documentElement.getAttribute("data-color-mode") === "auto") {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
    }

    new MutationObserver(applyTheme).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-color-mode"]
    });

    const requestIdleCallback = window.requestIdleCallback || function (cb) {
        return setTimeout(cb, 1);
    };

    function rebuildCards() {
        const cards = Array.from(document.querySelectorAll(".SideNav-item"));
        let processed = 0;

        function processNextBatch(deadline) {
            while (processed < cards.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
                const card = cards[processed];
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
                newCard.style.animationDelay = `${processed * 60}ms`;
                newCard.innerHTML = `
          <div class="post-meta">${tags}<span class="post-date">${time}</span></div>
          <h2 class="post-title">${title}</h2>
        `;
                card.replaceWith(newCard);
                processed++;
            }

            if (processed < cards.length) {
                requestIdleCallback(processNextBatch);
            } else {
                applyTheme();
            }
        }

        if (document.readyState === "loading") {
            window.addEventListener("DOMContentLoaded", () => requestIdleCallback(processNextBatch));
        } else {
            requestIdleCallback(processNextBatch);
        }

        document.documentElement.removeAttribute("data-ui-pending");
    }

    rebuildCards();
})();