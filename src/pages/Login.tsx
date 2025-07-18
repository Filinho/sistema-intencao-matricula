import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [role, setRole] = useState<'aluno' | 'coordenador'>('aluno');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'aluno') {
      navigate('/aluno', { state: { nome, senha } });
    } else {
      navigate('/coordenador', { state: { nome, senha } });
    }
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
          <div style={{ fontWeight: 600 }}>Usuário</div>
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
          <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0, letterSpacing: 1 }}>Sistema de Intenção de Matrícula</h1>
          <div style={{ fontSize: 16, opacity: 0.9, marginTop: 6 }}>Acesso ao sistema</div>
        </header>
        {/* Login Card */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,120,0.10)', padding: 40, minWidth: 340, maxWidth: 380, marginTop: -60 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 600, marginBottom: 32, color: '#1976d2' }}>Login</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f4f6fa' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Senha</label>
              <input 
                type="password" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                required 
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f4f6fa' }} 
              />
            </div>
            <div style={{ marginBottom: 28 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Papel</label>
              <select value={role} onChange={e => setRole(e.target.value as any)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f4f6fa' }}>
              <option value="aluno">Aluno</option>
              <option value="coordenador">Coordenador</option>
            </select>
          </div>
            <button type="submit" style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, width: '100%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.10)' }}>
            Entrar
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 