
// on window load, append all photo class as children of gallery
window.onload = () => {
  const photos = document.querySelectorAll('.photo');
  const gallery = document.querySelector('.gallery');

  for (let photo of photos) {
    gallery.appendChild(photo);
  }
};

