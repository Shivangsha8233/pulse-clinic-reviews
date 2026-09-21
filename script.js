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
let selectedHighlights = ["Very patient & gentle", "Painless procedure"];
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

// Dynamic Highlight Tags based on Star Rating
const HIGHLIGHTS_CONFIG = {
  positive: [
    { tag: "Very patient & gentle", label: "Gentle & Patient" },
    { tag: "Painless procedure", label: "Painless procedure" },
    { tag: "Clean & hygienic clinic", label: "Clean & hygienic clinic" },
    { tag: "Great visible results", label: "Great visible results" },
    { tag: "Transparent pricing", label: "Affordable & transparent" },
    { tag: "Zero waiting time", label: "Zero waiting time" }
  ],
  critical: [
    { tag: "Long waiting time", label: "Long waiting time" },
    { tag: "Rushed consultation", label: "Rushed consultation" },
    { tag: "Reception delay", label: "Reception delay" },
    { tag: "Scheduling confusion", label: "Scheduling confusion" },
    { tag: "Average results", label: "Average results" },
    { tag: "Could explain better", label: "Could explain better" }
  ]
};

// Comprehensive Local Human Templates for ALL Ratings (1 to 5 Stars)
const HUMAN_REVIEW_TEMPLATES = {
  5: {
    detailed: [
      (doc, treat, high) => `Visited Pulse Health Clinic in Madhapur for ${treat}. ${doc === 'Dr. G. Vijay Kumar' ? 'Dr. Vijay Kumar' : doc === 'Dr. Y. Devi Priya' ? 'Dr. Devi Priya' : 'The doctors'} took the time to explain everything thoroughly before starting. The procedure was done with utmost care and the clinic hygiene standards are exceptional. Very satisfied with the treatment results and clear post-care advice!`,
      (doc, treat, high) => `Had an appointment at Pulse Health Clinic near Ayyappa Society, Madhapur for ${treat}. ${doc} is exceptionally skilled and made me feel completely comfortable. What stood out most was how ${high.toLowerCase()} they were throughout. The staff is polite, and the consultation was completely transparent with no unnecessary tests. Highly recommend!`,
      (doc, treat, high) => `I had been looking for a dependable clinic in Madhapur for ${treat} and found Pulse Health Clinic. ${doc} was wonderful—very professional, calm, and addressed every trivial question I had. The procedure went smoothly and recovery was rapid. Truly one of the best clinics in the Hitec City area.`
    ],
    warm: [
      (doc, treat, high) => `Really pleased with my visit to Pulse Clinic! Consulted ${doc} for ${treat}. Doctor is so gentle and patient, and the treatment was virtually painless. The clinic is sparkling clean and very well organized. Thank you doctor and staff for the wonderful care! 😊`,
      (doc, treat, high) => `Super happy with the results of my ${treat} at Pulse Health Clinic! ${doc} is one of the most polite and caring doctors I've met in Hyderabad. The treatment was seamless and the results speak for themselves. 5 stars all the way!`,
      (doc, treat, high) => `Great experience at Pulse Clinic Madhapur! Consulted ${doc} for ${treat}. Right from reception to doctor consultation, everything was smooth. Doctor explained the cause and solution very calmly without rushing. Truly appreciate the genuine care.`
    ],
    short: [
      (doc, treat, high) => `Best clinic in Madhapur! Consulted ${doc} for ${treat}—very smooth and professional. Highly recommended.`,
      (doc, treat, high) => `Excellent care by ${doc} for ${treat} at Pulse Health Clinic. Clean premises, friendly staff, and great results!`,
      (doc, treat, high) => `5/5 stars for ${doc}! Got ${treat} done here. Professional, transparent, and completely comfortable.`
    ]
  },
  4: {
    detailed: [
      (doc, treat, high) => `Consulted ${doc} at Pulse Health Clinic for ${treat}. The doctor is very experienced, answered all my questions calmly, and the treatment was handled well. There was a slight wait past my appointment time, but overall very happy with the clinical care and guidance.`,
      (doc, treat, high) => `Visited Pulse Clinic in Madhapur for ${treat}. ${doc} provided very clear diagnosis and treatment options without pushing unnecessary procedures. The clinic is clean and well-kept. Giving 4 stars only due to a minor delay at reception.`
    ],
    warm: [
      (doc, treat, high) => `Good experience at Pulse Health Clinic with ${doc} for ${treat}. The doctor is polite and reassuring. Treatment went smoothly and post-care was clearly explained. Definitely recommend visiting!`,
      (doc, treat, high) => `Had a pleasant consultation with ${doc} regarding ${treat}. Staff was courteous and the facility is modern. Just wish the waiting time was a bit shorter, but the medical treatment itself was 5-star quality.`
    ],
    short: [
      (doc, treat, high) => `4/5 stars. Good diagnosis and treatment by ${doc} at Pulse Health Clinic. Clean setup and quality care.`,
      (doc, treat, high) => `Solid experience with ${doc} for ${treat}. Professional doctors and good hygiene.`
    ]
  },
  3: {
    detailed: [
      (doc, treat, high) => `Visited Pulse Health Clinic for ${treat}. Consulted ${doc}, who gave sound medical advice and knows their field. However, had to wait nearly 40 minutes past my appointment time. An average overall experience, though the doctor is qualified.`,
      (doc, treat, high) => `The consultation with ${doc} for ${treat} was okay. While the doctor answered basic questions, the visit felt somewhat rushed due to the rush of patients. Average experience overall, clinic needs better scheduling.`
    ],
    warm: [
      (doc, treat, high) => `Decent experience consulting ${doc} for ${treat}. The clinic was clean and the doctor was courteous, but reception coordination and waiting time management could definitely be improved. 3 stars.`,
      (doc, treat, high) => `Treatment for ${treat} was fine, but expected a bit more detailed explanation from ${doc}. It was an okay visit, neither bad nor exceptional.`
    ],
    short: [
      (doc, treat, high) => `Fair experience for ${treat}. Doctor consultation was okay, but wait time was longer than expected. 3 stars.`,
      (doc, treat, high) => `Average visit at Pulse Clinic. Qualified doctors but front desk and time management need work.`
    ]
  },
  2: {
    detailed: [
      (doc, treat, high) => `Booked an appointment with ${doc} at Pulse Clinic for ${treat}. Unfortunately, had to wait over 45 minutes and the consultation felt hurried once inside. Felt like my concerns about ${high.toLowerCase()} weren't fully addressed for the fee charged.`,
      (doc, treat, high) => `Disappointed with the visit to Pulse Clinic Madhapur. Consulted ${doc} for ${treat}, but there was lack of proper coordination and the doctor spent barely a few minutes before moving to the next patient.`
    ],
    warm: [
      (doc, treat, high) => `Not very satisfied with my visit for ${treat}. Despite booking in advance, there was significant delay and the staff was unhelpful. ${doc} seemed preoccupied and didn't explain the procedure clearly.`,
      (doc, treat, high) => `Expected a much better experience at Pulse Health Clinic. The consultation for ${treat} was rushed and post-treatment guidance was minimal. 2 stars.`
    ],
    short: [
      (doc, treat, high) => `2 stars. Long waiting time and hurried consultation with ${doc} for ${treat}. Needs better patient management.`,
      (doc, treat, high) => `Disappointing visit. Poor scheduling and rushed consultation for ${treat} at Pulse Clinic.`
    ]
  },
  1: {
    detailed: [
      (doc, treat, high) => `Very frustrating experience at Pulse Health Clinic for ${treat}. Waited for over an hour despite a confirmed appointment slot. When finally seen by ${doc}, the consultation was completed in under three minutes with no proper examination. Would not recommend.`,
      (doc, treat, high) => `Terrible experience at Pulse Clinic Madhapur. Came for ${treat} with ${doc}. Staff was completely indifferent to delays and the doctor was dismissive of questions. Needs serious overhaul in patient service.`
    ],
    warm: [
      (doc, treat, high) => `Extremely disappointed with my visit to Pulse Clinic for ${treat}. The reception was unprofessional, scheduling was completely chaotic, and the consultation with ${doc} lacked empathy or care. Very bad experience.`,
      (doc, treat, high) => `Had a very bad visit for ${treat}. Zero respect for patients' time and doctor was dismissive. Will not be returning to Pulse Health Clinic.`
    ],
    short: [
      (doc, treat, high) => `1 star. Very poor experience with appointment delays and uncoordinated staff for ${treat}.`,
      (doc, treat, high) => `Extremely disappointed. Waited over an hour and received a rushed consultation with ${doc}.`
    ]
  }
};

// DOM Elements
const stars = document.querySelectorAll(".star-btn");
const ratingStatusText = document.getElementById("ratingStatusText");
const starRatingBox = document.getElementById("starRatingBox");
const positiveWizard = document.getElementById("positiveWizard");
const privateFeedbackBox = document.getElementById("privateFeedbackBox");
const doctorCards = document.querySelectorAll(".doctor-card");
const treatmentsCloud = document.getElementById("treatmentsCloud");
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
  renderHighlightTags();
  setupCopyAndRedirect();
  setupStandeeModal();
  triggerAiReviewGeneration();
});

// 1. Star Rating Logic
function setupStarRating() {
  const ratingLabels = {
    5: "🌟 5 Stars — Outstanding Experience!",
    4: "✨ 4 Stars — Very Good Experience!",
    3: "😐 3 Stars — Fair / Average Experience",
    2: "⚠️ 2 Stars — Needs Improvement",
    1: "❌ 1 Star — Disappointing Experience"
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

    // ALWAYS show the review builder for EVERY star (1, 2, 3, 4, 5)
    positiveWizard.classList.add("active");

    // For 1 to 3 stars, also show the private management card below as a direct option
    if (val <= 3) {
      privateFeedbackBox.classList.add("active");
    } else {
      privateFeedbackBox.classList.remove("active");
    }

    // Refresh highlights and generate tailored AI reviews for this exact star rating!
    renderHighlightTags();
    triggerAiReviewGeneration();
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

// 4. Dynamic Highlight Tags (Adapts to Star Rating)
function renderHighlightTags() {
  const container = document.querySelector(".chips-cloud");
  if (!container) return;

  container.innerHTML = "";
  const config = currentRating >= 4 ? HIGHLIGHTS_CONFIG.positive : HIGHLIGHTS_CONFIG.critical;
  selectedHighlights = [config[0].tag];

  config.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "highlight-btn" + (idx === 0 ? " selected" : "");
    btn.dataset.tag = item.tag;
    btn.textContent = item.label;

    btn.addEventListener("click", () => {
      btn.classList.toggle("selected");
      const tag = item.tag;
      if (btn.classList.contains("selected")) {
        if (!selectedHighlights.includes(tag)) selectedHighlights.push(tag);
      } else {
        selectedHighlights = selectedHighlights.filter(t => t !== tag);
      }
      triggerAiReviewGeneration();
    });

    container.appendChild(btn);
  });
}

// 5. Smart AI Generator (Free Online API + Robust Local Human Engine for ALL Stars)
async function triggerAiReviewGeneration() {
  aiShimmer.classList.add("loading");
  reviewOptionsContainer.innerHTML = "";

  const docName = selectedDoctor === "dr-vijay" 
    ? "Dr. G. Vijay Kumar" 
    : selectedDoctor === "dr-devipriya" 
    ? "Dr. Y. Devi Priya" 
    : "Dr. Vijay Kumar & Dr. Devi Priya";

  const treatName = selectedTreatments[0] || "treatment";
  const highText = selectedHighlights.join(", ") || (currentRating >= 4 ? "patient and caring" : "waiting time");

  // Get templates for the current star rating (1 to 5)
  const templates = HUMAN_REVIEW_TEMPLATES[currentRating] || HUMAN_REVIEW_TEMPLATES[5];

  const randDetailed = templates.detailed[Math.floor(Math.random() * templates.detailed.length)](docName, treatName, highText);
  const randWarm = templates.warm[Math.floor(Math.random() * templates.warm.length)](docName, treatName, highText);
  const randShort = templates.short[Math.floor(Math.random() * templates.short.length)](docName, treatName, highText);

  generatedOptions = [
    { title: `${currentRating}★ Detailed Review`, text: randDetailed, type: "detailed" },
    { title: `${currentRating}★ Conversational`, text: randWarm, type: "warm" },
    { title: `${currentRating}★ Short & Direct`, text: randShort, type: "short" }
  ];

  // Optional Live API: Query Pollinations free AI API for a fresh creative sentence matching THIS exact star rating
  try {
    const prompt = `Write a realistic, human-written ${currentRating}-star review (2-3 sentences) from a patient who visited Pulse Health Clinic in Madhapur Hyderabad consulting ${docName} for ${treatName}. The rating is ${currentRating} out of 5 stars. Keep tone natural, authentic, and reflect a genuine ${currentRating}-star experience without sounding robotic or fake.`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s max

    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const aiText = await res.text();
      if (aiText && aiText.trim().length > 25 && !aiText.includes("I cannot")) {
        // Clean any surrounding quotes
        let cleanText = aiText.trim().replace(/^["']|["']$/g, '');
        generatedOptions[1] = { title: `AI Generated • ${currentRating}★ Review`, text: cleanText, type: "ai-live" };
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

// 6. Copy and Open Google Reviews
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

    // Show visual confirmation with instructions tailored to the selected stars
    const alertDesc = postCopyAlert.querySelector("p");
    if (alertDesc) {
      alertDesc.innerHTML = `Google Reviews is opening. Just tap <strong>${currentRating} star${currentRating > 1 ? 's' : ''}</strong>, paste your review, and tap <strong>Post</strong>!`;
    }
    postCopyAlert.classList.add("show");
    copyGoogleBtn.innerHTML = `<i data-lucide="check-circle" style="width:20px;height:20px;"></i> Review Copied! Opening Google...`;
    copyGoogleBtn.style.background = "#059669";
    if (window.lucide) lucide.createIcons();

    // Trigger subtle confetti celebration on 4-5 stars
    if (currentRating >= 4) {
      triggerConfetti();
    }

    // Open Google Review box after 800ms
    setTimeout(() => {
      window.open(GOOGLE_REVIEW_URL, "_blank");
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

  const currentUrl = window.location.href.split('?')[0] || "https://thepulseclinic.com/review/";
  standeeUrlInput.value = currentUrl;

  function renderQR(url) {
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
