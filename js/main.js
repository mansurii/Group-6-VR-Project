/*
  main.js
  General interactivity for the whole site.
  Loaded on every page.

  What it does:
  1. Fades the page in when it loads, fades it out when you click a link
  2. Watches for .reveal elements and animates them in as you scroll down
  3. Adds a 3D tilt effect to the scene cards on the landing page
  4. Animates the stats numbers counting up from zero
  5. Makes the header shadow deepen slightly when you scroll down
*/

document.addEventListener('DOMContentLoaded', function () {


  /* ─────────────────────────────────────
     1. Page Fade Transitions
     Pages fade in when they load, and fade out
     before navigating away — makes it feel smoother
  ───────────────────────────────────── */

  // Start invisible then fade in
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));

  // Before navigating to another page, fade out first
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    // Skip anchors, external links, and mailto links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.22s ease';
      setTimeout(() => { window.location.href = href; }, 230);
    });
  });


  /* ─────────────────────────────────────
     2. Scroll Reveal
     Any element with class="reveal" will
     animate in from below once it enters the viewport.
     Cards and feature tiles use this.
  ───────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger items if they're siblings — each one delays a bit more
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.children)
            : [];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.07}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // only animate in once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(el => observer.observe(el));

  } else {
    // Older browsers that don't support IntersectionObserver — just show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }


  /* ─────────────────────────────────────
     3. Card 3D Tilt Effect
     When you move your mouse over a scene card
     it tilts slightly in 3D following your cursor
  ───────────────────────────────────── */
  document.querySelectorAll('.scene-card').forEach(card => {

    // Snap transition on mouse enter for responsiveness
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease, border-color 0.25s, box-shadow 0.25s';
    });

    // Tilt toward where the mouse is
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const tx = ((e.clientX - cx) / (r.width  / 2)) *  7;
      const ty = ((e.clientY - cy) / (r.height / 2)) * -7;
      card.style.transform = `translateY(-6px) perspective(900px) rotateY(${tx}deg) rotateX(${ty}deg)`;
    });

    // Smooth return when mouse leaves
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s';
      card.style.transform  = '';
    });
  });


  /* ─────────────────────────────────────
     4. Stats Counter Animation
     Numbers like "4", "360", "6" count up
     from 0 when they scroll into view.
     Add data-count="4" and data-suffix="°"
     to a .stat-num element to use this.
  ───────────────────────────────────── */
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1200; // milliseconds

    const counterObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      counterObserver.disconnect();

      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic curve
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }, { threshold: 0.6 });

    counterObserver.observe(el);
  });


  /* ─────────────────────────────────────
     5. Header Shadow on Scroll
     The header shadow gets slightly deeper
     as soon as you start scrolling down
  ───────────────────────────────────── */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8
        ? '0 2px 36px rgba(0,0,0,0.6)'
        : '0 2px 20px rgba(0,0,0,0.3)';
    }, { passive: true });
  }

});
