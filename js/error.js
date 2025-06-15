// trigger a flash burst every 3 seconds
document.addEventListener('DOMContentLoaded', () => {
  const flash = document.querySelector('.flash');
  setInterval(() => {
    flash.style.animation = 'flash 0.6s ease-out';
    // clear animation so it can re-trigger
    flash.addEventListener('animationend', () => {
      flash.style.animation = '';
    }, { once: true });
  }, 3000);
});
