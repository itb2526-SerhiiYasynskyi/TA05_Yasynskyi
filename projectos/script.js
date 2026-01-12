// swiper init
var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: true
  },
  keyboard: { enabled: true },
  mousewheel: { thresholdDelta: 70 },
  spaceBetween: 60,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }

});


window.addEventListener("load", () => {
  const el = document.getElementById("particle-canvas");
  if (!el || typeof ParticleNetwork === "undefined") {
    console.log("ParticleNetwork not loaded");
    return;
  }

  new ParticleNetwork(el, {
    particleColor: "#ffffff",
    background: "#191c29",
    interactive: true,
    speed: "medium",
    density: "high"
  });
});
