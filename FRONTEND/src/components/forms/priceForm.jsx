import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, InputGroup, Card, Button, Modal, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PriceForm = () => {
  const [membershipFee, setMembershipFee] = useState(0);
  const [shirtPrice, setShirtPrice] = useState(0);
  const [isEditingMembershipFee, setIsEditingMembershipFee] = useState(false);
  const [isEditingShirtPrice, setIsEditingShirtPrice] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [membershipFeePending, setMembershipFeePending] = useState(false);
  const [shirtPricePending, setShirtPricePending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch default values from the API
        const responseDefault = await axios.get('http://localhost:8001/price/get');
        const { membershipFee: defaultMembershipFee, shirtPrice: defaultShirtPrice } = responseDefault.data;
        setMembershipFee(defaultMembershipFee);
        setShirtPrice(defaultShirtPrice);

        // Fetch pending requests from the API
        const responsePending = await axios.get('http://localhost:8001/price/pending');
        const pendingRequests = responsePending.data;
        setMembershipFeePending(pendingRequests.some(request => request.type === 'membershipFee'));
        setShirtPricePending(pendingRequests.some(request => request.type === 'shirtPrice'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch updates every 10 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalId);
    };
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

  const handleOk = async () => {
    if (!isNaN(membershipFee) && membershipFee >= 1 && !isNaN(shirtPrice) && shirtPrice >= 1) {
      try {
        // Check if the membershipFee is edited
        if (isEditingMembershipFee) {
          await axios.post('http://localhost:8001/price/insert', {
            type: 'membershipFee',
            price: membershipFee,
          });
        }

        // Check if the shirtPrice is edited
        if (isEditingShirtPrice) {
          await axios.post('http://localhost:8001/price/insert', {
            type: 'shirtPrice',
            price: shirtPrice,
          });
        }

        toast.success("Price update has been requested to the auditor!");
        setIsEditingMembershipFee(false);
        setIsEditingShirtPrice(false);

        // Trigger a data fetch after successful update
        fetchData();
      } catch (error) {
        console.error('Error updating prices:', error);
        toast.error("You already have a pending price update requests.");
      }
    } else {
      toast.error("Invalid input values.");
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip" placement="top">
      {text}
    </Tooltip>
  );

  return (
    <div className="container my-2 p-0 m-0">
      <ToastContainer />

      <Card>
        <Card.Header className='fw-bold'>Current Price for</Card.Header>
        <Row className='m-1'>
          <Col sm={6}>
            <Card className='py-0'>
              <Card.Body className='container-bg2 rounded-2 pt-0 pb-3'>
                {membershipFeePending ? (
                  <>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("You have submitted a price update request to the auditor.")}
                    >
                      <div className='text-bg-warning text-center rounded-bottom-pill px-1 fw-bold' style={{ fontSize: "9px" }}>
                        Price update request
                      </div>
                    </OverlayTrigger>
                  </>
                ) : ("")}
                <Form>
                  <InputGroup className='d-flex'>
                    <Form.Label htmlFor="membershipFee" className="me-2 mb-0 d-flex align-items-center">
                      Membership Fee:
                    </Form.Label>
                    <Form.Control
                      className='container-bg2'
                      type="number"
                      id="membershipFee"
                      value={membershipFee}
                      required
                      placeholder={`Current: ${membershipFee}`}
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
            <Card className='py-0'>
              <Card.Body className='container-bg2 rounded-2 pt-0 pb-3'>
                {shirtPricePending ? (
                  <>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("You have submitted a price update request to the auditor.")}
                    >
                      <div className='text-bg-warning text-center rounded-bottom-pill px-1 fw-bold' style={{ fontSize: "9px" }}>
                        Price update request
                      </div>
                    </OverlayTrigger>
                  </>
                ) : ("")}
                <Form>
                  <InputGroup >
                    <Form.Label htmlFor="shirtPrice" className="me-2 mb-0 d-flex align-items-center">
                      Organization Shirt:
                    </Form.Label>
                    <Form.Control
                      className='container-bg2'
                      type="number"
                      id="shirtPrice"
                      value={shirtPrice}
                      required
                      placeholder={`Current: ${shirtPrice}`}
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
