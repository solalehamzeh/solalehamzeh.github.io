$(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  // --------------------------------------------- //
  // Loader & Loading Animation Start
  // --------------------------------------------- //
  const content = document.querySelector("body");
  const imgLoad = imagesLoaded(content);

  imgLoad.on("done", (instance) => {
    document.getElementById("loaderContent").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("loader").classList.add("loaded");
    }, 300);

    gsap.set(".animate-headline", { y: 50, opacity: 0 });
    ScrollTrigger.batch(".animate-headline", {
      interval: 0.1,
      batchMax: 4,
      duration: 6,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          ease: "sine",
          stagger: { each: 0.15, grid: [1, 4] },
          overwrite: true,
        }),
      onLeave: (batch) =>
        gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
      onEnterBack: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
      onLeaveBack: (batch) =>
        gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
    });
  });

  const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: "#menu",
    smoothScroll: true,
    rootMargin: "0px 0px -40%",
  });

  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.to("[data-speed]", {
    y: (i, el) =>
      (1 - parseFloat(el.getAttribute("data-speed"))) *
      ScrollTrigger.maxScroll(window),
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      scrub: 0,
    },
  });

  const animateInUp = document.querySelectorAll(".animate-in-up");
  animateInUp.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        ease: "sine",
      },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: element,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const animateRotation = document.querySelectorAll(".animate-rotation");
  animateRotation.forEach((section) => {
    var value = $(section).data("value");
    gsap.fromTo(
      section,
      {
        ease: "sine",
        rotate: 0,
      },
      {
        rotate: value,
        scrollTrigger: {
          trigger: section,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.set(".animate-card-2", { y: 100, opacity: 0 });
  ScrollTrigger.batch(".animate-card-2", {
    interval: 0.1,
    batchMax: 2,
    duration: 6,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 2] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
  });

  gsap.set(".animate-card-3", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-3", {
    interval: 0.1,
    batchMax: 3,
    duration: 3,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 3] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });

  gsap.set(".animate-card-5", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-5", {
    interval: 0.1,
    batchMax: 5,
    delay: 1000,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 5] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });

  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-2", { y: 0, opacity: 1 })
  );
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-3", { y: 0, opacity: 1 })
  );
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-5", { y: 0, opacity: 1 })
  );

  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            1000,
            function () {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            }
          );
        }
      }
    });

  const toolsSlider = document.querySelector("tools-slider");
  const testimonialsSlider = document.querySelector("testimonials-slider");

  if (!toolsSlider) {
    const swiper = new Swiper(".swiper-tools", {
      spaceBetween: 20,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
      loop: true,
      grabCursor: true,
      loopFillGroupWithBlank: true,
      breakpoints: {
        1600: {
          slidesPerView: 5,
        },
        1200: {
          slidesPerView: 4,
        },
        768: {
          slidesPerView: 3,
        },
        576: {
          slidesPerView: 2,
        },
        0: {
          slidesPerView: 2,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  if (!testimonialsSlider) {
    const swiper = new Swiper(".swiper-testimonials", {
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: true,
      speed: 1000,
      loop: true,
      loopFillGroupWithBlank: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  if (!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function () {
      return $(this).attr("src").replace(".svg", ".png");
    });
  }

  try {
    $.browserSelector();
    if ($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch (err) {}

  $("img, a").on("dragstart", function (event) {
    event.preventDefault();
  });

  var isMobile = false;
  if (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $("html").addClass("touch");
    isMobile = true;
  } else {
    $("html").addClass("no-touch");
    isMobile = false;
  }
  //IE, Edge
  var isIE =
    /MSIE 9/i.test(navigator.userAgent) ||
    /rv:11.0/i.test(navigator.userAgent) ||
    /MSIE 10/i.test(navigator.userAgent) ||
    /Edge\/\d+/.test(navigator.userAgent);

  $(".gallery__link").each(function () {
    $(this)
      .append('<div class="picture"></div>')
      .children(".picture")
      .css({ "background-image": "url(" + $(this).attr("data-image") + ")" });
  });
});

const themeBtn = document.querySelector(".color-switcher");

function getCurrentTheme() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  localStorage.getItem("template.theme")
    ? (theme = localStorage.getItem("template.theme"))
    : null;
  return theme;
}
const unityIcon = document.querySelector(".tools-cards__icon.unity");
const unrealIcon = document.querySelector(".tools-cards__icon.unreal");
function loadTheme(theme) {
  const root = document.querySelector(":root");
  if (theme === "light") {
    themeBtn.innerHTML = `<em></em><i class="ph-bold ph-moon-stars"></i>`;
  } else {
    themeBtn.innerHTML = `<em></em><i class="ph-bold ph-sun"></i>`;
  }
  root.setAttribute("color-scheme", `${theme}`);
  if (unityIcon) {
    unityIcon.src =
      theme === "dark"
        ? "img/icons/icon-unity3d.svg"
        : "img/icons/unity3d-icon.svg";
  }
  if (unrealIcon) {
    unrealIcon.src =
      theme === "dark"
        ? "img/icons/icon-unreal-engine.svg"
        : "img/icons/unreal-engine-icon.svg";
  }
}

function createGalleryCard(item) {
  const hasHiddenImages = item.images && item.images.length > 0;
  const tags = item.tags
    .map((tag) => `<span class="rounded-tag${item.captionClass ? " " + item.captionClass : ""}">${tag}</span>`)
    .join("");

  return `
    <figure class="col-12 col-md-6 gallery__item grid-item animate-card-2" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
      <div class="project-gallery" data-project-id="${item.id}">
        <a class="gallery__link" data-image="${item.mainImage.src}" data-size="${item.mainImage.size}" href="${item.mainImage.src}" itemprop="contentUrl">
          <img alt="${item.mainImage.alt}" class="gallery__image" itemprop="thumbnail" src="${item.mainImage.src}" />
          <div class="picture" style="background-image: url('${item.mainImage.src}')"></div>
        </a>
        ${hasHiddenImages ? `
        <div class="hidden-gallery-items">
          ${item.images
            .map(
              (image) =>
                `<a data-image="${image.src}" data-size="${image.size}" href="${image.src}"></a>`
            )
            .join("")}
        </div>
        ` : ""}
      </div>
      <figcaption class="gallery__descr ${item.captionClass || ""}" itemprop="caption description">
        <h5>${item.title}</h5>
        <div class="card__tags d-flex flex-wrap">${tags}</div>
        <p class="small">${item.description}</p>
      </figcaption>
    </figure>`;
}

function renderGalleryData(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data
    .map((item) => createGalleryCard(item))
    .join("");
}

function renderTextData(siteData) {
  const renderMenu = siteData.menu
    .map(
      (item) =>
        `<li class="menu__item"><a class="menu__link btn" href="${item.href}"><span class="menu__caption">${item.caption}</span><i class="${item.icon}"></i></a></li>`
    )
    .join("");
  document.getElementById("menu-list").innerHTML = renderMenu;

  document.getElementById("avatar-image").src = siteData.avatar.image;
  document.getElementById("avatar-image").alt = `${siteData.avatar.name} avatar`;
  document.getElementById("avatar-name").textContent = siteData.avatar.name;
  document.getElementById("avatar-button").href = siteData.avatar.buttonHref;
  document.getElementById("avatar-button-text").textContent = siteData.avatar.buttonText;

  document.getElementById("headline-title").textContent = siteData.intro.headline;
  document.getElementById("download-cv-btn").href = siteData.intro.downloadCvHref;
  document.getElementById("download-cv-text").textContent = siteData.intro.downloadCvText;

  document.getElementById("portfolio-subtitle").textContent = siteData.portfolioSection.subtitle;
  document.getElementById("portfolio-title").textContent = siteData.portfolioSection.title;

  document.getElementById("physical-products-title").textContent = siteData.physicalSection.title;
  document.getElementById("physical-products-description").innerHTML = siteData.physicalSection.description;

  document.getElementById("about-subtitle").textContent = siteData.aboutSection.subtitle;
  document.getElementById("about-title").textContent = siteData.aboutSection.title;
  document.getElementById("about-text").textContent = siteData.aboutSection.text;
  document.getElementById("download-cv-button").href = siteData.aboutSection.downloadCvHref;
  document.getElementById("download-cv-button-text").textContent = siteData.aboutSection.downloadCvText;

  document.getElementById("resume-subtitle").textContent = siteData.resumeSection.subtitle;
  document.getElementById("resume-title").textContent = siteData.resumeSection.title;
  document.getElementById("work-title").textContent = siteData.resumeSection.workTitle;
  document.getElementById("education-title").textContent = siteData.resumeSection.educationTitle;
  document.getElementById("tools-title").textContent = siteData.resumeSection.toolsTitle;
  document.getElementById("contact-subtitle").textContent = siteData.contactSection.subtitle;
  document.getElementById("contact-title").textContent = siteData.contactSection.title;

  const achievementsHtml = siteData.achievements
    .map(
      (achievement) =>
        `<div class="achievements__item d-flex flex-column grid-item animate-card-3"><div class="achievements__card"><p class="achievements__number">${achievement.number}</p><p class="achievements__descr">${achievement.descr}</p></div></div>`
    )
    .join("");
  document.getElementById("achievements-list").innerHTML = achievementsHtml;

  const toolsHtml = siteData.tools
    .map(
      (tool) =>
        `<div class="tools-cards__item d-flex grid-item-s animate-card-5"><div class="tools-cards__card"><img alt="${tool.name} Icon" class="tools-cards__icon animate-in-up" src="${tool.icon}" /><h6 class="tools-cards__caption animate-in-up">${tool.name}</h6></div></div>`
    )
    .join("");
  document.getElementById("tools-cards").innerHTML = toolsHtml;

  const contactHtml = siteData.contacts
    .map(
      (contact) =>
        `<div class="col-12 col-md-3 contact-lines__data"><p class="contact-lines__title animate-in-up">${contact.label}</p><p class="contact-lines__text animate-in-up"><a class="text-link-bold" href="${contact.href}" target="_blank">${contact.value}</a></p></div>`
    )
    .join("");
  document.getElementById("contact-list").innerHTML = contactHtml;
}

function loadSiteData() {
  return Promise.all([
    fetch("site-data.json").then((response) => response.json()),
    fetch("gallery-data.json").then((response) => response.json()),
  ]).then(([siteData, galleryData]) => {
    renderTextData(siteData);
    renderGalleryData(galleryData.portfolio, "portfolio-gallery");
    renderGalleryData(galleryData.physical, "physical-gallery");

    if (typeof initPhotoSwipeFromDOM === "function") {
      initPhotoSwipeFromDOM('.my-gallery');
    }
  });
}

themeBtn.addEventListener("click", () => {
  let theme = getCurrentTheme();
  if (theme === "dark") {
    theme = "light";
  } else {
    theme = "dark";
  }
  localStorage.setItem("template.theme", `${theme}`);
  loadTheme(theme);
});

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(getCurrentTheme());
  loadSiteData().catch((error) => {
    console.error("Failed to load site data:", error);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Open modal when clicking "View More Media"
  document.querySelectorAll(".open-media").forEach((button) => {
    button.addEventListener("click", function () {
      let projectId = this.getAttribute("data-id");
      document.getElementById("media-modal-" + projectId).style.display =
        "flex";
    });
  });

  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      this.parentElement.parentElement.style.display = "none";
    });
  });

  window.addEventListener("click", function (event) {
    document.querySelectorAll(".media-modal").forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
});
