import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';

const BASE_URL = "https://localhost:7207"; 

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await newsService.getNewsById(id); console.log(data);
                setNewsItem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!newsItem) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">News item not found</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{newsItem.title}</h2>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Back to List
                </Button>
            </div>

            <Card className="shadow-sm">
                {newsItem.thumbnail?.url && (
                    <Card.Img
                        variant="top"
                        src={`${BASE_URL}${newsItem.thumbnail.url}`}
                        alt="Thumbnail"
                        style={{ maxHeight: '250px', objectFit: 'cover' }}
                    />
                )}
                <Card.Body>
                    <Card.Subtitle className="mb-3 text-muted">
                        Published: {new Date(newsItem.publishedDate).toLocaleDateString()} |{' '}
                        Category: {newsItem.categoryName || newsItem.category?.name || 'N/A'}
                    </Card.Subtitle>
                    <Card.Text style={{ whiteSpace: 'pre-line' }}>{newsItem.body}</Card.Text>

                    {newsItem.mediaItems && newsItem.mediaItems.length > 0 && (
                        <div className="mt-5">
                            <h5>Media Gallery</h5>
                            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                                {newsItem.mediaItems.map((media, idx) => (
                                    <Col key={idx}>
                                        <Card className="h-100 shadow-sm">
                                            <Card.Img
                                                variant="top"
                                                src={`${BASE_URL}${media.url}`}
                                                alt={media.caption || `Media ${idx + 1}`}
                                                style={{ height: '180px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Text className="text-truncate">
                                                    {media.caption || `Media ${idx + 1}`}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default NewsDetails;
