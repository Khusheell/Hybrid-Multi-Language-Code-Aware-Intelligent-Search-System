// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./utils/AppContext";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Repos from "./pages/Repos";
import Search from "./pages/Search";
import Results from "./pages/Results";
import Metrics from "./pages/Metrics";
import About from "./pages/About";
import "./styles/globals.css";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/repos" element={<Repos />} />
            <Route path="/search" element={<Search />} />
            <Route path="/results" element={<Results />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
