// memory.js - Enhanced memory match game with better feedback
// Simple memory match (uses emoji pairs).
// Listens for "memory:start" events and dispatches "memory:unlocked" on success.

const images = [
  '🍓','🍓','🍩','🍩','🌻','🌻','🎈','🎈'
];

let boardEl = null;
let flipped = [];
let matched = 0;
let targetMatches = 3; // number of pairs required to unlock
let currentSecretId = null;
let attempts = 0;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function createCelebration() {
  const msg = document.getElementById('memoryMessage');
  if (msg) {
    msg.textContent = '🎉 You won! Secret unlocked!';
    msg.style.color = '#059669';
    msg.style.fontSize = '1.2rem';
    msg.style.fontWeight = 'bold';
  }
}

function buildBoard() {
  boardEl = document.getElementById('memoryBoard');
  if (!boardEl) return;
  boardEl.innerHTML = '';
  const deck = images.slice();
  shuffle(deck);
  deck.forEach((sym, i) => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.dataset.index = i;
    card.dataset.symbol = sym;
    card.setAttribute('aria-label', 'Card ' + (i + 1));
    card.innerHTML = `<div class="card-face card-front">?</div><div class="card-face card-back">${sym}</div>`;
    card.addEventListener('click', () => flipCard(card));
    boardEl.appendChild(card);
  });
  matched = 0;
  flipped = [];
  attempts = 0;
  const msg = document.getElementById('memoryMessage');
  if (msg) {
    msg.textContent = `Match ${targetMatches} pairs to unlock`;
    msg.style.color = '#6b7280';
  }
}

function flipCard(card) {
  if (!card || card.classList.contains('matched') || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  flipped.push(card);
  if (flipped.length === 2) {
    const a = flipped[0].dataset.symbol;
    const b = flipped[1].dataset.symbol;
    if (a === b) {
      flipped[0].classList.add('matched');
      flipped[1].classList.add('matched');
      matched++;
      attempts++;
      const msg = document.getElementById('memoryMessage');
      if (msg) {
        msg.textContent = `✨ Match! ${matched}/${targetMatches}`;
        msg.style.color = '#059669';
      }
      if (matched >= targetMatches) {
        setTimeout(() => {
          createCelebration();
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('memory:unlocked', { detail: { id: currentSecretId } }));
          }, 600);
        }, 400);
      }
      flipped = [];
    } else {
      attempts++;
      setTimeout(() => {
        flipped.forEach(c => c.classList.remove('flipped'));
        const msg = document.getElementById('memoryMessage');
        if (msg) {
          msg.textContent = `Try again! Attempts: ${attempts}`;
          msg.style.color = '#dc2626';
        }
        flipped = [];
      }, 700);
    }
  }
}

document.addEventListener('memory:start', (e) => {
  currentSecretId = (e.detail && e.detail.targetId) || null;
  buildBoard();
});

export function stopMemory() {
  if (boardEl) boardEl.innerHTML = '';
}
