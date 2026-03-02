const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export interface GenerateBriefRequest {
  closingRate: number;
  ticket: number;
  perfilDetectado: string;
}

export interface GeneratedBrief {
  perfil: string;
  descripcion: string;
  queLoMueve: string;
  errorAEvitar: string;
  estrategia: string;
  cierre: string;
  objecionProbable: string;
  respuesta: string;
}

export async function generateBrief(request: GenerateBriefRequest): Promise<GeneratedBrief> {
  if (!DASHSCOPE_API_KEY) {
    console.warn('DASHSCOPE_API_KEY not configured, returning mock brief');
    return getMockBrief(request);
  }
  
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
            content: `Eres el sistema de análisis del Closing Cuántico. Generas briefs pre-llamada profesionales en español.

Output debe ser JSON con esta estructura exacta:
{
  "perfil": "Nombre del perfil",
  "descripcion": "Descripción breve del perfil",
  "queLoMueve": "Qué motiva a este perfil",
  "errorAEvitar": "Error #1 a evitar",
  "estrategia": "Estrategia recomendada (2-3 líneas)",
  "cierre": "Cierre recomendado",
  "objecionProbable": "Objeción más probable",
  "respuesta": "Respuesta exacta"
}

Tono: profesional, directo, en español neutro latinoamericano. Máximo 150 palabras.`,
          },
          {
            role: 'user',
            content: `Datos del diagnóstico:
- Closing rate actual: ${request.closingRate}%
- Ticket promedio: $${request.ticket}
- Perfil asignado: ${request.perfilDetectado}

Genera un Brief Pre-Llamada de ejemplo.
Responde SOLO con el JSON, sin texto adicional.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      console.error('GLM-4 API error:', response.status, response.statusText);
      return getMockBrief(request);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error('GLM-4 API returned empty content');
      return getMockBrief(request);
    }
    
    // Try to parse JSON from content
    try {
      const brief = JSON.parse(content);
      return brief;
    } catch (parseError) {
      console.error('Error parsing GLM-4 response as JSON:', parseError);
      return getMockBrief(request);
    }
  } catch (error) {
    console.error('Exception calling GLM-4 API:', error);
    return getMockBrief(request);
  }
}

function getMockBrief(request: GenerateBriefRequest): GeneratedBrief {
  // Mock brief based on closing rate
  const profile = getProfileByClosingRate(request.closingRate);
  
  const mockBriefs: Record<string, GeneratedBrief> = {
    emocional: {
      perfil: 'EMOCIONAL IMPULSIVO',
      descripcion: 'Decide por emoción, responde a urgencia y FOMO, necesita sentirse especial.',
      queLoMueve: 'La emoción del momento, la exclusividad, la sensación de oportunidad única.',
      errorAEvitar: 'No enfríes la conversación con demasiada lógica o espera. Cierra mientras está encendido.',
      estrategia: 'Usa lenguaje emocional e inmediato. "Imagínate cómo te vas a sentir al lograr esto". Crea urgencia genuina.',
      cierre: 'Cierre inmediato o "Si Yo Te Garantizo"',
      objecionProbable: '"Tengo que pensarlo"',
      respuesta: '"Claro. ¿Hay algo específico que genere duda, o es más sobre el timing?"',
    },
    racional: {
      perfil: 'RACIONAL INSEGURO',
      descripcion: 'Hace muchas preguntas, tiene miedo de equivocarse, ha tomado malas decisiones en el pasado.',
      queLoMueve: 'La seguridad, la validación, la evidencia clara de que es la decisión correcta.',
      errorAEvitar: 'No uses emoción. Cada argumento emocional lo aleja más.',
      estrategia: 'Usa lógica y estructura. Valida cada pregunta con calma. "¿Qué tendría que pasar para que te sientas seguro?"',
      cierre: 'Benjamin Franklin (pros vs contras) o Del 1 al 10',
      objecionProbable: '"No tengo presupuesto"',
      respuesta: '"¿Te refieres a que no puedes invertir nada ahora, o que necesitas ver el ROI primero para justificarlo?"',
    },
    critico: {
      perfil: 'CRÍTICO EVASIVO',
      descripcion: 'Te desafía, critica el proceso, quiere sacarte del marco para negociar.',
      queLoMueve: 'Poder, control, probar que es más inteligente que tú.',
      errorAEvitar: 'No te justifiques. Pierdes el marco.',
      estrategia: 'Confronta con respeto y autoridad. "¿Estás buscando razones para no comprometerte?" No busques información, busca control.',
      cierre: 'Matrix (Píldora Roja vs Azul) o Del Ladrón',
      objecionProbable: '"Es muy caro"',
      respuesta: '"¿Qué rango de inversión habías considerado para alcanzar este objetivo?"',
    },
    decisor: {
      perfil: 'DECISOR DEPENDIENTE',
      descripcion: 'Necesita consultar con alguien, no se siente con poder de decisión.',
      queLoMueve: 'Validación externa, no ser responsable exclusivo de la decisión.',
      errorAEvitar: 'No lo dejes escapar sin compromiso.',
      estrategia: 'Reforza su independencia. "¿Tú quieres esto o estás esperando que alguien decida por ti?"',
      cierre: 'E + PRD + ALE + PC (Empatía, Pregunta de Reconfirmación, Argumentación, Pregunta de Cierre)',
      objecionProbable: '"Necesito consultarlo"',
      respuesta: '"¿Estás pidiendo permiso o apoyo? Si no fuese parte de la decisión, ¿tú estarías adentro?"',
    },
  };
  
  return mockBriefs[profile] || mockBriefs.racional;
}

function getProfileByClosingRate(closingRate: number): string {
  if (closingRate < 15) return 'emocional';
  if (closingRate < 25) return 'racional';
  if (closingRate < 35) return 'critico';
  return 'decisor';
}
