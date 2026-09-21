/**
 * PULSE HEALTH CLINIC — AI REVIEW & GOOGLE RATING SYSTEM
 * Verified Google Place ID: ChIJrcsBE6ORyzsRNNWqRuAR6Ok
 * Direct Google Review URL: https://search.google.com/local/writereview?placeid=ChIJrcsBE6ORyzsRNNWqRuAR6Ok
 */

const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJrcsBE6ORyzsRNNWqRuAR6Ok";
const CLINIC_WHATSAPP_NUMBER = "917396639211";

// State
let currentRating = 5;
let selectedDoctor = "both";
let selectedTreatments = ["General Health"];
let selectedHighlights = ["Very patient & gentle", "Painless experience"];
let generatedOptions = [];
let selectedReviewText = "";

// Treatments Data by Doctor
const TREATMENTS_BY_DOCTOR = {
  "dr-vijay": [
    "Piles Treatment", "Lipoma Removal", "Sebaceous Cyst", "Fibroadenoma", 
    "Ear Lobe Correction", "Wound Care & Suturing", "Corn & Warts Removal", "General Surgery"
  ],
  "dr-devipriya": [
    "PRP Hair Treatment", "GFC Hair Therapy", "Hair Fall Consultation", "Dermal Fillers", 
    "Botox Treatment", "Chemical Peels", "Skin Booster & Glow", "Exosomes Anti-Aging"
  ],
  "both": [
    "PRP / GFC Hair Treatment", "Skin Glow & Peels", "Lipoma / Cyst Removal", 
    "Piles Treatment", "General Health Consultation", "Wound Dressing & Suturing"
  ]
};

// Rich Local AI Templates with Natural Human Tones
const HUMAN_REVIEW_TEMPLATES = {
  detailed: [
    (doc, treat, high) => `Visited Pulse Health Clinic in Madhapur for ${treat}. ${doc === 'Dr. G. Vijay Kumar' ? 'Dr. Vijay Kumar' : doc === 'Dr. Y. Devi Priya' ? 'Dr. Devi Priya' : 'The doctors'} took the time to explain everything thoroughly before starting. The procedure was ${high.toLowerCase().includes('painless') ? 'virtually painless' : 'done with utmost care'} and the clinic hygiene standards are exceptional. Very satisfied with the treatment results and clear post-care advice!`,
    (doc, treat, high) => `Had an appointment at Pulse Health Clinic near Ayyappa Society, Madhapur for ${treat}. ${doc} is exceptionally skilled and made me feel completely comfortable. What stood out most was how ${high.toLowerCase()} they were throughout. The staff is polite, and the consultation was completely transparent with no unnecessary tests. Highly recommend!`,
    (doc, treat, high) => `I had been looking for a dependable clinic in Madhapur for ${treat} and found Pulse Health Clinic. ${doc} was wonderful—very professional, calm, and addressed every trivial question I had. The procedure went smoothly and recovery was rapid. Truly one of the best clinics in the Hitec City area.`
  ],
  warm: [
    (doc, treat, high) => `Really pleased with my visit to Pulse Clinic! Consulted ${doc} for ${treat}. Doctor is so gentle and patient, and the treatment was ${high.toLowerCase()}. The clinic is sparkling clean and very well organized. Thank you doctor and staff for the wonderful care! 😊`,
    (doc, treat, high) => `Super happy with the results of my ${treat} at Pulse Health Clinic! ${doc} is one of the most polite and caring doctors I've met in Hyderabad. The treatment was ${high.toLowerCase()} and the results speak for themselves. 5 stars all the way!`,
    (doc, treat, high) => `Great experience at Pulse Clinic Madhapur! Consulted ${doc} for ${treat}. Right from reception to doctor consultation, everything was seamless. Doctor explained the cause and solution very calmly without rushing. Truly appreciate the genuine care.`
  ],
  short: [
    (doc, treat, high) => `Best clinic in Madhapur! Consulted ${doc} for ${treat}—very smooth and ${high.toLowerCase()}. Highly recommended.`,
    (doc, treat, high) => `Excellent care by ${doc} for ${treat} at Pulse Health Clinic. Clean premises, friendly staff, and great results!`,
    (doc, treat, high) => `5/5 stars for ${doc}! Got ${treat} done here. Professional, transparent, and completely ${high.toLowerCase()}.`
  ]
};

// DOM Elements
const stars = document.querySelectorAll(".star-btn");
const ratingStatusText = document.getElementById("ratingStatusText");
const starRatingBox = document.getElementById("starRatingBox");
const positiveWizard = document.getElementById("positiveWizard");
const privateFeedbackBox = document.getElementById("privateFeedbackBox");
const doctorCards = document.querySelectorAll(".doctor-card");
const treatmentsCloud = document.getElementById("treatmentsCloud");
const highlightBtns = document.querySelectorAll(".highlight-btn");
const reviewOptionsContainer = document.getElementById("reviewOptionsContainer");
const customReviewText = document.getElementById("customReviewText");
const copyGoogleBtn = document.getElementById("copyGoogleBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const postCopyAlert = document.getElementById("postCopyAlert");
const aiShimmer = document.getElementById("aiShimmer");

// Init
document.addEventListener("DOMContentLoaded", () => {
  setupStarRating();
  setupDoctorSelector();
  renderTreatmentChips();
  setupHighlightTags();
  setupCopyAndRedirect();
  setupStandeeModal();
  triggerAiReviewGeneration();
});

// 1. Star Rating Logic
function setupStarRating() {
  const ratingLabels = {
    5: "🌟 5 Stars — Outstanding Experience!",
    4: "✨ 4 Stars — Very Good Experience!",
    3: "3 Stars — Fair / Average Experience",
    2: "2 Stars — Needs Improvement",
    1: "1 Star — Disappointing Experience"
  };

  stars.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.dataset.rating, 10);
      setRating(val);
    });

    btn.addEventListener("mouseenter", () => {
      const val = parseInt(btn.dataset.rating, 10);
      highlightStars(val);
    });

    btn.addEventListener("mouseleave", () => {
      highlightStars(currentRating);
    });
  });

  function setRating(val) {
    currentRating = val;
    highlightStars(val);
    ratingStatusText.textContent = ratingLabels[val] || "";
    starRatingBox.classList.add("active");

    if (val >= 4) {
      positiveWizard.classList.add("active");
      privateFeedbackBox.classList.remove("active");
      triggerAiReviewGeneration();
    } else {
      positiveWizard.classList.remove("active");
      privateFeedbackBox.classList.add("active");
    }
  }

  function highlightStars(val) {
    stars.forEach(btn => {
      const r = parseInt(btn.dataset.rating, 10);
      if (r <= val) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Default to 5 stars
  setRating(5);
}

// 2. Doctor Selector
function setupDoctorSelector() {
  doctorCards.forEach(card => {
    card.addEventListener("click", () => {
      doctorCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedDoctor = card.dataset.doc;
      renderTreatmentChips();
      triggerAiReviewGeneration();
    });
  });
}

// 3. Treatment Chips
function renderTreatmentChips() {
  treatmentsCloud.innerHTML = "";
  const list = TREATMENTS_BY_DOCTOR[selectedDoctor] || TREATMENTS_BY_DOCTOR["both"];
  
  list.forEach((treatment, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip-btn" + (idx === 0 ? " selected" : "");
    btn.innerHTML = `<i data-lucide="check" style="width:14px; height:14px; display:${idx === 0 ? 'inline' : 'none'}"></i> ${treatment}`;
    
    if (idx === 0) selectedTreatments = [treatment];

    btn.addEventListener("click", () => {
      // Toggle selection or single select
      treatmentsCloud.querySelectorAll(".chip-btn").forEach(b => {
        b.classList.remove("selected");
        const icon = b.querySelector("i");
        if (icon) icon.style.display = "none";
      });
      btn.classList.add("selected");
      const icon = btn.querySelector("i");
      if (icon) icon.style.display = "inline";

      selectedTreatments = [treatment];
      triggerAiReviewGeneration();
    });

    treatmentsCloud.appendChild(btn);
  });

  if (window.lucide) lucide.createIcons();
}

// 4. Highlight Tags
function setupHighlightTags() {
  highlightBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("selected");
      const tag = btn.dataset.tag;
      if (btn.classList.contains("selected")) {
        if (!selectedHighlights.includes(tag)) selectedHighlights.push(tag);
      } else {
        selectedHighlights = selectedHighlights.filter(t => t !== tag);
      }
      triggerAiReviewGeneration();
    });
  });
}

// 5. Smart AI Generator (Free Online API + Robust Local Human Engine)
async function triggerAiReviewGeneration() {
  aiShimmer.classList.add("loading");
  reviewOptionsContainer.innerHTML = "";

  const docName = selectedDoctor === "dr-vijay" 
    ? "Dr. G. Vijay Kumar" 
    : selectedDoctor === "dr-devipriya" 
    ? "Dr. Y. Devi Priya" 
    : "Dr. Vijay Kumar & Dr. Devi Priya";

  const treatName = selectedTreatments[0] || "treatment";
  const highText = selectedHighlights.join(", ") || "patient and caring";

  // Generate 3 Local Options Instantly
  const randDetailed = HUMAN_REVIEW_TEMPLATES.detailed[Math.floor(Math.random() * HUMAN_REVIEW_TEMPLATES.detailed.length)](docName, treatName, highText);
  const randWarm = HUMAN_REVIEW_TEMPLATES.warm[Math.floor(Math.random() * HUMAN_REVIEW_TEMPLATES.warm.length)](docName, treatName, highText);
  const randShort = HUMAN_REVIEW_TEMPLATES.short[Math.floor(Math.random() * HUMAN_REVIEW_TEMPLATES.short.length)](docName, treatName, highText);

  generatedOptions = [
    { title: "Detailed & Professional", text: randDetailed, type: "detailed" },
    { title: "Warm & Conversational", text: randWarm, type: "warm" },
    { title: "Short & Punchy", text: randShort, type: "short" }
  ];

  // Optional: Background query to Pollinations free AI API for a fresh creative sentence
  try {
    const prompt = `Write a short 2-sentence natural 5-star patient review for Pulse Health Clinic in Madhapur Hyderabad consulting ${docName} for ${treatName}. Sound like a real person.`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s max

    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const aiText = await res.text();
      if (aiText && aiText.trim().length > 25 && !aiText.includes("I cannot")) {
        // Replace Option 2 with the fresh AI variation!
        generatedOptions[1] = { title: "AI Generated • Natural", text: aiText.trim(), type: "ai-live" };
      }
    }
  } catch (err) {
    // Graceful fallback to our local engine
  }

  aiShimmer.classList.remove("loading");
  renderGeneratedCards();
}

function renderGeneratedCards() {
  reviewOptionsContainer.innerHTML = "";

  generatedOptions.forEach((opt, idx) => {
    const card = document.createElement("div");
    card.className = "review-option-card" + (idx === 0 ? " selected" : "");
    card.innerHTML = `
      <div class="option-tag"><i data-lucide="sparkles" style="width:12px; height:12px;"></i> ${opt.title}</div>
      <div class="option-text">"${opt.text}"</div>
    `;

    if (idx === 0) {
      selectedReviewText = opt.text;
      customReviewText.value = opt.text;
    }

    card.addEventListener("click", () => {
      reviewOptionsContainer.querySelectorAll(".review-option-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedReviewText = opt.text;
      customReviewText.value = opt.text;
    });

    reviewOptionsContainer.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

// Regenerate fresh options
regenerateBtn.addEventListener("click", () => {
  triggerAiReviewGeneration();
});

// Custom textarea editing updates selected text
customReviewText.addEventListener("input", (e) => {
  selectedReviewText = e.target.value;
});

// 6. Copy and Open Google Reviews (The Core Conversion Action)
function setupCopyAndRedirect() {
  copyGoogleBtn.addEventListener("click", async () => {
    const textToCopy = customReviewText.value.trim() || selectedReviewText;

    if (!textToCopy) {
      alert("Please select or write a review before copying!");
      return;
    }

    // Try modern clipboard API
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copied = true;
      } catch (e) {
        copied = fallbackCopy(textToCopy);
      }
    } else {
      copied = fallbackCopy(textToCopy);
    }

    // Show visual confirmation
    postCopyAlert.classList.add("show");
    copyGoogleBtn.innerHTML = `<i data-lucide="check-circle" style="width:20px;height:20px;"></i> Review Copied! Opening Google...`;
    copyGoogleBtn.style.background = "#059669";
    if (window.lucide) lucide.createIcons();

    // Trigger subtle confetti celebration if available
    triggerConfetti();

    // Open Google Review box after 800ms
    setTimeout(() => {
      window.open(GOOGLE_REVIEW_URL, "_blank");
      // Reset button text after 4s
      setTimeout(() => {
        copyGoogleBtn.innerHTML = `<i data-lucide="copy" style="width:20px;height:20px;"></i> Copy Review & Open Google Reviews`;
        copyGoogleBtn.style.background = "";
        if (window.lucide) lucide.createIcons();
      }, 4000);
    }, 800);
  });
}

function fallbackCopy(text) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    return false;
  }
}

// 7. Confetti Effect on Copy
function triggerConfetti() {
  const colors = ['#0FB5A2', '#FBBF24', '#10B981', '#0B2545', '#3B82F6'];
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = (window.innerWidth / 2 + (Math.random() * 200 - 100)) + 'px';
    confetti.style.top = (window.innerHeight / 2) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.zIndex = '99999';
    confetti.style.pointerEvents = 'none';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
    document.body.appendChild(confetti);

    const destX = (Math.random() - 0.5) * 400;
    const destY = -Math.random() * 350 - 50;

    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720}deg) scale(${Math.random() * 1.5 + 0.5})`;
      confetti.style.opacity = '0';
    });

    setTimeout(() => confetti.remove(), 1200);
  }
}

// 8. Standee & QR Code Generator
function setupStandeeModal() {
  const openBtn = document.getElementById("openStandeeBtn");
  const closeBtn = document.getElementById("closeStandeeBtn");
  const modal = document.getElementById("standeeModal");
  const standeeUrlInput = document.getElementById("standeeUrlInput");
  const printStandeeBtn = document.getElementById("printStandeeBtn");
  const downloadQrBtn = document.getElementById("downloadQrBtn");
  const qrContainer = document.getElementById("qrcodeCanvas");

  // Default target URL is this current page URL or fallback
  const currentUrl = window.location.href.split('?')[0] || "https://thepulseclinic.com/review/";
  standeeUrlInput.value = currentUrl;

  function renderQR(url) {
    // Generate clean high-contrast SVG QR Code via Google Charts API or inline SVG fallback
    qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}&margin=1" alt="Pulse Clinic Review QR" style="width:100%; height:100%; border-radius:8px; display:block;">`;
  }

  renderQR(currentUrl);

  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  standeeUrlInput.addEventListener("input", (e) => {
    const url = e.target.value.trim() || currentUrl;
    renderQR(url);
  });

  printStandeeBtn.addEventListener("click", () => {
    window.print();
  });

  downloadQrBtn.addEventListener("click", () => {
    const img = qrContainer.querySelector("img");
    if (img) {
      const link = document.createElement("a");
      link.href = img.src;
      link.download = "pulse-clinic-review-qr.png";
      link.target = "_blank";
      link.click();
    }
  });
}
