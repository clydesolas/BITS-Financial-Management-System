import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Container, Modal, Badge, Card, Row, Col } from 'react-bootstrap';
import { ArrowRightCircleFill } from 'react-bootstrap-icons';
import '../../assets/css/global.css';

const PriceUpdates = () => {
  const [priceUpdates, setPriceUpdates] = useState([]);
  const [selectedPriceUpdate, setSelectedPriceUpdate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalOption, setApprovalOption] = useState(null);

  const handleListItemClick = (priceUpdate) => {
    setSelectedPriceUpdate(priceUpdate);
    setShowModal(true);
  };

  const handleApprovalChange = (option) => {
    setApprovalOption(option);
    submitApproval(option);
  };

  const submitApproval = async (option) => {
    axios.defaults.withCredentials = true;
    if (selectedPriceUpdate && option != null) {
      try {
        const response = await axios.put(
          `http://localhost:8001/price/update?type=${selectedPriceUpdate.type}&updateStatus=${option}`
        );

        // Handle the response as needed, e.g., show a success message
        console.log('Approval response:', response.data);

        // Close the modal after submitting
        closeModal();
      } catch (error) {
        console.error('Error submitting approval:', error);
      }
    }
  };

  useEffect(() => {
    const fetchPriceUpdates = async () => {
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.get('http://localhost:8001/price/pending');
        setPriceUpdates(response.data);
      } catch (error) {
        console.error('Error fetching pending price updates:', error);
      }
    };

    // Fetch initially
    fetchPriceUpdates();

    // Fetch every 5 seconds
    const intervalId = setInterval(fetchPriceUpdates, 5000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedPriceUpdate(null);
    setApprovalOption(null); // Reset approval option
  };

  const PriceUpdateDetails = () => (
    <Row>
    
    </Row>
  );

  return (
    <Card className="">
      <Card.Header>
        <h6 className='px-2 my-0'>
          Pending Price Updates &nbsp;
          <Badge pill variant="success" className="bg-warning">
            {priceUpdates.length}
          </Badge>
        </h6>
      </Card.Header>
      <Card.Body style={{ maxHeight: '310px', height: '75px', overflowY: 'auto' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {priceUpdates.map((priceUpdate) => (
            <li
              key={priceUpdate.id}
              style={{
                cursor: 'pointer',
                padding: '0px',
                transition: 'background 0.3s',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
              onClick={() => handleListItemClick(priceUpdate)}
              onMouseEnter={(e) => (e.target.style.background = '#f1f1f1')}
              onMouseLeave={(e) => (e.target.style.background = 'inherit')}
            >
              <ArrowRightCircleFill className='text-secondary' style={{ marginRight: '5px' }} />
              <div className='border-bottom 'style={{wordWrap: "break-word", display: "block"}}>
                Price update for {priceUpdate.type}
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>

      {/* Modal for displaying detailed information and approval form */}
       <Modal show={showModal} onHide={closeModal} centered className='modal-md '>
      <Modal.Header  className="container-bg2" closeButton>
          <Modal.Title>Confirm Price Update</Modal.Title>
        </Modal.Header>
        <Modal.Body className="container-bg2">
          {selectedPriceUpdate && (
            <>
              <PriceUpdateDetails />
              {/* Approval Form */}
              <Form.Group controlId="particularInput">
                <Form.Label>Particular:</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPriceUpdate.type}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="updatePriceInput">
                <Form.Label>Update Price to:</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedPriceUpdate.price}
                  disabled
                />
              </Form.Group>
              <br></br>
              <Form className="d-flex justify-content-center align-items-center">
                <Form.Label className="my-1 pt-2">
                  <h6> Approve this update?</h6>
                </Form.Label>
                <Form.Group controlId="approvalRadio">
                  <Form.Check
                    type="radio"
                    label="Accept"
                    id="acceptRadio"
                    name="approvalRadio"
                    onChange={() => handleApprovalChange('ACCEPTED')}
                    checked={approvalOption === 'ACCEPTED'}
                    className="btn btn-primary m-1 px-5"
                  />
                  <Form.Check
                    type="radio"
                    label="Decline"
                    id="declineRadio"
                    name="approvalRadio"
                    onChange={() => handleApprovalChange('DECLINED')}
                    checked={approvalOption === 'DECLINED'}
                    className="btn btn-danger m-1 px-5"
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default PriceUpdates;
