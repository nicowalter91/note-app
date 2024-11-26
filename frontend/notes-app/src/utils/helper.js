// Validiert eine E-Mail-Adresse mithilfe eines regulären Ausdrucks (Regex).
// Überprüft, ob die E-Mail-Adresse das richtige Format hat.
export const validateEmail = (email) => {
    // Der reguläre Ausdruck stellt sicher, dass die E-Mail die Struktur 'name@domain.com' hat.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);  // Gibt true zurück, wenn die E-Mail gültig ist, ansonsten false.
}

// Holt die Initialen eines Namens (maximal 2 Initialen für den ersten und zweiten Vornamen).
// Wenn der Name nicht gültig ist oder leer ist, wird ein leerer String zurückgegeben.
export const getInitials = (name) => {
    // Wenn der Name ungültig oder kein String ist, geben wir einen leeren String zurück.
    if (!name || typeof name !== 'string') return "";

    // Teilt den Namen anhand von Leerzeichen in ein Array.
    const words = name.split(" ");
    let initials = "";

    // Maximiert die Initialen auf 2 (falls der Name aus mehr als 2 Wörtern besteht).
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        // Nimmt den ersten Buchstaben jedes Wortes und fügt ihn zu den Initialen hinzu.
        initials += words[i][0];
    }

    // Gibt die Initialen in Großbuchstaben zurück.
    return initials.toUpperCase();
};
