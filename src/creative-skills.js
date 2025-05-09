// CREATIVE SKILLS - Orbit Animation JS
document.addEventListener('DOMContentLoaded', function() {
  const orbit = document.querySelector('.creative-skills-orbit');
  if (!orbit) {
    console.error("Creative skills orbit element not found!");
    return;
  }

  const centerNode = orbit.querySelector('.creative-skills-center');

  // Define skills for each category
  const skillCategories = [
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

  let currentCategory = 0;

  function renderSkills(categoryIdx) {
    // Remove old planets
    orbit.querySelectorAll('.creative-skill-planet').forEach(el => el.remove());
    const skills = skillCategories[categoryIdx].skills;
    const angleStep = 360 / skills.length;
    skills.forEach((skill, i) => {
      const planet = document.createElement('div');
      planet.className = `creative-skill-planet`;
      planet.setAttribute('data-skill', skill.color);
      planet.style.setProperty('--angle', `${i * angleStep}deg`);
      planet.innerHTML = `<i class="${skill.icon}"></i><div class="creative-skill-tooltip">${skill.tooltip}</div>`;
      orbit.appendChild(planet);
    });
  }

  function updateCenterText() {
    if (centerNode) centerNode.textContent = skillCategories[currentCategory].name;
  }

  if (centerNode) {
    centerNode.textContent = skillCategories[0].name;
    centerNode.style.cursor = 'pointer';
    centerNode.addEventListener('click', function() {
      currentCategory = (currentCategory + 1) % skillCategories.length;
      updateCenterText();
      renderSkills(currentCategory);
      calculateAndPositionPlanets();
    });
  }

  renderSkills(currentCategory);
  updateCenterText();
  calculateAndPositionPlanets();

  // Orbit animation logic (unchanged)
  function calculateAndPositionPlanets() {
    const planets = orbit.querySelectorAll('.creative-skill-planet');
    const centerX = orbit.offsetWidth / 2;
    const centerY = orbit.offsetHeight / 2;
    if (isNaN(centerX) || isNaN(centerY) || centerX === 0 || centerY === 0) {
        requestAnimationFrame(calculateAndPositionPlanets);
        return;
    }
    const radius = Math.min(centerX, centerY) * 0.75; 
    planets.forEach((planet, i) => {
        const angle = parseFloat(planet.style.getPropertyValue('--angle')) || (i * (360 / planets.length));
        planet.dataset.baseAngle = angle;
        positionPlanet(planet, angle, radius, centerX, centerY);
    });
    requestAnimationFrame(animateOrbit);
  }
  
  let time = 0;
  function animateOrbit() {
    const planets = orbit.querySelectorAll('.creative-skill-planet');
    const centerX = orbit.offsetWidth / 2;
    const centerY = orbit.offsetHeight / 2;
    if (isNaN(centerX) || isNaN(centerY) || centerX === 0 || centerY === 0) {
        requestAnimationFrame(animateOrbit);
        return;
    }
    const radius = Math.min(centerX, centerY) * 0.75;
    time += 0.0005; // Orbit speed (reduced by 90%)
    planets.forEach(planet => {
      const baseAngle = parseFloat(planet.dataset.baseAngle);
      const currentAngle = baseAngle + (time * 360);
      positionPlanet(planet, currentAngle, radius, centerX, centerY);
    });
    requestAnimationFrame(animateOrbit);
  }

  function positionPlanet(planet, angle, r, cx, cy) {
    const rad = angle * Math.PI / 180;
    const planetRadius = planet.offsetWidth / 2;
    const x = cx + r * Math.cos(rad) - planetRadius;
    const y = cy + r * Math.sin(rad) - planetRadius;
    planet.style.left = x + 'px';
    planet.style.top = y + 'px';
  }
}); 