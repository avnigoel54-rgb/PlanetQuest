// PlanetQuest - main JS
// Data sets (cards, facts, quiz)
const ENV_CARDS = [
  {title:'Marine Life', text:'Ocean health, coral reefs, and plastic pollution. Learn how simple actions protect marine animals.', link: 'EnvironmentPages/ClimateChange.html' },
  {title:'Forests & Trees', text:'Forests are the lungs of the Earth. Reforestation, biodiversity and community forests matter.', link: 'EnvironmentPages/ClimateChange.html' },
  {title:'Climate Change', text:'Causes, effects, and what students can do: reduce waste, save energy, learn more.', link: 'EnvironmentPages/ClimateChange.html' },
  {title:'Air & Atmosphere', text:'Air quality, emissions, and ways to reduce local pollution.',link: 'EnvironmentPages/ClimateChange.html' ,},
  {title:'Soil & Land', text:'Soil health, sustainable farming, and preventing erosion.',link: 'EnvironmentPages/ClimateChange.html' },
  {title:'Energy & Renewables', text:'How renewable energy sources reduce emissions and help communities.', link: 'EnvironmentPages/ClimateChange.html' }
];

const FACTS = [
  
  'Around 8 million tonnes of plastic enter the oceans each year.',
  'A single mature tree can absorb up to 48 pounds of CO₂ per year.',
  'Small daily actions (like turning off lights) can reduce household emissions.',
  'Composting food scraps reduces methane from landfills.',
  'Switching a bulb to LED can save significant energy over its lifetime.',
  'Coral reefs support about 25% of all marine life.'
];

const CHALLENGES = [
  'Turn off lights in unused rooms for the whole day.',
  'Refuse single-use plastic for one day — carry a reusable bottle.',
  'Pick up 3 pieces of litter in your neighborhood.',
  'Avoid using the elevator — take stairs for short trips.',
  'Unplug chargers and devices when not in use.'
];

const QUIZ = [
  {q:'Which gas is the primary driver of current climate change?', options:['Oxygen','Carbon Dioxide','Nitrogen','Helium'], ans:'Carbon Dioxide'},
  {q:'Which of the following is a renewable energy source?', options:['Coal','Wind','Natural Gas','Oil'], ans:'Wind'},
  {q:'Composting helps reduce which greenhouse gas from landfills?', options:['CO2','Methane (CH4)','Nitrous Oxide','Ozone'], ans:'Methane (CH4)'},
  {q:'Which action saves water at home?', options:['Running the tap while brushing','Fixing leaks','Washing car every day','Keeping sprinklers on'], ans:'Fixing leaks'}
];

// ---------- UI population ----------
function populateCards(){
  const container = document.getElementById('cards');
  container.innerHTML = '';
  ENV_CARDS.forEach(c=>{
    const el = document.createElement('div'); el.className = 'card';
    el.innerHTML = `<div><h4>${c.title}</h4><p>${c.text}</p></div>
      <div style="margin-top:12px"><a class="btn ghost" href="${c.link}">Read more</a></div>`;
    container.appendChild(el);
  });
}

function populateFacts(){
  const fgrid = document.getElementById('factsGrid');
  fgrid.innerHTML='';
  FACTS.slice(0,6).forEach((t,i)=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<h4>Fact ${i+1}</h4><p class="muted">${t}</p>`;
    fgrid.appendChild(el);
  });
}

// random fact section
function showRandomFact(){
  const idx = Math.floor(Math.random()*FACTS.length);
  document.getElementById('randomFact').textContent = FACTS[idx];
}

// daily challenge logic
const CH_KEY = 'planet_challenge_today';
function getChallenge(){
  // store a challenge index keyed by date
  const today = new Date().toISOString().slice(0,10);
  const stored = JSON.parse(localStorage.getItem(CH_KEY) || '{}');
  if(stored.date === today && typeof stored.idx === 'number') return stored.idx;
  // otherwise set new one
  const idx = Math.floor(Math.random()*CHALLENGES.length);
  localStorage.setItem(CH_KEY, JSON.stringify({date:today, idx, done:false}));
  return idx;
}
function renderChallenge(){
  const ci = getChallenge();
  document.getElementById('todayChallenge').textContent = CHALLENGES[ci];
  const stored = JSON.parse(localStorage.getItem(CH_KEY) || '{}');
  document.getElementById('challengeStatus').textContent = stored.done ? 'Completed ✔️' : 'Not done yet';
}
document.getElementById('markDone').addEventListener('click', ()=>{
  const stored = JSON.parse(localStorage.getItem(CH_KEY) || '{}');
  stored.done = true;
  localStorage.setItem(CH_KEY, JSON.stringify(stored));
  renderChallenge();
});
document.getElementById('nextChallenge').addEventListener('click', ()=>{
  // force new random
  const today = new Date().toISOString().slice(0,10);
  const idx = Math.floor(Math.random()*CHALLENGES.length);
  localStorage.setItem(CH_KEY, JSON.stringify({date:today, idx, done:false}));
  renderChallenge();
});

// ---------- Modal Quiz-----------
// ---- Modal Logic ----
const quizModal = document.getElementById('quizModal');
const closeModal = document.getElementById('closeModal');

// Open modal when any "Take Quiz" button is clicked
document.querySelectorAll('.quiz-card .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    quizModal.style.display = 'block';
    startQuiz();
  });
});

// Close modal
closeModal.addEventListener('click', () => {
  quizModal.style.display = 'none';
});

// Close if clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === quizModal) {
    quizModal.style.display = 'none';
  }
});

// ------- quiz Qs ------


// --------- quiz system ----------
let qIndex = 0, score = 0;
const totalQ = QUIZ.length;
function startQuiz(){
  qIndex=0; score=0;
  totalQ = filteredQuiz.length;
  document.getElementById('result').style.display='none';
  document.getElementById('feedback').textContent='';
  renderQuestion();
}
function renderQuestion(){
  document.getElementById('totalQ').textContent = totalQ;
  const q = QUIZ[qIndex];
  document.getElementById('qText').textContent = q.q;
  const opts = document.getElementById('options'); opts.innerHTML='';
  q.options.forEach(opt=>{
    const div = document.createElement('div'); div.className='option';
    div.textContent = opt;
    div.onclick = ()=>{ document.querySelectorAll('.option').forEach(o=>o.classList.remove('selected')); div.classList.add('selected'); };
    opts.appendChild(div);
  });
  document.getElementById('submitAnswer').style.display='inline-block';
  document.getElementById('nextQ').style.display='none';
}
document.getElementById('submitAnswer').addEventListener('click', ()=>{
  const selected = document.querySelector('.option.selected');
  if(!selected){ alert('Please select an option.'); return; }
  const answer = selected.textContent;
  const correct = QUIZ[qIndex].ans;
  if(answer === correct){
    score++;
    document.getElementById('feedback').textContent = 'Correct ✅';
  } else {
    document.getElementById('feedback').textContent = `Incorrect — correct: ${correct}`;
  }
  document.getElementById('submitAnswer').style.display='none';
  document.getElementById('nextQ').style.display='inline-block';
  // if last question show results on next
});
document.getElementById('nextQ').addEventListener('click', ()=>{
  qIndex++;
  document.getElementById('feedback').textContent='';
  if(qIndex >= totalQ){
    // show result
    document.getElementById('result').style.display='block';
    document.getElementById('scoreVal').textContent = `${score}/${totalQ}`;
    // store best score locally
    const best = Number(localStorage.getItem('planet_best_score')||0);
    if(score > best) localStorage.setItem('planet_best_score', score);
  } else renderQuestion();
});
document.getElementById('restart').addEventListener('click', startQuiz);

// misc
document.getElementById('newFact').addEventListener('click', showRandomFact);

// init on load
window.addEventListener('DOMContentLoaded', ()=>{
  populateCards();
  populateFacts();
  showRandomFact();
  renderChallenge();
  startQuiz();
});


