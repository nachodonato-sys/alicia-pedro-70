function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP');

  if (!sheet) {
    throw new Error('No existe una hoja llamada RSVP');
  }

  const p = e.parameter;

  sheet.appendRow([
    new Date(),
    p.nombre || '',
    p.asistencia || '',
    p.cantidad || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
