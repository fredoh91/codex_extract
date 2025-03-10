import {
  logStream , 
  logger,
} from '../logs_config.js'

async function donneTabCodeVU (connectionCodexOdbc,nbCodeVU) {
    const SQL_CodeVU = `SELECT DISTINCT VU.codeVU
                                    FROM VU 
                                    INNER JOIN VUTitulaires 	ON VU.codeVU = VUTitulaires.codeVU
                                    INNER JOIN StatutSpeci 		ON VU.codeStatut = StatutSpeci.codeTerme
                                    INNER JOIN Presentations 	ON VU.codeVU = Presentations.codeVU
                                    INNER JOIN Composants	 	ON VU.codeVU = Composants.codeVU
                                    WHERE StatutSpeci.codeTerme = 1
                                    AND VUTitulaires.indicValide = 1
                                    AND Presentations.flagActif = 0
                                    AND Composants.codeNature = 3
                                    ;`
    try {
        const lstComplete = await connectionCodexOdbc.query(SQL_CodeVU);

        const codeVUArray = lstComplete.map(item => item.codeVU);

        const chunkedArray = chunkArray(codeVUArray, nbCodeVU);

        return chunkedArray

    } catch (err) {
      console.error(erreur);
    } finally {
    }
  }

  async function trtLotCodeVU (codeVUArray, connectionCodexOdbc, connectionCodexExtract, formattedDate) {
    const codeVUString = codeVUArray.map(codeVU => `'${codeVU}'`).join(',');
    const sSQL_select = donneSQL_select(codeVUString);
    const results = await connectionCodexOdbc.query(sSQL_select);
    if (results.length > 0) {
        const SQL_insert = `INSERT INTO dashboard_rs_5 (
                            codeVU, 
                            codeCIS, 
                            codeDossier,
                            nomVU, 
                            typeProcedure, 
                            CodeATC, 
                            LibATC, 
                            forme_pharma, 
                            voie_admin, 
                            statutSpecialite, 
                            codeTerme, 
                            codeProduit, 
                            indicValide,
                            codeCIP13,
                            nomPresentation,
                            nomSubstance,
                            dosageLibra, 
                            ClasseACP_libCourt,
                            date_extract) VALUES ?`;
      const values = results.map(row => [
                            row.codeVU, 
                            row.codeCIS, 
                            row.codeDossier, 
                            row.nomVU,
                            row.typeProcedure,
                            row.CodeATC, 
                            row.LibATC, 
                            row.forme_pharma, 
                            row.voie_admin, 
                            row.statutSpecialite, 
                            row.codeTerme,
                            row.codeProduit, 
                            row.indicValide,
                            row.codeCIP13, 
                            row.nomPresentation, 
                            row.nomSubstance, 
                            row.dosageLibra, 
                            row.ClasseACP_libCourt,
                            formattedDate
                          ]);                          
      await connectionCodexExtract.query(SQL_insert, [values]);
      logger.info(`Insertion de ${results.length} lignes dans dashboard_rs_5`);

    }
  }


  function donneSQL_select(lstCodeVU_string='') {
    const sSQL_select = `SELECT DISTINCT
                            VU.codeVU,
                            VU.codeCIS,
                            VU.codeDossier,
                            VU.nomVU,
                            Autorisation.libAbr AS typeProcedure,
                            ClasseATC.libAbr AS CodeATC,
                            ClasseATC.libCourt AS LibATC,
                            VUElements.nomElement AS forme_pharma,
                            VoieAdmin.libCourt AS voie_admin,
                            StatutSpeci.libAbr AS statutSpecialite,
                            StatutSpeci.codeTerme,
                            VU.codeProduit,
                            VUTitulaires.indicValide,
                            Presentations.codeCIP13,
                            Presentations.nomPresentation,
                            NomsSubstance.nomSubstance,
                            Composants.dosageLibra
                            ,
                          (SELECT ClasseACP.libCourt
                              FROM VUClassesACP
                              INNER JOIN ClasseACP ON VUClassesACP.codeClasACP = ClasseACP.codeTerme
                              WHERE VUClassesACP.codeVU = VU.codeVU
                              AND ClasseACP.codeTermePere = 300) AS ClasseACP_libCourt	
                          FROM VU
                          INNER JOIN Autorisation 	ON VU.codeAutorisation = Autorisation.codeTerme
                          INNER JOIN VUClassesATC 	ON VU.codeVU = VUClassesATC.codeVU
                          INNER JOIN ClasseATC 		ON VUClassesATC.codeClasATC = ClasseATC.codeTerme
                          INNER JOIN VUTitulaires 	ON VU.codeVU = VUTitulaires.codeVU
                          INNER JOIN StatutSpeci 		ON VU.codeStatut = StatutSpeci.codeTerme
                          INNER JOIN VUElements 		ON VU.codeVU = VUElements.codeVU
                          INNER JOIN VUVoiesAdmin	 	ON VU.codeVU = VUVoiesAdmin.codeVU
                          INNER JOIN VoieAdmin	 	ON VUVoiesAdmin.codeVoie = VoieAdmin.codeTerme
                          INNER JOIN Presentations 	ON VU.codeVU = Presentations.codeVU
                          INNER JOIN Composants	 	ON VU.codeVU = Composants.codeVU
                          INNER JOIN NomsSubstance 	ON Composants.codeNomSubstance = NomsSubstance.codeNomSubstance
                          WHERE StatutSpeci.codeTerme = 1
                            AND VUTitulaires.indicValide = 1
                            AND Presentations.flagActif = 0
                            AND Composants.codeNature = 3
                            ${lstCodeVU_string ? `AND VU.codeVU IN (${lstCodeVU_string})` : ''}
                          ORDER BY VU.codeVU, Presentations.codeCIP13
                            `;  
    return sSQL_select;
  }

  function chunkArray(array, chunkSize) {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
          const chunk = array.slice(i, i + chunkSize);
          result.push(chunk);
      }
      return result;
  }


  export {
    donneTabCodeVU,
    trtLotCodeVU,
    donneSQL_select,
  }