document.addEventListener('DOMContentLoaded', () => {
    document
      .querySelectorAll('.playlist-card')
      .forEach(card => {
        card.addEventListener('click', () => {
          window.location.href = card.dataset.url;
        });
      });
  });