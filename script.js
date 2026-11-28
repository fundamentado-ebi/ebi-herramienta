document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('.section');

        // INYECCIÓN AISLADA DEL IFRAME MARKUP (Desde <template> autocontenido)
        const tplMarkup = document.getElementById('markup-raw-content');
        const iframe = document.getElementById('markup-iframe');
        if (tplMarkup && iframe) {
            const rawHTML = tplMarkup.innerHTML;
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(rawHTML);
            doc.close();
            const adjustIframeHeight = () => {
                try {
                    const h = Math.max(doc.documentElement.scrollHeight || 0, doc.body ? doc.body.scrollHeight : 0);
                    if (h > 400) iframe.style.height = (h + 40) + 'px';
                } catch (e) {}
            };
            iframe.onload = () => {
                adjustIframeHeight();
                try {
                    doc.addEventListener('toggle', () => setTimeout(adjustIframeHeight, 60), true);
                    if (typeof ResizeObserver !== 'undefined' && doc.body) {
                        new ResizeObserver(adjustIframeHeight).observe(doc.body);
                    }
                } catch (e) {}
            };
        }

        // Inicializar componentes interactivos de Sub-pestaña 1.5 (Explicación Markup)
        if (typeof initExplicacionMarkup === 'function') {
            initExplicacionMarkup();
        }

        // 1. Ocultar todas excepto Paso 1
        sections.forEach(sec => sec.style.display = 'none');
        const firstSection = document.getElementById('paso1');
        if (firstSection) firstSection.style.display = 'block';

        // Navegación principal gestionada por selectMainSection() del menú lateral
    });

    // 3. Función GENÉRICA para las Sub-Pestañas de los Pasos (Ej: Paso 3, 4 y 5)
    function openSubTab(event, tabId, groupClass) {
        const contents = document.querySelectorAll('.' + groupClass + '-content');
        contents.forEach(c => c.classList.remove('active'));

        const buttons = document.querySelectorAll('.' + groupClass + '-btn');
        buttons.forEach(b => b.classList.remove('active'));

        const targetEl = document.getElementById(tabId);
        if (targetEl) targetEl.classList.add('active');

        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        } else {
            buttons.forEach(b => {
                const oc = b.getAttribute('onclick') || '';
                if (oc.includes(`'${tabId}'`)) b.classList.add('active');
            });
        }

        document.querySelectorAll('.sidebar-sub-btn').forEach(sb => {
            sb.classList.toggle('active-sub', sb.getAttribute('data-subtab') === tabId);
        });
        if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
    }

    // 4. Función exclusiva para las sub-pestañas INTERNAS de Colores
    function openColorTab(event, tabName) {
        const tabContents = document.getElementsByClassName('color-tab-content-inner');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }

        const tabButtons = document.getElementsByClassName('color-tab-button');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('active');
        }

        document.getElementById(tabName).classList.add('active');
        if (event) {
            event.currentTarget.classList.add('active');
        }
    }

    // goToShortcut definido en el controlador de navegación lateral (más abajo)

    // Corrección dinámica global de los bordes para tooltips en pantalla principal
    document.addEventListener('mouseover', function (e) {
        const target = e.target.closest('.info-icon, .gram-term');
        if (target) {
            const tooltip = target.querySelector('.tooltip');
            if (tooltip) {
                // Resetear el tooltip a estilos por defecto
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';

                const rect = tooltip.getBoundingClientRect();
                // Si se corta por la izquierda
                if (rect.left < 10) {
                    tooltip.style.left = '0';
                    tooltip.style.transform = 'translateX(0)';
                }
                // Si se corta por la derecha
                else if (rect.right > window.innerWidth - 10) {
                    tooltip.style.left = 'auto';
                    tooltip.style.right = '0';
                    tooltip.style.transform = 'translateX(0)';
                }
            }
        }
    });

    // 5. Scroll To Top
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('scroll', function () {
        const backToTop = document.querySelector('.back-to-top');
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    // 6. MESA DE TRABAJO V2 (Motor Phrasing, Notas, Lentes, Exportación)
    document.addEventListener('DOMContentLoaded', () => {
        const workspace = document.querySelector('.interactive-workspace');
        if (!workspace) return;

        // Helper: abrir URL sin popup blocker
        function openURL(url) {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // =====================================================
        // SELECTOR DE PASAJE BÍBLICO
        // =====================================================
        let activeBibleRef = JSON.parse(localStorage.getItem('activeBibleRef')) || null;

        const phrasingVerSel = document.getElementById('phrasingBibleVersion');
        const bookSelect     = document.getElementById('bibleBook');
        const chapterInput   = document.getElementById('bibleChapter');
        const verseStartInput= document.getElementById('bibleVerseStart');
        const verseEndInput  = document.getElementById('bibleVerseEnd');
        const btnOpenBG      = document.getElementById('btnOpenBibleGateway');
        const btnSetActive   = document.getElementById('btnSetActivePassage');
        const badge          = document.getElementById('activePassageBadge');
        const badgeLabel     = document.getElementById('activePassageLabel');

        function updatePassageBadge() {
            if (activeBibleRef) {
                const { bookName, chapter, verseStart, verseEnd, version } = activeBibleRef;
                const verSuffix = version ? ` (${version})` : '';
                badgeLabel.textContent = `${bookName} ${chapter}:${verseStart}–${verseEnd}${verSuffix}`;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }

        // Restaurar badge al cargar
        updatePassageBadge();
        // Restaurar selects al pasaje guardado
        if (activeBibleRef && bookSelect) {
            for (let i = 0; i < bookSelect.options.length; i++) {
                const parts = bookSelect.options[i].value.split('|');
                if (parts[0] === activeBibleRef.bookName) {
                    bookSelect.selectedIndex = i; break;
                }
            }
            if (chapterInput)    chapterInput.value    = activeBibleRef.chapter;
            if (verseStartInput) verseStartInput.value = activeBibleRef.verseStart;
            if (verseEndInput)   verseEndInput.value   = activeBibleRef.verseEnd;
            if (phrasingVerSel && activeBibleRef.version) phrasingVerSel.value = activeBibleRef.version;
        }

        // Botón: Abrir en BibleGateway (versión seleccionada)
        if (btnOpenBG) {
            btnOpenBG.addEventListener('click', () => {
                const parts   = bookSelect.value.split('|'); // [bookName, testament, abbrev]
                const book    = parts[0];
                const chapter = chapterInput.value || '1';
                const vStart  = verseStartInput.value || '1';
                const vEnd    = parseInt(verseEndInput.value, 10) >= parseInt(vStart, 10) ? verseEndInput.value : vStart;
                const verKey  = phrasingVerSel ? phrasingVerSel.value : 'LBLA';
                const bgVerMap = { DHH94I: 'DHH', DHHS94: 'DHH', TLAI: 'TLA' };
                const bgVer   = bgVerMap[verKey] || verKey;
                const search  = encodeURIComponent(`${book} ${chapter}:${vStart}-${vEnd}`);
                const url     = `https://www.biblegateway.com/passage/?search=${search}&version=${encodeURIComponent(bgVer)}`;
                openURL(url);
            });
        }

        // =====================================================
        // CARGAR TEXTO BÍBLICO A FRASEO (9 Biblias locales biblias/ -> Fallback bolls.life)
        // =====================================================
        const bookToNumber = {
            'Génesis':1,'Éxodo':2,'Levítico':3,'Números':4,'Deuteronomio':5,
            'Josué':6,'Jueces':7,'Rut':8,'1 Samuel':9,'2 Samuel':10,
            '1 Reyes':11,'2 Reyes':12,'1 Crónicas':13,'2 Crónicas':14,
            'Esdras':15,'Nehemías':16,'Ester':17,'Job':18,'Salmos':19,
            'Proverbios':20,'Eclesiastés':21,'Cantares':22,'Isaías':23,
            'Jeremías':24,'Lamentaciones':25,'Ezequiel':26,'Daniel':27,
            'Oseas':28,'Joel':29,'Amós':30,'Abdías':31,'Jonás':32,
            'Miqueas':33,'Nahum':34,'Habacuc':35,'Sofonías':36,
            'Hageo':37,'Zacarías':38,'Malaquías':39,'Mateo':40,
            'Marcos':41,'Lucas':42,'Juan':43,'Hechos':44,'Romanos':45,
            '1 Corintios':46,'2 Corintios':47,'Gálatas':48,'Efesios':49,
            'Filipenses':50,'Colosenses':51,'1 Tesalonicenses':52,'2 Tesalonicenses':53,
            '1 Timoteo':54,'2 Timoteo':55,'Tito':56,'Filemón':57,
            'Hebreos':58,'Santiago':59,'1 Pedro':60,'2 Pedro':61,
            '1 Juan':62,'2 Juan':63,'3 Juan':64,'Judas':65,'Apocalipsis':66
        };

        const btnLoadText = document.getElementById('btnLoadPassageText');
        if (btnLoadText) {
            btnLoadText.addEventListener('click', async () => {
                const parts    = bookSelect.value.split('|');
                const bookName = parts[0];
                const verKey   = phrasingVerSel ? phrasingVerSel.value : 'LBLA';
                const chapter  = parseInt(chapterInput.value, 10)    || 1;
                const vStart   = parseInt(verseStartInput.value, 10) || 1;
                const rawEnd   = parseInt(verseEndInput.value, 10)   || vStart;
                const vEnd     = rawEnd >= vStart ? rawEnd : vStart;

                // Confirmar si ya hay contenido
                if (workspace.textContent.trim() && !confirm('¿Deseas reemplazar el contenido actual de Fraseo con el nuevo pasaje?')) {
                    return;
                }

                // Estado de carga
                btnLoadText.disabled = true;
                const originalHTML = btnLoadText.innerHTML;
                btnLoadText.innerHTML = '⏳ Cargando...';
                btnLoadText.style.opacity = '0.7';

                try {
                    let filtered = [];

                    // 1. Intentar primero desde las 9 Biblias locales de Pizarra/biblias/
                    if (window.ExegesisBibleStore && typeof window.ExegesisBibleStore.getVersesForPassage === 'function') {
                        filtered = await window.ExegesisBibleStore.getVersesForPassage(verKey, bookName, chapter, vStart, vEnd);
                    }

                    // 2. Respaldo online vía bolls.life (ej. cuando se abre por file:// sin servidor)
                    if (!filtered || filtered.length === 0) {
                        const bookNum = bookToNumber[bookName];
                        if (!bookNum) throw new Error(`Libro "${bookName}" no reconocido`);
                        const bollsVerMap = { RVR1960: 'RV1960', DHH94I: 'DHH', DHHS94: 'DHH' };
                        const apiVer = bollsVerMap[verKey] || verKey;
                        const url = `https://bolls.life/get-text/${encodeURIComponent(apiVer)}/${bookNum}/${chapter}/`;
                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`No disponible offline ni en API (${response.status})`);
                        const allVerses = await response.json();
                        filtered = allVerses.filter(v => v.verse >= vStart && v.verse <= vEnd);
                    }

                    if (filtered.length > 0) {
                        workspace.innerHTML = '';

                        filtered.forEach(v => {
                            const line = document.createElement('div');
                            line.className = 'phrase-line';
                            line.innerHTML = createPhraseLineHTML();
                            const cleanText = String(v.text || '').replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                            line.querySelector('.phrase-text').textContent = `${v.verse} ${cleanText}`;
                            workspace.appendChild(line);
                        });

                        saveWorkspace();

                        // Fijar como pasaje activo automáticamente
                        const testament = parts[1];
                        const abbrev   = parts[2];
                        activeBibleRef = { bookName, testament, abbrev, chapter, verseStart: vStart, verseEnd: vEnd, version: verKey };
                        localStorage.setItem('activeBibleRef', JSON.stringify(activeBibleRef));
                        updatePassageBadge();

                        // Auto-copiar texto completo al Asistente Exegético IA
                        const plainVerses = filtered.map(v => {
                            const clean = String(v.text || '').replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                            return `${v.verse} ${clean}`;
                        }).join('\n');
                        syncPassageToAI(bookName, chapter, vStart, vEnd, plainVerses);

                        // Feedback visual
                        btnLoadText.innerHTML = `✅ ¡Cargado (${verKey})!`;
                        btnLoadText.style.background = 'rgba(16,185,129,0.35)';
                        btnLoadText.style.opacity = '1';
                    } else {
                        throw new Error(`No se encontraron versículos ${vStart}-${vEnd} en ${bookName} ${chapter} (${verKey})`);
                    }
                } catch (err) {
                    console.error('Error al cargar pasaje:', err);
                    btnLoadText.innerHTML = '❌ Error';
                    btnLoadText.style.background = 'rgba(239,68,68,0.3)';
                    btnLoadText.style.opacity = '1';
                    alert('No se pudo cargar el texto automáticamente.\n\n' + err.message + '\n\nPuedes cargarlo desde Pizarra (📚 Biblia Local .json) o usar BibleGateway.');
                }

                setTimeout(() => {
                    btnLoadText.disabled = false;
                    btnLoadText.innerHTML = originalHTML;
                    btnLoadText.style.background = '';
                    btnLoadText.style.opacity = '1';
                }, 2500);
            });
        }

        // Puente receptor desde la Pizarra Interactiva (botón "📐 Fraseo")
        window.loadPassageIntoPhrasing = function (payload) {
            if (!payload || !payload.text) return;
            workspace.innerHTML = '';
            const rawLines = String(payload.text).split('\n').map(l => l.trim()).filter(Boolean);
            rawLines.forEach((ln, idx) => {
                const line = document.createElement('div');
                line.className = 'phrase-line';
                line.innerHTML = createPhraseLineHTML();
                const prefix = (idx === 0 && payload.verseNum && !/^\d+\s+/.test(ln)) ? `${payload.verseNum} ` : '';
                line.querySelector('.phrase-text').textContent = prefix + ln;
                workspace.appendChild(line);
            });
            saveWorkspace();

            if (payload.bookName) {
                activeBibleRef = {
                    bookName: payload.bookName,
                    testament: payload.testament || 'NT',
                    abbrev: payload.abbrev || '',
                    chapter: payload.chapter || 1,
                    verseStart: payload.vStart || 1,
                    verseEnd: payload.vEnd || payload.vStart || 1,
                    version: payload.version || 'LBLA'
                };
                localStorage.setItem('activeBibleRef', JSON.stringify(activeBibleRef));
                updatePassageBadge();
                if (bookSelect) {
                    for (let i = 0; i < bookSelect.options.length; i++) {
                        if (bookSelect.options[i].value.split('|')[0] === payload.bookName) {
                            bookSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                if (chapterInput) chapterInput.value = activeBibleRef.chapter;
                if (verseStartInput) verseStartInput.value = activeBibleRef.verseStart;
                if (verseEndInput) verseEndInput.value = activeBibleRef.verseEnd;
                if (phrasingVerSel && payload.version && phrasingVerSel.querySelector(`option[value="${payload.version}"]`)) {
                    phrasingVerSel.value = payload.version;
                }
                syncPassageToAI(activeBibleRef.bookName, activeBibleRef.chapter, activeBibleRef.verseStart, activeBibleRef.verseEnd, payload.text);
            }
        };

        // Botón: Fijar como pasaje activo
        if (btnSetActive) {
            btnSetActive.addEventListener('click', () => {
                const parts    = bookSelect.value.split('|');
                const bookName = parts[0];
                const testament= parts[1];  // AT o NT
                const abbrev   = parts[2];  // Jn, Ro, Gn...
                const chapter  = parseInt(chapterInput.value)    || 1;
                const vStart   = parseInt(verseStartInput.value) || 1;
                const vEnd     = parseInt(verseEndInput.value)   || vStart;

                activeBibleRef = { bookName, testament, abbrev, chapter, verseStart: vStart, verseEnd: vEnd };
                localStorage.setItem('activeBibleRef', JSON.stringify(activeBibleRef));
                updatePassageBadge();

                // Auto-copiar referencia al Asistente Exegético IA
                syncPassageToAI(bookName, chapter, vStart, vEnd);

                // Animación de confirmación
                btnSetActive.textContent = '✅ ¡Pasaje fijado!';
                btnSetActive.style.background = 'rgba(16,185,129,0.25)';
                btnSetActive.style.borderColor = 'rgba(16,185,129,0.6)';
                btnSetActive.style.color = '#10b981';
                setTimeout(() => {
                    btnSetActive.textContent = '✅ Fijar como pasaje activo';
                    btnSetActive.style.background = 'rgba(138,79,255,0.15)';
                    btnSetActive.style.borderColor = 'rgba(138,79,255,0.4)';
                    btnSetActive.style.color = '#a78bfa';
                }, 2000);
            });
        }

        // Exponer getter global para el menú contextual
        window.getActiveBibleRef = () => activeBibleRef;

        // Helper: sincronizar pasaje bíblico al textarea del Asistente IA
        function syncPassageToAI(bookName, chapter, vStart, vEnd, fullText) {
            const aiInput = document.getElementById('aiInput');
            if (aiInput) {
                const currentVal = aiInput.value.trim().toLowerCase();
                // Solo escribir si está vacío o no tiene instrucciones del usuario
                if (!currentVal || (!currentVal.includes('etapa') && !currentVal.includes('procede') && !currentVal.includes('continúa') && !currentVal.includes('continua'))) {
                    const verseRange = vStart === vEnd ? `${vStart}` : `${vStart}-${vEnd}`;
                    const header = `${bookName} ${chapter}:${verseRange}`;
                    if (fullText) {
                        aiInput.value = `${header}\n\n${fullText}`;
                    } else {
                        aiInput.value = header;
                    }
                }
            }
        }


        // Configuraciones de Inicialización
        workspace.removeAttribute('contenteditable'); // El div padre ya no es editable, sólo los divs internos
        
        // Mapeo de compatibilidad con códigos anteriores guardados en localStorage
        const LEGACY_TYPE_MAP = {
            'F-NM': 'U', 'F-CONJ': 'C', 'F-PREP': 'PR', 'F-GEN': 'GEN',
            'F-REL': 'REL', 'F-PART': 'PA', 'F-INF': 'INF', 'F-AP': 'AP', 'F-SUST': 'SUB'
        };

        // ==========================================
        // A. MOTOR PHRASING DIALS (9 Frases, 3 Flechas, 19 Genitivos + 27 Subordinadas)
        // ==========================================
        function createPhraseLineHTML() {
            return `
                <div class="phrase-selectors">
                    <select class="phrase-type" aria-label="Tipo de frase (9 tipos Biblearc)">
                        <option value="" data-bg="" data-color="">- Tipo (9) -</option>
                        <option value="U" data-bg="#f3f4f6" data-color="#374151">[U 🩶] No marcada</option>
                        <option value="C" data-bg="#e5e7eb" data-color="#374151">[C 🩶] Conjunción</option>
                        <option value="PR" data-bg="#ffedd5" data-color="#c2410c">[PR 🟠] Preposicional</option>
                        <option value="GEN" data-bg="#dbeafe" data-color="#1d4ed8">[GEN 🔵] Genitiva</option>
                        <option value="REL" data-bg="#f3e8ff" data-color="#6f42c1">[REL 🟣] Relativa</option>
                        <option value="PA" data-bg="#dcfce7" data-color="#166534">[PA 🟢] Participio</option>
                        <option value="INF" data-bg="#dcfce7" data-color="#15803d">[INF 🟢] Infinitivo</option>
                        <option value="AP" data-bg="#fee2e2" data-color="#b91b1c">[AP 🔴] Aposicional</option>
                        <option value="SUB" data-bg="#fee2e2" data-color="#991b1b">[SUB 🔴] Sustantival</option>
                    </select>
                    <select class="logic-rel" aria-label="Etiqueta de relación DIALS">
                        <option value="" data-bg="" data-color="">- Etiqueta DIALS -</option>
                        <optgroup class="og-gen" label="🟦 19 Genitivas (Flecha Azul)">
                            <option value="GEN-POSS">Posesivo (Possessive)</option>
                            <option value="GEN-REL">Relación (Relationship)</option>
                            <option value="GEN-PART">Partitivo (Partitive)</option>
                            <option value="GEN-ATTR">Atributivo (Attributive)</option>
                            <option value="GEN-ATTRD">Atribuido (Attributed)</option>
                            <option value="GEN-PROD">Productor (Producer)</option>
                            <option value="GEN-PRDT">Producto (Product)</option>
                            <option value="GEN-MAT">Material (Material)</option>
                            <option value="GEN-CONT">Contenido (Contents)</option>
                            <option value="GEN-SUB">Subordinación (Subordination)</option>
                            <option value="GEN-SEP">Separación (Separation)</option>
                            <option value="GEN-ORIG">Origen / Fuente (Origin/Source)</option>
                            <option value="GEN-REF">Referencia (Reference)</option>
                            <option value="GEN-APP">Aposición (Apposition)</option>
                            <option value="GEN-SUBJ">Subjetivo (Subjective)</option>
                            <option value="GEN-OBJ">Objetivo (Objective)</option>
                            <option value="GEN-TIME">Tiempo (Time)</option>
                            <option value="GEN-LOC">Lugar (Location)</option>
                            <option value="GEN-DESC">Descriptivo (Descriptive)</option>
                        </optgroup>
                        <optgroup class="og-sub" label="🟨 Declaración Distinta (11)">
                            <option value="SUB-GND">Fundamento (Ground)</option>
                            <option value="SUB-RES">Resultado (Result)</option>
                            <option value="SUB-PUR">Propósito (Purpose)</option>
                            <option value="SUB-ADV">↳ Ventaja (Advantage)</option>
                            <option value="SUB-DIS">↳ Desventaja (Disadvantage)</option>
                            <option value="SUB-COND">Condición (Condition)</option>
                            <option value="SUB-TEMP">Temporal (Temporal)</option>
                            <option value="SUB-LOC">Locativa (Locative)</option>
                            <option value="SUB-SRC">↳ Fuente (Source)</option>
                            <option value="SUB-DEST">↳ Destino (Destination)</option>
                            <option value="SUB-SEP">↳ Separación (Separation)</option>
                        </optgroup>
                        <optgroup class="og-sub" label="🟨 Reiteración (15)">
                            <option value="SUB-MAN">Manera (Manner)</option>
                            <option value="SUB-MNS">↳ Medios (Means)</option>
                            <option value="SUB-AGN">↳ Agencia (Agency)</option>
                            <option value="SUB-CMP">Comparación (Comparison)</option>
                            <option value="SUB-STD">↳ Estándar (Standard)</option>
                            <option value="SUB-NEG">Negativa (Negative)</option>
                            <option value="SUB-SUBS">↳ Sustitución (Substitution)</option>
                            <option value="SUB-EXP">Explicación (Explanation)</option>
                            <option value="SUB-CNT">↳ Contenido (Content)</option>
                            <option value="SUB-CTX">↳ Contexto (Context)</option>
                            <option value="SUB-DST">↳ Distinción (Distinction)</option>
                            <option value="SUB-EXM">↳ Ejemplo (Example)</option>
                            <option value="SUB-ACC">↳ Acompañamiento (Accompaniment)</option>
                            <option value="SUB-REF">↳ Referencia (Reference)</option>
                            <option value="SUB-ANS">Respuesta (Answer)</option>
                        </optgroup>
                        <optgroup class="og-sub" label="🟨 Declaración Contraria (1)">
                            <option value="SUB-CSV">Concesiva (Concessive)</option>
                        </optgroup>
                    </select>
                </div>
                <span class="dials-arrow" aria-hidden="true">└─▶</span>
                <div class="phrase-text" contenteditable="true" aria-placeholder="Escribe o pega aquí..."></div>
            `;
        }

        // Sincroniza color de badge, color de flecha (🟦/🟩/🟨) y menú de relaciones según reglas oficiales de Biblearc
        function syncDialsLineState(lineEl) {
            if (!lineEl) return;
            const typeSel = lineEl.querySelector('select.phrase-type');
            const relSel  = lineEl.querySelector('select.logic-rel');
            let arrowEl   = lineEl.querySelector('.dials-arrow');
            if (!arrowEl) {
                const txtEl = lineEl.querySelector('.phrase-text');
                if (txtEl) {
                    arrowEl = document.createElement('span');
                    arrowEl.className = 'dials-arrow';
                    arrowEl.setAttribute('aria-hidden', 'true');
                    arrowEl.textContent = '└─▶';
                    lineEl.insertBefore(arrowEl, txtEl);
                }
            }
            if (!typeSel || !relSel) return;

            // Migrar valores antiguos si vienen de localStorage previo
            const rawVal = typeSel.value || typeSel.getAttribute('data-val') || '';
            if (LEGACY_TYPE_MAP[rawVal]) {
                typeSel.value = LEGACY_TYPE_MAP[rawVal];
            }

            const tOpt = typeSel.options[typeSel.selectedIndex];
            typeSel.style.backgroundColor = (tOpt && tOpt.getAttribute('data-bg')) || '';
            typeSel.style.color = (tOpt && tOpt.getAttribute('data-color')) || '';

            const tVal = typeSel.value;
            const indentPx = parseInt(lineEl.style.marginLeft || '0', 10) || 0;
            const genGroups = relSel.querySelectorAll('optgroup.og-gen');
            const subGroups = relSel.querySelectorAll('optgroup.og-sub');
            const firstOpt  = relSel.options[0];

            // Regla oficial Biblearc:
            // - [GEN]: Flecha Azul + 19 relaciones genitivas
            // - [REL]: Flecha Verde + NUNCA lleva etiqueta
            // - [PR, PA, INF, AP, SUB] o línea sangrada: Flecha Amarilla + 27 relaciones subordinadas
            // - [U, C] sin sangrar: proposición principal / conector sin flecha ni etiqueta
            if (tVal === 'REL') {
                relSel.value = '';
                relSel.disabled = true;
                if (firstOpt) firstOpt.textContent = '🟩 Sin etiqueta (Rel.)';
                relSel.style.backgroundColor = '#dcfce7';
                relSel.style.color = '#166534';
                if (arrowEl) arrowEl.className = 'dials-arrow visible arr-rel';
            } else if (tVal === 'GEN') {
                relSel.disabled = false;
                if (firstOpt) firstOpt.textContent = '🟦 - 19 Genitivos -';
                genGroups.forEach(g => { g.disabled = false; g.hidden = false; });
                subGroups.forEach(g => { g.disabled = true; g.hidden = true; });
                if (relSel.value && !relSel.value.startsWith('GEN-')) relSel.value = '';
                relSel.style.backgroundColor = relSel.value ? '#dbeafe' : '';
                relSel.style.color = relSel.value ? '#1d4ed8' : '';
                if (arrowEl) arrowEl.className = 'dials-arrow visible arr-gen';
            } else if (['PR', 'PA', 'INF', 'AP', 'SUB'].includes(tVal) || indentPx > 0) {
                relSel.disabled = false;
                if (firstOpt) firstOpt.textContent = '🟨 - 27 Subordinadas -';
                genGroups.forEach(g => { g.disabled = true; g.hidden = true; });
                subGroups.forEach(g => { g.disabled = false; g.hidden = false; });
                if (relSel.value && relSel.value.startsWith('GEN-')) relSel.value = '';
                relSel.style.backgroundColor = relSel.value ? '#fef9c3' : '';
                relSel.style.color = relSel.value ? '#854d0e' : '';
                if (arrowEl) arrowEl.className = 'dials-arrow visible arr-sub';
            } else {
                relSel.disabled = false;
                if (firstOpt) firstOpt.textContent = '- Etiqueta DIALS -';
                genGroups.forEach(g => { g.disabled = false; g.hidden = false; });
                subGroups.forEach(g => { g.disabled = false; g.hidden = false; });
                relSel.style.backgroundColor = '';
                relSel.style.color = '';
                if (arrowEl) arrowEl.className = 'dials-arrow';
            }
        }

        // Cargar Autoguardado y actualizar líneas existentes al modelo DIALS canónico
        const savedData = localStorage.getItem('exegesisWorkSpaceV2');
        if (savedData && savedData.trim() !== '') {
            workspace.innerHTML = savedData;
            workspace.querySelectorAll('.phrase-line').forEach(line => {
                const oldType = line.querySelector('select.phrase-type');
                const oldRel  = line.querySelector('select.logic-rel');
                const savedTypeVal = oldType ? (oldType.getAttribute('data-val') || oldType.value || '') : '';
                const savedRelVal  = oldRel ? (oldRel.getAttribute('data-val') || oldRel.value || '') : '';
                // Si viene de una versión anterior sin optgroups .og-gen/.og-sub, actualizar selectores preservando texto y notas
                if (oldRel && !oldRel.querySelector('optgroup.og-gen')) {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = createPhraseLineHTML();
                    const freshSelectors = tmp.querySelector('.phrase-selectors');
                    const curSelectors = line.querySelector('.phrase-selectors');
                    if (curSelectors && freshSelectors) {
                        line.replaceChild(freshSelectors, curSelectors);
                    }
                }
                const newType = line.querySelector('select.phrase-type');
                const newRel  = line.querySelector('select.logic-rel');
                if (newType && savedTypeVal) {
                    newType.value = LEGACY_TYPE_MAP[savedTypeVal] || savedTypeVal;
                }
                if (newRel && savedRelVal && newRel.querySelector(`option[value="${savedRelVal}"]`)) {
                    newRel.value = savedRelVal;
                }
                syncDialsLineState(line);
            });
        }

        // Función de Guardado Automático
        function saveWorkspace() {
            workspace.querySelectorAll('select.logic-rel, select.phrase-type').forEach(sel => {
                sel.setAttribute('data-val', sel.value);
            });
            localStorage.setItem('exegesisWorkSpaceV2', workspace.innerHTML);
        }

        workspace.addEventListener('input', saveWorkspace);

        // Reaccionar al cambio del menú desplegable: Sincronizar flecha/etiqueta DIALS y Guardar
        workspace.addEventListener('change', (e) => {
            const line = e.target.closest('.phrase-line');
            if (line) syncDialsLineState(line);
            saveWorkspace();
        });

        // Seguimiento de la última línea activa para los botones de la barra DIALS
        let lastActivePhraseLine = null;
        workspace.addEventListener('focusin', (e) => {
            const ln = e.target.closest('.phrase-line');
            if (ln) lastActivePhraseLine = ln;
        });

        document.getElementById('btnDialsAddLine')?.addEventListener('click', () => {
            const newLine = document.createElement('div');
            newLine.className = 'phrase-line';
            newLine.innerHTML = createPhraseLineHTML();
            if (lastActivePhraseLine && workspace.contains(lastActivePhraseLine)) {
                newLine.style.marginLeft = lastActivePhraseLine.style.marginLeft || '0px';
                lastActivePhraseLine.parentNode.insertBefore(newLine, lastActivePhraseLine.nextSibling);
            } else {
                workspace.appendChild(newLine);
            }
            syncDialsLineState(newLine);
            lastActivePhraseLine = newLine;
            newLine.querySelector('.phrase-text')?.focus();
            saveWorkspace();
        });

        function adjustLineIndent(deltaPx) {
            const targetLine = (lastActivePhraseLine && workspace.contains(lastActivePhraseLine))
                ? lastActivePhraseLine
                : workspace.querySelector('.phrase-line:last-child');
            if (!targetLine) return;
            const cur = parseInt(targetLine.style.marginLeft || '0', 10) || 0;
            const next = Math.max(0, cur + deltaPx);
            targetLine.style.marginLeft = next + 'px';
            syncDialsLineState(targetLine);
            saveWorkspace();
        }

        document.getElementById('btnDialsIndent')?.addEventListener('click', () => adjustLineIndent(30));
        document.getElementById('btnDialsOutdent')?.addEventListener('click', () => adjustLineIndent(-30));

        // Interceptar pegado inicial masivo
        workspace.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            
            // Si está vacío, inyecta la plantilla matriz
            if (workspace.children.length === 0) {
                const newLine = document.createElement('div');
                newLine.className = 'phrase-line';
                newLine.innerHTML = createPhraseLineHTML();
                newLine.querySelector('.phrase-text').textContent = text;
                workspace.appendChild(newLine);
            } else {
                // Pega donde caiga limpiamente
                document.execCommand('insertText', false, text);
            }
            saveWorkspace();
        });

        // Click en área vacía crea bloque inicial si no hay
        workspace.addEventListener('click', (e) => {
            if (e.target === workspace && workspace.children.length === 0) {
                const newLine = document.createElement('div');
                newLine.className = 'phrase-line';
                newLine.innerHTML = createPhraseLineHTML();
                workspace.appendChild(newLine);
                newLine.querySelector('.phrase-text').focus();
            }
        });

        // Dominio del Teclado (Enter y Tab)
        workspace.addEventListener('keydown', (e) => {
            const currentTextNode = e.target.closest('.phrase-text');
            if (!currentTextNode) return;
            const currentLine = currentTextNode.closest('.phrase-line');

            // 1. ENTER -> Rompe y baja a nueva línea
            if (e.key === 'Enter') {
                e.preventDefault();
                const sel = window.getSelection();
                if (!sel.rangeCount) return;
                const range = sel.getRangeAt(0);

                // Sacamos lo que está a la derecha del cursor
                const postCursorRange = document.createRange();
                postCursorRange.setStart(range.endContainer, range.endOffset);
                postCursorRange.setEndAfter(currentTextNode.lastChild || currentTextNode);
                const extracted = postCursorRange.extractContents();

                // Construimos la nueva línea
                const newLine = document.createElement('div');
                newLine.className = 'phrase-line';
                newLine.innerHTML = createPhraseLineHTML();
                newLine.style.marginLeft = currentLine.style.marginLeft || '0px'; // heredamos sangría

                // Inyectamos lo extraído (o lo dejamos en blanco)
                newLine.querySelector('.phrase-text').appendChild(extracted);
                
                // Lo metemos al flujo
                currentLine.parentNode.insertBefore(newLine, currentLine.nextSibling);
                syncDialsLineState(newLine);

                // Mover cursor
                const newRange = document.createRange();
                newRange.setStart(newLine.querySelector('.phrase-text'), 0);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
                
                saveWorkspace();
            }

            // 2. TAB -> Margin Left (Sangría + Flecha DIALS)
            if (e.key === 'Tab') {
                e.preventDefault();
                let currentMargin = parseInt(currentLine.style.marginLeft || '0', 10);
                if (e.shiftKey) {
                    currentMargin = Math.max(0, currentMargin - 30);
                } else {
                    currentMargin += 30;
                }
                currentLine.style.marginLeft = currentMargin + 'px';
                syncDialsLineState(currentLine);
                saveWorkspace();
            }
        });

        // ==========================================
        // B. SISTEMA DE LENTES (OPACIDAD / CAPAS)
        // ==========================================
        const toggleGrammar = document.getElementById('toggleGrammar');
        const toggleNotes = document.getElementById('toggleNotes');
        const toggleStructure = document.getElementById('toggleStructure');

        function updateLenses() {
            if (toggleGrammar) workspace.classList.toggle('hide-colors', !toggleGrammar.checked);
            if (toggleNotes) workspace.classList.toggle('hide-notes', !toggleNotes.checked);
            if (toggleStructure) workspace.classList.toggle('hide-structure', !toggleStructure.checked);
        }
        
        [toggleGrammar, toggleNotes, toggleStructure].forEach(t => {
            if (t) t.addEventListener('change', updateLenses);
        });

        // ==========================================
        // C. NOTAS EXEGÉTICAS (Context Menu)
        // ==========================================
        const noteModal = document.getElementById('exegesisNoteModal');
        const noteInput = document.getElementById('exegesisNoteInput');
        const saveNoteBtn = document.getElementById('saveNoteBtn');
        const cancelNoteBtn = document.getElementById('cancelNoteBtn');
        const deleteNoteBtn = document.getElementById('deleteNoteBtn');
        const noteViewer = document.getElementById('noteViewer');
        
        let activeNoteSpan = null;

        // ==========================================
        // MENÚ CONTEXTUAL PERSONALIZADO
        // ==========================================
        const customContextMenu = document.createElement('div');
        customContextMenu.id = 'wordContextMenu';
        customContextMenu.style.cssText = `
            position: absolute;
            z-index: 99999;
            background: #1e1e2e;
            border: 1px solid rgba(138,79,255,0.4);
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(138,79,255,0.15);
            padding: 6px;
            min-width: 220px;
            display: none;
            flex-direction: column;
            gap: 3px;
            font-family: 'Segoe UI', sans-serif;
            animation: fadeInMenu 0.15s ease;
        `;
        document.head.insertAdjacentHTML('beforeend', `<style>
            @keyframes fadeInMenu { from { opacity:0; transform: scale(0.95) translateY(-4px); } to { opacity:1; transform: scale(1) translateY(0); } }
            #wordContextMenu .ctx-item {
                display: flex; align-items: center; gap: 10px;
                padding: 9px 13px; border-radius: 7px; cursor: pointer;
                color: #e0e0e0; font-size: 13.5px; transition: background 0.15s;
                white-space: nowrap;
            }
            #wordContextMenu .ctx-item:hover { background: rgba(138,79,255,0.25); color: #fff; }
            #wordContextMenu .ctx-word-label {
                font-size: 11px; color: rgba(255,255,255,0.4); padding: 4px 13px 2px;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            #wordContextMenu .ctx-separator {
                height: 1px; background: rgba(255,255,255,0.08); margin: 3px 6px;
            }
        </style>`);
        document.body.appendChild(customContextMenu);

        let _ctxPendingSpan  = null;
        let _ctxPendingWord  = '';
        let _ctxPendingEvent = null;

        // ── Event Delegation (UNA sola vez, no dentro de mostrarMenuContextual) ──
        customContextMenu.addEventListener('click', (ev) => {
            ev.stopPropagation(); // evitar que document.click cierre el menú en el mismo ciclo
            const item = ev.target.closest('[data-action]');
            if (!item) return;

            const action        = item.getAttribute('data-action');
            const span          = _ctxPendingSpan;
            const savedEvent    = _ctxPendingEvent;
            const strongUrl     = customContextMenu._strongUrl     || '';
            const interlinealUrl= customContextMenu._interlinealUrl|| '';

            cerrarMenuContextual();

            function limpiarSpanTemporal() {
                if (span && !span.hasAttribute('data-note') && !span.hasAttribute('data-color-hex')) {
                    const txt = document.createTextNode(span.textContent);
                    if (span.parentNode) {
                        span.parentNode.replaceChild(txt, span);
                        workspace.normalize();
                    }
                }
            }

            if (action === 'strong') {
                limpiarSpanTemporal();
                openURL(strongUrl);
            } else if (action === 'interlineal') {
                limpiarSpanTemporal();
                openURL(interlinealUrl);
            } else if (action === 'nota') {
                // setTimeout(0): esperar al siguiente tick para que todos los handlers
                // de click del documento terminen ANTES de abrir el modal.
                // Esto evita que document.click lo cierre inmediatamente en Chrome/HTTPS.
                const _savedSpan = span;
                const _savedEvt  = savedEvent;
                setTimeout(() => mostrarModalNotas(_savedEvt, _savedSpan), 0);
            }
        });

        function mostrarMenuContextual(e, span, word) {
            _ctxPendingSpan  = span;
            _ctxPendingWord  = word;
            _ctxPendingEvent = e;

            const ref        = window.getActiveBibleRef ? window.getActiveBibleRef() : null;
            const hasRef     = !!ref;
            const testament  = hasRef ? ref.testament : 'NT'; // AT o NT
            const refLabel   = hasRef ? `${ref.bookName} ${ref.chapter}` : '';

            // URL Strong: hebreo para AT, griego para NT
            const strongBase = (testament === 'AT')
                ? 'https://logosklogos.com/strong_hebrew?search='
                : 'https://logosklogos.com/strongcodes?search=';
            const strongLabel = (testament === 'AT') ? 'Hebreo' : 'Griego Strong';

            // URL interlineal logosklogos
            const interlinealUrl = hasRef
                ? `https://logosklogos.com/interlinears/${ref.testament}/${ref.abbrev}/${ref.chapter}`
                : '';

            // Guardar URLs en el elemento del menú (accesibles desde la delegation)
            customContextMenu._strongUrl      = strongBase + encodeURIComponent(word.trim());
            customContextMenu._interlinealUrl = interlinealUrl;
            customContextMenu._hasRef         = hasRef;

            customContextMenu.innerHTML = `
                <div class="ctx-word-label">"${word.substring(0,25)}${word.length>25?'…':''}"</div>
                <div class="ctx-separator"></div>
                <div class="ctx-item" data-action="strong">🔍 Buscar ${strongLabel}</div>
                ${hasRef ? `
                <div class="ctx-item" data-action="interlineal" title="Ver capítulo completo en el interlineal">
                    📖 Ver capítulo en Interlineal
                    <span style="font-size:10px; color:#888; margin-left:4px;">${refLabel}</span>
                </div>` : ''}
                <div class="ctx-separator"></div>
                <div class="ctx-item" data-action="nota">📝 Nota exegética</div>
            `;

            // Posicionar junto al cursor
            const menuH = hasRef ? 155 : 118;
            const menuW = 265;
            let x = e.pageX + 4;
            let y = e.pageY + 4;
            if (x + menuW > window.innerWidth  + window.scrollX) x = e.pageX - menuW;
            if (y + menuH > window.innerHeight + window.scrollY) y = e.pageY - menuH;
            customContextMenu.style.left    = x + 'px';
            customContextMenu.style.top     = y + 'px';
            customContextMenu.style.display = 'flex';
        }

        function cerrarMenuContextual() {
            customContextMenu.style.display = 'none';
            _ctxPendingSpan = null;
        }

        // Cerrar al clic fuera o Escape
        document.addEventListener('click', () => cerrarMenuContextual());
        document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') cerrarMenuContextual(); });

        // ── Clic Derecho interceptado ──
        workspace.addEventListener('contextmenu', (e) => {
            const spanOrText = e.target;

            // Si el click no está dentro del área de texto, ignorar
            if (!spanOrText.closest('.phrase-text')) return;

            // ⚠️ IMPORTANTE: preventDefault AQUÍ, antes de cualquier return,
            // para que Chrome no muestre su menú nativo sobre elementos contenteditable
            e.preventDefault();

            // 1. Manejo de texto seleccionado (Seleccionó una frase con el ratón)
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                if (workspace.contains(range.commonAncestorContainer)) {
                    const span = document.createElement('span');
                    span.className = 'note-wrapper';
                    try {
                        span.appendChild(range.extractContents());
                        range.insertNode(span);
                    } catch(err) { console.error('Error al envolver', err); return; }

                    selection.removeAllRanges();
                    const word = span.textContent.trim();
                    mostrarMenuContextual(e, span, word);
                    return;
                }
            }

            // 2. Si ya dio clic en un SPAN creado previamente
            if (spanOrText.tagName === 'SPAN') {
                mostrarMenuContextual(e, spanOrText, spanOrText.textContent.trim());
                return;
            }

            // 3. Fallback: Capturar la palabra específica a la que se le dio clic derecho
            let caretRange = null;
            if (document.caretRangeFromPoint) {
                caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
            } else if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                if (pos) {
                    caretRange = document.createRange();
                    caretRange.setStart(pos.offsetNode, pos.offset);
                    caretRange.collapse(true);
                }
            }

            if (caretRange && caretRange.startContainer.nodeType === Node.TEXT_NODE) {
                const textNode = caretRange.startContainer;
                const offset = caretRange.startOffset;
                const text = textNode.textContent;
                
                // Expresión regular para caracteres alfabéticos (incluye español) y números
                const regex = /[\p{L}\p{M}0-9]/u;
                
                // Si hizo clic un espacio en blanco, evitamos capturar nada
                if (!regex.test(text[offset] || '') && !regex.test(text[offset - 1] || '')) return;

                let start = offset;
                while (start > 0 && regex.test(text[start - 1])) start--;
                
                let end = offset;
                while (end < text.length && regex.test(text[end])) end++;
                
                if (start < end) {
                    e.preventDefault();
                    const wordRange = document.createRange();
                    wordRange.setStart(textNode, start);
                    wordRange.setEnd(textNode, end);
                    const capturedWord = text.substring(start, end);
                    
                    const span = document.createElement('span');
                    span.className = 'note-wrapper';
                    try {
                        span.appendChild(wordRange.extractContents());
                        wordRange.insertNode(span);
                    } catch(err) { return; }

                    mostrarMenuContextual(e, span, capturedWord);
                }
            }
        });

        function mostrarModalNotas(e, spanTarget) {
            activeNoteSpan = spanTarget;
            noteInput.value = spanTarget.getAttribute('data-note') || '';
            deleteNoteBtn.style.display = spanTarget.hasAttribute('data-note') ? 'inline-block' : 'none';
            noteModal.style.top = e.pageY + 'px';
            noteModal.style.left = e.pageX + 'px';
            noteModal.style.display = 'flex';
            noteInput.focus();
        }

        // Función auxiliar para mantener limpio el HTML: Si el SPAN es solo para nota pero le quitan la nota, se deshace
        function limpiarSpanHuerfano(span) {
            if (!span.hasAttribute('data-note') && !span.hasAttribute('data-color-hex') && span.classList.contains('note-wrapper')) {
                const textNode = document.createTextNode(span.textContent);
                span.parentNode.replaceChild(textNode, span);
                workspace.normalize();
                return true;
            }
            return false;
        }

        // Botones del Modal de Notas
        if (cancelNoteBtn) cancelNoteBtn.addEventListener('click', () => { 
            if (activeNoteSpan) limpiarSpanHuerfano(activeNoteSpan); 
            noteModal.style.display = 'none'; 
            activeNoteSpan = null; 
        });
        
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => {
                if (activeNoteSpan && noteInput.value.trim() !== '') {
                    activeNoteSpan.setAttribute('data-note', noteInput.value.trim());
                    activeNoteSpan.classList.add('has-note');
                } else if (activeNoteSpan && noteInput.value.trim() === '') {
                    activeNoteSpan.removeAttribute('data-note');
                    activeNoteSpan.classList.remove('has-note');
                    limpiarSpanHuerfano(activeNoteSpan);
                }
                saveWorkspace();
                noteModal.style.display = 'none';
            });
        }

        if (deleteNoteBtn) {
            deleteNoteBtn.addEventListener('click', () => {
                if (activeNoteSpan) {
                    activeNoteSpan.removeAttribute('data-note');
                    activeNoteSpan.classList.remove('has-note');
                    limpiarSpanHuerfano(activeNoteSpan);
                    saveWorkspace();
                }
                noteModal.style.display = 'none';
            });
        }

        // Tooltip del Visualizador Flotante (Vista Rápida)
        workspace.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'SPAN' && e.target.classList.contains('has-note')) {
                noteViewer.textContent = e.target.getAttribute('data-note');
                noteViewer.style.display = 'block';
                // Posicionar justo encima
                const rect = e.target.getBoundingClientRect();
                noteViewer.style.top = (rect.top + window.scrollY - 30) + 'px';
                noteViewer.style.left = (rect.left + window.scrollX) + 'px';
            }
        });

        workspace.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'SPAN' && e.target.classList.contains('has-note')) {
                noteViewer.style.display = 'none';
            }
        });

        // Ocultar modal de notas haciendo clic afuera
        document.addEventListener('click', (e) => {
            if (noteModal && noteModal.style.display === 'flex' && !noteModal.contains(e.target) && e.target.tagName !== 'SPAN') {
                noteModal.style.display = 'none';
            }
        });


        // ==========================================
        // D. PINCELES Y CAPAS (Paint-on-Select)
        // ==========================================
        const colorTools = document.querySelectorAll('.color-tool');
        const clearAllTool = document.getElementById('clearAllWorkspace');
        let activeBrushColor = null;

        colorTools.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    activeBrushColor = null; return;
                }
                colorTools.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (btn.id === 'clearHighlight') activeBrushColor = 'eraser';
                else if (btn.id === 'clearAllWorkspace') {
                    btn.classList.remove('active');
                    activeBrushColor = null;
                    if (confirm("¿Limpiar por completo tu Mesa de Trabajo? ¡Borrará frases, colores y notas!")) {
                        workspace.innerHTML = '';
                        localStorage.removeItem('exegesisWorkSpaceV2');
                        localStorage.removeItem('workspaceAutoSave');
                    }
                } else {
                    activeBrushColor = btn.getAttribute('data-color');
                }
            });
        });

        // Magia Pincel
        workspace.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            if (!selection.rangeCount || selection.isCollapsed || !activeBrushColor) return;
            
            const range = selection.getRangeAt(0);
            
            // Validamos que se modifique *dentro* de un elemento de texto válido para evitar romper los select nativos
            if (!range.commonAncestorContainer.parentNode || !workspace.contains(range.commonAncestorContainer)) return;

            if (activeBrushColor === 'eraser') {
                // Borrar colores de los spans cruzados
                const spans = workspace.querySelectorAll('span[data-color-hex]');
                let modified = false;
                spans.forEach(span => {
                    if (selection.containsNode(span, true)) {
                        // Conservamos si tiene nota, sólo quitamos atributos de color
                        span.removeAttribute('data-color-hex');
                        span.style.backgroundColor = 'transparent';
                        span.style.color = 'inherit';
                        span.style.padding = '0';
                        if (!span.classList.contains('has-note')) { // Si quedo desnudo, lo aplanamos
                            const text = document.createTextNode(span.textContent);
                            span.parentNode.replaceChild(text, span);
                        }
                        modified = true;
                    }
                });
                document.execCommand('backColor', false, 'transparent');
                document.execCommand('foreColor', false, 'inherit');
                document.execCommand('removeFormat');
                if (modified) workspace.normalize();
                
            } else {
                // Marcar
                const span = document.createElement('span');
                span.setAttribute('data-color-hex', activeBrushColor);
                span.style.backgroundColor = activeBrushColor;
                span.style.color = (activeBrushColor === '#ffc107' || activeBrushColor === '#fd7e14') ? '#333' : '#fff';
                span.style.padding = '0 4px';
                span.style.borderRadius = '4px';

                try {
                    span.appendChild(range.extractContents());
                    range.insertNode(span);
                } catch(e) { console.error("Error al pintar", e); }
            }
            selection.removeAllRanges();
            saveWorkspace(); // Auto Guardar de cada pincelazo
        });

        // ==========================================
        // E. SISTEMA DE EXPORTACIÓN PROFESIONAL
        // ==========================================

        // Construir envoltorio profesional para exportación
        function buildExportWrapper() {
            // Obtener referencia del pasaje activo
            const ref = window.getActiveBibleRef ? window.getActiveBibleRef() : null;
            const passageLabel = ref
                ? `${ref.bookName} ${ref.chapter}:${ref.verseStart}–${ref.verseEnd}`
                : 'Pasaje Bíblico';
            const dateStr = new Date().toLocaleDateString('es-CO', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            // Obtener colores actuales para la leyenda
            const colorMap = window.getExegesisColorMap ? window.getExegesisColorMap() : {};
            const legendItems = [
                { id: 'sustantivo', label: 'Sustantivos' },
                { id: 'verbo', label: 'Verbos' },
                { id: 'pronombre', label: 'Pronombres' },
                { id: 'determinante', label: 'Artículos' },
                { id: 'genitivo', label: 'Genitivos' },
                { id: 'preposicion', label: 'Preposiciones' },
                { id: 'adjetivo', label: 'Adjetivos' },
                { id: 'adverbio', label: 'Adverbios' },
                { id: 'secundario', label: 'Secundarios' }
            ];

            let legendHTML = '';
            legendItems.forEach(item => {
                const info = colorMap[item.id] || { hex: '#ccc', emoji: '⚪' };
                legendHTML += `<span style="
                    display: inline-flex; align-items: center; gap: 5px;
                    background: ${info.hex}22; border: 1px solid ${info.hex}66;
                    padding: 3px 10px; border-radius: 20px; font-size: 11px;
                    font-weight: 700; color: ${info.hex}; white-space: nowrap;
                "><span style="
                    width: 10px; height: 10px; border-radius: 50%;
                    background: ${info.hex}; display: inline-block;
                "></span>${item.label}</span>`;
            });

            // Clonar el workspace
            const wsClone = workspace.cloneNode(true);
            const originalSelectors = workspace.querySelectorAll('.phrase-selectors');
            const clonedSelectors = wsClone.querySelectorAll('.phrase-selectors');
            
            originalSelectors.forEach((origSel, index) => {
                const cloneSel = clonedSelectors[index];

                const typeSelect = origSel.querySelector('.phrase-type');
                const relSelect = origSel.querySelector('.logic-rel');
                
                const typeVal = typeSelect && typeSelect.selectedIndex > 0 ? typeSelect.options[typeSelect.selectedIndex].text : '';
                const relVal = (relSelect && !relSelect.disabled && relSelect.selectedIndex > 0) ? relSelect.options[relSelect.selectedIndex].text : '';

                let badges = '';
                if (typeVal && !typeVal.startsWith('-')) {
                    const typeBg = typeSelect.style.backgroundColor || '#f3f4f6';
                    const typeColor = typeSelect.style.color || '#374151';
                    badges += `<span style="
                        background: ${typeBg}; color: ${typeColor};
                        padding: 2px 8px; border-radius: 4px; font-size: 10px;
                        font-weight: 700; margin-right: 4px; border: 1px solid rgba(0,0,0,0.08);
                    ">${typeVal}</span>`;
                }
                if (relVal && !relVal.startsWith('-')) {
                    const isGen = relSelect.value && relSelect.value.startsWith('GEN-');
                    const relBg = isGen ? '#dbeafe' : '#fef9c3';
                    const relColor = isGen ? '#1d4ed8' : '#854d0e';
                    badges += `<span style="
                        background: ${relBg}; color: ${relColor};
                        padding: 2px 8px; border-radius: 4px; font-size: 10px;
                        font-weight: 700; border: 1px solid rgba(0,0,0,0.1);
                    ">[${relVal.replace(/^↳\s*/, '')}]</span>`;
                }

                cloneSel.innerHTML = badges || '';
                cloneSel.style.display = 'inline-flex';
                cloneSel.style.gap = '4px';
                cloneSel.style.alignItems = 'center';
                cloneSel.style.marginRight = '8px';
            });

            // Construir el wrapper completo
            const wrapper = document.createElement('div');
            wrapper.id = 'exportWrapper';
            wrapper.style.cssText = `
                position: absolute; top: 0; left: 0;
                width: 900px; background: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-sizing: border-box;
                z-index: -1000;
            `;

            wrapper.innerHTML = `
                <!-- HEADER PROFESIONAL -->
                <div style="
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 60%, #4a90d9 100%);
                    padding: 30px 35px 25px; color: white; position: relative; overflow: hidden;
                ">
                    <div style="
                        position: absolute; top: -30px; right: -30px;
                        width: 150px; height: 150px; border-radius: 50%;
                        background: rgba(255,255,255,0.06);
                    "></div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1;">
                        <div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-bottom: 6px;">
                                📖 Análisis Exegético Inductivo
                            </div>
                            <div style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">
                                ${passageLabel}
                            </div>
                            <div style="font-size: 12px; opacity: 0.6; margin-top: 8px;">
                                Método John Piper — Fraseo Estructural
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="
                                background: rgba(255,255,255,0.15); backdrop-filter: blur(5px);
                                padding: 8px 16px; border-radius: 10px;
                                border: 1px solid rgba(255,255,255,0.2);
                                font-size: 11px; line-height: 1.5;
                            ">
                                <div style="font-weight: 700;">Mesa de Trabajo</div>
                                <div style="opacity: 0.8; font-size: 10px;">${dateStr}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LEYENDA DE COLORES -->
                <div style="
                    background: #f8f9fb; border-bottom: 1px solid #e8ecf1;
                    padding: 10px 35px; display: flex; flex-wrap: wrap;
                    gap: 8px; align-items: center;
                ">
                    <span style="font-size: 10px; color: #94a3b8; font-weight: 700;
                        text-transform: uppercase; letter-spacing: 0.5px; margin-right: 4px;">
                        🎨 Leyenda:
                    </span>
                    ${legendHTML}
                </div>

                <!-- CONTENIDO DEL WORKSPACE -->
                <div style="
                    padding: 30px 35px; line-height: 2; font-size: 1.1em;
                    min-height: 200px;
                " id="exportContentArea"></div>

                <!-- FOOTER PROFESIONAL -->
                <div style="
                    background: linear-gradient(135deg, #f1f5f9 0%, #e8ecf1 100%);
                    padding: 15px 35px; display: flex; justify-content: space-between;
                    align-items: center; border-top: 2px solid #1e3c72;
                ">
                    <div style="font-size: 10px; color: #64748b; font-weight: 600;">
                        📖 Guía de Exégesis Bíblica — Herramienta de Estudio Inductivo
                    </div>
                    <div style="font-size: 10px; color: #94a3b8;">
                        Generado con Herramienta Exegética v2.0  •  ${dateStr}
                    </div>
                </div>
            `;

            // Inyectar el contenido clonado dentro del espacio del workspace
            wrapper.querySelector('#exportContentArea').appendChild(wsClone);
            wsClone.style.minHeight = 'auto';
            wsClone.style.maxHeight = 'none';
            wsClone.style.overflow = 'visible';
            wsClone.style.border = 'none';
            wsClone.style.boxShadow = 'none';
            wsClone.style.padding = '0';
            wsClone.style.borderRadius = '0';

            return wrapper;
        }

        const exportBtn = document.getElementById('exportWorkspaceBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if(typeof html2canvas !== 'undefined') {
                    if (!workspace.textContent.trim()) { alert('No hay contenido en la Mesa de Trabajo para exportar.'); return; }
                    
                    const wrapper = buildExportWrapper();
                    document.body.appendChild(wrapper);

                    setTimeout(() => {
                        html2canvas(wrapper, {
                            backgroundColor: '#ffffff',
                            scale: 2,
                            useCORS: true,
                            logging: false
                        }).then(canvas => {
                            wrapper.remove();
                            const link = document.createElement('a');
                            const ref = window.getActiveBibleRef ? window.getActiveBibleRef() : null;
                            const name = ref ? `${ref.bookName}-${ref.chapter}_${ref.verseStart}-${ref.verseEnd}` : 'Analisis';
                            link.download = `Exegesis-${name}-${new Date().getTime()}.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        }).catch(err => {
                            wrapper.remove();
                            alert("Error al exportar la imagen: " + err);
                        });
                    }, 300);
                } else {
                    alert('Librería html2canvas aún cargando, intente en unos segundos.');
                }
            });
        }
// =========================================================================
    // SISTEMA DE CONFIGURACIÓN DINÁMICA DE COLORES
    // =========================================================================
    const colorPalette = [
        { hex: '#ffc107', emoji: '🟡', name: 'AMARILLO' },
        { hex: '#28a745', emoji: '🟢', name: 'VERDE' },
        { hex: '#dc3545', emoji: '🔴', name: 'ROJO' },
        { hex: '#fd7e14', emoji: '🟠', name: 'NARANJA' },
        { hex: '#007bff', emoji: '🔵', name: 'AZUL' },
        { hex: '#e91e63', emoji: '🩷', name: 'ROSADO' },
        { hex: '#6c757d', emoji: '🩶', name: 'GRIS' },
        { hex: '#b19cd9', emoji: '🔮', name: 'LILA' },
        { hex: '#6f42c1', emoji: '🟣', name: 'MORADO' }
    ];

    const categories = [
        { id: 'sustantivo', label: 'Sustantivos (Actores, Aposiciones)', defaultHex: '#dc3545' },
        { id: 'verbo', label: 'Verbos (Acciones, Participios, Infintivos)', defaultHex: '#28a745' },
        { id: 'pronombre', label: 'Pronombres (Relativas)', defaultHex: '#6f42c1' },
        { id: 'determinante', label: 'Determinantes (Vocativos, Exclamatorias)', defaultHex: '#fd7e14' },
        { id: 'genitivo', label: 'Genitivos', defaultHex: '#007bff' },
        { id: 'preposicion', label: 'Preposiciones', defaultHex: '#ffc107' },
        { id: 'adjetivo', label: 'Adjetivos', defaultHex: '#e91e63' },
        { id: 'adverbio', label: 'Adverbios y Conjunciones', defaultHex: '#6c757d' },
        { id: 'secundario', label: 'Secundarios', defaultHex: '#b19cd9' }
    ];

    let userConfig = JSON.parse(localStorage.getItem('exegesisColorConfig')) || {};

    // 1. Aplicar variables de CSS globalmente
    window.applyColorConfig = function() {
        categories.forEach(cat => {
            const finalHex = userConfig[cat.id] || cat.defaultHex;
            document.documentElement.style.setProperty(`--color-${cat.id}`, finalHex);
        });
        
        // Actualizar visualmente la barra de herramientas de la Mesa de Trabajo Interactiva
        document.querySelectorAll('.color-tool[data-color]').forEach(btn => {
            // Determine which category this button is for by its title
            const title = btn.getAttribute('title').toLowerCase();
            let matchedCatId = null;
            if (title.includes('sustantivos')) matchedCatId = 'sustantivo';
            if (title.includes('verbos')) matchedCatId = 'verbo';
            if (title.includes('pronombres')) matchedCatId = 'pronombre';
            if (title.includes('artículos') || title.includes('determinantes')) matchedCatId = 'determinante';
            if (title.includes('genitivos')) matchedCatId = 'genitivo';
            if (title.includes('preposiciones')) matchedCatId = 'preposicion';
            if (title.includes('adjetivos')) matchedCatId = 'adjetivo';
            if (title.includes('adverbios')) matchedCatId = 'adverbio';
            if (title.includes('secundarios')) matchedCatId = 'secundario';
            
            if (matchedCatId) {
                const hex = userConfig[matchedCatId] || categories.find(c => c.id === matchedCatId).defaultHex;
                btn.setAttribute('data-color', hex);
                const dot = btn.querySelector('.color-dot');
                if(dot) dot.style.backgroundColor = hex;
            }
        });
        if (typeof window.refreshPizarraColors === 'function') {
            window.refreshPizarraColors();
        }
    };

    // Exportar paleta para uso de ai-engine.js
    window.getExegesisColorMap = function() {
        const mapping = {};
        categories.forEach(cat => {
            const targetHex = userConfig[cat.id] || cat.defaultHex;
            const fullPaletteInfo = colorPalette.find(p => p.hex.toLowerCase() === targetHex.toLowerCase());
            if (fullPaletteInfo) {
                mapping[cat.id] = fullPaletteInfo;
            } else {
                 mapping[cat.id] = { hex: targetHex, emoji: '✨', name: 'COLOR' };
            }
        });
        return mapping;
    };

    // 2. Construir UI de Configuración
    function buildConfigUI() {
        const panel = document.getElementById('colorConfigPanel');
        if(!panel) return;
        panel.innerHTML = '';

        categories.forEach(cat => {
            const currentHex = (userConfig[cat.id] || cat.defaultHex).toLowerCase();
            
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.padding = '10px 0';
            row.style.borderBottom = '1px dashed #ddd';

            const labelDiv = document.createElement('div');
            labelDiv.style.fontWeight = 'bold';
            labelDiv.style.flex = '1';
            labelDiv.textContent = cat.label;

            const selectorDiv = document.createElement('div');
            selectorDiv.style.display = 'flex';
            selectorDiv.style.gap = '8px';

            colorPalette.forEach(pal => {
                const circle = document.createElement('div');
                circle.style.width = '24px';
                circle.style.height = '24px';
                circle.style.borderRadius = '50%';
                circle.style.backgroundColor = pal.hex;
                circle.style.cursor = 'pointer';
                circle.style.border = '2px solid transparent';
                circle.style.transition = 'transform 0.2s';
                
                if (currentHex === pal.hex.toLowerCase()) {
                    circle.style.border = '2px solid #333';
                    circle.style.transform = 'scale(1.2)';
                    circle.title = `Seleccionado (${pal.name})`;
                }

                circle.onclick = () => {
                    userConfig[cat.id] = pal.hex;
                    localStorage.setItem('exegesisColorConfig', JSON.stringify(userConfig));
                    applyColorConfig();
                    buildConfigUI(); // Re-render to show active circle
                };

                selectorDiv.appendChild(circle);
            });

            row.appendChild(labelDiv);
            row.appendChild(selectorDiv);
            panel.appendChild(row);
        });
    }

    // Inicializar configuración al cargar
    applyColorConfig();
    if(document.getElementById('colorConfigPanel')) {
        buildConfigUI();
    }

    // =========================================================================
    // CONFIGURACIÓN AVANZADA DEL WORKSPACE
    // =========================================================================

    // --- Helpers de persistencia ---
    function saveWorkspacePref(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    function loadWorkspacePref(key, defaultVal) {
        const saved = localStorage.getItem(key);
        return saved !== null ? JSON.parse(saved) : defaultVal;
    }

    // --- Tipografía de la Mesa de trabajo ---
    const wsElement = document.querySelector('.interactive-workspace');
    const fontMap = {
        system: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lora:   "'Lora', serif",
        mono:   "'Roboto Mono', monospace"
    };
    function applyFont(fontKey) {
        if (wsElement) wsElement.style.fontFamily = fontMap[fontKey] || fontMap.lora;
        document.documentElement.style.setProperty('--workspace-font', fontMap[fontKey] || fontMap.lora);
    }
    const savedFont = loadWorkspacePref('workspaceFont', 'lora');
    applyFont(savedFont);
    const radioForSaved = document.querySelector(`input[name="fontFamily"][value="${savedFont}"]`);
    if (radioForSaved) radioForSaved.checked = true;
    document.querySelectorAll('input[name="fontFamily"]').forEach(radio => {
        radio.addEventListener('change', () => {
            applyFont(radio.value);
            saveWorkspacePref('workspaceFont', radio.value);
        });
    });

    // --- Tamaño de texto ---
    const fontSizeSlider = document.getElementById('workspaceFontSize');
    const fontSizeValue  = document.getElementById('fontSizeValue');
    const savedFontSize  = loadWorkspacePref('workspaceFontSize', 16);
    if (fontSizeSlider) {
        fontSizeSlider.value = savedFontSize;
        if (fontSizeValue) fontSizeValue.textContent = savedFontSize;
        if (wsElement) wsElement.style.fontSize = savedFontSize + 'px';
        fontSizeSlider.addEventListener('input', () => {
            const sz = fontSizeSlider.value;
            if (fontSizeValue) fontSizeValue.textContent = sz;
            if (wsElement) wsElement.style.fontSize = sz + 'px';
            saveWorkspacePref('workspaceFontSize', sz);
        });
    }

    // --- Modo Oscuro ---
    const darkToggle     = document.getElementById('darkModeToggle');
    const darkModeLabel  = document.getElementById('darkModeLabel');
    function applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.style.background = isDark ? '#12151e' : '#f3f1ec';
        if (typeof syncIframeDarkMode === 'function') syncIframeDarkMode(isDark);
        if (darkModeLabel) darkModeLabel.textContent = isDark ? '🌙 Activado' : 'Desactivado';
    }
    const savedDark = loadWorkspacePref('darkMode', false);
    if (darkToggle) { darkToggle.checked = savedDark; applyDarkMode(savedDark); }
    if (darkToggle) {
        darkToggle.addEventListener('change', () => {
            applyDarkMode(darkToggle.checked);
            saveWorkspacePref('darkMode', darkToggle.checked);
        });
    }

    // --- Temperatura IA ---
    const tempSlider = document.getElementById('aiTemperature');
    const tempValue  = document.getElementById('tempValue');
    const savedTemp  = loadWorkspacePref('aiTemperature', 0.2);
    if (tempSlider) {
        tempSlider.value = savedTemp;
        if (tempValue) tempValue.textContent = savedTemp;
        tempSlider.addEventListener('input', () => {
            if (tempValue) tempValue.textContent = tempSlider.value;
            saveWorkspacePref('aiTemperature', parseFloat(tempSlider.value));
        });
    }
    window.getAiTemperature = () => loadWorkspacePref('aiTemperature', 0.2);

    // --- Modelo activo de Gemini (resuelto desde Free/Paid) ---
    window.getAiModel = () => localStorage.getItem('geminiModelFree') || localStorage.getItem('geminiModelPaid') || 'gemini-2.5-flash';

    // --- Base Lexicográfica ---
    const dictSelect  = document.getElementById('dictionaryBase');
    const savedDict   = loadWorkspacePref('dictionaryBase', 'strong');
    if (dictSelect) {
        dictSelect.value = savedDict;
        dictSelect.addEventListener('change', () => saveWorkspacePref('dictionaryBase', dictSelect.value));
    }
    window.getDictionaryBase = () => loadWorkspacePref('dictionaryBase', 'strong');

    // --- API Key (sync desde configGeneral al AI engine) ---
    const apiKeyFreeInput = document.getElementById('geminiApiKeyFree');
    const apiKeyPaidInput = document.getElementById('geminiApiKeyPaid');
    const apiModeRadios   = document.querySelectorAll('.mode-radio');
    const modelFreeSelect = document.getElementById('geminiModelFree');
    const modelPaidSelect = document.getElementById('geminiModelPaid');

    if (apiKeyFreeInput) apiKeyFreeInput.value = localStorage.getItem('geminiExtApiKeyFree') || '';
    if (apiKeyPaidInput) apiKeyPaidInput.value = localStorage.getItem('geminiExtApiKeyPaid') || '';
    if (modelFreeSelect) modelFreeSelect.value = localStorage.getItem('geminiModelFree') || 'gemini-2.5-flash';
    if (modelPaidSelect) modelPaidSelect.value = localStorage.getItem('geminiModelPaid') || 'gemini-2.5-flash';

    const savedMode = localStorage.getItem('geminiApiMode') || 'auto';
    apiModeRadios.forEach(radio => {
        if(radio.value === savedMode) radio.checked = true;
        radio.addEventListener('change', () => localStorage.setItem('geminiApiMode', radio.value));
    });

    // Guardar Automático al cambiar inputs/selects
    const saveOption = (key, value) => localStorage.setItem(key, value);

    if(apiKeyFreeInput) apiKeyFreeInput.addEventListener('change', (e) => saveOption('geminiExtApiKeyFree', e.target.value.trim()));
    if(apiKeyPaidInput) apiKeyPaidInput.addEventListener('change', (e) => saveOption('geminiExtApiKeyPaid', e.target.value.trim()));
    if(modelFreeSelect) modelFreeSelect.addEventListener('change', (e) => saveOption('geminiModelFree', e.target.value));
    if(modelPaidSelect) modelPaidSelect.addEventListener('change', (e) => saveOption('geminiModelPaid', e.target.value));

    // Botones de Guardar explícitos para dar feedback visual
    const btnSaveFree = document.getElementById('btnSaveFree');
    const btnSavePaid = document.getElementById('btnSavePaid');

    if(btnSaveFree) {
        btnSaveFree.addEventListener('click', () => {
            saveOption('geminiExtApiKeyFree', apiKeyFreeInput.value.trim());
            saveOption('geminiModelFree', modelFreeSelect.value);
            const statusLabel = document.getElementById('statusFree');
            if(statusLabel) {
                statusLabel.textContent = "✅ Guardado";
                statusLabel.style.color = "#22c55e";
                setTimeout(() => statusLabel.textContent = "", 3000);
            }
        });
    }

    if(btnSavePaid) {
        btnSavePaid.addEventListener('click', () => {
            saveOption('geminiExtApiKeyPaid', apiKeyPaidInput.value.trim());
            saveOption('geminiModelPaid', modelPaidSelect.value);
            const statusLabel = document.getElementById('statusPaid');
            if(statusLabel) {
                statusLabel.textContent = "✅ Guardado";
                statusLabel.style.color = "#8b5cf6";
                setTimeout(() => statusLabel.textContent = "", 3000);
            }
        });
    }

    // --- Auto-Guardado ---
    const autoSaveToggle        = document.getElementById('autoSaveToggle');
    const autoSaveLabel         = document.getElementById('autoSaveLabel');
    const autoSaveIntervalSlider= document.getElementById('autoSaveInterval');
    const autoSaveIntervalValue = document.getElementById('autoSaveIntervalValue');
    const autoSaveStatus        = document.getElementById('autoSaveStatus');
    let   autoSaveTimer         = null;

    const savedAutoSave = loadWorkspacePref('autoSaveEnabled', false);
    const savedInterval = loadWorkspacePref('autoSaveInterval', 5);

    if (autoSaveIntervalSlider) {
        autoSaveIntervalSlider.value = savedInterval;
        if (autoSaveIntervalValue) autoSaveIntervalValue.textContent = savedInterval;
        autoSaveIntervalSlider.addEventListener('input', () => {
            if (autoSaveIntervalValue) autoSaveIntervalValue.textContent = autoSaveIntervalSlider.value;
            saveWorkspacePref('autoSaveInterval', parseInt(autoSaveIntervalSlider.value));
            if (autoSaveToggle && autoSaveToggle.checked) startAutoSave();
        });
    }

    function startAutoSave() {
        if (autoSaveTimer) clearInterval(autoSaveTimer);
        const mins = parseInt(loadWorkspacePref('autoSaveInterval', 5));
        autoSaveTimer = setInterval(() => {
            const ws = document.querySelector('.interactive-workspace');
            if (ws) {
                localStorage.setItem('workspaceAutoSave', ws.innerHTML);
                const now = new Date().toLocaleTimeString('es');
                if (autoSaveStatus) autoSaveStatus.textContent = `✅ Guardado a las ${now}`;
            }
        }, mins * 60 * 1000);
        if (autoSaveLabel) autoSaveLabel.textContent = `✅ Activo (cada ${mins} min)`;
    }

    function stopAutoSave() {
        if (autoSaveTimer) clearInterval(autoSaveTimer);
        autoSaveTimer = null;
        if (autoSaveLabel) autoSaveLabel.textContent = 'Desactivado';
        if (autoSaveStatus) autoSaveStatus.textContent = 'Sin guardado reciente.';
    }

    if (autoSaveToggle) {
        autoSaveToggle.checked = savedAutoSave;
        if (savedAutoSave) startAutoSave();
        autoSaveToggle.addEventListener('change', () => {
            saveWorkspacePref('autoSaveEnabled', autoSaveToggle.checked);
            autoSaveToggle.checked ? startAutoSave() : stopAutoSave();
        });
    }

    // Restaurar contenido auto-guardado si existe
    const wsAutoSaved = localStorage.getItem('workspaceAutoSave');
    const wsEl = document.querySelector('.interactive-workspace');
    if (wsAutoSaved && wsEl && !wsEl.textContent.trim()) {
        wsEl.innerHTML = wsAutoSaved;
    }

    // --- Exportar a PDF (Método Profesional Canvas to PDF) ---
    function exportPdf(orientation) {
        if (!workspace || !workspace.textContent.trim()) { alert('No hay contenido en la Mesa de Trabajo para exportar.'); return; }
        if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') { 
            alert('Librerías PDF (jspdf/html2canvas) no disponibles o cargando.'); 
            return; 
        }

        const wrapper = buildExportWrapper();
        document.body.appendChild(wrapper);

        const ref = window.getActiveBibleRef ? window.getActiveBibleRef() : null;
        const fileName = ref ? `Exegesis-${ref.bookName}-${ref.chapter}_${ref.verseStart}-${ref.verseEnd}` : 'Analisis-Exegetico';

        setTimeout(() => {
            html2canvas(wrapper, { scale: 2, useCORS: true, logging: false }).then(canvas => {
                wrapper.remove();
                
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF(orientation, 'mm', 'a4');
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                const imgProps = pdf.getImageProperties(imgData);
                const margin = 10;
                const contentWidth = pdfWidth - (margin * 2);
                const contentHeight = (imgProps.height * contentWidth) / imgProps.width;

                pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
                pdf.save(`${fileName}-${new Date().toLocaleDateString('es').replace(/\//g,'-')}.pdf`);
            }).catch(err => {
                try{ wrapper.remove(); }catch(e){}
                console.error("Error PDF:", err);
                alert("Error al generar PDF.");
            });
        }, 500);
    }

    const pdfPortraitBtn   = document.getElementById('exportPdfPortraitBtn');
    const pdfLandscapeBtn  = document.getElementById('exportPdfLandscapeBtn');
    if (pdfPortraitBtn)   pdfPortraitBtn.addEventListener('click',  () => exportPdf('portrait'));
    if (pdfLandscapeBtn)  pdfLandscapeBtn.addEventListener('click', () => exportPdf('landscape'));

});

// =========================================================================
// NAVEGACIÓN INTELIGENTE A CONCEPTOS CLAVE (goToConcept)
// =========================================================================
function goToConcept(stepId, subTabId, anchorId) {
    if (typeof selectMainSection === 'function') {
        selectMainSection(stepId);
    }

    setTimeout(() => {
        if (subTabId) {
            const contents = document.querySelectorAll('.' + stepId + '-content');
            contents.forEach(c => c.classList.remove('active'));
            const buttons = document.querySelectorAll('.' + stepId + '-btn');
            buttons.forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${subTabId}'`)) {
                    b.classList.add('active');
                }
            });
            const targetSub = document.getElementById(subTabId);
            if (targetSub) targetSub.classList.add('active');
            document.querySelectorAll('.sidebar-sub-btn').forEach(sb => {
                sb.classList.toggle('active-sub', sb.getAttribute('data-subtab') === subTabId);
            });
            if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
        }

        if (anchorId) {
            const anchorEl = document.getElementById(anchorId);
            if (anchorEl) {
                anchorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                anchorEl.classList.remove('concept-highlight-flash');
                void anchorEl.offsetWidth;
                anchorEl.classList.add('concept-highlight-flash');
            }
        }
    }, 60);
}

// =========================================================================
// LÓGICA INTERACTIVA DE EXPLICACIÓN MARKUP (PASO 1 - SUB-PESTAÑA 1.5)
// =========================================================================
const mkGramaticaData = [
    { id: 'sustantivo', colorHex: '#dc3545', emoji: '🔴', nombre: 'Sustantivos (Rojo)', meta: 'Los Actores y Objetos', desc: 'Nombran personas, lugares, objetos o conceptos abstractos.', ex: 'Dios, luz, Juan, amor, mundo, pecado, verdad.' },
    { id: 'verbo', colorHex: '#28a745', emoji: '🟢', nombre: 'Verbos (Verde)', meta: 'Los Motores', desc: 'Expresan acciones, movimientos o estados. Indican lo que ocurre en el versículo.', ex: 'amó, andamos, dijo, es, hemos visto, limpiar.' },
    { id: 'pronombre', colorHex: '#6f42c1', emoji: '🟣', nombre: 'Pronombres (Morado)', meta: 'Los Dobles de Acción', desc: 'Reemplazan al sustantivo o enlazan cláusulas relativas para rastrear actores.', ex: 'Él, nosotros, vosotros, lo, le, que, quien, el cual.' },
    { id: 'determinante', colorHex: '#fd7e14', emoji: '🟠', nombre: 'Determinantes / Artículos (Naranja)', meta: 'Los Señaladores', desc: 'Acompañan al sustantivo para presentarlo, cuantificarlo o indicar posesión.', ex: 'el, la, los, un, este, nuestro, su, toda.' },
    { id: 'preposicion', colorHex: '#eab308', emoji: '🟡', nombre: 'Preposiciones (Amarillo)', meta: 'Los Puentes', desc: 'Unen palabras indicando posición, dirección, tiempo, medio o causa.', ex: 'en, de, por, para, con, a, desde, hacia.' },
    { id: 'genitivo', colorHex: '#007bff', emoji: '🔵', nombre: 'Genitivos (Azul)', meta: 'Posesión y Relación', desc: 'Indican pertenencia, origen o relación entre sustantivos ("de...").', ex: 'de Dios, de vida, de verdad, de Cristo.' },
    { id: 'adjetivo', colorHex: '#e91e63', emoji: '🩷', nombre: 'Adjetivos (Rosado)', meta: 'Los Decoradores', desc: 'Califican, describen o añaden precisión teológica a un sustantivo.', ex: 'eterna, santo, fiel, justo, verdadero, buen.' },
    { id: 'adverbio', colorHex: '#6c757d', emoji: '🩶', nombre: 'Adverbios y Conjunciones (Gris)', meta: 'Bisagras y Lupas', desc: 'Unen ideas o modifican verbos y adjetivos (incluyendo negaciones cruciales).', ex: 'y, pero, porque, si, mas, no, también, hoy.' },
    { id: 'secundario', colorHex: '#b19cd9', emoji: '🔮', nombre: 'Secundarios (Lila)', meta: 'Los Especiales', desc: 'Numerales significativos, conjunciones especiales y partículas enfáticas.', ex: 'siete, doce, sino, he aquí, ¡ay!, amén.' }
];

const mkLentesData = [
    { num: 1, name: 'Llamadores de Atención (Attention-Getters)', meta: 'Lente 1 — El Resaltador Visual', desc: 'Detiene la lectura ante repeticiones, contrastes, paradojas o énfasis del autor.', tags: ['Énfasis Principal', 'Repetición Exacta', 'Contraste / Paradoja', 'Repetición Conceptual'] },
    { num: 2, name: 'Preguntas (Questions)', meta: 'Lente 2 — La Interrogación Inductiva', desc: 'Marca tensiones textuales y formula preguntas agudas al margen para que el texto responda.', tags: ['¿Quién?', '¿Qué?', '¿Cómo?', '¿Cuándo?', '¿Dónde?', '¿Por qué?', '¿Para qué?'] },
    { num: 3, name: 'Tópicos (Topics)', meta: 'Lente 3 — El Mapeo de Temas', desc: 'Identifica los distintos temas presentes en el pasaje y distingue el Tópico Principal.', tags: ['Tópico Principal', 'Temas Secundarios', 'Actores Clave'] },
    { num: 4, name: 'Mandatos+ (Commands+)', meta: 'Lente 4 — Anatomía de las Órdenes', desc: 'Aísla cada imperativo junto con su Ancla (base/razón en el evangelio), Fin, Medios y Maneras.', tags: ['Mandato', 'Ancla / Base o Razón', 'Propósito (Fin)', 'Medios', 'Maneras'] },
    { num: 5, name: 'Contexto (Context)', meta: 'Lente 5 — Señales Literarias', desc: 'Conecta el pasaje con los párrafos anteriores y posteriores para evitar sacarlo de contexto.', tags: ['Contexto Anterior', 'Contexto Posterior', 'Puente Bilateral', 'Cita A.T.'] },
    { num: 6, name: 'Transiciones (Transitions)', meta: 'Lente 6 — Giros del Discurso', desc: 'Identifica conectores y cambios de escena, tiempo, lugar, hablante o enfoque argumentativo.', tags: ['Conector Lógico', 'Cambio de Tiempo/Lugar', 'Cambio de Sujeto/Hablante', 'Giro Retórico'] },
    { num: 7, name: 'Teología (Theology)', meta: 'Lente 7 — Síntesis Doctrinal', desc: 'Rastrea lo que el texto enseña sobre Dios, Cristo, el Espíritu y la redención sin eiségesis.', tags: ['Teología Propia', 'Cristología', 'Pneumatología', 'Soteriología', 'Eclesiología', 'Escatología', 'Antropología', 'Bibliología'] }
];

function initExplicacionMarkup() {
    const btnContainer = document.getElementById('markup-palette-buttons');
    if (btnContainer && btnContainer.children.length === 0) {
        mkGramaticaData.forEach((item, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'shortcut-btn';
            btn.style.borderLeft = `4px solid ${item.colorHex}`;
            btn.textContent = `${item.emoji} ${item.nombre.split(' (')[0]}`;
            btn.onclick = () => showMkGramDetail(idx);
            btnContainer.appendChild(btn);
        });
        showMkGramDetail(0);
    }

    const lentesContainer = document.getElementById('markup-lentes-cards');
    if (lentesContainer && lentesContainer.children.length === 0) {
        lentesContainer.innerHTML = mkLentesData.map(l => {
            const tagsHtml = l.tags.map(t => `<span style="display:inline-block;background:#f1f5f9;color:#334155;font-size:0.78em;padding:3px 8px;border-radius:5px;border:1px solid #cbd5e1;margin:2px;">${t}</span>`).join('');
            return `
                <div class="type-card">
                    <h4>${l.num}. ${l.name}</h4>
                    <h5 style="font-size:0.9em;">${l.meta}</h5>
                    <p style="font-size:0.92em;margin-bottom:10px;">${l.desc}</p>
                    <div>${tagsHtml}</div>
                </div>
            `;
        }).join('');
    }
}

function showMkGramDetail(idx) {
    const d = mkGramaticaData[idx];
    const box = document.getElementById('markup-gramatica-detail');
    if (!box || !d) return;
    box.style.borderLeftColor = d.colorHex;
    box.innerHTML = `
        <h4 style="color:${d.colorHex};margin-bottom:6px;">${d.emoji} ${d.nombre} — <em>"${d.meta}"</em></h4>
        <p style="margin-bottom:8px;">${d.desc}</p>
        <p><strong>Ejemplos bíblicos:</strong> <code>${d.ex}</code></p>
    `;
}

function mkApplyCaso1Step1() {
    const w1 = document.getElementById('mk-caso1-w1');
    const w2 = document.getElementById('mk-caso1-w2');
    const w3 = document.getElementById('mk-caso1-w3');
    if (w1) { w1.style.color = '#dc3545'; w1.style.fontWeight = 'bold'; }
    if (w3) { w3.style.color = '#dc3545'; w3.style.fontWeight = 'bold'; }
    if (w2) { w2.style.color = '#28a745'; w2.style.fontWeight = 'bold'; }
    const b2 = document.getElementById('mk-btn-caso1-2');
    if (b2) b2.disabled = false;
}
function mkApplyCaso1Step2() {
    const w1 = document.getElementById('mk-caso1-w1');
    const w2 = document.getElementById('mk-caso1-w2');
    if (w1) { w1.style.border = '2px solid #1e3c72'; w1.style.background = '#f8fafc'; w1.title = 'Lente 7: Teología Propia'; }
    if (w2) { w2.style.border = '2px solid #1e3c72'; w2.style.background = '#f8fafc'; w2.title = 'Lente 1: Llamadores de Atención (Contraste)'; }
    const exp = document.getElementById('mk-caso1-exp');
    if (exp) exp.style.display = 'block';
}
function mkResetCaso1() {
    ['mk-caso1-w1', 'mk-caso1-w2', 'mk-caso1-w3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style = 'padding: 2px 6px; border-radius: 4px; transition: all 0.25s;'; el.removeAttribute('title'); }
    });
    const b2 = document.getElementById('mk-btn-caso1-2');
    if (b2) b2.disabled = true;
    const exp = document.getElementById('mk-caso1-exp');
    if (exp) exp.style.display = 'none';
}

function mkApplyCaso2Step1() {
    ['mk-caso2-w1', 'mk-caso2-w2', 'mk-caso2-w3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.color = '#28a745'; el.style.fontWeight = 'bold'; }
    });
    const b2 = document.getElementById('mk-btn-caso2-2');
    if (b2) b2.disabled = false;
}
function mkApplyCaso2Step2() {
    ['mk-caso2-w1', 'mk-caso2-w2', 'mk-caso2-w3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.border = '2px solid #1e3c72'; el.style.background = '#f8fafc'; el.title = 'Lente 1: Repetición Conceptual'; }
    });
    const exp = document.getElementById('mk-caso2-exp');
    if (exp) exp.style.display = 'block';
}
function mkResetCaso2() {
    ['mk-caso2-w1', 'mk-caso2-w2', 'mk-caso2-w3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style = 'padding: 2px 6px; border-radius: 4px; transition: all 0.25s;'; el.removeAttribute('title'); }
    });
    const b2 = document.getElementById('mk-btn-caso2-2');
    if (b2) b2.disabled = true;
    const exp = document.getElementById('mk-caso2-exp');
    if (exp) exp.style.display = 'none';
}



// =========================================================================
// OPCIÓN A+ REFINADA: SIDEBAR, MIGAS DE PAN, CAJÓN DE CONSULTA Y CTRL+K
// =========================================================================
const STEP_TITLES = {
    mesaInteractiva: '🛠️ Mesa de Trabajo Interactiva',
    herramientaGramatical: '🔍 Búsqueda Gramatical',
    paso1: 'Paso 1: Observación y Markup',
    paso2: 'Paso 2: Fraseo (DIALS)',
    paso3: 'Paso 3: Arqueo y Enmarcado',
    paso4: 'Paso 4: Profundización y Verificación',
    paso5: 'Paso 5: Consolidación y My Bible',
    documentosSoporte: '📂 Documentos / Formatos',
    configGeneral: '⚙️ Configuración'
};

function updateBreadcrumb() {
    const bc = document.getElementById('topbarBreadcrumb');
    if (!bc) return;
    let activeSecId = 'paso1';
    document.querySelectorAll('section.section').forEach(s => {
        if (s.style.display !== 'none' && window.getComputedStyle(s).display !== 'none') {
            activeSecId = s.id;
        }
    });
    const stepName = STEP_TITLES[activeSecId] || activeSecId;
    const activeSubBtn = document.querySelector('#' + activeSecId + ' .sub-tab-btn.active');
    const subName = activeSubBtn ? activeSubBtn.textContent.trim() : '';
    bc.innerHTML = '<span>Ruta:</span> <strong>' + stepName + '</strong>' + (subName ? ' <span>› ' + subName + '</span>' : '');
}

function selectMainSection(targetId, btnEl) {
    document.body.classList.remove('mobile-sidebar-open');
    document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-step-group').forEach(g => {
        if (g.getAttribute('data-group') !== targetId) g.classList.remove('expanded');
    });

    const targetBtn = btnEl || document.querySelector('.sidebar-nav-btn[data-target="' + targetId + '"]');
    if (targetBtn) {
        targetBtn.classList.add('active');
        const grp = targetBtn.closest('.sidebar-step-group');
        if (grp) grp.classList.add('expanded');
    }

    document.querySelectorAll('section.section').forEach(sec => {
        sec.style.display = 'none';
        sec.style.animation = 'none';
    });

    const targetSec = document.getElementById(targetId);
    if (targetSec) {
        targetSec.style.display = 'block';
        void targetSec.offsetWidth;
        targetSec.style.animation = 'fadeIn 0.35s ease-out forwards';
    }
    if (targetId === 'herramientaGramatical' && typeof renderGrammarElements === 'function') {
        renderGrammarElements();
    }
    if (targetId === 'mesaInteractiva' && typeof window.ensurePizarraReady === 'function') {
        window.ensurePizarraReady();
    }
    if (targetId === 'documentosSoporte' && typeof window.ensureDriveDocsLoaded === 'function') {
        window.ensureDriveDocsLoaded();
    }
    updateBreadcrumb();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.goToShortcut = function(stepId, tabId) {
    selectMainSection(stepId);
    setTimeout(() => {
        if (tabId) {
            const groupMap = { mesaInteractiva: 'mesa-tab', configGeneral: 'config' };
            const grpClass = groupMap[stepId] || stepId;
            openSubTab(null, tabId, grpClass);
        }
        const secEl = document.getElementById(stepId);
        if (secEl) secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateBreadcrumb();
    }, 50);
};

function syncIframeDarkMode(isDark) {
    const ifr = document.getElementById('markup-iframe');
    if (!ifr || !ifr.contentDocument || !ifr.contentDocument.body) return;
    const b = ifr.contentDocument.body;
    const c = ifr.contentDocument.querySelector('.container');
    if (isDark) {
        b.style.backgroundColor = '#12151e';
        b.style.color = '#e2e8f0';
        if (c) { c.style.backgroundColor = '#1c2234'; c.style.color = '#e2e8f0'; }
    } else {
        b.style.backgroundColor = '#f0f2f5';
        b.style.color = '#333';
        if (c) { c.style.backgroundColor = '#fff'; c.style.color = '#333'; }
    }
}

function closeQuickJumps() {
    const pop = document.getElementById('quickJumpsPopover');
    const btn = document.getElementById('quickJumpsBtn');
    if (pop) pop.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function openRefDrawer(tabKey) {
    document.getElementById('refDrawerBackdrop')?.classList.add('open');
    document.getElementById('refDrawer')?.classList.add('open');
    renderDrawerTab(tabKey || 'colores');
}

function closeRefDrawer() {
    document.getElementById('refDrawerBackdrop')?.classList.remove('open');
    document.getElementById('refDrawer')?.classList.remove('open');
}

function renderDrawerTab(tabKey) {
    document.querySelectorAll('.ref-drawer-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-dtab') === tabKey);
    });
    const body = document.getElementById('refDrawerBody');
    if (!body) return;

    if (tabKey === 'colores') {
        body.innerHTML = '<h4 style="margin-top:0;">Tus 9 Colores Gramaticales</h4>' +
            mkGramaticaData.map(function(g) {
                return '<div style="padding:8px 10px;border-left:4px solid ' + g.colorHex + ';margin-bottom:8px;border-radius:6px;background:rgba(148,163,184,0.08);">' +
                    '<strong>' + g.emoji + ' ' + g.nombre + '</strong> — <em>' + g.meta + '</em><br><span style="font-size:0.9em;">' + g.desc + '</span>' +
                '</div>';
            }).join('');
    } else if (tabKey === 'lentes') {
        body.innerHTML = '<h4 style="margin-top:0;">Los 7 Lentes Oficiales (Markup)</h4>' +
            mkLentesData.map(function(l) {
                return '<div style="padding:8px 10px;border-left:4px solid #2a5298;margin-bottom:8px;border-radius:6px;background:rgba(148,163,184,0.08);">' +
                    '<strong>' + l.num + '. ' + l.name + '</strong><br><span style="font-size:0.9em;">' + l.desc + '</span>' +
                '</div>';
            }).join('');
    } else if (tabKey === 'frases') {
        body.innerHTML = '<h4 style="margin-top:0;">Los 9 Tipos de Frases (Phrasing)</h4>' +
            phraseTypes.slice(0, 9).map(function(p) {
                return '<div style="padding:7px 10px;border-left:4px solid #007bff;margin-bottom:7px;border-radius:6px;background:rgba(148,163,184,0.08);">' +
                    '<strong>' + p.title + '</strong><br><span style="font-size:0.88em;">' + p.description + '</span>' +
                '</div>';
            }).join('');
    } else if (tabKey === 'rels18') {
        const all18 = coordinadas.concat(subordinadas);
        body.innerHTML = '<h4 style="margin-top:0;">18 Relaciones Lógicas (Discourse)</h4>' +
            all18.map(function(r) {
                return '<div style="padding:7px 10px;border-left:4px solid #ff7e5f;margin-bottom:7px;border-radius:6px;background:rgba(148,163,184,0.08);">' +
                    '<strong>' + r.title + '</strong><br><span style="font-size:0.88em;">' + r.description + '</span>' +
                '</div>';
            }).join('');
    } else if (tabKey === 'rels27') {
        body.innerHTML = '<h4 style="margin-top:0;">🟨 27 Relaciones de Fraseo (Flechas Amarillas)</h4>' +
            '<p style="font-size:0.9em;"><strong>Declaración Distinta (11):</strong> Fundamento (Ground), Resultado (Result), Propósito (Purpose), Ventaja (Advantage), Desventaja (Disadvantage), Condición (Condition), Temporal (Temporal), Locativa (Locative), Fuente (Source), Destino (Destination), Separación (Separation).</p>' +
            '<p style="font-size:0.9em;"><strong>Reiteración (15):</strong> Manera (Manner), Medios (Means), Agencia (Agency), Comparación (Comparison), Estándar (Standard), Negativa (Negative), Sustitución (Substitution), Explicación (Explanation), Contenido (Content), Contexto (Context), Distinción (Distinction), Ejemplo (Example), Acompañamiento (Accompaniment), Referencia (Reference), Respuesta (Answer).</p>' +
            '<p style="font-size:0.9em;"><strong>Declaración Contraria (1):</strong> Concesiva (Concessive).</p>';
    } else if (tabKey === 'gen19') {
        body.innerHTML = '<h4 style="margin-top:0;">🟦 19 Relaciones Genitivas (Flechas Azules)</h4>' +
            '<ol style="padding-left:18px;line-height:1.55;font-size:0.88em;">' +
                '<li><strong>Posesivo (Possessive):</strong> Pertenencia directa (<em>casa de Pedro</em>).</li>' +
                '<li><strong>Relación (Relationship):</strong> Vínculo personal/familiar (<em>apóstol de Cristo</em>).</li>' +
                '<li><strong>Partitivo (Partitive):</strong> El todo de una parte (<em>algunos de ellos</em>).</li>' +
                '<li><strong>Atributivo (Attributive):</strong> Genitivo califica al sustantivo (<em>palabra de verdad</em>).</li>' +
                '<li><strong>Atribuido (Attributed):</strong> Sustantivo es cualidad del genitivo (<em>riqueza de su gracia</em>).</li>' +
                '<li><strong>Productor (Producer):</strong> Genitivo produce el sustantivo (<em>fruto del Espíritu</em>).</li>' +
                '<li><strong>Producto (Product):</strong> Sustantivo produce el genitivo (<em>evangelio de paz</em>).</li>' +
                '<li><strong>Material (Material):</strong> De qué está hecho (<em>vaso de barro</em>).</li>' +
                '<li><strong>Contenido (Contents):</strong> De qué está lleno (<em>copa de vino; nube de testigos</em>).</li>' +
                '<li><strong>Subordinación (Subordination):</strong> Dominio sobre (<em>Señor de señores</em>).</li>' +
                '<li><strong>Separación (Separation):</strong> Alejado/libre de (<em>libre del pecado</em>).</li>' +
                '<li><strong>Origen / Fuente (Origin/Source):</strong> Procedencia (<em>justicia de Dios</em>).</li>' +
                '<li><strong>Referencia (Reference):</strong> Respecto a qué (<em>celo de Dios</em>).</li>' +
                '<li><strong>Aposición (Apposition):</strong> Define/iguala al sustantivo (<em>el don del Espíritu</em>).</li>' +
                '<li><strong>Subjetivo (Subjective):</strong> Genitivo hace la acción (<em>el amor de Dios</em> = Dios ama).</li>' +
                '<li><strong>Objetivo (Objective):</strong> Genitivo recibe la acción (<em>temor del Señor</em>).</li>' +
                '<li><strong>Tiempo (Time):</strong> Cuándo ocurre (<em>días de Herodes</em>).</li>' +
                '<li><strong>Lugar (Location):</strong> Dónde está (<em>iglesia de Corinto</em>).</li>' +
                '<li><strong>Descriptivo (Descriptive):</strong> Último recurso general.</li>' +
            '</ol>';
    } else if (tabKey === 'mybible') {
        body.innerHTML = '<h4 style="margin-top:0;">Paleta Permanente en My Bible</h4>' +
            '<ul style="padding-left:18px;line-height:1.6;">' +
                '<li>🔴 <strong>Rojo:</strong> Sangre, redención y sacrificio de Cristo</li>' +
                '<li>🟣 <strong>Morado:</strong> Persona de Cristo, gloria y venidas</li>' +
                '<li>🟡 <strong>Amarillo oliva:</strong> Espíritu Santo y su obra</li>' +
                '<li>🔵 <strong>Azul:</strong> Oración, gratitud y adoración</li>' +
                '<li>🟢 <strong>Verde:</strong> Reino de Dios, vida nueva y fruto</li>' +
                '<li>🟠 <strong>Naranja:</strong> Iglesia, comunión y misión</li>' +
                '<li>🩶 <strong>Gris:</strong> Pecado, advertencias y consecuencias</li>' +
                '<li>🩵 <strong>Turquesa:</strong> Promesas clave y esperanza eterna</li>' +
                '<li>🩷 <strong>Rosa:</strong> Palabra clave repetida del libro</li>' +
            '</ul>';
    }
}

const CMD_TARGETS = [
    { label: '🎨 Pizarra y Marcado Bíblico (9 Biblias)', tag: 'Taller', step: 'mesaInteractiva', sub: 'mesa-pizarra' },
    { label: '📐 Fraseo y Notas (DIALS)', tag: 'Taller', step: 'mesaInteractiva', sub: 'mesa-herramientas' },
    { label: '🧠 Asistente Exegético IA', tag: 'Taller', step: 'mesaInteractiva', sub: 'mesa-ai' },
    { label: '🔍 Búsqueda Gramatical y Referencia', tag: 'Buscador', step: 'herramientaGramatical', sub: '' },
    { label: '🎯 1.1 Introducción y Mapa Completo EBI', tag: 'Paso 1', step: 'paso1', sub: 'paso1-intro' },
    { label: '🔍 1.2 Observación Básica', tag: 'Paso 1', step: 'paso1', sub: 'paso1-basica' },
    { label: '📚 1.3 Teoría Gramatical (Morfología)', tag: 'Paso 1', step: 'paso1', sub: 'paso1-teoria' },
    { label: '🎨 1.4 Guía de Colores Biblearc (9 Colores)', tag: 'Paso 1', step: 'paso1', sub: 'paso1-colores' },
    { label: '🧬 1.5 Método Markup (2 Capas + Práctica)', tag: 'Paso 1', step: 'paso1', sub: 'paso1-explicacion-markup' },
    { label: '💻 1.6 Guía Visual: Los 7 Lentes', tag: 'Paso 1', step: 'paso1', sub: 'paso1-markup' },
    { label: '🛠️ 2.1 Los 5 Pases de DIALS y Flechas', tag: 'Paso 2', step: 'paso2', sub: 'paso2-dials' },
    { label: '🔤 2.2 Los 9 Tipos de Frases', tag: 'Paso 2', step: 'paso2', sub: 'paso2-frases' },
    { label: '📊 2.3 Tabla Extendida de las 27 Relaciones', tag: 'Paso 2', step: 'paso2', sub: 'paso2-27rels' },
    { label: '💻 2.4 Módulo Phrasing y 19 Genitivos', tag: 'Paso 2', step: 'paso2', sub: 'paso2-biblearc' },
    { label: '🤝 3.1 Las 18 Relaciones + Sit/R + 4 Extendidas', tag: 'Paso 3', step: 'paso3', sub: 'paso3-18rels' },
    { label: '📐 3.2 Arcing vs. Bracketing y Niveles de Lógica', tag: 'Paso 3', step: 'paso3', sub: 'paso3-discourse' },
    { label: '🧩 3.3 Conexiones Gramática → Lógica', tag: 'Paso 3', step: 'paso3', sub: 'paso3-aplicacion' },
    { label: '🧩 4.1 Sintaxis y Patrones de Oración', tag: 'Paso 4', step: 'paso4', sub: 'paso4-sintaxis' },
    { label: '🔬 4.2 Módulo Diagramming (Reed-Kellogg)', tag: 'Paso 4', step: 'paso4', sub: 'paso4-diagramming' },
    { label: '🔎 4.3 Léxico Original y Correlación (Searching)', tag: 'Paso 4', step: 'paso4', sub: 'paso4-correlacion' },
    { label: '✍️ 4.4 Paráfrasis y Contraste Bibliográfico', tag: 'Paso 4', step: 'paso4', sub: 'paso4-paraphrase' },
    { label: '📖 5.1 Guía Permanente para My Bible', tag: 'Paso 5', step: 'paso5', sub: 'paso5-mybible' },
    { label: '🔥 5.2 Saborear (Savor: Cabeza, Corazón, Manos)', tag: 'Paso 5', step: 'paso5', sub: 'paso5-savor' },
    { label: '🎤 5.3 Bosquejo y Enseñanza (Notes)', tag: 'Paso 5', step: 'paso5', sub: 'paso5-notes' },
    { label: '📂 Documentos y Formatos (Drive)', tag: 'Utilidad', step: 'documentosSoporte', sub: '' },
    { label: '⚙️ Configuración Global', tag: 'Utilidad', step: 'configGeneral', sub: 'config-ai' }
];

function openCmdPalette() {
    const ov = document.getElementById('cmdPaletteOverlay');
    const inp = document.getElementById('cmdPaletteInput');
    if (!ov || !inp) return;
    ov.classList.add('open');
    inp.value = '';
    renderCmdList('');
    setTimeout(function() { inp.focus(); }, 20);
}

function closeCmdPalette() {
    document.getElementById('cmdPaletteOverlay')?.classList.remove('open');
}

function renderCmdList(query) {
    const list = document.getElementById('cmdPaletteList');
    if (!list) return;
    const q = (query || '').toLowerCase().trim();
    const matches = CMD_TARGETS.filter(function(item) {
        return !q || item.label.toLowerCase().indexOf(q) !== -1 || item.tag.toLowerCase().indexOf(q) !== -1;
    });
    list.innerHTML = matches.map(function(m) {
        return '<button type="button" class="cmd-palette-item" onclick="goToShortcut(\'' + m.step + '\',\'' + m.sub + '\');closeCmdPalette();"><span>' + m.label + '</span><span style="font-size:0.78em;opacity:0.7;font-weight:700;">' + m.tag + '</span></button>';
    }).join('') || '<div style="padding:14px;text-align:center;opacity:0.7;">Sin coincidencias</div>';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('section.section').forEach(function(s) { s.style.display = 'none'; });
    const p1 = document.getElementById('paso1');
    if (p1) p1.style.display = 'block';

    const sbBtn = document.getElementById('sidebarToggleBtn');
    if (sbBtn) {
        sbBtn.addEventListener('click', function() {
            if (window.innerWidth <= 820) {
                document.body.classList.toggle('mobile-sidebar-open');
            } else {
                document.body.classList.toggle('sidebar-collapsed');
            }
        });
    }

    const qjBtn = document.getElementById('quickJumpsBtn');
    const qjPop = document.getElementById('quickJumpsPopover');
    if (qjBtn && qjPop) {
        qjBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = qjPop.classList.toggle('open');
            qjBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        document.addEventListener('click', function(e) {
            if (!qjPop.contains(e.target) && e.target !== qjBtn) {
                closeQuickJumps();
            }
        });
    }

    document.getElementById('openRefDrawerBtn')?.addEventListener('click', function() { openRefDrawer('colores'); });
    document.getElementById('openCmdPaletteBtn')?.addEventListener('click', openCmdPalette);
    document.getElementById('cmdPaletteInput')?.addEventListener('input', function(e) { renderCmdList(e.target.value); });

    const scales = [1, 1.1, 1.2];
    let scaleIdx = 0;
    document.getElementById('cycleReadingScaleBtn')?.addEventListener('click', function() {
        scaleIdx = (scaleIdx + 1) % scales.length;
        document.documentElement.style.setProperty('--reading-scale', String(scales[scaleIdx]));
    });

    document.getElementById('quickDarkModeBtn')?.addEventListener('click', function() {
        const cfgToggle = document.getElementById('darkModeToggle');
        if (cfgToggle) {
            cfgToggle.checked = !cfgToggle.checked;
            cfgToggle.dispatchEvent(new Event('change'));
        } else {
            const nextDark = !document.body.classList.contains('dark-mode');
            document.body.classList.toggle('dark-mode', nextDark);
            document.body.style.background = nextDark ? '#12151e' : '#f3f1ec';
            syncIframeDarkMode(nextDark);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (typeof window.isPizarraBoardOpen === 'function' && window.isPizarraBoardOpen()) return;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            openCmdPalette();
        } else if (e.key === 'Escape') {
            closeCmdPalette();
            closeRefDrawer();
            closeQuickJumps();
            document.body.classList.remove('mobile-sidebar-open');
        }
    });

    // =========================================================================
    // SECCIÓN DOCUMENTOS Y FORMATOS (GOOGLE DRIVE BAJO DEMANDA + XSS SAFE)
    // =========================================================================
    const EXEGESIS_DRIVE_URL = 'https://script.google.com/macros/s/AKfycbyunWSWNZhQr14De-GBapf2y7hV_wl3LnYYoqho4r2HeC2iDXH-2mNpdPI0haKfdkFb/exec';
    const viewGridBtn = document.getElementById('btnViewGrid');
    const viewListBtn = document.getElementById('btnViewList');
    const driveContainer = document.getElementById('driveDocsContainer');
    const driveLoading = document.getElementById('docsLoadingState');
    const driveError = document.getElementById('docsErrorState');
    let loadedDriveDocs = [];
    let driveCurrentMode = 'grid';
    let driveFetchedOnce = false;

    function escapeDriveHtml(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function safeDriveUrl(rawUrl) {
        const u = String(rawUrl || '').trim();
        return /^https?:\/\//i.test(u) ? escapeDriveHtml(u) : '#';
    }

    function renderDriveDocs() {
        if (!driveContainer) return;
        driveContainer.style.display = '';

        if (loadedDriveDocs.length === 0) {
            driveContainer.className = 'docs-grid-view';
            driveContainer.innerHTML = '<div class="docs-empty-card">La carpeta de formatos está vacía.</div>';
            return;
        }

        if (driveCurrentMode === 'grid') {
            driveContainer.className = 'docs-grid-view';
            driveContainer.innerHTML = loadedDriveDocs.map(function(doc) {
                const href = safeDriveUrl(doc.urlDrive);
                const ext = escapeDriveHtml(String(doc.extension || '').toUpperCase());
                return '<div class="doc-card">' +
                    '<div class="doc-header">' +
                        '<div class="doc-icon">📄</div>' +
                        '<div class="doc-actions">' +
                            '<a href="' + href + '" target="_blank" rel="noopener noreferrer" title="Abrir o descargar en Drive">↗️ Abrir</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="doc-title">' + escapeDriveHtml(doc.nombre) + '</div>' +
                    '<div class="doc-tags">' +
                        '<span>' + ext + '</span>' +
                        '<span class="doc-size-tag">' + escapeDriveHtml(doc['tamaño'] || doc.tamano || '') + '</span>' +
                    '</div>' +
                    '<div class="doc-footer">☁️ Drive Sync • ' + escapeDriveHtml(doc.fecha) + '</div>' +
                '</div>';
            }).join('');
        } else {
            driveContainer.className = 'docs-list-view';
            const rows = loadedDriveDocs.map(function(doc) {
                const href = safeDriveUrl(doc.urlDrive);
                const ext = escapeDriveHtml(String(doc.extension || '').toUpperCase());
                return '<tr>' +
                    '<td style="font-weight:700;">📄 ' + escapeDriveHtml(doc.nombre) + '</td>' +
                    '<td><span style="padding:3px 8px;border-radius:4px;font-size:0.8em;font-weight:700;">' + ext + '</span></td>' +
                    '<td style="color:#6366f1;font-weight:700;">' + escapeDriveHtml(doc['tamaño'] || doc.tamano || '') + '</td>' +
                    '<td style="font-size:0.9em;opacity:0.8;">' + escapeDriveHtml(doc.fecha) + '</td>' +
                    '<td style="text-align:right;">' +
                        '<a href="' + href + '" target="_blank" rel="noopener noreferrer" class="shortcut-btn" style="text-decoration:none;font-size:0.82em;padding:5px 10px;" title="Abrir o descargar en Drive">↗️ Abrir</a>' +
                    '</td>' +
                '</tr>';
            }).join('');
            driveContainer.innerHTML = '<table><thead><tr><th>Nombre</th><th>Tipo</th><th>Tamaño</th><th>Fecha</th><th style="text-align:right">Acción</th></tr></thead><tbody>' + rows + '</tbody></table>';
        }
    }

    if (viewGridBtn && viewListBtn) {
        viewGridBtn.addEventListener('click', function() {
            driveCurrentMode = 'grid';
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
            if (driveFetchedOnce) renderDriveDocs();
        });
        viewListBtn.addEventListener('click', function() {
            driveCurrentMode = 'list';
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            if (driveFetchedOnce) renderDriveDocs();
        });
    }

    window.ensureDriveDocsLoaded = function() {
        if (driveFetchedOnce || !EXEGESIS_DRIVE_URL.trim() || !driveContainer) return;
        driveFetchedOnce = true;
        if (driveLoading) driveLoading.style.display = 'block';
        if (driveError) driveError.style.display = 'none';
        driveContainer.style.display = 'none';

        fetch(EXEGESIS_DRIVE_URL)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data && data.error) throw new Error(data.error);
                loadedDriveDocs = Array.isArray(data) ? data : [];
                if (driveLoading) driveLoading.style.display = 'none';
                renderDriveDocs();
            })
            .catch(function(err) {
                driveFetchedOnce = false;
                if (driveLoading) driveLoading.style.display = 'none';
                if (driveError) {
                    driveError.style.display = 'block';
                    driveError.textContent = 'Error cargando archivos: ' + err.message;
                }
            });
    };

    const orderedFlow = [
        ['paso1', 'paso1-intro', 'Ir a Observación Básica →', 'paso1', 'paso1-basica'],
        ['paso1', 'paso1-basica', 'Ir a Teoría Gramatical →', 'paso1', 'paso1-teoria'],
        ['paso1', 'paso1-teoria', 'Ir a Guía de Colores →', 'paso1', 'paso1-colores'],
        ['paso1', 'paso1-colores', 'Ir a Método Markup (2 Capas) →', 'paso1', 'paso1-explicacion-markup'],
        ['paso1', 'paso1-explicacion-markup', 'Ir a Guía Visual: 7 Lentes →', 'paso1', 'paso1-markup'],
        ['paso1', 'paso1-markup', 'Avanzar al Paso 2: Fraseo (DIALS) →', 'paso2', 'paso2-dials'],
        ['paso2', 'paso2-dials', 'Ir a Los 9 Tipos de Frases →', 'paso2', 'paso2-frases'],
        ['paso2', 'paso2-frases', 'Ir a Tabla de 27 Relaciones →', 'paso2', 'paso2-27rels'],
        ['paso2', 'paso2-27rels', 'Ir a Phrasing y 19 Genitivos →', 'paso2', 'paso2-biblearc'],
        ['paso2', 'paso2-biblearc', 'Avanzar al Paso 3: Arqueo y Enmarcado →', 'paso3', 'paso3-18rels'],
        ['paso3', 'paso3-18rels', 'Ir a Arcing vs. Bracketing →', 'paso3', 'paso3-discourse'],
        ['paso3', 'paso3-discourse', 'Ir a Conexiones y Filtro →', 'paso3', 'paso3-aplicacion'],
        ['paso3', 'paso3-aplicacion', 'Avanzar al Paso 4: Profundización →', 'paso4', 'paso4-sintaxis'],
        ['paso4', 'paso4-sintaxis', 'Ir a Módulo Diagramming →', 'paso4', 'paso4-diagramming'],
        ['paso4', 'paso4-diagramming', 'Ir a Léxico y Correlación →', 'paso4', 'paso4-correlacion'],
        ['paso4', 'paso4-correlacion', 'Ir a Paráfrasis y Contraste →', 'paso4', 'paso4-paraphrase'],
        ['paso4', 'paso4-paraphrase', 'Avanzar al Paso 5: My Bible y Vida →', 'paso5', 'paso5-mybible'],
        ['paso5', 'paso5-mybible', 'Ir a Saborear (Savor) →', 'paso5', 'paso5-savor'],
        ['paso5', 'paso5-savor', 'Ir a Bosquejo (Notes) →', 'paso5', 'paso5-notes']
    ];

    orderedFlow.forEach(function(item) {
        const subId = item[1];
        const btnText = item[2];
        const nextStep = item[3];
        const nextSub = item[4];
        const el = document.getElementById(subId);
        if (el && !el.querySelector('.step-next-footer')) {
            const foot = document.createElement('div');
            foot.className = 'step-next-footer';
            foot.innerHTML = '<span style="font-size:0.84em;opacity:0.75;">💡 Atajo: presiona <code>Ctrl+K</code> para saltar a cualquier sección</span><button type="button" class="next-step-pill-btn" onclick="goToShortcut(\'' + nextStep + '\',\'' + nextSub + '\')">' + btnText + '</button>';
            el.appendChild(foot);
        }
    });

    updateBreadcrumb();
});
