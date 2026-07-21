import type { Phase } from '../types/game';

export const PHASES: Phase[] = [
  // Fases 1-5: Fácil (Fundamentos)
  { id: 1, name: 'Forma Palavras', description: 'Monte as palavras corretas', icon: '🔤', color: '#00e5ff', difficulty: 'Fácil' },
  { id: 2, name: 'Memória de Sinônimos', description: 'Encontre os pares com o mesmo significado', icon: '🧠', color: '#e040fb', difficulty: 'Fácil' },
  { id: 3, name: 'Desembaralhe', description: 'Organize as letras para formar objetos do dia a dia', icon: '🔀', color: '#ff9100', difficulty: 'Fácil' },
  { id: 4, name: 'Qual é a Letra?', description: 'Complete as lacunas com a letra certa', icon: '📝', color: '#00e676', difficulty: 'Fácil' },
  { id: 5, name: 'Complete a Frase', description: 'Escolha a palavra que faz sentido', icon: '✏️', color: '#ffd600', difficulty: 'Fácil' },
  
  // Fases 6-10: Médio (Gramática e Lógica)
  { id: 6, name: 'Ordem da História', description: 'Arraste as frases para a ordem certa', icon: '📖', color: '#40c4ff', difficulty: 'Médio' },
  { id: 7, name: 'Chuva de Palavras', description: 'Digite rápido antes que elas caiam', icon: '🌧️', color: '#ff4081', difficulty: 'Médio' },
  { id: 8, name: 'Conexão Oposta', description: 'Ligue os antônimos (palavras contrárias)', icon: '🔗', color: '#7c4dff', difficulty: 'Médio' },
  { id: 9, name: 'Leitura Curta', description: 'Leia a fábula e responda', icon: '📚', color: '#00bfa5', difficulty: 'Médio' },
  { id: 10, name: 'O Intruso', description: 'Qual palavra não pertence ao grupo?', icon: '👁️', color: '#ff6d00', difficulty: 'Médio' },

  // Fases 11-15: Difícil (Desafios Reais)
  { id: 11, name: 'Detetive da Leitura', description: 'Encontre a afirmação falsa no texto', icon: '🕵️', color: '#00e5ff', difficulty: 'Difícil' },
  { id: 12, name: 'Ordem Complexa', description: 'Organize uma história mais longa e detalhada', icon: '🧩', color: '#e040fb', difficulty: 'Difícil' },
  { id: 13, name: 'Decifrando Códigos', description: 'Siga dicas lógicas para achar a senha', icon: '🔐', color: '#ff9100', difficulty: 'Difícil' },
  { id: 14, name: 'Quiz do Mundo Real', description: 'Teste de conhecimentos gerais (Ciências/História)', icon: '🌍', color: '#00e676', difficulty: 'Difícil' },
  { id: 15, name: 'Poesia e Sentimentos', description: 'Interpretação de metáforas', icon: '🎭', color: '#ffd600', difficulty: 'Difícil' },

  // Fases 16-20: Mestre (Preparação para o Mundo)
  { id: 16, name: 'Manual de Sobrevivência', description: 'Leia instruções para resolver o problema', icon: '📋', color: '#40c4ff', difficulty: 'Mestre' },
  { id: 17, name: 'Enigmas Textuais', description: 'Charadas que exigem pensar fora da caixa', icon: '💡', color: '#ff4081', difficulty: 'Mestre' },
  { id: 18, name: 'Caça ao Tesouro', description: 'Siga a lógica para achar o prêmio', icon: '🗺️', color: '#ffd600', difficulty: 'Mestre' },
  { id: 19, name: 'A Grande Defesa', description: 'Escolha o melhor argumento', icon: '⚖️', color: '#ffd600', difficulty: 'Mestre' },
  { id: 20, name: 'Desafio Final', description: 'Corrida contra o relógio!', icon: '🏆', color: '#ffd600', difficulty: 'Mestre' },
  { id: 21, name: 'O Grande Quebra-Cabeça', description: '500 Peças! Imagens por IA', icon: '🧩', color: '#ff00ff', difficulty: 'Mestre' },
];
