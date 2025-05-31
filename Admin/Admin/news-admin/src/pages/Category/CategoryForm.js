import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    createCategory,
    getCategoryById,
    updateCategory
} from '../../services/categoryService';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [category, setCategory] = useState({
        name: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            loadCategory();
        }
    }, [id]);

    const loadCategory = async () => {
        try {
            setLoading(true);
            const res = await getCategoryById(id);
            setCategory({
                name: res.data.name
            });
        } catch (err) {
            alert('Failed to load category');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateCategory(id, category);
                alert('Category updated successfully');
            } else {
                await createCategory(category);
                alert('Category created successfully');
            }
            navigate('/categories');
        } catch (err) {
            alert('Operation failed');
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h3 className="card-title mb-4">{isEdit ? 'Edit Category' : 'Add Category'}</h3>
                    {loading ? (
                        <div className="d-flex justify-content-center my-5">
                            <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={category.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter category name"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">
                                {isEdit ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
