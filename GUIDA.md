# Sito di Alejandro Juan Ferrante: guida completa

Questa guida spiega come funziona il sito, come metterlo online sul tuo dominio Aruba e come aggiornarlo. Va seguita **una volta sola** per la messa online. Dopo, per aggiungere opere o mostre basta il pannello `/admin`.

---

## 1. Come funziona, in breve

```
  Tu o tuo padre                    GitHub                            Internet
 ┌──────────────┐  salva  ┌──────────────────────────┐  pubblica  ┌──────────────────────────┐
 │ pannello      │ ──────▶ │ repository (i file del    │ ─────────▶ │ www.alejandroferrante.it │
 │ /admin        │         │ sito) + GitHub Actions    │  ~1-2 min  │ (GitHub Pages)           │
 └──────────────┘         └──────────────────────────┘            └──────────────────────────┘
```

- **GitHub** è un servizio gratuito che conserva i file del sito e tutta la loro storia. Ogni modifica è salvata, quindi niente si perde e si può sempre tornare indietro.
- Un **repository** ("repo") è la cartella del progetto su GitHub.
- **GitHub Actions** è un "robot" di GitHub. Ogni volta che i file cambiano, costruisce il sito: ottimizza le foto e crea le pagine nelle tre lingue.
- **GitHub Pages** è l'hosting gratuito di GitHub, cioè il server che mostra il sito su internet.
- **Aruba** resta dove hai comprato il dominio. Lì cambierai solo un paio di impostazioni (DNS) per dire al dominio di puntare a GitHub.
- Il **pannello /admin** (Sveltia CMS) è un programma che si apre nel browser. Modifica i file su GitHub al posto tuo, con moduli semplici.

Costi: GitHub, GitHub Pages e il pannello sono gratuiti. Paghi solo il dominio ad Aruba, come già fai.

---

## 2. Cosa c'è in questa cartella

| Cartella / file | A cosa serve |
|---|---|
| `src/content/` | **I contenuti** (opere, periodi, biografia, mostra, libri…). È quello che modifica il pannello |
| `src/assets/uploads/` | Le foto caricate |
| `src/pages/`, `src/components/`, `src/layouts/`, `src/styles/` | **La grafica e il codice** delle pagine |
| `src/i18n/ui.ts` | Le scritte fisse del sito (menu, pulsanti) in EN / IT / ES |
| `public/admin/` | Il pannello di amministrazione (`config.yml` = cosa si può modificare) |
| `public/CNAME` | Il tuo dominio (serve a GitHub Pages) |
| `astro.config.mjs` | Impostazioni generali (qui va il dominio) |
| `.github/workflows/deploy.yml` | Le istruzioni per il "robot" che pubblica il sito |
| `package.json`, `package-lock.json` | L'elenco degli strumenti usati (Astro, ecc.) |

Il sito è fatto con **Astro**, uno strumento che trasforma questi file in pagine web leggere e veloci.

> Le immagini e i testi attuali sono **segnaposto** (“Sample work 1”, “[Paragraph 1…]”). Li sostituirete dal pannello.

---

## 3. Dati del sito (già inseriti)

| | |
|---|---|
| Dominio | **www.alejandroferrante.it** |
| Utente GitHub | **alejferrante** |
| Nome del repository | **alejandroferrante** (va usato esattamente questo, vedi 4.3) |

Questi valori sono già scritti in `astro.config.mjs`, `public/CNAME` e `public/admin/config.yml`. Se un giorno cambiassi nome utente o repository, vanno aggiornati lì.

### Prima di toccare i DNS: il vecchio sito su Aruba
Il dominio oggi mostra il vecchio sito ospitato da Aruba. Quando cambierai i DNS (punto 5) al suo posto comparirà il nuovo. Prima di farlo:
1. **Salva i contenuti del vecchio sito** che possono servire: testi della biografia, foto dei quadri, elenco delle mostre, articoli. Sono materiale utile da caricare nel nuovo.
2. **Controlla se c'è una casella email** `@alejandroferrante.it`. Se c'è, non toccare i record MX: la posta continuerà a funzionare.
3. Lascia **attivo il pacchetto Aruba** almeno finché il nuovo sito funziona. Poi potrai valutare se ti serve ancora l'hosting o basta il dominio (con l'eventuale email). Prima di disdire, chiedi ad Aruba cosa succede alla posta.

---

## 4. Mettere il progetto su GitHub

### 4.1 Crea l'account (già fatto: `alejferrante`)
1. Vai su https://github.com e premi **Sign up**. Scegli un nome utente semplice: comparirà negli indirizzi tecnici, non sul sito.
2. Conferma l'email.
3. Consigliato: attiva la verifica in due passaggi (Settings → Password and authentication).

### 4.2 Installa GitHub Desktop (il modo più semplice, senza terminale)
1. Scarica **GitHub Desktop** da https://desktop.github.com e installalo.
2. Aprilo e accedi con l'account appena creato.

### 4.3 Carica la cartella "Sito Web"
1. In GitHub Desktop: **File → Add Local Repository…** e scegli la cartella `Sito Web` sulla Scrivania.
2. Ti dirà che non è ancora un repository: premi **create a repository** (o *Initialize Git repository*). Lascia nome e opzioni come sono e conferma.
3. In basso a sinistra scrivi un messaggio, per esempio `Prima versione del sito`, e premi **Commit to main**.
4. In alto premi **Publish repository**:
   - nome: **`alejandroferrante`**, esattamente così: il pannello /admin cerca questo nome
   - **togli la spunta "Keep this code private"**. Su un account gratuito GitHub Pages funziona solo con repository pubblici. Non è un problema: contiene solo il sito, che è comunque pubblico.
5. Fatto: su https://github.com/alejferrante/alejandroferrante vedi tutti i file.

> **Commit** = un salvataggio con una descrizione. **Push/Publish** = mandare i salvataggi su GitHub.

### 4.4 Attiva la pubblicazione (GitHub Pages)
1. Sul sito di GitHub apri il repository → **Settings** → **Pages** (menu a sinistra).
2. In *Build and deployment* → *Source* scegli **GitHub Actions**.
3. Vai nella scheda **Actions** del repository. Se il robot "Pubblica il sito" non è già partito, aprilo e premi **Run workflow**.
4. Dopo 1–2 minuti diventa verde ✅. Il sito sarà raggiungibile su **www.alejandroferrante.it** appena colleghi il dominio (punto 5). Prima di allora l'indirizzo provvisorio può mostrarsi senza stile: è normale, perché il sito è già impostato sul dominio definitivo.

---

## 5. Collegare il dominio Aruba

### 5.1 Su GitHub
1. Repository → **Settings → Pages → Custom domain**: scrivi `www.alejandroferrante.it` e premi **Save**.
2. Consigliato (protegge il dominio): icona del profilo → **Settings → Pages → Add a domain** e segui le istruzioni. GitHub ti chiede di aggiungere su Aruba un record **TXT** di verifica.

### 5.2 Su Aruba
1. Entra nell'**Area Clienti** di Aruba → scegli il dominio → **Gestione DNS** (o *Pannello DNS*).
2. Per il dominio senza www (`alejandroferrante.it`, spesso indicato con `@` o lasciato vuoto) imposta **quattro record A**:

   | Tipo | Nome | Valore |
   |---|---|---|
   | A | @ (vuoto) | 185.199.108.153 |
   | A | @ (vuoto) | 185.199.109.153 |
   | A | @ (vuoto) | 185.199.110.153 |
   | A | @ (vuoto) | 185.199.111.153 |

   Ci saranno già dei record A che puntano al vecchio sito Aruba: **sostituiscili** con questi quattro. Se ci sono record **AAAA** per il dominio o per www, eliminali.
3. Per `www` imposta un **record CNAME**. Se esiste già un record A o CNAME per `www`, sostituiscilo:

   | Tipo | Nome | Valore |
   |---|---|---|
   | CNAME | www | `alejferrante.github.io` |

4. **Non toccare** i record **MX** e quelli legati alla posta: l'email del dominio, se ce l'hai, continua a funzionare.
5. Salva. La propagazione richiede da pochi minuti a qualche ora, a volte fino a 24.

### 5.3 Attiva il lucchetto (HTTPS)
Quando GitHub ha verificato il dominio (Settings → Pages mostra la spunta verde), spunta **Enforce HTTPS**. Il certificato è gratuito e si rinnova da solo.

> Gli indirizzi IP qui sopra sono quelli indicati da GitHub. Prima di inserirli conviene controllarli nella documentazione ufficiale: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

---

## 6. Il pannello di amministrazione `/admin`

Si apre su **https://www.alejandroferrante.it/admin**.

### 6.1 Primo accesso (una volta per computer o telefono)
Per ora il pannello si sblocca con una **chiave di accesso** (token) di GitHub:

1. Su GitHub: icona del profilo → **Settings** → **Developer settings** (in fondo) → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Compila:
   - *Token name*: `Pannello sito`
   - *Expiration*: una durata lunga, per esempio 1 anno (e segnati la data)
   - *Repository access*: **Only select repositories** → scegli il repository del sito
   - *Permissions → Repository permissions → Contents*: **Read and write**
3. Premi **Generate token** e copia la chiave (inizia con `github_pat_…`). Viene mostrata una volta sola.
4. Apri `/admin`, premi **Sign In with Token** (Accedi con token) e incolla la chiave.

Il browser se la ricorda. Tienila riservata come una password.

**Per tuo padre:** il modo più ordinato è che si crei un suo account GitHub gratuito. Tu lo aggiungi al repository da *Settings → Collaborators → Add people*, poi lui genera la sua chiave come sopra. In alternativa puoi creargli tu una chiave e inserirla sul suo computer.

> Più avanti si può sostituire la chiave con un normale pulsante **“Accedi con GitHub”**. Richiede circa 15 minuti di configurazione su Cloudflare (gratuita): si chiama *Sveltia CMS Authenticator*.

### 6.2 Cosa trovi nel pannello
- **Opere**: tutti i quadri. "New" (Nuova) per aggiungerne uno: foto, titolo, anno, misure, tecnica, venduto, periodo. Puoi raggrupparli per periodo dal menu della lista.
- **Periodi**: nome nelle 3 lingue, anni, posizione (1 = in alto).
- **Home**: il quadro a tutto schermo, la parte da tenere visibile, il colore del nome, la velatura.
- **Biografia**: foto e testo nelle 3 lingue.
- **Mostre**: la barra grande in cima alla pagina Mostre (interruttore on/off, frase grande, luogo, date; finita la mostra, sparisce da sola) e le **foto delle mostre passate**, ognuna con un titolo piccolo sotto.
- **Libri**: copertine, trascinabili per cambiare l'ordine.
- **Premi**: foto degli attestati, targhe e medaglie, con un titolo sotto. Interruttore per mostrare o nascondere la pagina.
- **Stampa**: articoli, trascinabili per cambiare l'ordine. Interruttore **"Mostra la pagina Stampa sul sito"**: se lo spegni la pagina sparisce dal sito e dal menu, ma gli articoli restano salvati; riaccendilo quando vuoi.
- **Video**: link di YouTube e opera da mostrare accanto.
- **Critica**: le recensioni, con testo in 3 lingue e autore.
- **Contatti**, **Barra in alto**: email, telefono, social, colori e trasparenza della barra.

### 6.3 Aggiungere un quadro
1. **Opere → New**
2. Trascina la foto (anche grande, dal telefono va benissimo: il pannello la rimpicciolisce da solo)
3. Titolo (solo il nome dell'opera), anno, misure, tecnica (dal menu, oppure scritta a mano in "Altra tecnica"), la spunta "Venduto" se serve, periodo; eventualmente la spunta "Mostra in anteprima nella home"
4. **Save** (Salva)
5. Dopo 1–2 minuti è online. Puoi seguire l'avanzamento nella scheda **Actions** su GitHub.

### 6.4 Lingue
Il testo inglese è quello principale: se manca la traduzione italiana o spagnola, il sito mostra l'inglese. I titoli delle opere non si traducono. Lo spagnolo delle scritte fisse del sito usa la forma argentina (*vos*).

---

## 7. Modifiche alla grafica

Colori, caratteri, impaginazione, nuove sezioni: sono modifiche al **codice** (`src/`), non ai contenuti. Il modo più comodo è chiederle a Claude, che lavora sulla cartella, e poi:

1. In **GitHub Desktop** vedi l'elenco dei file cambiati.
2. Scrivi un messaggio (es. `Barra più sottile`) → **Commit to main** → **Push origin**.
3. Dopo 1–2 minuti il sito è aggiornato.

⚠️ Prima di modificare file dal computer, in GitHub Desktop premi **Fetch/Pull origin**. Così scarichi le modifiche fatte nel frattempo dal pannello (per esempio un quadro aggiunto da tuo padre).

---

## 8. Vedere il sito sul tuo computer prima di pubblicarlo (facoltativo)

Serve **Node.js** (versione 22 o più recente, da https://nodejs.org). Dal Terminale, nella cartella del sito:

```bash
npm install      # la prima volta: scarica gli strumenti (cartella node_modules)
npm run dev      # apre l'anteprima su http://localhost:4321 e si aggiorna a ogni modifica
npm run build    # costruisce il sito finale nella cartella dist (per controllo)
```

---

## 9. Problemi comuni

| Problema | Soluzione |
|---|---|
| Ho salvato ma il sito non cambia | Aspetta 2 minuti e ricarica. Controlla la scheda **Actions** su GitHub: se c'è una ❌ rossa, aprila e mandami il messaggio d'errore |
| Il pannello dice che la chiave non è valida | La chiave è scaduta o non ha il permesso *Contents: Read and write*: generane una nuova |
| Il dominio non funziona | La propagazione DNS può richiedere ore. Controlla i record su Aruba e la spunta in Settings → Pages |
| Ho cancellato qualcosa per sbaglio | Su GitHub ogni modifica è nella cronologia (*History*): si può recuperare tutto |
| Una foto non compare | Controlla che l'opera abbia la foto e il periodo selezionati |

---

## 10. Strumenti usati
- [Astro](https://astro.build): costruisce il sito
- [Sveltia CMS](https://sveltiacms.app): il pannello `/admin`
- [GitHub Pages](https://pages.github.com): l'hosting
- Caratteri: Cormorant Garamond e Jost, ospitati sul sito stesso, senza richieste a Google
