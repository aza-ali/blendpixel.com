import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Retina from './pages/Retina';
import RetinaTerms from './pages/RetinaTerms';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/retina" element={<Retina />} />
            <Route path="/products/retina/terms" element={<RetinaTerms />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
