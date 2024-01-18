import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, InputGroup, Card, Button, Modal, Row, Col, Alert } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PriceForm = () => {
  const [membershipFee, setMembershipFee] = useState(0);
  const [shirtPrice, setShirtPrice] = useState(0);
  const [isEditingMembershipFee, setIsEditingMembershipFee] = useState(false);
  const [isEditingShirtPrice, setIsEditingShirtPrice] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch default values from the API
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8001/price/get')
      .then(response => {
        const { membershipFee: defaultMembershipFee, shirtPrice: defaultShirtPrice } = response.data;
        setMembershipFee(defaultMembershipFee);
        setShirtPrice(defaultShirtPrice);
      })
      .catch(error => {
        console.error('Error fetching default values:', error);
      });
  }, []);

  const handleEditMembershipFee = () => {
    setIsEditingMembershipFee(true);
  };

  const handleEditShirtPrice = () => {
    setIsEditingShirtPrice(true);
  };

  const handleExitEditMode = () => {
    setIsEditingMembershipFee(false);
    setIsEditingShirtPrice(false);
  };

   const handleMembershipFeeChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setMembershipFee(newValue);
    } else {
      // If the input is less than 1 or not a number, set it to 1
      setMembershipFee(1);
    }
  };

  const handleShirtPriceChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setShirtPrice(newValue);
    } else {
      // If the input is less than 1 or not a number, set it to 1
      setShirtPrice(1);
    }
  };

  const handleOk = async () => {
    if  (!isNaN(membershipFee) && membershipFee >= 1 && !isNaN(shirtPrice) && shirtPrice >= 1)
    {
      try {
        // Update values in the API
        await axios.put('http://localhost:8001/price/update', {
          membershipFee,
          shirtPrice,
        });
        toast.success("Price is updated successfully!'")
        setIsEditingMembershipFee(false);
        setIsEditingShirtPrice(false);
      } catch (error) {
        console.error('Error updating prices:', error);
        toast.error("Failed to update price.");
  }
}
  else{
    toast.error("Empty fields.");
  }

  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="container my-2 p-0 m-0">
        <ToastContainer/>
        
        <Card>
          <Card.Header className='fw-bold'>Current Price for</Card.Header>
          <Row className='m-1'>
          <Col sm={6}>
          <Card className="py-0">
            <Card.Body className='container-bg2 rounded-2 pt-1 pb-3'>
              <Form>
                <InputGroup className='d-flex'>
                  <Form.Label htmlFor="membershipFee" className="me-2 mb-0 d-flex  align-items-center">
                  Membership Fee:
                  </Form.Label>
                  
                  <Form.Control className='container-bg2 '
                    type="number"
                    id="membershipFee"
                    value={membershipFee}
                    required
                    placeholder={`Current: ${membershipFee}`}
                    onInput={handleMembershipFeeChange}
                    min="50"
                    onChange={(e) => setMembershipFee(e.target.value)}
                    readOnly={!isEditingMembershipFee}
                  />
                <InputGroup.Text className="py-0 px-1">
                    {isEditingMembershipFee ? (
                      <>
                       <Icon.Check className="text-success fs-3 pointer" onClick={handleOk} />
                      <Icon.X className="fs-3 ms-2 pointer" onClick={handleExitEditMode} />
                      </>
                    ) : (
                      <Icon.PencilSquare className="mx-2 pointer" onClick={handleEditMembershipFee} />
                    )}
                  </InputGroup.Text>

                </InputGroup>
              </Form>
            </Card.Body>
          </Card>
        </Col>
          <Col sm={6}>
          <Card className="py-0">
            <Card.Body className='container-bg2 rounded-2 pt-1 pb-3'>
              <Form>
              <InputGroup >
                  <Form.Label htmlFor="shirtPrice" className="me-2 mb-0 d-flex align-items-center">
                    Organization Shirt:
                  </Form.Label>
                 
                  <Form.Control className='container-bg2 '
                    type="number"
                    id="shirtPrice"
                    value={shirtPrice}
                    required
                    placeholder={`Current: ${shirtPrice}`}
                    onInput={handleShirtPriceChange}
                    onChange={(e) => setShirtPrice(e.target.value)}
                    readOnly={!isEditingShirtPrice}
                  />
                   <InputGroup.Text className="py-0 px-1">
                    {isEditingShirtPrice ? (
                      <>
                      <Icon.Check className="text-success fs-3 pointer" onClick={handleOk} />
                      <Icon.X className="fs-3 ms-2 pointer" onClick={handleExitEditMode} />
                      </>
                    ) : (
                      <Icon.PencilSquare className="mx-2 pointer" onClick={handleEditShirtPrice} />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Card>
     
      <Modal show={showAlert} onHide={handleCloseAlert}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Prices {showAlert ? 'updated successfully!' : 'update failed. Please try again.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseAlert}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PriceForm;
