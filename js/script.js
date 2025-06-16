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
    const gallery = document.querySelector('.photo-gallery');
    const photos = Array.from(gallery.querySelectorAll('.photo')); // Individual photo containers
    const lightbox = createLightbox();
    const categories = ['all', 'portrait', 'landscape', 'designs'];

    // 1) Build filter bar (no change here)
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

    // 2) Filtering logic (***** THIS IS THE MODIFIED SECTION *****)
    filterBar.addEventListener('click', e => {
        if (e.target.tagName !== 'BUTTON') return;
        filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.dataset.filter;

        // Step 1: Hide/show individual .photo elements
        photos.forEach(photo => {
            const cat = photo.dataset.category || 'all';
            photo.style.display = (filter === 'all' || filter === cat) ? '' : 'none'; // '' reverts to default display
        });

        // Step 2: Now, iterate through each .column and hide it if all its .photo children are hidden
        const columns = gallery.querySelectorAll('.column');
        columns.forEach(column => {
            // Count how many .photo elements inside this column are currently visible
            const visiblePhotosInColumn = Array.from(column.querySelectorAll('.photo')).filter(photo => {
                return photo.style.display !== 'none';
            });

            // If no photos are visible in this column (and it's not the 'all' filter), hide the column
            if (visiblePhotosInColumn.length === 0 && filter !== 'all') {
                column.style.display = 'none';
            } else {
                // Otherwise, ensure the column is visible
                column.style.display = ''; // Revert to its default display (e.g., 'flex' from your CSS)
            }
        });

        onScroll(); // Reposition scroll-in visibility for visible items
    });

    // 3) Lightbox logic (no change here)
    gallery.addEventListener('click', e => {
        const img = e.target.closest('img');
        if (!img) return;
        lightbox.show(img.src);
    });

    // 4) Scroll-in animation (no change here, already accounts for display:none)
    function onScroll() {
        const vh = window.innerHeight;
        // Important: Only consider currently visible photos for animation
        photos.forEach(photo => {
            if (photo.style.display === 'none') return; // Skip hidden photos
            const rect = photo.getBoundingClientRect();
            if (rect.top < vh - 50) photo.classList.add('visible');
        });
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Helper: create the overlay (MODIFIED)
function createLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  const img = document.createElement('img');
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // MODIFIED: Use a dedicated hide function for the lightbox
  const lightboxFunctions = {
    show(src) {
      img.src = src;
      // First, make it display flex so it takes up space, but still invisible
      overlay.style.display = 'flex';
      // Use a tiny timeout to ensure the browser registers the display change
      // before applying the opacity change, which allows the transition to work.
      setTimeout(() => {
        overlay.classList.add('open'); // Add the 'open' class to trigger fade-in
      }, 10); // A small delay, e.g., 10ms, is often sufficient
    },
    hide() {
      overlay.classList.remove('open'); // Remove 'open' to trigger fade-out
      // After the fade-out transition completes, set display to none
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300); // This timeout should match the CSS transition duration (0.3s = 300ms)
    }
  };

  // MODIFIED: Attach click listener to call the hide function
  overlay.addEventListener('click', () => lightboxFunctions.hide());

  return lightboxFunctions;
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


