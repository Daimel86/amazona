import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import MessageBox from './components/MessageBox';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  //const { weight } = cartItems.reduce((a, c) => a + c.quantity * c.weight, 0);
  //const weight = {state, cartItems.weight};//{cartItems.reduce((a, c) => a + c.weight * c.quantity, 0)};

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
                      <Button variant="light" disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>{item.weight * item.quantity}g</Col>
                    <Col md={1}>
                      <Button variant="light">
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
              <ListGroup variant="flush">
                <Col>
                  <ListGroup.Item>
                    <h4>
                      Subtotal<br></br>
                      {cartItems.reduce((a, c) => a + c.quantity, 0)} items:
                      <br></br>$
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h4>
                  </ListGroup.Item>
                </Col>
                <Col>
                  <ListGroup.Item>
                    <h5>
                      Weight:<br></br>
                      {cartItems.reduce((a, c) => a + c.weight * c.quantity, 0)}
                      g <br></br>
                      {Math.ceil(
                        cartItems.reduce(
                          (a, c) => a + c.weight * c.quantity,
                          0
                        ) / 1500
                      )}{' '}
                      Packages of 1.5 Kg<br></br>
                      Free:{' '}
                      {Math.ceil(
                        cartItems.reduce(
                          (a, c) => a + c.weight * c.quantity,
                          0
                        ) / 1500
                      ) *
                        1500 -
                        cartItems.reduce(
                          (a, c) => a + c.weight * c.quantity,
                          0
                        )}
                      g
                    </h5>
                  </ListGroup.Item>
                </Col>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      disable={cartItems.length === 0}
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
