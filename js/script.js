// script.js

// ..........................................Navigation bar.......................................

document.addEventListener('DOMContentLoaded', () => {
  const stickyNav = document.querySelector('.sticky-nav');
  const primaryHeader = document.querySelector('.site-header');
  const headerHeight = primaryHeader.offsetHeight;

  window.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight) {
      stickyNav.classList.add('visible');
    } else {
      stickyNav.classList.remove('visible');
    }
  });
  
});

// ............................................Portfolio......................................

document.addEventListener('DOMContentLoaded', () => {
  const gallery   = document.querySelector('.photo-gallery');
  const photos    = Array.from(gallery.querySelectorAll('.photo'));
  const lightbox  = createLightbox();
  const categories = ['all','portrait','landscape','designs']; 

  // 1) Build filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.dataset.filter = cat;
    if (cat === 'all') btn.classList.add('active');
    filterBar.append(btn);
  });
  gallery.parentNode.insertBefore(filterBar, gallery);

  // 2) Filtering logic
  filterBar.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const filter = e.target.dataset.filter;
    photos.forEach(photo => {
      const cat = photo.dataset.category || 'all';
      photo.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
    });
    onScroll(); // reposition scroll‑in visibility
  });

  // 3) Lightbox logic
  gallery.addEventListener('click', e => {
    const img = e.target.closest('img');
    if (!img) return;
    lightbox.show(img.src);
  });

  // 4) Scroll‑in animation
  function onScroll() {
    const vh = window.innerHeight;
    photos.forEach(photo => {
      if (photo.style.display === 'none') return;
      const rect = photo.getBoundingClientRect();
      if (rect.top < vh - 50) photo.classList.add('visible');
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Helper: create the overlay
  function createLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    const img = document.createElement('img');
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.style.display = 'none');
    return {
      show(src) {
        img.src = src;
        overlay.style.display = 'flex';
      }
    };
  }
});

// ..............................Back to top listener................................

document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.querySelector('.back-to-top');
  const showAt = 200; // px from bottom before showing

  function checkScroll() {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    if (scrollY + viewportH >= docH - showAt) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();  // initial check

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ..................................................Mobile Menu.........................................

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn   = document.getElementById('openMobileMenu');
  const mobileMenu  = document.getElementById('mobileMenu');

  // Toggle open/close
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');   // animate bars → X
    mobileMenu.classList.toggle('open');  // dropdown scaleY(1)
  });

  // Close when any link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
});


// ..........................................Loading Animation........................................................

document.addEventListener('DOMContentLoaded', () => {
  const loader     = document.getElementById('loader');
  const sections   = ['hero','about','services','portfolio','footer'];
  const links      = document.querySelectorAll('a[href^="#"]');

  // Hide loader once page is ready
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 200);
  });

  // Function to switch sections
  function switchTo(id) {
    // 1) Fade out all
    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) el.classList.add('hidden');
    });
    // 2) Fade in target + hero + footer
    ['hero', id, 'footer'].forEach(secId => {
      const el = document.getElementById(secId);
      if (el) el.classList.remove('hidden');
    });
  }

  // Attach to nav links
  links.forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href').substring(1);
      if (!sections.includes(target)) return;
      e.preventDefault();

      // Show loader briefly
      loader.classList.remove('hidden');
      // After spinner shows, switch sections and hide loader
      setTimeout(() => {
        switchTo(target);
        loader.classList.add('hidden');
      }, 300);
    });
  });
});


