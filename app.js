/* Ravenscourt & Fils — logique du site (pas besoin de toucher ce fichier :
   les textes, codes et œuvres sont dans donnees.js) */
(function () {
  "use strict";

  /* ---------- outils ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const calque = $("#calque");
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const memo = {
    get(k) { try { return sessionStorage.getItem("rf_" + k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem("rf_" + k, v); } catch (e) {} },
    clear() { try { Object.keys(sessionStorage).filter((k) => k.startsWith("rf_")).forEach((k) => sessionStorage.removeItem(k)); } catch (e) {} },
  };

  function imageUrl(img, large) {
    if (!img) return "";
    if (/^https?:\/\//.test(img) || img.startsWith("images/")) return img;
    return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(img) + "?width=" + (large ? 1280 : 500);
  }

  function imgTag(o, large) {
    // si l'image ne charge pas, on affiche un cartel élégant à la place
    return `<img src="${imageUrl(o.image, large)}" alt="${esc(o.titre)}" loading="lazy" onerror="rfFallback(this)">`;
  }
  window.rfFallback = function (img) {
    const d = document.createElement("div");
    d.className = "fallback";
    d.textContent = "✦ " + img.alt;
    img.replaceWith(d);
  };

  const STATUTS = {
    disponible: "Disponible",
    reserve: "Réservé",
    vendu: "Vendu",
    noncessible: "Non cessible",
    expertise: "En expertise",
  };
  const CATS = { I: "Cat. I — Antiquités", II: "Cat. II — Maîtres flamands", III: "Cat. III — Symbolistes & visionnaires" };

  let ouvert = null; // fenêtre actuellement ouverte
  function fermer() {
    calque.innerHTML = "";
    ouvert = null;
    document.body.style.overflow = "";
  }
  function ouvrir(nom, html) {
    calque.innerHTML = html;
    ouvert = nom;
    document.body.style.overflow = "hidden";
  }

  /* ---------- noms des PNJ dans la page ---------- */
  document.querySelectorAll(".pnj-proprio").forEach((el) => (el.textContent = PNJ.proprietaire.nom));

  /* =========================================================
     GALERIE
     ========================================================= */
  const galerie = $("#galerie");
  function afficherGalerie(cat) {
    const liste = OEUVRES.filter((o) => cat === "tous" || o.catalogue === cat);
    galerie.innerHTML = liste
      .map(
        (o) => `
      <button class="card fade-up" data-inv="${esc(o.inventaire)}">
        <div class="frame">
          ${imgTag(o, false)}
          ${o.statut !== "disponible" ? `<span class="badge ${o.statut}">${STATUTS[o.statut] || o.statut}</span>` : ""}
        </div>
        <div class="card-meta">
          <div class="inv">${esc(o.inventaire)} · ${esc(CATS[o.catalogue] || "")}</div>
          <h3>${esc(o.titre)}</h3>
          <div class="artist">${esc(o.artiste)}, ${esc(o.date)}</div>
        </div>
      </button>`
      )
      .join("");
  }
  afficherGalerie("tous");

  $("#filtres").addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    document.querySelectorAll(".filter").forEach((f) => f.classList.toggle("on", f === b));
    afficherGalerie(b.dataset.cat);
  });

  galerie.addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (!c) return;
    const o = OEUVRES.find((x) => x.inventaire === c.dataset.inv);
    if (o) ouvrirOeuvre(o);
  });

  function ouvrirOeuvre(o) {
    ouvrir(
      "oeuvre",
      `<div class="overlay" data-close>
        <div class="lightbox fade-up">
          <div class="lb-img">${imgTag(o, true)}</div>
          <div class="lb-txt">
            <div class="inv">${esc(CATS[o.catalogue] || "")}</div>
            <h2>${esc(o.titre)}</h2>
            <div class="artist" style="font-style:italic;color:var(--parchment-dim)">${esc(o.artiste)}</div>
            <dl>
              <dt>Inventaire</dt><dd>${esc(o.inventaire)}</dd>
              <dt>Date</dt><dd>${esc(o.date)}</dd>
              <dt>Technique</dt><dd>${esc(o.technique)}</dd>
              <dt>Statut</dt><dd>${esc(STATUTS[o.statut] || o.statut)}</dd>
            </dl>
            <p class="notice">${esc(o.notice)}</p>
            <button class="btn-outline" data-close style="margin-top:14px">Fermer</button>
          </div>
        </div>
      </div>`
    );
  }

  calque.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) fermer();
  });

  /* =========================================================
     ACCÈS 1 — ESPACE CLIENT
     ========================================================= */
  let essaisClient = 0;
  let clientBloqueJusqua = 0;

  $("#btn-connexion").addEventListener("click", () => {
    if (memo.get("bureau")) return ouvrirBureau(memo.get("mode") || "client");
    ouvrir(
      "client",
      `<div class="overlay" data-close>
        <form class="modal fade-up" id="f-client" autocomplete="off">
          <p class="kicker">Espace client</p>
          <h2>Connexion</h2>
          <label class="field"><span>Identifiant</span><input name="id" spellcheck="false" autofocus></label>
          <label class="field"><span>Mot de passe</span><input name="mdp" type="password"></label>
          <p class="err" id="err-client"></p>
          <button class="btn-gold" type="submit">Se connecter</button>
          <button class="cancel" type="button" data-close>Annuler</button>
        </form>
      </div>`
    );
    $("#f-client input").focus();
    $("#f-client").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const err = $("#err-client");
      if (Date.now() < clientBloqueJusqua) {
        err.textContent = "Compte temporairement verrouillé. Réessayez plus tard.";
        return;
      }
      const ok = norm(f.id.value) === norm(CONFIG.client.identifiant) && f.mdp.value.trim().toLowerCase() === CONFIG.client.motDePasse.toLowerCase();
      if (ok) {
        essaisClient = 0;
        fermer();
        ouvrirBureau("client");
        return;
      }
      essaisClient++;
      f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");
      if (essaisClient >= CONFIG.client.tentativesAvantBlocage) {
        clientBloqueJusqua = Date.now() + 60000;
        essaisClient = 0;
        err.textContent = "Trop de tentatives. Compte verrouillé pendant 60 secondes.";
      } else {
        err.textContent = "Identifiants invalides. Cet espace est réservé aux clients enregistrés.";
      }
    });
  });

  /* =========================================================
     ACCÈS 2 — ACCÈS TECHNIQUE (lien secret en bas)
     ========================================================= */
  const LOG_ECHEC = [
    "connexion à extranet.ravenscourt-arts.internal...",
    "vérification des identifiants...",
    "échec — identifiants refusés",
    "analyse du trafic sortant... anomalie détectée",
    "un service tiers a intercepté cette tentative",
  ];
  const LOG_OK = [
    "connexion à extranet.ravenscourt-arts.internal...",
    "vérification des identifiants...",
    "compte de maintenance reconnu",
    "ouverture d'une session miroir sur le poste R. MONTERO",
  ];

  $("#btn-technique").addEventListener("click", () => {
    if (ouvert) return;
    ouvrir(
      "technique",
      `<div class="overlay">
        <div class="modal modal-tech fade-up">
          <div class="tech-bar"><span>● extranet.ravenscourt-arts.internal</span><button data-close aria-label="Fermer">✕</button></div>
          <form class="tech-body" id="f-tech" autocomplete="off">
            <p class="kicker" style="color:#7a756d;font-family:var(--mono);font-size:10px;letter-spacing:.3em;text-transform:uppercase">Panneau de maintenance — accès restreint</p>
            <h2>Authentification requise</h2>
            <label class="field" style="margin-top:20px"><span>Identifiant réseau</span><input name="id" spellcheck="false"></label>
            <label class="field"><span>Mot de passe</span><input name="mdp" type="password"></label>
            <button class="btn-tech" type="submit">Authentifier la session</button>
            <p style="font-family:var(--mono);font-size:10px;color:#5a564f;text-align:center;margin:14px 0 0">réservé au personnel ARGUS Sécurité — toute tentative est journalisée</p>
          </form>
        </div>
      </div>`
    );
    $("#f-tech input").focus();
    $("#f-tech").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      const ok = norm(f.id.value) === norm(CONFIG.technique.identifiant) && f.mdp.value.trim().toLowerCase() === CONFIG.technique.motDePasse.toLowerCase();
      const lignes = ok ? LOG_OK : LOG_ECHEC;
      const box = document.createElement("div");
      box.className = "log";
      f.replaceWith(box);
      for (let i = 0; i < lignes.length; i++) {
        await wait(480);
        if (ouvert !== "technique") return;
        const p = document.createElement("p");
        p.textContent = "> " + lignes[i];
        if (i === lignes.length - 1) p.className = "hl";
        box.appendChild(p);
      }
      await wait(800);
      if (ouvert !== "technique") return;
      fermer();
      ok ? ouvrirBureau("technique") : ouvrirTerminal();
    });
  });

  /* =========================================================
     ACCÈS 3 — TERMINAL DE HACK
     ========================================================= */
  const BOOT = [
    "RAVENSCOURT INTERNAL NETWORK — TERMINAL D'ACCÈS DISTANT",
    "liaison sécurisée... établie",
    "pare-feu détecté : ARGUS-10  (mise à jour du 28/09)",
    "recherche de porte dérobée... port 31 : FERMÉ",
    "recherche alternative... tunnel de maintenance ARGUS trouvé",
    "",
    "Le tunnel exige un code de contournement.",
    "  → entrez le code, ou",
    "  → tapez FORCE pour une attaque par force brute (lente, laisse des traces)",
    "  → tapez AIDE pour la liste des commandes",
  ];
  let terminalBloqueJusqua = 0;

  function ouvrirTerminal() {
    if (memo.get("bureau")) return ouvrirBureau(memo.get("mode") || "fantome");
    if (Date.now() < terminalBloqueJusqua) {
      const s = Math.ceil((terminalBloqueJusqua - Date.now()) / 1000);
      ouvrir("terminal", `<div class="overlay"><div class="term"><div class="term-bar"><span>argus-shell</span><button data-close>[ESC] fermer</button></div><div class="term-out"><div class="bad">connexion refusée — adresse source sur liste noire (${s} s)</div></div></div></div>`);
      return;
    }
    ouvrir(
      "terminal",
      `<div class="overlay">
        <div class="term">
          <div class="term-bar"><span>argus-shell — accès distant</span><button data-close>[ESC] fermer</button></div>
          <div class="term-out" id="t-out"></div>
          <form class="term-form" id="t-form" style="display:none"><span>&gt;</span><input id="t-in" placeholder="code de contournement..." spellcheck="false" autocomplete="off"></form>
          <div class="trace"><span>TRACE</span><div class="trace-bar"><i id="t-trace"></i></div><span id="t-pct">0%</span></div>
        </div>
      </div>`
    );
    const out = $("#t-out"), form = $("#t-form"), input = $("#t-in");
    let trace = 0, occupe = false;

    const ecrire = (txt, cls) => {
      const d = document.createElement("div");
      d.textContent = txt;
      if (cls) d.className = cls;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
    };
    const setTrace = (v) => {
      trace = Math.max(0, Math.min(100, v));
      $("#t-trace").style.width = trace + "%";
      $("#t-pct").textContent = Math.round(trace) + "%";
    };
    const seq = async (lignes, ms) => {
      for (const l of lignes) {
        await wait(ms);
        if (ouvert !== "terminal") return false;
        Array.isArray(l) ? ecrire(l[0], l[1]) : ecrire(l);
      }
      return true;
    };
    const succes = async (cle) => {
      const fin = await seq(
        [
          `> injection de la clé « ${cle} »`,
          "contournement du chiffrement AES-signature...",
          "[####------] 41%",
          "[#######---] 74%",
          "ARGUS-10 en boucle : signal brouillé",
          "[##########] 100%",
          "accès non journalisé — session fantôme ouverte",
          ["avertissement : dossiers sensibles protégés par phrase de passe personnelle", "warn"],
          "",
          "poste de travail : R. MONTERO",
        ],
        260
      );
      if (!fin) return;
      await wait(900);
      fermer();
      ouvrirBureau("fantome");
    };
    const coupure = async () => {
      ecrire("TRACE COMPLÈTE — connexion coupée par ARGUS-10", "bad");
      ecrire("adresse source mise sur liste noire pour 60 secondes", "bad");
      form.style.display = "none";
      terminalBloqueJusqua = Date.now() + 60000;
      await wait(2200);
      if (ouvert === "terminal") fermer();
    };

    (async () => {
      if (!(await seq(BOOT, 200))) return;
      form.style.display = "flex";
      input.focus();
    })();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (occupe) return;
      const v = input.value.trim();
      input.value = "";
      if (!v) return;
      ecrire("> " + v);
      const cmd = v.toLowerCase();

      if (cmd === "aide" || cmd === "help") {
        ecrire("  <code>   tenter un code de contournement");
        ecrire("  FORCE    attaque par force brute (≈" + CONFIG.hack.dureeForceBruteSecondes + " s, augmente la trace)");
        ecrire("  EXIT     fermer le terminal");
        return;
      }
      if (cmd === "exit" || cmd === "quit") return fermer();

      if (cmd === "force") {
        occupe = true;
        form.style.display = "none";
        ecrire("lancement de l'attaque par dictionnaire sur le tunnel ARGUS...", "warn");
        const total = CONFIG.hack.dureeForceBruteSecondes * 1000;
        const pas = 25;
        for (let i = 1; i <= pas; i++) {
          await wait(total / pas);
          if (ouvert !== "terminal") return;
          const n = Math.round((i / pas) * 10);
          const essai = Math.random().toString(36).slice(2, 8).toUpperCase() + "-" + Math.floor(Math.random() * 99);
          ecrire(`[${"#".repeat(n)}${"-".repeat(10 - n)}] essai ${essai} ... refusé`);
          setTrace(trace + 2.6);
        }
        occupe = false;
        return succes("dictionnaire · combinaison trouvée");
      }

      const bon = CONFIG.hack.accepterToutCode || CONFIG.hack.codesContournement.some((c) => norm(c) === norm(v));
      if (bon) {
        occupe = true;
        form.style.display = "none";
        return succes(v);
      }
      ecrire("code rejeté par ARGUS-10", "bad");
      setTrace(trace + 25);
      if (trace >= 100) coupure();
    });
  }

  /* raccourcis secrets : taper le mot secret, ou Ctrl+Alt+R */
  let tampon = "";
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ouvert && ouvert !== "bureau") return fermer();
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      if (!ouvert) ouvrirTerminal();
      return;
    }
    if (ouvert) return;
    if (e.key.length === 1) {
      const mot = CONFIG.hack.motSecretClavier.toLowerCase();
      tampon = (tampon + e.key.toLowerCase()).slice(-mot.length);
      if (tampon === mot) { tampon = ""; ouvrirTerminal(); }
    }
  });

  /* =========================================================
     LE BUREAU — BOÎTE MAIL
     ========================================================= */
  const MODES = {
    client: "session client authentifiée",
    technique: "session de maintenance — miroir",
    fantome: "session non journalisée",
  };
  const DOSSIERS = [
    { id: "reception", nom: "Réception" },
    { id: "envoyes", nom: "Envoyés" },
    { id: "chiffre", nom: PNJ.primogene.initiales + " — chiffré" },
  ];
  const lus = new Set();
  let dossierCourant = "reception";
  let mailCourant = null;
  let essaisCoffre = 0;
  let coffreBloqueJusqua = 0;
  let alerteAffichee = false;

  function ouvrirBureau(mode) {
    memo.set("bureau", "1");
    memo.set("mode", mode);
    ouvrir(
      "bureau",
      `<div class="bureau">
        <header class="bureau-head">
          <div>
            <p class="kicker">${esc(MODES[mode] || MODES.fantome)}</p>
            <h1>Bureau personnel — ${esc(PNJ.proprietaire.nom)}</h1>
          </div>
          <button class="btn-small" id="b-deco">se déconnecter</button>
        </header>
        <div class="bureau-body">
          <div class="mailbox" id="mailbox"></div>
        </div>
      </div>`
    );
    $("#b-deco").addEventListener("click", () => {
      memo.set("bureau", "");
      fermer();
    });
    dessinerBoite();
  }

  function coffreOuvert() { return memo.get("chiffre") === "1"; }

  function mailsDe(dossier) {
    return MAILS.filter((m) => m.dossier === dossier).sort((a, b) => b.tri - a.tri);
  }
  function estNonLu(m) { return m.nonLu && !lus.has(m.id); }

  function dessinerBoite() {
    const box = $("#mailbox");
    if (!box) return;
    const dossiersHtml = DOSSIERS.map((d) => {
      const verrou = d.id === "chiffre" && !coffreOuvert();
      const nb = mailsDe(d.id).filter(estNonLu).length;
      return `<button class="folder ${d.id === dossierCourant ? "on" : ""} ${verrou ? "locked" : ""}" data-dossier="${d.id}">
        <span>${d.id === "chiffre" ? (verrou ? "🔒 " : "🔓 ") : ""}${esc(d.nom)}</span>
        ${nb && !verrou ? `<span class="count">${nb}</span>` : ""}
      </button>`;
    }).join("");

    let droite;
    if (dossierCourant === "chiffre" && !coffreOuvert()) {
      droite = coffreHtml();
    } else {
      const liste = mailsDe(dossierCourant);
      if (!mailCourant || !liste.find((m) => m.id === mailCourant)) mailCourant = liste[0] ? liste[0].id : null;
      if (mailCourant) lus.add(mailCourant);
      const m = liste.find((x) => x.id === mailCourant);
      droite = `
        <div class="list">${liste
          .map(
            (x) => `<button class="item ${x.id === mailCourant ? "on" : ""} ${estNonLu(x) ? "unread" : ""}" data-mail="${x.id}">
              <div class="row"><span class="from">${esc(dossierCourant === "envoyes" ? "À : " + x.a.replace(/\s*<.*>/, "") : x.de)}</span><span class="date">${esc(x.date)}</span></div>
              <div class="subj">${esc(x.objet)}</div>
            </button>`
          )
          .join("") || '<p class="item empty">Aucun message.</p>'}</div>
        <article class="reader">${
          m
            ? `${dossierCourant === "chiffre" && CONFIG.dossierChiffre.afficherAlerteIntrusion && !alerteAffichee ? `<div class="alert-banner">⚠ Connexion inhabituelle détectée sur ce dossier. Une notification a été envoyée au titulaire du compte.</div>` : ""}
               ${dossierCourant === "chiffre" ? '<div class="enc-tag">DÉCHIFFRÉ · AES-256</div>' : ""}
               <div class="subj">${esc(m.objet)}</div>
               <div class="hdr">
                 <div class="who">${esc(m.de)}</div>
                 <div class="addr">${esc(m.adresse)}</div>
                 <div class="to">à : ${esc(m.a)} · ${esc(m.date)}</div>
               </div>
               <div class="body">${esc(m.corps)}</div>`
            : '<p class="empty">Sélectionnez un message.</p>'
        }</article>`;
      if (dossierCourant === "chiffre") alerteAffichee = alerteAffichee || CONFIG.dossierChiffre.afficherAlerteIntrusion;
    }

    box.innerHTML = `<aside class="folders"><div class="acct">${esc(PNJ.proprietaire.email)}</div>${dossiersHtml}</aside>${droite}`;
    // garde l'alerte visible pendant la lecture de ce dossier
    if (dossierCourant !== "chiffre") alerteAffichee = false;
    brancherCoffre();
  }

  function coffreHtml() {
    const bloque = Date.now() < coffreBloqueJusqua;
    return `<div class="vault">
      <form class="vault-box fade-up" id="f-coffre" autocomplete="off">
        <div class="lock">🔒</div>
        <h2>Dossier chiffré</h2>
        <p class="muted small">Ce dossier est protégé par ARGUS-10.<br>Saisissez votre phrase de passe personnelle.</p>
        <p class="hint">${esc(CONFIG.dossierChiffre.indice)}</p>
        <input name="pp" placeholder="RF-____-__" spellcheck="false" ${bloque ? "disabled" : ""}>
        <p class="err" id="err-coffre">${bloque ? "Trop de tentatives. Dossier verrouillé." : ""}</p>
        <button class="btn-gold" type="submit" ${bloque ? "disabled" : ""}>Déchiffrer</button>
        <p class="meta">tentatives restantes : ${CONFIG.dossierChiffre.tentativesAvantBlocage - essaisCoffre}</p>
      </form>
    </div>`;
  }

  function brancherCoffre() {
    const f = $("#f-coffre");
    if (!f) return;
    if (Date.now() < coffreBloqueJusqua) {
      const t = setInterval(() => {
        const err = $("#err-coffre");
        if (!err) return clearInterval(t);
        const s = Math.ceil((coffreBloqueJusqua - Date.now()) / 1000);
        if (s <= 0) { clearInterval(t); essaisCoffre = 0; dessinerBoite(); return; }
        err.textContent = `Trop de tentatives. Dossier verrouillé (${s} s).`;
      }, 500);
      return;
    }
    f.pp.focus();
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (norm(f.pp.value) === norm(CONFIG.dossierChiffre.phraseDePasse)) {
        memo.set("chiffre", "1");
        essaisCoffre = 0;
        mailCourant = null;
        dessinerBoite();
        return;
      }
      essaisCoffre++;
      f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");
      if (essaisCoffre >= CONFIG.dossierChiffre.tentativesAvantBlocage) {
        coffreBloqueJusqua = Date.now() + CONFIG.dossierChiffre.blocageSecondes * 1000;
        dessinerBoite();
      } else {
        $("#err-coffre").textContent = "Phrase de passe incorrecte.";
        f.querySelector(".meta").textContent = "tentatives restantes : " + (CONFIG.dossierChiffre.tentativesAvantBlocage - essaisCoffre);
        f.pp.select();
      }
    });
  }

  calque.addEventListener("click", (e) => {
    const d = e.target.closest("[data-dossier]");
    if (d) { dossierCourant = d.dataset.dossier; mailCourant = null; return dessinerBoite(); }
    const m = e.target.closest("[data-mail]");
    if (m) { mailCourant = m.dataset.mail; dessinerBoite(); }
  });

  /* reprise après rechargement de la page (même onglet) */
  if (memo.get("bureau")) ouvrirBureau(memo.get("mode") || "client");

  /* =========================================================
     PANNEAU MJ  (?mj=code)
     ========================================================= */
  const params = new URLSearchParams(location.search);
  if (params.get("mj") === CONFIG.codeMJ) {
    const p = document.createElement("details");
    p.className = "mj";
    p.innerHTML = `<summary>✦ PANNEAU MJ</summary>
      <div class="mj-in">
        <table>
          <tr><td>Client</td><td>${esc(CONFIG.client.identifiant)} / ${esc(CONFIG.client.motDePasse)}</td></tr>
          <tr><td>Technique</td><td>${esc(CONFIG.technique.identifiant)} / ${esc(CONFIG.technique.motDePasse)}<br><span style="color:#888">lien « build v2.5.0 » en bas</span></td></tr>
          <tr><td>Hack</td><td>taper « ${esc(CONFIG.hack.motSecretClavier)} » ou Ctrl+Alt+R<br>codes : ${CONFIG.hack.codesContournement.map(esc).join(", ")}<br>ou FORCE (${CONFIG.hack.dureeForceBruteSecondes} s)</td></tr>
          <tr><td>Chiffré</td><td>${esc(CONFIG.dossierChiffre.phraseDePasse)}</td></tr>
        </table>
        <button id="mj-b">Ouvrir le bureau</button>
        <button id="mj-c">Déverrouiller ${esc(PNJ.primogene.initiales)}</button>
        <button id="mj-t">Terminal</button>
        <button id="mj-r">Tout réinitialiser</button>
      </div>`;
    document.body.appendChild(p);
    $("#mj-b").onclick = () => { fermer(); ouvrirBureau("client"); };
    $("#mj-c").onclick = () => { memo.set("chiffre", "1"); if (ouvert === "bureau") dessinerBoite(); };
    $("#mj-t").onclick = () => { fermer(); memo.set("bureau", ""); terminalBloqueJusqua = 0; ouvrirTerminal(); };
    $("#mj-r").onclick = () => { memo.clear(); location.reload(); };
  }
})();
