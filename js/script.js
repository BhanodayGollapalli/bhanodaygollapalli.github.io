document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();const main=document.querySelector('main'),current=main?.dataset.currentPage;document.querySelectorAll('.nav-links a').forEach(a=>{if(a.dataset.page===current)a.classList.add('active')});const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav-links');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'});const filters=[...document.querySelectorAll('.filter-btn')],items=[...document.querySelectorAll('.portfolio-item')];filters.forEach(b=>b.addEventListener('click',()=>{const filter=b.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===b));items.forEach(i=>{i.hidden=filter!=='all'&&i.dataset.category!==filter});document.querySelectorAll('.project-gallery').forEach(gallery=>{const hasVisibleItem=[...gallery.querySelectorAll('.portfolio-item')].some(item=>!item.hidden&&item.dataset.category===filter||!item.hidden&&filter==='all');gallery.hidden=!hasVisibleItem})}));const box=document.getElementById('lightbox'),img=box?.querySelector('figure img'),cap=box?.querySelector('figcaption');let visible=[],active=0;let imageChangeTimer;function openAt(n){visible=items.filter(i=>!i.hidden&&i.style.display!=='none');if(!visible.length)return;active=(n+visible.length)%visible.length;const it=visible[active];const nextSrc=it.dataset.full;const nextAlt=it.querySelector('img')?.alt||'';const nextCaption=it.dataset.caption||'';box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';window.clearTimeout(imageChangeTimer);const figure=box.querySelector('figure');if(img.getAttribute('src')===nextSrc){img.alt=nextAlt;cap.textContent=nextCaption;return}if(figure){figure.classList.remove('flash-out');void figure.offsetWidth;figure.classList.add('flash-out')}img.classList.add('is-changing');imageChangeTimer=window.setTimeout(()=>{img.onload=()=>{img.classList.remove('is-changing');img.onload=null};img.onerror=()=>{img.classList.remove('is-changing');img.onerror=null};img.alt=nextAlt;cap.textContent=nextCaption;img.src=nextSrc;if(img.complete&&img.naturalWidth>0){window.requestAnimationFrame(()=>img.classList.remove('is-changing'))}},140);window.setTimeout(()=>figure?.classList.remove('flash-out'),450)}function close(){box?.classList.remove('open');box?.setAttribute('aria-hidden','true');document.body.style.overflow=''}items.forEach(it=>it.addEventListener('click',()=>{visible=items.filter(i=>!i.hidden&&i.style.display!=='none');openAt(visible.indexOf(it))}));box?.querySelector('.lightbox-close')?.addEventListener('click',close);box?.querySelector('.lightbox-prev')?.addEventListener('click',()=>openAt(active-1));box?.querySelector('.lightbox-next')?.addEventListener('click',()=>openAt(active+1));box?.addEventListener('click',e=>{if(e.target===box)close()});document.addEventListener('keydown',e=>{if(!box?.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')openAt(active-1);if(e.key==='ArrowRight')openAt(active+1)});document.querySelectorAll('.project-gallery').forEach(gallery => {
    const track = gallery.querySelector('.project-carousel');
    if (!track) return;

    const previous = gallery.querySelector('.carousel-prev');
    const next = gallery.querySelector('.carousel-next');
    let autoTimer = null;
    let paused = false;
    let movingTimer = null;

    const cards = () => [...track.querySelectorAll('.portfolio-item:not([hidden])')];
    const isMobile = () => window.matchMedia('(max-width: 800px)').matches;

    function cardStart(card) {
        return card.offsetLeft - track.offsetLeft;
    }

    function targetScrollLeft(card) {
        if (isMobile()) {
            return cardStart(card) - (track.clientWidth - card.offsetWidth) / 2;
        }
        // Desktop is a continuous filmstrip: align each image to the track's left edge.
        return cardStart(card);
    }

    function goTo(index, behavior = 'smooth') {
        const all = cards();
        if (!all.length) return;

        const targetIndex = (index + all.length) % all.length;
        const target = all[targetIndex];
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        let left = targetScrollLeft(target);

        // Ensure wrap-around reaches the actual first/last slide even when the
        // browser clamps scroll positions at the track boundaries.
        left = Math.max(0, Math.min(left, maxScroll));
        track.scrollTo({ left, behavior });

        window.clearTimeout(movingTimer);
        movingTimer = window.setTimeout(() => {}, behavior === 'smooth' ? 650 : 0);
    }

    function currentIndex() {
        const all = cards();
        if (!all.length) return 0;

        const reference = isMobile()
            ? track.scrollLeft + track.clientWidth / 2
            : track.scrollLeft + 2;

        let best = 0;
        let distance = Infinity;
        all.forEach((card, index) => {
            const start = cardStart(card);
            const point = isMobile() ? start + card.offsetWidth / 2 : start;
            const d = Math.abs(point - reference);
            if (d < distance) {
                distance = d;
                best = index;
            }
        });
        return best;
    }

    function step(direction) {
        const all = cards();
        if (!all.length) return;
        goTo(currentIndex() + direction, 'smooth');
    }

    previous?.addEventListener('click', event => {
        event.preventDefault();
        step(-1);
        restartAuto();
    });
    next?.addEventListener('click', event => {
        event.preventDefault();
        step(1);
        restartAuto();
    });

    function stopAuto() {
        if (autoTimer) {
            window.clearInterval(autoTimer);
            autoTimer = null;
        }
    }
    function startAuto() {
        stopAuto();
        if (paused || cards().length < 2) return;
        autoTimer = window.setInterval(() => {
            if (!document.hidden && !gallery.querySelector('.lightbox.open')) step(1);
        }, 5000);
    }
    function restartAuto() {
        startAuto();
    }

    gallery.addEventListener('mouseenter', () => { paused = true; stopAuto(); });
    gallery.addEventListener('mouseleave', () => { paused = false; startAuto(); });
    gallery.addEventListener('focusin', () => { paused = true; stopAuto(); });
    gallery.addEventListener('focusout', () => { paused = false; startAuto(); });
    track.addEventListener('touchstart', () => { paused = true; stopAuto(); }, { passive: true });
    track.addEventListener('touchend', () => {
        window.setTimeout(() => { paused = false; startAuto(); }, 1800);
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAuto();
        else startAuto();
    });

    startAuto();
});document.querySelectorAll('.whatsapp-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form),type=form.dataset.messageType;const lines=[type==='appointment'?'BHANU LENS CRAFT — APPOINTMENT REQUEST':'BHANU LENS CRAFT — INVOICE / PAYMENT REQUEST'];const labels={name:'Name',shoot:'Type of shoot',date:'Preferred date',details:'Details',request:'Request type',reference:'Booking / reference'};for(const [k,v] of data.entries())if(String(v).trim())lines.push((labels[k]||k)+': '+v);window.open('https://wa.me/919666355136?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener')}));});
