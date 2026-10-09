const grid = document.querySelector('#grid');
const modal = document.querySelector('#modal');
const content = document.querySelector('#modal-content');
let profiles = [], filter = 'All';
function element(tag, text, className) { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; }
function render() {
 const query = document.querySelector('#search').value.toLowerCase().trim();
 const visible = profiles.filter(p => (filter === 'All' || p.course === filter) && [p.name,p.bio,p.course,...p.skills].join(' ').toLowerCase().includes(query));
 grid.replaceChildren(); document.querySelector('#empty').hidden = visible.length > 0;
 for (const p of visible) {
 const card = element('article', '', 'card'); const portrait = element('div','','portrait'); portrait.style.setProperty('--tint', p.tint || '#e1e8d9');
 const img = element('img'); img.src = p.image; img.alt = p.name + ' profile image'; img.loading = 'lazy'; img.onerror = () => { img.remove(); portrait.append(element('span',p.name)); };
 portrait.append(img,element('span',p.course,'course'));
 const body = element('div','','card-body'); body.append(element('h3',p.name),element('span',p.year,'year'),element('p',p.bio));
 const tags = element('div','','tags'); p.skills.forEach(s => tags.append(element('span',s))); body.append(tags);
 const bottom = element('div','','card-bottom'); const button = element('button','View diary ↗','view'); button.onclick = () => showProfile(p); bottom.append(element('span','A story in progress'),button); body.append(bottom); card.append(portrait,body); grid.append(card);
 }
}
function showProfile(p) { content.replaceChildren(); const img = element('img'); img.src=p.image; img.alt=p.name; content.append(img,element('h2',p.name),element('p',p.course+' · '+p.year),element('p',p.story || p.bio)); modal.showModal(); }
function showGuide() { content.innerHTML = `<div class="eyebrow">CONTRIBUTION GUIDE</div><h2>Add your own diary.</h2><p>Each student contributes a separate profile file and their own image.</p><ol><li>Fork and clone the class GitHub repository.</li><li>Create a branch: <code>git switch -c profile/your-name</code></li><li>Copy <code>dist/profiles/template.json</code> to <code>dist/profiles/your-name.json</code> and write your introduction.</li><li>Add your photo at <code>dist/images/your-name.jpg</code>.</li><li>Add <code>"your-name.json"</code> to the list in <code>dist/profiles/index.js</code>.</li><li>Run locally, check your profile, commit and push your branch.</li><li>Open a pull request to your teacher’s repository. Include a screenshot.</li></ol><pre>git add dist/profiles dist/images
git commit -m "Add my student profile"
git push -u origin profile/your-name</pre><p>The teacher reviews and merges each contribution.</p>`; modal.showModal(); }
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#filters').addEventListener('click',e=>{ if (!e.target.dataset.filter) return; filter=e.target.dataset.filter; document.querySelectorAll('#filters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter)); render(); });
document.querySelector('#guide').onclick=showGuide; document.querySelector('#guide2').onclick=showGuide; document.querySelector('.close').onclick=()=>modal.close();
Promise.all(window.PROFILE_FILES.map(async file=>{ const response=await fetch('profiles/'+file); if(!response.ok) throw new Error(file); const p=await response.json(); if(!p.name || !Array.isArray(p.skills)) throw new Error('Invalid profile'); return p; })).then(data=>{profiles=data;render();}).catch(()=>{grid.textContent='Profiles could not load. Run the project through a local web server and check profile files.';});
