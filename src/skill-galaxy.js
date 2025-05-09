// SKILL GALAXY / CLUSTER MAP - JS

const GALAXY_CATEGORIES = [
  {
    name: 'Languages',
    color: '#f89820',
    skills: [
      { icon: 'fab fa-java', color: '#f89820', name: 'Java', desc: 'OOP & Backend' },
      { icon: 'fab fa-python', color: '#ffd43b', name: 'Python', desc: 'ML & Scripting' },
      { icon: 'fas fa-code', color: '#00599C', name: 'C/C++', desc: 'Systems & Competitive' },
      { icon: 'fas fa-database', color: '#336791', name: 'SQL (Postgres)', desc: 'Databases' },
      { icon: 'fab fa-js', color: '#f7df1e', name: 'JavaScript', desc: 'ES6+ & Web' },
      { icon: 'fab fa-html5', color: '#e34c26', name: 'HTML/CSS', desc: 'Web Layout' },
      { icon: 'fab fa-r-project', color: '#276dc3', name: 'R', desc: 'Statistics & Data Science' },
      { icon: 'fab fa-golang', color: '#00ADD8', name: 'Go', desc: 'Concurrent Programming' },
      { icon: 'fab fa-php', color: '#777bb4', name: 'PHP', desc: 'Web & Backend' },
    ]
  },
  {
    name: 'Frameworks',
    color: '#61dafb',
    skills: [
      { icon: 'fab fa-react', color: '#61dafb', name: 'React', desc: 'Frontend' },
      { icon: 'fab fa-node-js', color: '#8cc84b', name: 'Node.js', desc: 'Backend & APIs' },
      { icon: 'fab fa-python', color: '#ffd43b', name: 'Flask', desc: 'Python Web' },
      { icon: 'fas fa-vial', color: '#25a162', name: 'JUnit', desc: 'Java Testing' },
      { icon: 'fab fa-wordpress', color: '#21759b', name: 'WordPress', desc: 'CMS & Themes' },
      { icon: 'fas fa-layer-group', color: '#2196f3', name: 'Material-UI', desc: 'Design Systems' },
      { icon: 'fas fa-bolt', color: '#06d6a0', name: 'FastAPI', desc: 'Python APIs' },
    ]
  },
  {
    name: 'Developer Tools',
    color: '#2496ed',
    skills: [
      { icon: 'fab fa-git-alt', color: '#f34f29', name: 'Git', desc: 'Version Control' },
      { icon: 'fab fa-docker', color: '#2496ed', name: 'Docker', desc: 'Containers' },
      { icon: 'fas fa-cogs', color: '#3eaaaf', name: 'TravisCI', desc: 'CI/CD' },
      { icon: 'fab fa-google', color: '#4285f4', name: 'Google Cloud Platform', desc: 'Cloud Services' },
      { icon: 'fas fa-code', color: '#0078d7', name: 'VS Code', desc: 'Editor' },
      { icon: 'fab fa-windows', color: '#00adef', name: 'Visual Studio', desc: 'IDE' },
      { icon: 'fas fa-fire', color: '#21d789', name: 'PyCharm', desc: 'Python IDE' },
      { icon: 'fas fa-lightbulb', color: '#f44336', name: 'IntelliJ', desc: 'Java IDE' },
      { icon: 'fas fa-desktop', color: '#2c2255', name: 'Eclipse', desc: 'Java IDE' },
    ]
  },
  {
    name: 'Libraries',
    color: '#e70488',
    skills: [
      { icon: 'fas fa-table', color: '#e70488', name: 'pandas', desc: 'Data Analysis' },
      { icon: 'fas fa-calculator', color: '#4b8bbe', name: 'NumPy', desc: 'Numerical Computing' },
      { icon: 'fas fa-chart-bar', color: '#ffa500', name: 'Matplotlib', desc: 'Visualization' },
    ]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const section = document.querySelector('.skill-galaxy-section');
  if (!section) return;

  // Add animated background
  const bg = document.createElement('div');
  bg.className = 'skill-galaxy-bg';
  section.appendChild(bg);

  // Layout clusters in a circle
  const center = { x: section.offsetWidth / 2, y: section.offsetHeight / 2 };
  const clusterRadius = Math.min(section.offsetWidth, section.offsetHeight) / 2.2;
  const clusterCount = GALAXY_CATEGORIES.length;
  const clusterAngleStep = (2 * Math.PI) / clusterCount;

  GALAXY_CATEGORIES.forEach((cat, i) => {
    // Cluster (planet)
    const angle = i * clusterAngleStep - Math.PI / 2;
    const cx = center.x + clusterRadius * Math.cos(angle);
    const cy = center.y + clusterRadius * Math.sin(angle);
    const cluster = document.createElement('div');
    cluster.className = 'skill-galaxy-cluster';
    cluster.style.setProperty('--cluster-color', cat.color);
    cluster.style.left = (cx - 90) + 'px';
    cluster.style.top = (cy - 90) + 'px';
    // Label
    const label = document.createElement('div');
    label.className = 'skill-galaxy-cluster-label';
    label.textContent = cat.name;
    cluster.appendChild(label);
    // Orbit container
    const orbit = document.createElement('div');
    orbit.className = 'skill-galaxy-orbit';
    cluster.appendChild(orbit);
    // Place skills in orbit
    const skillCount = cat.skills.length;
    const skillAngleStep = (2 * Math.PI) / skillCount;
    cat.skills.forEach((skill, j) => {
      const skillAngle = j * skillAngleStep;
      const r = 130;
      const sx = 160 + r * Math.cos(skillAngle);
      const sy = 160 + r * Math.sin(skillAngle);
      const skillNode = document.createElement('div');
      skillNode.className = 'skill-galaxy-skill';
      skillNode.style.setProperty('--skill-color', skill.color);
      skillNode.style.left = sx + 'px';
      skillNode.style.top = sy + 'px';
      skillNode.innerHTML = `<i class="${skill.icon}"></i><div class="skill-galaxy-skill-label">${skill.name}</div>`;
      // Show detail card on click
      skillNode.addEventListener('click', function(e) {
        e.stopPropagation();
        showDetailCard(skill, cat);
      });
      orbit.appendChild(skillNode);
    });
    section.appendChild(cluster);
  });

  // Floating detail card
  function showDetailCard(skill, cat) {
    // Remove any existing
    document.querySelectorAll('.skill-galaxy-detail-card').forEach(e => e.remove());
    const card = document.createElement('div');
    card.className = 'skill-galaxy-detail-card';
    card.innerHTML = `
      <span class="skill-galaxy-detail-close">&times;</span>
      <div style="font-size:2.5rem;margin-bottom:12px;color:${skill.color}"><i class="${skill.icon}"></i></div>
      <div style="font-size:1.3rem;font-weight:700;margin-bottom:8px;">${skill.name}</div>
      <div style="font-size:1.05rem;opacity:0.85;">${skill.desc}</div>
      <div style="margin-top:18px;font-size:0.95rem;opacity:0.7;">${cat.name}</div>
    `;
    card.querySelector('.skill-galaxy-detail-close').onclick = () => card.remove();
    document.body.appendChild(card);
  }

  // Responsive: re-layout on resize
  window.addEventListener('resize', () => location.reload());
}); 