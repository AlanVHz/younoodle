import { Navigate, Route, Routes } from "react-router-dom";
import Investors from "./pages/Investors";
import Investor from "./pages/Investor";
import Navbar from "./components/navbar/Navbar";

export const Router = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to='/investors' />} />
        <Route path='/investors' element={<Investors />} />
        <Route path='/investor/:id' element={<Investor />} />
      </Routes>
    </>
  );
};
