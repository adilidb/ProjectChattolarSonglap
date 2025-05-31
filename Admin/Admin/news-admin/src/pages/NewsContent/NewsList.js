import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { Button, Table, Container, Alert, Spinner, Modal, Badge, Row, Col } from 'react-bootstrap';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await newsService.getAllNews();
                setNews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/news/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/news/edit/${id}`);
    };

    const handleDeleteClick = (id) => {
        setSelectedNewsId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await newsService.deleteNews(selectedNewsId);
            setNews(news.filter(item => item.newsContentId !== selectedNewsId));
            setShowDeleteModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Container className="mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" role="status" variant="primary" style={{ width: '4rem', height: '4rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger" className="text-center fs-5">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2 className="fw-bold text-primary">News Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="success" onClick={() => navigate('/news/create')} className="shadow-sm">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New News
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive className="align-middle shadow-sm">
                <thead className="table-primary text-primary">
                    <tr>
                        <th>Title</th>
                        <th style={{ minWidth: '150px' }}>Category</th>
                        <th style={{ minWidth: '140px' }}>Published Date</th>
                        <th style={{ minWidth: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {news.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center text-muted fst-italic">
                                No news available. Please add some news.
                            </td>
                        </tr>
                    )}

                    {news.map((item) => (
                        <tr key={item.newsContentId} className="align-middle">
                            <td className="fw-semibold text-truncate" style={{ maxWidth: '350px' }} title={item.title}>
                                {item.title}
                            </td>
                            <td>
                                <Badge bg="info" text="dark" className="py-2 px-3 fs-6">
                                    {item.categoryName || 'Uncategorized'}
                                </Badge>
                            </td>

                            <td>{formatDate(item.publishedDate)}</td>
                            <td>
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleViewDetails(item.newsContentId)}
                                        title="View Details"
                                        aria-label="View Details"
                                    >
                                        <i className="bi bi-eye-fill"></i>
                                    </Button>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => handleEdit(item.newsContentId)}
                                        title="Edit"
                                        aria-label="Edit"
                                    >
                                        <i className="bi bi-pencil-fill"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(item.newsContentId)}
                                        title="Delete"
                                        aria-label="Delete"
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="fs-5">Are you sure you want to delete this news item?</p>
                    <p className="text-muted">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default NewsList;
