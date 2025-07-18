import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../App.css';

// Dados simulados de ofertas de disciplinas
const ofertas = [
  {
    id: '1',
    disciplina: 'Algoritmos',
    turma: 'A',
    diasSemana: ['Segunda', 'Quarta'],
    horario: '08:00-10:00',
    professor: 'Prof. Ana',
    periodo: 1,
  },
  {
    id: '2',
    disciplina: 'Estruturas de Dados',
    turma: 'B',
    diasSemana: ['Terça', 'Quinta'],
    horario: '10:00-12:00',
    professor: 'Prof. Bruno',
    periodo: 2,
  },
  {
    id: '3',
    disciplina: 'Banco de Dados',
    turma: 'A',
    diasSemana: ['Segunda', 'Quarta'],
    horario: '08:00-10:00',
    professor: 'Prof. Carla',
    periodo: 3,
  },
  {
    id: '4',
    disciplina: 'Matemática Discreta',
    turma: 'C',
    diasSemana: ['Sexta'],
    horario: '14:00-16:00',
    professor: 'Prof. Daniel',
    periodo: 1,
  },
  {
    id: '5',
    disciplina: 'Robótica',
    turma: 'A',
    diasSemana: ['Quarta'],
    horario: '16:00-18:00',
    professor: 'Prof. Elisa',
    periodo: 4,
  },
  {
    id: '6',
    disciplina: 'Programação Orientada a Objetos',
    turma: 'B',
    diasSemana: ['Segunda', 'Quarta'],
    horario: '14:00-16:00',
    professor: 'Prof. Fernando',
    periodo: 2,
  },
  {
    id: '7',
    disciplina: 'Redes de Computadores',
    turma: 'A',
    diasSemana: ['Terça', 'Quinta'],
    horario: '16:00-18:00',
    professor: 'Prof. Gabriela',
    periodo: 5,
  },
  {
    id: '8',
    disciplina: 'Inteligência Artificial',
    turma: 'C',
    diasSemana: ['Sexta'],
    horario: '10:00-12:00',
    professor: 'Prof. Henrique',
    periodo: 6,
  },
  {
    id: '9',
    disciplina: 'Desenvolvimento Web',
    turma: 'A',
    diasSemana: ['Segunda', 'Quarta'],
    horario: '10:00-12:00',
    professor: 'Prof. Isabela',
    periodo: 3,
  },
  {
    id: '10',
    disciplina: 'Sistemas Operacionais',
    turma: 'B',
    diasSemana: ['Terça', 'Quinta'],
    horario: '08:00-10:00',
    professor: 'Prof. João',
    periodo: 4,
  },
];

function horariosConflitam(oferta1: typeof ofertas[0], oferta2: typeof ofertas[0]) {
  // Conflito se algum dia e horário coincidem
  return oferta1.id !== oferta2.id &&
    oferta1.horario === oferta2.horario &&
    oferta1.diasSemana.some(dia => oferta2.diasSemana.includes(dia));
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 18,
  boxShadow: '0 4px 16px rgba(60,60,120,0.08)',
  padding: 20,
  margin: 12,
  minWidth: 260,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  position: 'relative',
};

const diasSemanaUnicos = Array.from(new Set(ofertas.flatMap(o => o.diasSemana)));

// Períodos de 1° ao 10°
const periodos = [
  { label: 'Todos os Períodos', value: '' },
  { label: '1° Período', value: '1' },
  { label: '2° Período', value: '2' },
  { label: '3° Período', value: '3' },
  { label: '4° Período', value: '4' },
  { label: '5° Período', value: '5' },
  { label: '6° Período', value: '6' },
  { label: '7° Período', value: '7' },
  { label: '8° Período', value: '8' },
  { label: '9° Período', value: '9' },
  { label: '10° Período', value: '10' },
];

const StudentPanel: React.FC = () => {
  const location = useLocation();
  const nome = (location.state as any)?.nome || 'Aluno';
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [filtroDia, setFiltroDia] = useState<string>('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('');
  const [formando, setFormando] = useState(false);

  // Verifica conflitos entre as selecionadas
  const conflitos: Record<string, boolean> = {};
  selecionadas.forEach((id1, idx) => {
    const oferta1 = ofertas.find(o => o.id === id1)!;
    for (let j = idx + 1; j < selecionadas.length; j++) {
      const id2 = selecionadas[j];
      const oferta2 = ofertas.find(o => o.id === id2)!;
      if (horariosConflitam(oferta1, oferta2)) {
        conflitos[id1] = true;
        conflitos[id2] = true;
      }
    }
  });

  // Filtro aplicado às ofertas
  const ofertasFiltradas = ofertas.filter(oferta => {
    const diaOk = !filtroDia || oferta.diasSemana.includes(filtroDia);
    const periodoOk = !filtroPeriodo || oferta.periodo.toString() === filtroPeriodo;
    return diaOk && periodoOk;
  });

  const handleSelect = (id: string) => {
    setSelecionadas(sel =>
      sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]
    );
    setEnviado(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    // Salva intenções no localStorage para o coordenador visualizar
    const intencoes = JSON.parse(localStorage.getItem('intencoesFormandos') || '[]');
    intencoes.push({ nome, selecionadas, formando });
    localStorage.setItem('intencoesFormandos', JSON.stringify(intencoes));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f4f6fa' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#232a36', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 32, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#e53935', fontSize: 28 }}>●</span> Sistema IFNMG
        </div>
        <div style={{ width: '100%', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <span style={{ fontSize: 40, color: '#232a36' }}>👤</span>
          </div>
          <div style={{ fontWeight: 600 }}>{nome}</div>
        </div>
        <nav style={{ width: '100%' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '12px 32px', background: '#1a202c', borderRadius: 8, margin: '0 16px 12px 16px', fontWeight: 500, cursor: 'pointer' }}>Início</li>
            <li style={{ padding: '12px 32px', borderRadius: 8, margin: '0 16px 12px 16px', fontWeight: 500, cursor: 'pointer', color: '#b0b8c1' }}>Assitência</li>
            <li style={{ padding: '12px 32px', borderRadius: 8, margin: '0 16px 12px 16px', fontWeight: 500, cursor: 'pointer', color: '#b0b8c1' }}>Requerimento</li>
          </ul>
        </nav>
        <div style={{ marginTop: 'auto', marginBottom: 16, fontSize: 12, color: '#b0b8c1', textAlign: 'center' }}>
          INSTITUTO FEDERAL<br />Norte de Minas Gerais
        </div>
      </aside>
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ background: '#1976d2', color: 'white', padding: '32px 0 24px 0', textAlign: 'center', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>
          <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Intenção de Matrícula</h1>
          <div style={{ fontSize: 18, opacity: 0.9 }}>Bem-vindo, {nome}!</div>
        </header>
        <main style={{ maxWidth: 1100, margin: 'auto', width: '100%' }}>
          {/* Filtros */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'center', justifyContent: 'flex-end' }}>
            <div>
              <label style={{ fontWeight: 600, marginRight: 8 }}>Dia da Semana:</label>
              <select value={filtroDia} onChange={e => setFiltroDia(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f4f6fa' }}>
                <option value="">Todos</option>
                {diasSemanaUnicos.map(dia => <option key={dia} value={dia}>{dia}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600, marginRight: 8 }}>Período:</label>
              <select value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f4f6fa' }}>
                {periodos.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
              {ofertasFiltradas.map(oferta => {
                const selecionada = selecionadas.includes(oferta.id);
                const emConflito = selecionada && conflitos[oferta.id];
                return (
                  <div key={oferta.id} style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,120,0.10)', padding: 24, minWidth: 260, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', position: 'relative', border: selecionada ? '2px solid #1976d2' : undefined }}>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#1976d2' }}>{oferta.disciplina} <span style={{ fontWeight: 400, fontSize: 14, color: '#7c3aed' }}>({oferta.turma})</span></div>
                    <div style={{ margin: '8px 0', color: '#374151' }}>
                      <b>Professor:</b> {oferta.professor}<br />
                      <b>Período:</b> {oferta.periodo}° Período<br />
                      <b>Dias:</b> {oferta.diasSemana.join(', ')}<br />
                      <b>Horário:</b> {oferta.horario}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <input
                        type="checkbox"
                        checked={selecionada}
                        onChange={() => handleSelect(oferta.id)}
                      />
                      Selecionar
                    </label>
                    {emConflito && (
                      <div style={{ color: '#eab308', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {FaExclamationTriangle({ size: 18 })} <span>Conflito de horário!</span>
                      </div>
                    )}
                    {selecionada && !emConflito && (
                      <div style={{ color: '#34d399', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {FaCheckCircle({ size: 18 })} <span>Selecionada</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {ofertasFiltradas.length === 0 && (
                <div style={{ color: '#7c3aed', fontWeight: 600, fontSize: 20, margin: '32px auto' }}>Nenhuma oferta encontrada para o filtro selecionado.</div>
              )}
            </div>
            <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="formando" checked={formando} onChange={e => setFormando(e.target.checked)} />
              <label htmlFor="formando" style={{ fontWeight: 600, color: '#1976d2', cursor: 'pointer' }}>Estou perto de formar</label>
            </div>
            <button type="submit" style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'block', margin: '0 auto', boxShadow: '0 2px 8px rgba(25,118,210,0.10)' }}>
              Enviar Intenções
            </button>
            {enviado && (
              <div style={{ marginTop: 24, textAlign: 'center', color: '#1976d2', fontWeight: 700, fontSize: 20 }}>
                Intenções salvas com sucesso!
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
};

export default StudentPanel; 