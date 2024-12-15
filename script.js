const { jsPDF } = window.jspdf;

const stepMap = {
    "corpo contenitore": "contenitore",
    "bascule": "bascule",
    "gancio": "gancio",
    "bocca": "bocche",
    "guida a terra": "guida",
    "adesivo": "adesivo",
    "optional": "optional"
};

const categoryMap = {
  "contenitore": "corpo contenitore",
  "bascule": "bascule",
  "gancio": "gancio",
  "bocche": "bocca",
  "guida": "guida a terra",
  "adesivo": "adesivo",
  "optional": "optional"
};

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cognome = document.getElementById('cognome').value.trim();
    const azienda = document.getElementById('azienda').value.trim();

    if(nome === "" || cognome === "" || azienda === "") {
        showWarningModal("Per favore, compila tutti i campi.");
        return;
    }

    document.getElementById('registration').style.display = 'none';
    document.getElementById('configurator').style.display = 'block';

    initConfigurator({ nome, cognome, azienda });
});

let configurazione = {};
configurazione.returnToResoconto = false;

configurazione.data = {
    volumes: ["1750L", "2100L", "2500L", "2700L", "3000L", "3750L"],
    configurazioni: {
        "corpo contenitore": {
            type: "corpo",
            prezzi: {
                "1750L": 520.00,
                "2100L": 550.00,
                "2500L": 600.00,
                "2700L": 650.00,
                "3000L": 650.00,
                "3750L": 710.00
            }
        },
        "bascule ferro": {
            type: "bascule",
            prezzi: {
                "1750L": 260.00,
                "2100L": 290.00,
                "2500L": 290.00,
                "2700L": 320.00,
                "3000L": 320.00,
                "3750L": 350.00
            }
        },
        "bascule hdpe": {
            type: "bascule",
            prezzi: {
                "1750L": 120.00,
                "2100L": 130.00,
                "2500L": 135.00,
                "2700L": 150.00,
                "3000L": 155.00,
                "3750L": 175.00
            }
        },
        "gancio F90": {
            type: "gancio",
            prezzi: {
                "1750L": 300.00,
                "2100L": 310.00,
                "2500L": 310.00,
                "2700L": 320.00,
                "3000L": 320.00,
                "3750L": 330.00
            }
        },
        "gancio ks": {
            type: "gancio",
            prezzi: {
              "1750L": 300.00,
              "2100L": 310.00,
              "2500L": 310.00,
              "2700L": 320.00,
              "3000L": 320.00,
              "3750L": 330.00
            }
        },
        "Feritoia (metallo)": {
            type: "bocca",
            prezzi: {
                "1750L": 195.00,
                "2100L": 205.00,
                "2500L": 195.00,
                "2700L": 220.00,
                "3000L": 205.00,
                "3750L": 220.00
            }
        },
        "Feritoia (Plastica)": {
            type: "bocca",
            prezzi: {
                "1750L": 70.00,
                "2100L": 80.00,
                "2500L": 70.00,
                "2700L": 90.00,
                "3000L": 80.00,
                "3750L": 90.00
            }
        },
        "Cassetto": {
            type: "bocca",
            prezzi: {
                "1750L": 295.00,
                "2100L": 305.00,
                "2500L": 295.00,
                "2700L": 310.00,
                "3000L": 305.00,
                "3750L": 310.00
            }
        },
         "Tamburo": {
            type: "bocca",
            prezzi: {
                "1750L": 295.00,
                "2100L": 305.00,
                "2500L": 295.00,
                "2700L": 310.00,
                "3000L": 305.00,
                "3750L": 310.00
            }
        },
        "Oblò": {
            type: "bocca",
            prezzi: {
              "1750L": 25.00,
              "2100L": 25.00,
              "2500L": 25.00,
              "2700L": 25.00,
              "3000L": 25.00,
              "3750L": 25.00
            }
        },
        "guida a terra metallo": {
            type: "guida",
            prezzi: {
                "1750L": 25.00,
                "2100L": 28.00,
                "2500L": 25.00,
                "2700L": 31.00,
                "3000L": 28.00,
                "3750L": 31.00
            }
        },
        "guida a terra hdpe": {
            type: "guida",
            prezzi: {
                "1750L": 16.00,
                "2100L": 18.00,
                "2500L": 16.00,
                "2700L": 19.00,
                "3000L": 18.00,
                "3750L": 19.00
            }
        },
        "adesivo": {
            type: "adesivo",
            prezzi: {
                "1750L": 26.40,
                "2100L": 28.40,
                "2500L": 26.40,
                "2700L": 32.40,
                "3000L": 28.40,
                "3750L": 32.40
            }
        },
        "optional": {
            "pedale": 77.00,
            "elettronica": 850.00,
            "sensore volumetrico": 105.00
        }
    }
};

function initConfigurator(userInfo) {
    configurazione.userInfo = userInfo;
    configurazione.selections = {};
    configurazione.prezzoTotale = 0;

    showStep('contenitore');
}

function showStep(step) {
    const configuratorDiv = document.getElementById('configurator');
    configuratorDiv.innerHTML = '';

    function avantiButton(nextStepName) {
        if (configurazione.returnToResoconto) {
            return `<button onclick="returnToResocontoHandler('${nextStepName}')">Avanti <i class="fas fa-arrow-right"></i></button>`;
        } else {
          if (step === 'contenitore') {
              return `<button onclick="validateContenitore('${nextStepName}')">Avanti <i class="fas fa-arrow-right"></i></button>`;
          }
          return `<button onclick="nextStep('${nextStepName}')">Avanti <i class="fas fa-arrow-right"></i></button>`;
        }
    }

    switch(step) {
        case 'contenitore':
            configuratorDiv.innerHTML = `
                <h2><i class="fas fa-box"></i> Seleziona il Contenitore</h2>
                <p class="intro-text">Scegli il volume del contenitore principale.</p>
                <select id="contenitore">
                    <option value="">-- Seleziona --</option>
                    ${configurazione.data.volumes.map(volume => `<option value="${volume}">${volume}</option>`).join('')}
                </select>
                <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
                <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
                <div class="button-group">
                    ${avantiButton('bascule')}
                </div>
            `;
            document.getElementById('contenitore').addEventListener('change', function() {
                const volume = this.value;
                if(volume) {
                    const prezzo = configurazione.data.configurazioni["corpo contenitore"].prezzi[volume];
                    configurazione.selections["corpo contenitore"] = { nome: "Corpo Contenitore (" + volume + ")", prezzo };
                } else {
                    delete configurazione.selections["corpo contenitore"];
                }
                updatePrice();
                updateDisplayedPrices(step);
            });
            break;

        case 'bascule':
          configuratorDiv.innerHTML = `
            <h2><i class="fas fa-pallet"></i> Seleziona il Tipo di Bascule</h2>
            <p class="intro-text">Scegli tra bascule in ferro o in HDPE.</p>
            <select id="bascule">
              <option value="">-- Seleziona --</option>
              <option value="bascule ferro">Bascule Ferro</option>
              <option value="bascule hdpe">Bascule HDPE</option>
            </select>
            <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
            <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
            <div class="button-group">
                <button onclick="prevStep('contenitore')"><i class="fas fa-arrow-left"></i> Indietro</button>
                ${avantiButton('gancio')}
            </div>
          `;
          document.getElementById('bascule').addEventListener('change', function() {
            const basculeType = this.value;
            if(basculeType && configurazione.selections["corpo contenitore"]) {
              const volume = getSelectedVolume();
                if(volume) {
                  const prezzo = configurazione.data.configurazioni[basculeType].prezzi[volume];
                  configurazione.selections["bascule"] = { nome: capitalize(basculeType), prezzo };
                }
            } else {
                delete configurazione.selections["bascule"];
            }
            updatePrice();
            updateDisplayedPrices(step);
          });
          break;

        case 'gancio':
          configuratorDiv.innerHTML = `
            <h2><i class="fas fa-link"></i> Seleziona il Tipo di Gancio</h2>
            <p class="intro-text">Scegli il tipo di gancio che preferisci (F90 o KS).</p>
            <select id="gancio">
              <option value="">-- Seleziona --</option>
              <option value="gancio F90">Gancio F90</option>
              <option value="gancio ks">Gancio KS</option>
            </select>
            <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
            <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
            <div class="button-group">
                <button onclick="prevStep('bascule')"><i class="fas fa-arrow-left"></i> Indietro</button>
                ${avantiButton('bocche')}
            </div>
          `;
          document.getElementById('gancio').addEventListener('change', function() {
              const gancioType = this.value;
              if(gancioType && configurazione.selections["corpo contenitore"]) {
                  const volume = getSelectedVolume();
                  if(volume) {
                      const prezzo = configurazione.data.configurazioni[gancioType].prezzi[volume];
                      configurazione.selections["gancio"] = { nome: capitalize(gancioType), prezzo };
                  }
              } else {
                  delete configurazione.selections["gancio"];
              }
            updatePrice();
            updateDisplayedPrices(step);
          });
          break;

      case 'bocche':
          configuratorDiv.innerHTML = `
              <h2><i class="fas fa-door-open"></i> Seleziona le Bocche</h2>
              <p class="intro-text">Scegli tra diverse tipologie di bocche (Feritoia, Cassetto, Tamburo, Oblò).</p>
              <select id="bocche">
                <option value="">-- Seleziona --</option>
                <option value="Feritoia (metallo)">Feritoia (Metallo)</option>
                <option value="Feritoia (Plastica)">Feritoia (Plastica)</option>
                <option value="Cassetto">Cassetto</option>
                <option value="Tamburo">Tamburo</option>
                <option value="Oblò">Oblò</option>
              </select>
                <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
                <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
              <div class="button-group">
                  <button onclick="prevStep('gancio')"><i class="fas fa-arrow-left"></i> Indietro</button>
                  ${avantiButton('guida')}
              </div>
          `;
          document.getElementById('bocche').addEventListener('change', function() {
              const boccaType = this.value;
              if(boccaType && configurazione.selections["corpo contenitore"]) {
                  const volume = getSelectedVolume();
                  if(volume) {
                      const prezzo = configurazione.data.configurazioni[boccaType].prezzi[volume];
                      configurazione.selections["bocca"] = { nome: boccaType, prezzo };
                  }
              } else {
                  delete configurazione.selections["bocca"];
              }
            updatePrice();
            updateDisplayedPrices(step);
          });
        break;
    
    case 'guida':
        configuratorDiv.innerHTML = `
            <h2><i class="fas fa-road"></i> Seleziona il Tipo di Guida a Terra</h2>
            <p class="intro-text">Scegli la guida a terra per il contenitore.</p>
            <select id="guida">
                <option value="">-- Seleziona --</option>
                <option value="guida a terra metallo">Guida a Terra Metallo</option>
                <option value="guida a terra hdpe">Guida a Terra HDPE</option>
            </select>
            <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
            <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
            <div class="button-group">
                <button onclick="prevStep('bocche')"><i class="fas fa-arrow-left"></i> Indietro</button>
                ${avantiButton('adesivo')}
            </div>
        `;
        document.getElementById('guida').addEventListener('change', function() {
            const guidaType = this.value;
              if(guidaType && configurazione.selections["corpo contenitore"]) {
                  const volume = getSelectedVolume();
                if(volume) {
                  const prezzo = configurazione.data.configurazioni[guidaType].prezzi[volume];
                  configurazione.selections["guida a terra"] = { nome: capitalize(guidaType), prezzo };
                }
            } else {
                delete configurazione.selections["guida a terra"];
            }
            updatePrice();
            updateDisplayedPrices(step);
        });
        break;
    
        case 'adesivo':
            configuratorDiv.innerHTML = `
              <h2><i class="fas fa-sticky-note"></i> Seleziona l'Adesivo</h2>
              <p class="intro-text">Aggiungi un adesivo personalizzato.</p>
              <select id="adesivo">
                <option value="">-- Seleziona --</option>
                <option value="adesivo">Adesivo Standard</option>
              </select>
                <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
                <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
              <div class="button-group">
                <button onclick="prevStep('guida')"><i class="fas fa-arrow-left"></i> Indietro</button>
                ${avantiButton('optional')}
              </div>
          `;
          document.getElementById('adesivo').addEventListener('change', function() {
              const adesivoType = this.value;
              if(adesivoType && configurazione.selections["corpo contenitore"]) {
                  const volume = getSelectedVolume();
                  if(volume) {
                      const prezzo = configurazione.data.configurazioni[adesivoType].prezzi[volume];
                      configurazione.selections["adesivo"] = { nome: capitalize(adesivoType), prezzo };
                  }
              } else {
                  delete configurazione.selections["adesivo"];
              }
              updatePrice();
            updateDisplayedPrices(step);
          });
          break;
    
    case 'optional':
        configuratorDiv.innerHTML = `
            <h2><i class="fas fa-plus-circle"></i> Seleziona gli Optional</h2>
            <p class="intro-text">Aggiungi funzioni extra al tuo contenitore.</p>
            <div class="optional-item">
              <label>
                <input type="checkbox" name="optional" value="pedale">
                Pedale (Apertura a Pedale)
              </label>
            </div>
            <div class="optional-item">
              <label>
                <input type="checkbox" name="optional" value="elettronica">
                Elettronica (Sistema di Monitoraggio)
              </label>
            </div>
            <div class="optional-item">
              <label>
                <input type="checkbox" name="optional" value="sensore volumetrico">
                Sensore Volumetrico (Livello di Riempimento)
              </label>
            </div>
              <p>Prezzo Selezione Corrente: <span class="prezzo-selezione-corrente">0.00</span> €</p>
                <p>Prezzo Totale: <span class="prezzo-totale">0.00</span> €</p>
              <div class="button-group">
                <button onclick="prevStep('adesivo')"><i class="fas fa-arrow-left"></i> Indietro</button>
                ${avantiButton('resoconto')}
              </div>
        `;
        configurazione.selections["optional"] = { nome: "Optional", items: [], prezzo: 0 };
          
        const checkboxes = document.querySelectorAll('input[name="optional"]');
        checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            configurazione.selections["optional"].items = [];
              checkboxes.forEach(selectedCb => {
                if (selectedCb.checked) {
                    const optName = selectedCb.value;
                      const optPrice = configurazione.data.configurazioni.optional[optName];
                      configurazione.selections["optional"].items.push({ nome: capitalize(optName), prezzo: optPrice });
                }
              });
              updatePrice();
                updateDisplayedPrices(step);
          });
      });
          break;      
    
    case 'resoconto':
      mostraResoconto();
        return;
    }

    updatePrice();
    updateDisplayedPrices(step);
}

function validateContenitore(nextStepName) {
    if (!configurazione.selections["corpo contenitore"]) {
        showWarningModal("Devi selezionare un contenitore prima di procedere.");
        return;
    }
    nextStep(nextStepName);
}

function returnToResocontoHandler(nextStepName) {
  if (nextStepName === 'bascule') {
      if (!configurazione.selections["corpo contenitore"]) {
        showWarningModal("Devi selezionare un contenitore prima di procedere.");
          return;
      }
    }
  returnToResoconto();
}


function nextStep(step) {
    showStep(step);
}

function prevStep(step) {
    showStep(step);
}

function updatePrice() {
  configurazione.prezzoTotale = 0;
    for(let categoria in configurazione.selections) {
        if (categoria === "optional") {
            let sumOptional = 0;
            configurazione.selections.optional.items.forEach(item => sumOptional += item.prezzo);
          configurazione.selections.optional.prezzo = sumOptional;
          configurazione.prezzoTotale += sumOptional;
        } else {
            configurazione.prezzoTotale += configurazione.selections[categoria].prezzo || 0;
        }
  }
}


function updateDisplayedPrices(step) {
    const categoria = categoryMap[step];
    let stepPrice = 0;
    
    if (categoria === "optional") {
        if (configurazione.selections["optional"] && configurazione.selections["optional"].items.length > 0) {
            stepPrice = configurazione.selections["optional"].prezzo;
      }
    } else {
      if (configurazione.selections[categoria]) {
        stepPrice = configurazione.selections[categoria].prezzo;
      }
    }
    
    const prezzoSelezioneElem = document.querySelector('.prezzo-selezione-corrente');
    const prezzoTotaleElem = document.querySelector('.prezzo-totale');

    if (prezzoSelezioneElem) prezzoSelezioneElem.textContent = stepPrice ? stepPrice.toFixed(2) : "0.00";
    if (prezzoTotaleElem) prezzoTotaleElem.textContent = configurazione.prezzoTotale.toFixed(2);
}

function mostraResoconto() {
  const configuratorDiv = document.getElementById('configurator');
    configuratorDiv.innerHTML = `<h2><i class="fas fa-list-alt"></i> Riepilogo delle Selezioni</h2><ul></ul>`;

  const ul = configuratorDiv.querySelector('ul');

  for(let categoria in configurazione.selections) {
        if (categoria === "optional") {
            if (configurazione.selections.optional.items.length > 0) {
              let optionalItems = configurazione.selections.optional.items.map(item => `<li>${item.nome} - €${item.prezzo.toFixed(2)}</li>`).join('');
                ul.innerHTML += `
                <li>
                  <div>
                  <strong>${capitalize(categoria)}</strong>:
                    <ul>${optionalItems}</ul>
                    </div>
                  <button class="modifica" onclick="modificaSelezione('optional')">Modifica</button>
                </li>
                `;
            }
        } else {
           ul.innerHTML += `
            <li>
              <div>
               <strong>${capitalize(categoria)}</strong>: ${configurazione.selections[categoria].nome} - €${configurazione.selections[categoria].prezzo.toFixed(2)}
              </div>
                <button class="modifica" onclick="modificaSelezione('${categoria}')">Modifica</button>
            </li>
            `;
        }
  }

  configuratorDiv.innerHTML += `
        <p><strong>Prezzo Totale:</strong> €${configurazione.prezzoTotale.toFixed(2)}</p>
        <button class="invia" onclick="inviaConfigurazione()">Invia <i class="fas fa-check"></i></button>
  `;
}

function modificaSelezione(categoria) {
  const step = stepMap[categoria];
  if(step) {
    configurazione.returnToResoconto = true;
    showStep(step);
  } else {
        alert('Passo non trovato per la modifica.');
  }
}


function inviaConfigurazione() {
  const doc = new jsPDF();
  
  // Image details: Replace 'path/to/your/logo.png' with the correct path or base64 string
  const logoPath = 'Logo.jpg';  // Update this with your image path
  const logoWidth = 50; // Adjust the width to control the size
  const logoHeight = 20; // Adjust height if needed
  const logoX = 10;  // X-coordinate position
  const logoY = 10;   // Y-coordinate position

  // Attempt to add the image, you may need to convert the image to base64 if needed
  try{
     doc.addImage(logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch(error){
     console.log("Errore caricamento logo: " + error);
  }

  doc.setFontSize(20);
  doc.text('Configurazione Utente', 105, logoY + logoHeight + 10, null, null, 'center');
  doc.setFontSize(12);
  doc.text(`Nome: ${configurazione.userInfo.nome}`, 20, logoY + logoHeight + 30);
  doc.text(`Cognome: ${configurazione.userInfo.cognome}`, 20, logoY + logoHeight + 40);
  doc.text(`Azienda: ${configurazione.userInfo.azienda}`, 20, logoY + logoHeight + 50);
  
  doc.setFontSize(16);
  doc.text('Selezioni:', 20, logoY + logoHeight + 70);
  doc.setFontSize(12);
  
  let y = logoY + logoHeight + 80;
  let selectionsText = "";
  for(let categoria in configurazione.selections) {
    if (categoria === "optional") {
          if (configurazione.selections.optional.items.length > 0) {
              selectionsText += `${capitalize(categoria)}:\n`;
            configurazione.selections.optional.items.forEach(item => {
              selectionsText += `- ${item.nome} - €${item.prezzo.toFixed(2)}\n`;
              doc.text(`- ${item.nome} - €${item.prezzo.toFixed(2)}`, 20, y);
              y += 10;
              });
            }
    } else {
        const selection = configurazione.selections[categoria];
        selectionsText += `${capitalize(categoria)}: ${selection.nome} - €${selection.prezzo.toFixed(2)}\n`;
        doc.text(`${capitalize(categoria)}: ${selection.nome} - €${selection.prezzo.toFixed(2)}`, 20, y);
        y += 10;
      }
  }

  doc.setFontSize(14);
  doc.text(`Prezzo Totale: €${configurazione.prezzoTotale.toFixed(2)}`, 20, y + 10);

  doc.save('resoconto.pdf');

  const toEmail = 'ayoub.majdouli@esa-italy.com';
  const subject = encodeURIComponent('Nuova Configurazione Utente');
  
  let body = `Nome: ${configurazione.userInfo.nome}\nCognome: ${configurazione.userInfo.cognome}\nAzienda: ${configurazione.userInfo.azienda}\n\n`;
  body += "Selezioni:\n" + selectionsText;
  body += `\nPrezzo Totale: €${configurazione.prezzoTotale.toFixed(2)}\n\nAllega il resoconto PDF.`;

  const encodedBody = encodeURIComponent(body);

  const mailtoLink = `mailto:${toEmail}?subject=${subject}&body=${encodedBody}`;
  
  const emailLink = document.getElementById('emailLink');
  emailLink.href = mailtoLink;

  openModal();
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function openModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'block';
}


function closeModal() {
    const modal = document.getElementById('messageModal');
  modal.style.display = 'none';
}


window.onclick = function(event) {
  const modal = document.getElementById('messageModal');
    const wModal = document.getElementById('warningModal');
    if (event.target == modal) {
        modal.style.display = 'none';
  }
  if (event.target == wModal) {
        wModal.style.display = 'none';
    }
}

function returnToResoconto() {
    configurazione.returnToResoconto = false;
    mostraResoconto();
}


function getSelectedVolume() {
    const selection = configurazione.selections["corpo contenitore"];
    if (selection) {
        const match = selection.nome.match(/\((.*?)\)/);
        return match ? match[1] : null;
    }
    return null;
}

function showWarningModal(message) {
  const warningModal = document.getElementById('warningModal');
  const warningMessageText = document.getElementById('warningMessageText');
    warningMessageText.textContent = message;
  warningModal.style.display = 'block';
}

function closeWarningModal() {
    const warningModal = document.getElementById('warningModal');
    warningModal.style.display = 'none';
}