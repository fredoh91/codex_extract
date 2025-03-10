
/**
 * Cette fonction est utilisée pour les tests, elle pourra etre supprimée quand le script sera en PROD
 * @param {*} length 
 * @returns 
 */
function generateRandomString(length = 4) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

function donneformattedDate() {
  const now = new Date();

  // Utiliser des méthodes pour obtenir la date et l'heure locales
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export {
  generateRandomString,
  donneformattedDate,
};