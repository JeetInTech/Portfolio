function openModal(project) {
  const modal = document.getElementById("projectModal");
  const iframe = document.getElementById("modalIframe");
  const title = document.getElementById("modalTitle");

  const projects = {
    neurovia: {
      url: "https://neuroviai.com/",
      title: "Neurovia AI - Live Preview",
    },
    crafting: {
      url: "https://craftingbrain.com/",
      title: "Crafting Brain - Live Preview",
    },
    secondbrain: {
      url: "https://secondbraindev.vercel.app/",
      title: "Second Brain - Live Preview",
    },
  };

  if (projects[project]) {
    iframe.src = projects[project].url;
    title.textContent = projects[project].title;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const modal = document.getElementById("projectModal");
  const iframe = document.getElementById("modalIframe");

  modal.style.display = "none";
  iframe.src = "";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("projectModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all project cards
document.querySelectorAll(".project-card").forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(50px)";
  card.style.transition = `opacity 0.6s ease ${
    index * 0.1
  }s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});
