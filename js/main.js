/*
  main.js
  Interactivity for the landing page (index.html) only.
  LsbuTour.html handles everything itself.

  What this does:
  1. Fades the page in on load, fades it out when you click a link
  2. Animates .reveal elements as they scroll into view
  3. Adds a subtle 3D tilt to the scene info cards on hover
  4. Counts up the stat numbers (5 Locations, 360°, etc.)
  5. Deepens the header shadow slightly when you scroll down
*/

document.addEventListener('DOMContentLoaded', function () {


  /* ─────────────────────────────────────
     1. Page fade in / out
  ───────────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });
  });

  // Fade out before navigating away
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    // Don't intercept anchor links, external URLs, or the tour link
    // (we want the tour to load immediately without a delay)
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    if (href === 'LsbuTour.html') return; // let the tour load without fade delay
    a.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.22s ease';
      setTimeout(function () { window.location.href = href; }, 230);
    });
  });


  /* ─────────────────────────────────────
     2. Scroll reveal
     Elements with class="reveal" slide in
     from below as they enter the viewport
  ───────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Stagger siblings so they don't all pop in at the same time
        var siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        var index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (index * 0.07) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });

  } else {
    // Older browsers — just show everything straight away
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ─────────────────────────────────────
     3. Card tilt effect
     Scene info cards tilt slightly in 3D
     as you move your mouse over them
  ───────────────────────────────────── */
  document.querySelectorAll('.scene-card').forEach(function (card) {

    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.08s ease, border-color 0.25s, box-shadow 0.25s';
    });

    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var cx = r.left + r.width  / 2;
      var cy = r.top  + r.height / 2;
      var tx = ((e.clientX - cx) / (r.width  / 2)) *  6;
      var ty = ((e.clientY - cy) / (r.height / 2)) * -6;
      card.style.transform = 'translateY(-5px) perspective(900px) rotateY(' + tx + 'deg) rotateX(' + ty + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s';
      card.style.transform  = '';
    });
  });


  /* ─────────────────────────────────────
     4. Stat counter animation
     Numbers count up from 0 when they
     scroll into view
  ───────────────────────────────────── */
  document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
    var target   = parseInt(el.dataset.count, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1200;

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var startTime = performance.now();
      function tick(now) {
        var p = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });

    io.observe(el);
  });


  /* ─────────────────────────────────────
     5. Header shadow on scroll
  ───────────────────────────────────── */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 8
        ? '0 2px 36px rgba(0,0,0,0.6)'
        : '0 2px 20px rgba(0,0,0,0.3)';
    }, { passive: true });
  }

});
