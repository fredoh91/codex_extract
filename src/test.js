
import { 
  createPoolCodexExtract,
  closePoolCodexExtract,
} from './db/dbMySQL.js';

import { 
  createPoolCodexOdbc,
  closePoolCodexOdbc,
} from './db/dbODBC.js';

import {
  donneTabCodeVU,
  trtLotCodeVU,
  donneSQL_select,
} from './db/requetes.js';

import {
  logStream , 
  logger,
  flushAndExit
} from './logs_config.js'

import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const currentUrl = import.meta.url;
const currentDir = path.dirname(fileURLToPath(currentUrl));
const envPath = path.resolve(currentDir, '.', '.env');
dotenv.config({ path: envPath });

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


const main = async () => {

  logger.info('Début import : CODEX => CODEX_extract');
  
  const poolCodexExtract = await createPoolCodexExtract();
  const connectionCodexExtract = await poolCodexExtract.getConnection();
  
  const poolCodexOdbc = await createPoolCodexOdbc();
  const connectionCodexOdbc = await poolCodexOdbc.connect();
  
  
  const sSQL_select = donneSQL_select("'60051704'");

  const results = await connectionCodexOdbc.query(sSQL_select);
  if (results.length > 0) {
    console.log('Results:', results[0]['nomVU']);
    const conv = iconv.decode(Buffer.from(results[0]['nomVU'], 'binary'), 'utf8');
    console.log('Converted:', conv);

    // const buffer = Buffer.from(results[0]['nomVU'], 'utf8');
    // console.log('Buffer:', buffer);
  }
  // const formattedDate = donneformattedDate();

  // const SQL_truncate = `TRUNCATE TABLE dashboard_rs_5 ;`
  // const res_truncate = await connectionCodexExtract.query(SQL_truncate);

  // const lstCodeVU = await donneTabCodeVU (connectionCodexOdbc,100);

  // // Collect all promises from the loop
  // const promises_trtCodeVU = lstCodeVU.map((codeVUArray, index) => {
  //   // const codeVUString = codeVUArray.map(codeVU => `'${codeVU}'`).join(',');
  //   // console.log('CodeVU String:', codeVUString);

  //   // Return the promise from trtLotCodeVU
  //   return trtLotCodeVU(codeVUArray, connectionCodexOdbc, connectionCodexExtract, formattedDate);
  // });

  // // Wait for all promises to resolve
  // await Promise.all(promises_trtCodeVU);



    // lstCodeVU.forEach((codeVUArray, index) => {
    //   // console.log(`Sous-tableau ${index + 1}:`, subArray);
    //   // const codeVUString = subArray.map(codeVU => `'${codeVU}'`).join(',');

    //   console.log('CodeVU String:', codeVUString);


    //   trtLotCodeVU (codeVUArray,connectionCodexOdbc,connectionCodexExtract)
    //     // Vous pouvez effectuer des opérations sur chaque sous-tableau ici
    //     // subArray.forEach(codeVU => {
    //     //     console.log('CodeVU:', codeVU);
    //     //     // Effectuer des opérations avec chaque codeVU
    //     // });
    // });
  
    await closePoolCodexExtract(poolCodexExtract);
    await closePoolCodexOdbc(poolCodexOdbc);

    logger.info('Fin import : CODEX => CODEX_extract');
  
  }
  
  main()