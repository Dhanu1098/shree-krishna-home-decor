(function(){
  'use strict';

  const $  = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader')?.classList.add('hidden'), 350);
  });

  const nav  = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const toggle = $('#navToggle');
  const menu   = $('#navMenu');
  if (toggle && menu){
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });
    $$('.nav-link', menu).forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window){
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          const id = e.target.id;
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
      });
    }, {rootMargin:'-40% 0px -55% 0px'});
    sections.forEach(s => navObs.observe(s));
  }

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1){
        const target = $(href);
        if (target){
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({top, behavior:'smooth'});
        }
      }
    });
  });

  if ('IntersectionObserver' in window){
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add('in-view');
          reveal.unobserve(e.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
    $$('.reveal').forEach(el => reveal.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in-view'));
  }

  const counters = $$('.hero-stat-num');
  if ('IntersectionObserver' in window && counters.length){
    const animate = (el) => {
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === 'true';
      const dur = 1800;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = isDecimal ? v.toFixed(1) : Math.floor(v).toLocaleString('en-IN');
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString('en-IN');
      };
      requestAnimationFrame(step);
    };
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          animate(e.target);
          cObs.unobserve(e.target);
        }
      });
    }, {threshold:0.5});
    counters.forEach(c => cObs.observe(c));
  }
})();
