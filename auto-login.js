// Auto-Login für Testzwecke
// Führen Sie diesen Code in der Browser-Konsole aus

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4NGZkOGI4NmJlNWY0ZTI4OTQ2NTNjYiIsImZ1bGxOYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0sImlhdCI6MTczNDMyNzcwMiwiZXhwIjoxNzM0MzY0MTAyfQ.pQ5HLDUnIyNNKINj4T6uXE0fLqR3-a6w8BKX5k-3oek";

localStorage.setItem('token', token);
console.log('Token gesetzt. Seite wird neu geladen...');
window.location.reload();
