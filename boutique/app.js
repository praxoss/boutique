/* Script de la boutique (sorti de index.html pour que la politique de securite
   du site, CSP script-src 'self', puisse interdire tout script integre a la page). */
(function(){
  "use strict";

  var PRODUCTS = [
    { id:"maillot-domicile", cat:"Maillots", name:"Maillot Domicile", sub:"Manches courtes, coupe joueur", price:64.99, label:"Nouveauté", icon:"icon-shirt",
      hero:true, heroImage:"assets/hero-maillot.jpg", heroTitle:"Maillot Domicile 26/27", heroText:"Le maillot officiel des Implacables, porté en championnat FFSE. Motif feuille de vigne tissé, blason brodé.", heroCta:"Découvrir",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["S","M","L","XL","XXL"],
      photo:"assets/maillot-domicile.jpg", photos:["assets/maillot-domicile.jpg","assets/maillot-domicile-dos.jpg"],
      desc:"Le maillot officiel porté en championnat, coupe ajustée et tissu technique respirant. Motif feuille de vigne tissé, blason club et sponsors brodés sur la poitrine." },
    { id:"maillot-exterieur", cat:"Maillots", name:"Maillot Extérieur", sub:"Manches courtes, coupe joueur", price:64.99, icon:"icon-shirt",
      colors:[{n:"Rouge",h:"#C8102E"},{n:"Bleu marine",h:"#0B1F3D"}], sizes:["S","M","L","XL","XXL"],
      photo:"assets/maillot-exterieur.jpg", photos:["assets/maillot-exterieur.jpg","assets/maillot-exterieur-dos.jpg"],
      desc:"Version extérieure du maillot officiel, coloris rouge. Même coupe technique que le maillot domicile, blason club au dos et sponsors partenaires." },
    { id:"tshirt-training", cat:"T-shirts", name:"T-shirt Entraînement", sub:"Coton respirant, coupe régulière", price:24.99, icon:"icon-shirt",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Gris",h:"#8A8D93"},{n:"Blanc",h:"#FFFFFF"}], sizes:["S","M","L","XL","XXL"],
      desc:"Le t-shirt du quotidien, porté à l'entraînement comme en dehors du terrain. Coton peigné 220 g, logo club sérigraphié." },
    { id:"polo-club", cat:"T-shirts", name:"Polo Club", sub:"Piqué technique, col boutonné", price:34.99, label:"Édition limitée", icon:"icon-shirt",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Blanc",h:"#FFFFFF"}], sizes:["S","M","L","XL","XXL"],
      desc:"Polo piqué pour les jours de match côté touche et les déplacements officiels. Blason club brodé sur la poitrine." },
    { id:"sweat-capuche", cat:"Sweats", name:"Sweat à Capuche", sub:"Molleton épais, poche kangourou", price:49.99, label:"Édition limitée", icon:"icon-hoodie",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Gris",h:"#8A8D93"}], sizes:["S","M","L","XL","XXL"],
      desc:"Sweat à capuche épais pour les matins d'entraînement frais. Molleton gratté à l'intérieur, cordons ton sur ton." },
    { id:"veste-survetement", cat:"Sweats", name:"Veste de Survêtement", sub:"Zip intégral, coupe-vent", price:59.99, icon:"icon-hoodie",
      colors:[{n:"Bleu marine",h:"#0B1F3D"}], sizes:["S","M","L","XL","XXL"],
      desc:"Veste d'échauffement zippée, portée avant match sur le maillot. Doublure légère coupe-vent." },
    { id:"vareuse-entrainement", cat:"Sweats", name:"Vareuse d'Entraînement", sub:"Maille technique, col zippé", price:54.99, icon:"icon-hoodie",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Gris",h:"#8A8D93"}], sizes:["S","M","L","XL","XXL"],
      desc:"Vareuse d'entraînement en maille technique, col zippé, portée par-dessus le maillot ou le t-shirt les jours de fraîcheur." },
    { id:"short-match", cat:"Shorts", name:"Short de Match", sub:"Coupe joueur, bandes contrastées", price:29.99, icon:"icon-shorts",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["S","M","L","XL","XXL"],
      desc:"Short officiel assorti au maillot, renforts aux coutures pour résister au contact." },
    { id:"short-entrainement", cat:"Shorts", name:"Short d'Entraînement", sub:"Léger, poches zippées", price:22.99, icon:"icon-shorts",
      colors:[{n:"Gris",h:"#8A8D93"},{n:"Bleu marine",h:"#0B1F3D"}], sizes:["S","M","L","XL","XXL"],
      desc:"Short polyvalent pour l'entraînement, tissu léger et poches zippées pour les clés et le téléphone." },
    { id:"chaussettes-match", cat:"Chaussettes", name:"Chaussettes de Match", sub:"Paire, maintien renforcé", price:12.99, icon:"icon-socks",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["36-39","40-43","44-47"],
      desc:"Chaussettes hautes du kit officiel, maintien renforcé à la cheville et au tibia, assorties au maillot." },
    { id:"bonnet-club", cat:"Accessoires", name:"Bonnet Club", sub:"Taille unique, laine fine", price:14.99, icon:"icon-cap",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["Taille unique"],
      desc:"Bonnet côtelé avec patch club brodé, pour les matchs d'hiver en tribune comme sur le terrain." },
    { id:"sac-sport", cat:"Accessoires", name:"Sac de Sport", sub:"40 L, compartiment crampons", price:39.99, icon:"icon-bag",
      colors:[{n:"Bleu marine",h:"#0B1F3D"}], sizes:["Taille unique"],
      desc:"Sac de sport 40 litres avec compartiment ventilé dédié aux crampons, logo club floqué." }
  ];

  /* Catalogue publie : catalogue.json, a cote de cette page, exporte depuis
     le backoffice puis commite dans le depot. S'il manque ou ne se charge
     pas, la liste ci-dessus sert de secours. On conserve les champs enrichis
     (photos multiples, heroImage, label) des produits deja connus. */
  /* Pictogrammes publies par le backoffice (catalogue.json, "icons") :
     { id, name, viewBox, svg } (dessin SVG, deja nettoye a l'import) ou
     { id, name, image } (PNG). Ils remplacent ou completent les symboles
     ecrits plus haut dans la page ; une entree sans dessin garde le sien. */
  function cleanSvgMarkup(markup){
    var doc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+markup+'</svg>', "image/svg+xml");
    var root = doc.documentElement;
    if(root.nodeName !== "svg") return "";
    root.querySelectorAll("script,foreignObject,iframe,style").forEach(function(n){ n.remove(); });
    root.querySelectorAll("*").forEach(function(n){
      Array.prototype.slice.call(n.attributes).forEach(function(a){
        var href = /(^|:)href$/i.test(a.name);
        if(/^on/i.test(a.name) || (href && !/^#/.test(a.value) && !/^(assets\/|data:image\/(png|jpeg|webp);)/.test(a.value))) n.removeAttribute(a.name);
      });
    });
    return root.innerHTML;
  }
  function installIcons(list, base){
    var NS = "http://www.w3.org/2000/svg";
    var sprite = document.getElementById("iconSprite");
    list.forEach(function(ic){
      if(!ic || !/^icon-[a-z0-9-]+$/.test(ic.id) || (!ic.svg && !ic.image)) return;
      var old = document.getElementById(ic.id);
      if(old) old.remove();
      var sym = document.createElementNS(NS, "symbol");
      sym.setAttribute("id", ic.id);
      if(ic.svg){
        sym.setAttribute("viewBox", ic.viewBox || "0 0 120 120");
        sym.setAttribute("fill", "currentColor");
        sym.innerHTML = cleanSvgMarkup(ic.svg);
      } else {
        sym.setAttribute("viewBox", "0 0 100 100");
        var img = document.createElementNS(NS, "image");
        img.setAttribute("href", (base || "") + ic.image);
        img.setAttribute("width", "100"); img.setAttribute("height", "100");
        img.setAttribute("preserveAspectRatio", "xMidYMid meet");
        sym.appendChild(img);
      }
      sprite.appendChild(sym);
    });
  }

  /* Le catalogue vient du backoffice, mais ses adresses d'images, couleurs et
     identifiants finissent dans des attributs HTML et du CSS : on n'y laisse
     passer que des formes connues. */
  function safeUrl(u){
    u = String(u || "");
    return /^(assets\/[\w\-.\/]+|https:\/\/[^\s"'<>()\\]+|data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\/=]+)$/.test(u) ? u : "";
  }
  function safeColor(h){ return /^#[0-9a-f]{3,8}$/i.test(String(h || "")) ? h : "#8A8D93"; }
  function safeId(v){ return /^[\w-]+$/.test(String(v || "")) ? String(v) : ""; }
  function applySkus(saved){
    if(!saved || !Array.isArray(saved) || saved.length === 0) return;
    saved = saved.filter(function(s){ return s && safeId(s.id); }).map(function(s){
      var o = Object.assign({}, s);
      o.photo = safeUrl(s.photo);
      o.photos = Array.isArray(s.photos) ? s.photos.map(safeUrl).filter(Boolean) : undefined;
      if(o.photos && !o.photos.length) o.photos = undefined;
      o.heroImage = safeUrl(s.heroImage) || undefined;
      o.icon = safeId(s.icon) || undefined;
      o.colors = Array.isArray(s.colors) ? s.colors.map(function(c){
        return { n:String(c && c.n || ""), h:safeColor(c && c.h), photo:safeUrl(c && c.photo) || undefined };
      }) : undefined;
      return o;
    });
    var enriched = {};
    PRODUCTS.forEach(function(p){ enriched[p.id] = p; });
    PRODUCTS = saved
      .filter(function(s){ return s.status !== "discontinue" && !s.hidden; })   // masque dans le backoffice
      .map(function(s){
        var ex = enriched[s.id] || {};
        var photo = s.photo || ex.photo || "";
        return {
          id:        s.id,
          cat:       s.typ,            /* backoffice "typ" -> boutique "cat" */
          univ:      s.univers || ex.univ || "",
          name:      s.name,
          sub:       s.sub  || ex.sub  || "",
          price:     s.price,
          icon:      s.icon || ex.icon || "icon-shirt",
          label:     s.label || ex.label || undefined,
          colors:    s.colors && s.colors.length ? s.colors : (ex.colors || []),
          sizes:     s.sizes  && s.sizes.length  ? s.sizes  : (ex.sizes  || []),
          desc:      s.desc  || ex.desc  || "",
          sizeGuide: s.sizeGuide || "",    /* "" = guide par defaut, "none" = pas de guide */
          photo:     photo,
          /* une seule photo suffit a remplacer le picto sur la fiche produit */
          photos:    s.photos || ex.photos || (photo ? [photo] : undefined),
          status:    s.status,         /* "actif" | "rupture" */
          hero:      s.hero || false,
          heroImage: s.heroImage || ex.heroImage,
          heroTitle: s.heroTitle || ex.heroTitle,
          heroText:  s.heroText  || ex.heroText,
          heroCta:   s.heroCta   || ex.heroCta,
          heroFit:   s.heroFit   || ex.heroFit,
          heroFocus: s.heroFocus != null ? s.heroFocus : (ex.heroFocus != null ? ex.heroFocus : 50)
        };
      });
  }

  /* Categories et menu : publies par le backoffice dans catalogue.json
     ("categories", "menu") ; ces valeurs ne servent que de secours. */
  var CATS = ["Maillots","T-shirts","Sweats","Shorts","Chaussettes","Accessoires"];
  var SIZES = ["S","M","L","XL","XXL"];
  /* Ordre des tailles dans le filtre : XS..XXXL, puis ages, puis le reste. */
  var SIZE_ORDER = ["XXS","XS","S","M","L","XL","XXL","XXXL","4XL"];
  function sizeRank(s){
    var i = SIZE_ORDER.indexOf(String(s).toUpperCase());
    if(i > -1) return i;
    var age = String(s).match(/^(\d+)\s*ans?$/i);
    if(age) return 100 + parseInt(age[1], 10);
    var n = parseFloat(s);
    return isNaN(n) ? 1000 : 200 + n;
  }
  var COLOR_SWATCHES = [{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"},{n:"Blanc",h:"#FFFFFF"},{n:"Gris",h:"#8A8D93"}];
  var PRICE_BANDS = [
    {id:"all", label:"Tous les prix", test:function(){return true;}},
    {id:"u30", label:"Moins de 30€", test:function(p){return p<30;}},
    {id:"30-50", label:"30€ - 50€", test:function(p){return p>=30&&p<=50;}},
    {id:"o50", label:"Plus de 50€", test:function(p){return p>50;}}
  ];

  /* sel : la selection de rayons, une liste de { u, c } (univers,
     categorie). c vide = tout l'univers ; u vide = cette categorie dans
     tous les univers (tuiles de l'accueil, anciens liens). Une categorie
     presente dans plusieurs univers (T-shirts : Lifestyle, Femme...) se
     choisit donc univers par univers. */
  var state = { sel:[], sizes:[], colors:[], price:"all", sort:"new", q:"" };   // q : recherche (#/recherche/...)
  var lastSearch = "";   // recherche dont les filtres sont en cours (retour depuis une fiche)

  /* Textes de la boutique, modifiables dans le backoffice (onglet Textes,
     catalogue.texts). Ici les valeurs par defaut, a garder identiques a
     TEXT_FIELDS du backoffice. **gras**, retours a la ligne, et {commande},
     {email}, {article} la ou c'est indique. */
  var DEFAULT_TEXTS = {
    promo:          "**Retrait gratuit** en main propre au club",
    featuredTitle:  "Le produit du moment",
    featuredSub:    "Disponible à la commande, retrait au club house.",
    pdpDelivery:    "Commandes groupées, livraison en main propre uniquement. Contactez un membre du bureau pour connaître la prochaine date de livraison.",
    pdpPickup:      "Commandes groupées, livraison en main propre uniquement. Contactez un membre du bureau pour connaître la prochaine date de livraison.",
    pdpCare:        "100 % polyester recyclé pour les hauts techniques, coton biologique pour les pièces en jersey. Lavage en machine à 30 degrés, ne pas utiliser de sèche-linge.",
    preorderIntro:  "**Article en précommande.** Choisis ta taille et laisse ton e-mail : on te prévient dès que la commande groupée est lancée. Rien à payer pour l'instant.",
    preorderLegal:  "Ton e-mail ne sert qu'à te prévenir pour cet article.",
    preorderDone:   "**C'est noté !** On te prévient à {email} dès que la commande groupée de ce {article} est lancée.",
    cartEmpty:      "Ton panier est vide. Ajoute un article depuis la grille ou une fiche produit.",
    cartContact:    "Pour te recontacter au moment du retrait au club house.",
    cartPay:        "Paiement sécurisé par carte sur la page Stripe, puis retrait au club house.",
    orderPaid:      "Merci ! Ta commande **{commande}** est enregistrée. Dès que Stripe confirme le paiement, tu reçois ton reçu par e-mail ; on te prévient quand elle est prête au club house.",
    orderUnpaid:    "Commande **{commande}** enregistrée, merci ! Elle sera à régler au retrait au club house ; on te recontacte.",
    footerTagline:  "Boutique officielle du club",
    footerOrders:   "Retrait en main propre au club\nCommandes groupées par 20\nNi reprise ni échange",
    footerLegal:    "© Les Implacables — commandes traitées par le bureau du club.",
    contactEmail:   "contact@implacables.fr"
  };
  var TEXTS = {};

  /* Guides des tailles (catalogue.sizeGuides, onglet Infos produits &
     commandes du backoffice). Celui marque "def" sert a tous les articles
     qui n'en ont pas d'autre, sauf ceux en taille unique. A garder
     identique a DEFAULT_GUIDES du backoffice. */
  var DEFAULT_GUIDES = [
    {
      "id": "tshirt-ample",
      "name": "T-shirt épais, coupe ample",
      "sizes": [
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL"
      ],
      "rows": [
        {
          "label": "A — Demi-tour de poitrine",
          "values": [
            "49,5",
            "52",
            "55",
            "58",
            "61",
            "64",
            "67",
            "70"
          ]
        },
        {
          "label": "B — Longueur du corps",
          "values": [
            "68",
            "70",
            "73",
            "76",
            "78",
            "80",
            "82",
            "84"
          ]
        },
        {
          "label": "C — Longueur de manche",
          "values": [
            "22,5",
            "23",
            "24",
            "25",
            "26",
            "26",
            "27",
            "28"
          ]
        }
      ],
      "note": "Mesures du vêtement posé à plat, en centimètres. Coupe ample : prends ta taille habituelle.\n**A** : d'une aisselle à l'autre. **B** : du haut de l'épaule, près du col, jusqu'en bas. **C** : de la couture d'épaule jusqu'au bout de la manche.\nLe plus simple : mesure un vêtement qui te va bien et compare."
    },
    {
      "id": "tshirt-classique",
      "name": "T-shirt col rond, coupe classique",
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "4XL",
        "5XL"
      ],
      "rows": [
        {
          "label": "A — Demi-tour de poitrine",
          "values": [
            "48",
            "50",
            "53",
            "56",
            "59",
            "62",
            "65",
            "68",
            "71"
          ]
        },
        {
          "label": "B — Longueur du corps",
          "values": [
            "64",
            "70",
            "72",
            "74",
            "76",
            "78",
            "80",
            "82",
            "84"
          ]
        }
      ],
      "note": "Mesures du vêtement posé à plat, en centimètres.\n**A** : d'une aisselle à l'autre. **B** : du haut de l'épaule, près du col, jusqu'en bas.\nLe plus simple : mesure un vêtement qui te va bien et compare."
    },
    {
      "id": "sweat-ample",
      "name": "Sweat à capuche, coupe ample",
      "sizes": [
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "4XL",
        "5XL"
      ],
      "rows": [
        {
          "label": "A — Demi-tour de poitrine",
          "values": [
            "51",
            "53",
            "55",
            "59",
            "62",
            "65",
            "69",
            "73",
            "78",
            "83"
          ]
        },
        {
          "label": "B — Longueur du corps",
          "values": [
            "64",
            "67",
            "71",
            "74",
            "76",
            "78",
            "80",
            "82",
            "84",
            "85"
          ]
        },
        {
          "label": "C — Longueur de manche",
          "values": [
            "58,5",
            "60,5",
            "64,5",
            "66,5",
            "68,5",
            "69",
            "69,5",
            "69,5",
            "69,5",
            "69,5"
          ]
        }
      ],
      "note": "Mesures du vêtement posé à plat, en centimètres.\n**A** : d'une aisselle à l'autre. **B** : du haut de l'épaule, près du col, jusqu'en bas. **C** : du haut de l'épaule jusqu'au bout de la manche.\nLe plus simple : mesure un vêtement qui te va bien et compare."
    },
    {
      "id": "sweat-col-rond",
      "name": "Sweat col rond",
      "sizes": [
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "4XL",
        "5XL"
      ],
      "rows": [
        {
          "label": "A — Demi-tour de poitrine",
          "values": [
            "46,5",
            "49",
            "51,5",
            "54",
            "57",
            "60",
            "63",
            "66",
            "71",
            "76"
          ]
        },
        {
          "label": "B — Longueur du corps",
          "values": [
            "60",
            "62",
            "67",
            "71",
            "73",
            "75",
            "77",
            "79",
            "81",
            "82"
          ]
        },
        {
          "label": "C — Longueur de manche",
          "values": [
            "60,5",
            "61,5",
            "64",
            "65,5",
            "67",
            "68,5",
            "70",
            "70",
            "70",
            "70"
          ]
        }
      ],
      "note": "Mesures du vêtement posé à plat, en centimètres.\n**A** : d'une aisselle à l'autre. **B** : du haut de l'épaule, près du col, jusqu'en bas. **C** : du haut de l'épaule jusqu'au bout de la manche.\nLe plus simple : mesure un vêtement qui te va bien et compare."
    },
    {
      "id": "polo-ajuste",
      "name": "Polo, coupe ajustée",
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "4XL",
        "5XL"
      ],
      "rows": [
        {
          "label": "A — Demi-tour de poitrine",
          "values": [
            "48",
            "51",
            "54",
            "57",
            "61",
            "65",
            "70",
            "75"
          ]
        },
        {
          "label": "B — Longueur du corps",
          "values": [
            "70",
            "72",
            "74",
            "76",
            "78",
            "80",
            "82",
            "83"
          ]
        },
        {
          "label": "C — Longueur de manche",
          "values": [
            "21",
            "21,5",
            "22",
            "22,5",
            "23",
            "23,5",
            "23,5",
            "23,5"
          ]
        }
      ],
      "note": "Mesures du vêtement posé à plat, en centimètres. Coupe ajustée, près du corps : entre deux tailles, prends la plus grande.\n**A** : d'une aisselle à l'autre. **B** : du haut de l'épaule, près du col, jusqu'en bas. **C** : de la couture d'épaule jusqu'au bout de la manche."
    },
    {
      "id": "sweat-pluie",
      "name": "Sweat de pluie",
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "4XL"
      ],
      "rows": [
        {
          "label": "A — Demi-tour de poitrine",
          "values": [
            "53",
            "56",
            "59",
            "62",
            "65",
            "68",
            "71",
            "74"
          ]
        },
        {
          "label": "B — Longueur du corps",
          "values": [
            "73,5",
            "75,5",
            "77,5",
            "79,5",
            "81,5",
            "83,5",
            "85,5",
            "87,5"
          ]
        },
        {
          "label": "C — Longueur de manche",
          "values": [
            "71,5",
            "74,3",
            "77,1",
            "80",
            "82,9",
            "85,8",
            "88,6",
            "91,8"
          ]
        }
      ],
      "note": "Mesures du vêtement posé à plat, en centimètres. Il se porte par-dessus le maillot : il est déjà coupé large.\n**A** : d'une aisselle à l'autre, juste sous la manche. **B** : du haut de l'épaule, près du col, jusqu'en bas. **C** : manches raglan, du col jusqu'au bout de la manche."
    }
  ];
  var GUIDES = DEFAULT_GUIDES;
  function sizeKey(s){ return String(s).toUpperCase().replace(/\s+/g, "").replace("XXXXL", "4XL").replace("XXXL", "3XL"); }
  function guideFor(p){
    if(!p || p.sizeGuide === "none") return null;
    if(!p.sizes.some(function(s){ return !/unique/i.test(s); })) return null;   // taille unique : rien a mesurer
    var g = GUIDES.filter(function(x){ return x.id === p.sizeGuide; })[0] || GUIDES.filter(function(x){ return x.def; })[0];
    if(!g) return null;
    // aucune taille de l'article dans le guide (ex. "8 ans" face a un guide adulte) : pas de guide
    var keys = (g.sizes || []).map(sizeKey);
    return p.sizes.some(function(s){ return keys.indexOf(sizeKey(s)) !== -1; }) ? g : null;
  }
  function richText(v){ return esc(v || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); }

  var sizeModal = null, sizeReturn = null;
  /* p : l'article (ses tailles sont mises en avant), ou rien depuis le pied de page */
  function openSizeGuide(p, guideId, showAll){
    var g = p ? guideFor(p) : (GUIDES.filter(function(x){ return x.id === guideId; })[0] || GUIDES[0]);
    if(!g) return;
    sizeModal = sizeModal || document.getElementById("sizeModal");
    var mine = p ? p.sizes.map(sizeKey) : [];
    var cols = g.sizes.map(function(s, i){ return { s:s, i:i, on:mine.indexOf(sizeKey(s)) !== -1 }; });
    var picked = cols.filter(function(c){ return c.on; });
    var shown = (picked.length && !showAll) ? picked : cols;
    var tabs = !p && GUIDES.length > 1
      ? '<div class="size-guide-tabs">' + GUIDES.map(function(x){
          return '<button type="button" data-guide="'+esc(x.id)+'" aria-pressed="'+(x.id === g.id)+'">'+esc(x.name)+'</button>';
        }).join("") + '</div>'
      : '<p class="size-guide-name">'+esc(g.name)+(p ? ' · '+esc(p.name) : '')+'</p>';
    document.getElementById("sizeModalBody").innerHTML = tabs +
      '<div class="size-table-wrap"><table class="size-table">' +
        '<thead><tr><th scope="col">Mesures en cm</th>' + shown.map(function(c){
          return '<th scope="col"'+(c.on && showAll ? ' class="is-picked"' : '')+'>'+esc(c.s)+'</th>';
        }).join("") + '</tr></thead>' +
        '<tbody>' + (g.rows || []).map(function(r){
          return '<tr><th scope="row">'+esc(r.label)+'</th>' + shown.map(function(c){
            return '<td'+(c.on && showAll ? ' class="is-picked"' : '')+'>'+esc((r.values || [])[c.i] || "–")+'</td>';
          }).join("") + '</tr>';
        }).join("") + '</tbody>' +
      '</table></div>' +
      (picked.length && picked.length < cols.length && !showAll
        ? '<button type="button" class="size-all" data-size-all>Voir toutes les tailles</button>' : '') +
      (g.note ? '<p class="size-note">'+richText(g.note)+'</p>' : '');
    sizeModal.querySelectorAll("[data-guide]").forEach(function(b){
      b.addEventListener("click", function(){ openSizeGuide(null, b.getAttribute("data-guide")); });
    });
    var all = sizeModal.querySelector("[data-size-all]");
    if(all) all.addEventListener("click", function(){ openSizeGuide(p, null, true); });
    if(sizeModal.hidden){
      sizeReturn = document.activeElement;
      sizeModal.hidden = false;
      document.getElementById("sizeModalClose").focus();
    }
  }
  function closeSizeGuide(){
    if(!sizeModal || sizeModal.hidden) return;
    sizeModal.hidden = true;
    if(sizeReturn && sizeReturn.focus) sizeReturn.focus();
  }

  function txt(k){ var v = TEXTS[k]; return typeof v === "string" && v.trim() ? v.trim() : DEFAULT_TEXTS[k]; }
  // texte mis en forme : echappe, **gras**, retours a la ligne, variables (deja echappees ici)
  function rich(k, vars){
    var s = esc(txt(k)).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
    Object.keys(vars || {}).forEach(function(v){ s = s.split("{" + v + "}").join(esc(vars[v])); });
    return s;
  }
  // textes poses dans la page elle-meme (bandeau, panier, pied de page)
  function applyTexts(){
    document.querySelectorAll("[data-text]").forEach(function(el){ el.innerHTML = rich(el.getAttribute("data-text")); });
    var mail = txt("contactEmail");
    var link = document.getElementById("contactLink");
    if(link && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) link.href = "mailto:" + mail;
  }

  /* Univers (sur-categories : Rugby, Lifestyle, Accessoires, Femme,
     Enfant...), publies par le backoffice (catalogue.json, "universes") ;
     chaque article porte le sien (univers), en plus de sa categorie. */
  var UNIVS = [];

  /* Liens vers une liste (menu, tuiles, blocs) : data-cats et data-univ,
     listes separees par "|", vides = pas de filtre. */
  function applyLinkFilter(el){
    var sp = function(v){ return v ? v.split("|").filter(Boolean) : []; };
    state.sel = pairsOf(sp(el.getAttribute("data-univ")), sp(el.getAttribute("data-cats")));
    // une taille ou couleur choisie avant (ex. "6 ans") viderait la nouvelle liste
    state.sizes = []; state.colors = []; state.price = "all";
    // arrivee par un lien : seuls les univers de la selection restent deplies
    Object.keys(openGroups).forEach(function(k){ if(k.indexOf("u:") === 0) delete openGroups[k]; });
  }
  function pairsOf(univ, cats){
    if(univ.length) return [].concat.apply([], univ.map(function(u){
      return cats.length ? cats.map(function(c){ return { u:u, c:c }; }) : [{ u:u, c:"" }];
    }));
    return cats.map(function(c){ return { u:"", c:c }; });
  }
  function selKey(list){ return list.map(function(s){ return s.u + "\u0001" + s.c; }).sort().join("|"); }
  function inSel(p){
    return !state.sel.length || state.sel.some(function(s){ return (!s.u || p.univ === s.u) && (!s.c || p.cat === s.c); });
  }
  function linkTarget(menu){ return !!((menu.cats && menu.cats.length) || (menu.univ && menu.univ.length)); }
  function linkAttrs(menu){
    return ' data-cats="'+esc((menu.cats || []).join("|"))+'" data-univ="'+esc((menu.univ || []).join("|"))+'"';
  }

  /* Commandes : l'API du serveur (server/api.js) recalcule les prix a partir
     du catalogue publie, enregistre la commande et renvoie la page de
     paiement Stripe. Sans Stripe configure, la commande est enregistree
     "a regler au retrait". */
  var ORDER_API = "/api/commande";

  /* Panier : garde les lignes choisies (tuile ou fiche). Les coordonnees
     ne sont demandees qu'a la validation, pas a l'ajout. Le stockage
     navigateur peut etre indisponible (navigation privee), d'ou les try :
     le panier retombe alors en memoire de page. */
  var cart = [];
  try {
    var savedCart = JSON.parse(localStorage.getItem("implacables-cart") || "[]");
    if(Array.isArray(savedCart)) cart = savedCart;
  } catch(e){}
  function saveCart(){ try { localStorage.setItem("implacables-cart", JSON.stringify(cart)); } catch(e){} }

  var buyer = { name:"", phone:"", email:"" };
  try {
    var savedBuyer = JSON.parse(localStorage.getItem("implacables-buyer") || "null");
    if(savedBuyer && typeof savedBuyer === "object"){
      buyer = { name:savedBuyer.name||"", phone:savedBuyer.phone||"", email:savedBuyer.email||"" };
    }
  } catch(e){}
  function rememberBuyer(b){
    buyer = { name:b.name, phone:b.phone, email:b.email };
    try { localStorage.setItem("implacables-buyer", JSON.stringify(buyer)); } catch(e){}
  }

  function cartCount(){ return cart.reduce(function(n,l){ return n + l.qty; }, 0); }
  function cartTotal(){ return cart.reduce(function(n,l){ return n + l.qty * l.prix; }, 0); }
  function refreshCartBadge(){
    var badge = document.getElementById("cartCount");
    var n = cartCount();
    badge.hidden = n === 0;
    badge.textContent = n;
  }
  function addToCart(line){
    var found = cart.filter(function(l){
      return l.id === line.id && l.couleur === line.couleur && l.taille === line.taille;
    })[0];
    if(found) found.qty++;
    else { line.qty = 1; cart.push(line); }
    saveCart();
    refreshCartBadge();
    renderCart();
    toast(line.article + " (" + line.taille + (line.couleur ? ", " + line.couleur : "") + ") ajouté au panier");
  }

  function euro(n){ return n.toFixed(2).replace(".",",") + " €"; }
  // texte place dans le HTML, y compris entre guillemets d'attribut
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }

  function toast(msg){
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._h);
    toast._h = setTimeout(function(){ t.classList.remove("show"); }, 1800);
  }

  /* ---------------- recherche ---------------- */
  /* Sans accents ni casse ; "tshirt" trouve "T-shirt", "sweats" trouve
     "Sweat". Tous les mots tapes doivent se retrouver dans l'article. */
  function norm(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function searchWords(q){ return norm(q).split(/[^a-z0-9]+/).filter(Boolean); }
  function hay(parts){ var h = norm(parts.join(" ")); return h + " " + h.replace(/[^a-z0-9]/g, ""); }
  function hit(h, w){ return h.indexOf(w) !== -1 || (w.length > 3 && /s$/.test(w) && h.indexOf(w.slice(0, -1)) !== -1); }
  function productHay(p){
    return hay([p.name, p.sub, p.cat, p.univ, p.label || "", p.colors.map(function(c){ return c.n; }).join(" "), p.desc]);
  }
  function matchesWords(p, words){
    var h = productHay(p);
    return words.every(function(w){ return hit(h, w); });
  }
  function matchQ(p){ return !state.q || matchesWords(p, searchWords(state.q)); }
  // pertinence : un mot trouve dans le nom compte plus qu'ailleurs
  function searchScore(p, words){
    var name = hay([p.name]), shelf = hay([p.cat, p.univ, p.colors.map(function(c){ return c.n; }).join(" ")]);
    return words.reduce(function(s, w){ return s + (hit(name, w) ? 3 : hit(shelf, w) ? 1 : 0); }, 0);
  }
  function searchSort(list, words){
    return list.map(function(p, i){ return { p:p, i:i, s:searchScore(p, words) }; })
      .sort(function(a, b){ return b.s - a.s || a.i - b.i; })
      .map(function(x){ return x.p; });
  }
  // nom avec les mots trouves en gras (les accents d'origine sont gardes)
  function highlight(text, words){
    var n = norm(text);
    if(n.length !== text.length) return esc(text);
    var on = [];
    words.forEach(function(w){
      if(n.indexOf(w) === -1 && w.length > 3 && /s$/.test(w)) w = w.slice(0, -1);   // "sweats" -> "sweat"
      for(var i = n.indexOf(w); i !== -1; i = n.indexOf(w, i + 1)) for(var k = i; k < i + w.length; k++) on[k] = true;
    });
    var out = "", open = false;
    for(var j = 0; j < text.length; j++){
      if(on[j] && !open){ out += "<mark>"; open = true; }
      if(!on[j] && open){ out += "</mark>"; open = false; }
      out += esc(text[j]);
    }
    return out + (open ? "</mark>" : "");
  }

  /* ---------------- filtering / sorting ---------------- */
  function filteredProducts(){
    var band = PRICE_BANDS.filter(function(b){return b.id===state.price;})[0] || PRICE_BANDS[0];
    var list = PRODUCTS.filter(function(p){
      if(!inSel(p) || !matchQ(p)) return false;
      if(state.sizes.length && !p.sizes.some(function(s){return state.sizes.indexOf(s)!==-1;})) return false;
      if(state.colors.length && !p.colors.some(function(c){return state.colors.indexOf(c.n)!==-1;})) return false;
      if(!band.test(p.price)) return false;
      return true;
    });
    if(state.q && state.sort==="new") list = searchSort(list, searchWords(state.q));
    if(state.sort==="asc") list = list.slice().sort(function(a,b){return a.price-b.price;});
    if(state.sort==="desc") list = list.slice().sort(function(a,b){return b.price-a.price;});
    return list;
  }

  /* ---------------- PLP ---------------- */
  function cardHTML(p){
    var isRupture = p.status === "rupture";
    var isPre = p.status === "precommande";
    var badge = isRupture
      ? '<span class="card-badge card-badge--rupture">Rupture</span>'
      : isPre ? '<span class="card-badge card-badge--pre">Précommande</span>'
      : (p.label ? '<span class="card-badge">'+esc(p.label)+'</span>' : "");
    var swatches = p.colors.map(function(c){return '<span style="background:'+c.h+(c.h==="#FFFFFF"?";border-color:var(--white-swatch-border)":"")+'"></span>';}).join("");
    var media = p.photo
      ? '<img src="'+p.photo+'" alt="'+esc(p.name)+'" loading="lazy">'
      : '<svg style="color:'+p.colors[0].h+'"><use href="#'+p.icon+'"/></svg>';
    // Achat rapide : tout se passe sur la tuile, sans ouvrir la fiche.
    var colorPick = p.colors.length > 1
      ? '<div class="quick-colors">' + p.colors.map(function(c,i){
          return '<button type="button" class="quick-color" data-quick-color="'+esc(c.n)+'" aria-pressed="'+(i===0)+'" title="'+esc(c.n)+'"><span style="background:'+c.h+(c.h==="#FFFFFF"?";border-color:var(--white-swatch-border)":"")+'"></span></button>';
        }).join("") + '</div>'
      : '';
    // precommande : pas d'achat rapide, le bouton mene a la fiche (e-mail)
    var quick = isPre
      ? '<div class="quick"><button type="button" class="quick-btn" data-preorder="'+p.id+'">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>' +
          'Précommander</button></div>'
      :
      '<div class="quick">' +
        '<button type="button" class="quick-btn" data-quick="'+p.id+'" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.6 9h-12z"/><path d="M6 6L4 3H2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>' +
          'Achat rapide' +
        '</button>' +
      '</div>' +
      '<div class="quick-panel" hidden>' +
        '<button type="button" class="quick-close" aria-label="Fermer l\'achat rapide">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' +
        '</button>' +
        '<p class="quick-head">'+esc(p.name)+' <span>'+euro(p.price)+'</span></p>' +
        colorPick +
        '<div class="quick-sizes">' +
          p.sizes.map(function(sz){
            return '<button type="button" class="quick-size" data-quick-size="'+sz+'" aria-pressed="false">'+sz+'</button>';
          }).join("") +
        '</div>' +
        (isRupture
          ? '<button type="button" class="quick-submit" disabled>Rupture de stock</button>'
          : '<button type="button" class="quick-submit">Ajouter au panier</button>') +
        '<button type="button" class="quick-more">Voir la fiche</button>' +
      '</div>';
    // <div> et non <button> : la tuile contient desormais ses propres boutons.
    return (
      '<div class="card" data-id="'+p.id+'" role="link" tabindex="0" aria-label="Voir '+esc(p.name)+'">' +
        '<div class="card-media">'+
          badge +
          media +
          quick +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-swatches">'+swatches+'</div>' +
          '<div class="card-name">'+esc(p.name)+'</div>' +
          '<div class="card-sub">'+esc(p.sub)+'</div>' +
          '<div class="card-price">'+euro(p.price)+'</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* Tuiles : ouverture de la fiche produit + achat rapide. Utilise aussi
     bien pour la grille que pour les suggestions en bas de fiche. */
  var pendingSize = null;
  function openProduct(id){ location.hash = "#/produit/"+id; window.scrollTo(0, 0); }

  function wireCards(root){
    root.querySelectorAll(".card").forEach(function(card){
      var id = card.getAttribute("data-id");
      var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
      var panel = card.querySelector(".quick-panel");
      var openBtn = card.querySelector("[data-quick]");

      card.addEventListener("click", function(e){
        if(e.target.closest("[data-preorder]")){ e.stopPropagation(); openProduct(id); return; }
        if(e.target.closest(".quick") || e.target.closest(".quick-panel")) return;
        openProduct(id);
      });
      card.addEventListener("keydown", function(e){
        if(e.target !== card) return;
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openProduct(id); }
      });
      // tuile sans achat rapide (precommande) : rien d'autre a brancher
      if(!panel || !openBtn) return;

      function closePanel(){ panel.hidden = true; card.classList.remove("quick-open"); openBtn.setAttribute("aria-expanded","false"); }
      function openPanel(){
        root.querySelectorAll(".quick-panel").forEach(function(q){ q.hidden = true; });
        root.querySelectorAll(".card").forEach(function(c){ c.classList.remove("quick-open"); });
        root.querySelectorAll("[data-quick]").forEach(function(b){ b.setAttribute("aria-expanded","false"); });
        panel.hidden = false;
        card.classList.add("quick-open");
        openBtn.setAttribute("aria-expanded","true");
        var firstSize = panel.querySelector("[data-quick-size]");
        if(firstSize) firstSize.focus();
      }

      openBtn.addEventListener("click", function(e){
        e.stopPropagation();
        if(panel.hidden) openPanel(); else closePanel();
      });
      panel.querySelector(".quick-close").addEventListener("click", function(e){ e.stopPropagation(); closePanel(); });
      panel.querySelector(".quick-more").addEventListener("click", function(e){ e.stopPropagation(); openProduct(id); });
      panel.addEventListener("click", function(e){ e.stopPropagation(); });
      panel.addEventListener("keydown", function(e){ if(e.key === "Escape") closePanel(); });

      function pickGroup(sel){
        panel.querySelectorAll(sel).forEach(function(btn){
          btn.addEventListener("click", function(){
            panel.querySelectorAll(sel).forEach(function(b){ b.setAttribute("aria-pressed", b === btn); });
          });
        });
      }
      pickGroup("[data-quick-size]");
      pickGroup("[data-quick-color]");

      var submit = panel.querySelector(".quick-submit");
      submit.addEventListener("click", function(e){
        e.stopPropagation();
        var sizeBtn = panel.querySelector('[data-quick-size][aria-pressed="true"]');
        if(!sizeBtn){ toast("Choisis une taille"); return; }
        var colorBtn = panel.querySelector('[data-quick-color][aria-pressed="true"]');
        addToCart({
          id: p.id,
          article: p.name,
          reference: "IMP-" + p.id.toUpperCase(),
          couleur: colorBtn ? colorBtn.getAttribute("data-quick-color") : p.colors[0].n,
          taille: sizeBtn.getAttribute("data-quick-size"),
          prix: p.price
        });
        closePanel();
      });
    });
  }

  /* Sous 860px la colonne de filtres est deplacee dans un panneau appele
     depuis la barre collee en bas (voir syncFilterHost). L'etat ouvert /
     ferme de chaque groupe est conserve d'un rendu a l'autre, puisque
     chaque filtre clique re-genere toute la page. */
  var MOBILE_Q = window.matchMedia("(max-width:860px)");
  var openGroups = { size:true, color:true, price:false };   // + "u:<univers>", ouverts quand on y coche
  function op(g){ return openGroups[g] ? " open" : ""; }

  /* Titre de la liste : la rubrique du menu (ou la tuile de l'accueil) qui
     correspond exactement a la selection, sinon l'univers et/ou les
     categories cochees. */
  function plpTitle(){
    var sel = state.sel;
    if(state.q) return "Recherche « " + state.q + " »";
    if(!sel.length) return "Toute la boutique";
    var k = selKey(sel);
    var menu = MENUS.filter(function(m){ return selKey(pairsOf(m.univ || [], m.cats || [])) === k; })[0];
    if(menu) return menu.label;
    var tile = (HOME.cats || []).filter(function(x){ return selKey(pairsOf([], x.filter || [])) === k; })[0];
    if(tile) return tile.label;
    var block = (HOME.duo || []).filter(function(x){ return selKey(pairsOf([], x.filter || [])) === k; })[0];
    if(block) return block.title;
    var us = sel.map(function(s){ return s.u; }).filter(function(x, i, all){ return x && all.indexOf(x) === i; });
    var cs = sel.map(function(s){ return s.c; }).filter(function(x, i, all){ return x && all.indexOf(x) === i; });
    var whole = sel.every(function(s){ return !s.c; });
    if(whole) return us.length <= 2 ? us.join(" · ") : "Sélection";
    if(us.length > 1 && sel.some(function(s){ return !s.c; })) return "Sélection";   // univers entier + rayon d'un autre
    var base = cs.length <= 3 ? cs.join(" · ") : "Sélection";
    return us.length === 1 ? base + " — " + us[0] : base;
  }

  function renderPLP(){
    var list = filteredProducts();
    // en recherche, la liste et ses filtres ne portent que sur les articles trouves
    var base = PRODUCTS.filter(matchQ);
    var filtered = state.sel.length || state.sizes.length || state.colors.length || state.price !== "all";
    var grid = list.length ? list.map(cardHTML).join("")
      : (state.q && !base.length)
        ? '<div class="empty-state">Aucun article pour « '+esc(state.q)+' ». Essaie « sweat », « maillot » ou une couleur.<br><button type="button" data-search-again>Nouvelle recherche</button></div>'
        : '<div class="empty-state">Aucun article ne correspond à ces filtres.' + (filtered ? '<br><button type="button" data-reset-filters>Effacer les filtres</button>' : '') + '</div>';

    /* Un bloc depliable par univers (Rugby, Lifestyle...), ses categories
       dessous : seulement celles qui y ont des articles. Les articles sans
       univers sont dans un bloc "Autres". */
    var groups = UNIVS.filter(function(u){ return base.some(function(p){ return p.univ === u; }); });
    if(base.some(function(p){ return !p.univ || groups.indexOf(p.univ) === -1; })) groups.push("");
    function isOn(u, c){
      return state.sel.some(function(s){ return s.u === u && s.c === c; }) ||
        (c && state.sel.some(function(s){ return !s.u && s.c === c; }));
    }
    var univGroups = groups.map(function(u){
      var inU = function(p){ return u ? p.univ === u : (!p.univ || groups.indexOf(p.univ) === -1); };
      var cats = CATS.filter(function(c){ return base.some(function(p){ return inU(p) && p.cat === c; }); });
      base.forEach(function(p){ if(inU(p) && cats.indexOf(p.cat) === -1) cats.push(p.cat); });
      var name = u || "Autres";
      var any = isOn(u, "") || cats.some(function(c){ return isOn(u, c); });
      var g = "u:" + name;
      if(any) openGroups[g] = true;
      return '<details class="filter-group univ-group" data-group="'+esc(g)+'"'+(openGroups[g] ? " open" : "")+'><summary>'+esc(name)+'</summary><div class="filter-body">' +
        '<label class="chk chk-all"><input type="checkbox" data-filter="sel" data-u="'+esc(u)+'" data-c=""'+(isOn(u, "")?" checked":"")+'> Tout '+esc(name)+'</label>' +
        cats.map(function(c){
          return '<label class="chk"><input type="checkbox" data-filter="sel" data-u="'+esc(u)+'" data-c="'+esc(c)+'"'+(isOn(u, c)?" checked":"")+'> '+esc(c)+'</label>';
        }).join("") +
      '</div></details>';
    }).join("");

    /* Tailles et couleurs proposees : celles des articles du rayon choisi
       (univers / categorie), plus celles deja cochees. */
    var pool = base.filter(inSel);
    var sizes = [];
    pool.forEach(function(p){ p.sizes.forEach(function(s){ if(sizes.indexOf(s) === -1) sizes.push(s); }); });
    state.sizes.forEach(function(s){ if(sizes.indexOf(s) === -1) sizes.push(s); });
    sizes.sort(function(a, b){ return sizeRank(a) - sizeRank(b) || a.localeCompare(b); });
    var sizeFilters = sizes.map(function(s){
      var on = state.sizes.indexOf(s)!==-1;
      return '<button type="button" class="chip" data-filter="size" value="'+esc(s)+'" aria-pressed="'+on+'">'+esc(s)+'</button>';
    }).join("");

    var swatches = [], count = {};
    pool.forEach(function(p){ p.colors.forEach(function(c){
      if(!count[c.n]){ count[c.n] = 0; swatches.push(c); }
      count[c.n]++;
    }); });
    state.colors.forEach(function(n){ if(!count[n]){ count[n] = 0; swatches.push({ n:n, h:"#8A8D93" }); } });
    swatches.sort(function(a, b){ return count[b.n] - count[a.n]; });   // les plus courantes d'abord
    var colorFilters = swatches.map(function(c){
      var on = state.colors.indexOf(c.n)!==-1;
      var light = /^#(f|e)[0-9a-f](f|e)[0-9a-f](f|e)[0-9a-f]$/i.test(c.h);
      return '<button type="button" class="swatch" title="'+esc(c.n)+'" aria-label="'+esc(c.n)+'" data-filter="color" value="'+esc(c.n)+'" aria-pressed="'+on+'" style="background:'+c.h+(light?";border-color:var(--white-swatch-border)":"")+'"></button>';
    }).join("");

    var priceFilters = PRICE_BANDS.map(function(b){
      var checked = state.price===b.id;
      return '<label class="chk"><input type="radio" name="price" data-filter="price" value="'+b.id+'" '+(checked?"checked":"")+'> '+b.label+'</label>';
    }).join("");

    var title = plpTitle();
    document.getElementById("view-plp").innerHTML =
      '<nav class="breadcrumb"><a href="#/">Accueil</a> / '+esc(title)+'</nav>' +
      '<div class="plp-head">' +
        '<h1>'+esc(title)+'<span class="plp-count">('+list.length+')</span></h1>' +
        '<div class="plp-toolbar">' +
          '<select class="sort-select" id="sortSelect">' +
            '<option value="new"'+(state.sort==="new"?" selected":"")+'>'+(state.q ? "Pertinence" : "Sélection du club")+'</option>' +
            '<option value="asc"'+(state.sort==="asc"?" selected":"")+'>Prix croissant</option>' +
            '<option value="desc"'+(state.sort==="desc"?" selected":"")+'>Prix décroissant</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div class="plp-layout">' +
        '<aside class="filters">' +
          univGroups +
          '<details class="filter-group" data-group="size"'+op("size")+'><summary>Taille</summary><div class="filter-body"><div class="size-row">'+sizeFilters+'</div></div></details>' +
          '<details class="filter-group" data-group="color"'+op("color")+'><summary>Couleur</summary><div class="filter-body"><div class="swatch-row">'+colorFilters+'</div></div></details>' +
          '<details class="filter-group" data-group="price"'+op("price")+'><summary>Prix</summary><div class="filter-body">'+priceFilters+'</div></details>' +
        '</aside>' +
        '<div class="product-grid">'+grid+'</div>' +
      '</div>';

    wireCards(document.getElementById("view-plp"));
    document.getElementById("view-plp").querySelectorAll('[data-filter="sel"]').forEach(function(el){
      el.addEventListener("change", function(){
        var u = el.getAttribute("data-u"), c = el.getAttribute("data-c");
        // une categorie choisie "dans tous les univers" (tuile de l'accueil)
        // devient un choix par univers, pour pouvoir en decocher un
        if(c) state.sel = [].concat.apply([], state.sel.map(function(s){
          if(s.u || s.c !== c) return [s];
          return groups.filter(function(g){ return PRODUCTS.some(function(p){ return p.cat === c && (g ? p.univ === g : !p.univ); }); })
            .map(function(g){ return { u:g, c:c }; });
        }));
        if(!c){
          state.sel = state.sel.filter(function(s){ return s.u !== u; });   // tout l'univers remplace ses categories
          if(el.checked) state.sel.push({ u:u, c:"" });
        } else {
          state.sel = state.sel.filter(function(s){ return !(s.u === u && (s.c === c || !s.c)); });
          if(el.checked) state.sel.push({ u:u, c:c });
        }
        renderPLP();
      });
    });
    document.getElementById("view-plp").querySelectorAll('[data-filter="size"]').forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.value, on = el.getAttribute("aria-pressed")==="true";
        state.sizes = on ? state.sizes.filter(function(x){return x!==v;}) : state.sizes.concat([v]);
        renderPLP();
      });
    });
    document.getElementById("view-plp").querySelectorAll('[data-filter="color"]').forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.value, on = el.getAttribute("aria-pressed")==="true";
        state.colors = on ? state.colors.filter(function(x){return x!==v;}) : state.colors.concat([v]);
        renderPLP();
      });
    });
    document.getElementById("view-plp").querySelectorAll('[data-filter="price"]').forEach(function(el){
      el.addEventListener("change", function(){ state.price = el.value; renderPLP(); });
    });
    var resetBtn = document.getElementById("view-plp").querySelector("[data-reset-filters]");
    if(resetBtn) resetBtn.addEventListener("click", function(){   // garde la section, retire taille/couleur/prix
      state.sizes = []; state.colors = []; state.price = "all";
      if(state.q) state.sel = [];   // en recherche, la section est un filtre comme un autre
      renderPLP();
    });
    var againBtn = document.getElementById("view-plp").querySelector("[data-search-again]");
    if(againBtn) againBtn.addEventListener("click", function(){ openSearch(); });
    document.getElementById("view-plp").querySelectorAll(".filter-group").forEach(function(el){
      el.addEventListener("toggle", function(){ openGroups[el.getAttribute("data-group")] = el.open; });
    });
    syncFilterHost(list.length);
    document.getElementById("sortSelect").addEventListener("change", function(e){ state.sort = e.target.value; renderPLP(); });
  }

  /* ---------------- PDP ---------------- */

  function relatedHTML(current){
    var others = PRODUCTS.filter(function(p){return p.id!==current.id;});
    var pool = others.filter(function(p){return p.cat===current.cat;});
    while(pool.length<3){ var extra = others.filter(function(p){return pool.indexOf(p)===-1;})[0]; if(!extra) break; pool.push(extra); }
    return pool.slice(0,3).map(cardHTML).join("");
  }

  /* Bloc produit : galerie + infos + achat. C'est la fiche produit, et le
     meme bloc sert au "produit du moment" de l'accueil. Tout est cherche
     dans root (pas d'id) : les deux vues coexistent dans la page.
     compact : version accueil, arretee au bouton "Ajouter au panier". */
  function productBlockHTML(p, compact){
    var views = ["Face","Dos","Detail","Porte"];
    var hasPhotos = !!(p.photos && p.photos.length);
    var mediaList = hasPhotos ? p.photos : views;
    return '<div class="pdp-layout">' +
        '<div class="pdp-gallery">' +
          '<div class="gallery-frame">' +
            (mediaList.length > 1
              ? '<button type="button" class="gallery-nav prev" aria-label="Photo précédente"><svg viewBox="0 0 16 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4L4 20l8 16"/></svg></button>' +
                '<button type="button" class="gallery-nav next" aria-label="Photo suivante"><svg viewBox="0 0 16 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l8 16-8 16"/></svg></button>'
              : '') +
            (hasPhotos
              ? '<img class="gallery-img" src="'+p.photos[0]+'" alt="'+esc(p.name)+'">'
              : '<span class="gallery-badge">'+views[0]+'</span>' +
                '<svg class="gallery-svg" style="color:'+p.colors[0].h+'"><use href="#'+p.icon+'"/></svg>'
            ) +
          '</div>' +
          (mediaList.length > 1
            ? '<div class="gallery-dots">' +
                mediaList.map(function(v,i){return '<button type="button" aria-current="'+(i===0)+'" data-i="'+i+'" aria-label="Vue '+(i+1)+' sur '+mediaList.length+'"></button>';}).join("") +
              '</div>'
            : ''
          ) +
        '</div>' +
        '<div class="pdp-info">' +
          (p.status === "precommande" ? '<div class="pdp-label">Précommande</div>'
            : p.label ? '<div class="pdp-label">'+esc(p.label)+'</div>' : '') +
          '<h1>'+esc(p.name)+'</h1>' +
          '<div class="pdp-sub">'+esc(p.sub)+'</div>' +
          '<div class="pdp-price">'+euro(p.price)+'</div>' +
          '<div class="pdp-colors">' +
            '<div class="pdp-section-title">Couleur <span class="muted color-name">'+esc(p.colors[0].n)+'</span></div>' +
            '<div class="color-thumbs">' +
              p.colors.map(function(c,i){
                return '<button type="button" class="color-thumb" data-i="'+i+'" aria-pressed="'+(i===0)+'" aria-label="'+esc(c.n)+'"><span class="swatch-fill" style="background:'+c.h+'"></span></button>';
              }).join("") +
            '</div>' +
          '</div>' +
          '<div class="pdp-sizes">' +
            '<div class="pdp-section-title">Sélectionner la taille' + (guideFor(p) ? ' <button class="size-guide-link" type="button">Guide des tailles</button>' : '') + '</div>' +
            '<div class="pdp-size-row">' +
              p.sizes.map(function(s){return '<button type="button" class="chip" data-size="'+s+'" aria-pressed="false">'+s+'</button>';}).join("") +
            '</div>' +
          '</div>' +
          (p.status === "precommande"
            ? '<form class="preorder-box" novalidate>' +
                '<p class="preorder-intro">'+rich("preorderIntro")+'</p>' +
                '<input type="email" class="preorder-email" placeholder="ton@email.fr" autocomplete="email" aria-label="Ton e-mail" required>' +
                '<button type="submit" class="btn-primary preorder-submit">Me prévenir</button>' +
                '<p class="preorder-legal">'+rich("preorderLegal")+'</p>' +
              '</form>'
            : '') +
          '<div class="pdp-actions">' +
            (p.status === "precommande" ? ''
              : p.status === "rupture"
              ? '<button class="btn-primary add-to-cart" disabled>Rupture de stock</button>'
              : '<button class="btn-primary add-to-cart">Ajouter au panier</button>') +
            (compact ? '' : '<button class="btn-secondary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> Ajouter aux favoris</button>') +
          '</div>' +
          (compact ? '' :
          '<div class="pdp-delivery">'+rich("pdpDelivery")+'</div>' +
          '<ul class="pdp-meta">' +
            '<li>Reference : IMP-'+p.id.toUpperCase()+'</li>' +
          '</ul>' +
          '<div class="accordion">' +
            '<details class="accordion-item" open><summary>Description</summary><p>'+esc(p.desc)+'</p></details>' +
            '<details class="accordion-item"><summary>Retrait</summary><p>'+rich("pdpPickup")+'</p></details>' +
            '<details class="accordion-item"><summary>Composition et entretien</summary><p>'+rich("pdpCare")+'</p></details>' +
          '</div>') +
        '</div>' +
      '</div>';
  }

  function wireProductBlock(root, p, preset){
    var guideBtn = root.querySelector(".size-guide-link");
    if(guideBtn) guideBtn.addEventListener("click", function(){ openSizeGuide(p); });
    var views = ["Face","Dos","Detail","Porte"];
    var hasPhotos = !!(p.photos && p.photos.length);
    var st = { color: p.colors[0], size: null };
    if(preset && p.sizes.indexOf(preset) !== -1){
      st.size = preset;
      root.querySelectorAll("[data-size]").forEach(function(b){ b.setAttribute("aria-pressed", b.getAttribute("data-size") === preset); });
    }

    /* Couleur et photo vont ensemble quand le backoffice a relie une photo
       a une couleur (colors[i].photo) : choisir la couleur montre sa photo,
       et arriver sur cette photo dans la galerie choisit la couleur. */
    var dots = root.querySelector(".gallery-dots");
    function selectColor(i){
      st.color = p.colors[i];
      root.querySelectorAll(".color-thumb").forEach(function(b,bi){ b.setAttribute("aria-pressed", bi===i); });
      root.querySelector(".color-name").textContent = p.colors[i].n;
      if(!hasPhotos) root.querySelector(".gallery-svg").style.color = p.colors[i].h;
    }
    function showPhoto(i){
      if(dots) dots.querySelectorAll("button").forEach(function(b,bi){ b.setAttribute("aria-current", bi===i); });
      root.querySelector(".gallery-img").src = p.photos[i];
    }
    function photoOfColor(i){ return hasPhotos && p.colors[i] && p.colors[i].photo ? p.photos.indexOf(p.colors[i].photo) : -1; }

    root.querySelectorAll(".color-thumb").forEach(function(btn){
      btn.addEventListener("click", function(){
        var i = parseInt(btn.getAttribute("data-i"),10);
        selectColor(i);
        var j = photoOfColor(i);
        if(j > -1) showPhoto(j);
      });
    });
    // on ouvre sur la photo principale ; si elle montre une couleur, c'est celle-ci qu'on selectionne
    if(hasPhotos){
      var first = p.colors.findIndex(function(x){ return x.photo && x.photo === p.photos[0]; });
      if(first > 0) selectColor(first);
    }

    /* Fleches et balayage : on avance ou recule d'une vue, en boucle, en
       passant par les points (qui changent la photo et la couleur liee). */
    function step(delta){
      if(!dots) return;
      var bs = dots.querySelectorAll("button"), n = bs.length;
      var cur = Array.prototype.findIndex.call(bs, function(b){ return b.getAttribute("aria-current") === "true"; });
      bs[((cur < 0 ? 0 : cur) + delta + n) % n].click();
    }
    var prevBtn = root.querySelector(".gallery-nav.prev"), nextBtn = root.querySelector(".gallery-nav.next");
    if(prevBtn) prevBtn.addEventListener("click", function(){ step(-1); });
    if(nextBtn) nextBtn.addEventListener("click", function(){ step(1); });
    var frame = root.querySelector(".gallery-frame"), swipe = null;
    if(frame && dots){
      frame.addEventListener("pointerdown", function(e){
        if(e.pointerType === "mouse" || e.target.closest(".gallery-nav")) return;
        swipe = { x:e.clientX, y:e.clientY };
      });
      frame.addEventListener("pointerup", function(e){
        if(!swipe) return;
        var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
        swipe = null;
        if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      });
      frame.addEventListener("pointercancel", function(){ swipe = null; });
    }

    root.querySelectorAll("[data-size]").forEach(function(btn){
      btn.addEventListener("click", function(){
        st.size = btn.getAttribute("data-size");
        root.querySelectorAll("[data-size]").forEach(function(b){ b.setAttribute("aria-pressed", b===btn); });
      });
    });

    if(dots){
      dots.querySelectorAll("button").forEach(function(btn){
        btn.addEventListener("click", function(){
          var i = parseInt(btn.getAttribute("data-i"),10);
          dots.querySelectorAll("button").forEach(function(b,bi){ b.setAttribute("aria-current", bi===i); });
          if(hasPhotos){
            showPhoto(i);
            var c = p.colors.findIndex(function(x){ return x.photo && x.photo === p.photos[i]; });
            if(c > -1) selectColor(c);
          } else {
            root.querySelector(".gallery-badge").textContent = views[i];
            root.querySelector(".gallery-svg").style.transform = i===1 ? "scaleX(-1)" : i===2 ? "scale(1.35)" : "none";
          }
        });
      });
    }

    var pre = root.querySelector(".preorder-box");
    if(pre){
      var mail = pre.querySelector(".preorder-email");
      if(buyer.email) mail.value = buyer.email;
      pre.addEventListener("submit", function(e){
        e.preventDefault();
        if(p.sizes.length && !st.size){ toast("Choisis une taille"); return; }
        var email = mail.value.trim();
        if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ toast("Indique un e-mail valide"); mail.focus(); return; }
        var btn = pre.querySelector(".preorder-submit");
        btn.disabled = true; btn.textContent = "Un instant…";
        fetch("/api/precommande", {
          method:"POST", headers:{ "Content-Type":"application/json" },
          body:JSON.stringify({ id:p.id, taille:st.size || "", couleur:st.color.n, email:email })
        })
          .then(function(r){ return r.json().catch(function(){ return { ok:false }; }); })
          .then(function(res){
            if(!res.ok) throw new Error(res.erreur || "Envoi impossible, réessaie dans un instant");
            rememberBuyer({ name:buyer.name, phone:buyer.phone, email:email });
            pre.innerHTML = '<p class="preorder-done">' + rich("preorderDone", { email:email,
              article:p.name + " (" + (st.size || "taille unique") + ", " + st.color.n + ")" }) + '</p>';
          })
          .catch(function(err){ btn.disabled = false; btn.textContent = "Me prévenir"; toast(err.message); });
      });
    }

    var addBtn = root.querySelector(".add-to-cart");
    if(addBtn) addBtn.addEventListener("click", function(){
      if(!st.size){ toast("Choisis une taille avant d'ajouter au panier"); return; }
      addToCart({
        id: p.id,
        article: p.name,
        reference: "IMP-"+p.id.toUpperCase(),
        couleur: st.color.n,
        taille: st.size,
        prix: p.price
      });
      var self = this;
      self.textContent = "Ajouté au panier ✓";
      self.setAttribute("data-added","true");
      setTimeout(function(){ self.textContent = "Ajouter au panier"; self.removeAttribute("data-added"); }, 1600);
    });
  }

  function renderPDP(id){
    var p = PRODUCTS.filter(function(x){return x.id===id;})[0];
    if(!p){ location.hash = "#/"; return; }
    var preset = pendingSize && pendingSize.id === id ? pendingSize.size : null;
    pendingSize = null;

    var view = document.getElementById("view-pdp");
    view.innerHTML =
      '<button class="pdp-back" id="pdpBack"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> Retour</button>' +
      productBlockHTML(p) +
      '<section class="related">' +
        '<h2>Vous aimerez aussi</h2>' +
        '<div class="related-grid">'+relatedHTML(p)+'</div>' +
      '</section>';

    document.getElementById("pdpBack").addEventListener("click", function(){ location.hash = "#/"; });
    wireProductBlock(view.querySelector(".pdp-layout"), p, preset);
    wireCards(view);
    window.scrollTo(0,0);
  }

  /* ---------------- menu principal (mega-menu) ---------------- */
  var MENUS = [
    { label:"Vêtements rugby", cats:["Maillots","Shorts","Sweats","T-shirts"], cols:[
        { title:"Maillots", ids:["maillot-domicile","maillot-exterieur","vareuse-entrainement"] },
        { title:"Entraînement", ids:["short-entrainement","tshirt-training","veste-survetement"] }
      ] },
    { label:"Lifestyle", cats:["Sweats","T-shirts"], cols:[
        { title:"Prêt-à-porter", ids:["sweat-capuche","polo-club"] }
      ] },
    { label:"Enfant", cols:[], note:"La collection enfant arrive pour la saison prochaine. Les tailles junior des maillots sont déjà disponibles sur demande auprès du club." },
    { label:"Accessoires", cats:["Accessoires","Chaussettes"], cols:[
        { title:"Le sac du joueur", ids:["chaussettes-match","bonnet-club","sac-sport"] }
      ] }
  ];

  function megaLinkHTML(id){
    var p = PRODUCTS.filter(function(x){ return x.id===id; })[0];
    if(!p) return "";
    return '<button type="button" class="mega-link" data-goto="'+p.id+'">'+
             (p.photo
               ? '<span class="mega-thumb"><img src="'+p.photo+'" alt="" loading="lazy"></span>'
               : '<span class="mega-icon" style="color:'+p.colors[0].h+'"><svg><use href="#'+p.icon+'"/></svg></span>')+
             '<span class="mega-name">'+esc(p.name)+'</span>'+
             '<span class="mega-price">'+euro(p.price)+'</span>'+
           '</button>';
  }

  /* Titre de colonne qui porte le nom d'une categorie (accents et
     majuscules ignores) : lien vers cette categorie dans l'univers de la
     rubrique. Sinon simple titre. */
  function plain(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }
  function colTitleHTML(menu, col){
    var cat = CATS.filter(function(c){ return plain(c) === plain(col.title); })[0];
    if(!cat) return '<p class="mega-col-title">'+esc(col.title)+'</p>';
    return '<button type="button" class="mega-col-title mega-col-link"'+linkAttrs({ univ:menu.univ, cats:[cat] })+'>'+esc(col.title)+'</button>';
  }

  /* Colonnes d'une rubrique : celles composees dans le backoffice ; a
     defaut, les articles de son univers (et categories), une colonne par
     categorie. Vide s'il n'y a aucun article : le message s'affiche. */
  function menuCols(menu){
    if(menu.cols && menu.cols.length) return menu.cols;
    if(!linkTarget(menu)) return [];
    var pairs = pairsOf(menu.univ || [], menu.cats || []);
    var items = PRODUCTS.filter(function(p){
      return pairs.some(function(s){ return (!s.u || p.univ === s.u) && (!s.c || p.cat === s.c); });
    });
    var cols = [];
    CATS.concat(items.map(function(p){ return p.cat; })).forEach(function(c){
      if(cols.some(function(x){ return x.title === c; })) return;
      var ids = items.filter(function(p){ return p.cat === c; }).map(function(p){ return p.id; });
      if(ids.length) cols.push({ title:c, ids:ids });
    });
    return cols;
  }

  function renderMainNav(){
    // pas de "Voir tout" en bas : le nom de la rubrique (et les titres de
    // colonne qui sont des categories) menent deja aux listes
    document.getElementById("mainNavList").innerHTML = MENUS.map(function(menu, i){
      var panel, foot = "", cols = menuCols(menu);
      if(cols.length){
        panel = cols.map(function(col){
          return '<div class="mega-col">'+
                   colTitleHTML(menu, col)+
                   '<div class="mega-col-items'+(col.ids.length >= 4 ? ' two' : '')+'">'+col.ids.map(megaLinkHTML).join("")+'</div>'+
                 '</div>';
        }).join("");
      } else {
        panel = '<div class="mega-col"><p class="mega-empty">'+esc(menu.note||"")+'</p></div>';
      }
      return '<li class="main-nav-item" data-menu="'+i+'">'+
               '<button type="button" class="main-nav-link'+(linkTarget(menu) ? '' : ' no-target')+'" aria-expanded="false"'+
                 (linkTarget(menu) ? linkAttrs(menu) : '')+'>'+esc(menu.label)+'</button>'+
               '<div class="mega-panel"><div class="mega-inner">'+panel+'</div>'+foot+'</div>'+
             '</li>';
    }).join("");
  }

  function closeMenus(){
    document.querySelectorAll(".main-nav-item.open").forEach(function(li){
      li.classList.remove("open");
      li.querySelector(".main-nav-link").setAttribute("aria-expanded","false");
    });
  }

  function openMenu(li){
    if(li.classList.contains("open")) return;
    closeMenus();
    li.classList.add("open");
    li.querySelector(".main-nav-link").setAttribute("aria-expanded","true");
  }

  function wireMainNav(){
    var nav = document.getElementById("mainNav");
    var hoverable = window.matchMedia("(hover:hover)").matches;

    nav.querySelectorAll(".main-nav-item").forEach(function(li){
      var link = li.querySelector(".main-nav-link");
      /* Le nom de la rubrique mene a sa liste (comme "Voir tout"). Sur
         ecran tactile sans survol, le premier appui ouvre le menu et le
         second suit le lien. Une rubrique sans liste (Enfant) ne fait
         qu'ouvrir son menu. */
      link.addEventListener("click", function(e){
        var target = link.hasAttribute("data-cats");
        if(target && (hoverable || li.classList.contains("open"))) return;   // gere plus bas, comme "Voir tout"
        e.stopPropagation();
        if(li.classList.contains("open") && !hoverable) closeMenus(); else openMenu(li);
      });
      if(hoverable){
        li.addEventListener("mouseenter", function(){ openMenu(li); });
        link.addEventListener("focus", function(){ openMenu(li); });
      }
    });

    if(hoverable) nav.addEventListener("mouseleave", closeMenus);
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeMenus(); });
    document.addEventListener("click", function(e){ if(!nav.contains(e.target)) closeMenus(); });

    nav.addEventListener("click", function(e){
      var go = e.target.closest("[data-goto]");
      if(go){ closeMenus(); location.hash = "#/produit/"+go.getAttribute("data-goto"); window.scrollTo(0,0); return; }
      var all = e.target.closest("[data-cats]");
      if(all){
        closeMenus();
        applyLinkFilter(all);
        if(location.hash === "#/boutique") route(); else location.hash = "#/boutique";
        window.scrollTo(0,0);
      }
    });
  }

  /* ---------------- mobile : tiroir de nav + panneau de filtres ---------------- */
  var scrim = document.getElementById("scrim");
  var navDrawer = document.getElementById("navDrawer");
  var filterSheet = document.getElementById("filterSheet");
  var filterBar = document.getElementById("filterBar");
  var sheetBody = document.getElementById("sheetBody");
  var sortWrap = document.createElement("div");

  function renderDrawer(){
    document.getElementById("drawerBody").innerHTML = MENUS.map(function(menu){
      var body, cols = menuCols(menu);
      if(cols.length){
        body = cols.map(function(col){
          return '<p class="mega-col-title" style="padding:6px 18px 0;">'+esc(col.title)+'</p>'+
                 col.ids.map(megaLinkHTML).join("");
        }).join("");
        if(linkTarget(menu)){
          body += '<button type="button" class="mega-all"'+linkAttrs(menu)+'>'+
                  'Voir tout ' + esc(menu.label.toLowerCase()) + '</button>';
        }
      } else {
        body = '<p class="mega-empty">'+esc(menu.note||"")+'</p>';
      }
      return '<details class="drawer-group"><summary>'+esc(menu.label)+'</summary>'+body+'</details>';
    }).join("");
  }

  function lockScroll(on){ document.body.style.overflow = on ? "hidden" : ""; }

  function closeOverlays(){
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
    navDrawer.classList.remove("open");
    filterSheet.classList.remove("open");
    scrim.classList.remove("show");
    navDrawer.setAttribute("aria-hidden","true");
    filterSheet.setAttribute("aria-hidden","true");
    document.getElementById("burgerBtn").setAttribute("aria-expanded","false");
    lockScroll(false);
  }

  function openDrawer(){
    closeMenus();
    navDrawer.classList.add("open");
    navDrawer.setAttribute("aria-hidden","false");
    scrim.classList.add("show");
    document.getElementById("burgerBtn").setAttribute("aria-expanded","true");
    lockScroll(true);
  }

  function openSheet(){
    filterSheet.classList.add("open");
    filterSheet.setAttribute("aria-hidden","false");
    scrim.classList.add("show");
    lockScroll(true);
    sheetBody.scrollTop = 0;
  }

  function renderSortGroup(){
    sortWrap.innerHTML = '<details class="filter-group" data-group="sort" open><summary>Trier par</summary><div class="filter-body">'+
      [["new", state.q ? "Pertinence" : "Sélection du club"],["asc","Prix croissant"],["desc","Prix décroissant"]].map(function(o){
        return '<label class="chk"><input type="radio" name="sheetSort" value="'+o[0]+'"'+(state.sort===o[0]?" checked":"")+'> '+o[1]+'</label>';
      }).join("")+
      '</div></details>';
  }

  /* Deplace la colonne de filtres fraichement rendue dans le panneau du bas
     sur mobile (et la laisse dans la page sur desktop), puis met a jour les
     libelles de la barre. */
  function syncFilterHost(count){
    var fresh = document.querySelector("#view-plp .filters");
    var parked = sheetBody.querySelector(".filters");
    if(MOBILE_Q.matches){
      if(fresh){
        if(parked) parked.remove();
        if(!sortWrap.parentNode) sheetBody.appendChild(sortWrap);
        renderSortGroup();
        sheetBody.appendChild(fresh);
      }
    } else if(parked){
      parked.remove();
    }
    var active = state.sel.length + state.sizes.length + state.colors.length + (state.price!=="all" ? 1 : 0);
    document.getElementById("filterLabel").textContent = active ? "Filtrer et trier ("+active+")" : "Filtrer et trier";
    document.getElementById("sheetApply").textContent = "Voir les "+count+" article"+(count>1?"s":"");
  }

  function wireMobileChrome(){
    document.getElementById("burgerBtn").addEventListener("click", openDrawer);
    document.getElementById("drawerClose").addEventListener("click", closeOverlays);
    document.getElementById("sheetClose").addEventListener("click", closeOverlays);
    document.getElementById("sheetApply").addEventListener("click", closeOverlays);
    document.getElementById("openFilters").addEventListener("click", openSheet);
    scrim.addEventListener("click", closeOverlays);
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeOverlays(); });

    sortWrap.addEventListener("change", function(e){
      if(e.target.name !== "sheetSort") return;
      state.sort = e.target.value;
      renderPLP();
    });

    document.getElementById("sheetReset").addEventListener("click", function(){
      state.sel = []; state.sizes = []; state.colors = []; state.price = "all";
      renderPLP();
    });

    navDrawer.addEventListener("click", function(e){
      var go = e.target.closest("[data-goto]");
      if(go){ closeOverlays(); location.hash = "#/produit/"+go.getAttribute("data-goto"); window.scrollTo(0,0); return; }
      var all = e.target.closest("[data-cats]");
      if(all){
        closeOverlays();
        applyLinkFilter(all);
        if(location.hash === "#/boutique") route(); else location.hash = "#/boutique";
        window.scrollTo(0,0);
      }
    });

    MOBILE_Q.addEventListener("change", function(){
      closeOverlays();
      if(!document.getElementById("view-plp").hidden) renderPLP();
    });
  }

  /* ---------------- page d'accueil ---------------- */
  /* Contenu editable depuis le backoffice (onglet Page d'accueil). Le
     backoffice ecrit la meme cle de stockage ; a defaut, ces valeurs
     servent de contenu par defaut. Le produit mis en avant, lui, vient
     du catalogue : c'est la fiche produit qui porte l'option "hero". */
  var HOME_DEFAULT = {
    heroEyebrow: "Collection 26/27",
    cats: [
      { label:"Vêtements rugby", filter:["Maillots","Shorts"], id:"maillot-domicile" },
      { label:"Lifestyle",       filter:["Sweats","T-shirts"], id:"sweat-capuche" },
      { label:"Accessoires",     filter:["Accessoires","Chaussettes"], id:"sac-sport" }
    ],
    railTitle: "Les plus demandés",
    railSub: "Ce que le vestiaire commande le plus cette saison.",
    duo: [
      { title:"Le kit de match", text:"Maillot, short et chaussettes du kit officiel, assortis.", cta:"Découvrir", filter:["Maillots","Shorts","Chaussettes"], id:"maillot-domicile" },
      { title:"Le vestiaire",    text:"Sweats, polos et vestes pour les jours sans crampons.", cta:"Découvrir", filter:["Sweats","T-shirts"], id:"maillot-exterieur" }
    ],
    trust: [
      { title:"Retrait au club",       text:"En main propre, sans frais." },
      { title:"Commandes groupées",    text:"Envoyées au fournisseur par lots de 20." },
      { title:"Paiement sécurisé",     text:"Par carte bancaire, via Stripe." }
    ]
  };
  var HOME = HOME_DEFAULT;
  /* un champ laisse vide ne doit pas effacer le texte par defaut */
  function nonEmpty(o){
    var r = {};
    Object.keys(o).forEach(function(k){ if(o[k] !== "" && o[k] != null) r[k] = o[k]; });
    return r;
  }
  function applyHome(saved){
    if(saved && typeof saved === "object") HOME = Object.assign({}, HOME_DEFAULT, nonEmpty(saved));
    ["cats", "duo"].forEach(function(k){
      if(Array.isArray(HOME[k])) HOME[k] = HOME[k].map(function(x){ return Object.assign({}, x, { image:safeUrl(x && x.image) || null, id:safeId(x && x.id) || undefined }); });
    });
    if(HOME.hero && typeof HOME.hero === "object") HOME.hero = Object.assign({}, HOME.hero, { image:safeUrl(HOME.hero.image) || undefined, id:safeId(HOME.hero.id) || undefined });
  }

  /* Le produit mis en avant vient du backoffice (option cochee sur la fiche
     produit, avec son visuel et ses textes). A defaut, on retombe sur le
     produit marque hero dans le catalogue de cette page. */
  function heroProduct(){
    var h = HOME.hero || {};
    var p = PRODUCTS.filter(function(x){ return x.id === h.id; })[0]
         || PRODUCTS.filter(function(x){ return x.hero; })[0]
         || PRODUCTS[0];
    return {
      id: p.id, name: p.name, desc: p.desc, price: p.price, sizes: p.sizes,
      colors: p.colors, icon: p.icon, photo: p.photo,
      heroTitle: h.title || p.heroTitle || p.name,
      heroText:  h.text  || p.heroText  || p.desc,
      heroCta:   h.cta   || p.heroCta   || "Découvrir",
      heroImage: h.image || p.heroImage,
      heroFit:   h.fit   || p.heroFit   || "auto",
      heroFocus: h.focus != null ? h.focus : (p.heroFocus != null ? p.heroFocus : 50)
    };
  }
  function mediaOf(p, cls){
    if(p && p.photo) return '<img src="'+p.photo+'" alt="'+esc(p.name)+'" loading="lazy">';
    var color = p ? p.colors[0].h : "#0B1F3D";
    return '<svg class="'+(cls||"")+'" style="color:'+color+'"><use href="#'+(p ? p.icon : "icon-shirt")+'"/></svg>';
  }
  var TRUST_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 10h18"/><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M4 10h16v9H4z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 20v-5h5"/></svg>'
  ];

  /* Cadrage du visuel de hero. "cover" remplit le cadre en recadrant,
     "contain" convient aux packshots detoures. En automatique, on regarde
     les bords de l'image : un fond uni et clair tout autour = packshot. */
  function applyHeroFraming(panel, fit, focus){
    var img = panel.querySelector("img");
    if(!img) return;
    panel.style.setProperty("--hero-focus", (focus == null ? 50 : focus) + "%");
    if(fit === "cover") return;

    /* Couleur moyenne des bords, et leur ecart a cette moyenne. */
    function edgeColor(){
      var n = 40, c = document.createElement("canvas");
      c.width = n; c.height = n;
      var ctx = c.getContext("2d", { willReadFrequently:true });
      ctx.drawImage(img, 0, 0, n, n);
      var d = ctx.getImageData(0, 0, n, n).data, edge = [];
      function at(x, y){ var i = (y*n + x) * 4; return [d[i], d[i+1], d[i+2]]; }
      for(var k = 0; k < n; k++){ edge.push(at(k,0), at(k,n-1), at(0,k), at(n-1,k)); }
      var mean = [0,0,0];
      edge.forEach(function(q){ mean[0]+=q[0]; mean[1]+=q[1]; mean[2]+=q[2]; });
      mean = mean.map(function(v){ return v / edge.length; });
      var dev = 0;
      edge.forEach(function(q){ dev += Math.abs(q[0]-mean[0]) + Math.abs(q[1]-mean[1]) + Math.abs(q[2]-mean[2]); });
      return { mean:mean, dev:dev / edge.length };
    }

    /* Packshot : on coupe le fond vide autour du sujet (t-shirts poses
       sur fond clair), pour qu'il remplisse le cadre sans etre rogne. On
       cherche, sur une version reduite, les lignes et colonnes ou assez de
       pixels s'ecartent nettement de la couleur du fond, puis on recadre
       l'image d'origine sur cette zone, avec une marge. */
    function trimToSubject(mean){
      var W = 240, H = Math.max(1, Math.round(W * img.naturalHeight / img.naturalWidth));
      var c = document.createElement("canvas");
      c.width = W; c.height = H;
      var ctx = c.getContext("2d", { willReadFrequently:true });
      ctx.drawImage(img, 0, 0, W, H);
      var d = ctx.getImageData(0, 0, W, H).data;
      var rows = new Array(H).fill(0), cols = new Array(W).fill(0);
      for(var y = 0; y < H; y++) for(var x = 0; x < W; x++){
        var i = (y*W + x) * 4;
        if(Math.abs(d[i]-mean[0]) + Math.abs(d[i+1]-mean[1]) + Math.abs(d[i+2]-mean[2]) > 45){ rows[y]++; cols[x]++; }
      }
      function span(arr, len, other){
        var min = other * 0.01, a = 0, b = len - 1;
        while(a < len && arr[a] <= min) a++;
        while(b > a && arr[b] <= min) b--;
        return [a, b];
      }
      var ys = span(rows, H, W), xs = span(cols, W, H);
      if(ys[0] >= ys[1] || xs[0] >= xs[1]) return;
      var mx = (xs[1] - xs[0]) * 0.06, my = (ys[1] - ys[0]) * 0.06;
      var x0 = Math.max(0, xs[0] - mx), x1 = Math.min(W, xs[1] + mx + 1);
      var y0 = Math.max(0, ys[0] - my), y1 = Math.min(H, ys[1] + my + 1);
      if((x1 - x0) * (y1 - y0) > W * H * 0.85) return;   // presque rien a couper
      var k = img.naturalWidth / W;
      var out = document.createElement("canvas");
      out.width = Math.round((x1 - x0) * k); out.height = Math.round((y1 - y0) * k);
      out.getContext("2d").drawImage(img, x0 * k, y0 * k, out.width, out.height, 0, 0, out.width, out.height);
      img.src = out.toDataURL("image/jpeg", 0.9);
    }

    function detect(){
      try {
        var e = edgeColor();
        var packshot = fit === "contain" || (e.dev < 14 && (e.mean[0]+e.mean[1]+e.mean[2])/3 > 198);
        if(!packshot) return;
        panel.classList.add("is-packshot");
        if(e.dev < 30) panel.style.background = "rgb(" + e.mean.map(Math.round).join(",") + ")";
        trimToSubject(e.mean);
      } catch(err){ /* canvas non lisible (file://) : on garde le remplissage */ }
    }
    if(img.complete && img.naturalWidth) detect(); else img.addEventListener("load", detect, { once:true });
  }

  /* "Le produit du moment" : reglage a part dans le backoffice (featureId),
     a defaut le meme article que le hero. */
  function featureProduct(heroId){
    var byId = function(id){ return PRODUCTS.filter(function(x){ return x.id === id; })[0]; };
    return (HOME.featureId && byId(HOME.featureId)) || byId(heroId) || PRODUCTS[0];
  }

  function renderHome(){
    var p = heroProduct();
    var f = featureProduct(p.id);
    var heroVisual = p.heroImage
      ? '<img src="'+p.heroImage+'" alt="'+esc(p.heroTitle || p.name)+'">'
      : (p.photo ? '<img src="'+p.photo+'" alt="'+esc(p.name)+'">'
                 : '<div class="hero-fallback"><svg style="color:'+p.colors[0].h+'"><use href="#'+p.icon+'"/></svg></div>');

    var rail = PRODUCTS.slice(0, 8).map(cardHTML).join("");

    var cats = HOME.cats.map(function(c){
      var ref = PRODUCTS.filter(function(x){ return x.id === c.id; })[0];
      var visual = c.image
        ? '<img src="'+c.image+'" alt="'+esc(c.label)+'">'
        : (ref && ref.photo ? '<img src="'+ref.photo+'" alt="'+esc(c.label)+'">'
                            : '<div class="cat-icon">'+mediaOf(ref)+'</div>');
      return '<button type="button" class="cat-tile" data-cats="'+(c.filter||[]).join("|")+'">'+
               visual + '<span class="cat-label">'+esc(c.label)+'</span>' +
             '</button>';
    }).join("");

    var duo = HOME.duo.map(function(d){
      var ref = PRODUCTS.filter(function(x){ return x.id === d.id; })[0];
      var bg = d.image ? '<img src="'+d.image+'" alt="">'
                       : (ref && ref.photo ? '<img src="'+ref.photo+'" alt="">' : "");
      return '<div class="duo-block">'+ bg +
               '<div class="duo-inner">'+
                 '<h3>'+esc(d.title)+'</h3>'+
                 '<p>'+esc(d.text)+'</p>'+
                 '<button type="button" class="duo-cta" data-cats="'+(d.filter||[]).join("|")+'">'+esc(d.cta || "Découvrir")+'</button>'+
               '</div></div>';
    }).join("");

    var trust = HOME.trust.map(function(t, i){
      return '<div class="trust-item">'+ TRUST_ICONS[i % TRUST_ICONS.length] +
               '<div><b>'+esc(t.title)+'</b><span>'+esc(t.text)+'</span></div></div>';
    }).join("");

    document.getElementById("view-home").innerHTML =
      '<section class="full">' +
        '<div class="hero">' +
          '<div class="hero-text">' +
            '<span class="hero-eyebrow">'+esc(HOME.heroEyebrow || "")+'</span>' +
            '<h1 class="hero-title">'+esc(p.heroTitle || p.name)+'</h1>' +
            '<p class="hero-baseline">'+esc(p.heroText || p.desc)+'</p>' +
            '<button type="button" class="hero-cta" data-goto="'+p.id+'">'+esc(p.heroCta || "Découvrir")+'</button>' +
          '</div>' +
          '<div class="hero-media">'+heroVisual+'</div>' +
        '</div>' +
      '</section>' +

      '<section class="after-hero">' +
        '<div class="home-head">' +
          '<div><h2 class="home-title">'+rich("featuredTitle")+'</h2>' +
          '<p class="home-sub">'+rich("featuredSub")+'</p></div>' +
        '</div>' +
        '<div class="home-product">' + productBlockHTML(f, true) + '</div>' +
      '</section>' +

      '<section style="margin-top:72px"><div class="cats-grid">'+cats+'</div></section>' +

      '<section style="margin-top:72px">' +
        '<div class="home-head">' +
          '<div><h2 class="home-title">'+esc(HOME.railTitle)+'</h2><p class="home-sub">'+esc(HOME.railSub)+'</p></div>' +
          '<button type="button" class="link-all" data-cats="">Tout afficher</button>' +
        '</div>' +
        '<div class="rail">'+rail+'</div>' +
      '</section>' +

      '<section style="margin-top:72px"><div class="duo">'+duo+'</div></section>' +

      '<section style="margin-top:72px"><div class="trust">'+trust+'</div></section>';

    applyHeroFraming(document.querySelector(".hero-media"), p.heroFit, p.heroFocus);

    wireCards(document.getElementById("view-home"));

    var home = document.getElementById("view-home");
    home.querySelectorAll("[data-cats]").forEach(function(btn){
      if(btn.closest(".card")) return;   // deja gere par wireCards
      btn.addEventListener("click", function(){
        applyLinkFilter(btn);
        location.hash = "#/boutique";
        window.scrollTo(0, 0);
      });
    });
    home.querySelectorAll("[data-goto]").forEach(function(btn){
      if(btn.closest(".card")) return;
      btn.addEventListener("click", function(){ openProduct(btn.getAttribute("data-goto")); });
    });
    wireProductBlock(home.querySelector(".home-product .pdp-layout"), f);
  }

  /* ---------------- panier ---------------- */
  var cartDrawer = document.getElementById("cartDrawer");
  var cartBody = document.getElementById("cartBody");
  var cartFoot = document.getElementById("cartFoot");
  var cartForm = document.getElementById("cartForm");

  /* Vignette d'une ligne : la photo de la couleur choisie si une photo y
     est reliee, sinon la photo principale ; sans photo, le pictogramme
     dans la couleur choisie. Deux couleurs du meme article se distinguent. */
  function lineColor(l, p){ return p ? (p.colors.filter(function(c){ return c.n === l.couleur; })[0] || p.colors[0]) : null; }
  function lineMedia(l){
    var p = PRODUCTS.filter(function(x){ return x.id === l.id; })[0];
    var c = lineColor(l, p);
    var photo = p && ((c && c.photo) || p.photo);
    if(photo) return '<img src="'+photo+'" alt="" loading="lazy">';
    var color = c ? c.h : "#0B1F3D";
    return '<svg style="color:'+color+'"><use href="#'+(p ? p.icon : "icon-shirt")+'"/></svg>';
  }

  function renderCart(){
    if(!cart.length){
      cartBody.innerHTML = '<p class="cart-empty">'+rich("cartEmpty")+'</p>';
      cartFoot.hidden = true;
      return;
    }
    cartBody.innerHTML = cart.map(function(l, i){
      return '<div class="cart-line">' +
               '<div class="cart-line-media">'+lineMedia(l)+'</div>' +
               '<div class="cart-line-info">' +
                 '<div class="cart-line-name">'+esc(l.article)+'</div>' +
                 '<div class="cart-line-meta">'+(function(){
                   var p = PRODUCTS.filter(function(x){ return x.id === l.id; })[0], c = lineColor(l, p);
                   return (c ? '<span class="cart-dot" style="background:'+c.h+'"></span>' : '') + esc(l.couleur);
                 })()+' · Taille '+esc(l.taille)+'</div>' +
                 '<div class="cart-line-price">'+euro(l.prix * l.qty)+'</div>' +
                 '<div class="cart-qty">' +
                   '<button type="button" data-qty="-1" data-i="'+i+'" aria-label="Retirer un exemplaire">−</button>' +
                   '<span>'+l.qty+'</span>' +
                   '<button type="button" data-qty="1" data-i="'+i+'" aria-label="Ajouter un exemplaire">+</button>' +
                   '<button type="button" class="cart-drop" data-drop="'+i+'" aria-label="Retirer '+esc(l.article)+' du panier" title="Retirer du panier">' +
                     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/></svg>' +
                   '</button>' +
                 '</div>' +
               '</div>' +
             '</div>';
    }).join("");
    cartFoot.hidden = false;
    document.getElementById("cartTotal").textContent = euro(cartTotal());
  }

  function openCart(){
    closeOverlays();
    renderCart();
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden","false");
    document.getElementById("scrim").classList.add("show");
    lockScroll(true);
  }

  cartBody.addEventListener("click", function(e){
    var q = e.target.closest("[data-qty]");
    if(q){
      var line = cart[+q.getAttribute("data-i")];
      line.qty += +q.getAttribute("data-qty");
      if(line.qty < 1) cart.splice(cart.indexOf(line), 1);
      saveCart(); refreshCartBadge(); renderCart();
      return;
    }
    var d = e.target.closest("[data-drop]");
    if(d){
      cart.splice(+d.getAttribute("data-drop"), 1);
      saveCart(); refreshCartBadge(); renderCart();
    }
  });

  document.getElementById("cartCheckout").addEventListener("click", function(){
    this.hidden = true;
    cartForm.hidden = false;
    document.getElementById("coName").value = buyer.name;
    document.getElementById("coPhone").value = buyer.phone;
    document.getElementById("coEmail").value = buyer.email;
    document.getElementById(buyer.name ? "coPhone" : "coName").focus();
  });

  cartForm.addEventListener("submit", function(e){
    e.preventDefault();
    var name = document.getElementById("coName").value.trim();
    var phone = document.getElementById("coPhone").value.trim();
    var email = document.getElementById("coEmail").value.trim();
    if(!name || !phone || !email){ toast("Nom, téléphone et e-mail sont nécessaires"); return; }

    var btn = document.getElementById("cartConfirm");
    btn.disabled = true;
    btn.textContent = "Un instant…";
    function fail(msg){
      btn.disabled = false;
      btn.textContent = "Commander et payer";
      toast(msg || "Commande non envoyée, vérifie ta connexion et réessaie");
    }

    fetch(ORDER_API, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        client:{ nom:name, telephone:phone, email:email },
        lignes:cart.map(function(l){ return { id:l.id, couleur:l.couleur, taille:l.taille, quantite:l.qty }; })
      })
    })
      .then(function(r){ return r.json().catch(function(){ return { ok:false }; }); })
      .then(function(res){
        if(!res.ok) return fail(res.erreur);
        rememberBuyer({ name:name, phone:phone, email:email });
        if(res.url){
          // le panier est garde tant que le paiement n'est pas fait :
          // il est vide au retour sur #/merci/<commande>
          location.href = res.url;
          return;
        }
        showOrderDone(res.id, false);
      })
      .catch(function(){ fail(); });
  });

  /* Fin de commande : retour de Stripe (#/merci/<id>) ou commande sans
     paiement en ligne. Le panier est vide a ce moment-la seulement. */
  function showOrderDone(id, paid){
    cart = [];
    saveCart(); refreshCartBadge();
    cartForm.hidden = true;
    var btn = document.getElementById("cartConfirm");
    btn.disabled = false;
    btn.textContent = "Commander et payer";
    document.getElementById("cartCheckout").hidden = false;
    openCart();   // redessine le panier (vide) : le message vient apres
    cartBody.innerHTML = '<p class="cart-empty">' + rich(paid ? "orderPaid" : "orderUnpaid", { commande:id }) + '</p>';
  }

  document.getElementById("cartClose").addEventListener("click", closeOverlays);
  document.getElementById("sizeModalClose").addEventListener("click", closeSizeGuide);
  document.getElementById("sizeModal").addEventListener("click", function(e){ if(e.target === this) closeSizeGuide(); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeSizeGuide(); });
  document.getElementById("footerSizeGuide").addEventListener("click", function(e){
    if(!GUIDES.length) return;   // sans guide, le lien mene a la boutique
    e.preventDefault();
    openSizeGuide(null, (GUIDES.filter(function(g){ return g.def; })[0] || GUIDES[0]).id);
  });
  document.getElementById("cartBtn").addEventListener("click", openCart);

  /* ---------------- recherche : panneau et suggestions ---------------- */
  var SEARCH_MIN = 3, SEARCH_MAX = 6;
  var searchBtn = document.getElementById("searchBtn");
  var searchPanel = document.getElementById("searchPanel");
  var searchInput = document.getElementById("searchInput");
  var searchSuggest = document.getElementById("searchSuggest");

  function openSearch(){
    closeOverlays();
    searchPanel.hidden = false;
    searchBtn.setAttribute("aria-expanded", "true");
    if(state.q && !searchInput.value) searchInput.value = state.q;
    renderSuggest();
    searchInput.focus();
    searchInput.select();
  }
  function closeSearch(){
    if(searchPanel.hidden) return;
    searchPanel.hidden = true;
    searchBtn.setAttribute("aria-expanded", "false");
    searchInput.setAttribute("aria-expanded", "false");
  }
  function suggestHTML(p, words, i){
    return '<button type="button" class="mega-link search-sug" role="option" id="sug-'+i+'" aria-selected="false" data-goto="'+p.id+'">'+
             (p.photo
               ? '<span class="mega-thumb"><img src="'+p.photo+'" alt="" loading="lazy"></span>'
               : '<span class="mega-icon" style="color:'+p.colors[0].h+'"><svg><use href="#'+p.icon+'"/></svg></span>')+
             '<span class="mega-name"><span>'+highlight(p.name, words)+'</span>'+
               '<span class="search-meta">'+esc([p.cat, p.univ].filter(Boolean).join(" · "))+'</span></span>'+
             '<span class="mega-price">'+euro(p.price)+'</span>'+
           '</button>';
  }
  function renderSuggest(){
    var q = searchInput.value.trim();
    var html = "";
    if(q.length >= SEARCH_MIN){
      var words = searchWords(q);
      var found = searchSort(PRODUCTS.filter(function(p){ return matchesWords(p, words); }), words);
      html = found.length
        ? found.slice(0, SEARCH_MAX).map(function(p, i){ return suggestHTML(p, words, i); }).join("") +
          '<button type="button" class="search-all" role="option" id="sug-all" aria-selected="false" data-search-all>' +
            (found.length > 1 ? "Voir les " + found.length + " résultats" : "Voir le résultat") + '</button>'
        : '<p class="search-hint">Aucun article pour « '+esc(q)+' ». Essaie « sweat », « maillot » ou une couleur.</p>';
    } else if(q.length){
      html = '<p class="search-hint">Encore '+(SEARCH_MIN - q.length)+' lettre'+(SEARCH_MIN - q.length > 1 ? "s" : "")+'…</p>';
    }
    searchSuggest.innerHTML = html;
    searchInput.setAttribute("aria-expanded", searchSuggest.querySelector("[role=option]") ? "true" : "false");
    searchInput.removeAttribute("aria-activedescendant");
  }
  function moveSuggest(step){
    var opts = [].slice.call(searchSuggest.querySelectorAll("[role=option]"));
    if(!opts.length) return;
    var cur = opts.findIndex(function(o){ return o.getAttribute("aria-selected") === "true"; });
    var next = cur === -1 ? (step > 0 ? 0 : opts.length - 1) : cur + step;
    opts.forEach(function(o){ o.setAttribute("aria-selected", "false"); });
    if(next < 0 || next >= opts.length){ searchInput.removeAttribute("aria-activedescendant"); return; }   // retour au champ
    opts[next].setAttribute("aria-selected", "true");
    opts[next].scrollIntoView({ block:"nearest" });
    searchInput.setAttribute("aria-activedescendant", opts[next].id);
  }
  function showResults(q){
    closeSearch();
    location.hash = "#/recherche/" + encodeURIComponent(q);
    window.scrollTo(0, 0);
  }

  searchBtn.addEventListener("click", function(e){
    e.stopPropagation();
    if(searchPanel.hidden) openSearch(); else closeSearch();
  });
  document.getElementById("searchClose").addEventListener("click", closeSearch);
  searchInput.addEventListener("input", renderSuggest);
  searchInput.addEventListener("keydown", function(e){
    if(e.key === "ArrowDown"){ e.preventDefault(); moveSuggest(1); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); moveSuggest(-1); }
    else if(e.key === "Escape"){ closeSearch(); searchBtn.focus(); }
  });
  document.getElementById("searchForm").addEventListener("submit", function(e){
    e.preventDefault();
    var active = searchSuggest.querySelector('[aria-selected="true"]');
    if(active){ active.click(); return; }
    var q = searchInput.value.trim();
    if(q) showResults(q);
  });
  searchSuggest.addEventListener("click", function(e){
    var go = e.target.closest("[data-goto]");
    if(go){ closeSearch(); location.hash = "#/produit/" + go.getAttribute("data-goto"); window.scrollTo(0, 0); return; }
    if(e.target.closest("[data-search-all]")) showResults(searchInput.value.trim());
  });
  document.addEventListener("click", function(e){
    if(!searchPanel.hidden && !searchPanel.contains(e.target) && !searchBtn.contains(e.target)) closeSearch();
  });

  /* ---------------- router ---------------- */
  function route(){
    var hash = location.hash || "#/";
    var done = hash.match(/^#\/merci\/([A-Z0-9-]+)$/);
    if(done){ history.replaceState(null, "", "#/"); route(); showOrderDone(done[1], true); return; }
    if(hash === "#/paiement-annule"){
      history.replaceState(null, "", "#/"); route();
      openCart(); toast("Paiement annulé : ton panier t'attend");
      return;
    }
    var m = hash.match(/^#\/produit\/(.+)$/);
    var sm = hash.match(/^#\/recherche\/(.*)$/);
    var isShop = /^#\/boutique/.test(hash) || !!sm;
    if(sm){
      var q = sm[1];
      try { q = decodeURIComponent(q); } catch(e){}
      q = q.trim();
      // nouvelle recherche : on repart de tous les articles trouves
      if(q !== lastSearch){ lastSearch = q; state.sel = []; state.sizes = []; state.colors = []; state.price = "all"; state.sort = "new"; }
      state.q = q;
    } else {
      state.q = "";
      if(!m) lastSearch = "";   // la fiche garde la recherche pour le retour, pas le reste
    }
    closeOverlays();
    closeSearch();
    closeSizeGuide();
    // la barre de filtres n'a de sens que sur la grille
    filterBar.classList.toggle("hide", !isShop);
    document.querySelector("main").classList.toggle("home-mode", !m && !isShop);
    document.getElementById("view-home").hidden = true;
    document.getElementById("view-plp").hidden = true;
    document.getElementById("view-pdp").hidden = true;
    if(m){
      document.getElementById("view-pdp").hidden = false;
      renderPDP(m[1]);
    } else if(isShop){
      document.getElementById("view-plp").hidden = false;
      renderPLP();
    } else {
      document.getElementById("view-home").hidden = false;
      renderHome();
      if(typeof syncAll === "function") syncAll();
    }
  }

  document.getElementById("logoBtn").addEventListener("click", function(){ location.hash = "#/"; });
  window.addEventListener("hashchange", route);
  /* Bloc du haut : logo pleine taille uniquement quand la page est tout en
     haut, moitie moins des le premier defilement. La hauteur reelle est
     publiee en variable CSS pour caler les colonnes collantes dessous. */
  var topbar = document.getElementById("topbar");
  var promoBar = document.querySelector(".promo-bar");
  function syncTopbar(){
    topbar.classList.toggle("shrunk", window.scrollY > 8);
    document.documentElement.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
  }
  // Hauteur du hero : l'ecran moins ce qui le surplombe, mesure avec
  // l'en-tete en pleine taille. On ne mesure jamais pendant le defilement :
  // en remontant, l'en-tete est encore en train de grandir et la mesure
  // donnerait un hero trop haut, qui se corrige ensuite (effet de saut).
  // D'ou une mesure au chargement, au changement de police et au
  // redimensionnement seulement, et uniquement en haut de page.
  function measureHero(){
    var hero = document.querySelector(".hero");
    if(!hero || window.scrollY > 8 || topbar.classList.contains("shrunk")) return;
    document.documentElement.style.setProperty("--hero-offset", Math.ceil(hero.getBoundingClientRect().top) + "px");
  }
  function syncAll(){ syncTopbar(); measureHero(); }
  window.addEventListener("scroll", syncTopbar, { passive:true });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(syncAll);
  window.addEventListener("load", syncAll);
  window.addEventListener("resize", syncAll);
  topbar.addEventListener("transitionend", syncTopbar);

  function start(){
    refreshCartBadge();
    renderCart();
    renderMainNav();
    wireMainNav();
    renderDrawer();
    wireMobileChrome();
    route();
    syncAll();
  }

  fetch("catalogue.json", { cache:"no-cache" })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if(!data) return;
      applySkus(data.skus);
      applyHome(data.home);
      if(Array.isArray(data.categories) && data.categories.length){
        CATS = data.categories.map(function(c){ return c.id; });
      }
      if(Array.isArray(data.menu)) MENUS = data.menu;
      UNIVS = Array.isArray(data.universes) ? data.universes.map(function(u){ return u.id; }) : [];
      if(Array.isArray(data.icons)) installIcons(data.icons, "");
      if(data.texts && typeof data.texts === "object") TEXTS = data.texts;
      if(Array.isArray(data.sizeGuides)) GUIDES = data.sizeGuides;
      applyTexts();
    })
    .catch(function(){ /* catalogue injoignable : liste de secours */ })
    .then(start);
})();
