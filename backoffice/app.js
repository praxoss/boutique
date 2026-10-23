/* Script de du backoffice (sorti de index.html pour que la politique de securite
   du site, CSP script-src 'self', puisse interdire tout script integre a la page). */
(function(){
  "use strict";

  var ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  var ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var ICON_TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
  var ICON_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var ICON_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  var ICON_X_SM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var TYPOLOGIES = [
    { id:"Maillots",    icon:"icon-shirt",  sizes:["S","M","L","XL","XXL"] },
    { id:"T-shirts",    icon:"icon-shirt",  sizes:["S","M","L","XL","XXL"] },
    { id:"Sweats",      icon:"icon-hoodie", sizes:["S","M","L","XL","XXL"] },
    { id:"Shorts",      icon:"icon-shorts", sizes:["S","M","L","XL","XXL"] },
    { id:"Chaussettes", icon:"icon-socks",  sizes:["36-39","40-43","44-47"] },
    { id:"Accessoires", icon:"icon-bag",    sizes:["Taille unique"] }
  ];

  /* Menu de la boutique, publie dans catalogue.json ("menu"). Une rubrique :
     label, cats (categories ouvertes par son nom, absent si aucune), cols
     (colonnes { title, ids } d'articles du menu deroulant), note (message
     quand il n'y a pas de colonne). Valeurs de depart = l'ancien menu code
     en dur dans la boutique. */
  var MENU = [
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

  /* Pictogrammes, publies dans catalogue.json ("icons"). Les six de depart
     n'ont pas de dessin dans la liste : ils utilisent les symboles ecrits
     dans les pages. Une entree importee porte son dessin : { viewBox, svg }
     (SVG nettoye, recolore en currentColor) ou { image } (PNG). */
  /* Univers (sur-categories), publies dans catalogue.json ("universes") :
     chaque article en a un (sku.univers) en plus de sa categorie. Des
     tailles facultatives par univers remplacent celles de la categorie a la
     creation d'un article (Enfant : 4 a 14 ans). */
  var UNIVERSES = [
    { id:"Rugby" }, { id:"Lifestyle" }, { id:"Accessoires" },
    { id:"Femme", sizes:["XS","S","M","L","XL"] },
    { id:"Enfant", sizes:["4 ans","6 ans","8 ans","10 ans","12 ans","14 ans"] }
  ];
  function universOf(id){ return UNIVERSES.filter(function(u){ return u.id === id; })[0]; }

  var ICONS = [
    { id:"icon-shirt",  name:"Haut" },
    { id:"icon-hoodie", name:"Sweat, veste" },
    { id:"icon-shorts", name:"Short" },
    { id:"icon-socks",  name:"Chaussettes" },
    { id:"icon-cap",    name:"Casquette" },
    { id:"icon-bag",    name:"Sac, accessoire" }
  ];

  var SKUS = [
    { id:"maillot-domicile", typ:"Maillots", name:"Maillot Domicile", sub:"Manches courtes, coupe joueur", price:64.99, ref:"IMP-MAILLOT-DOM", icon:"icon-shirt", photo:"assets/maillot-domicile.jpg",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Le maillot officiel porte en championnat, coupe ajustee et tissu technique respirant." },
    { id:"maillot-exterieur", typ:"Maillots", name:"Maillot Exterieur", sub:"Manches courtes, coupe joueur", price:64.99, ref:"IMP-MAILLOT-EXT", icon:"icon-shirt", photo:"assets/maillot-exterieur.jpg",
      colors:[{n:"Rouge",h:"#C8102E"},{n:"Bleu marine",h:"#0B1F3D"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Version exterieure du maillot officiel, coloris rouge." },
    { id:"tshirt-training", typ:"T-shirts", name:"T-shirt Entrainement", sub:"Coton respirant, coupe reguliere", price:24.99, ref:"IMP-TSHIRT-TRN", icon:"icon-shirt",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Gris",h:"#8A8D93"},{n:"Blanc",h:"#FFFFFF"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Le t-shirt du quotidien, porte a l'entrainement comme en dehors du terrain." },
    { id:"polo-club", typ:"T-shirts", name:"Polo Club", sub:"Pique technique, col boutonne", price:34.99, ref:"IMP-POLO-CLB", icon:"icon-shirt",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Blanc",h:"#FFFFFF"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Polo pique pour les jours de match cote touche et les deplacements officiels." },
    { id:"sweat-capuche", typ:"Sweats", name:"Sweat a Capuche", sub:"Molleton epais, poche kangourou", price:49.99, ref:"IMP-SWEAT-CAP", icon:"icon-hoodie",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Gris",h:"#8A8D93"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Sweat a capuche epais pour les matins d'entrainement frais." },
    { id:"veste-survetement", typ:"Sweats", name:"Veste de Survetement", sub:"Zip integral, coupe vent", price:59.99, ref:"IMP-VESTE-SURV", icon:"icon-hoodie",
      colors:[{n:"Bleu marine",h:"#0B1F3D"}], sizes:["S","M","L","XL","XXL"], status:"rupture",
      desc:"Veste d'echauffement zippee, portee avant match sur le maillot." },
    { id:"short-match", typ:"Shorts", name:"Short de Match", sub:"Coupe joueur, bandes contrastees", price:29.99, ref:"IMP-SHORT-MATCH", icon:"icon-shorts",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Short officiel assorti au maillot, renforts aux coutures." },
    { id:"short-entrainement", typ:"Shorts", name:"Short d'Entrainement", sub:"Leger, poches zippees", price:22.99, ref:"IMP-SHORT-ENT", icon:"icon-shorts",
      colors:[{n:"Gris",h:"#8A8D93"},{n:"Bleu marine",h:"#0B1F3D"}], sizes:["S","M","L","XL","XXL"], status:"actif",
      desc:"Short polyvalent pour l'entrainement, tissu leger et poches zippees." },
    { id:"bonnet-club", typ:"Accessoires", name:"Bonnet Club", sub:"Taille unique, laine fine", price:14.99, ref:"IMP-BONNET", icon:"icon-cap",
      colors:[{n:"Bleu marine",h:"#0B1F3D"},{n:"Rouge",h:"#C8102E"}], sizes:["Taille unique"], status:"actif",
      desc:"Bonnet cotele avec patch club brode." },
    { id:"sac-sport", typ:"Accessoires", name:"Sac de Sport", sub:"40L, compartiment crampons", price:39.99, ref:"IMP-SAC", icon:"icon-bag",
      colors:[{n:"Bleu marine",h:"#0B1F3D"}], sizes:["Taille unique"], status:"actif",
      desc:"Sac de sport 40 litres avec compartiment ventile dedie aux crampons." }
  ];

  /* La boutique lit ../boutique/catalogue.json : c'est le catalogue publie,
     le meme pour tous les visiteurs. Ce backoffice le charge, et garde les
     modifications en cours dans un brouillon local a ce navigateur, jusqu'au
     bouton "Publier" (API du serveur, voir server/api.js). Les chemins d'images du catalogue sont relatifs a la
     boutique, d'ou assetUrl() pour les afficher ici. */
  var BOUTIQUE_BASE = "../boutique/";
  var DRAFT_KEY = "implacables-bo-draft";
  var hasDraft = false;

  function assetUrl(u){
    if(!u) return "";
    return /^(data:|https?:|\/)/.test(u) ? u : BOUTIQUE_BASE + u;
  }

  function persistDraft(){
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ skus:SKUS, home:HOME, categories:TYPOLOGIES, universes:UNIVERSES, menu:MENU, icons:ICONS, texts:TEXTS, sizeGuides:GUIDES, savedAt:new Date().toISOString() }));
      hasDraft = true;
      renderPublishNote();
      return true;
    } catch(err){
      toast("Brouillon non enregistre : stockage du navigateur plein. Exporte maintenant pour ne rien perdre.");
      return false;
    }
  }
  function persistSkus(){ return persistDraft(); }

  var ORDERS = [];

  var state = { activeUniv:"all", activeTyp:"all", search:"", tab:"catalogue", editingId:null, threshold:20, lastRestock:"2026-08-02", photoDataUrl:null, heroDataUrl:null, ordersLoaded:false, ordersLoading:false };

  /* Commandes passees sur la boutique, lues sur l'API du serveur
     (server/api.js), derriere le meme identifiant que ce backoffice. */
  var ORDERS_API = "../api/commandes";
  var paymentState = { stripe:false, webhook:false, sheets:false };

  function euro(n){ return n.toFixed(2).replace(".",",") + " €"; }
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
  function fmtDate(d){
    var parts = d.split("-");
    var months = ["janv.","fevr.","mars","avr.","mai","juin","juil.","aout","sept.","oct.","nov.","dec."];
    return parseInt(parts[2],10) + " " + months[parseInt(parts[1],10)-1] + " " + parts[0];
  }

  function toast(msg){
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._h);
    toast._h = setTimeout(function(){ t.classList.remove("show"); }, 2200);
  }

  function typologyOf(typId){ return TYPOLOGIES.filter(function(t){return t.id===typId;})[0]; }
  function skuById(id){ return SKUS.filter(function(s){return s.id===id;})[0]; }

  /* ---------------- sidebar ---------------- */
  function renderSidebar(){
    var counts = {};
    TYPOLOGIES.forEach(function(t){ counts[t.id] = 0; });
    SKUS.forEach(function(s){ counts[s.typ] = (counts[s.typ]||0) + 1; });

    var html = '<div class="bo-sidebar-title">Typologies</div>' +
      '<button type="button" class="typ-btn" data-typ="all" aria-current="'+(state.activeTyp==="all")+'">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' +
        '<span class="name">Tous les articles</span><span class="count">'+SKUS.length+'</span>' +
      '</button>' +
      TYPOLOGIES.map(function(t){
        return '<button type="button" class="typ-btn" data-typ="'+esc(t.id)+'" aria-current="'+(state.activeTyp===t.id)+'">' +
          '<svg><use href="#'+t.icon+'"/></svg>' +
          '<span class="name">'+esc(t.id)+'</span><span class="count">'+(counts[t.id]||0)+'</span>' +
        '</button>';
      }).join("");

    document.getElementById("sidebar").innerHTML = html;
    document.querySelectorAll(".typ-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        state.activeTyp = btn.getAttribute("data-typ");
        renderSidebar();
        renderTable();
      });
    });
  }

  /* ---------------- table ---------------- */
  function filteredSkus(){
    var q = state.search.trim().toLowerCase();
    return SKUS.filter(function(s){
      if(state.activeTyp !== "all" && s.typ !== state.activeTyp) return false;
      if(state.activeUniv !== "all" && (s.univers || "") !== state.activeUniv) return false;
      if(q && s.name.toLowerCase().indexOf(q)===-1 && s.ref.toLowerCase().indexOf(q)===-1) return false;
      return true;
    });
  }

  function fillUnivFilter(){
    var sel = document.getElementById("univFilter");
    sel.innerHTML = '<option value="all">Tous les univers</option>' +
      UNIVERSES.map(function(u){ return '<option value="'+esc(u.id)+'">'+esc(u.id)+'</option>'; }).join("") +
      '<option value="">Sans univers</option>';
    sel.value = state.activeUniv;
    if(sel.value !== state.activeUniv){ state.activeUniv = "all"; sel.value = "all"; }
  }

  function renderTable(){
    var list = filteredSkus();
    var subtitle = state.activeTyp === "all"
      ? "Vue d'ensemble du catalogue, toutes typologies confondues."
      : "SKU de la typologie « " + state.activeTyp + " ».";
    document.getElementById("pageSubtitle").textContent = subtitle;
    document.getElementById("skuCount").innerHTML = list.length + (list.length>1 ? " articles" : " article") +
      ' <span class="sort-hint">· glisse ⠿ pour choisir l\'ordre d\'affichage dans la boutique</span>';
    document.getElementById("newSkuBtn").innerHTML = ICON_PLUS + " Nouveau SKU";

    var tbody = document.getElementById("skuTbody");
    document.getElementById("skuEmpty").hidden = list.length>0;

    tbody.innerHTML = list.map(function(s){
      var media = s.photoDataUrl || s.photo
        ? '<img src="'+assetUrl(s.photoDataUrl||s.photo)+'" alt="">'
        : '<svg style="color:'+s.colors[0].h+'"><use href="#'+s.icon+'"/></svg>';
      return (
        '<tr data-id="'+s.id+'"'+(s.hidden ? ' class="is-hidden"' : '')+'>' +
          '<td class="drag-td"><button type="button" class="drag-handle" aria-label="Déplacer '+esc(s.name)+' (glisser, ou flèches haut et bas)" title="Glisser pour changer l\'ordre">⠿</button></td>' +
          '<td class="sku-name-td" data-label="Article"><div class="sku-name-cell"><div class="sku-thumb">'+media+'</div>' +
            '<div class="sku-name"><b>'+esc(s.name)+'</b><span class="ref">'+(s.univers ? esc(s.univers)+' · ' : '<span style="color:var(--amber)">sans univers</span> · ')+esc(s.ref)+'</span></div></div></td>' +
          '<td data-label="Couleurs"><div class="sku-colors">'+s.colors.map(function(c){return '<span style="background:'+c.h+'" title="'+esc(c.n)+'"></span>';}).join("")+'</div></td>' +
          '<td data-label="Tailles"><span class="sku-sizes">'+s.sizes.join(" · ")+'</span></td>' +
          '<td data-label="Prix"><span class="sku-price">'+euro(s.price)+'</span></td>' +
          '<td data-label="Statut"><span class="status-pill '+s.status+'">'+({ actif:"En stock", rupture:"Rupture", precommande:"Précommande" }[s.status] || s.status)+'</span>'+
            (s.hidden ? ' <span class="status-pill masque">Masqué</span>' : '')+'</td>' +
          '<td><div class="row-actions">' +
            '<button type="button" class="icon-btn-sm hide-btn" aria-label="'+(s.hidden ? 'Réafficher' : 'Masquer')+' dans la boutique" title="'+(s.hidden ? 'Masqué : cliquer pour le réafficher' : 'Visible : cliquer pour le masquer')+'">'+(s.hidden ? ICON_EYE_OFF : ICON_EYE)+'</button>' +
            '<button type="button" class="icon-btn-sm edit-btn" aria-label="Modifier">'+ICON_EDIT+'</button>' +
            '<button type="button" class="icon-btn-sm danger delete-btn" aria-label="Supprimer">'+ICON_TRASH+'</button>' +
          '</div></td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll("tr").forEach(function(tr){
      var id = tr.getAttribute("data-id");
      tr.querySelector(".drag-handle").addEventListener("click", function(e){ e.stopPropagation(); });
      tr.querySelector(".edit-btn").addEventListener("click", function(e){ e.stopPropagation(); openPanel(skuById(id)); });
      tr.querySelector(".delete-btn").addEventListener("click", function(e){ e.stopPropagation(); deleteSku(id); });
      tr.querySelector(".hide-btn").addEventListener("click", function(e){
        e.stopPropagation();
        var s = skuById(id);
        if(s.hidden) delete s.hidden; else s.hidden = true;
        persistDraft();
        renderTable();
        toast(s.hidden ? "« "+s.name+" » masqué (pense a publier)" : "« "+s.name+" » de nouveau visible (pense a publier)");
      });
      tr.addEventListener("click", function(){ openPanel(skuById(id)); });
    });
  }

  /* ---------------- ordre des articles ----------------
     L'ordre de SKUS est l'ordre d'affichage de la boutique (liste par
     defaut, "Les plus demandes", "Vous aimerez aussi"). On le change en
     glissant la poignee d'une ligne (souris ou doigt, via les pointer
     events : le glisser-deposer HTML5 ne marche pas au doigt), ou au
     clavier avec les fleches. Avec un filtre actif, l'article se place
     juste avant ou apres celui vise. */
  function moveSku(id, refId, before){
    if(id === refId) return;
    var from = SKUS.findIndex(function(s){ return s.id === id; });
    if(from < 0) return;
    var item = SKUS.splice(from, 1)[0];
    var at = SKUS.findIndex(function(s){ return s.id === refId; });
    SKUS.splice(before ? at : at + 1, 0, item);
    persistDraft();
    renderTable();
    var row = document.querySelector('#skuTbody tr[data-id="'+id+'"]');
    if(row){ row.classList.add("flash"); setTimeout(function(){ row.classList.remove("flash"); }, 900); }
    return row;
  }

  (function(){
    var tbody = document.getElementById("skuTbody");
    var drag = null;
    function clearMarks(){
      tbody.querySelectorAll(".drop-before,.drop-after").forEach(function(r){ r.classList.remove("drop-before","drop-after"); });
    }
    tbody.addEventListener("pointerdown", function(e){
      var h = e.target.closest(".drag-handle");
      if(!h || e.button > 0) return;
      e.preventDefault();
      var row = h.closest("tr");
      drag = { id:row.getAttribute("data-id"), row:row, handle:h, target:null };
      h.setPointerCapture(e.pointerId);
      row.classList.add("dragging");
      document.body.classList.add("sorting");
    });
    tbody.addEventListener("pointermove", function(e){
      if(!drag) return;
      if(e.clientY < 70) window.scrollBy(0, -14);
      else if(e.clientY > window.innerHeight - 70) window.scrollBy(0, 14);
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var tr = el && el.closest("#skuTbody tr");
      clearMarks();
      if(!tr || tr === drag.row){ drag.target = null; return; }
      var r = tr.getBoundingClientRect();
      var before = e.clientY < r.top + r.height / 2;
      tr.classList.add(before ? "drop-before" : "drop-after");
      drag.target = { id:tr.getAttribute("data-id"), before:before };
    });
    function end(){
      if(!drag) return;
      var d = drag; drag = null;
      clearMarks();
      d.row.classList.remove("dragging");
      document.body.classList.remove("sorting");
      if(d.target){ moveSku(d.id, d.target.id, d.target.before); toast("Ordre modifie (pense a publier)"); }
    }
    tbody.addEventListener("pointerup", end);
    tbody.addEventListener("pointercancel", end);
    tbody.addEventListener("keydown", function(e){
      var h = e.target.closest(".drag-handle");
      if(!h || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
      e.preventDefault();
      var id = h.closest("tr").getAttribute("data-id");
      var list = filteredSkus();
      var pos = list.findIndex(function(s){ return s.id === id; });
      var other = list[e.key === "ArrowUp" ? pos - 1 : pos + 1];
      if(!other) return;
      var row = moveSku(id, other.id, e.key === "ArrowUp");
      if(row) row.querySelector(".drag-handle").focus();
    });
  })();

  function deleteSku(id){
    var s = skuById(id);
    if(!s) return;
    if(!confirm('Supprimer "'+s.name+'" du catalogue ?')) return;
    SKUS = SKUS.filter(function(x){return x.id!==id;});
    MENU.forEach(function(m){ (m.cols||[]).forEach(function(c){ c.ids = c.ids.filter(function(x){ return x !== id; }); }); });
    persistSkus();
    renderSidebar();
    renderTable();
    toast("SKU supprime");
  }

  /* ---------------- panel (create / edit) ---------------- */
  var panelColors = [];
  var panelSizes = [];
  var panelStatus = "actif";

  function fillTypSelect(){
    var sel = document.getElementById("f-typ");
    sel.innerHTML = TYPOLOGIES.map(function(t){return '<option value="'+esc(t.id)+'">'+esc(t.id)+'</option>';}).join("");
  }

  function renderColorChips(){
    document.getElementById("colorChips").innerHTML = panelColors.map(function(c,i){
      return '<span class="color-chip"><span class="dot" style="background:'+c.h+'"></span>'+esc(c.n)+
        '<button type="button" data-i="'+i+'">'+ICON_X_SM+'</button></span>';
    }).join("") || '<span class="hint">Aucune couleur ajoutee</span>';
    document.querySelectorAll("#colorChips button[data-i]").forEach(function(b){
      b.addEventListener("click", function(){
        panelColors.splice(parseInt(b.getAttribute("data-i"),10),1);
        renderColorChips();
      });
    });
    updatePhotoPreview();   // la liste "Couleur" des photos suit les couleurs
  }

  function fillUnivSelect(){
    var sel = document.getElementById("f-univ"), cur = sel.value;
    sel.innerHTML = '<option value="">—</option>' + UNIVERSES.map(function(u){ return '<option value="'+esc(u.id)+'">'+esc(u.id)+'</option>'; }).join("");
    sel.value = cur;
  }
  /* Tailles proposees : celles de l'univers s'il en a (Enfant), sinon
     celles de la categorie ; les tailles deja cochees restent visibles. */
  function renderSizeGrid(){
    var typ = typologyOf(document.getElementById("f-typ").value) || TYPOLOGIES[0];
    var un = universOf(document.getElementById("f-univ").value);
    var offer = (un && un.sizes && un.sizes.length ? un.sizes : typ.sizes).slice();
    panelSizes.forEach(function(s){ if(offer.indexOf(s) === -1) offer.push(s); });
    document.getElementById("sizeGrid").innerHTML = offer.map(function(sz){
      var on = panelSizes.indexOf(sz)>-1;
      return '<div class="size-check'+(on?' on':'')+'" data-size="'+esc(sz)+'">'+esc(sz)+'</div>';
    }).join("");
    document.querySelectorAll(".size-check").forEach(function(el){
      el.addEventListener("click", function(){
        var sz = el.getAttribute("data-size");
        var i = panelSizes.indexOf(sz);
        if(i>-1){ panelSizes.splice(i,1); } else { panelSizes.push(sz); }
        el.classList.toggle("on");
      });
    });
  }

  function setPanelStatus(st){
    panelStatus = st;
    document.querySelectorAll("#statusToggle button").forEach(function(b){
      b.classList.toggle("on", b.getAttribute("data-status")===st);
    });
  }

  function slugRef(name, typ){
    var base = name.toUpperCase()
      .replace(/[ÀÂÄ]/g,"A").replace(/[ÉÈÊË]/g,"E").replace(/[ÎÏ]/g,"I").replace(/[ÔÖ]/g,"O").replace(/[ÙÛÜ]/g,"U").replace(/Ç/g,"C")
      .replace(/[^A-Z0-9]+/g,"-").replace(/(^-|-$)/g,"");
    return "IMP-" + base.slice(0,18);
  }

  function uniqueId(name){
    var base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"") || "article";
    var id = base, n = 2;
    while(skuById(id)){ id = base + "-" + (n++); }
    return id;
  }

  function openPanel(sku){
    state.editingId = sku ? sku.id : null;
    panelPhotos = photosOf(sku);
    document.getElementById("panelTitle").textContent = sku ? "Modifier le SKU" : "Nouveau SKU";
    document.getElementById("deleteSkuBtn").hidden = !sku;

    var defaultTyp = sku ? sku.typ : (state.activeTyp!=="all" ? state.activeTyp : TYPOLOGIES[0].id);
    document.getElementById("f-typ").value = defaultTyp;
    fillUnivSelect();
    document.getElementById("f-univ").value = sku ? (sku.univers || "") : (state.activeUniv !== "all" ? state.activeUniv : "");
    document.getElementById("f-name").value = sku ? sku.name : "";
    document.getElementById("f-sub").value = sku ? sku.sub : "";
    document.getElementById("f-price").value = sku ? sku.price : "";
    document.getElementById("f-ref").value = sku ? sku.ref : "";
    document.getElementById("f-desc").value = sku ? sku.desc : "";
    var isHero = !!(sku && sku.hero);
    document.getElementById("f-hero").checked = isHero;
    document.getElementById("f-feature").checked = !!(sku && sku.feature);
    document.getElementById("f-hidden").checked = !!(sku && sku.hidden);
    fillGuideSelect(sku ? sku.sizeGuide || "" : "");
    document.getElementById("f-source").value = sku && sku.source ? sku.source : "";
    document.getElementById("heroFields").hidden = !isHero;
    document.getElementById("f-hero-title").value = sku && sku.heroTitle ? sku.heroTitle : "";
    document.getElementById("f-hero-text").value  = sku && sku.heroText  ? sku.heroText  : "";
    document.getElementById("f-hero-cta").value   = sku && sku.heroCta   ? sku.heroCta   : "";
    document.getElementById("f-hero-fit").value = (sku && sku.heroFit) || "auto";
    var focus = sku && sku.heroFocus != null ? sku.heroFocus : 50;
    document.getElementById("f-hero-focus").value = focus;
    document.getElementById("heroFocusVal").textContent = focus + " %";
    state.heroDataUrl = null;
    updateHeroPreview();
    panelColors = sku ? sku.colors.map(function(c){ return Object.assign({}, c); }) : [];   // copie : le lien photo se modifie ici
    panelSizes = sku ? sku.sizes.slice() : [];
    setPanelStatus(sku ? sku.status : "actif");
    updatePhotoPreview();

    renderColorChips();
    renderSizeGrid();

    document.getElementById("panelOverlay").hidden = false;
    var panel = document.getElementById("skuPanel");
    panel.hidden = false;
    panel.setAttribute("aria-hidden","false");
    requestAnimationFrame(function(){ panel.classList.add("open"); });
  }

  function closePanel(){
    var panel = document.getElementById("skuPanel");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden","true");
    document.getElementById("panelOverlay").hidden = true;
    setTimeout(function(){ panel.hidden = true; }, 250);
  }

  function updateHeroPreview(){
    var box = document.getElementById("heroPreview");
    var sku = state.editingId ? skuById(state.editingId) : null;
    var src = assetUrl(state.heroDataUrl || (sku && (sku.heroImage || sku.photoDataUrl || sku.photo)));
    box.innerHTML = src
      ? '<img src="'+src+'" alt="">'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  }

  /* Photos de la fiche : chemins publies (assets/...) ou data URL des
     images chargees ici. La premiere est la photo principale. */
  var panelPhotos = [];

  function photosOf(sku){
    if(!sku) return [];
    if(sku.photos && sku.photos.length) return sku.photos.slice();
    var one = sku.photoDataUrl || sku.photo;
    return one ? [one] : [];
  }

  function updatePhotoPreview(){
    var grid = document.getElementById("photoGrid");
    var tools = document.getElementById("photoTools");
    tools.hidden = !(panelPhotos.length && panelColors.length > 0);
    grid.innerHTML = panelPhotos.map(function(u, i){
      var linked = panelColors.findIndex(function(c){ return c.photo === u; });
      var colorPick = panelColors.length
        ? '<select class="photo-color" data-pc="'+i+'" aria-label="Couleur montrée sur cette photo">' +
            '<option value="">Couleur…</option>' +
            panelColors.map(function(c, k){ return '<option value="'+k+'"'+(k===linked?' selected':'')+'>'+esc(c.n)+'</option>'; }).join("") +
          '</select>'
        : '';
      return '<div class="photo-cell" data-i="'+i+'">' +
        '<div class="photo-tile"><img src="'+assetUrl(u)+'" alt="">' +
          '<button type="button" class="photo-handle" aria-label="Déplacer la photo (glisser, ou flèches gauche et droite)" title="Glisser pour changer l\'ordre">⠿</button>' +
          (linked > -1 ? '<span class="color-badge" style="background:'+panelColors[linked].h+'" title="'+esc(panelColors[linked].n)+'"></span>' : '') +
          '<div class="tile-actions"><button type="button" data-drop="'+i+'" title="Retirer" aria-label="Retirer la photo">&times;</button></div>' +
        '</div>' +
        '<label class="photo-main"><input type="radio" name="photoMain" data-main="'+i+'"'+(i===0?' checked':'')+'> Photo principale</label>' +
        colorPick +
      '</div>';
    }).join("") +
      '<button type="button" class="photo-add" id="photoAdd">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        'Ajouter</button>';
    document.getElementById("photoAdd").addEventListener("click", function(){ document.getElementById("f-photo").click(); });
    grid.querySelectorAll("[data-drop]").forEach(function(b){
      b.addEventListener("click", function(){
        var u = panelPhotos.splice(+b.getAttribute("data-drop"), 1)[0];
        panelColors.forEach(function(c){ if(c.photo === u) delete c.photo; });
        updatePhotoPreview();
      });
    });
    /* Photo principale = la premiere : la cocher la fait passer en tete. */
    grid.querySelectorAll("[data-main]").forEach(function(r){
      r.addEventListener("change", function(){
        var u = panelPhotos.splice(+r.getAttribute("data-main"), 1)[0];
        panelPhotos.unshift(u);
        updatePhotoPreview();
      });
    });
    /* Une couleur montre une photo, une photo montre une couleur : choisir
       ici remplace l'ancien lien de part et d'autre. */
    grid.querySelectorAll("[data-pc]").forEach(function(sel){
      sel.addEventListener("change", function(){
        var u = panelPhotos[+sel.getAttribute("data-pc")];
        panelColors.forEach(function(c){ if(c.photo === u) delete c.photo; });
        if(sel.value !== "") panelColors[+sel.value].photo = u;
        updatePhotoPreview();
      });
    });
  }

  /* Ordre des photos : glisser la poignee (souris ou doigt) ou fleches. */
  (function(){
    var grid = document.getElementById("photoGrid"), drag = null;
    function clear(){ grid.querySelectorAll(".drop-before,.drop-after").forEach(function(c){ c.classList.remove("drop-before","drop-after"); }); }
    function move(from, to, before){
      if(from === to) return;
      var u = panelPhotos.splice(from, 1)[0];
      var at = to > from ? to - 1 : to;
      panelPhotos.splice(before ? at : at + 1, 0, u);
      updatePhotoPreview();
    }
    grid.addEventListener("pointerdown", function(e){
      var h = e.target.closest(".photo-handle");
      if(!h || e.button > 0) return;
      e.preventDefault();
      var cell = h.closest(".photo-cell");
      drag = { from:+cell.getAttribute("data-i"), cell:cell, target:null };
      h.setPointerCapture(e.pointerId);
      cell.classList.add("dragging");
      document.body.classList.add("sorting");
    });
    grid.addEventListener("pointermove", function(e){
      if(!drag) return;
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var cell = el && el.closest("#photoGrid .photo-cell");
      clear();
      if(!cell || cell === drag.cell){ drag.target = null; return; }
      var r = cell.getBoundingClientRect(), before = e.clientX < r.left + r.width / 2;
      cell.classList.add(before ? "drop-before" : "drop-after");
      drag.target = { to:+cell.getAttribute("data-i"), before:before };
    });
    function end(){
      if(!drag) return;
      var d = drag; drag = null;
      clear(); d.cell.classList.remove("dragging"); document.body.classList.remove("sorting");
      if(d.target) move(d.from, d.target.to, d.target.before);
    }
    grid.addEventListener("pointerup", end);
    grid.addEventListener("pointercancel", end);
    grid.addEventListener("click", function(e){ if(e.target.closest(".photo-handle")) e.preventDefault(); });
    grid.addEventListener("keydown", function(e){
      var h = e.target.closest(".photo-handle");
      if(!h || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      e.preventDefault();
      var i = +h.closest(".photo-cell").getAttribute("data-i"), j = e.key === "ArrowLeft" ? i - 1 : i + 1;
      if(j < 0 || j >= panelPhotos.length) return;
      var u = panelPhotos.splice(i, 1)[0]; panelPhotos.splice(j, 0, u);
      updatePhotoPreview();
      var again = document.querySelector('#photoGrid .photo-cell[data-i="'+j+'"] .photo-handle');
      if(again) again.focus();
    });
  })();

  /* Associer automatiquement chaque photo a la couleur d'article la plus
     proche : couleur moyenne du sujet (les pixels proches du fond, pris sur
     les bords, sont ignores), puis appariement glouton par distance. */
  function photoTint(src){
    return new Promise(function(res){
      var img = new Image();
      img.onload = function(){
        try {
          var n = 48, c = document.createElement("canvas"); c.width = n; c.height = n;
          var ctx = c.getContext("2d", { willReadFrequently:true });
          ctx.drawImage(img, 0, 0, n, n);
          var d = ctx.getImageData(0, 0, n, n).data, bg = [0,0,0], nb = 0;
          for(var k = 0; k < n; k++) [[k,0],[k,n-1],[0,k],[n-1,k]].forEach(function(p){ var i = (p[1]*n+p[0])*4; bg[0]+=d[i]; bg[1]+=d[i+1]; bg[2]+=d[i+2]; nb++; });
          bg = bg.map(function(v){ return v / nb; });
          var s = [0,0,0], m = 0;
          for(var i = 0; i < d.length; i += 4){
            if(Math.abs(d[i]-bg[0]) + Math.abs(d[i+1]-bg[1]) + Math.abs(d[i+2]-bg[2]) < 40) continue;
            s[0]+=d[i]; s[1]+=d[i+1]; s[2]+=d[i+2]; m++;
          }
          res(m ? s.map(function(v){ return v / m; }) : bg);
        } catch(e){ res(null); }
      };
      img.onerror = function(){ res(null); };
      img.src = src;
    });
  }
  function hexRgb(h){ var x = parseInt(h.slice(1), 16); return [x >> 16 & 255, x >> 8 & 255, x & 255]; }

  document.getElementById("photoAutoColors").addEventListener("click", function(){
    var btn = this;
    btn.disabled = true;
    Promise.all(panelPhotos.map(function(u){ return photoTint(assetUrl(u)); })).then(function(tints){
      var pairs = [];
      tints.forEach(function(t, i){
        if(!t) return;
        panelColors.forEach(function(c, k){
          var h = hexRgb(c.h);
          pairs.push({ i:i, k:k, d:Math.pow(t[0]-h[0],2) + Math.pow(t[1]-h[1],2) + Math.pow(t[2]-h[2],2) });
        });
      });
      pairs.sort(function(a, b){ return a.d - b.d; });
      var usedP = {}, usedC = {}, n = 0;
      panelColors.forEach(function(c){ delete c.photo; });
      pairs.forEach(function(p){
        if(usedP[p.i] || usedC[p.k]) return;
        usedP[p.i] = usedC[p.k] = true;
        panelColors[p.k].photo = panelPhotos[p.i];
        n++;
      });
      btn.disabled = false;
      updatePhotoPreview();
      toast(n ? n + " couleur" + (n>1?"s":"") + " associée" + (n>1?"s":"") + " : vérifie, puis enregistre" : "Aucune association trouvée");
    });
  });


  function saveSku(e){
    e.preventDefault();
    var name = document.getElementById("f-name").value.trim();
    var price = parseFloat(document.getElementById("f-price").value);
    var typ = document.getElementById("f-typ").value;

    if(!name){ toast("Donne un nom a l'article"); return; }
    if(isNaN(price) || price<0){ toast("Indique un prix valide"); return; }
    if(panelColors.length===0){ toast("Ajoute au moins une couleur"); return; }
    if(panelSizes.length===0){ toast("Selectionne au moins une taille"); return; }

    var ref = document.getElementById("f-ref").value.trim() || slugRef(name, typ);
    var existing = state.editingId ? skuById(state.editingId) : null;

    var sku = {
      id: existing ? existing.id : uniqueId(name),
      typ: typ,
      univers: document.getElementById("f-univ").value || undefined,
      name: name,
      sub: document.getElementById("f-sub").value.trim(),
      price: price,
      ref: ref,
      icon: typologyOf(typ).icon,
      photo: panelPhotos[0] || undefined,
      photos: panelPhotos.length ? panelPhotos.slice() : undefined,
      colors: panelColors.slice(),
      sizes: panelSizes.slice(),
      status: panelStatus,
      desc: document.getElementById("f-desc").value.trim(),
      label: existing ? existing.label : undefined,
      feature: document.getElementById("f-feature").checked,
      hidden: document.getElementById("f-hidden").checked || undefined,
      sizeGuide: document.getElementById("f-guide").value || undefined,
      source: document.getElementById("f-source").value.trim() || undefined,
      hero: document.getElementById("f-hero").checked,
      heroTitle: document.getElementById("f-hero-title").value.trim(),
      heroText: document.getElementById("f-hero-text").value.trim(),
      heroCta: document.getElementById("f-hero-cta").value.trim(),
      heroImage: state.heroDataUrl || (existing ? existing.heroImage : undefined),
      heroFit: document.getElementById("f-hero-fit").value,
      heroFocus: parseInt(document.getElementById("f-hero-focus").value, 10)
    };

    if(existing){
      SKUS = SKUS.map(function(s){ return s.id===existing.id ? sku : s; });
    } else {
      SKUS.push(sku);
    }
    // un seul article en avant a la fois
    if(sku.hero){
      SKUS.forEach(function(s){ if(s.id !== sku.id) s.hero = false; });
    }
    if(sku.feature){
      SKUS.forEach(function(s){ if(s.id !== sku.id) s.feature = false; });
    }
    // le produit mis en avant est repris dans la config de la page d'accueil
    collectHome();
    persistDraft();

    closePanel();
    renderSidebar();
    renderTable();
    toast(existing ? "SKU mis a jour" : "SKU cree");
  }

  /* ---------------- commandes tab ---------------- */
  function reapproCountSince(list, since){
    return list.filter(function(o){ return o.date > since; }).length;
  }

  var ORDER_STATUS = {
    payee:            { label:"Payee",                cls:"confirmee" },
    a_regler:         { label:"A regler au retrait",  cls:"attente" },
    attente_paiement: { label:"Paiement en cours",    cls:"attente" },
    expiree:          { label:"Paiement abandonne",   cls:"attente" },
    erreur_paiement:  { label:"Erreur de paiement",   cls:"attente" },
    a_verifier:       { label:"Paiement a verifier dans Stripe", cls:"attente" }   // montant ou session differents de la commande
  };
  // commandes qui comptent pour le reassort : payees ou a regler au retrait
  function countsForRestock(o){ return o.statut === "payee" || o.statut === "a_regler"; }

  function renderOrders(){
    var pill = document.getElementById("gsheetPill");
    var status = document.getElementById("gsheetStatus");
    if(paymentState.stripe && paymentState.webhook){
      pill.className = "status-pill actif"; pill.textContent = "Stripe connecte";
      status.textContent = "Les clients paient par carte sur Stripe ; une commande passe en « Payee » des que Stripe confirme le paiement.";
    } else if(paymentState.stripe){
      pill.className = "status-pill rupture"; pill.textContent = "Webhook manquant";
      status.textContent = "La cle Stripe est installee mais pas le secret du webhook : les paiements ne seront pas confirmes ici. Voir DEPLOY.md.";
    } else {
      pill.className = "status-pill rupture"; pill.textContent = "Paiement en ligne non branche";
      status.textContent = "Les commandes sont enregistrees « A regler au retrait » tant que Stripe n'est pas configure sur le serveur.";
    }

    var sheetPill = document.getElementById("sheetPill");
    sheetPill.className = "status-pill " + (paymentState.sheets ? "actif" : "rupture");
    sheetPill.textContent = paymentState.sheets ? "Branche" : "Non branche";
    document.getElementById("sheetStatus").textContent = paymentState.sheets
      ? "Chaque commande et chaque changement de statut sont copies automatiquement dans le Google Sheet du club."
      : "Les commandes ne sont pas encore copiees dans un Google Sheet. Mise en place : GOOGLE_SHEETS.md.";
    document.getElementById("sheetSyncBtn").hidden = !paymentState.sheets;

    document.getElementById("thresholdInput").value = state.threshold;
    var counted = ORDERS.filter(countsForRestock).map(function(o){ return { date:o.date.slice(0,10) }; });
    var count = reapproCountSince(counted, state.lastRestock);
    document.getElementById("reapproCount").textContent = count;
    document.getElementById("reapproTarget").textContent = state.threshold;
    var pct = Math.max(0, Math.min(100, Math.round((count/state.threshold)*100)));
    document.getElementById("reapproFill").style.width = pct + "%";
    document.getElementById("reapproMeta").textContent =
      "Derniere commande fournisseur passee le " + fmtDate(state.lastRestock) + ". Sont comptees les commandes payees ou a regler au retrait.";

    var tbody = document.getElementById("ordersTbody");
    if(state.ordersLoading){
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--sub);padding:22px 0;">Chargement des commandes...</td></tr>';
      return;
    }
    if(!ORDERS.length){
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--sub);padding:22px 0;">Aucune commande pour l\'instant.</td></tr>';
      return;
    }
    tbody.innerHTML = ORDERS.slice().reverse().map(function(o){
      var st = ORDER_STATUS[o.statut] || { label:o.statut, cls:"attente" };
      var items = o.lignes.map(function(l){
        return esc(l.article) + ' <span style="color:var(--sub)">' + esc(l.taille) + (l.couleur ? ' · ' + esc(l.couleur) : '') + (l.quantite > 1 ? ' ×' + l.quantite : '') + '</span>';
      }).join("<br>");
      return (
        '<tr>' +
          '<td data-label="Client"><b>'+esc(o.client.nom)+'</b><br><span style="color:var(--sub);font-size:12.5px">'+esc(o.client.telephone)+' · '+esc(o.client.email)+'</span></td>' +
          '<td data-label="Articles">'+items+'</td>' +
          '<td data-label="Total"><span class="sku-price">'+euro(o.total)+'</span></td>' +
          '<td data-label="Date">'+fmtDate(o.date.slice(0,10))+'<br><span style="color:var(--sub);font-size:12px">'+esc(o.id)+'</span></td>' +
          '<td data-label="Statut"><span class="order-status '+st.cls+'">'+st.label+'</span></td>' +
        '</tr>'
      );
    }).join("");
  }

  function fetchOrders(){
    if(state.ordersLoading) return;
    state.ordersLoading = true;
    renderOrders();
    fetchPreorders();
    fetch(ORDERS_API, { credentials:"same-origin", cache:"no-store" })
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(res){
        ORDERS = res.commandes || [];
        paymentState = { stripe:!!res.stripe, webhook:!!res.webhook, sheets:!!res.sheets };
        state.ordersLoading = false;
        renderOrders();
      })
      .catch(function(){
        state.ordersLoading = false;
        toast("Impossible de charger les commandes");
        renderOrders();
      });
  }

  /* ---------------- import d'articles (JSON) ----------------
     Fichier accepte : une liste d'articles, ou un objet { skus: [...] }
     (un catalogue exporte convient donc). Un article dont l'id ou la
     reference existe deja est mis a jour avec les seuls champs fournis ;
     sinon il est cree. Rien n'est applique avant validation de l'apercu,
     et le resultat part dans le brouillon comme une saisie a la main. */
  var NAMED_COLORS = {
    "bleu marine":"#0B1F3D", "marine":"#0B1F3D", "rouge":"#C8102E", "blanc":"#FFFFFF",
    "gris":"#8A8D93", "noir":"#15171B", "bordeaux":"#7A1E2C", "bleu":"#1F4E9C", "vert":"#1E7B4D"
  };
  var importPlan = null;

  function importTemplate(){
    return JSON.stringify([
      {
        "name":"T-shirt Exemple",
        "univers":"Lifestyle",
        "categorie":"T-shirts",
        "price":15,
        "sub":"Coton, coupe régulière",
        "ref":"IMP-TSHIRT-EXEMPLE",
        "colors":["Bleu marine", { "n":"Rouge club", "h":"#C8102E" }],
        "sizes":["S","M","L","XL","XXL"],
        "status":"actif",
        "desc":"Description affichée sur la fiche produit.",
        "photo":""
      }
    ], null, 2);
  }

  function pick(o, keys){ for(var i = 0; i < keys.length; i++){ if(o[keys[i]] != null && o[keys[i]] !== "") return o[keys[i]]; } return undefined; }

  /* Valide une entree du fichier. Renvoie { fields } (champs fournis,
     normalises) ou { error }, et des avertissements. */
  function normalizeImport(raw){
    var warn = [];
    if(!raw || typeof raw !== "object" || Array.isArray(raw)) return { error:"Ce n'est pas un article (objet attendu)" };
    var f = {};
    var name = pick(raw, ["name","nom"]);
    if(name != null){ name = String(name).trim().slice(0, 120); if(name) f.name = name; }
    var cat = pick(raw, ["typ","categorie","catégorie","category","cat"]);
    if(cat != null){
      cat = String(cat).trim();
      var known = TYPOLOGIES.filter(function(t){ return t.id.toLowerCase() === cat.toLowerCase(); })[0];
      if(!known) cat = cat.charAt(0).toUpperCase() + cat.slice(1);
      f.typ = known ? known.id : cat;
      if(!known) f._newCat = cat;
    }
    var un = pick(raw, ["univers","universe","univ"]);
    if(un != null){
      un = String(un).trim();
      var knownU = UNIVERSES.filter(function(u){ return u.id.toLowerCase() === un.toLowerCase(); })[0];
      if(!knownU) un = un.charAt(0).toUpperCase() + un.slice(1);
      f.univers = knownU ? knownU.id : un;
      if(!knownU) f._newUniv = un;
    }
    var price = pick(raw, ["price","prix"]);
    if(price != null){
      var n = typeof price === "number" ? price : parseFloat(String(price).replace(/\s|€/g, "").replace(",", "."));
      if(isNaN(n) || n < 0) return { error:"Prix illisible : " + price };
      f.price = Math.round(n * 100) / 100;
    }
    ["sub","ref","desc"].forEach(function(k){
      var alias = { sub:["sub","sous-titre","soustitre"], ref:["ref","reference","référence"], desc:["desc","description"] }[k];
      var v = pick(raw, alias);
      if(v != null) f[k] = String(v).trim().slice(0, k === "desc" ? 2000 : 160);
    });
    var colors = pick(raw, ["colors","couleurs"]);
    if(colors != null){
      if(!Array.isArray(colors)) colors = String(colors).split(",");
      f.colors = colors.map(function(c){
        if(c && typeof c === "object") {
          var h = String(c.h || c.hex || "").trim(), nm = String(c.n || c.nom || c.name || h).trim();
          if(!/^#[0-9a-f]{6}$/i.test(h)){ h = NAMED_COLORS[nm.toLowerCase()] || "#8A8D93"; if(!NAMED_COLORS[nm.toLowerCase()]) warn.push("couleur « "+nm+" » sans code, mise en gris"); }
          return { n:nm, h:h };
        }
        var s = String(c).trim();
        if(/^#[0-9a-f]{6}$/i.test(s)) return { n:s, h:s };
        var hex = NAMED_COLORS[s.toLowerCase()];
        if(!hex) warn.push("couleur « "+s+" » inconnue, mise en gris");
        return { n:s, h:hex || "#8A8D93" };
      }).filter(function(c){ return c.n; });
      if(!f.colors.length) delete f.colors;
    }
    var sizes = pick(raw, ["sizes","tailles"]);
    if(sizes != null){
      if(!Array.isArray(sizes)) sizes = String(sizes).split(/[,;]/);
      f.sizes = sizes.map(function(s){ return String(s).trim(); }).filter(Boolean);
      if(!f.sizes.length) delete f.sizes;
    }
    var status = pick(raw, ["status","statut"]);
    if(status != null){
      var st = String(status).toLowerCase();
      f.status = /pr[ée]?commande|preorder|pre-order/.test(st) ? "precommande" : /rupture|epuis|épuis|out/.test(st) ? "rupture" : "actif";
    }
    var hid = pick(raw, ["hidden","masque","masqué"]);
    if(hid != null) f.hidden = hid === true || /^(1|true|oui|yes)$/i.test(String(hid)) || undefined;
    var photos = pick(raw, ["photos"]);
    var photo = pick(raw, ["photo","image"]);
    var list = (Array.isArray(photos) ? photos : []).concat(photo && !(Array.isArray(photos) && photos.indexOf(photo) > -1) ? [photo] : []);
    var ok = list.map(String).filter(function(u){
      if(/^data:image\/(png|jpe?g|webp);base64,/i.test(u) || /^assets\/[\w.\-]+$/.test(u)) return true;
      warn.push("photo ignorée (" + (/^https?:/i.test(u) ? "lien externe" : "format inconnu") + ") : ajoute-la ensuite depuis la fiche");
      return false;
    });
    if(ok.length){ f.photos = ok; f.photo = ok[0]; }
    var id = pick(raw, ["id"]);
    if(id != null) f.id = String(id).trim();
    return { fields:f, warn:warn };
  }

  function planImport(text){
    var data;
    try { data = JSON.parse(text); } catch(e){ return { fatal:"Le fichier n'est pas un JSON valide : " + e.message }; }
    var items = Array.isArray(data) ? data : (data && Array.isArray(data.skus) ? data.skus : null);
    if(!items) return { fatal:"Le fichier doit contenir une liste d'articles, ou un objet avec une liste « skus »." };
    if(!items.length) return { fatal:"Le fichier ne contient aucun article." };
    if(items.length > 500) return { fatal:"500 articles au plus par import." };
    var rows = [], newCats = {}, newUnivs = {}, seen = {};
    items.forEach(function(raw, i){
      var r = normalizeImport(raw), line = "Article " + (i + 1);
      var rawName = raw && typeof raw === "object" && (raw.name || raw.nom);
      if(r.error){ rows.push({ kind:"err", label:rawName ? String(rawName) : line, note:r.error }); return; }
      var f = r.fields;
      var existing = (f.id && skuById(f.id)) || (f.ref && SKUS.filter(function(s){ return s.ref && s.ref.toLowerCase() === f.ref.toLowerCase(); })[0]) || null;
      var key = existing ? existing.id : (f.id || f.ref || f.name);
      if(key && seen[key]){ rows.push({ kind:"err", label:f.name || line, note:"en double dans le fichier (même id, référence ou nom que l'" + seen[key] + ")" }); return; }
      if(key) seen[key] = line.toLowerCase();
      if(!existing){
        var miss = ["name","typ","price"].filter(function(k){ return f[k] == null; })
          .map(function(k){ return { name:"nom", typ:"catégorie", price:"prix" }[k]; });
        if(miss.length){ rows.push({ kind:"err", label:f.name || line, note:"pour créer un article, il manque : " + miss.join(", ") }); return; }
      }
      if(f._newCat) newCats[f._newCat] = true;
      if(f._newUniv) newUnivs[f._newUniv] = true;
      rows.push({ kind:existing ? "upd" : "new", label:f.name || (existing && existing.name), target:existing, fields:f, note:r.warn.join(" · ") });
    });
    return { rows:rows, newCats:Object.keys(newCats), newUnivs:Object.keys(newUnivs) };
  }

  function renderImportPlan(fileName){
    var p = importPlan, body = document.getElementById("importBody");
    var apply = document.getElementById("importApply");
    var help = '<p class="imp-help">Fichier attendu : une liste d\'articles en JSON (ou un catalogue exporté). Champs : <code>name</code>, <code>categorie</code>, <code>price</code> obligatoires pour créer ; <code>univers</code>, <code>sub</code>, <code>ref</code>, <code>colors</code>, <code>sizes</code>, <code>status</code>, <code>desc</code>, <code>photo</code> facultatifs. Un article dont l\'<code>id</code> ou la <code>ref</code> existe déjà est mis à jour. <a href="#" id="importTemplate">Télécharger un modèle</a></p>';
    if(!p || p.fatal){
      body.innerHTML = (p && p.fatal ? '<p class="imp-help" style="color:var(--red)"><b>'+esc(p.fatal)+'</b></p>' : '') + help +
        '<button type="button" class="btn-navy" id="importPick" style="align-self:flex-start">Choisir un fichier JSON</button>';
      apply.disabled = true; apply.textContent = "Importer";
    } else {
      var n = { "new":0, upd:0, err:0 };
      p.rows.forEach(function(r){ n[r.kind]++; });
      var ok = n["new"] + n.upd;
      body.innerHTML =
        '<p class="imp-help">Fichier : <b>'+esc(fileName)+'</b> · <a href="#" id="importPickLink">en choisir un autre</a></p>' +
        '<div class="imp-summary">' +
          '<div class="imp-stat"><b>'+n["new"]+'</b>à créer</div>' +
          '<div class="imp-stat"><b>'+n.upd+'</b>à mettre à jour</div>' +
          '<div class="imp-stat'+(n.err?' err':'')+'"><b>'+n.err+'</b>en erreur (ignorés)</div>' +
        '</div>' +
        (p.newCats.length ? '<p class="imp-help">Catégories créées au passage : <b>'+p.newCats.map(esc).join(", ")+'</b> (modifiables dans l\'onglet Catégories &amp; menu).</p>' : '') +
        (p.newUnivs.length ? '<p class="imp-help">Univers créés au passage : <b>'+p.newUnivs.map(esc).join(", ")+'</b>.</p>' : '') +
        '<div class="imp-list">' + p.rows.map(function(r){
          var tag = { "new":"Nouveau", upd:"Mise à jour", err:"Erreur" }[r.kind];
          var detail = r.kind === "err" ? r.note : (r.kind === "upd"
            ? (function(){
                var LABEL = { name:"nom", typ:"catégorie", price:"prix", sub:"sous-titre", ref:"référence", desc:"description", colors:"couleurs", sizes:"tailles", status:"statut", photo:"photo", photos:"photos" };
                var changed = Object.keys(r.fields).filter(function(k){
                  return k !== "id" && k.charAt(0) !== "_" && k !== "photos" && JSON.stringify(r.fields[k]) !== JSON.stringify(r.target[k]);
                }).map(function(k){ return LABEL[k] || k; });
                return changed.length ? "modifié : " + changed.join(", ") : "aucun changement";
              })()
            : [r.fields.typ, r.fields.price != null ? euro(r.fields.price) : ""].filter(Boolean).join(" · "));
          return '<div class="imp-row"><span class="imp-tag '+r.kind+'">'+tag+'</span><div class="who"><b>'+esc(r.label || "")+'</b>' +
            '<div class="note">'+esc(detail)+'</div>' +
            (r.kind !== "err" && r.note ? '<div class="note warn">'+esc(r.note)+'</div>' : '') + '</div></div>';
        }).join("") + '</div>' + help;
      apply.disabled = !ok;
      apply.textContent = ok ? "Importer " + ok + " article" + (ok > 1 ? "s" : "") : "Rien à importer";
    }
    var pick2 = function(e){ e.preventDefault(); document.getElementById("importFile").click(); };
    ["importPick","importPickLink"].forEach(function(id){ var el = document.getElementById(id); if(el) el.addEventListener("click", pick2); });
    document.getElementById("importTemplate").addEventListener("click", function(e){
      e.preventDefault();
      download("modele-import-articles.json", new Blob([importTemplate()], { type:"application/json" }));
    });
  }

  function openImport(){
    importPlan = null;
    renderImportPlan("");
    document.getElementById("panelOverlay").hidden = false;
    var panel = document.getElementById("importPanel");
    panel.hidden = false;
    panel.setAttribute("aria-hidden","false");
    requestAnimationFrame(function(){ panel.classList.add("open"); });
  }
  function closeImport(){
    var panel = document.getElementById("importPanel");
    if(panel.hidden) return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden","true");
    document.getElementById("panelOverlay").hidden = true;
    setTimeout(function(){ panel.hidden = true; }, 250);
  }

  function applyImport(){
    if(!importPlan || importPlan.fatal) return;
    var created = 0, updated = 0;
    importPlan.newUnivs.forEach(function(u){ if(!universOf(u)) UNIVERSES.push({ id:u }); });
    importPlan.newCats.forEach(function(c){
      if(!typologyOf(c)) TYPOLOGIES.push({ id:c, icon:"icon-shirt", sizes:["S","M","L","XL","XXL"] });
    });
    importPlan.rows.forEach(function(r){
      if(r.kind === "err") return;
      var f = {};
      Object.keys(r.fields).forEach(function(k){ if(k.charAt(0) !== "_" && k !== "id") f[k] = r.fields[k]; });
      if(r.kind === "upd"){
        Object.assign(r.target, f);
        if(f.typ){ var t1 = typologyOf(f.typ); if(t1) r.target.icon = t1.icon; }
        updated++;
      } else {
        var typ = typologyOf(f.typ);
        var id = r.fields.id && !skuById(r.fields.id) && /^[a-z0-9-]+$/.test(r.fields.id) ? r.fields.id : uniqueId(f.name);
        SKUS.push(Object.assign({
          id:id, ref:slugRef(f.name, f.typ), sub:"", desc:"", status:"actif",
          colors:[{ n:"Bleu marine", h:"#0B1F3D" }],
          sizes:((universOf(f.univers) || {}).sizes || (typ && typ.sizes) || ["Taille unique"]).slice(),
          icon:typ ? typ.icon : "icon-shirt", hero:false, feature:false
        }, f));
        created++;
      }
    });
    closeImport();
    fillUnivSelect(); fillUnivFilter();
    catChanged();
    renderTable();
    toast(created + " créé" + (created>1?"s":"") + ", " + updated + " mis à jour (pense à publier)");
  }

  document.getElementById("importBtn").addEventListener("click", openImport);
  document.getElementById("importClose").addEventListener("click", closeImport);
  document.getElementById("importCancel").addEventListener("click", closeImport);
  document.getElementById("importApply").addEventListener("click", applyImport);
  document.getElementById("panelOverlay").addEventListener("click", closeImport);
  document.getElementById("importFile").addEventListener("change", function(e){
    var file = e.target.files[0];
    e.target.value = "";
    if(!file) return;
    if(file.size > 30 * 1024 * 1024){ importPlan = { fatal:"Fichier trop lourd (30 Mo au plus)." }; renderImportPlan(file.name); return; }
    file.text().then(function(text){
      importPlan = planImport(text);
      renderImportPlan(file.name);
    });
  });

  /* ---------------- pictogrammes ---------------- */
  var SVG_NS = "http://www.w3.org/2000/svg";

  /* Retire d'un dessin SVG tout ce qui peut executer du code ou charger
     une ressource exterieure. Meme fonction dans la boutique. */
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

  function installIcons(list){
    var sprite = document.getElementById("iconSprite");
    list.forEach(function(ic){
      if(!ic || !/^icon-[a-z0-9-]+$/.test(ic.id) || (!ic.svg && !ic.image)) return;
      var old = document.getElementById(ic.id);
      if(old) old.remove();
      var sym = document.createElementNS(SVG_NS, "symbol");
      sym.setAttribute("id", ic.id);
      if(ic.svg){
        sym.setAttribute("viewBox", ic.viewBox || "0 0 120 120");
        sym.setAttribute("fill", "currentColor");
        sym.innerHTML = cleanSvgMarkup(ic.svg);
      } else {
        sym.setAttribute("viewBox", "0 0 100 100");
        var img = document.createElementNS(SVG_NS, "image");
        img.setAttribute("href", assetUrl(ic.image));
        img.setAttribute("width", "100"); img.setAttribute("height", "100");
        img.setAttribute("preserveAspectRatio", "xMidYMid meet");
        sym.appendChild(img);
      }
      sprite.appendChild(sym);
    });
  }

  /* SVG importe : viewBox, nettoyage, et couleurs remplacees par
     currentColor pour suivre la couleur de l'article. */
  function importSvg(text){
    var doc = new DOMParser().parseFromString(text, "image/svg+xml");
    var svg = doc.documentElement;
    if(!svg || svg.nodeName.toLowerCase() !== "svg" || doc.getElementsByTagName("parsererror").length) throw new Error("Ce fichier n'est pas un SVG lisible");
    var vb = svg.getAttribute("viewBox");
    if(!vb){
      var w = parseFloat(svg.getAttribute("width")) || 120, h = parseFloat(svg.getAttribute("height")) || 120;
      vb = "0 0 " + w + " " + h;
    }
    var paint = function(v){ return v && !/^(none|transparent|currentColor)$/i.test(v.trim()) && !/^url\(/i.test(v.trim()); };
    svg.querySelectorAll("*").forEach(function(n){
      ["fill","stroke"].forEach(function(k){ if(paint(n.getAttribute(k))) n.setAttribute(k, "currentColor"); });
      var st = n.getAttribute("style");
      if(st) n.setAttribute("style", st.replace(/(fill|stroke)\s*:\s*([^;]+)/gi, function(all, k, v){ return paint(v) ? k + ":currentColor" : all; }));
    });
    var inner = cleanSvgMarkup(svg.innerHTML);
    if(!inner.trim()) throw new Error("Ce SVG est vide");
    if(inner.length > 60000) throw new Error("Ce SVG est trop lourd (60 Ko au plus)");
    return { viewBox:vb, svg:inner };
  }

  /* PNG / WebP importe : reduit a 256 px, transparence conservee. */
  function importBitmap(file, cb, fail){
    var reader = new FileReader();
    reader.onload = function(ev){
      var img = new Image();
      img.onload = function(){
        var s = Math.min(1, 256 / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/png"));
      };
      img.onerror = function(){ fail("Image illisible"); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function iconUsage(id){
    return {
      cats:TYPOLOGIES.filter(function(t){ return t.icon === id; }).map(function(t){ return t.id; }),
      skus:SKUS.filter(function(s){ return s.icon === id; }).length
    };
  }

  function renderPictos(){
    document.getElementById("pictoGrid").innerHTML = ICONS.map(function(ic, i){
      var u = iconUsage(ic.id);
      return '<div class="picto-tile" data-i="'+i+'">' +
        '<div class="picto-prev"><svg><use href="#'+esc(ic.id)+'"/></svg></div>' +
        '<input type="text" data-picto="name" value="'+esc(ic.name)+'" aria-label="Nom du pictogramme">' +
        '<div class="picto-use">'+(u.cats.length ? esc(u.cats.join(", ")) : "Non utilisé")+'</div>' +
        '<div class="picto-actions">' +
          '<button type="button" data-picto-act="replace">Remplacer</button>' +
          '<button type="button" class="danger" data-picto-act="del">Supprimer</button>' +
        '</div>' +
      '</div>';
    }).join("") +
      '<button type="button" class="picto-add" data-picto-act="add">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        'Ajouter un pictogramme<span style="font-size:11px">SVG ou PNG</span></button>';
  }

  var pictoTarget = null;   // index a remplacer, ou null pour un ajout

  document.getElementById("pictoGrid").addEventListener("click", function(e){
    var b = e.target.closest("[data-picto-act]");
    if(!b) return;
    var act = b.getAttribute("data-picto-act");
    var tile = b.closest(".picto-tile"), i = tile ? +tile.getAttribute("data-i") : -1;
    if(act === "add" || act === "replace"){
      pictoTarget = act === "add" ? null : i;
      document.getElementById("pictoFile").click();
    } else if(act === "del"){
      var ic = ICONS[i], u = iconUsage(ic.id);
      if(u.cats.length){ toast("Utilise par : " + u.cats.join(", ") + ". Change leur pictogramme avant de le supprimer"); return; }
      if(!confirm("Supprimer le pictogramme « "+ic.name+" » ?")) return;
      ICONS.splice(i, 1);
      // les articles qui l'avaient reprennent celui de leur categorie
      SKUS.forEach(function(s){ if(s.icon === ic.id){ var t = typologyOf(s.typ); s.icon = t ? t.icon : "icon-shirt"; } });
      toast("Pictogramme supprime");
      catChanged();
      renderTable();
    }
  });

  document.getElementById("pictoGrid").addEventListener("change", function(e){
    var el = e.target;
    if(el.getAttribute("data-picto") !== "name") return;
    var ic = ICONS[+el.closest(".picto-tile").getAttribute("data-i")];
    var v = el.value.trim();
    if(!v){ toast("Donne un nom au pictogramme"); el.value = ic.name; return; }
    ic.name = v;
    catChanged();
  });

  document.getElementById("pictoFile").addEventListener("change", function(e){
    var file = e.target.files[0];
    e.target.value = "";
    if(!file) return;
    var target = pictoTarget;
    function store(draw){
      var ic;
      if(target === null){
        var base = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Pictogramme";
        var slug = base.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "picto";
        var id = "icon-" + slug, n = 2;
        while(ICONS.some(function(x){ return x.id === id; }) || document.getElementById(id)) id = "icon-" + slug + "-" + (n++);
        ic = { id:id, name:base.charAt(0).toUpperCase() + base.slice(1) };
        ICONS.push(ic);
      } else {
        ic = ICONS[target];
      }
      delete ic.svg; delete ic.viewBox; delete ic.image;
      Object.assign(ic, draw);
      installIcons([ic]);
      toast(target === null ? "Pictogramme ajoute" : "Dessin remplace");
      catChanged();
      renderTable();
    }
    if(/svg/i.test(file.type) || /\.svg$/i.test(file.name)){
      file.text().then(function(text){
        try { store(importSvg(text)); } catch(err){ toast(err.message); }
      });
    } else {
      importBitmap(file, function(dataUrl){ store({ image:dataUrl }); }, toast);
    }
  });

  /* ---------------- univers ---------------- */
  function univCount(id){ return SKUS.filter(function(s){ return s.univers === id; }).length; }

  function renderUnivTab(){
    var last = UNIVERSES.length - 1;
    document.getElementById("univRows").innerHTML = UNIVERSES.map(function(u, i){
      var n = univCount(u.id);
      return '<div class="cat-row univ-row" data-i="'+i+'">' +
        '<div><label>Nom</label><input type="text" data-univ="name" value="'+esc(u.id)+'"></div>' +
        '<div class="cat-sizes"><label>Tailles par défaut (facultatif)</label><input type="text" data-univ="sizes" value="'+esc((u.sizes||[]).join(", "))+'" placeholder="celles de la catégorie"></div>' +
        '<div class="cat-count">'+n+' article'+(n>1?'s':'')+'</div>' +
        '<div class="row-tools">' +
          '<button type="button" class="icon-btn-sm" data-univ-act="up" aria-label="Monter"'+(i===0?' disabled':'')+'>↑</button>' +
          '<button type="button" class="icon-btn-sm" data-univ-act="down" aria-label="Descendre"'+(i===last?' disabled':'')+'>↓</button>' +
          '<button type="button" class="icon-btn-sm danger" data-univ-act="del" aria-label="Supprimer">'+ICON_TRASH+'</button>' +
        '</div>' +
      '</div>';
    }).join("");
  }
  function univChanged(){
    persistDraft();
    fillUnivSelect(); fillUnivFilter();
    renderUnivTab(); renderMenuTab(); renderTable();
  }
  document.getElementById("univRows").addEventListener("change", function(e){
    var el = e.target, row = el.closest(".cat-row");
    if(!row) return;
    var u = UNIVERSES[+row.getAttribute("data-i")];
    if(el.getAttribute("data-univ") === "name"){
      var v = el.value.trim();
      var taken = UNIVERSES.some(function(x){ return x !== u && x.id.toLowerCase() === v.toLowerCase(); });
      if(!v || taken){ toast(v ? "Un univers porte deja ce nom" : "Donne un nom a l'univers"); el.value = u.id; return; }
      if(v !== u.id){
        var from = u.id; u.id = v;
        SKUS.forEach(function(s){ if(s.univers === from) s.univers = v; });
        MENU.forEach(function(m){ if(m.univ) m.univ = m.univ.map(function(x){ return x === from ? v : x; }); });
        if(state.activeUniv === from) state.activeUniv = v;
        toast("« "+from+" » renomme en « "+v+" »");
      }
    } else {
      var sizes = el.value.split(/[,;]/).map(function(x){ return x.trim(); }).filter(Boolean);
      if(sizes.length) u.sizes = sizes; else delete u.sizes;
    }
    univChanged();
  });
  document.getElementById("univRows").addEventListener("click", function(e){
    var b = e.target.closest("[data-univ-act]");
    if(!b) return;
    var i = +b.closest(".cat-row").getAttribute("data-i"), u = UNIVERSES[i], act = b.getAttribute("data-univ-act");
    if(act === "up" || act === "down"){
      UNIVERSES.splice(act === "up" ? i - 1 : i + 1, 0, UNIVERSES.splice(i, 1)[0]);
    } else {
      var n = univCount(u.id);
      if(n){ toast(n+" article"+(n>1?"s sont":" est")+" dans « "+u.id+" » : change-"+(n>1?"les":"le")+" d'univers avant de le supprimer"); return; }
      if(!confirm("Supprimer l'univers « "+u.id+" » ?")) return;
      UNIVERSES.splice(i, 1);
      MENU.forEach(function(m){ if(m.univ){ m.univ = m.univ.filter(function(x){ return x !== u.id; }); if(!m.univ.length) delete m.univ; } });
    }
    univChanged();
  });
  document.getElementById("univAdd").addEventListener("click", function(){
    var name = "Nouvel univers", n = 2;
    while(universOf(name)) name = "Nouvel univers " + (n++);
    UNIVERSES.push({ id:name });
    univChanged();
    var inputs = document.querySelectorAll('#univRows [data-univ="name"]');
    inputs[inputs.length - 1].focus(); inputs[inputs.length - 1].select();
  });

  /* ---------------- categories et menu ---------------- */
  function catChanged(){
    persistDraft();
    fillTypSelect();
    renderSidebar();
    renderPictos();
    renderCatsTab();
    renderMenuTab();
  }

  function catCount(id){ return SKUS.filter(function(s){ return s.typ === id; }).length; }

  /* Renommer : articles, rubriques du menu et filtres de l'accueil suivent. */
  function renameCategory(from, to){
    if(homeTabRendered) collectHomeFields();   // garder ce qui est en cours dans l'onglet Accueil
    var swap = function(list){ return (list||[]).map(function(x){ return x === from ? to : x; }); };
    TYPOLOGIES.forEach(function(t){ if(t.id === from) t.id = to; });
    SKUS.forEach(function(s){ if(s.typ === from) s.typ = to; });
    MENU.forEach(function(m){ if(m.cats) m.cats = swap(m.cats); });
    (HOME.cats||[]).forEach(function(c){ c.filter = swap(c.filter); });
    (HOME.duo||[]).forEach(function(d){ d.filter = swap(d.filter); });
    if(state.activeTyp === from) state.activeTyp = to;
    if(homeTabRendered) renderHomeTab();
  }

  function renderCatsTab(){
    var icons = function(sel){
      var list = ICONS.some(function(o){ return o.id === sel; }) ? ICONS : ICONS.concat([{ id:sel, name:"(supprimé)" }]);
      return list.map(function(o){ return '<option value="'+esc(o.id)+'"'+(o.id===sel?' selected':'')+'>'+esc(o.name)+'</option>'; }).join("");
    };
    var last = TYPOLOGIES.length - 1;
    document.getElementById("catRows").innerHTML = TYPOLOGIES.map(function(c, i){
      var n = catCount(c.id);
      return '<div class="cat-row" data-i="'+i+'">' +
        '<div><label>Nom</label><input type="text" data-cat="name" value="'+esc(c.id)+'"></div>' +
        '<div><label>Pictogramme</label><select data-cat="icon">'+icons(c.icon)+'</select></div>' +
        '<div class="cat-sizes"><label>Tailles (séparées par des virgules)</label><input type="text" data-cat="sizes" value="'+esc((c.sizes||[]).join(", "))+'"></div>' +
        '<div class="cat-count">'+n+' article'+(n>1?'s':'')+'</div>' +
        '<div class="row-tools">' +
          '<button type="button" class="icon-btn-sm" data-cat-act="up" aria-label="Monter"'+(i===0?' disabled':'')+'>↑</button>' +
          '<button type="button" class="icon-btn-sm" data-cat-act="down" aria-label="Descendre"'+(i===last?' disabled':'')+'>↓</button>' +
          '<button type="button" class="icon-btn-sm danger" data-cat-act="del" aria-label="Supprimer">'+ICON_TRASH+'</button>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  document.getElementById("catRows").addEventListener("change", function(e){
    var el = e.target, row = el.closest(".cat-row");
    if(!row) return;
    var c = TYPOLOGIES[+row.getAttribute("data-i")];
    var what = el.getAttribute("data-cat");
    if(what === "name"){
      var v = el.value.trim();
      var taken = TYPOLOGIES.some(function(t){ return t !== c && t.id.toLowerCase() === v.toLowerCase(); });
      if(!v || taken){ toast(v ? "Une categorie porte deja ce nom" : "Donne un nom a la categorie"); el.value = c.id; return; }
      if(v !== c.id){
        var from = c.id, its = SKUS.filter(function(s){ return s.typ === from; });
        // renommer deplace TOUS les articles de la categorie : on le dit avant
        if(its.length && !confirm("Renommer « "+from+" » en « "+v+" » change la catégorie de "+its.length+" article"+(its.length>1?"s":"")+" : "+
            its.map(function(s){ return s.name; }).join(", ")+".\n\nPour n'en déplacer qu'une partie, annule, crée une nouvelle catégorie et change la catégorie de ces articles dans leur fiche.\n\nRenommer quand même ?")){
          el.value = from; return;
        }
        renameCategory(from, v); toast("« "+from+" » renommee en « "+v+" »");
      }
    } else if(what === "icon"){
      c.icon = el.value;
      SKUS.forEach(function(s){ if(s.typ === c.id) s.icon = c.icon; });
    } else if(what === "sizes"){
      var sizes = el.value.split(/[,;]/).map(function(x){ return x.trim(); }).filter(Boolean);
      if(!sizes.length){ toast("Indique au moins une taille (ou « Taille unique »)"); el.value = (c.sizes||[]).join(", "); return; }
      c.sizes = sizes;
    }
    catChanged();
  });

  document.getElementById("catRows").addEventListener("click", function(e){
    var b = e.target.closest("[data-cat-act]");
    if(!b) return;
    var i = +b.closest(".cat-row").getAttribute("data-i"), c = TYPOLOGIES[i];
    var act = b.getAttribute("data-cat-act");
    if(act === "up" || act === "down"){
      var j = act === "up" ? i - 1 : i + 1;
      TYPOLOGIES.splice(j, 0, TYPOLOGIES.splice(i, 1)[0]);
    } else if(act === "del"){
      var n = catCount(c.id);
      if(n){ toast(n+" article"+(n>1?"s utilisent":" utilise")+" « "+c.id+" » : change-"+(n>1?"les":"le")+" de categorie avant de la supprimer"); return; }
      if(TYPOLOGIES.length === 1){ toast("Il faut garder au moins une categorie"); return; }
      if(!confirm("Supprimer la categorie « "+c.id+" » ?")) return;
      TYPOLOGIES.splice(i, 1);
      MENU.forEach(function(m){ if(m.cats){ m.cats = m.cats.filter(function(x){ return x !== c.id; }); if(!m.cats.length) delete m.cats; } });
      if(homeTabRendered) collectHomeFields();
      (HOME.cats||[]).forEach(function(x){ x.filter = (x.filter||[]).filter(function(f){ return f !== c.id; }); });
      (HOME.duo||[]).forEach(function(x){ x.filter = (x.filter||[]).filter(function(f){ return f !== c.id; }); });
      if(homeTabRendered) renderHomeTab();
      if(state.activeTyp === c.id) state.activeTyp = "all";
      toast("Categorie supprimee");
    }
    catChanged();
  });

  document.getElementById("catAdd").addEventListener("click", function(){
    var name = "Nouvelle catégorie", n = 2;
    while(TYPOLOGIES.some(function(t){ return t.id === name; })) name = "Nouvelle catégorie " + (n++);
    TYPOLOGIES.push({ id:name, icon:"icon-shirt", sizes:["S","M","L","XL","XXL"] });
    catChanged();
    var inputs = document.querySelectorAll('#catRows [data-cat="name"]');
    var last = inputs[inputs.length - 1];
    last.focus(); last.select();
  });

  function renderMenuTab(){
    var lastM = MENU.length - 1;
    var skuOptions = function(col){
      return '<option value="">+ Ajouter un article…</option>' +
        SKUS.filter(function(s){ return col.ids.indexOf(s.id) === -1; })
          .map(function(s){ return '<option value="'+esc(s.id)+'">'+esc(s.name)+' ('+esc(s.typ)+')</option>'; }).join("");
    };
    document.getElementById("menuRows").innerHTML = MENU.map(function(m, i){
      var cats = m.cats || [];
      var cols = m.cols || [];
      return '<div class="menu-card" data-m="'+i+'">' +
        '<div class="menu-head">' +
          '<div><label class="sub" style="margin-top:0">Nom de la rubrique</label><input type="text" data-menu="label" value="'+esc(m.label)+'"></div>' +
          '<div class="row-tools">' +
            '<button type="button" class="icon-btn-sm" data-menu-act="up" aria-label="Monter"'+(i===0?' disabled':'')+'>↑</button>' +
            '<button type="button" class="icon-btn-sm" data-menu-act="down" aria-label="Descendre"'+(i===lastM?' disabled':'')+'>↓</button>' +
            '<button type="button" class="icon-btn-sm danger" data-menu-act="del" aria-label="Supprimer la rubrique">'+ICON_TRASH+'</button>' +
          '</div>' +
        '</div>' +
        '<label class="sub">Le nom mène à la liste de cet univers…</label>' +
        '<div class="cat-checks">' + UNIVERSES.map(function(u){
          return '<label class="cat-check"><input type="checkbox" data-menu="univ" value="'+esc(u.id)+'"'+((m.univ||[]).indexOf(u.id)>-1?' checked':'')+'> '+esc(u.id)+'</label>';
        }).join("") + '</div>' +
        '<label class="sub">'+((m.univ||[]).length ? '…en ne gardant que ces catégories (rien de coché = tout l\'univers)' : '…ou de ces catégories, tous univers confondus')+'</label>' +
        '<div class="cat-checks">' + TYPOLOGIES.map(function(c){
          return '<label class="cat-check"><input type="checkbox" data-menu="cat" value="'+esc(c.id)+'"'+(cats.indexOf(c.id)>-1?' checked':'')+'> '+esc(c.id)+'</label>';
        }).join("") + '</div>' +
        (function(){
          var us = m.univ || [];
          if(!cats.length && !us.length) return '<p class="home-hint" style="margin-top:6px">Rien de coché : le nom de la rubrique ouvre seulement son menu déroulant.</p>';
          var n = SKUS.filter(function(s){
            return (!us.length || us.indexOf(s.univers) > -1) && (!cats.length || cats.indexOf(s.typ) > -1);
          }).length;
          return n
            ? '<p class="home-hint" style="margin-top:6px">Le lien ouvre <b>'+n+' article'+(n>1?'s':'')+'</b>.</p>'
            : '<p class="home-hint" style="margin-top:6px;color:var(--red)"><b>Le lien n\'ouvre aucun article</b> : aucun article ne correspond à cet univers et à ces catégories à la fois. Décoche les catégories pour ouvrir tout l\'univers.</p>';
        })() +
        '<label class="sub">Colonnes du menu déroulant</label>' +
        cols.map(function(col, j){
          return '<div class="menu-col" data-c="'+j+'">' +
            '<div class="menu-col-head">' +
              '<input type="text" data-menu="coltitle" value="'+esc(col.title)+'" placeholder="Titre de la colonne">' +
              '<button type="button" class="icon-btn-sm" data-menu-act="colup" aria-label="Colonne vers la gauche"'+(j===0?' disabled':'')+'>←</button>' +
              '<button type="button" class="icon-btn-sm" data-menu-act="coldown" aria-label="Colonne vers la droite"'+(j===cols.length-1?' disabled':'')+'>→</button>' +
              '<button type="button" class="icon-btn-sm danger" data-menu-act="coldel" aria-label="Supprimer la colonne">'+ICON_TRASH+'</button>' +
            '</div>' +
            '<div class="col-items">' + (col.ids.length ? col.ids.map(function(id, k){
              var s = skuById(id);
              return '<span class="col-item'+(s?'':' missing')+'" data-k="'+k+'">' + esc(s ? s.name : id) +
                (k>0 ? '<button type="button" data-menu-act="itemup" aria-label="Avancer">‹</button>' : '') +
                (k<col.ids.length-1 ? '<button type="button" data-menu-act="itemdown" aria-label="Reculer">›</button>' : '') +
                '<button type="button" data-menu-act="itemdel" aria-label="Retirer">×</button></span>';
            }).join("") : '<span class="home-hint">Aucun article dans cette colonne.</span>') + '</div>' +
            '<select data-menu="additem">'+skuOptions(col)+'</select>' +
          '</div>';
        }).join("") +
        '<button type="button" class="btn-ghost" data-menu-act="coladd" style="margin-top:8px">+ Ajouter une colonne</button>' +
        '<label class="sub">Message affiché si la rubrique n\'a pas de colonne</label>' +
        '<textarea rows="2" data-menu="note" placeholder="Ex. La collection arrive bientôt.">'+esc(m.note||"")+'</textarea>' +
      '</div>';
    }).join("");
  }

  function menuChanged(){ persistDraft(); renderMenuTab(); }

  document.getElementById("menuRows").addEventListener("change", function(e){
    var el = e.target, card = el.closest(".menu-card");
    if(!card) return;
    var m = MENU[+card.getAttribute("data-m")];
    var colEl = el.closest(".menu-col"), col = colEl ? m.cols[+colEl.getAttribute("data-c")] : null;
    var what = el.getAttribute("data-menu");
    if(what === "label"){
      var v = el.value.trim();
      if(!v){ toast("Donne un nom a la rubrique"); el.value = m.label; return; }
      m.label = v;
    } else if(what === "univ"){
      var us = Array.prototype.map.call(card.querySelectorAll('[data-menu="univ"]:checked'), function(x){ return x.value; });
      if(us.length) m.univ = us; else delete m.univ;
    } else if(what === "cat"){
      var cats = Array.prototype.map.call(card.querySelectorAll('[data-menu="cat"]:checked'), function(x){ return x.value; });
      if(cats.length) m.cats = cats; else delete m.cats;   // la boutique teste la presence de cats
    } else if(what === "coltitle"){
      col.title = el.value.trim();
    } else if(what === "additem"){
      if(!el.value) return;
      col.ids.push(el.value);
    } else if(what === "note"){
      var note = el.value.trim();
      if(note) m.note = note; else delete m.note;
    }
    menuChanged();
  });

  document.getElementById("menuRows").addEventListener("click", function(e){
    var b = e.target.closest("[data-menu-act]");
    if(!b) return;
    var i = +b.closest(".menu-card").getAttribute("data-m"), m = MENU[i];
    var colEl = b.closest(".menu-col"), j = colEl ? +colEl.getAttribute("data-c") : -1;
    var itemEl = b.closest(".col-item"), k = itemEl ? +itemEl.getAttribute("data-k") : -1;
    var move = function(list, from, to){ list.splice(to, 0, list.splice(from, 1)[0]); };
    switch(b.getAttribute("data-menu-act")){
      case "up": move(MENU, i, i - 1); break;
      case "down": move(MENU, i, i + 1); break;
      case "del":
        if(!confirm("Supprimer la rubrique « "+m.label+" » du menu ?")) return;
        MENU.splice(i, 1); break;
      case "coladd": m.cols = m.cols || []; m.cols.push({ title:"Nouvelle colonne", ids:[] }); break;
      case "colup": move(m.cols, j, j - 1); break;
      case "coldown": move(m.cols, j, j + 1); break;
      case "coldel":
        if(m.cols[j].ids.length && !confirm("Supprimer la colonne « "+(m.cols[j].title||"sans titre")+" » ?")) return;
        m.cols.splice(j, 1); break;
      case "itemup": move(m.cols[j].ids, k, k - 1); break;
      case "itemdown": move(m.cols[j].ids, k, k + 1); break;
      case "itemdel": m.cols[j].ids.splice(k, 1); break;
    }
    menuChanged();
  });

  document.getElementById("menuAdd").addEventListener("click", function(){
    MENU.push({ label:"Nouvelle rubrique", cols:[] });
    menuChanged();
    var inputs = document.querySelectorAll('#menuRows [data-menu="label"]');
    var last = inputs[inputs.length - 1];
    last.focus(); last.select();
  });

  /* ---------------- precommandes ---------------- */
  var PREORDERS = [];
  function fetchPreorders(){
    fetch("../api/precommandes", { credentials:"same-origin", cache:"no-store" })
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(res){ PREORDERS = res.precommandes || []; renderPreorders(); })
      .catch(function(){ PREORDERS = []; renderPreorders(true); });
  }
  function renderPreorders(failed){
    var tbody = document.getElementById("preTbody");
    var sum = document.getElementById("preSummary");
    if(failed || !PREORDERS.length){
      sum.innerHTML = "";
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--sub);padding:22px 0;">'+(failed ? "Impossible de charger les précommandes." : "Aucune précommande pour l'instant.")+'</td></tr>';
      return;
    }
    // total par article, detail par taille
    var by = {};
    PREORDERS.forEach(function(x){
      var a = by[x.id] = by[x.id] || { name:x.article, n:0, sizes:{} };
      a.n += x.quantite || 1;
      var k = x.taille || "taille unique";
      a.sizes[k] = (a.sizes[k] || 0) + (x.quantite || 1);
    });
    sum.innerHTML = '<div class="pre-sum">' + Object.keys(by).map(function(id){
      var a = by[id];
      return '<div class="pre-card"><b>'+esc(a.name)+' · '+a.n+'</b><span>'+
        Object.keys(a.sizes).map(function(s){ return esc(s)+' : '+a.sizes[s]; }).join(" · ")+'</span></div>';
    }).join("") + '</div>';
    tbody.innerHTML = PREORDERS.slice().reverse().map(function(x){
      return '<tr>' +
        '<td data-label="E-mail">'+esc(x.email)+'</td>' +
        '<td data-label="Article">'+esc(x.article)+(x.quantite > 1 ? ' ×'+x.quantite : '')+'</td>' +
        '<td data-label="Taille">'+esc(x.taille || "—")+'</td>' +
        '<td data-label="Couleur">'+esc(x.couleur || "—")+'</td>' +
        '<td data-label="Date">'+fmtDate(x.date.slice(0,10))+'</td>' +
      '</tr>';
    }).join("");
  }
  document.getElementById("preCopy").addEventListener("click", function(){
    var emails = PREORDERS.map(function(x){ return x.email; }).filter(function(e, i, all){ return all.indexOf(e) === i; });
    if(!emails.length){ toast("Aucun e-mail a copier"); return; }
    navigator.clipboard.writeText(emails.join(", ")).then(function(){
      toast(emails.length + " e-mail" + (emails.length>1?"s":"") + " copie" + (emails.length>1?"s":"") + " : colle-les en copie cachee (Cci)");
    }, function(){ toast("Copie impossible dans ce navigateur"); });
  });
  document.getElementById("preCsv").addEventListener("click", function(){
    if(!PREORDERS.length){ toast("Aucune precommande"); return; }
    var q = function(v){ v = String(v == null ? "" : v); return /[",;\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; };
    var rows = [["Date","E-mail","Article","Taille","Couleur","Quantite"]].concat(PREORDERS.map(function(x){
      return [x.date.slice(0,16).replace("T"," "), x.email, x.article, x.taille, x.couleur, x.quantite || 1];
    }));
    download("precommandes.csv", new Blob(["\ufeff" + rows.map(function(r){ return r.map(q).join(";"); }).join("\n")], { type:"text/csv" }));
  });

  /* ---------------- tabs ---------------- */
  function switchTab(tab){
    state.tab = tab;
    document.querySelectorAll(".bo-tab").forEach(function(b){
      b.setAttribute("aria-selected", b.getAttribute("data-tab")===tab);
    });
    document.getElementById("tab-catalogue").hidden = tab!=="catalogue";
    document.getElementById("tab-commandes").hidden = tab!=="commandes";
    document.getElementById("tab-accueil").hidden = tab!=="accueil";
    document.getElementById("tab-categories").hidden = tab!=="categories";
    document.getElementById("tab-textes").hidden = tab!=="textes";
    if(tab==="catalogue") renderTable();
    else if(tab==="commandes") fetchOrders();
    else if(tab==="categories"){ renderPictos(); renderUnivTab(); renderCatsTab(); renderMenuTab(); }
    else if(tab==="textes"){ renderTextsTab(); renderGuides(); }
    else renderHomeTab();
  }

  /* ---------------- page d'accueil ----------------
     Publie dans catalogue.json (cle "home") : les textes des blocs, leurs
     visuels, et le produit mis en avant, qui vient lui de l'option cochee
     sur une fiche produit. */
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
  var HOME = JSON.parse(JSON.stringify(HOME_DEFAULT));
  /* un champ laisse vide ne doit pas effacer le texte par defaut */
  function nonEmpty(o){
    var r = {};
    Object.keys(o).forEach(function(k){ if(o[k] !== "" && o[k] != null) r[k] = o[k]; });
    return r;
  }
  function applyHome(saved){
    if(saved && typeof saved === "object"){
      HOME = Object.assign(JSON.parse(JSON.stringify(HOME_DEFAULT)), nonEmpty(saved));
    }
  }

  /* Une image de hero part telle quelle dans le stockage local (limite ~5 Mo) :
     on la redimensionne avant de la garder. */
  function shrinkImage(file, maxW, cb){
    var reader = new FileReader();
    reader.onload = function(ev){
      var img = new Image();
      img.onload = function(){
        var w = Math.min(maxW, img.width), h = Math.round(img.height * w / img.width);
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function(){ cb(ev.target.result); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* collectHome() relit les champs de l'onglet : tant qu'il n'a pas ete
     ouvert, ils sont vides et ne doivent pas ecraser les textes. */
  var homeTabRendered = false;

  function renderHomeTab(){
    homeTabRendered = true;
    var hero = SKUS.filter(function(s){ return s.hero; })[0];
    document.getElementById("heroSummary").innerHTML = hero
      ? 'Article mis en avant : <b>'+esc(hero.name)+'</b>. Le visuel et les textes du hero se reglent sur sa fiche, onglet Catalogue SKU.'
      : 'Aucun article mis en avant. Ouvre une fiche dans Catalogue SKU et coche <b>Hero de la page d\'accueil</b>.';
    var feature = SKUS.filter(function(s){ return s.feature; })[0];
    document.getElementById("heroSummary").innerHTML += '<br>Produit du moment : <b>' +
      esc(feature ? feature.name : (hero ? hero.name + " (le meme que le hero)" : "aucun")) +
      '</b>. Pour en changer, coche <b>Produit du moment</b> sur la fiche de l\'article.';

    document.getElementById("h-eyebrow").value = HOME.heroEyebrow || "";
    document.getElementById("h-railtitle").value = HOME.railTitle || "";
    document.getElementById("h-railsub").value = HOME.railSub || "";

    document.getElementById("homeCats").innerHTML = HOME.cats.map(function(c, i){
      return '<div class="home-row">' +
        '<div class="home-row-head"><b>Univers '+(i+1)+'</b>' +
          '<button type="button" class="home-upload" data-upload="cat" data-i="'+i+'">Choisir un visuel</button></div>' +
        '<label>Libelle</label><input type="text" data-home="cats.'+i+'.label" value="'+esc(c.label)+'">' +
        '<label>Categories filtrees (separees par une virgule)</label>' +
        '<input type="text" data-home="cats.'+i+'.filter" value="'+esc((c.filter||[]).join(", "))+'">' +
      '</div>';
    }).join("");

    document.getElementById("homeDuo").innerHTML = HOME.duo.map(function(d, i){
      return '<div class="home-row">' +
        '<div class="home-row-head"><b>Bloc '+(i+1)+'</b>' +
          '<button type="button" class="home-upload" data-upload="duo" data-i="'+i+'">Choisir un visuel</button></div>' +
        '<label>Titre</label><input type="text" data-home="duo.'+i+'.title" value="'+esc(d.title)+'">' +
        '<label>Texte</label><textarea rows="2" data-home="duo.'+i+'.text">'+esc(d.text)+'</textarea>' +
        '<label>Libelle du bouton</label><input type="text" data-home="duo.'+i+'.cta" value="'+esc(d.cta)+'">' +
        '<label>Categories filtrees (separees par une virgule)</label>' +
        '<input type="text" data-home="duo.'+i+'.filter" value="'+esc((d.filter||[]).join(", "))+'">' +
      '</div>';
    }).join("");

    document.getElementById("homeTrust").innerHTML = HOME.trust.map(function(t, i){
      return '<div class="home-row">' +
        '<div class="home-row-head"><b>Argument '+(i+1)+'</b></div>' +
        '<label>Titre</label><input type="text" data-home="trust.'+i+'.title" value="'+esc(t.title)+'">' +
        '<label>Precision</label><input type="text" data-home="trust.'+i+'.text" value="'+esc(t.text)+'">' +
      '</div>';
    }).join("");

    document.getElementById("tab-accueil").querySelectorAll("[data-upload]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var input = document.createElement("input");
        input.type = "file"; input.accept = "image/*";
        input.addEventListener("change", function(){
          if(!input.files[0]) return;
          shrinkImage(input.files[0], 1400, function(dataUrl){
            HOME[btn.getAttribute("data-upload") === "cat" ? "cats" : "duo"][+btn.getAttribute("data-i")].image = dataUrl;
            toast("Visuel charge, pense a enregistrer");
          });
        });
        input.click();
      });
    });
  }

  function collectHome(){
    if(homeTabRendered) collectHomeFields();
    var feature = SKUS.filter(function(s){ return s.feature; })[0];
    HOME.featureId = feature ? feature.id : "";
    var hero = SKUS.filter(function(s){ return s.hero; })[0];
    HOME.hero = hero ? {
      id: hero.id,
      title: hero.heroTitle || hero.name,
      text: hero.heroText || hero.desc,
      cta: hero.heroCta || "Découvrir",
      image: hero.heroImage || hero.photoDataUrl || hero.photo || "",
      fit: hero.heroFit || "auto",
      focus: hero.heroFocus != null ? hero.heroFocus : 50
    } : null;
  }

  function collectHomeFields(){
    document.getElementById("tab-accueil").querySelectorAll("[data-home]").forEach(function(el){
      var parts = el.getAttribute("data-home").split(".");
      var target = HOME[parts[0]][+parts[1]];
      var key = parts[2];
      target[key] = key === "filter"
        ? el.value.split(",").map(function(x){ return x.trim(); }).filter(Boolean)
        : el.value.trim();
    });
    HOME.heroEyebrow = document.getElementById("h-eyebrow").value.trim();
    HOME.railTitle = document.getElementById("h-railtitle").value.trim();
    HOME.railSub = document.getElementById("h-railsub").value.trim();
  }

  function saveHome(){
    collectHome();
    if(persistDraft()){
      document.getElementById("homeSaved").textContent =
        "Enregistre dans le brouillon. Exporte pour publication pour que la boutique le reprenne.";
      toast("Page d'accueil enregistree");
    } else {
      document.getElementById("homeSaved").textContent =
        "Enregistrement impossible : le stockage du navigateur est plein ou bloque. Un visuel trop lourd en est souvent la cause.";
    }
  }

  /* ---------------- textes de la boutique ---------------- */
  /* Valeurs par defaut : les memes que DEFAULT_TEXTS de la boutique. On ne
     garde dans TEXTS que ce qui differe, pour qu'un texte d'origine corrige
     plus tard dans le code s'applique partout ou il n'a pas ete change. */
  var TEXT_FIELDS = [
    { group:"Bandeau et accueil", fields:[
      { k:"promo", label:"Bandeau sous le menu", where:"En haut de toutes les pages",
        def:"**Retrait gratuit** en main propre au club" },
      { k:"featuredTitle", label:"Titre du produit du moment", where:"Accueil, sous le hero",
        def:"Le produit du moment" },
      { k:"featuredSub", label:"Sous-titre du produit du moment", where:"Accueil, sous le hero",
        def:"Disponible à la commande, retrait au club house." }
    ]},
    { group:"Fiche produit", fields:[
      { k:"pdpDelivery", label:"Encadre sous le bouton Ajouter au panier", where:"Toutes les fiches", multi:true,
        def:"Commandes groupées, livraison en main propre uniquement. Contactez un membre du bureau pour connaître la prochaine date de livraison." },
      { k:"pdpPickup", label:"Onglet « Retrait »", where:"Toutes les fiches", multi:true,
        def:"Commandes groupées, livraison en main propre uniquement. Contactez un membre du bureau pour connaître la prochaine date de livraison." },
      { k:"pdpCare", label:"Onglet « Composition et entretien »", where:"Toutes les fiches", multi:true,
        def:"100 % polyester recyclé pour les hauts techniques, coton biologique pour les pièces en jersey. Lavage en machine à 30 degrés, ne pas utiliser de sèche-linge." }
    ]},
    { group:"Précommande", fields:[
      { k:"preorderIntro", label:"Texte au-dessus du champ e-mail", where:"Fiches en précommande", multi:true,
        def:"**Article en précommande.** Choisis ta taille et laisse ton e-mail : on te prévient dès que la commande groupée est lancée. Rien à payer pour l'instant." },
      { k:"preorderLegal", label:"Mention sous le bouton", where:"Fiches en précommande",
        def:"Ton e-mail ne sert qu'à te prévenir pour cet article." },
      { k:"preorderDone", label:"Message apres envoi", where:"Fiches en précommande ; {email} et {article} (nom, taille, couleur)", multi:true,
        def:"**C'est noté !** On te prévient à {email} dès que la commande groupée de ce {article} est lancée." }
    ]},
    { group:"Panier et commande", fields:[
      { k:"cartEmpty", label:"Panier vide", where:"Panier",
        def:"Ton panier est vide. Ajoute un article depuis la grille ou une fiche produit." },
      { k:"cartContact", label:"Au-dessus des coordonnees", where:"Panier, formulaire de commande",
        def:"Pour te recontacter au moment du retrait au club house." },
      { k:"cartPay", label:"Sous le bouton Commander et payer", where:"Panier, formulaire de commande",
        def:"Paiement sécurisé par carte sur la page Stripe, puis retrait au club house." },
      { k:"orderPaid", label:"Confirmation apres paiement", where:"Retour de Stripe ; {commande} = numero de commande", multi:true,
        def:"Merci ! Ta commande **{commande}** est enregistrée. Dès que Stripe confirme le paiement, tu reçois ton reçu par e-mail ; on te prévient quand elle est prête au club house." },
      { k:"orderUnpaid", label:"Confirmation sans paiement en ligne", where:"Si Stripe est coupe ; {commande} = numero de commande", multi:true,
        def:"Commande **{commande}** enregistrée, merci ! Elle sera à régler au retrait au club house ; on te recontacte." }
    ]},
    { group:"Pied de page", fields:[
      { k:"footerTagline", label:"Sous « Les Implacables »", where:"Pied de page",
        def:"Boutique officielle du club" },
      { k:"footerOrders", label:"Colonne « Commandes »", where:"Pied de page, une ligne par point", multi:true,
        def:"Retrait en main propre au club\nCommandes groupées par 20\nNi reprise ni échange" },
      { k:"footerLegal", label:"Mention tout en bas", where:"Pied de page",
        def:"© Les Implacables — commandes traitées par le bureau du club." },
      { k:"contactEmail", label:"Adresse du lien « Nous écrire »", where:"Pied de page",
        def:"contact@implacables.fr" }
    ]}
  ];
  var TEXTS = {};

  function escAttr(v){ return esc(v).replace(/"/g, "&quot;"); }
  function norm(v){ return String(v || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  /* Guides des tailles : memes valeurs par defaut que DEFAULT_GUIDES de la
     boutique (mesures fournisseur, sweat a capuche Cruiser 2.0 STSU177). */
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

  function guideTableText(g){
    var lines = [["Mesures en cm"].concat(g.sizes || [])].concat((g.rows || []).map(function(r){ return [r.label].concat(r.values || []); }));
    return lines.map(function(l){ return l.join(" | "); }).join("\n");
  }
  function parseGuideTable(text){
    var lines = text.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean)
      .map(function(l){ return l.split(/\t|\|/).map(function(c){ return c.trim(); }); });
    if(lines.length < 2) return null;
    var sizes = lines[0].slice(1).filter(Boolean);
    if(!sizes.length) return null;
    return { sizes:sizes, rows:lines.slice(1).map(function(l){ return { label:l[0], values:l.slice(1, sizes.length + 1) }; }) };
  }
  // memes regles que la boutique : guide choisi ou par defaut, et au moins une taille de l'article dedans
  function sizeKey(v){ return String(v).toUpperCase().replace(/\s+/g, "").replace("XXXXL", "4XL").replace("XXXL", "3XL"); }
  function guideUsers(g){
    var keys = (g.sizes || []).map(sizeKey);
    var ids = GUIDES.map(function(x){ return x.id; });
    return SKUS.filter(function(s){
      if(s.sizeGuide === "none") return false;
      var mine = s.sizeGuide && ids.indexOf(s.sizeGuide) !== -1 ? s.sizeGuide === g.id : !!g.def;
      return mine && (s.sizes || []).some(function(z){ return keys.indexOf(sizeKey(z)) !== -1; });
    }).length;
  }
  function renderGuides(){
    var host = document.getElementById("guideRows");
    if(!host) return;
    host.innerHTML = GUIDES.map(function(g, i){
      var n = guideUsers(g);
      return '<div class="guide-row" data-guide-i="'+i+'">' +
        '<label for="g-name-'+i+'">Nom du guide</label>' +
        '<input type="text" id="g-name-'+i+'" data-g="name" value="'+escAttr(g.name || "")+'" placeholder="Ex. T-shirt coupe droite">' +
        '<label for="g-table-'+i+'">Tableau des mesures</label>' +
        '<textarea id="g-table-'+i+'" class="guide-table" data-g="table" rows="'+((g.rows || []).length + 2)+'">'+esc(guideTableText(g))+'</textarea>' +
        '<label for="g-note-'+i+'">Conseils de mesure</label>' +
        '<textarea id="g-note-'+i+'" data-g="note" rows="3">'+esc(g.note || "")+'</textarea>' +
        '<div class="guide-foot"><label><input type="radio" name="guideDef" data-g="def"'+(g.def ? " checked" : "")+'> Guide par défaut</label>' +
          '<span>'+(n ? n + ' article' + (n > 1 ? 's' : '') + ' l\'affiche' + (n > 1 ? 'nt' : '') : 'Aucun article ne l\'affiche')+'</span>' +
          '<button type="button" class="text-default" data-guide-del="'+i+'">Supprimer ce guide</button></div>' +
      '</div>';
    }).join("") + (GUIDES.length
      ? '<div class="guide-foot" style="margin-top:16px"><label><input type="radio" name="guideDef" id="guideNoDef"'+(GUIDES.some(function(g){ return g.def; }) ? "" : " checked")+'> Pas de guide par défaut : seuls les articles qui ont un guide choisi l\'affichent</label></div>'
      : '<p class="home-hint">Aucun guide : le lien « Guide des tailles » est masqué partout.</p>');
  }
  function slugGuide(name, taken){
    var base = norm(name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "guide", id = base, k = 2;
    while(taken.indexOf(id) !== -1) id = base + "-" + (k++);
    return id;
  }
  // relit les guides saisis ; null si un tableau est illisible (le toast dit lequel)
  function collectGuides(){
    var rows = document.querySelectorAll("#guideRows .guide-row");
    if(!rows.length) return GUIDES.length ? GUIDES : [];
    var out = [], bad = null;
    rows.forEach(function(row){
      var i = +row.getAttribute("data-guide-i"), old = GUIDES[i] || {};
      var name = row.querySelector('[data-g="name"]').value.trim() || "Guide sans nom";
      var t = parseGuideTable(row.querySelector('[data-g="table"]').value);
      if(!t){ bad = bad || name; return; }
      var taken = out.map(function(g){ return g.id; });
      // un guide tout juste ajoute prend l'identifiant de son vrai nom
      var id = !old.id || (/^nouveau-guide/.test(old.id) && !SKUS.some(function(s){ return s.sizeGuide === old.id; }))
        ? slugGuide(name, taken) : old.id;
      out.push({ id:id, name:name,
        def:row.querySelector('[data-g="def"]').checked || undefined,
        sizes:t.sizes, rows:t.rows, note:row.querySelector('[data-g="note"]').value.trim() });
    });
    if(bad){ toast("Tableau illisible pour « " + bad + " » : une ligne de tailles puis une ligne par mesure"); return null; }
    return out;   // sans guide par defaut, seuls les articles qui en ont un choisi l'affichent
  }
  function fillGuideSelect(value){
    var sel = document.getElementById("f-guide");
    var def = GUIDES.filter(function(g){ return g.def; })[0];
    sel.innerHTML = '<option value="">'+(def ? 'Par défaut ('+esc(def.name)+')' : 'Aucun (pas de guide par défaut)')+'</option>' +
      GUIDES.filter(function(g){ return !g.def; }).map(function(g){ return '<option value="'+escAttr(g.id)+'">'+esc(g.name)+'</option>'; }).join("") +
      (def ? '<option value="none">Aucun guide</option>' : '');
    sel.value = value;
    if(sel.value !== value) sel.value = "";
  }
  function renderTextsTab(){
    document.getElementById("textCards").innerHTML = TEXT_FIELDS.map(function(g){
      return '<div class="home-card"><h2>'+esc(g.group)+'</h2>' + g.fields.map(function(f){
        var v = typeof TEXTS[f.k] === "string" ? TEXTS[f.k] : f.def;
        var rows = Math.min(6, Math.max(2, Math.ceil(v.length / 80) + (v.split("\n").length - 1)));
        var input = f.multi
          ? '<textarea id="t-'+f.k+'" data-text="'+f.k+'" rows="'+rows+'" placeholder="'+escAttr(f.def)+'">'+esc(v)+'</textarea>'
          : '<input type="text" id="t-'+f.k+'" data-text="'+f.k+'" value="'+escAttr(v)+'" placeholder="'+escAttr(f.def)+'">';
        return '<div class="text-field-head"><label for="t-'+f.k+'">'+esc(f.label)+'</label>' +
               '<button type="button" class="text-default" data-text-default="'+f.k+'">Texte d\'origine</button></div>' +
               input + '<p class="text-where">'+esc(f.where)+'</p>';
      }).join("") + '</div>';
    }).join("");
  }
  function collectTexts(){
    var out = {};
    TEXT_FIELDS.forEach(function(g){ g.fields.forEach(function(f){
      var el = document.getElementById("t-" + f.k);
      var v = el ? el.value.replace(/\r/g, "").trim() : (typeof TEXTS[f.k] === "string" ? TEXTS[f.k] : "");
      if(v && v !== f.def) out[f.k] = v;
    }); });
    return out;
  }
  function saveTexts(){
    var mail = document.getElementById("t-contactEmail");
    if(mail && mail.value.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail.value.trim())){
      toast("L'adresse de « Nous écrire » n'est pas une adresse e-mail"); mail.focus(); return;
    }
    var guides = collectGuides();
    if(!guides) return;
    TEXTS = collectTexts();
    GUIDES = guides;
    if(persistDraft()){
      document.getElementById("textsSaved").textContent = "Enregistre dans le brouillon. Clique sur Publier pour que la boutique les reprenne.";
      toast("Enregistre (pense a publier)");
      renderTextsTab();
      renderGuides();
    }
  }

  /* ---------------- publication ---------------- */
  function renderPublishNote(){
    var el = document.getElementById("publishNote");
    el.classList.toggle("draft", hasDraft);
    el.innerHTML = hasDraft
      ? '<span><b>Modifications non publiees.</b> Elles ne sont visibles que dans ce navigateur. ' +
        'Clique sur « Publier » pour les mettre en ligne sur la boutique.</span>' +
        '<button type="button" class="btn-ghost" id="dropDraftBtn">Abandonner le brouillon</button>'
      : '<span><b>Catalogue publie.</b> Ce que tu vois ici est ce que voit la boutique.</span>';
    var drop = document.getElementById("dropDraftBtn");
    if(drop) drop.addEventListener("click", function(){
      if(!confirm("Abandonner les modifications non publiees et recharger le catalogue publie ?")) return;
      try { localStorage.removeItem(DRAFT_KEY); } catch(e){}
      location.reload();
    });
  }

  function download(name, blob){
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* Un seul fichier : Chrome bloque les telechargements en rafale. Les images
     chargees ici restent en data URL dans le JSON ; la boutique sait les
     afficher telles quelles, et a l'integration dans le depot on les sort
     en fichiers assets/<id>.jpg pour alleger le catalogue. */
  function cataloguePayload(){
    collectHome();
    if(document.getElementById("t-promo")){ TEXTS = collectTexts(); var g = collectGuides(); if(g) GUIDES = g; }   // onglet ouvert : on prend ce qui est saisi
    var skus = SKUS.map(function(s){
      var o = JSON.parse(JSON.stringify(s));
      if(o.photoDataUrl){ o.photo = o.photoDataUrl; o.photos = undefined; }
      delete o.photoDataUrl;
      return o;
    });
    var home = JSON.parse(JSON.stringify(HOME));
    return JSON.stringify({ skus:skus, home:home, categories:TYPOLOGIES, universes:UNIVERSES, menu:MENU, icons:ICONS, texts:TEXTS, sizeGuides:GUIDES }, null, 2);
  }

  /* Secours : le meme contenu en fichier, a integrer a la main dans le depot
     (scripts/integrer-catalogue.py). */
  function exportCatalogue(){
    download("catalogue.json", new Blob([cataloguePayload()], { type:"application/json" }));
    toast("catalogue.json telecharge");
  }

  /* Publication directe : l'API du serveur (derriere le meme identifiant que
     ce backoffice) integre le catalogue et ses images ; la boutique le sert
     aussitot. Le brouillon local n'a alors plus lieu d'etre. */
  function publishCatalogue(){
    var btn = document.getElementById("publishBtn");
    if(!confirm("Publier le catalogue ? La boutique en ligne sera mise a jour immediatement.")) return;
    btn.disabled = true;
    btn.textContent = "Publication…";
    fetch("../api/publier", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      credentials:"same-origin",
      body:cataloguePayload()
    })
      .then(function(r){
        return r.json().catch(function(){ return { ok:false, erreur:"Reponse inattendue du serveur (" + r.status + ")" }; });
      })
      .then(function(res){
        if(!res.ok) throw new Error(res.erreur || "Echec de la publication");
        try { localStorage.removeItem(DRAFT_KEY); } catch(e){}
        toast("Publie : " + res.articles + " articles en ligne");
        setTimeout(function(){ location.reload(); }, 1200);
      })
      .catch(function(err){
        btn.disabled = false;
        btn.textContent = "Publier";
        var el = document.getElementById("publishNote");
        el.classList.add("error");
        el.innerHTML = '<span><b>Publication impossible.</b> ' + esc(err.message) +
          '. Tes modifications sont toujours dans le brouillon ; en secours, « Exporter » te donne le fichier.</span>';
      });
  }


  /* ---------------- wiring ---------------- */
  fillTypSelect();

  function readDraft(){
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if(d && Array.isArray(d.skus) && d.skus.length) return d;
    } catch(e){}
    return null;
  }
  function applyStructure(src){
    if(src && Array.isArray(src.categories) && src.categories.length) TYPOLOGIES = src.categories;
    if(src && Array.isArray(src.menu)) MENU = src.menu;
    if(src && Array.isArray(src.universes) && src.universes.length) UNIVERSES = src.universes;
    if(src && Array.isArray(src.icons) && src.icons.length){ ICONS = src.icons; installIcons(ICONS); }
    if(src && src.texts && typeof src.texts === "object") TEXTS = src.texts;
    if(src && Array.isArray(src.sizeGuides)) GUIDES = src.sizeGuides;
  }
  var draft = readDraft();
  hasDraft = !!draft;
  if(draft){ SKUS = draft.skus; applyHome(draft.home); }
  /* Le catalogue publie est toujours lu : un brouillon d'avant l'onglet
     Categories et menu n'en a pas, il les reprend alors de la version en ligne. */
  var loading = fetch(BOUTIQUE_BASE + "catalogue.json", { cache:"no-cache" })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if(data && !draft){
          if(Array.isArray(data.skus) && data.skus.length) SKUS = data.skus;
          applyHome(data.home);
        }
        applyStructure(data);
        if(draft && draft.categories) applyStructure(draft);   // (sans "texts", il garde ceux en ligne)
      })
      .catch(function(){ if(draft) applyStructure(draft); });
  loading.then(function(){
    fillTypSelect();
    fillUnivSelect();
    fillUnivFilter();
    renderPublishNote();
    renderSidebar();
    renderTable();
    if(state.tab === "accueil") renderHomeTab();
    if(state.tab === "categories"){ renderPictos(); renderUnivTab(); renderCatsTab(); renderMenuTab(); }
  });

  document.getElementById("exportBtn").addEventListener("click", exportCatalogue);
  document.getElementById("publishBtn").addEventListener("click", publishCatalogue);

  document.querySelectorAll(".bo-tab").forEach(function(b){
    b.addEventListener("click", function(){ switchTab(b.getAttribute("data-tab")); });
  });

  document.getElementById("searchInput").addEventListener("input", function(e){
    state.search = e.target.value;
    renderTable();
  });

  document.getElementById("newSkuBtn").addEventListener("click", function(){ openPanel(null); });
  document.getElementById("univFilter").addEventListener("change", function(){ state.activeUniv = this.value; renderTable(); });
  document.getElementById("panelClose").addEventListener("click", closePanel);
  document.getElementById("panelOverlay").addEventListener("click", closePanel);

  document.getElementById("f-typ").addEventListener("change", function(){
    panelSizes = [];
    renderSizeGrid();
  });
  document.getElementById("f-univ").addEventListener("change", function(){
    panelSizes = [];
    renderSizeGrid();
  });

  document.getElementById("addColorBtn").addEventListener("click", function(){
    var nameInput = document.getElementById("f-color-name");
    var hexInput = document.getElementById("f-color-hex");
    var name = nameInput.value.trim();
    if(!name){ toast("Nomme la couleur avant de l'ajouter"); return; }
    panelColors.push({ n:name, h:hexInput.value });
    nameInput.value = "";
    renderColorChips();
  });

  document.getElementById("statusToggle").addEventListener("click", function(e){
    var btn = e.target.closest("button[data-status]");
    if(btn) setPanelStatus(btn.getAttribute("data-status"));
  });

  document.getElementById("f-photo").addEventListener("change", function(e){
    var files = Array.prototype.slice.call(e.target.files || []);
    e.target.value = "";   // pour pouvoir rechoisir le meme fichier
    // dans l'ordre de selection, meme si les lectures finissent en desordre
    var slots = files.map(function(){ return null; }), left = files.length;
    files.forEach(function(file, i){
      shrinkImage(file, 1200, function(dataUrl){
        slots[i] = dataUrl;
        if(--left === 0){ panelPhotos = panelPhotos.concat(slots); updatePhotoPreview(); }
      });
    });
  });

  document.getElementById("skuForm").addEventListener("submit", saveSku);
  document.getElementById("saveSkuBtn").addEventListener("click", saveSku);
  document.getElementById("deleteSkuBtn").addEventListener("click", function(){
    if(state.editingId){ closePanel(); deleteSku(state.editingId); }
  });

  document.getElementById("thresholdInput").addEventListener("change", function(e){
    var v = parseInt(e.target.value,10);
    state.threshold = (isNaN(v) || v<1) ? 1 : v;
    renderOrders();
  });

  document.getElementById("sheetSyncBtn").addEventListener("click", function(){
    var btn = this;
    btn.disabled = true; btn.textContent = "Envoi…";
    fetch("../api/sheet-sync", { method:"POST", credentials:"same-origin" })
      .then(function(r){ return r.json(); })
      .then(function(res){
        toast(res.ok ? res.commandes + " commande(s) envoyee(s) au Sheet" : "Echec : " + (res.erreur || "Google Sheet injoignable"));
      })
      .catch(function(){ toast("Echec : serveur injoignable"); })
      .then(function(){ btn.disabled = false; btn.textContent = "Renvoyer toutes les commandes"; });
  });

  document.getElementById("restockBtn").addEventListener("click", function(){
    state.lastRestock = new Date().toISOString().slice(0,10);
    renderOrders();
    toast("Commande fournisseur enregistree, compteur remis a zero");
  });

  document.getElementById("homeSave").addEventListener("click", saveHome);
  document.getElementById("textsSave").addEventListener("click", saveTexts);
  document.getElementById("guideAdd").addEventListener("click", function(){
    var cur = collectGuides(); if(!cur) return;
    GUIDES = cur.concat([{ id:slugGuide("Nouveau guide", cur.map(function(g){ return g.id; })), name:"Nouveau guide",
      sizes:["S","M","L","XL"], rows:[{ label:"A — Demi-tour de poitrine", values:["","","",""] }], note:"" }]);
    renderGuides();
  });
  document.getElementById("guideRows").addEventListener("click", function(e){
    var b = e.target.closest("[data-guide-del]");
    if(!b) return;
    var cur = collectGuides(); if(!cur) return;
    var g = cur[+b.getAttribute("data-guide-del")];
    if(!confirm("Supprimer le guide « " + g.name + " » ? Les articles qui l'utilisaient reprendront le guide par défaut.")) return;
    GUIDES = cur.filter(function(x){ return x !== g; });
    renderGuides();
  });
  document.getElementById("textCards").addEventListener("click", function(e){
    var b = e.target.closest("[data-text-default]");
    if(!b) return;
    var k = b.getAttribute("data-text-default");
    var f = [].concat.apply([], TEXT_FIELDS.map(function(g){ return g.fields; })).filter(function(x){ return x.k === k; })[0];
    document.getElementById("t-" + k).value = f.def;
  });
  document.getElementById("homeReset").addEventListener("click", function(){
    HOME = JSON.parse(JSON.stringify(HOME_DEFAULT));
    renderHomeTab();
    saveHome();
  });

  document.getElementById("f-hero-focus").addEventListener("input", function(){
    document.getElementById("heroFocusVal").textContent = this.value + " %";
  });
  document.getElementById("f-hero").addEventListener("change", function(){
    document.getElementById("heroFields").hidden = !this.checked;
  });
  document.getElementById("heroDrop").addEventListener("click", function(){
    document.getElementById("f-hero-photo").click();
  });
  document.getElementById("f-hero-photo").addEventListener("change", function(e){
    var f = e.target.files[0];
    if(!f) return;
    shrinkImage(f, 1600, function(dataUrl){
      state.heroDataUrl = dataUrl;
      updateHeroPreview();
      toast("Visuel du hero charge");
    });
  });

  document.addEventListener("keydown", function(e){
    if(e.key==="Escape" && !document.getElementById("skuPanel").hidden) closePanel();
    if(e.key==="Escape") closeImport();
  });
})();
