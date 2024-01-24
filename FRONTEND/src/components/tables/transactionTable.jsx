import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import  { Form, Button, Container, Modal, Alert, Card, Col, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';
import VoidTransactionsButton from '../modals/voidTransactionsButton';

const TransactionTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const handleAlertClose = () => {
    setErrorMessage('');
  };
  const [formValues, setFormValues] = useState({
    amount: 0,
    quantity: 0,
    total: 0,
    remark: '',
  });

  axios.defaults.withCredentials = true;

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8001/transaction/fetchAll');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Helper Functions

  const formatTransactionDate = (row) => {
    const transactionDate = new Date(row.transactionDate);
    return transactionDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateAdded = (row) => {
    const dateAdded = new Date(row.dateAdded);
    return dateAdded.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  // Modal Functions

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setFormValues({
      amount: row.amount,
      quantity: row.quantity,
      total: row.total,
      remark: row.remark,
      orNumber: row.orNumber,
      dateAdded: row.dateAdded,
      transactionDate: row.transactionDate,
      transactionVersion: row.transactionVersion,
      imagePath: row.imagePath
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    handleAlertClose(true);
  };

  const handleInputChange = (field, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [field]: value,
      total: (field === 'amount' ? value : prevFormValues.amount) * (field === 'quantity' ? value : prevFormValues.quantity),
    }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 14); 
    const formattedDate = formatDate(minDate);
    console.log('Min Date:', formattedDate);
    return formattedDate;
  };
  
  const getMaxDate = () => {
    const today = new Date();
    const formattedDate = formatDate(today);
    console.log('Max Date:', formattedDate);
    return formattedDate;
  };
  




  const handleUpdate = async () => {

    try {
      const response = await axios.put(`http://localhost:8001/transaction/update/${selectedRow.transactionId}`, {
        transactionId: formValues.transactionId
      });

      if (response.data === 'Success') {
        console.log('Update success');
        fetchData(); // Refresh data after update
        handleCloseModal();
        setShowSuccessModal(true); // Show the success modal
        handleAlertClose(true);
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      handleCloseModal();
      setShowSuccessModal(true);
    }
  };

  const handleClear = () => {
    setFormValues({
      amount: 0,
      quantity: 0,
      total: 0,
      remark: '',
    });
    setShowSuccessModal(false);
  };

  // Render

  const columns = [
    { name: 'Transaction ID', selector: 'transactionId', sortable: true, minWidth: '137px', grow: 5 },
    { name: 'Date', selector: 'transactionDate', sortable: true, minWidth: '100px', cell: (row) => formatTransactionDate(row) },
    {
      name: 'Type',
      selector: 'transactionType',
      sortable: true,
      minWidth: '115px',
      cell: (row) => (
        <span>
          {row.transactionType === 'INFLOW' ? (
            <>
              <div className='text-success'>
                Inflow <Icon.ArrowUp />
              </div>
            </>
          ) : (
            <>
              <div className='text-danger'>
                Outflow <Icon.ArrowDown />
              </div>
            </>
          )}
        </span>
      ),
    },
    { 
        name: 'Amount', 
        selector: 'amount', 
        sortable: true,
        cell: (row) => (
          <span>
            ₱ {Number(row.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        ),
      },
      { name: 'Quantity', selector: 'quantity', sortable: true },
      { 
        name: 'Total', 
        selector: 'total', 
        sortable: true,
        minWidth: '115px',
        cell: (row) => (
          <span>
            ₱ {Number(row.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        ),
    },
    
    { name: 'Particular', selector: 'particular', sortable: true, minWidth: '160px', grow: 5 },
    { 
      name: 'Balance', 
      selector: 'balance', 
      sortable: true,
      minWidth: '115px',
      cell: (row) => (
        <span>
          ₱ {Number(row.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
  },
    { name: 'OR No.', selector: 'orNumber', sortable: true },
    { name: 'Remark', selector: 'remark', sortable: true, minWidth: '150px', grow: 5 },
    {
      name: 'Action',
      selector: 'actionModal',
      sortable: false,
      minWidth: '100px',
      grow: 5,
      cell: (row) => (
        <>
        <div className='align-content-center' style={{width: "50px"}}>
         {row.auditorRemark === 'PENDING' ? (
            <>
              <div className='text-bg-warning text-center rounded-bottom-pill px-1 fw-bold' style={{fontSize: "9px"}}>
                Pending Void
              </div>
            </>
          ) : ("")}
        <div className="d-flex">
        {/* <Button variant='link' size='md' onClick={() => handleOpenTransactionVersionModal(row)}>
        <Icon.ClockHistory variant='dark'/>
      </Button> */}
        <Button variant='link' size='md' onClick={() => handleOpenModal(row)}>
          <Icon.Folder2Open color='green' />
        </Button>
        </div>
        </div>
       
      </>
      ),
    },
  ];

  const filteredData = data.filter((row) =>
    columns.some((column) => String(row[column.selector]).toLowerCase().includes(searchText.toLowerCase()))
  );



  return (

     <Container className='form-container mt-1 p-3 pt-4 rounded-4 container-bg'>
    <h4 className='d-flex justify-content-center'>Breakdown of Cash Inflows and Outflows</h4>
   <Row>
    <Col lg="12">
    <Form.Group controlId='search' className='my-3'>
        <Form.Control type='text' placeholder='Search...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
    </Form.Group>
    </Col>
    
   </Row>
   
    <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        highlightOnHover
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        persistTableHead={true}
        fixedHeader={true}
        fixedHeaderScrollHeight="450px"
    />
     <Col lg="12" className='d-flex justify-content-end w-100'>
      <div className='w-20'>
      <VoidTransactionsButton/>
      </div>
    </Col>
  <Modal show={showModal} onHide={handleCloseModal} className='modal-lg'>
    <Modal.Header className="container-bg2" closeButton style={{ color: 'white' }}>
      <Modal.Title><>Transaction ID:  {selectedRow && (selectedRow.transactionId)}</></Modal.Title>
    </Modal.Header>
    <Modal.Body className="container-bg2">
    {errorMessage && (
        <Alert variant="danger" className='py-2 d-flex align-items-center' onClose={handleAlertClose} dismissible>
         <div className='d-flex align-items-center'>
           <p >{errorMessage}</p>
          </div>
        </Alert>)}
        {selectedRow && (
            <Form>
            <form method="submit">
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
                    <Form.Control type="text" disabled value={formValues.transactionType || selectedRow.transactionType} onChange={(e) => handleInputChange('particular', e.target.value)} />
                  </Form.Group>
              </Col>
              <Col sm={6}>
              <Form.Group controlId="formDate"className="mb-3 ">
                    <Form.Label className="mb-0">Transaction Date:</Form.Label>
                    <Form.Control className="mx-0"
                      type="date" disabled
                      min={getMinDate()}  // Set minimum date
                      max={getMaxDate()}  // Set maximum date
                      value={formValues.transactionDate || selectedRow.transactionDate}
                      onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                    />
                  </Form.Group>
              </Col>
              <Col sm={6}>
              <Form.Group className="mb-3" controlId="formParticular">
                    <Form.Label>Date Encoded:</Form.Label>
                    <Form.Control type="text" disabled value={formatDateAdded(selectedRow)} onChange={(e) => handleInputChange('dateAdded', e.target.value)} />
                  </Form.Group>
              </Col>
              <Col sm={6}>
              <Form.Group className="mb-3" controlId="formParticular">
                    <Form.Label>Allocation Type:</Form.Label>
                    <Form.Control type="text" disabled value={formValues.allocationType || selectedRow.allocationType} onChange={(e) => handleInputChange('allocationType', e.target.value)} />
                  </Form.Group>
              </Col>
              <Col sm={6}>
              <Form.Group className="mb-3" controlId="formParticular">
                    <Form.Label>Particular:</Form.Label>
                    <Form.Control type="text" disabled value={formValues.particular || selectedRow.particular} onChange={(e) => handleInputChange('particular', e.target.value)} />
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
                      value={formValues.amount !== 0 ? formValues.amount : selectedRow.amount}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                    />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formQuantity">
                    <Form.Label>Quantity:</Form.Label>
                    <Form.Control
                      type="number" disabled
                      value={formValues.quantity !== 0 ? formValues.quantity : selectedRow.quantity}
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
                      value={formValues.total !== 0 ? formValues.total : selectedRow.total}
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
                 <Form.Control type="text" disabled value={formValues.orNumber || selectedRow.orNumber} onChange={(e) => handleInputChange('orNumber', e.target.value)} />
               </Form.Group>
              )}
              <Form.Group className="my-2" controlId="formRemark">
                  <Form.Label>Remark:</Form.Label>
                  <Form.Control
                    as="textarea" disabled
                    value={formValues.remark || selectedRow.remark}
                    onChange={(e) => handleInputChange('remark', e.target.value)}
                  />
                </Form.Group>
              </Col>
             </Row>
             <Modal.Footer className="container-bg2">
        <Button variant="secondary" onClick={handleCloseModal}>
            Close
        </Button>
        <Button variant="warning" className="" onClick={handleUpdate}>
        {selectedRow.auditorRemark == "PENDING" && ("Cancel request to void")}
        {selectedRow.auditorRemark == "NONE" && ("Request to Void.")}
        </Button>
        </Modal.Footer>
            </form>
          </Form>            
        )}
        </Modal.Body>
       
    </Modal>

   

    <Modal show={showSuccessModal} centered onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h3 className="d-flex justify-content-center" style={{ color: 'green' }}>
          
        </h3>
        <p className="text-center">Request to Void <b>transaction ID:</b> <u>{selectedRow ? (selectedRow.transactionId):('')}</u> has been submitted to the Auditor. Please wait for approval.</p>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
        </Button>
        </Modal.Footer>
    </Modal>
</Container>

  );
};

export default TransactionTable;
