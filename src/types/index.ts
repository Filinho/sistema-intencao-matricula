// Tipos base do sistema de intenção de matrícula

export type UserRole = 'aluno' | 'coordenador';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export interface Disciplina {
  id: string;
  nome: string;
  obrigatoria: boolean;
  optativa: boolean;
  periodo: number; // Período de 1 a 10
}

export interface OfertaDisciplina {
  id: string;
  disciplinaId: string;
  turma: string;
  diasSemana: string[]; // Ex: ['Segunda', 'Quarta']
  horario: string; // Ex: '08:00-10:00'
  professor?: string;
}

export interface IntencaoMatricula {
  alunoId: string;
  ofertasSelecionadas: string[]; // IDs das ofertas
}

export interface Notificacao {
  id: string;
  mensagem: string;
  prioridade: 'normal' | 'alta';
  disciplinaId?: string;
  alunosFormandos?: string[];
}

export interface RelatorioIntencao {
  disciplinaId: string;
  interessados: string[]; // IDs dos alunos
  conflitos?: string[]; // IDs de disciplinas em conflito
  baixaAdesao?: boolean;
  altaConcorrencia?: boolean;
} 