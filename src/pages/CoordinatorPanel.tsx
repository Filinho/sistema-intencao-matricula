import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChartBar, FaExclamationTriangle, FaUsers, FaListUl, FaFileDownload, FaPlus, FaUserGraduate } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CadastroDisciplina from '../components/Coordinator/CadastroDisciplina';
import ListaDisciplinas from '../components/Coordinator/ListaDisciplinas';

// Simulação de dados para as novas métricas
const disciplinas = [
  { id: '1', nome: 'Algoritmos', interessados: 42, vagas: 40, optativa: false, formandos: 3, periodo: 1, obrigatoria: true, professor: 'Prof. Ana', diasSemana: ['Segunda', 'Quarta'], horario: '08:00-10:00' },
  { id: '2', nome: 'Estruturas de Dados', interessados: 37, vagas: 35, optativa: false, formandos: 2, periodo: 2, obrigatoria: true, professor: 'Prof. Bruno', diasSemana: ['Terça', 'Quinta'], horario: '10:00-12:00' },
  { id: '3', nome: 'Banco de Dados', interessados: 29, vagas: 30, optativa: false, formandos: 1, periodo: 3, obrigatoria: true, professor: 'Prof. Carla', diasSemana: ['Segunda', 'Quarta'], horario: '14:00-16:00' },
  { id: '4', nome: 'Física Experimental', interessados: 3, vagas: 20, optativa: true, formandos: 0, periodo: 2, obrigatoria: false, professor: 'Prof. Daniel', diasSemana: ['Sexta'], horario: '14:00-16:00' },
  { id: '5', nome: 'Matemática Discreta', interessados: 5, vagas: 25, optativa: false, formandos: 0, periodo: 1, obrigatoria: true, professor: 'Prof. Elisa', diasSemana: ['Quinta'], horario: '16:00-18:00' },
  { id: '6', nome: 'Tópicos Especiais em TI', interessados: 2, vagas: 15, optativa: true, formandos: 0, periodo: 4, obrigatoria: false, professor: 'Prof. Fernando', diasSemana: ['Sábado'], horario: '08:00-12:00' },
  { id: '7', nome: 'Robótica', interessados: 1, vagas: 10, optativa: true, formandos: 0, periodo: 5, obrigatoria: false, professor: 'Prof. Gabriela', diasSemana: ['Quarta'], horario: '16:00-18:00' },
];
const LIMIAR_OPTATIVA = 5;
const conflitos = [
  { disciplinas: ['Algoritmos', 'Banco de Dados'], alunosAfetados: 12 },
  { disciplinas: ['Estruturas de Dados', 'Matemática Discreta'], alunosAfetados: 7 },
];

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f8cff 60%, #7c3aed 100%)',
  color: 'white',
  borderRadius: 18,
  boxShadow: '0 4px 16px rgba(60,60,120,0.08)',
  padding: 24,
  flex: 1,
  margin: 12,
  minWidth: 220,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  transition: 'transform 0.15s',
};

const COLORS = ['#4f8cff', '#7c3aed', '#eab308', '#34d399', '#f472b6'];

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

const CoordinatorPanel: React.FC = () => {
  const location = useLocation();
  const nome = (location.state as any)?.nome || 'Coordenador';
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState('');
  const [showCadastro, setShowCadastro] = useState(false);
  const [disciplinasList, setDisciplinasList] = useState(disciplinas);
  const [showOptativas, setShowOptativas] = useState(false);
  const [showConflitosModal, setShowConflitosModal] = useState(false);
  const [showMaiorIntencaoModal, setShowMaiorIntencaoModal] = useState(false);
  const [showFormandosModal, setShowFormandosModal] = useState(false);

  // Popular localStorage com dados de formandos se não houver
  useEffect(() => {
    const existentes = localStorage.getItem('intencoesFormandos');
    if (!existentes || existentes === '[]') {
      const intencoesFormandos = [
        {
          nome: "Maria Formanda",
          selecionadas: ["1", "2"],
          formando: true
        },
        {
          nome: "João QuaseLá",
          selecionadas: ["3", "5"],
          formando: true
        },
        {
          nome: "Ana ÚltimoPeríodo",
          selecionadas: ["2", "4", "6"],
          formando: true
        }
      ];
      localStorage.setItem('intencoesFormandos', JSON.stringify(intencoesFormandos));
    }
  }, []);

  // Funções auxiliares para rankings e listas
  const maiorIntencao = disciplinasList.slice().sort((a, b) => b.interessados - a.interessados).slice(0, 3);
  const menorIntencao = disciplinasList.slice().sort((a, b) => a.interessados - b.interessados).slice(0, 3);
  const optativasBaixaAdesao = disciplinasList.filter(d => d.optativa && d.interessados < LIMIAR_OPTATIVA);

  // Buscar intenções de formandos do localStorage
  const intencoesFormandos = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('intencoesFormandos') || '[]') : [];
  const formandos = intencoesFormandos.filter((i: any) => i.formando);

  // Mapeia disciplinas de interesse dos formandos
  const disciplinasFormandos: Record<string, { alunos: string[] }> = {};
  formandos.forEach((f: any) => {
    f.selecionadas.forEach((discId: string) => {
      if (!disciplinasFormandos[discId]) disciplinasFormandos[discId] = { alunos: [] };
      disciplinasFormandos[discId].alunos.push(f.nome);
    });
  });

  const handleSaveDisciplina = (novaDisciplina: any) => {
    const disciplinaCompleta = {
      ...novaDisciplina,
      id: Date.now().toString(),
      interessados: 0,
      formandos: 0
    };
    setDisciplinasList(prev => [...prev, disciplinaCompleta]);
  };

  const handleDeleteDisciplina = (id: string) => {
    setDisciplinasList(prev => prev.filter(d => d.id !== id));
  };

  const handleEditDisciplina = (disciplina: any) => {
    // Implementar edição futuramente
    console.log('Editar disciplina:', disciplina);
  };

  const handleViewDisciplina = (disciplina: any) => {
    // Implementar visualização futuramente
    console.log('Ver disciplina:', disciplina);
  };

  // Exportar relatório para XLSX
  const exportarRelatorio = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(maiorIntencao.map(d => ({ disciplina: d.nome, interessados: d.interessados })));
    XLSX.utils.book_append_sheet(wb, ws1, 'Maior Intencao');
    const ws2 = XLSX.utils.json_to_sheet(menorIntencao.map(d => ({ disciplina: d.nome, interessados: d.interessados })));
    XLSX.utils.book_append_sheet(wb, ws2, 'Menor Intencao');
    const ws3 = XLSX.utils.json_to_sheet(conflitos.map(c => ({ disciplinas: c.disciplinas.join(' & '), alunosAfetados: c.alunosAfetados })));
    XLSX.utils.book_append_sheet(wb, ws3, 'Conflitos');
    const ws4 = XLSX.utils.json_to_sheet(optativasBaixaAdesao.map(d => ({ disciplina: d.nome, interessados: d.interessados, limiar: LIMIAR_OPTATIVA })));
    XLSX.utils.book_append_sheet(wb, ws4, 'Optativas Baixa Adesao');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `relatorio-intencao.xlsx`);
  };

  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh', paddingBottom: 40 }}>
      <header style={{ background: 'linear-gradient(90deg, #4f8cff 60%, #7c3aed 100%)', color: 'white', padding: '32px 0 24px 0', textAlign: 'center', borderRadius: '0 0 32px 32px', marginBottom: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Painel do Coordenador</h1>
        <div style={{ fontSize: 18, opacity: 0.9 }}>Bem-vindo, {nome}!</div>
      </header>
      <main style={{ maxWidth: 1100, margin: 'auto' }}>
        {/* Botão de cadastro destacado no topo */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button 
            onClick={() => setShowCadastro(true)} 
            style={{ 
              background: 'linear-gradient(90deg, #4f8cff 60%, #7c3aed 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '12px 28px', 
              fontWeight: 700, 
              fontSize: 18, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              cursor: 'pointer', 
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)' 
            }}
          >
            {FaPlus({ size: 22, style: { marginBottom: 0 } })} Cadastrar Disciplina
          </button>
        </div>
        {/* NOVA SEÇÃO: Disciplinas de interesse dos formandos */}
        {/* Gráficos principais */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(60,60,120,0.08)', padding: 24, flex: 2, minWidth: 320 }}>
            <h3 style={{ margin: 0, fontWeight: 600, marginBottom: 16 }}>Intenção por Disciplina</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={disciplinasList}>
                <XAxis dataKey="nome" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="interessados" fill="#4f8cff" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(60,60,120,0.08)', padding: 24, flex: 1, minWidth: 260 }}>
            <h3 style={{ margin: 0, fontWeight: 600, marginBottom: 16 }}>Optativas Baixa Adesão</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={optativasBaixaAdesao} dataKey="interessados" nameKey="nome" cx="50%" cy="50%" outerRadius={70} label>
                  {optativasBaixaAdesao.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Cards principais (ajustados para usar os novos dados) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setShowMaiorIntencaoModal(true)}>
            {FaChartBar({ size: 32, style: { marginBottom: 12 } })}
            <h3 style={{ margin: 0, fontWeight: 600 }}>Disciplinas com Maior Intenção</h3>
            <div style={{ fontSize: 22, fontWeight: 700, margin: '8px 0' }}>{maiorIntencao[0].nome}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>+{maiorIntencao[0].interessados} interessados</div>
          </div>
          {/* NOVO CARD: Disciplinas de Interesse dos Formandos */}
          <div style={{ ...cardStyle, cursor: 'pointer', background: 'linear-gradient(135deg, #1976d2 60%, #7c3aed 100%)' }} onClick={() => setShowFormandosModal(true)}>
            {FaUserGraduate({ size: 32, style: { marginBottom: 12 } })}
            <h3 style={{ margin: 0, fontWeight: 600 }}>Interesse dos Alunos Perto de Formar</h3>
            <div style={{ fontSize: 22, fontWeight: 700, margin: '8px 0' }}>{Object.keys(disciplinasFormandos).length > 0 ? Object.keys(disciplinasFormandos).length + ' disciplinas' : 'Nenhuma disciplina'}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{formandos.length} aluno(s) perto de formar</div>
          </div>
          <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setShowConflitosModal(true)}>
            {FaExclamationTriangle({ size: 32, style: { marginBottom: 12 } })}
            <h3 style={{ margin: 0, fontWeight: 600 }}>Conflitos de Horário</h3>
            <div style={{ fontSize: 22, fontWeight: 700, margin: '8px 0' }}>{conflitos[0].disciplinas.join(' & ')}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{conflitos[0].alunosAfetados} alunos afetados</div>
          </div>
        </div>

        {/* Lista de Disciplinas */}
        <div style={{ marginTop: 32 }}>
          <ListaDisciplinas
            disciplinas={disciplinasList}
            onEdit={handleEditDisciplina}
            onDelete={handleDeleteDisciplina}
            onView={handleViewDisciplina}
          />
        </div>

        {/* Detalhes ao clicar nos cards (ajustados) */}
        {detalhe && (
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(60,60,120,0.08)', margin: '40px auto 0 auto', maxWidth: 700, padding: 32, position: 'relative' }}>
            <button onClick={() => setDetalhe(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#7c3aed' }}>×</button>
            {detalhe === 'maiorIntencao' && (
              <div>
                <h2>Ranking: Disciplinas com Maior Intenção</h2>
                <ol>
                  {maiorIntencao.map((item: typeof maiorIntencao[0], idx: number) => (
                    <li key={idx} style={{ margin: '8px 0', fontSize: 18 }}>{item.nome} <span style={{ color: '#4f8cff', fontWeight: 600 }}>({item.interessados} interessados)</span></li>
                  ))}
                </ol>
              </div>
            )}
            {detalhe === 'menorIntencao' && (
              <div>
                <h2>Disciplinas com Menor Intenção</h2>
                <ul>
                  {menorIntencao.map((item: typeof menorIntencao[0], idx: number) => (
                    <li key={idx} style={{ margin: '8px 0', fontSize: 18 }}>{item.nome} <span style={{ color: '#7c3aed', fontWeight: 600 }}>({item.interessados} interessados)</span></li>
                  ))}
                </ul>
              </div>
            )}
            {detalhe === 'conflitos' && (
              <div>
                <h2>Conflitos de Horário Relevantes</h2>
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                  {conflitos.map((item, idx) => (
                    <li key={idx} style={{ margin: '12px 0', fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: '#4f8cff' }}>{item.disciplinas.join(' & ')}</span>
                      <span style={{ color: '#eab308', fontWeight: 600, marginLeft: 8 }}>
                        ({item.alunosAfetados} aluno{item.alunosAfetados !== 1 ? 's' : ''} afetado{item.alunosAfetados !== 1 ? 's' : ''})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detalhe === 'optativasBaixaAdesao' && (
              <div>
                <h2>Optativas com Baixa Adesão</h2>
                <ul>
                  {optativasBaixaAdesao.map((item: typeof optativasBaixaAdesao[0], idx: number) => (
                    <li key={idx} style={{ margin: '8px 0', fontSize: 18 }}>{item.nome} <span style={{ color: '#7c3aed', fontWeight: 600 }}>({item.interessados} interessados)</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Modal de Cadastro de Disciplina */}
      {showCadastro && (
        <CadastroDisciplina
          onClose={() => setShowCadastro(false)}
          onSave={handleSaveDisciplina}
        />
      )}
      {/* Modal de Optativas */}
      {showOptativas && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowOptativas(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#7c3aed'
              }}
            >
              ×
            </button>
            <h2 style={{ margin: '0 0 24px 0', color: '#f59e42', fontWeight: 700 }}>Optativas Cadastradas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f59e42' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontWeight: 600, color: '#374151' }}>Disciplina</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: '#374151' }}>Interessados</th>
                </tr>
              </thead>
              <tbody>
                {disciplinasList.filter(d => d.optativa).length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: '#6b7280', padding: 24 }}>
                      Nenhuma optativa cadastrada.
                    </td>
                  </tr>
                )}
                {disciplinasList.filter(d => d.optativa).map(opt => (
                  <tr key={opt.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 500 }}>{opt.nome}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: '#059669' }}>{opt.interessados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal de Conflitos de Horário */}
      {showConflitosModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowConflitosModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#eab308'
              }}
            >
              ×
            </button>
            <h2 style={{ margin: '0 0 24px 0', color: '#eab308', fontWeight: 700 }}>Conflitos de Horário</h2>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {conflitos.map((item, idx) => (
                <li key={idx} style={{ margin: '12px 0', fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: '#4f8cff' }}>{item.disciplinas.join(' & ')}</span>
                  <span style={{ color: '#eab308', fontWeight: 600, marginLeft: 8 }}>
                    ({item.alunosAfetados} aluno{item.alunosAfetados !== 1 ? 's' : ''} afetado{item.alunosAfetados !== 1 ? 's' : ''})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Modal de Disciplinas com Maior Intenção */}
      {showMaiorIntencaoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowMaiorIntencaoModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#4f8cff'
              }}
            >
              ×
            </button>
            <h2 style={{ margin: '0 0 24px 0', color: '#4f8cff', fontWeight: 700 }}>Disciplinas e Interessados</h2>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {disciplinasList
                .slice()
                .sort((a, b) => b.interessados - a.interessados)
                .map((item, idx) => (
                  <li key={item.id} style={{ margin: '12px 0', fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>{idx + 1}. {item.nome}</span>
                    <span style={{ color: '#4f8cff', fontWeight: 600, marginLeft: 8 }}>
                      ({item.interessados} interessado{item.interessados !== 1 ? 's' : ''})
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {/* MODAL: Disciplinas de Interesse dos Formandos */}
      {showFormandosModal && (
        <>
          <div onClick={() => setShowFormandosModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44, 62, 80, 0.45)', zIndex: 1000 }} />
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(60,60,120,0.08)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: 700, width: '90vw', padding: 32, zIndex: 1001 }}>
            <button onClick={() => setShowFormandosModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#7c3aed' }}>×</button>
            <h2 style={{ color: '#1976d2', fontWeight: 700 }}>Disciplinas de Interesse dos Alunos Perto de Formar</h2>
            {Object.keys(disciplinasFormandos).length === 0 && <div style={{ color: '#7c3aed', fontWeight: 600 }}>Nenhuma intenção registrada.</div>}
            <ul style={{ padding: 0, listStyle: 'none' }}>
              {Object.entries(disciplinasFormandos).map(([discId, info]) => {
                const disc = disciplinas.find(d => d.id === discId);
                return (
                  <li key={discId} style={{ marginBottom: 16, background: '#f4f6fa', borderRadius: 8, padding: 12, boxShadow: '0 1px 4px rgba(60,60,120,0.06)' }}>
                    <span style={{ fontWeight: 700, color: '#1976d2' }}>{disc ? disc.nome : discId}</span>
                    <span style={{ marginLeft: 12, color: '#374151', fontWeight: 500 }}>Alunos: {info.alunos.join(', ')}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CoordinatorPanel; 