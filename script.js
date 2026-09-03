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

document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const submitBtn = form.querySelector('.submit-btn');
  const name = document.getElementById('name').value.trim();
  const attendance = document.getElementById('attendance').value;
  const guests = document.getElementById('guests').value || '1';

  if (!name || !attendance) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const payload = new URLSearchParams({
    nombre: name,
    asistencia: attendance,
    cantidad: guests,
    fechaEnvio: new Date().toISOString()
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
