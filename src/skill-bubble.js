// FRUTIGER AERO SKILL BUBBLE CLOUD - JS

const BUBBLE_SKILLS = [
  // Languages
  { icon: 'fab fa-java', color: '#f89820', name: 'Java', desc: 'OOP & Backend' },
  { icon: 'fab fa-python', color: '#ffd43b', name: 'Python', desc: 'ML & Scripting' },
  { icon: 'fas fa-code', color: '#00599C', name: 'C/C++', desc: 'Systems & Competitive' },
  { icon: 'fas fa-database', color: '#336791', name: 'SQL (Postgres)', desc: 'Databases' },
  { icon: 'fab fa-js', color: '#f7df1e', name: 'JavaScript', desc: 'ES6+ & Web' },
  { icon: 'fab fa-html5', color: '#e34c26', name: 'HTML/CSS', desc: 'Web Layout' },
  { icon: 'fab fa-r-project', color: '#276dc3', name: 'R', desc: 'Statistics & Data Science' },
  { icon: 'fab fa-golang', color: '#00ADD8', name: 'Go', desc: 'Concurrent Programming' },
  { icon: 'fab fa-php', color: '#777bb4', name: 'PHP', desc: 'Web & Backend' },
  // Frameworks
  { icon: 'fab fa-react', color: '#61dafb', name: 'React', desc: 'Frontend' },
  { icon: 'fab fa-node-js', color: '#8cc84b', name: 'Node.js', desc: 'Backend & APIs' },
  { icon: 'fab fa-python', color: '#ffd43b', name: 'Flask', desc: 'Python Web' },
  { icon: 'fas fa-vial', color: '#25a162', name: 'JUnit', desc: 'Java Testing' },
  { icon: 'fab fa-wordpress', color: '#21759b', name: 'WordPress', desc: 'CMS & Themes' },
  { icon: 'fas fa-layer-group', color: '#2196f3', name: 'Material-UI', desc: 'Design Systems' },
  { icon: 'fas fa-bolt', color: '#06d6a0', name: 'FastAPI', desc: 'Python APIs' },
  // Developer Tools
  { icon: 'fab fa-git-alt', color: '#f34f29', name: 'Git', desc: 'Version Control' },
  { icon: 'fab fa-docker', color: '#2496ed', name: 'Docker', desc: 'Containers' },
  { icon: 'fas fa-cogs', color: '#3eaaaf', name: 'TravisCI', desc: 'CI/CD' },
  { icon: 'fab fa-google', color: '#4285f4', name: 'Google Cloud Platform', desc: 'Cloud Services' },
  { icon: 'fas fa-code', color: '#0078d7', name: 'VS Code', desc: 'Editor' },
  { icon: 'fab fa-windows', color: '#00adef', name: 'Visual Studio', desc: 'IDE' },
  { icon: 'fas fa-fire', color: '#21d789', name: 'PyCharm', desc: 'Python IDE' },
  { icon: 'fas fa-lightbulb', color: '#f44336', name: 'IntelliJ', desc: 'Java IDE' },
  { icon: 'fas fa-desktop', color: '#2c2255', name: 'Eclipse', desc: 'Java IDE' },
  // Libraries
  { icon: 'fas fa-table', color: '#e70488', name: 'pandas', desc: 'Data Analysis' },
  { icon: 'fas fa-calculator', color: '#4b8bbe', name: 'NumPy', desc: 'Numerical Computing' },
  { icon: 'fas fa-chart-bar', color: '#ffa500', name: 'Matplotlib', desc: 'Visualization' },
];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

document.addEventListener('DOMContentLoaded', function() {
  const section = document.querySelector('.skill-bubble-section');
  if (!section) return;

  // Add animated background
  const bg = document.createElement('div');
  bg.className = 'skill-bubble-bg';
  section.appendChild(bg);

  // Add bokeh orbs
  for (let i = 0; i < 12; ++i) {
    const orb = document.createElement('div');
    orb.className = 'skill-bubble-bokeh';
    orb.style.width = orb.style.height = randomBetween(80, 220) + 'px';
    orb.style.left = randomBetween(0, 90) + '%';
    orb.style.top = randomBetween(0, 80) + '%';
    orb.style.background = `radial-gradient(circle, #fff8 0%, #aee9f7 80%, transparent 100%)`;
    orb.style.animation = `bokeh-float-${i} ${randomBetween(8, 18)}s ease-in-out infinite alternate`;
    bg.appendChild(orb);
    // Add keyframes for each orb
    const style = document.createElement('style');
    style.innerHTML = `@keyframes bokeh-float-${i} { 0% { transform: translateY(0); } 100% { transform: translateY(${randomBetween(-40, 40)}px); } }`;
    document.head.appendChild(style);
  }

  // Bubble cloud
  const cloud = document.createElement('div');
  cloud.className = 'skill-bubble-cloud';
  section.appendChild(cloud);

  // Place bubbles randomly, animate float
  const width = cloud.offsetWidth || 900;
  const height = cloud.offsetHeight || 500;
  BUBBLE_SKILLS.forEach((skill, i) => {
    const bubble = document.createElement('div');
    bubble.className = 'skill-bubble';
    bubble.style.setProperty('--bubble-color', skill.color);
    // Random position (avoid edges)
    const x = randomBetween(10, 80);
    const y = randomBetween(10, 70);
    bubble.style.left = x + '%';
    bubble.style.top = y + '%';
    // Animate float
    bubble.style.animation = `bubble-float-${i} ${randomBetween(7, 16)}s ease-in-out infinite alternate`;
    const style = document.createElement('style');
    style.innerHTML = `@keyframes bubble-float-${i} { 0% { transform: translateY(0); } 100% { transform: translateY(${randomBetween(-30, 30)}px); } }`;
    document.head.appendChild(style);
    // Content
    bubble.innerHTML = `<div class="skill-bubble-icon" style="color:${skill.color}"><i class="${skill.icon}"></i></div><div class="skill-bubble-label">${skill.name}</div>`;
    // Show detail card on click
    bubble.addEventListener('click', function(e) {
      e.stopPropagation();
      showDetailCard(skill);
    });
    cloud.appendChild(bubble);
  });

  // Floating detail card
  function showDetailCard(skill) {
    // Remove any existing
    document.querySelectorAll('.skill-bubble-detail-card').forEach(e => e.remove());
    const card = document.createElement('div');
    card.className = 'skill-bubble-detail-card';
    card.innerHTML = `
      <span class="skill-bubble-detail-close">&times;</span>
      <div style="font-size:2.5rem;margin-bottom:12px;color:${skill.color}"><i class="${skill.icon}"></i></div>
      <div style="font-size:1.3rem;font-weight:700;margin-bottom:8px;">${skill.name}</div>
      <div style="font-size:1.05rem;opacity:0.85;">${skill.desc}</div>
    `;
    card.querySelector('.skill-bubble-detail-close').onclick = () => card.remove();
    document.body.appendChild(card);
  }

  // Responsive: re-layout on resize
  window.addEventListener('resize', () => location.reload());
}); 