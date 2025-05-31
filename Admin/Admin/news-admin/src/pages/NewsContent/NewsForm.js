import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { Button, Form, Container, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7207/api';

const NewsForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        categoryId: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [mediaItems, setMediaItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);
    const [previewMedia, setPreviewMedia] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const categoriesResponse = await axios.get(`${API_BASE_URL}/category`);
                setCategories(categoriesResponse.data);

                if (isEditMode) {
                    const newsItem = await newsService.getNewsById(id);
                    setFormData({
                        title: newsItem.title,
                        body: newsItem.body,
                        categoryId: newsItem.categoryId.toString(),
                    });
                    if (newsItem.thumbnail) {
                        setPreviewThumbnail(newsItem.thumbnail.url);
                    }
                    if (newsItem.mediaItems && newsItem.mediaItems.length > 0) {
                        setPreviewMedia(newsItem.mediaItems.map(item => item.url));
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewThumbnail(URL.createObjectURL(file));
        }
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        setMediaItems(prev => [...prev, ...files]);
        setPreviewMedia(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    };

    const handleRemoveThumbnail = () => {
        setThumbnail(null);
        setPreviewThumbnail(null);
    };

    const handleRemoveMedia = (index) => {
        const newMediaItems = [...mediaItems];
        newMediaItems.splice(index, 1);
        setMediaItems(newMediaItems);

        const newPreviewMedia = [...previewMedia];
        newPreviewMedia.splice(index, 1);
        setPreviewMedia(newPreviewMedia);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const formDataObj = new FormData();
            formDataObj.append('Title', formData.title);
            formDataObj.append('Body', formData.body);
            formDataObj.append('CategoryId', formData.categoryId);

            if (thumbnail) {
                formDataObj.append('Thumbnail', thumbnail);
            }

            mediaItems.forEach((file) => {
                formDataObj.append('MediaItems', file);
            });

            if (isEditMode) {
                await newsService.updateNews(id, formDataObj);
            } else {
                await newsService.createNews(formDataObj);
            }

            navigate('/news');
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditMode) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <h2 className="mb-4 text-primary">{isEditMode ? 'Edit News' : 'Create New News'}</h2>

                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="title">
                            <Form.Label className="fw-semibold">Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter news title"
                                required
                                size="lg"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="body">
                            <Form.Label className="fw-semibold">Body</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                name="body"
                                value={formData.body}
                                onChange={handleChange}
                                placeholder="Write the news content here..."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="category">
                            <Form.Label className="fw-semibold">Category</Form.Label>
                            <Form.Select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                size="lg"
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="thumbnail">
                            <Form.Label className="fw-semibold">Thumbnail Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                            {previewThumbnail && (
                                <Card className="mt-3 shadow-sm" style={{ maxWidth: '220px' }}>
                                    <Card.Img
                                        variant="top"
                                        src={previewThumbnail}
                                        style={{ height: '140px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                                        <small className="text-muted text-truncate" style={{ maxWidth: '140px' }}>
                                            Thumbnail Preview
                                        </small>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={handleRemoveThumbnail}
                                            aria-label="Remove Thumbnail"
                                        >
                                            Remove
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="media">
                            <Form.Label className="fw-semibold">Additional Media (Images/Videos)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleMediaChange}
                                key={previewMedia.length} // reset input on media removal
                            />
                            {previewMedia.length > 0 && (
                                <Row className="mt-3 g-3">
                                    {previewMedia.map((url, index) => (
                                        <Col key={index} xs={6} md={4} lg={3}>
                                            <Card className="shadow-sm">
                                                {/* If you want to handle videos differently, can add logic here */}
                                                <Card.Img
                                                    variant="top"
                                                    src={url}
                                                    style={{ height: '140px', objectFit: 'cover' }}
                                                />
                                                <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                                                    <small className="text-truncate" style={{ maxWidth: '120px' }}>
                                                        Media Preview
                                                    </small>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveMedia(index)}
                                                        aria-label="Remove Media"
                                                    >
                                                        Remove
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/news')}
                                className="px-4"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                className="px-4"
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    isEditMode ? 'Update News' : 'Create News'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default NewsForm;
