import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import AAntDesign from "./pages/AAntDesign";
import AFluent from "./pages/AFluent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AAntDesign />}/>
        <Route path="fluent" element={<AFluent />} />
          {/* <Route index element={<AAntDesign />} /> */}
          {/* <Route path="*" element={<AAntDesign />} /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

reportWebVitals();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
