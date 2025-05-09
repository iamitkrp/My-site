// SKILL TIMELINE SECTION - JS

const TIMELINE_CATEGORIES = [
  {
    name: 'Languages',
    color: '#f89820',
    skills: [
      { icon: 'fab fa-java', name: 'Java', desc: 'OOP & Backend' },
      { icon: 'fab fa-python', name: 'Python', desc: 'ML & Scripting' },
      { icon: 'fas fa-code', name: 'C/C++', desc: 'Systems & Competitive' },
      { icon: 'fas fa-database', name: 'SQL (Postgres)', desc: 'Databases' },
      { icon: 'fab fa-js', name: 'JavaScript', desc: 'ES6+ & Web' },
      { icon: 'fab fa-html5', name: 'HTML/CSS', desc: 'Web Layout' },
      { icon: 'fab fa-r-project', name: 'R', desc: 'Statistics & Data Science' },
      { icon: 'fab fa-golang', name: 'Go', desc: 'Concurrent Programming' },
      { icon: 'fab fa-php', name: 'PHP', desc: 'Web & Backend' },
    ]
  },
  {
    name: 'Frameworks',
    color: '#61dafb',
    skills: [
      { icon: 'fab fa-react', name: 'React', desc: 'Frontend' },
      { icon: 'fab fa-node-js', name: 'Node.js', desc: 'Backend & APIs' },
      { icon: 'fab fa-python', name: 'Flask', desc: 'Python Web' },
      { icon: 'fas fa-vial', name: 'JUnit', desc: 'Java Testing' },
      { icon: 'fab fa-wordpress', name: 'WordPress', desc: 'CMS & Themes' },
      { icon: 'fas fa-layer-group', name: 'Material-UI', desc: 'Design Systems' },
      { icon: 'fas fa-bolt', name: 'FastAPI', desc: 'Python APIs' },
    ]
  },
  {
    name: 'Developer Tools',
    color: '#2496ed',
    skills: [
      { icon: 'fab fa-git-alt', name: 'Git', desc: 'Version Control' },
      { icon: 'fab fa-docker', name: 'Docker', desc: 'Containers' },
      { icon: 'fas fa-cogs', name: 'TravisCI', desc: 'CI/CD' },
      { icon: 'fab fa-google', name: 'Google Cloud Platform', desc: 'Cloud Services' },
      { icon: 'fas fa-code', name: 'VS Code', desc: 'Editor' },
      { icon: 'fab fa-windows', name: 'Visual Studio', desc: 'IDE' },
      { icon: 'fas fa-fire', name: 'PyCharm', desc: 'Python IDE' },
      { icon: 'fas fa-lightbulb', name: 'IntelliJ', desc: 'Java IDE' },
      { icon: 'fas fa-desktop', name: 'Eclipse', desc: 'Java IDE' },
    ]
  },
  {
    name: 'Libraries',
    color: '#e70488',
    skills: [
      { icon: 'fas fa-table', name: 'pandas', desc: 'Data Analysis' },
      { icon: 'fas fa-calculator', name: 'NumPy', desc: 'Numerical Computing' },
      { icon: 'fas fa-chart-bar', name: 'Matplotlib', desc: 'Visualization' },
    ]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const section = document.querySelector('.skill-timeline-section');
  if (!section) return;

  const timeline = section.querySelector('.skill-timeline');

  function renderTimeline() {
    timeline.innerHTML = '';
    TIMELINE_CATEGORIES.forEach(cat => {
      // Category header
      const catHeader = document.createElement('div');
      catHeader.className = 'skill-timeline-category';
      catHeader.textContent = cat.name;
      timeline.appendChild(catHeader);
      // Row of skills
      const row = document.createElement('div');
      row.className = 'skill-timeline-row';
      cat.skills.forEach((skill, i) => {
        // Node
        const node = document.createElement('div');
        node.className = 'skill-timeline-node';
        node.setAttribute('data-cat', cat.name);
        node.style.background = cat.color + '22'; // subtle background for debug
        node.style.borderColor = cat.color;
        node.innerHTML = `<i class="${skill.icon}"></i><span style="font-size:0.9rem;display:block;margin-top:4px;">${skill.name}</span>`;
        // Label (for accessibility, but not needed visually now)
        // const label = document.createElement('div');
        // label.className = 'skill-timeline-label';
        // label.textContent = skill.name;
        // Popover
        const popover = document.createElement('div');
        popover.className = 'skill-timeline-popover';
        popover.innerHTML = skill.desc;
        node.appendChild(popover);
        // Hover: show popover
        node.addEventListener('mouseenter', () => popover.style.opacity = '1');
        node.addEventListener('mouseleave', () => popover.style.opacity = '0');
        row.appendChild(node);
        // row.appendChild(label);
        // Connector (except after last node)
        if (i < cat.skills.length - 1) {
          const connector = document.createElement('div');
          connector.className = 'skill-timeline-connector';
          connector.style.background = `linear-gradient(90deg, ${cat.color} 0%, #61dafb 100%)`;
          row.appendChild(connector);
        }
      });
      timeline.appendChild(row);
    });
  }

  renderTimeline();
}); 