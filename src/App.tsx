import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./components/SiderBar";
import { PdfViewer } from "./components/PdfViewer";
import DateTimeLocation from "./components/DataTime";
import placeholderImage from "./assets/background.jpg";
import styles from './styles/styles.module.scss';

const Layout = () => {
  const [selectedManual, setSelectedManual] = useState<string | null>(null);

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/rec" element={<Layout />} />
      </Routes>
    </Router>
  );
};

export default App;