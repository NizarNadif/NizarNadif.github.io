const regioni = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json";
const province = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province-latest.json";
const layer = 'https://api.mapbox.com/styles/v1/sbibbof/ckh85yt2l10cy19mvx6xf4d30/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2JpYmJvZiIsImEiOiJja2dyMHBqaGswOWR2MnpvN3E4OWFpbGNuIn0.qAXx979h5T2-NOhIv3sCRg';

let posRoma = {
    lat: 41.879156,
    long: 12.457727
};

let pos = {
    lat: posRoma.lat,
    long: posRoma.long
};

let mappa = new L.Map('mappa');

function success(position) {
    pos.lat = position.coords.latitude;
    pos.long = position.coords.longitude;
}

function error() {
    pos.lat = 41.879156;
    pos.long = 12.457727;
}

async function draw(url) {
    //faccio la fetch all'API della protezione civile
    const data = await fetch(url).then(r => r.json());
    let modRegioni = data[0].denominazione_provincia == null;

    //rimuovo una eventuale mappa aggiunta precedentemente
    mappa.remove();

    /*creo una mappa nella quale non si può uscire dai
    limiti imposti, Budapest (Romania) e Setif (Tunisia).
    La mappa è centrata su Roma.*/
    mappa = new L.Map('mappa', {
        container: 'map',
        center: new L.LatLng(pos.lat, pos.long),
        zoom: 6,
        minZoom: 6,
        maxBounds: [
            [47.4979, 19.0402],
            [36.1898, 5.4108]
        ],
        layers: new L.TileLayer(layer)
    });

    //per ogni dato (provincia o regione), creo un cerchio
    //con dimensioni e colori variabili
    for (const i in data) {
        if (data[i].lat != null && data[i].long != null) {
            const luogo = data[i];
            let diametro = 0;
            let bordo, fill;
            if (luogo.totale_casi >= 20000) {
                if (modRegioni) diametro = 5;
                else diametro = 4;
                bordo = 'red';
                fill = 'red';
            } else if (luogo.totale_casi >= 15000) {
                if (modRegioni) diametro = 4;
                else diametro = 3.5;
                bordo = 'orange';
                fill = 'orange';
            } else if (luogo.totale_casi >= 10000) {
                diametro = 3;
                bordo = 'orange';
                fill = 'orange';
            } else {
                diametro = 1.5;
                bordo = 'yellow';
                fill = 'yellow';
            }
            if (modRegioni) diametro *= 10000;
            else diametro *= 6000;

            //creo il cerchio e lo aggiungo nella mappa
            const cerchio = L.circle([luogo.lat, luogo.long], diametro, {
                color: bordo,
                fillColor: fill,
                fillOpacity: 0.6
            }).addTo(mappa);

            //se premo un cerchio creo (e riempio con dei dati) una tabella
            //nella card a sinistra e faccio comparire un popup nella mappa
            cerchio.on("click", function() {
                let nome = luogo.denominazione_regione;
                if (!modRegioni)
                    nome += ' - ' + luogo.denominazione_provincia;

                //creo il popup e lo aggiungo alla mappa
                const popup = L.popup()
                    .setLatLng(L.latLng(luogo.lat, luogo.long))
                    .setContent('<p><b>' + nome + '</b><br>' + luogo.totale_casi + ' casi totali</p>')
                    .openOn(mappa);

                /*----------------------------------- creo e compilo la tabella -----------------------------------*/

                document.getElementById('titoloCard').innerHTML = nome;
                const card_body = document.getElementById("bodyCard");
                card_body.innerHTML = '';

                /*--------------------------- Aggiungo le note ---------------------------*/
                if (luogo.note != null && luogo.note != '') {
                    const elNote = document.createElement("p");
                    elNote.innerText = luogo.note;
                    card_body.appendChild(elNote);
                }

                //Pubblicazione
                let pubblicazione = document.createElement("p");
                pubblicazione.className = "card-text";
                card_body.appendChild(pubblicazione);
                let pubblicazioneSmall = document.createElement("small");
                pubblicazioneSmall.className = "text-muted";
                pubblicazioneSmall.innerHTML = getData(luogo.data);
                pubblicazione.appendChild(pubblicazioneSmall);

                /*--------------------------- Creo la tabella ---------------------------*/
                const tabella = document.createElement("table");
                card_body.appendChild(tabella);
                tabella.className = 'table table-striped table-hover';

                /*--------------------- Intestazione della tabella ---------------------*/
                const tabella_head = document.createElement("thead");
                tabella_head.className = 'thead-dark';
                tabella.appendChild(tabella_head);

                const head_colonna_prima = document.createElement("th");
                tabella_head.appendChild(head_colonna_prima);
                head_colonna_prima.scope = 'col';
                head_colonna_prima.innerText = '#';

                const head_colonna_seconda = document.createElement("th");
                tabella_head.appendChild(head_colonna_seconda);
                head_colonna_seconda.scope = 'col';
                head_colonna_seconda.innerText = 'numero';

                /*------------------------- Corpo della tabella -------------------------*/
                const tabella_body = document.createElement("tbody");
                tabella.appendChild(tabella_body);

                tabella_body.appendChild(getRiga('Codice regione', luogo.codice_regione));

                if (!modRegioni) {
                    tabella_body.appendChild(getRiga('Codice provincia', luogo.codice_provincia));
                    tabella_body.appendChild(getRiga('Casi totali', luogo.totale_casi));
                } else {
                    tabella_body.appendChild(getRiga('Casi totali', luogo.totale_casi));
                    tabella_body.appendChild(getRiga('Totale positivi', luogo.totale_positivi));
                    tabella_body.appendChild(getRiga('Dimessi guariti', luogo.dimessi_guariti));
                    tabella_body.appendChild(getRiga('Deceduti', luogo.deceduti));
                    tabella_body.appendChild(getRiga('Terapia intensiva', luogo.terapia_intensiva));
                    tabella_body.appendChild(getRiga('Totale ospedalizzati', luogo.totale_ospedalizzati));
                    tabella_body.appendChild(getRiga('Isolamento domiciliare', luogo.isolamento_domiciliare));
                    tabella_body.appendChild(getRiga('Ricoverati con sintomi', luogo.ricoverati_con_sintomi));
                    tabella_body.appendChild(getRiga('Tamponi', luogo.tamponi));
                    tabella_body.appendChild(getRiga('Casi testati', luogo.casi_testati));
                    tabella_body.appendChild(getRiga('Nuovi positivi', luogo.nuovi_positivi));
                    tabella_body.appendChild(getRiga('Variazione totale positivi', luogo.variazione_totale_positivi));
                    tabella_body.appendChild(getRiga('Casi da sospetto diagnostico', luogo.casi_da_sospetto_diagnostico));
                    tabella_body.appendChild(getRiga('Casi da screening', luogo.casi_da_screening));
                }
            });
        }
    };

    //se non ho ancora aggiornato la posizione attuale, lo faccio
    if (pos.lat == posRoma.lat && pos.long == posRoma.long) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else L.marker([pos.lat, pos.long]).addTo(mappa);
}

function cambiaTipo() {
    if (document.getElementById("toggleLuogo").checked) {
        this.draw(regioni);
    } else this.draw(province);
}

this.draw(regioni);

function getRiga(testo_colonna_prima, testo_colonna_seconda) {
    const riga = document.createElement("tr");
    const colonna_prima = document.createElement("th");
    colonna_prima.scope = 'row';
    colonna_prima.innerText = testo_colonna_prima;

    const colonna_seconda = document.createElement("td");
    colonna_seconda.innerText = testo_colonna_seconda;

    riga.appendChild(colonna_prima);
    riga.appendChild(colonna_seconda);
    return riga;
}

function getData(data) {
    let anno = data.slice(0, 4);
    let mese = data.slice(5, 7);
    let nomeMese;
    switch (mese) {
        case '01':
            nomeMese = 'gennaio';
            break;
        case '02':
            nomeMese = 'febbraio';
            break;
        case '03':
            nomeMese = 'marzo';
            break;
        case '04':
            nomeMese = 'aprile';
            break;
        case '05':
            nomeMese = 'maggio';
            break;
        case '06':
            nomeMese = 'giugno';
            break;
        case '07':
            nomeMese = 'luglio';
            break;
        case '08':
            nomeMese = 'agosto';
            break;
        case '09':
            nomeMese = 'settembre';
            break;
        case '10':
            nomeMese = 'ottobre';
            break;
        case '11':
            nomeMese = 'novembre';
            break;
        case '12':
            nomeMese = 'dicembre';
            break;
        default:
            nomeMese = '';
            break;
    }
    let giorno = data.slice(8, 10);
    let ora = data.slice(11, 16);
    return 'dati aggiornati il ' + giorno + ' ' + nomeMese + ' ' + anno + ' alle ' + ora;
}