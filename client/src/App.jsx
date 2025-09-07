import { Route, Routes } from "react-router";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import MainContent from './pages/MainContent';
import WatchHistory from "./pages/WatchHistory";
import Playlists from "./pages/Playlists";
import WatchLater from "./pages/WatchLater";
import LikedVideos from "./pages/LikedVideos";
import HomeLayout from './pages/HomeLayout';


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Home Routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<MainContent />} />
          <Route path="/subscriptions" element={<MainContent />} />
          <Route path="/history" element={<WatchHistory />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="/liked" element={<LikedVideos />} />
          <Route path="/register" element={<Register />} />
        </Route >
      </Routes>
    </>
  );
}

export default App;
