document.querySelectorAll('img[data-image-fallback]').forEach(image => {
  function showFallback() {
    image.hidden = true;
    image.nextElementSibling.hidden = false;
  }

  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});
