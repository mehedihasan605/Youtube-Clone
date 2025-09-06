import { Route, Routes } from "react-router";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>

    </>
  );
}

export default App;
