import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, Row, Col, Spin, message } from 'antd';

const { Search: AntdSearch } = Input;

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (value) => {
        setLoading(true);  // Set loading state to true before making the API call
        try {
            const response = await axios.get(`http://localhost:5000/search?keyword=${value}`);
            console.log(response.data);  // Log the response data for debugging
            if (response.data && Array.isArray(response.data.books)) {
                setBooks(response.data.books);
            } else {
                setBooks([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("There was an error searching for books!", error);
            message.error("There was an error searching for books!");
            setBooks([]);
        } finally {
            setLoading(false);  // Set loading state to false after API call completes
        }
    };

    return (
        <div className="container">
            <h1 className="my-4">Book Recommendation System</h1>
            <AntdSearch
                placeholder="Enter a keyword"
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                loading={loading}
            />

            {loading && (
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <Spin size="large" />
                    <p>Loading...</p>
                </div>
            )}

            {!loading && books.length > 0 && (
                <Row gutter={16} style={{ marginTop: '20px', boxShadow:'10px' }}>
                    {books.map((book, index) => (
                        <Col span={8} key={index} style={{ marginBottom: '20px' }}>
                            <Card title={book.title} bordered={false}>
                                <p><strong>Author:</strong> {book.authors}</p>
                                <p><strong>Average Rating:</strong> {book.average_rating}</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>ISBN13:</strong> {book.isbn13}</p>
                                <p><strong>Language:</strong> {book.language_code}</p>
                                {book.num_pages && <p><strong>Number of Pages:</strong> {book.num_pages}</p>}
                                <p><strong>Ratings Count:</strong> {book.ratings_count}</p>
                                <p><strong>Text Reviews Count:</strong> {book.text_reviews_count}</p>
                                <p><strong>Publication Date:</strong> {book.publication_date}</p>
                                <p><strong>Publisher:</strong> {book.publisher}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {!loading && books.length === 0 && (
                <p>No books found.</p>
            )}
        </div>
    );
};

export default Search;
