/**
 * ============================================================================
 * PERSONALIZED CONFIGURATION FOR REGINA MIA DIAN CAHYANI (@reginamiaa)
 * Edit values below anytime — changes apply automatically across the site.
 * ============================================================================
 */
const SITE_CONFIG = {
  githubUsername: "reginamiaa",

  name: "Regina Mia Dian Cahyani",
  monogram: "RM",
  eyebrow: "ACCOUNTING · FINANCE · DATA ANALYTICS · RESEARCH",
  location: "Indonesia (UTC +07:00)",
  focus: "B.Acc · GPA 3.52 / 4.00 · Cum Laude",
  availability: "Finance, BI & Strategy",
  email: "reginamiaindonesia@gmail.com",

  socials: {
    github: "https://github.com/reginamiaa",
    linkedin: "https://www.linkedin.com/in/reginamiadiancahyani888",
    academia: "https://reginamiabpvp.academia.edu/",
    aboutme: "https://about.me/reginamiadiancahyani",
    portfolio: "https://sites.google.com/view/reginamiaa8888",
  },
};

function applySiteConfig() {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };

  setText("brand-name", SITE_CONFIG.name);
  setText("brand-monogram", SITE_CONFIG.monogram);
  setText("hero-eyebrow", SITE_CONFIG.eyebrow);
  setText("meta-location", SITE_CONFIG.location);
  setText("meta-focus", SITE_CONFIG.focus);
  setText("meta-availability", SITE_CONFIG.availability);
  setText("contact-email-display", SITE_CONFIG.email);

  const footerCopy = document.getElementById("footer-copy");
  if (footerCopy) {
    footerCopy.textContent = `© MMXXVI ${SITE_CONFIG.name} · Evidence-Based Analytics & Research.`;
  }

  const heroGithub = document.getElementById("hero-github-link");
  if (heroGithub && SITE_CONFIG.socials.github) {
    heroGithub.href = SITE_CONFIG.socials.github;
  }

  const socialContainer = document.getElementById("social-links");
  if (socialContainer) {
    const links = [
      { label: "GitHub", href: SITE_CONFIG.socials.github },
      { label: "LinkedIn", href: SITE_CONFIG.socials.linkedin },
      { label: "Academia.edu", href: SITE_CONFIG.socials.academia },
      { label: "About.me", href: SITE_CONFIG.socials.aboutme },
      { label: "Portfolio", href: SITE_CONFIG.socials.portfolio },
    ].filter((item) => item.href);

    socialContainer.innerHTML = links
      .map(
        (item) =>
          `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.label}</a>`
      )
      .join('<span class="dot" aria-hidden="true">&middot;</span>');
  }
}

function initHeaderAndMenu() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

function initRevealObserver() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function initCopyEmail() {
  const btn = document.getElementById("copy-email-btn");
  const hint = document.getElementById("copy-hint");
  if (!btn || !hint) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      hint.textContent = "Copied";
      setTimeout(() => {
        hint.textContent = "Copy";
      }, 2000);
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    }
  });
}

async function loadLatestGitHubRepos() {
  const username = SITE_CONFIG.githubUsername?.trim();
  if (!username || username === "your-username") return;

  const feed = document.getElementById("github-feed");
  const list = document.getElementById("github-repos-list");
  const allLink = document.getElementById("feed-all-link");
  if (!feed || !list) return;

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=9`
    );
    if (!res.ok) return;

    const repos = await res.json();
    // Exclude profile README repo, GitHub Pages repo, and forks
    const filtered = repos
      .filter(
        (r) =>
          !r.fork &&
          r.name.toLowerCase() !== username.toLowerCase() &&
          r.name.toLowerCase() !== `${username.toLowerCase()}.github.io`
      )
      .slice(0, 3);

    if (filtered.length === 0) return;

    if (allLink) {
      allLink.href = `https://github.com/${encodeURIComponent(username)}?tab=repositories`;
    }

    list.innerHTML = "";
    filtered.forEach((repo) => {
      const card = document.createElement("div");
      card.className = "repo-mini";

      const link = document.createElement("a");
      link.className = "repo-mini-name";
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;

      const desc = document.createElement("p");
      desc.className = "repo-mini-desc";
      desc.textContent = repo.description || "Curated analytical & research repository.";

      const meta = document.createElement("div");
      meta.className = "repo-mini-meta";
      meta.textContent = `${repo.language || "Research"} · ★ ${repo.stargazers_count}`;

      card.append(link, desc, meta);
      list.appendChild(card);
    });

    feed.hidden = false;
  } catch {
    // Keep curated works only if offline or rate-limited
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applySiteConfig();
  initHeaderAndMenu();
  initRevealObserver();
  initCopyEmail();
  loadLatestGitHubRepos();
});
