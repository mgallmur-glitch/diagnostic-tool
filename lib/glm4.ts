import type { DiagnosticoInput, DiagnosticoOutput } from './calculations'

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || ''
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

export interface GenerateBriefRequest {
  input: DiagnosticoInput
  output: DiagnosticoOutput
}

export interface GeneratedBrief {
  perfil: string
  descripcion: string
  queLoMueve: string
  errorAEvitar: string
  estrategia: string
  cierre: string
  objecionProbable: string
  respuesta: string
}

export async function generateBrief(request: GenerateBriefRequest): Promise<GeneratedBrief> {
  if (!DASHSCOPE_API_KEY) {
    console.warn('DASHSCOPE_API_KEY not configured, returning mock brief')
    return getMockBrief(request)
  }
  
  const prompt = buildBriefPrompt(request.input, request.output)
  
  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4.5-air',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: 'Genera el Brief Pre-Llamada con los datos proporcionados. Responde SOLO con el texto plano con los 6 labels en MAYÚSCULAS seguidos de dos puntos, sin formato JSON.',
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })
    
    if (!response.ok) {
      console.error('GLM-4 API error:', response.status, response.statusText)
      return getMockBrief(request)
    }
    
    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      console.error('GLM-4 API returned empty content')
      return getMockBrief(request)
    }
    
    // Parse the generated brief from plain text format
    return parseBriefFromText(content)
  } catch (error) {
    console.error('Exception calling GLM-4 API:', error)
    return getMockBrief(request)
  }
}

export function buildBriefPrompt(
  input: DiagnosticoInput,
  output: DiagnosticoOutput
): string {

  const perfilDescripciones = {
    emocional: `EMOCIONAL IMPULSIVO — Altamente emocional, sube y baja rápido de energía.
    Se conecta profundamente pero al día siguiente se arrepiente.
    Error típico: el closer sigue hablando cuando ya estaba listo para cerrar.
    Necesita cerrar cuando está encendido, antes de que enfríe.`,

    racional: `RACIONAL INSEGURO — Hace muchas preguntas. Tiene miedo de equivocarse.
    Ha tomado malas decisiones antes y no quiere repetirlas.
    Error típico: pensar que tiene miedo de pagar — en realidad tiene miedo de decidir mal.
    Necesita lógica, estructura y que validen sus preguntas con calma.`,

    critico: `CRÍTICO EVASIVO — Desafía, critica el proceso o al equipo.
    Quiere sacarte del marco para negociar desde una posición de poder.
    Error típico: el closer se pone a la defensiva o se justifica.
    Necesita ser confrontado con respeto y autoridad, no convencido.`,

    decisor: `DECISOR DEPENDIENTE — Necesita consultarlo con alguien.
    No se siente con poder de decidir solo aunque tenga el dinero.
    Error típico: dejarlo ir sin un compromiso concreto.
    Necesita que refuercen su independencia y lo ayuden a preparar la conversación con el tercero.`
  }

  const problemasDescripciones = {
    calificacion: `El problema principal es calificación: más de la mitad de los leads
    que llegan al closer no deberían estar ahí. Gastan tiempo en prospectos
    que nunca van a comprar, lo que destruye la energía y el foco del closer.`,

    mismatch: `El problema principal es perfil mismatch: el closer usa la misma estrategia
    con todos los prospectos. Le habla con emoción al Racional Inseguro y con lógica
    al Emocional Impulsivo. La estrategia incorrecta mata deals que ya estaban ganados.`,

    brief: `El problema principal es la ausencia de brief pre-llamada: el closer entra
    a cada llamada sin contexto del prospecto, improvisando los primeros 8-10 minutos.
    Eso no es un problema de habilidad — es un problema de información.`
  }

  return `Eres el sistema de análisis del Closing Cuántico, la metodología propietaria
de The Closing Code AI para equipos de ventas high-ticket en LatAm.

Genera un Brief Pre-Llamada de EJEMPLO en español para mostrarle a un infoproductor
cómo funcionaría el sistema con su equipo. El brief es lo que recibiría su closer
15 minutos antes de una llamada real.

DATOS DEL DIAGNÓSTICO DEL INFOPRODUCTOR:
- Leads/mes: ${input.leads}
- Ticket promedio: $${input.ticket.toLocaleString()}
- Closing rate actual: ${Math.round(input.closingRate * 100)}%
- Closing rate potencial: ${Math.round(output.tasaPotencial * 100)}%
- Revenue perdido/mes: $${output.revenuePerdido.toLocaleString()}
- Revenue recuperable: $${output.revenueRecuperable.toLocaleString()}
- Closers en el equipo: ${input.closers}
- Problema principal detectado: ${output.problemaPrincipal}
- Perfil del Closing Cuántico asignado al prospecto: ${output.perfilCQ.toUpperCase()}

DESCRIPCIÓN DEL PERFIL:
${perfilDescripciones[output.perfilCQ]}

DESCRIPCIÓN DEL PROBLEMA PRINCIPAL:
${problemasDescripciones[output.problemaPrincipal]}

INSTRUCCIONES PARA EL BRIEF:
Genera un brief que incluya EXACTAMENTE estos 6 campos:
1. PERFIL DETECTADO — nombre del perfil + 1 frase de descripción
2. QUÉ LO MUEVE — el dolor y la motivación específica (menciona el ticket y el contexto)
3. ERROR A EVITAR — el error #1 que comete un closer sin sistema con este perfil
4. ESTRATEGIA RECOMENDADA — 2-3 líneas de acción concreta
5. CIERRE RECOMENDADO — el sistema de cierre del Closing Cuántico más efectivo para este perfil
6. OBJECIÓN MÁS PROBABLE + RESPUESTA EXACTA — la respuesta real, no genérica

REGLAS:
- Máximo 180 palabras en total
- Español neutro latinoamericano (no "vos", no "tío", no España)
- Tono: profesional, directo, de igual a igual
- NO mencionar "the closing code ai" ni hacer publicidad — es el brief del closer
- Los datos del infoproductor (ticket, leads, revenue) deben aparecer en el brief
  para que se vea personalizado
- El campo CIERRE RECOMENDADO debe nombrar un cierre real del Closing Cuántico:
  "Si Yo Te Garantizo", "Del 1 al 10", "Del Ladrón", "E+PRD+ALE+PC", "Matrix", o "Benjamin Franklin"

Formato de salida: texto plano con los 6 labels en MAYÚSCULAS seguidos de dos puntos.`
}

function parseBriefFromText(text: string): GeneratedBrief {
  // Parse the plain text format into a structured brief
  const lines = text.split('\n').filter(line => line.trim())
  
  const brief: Partial<GeneratedBrief> = {}
  
  let currentField: keyof GeneratedBrief | null = null
  
  for (const line of lines) {
    const upperLine = line.toUpperCase().trim()
    
    // Check for field labels
    if (upperLine.startsWith('PERFIL DETECTADO:')) {
      currentField = 'perfil'
      brief.perfil = line.replace(/^[^:]+:/, '').trim()
    } else if (upperLine.startsWith('QUÉ LO MUEVE:') || upperLine.startsWith('QUE LO MUEVE:')) {
      currentField = 'queLoMueve'
      brief.queLoMueve = line.replace(/^[^:]+:/, '').trim()
    } else if (upperLine.startsWith('ERROR A EVITAR:')) {
      currentField = 'errorAEvitar'
      brief.errorAEvitar = line.replace(/^[^:]+:/, '').trim()
    } else if (upperLine.startsWith('ESTRATEGIA RECOMENDADA:')) {
      currentField = 'estrategia'
      brief.estrategia = line.replace(/^[^:]+:/, '').trim()
    } else if (upperLine.startsWith('CIERRE RECOMENDADO:')) {
      currentField = 'cierre'
      brief.cierre = line.replace(/^[^:]+:/, '').trim()
    } else if (upperLine.startsWith('OBJECIÓN MÁS PROBABLE:') || upperLine.startsWith('OBJECION MAS PROBABLE:')) {
      currentField = 'objecionProbable'
      const content = line.replace(/^[^:]+:/, '').trim()
      // Check if the response is on the same line
      if (content.includes('+') || content.includes('→')) {
        const parts = content.split(/[+→]/)
        brief.objecionProbable = parts[0].trim()
        brief.respuesta = parts[1]?.trim() || ''
      } else {
        brief.objecionProbable = content
      }
    } else if (upperLine.startsWith('RESPUESTA:') || upperLine.includes('→')) {
      currentField = 'respuesta'
      const content = line.replace(/^[^:→]+[→:]?/, '').trim()
      brief.respuesta = content
    } else if (currentField) {
      // Continuation of previous field
      brief[currentField] = (brief[currentField] || '') + ' ' + line.trim()
    }
  }
  
  return brief as GeneratedBrief
}

export function getMockBrief(request: GenerateBriefRequest): GeneratedBrief {
  const { output } = request
  const perfil = output.perfilCQ
  
  const mockBriefs: Record<string, GeneratedBrief> = {
    emocional: {
      descripcion: 'EMOCIONAL IMPULSIVO - Deciden por emoción y urgencia',
      perfil: 'EMOCIONAL IMPULSIVO - Deciden por emoción y urgencia',
      queLoMueve: `La emoción del momento, la exclusividad, la sensación de oportunidad única. Con un ticket de $${request.input.ticket.toLocaleString()}, responden bien a FOMO genuino.`,
      errorAEvitar: 'No enfríes la conversación con demasiada lógica o espera. Cierra mientras está encendido, antes de que se arrepienta.',
      estrategia: 'Usa lenguaje emocional e inmediato. "Imagínate cómo te vas a sentir al lograr esto". Crea urgencia genuina con stock o tiempo limitado.',
      cierre: 'Cierre Inmediato o "Si Yo Te Garantizo"',
      objecionProbable: '"Tengo que pensarlo"',
      respuesta: '"Claro. ¿Hay algo específico que genere duda, o es más sobre el timing?"',
    },
    racional: {
      descripcion: 'RACIONAL INSEGURO - Hace preguntas, teme equivocarse',
      perfil: 'RACIONAL INSEGURO - Hace preguntas, teme equivocarse',
      queLoMueve: `La seguridad, la validación, la evidencia clara de que es la decisión correcta. Ya ha invertido $${request.output.revenueActual.toLocaleString()} pero sabe que puede hacer más.`,
      errorAEvitar: 'No uses emoción. Cada argumento emocional lo aleja más. Necesita lógica.',
      estrategia: 'Usa lógica y estructura. Valida cada pregunta con calma. "¿Qué tendría que pasar para que te sientas seguro de avanzar?" Deja que él defina sus criterios de decisión.',
      cierre: 'Benjamin Franklin (pros vs contras en vivo) o Del 1 al 10',
      objecionProbable: '"No tengo presupuesto"',
      respuesta: '"¿Te refieres a que no puedes invertir nada ahora, o que necesitas ver el ROI primero para justificarlo?"',
    },
    critico: {
      descripcion: 'CRÍTICO EVASIVO - Desafía, critica, quiere control',
      perfil: 'CRÍTICO EVASIVO - Desafía, critica, quiere control',
      queLoMueve: `Poder, control, probar que es más inteligente que tú. Sabe que pierde $${request.output.revenuePerdido.toLocaleString()}/mes pero no lo admite.`,
      errorAEvitar: 'No te justifiques. Pierdes el marco. No busques información, busca control.',
      estrategia: 'Confronta con respeto y autoridad. "¿Estás buscando razones para no comprometerte?" No entres a su terreno de negociación.',
      cierre: 'Matrix (Píldora Roja vs Azul) o Del Ladrón',
      objecionProbable: '"Es muy caro"',
      respuesta: '"¿Qué rango de inversión habías considerado para alcanzar este objetivo?"',
    },
    decisor: {
      descripcion: 'DECISOR DEPENDIENTE - Necesita consultar, no decide solo',
      perfil: 'DECISOR DEPENDIENTE - Necesita consultar, no decide solo',
      queLoMueve: `Validación externa, no ser responsable exclusivo de la decisión. Con ${request.input.leads} leads/mes, necesita que validen su proceso.`,
      errorAEvitar: 'No lo dejes escapar sin compromiso. Si se va a consultar, nunca regresa.',
      estrategia: 'Reforza su independencia. "¿Tú quieres esto o estás esperando que alguien decida por ti?" Ayúdalo a preparar la conversación con el tercero.',
      cierre: 'E + PRD + ALE + PC (Empatía, Pregunta de Reconfirmación, Argumentación, Pregunta de Cierre)',
      objecionProbable: '"Necesito consultarlo"',
      respuesta: '"¿Estás pidiendo permiso o apoyo? Si no fuese parte de la decisión, ¿tú estarías adentro?"',
    },
  }
  
  return mockBriefs[perfil] || mockBriefs.racional
}
