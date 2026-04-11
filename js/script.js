// SCROLL TO GALLERY
function scrollToGallery() {
  document.querySelector(".gallery")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// NAV SHADOW
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");

  if (nav) {
    if (window.scrollY > 50) {
      nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
    } else {
      nav.style.boxShadow = "none";
    }
  }
});

// HERO FADE
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const scrollY = window.scrollY;
  const fadeEnd = 400;

  let opacity = 1 - scrollY / fadeEnd;
  if (opacity < 0) opacity = 0;

  hero.style.opacity = opacity;
});

// ================= LIGHTBOX SYSTEM =================

const images = document.querySelectorAll(".gallery-img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;

// SAFE MOBILE NAV FIX
function hideNavOnMobile() {
  if (window.innerWidth <= 768) {
    prevBtn && (prevBtn.style.display = "none");
    nextBtn && (nextBtn.style.display = "none");
  } else {
    prevBtn && (prevBtn.style.display = "block");
    nextBtn && (nextBtn.style.display = "block");
  }
}

// OPEN LIGHTBOX
images.forEach((img, index) => {
  img.parentElement?.addEventListener("click", (e) => {
    e.preventDefault();

    if (!lightbox || !lightboxImg) return;

    currentIndex = index;
    showImage();
    lightbox.classList.add("active");

    hideNavOnMobile();
  });
});

// SHOW IMAGE
function showImage() {
  if (!lightboxImg) return;

  lightboxImg.src =
    images[currentIndex].dataset.full || images[currentIndex].src;

  lightboxImg.classList.remove("zoomed");
}

// CLOSE
closeBtn?.addEventListener("click", () => {
  lightbox?.classList.remove("active");
});

// NEXT
nextBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
});

// PREV
prevBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
});

// CLICK OUTSIDE
lightbox?.addEventListener("click", (e) => {
  if (
    !e.target.closest(".lightbox-img") &&
    !e.target.closest(".nav-btn")
  ) {
    lightbox.classList.remove("active");
  }
});

// ZOOM
lightboxImg?.addEventListener("click", (e) => {
  e.stopPropagation();
  lightboxImg.classList.toggle("zoomed");
});

// SWIPE
let startX = 0;

lightbox?.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightbox?.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  } else if (endX - startX > 50) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  }
});

// RESIZE
window.addEventListener("resize", hideNavOnMobile);

// PROJECT PAGE GALLERY FADE IN
const fadeImages = document.querySelectorAll(".gallery-img");

images.forEach((img, index) => {
  img.style.transitionDelay = `${index * 40}ms`; // 👈 KEY LINE
});

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;

      if (img.complete) {
        img.classList.add("loaded");
      } else {
        img.onload = () => {
          requestAnimationFrame(() => {
            img.classList.add("loaded");
          });
        };
      }

      observer.unobserve(img);
    }
  });
}, {
  threshold: 0.2
});

fadeImages.forEach(img => {
  observer.observe(img);
});


// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });
}



// CONTACT SUBMIT MESSAGE (SAFE)
const form = document.querySelector(".contact-form");
const msg = document.getElementById("successMsg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🔥 STOP redirect

    const formData = new FormData(form);

    await fetch("https://formsubmit.co/ajax/bhanoday.Photography@gmail.com", {
      method: "POST",
      body: formData
    });

    // show success message
    if (msg) {
      msg.classList.add("show");
    }

    form.reset(); // clear form
  });
}


// BACK TO TOP BUTTON (SAFE)
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {   // 👈 reduced for testing
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});


// mobile image loading priority

const isMobile = window.innerWidth < 768;

if (isMobile) {
  document.querySelectorAll(".gallery-img").forEach((img, index) => {
    if (index < 12) {
      img.loading = "eager";
      img.setAttribute("fetchpriority", "high");
    }
  });
}


// About image load

const aboutImg = document.querySelector(".about-image img");

if (aboutImg) {
  if (aboutImg.complete) {
    aboutImg.classList.add("loaded");
  } else {
    aboutImg.onload = () => {
      requestAnimationFrame(() => {
        aboutImg.classList.add("loaded");
      });
    };
  }
}
