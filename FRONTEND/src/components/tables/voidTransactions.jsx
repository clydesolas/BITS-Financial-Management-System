import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Container, Modal, Badge, Card, Row, Col } from 'react-bootstrap';
import { ArrowRightCircleFill } from 'react-bootstrap-icons';
import '../../assets/css/global.css';
import VoidTransactionsButton from '../modals/voidTransactionsButton';

const VoidTransactions = () => {
  const [voidTransactions, setVoidTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalOption, setApprovalOption] = useState(null);

  const handleListItemClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleApprovalChange = (option) => {
    setApprovalOption(option);
    submitApproval(option);
  };

  const submitApproval = async (option) => {
    axios.defaults.withCredentials = true;
    if (selectedTransaction && option != null) {
      try {
        const response = await axios.put(
          `http://localhost:8001/transaction/void/${selectedTransaction.transactionId}/${option}`,
          { approval: option }
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
    const fetchVoidTransactions = async () => {
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.get('http://localhost:8001/transaction/fetchVoid');
        setVoidTransactions(response.data);
      } catch (error) {
        console.error('Error fetching void transactions:', error);
      }
    };

    // Fetch initially
    fetchVoidTransactions();

    // Fetch every 5 seconds
    const intervalId = setInterval(fetchVoidTransactions, 5000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    setApprovalOption(null); // Reset approval option
  };

  const TransactionDetails = () => (
    <Row>
      <Col sm={6}>
        <Form.Group className="mb-3" controlId="formTransactionId">
          <Form.Label>Transaction ID:</Form.Label>
          <Form.Control type="text" value={selectedTransaction.transactionId} disabled />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group className="mb-3" controlId="formTransactionType">
          <Form.Label>Transaction Type:</Form.Label>
          <Form.Control type="text" disabled value={selectedTransaction.transactionType} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group controlId="formDate" className="mb-3">
          <Form.Label className="mb-0">Transaction Date:</Form.Label>
          <Form.Control
            className="mx-0"
            type="date"
            disabled
            value={selectedTransaction.transactionDate}
          />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group className="mb-3" controlId="formParticular">
          <Form.Label>Date Encoded:</Form.Label>
          <Form.Control type="text" disabled value={selectedTransaction.dateAdded} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group className="mb-3" controlId="formParticular">
          <Form.Label>Allocation Type:</Form.Label>
          <Form.Control type="text" disabled value={selectedTransaction.allocationType} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group className="mb-3" controlId="formParticular">
          <Form.Label>Particular:</Form.Label>
          <Form.Control type="text" disabled value={selectedTransaction.particular} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount:</Form.Label>
              <Form.Control
                type="number"
                disabled
                step="0.01"
                value={selectedTransaction.amount}
              />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formQuantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control type="number" disabled value={selectedTransaction.quantity} />
            </Form.Group>
          </Col>
        </Row>
      </Col>
      <Col sm={6}>
        <Form.Group controlId="formTotal" className="mb-3">
          <Form.Label>Total:</Form.Label>
          <Form.Control
            type="number"
            disabled
            step="0.01"
            value={selectedTransaction.total}
          />
        </Form.Group>
      </Col>
      <Col sm={6}>
        {selectedTransaction.transactionType === 'OUTFLOW' && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Expense Receipt:</Form.Label>
              <Card>
                <img src={`http://localhost:8001/uploads/${selectedTransaction.imagePath}`} alt="Expense Receipt" />
              </Card>
            </Form.Group>
          </>
        )}
      </Col>
      <Col sm={selectedTransaction.transactionType === 'INFLOW' ? 12 : 6}>
        {selectedTransaction.transactionType === 'OUTFLOW' && (
          <Form.Group className="mb-3" controlId="formParticular">
            <Form.Label>OR No.:</Form.Label>
            <Form.Control type="text" disabled value={selectedTransaction.orNumber} />
          </Form.Group>
        )}
        <Form.Group className="my-2" controlId="formRemark">
          <Form.Label>Remark:</Form.Label>
          <Form.Control
            as="textarea"
            disabled
            value={selectedTransaction.remark}
          />
        </Form.Group>
      </Col>
    </Row>
  );

  return (
    <Card className="my-3">
      <Card.Header className='d-flex justify-content-between'>
        <h6 className='px-2 my-0'>
          Void Requests &nbsp;
          <Badge pill variant="success" className="bg-warning">
            {voidTransactions.length}
          </Badge> 
        </h6>
        <VoidTransactionsButton/>
      </Card.Header>
      <Card.Body style={{ maxHeight: '350px', height: '105px', overflowY: 'auto' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {voidTransactions.map((transaction) => (
            <li
              key={transaction.id}
              style={{
                cursor: 'pointer',
                padding: '5px',
                transition: 'background 0.3s',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => handleListItemClick(transaction)}
              onMouseEnter={(e) => (e.target.style.background = '#f1f1f1')}
              onMouseLeave={(e) => (e.target.style.background = 'inherit')}
            >
              <ArrowRightCircleFill className='text-secondary' style={{ marginRight: '5px' }} />
              {/* Display relevant information about each void transaction */}
              <div className='border-bottom'>
                Transaction ID: <u>{transaction.transactionId}</u> &nbsp;  Date: {transaction.transactionDate} &nbsp; Remark: {transaction.auditorRemark}
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>

      {/* Modal for displaying detailed information and approval form */}
      <Modal show={showModal} onHide={closeModal} centered className='modal-lg ' >
        <Modal.Header  className="container-bg2" closeButton>
          <Modal.Title>Void Transaction ID:  {selectedTransaction && ( selectedTransaction.transactionId)}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="container-bg2">
          {selectedTransaction && ( 
          <>
          <TransactionDetails />
         
              {/* Approval Form */}
              <Form className="d-flex justify-content-end align-items-center">
                <Form.Label className="my-3 pt-2">
                   <h5> Void transaction?</h5>
                </Form.Label>
                <Form.Group controlId="approvalRadio">
                  <Form.Check
                    type="radio"
                    label="Accept"
                    id="acceptRadio"
                    name="approvalRadio"
                    onChange={() => handleApprovalChange('ACCEPT')}
                    checked={approvalOption === 'ACCEPT'}
                    className="btn btn-warning  mx-3 px-5"
                  />
                  <Form.Check
                    type="radio"
                    label="Decline"
                    id="declineRadio"
                    name="approvalRadio"
                    onChange={() => handleApprovalChange('CANCEL')}
                    checked={approvalOption === 'CANCEL'}
                    className="btn btn-secondary  mx-3 px-5"
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

export default VoidTransactions;
