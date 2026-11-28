// ============================================================================
// MÓDULO PIZARRA INTERACTIVA DE TEXTOS Y VERSÍCULOS (INTEGRADO EN MESA DE TRABAJO)
// Incluye: 9 Biblias locales (biblias/), PDF/MD/TXT offline (js/), Capa 1
// (14 estilos por palabra), Capa 2 (Canvas 12 herramientas), sesiones .json,
// exportación PNG 1:1 y puente directo hacia Fraseo (DIALS) y Asistente IA.
// ============================================================================
(function () {
    'use strict';

    // Paleta base (sincronizable con Configuración > Colores Analíticos)
    const DEFAULT_COLORS = [
        { id: 'white', hex: '#ffffff', name: 'Blanco (Pizarra)' },
        { id: 'sustantivo', hex: '#ef4444', name: 'Rojo — Sustantivos' },
        { id: 'verbo', hex: '#22c55e', name: 'Verde — Verbos' },
        { id: 'pronombre', hex: '#a855f7', name: 'Morado — Pronombres' },
        { id: 'determinante', hex: '#f97316', name: 'Naranja — Determinantes / Artículos' },
        { id: 'genitivo', hex: '#3b82f6', name: 'Azul — Genitivos' },
        { id: 'preposicion', hex: '#f5b922', name: 'Amarillo — Preposiciones' },
        { id: 'adjetivo', hex: '#ec4899', name: 'Rosado — Adjetivos' },
        { id: 'adverbio', hex: '#94a3b8', name: 'Gris — Adverbios / Conjunciones' },
        { id: 'secundario', hex: '#c084fc', name: 'Lila — Secundarios' }
    ];

    function getActivePalette() {
        let savedCustom = null;
        try { savedCustom = JSON.parse(localStorage.getItem('exegesisColorConfig') || 'null'); } catch (e) {}
        if (!savedCustom) return DEFAULT_COLORS;
        return DEFAULT_COLORS.map(c => {
            if (c.id !== 'white' && savedCustom[c.id]) {
                return { id: c.id, hex: savedCustom[c.id], name: c.name };
            }
            return c;
        });
    }

    // Catálogo de 9 Biblias locales en ./Pizarra/biblias/
    const BIBLES_CATALOG = {
        NBLA:    { slug: 'nbla',    label: 'NUEVA BIBLIA DE LAS AMÉRICAS (NBLA)' },
        LBLA:    { slug: 'lbla',    label: 'LA BIBLIA DE LAS AMÉRICAS (LBLA)' },
        RVR1960: { slug: 'rvr1960', label: 'REINA-VALERA 1960 (RVR1960)' },
        NVI:     { slug: 'nvi',     label: 'NUEVA VERSIÓN INTERNACIONAL (NVI)' },
        NTV:     { slug: 'ntv',     label: 'NUEVA TRADUCCIÓN VIVIENTE (NTV)' },
        RVC:     { slug: 'rvc',     label: 'REINA VALERA CONTEMPORÁNEA (RVC)' },
        DHH94I:  { slug: 'dhh94i',  label: 'DIOS HABLA HOY (DHH94I)' },
        DHHS94:  { slug: 'dhhs94',  label: 'DIOS HABLA HOY ESTÁNDAR (DHHS94)' },
        TLAI:    { slug: 'tlai',    label: 'TRADUCCIÓN EN LENGUAJE ACTUAL (TLAI)' }
    };

    function stripAccents(s) {
        return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    const BOOK_CATALOG = [
        { id:'genesis', display:'Génesis', testament:'AT', abbrev:'Gn', jsonKeys:['genesis'], aliases:['genesis','gen','gn','ge'] },
        { id:'exodo', display:'Éxodo', testament:'AT', abbrev:'Ex', jsonKeys:['exodo'], aliases:['exodo','exodus','exod','exo','ex'] },
        { id:'levitico', display:'Levítico', testament:'AT', abbrev:'Lv', jsonKeys:['levitico'], aliases:['levitico','leviticus','lev','lv','le'] },
        { id:'numeros', display:'Números', testament:'AT', abbrev:'Nm', jsonKeys:['numeros'], aliases:['numeros','numbers','num','nm','nu','nb'] },
        { id:'deuteronomio', display:'Deuteronomio', testament:'AT', abbrev:'Dt', jsonKeys:['deuteronomio'], aliases:['deuteronomio','deuteronomy','deut','deu','dt'] },
        { id:'josue', display:'Josué', testament:'AT', abbrev:'Jos', jsonKeys:['josue'], aliases:['josue','joshua','josh','jos','jsh'] },
        { id:'jueces', display:'Jueces', testament:'AT', abbrev:'Jue', jsonKeys:['jueces'], aliases:['jueces','judges','judg','jdg','jg','jue','jc','jz'] },
        { id:'rut', display:'Rut', testament:'AT', abbrev:'Rt', jsonKeys:['rut'], aliases:['rut','ruth','rth','ru','rt'] },
        { id:'1 samuel', display:'1 Samuel', testament:'AT', abbrev:'1S', jsonKeys:['1 samuel'], aliases:['1 samuel','1samuel','1 sam','1sam','1 sa','1sa','1 sm','1sm','1 s','1s'] },
        { id:'2 samuel', display:'2 Samuel', testament:'AT', abbrev:'2S', jsonKeys:['2 samuel'], aliases:['2 samuel','2samuel','2 sam','2sam','2 sa','2sa','2 sm','2sm','2 s','2s'] },
        { id:'1 reyes', display:'1 Reyes', testament:'AT', abbrev:'1R', jsonKeys:['1 reyes'], aliases:['1 reyes','1reyes','1 rey','1rey','1 re','1re','1 r','1r','1 kings','1kings','1 kgs','1kgs','1 ki','1ki','1 k','1k'] },
        { id:'2 reyes', display:'2 Reyes', testament:'AT', abbrev:'2R', jsonKeys:['2 reyes'], aliases:['2 reyes','2reyes','2 rey','2rey','2 re','2re','2 r','2r','2 kings','2kings','2 kgs','2kgs','2 ki','2ki','2 k','2k'] },
        { id:'1 cronicas', display:'1 Crónicas', testament:'AT', abbrev:'1Cr', jsonKeys:['1 cronicas'], aliases:['1 cronicas','1cronicas','1 cron','1cron','1 cro','1cro','1 cr','1cr','1 chronicles','1chronicles','1 chron','1chron','1 chr','1chr','1 ch','1ch'] },
        { id:'2 cronicas', display:'2 Crónicas', testament:'AT', abbrev:'2Cr', jsonKeys:['2 cronicas'], aliases:['2 cronicas','2cronicas','2 cron','2cron','2 cro','2cro','2 cr','2cr','2 chronicles','2chronicles','2 chron','2chron','2 chr','2chr','2 ch','2ch'] },
        { id:'esdras', display:'Esdras', testament:'AT', abbrev:'Esd', jsonKeys:['esdras'], aliases:['esdras','esd','ezra','ezr'] },
        { id:'nehemias', display:'Nehemías', testament:'AT', abbrev:'Neh', jsonKeys:['nehemias'], aliases:['nehemias','nehemiah','neh','ne'] },
        { id:'ester', display:'Ester', testament:'AT', abbrev:'Est', jsonKeys:['ester'], aliases:['ester','esther','esth','est','es'] },
        { id:'job', display:'Job', testament:'AT', abbrev:'Job', jsonKeys:['job'], aliases:['job','jb'] },
        { id:'salmos', display:'Salmos', testament:'AT', abbrev:'Sal', jsonKeys:['salmos','salmo'], aliases:['salmos','salmo','sal','sl','psalms','psalm','psa','psm','pss','ps'] },
        { id:'proverbios', display:'Proverbios', testament:'AT', abbrev:'Pr', jsonKeys:['proverbios'], aliases:['proverbios','proverbs','prov','pro','prv','pr'] },
        { id:'eclesiastes', display:'Eclesiastés', testament:'AT', abbrev:'Ec', jsonKeys:['eclesiastes'], aliases:['eclesiastes','ecclesiastes','eccl','ecc','ecl','ec','qoh'] },
        { id:'cantares', display:'Cantares', testament:'AT', abbrev:'Cnt', jsonKeys:['cantares','cantar de los cantares'], aliases:['cantares','cantar de los cantares','cantar','cant','cnt','ct','song of solomon','song of songs','song of sol','song','sos','sng','sg','ss','canticles'] },
        { id:'isaias', display:'Isaías', testament:'AT', abbrev:'Is', jsonKeys:['isaias'], aliases:['isaias','isaiah','isa','is'] },
        { id:'jeremias', display:'Jeremías', testament:'AT', abbrev:'Jer', jsonKeys:['jeremias'], aliases:['jeremias','jeremiah','jer','jr','je'] },
        { id:'lamentaciones', display:'Lamentaciones', testament:'AT', abbrev:'Lm', jsonKeys:['lamentaciones'], aliases:['lamentaciones','lamentations','lam','lm','la'] },
        { id:'ezequiel', display:'Ezequiel', testament:'AT', abbrev:'Ez', jsonKeys:['ezequiel'], aliases:['ezequiel','ezekiel','ezek','eze','ezk','ez'] },
        { id:'daniel', display:'Daniel', testament:'AT', abbrev:'Dn', jsonKeys:['daniel'], aliases:['daniel','dan','dn','da'] },
        { id:'oseas', display:'Oseas', testament:'AT', abbrev:'Os', jsonKeys:['oseas'], aliases:['oseas','hosea','hos','os','ho'] },
        { id:'joel', display:'Joel', testament:'AT', abbrev:'Jl', jsonKeys:['joel'], aliases:['joel','jl','joe'] },
        { id:'amos', display:'Amós', testament:'AT', abbrev:'Am', jsonKeys:['amos'], aliases:['amos','am'] },
        { id:'abdias', display:'Abdías', testament:'AT', abbrev:'Abd', jsonKeys:['abdias'], singleChapter:true, aliases:['abdias','abd','ab','obadiah','obad','oba','ob'] },
        { id:'jonas', display:'Jonás', testament:'AT', abbrev:'Jon', jsonKeys:['jonas'], aliases:['jonas','jonah','jon','jnh'] },
        { id:'miqueas', display:'Miqueas', testament:'AT', abbrev:'Mi', jsonKeys:['miqueas'], aliases:['miqueas','micah','mic','miq','mi'] },
        { id:'nahum', display:'Nahúm', testament:'AT', abbrev:'Nah', jsonKeys:['nahum'], aliases:['nahum','nah','na','nam'] },
        { id:'habacuc', display:'Habacuc', testament:'AT', abbrev:'Hab', jsonKeys:['habacuc'], aliases:['habacuc','habakkuk','hab','hb'] },
        { id:'sofonias', display:'Sofonías', testament:'AT', abbrev:'Sof', jsonKeys:['sofonias'], aliases:['sofonias','sof','zephaniah','zeph','zep','zp'] },
        { id:'hageo', display:'Hageo', testament:'AT', abbrev:'Ha', jsonKeys:['hageo'], aliases:['hageo','hag','hg','ag','ageo','haggai'] },
        { id:'zacarias', display:'Zacarías', testament:'AT', abbrev:'Zac', jsonKeys:['zacarias'], aliases:['zacarias','zac','zc','zechariah','zech','zec'] },
        { id:'malaquias', display:'Malaquías', testament:'AT', abbrev:'Mal', jsonKeys:['malaquias'], aliases:['malaquias','malachi','mal','ml'] },
        { id:'mateo', display:'Mateo', testament:'NT', abbrev:'Mt', jsonKeys:['mateo','s. mateo','san mateo'], aliases:['mateo','s mateo','san mateo','mat','mt','matthew','matt'] },
        { id:'marcos', display:'Marcos', testament:'NT', abbrev:'Mr', jsonKeys:['marcos','s. marcos','san marcos'], aliases:['marcos','s marcos','san marcos','mar','mc','mr','mark','mrk','mk'] },
        { id:'lucas', display:'Lucas', testament:'NT', abbrev:'Lc', jsonKeys:['lucas','s. lucas','san lucas'], aliases:['lucas','s lucas','san lucas','luc','lc','luke','luk','lk'] },
        { id:'juan', display:'Juan', testament:'NT', abbrev:'Jn', jsonKeys:['juan','s. juan','san juan'], aliases:['juan','s juan','san juan','jn','john','joh','jhn'] },
        { id:'hechos', display:'Hechos', testament:'NT', abbrev:'Hch', jsonKeys:['hechos','hechos de los apostoles'], aliases:['hechos','hechos de los apostoles','hch','hchos','hech','hc','acts','act','ac'] },
        { id:'romanos', display:'Romanos', testament:'NT', abbrev:'Ro', jsonKeys:['romanos'], aliases:['romanos','romans','rom','ro','rm'] },
        { id:'1 corintios', display:'1 Corintios', testament:'NT', abbrev:'1Co', jsonKeys:['1 corintios'], aliases:['1 corintios','1corintios','1 cor','1cor','1 co','1co','1 corinthians','1corinthians'] },
        { id:'2 corintios', display:'2 Corintios', testament:'NT', abbrev:'2Co', jsonKeys:['2 corintios'], aliases:['2 corintios','2corintios','2 cor','2cor','2 co','2co','2 corinthians','2corinthians'] },
        { id:'galatas', display:'Gálatas', testament:'NT', abbrev:'Ga', jsonKeys:['galatas'], aliases:['galatas','galatians','gal','ga','gl'] },
        { id:'efesios', display:'Efesios', testament:'NT', abbrev:'Ef', jsonKeys:['efesios'], aliases:['efesios','ef','efe','ephesians','eph','ep'] },
        { id:'filipenses', display:'Filipenses', testament:'NT', abbrev:'Fil', jsonKeys:['filipenses'], aliases:['filipenses','fil','flp','philippians','phil','php','ph'] },
        { id:'colosenses', display:'Colosenses', testament:'NT', abbrev:'Col', jsonKeys:['colosenses'], aliases:['colosenses','colossians','col'] },
        { id:'1 tesalonicenses', display:'1 Tesalonicenses', testament:'NT', abbrev:'1Ts', jsonKeys:['1 tesalonicenses'], aliases:['1 tesalonicenses','1tesalonicenses','1 tes','1tes','1 ts','1ts','1 thessalonians','1thessalonians','1 thess','1thess','1 thes','1thes','1 th','1th'] },
        { id:'2 tesalonicenses', display:'2 Tesalonicenses', testament:'NT', abbrev:'2Ts', jsonKeys:['2 tesalonicenses'], aliases:['2 tesalonicenses','2tesalonicenses','2 tes','2tes','2 ts','2ts','2 thessalonians','2thessalonians','2 thess','2thess','2 thes','2thes','2 th','2th'] },
        { id:'1 timoteo', display:'1 Timoteo', testament:'NT', abbrev:'1Ti', jsonKeys:['1 timoteo'], aliases:['1 timoteo','1timoteo','1 tim','1tim','1 ti','1ti','1 tm','1tm','1 timothy','1timothy'] },
        { id:'2 timoteo', display:'2 Timoteo', testament:'NT', abbrev:'2Ti', jsonKeys:['2 timoteo'], aliases:['2 timoteo','2timoteo','2 tim','2tim','2 ti','2ti','2 tm','2tm','2 timothy','2timothy'] },
        { id:'tito', display:'Tito', testament:'NT', abbrev:'Tit', jsonKeys:['tito'], aliases:['tito','tit','ti','titus'] },
        { id:'filemon', display:'Filemón', testament:'NT', abbrev:'Flm', jsonKeys:['filemon'], singleChapter:true, aliases:['filemon','flm','film','philemon','phlm','phm','pm'] },
        { id:'hebreos', display:'Hebreos', testament:'NT', abbrev:'He', jsonKeys:['hebreos'], aliases:['hebreos','hebrews','heb','he'] },
        { id:'santiago', display:'Santiago', testament:'NT', abbrev:'Stg', jsonKeys:['santiago'], aliases:['santiago','stg','sant','snt','james','jas','jam','jm'] },
        { id:'1 pedro', display:'1 Pedro', testament:'NT', abbrev:'1P', jsonKeys:['1 pedro'], aliases:['1 pedro','1pedro','1 ped','1ped','1 pe','1pe','1 p','1p','1 peter','1peter','1 pet','1pet','1 pt','1pt'] },
        { id:'2 pedro', display:'2 Pedro', testament:'NT', abbrev:'2P', jsonKeys:['2 pedro'], aliases:['2 pedro','2pedro','2 ped','2ped','2 pe','2pe','2 p','2p','2 peter','2peter','2 pet','2pet','2 pt','2pt'] },
        { id:'1 juan', display:'1 Juan', testament:'NT', abbrev:'1Jn', jsonKeys:['1 juan'], aliases:['1 juan','1juan','1 jn','1jn','1 john','1john','1 joh','1joh','1 jhn','1jhn'] },
        { id:'2 juan', display:'2 Juan', testament:'NT', abbrev:'2Jn', jsonKeys:['2 juan'], singleChapter:true, aliases:['2 juan','2juan','2 jn','2jn','2 john','2john','2 joh','2joh','2 jhn','2jhn'] },
        { id:'3 juan', display:'3 Juan', testament:'NT', abbrev:'3Jn', jsonKeys:['3 juan'], singleChapter:true, aliases:['3 juan','3juan','3 jn','3jn','3 john','3john','3 joh','3joh','3 jhn','3jhn'] },
        { id:'judas', display:'Judas', testament:'NT', abbrev:'Jud', jsonKeys:['judas'], singleChapter:true, aliases:['judas','jud','jd','jude'] },
        { id:'apocalipsis', display:'Apocalipsis', testament:'NT', abbrev:'Ap', jsonKeys:['apocalipsis'], aliases:['apocalipsis','apoc','ap','apo','revelation','rev','re','rv'] }
    ];

    const BOOK_ALIAS_MAP = {};
    const BOOK_BY_ID = {};
    BOOK_CATALOG.forEach(b => {
        BOOK_BY_ID[b.id] = b;
        b.aliases.forEach(a => { BOOK_ALIAS_MAP[a] = b; });
    });

    function resolveBookEntry(rawBook) {
        let n = stripAccents(rawBook).toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
        n = n.replace(/^iii\s+/, '3 ').replace(/^ii\s+/, '2 ').replace(/^i\s+/, '1 ');
        n = n.replace(/^([1-3])(?:a|ª|o|º|ra|da|er|st|nd|rd)\s+(?:de\s+)?/, '$1 ');
        n = n.replace(/^([1-3])\s+de\s+/, '$1 ');
        if (BOOK_ALIAS_MAP[n]) return BOOK_ALIAS_MAP[n];
        const noSp = n.replace(/^([1-3])\s+/, '$1');
        if (BOOK_ALIAS_MAP[noSp]) return BOOK_ALIAS_MAP[noSp];
        return null;
    }

    function normalizeBibleData(raw) {
        const map = {};
        if (!raw || typeof raw !== 'object') return map;

        if (Array.isArray(raw.books)) {
            for (const b of raw.books) {
                const bName = stripAccents(b.human || b.name || '').toLowerCase().replace(/\s+/g, ' ').trim();
                if (!bName) continue;
                for (const ch of (b.chapters || [])) {
                    const usfm = ch.usfm || '';
                    let mCh = usfm.match(/\.(\d+)$/);
                    if (!mCh) mCh = String(ch.human || '').match(/(\d+)$/);
                    if (!mCh) continue;
                    const chNum = mCh[1];
                    for (const item of (ch.items || [])) {
                        if (item.type !== 'verse') continue;
                        const vnums = item.verse_numbers || [];
                        const lines = item.lines || [];
                        if (!vnums.length || !lines.length) continue;
                        const text = lines.map(l => String(l || '').trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
                        if (!text) continue;
                        const k1 = `${bName} ${chNum}:${vnums[0]}`;
                        map[k1] = map[k1] ? (map[k1] + ' ' + text) : text;
                        if (vnums.length > 1) {
                            const kr = `${bName} ${chNum}:${vnums[0]}-${vnums[vnums.length - 1]}`;
                            map[kr] = map[kr] ? (map[kr] + ' ' + text) : text;
                        }
                    }
                }
            }
            return map;
        }

        Object.keys(raw).forEach(k => {
            if (typeof raw[k] === 'string') {
                map[stripAccents(k).toLowerCase().replace(/\s+/g, ' ').trim()] = raw[k];
            }
        });
        return map;
    }

    const bibleCache = {};
    const bibleLoadingPromises = {};
    let localBibleMap = null;
    let statusCallback = null;

    async function ensureBibleLoaded(verKey) {
        if (verKey === 'LOCAL' && bibleCache['LOCAL']) {
            localBibleMap = bibleCache['LOCAL'];
            if (statusCallback) statusCallback(`✅ Biblia Local (${Object.keys(localBibleMap).length.toLocaleString()} vers.)`, 'ok');
            return localBibleMap;
        }
        const entry = BIBLES_CATALOG[verKey];
        if (!entry) return localBibleMap;
        if (bibleCache[verKey]) {
            localBibleMap = bibleCache[verKey];
            if (statusCallback) statusCallback(`✅ ${verKey} lista (${Object.keys(localBibleMap).length.toLocaleString()} vers.)`, 'ok');
            return localBibleMap;
        }
        if (bibleLoadingPromises[verKey]) {
            return await bibleLoadingPromises[verKey];
        }

        if (statusCallback) statusCallback(`⏳ Cargando ${verKey}...`, '');
        const slug = entry.slug;
        const upper = slug.toUpperCase();
        const candidates = [
            `./biblias/${slug}.json`,
            `./biblias/${upper}.json`,
            `./Biblias/${slug}.json`,
            `./Pizarra/biblias/${slug}.json`,
            `./Pizarra/biblias/${upper}.json`
        ];

        bibleLoadingPromises[verKey] = (async () => {
            let lastErr = '';
            for (const url of candidates) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        lastErr = `HTTP ${res.status}`;
                        continue;
                    }
                    const raw = await res.json();
                    const map = normalizeBibleData(raw);
                    if (Object.keys(map).length === 0) {
                        lastErr = 'JSON vacío o formato desconocido';
                        continue;
                    }
                    bibleCache[verKey] = map;
                    localBibleMap = map;
                    if (statusCallback) statusCallback(`✅ ${verKey} lista (${Object.keys(map).length.toLocaleString()} vers.)`, 'ok');
                    return map;
                } catch (err) {
                    lastErr = err && err.message ? err.message : 'Error de red';
                }
            }
            localBibleMap = null;
            const isFileProto = location.protocol === 'file:';
            if (statusCallback) {
                statusCallback(
                    isFileProto
                        ? '⚠️ Modo archivo local: usa 📚 Biblia Local (.json) o servidor local'
                        : `⚠️ No se encontró biblias/${slug}.json (${lastErr})`,
                    'warn'
                );
            }
            return null;
        })();

        try {
            return await bibleLoadingPromises[verKey];
        } finally {
            delete bibleLoadingPromises[verKey];
        }
    }

    function lookupBiblePassage(bibleMap, book, chapter, vStart, vEnd) {
        if (!bibleMap || !book) return '';
        const keys = book.jsonKeys || [book.id];

        for (const bk of keys) {
            if (vEnd > vStart) {
                const exactRange = bibleMap[`${bk} ${chapter}:${vStart}-${vEnd}`];
                if (exactRange) return `${vStart} ${exactRange}`;

                const parts = [];
                let lastText = '';
                for (let v = vStart; v <= vEnd; v++) {
                    const txt = bibleMap[`${bk} ${chapter}:${v}`];
                    if (txt && txt !== lastText) {
                        parts.push(`${v} ${txt}`);
                        lastText = txt;
                    }
                }
                if (parts.length > 0) return parts.join('\n');
            } else {
                const single = bibleMap[`${bk} ${chapter}:${vStart}`];
                if (single) return single;
            }
        }
        return '';
    }

    function lookupBibleVersesArray(bibleMap, book, chapter, vStart, vEnd) {
        if (!bibleMap || !book) return [];
        const keys = book.jsonKeys || [book.id];
        for (const bk of keys) {
            const out = [];
            let lastText = '';
            for (let v = vStart; v <= vEnd; v++) {
                const txt = bibleMap[`${bk} ${chapter}:${v}`];
                if (txt && txt !== lastText) {
                    out.push({ verse: v, text: txt });
                    lastText = txt;
                }
            }
            if (out.length > 0) return out;
            if (vEnd > vStart) {
                const exactRange = bibleMap[`${bk} ${chapter}:${vStart}-${vEnd}`];
                if (exactRange) return [{ verse: vStart, text: exactRange }];
            }
        }
        return [];
    }

    // Exponer motor compartido de 9 Biblias para Fraseo (DIALS) y otros módulos
    window.ExegesisBibleStore = {
        BIBLES_CATALOG,
        ensureBibleLoaded,
        resolveBookEntry,
        async getVersesForPassage(verKey, bookName, chapter, vStart, vEnd) {
            const book = resolveBookEntry(bookName);
            if (!book) return [];
            const map = await ensureBibleLoaded(verKey || 'LBLA');
            if (!map) return [];
            return lookupBibleVersesArray(map, book, chapter, vStart, vEnd);
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('pzRoot');
        const boardOverlay = document.getElementById('pzBoardOverlay');
        if (!root || !boardOverlay) return;

        let verses = [];
        let activeIndex = -1;
        let currentTool = 'pen';
        let currentWordStyle = 'highlight';
        let currentColor = '#f5b922';
        let currentWidth = 5;
        let currentHighlightAlpha = Math.min(0.9, Math.max(0.1, (parseInt(localStorage.getItem('pizarra_hl_alpha') || '35', 10) || 35) / 100));
        let currentFontSize = 38;
        const THEMES = [
            { cls: 'theme-black', label: '🌑 Pizarra' },
            { cls: 'theme-slate', label: '🌌 Oscuro' },
            { cls: 'theme-light', label: '📄 Claro' }
        ];
        let themeIdx = parseInt(localStorage.getItem('pizarra_theme_idx') || '0', 10);
        if (isNaN(themeIdx) || themeIdx < 0 || themeIdx >= THEMES.length) themeIdx = 0;
        let lastDrawTool = 'pen';

        let autoHideEnabled = true;
        let manualHidden = false;
        let hideTimer = null;

        let undoStack = [];
        let redoStack = [];
        let isDrawing = false;
        let startX = 0, startY = 0;
        let snapshotImageData = null;

        // Referencias DOM prefijadas (0 colisiones con index.html)
        const verseListEl = document.getElementById('pzVerseList');
        const verseCountEl = document.getElementById('pzVerseCount');
        const navBadgeCountEl = document.getElementById('pzNavBadgeCount');
        const quickJumpSelect = document.getElementById('pzQuickJumpSelect');
        const searchInput = document.getElementById('pzSearchInput');
        const dropZone = document.getElementById('pzDropZone');
        const fileInput = document.getElementById('pzFileInput');
        const pasteInput = document.getElementById('pzPasteInput');
        const boardStage = document.getElementById('pzBoardStage');
        const stageRef = document.getElementById('pzStageRef');
        const stageVer = document.getElementById('pzStageVer');
        const stageText = document.getElementById('pzStageText');
        const btRef = document.getElementById('pzBtRef');
        const btSub = document.getElementById('pzBtSub');
        const btnAutoHideToggle = document.getElementById('pzBtnAutoHideToggle');
        const canvas = document.getElementById('pzDrawCanvas');
        const ctx = canvas.getContext('2d');
        const toastEl = document.getElementById('pzStatusToast');

        const btnModeBible = document.getElementById('pzBtnModeBible');
        const btnModeNormal = document.getElementById('pzBtnModeNormal');
        const bibleControlsBar = document.getElementById('pzBibleControlsBar');
        const normalControlsBar = document.getElementById('pzNormalControlsBar');
        const bibleVersionSelect = document.getElementById('pzBibleVersionSelect');
        const bibleChunkSelect = document.getElementById('pzBibleChunkSelect');
        const bibleLayoutSelect = document.getElementById('pzBibleLayoutSelect');
        const normalSplitSelect = document.getElementById('pzNormalSplitSelect');
        const bibleLoadStatus = document.getElementById('pzBibleLoadStatus');
        const boardVersionSelect = document.getElementById('pzBoardVersionSelect');
        const pasteHint = document.getElementById('pzPasteHint');
        const dropZoneHint = document.getElementById('pzDropZoneHint');

        statusCallback = function (text, type) {
            if (!bibleLoadStatus) return;
            bibleLoadStatus.textContent = text;
            bibleLoadStatus.className = 'pz-bible-status' + (type ? ' ' + type : '');
        };

        function showToast(msg) {
            if (!toastEl) return;
            toastEl.textContent = msg;
            toastEl.style.display = 'block';
            clearTimeout(showToast._t);
            showToast._t = setTimeout(() => { toastEl.style.display = 'none'; }, 2600);
        }

        function switchPzView(viewId) {
            root.querySelectorAll('.pz-view-panel').forEach(p => p.classList.toggle('active', p.id === viewId));
            root.querySelectorAll('.pz-nav-pill[data-pzview]').forEach(b => b.classList.toggle('active', b.dataset.pzview === viewId));
        }

        root.querySelectorAll('.pz-nav-pill[data-pzview]').forEach(btn => {
            btn.addEventListener('click', () => switchPzView(btn.dataset.pzview));
        });
        document.getElementById('pzBtnQuickGoUpload')?.addEventListener('click', () => switchPzView('pz-view-config'));
        document.getElementById('pzBtnBackToVerses')?.addEventListener('click', () => switchPzView('pz-view-verses'));

        function saveState() {
            try { localStorage.setItem('pizarra_biblica_offline_v1', JSON.stringify(verses)); } catch (e) {}
        }

        function loadState() {
            try {
                const raw = localStorage.getItem('pizarra_biblica_offline_v1');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        verses = parsed;
                        return;
                    }
                }
            } catch (e) {}
            verses = [];
        }

        let workMode = localStorage.getItem('pizarra_work_mode') || 'bible';
        let activeBibleVersion = localStorage.getItem('pizarra_bible_ver') || 'LBLA';
        if (!BIBLES_CATALOG[activeBibleVersion]) activeBibleVersion = 'LBLA';
        let bibleChunkMode = localStorage.getItem('pizarra_bible_chunk') || 'auto3';
        let bibleLayoutMode = localStorage.getItem('pizarra_bible_layout') || 'lines';
        let normalSplitMode = localStorage.getItem('pizarra_normal_split') || 'natural';

        bibleVersionSelect.value = activeBibleVersion;
        bibleChunkSelect.value = bibleChunkMode;
        bibleLayoutSelect.value = bibleLayoutMode;
        normalSplitSelect.value = normalSplitMode;

        bibleChunkSelect.addEventListener('change', () => {
            bibleChunkMode = bibleChunkSelect.value;
            try { localStorage.setItem('pizarra_bible_chunk', bibleChunkMode); } catch (e) {}
        });
        bibleLayoutSelect.addEventListener('change', () => {
            bibleLayoutMode = bibleLayoutSelect.value;
            try { localStorage.setItem('pizarra_bible_layout', bibleLayoutMode); } catch (e) {}
        });
        normalSplitSelect.addEventListener('change', () => {
            normalSplitMode = normalSplitSelect.value;
            try { localStorage.setItem('pizarra_normal_split', normalSplitMode); } catch (e) {}
        });

        let initialBibleRequested = false;
        function applyWorkMode(mode, skipInitialFetch) {
            workMode = mode === 'normal' ? 'normal' : 'bible';
            try { localStorage.setItem('pizarra_work_mode', workMode); } catch (e) {}
            btnModeBible.classList.toggle('active', workMode === 'bible');
            btnModeNormal.classList.toggle('active', workMode === 'normal');
            bibleControlsBar.classList.toggle('hidden', workMode !== 'bible');
            normalControlsBar.classList.toggle('hidden', workMode !== 'normal');
            const btnBibLocal = document.getElementById('pzBtnLoadBibleJson');
            if (btnBibLocal) btnBibLocal.style.display = workMode === 'bible' ? 'inline-flex' : 'none';

            if (workMode === 'bible') {
                pasteInput.placeholder =
                    'Pega solo citas o cita + texto (español o inglés, completas o abreviadas):\n' +
                    'Salmos 94:22\n' +
                    'Col 1:15-17\n' +
                    'John 3:16\n' +
                    'Proverbios 1\n' +
                    '1 Cor. 13:4-7';
                pasteHint.textContent = 'Modo Bíblico: resuelve citas en español/inglés (completas o abreviadas) desde biblias/';
                dropZoneHint.textContent = 'Acepta solo citas (español o inglés, completas o abreviadas) o cita + texto';
                if (!skipInitialFetch) {
                    initialBibleRequested = true;
                    ensureBibleLoaded(activeBibleVersion);
                }
            } else {
                pasteInput.placeholder =
                    'Pega aquí cualquier texto general (separa bloques con línea en blanco o usa Título — texto):\n' +
                    'Idea Principal — Puedes cargar artículos, apuntes, citas literarias o párrafos de cualquier tema.\n\n' +
                    '# Encabezado opcional\nTexto del siguiente bloque para analizar en la pizarra.';
                pasteHint.textContent = 'Modo Texto Normal: separa por párrafos, encabezados (#) o Título — texto';
                dropZoneHint.textContent = 'Sube cualquier .PDF, .MD o .TXT de apuntes, artículos o lecturas generales';
            }
        }

        btnModeBible.addEventListener('click', () => applyWorkMode('bible', false));
        btnModeNormal.addEventListener('click', () => applyWorkMode('normal', false));

        bibleVersionSelect.addEventListener('change', async () => {
            activeBibleVersion = bibleVersionSelect.value;
            try { localStorage.setItem('pizarra_bible_ver', activeBibleVersion); } catch (e) {}
            initialBibleRequested = true;
            await ensureBibleLoaded(activeBibleVersion);
        });

        // Cargar la Biblia bajo demanda cuando se abre la Mesa de Trabajo por primera vez
        window.ensurePizarraReady = function () {
            if (workMode === 'bible' && !initialBibleRequested) {
                initialBibleRequested = true;
                ensureBibleLoaded(activeBibleVersion);
            }
        };

        const REF_REGEX = /^((?:(?:[1-3](?:[aªoº]|ra|da|er|st|nd|rd)?|I{1,3})\s*(?:de\s+)?)?(?:S\.?\s+|San\s+)?[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\.?\s+(?:de\s+los\s+|de\s+|of\s+)?[A-Za-zÁÉÍÓÚÑáéíóúñ]+)*\.?)\s+(\d+)(?:[:.](\d+)(?:\s*[-–]\s*(\d+))?)?(?:\s*\(([A-Za-z0-9]{2,10})\))?\s*(?:[—–:\-]\s*)?(.*)$/;
        const TITLE_TEXT_REGEX = /^([^\n—–:]{2,70})\s*(?:[—–]|:(?=\s))\s+(.+)$/;

        function parseBibleRefHeader(line) {
            const m = line.match(REF_REGEX);
            if (!m) return null;
            const book = resolveBookEntry(m[1]);
            if (!book) return null;

            let chapter = parseInt(m[2], 10);
            let vStart = m[3] ? parseInt(m[3], 10) : null;
            let vEnd = m[4] ? parseInt(m[4], 10) : vStart;

            const ver = (m[5] || '').trim().toUpperCase();
            const body = (m[6] || '').trim();
            let isWholeChapter = false;

            if (vStart === null) {
                if (book.singleChapter) {
                    if (chapter === 1 && !body) {
                        isWholeChapter = true;
                        vStart = 1;
                        vEnd = 1;
                    } else {
                        vStart = chapter;
                        vEnd = chapter;
                        chapter = 1;
                    }
                } else {
                    if (body) return null;
                    isWholeChapter = true;
                    vStart = 1;
                    vEnd = 1;
                }
            }
            if (vEnd < vStart) vEnd = vStart;

            const rangeStr = isWholeChapter
                ? `${chapter}`
                : (vEnd > vStart ? `${chapter}:${vStart}-${vEnd}` : `${chapter}:${vStart}`);
            return {
                book,
                chapter,
                vStart,
                vEnd,
                isWholeChapter,
                refDisplay: `${book.display} ${rangeStr}`,
                versionTag: ver,
                body
            };
        }

        function getChapterVerseBounds(bibleMap, book, chapter) {
            if (!bibleMap || !book) return null;
            const keys = book.jsonKeys || [book.id];
            let minV = Infinity;
            let maxV = 0;

            for (const bk of keys) {
                const prefix = `${bk} ${chapter}:`;
                for (const k of Object.keys(bibleMap)) {
                    if (!k.startsWith(prefix)) continue;
                    const rest = k.slice(prefix.length);
                    const rm = rest.match(/^(\d+)(?:-(\d+))?$/);
                    if (!rm) continue;
                    const a = parseInt(rm[1], 10);
                    const b = rm[2] ? parseInt(rm[2], 10) : a;
                    if (a < minV) minV = a;
                    if (b > maxV) maxV = b;
                }
                if (maxV > 0) break;
            }
            return maxV > 0 ? { minV, maxV } : null;
        }

        function formatVersionLabel(ver) {
            if (!ver) return '';
            const v = ver.toUpperCase();
            if (BIBLES_CATALOG[v]) return BIBLES_CATALOG[v].label;
            if (v === 'RV60' || v === 'RVR60') return 'REINA-VALERA 1960 (RVR1960)';
            if (v === 'LOCAL') return 'BIBLIA LOCAL (.JSON)';
            return v;
        }

        function splitNormalTextNaturally(text, mode) {
            const clean = String(text || '').replace(/\s+/g, ' ').trim();
            if (!clean) return [];
            if (mode === 'none') return [clean];

            const sentences = clean.match(/[^.!?…]+(?:[.!?…]+["»”')]*|$)/g) || [clean];
            const trimmedSents = sentences.map(s => s.trim()).filter(Boolean);
            if (mode === 'sentence') return trimmedSents;

            const MAX_TARGET = 280;
            const HARD_LIMIT = 340;
            const chunks = [];
            let buf = '';

            function splitLongClause(clause) {
                const out = [];
                let rem = clause.trim();
                while (rem.length > HARD_LIMIT) {
                    const slice = rem.slice(0, HARD_LIMIT);
                    let cut = -1;
                    for (const sep of ['; ', ': ']) {
                        const idx = slice.lastIndexOf(sep);
                        if (idx > 110) cut = Math.max(cut, idx + 1);
                    }
                    if (cut === -1) {
                        const idx = slice.lastIndexOf(', ');
                        if (idx > 110) cut = idx + 1;
                    }
                    if (cut === -1) {
                        const idx = slice.lastIndexOf(' ');
                        cut = idx > 60 ? idx : HARD_LIMIT;
                    }
                    out.push(rem.slice(0, cut).trim());
                    rem = rem.slice(cut).trim();
                }
                if (rem) out.push(rem);
                return out;
            }

            for (const s of trimmedSents) {
                if (s.length > HARD_LIMIT) {
                    if (buf) { chunks.push(buf); buf = ''; }
                    splitLongClause(s).forEach(part => chunks.push(part));
                } else if (!buf) {
                    buf = s;
                } else if ((buf.length + 1 + s.length) <= MAX_TARGET) {
                    buf += ' ' + s;
                } else {
                    chunks.push(buf);
                    buf = s;
                }
            }
            if (buf) chunks.push(buf);
            return chunks;
        }

        function makeVerseId() {
            return 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        }

        function buildBiblicalBlocksFromRef(parsedRef) {
            const ver = parsedRef.versionTag || activeBibleVersion;
            const targetMap = (parsedRef.versionTag && bibleCache[parsedRef.versionTag]) || localBibleMap;
            let vStart = parsedRef.vStart;
            let vEnd = parsedRef.vEnd;

            if (parsedRef.isWholeChapter && !parsedRef.body) {
                const bounds = getChapterVerseBounds(targetMap, parsedRef.book, parsedRef.chapter);
                if (bounds) {
                    vStart = bounds.minV;
                    vEnd = bounds.maxV;
                }
            }
            const total = vEnd - vStart + 1;

            if (parsedRef.body) {
                return [{
                    id: makeVerseId(),
                    ref: parsedRef.refDisplay,
                    version: ver,
                    isBiblical: true,
                    canonBookId: parsedRef.book.id,
                    chapter: parsedRef.chapter,
                    vStart: parsedRef.vStart,
                    vEnd: parsedRef.vEnd,
                    verseNum: String(parsedRef.vStart),
                    text: parsedRef.body,
                    wordMarks: {},
                    drawData: null
                }];
            }

            let chunkSize = total;
            if (bibleChunkMode === '1') chunkSize = 1;
            else if (bibleChunkMode === '2') chunkSize = 2;
            else if (bibleChunkMode === '4') chunkSize = 4;
            else if (bibleChunkMode === 'auto3') chunkSize = total >= 4 ? 3 : total;
            else chunkSize = total;

            const blocks = [];
            for (let s = vStart; s <= vEnd; s += chunkSize) {
                const e = Math.min(vEnd, s + chunkSize - 1);
                const rangeStr = e > s ? `${parsedRef.chapter}:${s}-${e}` : `${parsedRef.chapter}:${s}`;
                const body = lookupBiblePassage(targetMap, parsedRef.book, parsedRef.chapter, s, e);
                blocks.push({
                    id: makeVerseId(),
                    ref: `${parsedRef.book.display} ${rangeStr}`,
                    version: ver,
                    isBiblical: true,
                    canonBookId: parsedRef.book.id,
                    chapter: parsedRef.chapter,
                    vStart: s,
                    vEnd: e,
                    verseNum: e === s ? String(s) : '',
                    layout: bibleLayoutMode,
                    text: body,
                    wordMarks: {},
                    drawData: null
                });
            }
            return blocks;
        }

        function pushFinalizedBlock(result, blk) {
            if (!blk) return;
            if (blk.isBiblical) {
                result.push(blk);
                return;
            }
            const parts = splitNormalTextNaturally(blk.text, normalSplitMode);
            if (parts.length <= 1) {
                result.push(blk);
            } else {
                const baseRef = blk.ref;
                parts.forEach((p, idx) => {
                    result.push({
                        id: makeVerseId(),
                        ref: `${baseRef} (${idx + 1}/${parts.length})`,
                        version: '',
                        isBiblical: false,
                        verseNum: '',
                        text: p,
                        wordMarks: {},
                        drawData: null
                    });
                });
            }
        }

        function parseVersesFromText(rawText) {
            const clean = rawText.replace(/\r\n/g, '\n').replace(/\*\*/g, '').trim();
            if (!clean) return [];

            const rawLines = clean.split('\n');
            const result = [];
            let current = null;
            let pendingHeading = '';

            for (let i = 0; i < rawLines.length; i++) {
                const line = rawLines[i].trim();
                if (!line) {
                    if (current) { pushFinalizedBlock(result, current); current = null; }
                    continue;
                }

                const hMatch = line.match(/^#{1,6}\s+(.+)$/);
                if (hMatch) {
                    if (current) { pushFinalizedBlock(result, current); current = null; }
                    pendingHeading = hMatch[1].trim();
                    continue;
                }

                if (workMode === 'bible') {
                    const parsedRef = parseBibleRefHeader(line);
                    if (parsedRef) {
                        if (current) { pushFinalizedBlock(result, current); current = null; }
                        pendingHeading = '';
                        const blocks = buildBiblicalBlocksFromRef(parsedRef);
                        if (blocks.length > 1) {
                            blocks.forEach(b => result.push(b));
                        } else if (blocks.length === 1) {
                            current = blocks[0];
                        }
                        continue;
                    }
                }

                if (current) {
                    const sep = current.isBiblical ? '\n' : ' ';
                    current.text = (current.text ? current.text + sep : '') + line;
                    continue;
                }

                const tm = !pendingHeading ? line.match(TITLE_TEXT_REGEX) : null;
                if (tm) {
                    current = {
                        id: makeVerseId(),
                        ref: tm[1].trim(), version: '', isBiblical: false, verseNum: '', text: tm[2].trim(), wordMarks: {}, drawData: null
                    };
                } else {
                    const title = pendingHeading || ('Texto ' + (result.length + 1));
                    pendingHeading = '';
                    current = {
                        id: makeVerseId(),
                        ref: title, version: '', isBiblical: false, verseNum: '', text: line, wordMarks: {}, drawData: null
                    };
                }
            }

            if (current) pushFinalizedBlock(result, current);

            result.forEach(v => {
                if (v.isBiblical) {
                    if (!v.text) {
                        v.text = `(No se encontró el texto en ${v.version} — verifica la cita o usa 📚 Biblia Local .json)`;
                    } else if (!v.text.includes('\n') && v.verseNum) {
                        v.text = v.text.replace(/^\d+\s+/, '');
                    }
                }
            });
            return result;
        }

        function escapeHtml(s) {
            return String(s ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        // Puente directo a Fraseo (DIALS) y Asistente IA
        function sendVerseToPhrasing(v) {
            if (!v || !v.text) return;
            if (typeof window.loadPassageIntoPhrasing === 'function') {
                const bookEntry = v.canonBookId ? BOOK_BY_ID[v.canonBookId] : (parseBibleRefHeader(v.ref)?.book || null);
                window.loadPassageIntoPhrasing({
                    ref: v.ref,
                    version: v.version || activeBibleVersion,
                    text: v.text,
                    verseNum: v.verseNum || '',
                    bookName: bookEntry ? bookEntry.display : '',
                    testament: bookEntry ? bookEntry.testament : 'NT',
                    abbrev: bookEntry ? bookEntry.abbrev : '',
                    chapter: v.chapter || 1,
                    vStart: v.vStart || 1,
                    vEnd: v.vEnd || v.vStart || 1
                });
                if (boardOverlay.classList.contains('open')) closeBoard();
                if (typeof window.goToShortcut === 'function') {
                    window.goToShortcut('mesaInteractiva', 'mesa-herramientas');
                }
                showToast('📐 Pasaje enviado a Fraseo y Notas (DIALS)');
            }
        }

        function sendVerseToAI(v) {
            if (!v || !v.text) return;
            const aiInput = document.getElementById('aiInput');
            if (aiInput) {
                const header = v.version ? `${v.ref} (${v.version})` : v.ref;
                aiInput.value = `${header}\n\n${v.text}`;
            }
            if (boardOverlay.classList.contains('open')) closeBoard();
            if (typeof window.goToShortcut === 'function') {
                window.goToShortcut('mesaInteractiva', 'mesa-ai');
            }
            showToast('🧠 Pasaje enviado al Asistente Exegético IA');
        }

        function renderQuickJumpSelect() {
            if (!quickJumpSelect) return;
            if (verses.length === 0) {
                quickJumpSelect.innerHTML = '<option value="">⚡ Ir rápido a bloque (0)...</option>';
                return;
            }
            quickJumpSelect.innerHTML = '<option value="">⚡ Abrir bloque en Pizarra (' + verses.length + ')...</option>' +
                verses.map((v, idx) => {
                    const markDot = ((v.wordMarks && Object.keys(v.wordMarks).length > 0) || v.drawData) ? '🟢 ' : '';
                    return `<option value="${idx}">${markDot}${escapeHtml(v.ref)}${v.version ? ' (' + escapeHtml(v.version) + ')' : ''}</option>`;
                }).join('');
        }

        if (quickJumpSelect) {
            quickJumpSelect.addEventListener('change', () => {
                const idx = parseInt(quickJumpSelect.value, 10);
                quickJumpSelect.value = '';
                if (!isNaN(idx)) openBoard(idx);
            });
        }

        function renderList() {
            const q = (searchInput.value || '').toLowerCase().trim();
            const filtered = verses
                .map((v, idx) => ({ v, idx }))
                .filter(({ v }) => !q || v.ref.toLowerCase().includes(q) || v.text.toLowerCase().includes(q));

            verseCountEl.textContent = verses.length;
            if (navBadgeCountEl) navBadgeCountEl.textContent = verses.length;
            renderQuickJumpSelect();

            if (filtered.length === 0) {
                verseListEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:42px 20px;color:var(--pz-text-muted);background:var(--pz-bg-panel);border:1px dashed var(--pz-border);border-radius:14px;">No hay textos cargados aún. Usa la vista <strong>⚙️ Cargar y Configurar</strong> para escribir citas bíblicas (en cualquiera de las 9 Biblias), pegar textos o arrastrar un archivo <code>.PDF</code>, <code>.MD</code> o <code>.TXT</code>.</div>';
                return;
            }

            verseListEl.innerHTML = filtered.map(({ v, idx }) => {
                const hasMarks = (v.wordMarks && Object.keys(v.wordMarks).length > 0) || Boolean(v.drawData);
                return `
                    <div class="pz-verse-card" data-idx="${idx}">
                        <div class="pz-vc-top">
                            <span class="pz-vc-ref">${escapeHtml(v.ref)}</span>
                            <div class="pz-vc-badges">
                                ${hasMarks ? '<span class="pz-vc-marked">Marcado</span>' : ''}
                                ${v.version ? `<span class="pz-vc-ver">${escapeHtml(v.version)}</span>` : ''}
                            </div>
                        </div>
                        <div class="pz-vc-preview">${escapeHtml(v.text)}</div>
                        <div class="pz-vc-footer">
                            <span>🖍️ Clic para abrir Pizarra</span>
                            <div class="pz-vc-actions">
                                <button type="button" class="pz-vc-mini-btn" data-to-phrasing="${idx}" title="Enviar este bloque al motor de Fraseo (DIALS)">📐 Fraseo</button>
                                <button type="button" class="pz-vc-mini-btn" data-to-ai="${idx}" title="Enviar este bloque al Asistente Exegético IA">🧠 IA</button>
                                <button type="button" class="pz-vc-del" data-del="${idx}" title="Eliminar bloque">✕</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        verseListEl.addEventListener('click', (e) => {
            const delBtn = e.target.closest('[data-del]');
            if (delBtn) {
                e.stopPropagation();
                verses.splice(parseInt(delBtn.dataset.del, 10), 1);
                saveState();
                renderList();
                return;
            }
            const phrBtn = e.target.closest('[data-to-phrasing]');
            if (phrBtn) {
                e.stopPropagation();
                sendVerseToPhrasing(verses[parseInt(phrBtn.dataset.toPhrasing, 10)]);
                return;
            }
            const aiBtn = e.target.closest('[data-to-ai]');
            if (aiBtn) {
                e.stopPropagation();
                sendVerseToAI(verses[parseInt(aiBtn.dataset.toAi, 10)]);
                return;
            }
            const card = e.target.closest('.pz-verse-card');
            if (card) openBoard(parseInt(card.dataset.idx, 10));
        });
        searchInput.addEventListener('input', renderList);

        // Lector híbrido de PDF (Pizarra/js/pdf.min.js -> CDN -> lector offline nativo)
        let pdfJsReadyPromise = null;
        function loadExternalScript(src) {
            return new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.onload = () => resolve();
                s.onerror = () => { s.remove(); reject(new Error('No cargó ' + src)); };
                document.head.appendChild(s);
            });
        }

        async function ensurePdfJsLoaded() {
            if (window.pdfjsLib) return window.pdfjsLib;
            if (pdfJsReadyPromise) return await pdfJsReadyPromise;

            const sources = [
                { lib: './js/pdf.min.js', worker: './js/pdf.worker.min.js' },
                { lib: './Pizarra/js/pdf.min.js', worker: './Pizarra/js/pdf.worker.min.js' },
                { lib: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js' },
                { lib: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js', worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js' }
            ];

            pdfJsReadyPromise = (async () => {
                for (const src of sources) {
                    try {
                        await loadExternalScript(src.lib);
                        if (window.pdfjsLib) {
                            window.pdfjsLib.GlobalWorkerOptions.workerSrc = src.worker;
                            return window.pdfjsLib;
                        }
                    } catch (e) {}
                }
                return null;
            })();

            const lib = await pdfJsReadyPromise;
            if (!lib) pdfJsReadyPromise = null;
            return lib;
        }

        async function extractPdfTextSmart(buf) {
            const pdfjs = await ensurePdfJsLoaded();
            if (pdfjs) {
                const dataCopy = new Uint8Array(buf.slice(0));
                let doc = null;
                try {
                    const useNoWorker = location.protocol === 'file:';
                    doc = await pdfjs.getDocument({ data: dataCopy, disableWorker: useNoWorker }).promise;
                } catch (e) {
                    doc = await pdfjs.getDocument({ data: new Uint8Array(buf.slice(0)), disableWorker: true }).promise;
                }

                const pageTexts = [];
                for (let p = 1; p <= doc.numPages; p++) {
                    const page = await doc.getPage(p);
                    const content = await page.getTextContent();
                    const items = content.items || [];
                    const lines = [];
                    let currentLine = '';
                    let lastY = null;
                    let lastH = 12;

                    for (const it of items) {
                        const str = typeof it.str === 'string' ? it.str : '';
                        const y = it.transform ? it.transform[5] : lastY;
                        const h = it.height && it.height > 0 ? it.height : lastH;

                        if (lastY !== null && y !== null && Math.abs(y - lastY) > Math.max(4, lastH * 0.6)) {
                            if (currentLine.trim()) lines.push(currentLine.trim());
                            if (Math.abs(y - lastY) > Math.max(14, lastH * 1.75)) lines.push('');
                            currentLine = str;
                        } else {
                            if (currentLine && str && !currentLine.endsWith(' ') && !str.startsWith(' ')) currentLine += ' ';
                            currentLine += str;
                        }
                        if (it.hasEOL) {
                            if (currentLine.trim()) lines.push(currentLine.trim());
                            currentLine = '';
                        }
                        if (y !== null) lastY = y;
                        if (h) lastH = h;
                    }
                    if (currentLine.trim()) lines.push(currentLine.trim());
                    pageTexts.push(lines.join('\n'));
                }
                return pageTexts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
            }

            if (typeof window.extractPdfTextOffline === 'function') {
                return await window.extractPdfTextOffline(buf);
            }
            return '';
        }

        async function handleFile(file) {
            if (!file) return;
            const ext = file.name.split('.').pop().toLowerCase();
            try {
                if (workMode === 'bible') await ensureBibleLoaded(activeBibleVersion);
                let text = '';
                if (ext === 'pdf') {
                    showToast('📄 Leyendo PDF...');
                    const buf = await file.arrayBuffer();
                    text = await extractPdfTextSmart(buf);
                    if (!text || text.length < 3) {
                        showToast('No se detectó texto seleccionable en el PDF (puede ser escaneado).');
                        return;
                    }
                } else {
                    text = await file.text();
                }
                const parsed = parseVersesFromText(text);
                if (!parsed.length) return showToast('No se encontraron textos en el archivo.');
                verses = parsed;
                saveState();
                renderList();
                switchPzView('pz-view-verses');
                showToast(`✅ ${parsed.length} elemento(s) cargados desde ${file.name}`);
            } catch (err) {
                showToast('Error leyendo el archivo: ' + err.message);
            }
        }

        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => { handleFile(e.target.files[0]); fileInput.value = ''; });
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        });

        document.getElementById('pzBtnReplacePaste').addEventListener('click', async () => {
            if (workMode === 'bible') await ensureBibleLoaded(activeBibleVersion);
            const parsed = parseVersesFromText(pasteInput.value);
            if (!parsed.length) return showToast('Pega al menos un texto o versículo primero.');
            verses = parsed;
            saveState();
            renderList();
            switchPzView('pz-view-verses');
            showToast(`✅ Lista cargada (${parsed.length} elementos)`);
        });

        document.getElementById('pzBtnAppendPaste').addEventListener('click', async () => {
            if (workMode === 'bible') await ensureBibleLoaded(activeBibleVersion);
            const parsed = parseVersesFromText(pasteInput.value);
            if (!parsed.length) return showToast('Pega al menos un texto o versículo primero.');
            verses = verses.concat(parsed);
            saveState();
            renderList();
            switchPzView('pz-view-verses');
            showToast(`➕ ${parsed.length} elemento(s) agregados`);
        });

        document.getElementById('pzBtnClearList').addEventListener('click', () => {
            if (!confirm('¿Borrar todos los textos de la lista actual de la Pizarra?')) return;
            verses = [];
            saveState();
            renderList();
        });

        const bibleJsonInput = document.getElementById('pzBibleJsonInput');
        document.getElementById('pzBtnLoadBibleJson').addEventListener('click', () => bibleJsonInput.click());
        bibleJsonInput.addEventListener('change', async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            try {
                const obj = JSON.parse(await f.text());
                const map = normalizeBibleData(obj);
                localBibleMap = map;
                bibleCache['LOCAL'] = map;
                if (!bibleVersionSelect.querySelector('option[value="LOCAL"]')) {
                    const opt = document.createElement('option');
                    opt.value = 'LOCAL';
                    opt.textContent = 'LOCAL — ' + f.name;
                    bibleVersionSelect.appendChild(opt);
                }
                activeBibleVersion = 'LOCAL';
                bibleVersionSelect.value = 'LOCAL';
                statusCallback(`✅ Biblia Local (${Object.keys(map).length.toLocaleString()} vers.)`, 'ok');
                showToast(`📚 Biblia local cargada (${Object.keys(map).length.toLocaleString()} versículos)`);
            } catch (err) {
                showToast('Archivo JSON inválido.');
            }
            bibleJsonInput.value = '';
        });

        document.getElementById('pzBtnExportSession').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(verses, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'sesion_pizarra_biblica.json';
            a.click();
            URL.revokeObjectURL(a.href);
            showToast('💾 Sesión exportada (.json)');
        });

        const sessionJsonInput = document.getElementById('pzSessionJsonInput');
        document.getElementById('pzBtnImportSession').addEventListener('click', () => sessionJsonInput.click());
        sessionJsonInput.addEventListener('change', async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            try {
                const data = JSON.parse(await f.text());
                if (Array.isArray(data)) {
                    verses = data;
                    saveState();
                    renderList();
                    switchPzView('pz-view-verses');
                    showToast('📂 Sesión importada con éxito');
                }
            } catch (err) {
                showToast('No se pudo leer el archivo de sesión.');
            }
            sessionJsonInput.value = '';
        });

        // Cambio de versión bíblica en vivo dentro de la Pizarra abierta
        boardVersionSelect.addEventListener('change', async () => {
            if (activeIndex < 0 || !verses[activeIndex]) return;
            const v = verses[activeIndex];
            const newVer = boardVersionSelect.value;
            let book = v.canonBookId ? BOOK_BY_ID[v.canonBookId] : null;
            let ch = v.chapter, vs = v.vStart, ve = v.vEnd;
            if (!book) {
                const parsed = parseBibleRefHeader(v.ref);
                if (parsed) {
                    book = parsed.book; ch = parsed.chapter; vs = parsed.vStart; ve = parsed.vEnd;
                    v.canonBookId = book.id; v.chapter = ch; v.vStart = vs; v.vEnd = ve;
                }
            }
            if (!book) return;
            showToast(`⏳ Cambiando a ${newVer}...`);
            const map = await ensureBibleLoaded(newVer);
            const newText = lookupBiblePassage(map, book, ch, vs, ve);
            if (!newText) {
                showToast(`⚠️ Pasaje no encontrado en ${newVer}`);
                boardVersionSelect.value = v.version || activeBibleVersion;
                return;
            }
            v.text = newText;
            v.version = newVer;
            v.wordMarks = {};
            btSub.textContent = `${formatVersionLabel(newVer)} · PIZARRA INTERACTIVA`;
            stageVer.textContent = newVer;
            stageVer.style.display = 'inline-block';
            v.verseNum = (v.vEnd === v.vStart) ? String(v.vStart) : '';
            renderVerseTokens(v);
            requestAnimationFrame(() => resizeCanvas(v.drawData));
            saveState();
            showToast(`✅ Mostrando ${v.ref} (${newVer})`);
        });

        // Modo Look at the Book (auto-ocultar inteligente + manual H)
        function setBarsVisibility(showTop, showBottom) {
            boardOverlay.classList.toggle('top-hidden', !showTop);
            boardOverlay.classList.toggle('bottom-hidden', !showBottom);
        }

        function scheduleAutoHide() {
            clearTimeout(hideTimer);
            if (!autoHideEnabled || manualHidden) return;
            hideTimer = setTimeout(() => {
                if (!isDrawing && autoHideEnabled && !manualHidden) {
                    setBarsVisibility(false, false);
                }
            }, 2200);
        }

        boardOverlay.addEventListener('mousemove', (e) => {
            if (!boardOverlay.classList.contains('open') || manualHidden || !autoHideEnabled || isDrawing) return;
            const h = window.innerHeight;
            const nearTop = e.clientY <= 82;
            const nearBottom = e.clientY >= h - 120;

            if (nearTop || nearBottom) {
                clearTimeout(hideTimer);
                setBarsVisibility(nearTop, nearBottom);
            } else {
                scheduleAutoHide();
            }
        });

        btnAutoHideToggle.addEventListener('click', () => {
            autoHideEnabled = !autoHideEnabled;
            btnAutoHideToggle.textContent = autoHideEnabled ? '🎯 Auto' : '📌 Fijas';
            btnAutoHideToggle.classList.toggle('active-mode', autoHideEnabled);
            if (!autoHideEnabled) {
                clearTimeout(hideTimer);
                manualHidden = false;
                boardOverlay.classList.remove('manual-hidden');
                setBarsVisibility(true, true);
            } else {
                scheduleAutoHide();
            }
        });

        function toggleManualHide() {
            manualHidden = !manualHidden;
            boardOverlay.classList.toggle('manual-hidden', manualHidden);
            if (manualHidden) {
                clearTimeout(hideTimer);
                setBarsVisibility(false, false);
            } else {
                setBarsVisibility(true, true);
                scheduleAutoHide();
            }
        }

        document.getElementById('pzBtnHideBars').addEventListener('click', toggleManualHide);
        document.getElementById('pzBtnRestoreBars').addEventListener('click', toggleManualHide);

        // Paleta de colores sincronizable
        function buildColorPalette() {
            const pal = document.getElementById('pzColorPalette');
            if (!pal) return;
            const colors = getActivePalette();
            if (!colors.some(c => c.hex.toLowerCase() === currentColor.toLowerCase())) {
                currentColor = colors[6]?.hex || '#f5b922';
            }
            pal.innerHTML = colors.map(c => `
                <button type="button" class="pz-color-swatch ${c.hex.toLowerCase() === currentColor.toLowerCase() ? 'active' : ''}"
                        data-color="${c.hex}" title="${escapeHtml(c.name)}" style="background:${c.hex};"></button>
            `).join('');
        }
        buildColorPalette();
        window.refreshPizarraColors = buildColorPalette;

        document.getElementById('pzColorPalette').addEventListener('click', (e) => {
            const dot = e.target.closest('.pz-color-swatch');
            if (!dot) return;
            currentColor = dot.dataset.color;
            boardOverlay.querySelectorAll('.pz-color-swatch').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });

        const btnWordMode = document.getElementById('pzBtnWordMode');
        function setWordMode(enabled) {
            boardOverlay.classList.toggle('word-mode', enabled);
            btnWordMode.classList.toggle('active', enabled);
            if (enabled) {
                if (currentTool !== 'word') lastDrawTool = currentTool;
                currentTool = 'word';
            } else {
                currentTool = lastDrawTool || 'pen';
                boardOverlay.querySelectorAll('#pzDrawToolsGroup [data-tool]').forEach(b => {
                    b.classList.toggle('active', b.dataset.tool === currentTool);
                });
            }
        }

        btnWordMode.addEventListener('click', () => setWordMode(currentTool !== 'word'));

        boardOverlay.querySelectorAll('#pzDrawToolsGroup [data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                lastDrawTool = btn.dataset.tool;
                currentTool = btn.dataset.tool;
                boardOverlay.querySelectorAll('#pzDrawToolsGroup [data-tool]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                boardOverlay.classList.remove('word-mode');
                btnWordMode.classList.remove('active');
            });
        });

        boardOverlay.querySelectorAll('#pzWordToolsGroup [data-wstyle]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentWordStyle = btn.dataset.wstyle;
                boardOverlay.querySelectorAll('#pzWordToolsGroup [data-wstyle]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        boardOverlay.querySelectorAll('#pzBoardBottomBar [data-width]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentWidth = parseInt(btn.dataset.width, 10);
                boardOverlay.querySelectorAll('#pzBoardBottomBar [data-width]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        const hlAlphaSlider = document.getElementById('pzHlAlphaSlider');
        const hlAlphaLabel = document.getElementById('pzHlAlphaLabel');
        if (hlAlphaSlider && hlAlphaLabel) {
            const pct = Math.round(currentHighlightAlpha * 100);
            hlAlphaSlider.value = String(pct);
            hlAlphaLabel.textContent = pct + '%';
            hlAlphaSlider.addEventListener('input', () => {
                const val = parseInt(hlAlphaSlider.value, 10) || 35;
                currentHighlightAlpha = val / 100;
                hlAlphaLabel.textContent = val + '%';
                try { localStorage.setItem('pizarra_hl_alpha', String(val)); } catch (e) {}
            });
        }

        function hexToRgba(hex, alpha) {
            const h = hex.replace('#', '');
            return `rgba(${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)},${alpha})`;
        }

        function renderVerseTokens(v) {
            const lines = String(v.text || '').split('\n').filter(l => l.trim().length > 0);
            let wIdx = 0;

            const linesHtml = lines.map((lineText, lineIdx) => {
                let lineNumHtml = '';
                let content = lineText;
                if (v.isBiblical) {
                    const lm = content.match(/^(\d+)\s+(.*)$/);
                    if (lm) {
                        lineNumHtml = `<span class="pz-verse-num">${escapeHtml(lm[1])}</span>`;
                        content = lm[2];
                    } else if (lineIdx === 0 && v.verseNum) {
                        lineNumHtml = `<span class="pz-verse-num">${escapeHtml(v.verseNum)}</span>`;
                    }
                }
                const words = content.split(/(\s+)/);
                const tokensHtml = words.map(part => {
                    if (/^\s+$/.test(part)) return part;
                    const key = String(wIdx++);
                    const mark = (v.wordMarks && v.wordMarks[key]) || null;
                    let cls = 'pz-w-tok';
                    let style = '';
                    if (mark) {
                        cls += ' pz-wm-' + mark.style;
                        const a = typeof mark.alpha === 'number' ? mark.alpha : 0.35;
                        const isLightColor = mark.color === '#ffffff' || mark.color === '#f5b922' || mark.color === '#ffc107';
                        if (mark.style === 'highlight') {
                            style = `background:${hexToRgba(mark.color, a)};color:${isLightColor && a >= 0.5 ? '#0f172a' : 'inherit'};`;
                        } else if (mark.style === 'bottom-bar') {
                            const ba = Math.min(0.95, Math.max(0.25, a + 0.25));
                            style = `background:linear-gradient(to top, ${hexToRgba(mark.color, ba)} 0%, ${hexToRgba(mark.color, ba)} 34%, transparent 34%);`;
                        } else if (mark.style === 'solid-block') {
                            const sa = Math.min(0.95, Math.max(0.35, a + 0.35));
                            style = `background:${hexToRgba(mark.color, sa)};color:${isLightColor ? '#0f172a' : '#ffffff'};`;
                        } else if (mark.style === 'underline' || mark.style === 'dotted' || mark.style === 'wavy' || mark.style === 'dashed') {
                            style = `text-decoration-color:${mark.color};color:${mark.color};`;
                        } else if (mark.style === 'arrow-left' || mark.style === 'arrow-right' || mark.style === 'arrow-both') {
                            style = `background:${hexToRgba(mark.color, Math.min(0.9, a + 0.08))};color:${isLightColor && a >= 0.5 ? '#0f172a' : 'inherit'};`;
                        } else if (mark.style === 'box' || mark.style === 'circle') {
                            style = `border-color:${mark.color};color:${mark.color};`;
                        } else if (mark.style === 'triangle') {
                            const encColor = encodeURIComponent(mark.color);
                            const triSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpolygon points='50,4 97,96 3,96' fill='none' stroke='${encColor}' stroke-width='5' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E")`;
                            style = `background-image:${triSvg};color:${mark.color};`;
                        }
                    }
                    return `<span class="${cls}" data-widx="${key}" style="${style}">${escapeHtml(part)}</span>`;
                }).join('');
                if (v.isBiblical && v.layout === 'inline') {
                    return `<span class="pz-verse-inline">${lineIdx > 0 ? ' ' : ''}${lineNumHtml}${tokensHtml}</span>`;
                }
                return `<div class="pz-verse-line">${lineNumHtml}${tokensHtml}</div>`;
            }).join('');

            stageText.innerHTML = (v.isBiblical && v.layout === 'inline') ? `<div class="pz-verse-line">${linesHtml}</div>` : linesHtml;
            stageText.style.fontSize = currentFontSize + 'px';
        }

        stageText.addEventListener('click', (e) => {
            if (currentTool !== 'word' || activeIndex < 0) return;
            const tok = e.target.closest('.pz-w-tok');
            if (!tok) return;
            const v = verses[activeIndex];
            if (!v.wordMarks) v.wordMarks = {};
            const key = tok.dataset.widx;
            if (currentWordStyle === 'clear') delete v.wordMarks[key];
            else v.wordMarks[key] = { color: currentColor, style: currentWordStyle, alpha: currentHighlightAlpha };
            renderVerseTokens(v);
            saveState();
            if (autoHideEnabled && !manualHidden) setBarsVisibility(false, false);
        });

        function resizeCanvas(restoreDataUrl) {
            canvas.style.width = '0px';
            canvas.style.height = '0px';
            const w = Math.max(boardStage.clientWidth, boardStage.scrollWidth);
            const h = Math.max(boardStage.clientHeight, boardStage.scrollHeight);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = w;
            canvas.height = h;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (restoreDataUrl) {
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0);
                img.src = restoreDataUrl;
            }
        }

        function pushUndo() {
            undoStack.push(canvas.toDataURL());
            if (undoStack.length > 35) undoStack.shift();
            redoStack = [];
        }

        function saveCurrentBoardDraw() {
            if (activeIndex < 0 || !verses[activeIndex]) return;
            verses[activeIndex].drawData = canvas.toDataURL();
            saveState();
        }

        function openBoard(idx) {
            if (idx < 0 || idx >= verses.length) return;
            if (activeIndex >= 0) saveCurrentBoardDraw();
            activeIndex = idx;
            const v = verses[idx];

            buildColorPalette();
            btRef.textContent = v.ref;
            const verFull = v.version ? formatVersionLabel(v.version) : '';
            btSub.textContent = verFull ? `${verFull} · PIZARRA INTERACTIVA` : 'PIZARRA INTERACTIVA';
            stageRef.textContent = v.ref;
            if (v.version) {
                stageVer.textContent = v.version;
                stageVer.style.display = 'inline-block';
            } else {
                stageVer.textContent = '';
                stageVer.style.display = 'none';
            }
            const isBib = Boolean(v.isBiblical || parseBibleRefHeader(v.ref));
            if (isBib) {
                boardVersionSelect.style.display = 'inline-block';
                boardVersionSelect.value = BIBLES_CATALOG[v.version] ? v.version : activeBibleVersion;
            } else {
                boardVersionSelect.style.display = 'none';
            }
            renderVerseTokens(v);

            manualHidden = false;
            boardOverlay.classList.add('open');
            boardOverlay.classList.remove('manual-hidden');
            setBarsVisibility(true, true);
            scheduleAutoHide();

            undoStack = [];
            redoStack = [];

            requestAnimationFrame(() => {
                resizeCanvas(v.drawData);
                setTimeout(() => { undoStack = [canvas.toDataURL()]; }, 60);
            });
        }

        function closeBoard() {
            clearTimeout(hideTimer);
            saveCurrentBoardDraw();
            boardOverlay.classList.remove('open');
            if (document.fullscreenElement === boardOverlay && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
            activeIndex = -1;
            renderList();
        }

        window.isPizarraBoardOpen = () => boardOverlay.classList.contains('open');

        // Dibujo Canvas (Capa 2: 12 herramientas)
        function getPos(e) {
            const r = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - r.left, y: clientY - r.top };
        }

        function drawShape(x1, y1, x2, y2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentWidth;
            if (currentTool === 'dotted') {
                ctx.setLineDash([Math.max(1.5, currentWidth * 0.4), Math.max(7, currentWidth * 2.2)]);
            } else if (currentTool === 'dashed') {
                ctx.setLineDash([Math.max(10, currentWidth * 3.2), Math.max(7, currentWidth * 2.1)]);
            } else {
                ctx.setLineDash([]);
            }

            ctx.beginPath();
            if (currentTool === 'line' || currentTool === 'dashed' || currentTool === 'dotted') {
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            } else if (currentTool === 'wavy') {
                const dx = x2 - x1;
                const dy = y2 - y1;
                const dist = Math.hypot(dx, dy);
                if (dist > 2) {
                    const angle = Math.atan2(dy, dx);
                    const waveLen = Math.max(10, currentWidth * 2.8);
                    const amp = Math.max(4, currentWidth * 1.15);
                    ctx.save();
                    ctx.translate(x1, y1);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    let dir = -1;
                    for (let px = 0; px < dist; px += waveLen) {
                        const nx = Math.min(dist, px + waveLen);
                        ctx.quadraticCurveTo((px + nx) / 2, dir * amp, nx, 0);
                        dir *= -1;
                    }
                    ctx.stroke();
                    ctx.restore();
                }
            } else if (currentTool === 'arrow' || currentTool === 'arrow-both') {
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const head = Math.max(12, currentWidth * 3.2);
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
                if (currentTool === 'arrow-both') {
                    const rev = angle + Math.PI;
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x1 - head * Math.cos(rev - Math.PI / 6), y1 - head * Math.sin(rev - Math.PI / 6));
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x1 - head * Math.cos(rev + Math.PI / 6), y1 - head * Math.sin(rev + Math.PI / 6));
                }
                ctx.stroke();
            } else if (currentTool === 'rect') {
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            } else if (currentTool === 'circle') {
                ctx.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (currentTool === 'triangle') {
                ctx.moveTo((x1 + x2) / 2, y1); ctx.lineTo(x2, y2); ctx.lineTo(x1, y2); ctx.closePath(); ctx.stroke();
            }
            ctx.restore();
        }

        function startDraw(e) {
            if (currentTool === 'word') return;
            e.preventDefault();
            isDrawing = true;
            if (autoHideEnabled && !manualHidden) {
                clearTimeout(hideTimer);
                setBarsVisibility(false, false);
            }
            const p = getPos(e);
            startX = p.x; startY = p.y;
            snapshotImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (currentTool === 'pen' || currentTool === 'highlighter' || currentTool === 'eraser') {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
            }
        }

        function moveDraw(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const p = getPos(e);
            if (currentTool === 'pen' || currentTool === 'highlighter' || currentTool === 'eraser') {
                ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                if (currentTool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = currentWidth * 4;
                } else if (currentTool === 'highlighter') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = hexToRgba(currentColor, currentHighlightAlpha);
                    ctx.lineWidth = currentWidth * 4.5;
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = currentColor;
                    ctx.lineWidth = currentWidth;
                }
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            } else {
                ctx.putImageData(snapshotImageData, 0, 0);
                drawShape(startX, startY, p.x, p.y);
            }
        }

        function endDraw() {
            if (!isDrawing) return;
            isDrawing = false;
            ctx.globalCompositeOperation = 'source-over';
            if (ctx.restore) ctx.restore();
            pushUndo();
            saveCurrentBoardDraw();
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', moveDraw);
        window.addEventListener('mouseup', endDraw);
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', moveDraw, { passive: false });
        window.addEventListener('touchend', endDraw);

        document.getElementById('pzBtnUndo').addEventListener('click', () => {
            if (undoStack.length <= 1) return;
            redoStack.push(undoStack.pop());
            resizeCanvas(undoStack[undoStack.length - 1]);
            saveCurrentBoardDraw();
        });

        document.getElementById('pzBtnRedo').addEventListener('click', () => {
            if (!redoStack.length) return;
            const next = redoStack.pop();
            undoStack.push(next);
            resizeCanvas(next);
            saveCurrentBoardDraw();
        });

        document.getElementById('pzBtnClearMarks').addEventListener('click', () => {
            if (activeIndex < 0) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            verses[activeIndex].wordMarks = {};
            verses[activeIndex].drawData = null;
            renderVerseTokens(verses[activeIndex]);
            pushUndo();
            saveState();
        });

        document.getElementById('pzBtnCloseBoard').addEventListener('click', closeBoard);
        document.getElementById('pzBtnPrevVerse').addEventListener('click', () => { if (activeIndex > 0) openBoard(activeIndex - 1); });
        document.getElementById('pzBtnNextVerse').addEventListener('click', () => { if (activeIndex < verses.length - 1) openBoard(activeIndex + 1); });

        document.getElementById('pzBtnBoardToPhrasing')?.addEventListener('click', () => {
            if (activeIndex >= 0) sendVerseToPhrasing(verses[activeIndex]);
        });
        document.getElementById('pzBtnBoardToAI')?.addEventListener('click', () => {
            if (activeIndex >= 0) sendVerseToAI(verses[activeIndex]);
        });

        document.getElementById('pzBtnFontDec').addEventListener('click', () => {
            currentFontSize = Math.max(20, currentFontSize - 4);
            stageText.style.fontSize = currentFontSize + 'px';
            document.getElementById('pzFontSizeLabel').textContent = currentFontSize + 'px';
            if (activeIndex >= 0) requestAnimationFrame(() => resizeCanvas(verses[activeIndex].drawData));
        });
        document.getElementById('pzBtnFontInc').addEventListener('click', () => {
            currentFontSize = Math.min(72, currentFontSize + 4);
            stageText.style.fontSize = currentFontSize + 'px';
            document.getElementById('pzFontSizeLabel').textContent = currentFontSize + 'px';
            if (activeIndex >= 0) requestAnimationFrame(() => resizeCanvas(verses[activeIndex].drawData));
        });

        const boardThemeSelect = document.getElementById('pzBoardThemeSelect');
        function applyBoardTheme(idx) {
            THEMES.forEach(t => boardOverlay.classList.remove(t.cls));
            themeIdx = ((idx % THEMES.length) + THEMES.length) % THEMES.length;
            const t = THEMES[themeIdx];
            boardOverlay.classList.add(t.cls);
            document.getElementById('pzBtnThemeToggle').textContent = t.label;
            if (boardThemeSelect) boardThemeSelect.value = String(themeIdx);
            try { localStorage.setItem('pizarra_theme_idx', String(themeIdx)); } catch (e) {}
        }

        if (boardThemeSelect) {
            boardThemeSelect.addEventListener('change', () => applyBoardTheme(parseInt(boardThemeSelect.value, 10)));
        }
        document.getElementById('pzBtnThemeToggle').addEventListener('click', () => applyBoardTheme(themeIdx + 1));

        document.getElementById('pzBtnCopyVerse').addEventListener('click', () => {
            if (activeIndex < 0) return;
            const v = verses[activeIndex];
            const headerTxt = v.version ? `${v.ref} (${v.version})` : v.ref;
            navigator.clipboard.writeText(`${headerTxt}\n${v.text}`).then(() => showToast('📋 Texto copiado'));
        });

        document.getElementById('pzBtnFullscreen').addEventListener('click', () => {
            if (!document.fullscreenElement) boardOverlay.requestFullscreen && boardOverlay.requestFullscreen();
            else document.exitFullscreen && document.exitFullscreen();
        });

        function drawRoundedRectPath(c, x, y, w, h, r) {
            const rad = Math.min(r, w / 2, h / 2);
            c.beginPath();
            c.moveTo(x + rad, y);
            c.arcTo(x + w, y, x + w, y + h, rad);
            c.arcTo(x + w, y + h, x, y + h, rad);
            c.arcTo(x, y + h, x, y, rad);
            c.arcTo(x, y, x + w, y, rad);
            c.closePath();
        }

        // Exportación PNG 1:1 nativa en Canvas (Capa 1 + Capa 2)
        document.getElementById('pzBtnSavePng').addEventListener('click', () => {
            if (activeIndex < 0) return;
            const v = verses[activeIndex];
            const out = document.createElement('canvas');
            out.width = canvas.width || Math.max(boardStage.clientWidth, boardStage.scrollWidth) || 1280;
            out.height = canvas.height || Math.max(boardStage.clientHeight, boardStage.scrollHeight) || 720;
            const octx = out.getContext('2d');
            const bgColors = ['#000000', '#111827', '#faf8f2'];
            const txtColors = ['#ffffff', '#f8fafc', '#1e293b'];

            octx.fillStyle = bgColors[themeIdx];
            octx.fillRect(0, 0, out.width, out.height);

            const stageRect = boardStage.getBoundingClientRect();
            const ox = -stageRect.left + boardStage.scrollLeft;
            const oy = -stageRect.top + boardStage.scrollTop;

            const refRect = stageRef.getBoundingClientRect();
            const refCs = getComputedStyle(stageRef);
            octx.save();
            octx.font = `${refCs.fontWeight || '700'} ${refCs.fontSize || '22px'} ${refCs.fontFamily || '"Segoe UI", sans-serif'}`;
            octx.fillStyle = refCs.color || (themeIdx === 2 ? '#b45309' : '#f5b922');
            octx.textBaseline = 'middle';
            octx.fillText(stageRef.textContent || v.ref, refRect.left + ox, refRect.top + oy + refRect.height / 2);
            octx.restore();

            if (v.version && stageVer.style.display !== 'none') {
                const verRect = stageVer.getBoundingClientRect();
                const verCs = getComputedStyle(stageVer);
                const vx = verRect.left + ox;
                const vy = verRect.top + oy;
                octx.save();
                drawRoundedRectPath(octx, vx, vy, verRect.width, verRect.height, 6);
                octx.fillStyle = verCs.backgroundColor || (themeIdx === 2 ? '#e2e8f0' : '#1f2636');
                octx.fill();
                octx.font = `${verCs.fontWeight || '700'} ${verCs.fontSize || '12px'} ${verCs.fontFamily || '"Segoe UI", sans-serif'}`;
                octx.fillStyle = verCs.color || (themeIdx === 2 ? '#334155' : '#cbd5e1');
                octx.textAlign = 'center';
                octx.textBaseline = 'middle';
                octx.fillText(stageVer.textContent || v.version, vx + verRect.width / 2, vy + verRect.height / 2);
                octx.restore();
            }

            stageText.querySelectorAll('.pz-verse-num').forEach(el => {
                const r = el.getBoundingClientRect();
                const cs = getComputedStyle(el);
                octx.save();
                octx.font = `${cs.fontWeight || '700'} ${cs.fontSize} ${cs.fontFamily}`;
                octx.fillStyle = cs.color || (themeIdx === 2 ? '#b45309' : '#f5b922');
                octx.textBaseline = 'middle';
                octx.fillText(el.textContent, r.left + ox, r.top + oy + r.height / 2);
                octx.restore();
            });

            const stageFontFamily = getComputedStyle(stageText).fontFamily || '"Segoe UI", sans-serif';
            stageText.querySelectorAll('.pz-w-tok').forEach(tok => {
                const r = tok.getBoundingClientRect();
                const x = r.left + ox;
                const y = r.top + oy;
                const w = r.width;
                const h = r.height;
                const cs = getComputedStyle(tok);
                const key = tok.dataset.widx;
                const mark = (v.wordMarks && v.wordMarks[key]) || null;

                octx.save();
                if (mark) {
                    const ma = typeof mark.alpha === 'number' ? mark.alpha : 0.35;
                    if (mark.style === 'highlight') {
                        drawRoundedRectPath(octx, x, y + 1, w, h - 2, 6);
                        octx.fillStyle = hexToRgba(mark.color, ma);
                        octx.fill();
                    } else if (mark.style === 'bottom-bar') {
                        const bh = Math.max(6, h * 0.34);
                        drawRoundedRectPath(octx, x, y + h - bh, w, bh, 4);
                        octx.fillStyle = hexToRgba(mark.color, Math.min(0.95, Math.max(0.25, ma + 0.25)));
                        octx.fill();
                    } else if (mark.style === 'solid-block') {
                        drawRoundedRectPath(octx, x, y + 1, w, h - 2, 5);
                        octx.fillStyle = hexToRgba(mark.color, Math.min(0.95, Math.max(0.35, ma + 0.35)));
                        octx.fill();
                    } else if (mark.style === 'arrow-left') {
                        const tip = Math.min(12, w * 0.25);
                        octx.beginPath();
                        octx.moveTo(x + tip, y + 1);
                        octx.lineTo(x + w, y + 1);
                        octx.lineTo(x + w, y + h - 1);
                        octx.lineTo(x + tip, y + h - 1);
                        octx.lineTo(x, y + h / 2);
                        octx.closePath();
                        octx.fillStyle = hexToRgba(mark.color, Math.min(0.9, ma + 0.08));
                        octx.fill();
                    } else if (mark.style === 'arrow-right') {
                        const tip = Math.min(12, w * 0.25);
                        octx.beginPath();
                        octx.moveTo(x, y + 1);
                        octx.lineTo(x + w - tip, y + 1);
                        octx.lineTo(x + w, y + h / 2);
                        octx.lineTo(x + w - tip, y + h - 1);
                        octx.lineTo(x, y + h - 1);
                        octx.closePath();
                        octx.fillStyle = hexToRgba(mark.color, Math.min(0.9, ma + 0.08));
                        octx.fill();
                    } else if (mark.style === 'arrow-both') {
                        const tip = Math.min(12, w * 0.22);
                        octx.beginPath();
                        octx.moveTo(x + tip, y + 1);
                        octx.lineTo(x + w - tip, y + 1);
                        octx.lineTo(x + w, y + h / 2);
                        octx.lineTo(x + w - tip, y + h - 1);
                        octx.lineTo(x + tip, y + h - 1);
                        octx.lineTo(x, y + h / 2);
                        octx.closePath();
                        octx.fillStyle = hexToRgba(mark.color, Math.min(0.9, ma + 0.08));
                        octx.fill();
                    } else if (mark.style === 'box' || mark.style === 'circle') {
                        drawRoundedRectPath(octx, x + 1, y + 1, w - 2, h - 2, mark.style === 'circle' ? h / 2 : 6);
                        octx.strokeStyle = mark.color;
                        octx.lineWidth = 2.5;
                        octx.stroke();
                    } else if (mark.style === 'triangle') {
                        octx.beginPath();
                        octx.moveTo(x + w / 2, y + 2);
                        octx.lineTo(x + w - 2, y + h - 2);
                        octx.lineTo(x + 2, y + h - 2);
                        octx.closePath();
                        octx.strokeStyle = mark.color;
                        octx.lineWidth = 2.5;
                        octx.stroke();
                    }
                }

                octx.font = `${cs.fontWeight || '400'} ${cs.fontSize || (currentFontSize + 'px')} ${stageFontFamily}`;
                octx.fillStyle = cs.color || txtColors[themeIdx];
                octx.textAlign = 'center';
                octx.textBaseline = 'middle';
                const padLTok = parseFloat(cs.paddingLeft) || 0;
                const padRTok = parseFloat(cs.paddingRight) || 0;
                const textCenterX = x + padLTok + (w - padLTok - padRTok) / 2;
                octx.fillText(tok.textContent, textCenterX, y + h / 2);

                if (mark && (mark.style === 'underline' || mark.style === 'dotted' || mark.style === 'dashed' || mark.style === 'wavy')) {
                    const uy = y + h - Math.max(3, currentFontSize * 0.08);
                    const padL = parseFloat(cs.paddingLeft) || 3;
                    const padR = parseFloat(cs.paddingRight) || 3;
                    const ux1 = x + padL;
                    const ux2 = x + w - padR;
                    octx.strokeStyle = mark.color;
                    octx.lineCap = 'round';
                    if (mark.style === 'underline') {
                        octx.lineWidth = 3;
                        octx.beginPath(); octx.moveTo(ux1, uy); octx.lineTo(ux2, uy); octx.stroke();
                    } else if (mark.style === 'dotted') {
                        octx.lineWidth = 3;
                        octx.setLineDash([2, 5]);
                        octx.beginPath(); octx.moveTo(ux1, uy); octx.lineTo(ux2, uy); octx.stroke();
                    } else if (mark.style === 'dashed') {
                        octx.lineWidth = 3;
                        octx.setLineDash([8, 5]);
                        octx.beginPath(); octx.moveTo(ux1, uy); octx.lineTo(ux2, uy); octx.stroke();
                    } else if (mark.style === 'wavy') {
                        octx.lineWidth = 2.5;
                        octx.beginPath();
                        const step = 6;
                        const amp = 2.5;
                        octx.moveTo(ux1, uy);
                        let dir = -1;
                        for (let px = ux1; px < ux2; px += step) {
                            const nx = Math.min(ux2, px + step);
                            octx.quadraticCurveTo((px + nx) / 2, uy + dir * amp, nx, uy);
                            dir *= -1;
                        }
                        octx.stroke();
                    }
                }
                octx.restore();
            });

            octx.drawImage(canvas, 0, 0);

            const a = document.createElement('a');
            a.download = v.ref.replace(/[:\s]+/g, '_') + '.png';
            a.href = out.toDataURL('image/png');
            a.click();
            showToast('⬇ Imagen PNG guardada con todas las marcas');
        });

        window.addEventListener('keydown', (e) => {
            if (!boardOverlay.classList.contains('open')) return;
            const tag = ((document.activeElement && document.activeElement.tagName) || '').toLowerCase();
            const isFormCtrl = tag === 'input' || tag === 'textarea' || tag === 'select';
            if (e.key === 'Escape') {
                e.stopPropagation();
                closeBoard();
                return;
            }
            if (isFormCtrl) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); if (activeIndex > 0) openBoard(activeIndex - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); if (activeIndex < verses.length - 1) openBoard(activeIndex + 1); }
            if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) toggleManualHide();
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); document.getElementById('pzBtnUndo').click(); }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); document.getElementById('pzBtnRedo').click(); }
        }, true);

        window.addEventListener('resize', () => {
            if (boardOverlay.classList.contains('open') && activeIndex >= 0) {
                resizeCanvas(verses[activeIndex].drawData);
            }
        });

        loadState();
        applyBoardTheme(themeIdx);
        renderList();
        applyWorkMode(workMode, true);
        if (verses.length === 0) {
            switchPzView('pz-view-config');
        } else {
            switchPzView('pz-view-verses');
        }
    });
})();
