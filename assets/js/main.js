(function() {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close nav on close button click
  var closeBtn = document.querySelector('.nav__close-btn');
  if (closeBtn && nav && toggle) {
    closeBtn.addEventListener('click', function() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Slider
  var slider = document.querySelector('.slider');
  if (!slider) return;
  var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
  var dotsContainer = slider.querySelector('.slider-dots');
  var prevBtn = slider.querySelector('.slider-btn.prev');
  var nextBtn = slider.querySelector('.slider-btn.next');
  var activeIndex = 0;
  var autoplay = slider.getAttribute('data-autoplay') === 'true';
  var interval = parseInt(slider.getAttribute('data-interval') || '5000', 10);
  var timer = null;

  function goTo(index) {
    slides[activeIndex].classList.remove('is-active');
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add('is-active');
    updateDots();
  }

  function next() { goTo(activeIndex + 1); }
  function prev() { goTo(activeIndex - 1); }

  function startAutoplay() {
    if (!autoplay) return;
    stopAutoplay();
    timer = setInterval(next, interval);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    slides.forEach(function(_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', function() { goTo(i); startAutoplay(); });
      dotsContainer.appendChild(b);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    var buttons = dotsContainer.querySelectorAll('button');
    buttons.forEach(function(btn, i) {
      if (i === activeIndex) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  createDots();
  updateDots();

  nextBtn && nextBtn.addEventListener('click', function() { next(); startAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', function() { prev(); startAutoplay(); });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
})();

// Design carousel
(function() {
  var carousel = document.querySelector('.carousel');
  if (!carousel) return;
  var track = carousel.querySelector('.carousel-track');
  var items = carousel.querySelectorAll('.carousel-item');
  var prev = carousel.querySelector('.carousel-btn.prev');
  var next = carousel.querySelector('.carousel-btn.next');
  var dotsWrap = carousel.querySelector('.carousel-dots');
  var index = 0;

  function renderDots() {
    dotsWrap.innerHTML = '';
    items.forEach(function(_, i){
      var b = document.createElement('button');
      if (i === index) b.setAttribute('aria-current','true');
      b.addEventListener('click', function(){ goTo(i); });
      dotsWrap.appendChild(b);
    });
  }
  function goTo(i) {
    index = (i + items.length) % items.length;
    var width = carousel.querySelector('.carousel-viewport').clientWidth;
    var per = getComputedStyle(track).gridAutoColumns;
    // Calculate translate based on index and item width
    var visible = track.style.gridAutoColumns || per;
    track.style.transform = 'translateX(' + (-index * width) + 'px)';
    Array.prototype.forEach.call(dotsWrap.children, function(dot, di){
      if (di === index) dot.setAttribute('aria-current','true'); else dot.removeAttribute('aria-current');
    });
  }
  prev && prev.addEventListener('click', function(){ goTo(index - 1); });
  next && next.addEventListener('click', function(){ goTo(index + 1); });
  window.addEventListener('resize', function(){ goTo(index); });
  renderDots();
  goTo(0);
})();

// Machines carousel
(function(){
  var root = document.querySelector('.machines');
  if (!root) return;
  var track = root.querySelector('.machines-track');
  var prev = root.querySelector('.machines-btn.prev');
  var next = root.querySelector('.machines-btn.next');
  var index = 0;
  function move(i){
    index = Math.max(0, Math.min(i, track.children.length - 1));
    var width = root.querySelector('.machines-viewport').clientWidth;
    track.style.transform = 'translateX(' + (-index * width) + 'px)';
  }
  prev && prev.addEventListener('click', function(){ move(index - 1); });
  next && next.addEventListener('click', function(){ move(index + 1); });
  window.addEventListener('resize', function(){ move(index); });
  move(0);
})();

// Navbar blur on scroll
(function(){
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  function update(){
    if (window.scrollY > 30) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// Card tilt interaction
(function(){
  var cards = document.querySelectorAll('.card');
  if (!cards.length) return;
  cards.forEach(function(card){
    var rect;
    function onMove(e){
      rect = rect || card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var rx = (y - 0.5) * -8; // tilt limits
      var ry = (x - 0.5) * 8;
      card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    }
    function reset(){
      rect = null;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('mouseenter', function(){ rect = card.getBoundingClientRect(); });
  });
})();

// Smooth scroll to top and floating visibility
(function(){
  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  // Reveal when scrolled 200px
  function toggle(){
    if (window.scrollY > 200) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  }
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

