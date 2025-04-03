import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Property3D from './pages/Property3D';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Profile from './pages/profile'
import NotFound from './pages/NotFound';
import store from './app/store';
import CustomCursor from './components/CustomCursor';

const visibleCustomCursor = import.meta.env.VITE_CUSTOM_CURSOR_HIDE==='true';
function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="min-h-screen flex flex-col">
      {!visibleCustomCursor&&<CustomCursor />}

        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/property-3d" element={<Property3D />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path = '*' element={<NotFound/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </Provider>
  );
}

export default App;