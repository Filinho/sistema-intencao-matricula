import React, { useState } from 'react';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';

interface DisciplinaForm {
  nome: string;
  periodo: number;
  obrigatoria: boolean;
  optativa: boolean;
  vagas: number;
  professor: string;
  diasSemana: string[];
  horario: string;
}

type DisciplinaFormErrors = {
  [K in keyof DisciplinaForm]?: string;
};

interface CadastroDisciplinaProps {
  onClose: () => void;
  onSave: (disciplina: DisciplinaForm) => void;
}

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const CadastroDisciplina: React.FC<CadastroDisciplinaProps> = ({ onClose, onSave }) => {
  const [form, setForm] = useState<DisciplinaForm>({
    nome: '',
    periodo: 1,
    obrigatoria: true,
    optativa: false,
    vagas: 30,
    professor: '',
    diasSemana: [],
    horario: '',
  });

  const [errors, setErrors] = useState<DisciplinaFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: DisciplinaFormErrors = {};

    if (!form.nome.trim()) {
      newErrors.nome = 'Nome da disciplina é obrigatório';
    }

    if (form.periodo < 1 || form.periodo > 10) {
      newErrors.periodo = 'Período deve ser entre 1 e 10';
    }

    if (!form.obrigatoria && !form.optativa) {
      newErrors.obrigatoria = 'Disciplina deve ser obrigatória ou optativa';
    }

    if (form.vagas <= 0) {
      newErrors.vagas = 'Número de vagas deve ser maior que zero';
    }

    if (!form.professor.trim()) {
      newErrors.professor = 'Professor é obrigatório';
    }

    if (form.diasSemana.length === 0) {
      newErrors.diasSemana = 'Selecione pelo menos um dia da semana';
    }

    if (!form.horario.trim()) {
      newErrors.horario = 'Horário é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(form);
      onClose();
    }
  };

  const handleDiaChange = (dia: string) => {
    setForm(prev => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia]
    }));
  };

  const handleTipoChange = (tipo: 'obrigatoria' | 'optativa') => {
    setForm(prev => ({
      ...prev,
      obrigatoria: tipo === 'obrigatoria',
      optativa: tipo === 'optativa'
    }));
  };

  return (
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
        maxWidth: 600,
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
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

        <h2 style={{ margin: '0 0 24px 0', color: '#1f2937', fontWeight: 600 }}>
          {FaPlus({ size: 20, style: { marginRight: 8 } })} Cadastrar Nova Disciplina
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                Nome da Disciplina *
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: errors.nome ? '2px solid #ef4444' : '1px solid #d1d5db',
                  fontSize: 16
                }}
                placeholder="Ex: Algoritmos e Estruturas de Dados"
              />
              {errors.nome && (
                <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.nome}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                Período *
              </label>
              <select
                value={form.periodo}
                onChange={(e) => setForm(prev => ({ ...prev, periodo: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: errors.periodo ? '2px solid #ef4444' : '1px solid #d1d5db',
                  fontSize: 16
                }}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(periodo => (
                  <option key={periodo} value={periodo}>{periodo}° Período</option>
                ))}
              </select>
              {errors.periodo && (
                <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.periodo}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                Tipo de Disciplina *
              </label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="radio"
                    name="tipo"
                    checked={form.obrigatoria}
                    onChange={() => handleTipoChange('obrigatoria')}
                  />
                  Obrigatória
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="radio"
                    name="tipo"
                    checked={form.optativa}
                    onChange={() => handleTipoChange('optativa')}
                  />
                  Optativa
                </label>
              </div>
              {errors.obrigatoria && (
                <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.obrigatoria}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                Número de Vagas *
              </label>
              <input
                type="number"
                value={form.vagas}
                onChange={(e) => setForm(prev => ({ ...prev, vagas: parseInt(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: errors.vagas ? '2px solid #ef4444' : '1px solid #d1d5db',
                  fontSize: 16
                }}
                min="1"
              />
              {errors.vagas && (
                <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.vagas}</div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
              Professor *
            </label>
            <input
              type="text"
              value={form.professor}
              onChange={(e) => setForm(prev => ({ ...prev, professor: e.target.value }))}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: errors.professor ? '2px solid #ef4444' : '1px solid #d1d5db',
                fontSize: 16
              }}
              placeholder="Ex: Prof. João Silva"
            />
            {errors.professor && (
              <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.professor}</div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
              Dias da Semana *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {diasSemana.map(dia => (
                <label key={dia} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={form.diasSemana.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                  />
                  {dia}
                </label>
              ))}
            </div>
            {errors.diasSemana && (
              <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.diasSemana}</div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
              Horário *
            </label>
            <input
              type="text"
              value={form.horario}
              onChange={(e) => setForm(prev => ({ ...prev, horario: e.target.value }))}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: errors.horario ? '2px solid #ef4444' : '1px solid #d1d5db',
                fontSize: 16
              }}
              placeholder="Ex: 08:00-10:00"
            />
            {errors.horario && (
              <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.horario}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#4f8cff',
                color: 'white',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {FaSave({ size: 16 })} Salvar Disciplina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroDisciplina; 