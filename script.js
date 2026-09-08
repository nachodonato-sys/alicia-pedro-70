const eventDate = new Date('2026-12-13T13:00:00-03:00');

function updateCountdown(){
  const now = new Date();
  let diff = eventDate - now;

  if(diff <= 0){
    ['days','hours','minutes','seconds'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  diff %= 60000;
  const seconds = Math.floor(diff / 1000);

  document.getElementById('days').textContent = String(days).padStart(3,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('calendarBtn').addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alicia y Pedro 70//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:alicia-pedro-70-20261213@example.local',
    'DTSTAMP:20260903T134900Z',
    'DTSTART;TZID=America/Argentina/Buenos_Aires:20261213T130000',
    'SUMMARY:Cumpleaños 70 de Alicia & Pedro',
    'LOCATION:La Escondida de Palermo, Av. de los Ombúes 32, Ciudad Autónoma de Buenos Aires',
    'DESCRIPTION:Celebramos los 70 de Alicia y Pedro. Dress code: Elegante Sport.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Cumple-70-Alicia-y-Pedro.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzdiplBgwG-Zm5axXKHQwigk2WbfePw4x4xVFFjfUx2skLFKu9C3CfhwvfHKvEmAXC0Lw/exec';


const attendanceSelect = document.getElementById('attendance');
const guestsSelect = document.getElementById('guests');
const attendeeFields = document.getElementById('attendeeFields');
const declineNameField = document.getElementById('declineNameField');
const declineNameInput = document.getElementById('declineName');

const foodOptions = [
  'Sin restricciones',
  'Vegetariano/a',
  'Vegano/a',
  'Celíaco/a / Sin TACC'
];

function renderAttendees(count){
  attendeeFields.innerHTML = '';

  for(let i = 1; i <= count; i++){
    const card = document.createElement('div');
    card.className = 'attendee-card';

    const options = foodOptions
      .map(option => `<option value="${option}">${option}</option>`)
      .join('');

    card.innerHTML = `
      <h3>Asistente ${i}</h3>
      <label>
        Nombre y apellido
        <input
          type="text"
          id="attendeeName${i}"
          name="attendeeName${i}"
          placeholder="Nombre y apellido"
          required
        />
      </label>

      <label>
        Restricción alimentaria
        <select
          id="attendeeFood${i}"
          name="attendeeFood${i}"
          required
        >
          ${options}
        </select>
      </label>
    `;

    attendeeFields.appendChild(card);
  }
}

function syncRsvpFields(){
  const isComing = attendanceSelect.value === 'Sí, vamos a estar';
  const isNotComing = attendanceSelect.value === 'No vamos a poder';

  if(isNotComing){
    guestsSelect.innerHTML = '<option value="0">0 asistentes</option>';
    guestsSelect.value = '0';
    guestsSelect.disabled = true;
    attendeeFields.innerHTML = '';
    declineNameField.hidden = false;
    declineNameInput.required = true;
    return;
  }

  if(isComing){
    declineNameField.hidden = true;
    declineNameInput.required = false;
    declineNameInput.value = '';
    guestsSelect.disabled = false;

    if(!guestsSelect.querySelector('option[value="1"]')){
      guestsSelect.innerHTML = `
        <option value="">Elegí la cantidad</option>
        <option value="1">1 asistente</option>
        <option value="2">2 asistentes</option>
        <option value="3">3 asistentes</option>
        <option value="4">4 asistentes</option>
        <option value="5">5 asistentes</option>
      `;
    }

    renderAttendees(Number(guestsSelect.value) || 0);
    return;
  }

  declineNameField.hidden = true;
  declineNameInput.required = false;
  declineNameInput.value = '';
  guestsSelect.disabled = true;
  guestsSelect.innerHTML = `
    <option value="">Elegí la cantidad</option>
    <option value="1">1 asistente</option>
    <option value="2">2 asistentes</option>
    <option value="3">3 asistentes</option>
    <option value="4">4 asistentes</option>
    <option value="5">5 asistentes</option>
  `;
  attendeeFields.innerHTML = '';
}

attendanceSelect.addEventListener('change', syncRsvpFields);

guestsSelect.addEventListener('change', () => {
  if(attendanceSelect.value === 'Sí, vamos a estar'){
    renderAttendees(Number(guestsSelect.value) || 0);
  }
});

syncRsvpFields();

document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const submitBtn = form.querySelector('.submit-btn');
  const attendance = attendanceSelect.value;
  const guests = attendance === 'No vamos a poder' ? 0 : Number(guestsSelect.value || 0);

  if(!attendance) return;
  if(attendance === 'Sí, vamos a estar' && (guests < 1 || guests > 5)) return;

  const declineName = attendance === 'No vamos a poder'
    ? declineNameInput.value.trim()
    : '';

  if(attendance === 'No vamos a poder' && !declineName) return;

  const attendeeData = [];
  if(attendance === 'Sí, vamos a estar'){
    for(let i = 1; i <= guests; i++){
      const name = document.getElementById(`attendeeName${i}`).value.trim();
      const food = document.getElementById(`attendeeFood${i}`).value;
      if(!name) return;
      attendeeData.push({name, food});
    }
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const payload = new URLSearchParams({
    asistencia: attendance,
    cantidad: String(guests),
    nombreNoAsiste: declineName,
    asistente1: attendeeData[0]?.name || '',
    alimentacion1: attendeeData[0]?.food || '',
    asistente2: attendeeData[1]?.name || '',
    alimentacion2: attendeeData[1]?.food || '',
    asistente3: attendeeData[2]?.name || '',
    alimentacion3: attendeeData[2]?.food || '',
    asistente4: attendeeData[3]?.name || '',
    alimentacion4: attendeeData[3]?.food || '',
    asistente5: attendeeData[4]?.name || '',
    alimentacion5: attendeeData[4]?.food || ''
  });

  try {
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: payload.toString()
    });

    form.innerHTML = `
      <div class="success-message">
        <p class="kicker">¡Gracias!</p>
        <h3>Tu respuesta quedó registrada.</h3>
        <p>Nos vemos el 13 de diciembre.</p>
      </div>
    `;
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirmar asistencia';
    alert('No pudimos registrar tu respuesta. Por favor, intentá nuevamente.');
  }
});
