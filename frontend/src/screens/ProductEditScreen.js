import axios from "axios";
import DatePicker from 'react-datepicker'
import React, {useState,useEffect} from 'react';
import { Link} from "react-router-dom";
import {Form, Button } from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {listProductDetails, updateProduct} from "../actions/productActions";
import {PRODUCT_UPDATE_RESET} from "../constants/productConstant";
import 'react-datepicker/dist/react-datepicker.css';

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [tanggalAwal, setTanggalAwal] = useState(new Date());
    const [tanggalAkhir, setTanggalAkhir] = useState(new Date());
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()

    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector((state) => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    useEffect(() => {
        if(successUpdate){
            dispatch({type: PRODUCT_UPDATE_RESET})
            history.push('/admin/productlist')
        }else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                setTanggalAwal(product.tanggalAwal)
                setTanggalAkhir(product.tanggalAkhir)
            }
        }

    }, [dispatch, history, productId, product, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }

            const { data } = await axios.post('/api/upload', formData, config)

            setImage(data)
            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id:productId,
            name,price,image,brand,category,description,countInStock,tanggalAwal,tanggalAkhir
        }))
    }
    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Kembali
            </Link>
            <FormContainer>
                <h1>Edit Produk</h1>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading && <Loader/>}
                {error && <Message variant='danger'>{error}</Message> }
                {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> :(
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId={name}>
                            <Form.Label> Nama Acara </Form.Label>
                            <Form.Control type='name' placeholder='Masukkan E-Mail' value={name}
                                          onChange={(e) => setName(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={price}>
                            <Form.Label> Harga Tiket </Form.Label>
                            <Form.Control type='number' placeholder='harga barang' value={price}
                                          onChange={(e) => setPrice(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={image}>
                            <Form.Label> Gambar Desain </Form.Label>
                            <Form.Control type='text' placeholder='Gambar barang' value={image}
                                          onChange={(e) => setImage(e.target.value)}>
                            </Form.Control>
                            <Form.File id='image-file' label='Pilih File' custom onChange={uploadFileHandler}>

                            </Form.File>
                            {uploading && <Loader/>}
                        </Form.Group>

                        <Form.Group controlId={brand}>
                            <Form.Label> Brand Acara </Form.Label>
                            <Form.Control type='text' placeholder='Brand barang' value={brand}
                                          onChange={(e) => setBrand(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={category}>
                            <Form.Label> Kategori Barang </Form.Label>
                            <Form.Control type='text' placeholder='Kategori Barang' value={category}
                                          onChange={(e) => setCategory(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={tanggalAwal}>
                            <Form.Label> Tanggal Dimulai Acara </Form.Label>
                            <DatePicker selected={tanggalAwal} type='date' placeholder='Tanggal Acara Dimulai' value={tanggalAwal}
                                        onChange={date => setTanggalAwal(date)}/>
                        </Form.Group>

                        <Form.Group controlId={tanggalAkhir}>
                            <Form.Label> Tanggal Akhir Acara </Form.Label>
                            <DatePicker selected={tanggalAkhir} type='date' placeholder='Tanggal Acara Diakhiri' value={tanggalAkhir}
                                        onChange={date => setTanggalAkhir(date)}/>
                        </Form.Group>

                        <Form.Group controlId={description}>
                            <Form.Label> Deskripsi Barang </Form.Label>
                            <Form.Control type='text' placeholder='Deskripsi Barang' value={description}
                                          onChange={(e) => setDescription(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={countInStock}>
                            <Form.Label> Stok Barang </Form.Label>
                            <Form.Control type='number' placeholder='Stok Barang' value={countInStock}
                                          onChange={(e) => setCountInStock(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Button type={"submit"} variant={"primary"}> Simpan </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen;