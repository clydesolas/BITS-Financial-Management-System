import React from 'react';
import { Modal, Form, Row, Col, Card } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const TransactionVersionModal = ({ showTransactionVersionModal, handleCloseModalVer, selectedRow }) => {
  return (
    <Modal show={showTransactionVersionModal} onHide={handleCloseModalVer} className='modal-lg'>
      <Modal.Header className="container-bg2" closeButton style={{ color: 'white' }}>
        <Modal.Title><h5>Transaction ID: {selectedRow && (selectedRow.transactionId)} </h5></Modal.Title>
      </Modal.Header>
      <Modal.Body className="container-bg2">
        <Form>
          {selectedRow && (
            <Row>
            <Col sm={6}>
            <Form.Group className="mb-3" controlId="formTransactionId">
                  <Form.Label>Transaction ID:</Form.Label>
                  <Form.Control type="text" value={selectedRow.transactionId} disabled />
                </Form.Group>
            </Col>
            <Col sm={6}>
            <Form.Group className="mb-3" controlId="formTransactionType">
                  <Form.Label>Transaction Type:</Form.Label>
                  <Form.Control type="text" disabled value={selectedRow.transactionType || selectedRow.transactionType} onChange={(e) => handleInputChange('particular', e.target.value)} />
                </Form.Group>
            </Col>
            <Col sm={6}>
            <Form.Group controlId="formDate"className="mb-3 ">
                  <Form.Label className="mb-0">Transaction Date:</Form.Label>
                  <Form.Control className="mx-0"
                    type="date" disabled
                    
                    value={selectedRow.transactionDate || selectedRow.transactionDate}
                    onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                  />
                </Form.Group>
            </Col>
            <Col sm={6}>
            <Form.Group className="mb-3" controlId="formParticular">
                  <Form.Label>Date Encoded:</Form.Label>
                  <Form.Control type="text" disabled value={selectedRow.dateAdded} onChange={(e) => handleInputChange('dateAdded', e.target.value)} />
                </Form.Group>
            </Col>
            <Col sm={6}>
            <Form.Group className="mb-3" controlId="formParticular">
                  <Form.Label>Allocation Type:</Form.Label>
                  <Form.Control type="text" disabled value={selectedRow.allocationType || selectedRow.allocationType} onChange={(e) => handleInputChange('allocationType', e.target.value)} />
                </Form.Group>
            </Col>
            <Col sm={6}>
            <Form.Group className="mb-3" controlId="formParticular">
                  <Form.Label>Particular:</Form.Label>
                  <Form.Control type="text" disabled value={selectedRow.particular || selectedRow.particular} onChange={(e) => handleInputChange('particular', e.target.value)} />
                </Form.Group>
            </Col>
            <Col sm={6}>
            <Row>
                <Col sm={6}>
                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>Amount:</Form.Label>
                  <Form.Control
                    type="number" disabled
                    step="0.01"
                    value={selectedRow.amount !== 0 ? selectedRow.amount : selectedRow.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                  />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                <Form.Group className="mb-3" controlId="formQuantity">
                  <Form.Label>Quantity:</Form.Label>
                  <Form.Control
                    type="number" disabled
                    value={selectedRow.quantity !== 0 ? selectedRow.quantity : selectedRow.quantity}
                    onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value))}
                  />
                </Form.Group>
                </Col>
                </Row>
            </Col>
            <Col sm={6}>
            <Form.Group controlId="formTotal" className="mb-3">
                  <Form.Label>Total:</Form.Label>
                  <Form.Control
                    type="number" disabled
                    step="0.01"
                    value={selectedRow.total !== 0 ? selectedRow.total : selectedRow.total}
                    onChange={(e) => handleInputChange('total', e.target.value)}
                  />
                </Form.Group>
            </Col>
            <Col sm={6}>
            {selectedRow.transactionType == "OUTFLOW" && (
                <>
                 <Form.Group className="mb-3" >
                 <Form.Label>Expense Receipt:</Form.Label>
                <Card >
                <img src={"http://localhost:8001/uploads/" + selectedRow.imagePath} alt="Your Image" />
                </Card>
                </Form.Group>
                 </>
              )}
            </Col>
            <Col sm={selectedRow.transactionType === "INFLOW" ? 12 : 6}>
            {selectedRow.transactionType == "OUTFLOW" && (
              <Form.Group className="mb-3" controlId="formParticular">
               <Form.Label>OR No.:</Form.Label>
               <Form.Control type="text" disabled value={selectedRow.orNumber || selectedRow.orNumber} onChange={(e) => handleInputChange('orNumber', e.target.value)} />
             </Form.Group>
            )}
            <Form.Group className="my-2" controlId="formRemark">
                <Form.Label>Remark:</Form.Label>
                <Form.Control
                  as="textarea" disabled
                  value={selectedRow.remark || selectedRow.remark}
                  onChange={(e) => handleInputChange('remark', e.target.value)}
                />
              </Form.Group>
            </Col>
           </Row>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionVersionModal;
