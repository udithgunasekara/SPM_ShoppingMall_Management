import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import Dashboard from "./pages/Dashboard";
import Promotions from "./pages/Promotions";
import Events from "./pages/Events";
import { AppProvider } from "./context/AppContext";
import useWindowSize from "./hooks/useWindowSize";
import Addproduct from "./components/Product/Addproduct";
import ProductsList from "./components/Product/ProductsList";

const App = () => {
  const { isMobile } = useWindowSize();

  return (
    <AppProvider>
      <Router>
        <div className="App">
          <NavBar isMobile={isMobile} />
          <div className="container mx-auto pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/events" element={<Events />} />

              {/* Udith */}
              <Route path="/update-product/:id" element={<Addproduct />} />
              <Route path="/add" element={<Addproduct />} />
              <Route path="/productList" element={<ProductsList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
