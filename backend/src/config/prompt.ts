import type { AreaType, ForeignLanguageType } from "../models/exam.model.js";

export const generalPrompt = (area: AreaType, disciplineExample: string) => `
Você é um especialista em elaboração de questões para o ENEM (Exame Nacional do Ensino Médio) brasileiro.

Gere exatamente 10 questões no estilo ENEM para a área de "${area}", seguindo as regras abaixo:

**Regras gerais:**
- Cada questão deve ter um enunciado claro e contextualizado (textos, situações do cotidiano em **texto**).
- Cada questão deve ter exatamente 5 alternativas (A, B, C, D, E), sendo apenas uma correta.
- Inclua uma explicação detalhada da resposta correta.
- Inclua o nome da disciplina específica (${disciplineExample}).
- Varie o nível de dificuldade: misture questões fáceis, médias e difíceis.
- Varie as disciplinas dentro da área (não concentre todas as questões em uma única matéria).

**Importante:**
- Você tem liberdade para se basear em questões de provas reais do ENEM.
- Todas as questões devem ser em português do Brasil.

**Modelo de resposta:**
{
  area: ${area}
  questions: [{
    statement: string,
    alternatives: [{ letter: "A"|"B"|"C"|"D"|"E", text: string }],
    correctAnswer: "A"|"B"|"C"|"D"|"E"
    explanation: string,
    // discipline: nome da matéria específica gerado pela IA
    // Ex: área "ciencias" → "Física", "Química", "Biologia"
    //     área "humanas" → "História", "Geografia", "Filosofia"
    discipline: string,
  }],
  status: "IN_PROGRESS" | "COMPLETED",
}
`.trim();

export const languagePrompt = (foreignLanguage: ForeignLanguageType) => `
            Você é um especialista em elaboração de questões para o ENEM (Exame Nacional do Ensino Médio) brasileiro.

            Gere exatamente 10 questões no estilo ENEM para a área de "Linguagen e suas tecnologias", seguindo as regras abaixo:

            **Regras gerais:**
            - Cada questão deve ter um enunciado claro e contextualizado (textos, situações do cotidiano, etc em **texto**).
            - Cada questão deve ter exatamente 5 alternativas (A, B, C, D, E), sendo apenas uma correta.
            - Inclua uma explicação detalhada da resposta correta.
            - Inclua o nome da disciplina específica (ex: "Literatura", "Gramática", "Interpretação de Texto", "Redação").
            - Varie o nível de dificuldade: fácil, médio e difícil.

            **Distribuição das 10 questões:**
            - 8 questões em português sobre Linguagens, Códigos e suas Tecnologias (Literatura, Gramática, Interpretação de Texto, Artes, Educação Física, Tecnologias da Informação).
            - 2 questões em ${foreignLanguage} (língua estrangeira): enunciado e alternativas inteiramente em ${foreignLanguage}, discipline = "${foreignLanguage === "ingles" ? "Língua Inglesa" : "Lengua Española"}".

            **Importante:**
            - Você tem liberdade para basear questões de provas reais do ENEM,
            - As questões de língua estrangeira devem ser totalmente escritas em ${foreignLanguage}, incluindo alternativas.
            **Modelo de resposta:**
{
  area: "linguagens"
  foreignLanguage?: "ingles" | "espanhol",   // obrigatório se area === "linguagens"
  questions: [{
    statement: string,
    alternatives: [{ letter: "A"|"B"|"C"|"D"|"E", text: string }],
    correctAnswer: "A"|"B"|"C"|"D"|"E"
    explanation: string,
    // discipline: nome da matéria específica gerado pela IA
    // Ex: área "ciencias" → "Física", "Química", "Biologia"
    //     área "humanas" → "História", "Geografia", "Filosofia"
    //     área "linguagens" → "Literatura", "Gramática", "Língua Inglesa"
    discipline: string,
  }],
  status: "IN_PROGRESS" | "COMPLETED",
}
`.trim();

export const triPrompt = (questionsDetails: string) => `
Você é um especialista em psicometria e no sistema de avaliação TRI (Teoria de Resposta ao Item) do ENEM.

Com base no desempenho do aluno nas questões abaixo, calcule uma nota TRI simulada para este simulado.

**Desempenho do aluno:**
${questionsDetails}

**Regras para o cálculo:**
- A nota TRI varia de 0 a 1000.
- Leve em consideração: quantidade de acertos, dificuldade estimada de cada questão (baseada na disciplina e no contexto), consistência do padrão de respostas.
- Questões não respondidas contam como erros.
- Uma nota típica de aprovação em cursos concorridos está entre 650 e 750.
- Calcule uma nota justa e realista para o perfil apresentado.

Retorne apenas a nota triScore (número inteiro) e um breve raciocínio explicando o cálculo.
`.trim();