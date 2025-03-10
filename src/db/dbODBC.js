// import mysql from 'mysql2/promise';
import odbc from 'odbc';
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
// --            Création d'un pool de connexion pour la base CODEX via ODBC    --
// -------------------------------------------------------------------------------
/**
 * 
 * @returns pool
 */
async function createPoolCodexOdbc() {
  try {
    const connectionConfig = {
      connectionString: `DSN=${process.env.CODEX_ODBC_NAME};
                        Uid=${process.env.CODEX_USER};
                        Pwd=${process.env.CODEX_PASSWORD};
                        CHARSET=UTF8`,
      connectionTimeout: 10,
      loginTimeout: 10,
    };

    const pool = await odbc.pool(connectionConfig);
    
    console.log('Pool BDD CODEX/ODBC ouvert');

    return pool;
  } catch (err) {
    console.error('Erreur à la connexion de CODEX/ODBC :', err);
    throw err;
  }
}



// -------------------------------------------------------------------------------
// --                          Ferme le pool CODEX via ODBC                     --
// -------------------------------------------------------------------------------
/**
 * 
 * @param {*} pool : pool vers SUSAR_EU qui sera fermé
 */
async function closePoolCodexOdbc(pool) {
  try {
    console.log('Fermeture du pool vers la BDD CODEX/ODBC');
    pool.close();
  } catch (err) {
    console.error('Erreur à la fermeture de la connexion de CODEX/ODBC :', err);
    throw err;
  }
};

export {
  createPoolCodexOdbc,
  closePoolCodexOdbc,
};

