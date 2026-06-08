/* =================================================================
   YASH — Portfolio interactions
   - Data-driven expertise & project cards
   - Smooth-scroll nav with active-section highlighting
   - Scroll reveal + staggered badge entrance
   - 3D flip cards with character-by-character typing on the back
   ================================================================= */

/* ---------------- DATA ---------------- */
const EXPERTISE = [
  {
    icon: "☁️",
    title: "Cloud Infrastructure",
    skills: [
      "AWS VPC Architecture",
      "Public & Private Network Design",
      "NAT Gateway & Internet Connectivity",
      "Cross-Region VPC Peering",
      "Route 53 DNS Management",
    ],
  },
  {
    icon: "🖥️",
    title: "Compute & Hosting",
    skills: [
      "Amazon EC2",
      "Linux Server Administration",
      "Apache Web Server Deployment",
    ],
  },
  {
    icon: "🗄️",
    title: "Database Management",
    skills: [
      "Amazon RDS (MariaDB)",
      "Database Snapshots",
      "Read Replica Configuration",
      "SQL Fundamentals",
    ],
  },
  {
    icon: "🛡️",
    title: "Security & Networking",
    skills: [
      "Security Groups",
      "Network ACLs",
      "CIDR Planning",
      "Traffic Flow Analysis",
    ],
  },
  {
    icon: "🚀",
    title: "Currently Expanding Into",
    skills: ["Docker", "Git & Version Control", "CI/CD Pipelines", "Terraform", "Kubernetes"],
  },
];

const PROJECTS = [
  {
    name: "AWS VPC Architecture",
    desc: "Designed a secure AWS VPC environment with public and private subnets, route tables, Internet Gateway, and NAT Gateway. Implemented network segmentation and traffic routing based on real-world cloud architecture practices.",
  },
  {
    name: "EC2 Web Hosting",
    desc: "Deployed and managed Linux-based EC2 instances to host web applications. Configured server access, web services, and application deployment in a cloud environment.",
  },
  {
    name: "Route 53 Domain Management",
    desc: "Configured Route 53 Hosted Zones, DNS records, and nameserver delegation to connect a custom domain with cloud-hosted applications while troubleshooting DNS propagation issues.",
  },
  {
    name: "RDS Database Deployment",
    desc: "Created and configured MariaDB databases on Amazon RDS, including subnet groups, connectivity setup, snapshots, and secure integration with EC2-hosted applications.",
  },
  {
    name: "Database Read Replica Architecture",
    desc: "Implemented and studied RDS Read Replicas to understand database scaling, replication, and high-availability concepts commonly used in production environments.",
  },
  {
    name: "Cross-Region VPC Peering",
    desc: "Explored cross-region VPC peering by connecting virtual networks across AWS regions and configuring routing for secure private communication between resources.",
  },
  {
    name: "Linux Server Administration",
    desc: "Managed Linux servers through command-line operations, user management, package installation, file permissions, and service administration to support cloud workloads.",
  },
  {
    name: "Personal Portfolio Deployment",
    desc: "Built and deployed a personal portfolio website on AWS infrastructure using EC2, custom domain configuration, DNS management, and web server hosting.",
  },
];

/* ---------------- RENDER: EXPERTISE ---------------- */
function renderExpertise() {
  const grid = document.getElementById("expertiseGrid");
  if (!grid) return;

  EXPERTISE.forEach((cat) => {
    const card = document.createElement("article");
    card.className = "cat-card";
    card.setAttribute("data-reveal", "");

    const badges = cat.skills
      .map(
        (s, i) =>
          `<span class="badge" style="animation-delay:${i * 70}ms">${s}</span>`
      )
      .join("");

    card.innerHTML = `
      <div class="cat-card__head">
        <span class="cat-card__icon">${cat.icon}</span>
        <h3 class="cat-card__title">${cat.title}</h3>
      </div>
      <div class="badges">${badges}</div>
    `;

    // cursor-following spotlight sheen
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    grid.appendChild(card);
  });
}

/* ---------------- RENDER: PROJECTS (flip cards) ---------------- */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  PROJECTS.forEach((p, i) => {
    const flip = document.createElement("article");
    flip.className = "flip";
    flip.setAttribute("data-reveal", "");
    flip.innerHTML = `
      <div class="flip__inner">
        <div class="flip__face flip__face--front">
          <span class="flip__index">PROJECT ${String(i + 1).padStart(2, "0")}</span>
          <h3 class="flip__name">${p.name}</h3>
          <span class="flip__hint">Hover to read</span>
        </div>
        <div class="flip__face flip__face--back">
          <span class="flip__back-title">${p.name}</span>
          <p class="flip__type" data-text="${p.desc.replace(/"/g, "&quot;")}"></p>
        </div>
      </div>
    `;
    grid.appendChild(flip);
    attachTyping(flip, p.desc);
  });
}

/* ---------------- TYPING EFFECT ----------------
   Starts after the flip begins, types char-by-char,
   resets when the mouse leaves so it restarts next hover. */
function attachTyping(flipEl, text) {
  const target = flipEl.querySelector(".flip__type");
  let timer = null;

  function startTyping() {
    clearTimeout(timer);
    target.textContent = "";
    flipEl.classList.add("is-typing");
    let i = 0;
    const speed = 14; // ms per character

    function step() {
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        i += 1;
        timer = setTimeout(step, speed);
      } else {
        flipEl.classList.remove("is-typing");
      }
    }
    // small delay so typing begins after the flip motion starts
    timer = setTimeout(step, 320);
  }

  function resetTyping() {
    clearTimeout(timer);
    target.textContent = "";
    flipEl.classList.remove("is-typing");
  }

  flipEl.addEventListener("mouseenter", startTyping);
  flipEl.addEventListener("mouseleave", resetTyping);

  // Touch / keyboard support: tap to flip + type, tap again to reset
  flipEl.addEventListener("click", () => {
    flipEl.classList.toggle("is-flipped");
    if (flipEl.classList.contains("is-flipped")) startTyping();
    else resetTyping();
  });
}

/* ---------------- SCROLL REVEAL ---------------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // stagger entrance slightly for grouped items
          setTimeout(() => {
            entry.target.classList.add("is-in");
            if (entry.target.classList.contains("cat-card")) {
              entry.target.classList.add("is-in"); // triggers badge animation
            }
          }, (idx % 4) * 80);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------------- HEADING TYPEWRITER ----------------
   When a section title scrolls into view it types itself out,
   character-by-character, at a calm, eye-pleasing pace with a
   soft blinking caret. Runs once per heading. */
function initHeadingTypewriter() {
  const headings = document.querySelectorAll(".section__title");

  // Honor reduced-motion: leave headings as-is, no typing.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;


  headings.forEach((el) => {
    // Preserve the final text and reserve its space to avoid layout jump.
    const fullText = el.textContent.trim();
    el.setAttribute("data-text", fullText);
    el.textContent = "";
    el.classList.add("type-heading");
  });

  function typeHeading(el) {
    const text = el.getAttribute("data-text");
    el.classList.add("is-typing");
    let i = 0;

    function step() {
      el.textContent = text.slice(0, i);
      if (i < text.length) {
        i += 1;
        // calm, varied rhythm: a touch slower on spaces for readability
        const ch = text.charAt(i - 1);
        const delay = ch === " " ? 70 : 42;
        setTimeout(step, delay);
      } else {
        // keep the caret a moment, then fade it out
        setTimeout(() => el.classList.remove("is-typing"), 900);
      }
    }
    step();
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeHeading(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6, rootMargin: "0px 0px -10% 0px" }
  );
  headings.forEach((el) => io.observe(el));
}

/* ---------------- NAV: active highlight + smooth scroll ---------------- */
function initNav() {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const sections = links
    .map((l) => document.getElementById(l.dataset.nav))
    .filter(Boolean);

  // smooth scroll (with header offset handled via scroll-margin in CSS)
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.dataset.nav;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    });
  });

  // active section highlighting
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) =>
            l.classList.toggle("is-active", l.dataset.nav === id)
          );
        }
      });
    },
    { threshold: 0.4, rootMargin: "-20% 0px -45% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderExpertise();
  renderProjects();
  initReveal();
  initHeadingTypewriter();
  initNav();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
