import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

interface Disciplina {
  id: string;
  nome: string;
  periodo: number;
  obrigatoria: boolean;
  optativa: boolean;
  vagas: number;
  professor: string;
  diasSemana: string[];
  horario: string;
  interessados: number;
  formandos: number;
}

interface ListaDisciplinasProps {
  disciplinas: Disciplina[];
  onEdit: (disciplina: Disciplina) => void;
  onDelete: (id: string) => void;
  onView: (disciplina: Disciplina) => void;
}

const ListaDisciplinas: React.FC<ListaDisciplinasProps> = ({ 
  disciplinas, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      onDelete(id);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(60,60,120,0.08)', padding: 24 }}>
      <h3 style={{ margin: '0 0 20px 0', fontWeight: 600, color: '#1f2937' }}>
        Disciplinas Cadastradas ({disciplinas.length})
      </h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Disciplina</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Período</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Tipo</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Professor</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Vagas</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Interessados</th>
              <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 600, color: '#374151' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disciplina) => (
              <tr key={disciplina.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{disciplina.nome}</td>
                <td style={{ padding: '12px 8px' }}>{disciplina.periodo}° Período</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    background: disciplina.obrigatoria ? '#dbeafe' : '#fef3c7',
                    color: disciplina.obrigatoria ? '#1e40af' : '#92400e'
                  }}>
                    {disciplina.obrigatoria ? 'Obrigatória' : 'Optativa'}
                  </span>
                </td>
                <td style={{ padding: '12px 8px' }}>{disciplina.professor}</td>
                <td style={{ padding: '12px 8px' }}>{disciplina.vagas}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{
                    color: disciplina.interessados > 0 ? '#059669' : '#6b7280',
                    fontWeight: 600
                  }}>
                    {disciplina.interessados}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button
                      onClick={() => onView(disciplina)}
                      style={{
                        background: '#4f8cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                      title="Ver detalhes"
                    >
                      {FaEye({ size: 12 })}
                    </button>
                    <button
                      onClick={() => onEdit(disciplina)}
                      style={{
                        background: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                      title="Editar"
                    >
                      {FaEdit({ size: 12 })}
                    </button>
                    <button
                      onClick={() => handleDelete(disciplina.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                      title="Excluir"
                    >
                      {FaTrash({ size: 12 })}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {disciplinas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Nenhuma disciplina cadastrada</div>
          <div>Clique em "Cadastrar Disciplina" para adicionar a primeira disciplina</div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedDisciplina && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
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
              onClick={() => setSelectedDisciplina(null)}
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
              {FaTimes({ size: 24 })}
            </button>

            <h3 style={{ margin: '0 0 24px 0', color: '#1f2937', fontWeight: 600 }}>
              Detalhes da Disciplina
            </h3>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <strong>Nome:</strong> {selectedDisciplina.nome}
              </div>
              <div>
                <strong>Período:</strong> {selectedDisciplina.periodo}° Período
              </div>
              <div>
                <strong>Tipo:</strong> {selectedDisciplina.obrigatoria ? 'Obrigatória' : 'Optativa'}
              </div>
              <div>
                <strong>Professor:</strong> {selectedDisciplina.professor}
              </div>
              <div>
                <strong>Vagas:</strong> {selectedDisciplina.vagas}
              </div>
              <div>
                <strong>Dias da Semana:</strong> {selectedDisciplina.diasSemana.join(', ')}
              </div>
              <div>
                <strong>Horário:</strong> {selectedDisciplina.horario}
              </div>
              <div>
                <strong>Interessados:</strong> {selectedDisciplina.interessados}
              </div>
              <div>
                <strong>Formandos:</strong> {selectedDisciplina.formandos}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaDisciplinas; 