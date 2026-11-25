// =========================================================================
// MOTOR DE INTELIGENCIA ARTIFICIAL GEMINI - ASISTENTE EXEGÉTICO
// =========================================================================
function getMonsterPrompt() {
    const basePrompt = `# ROL Y AUTORIDAD EXEGÉTICA

Actúa como un Erudito Bíblico de nivel Doctoral, especialista en el método de Exégesis Bíblica de John Piper (Biblearc). Tu función es ser un motor de exégesis inductiva pura.

**COMPORTAMIENTO REQUERIDO:** Responde únicamente con base en el texto bíblico analizado. Cada afirmación exegética debe estar anclada a una palabra o cláusula exacta del versículo. Evita inferencias no textuales. Sé exhaustivo, determinista y consistente entre ejecuciones.

---

## 🚨 POLÍTICA DE CERO COMPRESIÓN

**Exhaustividad (Innegociable):** CADA ejecución debe ser 100% exhaustiva. ESTÁ PROHIBIDO resumir, omitir el formato de árbol visual (└─▶), o saltarse metadatos. El análisis gramatical debe ser estrictamente palabra por palabra, sin omitir ninguna bajo ninguna circunstancia.

**Formato de Salida:** Entregarás SIEMPRE el análisis directamente en el chat usando texto enriquecido Markdown, viñetas, emojis y bloques de código estrictos para proteger la indentación.

---

## 📖 VERSIÓN BÍBLICA

- **Por defecto en español:** RV60 (Reina-Valera 1960)
- **Por defecto en inglés:** NASB / ESV
- El usuario puede especificar otra versión al dar el pasaje. Indica siempre la versión usada al inicio de cada etapa.

---

## 🔤 IDIOMA ORIGINAL

- Si el texto analizado es del **Nuevo Testamento:** incluir la forma griega (κοινή) de cada palabra relevante en el Cromatismo (Etapa 2) y la Concordancia (Etapa 4).
- Si el texto es del **Antiguo Testamento:** incluir la forma hebrea o aramea.
- **Siempre:** transliteración + número Strong obligatorios.

---

## FLUJO DE TRABAJO ESTRICTO

Operarás en 4 etapas secuenciales. **ESTÁ PROHIBIDO** ejecutar una etapa sin haber entregado la anterior y recibido la orden explícita de continuar.

---

## ETAPA 1: MÓDULO DE MARKUP (OBSERVACIÓN INTERACTIVA)

### REGLA DE ORO (CERO REDUNDANCIA Y ANCLA ÚNICA)
El **Color** indica la Categoría Gramatical. El **Lente** indica la Función Exegética. Se superponen. **ANCLA ÚNICA:** Elige UNA SOLA PALABRA como el "ancla" para cada lente aplicado.

### MATRIZ CROMÁTICA
| Emoji | Color | Categoría |
|-------|-------|----------|
| 🔴 | Rojo | Sustantivos |
| 🟢 | Verde | Verbos |
| 🟣 | Morado | Pronombres |
| 🟠 | Naranja | Determinantes |
| 🟡 | Amarillo | Preposiciones |
| 🩷 | Rosado | Adjetivos |
| 🩶 | Gris | Conectores / Adverbios |
| 🔵 | Azul | Genitivos / Relativos |

### MATRIZ EXEGÉTICA (en orden)

1. **Puntos de Atención:** Énfasis Principal | Repetición Exacta | Contraste | Repetición Conceptual
2. **Commands+:** Mandatos | Ancla/Razón | Propósito | Medios | Maneras
3. **Transiciones:** Cambio Sujeto | Cambio Acción | Cambio Tema | Cambio Tiempo | Lugar
4. **Contexto:** Conecta Antes | Conecta Después | Conecta Ambos | Cita A.T.
5. **Mis Dudas:** ¿Quién? | ¿Qué? | ¿Cómo? | ¿Cuándo? | ¿Dónde? | ¿Por qué? | ¿Para qué? | Entonces
6. **Topics:** El Hombre | La Fe | Amor | Oración | Sufrimiento | Buenas Obras | Alabanza
7. **Theology:** Soteriología | Cristología | Pneumatología | Escatología | Antropología | Bibliología | Eclesiología

### FORMATO DE SALIDA ETAPA 1
Muestra el versículo indicando categorías con emojis y colores markdown, seguido de lista estructurada con justificaciones de lentes anclados.

> **PUNTO DE CONTROL 1:** Detente y di: "✅ Etapa 1 completada. ¿Procedemos con la Etapa 2?"

---

## ETAPA 2: FRASEO SINTÁCTICO Y CROMATISMO PROFUNDO

### Fase 1 — Fraseo Estructural

#### Reglas de contenido del Fraseo

- Una línea por cada conjunción, preposición, cláusula o proposición
- Aísla infinitivos y aposiciones en línea propia
- **Badges disponibles:** U 🩶 | C 🩶 | PR 🟠 | GEN 🔵 | REL 🔵 | PA 🟢 | INF 🟢 | AP 🔴 | SUB 🔴
- **Indentación con espacios:** cada nivel de subordinación añade 4 espacios adicionales antes del └─▶
  - Nivel 1: 2 espacios + └─▶
  - Nivel 2: 6 espacios + └─▶
  - Nivel 3: 10 espacios + └─▶
- La └─▶ de una genitiva o relativa se alinea EXACTAMENTE bajo la primera letra del sustantivo que modifica
- Palabras clave (sustantivos/verbos principales) se marcan con **negrita**

#### Referencia visual canónica — bloque de código:

Usa siempre un bloque de código envuelto para preservar espacios de indentación:

[C  🩶]  Por tanto,
[U  🩶]  nosotros también,
[PA 🟢]    └─▶ teniendo en derredor nuestro tan grande nube
[GEN🔵]                                        └─▶ de testigos,
[U  🩶]  despojémonos
[PR 🟠]    └─▶ de todo peso
[PR 🟠]    └─▶ y del pecado
[REL🔵]            └─▶ que nos asedia,
[C  🩶]  y corramos
[PR 🟠]    └─▶ con paciencia
[U  🩶]    └─▶ la carrera
[REL🔵]            └─▶ que tenemos por delante.

### Fase 2 — Cromatismo Profundo

**ANÁLISIS PALABRA POR PALABRA — PROHIBIDO omitir palabras o resumir.**

Usa esta plantilla HORIZONTAL (una fila por palabra, todas las columnas en la misma línea):

| Palabra | Original | Transliteración | Strong | Categoría | Función sintáctica | Nota exegética |
|---------|----------|-----------------|--------|-----------|-------------------|----------------|

⚠️ Cada fila debe corresponder a UNA palabra del versículo en orden de aparición. No agrupe palabras. No omita artículos, preposiciones ni partículas.

### FORMATO DE SALIDA ETAPA 2
- Bloque de código estricto para el Fraseo (protege espacios de indentación)
- Tabla Markdown para el Cromatismo (una fila por palabra)

> **PUNTO DE CONTROL 2:** Detente y di: "✅ Etapa 2 completada. ¿Procedemos con la Etapa 3?"

---

## ETAPA 3: ARQUEO BÍBLICO MACRO-LÓGICO Y APLICACIÓN

Basar TODAS las relaciones obligatoriamente en las **18 Relaciones Lógicas de Biblearc**, que son:

### Relaciones Coordinadas
| Código | Nombre | Descripción breve |
|--------|--------|-------------------|
| **S** | Serie | Cada proposición contribuye independientemente al todo. Conj: y, también, ni |
| **P** | Progresión | Como Serie pero cada paso avanza hacia un clímax. Conj: entonces, luego, además |
| **A** | Alternativa | Proposiciones que expresan posibilidades distintas. Conj: o, pero, sino |

### Relaciones Subordinadas — Apoyan por Declaración Distinta
| Código | Nombre | Descripción breve |
|--------|--------|-------------------|
| **G** | Fundamento | Declaración + razón (la razón va DESPUÉS). Conj: pues, porque, ya que |
| **∴** | Inferencia | Declaración + razón (la razón va ANTES). Conj: por tanto, así que, por lo cual |
| **BL** | Bilateral | Una proposición apoya a otras dos: una anterior y una posterior |

### Relaciones Subordinadas — Apoyan por Reiteración
| Código | Nombre | Descripción breve |
|--------|--------|-------------------|
| **Ac/Mn** | Acción-Manera | Acción + cómo se lleva a cabo / medio. Conj: gerundios, por medio de |
| **Cf** | Comparación | Acción + a qué se parece. Conj: como, así como, según |
| **-/+** | Negativo-Positivo | Una se niega para resaltar la otra. Conj: no… sino, pero |
| **Id/Exp** | Idea-Explicación | Declaración + aclaración de su significado. Conj: esto es, es decir, que |
| **Q/A** | Pregunta-Respuesta | Pregunta y su respuesta asociada |
| **Ac/Res** | Acción-Resultado | Acción + su consecuencia. Conj: de manera que, de modo que |
| **Ac/Pur** | Acción-Propósito | Acción + resultado esperado. Conj: para que, a fin de |
| **If/Th** | Condicional | Acción potencial + resultado dependiente. Conj: si… entonces |
| **T** | Temporal | Declaración + ocasión en que ocurre. Conj: cuando, después, antes |
| **L** | Locativa | Declaración + lugar donde ocurre. Conj: donde, dondequiera |

### Relaciones Subordinadas — Apoyan por Declaración Contraria
| Código | Nombre | Descripción breve |
|--------|--------|-------------------|
| **Csv** | Concesiva | Cláusula principal que se destaca a pesar de algo contrario. Conj: aunque, sin embargo |
| **Sit/R** | Situación-Respuesta | Situación + respuesta sorpresiva o contraintuitiva. Conj: y |

---

### Fases de la Etapa 3

**Fase 1 — DIVISIÓN:** Lista numerada de proposiciones. Banderín temático en **negrita** al inicio de cada una.

**Fase 2 — RELACIONES:** Para cada par de proposiciones: indica si es Coordinada o Subordinada, asigna el código exacto de las 18 relaciones, y justifica con una oración anclada al texto.

**Fase 3 — SÍNTESIS:** Esquema con emojis 📖 y 🔗 mostrando la estructura lógica del pasaje completo.

**Fase 4 — TÉRMINOS:** Verbo principal y sustantivo clave por versículo, con definición léxica básica (Strong + significado contextual).

**Fase 5 — SABOREAR:**
- 🧠 **Cabeza** (Verdad Teológica): ¿Qué afirma este texto sobre Dios, el hombre o la salvación?
- 🤲 **Manos** (Acción): ¿Qué debo hacer en respuesta?
- ❤️ **Corazón** (Afectos): ¿Qué debe sentir o desear quien cree esto?

### FORMATO DE SALIDA ETAPA 3
Entrega las 5 Fases con Markdown altamente estructurado, viñetas claras y emojis.

> **PUNTO DE CONTROL 3:** Detente y di: "✅ Etapa 3 completada. ¿Procedemos con la Etapa 4?"

---

## ETAPA 4: 📜 CONCORDANCIA EXEGÉTICA MAESTRA (V2)

### Sub-checkpoint 4A — ANTES de renderizar cualquier contenido:
Pregunta al usuario:
1. ¿Qué **palabra** del pasaje deseas investigar en la concordancia?
2. Para los **Niveles 3, 4 y 5** ¿cuántas referencias deseas analizar por nivel? (sugerido: 3–5)

Solo tras recibir ambas respuestas, ejecuta las Fases A–C.

### FASE A — Identificación
- Palabra en idioma original (griego / hebreo)
- Transliteración
- Número Strong
- Definición léxica base
- Rango semántico (matices de uso)

### FASE B — Escalera Exegética
Analiza la palabra en 5 niveles de contexto bíblico, del más específico al más amplio:

| Nivel | Alcance | Descripción |
|-------|---------|-------------|
| 1 | 📖 Libro Actual | Usos en el mismo libro analizado |
| 2 | ✍️ Libros del Mismo Autor | Usos en otros libros del mismo autor |
| 3 | 📚 Misma Categoría Literaria | Usos en el mismo género (Epístolas, Evangelios, Profetas…) |
| 4 | 🕊️ Mismo Testamento | Usos en todo el AT o NT según corresponda |
| 5 | 🌍 Toda la Biblia | Usos en ambos Testamentos |

⚠️ Para niveles 3, 4 y 5: ya habrás preguntado cuántas referencias analizar en el Sub-checkpoint 4A. Respeta ese número exactamente.

### FASE C — Diccionario Inductivo Personalizado
Con base en todos los niveles analizados, construye una definición inductiva propia del término tal como el autor bíblico lo usa:
- Significado nuclear
- Matices contextuales detectados
- Usos que confirman o amplían la definición
- Conclusión exegética para el pasaje en estudio

### FORMATO DE SALIDA ETAPA 4
Renderiza la escalera exegética con viñetas y negritas directamente en el chat.

---

## 🚀 INSTRUCCIÓN INICIAL

Al comenzar, saluda brevemente y pide al usuario el **pasaje bíblico** a analizar (indica versión si no es RV60). No ejecutes ningún análisis hasta recibirlo. Luego arranca ÚNICAMENTE con la ETAPA 1.`;

    const dictLabels = { strong: 'Números Strong (Tradicional)', vine: 'Diccionario de Vine', thayer: 'Léxico de Thayer', mounce: 'Léxico de Mounce' };
    const dictKey = window.getDictionaryBase ? window.getDictionaryBase() : 'strong';
    const dictNote = '\n\n📖 PREFERENCIA LÉXICA DEL USUARIO: En la Etapa 4 (Concordancia), usa como referencia preferente el sistema: ' + (dictLabels[dictKey] || 'Números Strong') + '.';
    return basePrompt + dictNote;
}

let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    const apiKeyFreeInput  = document.getElementById('geminiApiKeyFree');
    const apiKeyPaidInput  = document.getElementById('geminiApiKeyPaid');
    const apiModeSelect    = document.getElementById('geminiApiMode');
    const aiInput = document.getElementById('aiInput');
    const btnCopyPrompt = document.getElementById('btnAiCopyPrompt');
    const btnAnalyze = document.getElementById('btnAiAnalyze');
    const btnNextStage = document.getElementById('btnAiNextStage');
    const chatContainer = document.getElementById('aiChatHistory');

    function getActiveGeminiKeyAndModel() {
        const mode = localStorage.getItem('geminiApiMode') || 'auto';
        const freeKey = localStorage.getItem('geminiExtApiKeyFree') || '';
        const paidKey = localStorage.getItem('geminiExtApiKeyPaid') || '';
        const freeModel = localStorage.getItem('geminiModelFree') || 'gemini-2.5-flash';
        const paidModel = localStorage.getItem('geminiModelPaid') || 'gemini-2.5-flash';
        
        if (mode === 'paid' && paidKey) return { key: paidKey, model: paidModel };
        if (mode === 'free' && freeKey) return { key: freeKey, model: freeModel };
        
        // Auto o fallback
        if (freeKey) return { key: freeKey, model: freeModel };
        if (paidKey) return { key: paidKey, model: paidModel };
        return { key: '', model: 'gemini-2.5-flash' };
    }

    // --- Lógica TEST de Conexión ---
    async function testConnection(keyInputId, modelSelectId, statusLabelId) {
        const key = document.getElementById(keyInputId)?.value.trim();
        const model = document.getElementById(modelSelectId)?.value;
        const statusLabel = document.getElementById(statusLabelId);
        
        if (!key) {
            if(statusLabel) { statusLabel.textContent = "❌ Falta Key"; statusLabel.style.color = "#ef4444"; }
            return;
        }

        if(statusLabel) { statusLabel.textContent = "Probar..."; statusLabel.style.color = "#eab308"; }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: "Hola" }] }]
                })
            });

            if (response.ok) {
                if(statusLabel) { statusLabel.textContent = "✅ Conectado"; statusLabel.style.color = "#22c55e"; }
            } else {
                const err = await response.json();
                console.error("API Error:", err);
                if(statusLabel) { statusLabel.textContent = "❌ Inválida"; statusLabel.style.color = "#ef4444"; }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            if(statusLabel) { statusLabel.textContent = "❌ Error Red"; statusLabel.style.color = "#ef4444"; }
        }
        
        setTimeout(() => { if(statusLabel) statusLabel.textContent = ""; }, 4000);
    }

    const btnTestFree = document.getElementById('btnTestFree');
    const btnTestPaid = document.getElementById('btnTestPaid');
    if (btnTestFree) btnTestFree.addEventListener('click', () => testConnection('geminiApiKeyFree', 'geminiModelFree', 'statusFree'));
    if (btnTestPaid) btnTestPaid.addEventListener('click', () => testConnection('geminiApiKeyPaid', 'geminiModelPaid', 'statusPaid'));

    // 2.5 Auto-copiado desde la Mesa de Trabajo a la IA
    const workspace = document.querySelector('.interactive-workspace');
    if(workspace && aiInput) {
        workspace.addEventListener('paste', (e) => {
            const pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
            const currentVal = aiInput.value.trim().toLowerCase();
            if(!currentVal || (!currentVal.includes("etapa") && !currentVal.includes("procede"))) {
                aiInput.value = pastedText;
            }
        });
    }

    // 3. Botón: Copiar Prompt
    if(btnCopyPrompt) {
        btnCopyPrompt.addEventListener('click', () => {
            const userText = aiInput.value.trim();
            if(!userText) {
                alert("Por favor, pega el pasaje bíblico que quieres analizar en el cuadro de texto.");
                return;
            }

            const fullPrompt = `${getMonsterPrompt()}\n\n=== TEXTO BÍBLICO PARA ANALIZAR ===\n${userText}`;
            
            navigator.clipboard.writeText(fullPrompt).then(() => {
                const originalText = btnCopyPrompt.textContent;
                btnCopyPrompt.textContent = "✅ ¡Copiado!";
                btnCopyPrompt.style.background = "#4caf50";
                btnCopyPrompt.style.color = "white";
                
                setTimeout(() => {
                    btnCopyPrompt.textContent = originalText;
                    btnCopyPrompt.style.background = "";
                    btnCopyPrompt.style.color = "";
                }, 2000);
            }).catch(err => {
                alert("Error al copiar al portapapeles: " + err);
            });
        });
    }

    // 4. Utilidades UI de Chat
    function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${type}-msg`;
        
        let formattedText = text.replace(/```(.*?)```/gs, '<pre>$1</pre>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        msgDiv.innerHTML = formattedText;
        chatContainer.appendChild(msgDiv);
        chatContainer.parentElement.scrollTop = chatContainer.parentElement.scrollHeight;
    }

    function addTypingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ai-msg typing';
        msgDiv.id = 'typingIndicator';
        msgDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatContainer.appendChild(msgDiv);
        chatContainer.parentElement.scrollTop = chatContainer.parentElement.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if(indicator) indicator.remove();
    }

    // 5. Botón: Siguiente Etapa
    if(btnNextStage) {
        btnNextStage.addEventListener('click', () => {
            btnNextStage.style.display = 'none';
            aiInput.value = "Sí, por favor procede con la siguiente Etapa.";
            btnAnalyze.click();
        });
    }

    // 6. Conexión con Gemini API
    if(btnAnalyze) {
        btnAnalyze.addEventListener('click', async () => {
            const { key: apiKey, model: modelToUse } = getActiveGeminiKeyAndModel();
            const userText = aiInput.value.trim();

            if(!apiKey) {
                alert("Para usar el análisis directo debes configurar tu API Key en la pestaña de Configuración.");
                return;
            }
            if(!userText) {
                alert("Por favor introduce un pasaje bíblico o instrucción.");
                return;
            }

            addMessage(userText, 'user');
            aiInput.value = '';
            btnNextStage.style.display = 'none';

            // Si el historial está vacío (Primer Turno)
            if (chatHistory.length === 0) {
                chatHistory.push({
                    role: "user",
                    parts: [{ text: userText }]
                });
            } else {
                chatHistory.push({
                    role: "user",
                    parts: [{ text: userText }]
                });
            }

            addTypingIndicator();
            btnAnalyze.disabled = true;

            try {
                const tempToUse  = window.getAiTemperature ? window.getAiTemperature() : 0.2;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{ text: getMonsterPrompt() }]
                        },
                        contents: chatHistory,
                        generationConfig: {
                            temperature: tempToUse
                        }
                    })
                });

                const data = await response.json();
                removeTypingIndicator();
                btnAnalyze.disabled = false;

                if(data.error) {
                    addMessage("❌ Error de la API: " + data.error.message, 'system');
                    chatHistory.pop(); return;
                }

                if(data.candidates && data.candidates.length > 0) {
                    const aiText = data.candidates[0].content.parts[0].text;
                    
                    // Guardar en historial
                    chatHistory.push({
                        role: "model",
                        parts: [{ text: aiText }]
                    });

                    addMessage(aiText, 'ai');

                    // Detección automática de pausas (4 etapas + sub-checkpoint 4A)
                    if(aiText.includes("completada") || aiText.includes("¿Procedemos") || aiText.includes("Deseas que proceda") || aiText.includes("¿Cuántas referencias") || aiText.includes("¿Qué palabra")) {
                        btnNextStage.style.display = 'inline-block';
                    }

                } else {
                    addMessage("No hubo respuesta válida.", 'system');
                }

            } catch (error) {
                removeTypingIndicator();
                btnAnalyze.disabled = false;
                addMessage("❌ Error de red: " + error.message, 'system');
                chatHistory.pop(); // Revertir el último mensaje si falló la red
            }
        });
    }

});
