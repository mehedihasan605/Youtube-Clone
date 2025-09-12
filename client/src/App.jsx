import { Route, Routes } from 'react-router';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import MainContent from './pages/MainContent';
import WatchHistory from './pages/WatchHistory';
import Playlists from './pages/Playlists';
import WatchLater from './pages/WatchLater';
import LikedVideos from './pages/LikedVideos';
import HomeLayout from './pages/HomeLayout';
import VideoDetailsPage from './pages/VideoDetailsPage';
import ProfilePage from './pages/ProfilePage';
import TweetDetails from './pages/TweetDetails';
import PlaylistDetails from './pages/PlaylistDetails';
import StudioLayout from './pages/StudioLayout';
import PrivateRoute from './routes/PrivateRoutes';
import DashBoard from './pages/DashBoard';
import Customization from './pages/Customization';
import Content from './pages/Content';
import VideoUpdate from './components/studio/VideoUpdate';
import TweetUpdate from './components/studio/TweetUpdate';
import PlaylistUpdate from './components/studio/PlaylistUpdate';

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
          <Route path="/video/:id" element={<VideoDetailsPage />} />
          <Route path="/channal/:userName" element={<ProfilePage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
          <Route path="/tweet/:tweetId" element={<TweetDetails />} />
        </Route>

        {/* Studio Routes (Private) */}
        <Route
          path="/studio"
          element={
            <PrivateRoute>
              <StudioLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="customization" element={<Customization />} />
          <Route path="content" element={<Content />} />
          <Route path="video-details/:id" element={<VideoUpdate />} />
          <Route path="tweet-details/:id" element={<TweetUpdate />} />
          <Route path="playlist-details/:id" element={<PlaylistUpdate />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
