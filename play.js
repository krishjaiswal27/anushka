// play.js (combined final) - Enhanced with better interactivity
// Import content lists
import { letters, wordPuzzles, gallery } from './letters.js';

// ---------- State & storage ----------
const STORAGE_KEY = 'love_site_unlocks_v1';
let unlocked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

let selectedSecret = null;
let currentPuzzle = null;

// track currently previewed gallery index
let galleryCurrentIndex = 0;

// ---------- DOM references ----------
const secretsList = document.getElementById('secretsList');
const dayCounter = document.getElementById('dayCounter');

// Wordle game DOM
const gameView = document.getElementById('gameView');
const hintSection = document.getElementById('hintSection');
const guessesContainer = document.getElementById('guessesContainer');
const keyboardDiv = document.getElementById('keyboard');
const attemptCount = document.getElementById('attemptCount');
const gameMessage = document.getElementById('gameMessage');
const closeGameBtn = document.getElementById('closeGameBtn');

// Memory modal DOM
const memoryView = document.getElementById('memoryView');
const closeMemoryBtn = document.getElementById('closeMemoryBtn');

// Gallery DOM
const galleryGrid = document.getElementById('galleryGrid');
const galleryModal = document.getElementById('galleryModal'); // used as overlay host
const largeImageContainer = document.getElementById('largeImageContainer');
const openGalleryBtn = document.getElementById('openGalleryBtn');
const closeGalleryBtn = document.getElementById('closeGalleryBtn');
const openMemoryBtn = document.getElementById('openMemoryBtn');

// wire simple UI buttons if present
if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);
if (closeMemoryBtn) closeMemoryBtn.addEventListener('click', closeMemory);
if (openGalleryBtn) openGalleryBtn.addEventListener('click', () => openGallery());
if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeGallery);
if (openMemoryBtn) openMemoryBtn.addEventListener('click', () => {
  const secret = letters.find(l => !unlocked[l.id] && l.secretType === 'memory') || letters.find(l => !unlocked[l.id]) || letters[0];
  tryUnlockSecret(secret);
});

// ---------- Initialization ----------
renderSecrets();
renderGalleryScattered();
updateCounter();

// ---------- Storage helper ----------
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
}

// ---------- Confetti animation helper ----------
function createConfetti() {
  const colors = ['#ec4899', '#f43f5e', '#8b5cf6', '#ec71ff', '#f97316'];
  const confetti = [];
  for (let i = 0; i < 40; i++) {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = Math.random() * 100 + '%';
    div.style.top = '-10px';
    div.style.width = (Math.random() * 8 + 4) + 'px';
    div.style.height = div.style.width;
    div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    div.style.borderRadius = '50%';
    div.style.pointerEvents = 'none';
    div.style.zIndex = '9999';
    div.style.opacity = '0.8';
    document.body.appendChild(div);
    
    const duration = Math.random() * 2 + 2;
    const xDist = (Math.random() - 0.5) * 200;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = elapsed / duration;
      if (progress > 1) {
        div.remove();
        return;
      }
      div.style.top = (progress * 100) + 'vh';
      div.style.left = 'calc(' + (Math.random() * 100) + '% + ' + (xDist * progress) + 'px)';
      div.style.opacity = 1 - progress;
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// ---------- Secrets rendering ----------
function renderSecrets() {
  if (!secretsList) return;
  secretsList.innerHTML = '';
  letters.forEach(secret => {
    const card = document.createElement('div');
    const unlockedFlag = !!unlocked[secret.id];
    card.className = 'envelope ' + (unlockedFlag ? `unlocked ${secret.color}` : 'locked');
    card.innerHTML = `
      <div class="envelope-left">
        <div class="envelope-icon">${unlockedFlag ? '✉️' : (secret.secretType === 'password' ? '🔒' : secret.secretType === 'link' ? '🔗' : '🎮')}</div>
        <div>
          <div class="envelope-title">${secret.title}</div>
          <div class="envelope-subtitle">${unlockedFlag ? 'Click to open' : (secret.secretType === 'password' ? 'Enter password or play game' : secret.secretType === 'link' ? 'Click to open' : 'Play to unlock')}</div>
        </div>
      </div>
      ${unlockedFlag ? '<div class="heart-small">❤️</div>' : ''}
    `;
    if (unlockedFlag) {
      card.addEventListener('click', () => openSecret(secret));
    } else {
      card.addEventListener('click', () => tryUnlockSecret(secret));
    }
    secretsList.appendChild(card);
  });
}

function updateCounter() {
  const unlockedCount = Object.keys(unlocked).length;
  if (dayCounter) dayCounter.textContent = `${unlockedCount} of ${letters.length} unlocked`;
}

// ---------- Unlock flows ----------
function tryUnlockSecret(secret) {
  selectedSecret = secret;
  if (secret.secretType === 'password') {
    const attempt = prompt('Enter password to open this secret:');
    if (attempt && attempt.toUpperCase() === (secret.password || '').toUpperCase()) {
      markUnlocked(secret.id);
      createConfetti();
      setTimeout(() => alert('🎉 Unlocked! ❤️'), 300);
      openSecret(secret);
    } else {
      const play = confirm('Password wrong or skipped — try a game to unlock? (OK = Memory, Cancel = Word puzzle)');
      if (play) openMemoryForSecret(secret);
      else openPuzzleForSecret(secret);
    }
  } else if (secret.secretType === 'memory') {
    openMemoryForSecret(secret);
  } else {
    openPuzzleForSecret(secret);
  }
}

function markUnlocked(id) {
  unlocked[id] = true;
  save();
  renderSecrets();
  updateCounter();
}

function openSecret(secret) {
  // Handle link type - open link instead of showing modal
  if (secret.link) {
    createConfetti();
    setTimeout(() => {
      window.open(secret.link, '_blank');
    }, 300);
    return;
  }
  
  // simple modal built with an overlay so styling is consistent
  const modal = document.createElement('div');
  modal.className = 'overlay-modal';
  modal.innerHTML = `
    <div class="overlay-card letter-card ${secret.color}">
      <div class="letter-content">
        <div class="letter-header">
          <div class="letter-title-section">
            <h2>${secret.title}</h2>
            <p class="letter-day">✨ Secret</p>
          </div>
          <button class="close-btn" aria-label="Close letter">×</button>
        </div>
        <div class="letter-text">${secret.content}</div>
        <div class="back-btn-container"><button class="back-btn close-modal">Close</button></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
  createConfetti();
}

// ---------- Wordle-like game (adapted) ----------
let wordState = {
  currentGuess: '',
  attempts: 0,
  guesses: [],
  keyboardState: {},
  maxAttempts: 6
};
const keyboardLayout = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫']
];

function openPuzzleForSecret(secret) {
  selectedSecret = secret;
  currentPuzzle = wordPuzzles[secret.id] || { word: 'HEART', hint: 'A hint...' };
  wordState = { currentGuess: '', attempts: 0, guesses: [], keyboardState: {}, maxAttempts: 6 };
  if (hintSection) hintSection.textContent = currentPuzzle.hint || '';
  const titleEl = document.getElementById('gameTitle');
  if (titleEl) titleEl.textContent = `Unlock: ${secret.title}`;
  const instr = document.getElementById('gameInstructions');
  if (instr) instr.textContent = 'Guess the word to unlock';
  renderKeyboard();
  renderGuesses();
  if (gameView) gameView.classList.add('active');
}

function closeGame() {
  if (gameView) gameView.classList.remove('active');
}

function renderKeyboard() {
  if (!keyboardDiv) return;
  keyboardDiv.innerHTML = '';
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'key' + (k.length > 1 ? ' wide' : '');
      btn.textContent = k;
      btn.addEventListener('click', () => handleKey(k));
      if (wordState.keyboardState[k]) btn.classList.add(wordState.keyboardState[k]);
      rowDiv.appendChild(btn);
    });
    keyboardDiv.appendChild(rowDiv);
  });
  if (attemptCount) attemptCount.textContent = wordState.attempts;
}

function renderGuesses() {
  if (!guessesContainer) return;
  guessesContainer.innerHTML = '';
  for (let i = 0; i < wordState.maxAttempts; i++) {
    const row = document.createElement('div');
    row.className = 'word-display';
    const len = (currentPuzzle && currentPuzzle.word) ? currentPuzzle.word.length : 5;
    for (let j = 0; j < len; j++) {
      const box = document.createElement('div');
      box.className = 'letter-box';
      if (wordState.guesses[i]) {
        box.textContent = wordState.guesses[i].letters[j];
        box.classList.add(wordState.guesses[i].states[j]);
      } else if (i === wordState.attempts && wordState.currentGuess[j]) {
        box.textContent = wordState.currentGuess[j];
      }
      row.appendChild(box);
    }
    guessesContainer.appendChild(row);
  }
}

function handleKey(key) {
  if (wordState.attempts >= wordState.maxAttempts) return;
  if (gameMessage) gameMessage.textContent = '';
  if (key === '⌫') {
    wordState.currentGuess = wordState.currentGuess.slice(0, -1);
  } else if (key === 'ENTER') {
    if (wordState.currentGuess.length === currentPuzzle.word.length) {
      evaluateGuess();
    } else {
      if (gameMessage) {
        gameMessage.textContent = 'Not enough letters!';
        gameMessage.className = 'message error';
      }
    }
  } else {
    if (wordState.currentGuess.length < currentPuzzle.word.length) {
      wordState.currentGuess += key;
    }
  }
  renderGuesses();
}

function evaluateGuess() {
  const target = currentPuzzle.word.toUpperCase();
  const guess = wordState.currentGuess.toUpperCase();
  const states = Array.from({length: guess.length}, () => 'absent');
  const counts = {};
  for (let ch of target) counts[ch] = (counts[ch] || 0) + 1;
  for (let i=0;i<guess.length;i++){
    if (guess[i] === target[i]){ states[i] = 'correct'; counts[guess[i]]--; }
  }
  for (let i=0;i<guess.length;i++){
    if (states[i] === 'absent' && counts[guess[i]] > 0){ states[i] = 'present'; counts[guess[i]]--; }
  }
  wordState.guesses.push({ letters: guess.split(''), states });
  for (let i=0;i<guess.length;i++){
    const ch = guess[i]; const st = states[i];
    if (!wordState.keyboardState[ch] || (st === 'correct') || (st === 'present' && wordState.keyboardState[ch] !== 'correct')) {
      wordState.keyboardState[ch] = st;
    }
  }
  wordState.attempts++;
  if (attemptCount) attemptCount.textContent = wordState.attempts;
  if (guess === target) {
    if (gameMessage) {
      gameMessage.textContent = '🎉 Unlocked! ❤️';
      gameMessage.className = 'message success';
    }
    createConfetti();
    markUnlocked(selectedSecret.id);
    setTimeout(() => {
      closeGame();
      openSecret(selectedSecret);
    }, 900);
  } else if (wordState.attempts >= wordState.maxAttempts) {
    if (gameMessage) {
      gameMessage.textContent = `Out of attempts! Word was: ${target}`;
      gameMessage.className = 'message error';
    }
    setTimeout(() => closeGame(), 1400);
  }
  wordState.currentGuess = '';
  renderKeyboard();
  renderGuesses();
}

// capture physical keyboard for wordle when active
document.addEventListener('keydown', (e) => {
  if (!gameView || !gameView.classList.contains('active')) return;
  const key = e.key.toUpperCase();
  if (key === 'BACKSPACE') handleKey('⌫');
  else if (key === 'ENTER') handleKey('ENTER');
  else if (/^[A-Z]$/.test(key)) handleKey(key);
});

// ---------- Memory flow ----------
function openMemoryForSecret(secret) {
  selectedSecret = secret;
  if (memoryView) memoryView.classList.add('active');
  document.dispatchEvent(new CustomEvent('memory:start', { detail: { targetId: secret.id } }));
}
function closeMemory() {
  if (memoryView) memoryView.classList.remove('active');
}
document.addEventListener('memory:unlocked', (e) => {
  const id = e.detail && e.detail.id;
  if (id) {
    markUnlocked(id);
    closeMemory();
    openSecret(letters.find(l => l.id === id));
  }
});

// ---------- Gallery - fixed scattered layout (deterministic) ----------
function renderGalleryScattered() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;
  container.innerHTML = '';
  if (!container.style.height) container.style.height = '520px';

  // Deterministic layout positions - percentages so responsive
  const layout = [
    { left: '12%',  top: '55%', rot: -12, scale: 1.05, z: 102 },
    { left: '30%',  top: '42%', rot: 6,   scale: 1.08, z: 103 },
    { left: '47%',  top: '50%', rot: -6,  scale: 1.12, z: 104 },
    { left: '64%',  top: '44%', rot: 8,   scale: 1.06, z: 103 },
    { left: '82%',  top: '56%', rot: -4,  scale: 1.02, z: 102 }
  ];

  // inline SVG placeholder for fallback images
  const placeholderData = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-size="20" text-anchor="middle" fill="#9aa0a6" font-family="Arial">Image not available</text></svg>`
  );

  gallery.forEach((imgObj, idx) => {
    const pos = layout[idx % layout.length]; // cycle if more images than positions
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.style.left = pos.left;
    card.style.top = pos.top;
    card.style.zIndex = pos.z || (100 + idx);
    card.style.transform = `translate(-50%, -50%) rotate(${pos.rot}deg) scale(${pos.scale})`;

    const imgEl = document.createElement('img');
    imgEl.setAttribute('draggable', 'false');
    imgEl.alt = imgObj.alt || '';
    imgEl.src = imgObj.src;
    imgEl.onerror = () => {
      imgEl.classList.add('broken');
      imgEl.src = placeholderData;
    };

    const frame = document.createElement('div');
    frame.className = 'frame';
    frame.appendChild(imgEl);

    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = imgObj.caption || '';

    frame.appendChild(caption);
    card.appendChild(frame);

    // click opens gallery preview at the image index
    card.addEventListener('click', () => openLargeImage(imgObj));
    card.addEventListener('mousedown', () => card.style.zIndex = 9999);
    card.addEventListener('mouseup', () => card.style.zIndex = pos.z || (100 + idx));

    container.appendChild(card);
  });

  // re-render on resize (percent positions keep layout stable)
  if (!renderGalleryScattered._resizeAttached) {
    let to;
    window.addEventListener('resize', () => {
      clearTimeout(to);
      to = setTimeout(() => renderGalleryScattered(), 160);
    });
    renderGalleryScattered._resizeAttached = true;
  }
}

// ---------- Gallery preview with prev/next + keyboard navigation ----------
function showImageAt(index) {
  if (!gallery || gallery.length === 0 || !galleryModal) return;
  galleryCurrentIndex = ((index % gallery.length) + gallery.length) % gallery.length; // wrap
  const img = gallery[galleryCurrentIndex];

  // inject a full-screen overlay into galleryModal (overwrite any existing content)
  galleryModal.innerHTML = `
    <div class="gallery-overlay" role="dialog" aria-modal="true">
      <div class="gallery-inner">
        <button class="gallery-close-btn" aria-label="Close preview">✕</button>

        <button class="gallery-nav gallery-prev" aria-label="Previous photo">‹</button>
        <button class="gallery-nav gallery-next" aria-label="Next photo">›</button>

        <div class="preview-wrap">
          <div class="polaroid preview-polaroid" role="document" aria-label="${img.caption || 'Photo preview'}">
            <div class="frame">
              <img class="large-img" src="${img.src}" alt="${img.alt || ''}"
                onerror="this.classList.add('broken'); this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'600\\' height=\\'400\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'#f3f4f6\\'/><text x=\\'50%\\' y=\\'50%\\' font-size=\\'20\\' text-anchor=\\'middle\\' fill=\\'#9aa0a6\\' font-family=\\'Arial\\'>Image not available</text></svg>' />
              <div class="caption">${img.caption || ''}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // show modal and block page scroll
  galleryModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // wire buttons
  const closeBtn = galleryModal.querySelector('.gallery-close-btn');
  const prevBtn = galleryModal.querySelector('.gallery-prev');
  const nextBtn = galleryModal.querySelector('.gallery-next');

  if (closeBtn) closeBtn.addEventListener('click', closeGallery);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // keyboard handler saved on galleryModal for cleanup
  galleryModal._keyHandler = function (ev) {
    if (ev.key === 'Escape') {
      closeGallery();
    } else if (ev.key === 'ArrowLeft') {
      prevImage();
    } else if (ev.key === 'ArrowRight') {
      nextImage();
    }
  };
  document.addEventListener('keydown', galleryModal._keyHandler);
}

function openLargeImage(imgOrIndex) {
  if (!galleryModal) return;
  let idx = 0;
  if (typeof imgOrIndex === 'number') idx = imgOrIndex;
  else if (typeof imgOrIndex === 'object') {
    idx = gallery.findIndex(g => g.id === imgOrIndex.id);
    if (idx === -1) idx = 0;
  }
  showImageAt(idx);
}

function nextImage() {
  showImageAt(galleryCurrentIndex + 1);
}
function prevImage() {
  showImageAt(galleryCurrentIndex - 1);
}

function openGallery() {
  if (!galleryModal) return;
  galleryModal.classList.add('active');
  if (gallery && gallery.length) showImageAt(0);
}

function closeGallery() {
  if (!galleryModal) return;
  if (galleryModal._keyHandler) {
    document.removeEventListener('keydown', galleryModal._keyHandler);
    galleryModal._keyHandler = null;
  }
  galleryModal.classList.remove('active');
  galleryModal.innerHTML = '';
  document.body.style.overflow = '';
}
