// ================= NAVIGATION =================
document.addEventListener('DOMContentLoaded', () => {
  const stickyNav = document.querySelector('.sticky-nav');
  const primaryHeader = document.querySelector('.site-header');

  if (stickyNav && primaryHeader) {
    const headerHeight = primaryHeader.offsetHeight;

    window.addEventListener('scroll', () => {
      if (window.scrollY > headerHeight) {
        stickyNav.classList.add('visible');
      } else {
        stickyNav.classList.remove('visible');
      }
    });
  }
});


// ================= PORTFOLIO =================
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  const photos = Array.from(gallery.querySelectorAll('.photo'));
  const images = Array.from(gallery.querySelectorAll('img'));

  const categories = ['all', 'portrait', 'landscape', 'edits'];

  // FILTER BAR
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.classList.add('filter-btn');
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.dataset.filter = cat;
    if (cat === 'all') btn.classList.add('active');
    filterBar.append(btn);
  });

  gallery.parentNode.insertBefore(filterBar, gallery);

  // FILTER LOGIC
  filterBar.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;

    filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    const filter = e.target.dataset.filter;

    photos.forEach(photo => {
      const cat = photo.dataset.category || 'all';
      photo.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
    });

    const columns = gallery.querySelectorAll('.column');
    columns.forEach(column => {
      const visiblePhotos = Array.from(column.querySelectorAll('.photo'))
        .filter(p => p.style.display !== 'none');

      column.style.display = visiblePhotos.length ? '' : 'none';
    });

    const beforeAfterSection = document.getElementById('beforeAfterSection');

    if (filter === 'edits') {
      beforeAfterSection.style.display = 'block';
      gallery.style.display = 'none';
    } else {
      beforeAfterSection.style.display = 'none';
      gallery.style.display = 'flex';
    }

    onScroll();
  });

  // ================= LIGHTBOX WITH NEXT/PREV =================
  let currentIndex = 0;

  

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const img = document.createElement('img');

  const prev = document.createElement('div');
  prev.className = 'nav prev';
  prev.innerHTML = '&#10094;';

  const next = document.createElement('div');
  next.className = 'nav next';
  next.innerHTML = '&#10095;';

  overlay.appendChild(prev);
  overlay.appendChild(img);
  overlay.appendChild(next);
  document.body.appendChild(overlay);

  gallery.addEventListener('click', e => {
    const clicked = e.target.closest('img');
    if (!clicked) return;

    currentIndex = images.indexOf(clicked);
    img.src = clicked.src;

    overlay.style.display = 'flex';

    setTimeout(() => {
      overlay.classList.add('open');
    }, 10);
  });

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    img.src = images[currentIndex].src;
  }

  next.addEventListener('click', showNext);
  prev.addEventListener('click', showPrev);

  // ================= SWIPE SUPPORT =================
let startX = 0;

overlay.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

overlay.addEventListener('touchend', (e) => {
  let endX = e.changedTouches[0].clientX;
  let diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      showNext(); // swipe left
    } else {
      showPrev(); // swipe right
    }
  }
});

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;

    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') overlay.style.display = 'none';
  });

  // SCROLL ANIMATION
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
});




// ================= BACK TO TOP =================
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  function checkScroll() {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    if (scrollY + viewportH >= docH - 200) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


// ================= MOBILE MENU =================


document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openMobileMenu');
  const closeBtn = document.getElementById('closeMobileMenu');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!openBtn || !mobileMenu || !closeBtn) return;

  // OPEN
  openBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });

  // CLOSE (X button)
  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });

  // CLOSE when clicking links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
});


// ================= ABOUT TILT =================
const card = document.querySelector('.about-card');

if (card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 25;
    const rotateY = (x - centerX) / 25;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
  });
}


// ================= BEFORE/AFTER =================
document.querySelectorAll('.compare-container, .ba-card').forEach(container => {
  const beforeBtn = container.querySelector('.beforeBtn');
  const afterBtn = container.querySelector('.afterBtn');
  const beforeImg = container.querySelector('.before');
  const afterImg = container.querySelector('.after');

  if (!beforeBtn || !afterBtn) return;

  beforeBtn.addEventListener('click', () => {
    beforeImg.classList.add('active');
    afterImg.classList.remove('active');

    beforeBtn.classList.add('active');
    afterBtn.classList.remove('active');
  });

  afterBtn.addEventListener('click', () => {
    afterImg.classList.add('active');
    beforeImg.classList.remove('active');

    afterBtn.classList.add('active');
    beforeBtn.classList.remove('active');
  });
});


// ================= DISABLE RIGHT CLICK =================
document.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// ================= LOADER FIX =================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  loader.classList.add('hidden');

  setTimeout(() => {
    loader.style.display = 'none';
  }, 300);
});

// ================= AUTO SCROLL (FINAL STABLE) =================
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.me-thumbnails');
  if (!container) return;

  let speed = 0.5;
  let isPaused = false;

  // duplicate content for seamless loop
  container.innerHTML += container.innerHTML;

  function animate() {
    if (!isPaused) {
      container.scrollLeft += speed;

      // seamless reset
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // pause interactions
  container.addEventListener('mouseenter', () => isPaused = true);
  container.addEventListener('mouseleave', () => isPaused = false);
  container.addEventListener('touchstart', () => isPaused = true);
  container.addEventListener('touchend', () => isPaused = false);
});


// ================= CENTER FOCUS =================
function updateCenterImage() {
  const container = document.querySelector('.me-thumbnails');
  const images = container.querySelectorAll('img');

  const center = container.scrollLeft + container.clientWidth / 2;

  let closest = null;
  let closestDistance = Infinity;

  images.forEach(img => {
    const imgCenter = img.offsetLeft + img.offsetWidth / 2;
    const distance = Math.abs(center - imgCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = img;
    }
  });

  images.forEach(img => img.classList.remove('active'));
  if (closest) closest.classList.add('active');
}

// run continuously
setInterval(updateCenterImage, 100);

// ================= WHATSAPP SEND =================

function sendWhatsApp() {

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("Please fill all fields");
    return;
  }

  let phoneNumber = "+919666355136"; // 🔥 replace with your number

  let text = `Hello, I'm ${name}%0AEmail: ${email}%0A${message}`;

  let url = `https://wa.me/${phoneNumber}?text=${text}`;

  window.open(url, "_blank");
}