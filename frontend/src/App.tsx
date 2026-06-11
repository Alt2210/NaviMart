import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyLists from './pages/MyLists';
import ListDetail from './pages/ListDetail';
import RecipeDetail from './pages/RecipeDetail';
import PantryDashboard from './pages/PantryDashboard';
import AddItem from './pages/AddItem';
import RecipeSuggestion from './pages/RecipeSuggestion';
import MealPlanner from './pages/MealPlanner';
import FamilySharing from './pages/FamilySharing';
import StatsDashboard from './pages/StatsDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Scanner from './pages/Scanner';
import AIChef from './pages/AIChef';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lists" element={<MyLists />} />
        <Route path="/list-detail" element={<ListDetail />} />
        <Route path="/recipe-detail" element={<RecipeDetail />} />
        <Route path="/pantry" element={<PantryDashboard />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/recipe-suggestion" element={<RecipeSuggestion />} />
        <Route path="/meals" element={<MealPlanner />} />
        <Route path="/family" element={<FamilySharing />} />
        <Route path="/reports" element={<StatsDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/ai-chef" element={<AIChef />} />
      </Routes>
    </Router>
  );
}

export default App;
