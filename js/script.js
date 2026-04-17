/* =====================================================
   PORTFOLIO — script.js
   Core logic: typing, modal, project filter, form
   ===================================================== */

/* ---- Typing Animation ---- */
const roles = [
  'Digital Marketing & Seo',
  'AI Full Stack Dev',
  'WCMS Expert',
  'Responsive UI/UX Designer'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
  if (!typingEl) return;
  const current = roles[roleIndex];

  if (isDeleting) {
    typingEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 400);
      return;
    }
    setTimeout(typeEffect, 60);
  } else {
    typingEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
    setTimeout(typeEffect, 90);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initData();
    typeEffect();
  }, 200);
});

/* ---- Dynamic Data Loaders ---- */
function loadAdminProjects() {
  try {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) return JSON.parse(saved);
  } catch(e) { console.error('Project data load error:', e); }
  return [];
}

function loadAdminSkills() {
  try {
    const saved = localStorage.getItem('portfolio_skills');
    if (saved) return JSON.parse(saved);
  } catch(e) { console.error('Skills data load error:', e); }
  return [];
}

function loadAdminProfile() {
  try {
    const saved = localStorage.getItem('portfolio_profile');
    if (saved) return JSON.parse(saved);
  } catch(e) { console.error('Profile data load error:', e); }
  return {};
}

// Load data at runtime
let projectData = [];
let skillData = [];
let profileData = {};

function initData() {
  projectData = loadAdminProjects();
  skillData = loadAdminSkills();
  profileData = loadAdminProfile();
  
  // Fallback: if no admin data, use defaults
  if (!projectData.length) {
    projectData = [
      {
        id: 1, icon: 'fab fa-whatsapp', category: 'automation',
        title: 'WhatsApp Automation System', tags: ['Python', 'Selenium', 'Automation'],
        desc: 'Python-based WhatsApp automation tool.',
        features: ['Bulk messaging', 'Scheduling', 'Contact management'],
        github: '#', demo: 'https://codey-saroj.github.io/Whatsapp-automation-sytem/', image: 'assets/images/project2.jpg'
      },
      {
        id: 2, icon: 'fas fa-graduation-cap', category: 'web',
        title: 'Proyog Yoga', tags: ['React', 'Node.js', 'Booking'],
        desc: 'Full-stack yoga booking platform with class scheduling, instructor profiles, and user management.',
        features: ['Class scheduling', 'Instructor profiles', 'Online payments', 'User management'],
        github: '#', demo: 'https://codey-saroj.github.io/Proyog-Yoga/', image: 'assets/images/project3.jpg'
      },
      {
        id: 3, icon: 'fas fa-graduation-cap', category: 'web',
        title: 'Sahkausal-Learning', tags: ['React', 'Node.js', 'MongoDB'],
        desc: 'E-learning platform with pears integration.',
        features: ['Interactive courses', 'Progress tracking'],
        github: '#', demo: 'https://codey-saroj.github.io/Sahkausal-Website/#', image: 'assets/images/project33.jpg'
      },
      {
        id: 4, icon: 'fas fa-map-marked-alt', category: 'web',
        title: 'Incredible India', tags: ['React', 'Node.js', 'Maps API'],
        desc: 'Travel guide with itinerary generation.',
        features: ['Interactive map', 'Itinerary generator'],
        github: '#', demo: '#', image: 'assets/images/project4.jpg'
      }
    ];
  }
  
  renderProjects();
  loadProfileData();
}

/* ---- Open Modal (fixed for raw icon class) ---- */
window.openModal = function (index) {
  const p = projectData[index];
  if (!p) return;

  // Handle raw icon class from admin (e.g. "fab fa-whatsapp")
  const iconEl = document.getElementById('modalIcon');
  iconEl.innerHTML = `<i class="${p.icon}"></i>`;

  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;

  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

  const featuresEl = document.getElementById('modalFeatures');
  featuresEl.innerHTML = `
    <ul>
      ${(p.features || []).map(f => `<li><i class="fas fa-check-circle"></i><span>${f}</span></li>`).join('')}
    </ul>
  `;

  document.getElementById('modalLinks').innerHTML = `
    <a href="${p.github || '#'}" class="btn-project btn-github" target="_blank"><i class="fab fa-github"></i> GitHub</a>
    <a href="${p.demo || '#'}" class="btn-project btn-demo" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

/* ---- Close Modal ---- */
window.closeModal = function () {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ---- Render Dynamic Projects ---- */
function renderProjects() {
  const container = document.getElementById('dynamicProjectsGrid');
  if (!container) return;
  
  if (!projectData.length) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)"><i class="fas fa-folder-open" style="font-size:4rem;opacity:0.5;margin-bottom:20px;display:block"></i><h3>No Projects Yet</h3><p>Check admin panel to add projects.</p></div>';
    return;
  }

  container.innerHTML = projectData.map((p, index) => {
    const tagsPreview = (p.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');
    const safeIcon = p.icon || 'fas fa-folder';
    const imgContent = p.image ? `<img src="${p.image}" alt="${p.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="project-img-placeholder"><i class="${safeIcon}"></i></div>` : `<div class="project-img-placeholder"><i class="${safeIcon}"></i></div>`;
    
    return `
      <div class="project-card reveal-up" data-category="${p.category || 'web'}" data-project="${index}" style="--delay:${0.1 + index * 0.1}s">
        <div class="project-img-wrap">
          ${imgContent}
          <div class="project-overlay">
            <button class="btn-modal" onclick="openModal(${index})">View Details</button>
          </div>
        </div>
        <div class="project-body">
          <div class="project-tags">
            ${tagsPreview}
          </div>
          <h3 class="project-title">${p.title || 'Untitled'}</h3>
          <p class="project-desc">${p.desc || 'No description available.'}</p>
          <div class="project-links">
            <a href="${p.github || '#'}" class="btn-project btn-github" target="_blank"><i class="fab fa-github"></i> GitHub</a>
            <a href="${p.demo || '#'}" class="btn-project btn-demo" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-attach filter after render
  setTimeout(attachFilters, 100);
}

function attachFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = null; // Clear existing
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ---- Profile Data ---- */
function loadProfileData() {
  const stats = document.querySelectorAll('.stat-num');
  if (stats.length >= 3 && profileData.statProjects && profileData.statTech && profileData.statYears) {
    stats[0].textContent = profileData.statProjects;
    stats[1].textContent = profileData.statTech;
    stats[2].textContent = profileData.statYears;
  }
}

/* ---- Contact Form Validation ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset errors
    ['name', 'email', 'message'].forEach(id => {
      document.getElementById(id).classList.remove('error');
      const err = document.getElementById(id + 'Error');
      if (err) err.textContent = '';
    });

    if (!name.value.trim()) {
      name.classList.add('error');
      document.getElementById('nameError').textContent = 'Please enter your name.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      email.classList.add('error');
      document.getElementById('emailError').textContent = 'Please enter a valid email.';
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 20) {
      message.classList.add('error');
      document.getElementById('messageError').textContent = 'Message must be at least 20 characters.';
      valid = false;
    }

    if (valid) {
      const btn = document.getElementById('submitBtn');
      btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      // Simulate send delay (replace with real API call)
      setTimeout(() => {
        form.reset();
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        const success = document.getElementById('formSuccess');
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }, 1500);
    }
  });
}

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1600);
});


