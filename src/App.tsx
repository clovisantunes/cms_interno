import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./hooks/useProtectedRoute";
import { Sidebar } from "./components/SiderBar";
import { PdfViewer } from "./components/PdfViewer";
import { Alertas } from "./components/Alerts/Alerts";
import DateTimeLocation from "./components/DataTime";
import Login from "./pages/Login/Login";
import CreateAlert from "./pages/CreateAlert/CreateAlert";
import placeholderImage from "./assets/background.jpg";
import styles from './styles/styles.module.scss';

const Layout = () => {
  const [selectedManual, setSelectedManual] = useState<string | null>(null);
  const showAlertas = !selectedManual;

  return (
    <div className={styles.appContainer}>
      <Sidebar onSelectManual={setSelectedManual} />
      
      <div className={styles.mainContent}>
        <div className={styles.datetimeWrapper}>
          <DateTimeLocation />
        </div>
        
        <div className={styles.contentArea}>
          {selectedManual ? (
            <>
              <PdfViewer fileUrl={selectedManual} />
              <button
                className={styles.closeButton}
                onClick={() => setSelectedManual(null)}
              >
                Fechar
              </button>
            </>
          ) : (
            <div className={styles.placeholderContainer}>
              <img
                src={placeholderImage}
                alt="Imagem ilustrativa"
                className={styles.backgroundImage}
              />
              <div className={styles.overlay} />
              <Alertas isVisible={showAlertas} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
              <Layout />
          } />
          
          <Route path="/rec" element={
              <Layout />
          } />
          
          <Route path="/criar-alerta" element={
            <ProtectedRoute>
              <CreateAlert />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
          <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;