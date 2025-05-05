import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router';

import { PostPage } from './pages/PostPage';
import { ProfilePage } from './pages/ProfilePage';

export function ProfileRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="posts/:backendPostId" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
}
