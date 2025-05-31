import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import NewsList from './pages/NewsContent/NewsList';
import NewsForm from './pages/NewsContent/NewsForm';
import NewsDetails from './pages/NewsContent/NewsDetails';
import CategoryList from './pages/Category/CategoryList';
import CategoryForm from './pages/Category/CategoryForm';

// Add this at the top of your src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="d-flex">
                <Sidebar />
                <div className="flex-grow-1">
                    <Navbar />
                    <div className="container mt-4">
                        <Routes>
                            <Route path="/" element={<NewsList />} />
                            <Route path="/news/create" element={<NewsForm />} />
                            <Route path="/news/edit/:id" element={<NewsForm />} />
                            <Route path="/categories" element={<CategoryList />} />
                            <Route path="/categories/create" element={<CategoryForm />} />
                            <Route path="/categories/edit/:id" element={<CategoryForm />} />
                            <Route path="/news/:id" element={<NewsDetails />} />
                            
                            {/*<Route path="/" element={<Navigate to="/news" replace />} />*/}
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
