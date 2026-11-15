(() => {
  const skills = ['Python', 'C', 'Java', 'HTML', 'CSS', 'JavaScript', 'Machine Learning'];
  const storageKey = 'college-diaries-skill-exchange';
  const publishedProfiles = [
    { name: 'Kulavardhini Sarvadha DK', github: 'https://github.com/kulavardhini-sarvadha', skills: ['Python', 'HTML', 'CSS'] },
    { name: 'Arsalan War', github: 'https://github.com/changeatom', skills: ['C', 'HTML'] },
    { name: 'Shivaani', github: 'https://github.com/shivaani2011', skills: ['Python', 'C'] },
    { name: 'Khalid Saifullah', github: 'https://github.com/khalidsaifullah024', skills: ['C', 'HTML', 'CSS'] },
    { name: 'Devi Prasad H', github: 'https://github.com/Devi-prasad-H', skills: ['C', 'HTML', 'CSS'] },
    { name: 'Chinmayee.Bs', github: 'https://github.com/chinmayeebs534-cmd', skills: ['C', 'HTML', 'CSS'] },
    { name: 'Kirrthana', github: 'https://github.com/kirrthanaprkirrthu', skills: ['C', 'HTML', 'CSS'] },
    { name: 'Vandhana V', github: 'https://github.com/Vandhana-282008', skills: ['C', 'JavaScript'] },
    { name: 'Raghavi J Naik', github: 'https://github.com/raghavinaik2008', skills: ['Python', 'HTML'] },
    { name: 'Yashwanth V', github: 'https://github.com/Yashwanth-VK', skills: ['Java', 'HTML', 'Python'] },
    { name: 'Umme Fiza', github: 'https://github.com/ummefiza27', skills: ['Python', 'HTML', 'CSS'] },
    { name: 'Suraj Das', github: 'https://github.com/surajdas172345', skills: ['JavaScript', 'CSS'] },
    { name: 'Rakshita N', github: 'https://github.com/nrakshita66-byte', skills: ['HTML', 'CSS'] }
  ];

  const form = document.querySelector('#exchange-form');
  const skillChoices = document.querySelector('#skill-choices');
  const skillFilter = document.querySelector('#skill-filter');
  const search = document.querySelector('#student-search');
  const studentList = document.querySelector('#student-list');
  const emptyState = document.querySelector('#empty-state');
  const resultCount = document.querySelector('#result-count');
  const formStatus = document.querySelector('#form-status');
  const menuToggle = document.querySelector('#menu-toggle');
  const menuPanel = document.querySelector('#site-menu-panel');
  let modeFilter = 'all';
  let savedProfiles = [];
  let storageAvailable = true;

  function isValidSavedProfile(profile) {
    return profile
      && typeof profile.name === 'string'
      && profile.name.trim().length > 0
      && typeof profile.github === 'string'
      && isGitHubProfile(profile.github)
      && (profile.mode === 'teach' || profile.mode === 'learn')
      && Array.isArray(profile.skills)
      && profile.skills.length > 0
      && profile.skills.every(skill => skills.includes(skill));
  }

  function isGitHubProfile(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:'
        && url.hostname === 'github.com'
        && /^\/[A-Za-z0-9-]+\/?$/.test(url.pathname)
        && !url.search
        && !url.hash;
    } catch {
      return false;
    }
  }

  function loadSavedProfiles() {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new TypeError('Saved skill exchange data is not a list.');
      if (parsed.some(profile => !isValidSavedProfile(profile))) {
        formStatus.textContent = 'Some saved profiles were invalid and were not loaded.';
      }
      return parsed.filter(isValidSavedProfile);
    } catch (error) {
      storageAvailable = false;
      formStatus.textContent = `Saved profiles could not be loaded: ${error.message}`;
      return [];
    }
  }

  function createSkillTag(skill) {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    return tag;
  }

  function createProfileCard(profile, isCommunityPost) {
    const card = document.createElement('article');
    card.className = 'student-card';

    const cardTop = document.createElement('div');
    cardTop.className = 'student-card__top';
    const avatar = document.createElement('span');
    avatar.className = 'student-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = profile.name.trim().charAt(0).toUpperCase();

    const identity = document.createElement('div');
    identity.className = 'student-identity';
    const name = document.createElement('h3');
    name.textContent = profile.name;
    const github = document.createElement('a');
    github.href = profile.github;
    github.target = '_blank';
    github.rel = 'noopener noreferrer';
    github.textContent = profile.github.replace(/\/$/, '').split('/').pop();
    identity.append(name, github);
    cardTop.append(avatar, identity);
    card.append(cardTop);

    const badge = document.createElement('span');
    badge.className = `participation-badge ${profile.mode === 'teach' ? 'is-teaching' : ''}`;
    if (profile.mode === 'teach') {
      badge.textContent = 'I Can Teach';
    } else if (profile.mode === 'learn') {
      badge.textContent = 'I Want to Learn';
    } else {
      badge.textContent = 'Student profile';
    }
    card.append(badge);

    const skillsHeading = document.createElement('h4');
    skillsHeading.className = 'student-card__label';
    skillsHeading.textContent = isCommunityPost
      ? profile.mode === 'teach' ? 'Skills to share' : 'Skills to learn'
      : 'Skills on profile';
    const skillList = document.createElement('div');
    skillList.className = 'student-skills';
    profile.skills.forEach(skill => skillList.append(createSkillTag(skill)));
    card.append(skillsHeading, skillList);
    return card;
  }

  function renderProfiles() {
    const query = search.value.trim().toLowerCase();
    const selectedSkill = skillFilter.value;
    const profiles = [
      ...savedProfiles.map(profile => ({ ...profile, isCommunityPost: true })),
      ...publishedProfiles.map(profile => ({ ...profile, isCommunityPost: false }))
    ];
    const filtered = profiles.filter(profile => {
      const matchesMode = modeFilter === 'all' || profile.mode === modeFilter;
      const matchesSkill = !selectedSkill || profile.skills.includes(selectedSkill);
      const searchableText = `${profile.name} ${profile.github} ${profile.skills.join(' ')}`.toLowerCase();
      return matchesMode && matchesSkill && searchableText.includes(query);
    });

    studentList.replaceChildren(...filtered.map(profile =>
      createProfileCard(profile, profile.isCommunityPost)
    ));
    resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'student' : 'students'}`;
    emptyState.hidden = filtered.length > 0;
  }

  skills.forEach(skill => {
    const option = document.createElement('option');
    option.value = skill;
    option.textContent = skill;
    skillFilter.append(option);

    const label = document.createElement('label');
    label.className = 'skill-choice';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'skills';
    input.value = skill;
    const text = document.createElement('span');
    text.textContent = skill;
    label.append(input, text);
    skillChoices.append(label);
  });

  savedProfiles = loadSavedProfiles();
  renderProfiles();

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim().replace(/\s+/g, ' ');
    const github = String(formData.get('github') || '').trim();
    const mode = String(formData.get('mode') || '');
    const selectedSkills = formData.getAll('skills').map(String).filter(skill => skills.includes(skill));

    if (!name || name.length > 60 || !isGitHubProfile(github)
      || (mode !== 'teach' && mode !== 'learn') || selectedSkills.length === 0) {
      formStatus.textContent = 'Add your name, a valid GitHub profile, a participation option, and at least one skill.';
      return;
    }

    const profile = { name, github: github.replace(/\/$/, ''), mode, skills: selectedSkills };
    if (!isValidSavedProfile(profile)) {
      formStatus.textContent = 'Check your profile details and try again.';
      return;
    }
    savedProfiles.unshift(profile);

    if (storageAvailable) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(savedProfiles));
      } catch (error) {
        storageAvailable = false;
        formStatus.textContent = `Your profile is visible for this visit, but could not be saved: ${error.message}`;
      }
    }

    if (storageAvailable) {
      formStatus.textContent = 'Your profile was added and saved in this browser.';
    }
    form.reset();
    renderProfiles();
    studentList.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  search.addEventListener('input', renderProfiles);
  skillFilter.addEventListener('change', renderProfiles);
  document.querySelector('.mode-filters').addEventListener('click', event => {
    const button = event.target.closest('button[data-mode-filter]');
    if (!button) return;
    modeFilter = button.dataset.modeFilter;
    document.querySelectorAll('[data-mode-filter]').forEach(filterButton => {
      filterButton.setAttribute('aria-pressed', String(filterButton === button));
    });
    renderProfiles();
  });

  function setMenuOpen(isOpen) {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuPanel.hidden = !isOpen;
  }

  menuToggle.addEventListener('click', () => setMenuOpen(menuPanel.hidden));
  menuPanel.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', event => {
    if (!menuToggle.parentElement.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menuPanel.hidden) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
})();
