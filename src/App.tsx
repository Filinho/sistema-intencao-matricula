import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentPanel from './pages/StudentPanel';
import CoordinatorPanel from './pages/CoordinatorPanel';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aluno" element={<StudentPanel />} />
        <Route path="/coordenador" element={<CoordinatorPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
