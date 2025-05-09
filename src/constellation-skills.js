// CONSTELLATION SKILLS SECTION - JS

const CONSTELLATION_CATEGORIES = [
  {
    name: 'Languages',
    skills: [
      { icon: 'fab fa-java', color: 'java', label: 'Java', tooltip: 'Java<br>OOP & Backend' },
      { icon: 'fab fa-python', color: 'python', label: 'Python', tooltip: 'Python<br>ML & Scripting' },
      { icon: 'fas fa-code', color: 'cpp', label: 'C/C++', tooltip: 'C/C++<br>Systems & Competitive' },
      { icon: 'fas fa-database', color: 'sql', label: 'SQL (Postgres)', tooltip: 'SQL (Postgres)<br>Databases' },
      { icon: 'fab fa-js', color: 'js', label: 'JavaScript', tooltip: 'JavaScript<br>ES6+ & Web' },
      { icon: 'fab fa-html5', color: 'html', label: 'HTML/CSS', tooltip: 'HTML/CSS<br>Web Layout' },
      { icon: 'fab fa-r-project', color: 'r', label: 'R', tooltip: 'R<br>Statistics & Data Science' },
      { icon: 'fab fa-golang', color: 'go', label: 'Go', tooltip: 'Go<br>Concurrent Programming' },
      { icon: 'fab fa-php', color: 'php', label: 'PHP', tooltip: 'PHP<br>Web & Backend' },
    ]
  },
  {
    name: 'Frameworks',
    skills: [
      { icon: 'fab fa-react', color: 'react', label: 'React', tooltip: 'React<br>Frontend' },
      { icon: 'fab fa-node-js', color: 'node', label: 'Node.js', tooltip: 'Node.js<br>Backend & APIs' },
      { icon: 'fab fa-python', color: 'python', label: 'Flask', tooltip: 'Flask<br>Python Web' },
      { icon: 'fas fa-vial', color: 'junit', label: 'JUnit', tooltip: 'JUnit<br>Java Testing' },
      { icon: 'fab fa-wordpress', color: 'wordpress', label: 'WordPress', tooltip: 'WordPress<br>CMS & Themes' },
      { icon: 'fas fa-layer-group', color: 'mui', label: 'Material-UI', tooltip: 'Material-UI<br>Design Systems' },
      { icon: 'fas fa-bolt', color: 'fastapi', label: 'FastAPI', tooltip: 'FastAPI<br>Python APIs' },
    ]
  },
  {
    name: 'Developer Tools',
    skills: [
      { icon: 'fab fa-git-alt', color: 'git', label: 'Git', tooltip: 'Git<br>Version Control' },
      { icon: 'fab fa-docker', color: 'docker', label: 'Docker', tooltip: 'Docker<br>Containers' },
      { icon: 'fas fa-cogs', color: 'travisci', label: 'TravisCI', tooltip: 'TravisCI<br>CI/CD' },
      { icon: 'fab fa-google', color: 'gcp', label: 'Google Cloud Platform', tooltip: 'Google Cloud Platform<br>Cloud Services' },
      { icon: 'fas fa-code', color: 'vscode', label: 'VS Code', tooltip: 'VS Code<br>Editor' },
      { icon: 'fab fa-windows', color: 'windows', label: 'Visual Studio', tooltip: 'Visual Studio<br>IDE' },
      { icon: 'fas fa-fire', color: 'pycharm', label: 'PyCharm', tooltip: 'PyCharm<br>Python IDE' },
      { icon: 'fas fa-lightbulb', color: 'intellij', label: 'IntelliJ', tooltip: 'IntelliJ<br>Java IDE' },
      { icon: 'fas fa-desktop', color: 'eclipse', label: 'Eclipse', tooltip: 'Eclipse<br>Java IDE' },
    ]
  },
  {
    name: 'Libraries',
    skills: [
      { icon: 'fas fa-table', color: 'pandas', label: 'pandas', tooltip: 'pandas<br>Data Analysis' },
      { icon: 'fas fa-calculator', color: 'numpy', label: 'NumPy', tooltip: 'NumPy<br>Numerical Computing' },
      { icon: 'fas fa-chart-bar', color: 'matplotlib', label: 'Matplotlib', tooltip: 'Matplotlib<br>Visualization' },
    ]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const section = document.querySelector('.constellation-skills-section');
  if (!section) return;

  const centerNode = section.querySelector('.constellation-skills-center');
  const nodesContainer = section.querySelector('.constellation-skills-nodes');
  const linesSvg = section.querySelector('.constellation-skills-lines');

  let currentCategory = 0;

  function getNodePositions(count, radius = 200, center = {x: 300, y: 300}) {
    // Organic: add some random offset to each angle
    const angleStep = (2 * Math.PI) / count;
    return Array.from({length: count}).map((_, i) => {
      const angle = i * angleStep + (Math.random() - 0.5) * 0.3; // randomize
      const r = radius * (0.85 + Math.random() * 0.15); // randomize radius
      return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
      };
    });
  }

  function renderCategory(idx) {
    // Clear nodes and lines
    nodesContainer.innerHTML = '';
    linesSvg.innerHTML = '';
    const cat = CONSTELLATION_CATEGORIES[idx];
    centerNode.textContent = cat.name;
    const center = {x: 300, y: 300};
    const positions = getNodePositions(cat.skills.length, 200, center);
    // Draw lines and nodes
    cat.skills.forEach((skill, i) => {
      // Line from center to node
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', center.x);
      line.setAttribute('y1', center.y);
      line.setAttribute('x2', positions[i].x);
      line.setAttribute('y2', positions[i].y);
      line.setAttribute('stroke', 'rgba(180,180,255,0.5)');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('class', 'constellation-skill-line');
      linesSvg.appendChild(line);
      // Node
      const node = document.createElement('div');
      node.className = `constellation-skill-node`;
      node.setAttribute('data-skill', skill.color);
      node.style.left = (positions[i].x - 35) + 'px';
      node.style.top = (positions[i].y - 35) + 'px';
      node.innerHTML = `<i class="${skill.icon}"></i><div class="constellation-skill-tooltip">${skill.tooltip}</div>`;
      nodesContainer.appendChild(node);
    });
  }

  if (centerNode) {
    centerNode.addEventListener('click', function() {
      currentCategory = (currentCategory + 1) % CONSTELLATION_CATEGORIES.length;
      renderCategory(currentCategory);
    });
  }

  renderCategory(currentCategory);
}); 