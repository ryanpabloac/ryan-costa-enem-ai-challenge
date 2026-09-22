import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/Auth';
import { CreateExamPage } from '../pages/Exam/CreateExam';
import { ExamQuestionsPage } from '../pages/Exam/Questions';
import { ExamResultPage } from '../pages/Exam/Result';
import { Home } from '../pages/Home';
import { NotFoundPage } from '../pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/simulado/novo" element={<CreateExamPage />} />
        <Route path="/simulado/:id" element={<ExamQuestionsPage />} />
        <Route path="/simulado/:id/resultado" element={<ExamResultPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
