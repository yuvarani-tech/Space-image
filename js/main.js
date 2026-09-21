/* ============================================
   SPACE — A Life Design Studio
   Main JavaScript — shared across all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Mobile hamburger menu ===== */
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  function closeDrawer() {
    hamburger?.classList.remove('open');
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openDrawer() {
    hamburger?.classList.add('open');
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  drawerOverlay?.addEventListener('click', closeDrawer);
  mobileDrawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ===== Back to top button ===== */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 420) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Booking modal ===== */
  const modalOverlay = document.querySelector('.modal-overlay');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.querySelector('.modal-close');
  const bookingForm = document.querySelector('#booking-form');
  const formSuccess = document.querySelector('.form-success');
  const formFields = document.querySelector('.form-fields');

  function openModal() {
    modalOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    // reset form view after closing
    setTimeout(() => {
      if (formSuccess && formFields) {
        formSuccess.style.display = 'none';
        formFields.style.display = '';
      }
      bookingForm?.reset();
      document.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));
    }, 300);
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeModalBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  /* ===== Contact form validation ===== */
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const name = bookingForm.querySelector('#book-name');
      const email = bookingForm.querySelector('#book-email');
      const phone = bookingForm.querySelector('#book-phone');
      const sessionType = bookingForm.querySelector('#book-session');
      const message = bookingForm.querySelector('#book-message');

      function markInvalid(field, isInvalid) {
        const group = field.closest('.form-group');
        if (isInvalid) {
          group.classList.add('invalid');
          valid = false;
        } else {
          group.classList.remove('invalid');
        }
      }

      markInvalid(name, name.value.trim().length < 2);

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      markInvalid(email, !emailPattern.test(email.value.trim()));

      const phonePattern = /^[0-9+\-\s()]{7,15}$/;
      markInvalid(phone, !phonePattern.test(phone.value.trim()));

      markInvalid(sessionType, sessionType.value === '');

      markInvalid(message, message.value.trim().length < 5);

      if (valid) {
        formFields.style.display = 'none';
        formSuccess.style.display = 'block';
      }
    });

    // Live-clear invalid state on input
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', function () {
        field.closest('.form-group')?.classList.remove('invalid');
      });
    });
  }

  /* ===== "Ask Me" / "Call Me" buttons inside modal ===== */
  const askMeBtn = document.querySelector('#ask-me-btn');
  const callMeBtn = document.querySelector('#call-me-btn');
  const sessionSelect = document.querySelector('#book-session');

  askMeBtn?.addEventListener('click', function () {
    bookingForm?.querySelector('#book-message').focus();
  });

  callMeBtn?.addEventListener('click', function () {
    window.location.href = 'tel:+919597643455';
  });

  /* ===== Hero / generic carousel ===== */
  document.querySelectorAll('.testimonial-slider').forEach(function (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    let index = 0;
    let autoTimer;

    if (!track || slides.length === 0) return;

    // build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach((d, i) => {
          d.classList.toggle('active', i === index);
        });
      }
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
      restartAuto();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5500);
    }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    restartAuto();
  });

  /* ===== FAQ Accordion ===== */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question?.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // close all others
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ===== Testimonial slider ===== */
  document.querySelectorAll('.testimonial-slider').forEach(function (slider) {
    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dotsWrap = slider.querySelector('.carousel-dots');
    let index = 0;

    if (!track || slides.length === 0) return;

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    setInterval(() => goTo(index + 1), 6000);
  });

  /* ===== Intent cards -> navigate to Explore section ===== */
  document.querySelectorAll('[data-explore-target]').forEach(card => {
    card.addEventListener('click', function (e) {
      // avoid double trigger if a button inside is clicked separately
      const target = card.getAttribute('data-explore-target');
      window.location.href = 'explore.html#' + target;
    });
  });

  /* ===== Select cards (Resources / Explore "what are you figuring out") ===== */
  document.querySelectorAll('.select-grid').forEach(grid => {
    grid.querySelectorAll('.select-card').forEach(card => {
      card.addEventListener('click', function () {
        grid.querySelectorAll('.select-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  });

  /* ===== Scroll to hash on load (for cross-page anchors like explore.html#self) ===== */
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  /* ===== Scroll reveal (Home & About pages) ===== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

});
