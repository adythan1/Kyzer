// Main site-wide JS: navigation, active link highlighting, menu control, back-to-top, reveal animations (home page only for now)
(function(){
  function qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

  function initNav(){
    const toggle=qs('#mobileMenuToggle');
    const menu=qs('#mobileMenu');
    const closeBtn=qs('#mobileMenuClose');
    const overlay=qs('#menuOverlay');
    if(!toggle||!menu||!overlay) return;
    function open(){ menu.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow='hidden'; }
    function close(){ menu.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow=''; }
    toggle.addEventListener('click', open);
    if(closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    qsa('.mobile-nav a').forEach(a=>a.addEventListener('click', close));
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });

    const path=location.pathname.split('/').pop()||'index.html';
    qsa('.main-nav a, .mobile-nav a').forEach(a=>{ const href=a.getAttribute('href'); if(href && href.indexOf(path)!==-1){ a.classList.add('active-link'); }});
  }

  function initBackToTop(){
    const btn=qs('#backToTop'); if(!btn) return;
    function toggle(){ if(window.scrollY>600){ btn.classList.add('visible'); } else { btn.classList.remove('visible'); } }
    btn.addEventListener('click', ()=>{ window.scrollTo({top:0,behavior:'smooth'}); });
    window.addEventListener('scroll', toggle, {passive:true});
    toggle();
  }

  function initReveal(){
    const targets=qsa('.hero-text, .feature-card, .value-card, .services-grid .service-item, .metrics-section .stat-item, .service-card, .detail-grid, .eng-step, .impact-chip, .services-hero-text');
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduced) return;
    targets.forEach(el=>el.classList.add('reveal'));
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, {threshold:0.15});
    targets.forEach(t=>io.observe(t));
  }

  function initServicesQuickNav(){
    const quickNav=document.querySelector('.services-quick-nav');
    if(!quickNav) return; // only on services page
    const quickLinks=qsa('.services-quick-nav a');
    const ids=['advisory','consulting','analytics','risk','realestate','training'];
    const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
    function update(){
      const scrollPos=window.scrollY+window.innerHeight*0.3;
      let current=null;
      sections.forEach(sec=>{ if(scrollPos>=sec.offsetTop){ current=sec.id; }});
      if(current){ quickLinks.forEach(a=>a.classList.toggle('active-link', a.dataset.target===current)); }
    }
    window.addEventListener('scroll', ()=>{ requestAnimationFrame(update); }, {passive:true});
    update();
  }

  document.addEventListener('DOMContentLoaded',()=>{
    initNav();
    initBackToTop();
    initReveal();
    initServicesQuickNav();
  });
})();
