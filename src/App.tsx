import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import DashboardPage from "@/pages/dashboardPage";
import ConfigPage from "./pages/configPage";
import OrdersPage from "./pages/OrdersPage";
import ClubDatesPage from "./pages/clubDatesPage";


function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DashboardPage />} path="/dashboard" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<ConfigPage />} path="/config/:clubId" />
      <Route element={<OrdersPage/>} path="/orders" /> 
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<ClubDatesPage/>} path="/horarios/:clubId" />
    </Routes>
  );
}

export default App;
