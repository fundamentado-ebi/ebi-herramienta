// =============================================================================
// LÓGICA Y BASE DE DATOS DE LA HERRAMIENTA GRAMATICAL
// =============================================================================

// 1. RELACIONES LÓGICAS COORDINADAS
const coordinadas = [
    {
        id: 'serie',
        title: 'Serie (S)',
        icon: 'Serie',
        description: 'Cada proposición hace su propia contribución independiente al todo.',
        connectors: 'y, también, del mismo modo, ninguno, ni, en realidad, en verdad, mirad, de cierto, ahora bien, aun',
        greekConnectors: 'καί, δέ, τε, οὐδέ, οὐδείς, ἀληθῶς, ἰδοῦ, ἀμήν, νῦν δέ',
        example: 'amonestando a todos los hombres, y enseñando a todos los hombres con toda sabiduría (Colosenses 1:28).',
        category: 'logical-relations',
        subcategory: 'coordinadas',
        keywords: ['y', 'e', 'también', 'del mismo modo', 'ninguno', 'ni', 'en realidad', 'en verdad', 'mirad', 'de cierto', 'ahora bien', 'aun', 'además', 'asimismo', 'serie', 'series', 'coordinada', 'coordinadas']
    },
    {
        id: 'progresion',
        title: 'Progresión (P)',
        icon: 'Progresión',
        description: 'Como la serie, pero cada proposición es un paso más hacia un clímax.',
        connectors: 'entonces, y, además, luego',
        greekConnectors: 'τότε, καί, ἔτι, εἶτα',
        example: 'primero la hoja, luego la espiga, y después el grano maduro en la espiga. (Marcos 4:28).',
        category: 'logical-relations',
        subcategory: 'coordinadas',
        keywords: ['entonces', 'además', 'luego', 'después', 'primero', 'finalmente', 'progresión', 'progresion', 'progression', 'clímax']
    },
    {
        id: 'alternativa',
        title: 'Alternativa (A)',
        icon: 'Alternativa',
        description: 'Cada proposición expresa una posibilidad distinta que surge de una situación.',
        connectors: 'mientras tanto, entre tanto que, o, pero, mas, mientras, por otro lado',
        greekConnectors: 'ἐν τῷ μεταξύ, ἕως, ἤ, δέ, ἀλλά',
        example: '¿Eres tú el que ha de venir, o esperaremos a otro? (Mateo 11:3).',
        category: 'logical-relations',
        subcategory: 'coordinadas',
        keywords: ['mientras tanto', 'entre tanto que', 'o', 'u', 'pero', 'mas', 'mientras', 'por otro lado', 'bien', 'o bien', 'alternativa', 'alternative']
    }
];

// 2. RELACIONES LÓGICAS SUBORDINADAS (15 relaciones)
const subordinadas = [
    {
        id: 'fundamento',
        title: 'Fundamento (G)',
        icon: 'Fundamento',
        description: 'Una declaración y el argumento o razón de tal declaración (siempre la razón va después).',
        connectors: 'porque, por, desde que, puesto que, si, por cuanto, ya que, por causa de, pues',
        greekConnectors: 'γάρ, ὅτι, ἐπεί, διότι',
        example: 'No temáis, porque he aquí, os traigo buenas nuevas de gran gozo (Lucas 2:10).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['porque', 'por', 'desde que', 'puesto que', 'si', 'por cuanto', 'ya que', 'por causa de', 'pues', 'dado que', 'en vista de que', 'fundamento', 'ground', 'razón', 'causa', 'base']
    },
    {
        id: 'inferencia',
        title: 'Inferencia (∴)',
        icon: 'Inferencia',
        description: 'Una declaración y el argumento o razón de tal declaración (siempre la razón precede).',
        connectors: 'por lo tanto, pues, entonces, así que, por tanto, consecuentemente, en consecuencia, por eso, por consiguiente, ahora bien, así mismo',
        greekConnectors: 'οὖν, διό, ὅπως',
        example: 'No he hallado en El ningún delito digno de muerte; por tanto, le castigaré y le soltaré. (Lucas 23:22).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['por lo tanto', 'pues', 'entonces', 'así que', 'por tanto', 'consecuentemente', 'en consecuencia', 'por eso', 'por consiguiente', 'ahora bien', 'así mismo', 'por lo cual', 'de ahí que', 'inferencia', 'inference', 'conclusión']
    },
    {
        id: 'bilateral',
        title: 'Bilateral (BL)',
        icon: 'Bilateral',
        description: 'Una proposición que sirve de apoyo a otras dos, una es anterior y la otra posterior.',
        connectors: 'por, porque, por tanto, así',
        greekConnectors: 'γάρ, ὅτι, ἐπεί, διότι, οὖν, διό, ὅπως',
        example: 'no pudieron beber las aguas de Mara porque eran amargas; por tanto al lugar le pusieron el nombre de Mara. (Éxodo 15:23).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['por', 'porque', 'por tanto', 'así', 'bilateral', 'puente']
    },
    {
        id: 'accion-resultado',
        title: 'Acción-Resultado (Ac/Res)',
        icon: 'Resultado',
        description: 'Una acción y su consecuencia o resultado que acompaña a tal acción.',
        connectors: 'a fin de que, que, de modo que, de tal manera que, con el resultado, de manera que',
        greekConnectors: 'ὥστε',
        example: 'se desató una gran tormenta en el mar, de modo que las olas cubrían la barca (Mateo 8:24).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['a fin de que', 'que', 'de modo que', 'de tal manera que', 'con el resultado', 'de manera que', 'así que', 'resultado', 'consecuencia', 'accion-resultado', 'action-result']
    },
    {
        id: 'accion-proposito',
        title: 'Acción-Propósito (Ac/Pur)',
        icon: 'Propósito',
        description: 'Una acción y aquello que se espera que sea su resultado.',
        connectors: 'ya que, para que, para, a fin de que, con la mira de, no sea que',
        greekConnectors: 'ἵνα',
        example: 'Esto lo digo para que nadie os engañe (Colosenses 2:4).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['ya que', 'para que', 'para', 'a fin de que', 'con la mira de', 'no sea que', 'con el fin de', 'con el propósito de', 'a fin de', 'propósito', 'proposito', 'purpose', 'meta', 'fin']
    },
    {
        id: 'condicional',
        title: 'Condicional (If/Th)',
        icon: 'Condicional',
        description: 'Similar a Acción-Resultado excepto que la existencia de la acción es sólo potencial.',
        connectors: 'si...entonces, siempre que, excepto, cualquiera que',
        greekConnectors: 'εἰ, ἐάν, εἴτε, ἆρα',
        example: 'si hubiera algún otro daño, entonces pondrás como castigo vida por vida (Éxodo 21:23).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['si entonces', 'si...entonces', 'siempre que', 'excepto', 'cualquiera que', 'si', 'a menos que', 'con tal que', 'en caso de que', 'condicional', 'condición', 'conditional']
    },
    {
        id: 'temporal',
        title: 'Temporal (T)',
        icon: 'Temporal',
        description: 'Una declaración y la ocasión en que es verdad o puede ocurrir.',
        connectors: 'cuando, siempre que sea, antes, después, hasta que, mientras, entonces, ahora, al final, aun, todavía',
        greekConnectors: 'ὅταν, ὅτε, πρίν',
        example: 'Y cuando ayunéis, no pongáis cara triste (Mateo 6:16).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['cuando', 'siempre que sea', 'antes', 'antes que', 'después', 'después que', 'hasta que', 'mientras', 'entonces', 'ahora', 'al final', 'aun', 'todavía', 'desde cuando', 'en cuanto', 'temporal', 'tiempo']
    },
    {
        id: 'locativa',
        title: 'Locativa (L)',
        icon: 'Locativa',
        description: 'Una declaración y el lugar donde es verdad o puede ocurrir.',
        connectors: 'donde, donde sea, aquí, allí, allá, dondequiera',
        greekConnectors: 'ὅπου',
        example: 'adonde tú vayas, iré yo (Rut 1:16).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['donde', 'adonde', 'donde sea', 'aquí', 'allí', 'allá', 'dondequiera', 'en donde', 'locativa', 'lugar', 'locative']
    },
    {
        id: 'accion-manera',
        title: 'Acción-Manera (Ac/Mn)',
        icon: 'Manera',
        description: 'Una acción y una declaración que indica la forma o manera que la acción se lleva a cabo.',
        connectors: 'por, por medio, en que, gerundios',
        greekConnectors: 'διά',
        example: 'no dejó de dar testimonio de sí mismo, haciendo bien y dándoos lluvias del cielo (Hechos 14:17).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['por', 'por medio', 'por medio de', 'mediante', 'en que', 'gerundios', 'haciendo', 'siendo', 'estando', 'orando', 'andando', 'creyendo', 'manera', 'medios', 'manner', 'means']
    },
    {
        id: 'comparacion',
        title: 'Comparación (Cf)',
        icon: 'Comparación',
        description: 'Una acción y una declaración que da más detalles de la acción, mostrando a qué se parece.',
        connectors: 'como, de la misma forma, igualmente, así, así como, incluso como, tal como, según, de la misma manera, conforme a, así también, por lo cual',
        greekConnectors: 'ὡς, καθώς',
        example: 'Sed imitadores de mí, como también yo lo soy de Cristo. (1 Corintios 11:1).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['como', 'de la misma forma', 'igualmente', 'así', 'así como', 'incluso como', 'tal como', 'según', 'de la misma manera', 'conforme a', 'así también', 'comparación', 'comparacion', 'comparison', 'estándar']
    },
    {
        id: 'negativo-positivo',
        title: 'Negativo-Positivo (-/+)',
        icon: 'Negativo',
        description: 'Dos declaraciones, una de ellas se niega para que la otra sea resaltada.',
        connectors: 'no...sino',
        greekConnectors: 'ἀλλά',
        example: 'no seáis necios, sino entended cuál es la voluntad del Señor. (Efesios 5:17).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['no sino', 'no...sino', 'sino', 'pero no', 'no solamente', 'sino también', 'negativo-positivo', 'contraste']
    },
    {
        id: 'idea-explicacion',
        title: 'Idea-Explicación (Id/Exp)',
        icon: 'Explicación',
        description: 'La relación entre una declaración y otra que da más claridad a su significado.',
        connectors: 'esto es, que es, (que no es), que son, es decir',
        greekConnectors: 'ὅτι, γάρ, ἵνα',
        example: 'hasta que pereció toda la nación, es decir, los hombres de guerra que salieron de Egipto (Josué 5:6).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['esto es', 'que es', 'que no es', 'que son', 'es decir', 'a saber', 'o sea', 'en otras palabras', 'explicación', 'explicacion', 'idea-explicación']
    },
    {
        id: 'pregunta-respuesta',
        title: 'Pregunta-Respuesta (Q/A)',
        icon: 'Pregunta',
        description: 'La declaración de una pregunta y la respuesta asociada.',
        connectors: 'Pregunta marcada por ¿?',
        greekConnectors: 'Signo de interrogación',
        example: '¿qué dice la Escritura? Y creyó Abraham a Dios, y le fue contado por justicia. (Romanos 4:3).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['qué', 'quién', 'cómo', 'cuándo', 'dónde', 'por qué', 'para qué', 'cuál', 'cuánto', 'pregunta', 'respuesta', 'pregunta-respuesta']
    },
    {
        id: 'concesiva',
        title: 'Concesiva (Csv)',
        icon: 'Concesiva',
        description: 'Una cláusula principal que se destaca a pesar de una declaración contraria.',
        connectors: 'pero, pues, sino que, mas, aunque...todavía, no obstante, sin embargo, mucho más, sino, aun, ya, de otra manera, he aquí, a pesar de',
        greekConnectors: 'δέ, πλήν',
        example: 'siempre estaré listo para recordaros estas cosas, aunque vosotros ya las sabéis (2 Pedro 1:12).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['pero', 'pues', 'sino que', 'mas', 'aunque', 'no obstante', 'sin embargo', 'mucho más', 'sino', 'aun', 'ya', 'de otra manera', 'he aquí', 'a pesar de', 'aun cuando', 'si bien', 'concesiva', 'concessive']
    },
    {
        id: 'situacion-respuesta',
        title: 'Situación-Respuesta (Sit/R)',
        icon: 'Situación',
        description: 'Una situación y su respuesta sorpresiva o contra intuitiva.',
        connectors: 'y',
        greekConnectors: 'καί',
        example: '¡Cuántas veces quise juntar a tus hijos, como la gallina junta sus pollitos debajo de sus alas, y no quisiste! (Mateo 23:37).',
        category: 'logical-relations',
        subcategory: 'subordinadas',
        keywords: ['y respuesta inesperada', 'pero respuesta contraria', 'situación-respuesta', 'situacion-respuesta', 'situation-response']
    }
];

// 3. TIPOS DE FRASES
const phraseTypes = [
    {
        id: 'relative',
        title: 'Frase Relativa',
        icon: 'Relativa',
        description: 'Grupo de palabras que empieza con un pronombre relativo para describir o dar más información sobre un sustantivo.',
        indicators: 'que, quien, el cual, la cual, cuyo, donde, cuando (como relativos), which, who, whom, what, whose, that (como relativos)',
        function: 'Describe o define un sustantivo que las precede. Conecta la frase con el sustantivo anterior.',
        biblicalExample: '"lo que ha sido concebido en ella es del Espíritu Santo" (Mateo 1:20)',
        commonExample: '"La mujer que canta es mi madre", "El hombre quien ayudó fue Pedro"',
        category: 'phrase-types',
        subcategory: 'basic',
        keywords: ['que', 'quien', 'quienes', 'el cual', 'la cual', 'los cuales', 'las cuales', 'cuyo', 'cuya', 'cuyos', 'cuyas', 'donde', 'cuando', 'which', 'who', 'whom', 'what', 'whose', 'that', 'relativa', 'frase relativa']
    },
    {
        id: 'substantival',
        title: 'Frase Sustantiva',
        icon: 'Sustantiva',
        description: 'Grupo de palabras con verbo que funciona como un sustantivo (nombre).',
        indicators: 'lo que, que (como sujeto), el que, la que, what, that (como sujeto)',
        function: 'Puede ser sujeto, objeto o complemento en la oración. Funciona como si fuera un nombre.',
        biblicalExample: '"La prueba de vuestra fe produce paciencia" (Santiago 1:3)',
        commonExample: '"Que ames a Dios es lo más importante", "No entiendo lo que dices"',
        category: 'phrase-types',
        subcategory: 'basic',
        keywords: ['lo que', 'el que', 'la que', 'los que', 'las que', 'what', 'that', 'sustantival', 'sustantiva', 'frase sustantival']
    },
    {
        id: 'genitive',
        title: 'Frase Genitiva',
        icon: 'Genitiva',
        description: 'Indica pertenencia, origen o relación. Se reconoce porque usa "de" (en inglés "of" o apóstrofe \'s).',
        indicators: 'de, del, de la, de los, de las, of, \'s',
        function: 'Responde a las preguntas "¿de quién?" o "¿de qué?". Expresa posesión, origen o relación.',
        biblicalExample: '"fuente de salvación eterna" (Hebreos 5:9)',
        commonExample: '"El libro de María", "La paz de Dios"',
        category: 'phrase-types',
        subcategory: 'basic',
        keywords: ['de', 'del', 'de la', 'de los', 'de las', 'de dios', 'de cristo', 'de fe', 'of', 'genitivo', 'genitiva', 'frase genitiva']
    },
    {
        id: 'prepositional',
        title: 'Frase Preposicional',
        icon: 'Preposicional',
        description: 'Comienza con una preposición y da información adicional sobre lugar, tiempo, compañía o causa.',
        indicators: 'a, ante, bajo, cabe, con, contra, de, desde, durante, en, entre, hacia, hasta, mediante, para, por, según, sin, so, sobre, tras, versus, vía, in, on, at, by, for, with, from, to',
        function: 'Proporciona información adicional sobre lugar, tiempo, compañía, causa, manera o instrumento.',
        biblicalExample: '"en un sueño el ángel se le apareció" (Mateo 1:20)',
        commonExample: '"Vive en la ciudad", "Caminó con su amigo"',
        category: 'phrase-types',
        subcategory: 'structural',
        keywords: [
            'a', 'al', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde', 
            'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 
            'por', 'según', 'sin', 'so', 'sobre', 'tras', 'versus', 'vía',
            'a través de', 'en cuanto a', 'respecto a', 'acerca de', 'en cristo',
            'in', 'on', 'at', 'by', 'for', 'with', 'from', 'to', 'preposicional', 'frase preposicional'
        ]
    },
    {
        id: 'participle',
        title: 'Frase Participial',
        icon: 'Participial',
        description: 'Contiene un participio (verbo terminado en -ado, -ido, -ando, -iendo o -ing en inglés).',
        indicators: 'siendo, estando, habiendo, teniendo, corriendo, caminando, hablando, viviendo, words ending in -ado, -ido, -ando, -iendo, -ing',
        function: 'Describe cómo está alguien, en qué condición se encuentra, o cómo se realiza una acción.',
        biblicalExample: '"José, siendo un hombre justo..." (Mateo 1:19)',
        commonExample: '"Los niños, cansados, se durmieron", "Corriendo hacia casa, tropezó"',
        category: 'phrase-types',
        subcategory: 'descriptive',
        keywords: ['siendo', 'estando', 'habiendo', 'teniendo', 'corriendo', 'caminando', 'hablando', 'viviendo', 'orando', 'dando', 'sabiendo', 'creyendo', 'amado', 'llamado', 'bendecido', 'ando', 'iendo', 'ado', 'ido', 'ing', 'participial', 'participio', 'gerundio']
    },
    {
        id: 'unmarked',
        title: 'Frase No Marcada',
        icon: 'NoMarcada',
        description: 'Frase que no empieza con preposición, conjunción ni pronombre relativo. Aparece como declaración directa.',
        indicators: 'No tiene palabra introductoria específica, yuxtaposición directa',
        function: 'Aparece como declaración directa o yuxtaposición (colocada junto a otra sin nexo conector).',
        biblicalExample: '"Perseguiré, alcanzaré, repartiré el botín..." (Éxodo 15:9)',
        commonExample: '"Mañana temprano, reunión", "Él agotado, ella feliz"',
        category: 'phrase-types',
        subcategory: 'descriptive',
        keywords: ['yuxtaposición', 'declaración', 'directa', 'no marcada', 'unmarked']
    },
    {
        id: 'conjunction',
        title: 'Frase de Conjunción',
        icon: 'Conjunción',
        description: 'Comienza con una conjunción para unir frases o introducir ideas nuevas.',
        indicators: 'y, e, ni, o, u, pero, mas, sino, que, aunque, porque, si, cuando, mientras, pues, luego, and, but, or, that, if, when, while, because',
        function: 'Une frases o introduce ideas nuevas. Establece relaciones lógicas entre proposiciones.',
        biblicalExample: '"Y José hizo como el ángel mandó" (Mateo 1:24)',
        commonExample: '"Y llamó su nombre Jesús", "Pero no tuvo miedo"',
        category: 'phrase-types',
        subcategory: 'structural',
        keywords: [
            'y', 'e', 'ni', 'o', 'u', 'pero', 'mas', 'sino', 'que', 
            'aunque', 'porque', 'si', 'cuando', 'mientras', 'pues', 'luego',
            'and', 'but', 'or', 'that', 'if', 'when', 'while', 'because', 'conjunción', 'conjuncion'
        ]
    },
    {
        id: 'appositional',
        title: 'Frase Aposicional',
        icon: 'Aposicional',
        description: 'Un sustantivo que renombra a otro sustantivo para explicarlo o precisarlo.',
        indicators: 'Nombres o títulos que explican o renombran, generalmente entre comas',
        function: 'Explica o precisa el sustantivo anterior. Proporciona información adicional sobre la identidad.',
        biblicalExample: '"José, hijo de David..." (Mateo 1:20)',
        commonExample: '"Pedro, apóstol de Jesucristo", "Madrid, capital de España"',
        category: 'phrase-types',
        subcategory: 'descriptive',
        keywords: ['hijo de', 'apóstol de', 'rey de', 'ciudad de', 'presidente de', 'capital de', 'siervo de', 'aposicional', 'aposición', 'aposicion']
    },
    {
        id: 'infinitive',
        title: 'Frase Infinitiva',
        icon: 'Infinitiva',
        description: 'Contiene un infinitivo (forma básica del verbo: -ar, -er, -ir / to + verbo en inglés).',
        indicators: 'para + infinitivo, a + infinitivo, infinitivos (-ar, -er, -ir), to + verb',
        function: 'Expresa propósito, resultado o contenido. Indica la intención o meta de una acción.',
        biblicalExample: '"do not fear to take Mary as your wife" (Mateo 1:20)',
        commonExample: '"No temas tomar a María", "Salió a buscar ayuda"',
        category: 'phrase-types',
        subcategory: 'structural',
        keywords: ['para', 'a', 'tomar', 'hacer', 'ser', 'estar', 'ir', 'venir', 'amar', 'vivir', 'creer', 'saber', 'to', 'ar', 'er', 'ir', 'infinitiva', 'infinitivo']
    },
    {
        id: 'adverbial',
        title: 'Frase Adverbial',
        icon: 'Adverbial',
        description: 'Modifica verbos, adjetivos o adverbios, indicando manera, tiempo, lugar, cantidad o intensidad.',
        indicators: 'rápidamente, cuidadosamente, fielmente, muy, bastante, entonces, aquí, allí, words ending in -mente',
        function: 'Modifica la acción del verbo o intensifica adjetivos y otros adverbios.',
        biblicalExample: '"Respondió Jesús inmediatamente" (Marcos 1:43)',
        commonExample: '"Habló claramente", "Muy importante", "Bastante difícil"',
        category: 'phrase-types',
        subcategory: 'descriptive',
        keywords: ['rápidamente', 'cuidadosamente', 'fielmente', 'inmediatamente', 'claramente', 'siempre', 'hoy', 'muy', 'bastante', 'entonces', 'aquí', 'allí', 'mente', 'adverbial', 'adverbio']
    },
    {
        id: 'exclamatory',
        title: 'Frase Exclamativa',
        icon: 'Exclamativa',
        description: 'Expresa admiración, sorpresa, énfasis o emoción intensa.',
        indicators: '¡Qué!, ¡Cuán!, ¡Cómo!, exclamation marks, emphatic expressions',
        function: 'Expresan admiración, énfasis, sorpresa o emoción fuerte.',
        biblicalExample: '"¡Cuán hermosos son sobre los montes los pies del que trae alegres nuevas!" (Isaías 52:7)',
        commonExample: '"¡Qué grande es Dios!", "¡Cuán misericordioso!", "¡Cómo ama!"',
        category: 'phrase-types',
        subcategory: 'emphatic',
        keywords: ['qué', 'cuán', 'cómo', 'quién', 'cuánto', 'cuánta', 'cuántos', 'cuántas', 'ay', 'exclamativa', 'interjección']
    },
    {
        id: 'vocative',
        title: 'Frase Vocativa',
        icon: 'Vocativa',
        description: 'Llamamiento o invocación directa a una persona, deidad o entidad.',
        indicators: 'Oh, Señor, Padre, nombres propios en llamamiento directo',
        function: 'Invoca, llama o se dirige directamente a alguien. Función de llamamiento.',
        biblicalExample: '"Oh Señor, Dios nuestro" (Salmo 8:1)', 
        commonExample: '"Padre nuestro", "Oh Dios", "Señor Jesús"',
        category: 'phrase-types',
        subcategory: 'emphatic',
        keywords: ['oh', 'señor', 'padre', 'dios', 'jesús', 'cristo', 'maestro', 'hermanos', 'amados', 'vocativa', 'vocativo']
    }
];

// 4. PREPOSICIONES GRIEGAS
const greekPrepositions = [
    { id: 'ana', title: 'ἀνά (ana)', icon: 'Ascendente', greekText: 'ἀνά', latinEquivalent: 'per, super', basicMeaning: 'De abajo arriba', withAccusative: 'Hacia arriba, durante (distributivo)', withGenitive: 'No se usa comúnmente', biblicalExamples: 'ἀνὰ μέσον (en medio de)', function: 'Expresa movimiento ascendente o distribución', category: 'prepositions', keywords: ['ana', 'ἀνά', 'en medio de'] },
    { id: 'eis', title: 'εἰς (eis)', icon: 'Hacia', greekText: 'εἰς', latinEquivalent: 'in (+ ac.)', basicMeaning: 'Hacia dentro', withAccusative: 'A, adentro, hacia (dirección)', withGenitive: 'No se usa', biblicalExamples: 'εἰς τὸν οὐρανόν', function: 'Indica dirección hacia el interior', category: 'prepositions', keywords: ['eis', 'εἰς', 'hacia', 'a', 'adentro'] },
    { id: 'anti', title: 'ἀντί (anti)', icon: 'Intercambio', greekText: 'ἀντί', latinEquivalent: 'contra, pro', basicMeaning: 'Frente a / en lugar de', withAccusative: 'No se usa comúnmente', withGenitive: 'En vez de, en lugar de, por', biblicalExamples: 'ἀντὶ τούτων', function: 'Expresa substitución o intercambio', category: 'prepositions', keywords: ['anti', 'ἀντί', 'en lugar de', 'en vez de'] },
    { id: 'apo', title: 'ἀπό (apo)', icon: 'Alejamiento', greekText: 'ἀπό', latinEquivalent: 'a, ab', basicMeaning: 'Alejamiento', withAccusative: 'No se usa', withGenitive: 'De, desde, lejos de', biblicalExamples: 'ἀπὸ τῶν οὐρανῶν', function: 'Indica origen o separación', category: 'prepositions', keywords: ['apo', 'ἀπό', 'desde', 'lejos de'] },
    { id: 'ek', title: 'ἐκ / ἐξ (ek/ex)', icon: 'Salida', greekText: 'ἐκ / ἐξ', latinEquivalent: 'ex, e', basicMeaning: 'Salida', withAccusative: 'No se usa', withGenitive: 'De, de dentro, fuera de', biblicalExamples: 'ἐκ τῆς καρδίας', function: 'Expresa salida del interior o origen', category: 'prepositions', keywords: ['ek', 'ex', 'ἐκ', 'ἐξ', 'fuera de', 'de dentro'] },
    { id: 'pro', title: 'πρό (pro)', icon: 'Precedencia', greekText: 'πρό', latinEquivalent: 'pro, prae', basicMeaning: 'Delante, preferencia', withAccusative: 'No se usa comúnmente', withGenitive: 'Ante, antes de, en pro de', biblicalExamples: 'πρὸ τῶν αἰώνων', function: 'Indica anterioridad temporal o espacial', category: 'prepositions', keywords: ['pro', 'πρό', 'antes de', 'ante'] },
    { id: 'en', title: 'ἐν (en)', icon: 'Interior', greekText: 'ἐν', latinEquivalent: 'in (+ ab.)', basicMeaning: 'Dentro, en el interior', withAccusative: 'No se usa', withGenitive: 'No se usa', withDative: 'En, dentro de, por medio de', biblicalExamples: 'ἐν τῷ κόσμῳ', function: 'Indica ubicación interior o instrumento', category: 'prepositions', keywords: ['en', 'ἐν', 'dentro de'] },
    { id: 'syn', title: 'σύν (syn)', icon: 'Compañía', greekText: 'σύν', latinEquivalent: 'cum', basicMeaning: 'Compañía', withAccusative: 'No se usa', withGenitive: 'No se usa', withDative: 'Con, junto con', biblicalExamples: 'σὺν αὐτῷ', function: 'Expresa compañía o asociación', category: 'prepositions', keywords: ['syn', 'σύν', 'con', 'junto con'] },
    { id: 'dia', title: 'διά (dia)', icon: 'Atravesar', greekText: 'διά', latinEquivalent: 'per, di-, dis-', basicMeaning: 'Por entre, a través de', withAccusative: 'Por (causa de)', withGenitive: 'Por, a través de, por medio de', biblicalExamples: 'διὰ τοῦτο, διὰ τῆς πίστεως', function: 'Indica medio, causa o paso a través', category: 'prepositions', keywords: ['dia', 'διά', 'a través de', 'por medio de', 'por causa de'] },
    { id: 'kata', title: 'κατά (kata)', icon: 'Descendente', greekText: 'κατά', latinEquivalent: 'per, ad, secundum', basicMeaning: 'De arriba abajo', withAccusative: 'Hacia abajo, según', withGenitive: 'De (arriba abajo), contra', biblicalExamples: 'κατὰ σάρκα', function: 'Expresa conformidad o oposición', category: 'prepositions', keywords: ['kata', 'κατά', 'según', 'conforme a', 'contra'] },
    { id: 'hyper', title: 'ὑπέρ (hyper)', icon: 'Superior', greekText: 'ὑπέρ', latinEquivalent: 'super', basicMeaning: 'Sobre, encima de', withAccusative: 'Más (allá) de', withGenitive: 'Sobre, a favor de, en nombre de', biblicalExamples: 'ὑπὲρ ἡμῶν', function: 'Indica superioridad o representación', category: 'prepositions', keywords: ['hyper', 'ὑπέρ', 'a favor de', 'en nombre de'] },
    { id: 'meta', title: 'μετά (meta)', icon: 'Entre', greekText: 'μετά', latinEquivalent: 'inter, cum, post, trans', basicMeaning: 'En medio de, entre', withAccusative: 'Después de', withGenitive: 'Con, en medio de', biblicalExamples: 'μετὰ ταῦτα, μεθ᾽ αὐτοῦ', function: 'Expresa compañía o posterioridad', category: 'prepositions', keywords: ['meta', 'μετά', 'después de', 'entre'] },
    { id: 'epi', title: 'ἐπί (epi)', icon: 'Encima', greekText: 'ἐπί', latinEquivalent: 'in, super', basicMeaning: 'Sobre, encima', withAccusative: 'A, hacia; por, contra', withGenitive: 'Sobre, a, en (tiempo)', withDative: 'Sobre, en, junto a', biblicalExamples: 'ἐπὶ τῆς γῆς', function: 'Indica posición superior o dirección', category: 'prepositions', keywords: ['epi', 'ἐπί', 'sobre', 'encima'] },
    { id: 'para', title: 'παρά (para)', icon: 'AlLado', greekText: 'παρά', latinEquivalent: 'apud, ad', basicMeaning: 'Al lado', withAccusative: 'A, hacia, a lo largo de', withGenitive: 'De parte de', withDative: 'Junto a, al lado de', biblicalExamples: 'παρὰ θεοῦ', function: 'Indica proximidad o origen', category: 'prepositions', keywords: ['para', 'παρά', 'de parte de', 'al lado de'] },
    { id: 'pros', title: 'πρός (pros)', icon: 'Presencia', greekText: 'πρός', latinEquivalent: 'ad', basicMeaning: 'En presencia de, junto a', withAccusative: 'A, hacia, contra, para', withGenitive: 'No se usa comúnmente', withDative: 'De lado de, de parte de', biblicalExamples: 'πρὸς τὸν θεόν', function: 'Indica dirección o relación', category: 'prepositions', keywords: ['pros', 'πρός', 'hacia', 'junto a'] },
    { id: 'hypo', title: 'ὑπό (hypo)', icon: 'Debajo', greekText: 'ὑπό', latinEquivalent: 'sub', basicMeaning: 'Debajo de', withAccusative: 'Bajo, hacia', withGenitive: 'Bajo, por (agente)', biblicalExamples: 'ὑπὸ τὸν οὐρανόν', function: 'Indica posición inferior o agente', category: 'prepositions', keywords: ['hypo', 'ὑπό', 'bajo', 'debajo de'] }
];

// 5. EXPRESIONES GRAMATICALES
const grammaticalExpressions = [
    { id: 'para_siempre', title: 'para siempre', icon: 'Temporal', expression: 'para siempre', morphology: 'Locución adverbial de tiempo.', function: 'Expresa tiempo indefinido.', example: 'Tu misericordia es "para siempre"', importance: 'Indica duración.', category: 'expressions', keywords: ['para siempre', 'eternamente', 'por los siglos'] },
    { id: 'ciertamente', title: 'ciertamente', icon: 'Afirmación', expression: 'ciertamente', morphology: 'Adverbio de afirmación.', function: 'Refuerza veracidad.', example: '"Ciertamente" llevaré tu carga', importance: 'Intensifica.', category: 'expressions', keywords: ['ciertamente', 'de cierto', 'en verdad', 'amén'] },
    { id: 'siendo', title: 'siendo', icon: 'Gerundio', expression: 'siendo', morphology: 'Gerundio de "ser".', function: 'Marca proceso.', example: 'Noé, "siendo" advertido…', importance: 'Forma no personal.', category: 'expressions', keywords: ['siendo', 'estando', 'habiendo'] },
    { id: 'advertido', title: 'advertido', icon: 'Participio', expression: 'advertido', morphology: 'Participio de "advertir".', function: 'Voz pasiva / adjetivo.', example: '"Advertido" por Dios', importance: 'Pasiva progresiva.', category: 'expressions', keywords: ['advertido', 'justificados', 'llamados', 'santificados'] },
    { id: 'he_aqui', title: 'he aquí', icon: 'Enfático', expression: 'he aquí', morphology: 'Locución presentativa.', function: 'Introduce anuncio.', example: '"He aquí" yo estoy con vosotros', importance: 'Marcador de atención.', category: 'expressions', keywords: ['he aquí', 'he ahí', 'mirad'] },
    { id: 'por_tanto', title: 'por tanto', icon: 'Conclusión', expression: 'por tanto', morphology: 'Locución consecutiva.', function: 'Introduce conclusión.', example: '"Por tanto", id y haced discípulos', importance: 'Nexo lógico.', category: 'expressions', keywords: ['por tanto', 'por lo tanto', 'así que', 'por consiguiente'] }
];

// 6. MORFOLOGÍA ESPAÑOLA (Complementada con categorías clave de tu paleta)
const morfologiaEspanola = [
    { id: 'sust_general', title: 'Sustantivo (🔴 Rojo)', icon: '🔴', description: 'Nombra personas, lugares, objetos o conceptos abstractos (actores de la proposición).', indicators: 'Dios, Cristo, Jesús, Espíritu, fe, gracia, amor, mundo, pecado, verdad, iglesia, luz', function: 'Sujeto, objeto directo, objeto indirecto o término de preposición.', category: 'morphology', keywords: ['sustantivo', 'sustantivos', 'nombre', 'dios', 'cristo', 'jesús', 'espíritu', 'fe', 'gracia', 'amor', 'mundo', 'pecado', 'verdad', 'iglesia', 'luz', 'vida', 'evangelio'] },
    { id: 'verbo_general', title: 'Verbo (🟢 Verde)', icon: '🟢', description: 'Expresa acción, proceso o estado (núcleo del predicado y motor de la proposición).', indicators: 'amó, dio, es, son, fue, creer, andar, salvar, orar, vivir, ser, estar', function: 'Núcleo verbal de la proposición (Indicativo, Imperativo, Subjuntivo, Infinitivo, Participio).', category: 'morphology', keywords: ['verbo', 'verbos', 'acción', 'acciones', 'indicativo', 'imperativo', 'subjuntivo', 'amó', 'dio', 'es', 'son', 'fue', 'creer', 'andar', 'salvar', 'orar', 'vivir', 'ser', 'estar'] },
    { id: 'pron_personal', title: 'Pronombre Personal (🟣 Morado)', icon: '👤', description: 'Sustituye al sujeto u objeto para rastrear actores en el argumento.', indicators: 'yo, tú, él, ella, nosotros, vosotros, ellos, me, te, se, le, les, nos, os, lo, la', function: 'Núcleo del sujeto u objeto.', category: 'morphology', keywords: ['pronombre', 'pronombres', 'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'me', 'te', 'le', 'les', 'se', 'nos', 'os', 'lo', 'la'] },
    { id: 'pron_relativo', title: 'Pronombre Relativo (🟣 Morado)', icon: '🔗', description: 'Se refiere a un antecedente e introduce una frase relativa.', indicators: 'que, cual, el cual, la cual, quien, quienes, cuyo', function: 'Introduce subordinada adjetiva / relativa.', category: 'morphology', keywords: ['que', 'cual', 'quien', 'quienes', 'cuyo', 'el cual', 'la cual', 'los cuales'] },
    { id: 'det_articulo', title: 'Determinante / Artículo (🟠 Naranja)', icon: '🟠', description: 'Acompaña al sustantivo para especificarlo, cuantificarlo o indicar posesión.', indicators: 'el, la, los, las, un, una, unos, unas, este, ese, aquel, todo, cada, mi, tu, su, nuestro, vuestro', function: 'Presenta y delimita al sustantivo (en griego marca definición o cualidad).', category: 'morphology', keywords: ['determinante', 'determinantes', 'artículo', 'artículos', 'articulo', 'articulos', 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'este', 'esta', 'ese', 'aquel', 'todo', 'toda', 'todos', 'todas', 'cada', 'mi', 'tu', 'su', 'sus', 'nuestro', 'nuestra', 'vuestro', 'vuestra'] },
    { id: 'adv_negacion', title: 'Adverbio de Negación / Modo (🩶 Gris)', icon: '🚫', description: 'Niega o modifica la acción del verbo, un adjetivo u otro adverbio.', indicators: 'no, nunca, jamás, tampoco, ciertamente, siempre, hoy, así, muy', function: 'Modifica el verbo (en griego οὐ = negación objetiva, μή = negación subjetiva).', category: 'morphology', keywords: ['adverbio', 'adverbios', 'negación', 'no', 'nunca', 'jamás', 'tampoco', 'siempre', 'hoy', 'así', 'muy', 'bien', 'mal'] },
    { id: 'adj_calificativo', title: 'Adjetivo (🩷 Rosado)', icon: '🎨', description: 'Expresa cualidades o atributos que califican al sustantivo.', indicators: 'santo, justo, grande, bueno, malo, fiel, verdadero, eterno, eterna', function: 'Modifica al sustantivo (uso atributivo o predicativo).', category: 'morphology', keywords: ['adjetivo', 'adjetivos', 'santo', 'santa', 'santos', 'justo', 'grande', 'bueno', 'buen', 'malo', 'fiel', 'fieles', 'verdadero', 'eterno', 'eterna'] },
    { id: 'preposicion_esp', title: 'Preposición (🟡 Amarillo)', icon: '🟡', description: 'Une a otras palabras indicando posición, dirección, tiempo, medio o causa.', indicators: 'en, de, por, para, con, a, desde, hacia, hasta, sin, sobre, tras', function: 'Los Puentes de relación sintáctica.', category: 'morphology', keywords: ['preposición', 'preposicion', 'preposiciones', 'en', 'de', 'por', 'para', 'con', 'a', 'desde', 'hacia', 'hasta', 'sin', 'sobre', 'tras'] },
    { id: 'genitivo_esp', title: 'Genitivo / Relativo (🔵 Azul)', icon: '🔵', description: 'Indican pertenencia, origen o relación ("de...") o abren cláusulas descriptivas.', indicators: 'de Dios, de vida, el cual, la cual, lo que, cuyo', function: 'Posesivos y Enganches descriptivos.', category: 'morphology', keywords: ['genitivo', 'genitivos', 'de vida', 'de dios', 'el cual', 'la cual', 'los cuales', 'las cuales', 'lo que', 'cuyo', 'cuya'] },
    { id: 'secundario', title: 'Secundario (🔮 Lila)', icon: '🔮', description: 'Numerales significativos, partículas menores o expresiones enfáticas.', indicators: 'oh, ay, amén, siete, doce, he aquí', function: 'Los Especiales / Extras.', category: 'morphology', keywords: ['secundario', 'secundarios', 'oh', 'ay', 'amén', 'amen', 'ea', 'siete', 'doce'] }
];

// =============================================================================
// LÓGICA DE BÚSQUEDA Y RENDERIZADO
// =============================================================================
let currentFilter = 'all';
let searchTerm = '';
let showGreek = false;

function identifyGrammarElements(input) {
    if (!input.trim()) return [];
    const inputLower = input.toLowerCase().trim();
    const matches = [];

    const allData = [...coordinadas, ...subordinadas, ...phraseTypes, ...grammaticalExpressions, ...greekPrepositions, ...morfologiaEspanola];

    allData.forEach(item => {
        if (item.keywords && item.keywords.some(k => k.toLowerCase() === inputLower)) {
            matches.push(item);
        }
    });

    return matches;
}

function renderIdentification(matches) {
    const resultDiv = document.getElementById('identificationResult');
    const matchedDiv = document.getElementById('matchedElements');
    if(!resultDiv || !matchedDiv) return;
    
    if (matches.length > 0) {
        matchedDiv.innerHTML = matches.map(match => {
            let colorClass = 'match-expression';
            let annotation = '';
            
            if (match.category === 'phrase-types') {
                switch(match.id) {
                    case 'prepositional': colorClass = 'match-phrase-preposicional'; annotation = 'P'; break;
                    case 'genitive': colorClass = 'match-phrase-genitiva'; annotation = 'G'; break;
                    case 'infinitive': colorClass = 'match-phrase-infinitiva'; annotation = 'I'; break;
                    case 'conjunction': colorClass = 'match-phrase-conjuncion'; annotation = 'C'; break;
                    case 'participle': colorClass = 'match-phrase-participial'; annotation = 'Part'; break;
                    case 'appositional': colorClass = 'match-phrase-aposicional'; annotation = 'Ap'; break;
                    case 'relative': colorClass = 'match-phrase-relativa'; annotation = 'R'; break;
                    case 'substantival': colorClass = 'match-phrase-sustantival'; annotation = 'S'; break;
                    case 'adverbial': colorClass = 'match-phrase-adverbial'; annotation = 'Adv'; break;
                    case 'exclamatory': colorClass = 'match-phrase-exclamatory'; annotation = 'Exc'; break;
                    case 'vocative': colorClass = 'match-phrase-vocative'; annotation = 'Voc'; break;
                }
            } else if (match.category === 'logical-relations') {
                colorClass = 'match-relation-coordinada';
            } else if (match.category === 'prepositions') {
                colorClass = 'match-phrase-preposicional';
            } else if (match.category === 'morphology') {
                if (match.id.startsWith('sust_')) colorClass = 'match-phrase-sustantival';
                else if (match.id.startsWith('verbo_')) colorClass = 'match-phrase-infinitiva';
                else if (match.id.startsWith('det_')) colorClass = 'match-phrase-vocative';
                else if (match.id.startsWith('pron_')) colorClass = 'match-phrase-relativa';
                else if (match.id.startsWith('adj_')) colorClass = 'match-phrase-adjetival';
                else if (match.id.startsWith('adv_')) colorClass = 'match-phrase-adverbial';
                else if (match.id === 'preposicion_esp') colorClass = 'match-phrase-preposicional';
                else if (match.id === 'genitivo_esp') colorClass = 'match-phrase-genitiva';
                else if (match.id === 'secundario') colorClass = 'match-phrase-secundario';
            }

            const annTag = annotation ? `<div class="phrase-annotation ann-${match.id || 'default'}">${annotation}</div>` : '';
            
            return `
                <div class="grammar-match ${colorClass}">
                    ${annTag}
                    <div class="match-type">${match.icon || ''} ${match.title}</div>
                    <div class="match-details">${match.indicators || match.connectors || match.expression || ''}</div>
                    <div class="match-function">${match.description || match.function || ''}</div>
                </div>
            `;
        }).join('');
        resultDiv.classList.add('show');
    } else {
        resultDiv.classList.remove('show');
    }
}

function renderGrammarElements() {
    const grid = document.getElementById('grammarGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const sections = [
        { id: 'logical-relations', title: 'Relaciones Lógicas', data: [...coordinadas, ...subordinadas], class: 'logical-relations' },
        { id: 'phrase-types', title: 'Tipos de Frases', data: phraseTypes, class: 'phrase-types' },
        { id: 'expressions', title: 'Expresiones', data: grammaticalExpressions, class: 'expressions' },
        { id: 'prepositions', title: 'Preposiciones Griegas', data: greekPrepositions, class: 'prepositions' }
    ];

    sections.forEach(sec => {
        if (currentFilter === 'all' || currentFilter === sec.id) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'grammar-section';
            
            const header = document.createElement('div');
            header.className = `section-header ${sec.class}`;
            header.innerHTML = `<span>${sec.title}</span><span class="toggle-icon">▼</span>`;
            
            const content = document.createElement('div');
            content.className = 'section-content';
            
            let hasMatches = false;
            sec.data.forEach(item => {
                if (!searchTerm || (item.keywords && item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())))) {
                    hasMatches = true;
                    let extraHtml = '';
                    
                    if (item.example || item.biblicalExample || item.biblicalExamples) {
                        const exampleText = item.example || item.biblicalExample || item.biblicalExamples;
                        extraHtml += `
                            <div class="example-section">
                                <div class="example-title">📖 Ejemplo:</div>
                                <div class="biblical-example">${exampleText}</div>
                            </div>
                        `;
                    }

                    if (showGreek && (item.greekConnectors || item.greekText)) {
                        const greekText = item.greekConnectors || item.greekText;
                        extraHtml += `
                            <div class="greek-section">
                                <div class="greek-title">🏛️ Griego:</div>
                                <div class="greek-content">${greekText}</div>
                            </div>
                        `;
                    }

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'grammar-item';
                    itemDiv.innerHTML = `
                        <div class="item-title">${item.icon || ''} ${item.title}</div>
                        <div class="item-definition">${item.description || item.basicMeaning || item.morphology || ''}</div>
                        <div class="details-content">${item.indicators || item.connectors || item.expression || ''}</div>
                        ${extraHtml}
                    `;
                    content.appendChild(itemDiv);
                }
            });
            
            if (hasMatches) {
                sectionDiv.appendChild(header);
                sectionDiv.appendChild(content);
                grid.appendChild(sectionDiv);
                
                header.onclick = () => {
                    header.classList.toggle('collapsed');
                    content.classList.toggle('collapsed');
                };
            }
        }
    });

    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = grid.children.length === 0 ? 'block' : 'none';
    }
}

window.clearGrammarSearch = function() {
    const input = document.getElementById('searchInput');
    if(input) input.value = '';
    searchTerm = '';
    currentFilter = 'all';
    
    const resultDiv = document.getElementById('identificationResult');
    if(resultDiv) resultDiv.classList.remove('show');
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btnAll = document.querySelector('.filter-btn[data-filter="all"]');
    if(btnAll) btnAll.classList.add('active');

    renderGrammarElements();
}

// Inicialización cuando carga la página o cuando se hace click en la pestaña
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderIdentification(identifyGrammarElements(searchTerm));
            renderGrammarElements();
        });
    }

    const greekToggleBtn = document.getElementById('greekToggle');
    if(greekToggleBtn) {
        greekToggleBtn.addEventListener('click', () => {
            showGreek = !showGreek;
            greekToggleBtn.classList.toggle('active', showGreek);
            renderGrammarElements();
        });
    }

    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrammarElements();
        });
    });

    // Render inicial
    setTimeout(() => {
        if(document.getElementById('grammarGrid')) {
            renderGrammarElements();
        }
    }, 500); // Pequeño delay para asegurar que el DOM está listo
});
