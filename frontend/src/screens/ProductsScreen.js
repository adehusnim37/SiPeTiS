import React, { useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Form,Row, Col, Image, ListGroup, Card, Button, ListGroupItem} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProductDetails, createProductReview } from '../actions/productActions'
import {PRODUCT_CREATE_REVIEW_RESET} from "../constants/productConstant";
import Meta from "../components/Meta";
import moment from 'moment'


const ProductsScreen = ({ history, match }) => {
    const [qty,setQty] = useState(1)
    const [rating,setRating] = useState('0')
    const [comment,setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector((state) => state.productReviewCreate)
    const { success: successProductReview, error: errorProductReview } = productReviewCreate

    useEffect( () => {
        if(successProductReview){
            alert('Ulasan Telah ditambahkan')
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match, successProductReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(match.params.id, {rating,comment}))
    }

        return (
            <>
                <Meta title={product.name}/>
                <Link className=' btn btn-black my3' to='/'>
                    Kembali
                </Link>
                {loading ? (
                    <Loader/>
                ): error ? (
                    <Message variant='danger'>{error}</Message>
                ): (
                    <>
                    <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid></Image>
                    </Col>
                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>{product.name}</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Tanggal Dimulai : {moment(product.tanggalAwal).format("MMM Do YYYY")}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Tanggal Berakhir : {moment(product.tanggalAkhir).format("MMM Do YYYY")}
                            </ListGroup.Item>
                            <ListGroupItem>
                                <Rating
                                    text={`${product.numReviews} reviews`}
                                    value={product.rating}
                                />
                            </ListGroupItem>
                            <ListGroupItem>
                                Harga: RP {product.price}
                            </ListGroupItem>
                            <ListGroupItem>
                                Deskripsi: {product.description}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>

                    <Col md={3}>
                        <Card>
                            <ListGroup variant={"flush"}>
                                <ListGroupItem>
                                    <Row>
                                        <Col>
                                            Harga :
                                        </Col>
                                        <Col>
                                            <strong>RP {product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <Row>
                                        <Col>
                                            Stok :
                                        </Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'Tersedia' : 'Habis'}
                                        </Col>
                                    </Row>
                                </ListGroupItem>

                                {product.countInStock > 0 &&(
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Jumlah</Col>
                                            <Col>
                                                <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                    {
                                                        [...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))
                                                    }
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroupItem>
                                    <Button onClick={addToCartHandler} className='btn-block' type='Button' disabled={product.countInStock === 0}>
                                        Masukkan Ke Keranjang
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

                    <Row>
                        <Col md={6}>
                            <h2>Ulasan</h2>
                            {product.reviews.length === 0 && <Message> Tidak Ada Ulasan </Message>}
                            <ListGroup variant={'flush'}>
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating}/>
                                        <p>{review.createdAt.substring(0,10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Tulis Review</h2>
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message> }
                                    {userInfo ? (
                                            <Form onSubmit={submitHandler}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Rating</Form.Label>
                                                    <Form.Control as='select' value={rating} onChange={(e) => setRating((e.target.value))}>
                                                        <option value=''>Pilih..</option>
                                                        <option value='1'>1 -Sangat Buruk</option>
                                                        <option value='2'>2 -Buruk</option>
                                                        <option value='3'>3 -Bagus</option>
                                                        <option value='4'>4 -Puas</option>
                                                        <option value='5'>5 -Luar Biasa</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Komentar</Form.Label>
                                                    <Form.Control as='textarea' row='4' value={comment} onChange={(e) =>setComment(e.target.value)}>

                                                    </Form.Control>
                                                </Form.Group>
                                                <Button type='submit' variant='primary'>Submit</Button>
                                            </Form>)
                                        :
                                        (<Message> Yuk <Link to={'/login'}>Login</Link> untuk menuliskan ulasan{' '}</Message>)}
                                </ListGroup.Item>
                            </ListGroup>
                    </Col>
                    </Row>



                    </>
                )}
            </>
        )
}

export default ProductsScreen;