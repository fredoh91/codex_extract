import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';


// import 'dotenv/config'
import dotenv from 'dotenv';

// const envPath = path.resolve(__dirname, '..', '.env');
const currentUrl = import.meta.url;
const currentDir = path.dirname(fileURLToPath(currentUrl));
const envPath = path.resolve(currentDir, '..', '.env');
dotenv.config({ path: envPath });


// -------------------------------------------------------------------------------
// --            Création d'un pool de connexion pour la base CODEX_extract     --
// -------------------------------------------------------------------------------
/**
 * 
 * @returns pool
 */
async function createPoolCodexExtract() {
  try {
    const pool = mysql.createPool({
      host: process.env.CODEX_extract_HOST,
      user: process.env.CODEX_extract_USER,
      password: process.env.CODEX_extract_PASSWORD,
      database: process.env.CODEX_extract_DATABASE,
      charset: 'utf8mb4' // Ensure UTF-8 encoding
    });
    console.log('Pool BDD CODEX_extract ouvert');

    return pool;
  } catch (err) {
    console.error('Erreur à la connexion de CODEX_extract :', err);
    throw err;
  }
}



// -------------------------------------------------------------------------------
// --                          Ferme le pool CODEX_extract                      --
// -------------------------------------------------------------------------------
/**
 * 
 * @param {*} pool : pool vers SUSAR_EU qui sera fermé
 */
async function closePoolCodexExtract(pool) {
  try {
    console.log('Fermeture du pool vers la BDD CODEX_extract');
    pool.end();
  } catch (err) {
    console.error('Erreur à la fermeture de la connexion de CODEX_extract :', err);
    throw err;
  }
};

export {
  createPoolCodexExtract,
  closePoolCodexExtract,
};

