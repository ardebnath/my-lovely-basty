const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

// Progress follows the scene nearest the middle of the viewport.
const dots = $$('.journey-dots b');
const scenes = $$('.scene[data-step]');
const updateJourney = () => {
  const centre = window.innerHeight * .52;
  let current = scenes[0];
  scenes.forEach(scene => {
    const rect = scene.getBoundingClientRect();
    if (rect.top <= centre && rect.bottom > centre) current = scene;
  });
  const step = Number(current.dataset.step);
  dots.forEach((dot, index) => dot.classList.toggle('active', index <= step));
};
window.addEventListener('scroll', updateJourney, { passive: true });
updateJourney();

$$('.next-scene').forEach(button => button.addEventListener('click', () => {
  if (!audioEnabled) turnSoundOn(false);
  document.getElementById(button.dataset.next)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  playChime(560);
}));

// Flower wishes
const bubble = document.querySelector('.wish-bubble');
const bubbleText = bubble.querySelector('p');
const openedFlowers = new Set();
let wishesComplete = false;
$$('.wish-flower').forEach(flower => flower.addEventListener('click', () => {
  bubbleText.textContent = flower.dataset.wish;
  bubble.classList.add('show');
  if (!openedFlowers.has(flower)) {
    openedFlowers.add(flower);
    flower.classList.add('picked');
  }
  playChime(790);

  if (openedFlowers.size === 3 && !wishesComplete) {
    wishesComplete = true;
    bubbleText.textContent = 'All three wishes are blooming. Your cake is ready! ✦';
    bubble.classList.add('complete');
    window.setTimeout(() => {
      document.getElementById('cake')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playFanfare();
    }, 1050);
  }
}));
bubble.querySelector('.wish-x').addEventListener('click', () => bubble.classList.remove('show'));

// Panda Post: notes are delivered one by one, never as a slide deck.
const birthdayNotes = [
  {
    title: 'To my dearest Basty,',
    body: 'Basty, today is officially for your special day!, I hope you feel celebrated, loved, and spoiled. You deserve it all.'
  },
  {
    title: 'Second little note',
    body: 'I hope this year gives you more soft mornings, loud laughs, surprise wins, and every snack you were craving.'
  },
  {
    title: 'you are magic in my life',
    body: 'Please keep taking up space, making your kind of magic, and being exactly as delightfully you as you are.I wish i gate you all time as my basty'
  },
  {
    title: 'One last note to you, birthday girl',
    body: 'You are so beautiful girl, my love. Now go have the cutest, happiest, most Basty-est day possible. and told me what you want from me ♡'
  }
];
const mailEnvelope = document.querySelector('#mailEnvelope');
const noteCard = document.querySelector('#noteCard');
const noteNumber = noteCard.querySelector('.note-number');
const noteTitle = noteCard.querySelector('h3');
const noteBody = noteCard.querySelector('.note-body');
const nextNote = noteCard.querySelector('.next-note');
const envelopePrompt = document.querySelector('.envelope-prompt');
const mailExperience = document.querySelector('.mail-experience');
let deliveredNote = -1;
let delivering = false;

function deliverNextNote() {
  if (delivering) return;
  if (deliveredNote >= birthdayNotes.length - 1) {
    document.getElementById('garden')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    playChime(620);
    return;
  }
  delivering = true;
  noteCard.classList.remove('show');
  mailEnvelope.classList.remove('open');
  void mailEnvelope.offsetWidth;
  mailEnvelope.classList.add('open');

  window.setTimeout(() => {
    deliveredNote += 1;
    const note = birthdayNotes[deliveredNote];
    const number = String(deliveredNote + 1).padStart(2, '0');
    noteNumber.innerHTML = `note <span>${number}</span> of <span>04</span>`;
    noteTitle.textContent = note.title;
    noteBody.textContent = note.body;
    noteCard.classList.add('show');
    mailEnvelope.setAttribute('aria-expanded', 'true');

    if (deliveredNote === birthdayNotes.length - 1) {
      nextNote.textContent = 'all the post is delivered →';
      nextNote.classList.add('done');
      envelopePrompt.textContent = 'panda post delivery: complete';
      mailExperience.classList.add('complete');
      burst(40);
    } else {
      const upcoming = String(deliveredNote + 2).padStart(2, '0');
      envelopePrompt.innerHTML = `open the envelope for note <b>${upcoming}</b>`;
    }
    delivering = false;
  }, 490);
}
mailEnvelope.addEventListener('click', deliverNextNote);
nextNote.addEventListener('click', deliverNextNote);

// Candles
let blown = 0;
const flames = $$('.big-flame');
const meter = document.querySelector('.wish-meter i');
const count = document.querySelector('.wish-meter b');
const complete = document.querySelector('.cake-complete');
flames.forEach(flame => flame.addEventListener('click', () => {
  if (flame.classList.contains('out')) return;
  flame.classList.add('out');
  blown += 1;
  meter.style.width = `${blown * 20}%`;
  count.textContent = `${blown} / 5`;
  puff(flame);
  playChime(230 + blown * 55);
  if (blown === flames.length) {
    complete.classList.add('show');
    burst(65);
    playFanfare();
  }
}));

function puff(origin) {
  const rect = origin.getBoundingClientRect();
  for (let i = 0; i < 9; i++) {
    const puff = document.createElement('i');
    puff.className = 'puff';
    puff.style.cssText = `position:fixed;z-index:50;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:${5 + Math.random() * 8}px;height:${5 + Math.random() * 8}px;border-radius:50%;background:#fff;pointer-events:none;animation:puff .65s ease-out forwards;--x:${(Math.random() - .5) * 75}px;--y:${-20 - Math.random() * 42}px`;
    document.body.append(puff);
    setTimeout(() => puff.remove(), 700);
  }
}
const puffStyle = document.createElement('style');
puffStyle.textContent = '@keyframes puff{to{transform:translate(var(--x),var(--y)) scale(.15);opacity:0}}';
document.head.append(puffStyle);

// Confetti burst
const confettiLayer = document.querySelector('.confetti-layer');
function burst(total = 90) {
  const colours = ['#ff6e9d', '#ffd25e', '#9070db', '#80d6b0', '#ff9b73', '#ffffff'];
  for (let i = 0; i < total; i++) {
    const piece = document.createElement('i');
    piece.className = `confetti ${Math.random() > .7 ? 'dot' : ''}`;
    piece.style.cssText = `left:${Math.random() * 100}vw;--c:${colours[i % colours.length]};--d:${1.8 + Math.random() * 1.9}s;--x:${(Math.random() - .5) * 180}px;--r:${Math.random() * 240}deg;animation-delay:${Math.random() * .22}s`;
    confettiLayer.append(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}
document.querySelector('.celebrate').addEventListener('click', () => { burst(150); playFanfare(); });

// A light, no-file-required birthday sound.
let audioEnabled = false;
let audioContext;
let fallbackTuneTimer;
let fallbackTuneActive = false;
const soundButton = document.querySelector('.sound-toggle');
const birthdayMusic = document.querySelector('#birthdayMusic');
birthdayMusic.volume = .42;
soundButton.addEventListener('click', () => {
  if (audioEnabled) {
    turnSoundOff();
  } else {
    turnSoundOn(true);
  }
});
function turnSoundOn(playIntro = true) {
  audioEnabled = true;
  soundButton.classList.add('playing');
  soundButton.setAttribute('aria-pressed', 'true');
  soundButton.querySelector('span:last-child').textContent = 'on';
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  const supportsOgg = birthdayMusic.canPlayType('audio/ogg; codecs="vorbis"');
  if (supportsOgg) {
    birthdayMusic.play().then(stopFallbackTune).catch(startFallbackTune);
  } else {
    startFallbackTune();
  }
  if (playIntro) playFanfare();
}
function turnSoundOff() {
  audioEnabled = false;
  soundButton.classList.remove('playing');
  soundButton.setAttribute('aria-pressed', 'false');
  soundButton.querySelector('span:last-child').textContent = 'sound';
  birthdayMusic.pause();
  stopFallbackTune();
}
function startFallbackTune() {
  if (fallbackTuneActive || !audioEnabled) return;
  fallbackTuneActive = true;
  const notes = [523, 523, 587, 523, 698, 659, 523, 523, 587, 523, 784, 698];
  const playPhrase = () => {
    if (!audioEnabled || !fallbackTuneActive) return;
    notes.forEach((note, index) => tone(note, .31, index * .38, 'triangle'));
    fallbackTuneTimer = window.setTimeout(playPhrase, notes.length * 380 + 750);
  };
  playPhrase();
}
function stopFallbackTune() {
  fallbackTuneActive = false;
  window.clearTimeout(fallbackTuneTimer);
}
// A first tap is a valid browser media gesture, so it also wakes the background music.
document.addEventListener('pointerdown', event => {
  if (!audioEnabled && !event.target.closest('.sound-toggle')) turnSoundOn(false);
}, { once: true });
function tone(frequency, duration = .11, start = 0, type = 'sine') {
  if (!audioEnabled) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(.0001, audioContext.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(.06, audioContext.currentTime + start + .01);
  gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + start); oscillator.stop(audioContext.currentTime + start + duration + .03);
}
function playChime(note) { tone(note, .13, 0, 'triangle'); }
function playFanfare() { [523, 659, 784, 1047].forEach((note, index) => tone(note, .18, index * .11, 'triangle')); }
