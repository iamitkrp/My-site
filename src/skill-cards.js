// INTERACTIVE SKILL CARDS GRID

const SKILL_CATEGORIES = [
  {
    name: 'Languages',
    skills: [
      { icon: 'fab fa-java', color: '#f89820', glow: '#f89820', name: 'Java', desc: 'OOP & Backend' },
      { icon: 'fab fa-python', color: '#ffd43b', glow: '#ffd43b', name: 'Python', desc: 'ML & Scripting' },
      { icon: 'fas fa-code', color: '#00599C', glow: '#00599C', name: 'C/C++', desc: 'Systems & Competitive' },
      { icon: 'fas fa-database', color: '#336791', glow: '#336791', name: 'SQL (Postgres)', desc: 'Databases' },
      { icon: 'fab fa-js', color: '#f7df1e', glow: '#f7df1e', name: 'JavaScript', desc: 'ES6+ & Web' },
      { icon: 'fab fa-html5', color: '#e34c26', glow: '#e34c26', name: 'HTML/CSS', desc: 'Web Layout' },
      { icon: 'fab fa-r-project', color: '#276dc3', glow: '#276dc3', name: 'R', desc: 'Statistics & Data Science' },
      { icon: 'fab fa-golang', color: '#00ADD8', glow: '#00ADD8', name: 'Go', desc: 'Concurrent Programming' },
      { icon: 'fab fa-php', color: '#777bb4', glow: '#777bb4', name: 'PHP', desc: 'Web & Backend' },
    ]
  },
  {
    name: 'Frameworks',
    skills: [
      { icon: 'fab fa-react', color: '#61dafb', glow: '#61dafb', name: 'React', desc: 'Frontend' },
      { icon: 'fab fa-node-js', color: '#8cc84b', glow: '#8cc84b', name: 'Node.js', desc: 'Backend & APIs' },
      { icon: 'fab fa-python', color: '#ffd43b', glow: '#ffd43b', name: 'Flask', desc: 'Python Web' },
      { icon: 'fas fa-vial', color: '#25a162', glow: '#25a162', name: 'JUnit', desc: 'Java Testing' },
      { icon: 'fab fa-wordpress', color: '#21759b', glow: '#21759b', name: 'WordPress', desc: 'CMS & Themes' },
      { icon: 'fas fa-layer-group', color: '#2196f3', glow: '#2196f3', name: 'Material-UI', desc: 'Design Systems' },
      { icon: 'fas fa-bolt', color: '#06d6a0', glow: '#06d6a0', name: 'FastAPI', desc: 'Python APIs' },
    ]
  },
  {
    name: 'Developer Tools',
    skills: [
      { icon: 'fab fa-git-alt', color: '#f34f29', glow: '#f34f29', name: 'Git', desc: 'Version Control' },
      { icon: 'fab fa-docker', color: '#2496ed', glow: '#2496ed', name: 'Docker', desc: 'Containers' },
      { icon: 'fas fa-cogs', color: '#3eaaaf', glow: '#3eaaaf', name: 'TravisCI', desc: 'CI/CD' },
      { icon: 'fab fa-google', color: '#4285f4', glow: '#4285f4', name: 'Google Cloud Platform', desc: 'Cloud Services' },
      { icon: 'fas fa-code', color: '#0078d7', glow: '#0078d7', name: 'VS Code', desc: 'Editor' },
      { icon: 'fab fa-windows', color: '#00adef', glow: '#00adef', name: 'Visual Studio', desc: 'IDE' },
      { icon: 'fas fa-fire', color: '#21d789', glow: '#21d789', name: 'PyCharm', desc: 'Python IDE' },
      { icon: 'fas fa-lightbulb', color: '#f44336', glow: '#f44336', name: 'IntelliJ', desc: 'Java IDE' },
      { icon: 'fas fa-desktop', color: '#2c2255', glow: '#f7941e', name: 'Eclipse', desc: 'Java IDE' },
    ]
  },
  {
    name: 'Libraries',
    skills: [
      { icon: 'fas fa-table', color: '#e70488', glow: '#e70488', name: 'pandas', desc: 'Data Analysis' },
      { icon: 'fas fa-calculator', color: '#4b8bbe', glow: '#4b8bbe', name: 'NumPy', desc: 'Numerical Computing' },
      { icon: 'fas fa-chart-bar', color: '#ffa500', glow: '#ffa500', name: 'Matplotlib', desc: 'Visualization' },
    ]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const section = document.querySelector('.skill-cards-section');
  if (!section) return;

  const tabsContainer = section.querySelector('.skill-cards-tabs');
  const gridContainer = section.querySelector('.skill-cards-grid');

  let currentCategory = 0;

  function renderTabs() {
    tabsContainer.innerHTML = '';
    SKILL_CATEGORIES.forEach((cat, idx) => {
      const tab = document.createElement('div');
      tab.className = 'skill-cards-tab' + (idx === currentCategory ? ' active' : '');
      tab.textContent = cat.name;
      tab.addEventListener('click', () => {
        currentCategory = idx;
        renderTabs();
        renderGrid();
      });
      tabsContainer.appendChild(tab);
    });
  }

  function renderGrid() {
    gridContainer.innerHTML = '';
    const cat = SKILL_CATEGORIES[currentCategory];
    cat.skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.style.setProperty('--card-glow', skill.glow);
      card.innerHTML = `
        <div class="skill-card-icon" style="color:${skill.color}"><i class="${skill.icon}"></i></div>
        <div class="skill-card-title">${skill.name}</div>
        <div class="skill-card-desc">${skill.desc}</div>
      `;
      gridContainer.appendChild(card);
    });
  }

  renderTabs();
  renderGrid();
}); 