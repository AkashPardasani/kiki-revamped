// Smooth scrolling with Lenis
document.addEventListener("DOMContentLoaded", function () {
  // Particles.js initialization
  const particlesScript = document.createElement("script");
  particlesScript.src =
    "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
  particlesScript.async = true;

  particlesScript.onload = function () {
    const logo = document.getElementById("logo");
    const logoRect = logo.getBoundingClientRect();
    const particlesContainer = document.getElementById("particles-js");

    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ["#E4AA81", "#F9E7DA"] },
        shape: { type: "circle" },
        opacity: { value: 0.6, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 2, direction: "none", random: true },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: { repulse: { distance: 100, duration: 0.4 } },
      },
      retina_detect: false,
    });
  };

  document.body.appendChild(particlesScript);
});

// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("animate-fade-in-down");
  });
});

// Blog functionality
const blogContainer = document.getElementById("blogContainer");

const blogObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fetchBlogs();
        blogObserver.disconnect();
      }
    });
  },
  { threshold: 0.1 }
);

blogObserver.observe(blogContainer);

async function fetchBlogs() {
  try {
    const response = await fetch(
      "https://api-sac6b737pq-uc.a.run.app/blogs/fetch?page=1"
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const blogs = await response.json();
    const latestBlogs = blogs.slice(0, 4);

    const blogsHTML = latestBlogs
      .map((blog, index) => generateBlogHTML(blog, index))
      .join("");
    blogContainer.innerHTML = blogsHTML;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    blogContainer.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-white text-lg">Failed to load blogs. Please try again later.</p>
        <button onclick="fetchBlogs()" class="mt-4 px-6 py-2 bg-[#E4AA81] text-black rounded-full hover:bg-[#F9E7DA] transition-colors duration-300">
          Retry
        </button>
      </div>
    `;
  }
}

function generateBlogHTML(blog, index) {
  // First blog (large card)
  if (index === 0) {
    return `
      <div class="md:col-span-4 bg-gradient-to-br from-[#1A0A0A] to-black rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(228,170,129,0.2)] border border-[#E4AA81]/30 hover:border-[#E4AA81] group">
        <!-- ... rest of the HTML for first blog ... -->
      </div>
    `;
  }

  // Second and third blogs (wide cards)
  if (index === 1 || index === 2) {
    return `
      <div class="md:col-span-6 bg-gradient-to-br from-[#1A0A0A] to-black rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(228,170,129,0.2)] border border-[#E4AA81]/30 hover:border-[#E4AA81] group">
        <!-- ... rest of the HTML for second/third blog ... -->
      </div>
    `;
  }

  // Fourth blog (small card)
  if (index === 3) {
    return `
      <div class="md:col-span-4 bg-gradient-to-br from-[#1A0A0A] to-black rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(228,170,129,0.2)] border border-[#E4AA81]/30 hover:border-[#E4AA81] group">
        <!-- ... rest of the HTML for fourth blog ... -->
      </div>
    `;
  }
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Video autoplay functionality
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll("video[data-autoplay]");

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play();
          videoObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  videos.forEach((video) => videoObserver.observe(video));
});

// Newsletter form functionality
document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletterForm");

  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("newsletterEmail");
    const submitBtn = document.getElementById("newsletterSubmit");
    const spinner = document.getElementById("submitSpinner");
    const messageDiv = document.getElementById("newsletterMessage");

    // Reset previous state
    messageDiv.className =
      "text-sm transition-all duration-300 overflow-hidden h-0";
    messageDiv.textContent = "";

    // Disable form while submitting
    emailInput.disabled = true;
    submitBtn.disabled = true;
    spinner.classList.remove("hidden");

    try {
      const response = await fetch(
        "https://api-sac6b737pq-uc.a.run.app/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput.value,
          }),
        }
      );

      const data = await response.json();

      // Show message with appropriate styling
      messageDiv.style.height = "auto";
      if (response.ok) {
        messageDiv.className =
          "text-sm text-green-400 mt-2 transition-all duration-300";
        messageDiv.textContent = "✓ Successfully subscribed!";
        newsletterForm.reset();
      } else {
        messageDiv.className =
          "text-sm text-red-400 mt-2 transition-all duration-300";
        messageDiv.textContent = `✕ ${data.error}`;
      }
    } catch (error) {
      messageDiv.style.height = "auto";
      messageDiv.className =
        "text-sm text-red-400 mt-2 transition-all duration-300";
      messageDiv.textContent =
        "✕ Something went wrong. Please try again later.";
    } finally {
      // Re-enable form
      emailInput.disabled = false;
      submitBtn.disabled = false;
      spinner.classList.add("hidden");
    }
  });

  // Email validation
  document.getElementById("newsletterEmail").addEventListener("input", (e) => {
    const email = e.target.value;
    const submitBtn = document.getElementById("newsletterSubmit");
    const messageDiv = document.getElementById("newsletterMessage");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      messageDiv.style.height = "auto";
      messageDiv.className =
        "text-sm text-yellow-400 mt-2 transition-all duration-300";
      messageDiv.textContent = "Please enter a valid email address";
      submitBtn.disabled = true;
    } else {
      messageDiv.style.height = "0";
      messageDiv.textContent = "";
      submitBtn.disabled = false;
    }
  });
});
