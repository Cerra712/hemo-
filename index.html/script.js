const seatStatesMap = new Map();  // idSala => Map(seat => estado)
const seatTimersMap = new Map();  // idSala => Map(seat => tiempo)

function createSeats(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`No existe contenedor con id ${containerId}`);
    return;
  }

  seatStatesMap.set(containerId, new Map());
  seatTimersMap.set(containerId, new Map());

  for (let i = 1; i <= count; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");

    seat.innerHTML = `
      <svg class="seat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="70" fill="currentColor">
        <rect x="10" y="15" width="44" height="35" rx="10" ry="10"/>
        <rect x="8" y="15" width="6" height="40" rx="2" ry="2"/>
        <rect x="50" y="15" width="6" height="40" rx="2" ry="2"/>
        <rect x="20" y="50" width="24" height="8" rx="3" ry="3"/>
        <rect x="22" y="58" width="8" height="8" rx="3" ry="3"/>
        <rect x="34" y="58" width="8" height="8" rx="3" ry="3"/>
      </svg>
      <div class="seat-number">${i}</div>
      <div class="seat-time"></div>
    `;

    container.appendChild(seat);

    seatStatesMap.get(containerId).set(seat, 0);
    const timeLabel = seat.querySelector(".seat-time");

    seat.addEventListener("click", () => handleSeatClick(containerId, seat, timeLabel));
  }
}

function handleSeatClick(containerId, seat, label) {
  const states = seatStatesMap.get(containerId);
  const timers = seatTimersMap.get(containerId);

  const state = states.get(seat);

  if (state === 0) {
    seat.classList.add("occupied");
    seat.classList.remove("countdown");
    states.set(seat, 1);
    const startTime = Date.now();
    timers.set(seat, startTime);
    updateElapsedTime(containerId, seat, label);
  } else if (state === 1) {
    seat.classList.remove("occupied");
    seat.classList.add("countdown");
    states.set(seat, 2);
    const endTime = Date.now() + 40 * 60 * 1000; // 40 minutos
    timers.set(seat, endTime);
    updateCountdown(containerId, seat, label);
  } else {
    seat.classList.remove("countdown");
    label.innerText = "";
    states.set(seat, 0);
    timers.delete(seat);
  }
}

function updateElapsedTime(containerId, seat, label) {
  const states = seatStatesMap.get(containerId);
  const timers = seatTimersMap.get(containerId);

  if (states.get(seat) !== 1) return;

  const startTime = timers.get(seat);
  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  label.innerText = `${minutes}m\n${seconds}s`;

  setTimeout(() => {
    if (states.get(seat) === 1) updateElapsedTime(containerId, seat, label);
  }, 1000);
}

function updateCountdown(containerId, seat, label) {
  const states = seatStatesMap.get(containerId);
  const timers = seatTimersMap.get(containerId);

  if (states.get(seat) !== 2) return;

  const endTime = timers.get(seat);
  const remaining = endTime - Date.now();

  if (remaining <= 0) {
    label.innerText = `0m\n0s`;
    seat.classList.remove("countdown");
    states.set(seat, 0);
    timers.delete(seat);
    return;
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  label.innerText = `${minutes}m\n${seconds}s`;

  setTimeout(() => {
    if (states.get(seat) === 2) updateCountdown(containerId, seat, label);
  }, 1000);
}

// Crear las salas
createSeats("sala0", 6);
createSeats("sala1", 14);
createSeats("sala2", 9);
createSeats("sala3", 11);
createSeats("sala4", 17);
createSeats("sala5",14);
createSeats("sala6",9);
createSeats("sala7",10);
createSeats("sala8",19);
createSeats("sala9",11);
createSeats("sala10",15);
createSeats("sala11",10);
createSeats("sala12",10);

