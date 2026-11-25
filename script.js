document.addEventListener('DOMContentLoaded', () => {
        const navLinks = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        // INYECCIÓN AISLADA DEL IFRAME MARKUP
        // Esto asegura que tu código se renderice tal cual, sin heredar CSS externo
        const rawHTML = document.getElementById('markup-raw-content').textContent;
        const iframe = document.getElementById('markup-iframe');
        if (iframe) {
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(rawHTML);
            doc.close();
        }

        // 1. Ocultar todas excepto Paso 1
        sections.forEach(sec => sec.style.display = 'none');
        const firstSection = document.getElementById('paso1');
        if (firstSection) firstSection.style.display = 'block';

        // 2. Lógica de clics en las pestañas principales (SPA)
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                navLinks.forEach(btn => btn.classList.remove('active'));
                sections.forEach(sec => {
                    sec.style.display = 'none';
                    sec.style.animation = 'none';
                });

                this.classList.add('active');

                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.style.display = 'block';
                    void targetSection.offsetWidth;
                    targetSection.style.animation = "fadeIn 0.5s ease-out forwards";
                }
            });
        });
    });

    // 3. Función GENÉRICA para las Sub-Pestañas de los Pasos (Ej: Paso 3, 4 y 5)
    function openSubTab(event, tabId, groupClass) {
        // Ocultar todos los contenidos de este grupo
        const contents = document.querySelectorAll('.' + groupClass + '-content');
        contents.forEach(c => c.classList.remove('active'));

        // Quitar clase active de los botones de este grupo
        const buttons = document.querySelectorAll('.' + groupClass + '-btn');
        buttons.forEach(b => b.classList.remove('active'));

        // Activar el seleccionado
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
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

    // Función para los Accesos Directos
    function goToShortcut(stepId, tabId) {
        // Simular clic en el menú principal
        const navLink = document.querySelector(`a[href="#${stepId}"]`);
        if (navLink) navLink.click();

        // Simular clic en la sub-pestaña si existe un evento onclick con el tabId
        setTimeout(() => {
            const subTabs = document.querySelectorAll('.sub-tab-btn');
            subTabs.forEach(btn => {
                if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tabId}'`)) {
                    btn.click();
                }
            });
            // Hacer scroll hasta el contenedor
            document.getElementById(stepId).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

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
                const { bookName, chapter, verseStart, verseEnd } = activeBibleRef;
                badgeLabel.textContent = `${bookName} ${chapter}:${verseStart}–${verseEnd}`;
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
        }

        // Botón: Abrir en BibleGateway (LBLA)
        if (btnOpenBG) {
            btnOpenBG.addEventListener('click', () => {
                const parts   = bookSelect.value.split('|'); // [bookName, testament, abbrev]
                const book    = parts[0];
                const chapter = chapterInput.value || '1';
                const vStart  = verseStartInput.value || '1';
                const vEnd    = verseEndInput.value   || vStart;
                const search  = encodeURIComponent(`${book} ${chapter}:${vStart}-${vEnd}`);
                const url     = `https://www.biblegateway.com/passage/?search=${search}&version=LBLA`;
                openURL(url);
            });
        }

        // =====================================================
        // CARGAR TEXTO BÍBLICO A MESA DE TRABAJO (Auto-Fetch)
        // Usa API bolls.life con traducción LBLA
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
                const chapter  = parseInt(chapterInput.value)    || 1;
                const vStart   = parseInt(verseStartInput.value) || 1;
                const vEnd     = parseInt(verseEndInput.value)   || vStart;

                // Confirmar si ya hay contenido
                if (workspace.textContent.trim() && !confirm('¿Deseas reemplazar el contenido actual de la Mesa de Trabajo con el nuevo pasaje?')) {
                    return;
                }

                // Estado de carga
                btnLoadText.disabled = true;
                const originalHTML = btnLoadText.innerHTML;
                btnLoadText.innerHTML = '⏳ Cargando...';
                btnLoadText.style.opacity = '0.7';

                try {
                    const bookNum = bookToNumber[bookName];
                    if (!bookNum) throw new Error(`Libro "${bookName}" no reconocido`);

                    // API bolls.life: devuelve capítulo completo en LBLA
                    const url = `https://bolls.life/get-text/LBLA/${bookNum}/${chapter}/`;

                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`API respondió con error ${response.status}`);

                    const allVerses = await response.json();

                    // Filtrar por rango de versículos seleccionado
                    const filtered = allVerses.filter(v => v.verse >= vStart && v.verse <= vEnd);

                    if (filtered.length > 0) {
                        workspace.innerHTML = '';

                        filtered.forEach(v => {
                            const line = document.createElement('div');
                            line.className = 'phrase-line';
                            line.innerHTML = createPhraseLineHTML();
                            // Limpiar tags HTML (<i>, etc.) y saltos de línea
                            const cleanText = v.text.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                            line.querySelector('.phrase-text').textContent = `${v.verse} ${cleanText}`;
                            workspace.appendChild(line);
                        });

                        saveWorkspace();

                        // También fijar como pasaje activo automáticamente
                        const testament = parts[1];
                        const abbrev   = parts[2];
                        activeBibleRef = { bookName, testament, abbrev, chapter, verseStart: vStart, verseEnd: vEnd };
                        localStorage.setItem('activeBibleRef', JSON.stringify(activeBibleRef));
                        updatePassageBadge();

                        // Auto-copiar texto completo al Asistente Exegético IA
                        const plainVerses = filtered.map(v => {
                            const clean = v.text.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                            return `${v.verse} ${clean}`;
                        }).join('\n');
                        syncPassageToAI(bookName, chapter, vStart, vEnd, plainVerses);

                        // Feedback visual
                        btnLoadText.innerHTML = '✅ ¡Cargado en LBLA!';
                        btnLoadText.style.background = 'rgba(16,185,129,0.35)';
                        btnLoadText.style.opacity = '1';
                    } else {
                        throw new Error(`No se encontraron versículos ${vStart}-${vEnd} en ${bookName} ${chapter}`);
                    }
                } catch (err) {
                    console.error('Error al cargar pasaje:', err);
                    btnLoadText.innerHTML = '❌ Error';
                    btnLoadText.style.background = 'rgba(239,68,68,0.3)';
                    btnLoadText.style.opacity = '1';
                    alert('No se pudo cargar el texto automáticamente.\n\n' + err.message + '\n\nPuedes usar "Abrir en BibleGateway" y copiar manualmente.');
                }

                setTimeout(() => {
                    btnLoadText.disabled = false;
                    btnLoadText.innerHTML = originalHTML;
                    btnLoadText.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    btnLoadText.style.opacity = '1';
                }, 2500);
            });
        }

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
        
        // Cargar Autoguardado
        const savedData = localStorage.getItem('exegesisWorkSpaceV2');
        if (savedData && savedData.trim() !== '') {
            workspace.innerHTML = savedData;
            // Restaurar los values de los <select> ya que innerHTML no guarda el estado visual activo en el DOM a veces
            workspace.querySelectorAll('select.logic-rel, select.phrase-type').forEach(sel => {
                if (sel.getAttribute('data-val')) {
                    sel.value = sel.getAttribute('data-val');
                    // Restaurar colores si existen
                    const option = sel.options[sel.selectedIndex];
                    if (option) {
                        sel.style.backgroundColor = option.getAttribute('data-bg') || '';
                        sel.style.color = option.getAttribute('data-color') || '';
                    }
                }
            });
        }

        // Función de Guardado Automático
        function saveWorkspace() {
            // Actualizar referencias data-val de los selects para que sobrevivan en el HTML
            workspace.querySelectorAll('select.logic-rel, select.phrase-type').forEach(sel => {
                sel.setAttribute('data-val', sel.value);
            });
            localStorage.setItem('exegesisWorkSpaceV2', workspace.innerHTML);
        }

        workspace.addEventListener('input', saveWorkspace); // Autoguardar si tipean

        // Reaccionar al cambio del menú desplegable: Colorear y Guardar
        workspace.addEventListener('change', (e) => {
            if (e.target.classList.contains('logic-rel') || e.target.classList.contains('phrase-type')) {
                const option = e.target.options[e.target.selectedIndex];
                if (option) {
                    e.target.style.backgroundColor = option.getAttribute('data-bg') || '';
                    e.target.style.color = option.getAttribute('data-color') || '';
                }
            }
            saveWorkspace();
        });

        // ==========================================
        // A. MOTOR PHRASING (Enter, Tab, Pegado)
        // ==========================================
        function createPhraseLineHTML() {
            return `
                <div class="phrase-selectors">
                    <select class="phrase-type">
                        <option value="" data-bg="" data-color="">- Tipo -</option>
                        <option value="F-GEN" data-bg="#007bff" data-color="#fff">🔵 Genitiva</option>
                        <option value="F-PREP" data-bg="#ffc107" data-color="#333">🟡 Preposic.</option>
                        <option value="F-VERB" data-bg="#28a745" data-color="#fff">🟢 Verbal</option>
                        <option value="F-SUST" data-bg="#dc3545" data-color="#fff">🔴 Sustant.</option>
                        <option value="F-ADJ" data-bg="#ff66b2" data-color="#fff">💖 Adjetival</option>
                        <option value="F-ADV" data-bg="#6c757d" data-color="#fff">⚪ Adverbial</option>
                    </select>
                    <select class="logic-rel">
                        <option value="" data-bg="" data-color="">- Relación -</option>
                        <optgroup label="Coordinadas">
                            <option value="S">[S] Serie</option>
                            <option value="P">[P] Progresión</option>
                            <option value="A">[A] Alternativa</option>
                        </optgroup>
                        <optgroup label="Declaración Distinta">
                            <option value="G">[G] Fundamento (Ground)</option>
                            <option value="INF">[∴] Inferencia</option>
                            <option value="AC-RES">[Ac/Res] Acción-Resultado</option>
                            <option value="AC-PUR">[Ac/Pur] Acción-Propósito</option>
                            <option value="IF-TH">[If/Th] Condicional</option>
                            <option value="T">[T] Temporal</option>
                            <option value="L">[L] Locativa</option>
                            <option value="BL">[BL] Bilateral</option>
                        </optgroup>
                        <optgroup label="Reiteración">
                            <option value="AC-MN">[Ac/Mn] Acción-Manera</option>
                            <option value="CF">[Cf] Comparación</option>
                            <option value="NEG-POS">[-/+] Negativo-Positivo</option>
                            <option value="ID-EXP">[Id/Exp] Idea-Explicación</option>
                            <option value="QA">[Q/A] Pregunta-Respuesta</option>
                        </optgroup>
                        <optgroup label="Declaración Contraria">
                            <option value="CSV">[Csv] Concesiva</option>
                        </optgroup>
                    </select>
                </div>
                <div class="phrase-text" contenteditable="true" aria-placeholder="Escribe o pega aquí..."></div>
            `;
        }

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

                // Mover cursor
                const newRange = document.createRange();
                newRange.setStart(newLine.querySelector('.phrase-text'), 0);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
                
                saveWorkspace();
            }

            // 2. TAB -> Margin Left (Sangría)
            if (e.key === 'Tab') {
                e.preventDefault();
                let currentMargin = parseInt(currentLine.style.marginLeft || '0', 10);
                if (e.shiftKey) {
                    currentMargin = Math.max(0, currentMargin - 30);
                } else {
                    currentMargin += 30;
                }
                currentLine.style.marginLeft = currentMargin + 'px';
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
                { id: 'adverbio', label: 'Adverbios' }
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
                const relVal = relSelect && relSelect.selectedIndex > 0 ? relSelect.options[relSelect.selectedIndex].text : '';

                let badges = '';
                if (typeVal && typeVal !== '- Tipo -') {
                    const typeBg = typeSelect.style.backgroundColor || '#e0e0e0';
                    const typeColor = typeSelect.style.color || '#333';
                    badges += `<span style="
                        background: ${typeBg}; color: ${typeColor};
                        padding: 2px 8px; border-radius: 4px; font-size: 10px;
                        font-weight: 700; margin-right: 4px;
                    ">${typeVal}</span>`;
                }
                if (relVal && relVal !== '- Relación -') {
                    badges += `<span style="
                        background: #f0f4ff; color: #1e3c72;
                        padding: 2px 8px; border-radius: 4px; font-size: 10px;
                        font-weight: 700; border: 1px solid #c5d7f2;
                    ">${relVal}</span>`;
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
        { hex: '#ff66b2', emoji: '🩷', name: 'ROSADO' },
        { hex: '#6c757d', emoji: '🩶', name: 'GRIS' },
        { hex: '#17a2b8', emoji: '🩵', name: 'CELESTE' },
        { hex: '#6f42c1', emoji: '🟣', name: 'MORADO' }
    ];

    const categories = [
        { id: 'sustantivo', label: 'Sustantivos (Actores, Aposiciones)', defaultHex: '#dc3545' },
        { id: 'verbo', label: 'Verbos (Acciones, Participios, Infintivos)', defaultHex: '#28a745' },
        { id: 'pronombre', label: 'Pronombres (Relativas)', defaultHex: '#6f42c1' },
        { id: 'determinante', label: 'Determinantes (Vocativos, Exclamatorias)', defaultHex: '#fd7e14' },
        { id: 'genitivo', label: 'Genitivos', defaultHex: '#007bff' },
        { id: 'preposicion', label: 'Preposiciones', defaultHex: '#ffc107' },
        { id: 'adjetivo', label: 'Adjetivos', defaultHex: '#ff66b2' },
        { id: 'adverbio', label: 'Adverbios y Conjunciones', defaultHex: '#6c757d' },
        { id: 'secundario', label: 'Secundarios', defaultHex: '#17a2b8' }
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
            if (title.includes('artículos')) matchedCatId = 'determinante';
            if (title.includes('genitivos')) matchedCatId = 'genitivo';
            if (title.includes('preposiciones')) matchedCatId = 'preposicion';
            if (title.includes('adjetivos')) matchedCatId = 'adjetivo';
            if (title.includes('adverbios')) matchedCatId = 'adverbio';
            
            if (matchedCatId) {
                const hex = userConfig[matchedCatId] || categories.find(c => c.id === matchedCatId).defaultHex;
                btn.setAttribute('data-color', hex);
                const dot = btn.querySelector('.color-dot');
                if(dot) dot.style.backgroundColor = hex;
            }
        });
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
        document.body.style.background = isDark
            ? 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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

    // --- Modelo de Gemini ---
    const modelSelect  = document.getElementById('geminiModel');
    const savedModel   = loadWorkspacePref('geminiModel', 'gemini-2.5-flash');
    if (modelSelect) {
        modelSelect.value = savedModel;
        modelSelect.addEventListener('change', () => saveWorkspacePref('geminiModel', modelSelect.value));
    }
    window.getAiModel = () => loadWorkspacePref('geminiModel', 'gemini-2.5-flash');

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