import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import MessageBox from './components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCarHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeCarHandler = (item) => {
    ctxDispatch({ type: 'CART-REMOVE-ITEM', payload: item });
  };
  const checkOutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  const totalWeight = cartItems.reduce((a, c) => a + c.weight * c.quantity, 0);
  return (
    <div>
      <Helmet>
        <title>Shoping Cart</title>
      </Helmet>
      <h1>Shoping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is Empty.
              <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCarHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCarHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      {item.weight * item.quantity}/{item.weight}g
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="light"
                        onClick={() => removeCarHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Information</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Subtotal:</Col>
                    <Col>
                      ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>{cartItems.reduce((a, c) => a + c.quantity, 0)} </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Weight:</Col>
                    <Col>{totalWeight}g </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Packages of 1.5 Kg</Col>
                    <Col>{Math.ceil(totalWeight / 1500)} </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Free:</Col>
                    <Col>
                      {Math.ceil(totalWeight / 1500) * 1500 - totalWeight}g
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkOutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
