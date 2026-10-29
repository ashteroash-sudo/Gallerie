/* =====================================================================
   RAVENSCOURT & FILS — FICHIER DE DONNÉES (à modifier librement)
   ---------------------------------------------------------------------
   Tout ce que tu voudras changer entre deux sessions est ici :
   mots de passe, œuvres de la galerie, mails.
   Règle d'or : garde les guillemets et les virgules en place.
   Dans les textes longs (entre `accents graves`), tu peux écrire
   librement sur plusieurs lignes.
   ===================================================================== */

const CONFIG = {
  /* --- ACCÈS 1 : Espace client (bouton « Connexion » en haut) --- */
  client: {
    identifiant: "r.montero",
    motDePasse: "anvers1897", // indice sur la page d'accueil : « Fondés à Anvers en 1897 »
    tentativesAvantBlocage: 3,
  },

  /* --- ACCÈS 2 : Accès technique secret (petit lien gris tout en bas) --- */
  technique: {
    identifiant: "e.voss",
    motDePasse: "argus10",
    // Si les identifiants sont faux, le pare-feu "intercepte" et ouvre le terminal de hack.
  },

  /* --- ACCÈS 3 : Terminal de hack ---
     S'ouvre : en tapant "toreador" n'importe où sur le site, avec Ctrl+Alt+R,
     ou après un échec sur l'accès technique. */
  hack: {
    motSecretClavier: "toreador",
    // Logique du code : le technicien d'ARGUS (Ezra Voss) utilise NOM-JJMM
    // = son nom + la date d'installation d'ARGUS-10 (28/09), toutes deux visibles avec la commande SCAN.
    // Sur un jet réussi, tu peux leur souffler la règle : « ces techniciens mettent leur nom et la date ».
    codesContournement: ["VOSS-2809", "EVOSS-2809", "EZRAVOSS-2809", "EZRA-VOSS-2809"], // tirets, espaces, / et majuscules ignorés
    accepterToutCode: false, // true = n'importe quel code marche (comme l'ancien site)
    dureeForceBruteSecondes: 75, // commande FORCE : lente mais marche toujours
  },

  /* --- SÉCURITÉ RENFORCÉE : dossier chiffré « W.M. » dans la boîte mail ---
     Phrase de passe = numéro d'inventaire de l'œuvre « non cessible » de la galerie.
     Indices : le mail du prestataire ARGUS + l'indice affiché sur l'écran de verrouillage. */
  dossierChiffre: {
    phraseDePasse: "RF-1872-13", // tirets, espaces et majuscules ignorés à la saisie
    indice: "✦ Celle qui joue pour moi, et que je ne vendrai jamais ✦",
    tentativesAvantBlocage: 3,
    blocageSecondes: 60,
    afficherAlerteIntrusion: false, // true = bandeau « notification envoyée au titulaire » à l'ouverture
  },

  /* --- PANNEAU MJ : ajoute ?mj=ravenscourt à la fin de l'adresse ---
     Affiche tous les codes + bouton pour tout déverrouiller. */
  codeMJ: "ravenscourt",
};

/* Noms des personnages (changer ici met à jour tout le site) */
const PNJ = {
  proprietaire: { nom: "Rudy Montero", email: "r.montero@ravenscourt-arts.example" },
  primogene: { nom: "William Munchkin", email: "w.munchkin@atelier-munchkin.example", initiales: "W.M." },
  maria: { nom: "Maria Garcia", email: "m.garcia@nuitrouge.example" },
  francis: { nom: "Francis Ruiz Verde", email: "f.ruizverde@nuitrouge.example" },
};

/* =====================================================================
   LA GALERIE
   image : nom exact du fichier sur Wikimedia Commons (domaine public).
           Tu peux aussi mettre une adresse complète https://... ou un
           fichier que tu ajoutes dans le dossier "images/" (ex: "images/toile.jpg").
   statut : "disponible" | "reserve" | "vendu" | "noncessible" | "expertise"
   catalogue : "I" Antiquités | "II" Maîtres flamands | "III" Symbolistes & visionnaires
   ===================================================================== */
const OEUVRES = [
  {
    inventaire: "RF-1565-02",
    titre: "Les Moissonneurs",
    artiste: "Atelier de Pieter Bruegel l'Ancien",
    date: "vers 1565",
    technique: "Huile sur bois",
    catalogue: "II",
    statut: "expertise",
    image: "Pieter_Bruegel_the_Elder-_The_Harvesters_-_Google_Art_Project.jpg",
    notice: "Panneau acquis lors d'une succession anversoise. Origine flamande confirmée par laboratoire ; certificat complet attendu sous pli scellé.",
  },
  {
    inventaire: "RF-1563-05",
    titre: "La Tour de Babel",
    artiste: "Suiveur de Pieter Bruegel l'Ancien",
    date: "XVIe siècle",
    technique: "Huile sur bois",
    catalogue: "II",
    statut: "disponible",
    image: "Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Vienna)_-_Google_Art_Project_-_edited.jpg",
    notice: "Une ambition qui défie le ciel, et le prix qu'on finit toujours par payer. Provenance : collection privée viennoise.",
  },
  {
    inventaire: "RF-1607-11",
    titre: "Fleurs dans un vase de bois",
    artiste: "Jan Brueghel l'Ancien",
    date: "1606–1607",
    technique: "Huile sur bois",
    catalogue: "II",
    statut: "disponible",
    image: "Jan_Brueghel_the_Elder_-_Flowers_in_a_Wooden_Vessel_-_Google_Art_Project.jpg",
    notice: "Des fleurs de saisons différentes réunies dans un même bouquet, qui n'a jamais pu exister. Rien ici ne fane.",
  },
  {
    inventaire: "RF-1633-04",
    titre: "Venetia, Lady Digby, sur son lit de mort",
    artiste: "Antoine van Dyck",
    date: "1633",
    technique: "Huile sur toile",
    catalogue: "II",
    statut: "reserve",
    image: "Van_Dyck,_Sir_Anthony_-_Venetia,_Lady_Digby,_on_her_Deathbed_-_Google_Art_Project.jpg",
    notice: "Peinte au lendemain de sa mort, à la demande d'un époux inconsolable. Une beauté fixée à jamais. Réservée par un client privé.",
  },
  {
    inventaire: "RF-1628-09",
    titre: "Portrait de Nicolas Lanier",
    artiste: "Antoine van Dyck",
    date: "vers 1628",
    technique: "Huile sur toile",
    catalogue: "II",
    statut: "disponible",
    image: "Anton_van_Dyck_-_Nicolas_Lanier_-_Google_Art_Project.jpg",
    notice: "Musicien, marchand d'art et agent de la couronne : un homme qui savait acheter pour d'autres sans qu'on sache pour qui.",
  },
  {
    inventaire: "RF-EG-0119",
    titre: "Masque funéraire de Khonsou",
    artiste: "Égypte, Nouvel Empire",
    date: "XIXe dynastie",
    technique: "Cartonnage peint et doré",
    catalogue: "I",
    statut: "reserve",
    image: "Mummy_mask_of_Khonsu.jpg",
    notice: "Le visage qu'on offre au défunt pour l'éternité. Provenance documentée, sortie du territoire antérieure à 1970. Réservé.",
  },
  {
    inventaire: "RF-1872-13",
    titre: "Autoportrait avec la Mort jouant du violon",
    artiste: "Arnold Böcklin",
    date: "1872",
    technique: "Huile sur toile",
    catalogue: "III",
    statut: "noncessible",
    image: "Arnold_Boecklin-fiedelnder_Tod.jpg",
    notice: "Le peintre s'arrête, pinceau levé, et écoute la Mort lui jouer à l'oreille. Pièce de la collection personnelle de M. Montero. Non cessible, à aucun prix.",
  },
  {
    inventaire: "RF-1888-01",
    titre: "L'Île de la vie",
    artiste: "Arnold Böcklin",
    date: "1888",
    technique: "Huile sur bois",
    catalogue: "III",
    statut: "disponible",
    image: "Böcklin_-_Die_Lebensinsel_-1888.jpeg",
    notice: "Le pendant lumineux de la célèbre Île des morts. Nos clients la jugent souvent trop claire.",
  },
  {
    inventaire: "RF-1893-06",
    titre: "La Belle Dame sans merci",
    artiste: "John William Waterhouse",
    date: "1893",
    technique: "Huile sur toile",
    catalogue: "III",
    statut: "reserve",
    image: "John_William_Waterhouse_-_La_Belle_Dame_sans_Merci_(1893).jpg",
    notice: "D'après Keats : un chevalier envoûté par une créature qui le laissera pâle et seul sur la colline. Réservée par un client privé.",
  },
  {
    inventaire: "RF-1892-08",
    titre: "Circé envieuse (étude)",
    artiste: "John William Waterhouse",
    date: "1892",
    technique: "Huile sur toile",
    catalogue: "III",
    statut: "disponible",
    image: "John_William_Waterhouse_-_Circe_Invidiosa_(study).jpg",
    notice: "Étude préparatoire. La magicienne empoisonne l'eau où se baignera sa rivale.",
  },
  {
    inventaire: "RF-1876-03",
    titre: "L'Apparition",
    artiste: "Gustave Moreau",
    date: "1876",
    technique: "Aquarelle",
    catalogue: "III",
    statut: "reserve",
    image: "The_Apparition,_Gustave_Moreau_1876.jpg",
    notice: "Salomé face à la tête du Baptiste, suspendue dans un halo. Réservée par un client privé.",
  },
  {
    inventaire: "RF-1781-10",
    titre: "Le Cauchemar",
    artiste: "Johann Heinrich Füssli",
    date: "1781",
    technique: "Huile sur toile",
    catalogue: "III",
    statut: "vendu",
    image: "John_Henry_Fuseli_-_The_Nightmare.JPG",
    notice: "Version d'atelier. Cédée à un collectionneur de Milwaukee.",
  },
];

/* =====================================================================
   LA BOÎTE MAIL DE RUDY MONTERO
   dossier : "reception" | "envoyes" | "chiffre" (protégé par la phrase de passe)
   ordre d'affichage : du plus récent au plus ancien (selon "tri", un simple nombre)
   ===================================================================== */
const MAILS = [
  /* -------------------- RÉCEPTION (mails classiques) -------------------- */
  {
    id: "frv",
    dossier: "reception",
    tri: 1,
    de: PNJ.francis.nom,
    adresse: PNJ.francis.email,
    a: PNJ.proprietaire.email,
    objet: "Mes recherches sur la Géhenne",
    date: "17 sept., 22:14",
    nonLu: false,
    corps: `Mon cher ami,

J'ai continué mes recherches concernant cette Géhenne. Moi qui étais par le passé incrédule face à cette lutte légendaire, je ne peux m'empêcher de frissonner à la vue des documents que j'ai trouvés.

J'ai bien entendu les documents originaux dans mon local, et à l'occasion je vous les ferai voir, si le courage vous en est donné. Je crains que pour le moment mon dernier achat me pose quelques difficultés, et j'ai peut-être mis la main dans le proverbial nid de frelons... dans ce cas, presque littéralement.

Je suis observé, je le sens, depuis quelques jours, suite à ma dernière visite à l'Hôtel Michigan Coastline. Il est clair que le lieu est propice à mes retraites et à mes recherches — la ville de Waukegan est parfaitement située pour ne pas éveiller les soupçons, mais juste assez proche pour mes besoins plus... physiques.

J'hésite à en parler au Primogène Munchkin, de peur qu'il n'utilise cette affaire pour des manœuvres politiques qui mettraient en péril mon achat.

Je vous tiendrai au courant dans le courant de la semaine.

Mes amitiés sincères,
F.R.V.

Por Dios y el Clan.`,
  },
  {
    id: "fontenot",
    dossier: "reception",
    tri: 2,
    de: "Amélie Fontenot",
    adresse: "a.fontenot@galerie-privee.example",
    a: PNJ.proprietaire.email,
    objet: "Re: Authentification du Bruegel",
    date: "19 sept., 10:02",
    nonLu: false,
    corps: `Bonjour Rudy,

Le rapport du laboratoire confirme l'origine flamande de la toile. Je t'envoie le certificat complet demain par courrier scellé.

Bien à toi,
Amélie`,
  },
  {
    id: "argus",
    dossier: "reception",
    tri: 5,
    de: "ARGUS Sécurité — Support",
    adresse: "support@argus-securite.example",
    a: PNJ.proprietaire.email,
    objet: "Incident du 22/09 : déploiement ARGUS-10 terminé",
    date: "28 sept., 09:41",
    nonLu: false,
    corps: `Monsieur Montero,

Suite à l'intrusion constatée dans la nuit du 22 septembre (ouverture d'une session non journalisée via l'ancien port de maintenance 31), nous avons procédé aux mesures suivantes :

  • remplacement du pare-feu ARGUS-9 par ARGUS-10 ;
  • fermeture du port 31 et rotation de l'ensemble des codes de contournement ;
  • chiffrement du dossier de correspondance que vous nous avez désigné comme sensible, avec phrase de passe personnelle.

Comme convenu par téléphone, nous avons conservé la phrase de passe que vous avez choisie vous-même, au format de vos numéros d'inventaire (RF-AAAA-NN). Nous nous permettons de vous rappeler qu'une phrase de passe liée à un élément visible publiquement sur votre site constitue une mauvaise pratique. Vous nous avez assuré que « personne ne pense jamais à regarder ce tableau-là ». Nous en prenons acte.

Restant à votre disposition,
Ezra Voss
Technicien référent — ARGUS Sécurité`,
  },
  {
    id: "compta",
    dossier: "reception",
    tri: 8,
    de: "Comptabilité — Ravenscourt & Fils",
    adresse: "compta@ravenscourt-arts.example",
    a: PNJ.proprietaire.email,
    objet: "Relance : facture transporteur Anvers",
    date: "14 oct., 16:20",
    nonLu: false,
    corps: `M. Montero,

Merci de valider le règlement du transporteur avant la fin du mois. Le dossier complet est disponible sur le serveur partagé, dossier "Logistique 1897".

Nous notons par ailleurs une seconde facture Lakeshore pour un transport « hors registre » dont nous n'avons pas le bon de commande. Merci de nous indiquer sur quel compte l'imputer.

Cordialement,
Le service comptabilité`,
  },
  {
    id: "lakeshore",
    dossier: "reception",
    tri: 9,
    de: "Lakeshore Freight",
    adresse: "dispatch@lakeshore-freight.example",
    a: PNJ.proprietaire.email,
    objet: "Confirmation : 4 caisses climatisées",
    date: "16 oct., 11:05",
    nonLu: false,
    corps: `Bonjour M. Montero,

Nous vous confirmons la réservation d'un porteur climatisé (18 °C / 50 % HR) pour 4 caisses bois aux dimensions communiquées, enlèvement à Port Newark (NJ).

Comme demandé, le véhicule sera banalisé (aucun logo) et l'équipage sera celui que vous avez fourni. Nos assurances ne couvrent donc pas l'équipage.

Arrêt de jour prévu à notre entrepôt sous douane de Gary (IN) avant la livraison finale de nuit, conformément à vos instructions.

Le numéro de colis (format XXX-XXXX) figure sur le bordereau apposé sur chaque caisse. Merci de le rappeler pour tout suivi.

Cordialement,
Dispatch — Lakeshore Freight, Midwest Division
Filiale du groupe BHL Transport`,
  },
  {
    id: "bhl",
    dossier: "reception",
    tri: 14.5,
    de: "BHL Transport — Service Clients",
    adresse: "no-reply@bhl-transport.example",
    a: PNJ.proprietaire.email,
    objet: "Votre envoi est en cours d'acheminement",
    date: "5 nov., 07:42",
    nonLu: true,
    corps: `Ceci est un message automatique, merci de ne pas y répondre.

Bonjour,

Nous vous informons que votre cargaison a été prise en charge et qu'elle est actuellement en cours d'acheminement.

Le transport et la livraison finale sont assurés par notre filiale :
    LAKESHORE FREIGHT — Midwest Division

Vous pouvez suivre l'état de votre envoi à tout moment sur notre espace client :
    https://lakeshore-freight.vercel.app/

  • Identifiez-vous avec votre numéro client habituel : Gall-RM-0919
  • Pour les livraisons en cours, saisissez votre numéro de colis (format : XXX-XXXX), indiqué sur votre bordereau d'expédition.

Les informations de suivi sont mises à jour à chaque étape (prise en charge, transit, entrepôt, livraison). Les délais peuvent varier en fonction des conditions de circulation et des contrôles douaniers.

Nous vous remercions de votre confiance.

L'équipe BHL Transport
Service Clients — disponible 24 h/24, 7 j/7

—
BHL Transport Group · Logistique nationale et internationale
Ce message et ses pièces jointes sont confidentiels et destinés exclusivement à leur destinataire.`,
  },
  {
    id: "vernissage",
    dossier: "reception",
    tri: 11,
    de: "Maison Delacroix-Hart",
    adresse: "invitations@delacroix-hart.example",
    a: PNJ.proprietaire.email,
    objet: "Invitation : vente privée « Nocturnes » — Gold Coast",
    date: "21 oct., 18:30",
    nonLu: true,
    corps: `Cher Monsieur Montero,

La Maison Delacroix-Hart a le plaisir de vous convier à sa vente privée « Nocturnes », consacrée aux peintres de la nuit, du XVIIe au symbolisme.

Présentation des lots à partir de 21 h, vente à minuit.
Tenue de soirée. Discrétion de rigueur.

Sur invitation uniquement — ce carton est nominatif.`,
  },

  /* -------------------- ENVOYÉS -------------------- */
  {
    id: "condoleances",
    dossier: "envoyes",
    tri: 6,
    de: PNJ.proprietaire.nom,
    adresse: PNJ.proprietaire.email,
    a: `${PNJ.maria.nom} <${PNJ.maria.email}>`,
    objet: "Mes condoléances",
    date: "6 oct., 03:12",
    nonLu: false,
    corps: `Chère Maria,

Je n'ai appris que cette nuit la perte tragique de Francis, et je ne trouve pas de mots qui soient à la hauteur.

Je sais ce qu'il était pour vous. On ne perd pas seulement un ami quand on perd son sire : on perd celui qui vous a ouvert les yeux, et une part de la nuit qui vous appartenait à tous les deux. Je n'ai pas l'audace de prétendre comprendre ce que vous traversez.

Francis était l'un des rares hommes avec qui je pouvais parler d'art comme d'autre chose qu'une marchandise. Ses dernières lettres étaient pleines de ses recherches ; il les poursuivait avec une passion que j'admirais, et qui, je le crains aujourd'hui, l'inquiétait lui-même.

Si vous avez besoin de quoi que ce soit (un lieu sûr pour ses affaires, quelqu'un pour s'occuper de sa collection, ou simplement d'un interlocuteur qui l'a connu), ma porte vous est ouverte, à toute heure de la nuit.

Avec ma plus profonde sympathie,
Rudy Montero`,
  },
  {
    id: "compta-rep",
    dossier: "envoyes",
    tri: 10,
    de: PNJ.proprietaire.nom,
    adresse: PNJ.proprietaire.email,
    a: "compta@ravenscourt-arts.example",
    objet: "Re: Relance : facture transporteur Anvers",
    date: "14 oct., 23:48",
    nonLu: false,
    corps: `Réglez Anvers.

Pour la facture Lakeshore « hors registre » : ne l'imputez nulle part. Transmettez-la-moi, je m'en occupe personnellement. Elle n'a pas à figurer dans nos comptes.

R.M.`,
  },

  /* -------------------- DOSSIER CHIFFRÉ : correspondance W.M. -------------------- */
  {
    id: "wm1",
    dossier: "chiffre",
    tri: 3,
    de: PNJ.proprietaire.nom,
    adresse: PNJ.proprietaire.email,
    a: `${PNJ.primogene.nom} <${PNJ.primogene.email}>`,
    objet: "Incident sur notre extranet",
    date: "24 sept., 01:37",
    nonLu: false,
    corps: `Monsieur le Primogène,

Je vous dois la vérité avant que vous ne l'appreniez par d'autres : dans la nuit du 22 septembre, quelqu'un s'est introduit dans les systèmes de la maison.

L'intrus est passé par un ancien accès de maintenance que mon prestataire jugeait inoffensif. Il a ouvert ce que les techniciens appellent une « session fantôme » : aucune trace dans nos journaux, sauf la durée de connexion. Onze minutes. Assez pour lire ma boîte de réception, et en particulier la dernière lettre de Francis Ruiz Verde, dans laquelle il mentionnait son refuge de Waukegan.

Je n'ai aucune idée de l'identité du visiteur. Le travail est maladroit, mais efficace, ce qui m'inquiète davantage que s'il avait été élégant.

Les mesures nécessaires sont prises. Notre correspondance sera désormais conservée dans un espace chiffré, séparé du reste.

Je reste, comme toujours, votre obligé.
R. Montero`,
  },
  {
    id: "wm1-rep",
    dossier: "chiffre",
    tri: 4,
    de: PNJ.primogene.nom,
    adresse: PNJ.primogene.email,
    a: PNJ.proprietaire.email,
    objet: "Re: Incident sur notre extranet",
    date: "25 sept., 00:09",
    nonLu: false,
    corps: `Rudy,

Votre franchise vous honore. Votre prestataire, beaucoup moins.

Onze minutes. Il suffit parfois de beaucoup moins pour défaire ce que des décennies ont construit. Je ne vous reprocherai pas l'intrusion elle-même ; je vous reprocherai s'il y en a une seconde.

Quant à Francis : il a toujours cru que la discrétion consistait à se cacher loin. Elle consiste à ne pas écrire. Si quelqu'un sait désormais où il se retire, ce n'est plus votre problème, c'est le sien. Et peut-être le mien.

Je ne crois pas aux coïncidences. Tenez-moi informé de tout ce qui bougerait autour de Waukegan.

W.M.`,
  },
  {
    id: "wm2",
    dossier: "chiffre",
    tri: 7,
    de: PNJ.primogene.nom,
    adresse: PNJ.primogene.email,
    a: PNJ.proprietaire.email,
    objet: "Une proposition",
    date: "9 oct., 02:51",
    nonLu: false,
    corps: `Rudy,

J'ai parcouru votre catalogue privé, comme vous me l'aviez permis. Je n'avais pas vu une telle sélection à Chicago depuis bien longtemps, et j'ai vu beaucoup de choses à Chicago.

Le Van Dyck, d'abord. Lady Digby, sur son lit de mort, plus belle qu'elle ne l'a jamais été vivante. Un homme a payé un peintre pour que la mort ne lui prenne pas ce visage. Vous comprendrez que ce sujet me touche.

Le Moreau. La Belle Dame de Waterhouse. Et ce masque égyptien, dont je soupçonne que vous ne m'avez pas tout dit.

Je vous propose davantage qu'un achat. Une association. Vos réseaux d'Anvers à Buenos Aires, ma protection ici : vos convois n'auront plus à craindre ni les douanes ni les curieux, et vos affaires bénéficieront de mon nom auprès de ceux qui comptent. En échange, je veux un droit de premier regard sur tout ce qui entre dans votre maison. Tout.

Une dernière chose. La collection de Francis : je voudrais savoir ce qu'elle devient. Par simple sollicitude, cela va sans dire.

Réfléchissez. Pas trop longtemps.

W.M.`,
  },
  {
    id: "wm2-rep",
    dossier: "chiffre",
    tri: 7.5,
    de: PNJ.proprietaire.nom,
    adresse: PNJ.proprietaire.email,
    a: `${PNJ.primogene.nom} <${PNJ.primogene.email}>`,
    objet: "Re: Une proposition",
    date: "10 oct., 04:20",
    nonLu: false,
    corps: `Monsieur le Primogène,

J'accepte, avec gratitude, et avec la lucidité de celui qui sait qu'on ne refuse pas une telle offre deux fois.

Le droit de premier regard vous est acquis. Les quatre pièces que vous avez désignées vous seront livrées par le prochain convoi ; je vous en communiquerai les modalités dès que mon transporteur m'aura confirmé les dates.

Pour la collection de Francis : je l'ignore encore. Maria Garcia en a la charge, je crois. Je lui ai écrit.

Votre obligé,
R. Montero`,
  },
  {
    id: "wm3",
    dossier: "chiffre",
    tri: 12,
    de: PNJ.proprietaire.nom,
    adresse: PNJ.proprietaire.email,
    a: `${PNJ.primogene.nom} <${PNJ.primogene.email}>`,
    objet: "Convoi — modalités de livraison",
    date: "20 oct., 01:15",
    nonLu: true,
    corps: `Monsieur le Primogène,

Les quatre caisses sont arrivées d'Anvers à Port Newark. Voici les modalités, que je vous prie de détruire après lecture, si tant est que l'on détruise un courrier électronique.

  CONTENU
  • Caisse 1 — Van Dyck, « Venetia, Lady Digby, sur son lit de mort »
  • Caisse 2 — Moreau, « L'Apparition »
  • Caisse 3 — Waterhouse, « La Belle Dame sans merci »
  • Caisse 4 — Le masque de Khonsou, et l'objet dont nous avons parlé de vive voix.

  TRANSPORT
  • Porteur climatisé Lakeshore, blanc, banalisé
  • Itinéraire : Port Newark → I-80 → Indiana Toll Road (I-90)
  • Arrêt de jour : entrepôt sous douane Lakeshore, Gary (Indiana), quartier de Buffington Harbor
  • Départ de Gary à la tombée de la nuit, livraison au lieu habituel vers 23 h

  DATE
  • Nuit du vendredi 6 au samedi 7 novembre

  ESCORTE
  • Deux chauffeurs à moi, de confiance. Pas d'escorte visible : un convoi escorté attire les regards.

J'ai choisi Gary à dessein : personne ne regarde Gary.

Votre obligé,
R. Montero`,
  },
  {
    id: "wm3-rep",
    dossier: "chiffre",
    tri: 13,
    de: PNJ.primogene.nom,
    adresse: PNJ.primogene.email,
    a: PNJ.proprietaire.email,
    objet: "Re: Convoi — modalités de livraison",
    date: "20 oct., 02:02",
    nonLu: true,
    corps: `Personne ne regarde Gary. C'est précisément pour cela que certains y vivent désormais.

Je ferai surveiller l'entrepôt de mon côté. Discrètement.

W.M.`,
  },
  {
    id: "wm4",
    dossier: "chiffre",
    tri: 14,
    de: PNJ.primogene.nom,
    adresse: PNJ.primogene.email,
    a: PNJ.proprietaire.email,
    objet: "Gary",
    date: "4 nov., 03:26",
    nonLu: true,
    corps: `Rudy,

On me rapporte que Gary s'agite. Des rixes, des disparitions, des gens qui n'ont rien à y faire et qui s'y installent. Et un transport incendié le mois dernier, sur une route que vos camions empruntent, si je ne m'abuse. Un camion entier réduit en carcasse noire au bord de la chaussée.

Je n'arrive pas à chasser cette image. Vous savez ce que le feu fait à une toile ? Le vernis cloque d'abord, puis la couche picturale se rétracte, se craquelle comme une peau trop longtemps restée au soleil, et le visage disparaît. Pas d'un coup : lentement, en se tordant. Lady Digby a survécu près de quatre siècles. Je refuse qu'elle finisse sur le bas-côté d'une autoroute de l'Indiana parce qu'un imbécile a jugé bon de mettre le feu à une cargaison.

Je veux des garanties. La température des caisses, l'hygrométrie, le calage. Je veux savoir qui conduit, qui les accompagne, et à quel point ces gens sont prêts à se mettre entre une flamme et une caisse. Ces œuvres ont traversé des guerres, des révolutions, des incendies de palais. Elles ne disparaîtront pas sous ma responsabilité.

La Belle Dame sans merci ne restera pas chez moi : je la destine au Superintendent. Un présent, de ceux qui ouvrent des portes et en ferment d'autres. Elle doit donc arriver intacte, sans un éclat, sans une rayure sur le cadre. Je compte sur la discrétion habituelle vis-à-vis de qui vous savez. Il ne doit pas apprendre d'où elle vient, ni pour qui elle part.

Une dernière chose, qui m'a laissé perplexe en relisant votre courrier du 20. Vous évoquez, pour la caisse 4, « l'objet dont nous avons parlé de vive voix ». Je ne me souviens pas vous en avoir parlé. Ni de vive voix, ni autrement.

Éclairez-moi.

W.M.`,
  },
  {
    id: "wm4-rep",
    dossier: "chiffre",
    tri: 15,
    de: PNJ.proprietaire.nom,
    adresse: PNJ.proprietaire.email,
    a: `${PNJ.primogene.nom} <${PNJ.primogene.email}>`,
    objet: "Re: Gary",
    date: "5 nov., 00:58",
    nonLu: true,
    corps: `Monsieur le Primogène,

Je comprends vos inquiétudes, et je les partage. Soyez rassuré.

Les caisses voyagent à 18 °C, 50 % d'humidité, calées sur mesure, doublées d'une protection ignifugée. Chaque toile est sous sa propre enveloppe. Rien de ce qui est arrivé à ce camion ne peut arriver au nôtre.

Ce ne seront pas des chauffeurs de location : ce sont des hommes à moi. Discrets, armés, et qui savent ce qu'il en coûte de décevoir. Ils ne s'arrêteront que là où je l'ai prévu, et personne ne s'approchera des caisses sans qu'ils l'aient décidé.

La Belle Dame partira emballée à part, sans marque de la maison. Celui à qui elle est destinée ne saura que ce que vous voudrez bien lui dire, et l'autre n'en saura rien. Comme toujours.

Quant à l'objet de la caisse 4 : vous me l'avez demandé vous-même, au Drake, le soir du 12. Vous aviez l'air las.

Je ne m'en offusque pas. Ces dernières semaines ont pesé sur chacun de nous.

Votre obligé,
R. Montero`,
  },
];
