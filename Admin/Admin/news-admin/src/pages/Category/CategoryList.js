import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../../services/categoryService';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.data);
        } catch (err) {
            alert('Failed to load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!id) {
            alert("Invalid category ID");
            return;
        }

        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await deleteCategory(id);
            alert("Deleted successfully");
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert('Delete failed');
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center mt-5">
                <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                <span className="visually-hidden">Loading...</span>
            </div>
        );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Category List</h3>
                <Link to="/categories/create" className="btn btn-primary">
                    + Add Category
                </Link>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col" style={{ width: '180px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center text-muted py-3">
                                    No categories found.
                                </td>
                            </tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.categoryId}>
                                    <td>{cat.name}</td>
                                    <td>
                                        <Link
                                            to={`/categories/edit/${cat.categoryId}`}
                                            className="btn btn-sm btn-warning me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(cat.categoryId)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryList;
