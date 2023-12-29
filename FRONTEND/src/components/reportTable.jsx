import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Form, Button, Container, Modal, Table } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import '../assets/css/global.css';
import { useReactToPrint } from "react-to-print"; //npm i react-to-print
import { useDownloadExcel } from "react-export-table-to-excel"; //npm i react-export-table-to-excel

const ReportTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTransactionVersionModal, setShowTransactionVersionModal] = useState(false);
  const [formValues, setFormValues] = useState({
    amount: 0,
    quantity: 0,
    total: 0,
    remark: '',
  });

  const componentPDF = useRef();
  const generatePDF = useReactToPrint({
      content: () => componentPDF.current,
      documentTitle: "Financial History",
  });

  const componentExcel = useRef();
  const { onDownload } = useDownloadExcel({
      currentTableRef: componentExcel.current,
      filename: "Financial History",
      sheet: "Financial-History",
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
      transactionVersion: row.transactionVersion
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenTransactionVersionModal = (row) => {
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
    });
    setShowTransactionVersionModal(true);
  };
  
  const handleCloseModalVer = () => {
    setShowTransactionVersionModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [field]: value,
      total: (field === 'amount' ? value : prevFormValues.amount) * (field === 'quantity' ? value : prevFormValues.quantity),
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8001/transaction/update/${selectedRow.transactionId}`, {
        amount: formValues.amount,
        quantity: formValues.quantity,
        total: formValues.total,
        remark: formValues.remark,
        orNumber: formValues.orNumber,
        transactionDate: formValues.transactionDate,
      });

      if (response.data === 'Success') {
        console.log('Update success');
        fetchData(); // Refresh data after update
        handleCloseModal();
        setShowSuccessModal(true); // Show the success modal
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
    { name: 'OR No.', selector: 'orNumber', sortable: true },
    { name: 'Remark', selector: 'remark', sortable: true, minWidth: '150px', grow: 5 },
    {
      name: 'Action',
      selector: 'actionModal',
      sortable: false,
      minWidth: '50px',
      grow: 5,
      cell: (row) => (
        <>
        
        <Button variant='link' size='sm' onClick={() => handleOpenTransactionVersionModal(row)}>
        <Icon.ClockHistory variant='dark'/>
      </Button>
        <Button variant='link' size='sm' onClick={() => handleOpenModal(row)}>
          <Icon.Pencil color='green' />
        </Button>
       
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
    <Form.Group controlId='search' className='my-3'>
        <Form.Control type='text' placeholder='Search...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <div className="row2">
                        <div className="column2">
                            <label for="start" className="label-export">
                                Start from:{" "}
                            </label>
                            <input
                                type="date"
                                id="startdate"
                                name="startdate"
                            ></input>

                            <label for="end" className="label-export">
                                End to:{" "}
                            </label>
                            <input
                                type="date"
                                id="enddate"
                                name="enddate"
                            ></input>

                            <button className="btn-export" onClick={onDownload}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    class="bi bi-filetype-xls"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM6.472 15.29a1.176 1.176 0 0 1-.111-.449h.765a.578.578 0 0 0 .254.384c.07.049.154.087.25.114.095.028.202.041.319.041.164 0 .302-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .085-.29.387.387 0 0 0-.153-.326c-.101-.08-.255-.144-.462-.193l-.619-.143a1.72 1.72 0 0 1-.539-.214 1.001 1.001 0 0 1-.351-.367 1.068 1.068 0 0 1-.123-.524c0-.244.063-.457.19-.639.127-.181.303-.322.527-.422.225-.1.484-.149.777-.149.305 0 .564.05.78.152.216.102.383.239.5.41.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258.625.625 0 0 0-.247-.181.923.923 0 0 0-.369-.068c-.217 0-.388.05-.513.152a.472.472 0 0 0-.184.384c0 .121.048.22.143.3a.97.97 0 0 0 .405.175l.62.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Zm-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94l1.274-2.007Zm2.727 3.325H4.557v-3.325h-.79v4h2.487v-.675"
                                    />
                                </svg>
                                Export EXCEL
                            </button>

                            <button
                                className="btn-export"
                                onClick={generatePDF}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    class="bi bi-filetype-pdf"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"
                                    />
                                </svg>
                                Export PDF
                            </button>
                        </div>
                    </div>
    </Form.Group>
    <div ref={componentExcel}>
    <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        highlightOnHover
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        persistTableHead={true}
        fixedHeader={true}
        fixedHeaderScrollHeight="600px"
    />
    </div>
   
  <Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header className="container-bg2" closeButton style={{ color: 'white' }}>
      <Modal.Title>Update</Modal.Title>
    </Modal.Header>
    <Modal.Body className="container-bg2">
        {selectedRow && (
            <Form>
            <form method="submit">
              <div className='row'>
                <div className='col-md-6 my-2'>
                  <Form.Group className="mb-3" controlId="formTransactionId">
                    <Form.Label>Transaction ID:</Form.Label>
                    <Form.Control type="text" value={selectedRow.transactionId} disabled />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formParticular">
                    <Form.Label>Particular:</Form.Label>
                    <Form.Control type="text" disabled value={formValues.particular || selectedRow.particular} onChange={(e) => handleInputChange('particular', e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formAmount">
                    <Form.Label>Amount:</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={formValues.amount !== 0 ? formValues.amount : selectedRow.amount}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDate">
                    <Form.Label className="mb-0">Transaction Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={formValues.transactionDate || selectedRow.transactionDate}
                      onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-md-6 my-2'>
                  <Form.Group className="mb-3" controlId="formParticular">
                    <Form.Label>Date Encoded:</Form.Label>
                    <Form.Control type="text" disabled value={formatDateAdded(selectedRow)} onChange={(e) => handleInputChange('dateAdded', e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formParticular">
                    <Form.Label>OR No.:</Form.Label>
                    <Form.Control type="text" value={formValues.orNumber || selectedRow.orNumber} onChange={(e) => handleInputChange('orNumber', e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formQuantity">
                    <Form.Label>Quantity:</Form.Label>
                    <Form.Control
                      type="number"
                      value={formValues.quantity !== 0 ? formValues.quantity : selectedRow.quantity}
                      onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                  <Form.Group controlId="formTotal">
                    <Form.Label>Total:</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={formValues.total !== 0 ? formValues.total : selectedRow.total}
                      onChange={(e) => handleInputChange('total', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <Form.Group className="my-2" controlId="formRemark">
                  <Form.Label>Remark:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formValues.remark || selectedRow.remark}
                    onChange={(e) => handleInputChange('remark', e.target.value)}
                  />
                </Form.Group>
              </div>
            </form>
          </Form>            
        )}
        </Modal.Body>
        <Modal.Footer className="container-bg2">
        <Button variant="secondary" onClick={handleClear}>
            Clear
        </Button>
        <Button variant="success" className="button-bg" onClick={handleUpdate}>
            Update
        </Button>
        </Modal.Footer>
    </Modal>

    <Modal show={showTransactionVersionModal} onHide={handleCloseModalVer} className='modal-lg'>
    <Modal.Header className="container-bg2" closeButton style={{ color: 'white' }}>
      <Modal.Title><h5>Version History</h5></Modal.Title>
    </Modal.Header>
    <Modal.Body className="container-bg2" >
                <Form>
                {selectedRow && (
                  <div className="my-2" style={{ overflowX: 'auto', width: '100%' }}>
                    <DataTable
                      columns={[
                        { name: 'Date', selector: 'changeTime', sortable: true, minWidth: '170px', cell: (row) => new Date(row.changeTime).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) },
                        { name: 'Amount', selector: 'amount', sortable: true, cell: (selectedRow) => (
                          <span>
                            ₱ {Number(selectedRow.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ),
                        },
                        { name: 'Quantity', selector: 'quantity', sortable: true },
                        { name: 'Total', selector: 'total', sortable: true, cell: (selectedRow) => (
                          <span>
                            ₱ {Number(selectedRow.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ),
                        },
                        { name: 'orNumber', selector: 'orNumber', sortable: true },
                        { name: 'Remark', selector: 'remark', sortable: true },
                      ]}
                      data={selectedRow.transactionVersion}
                      highlightOnHover
                      persistTableHead={true}
                      fixedHeader={true}
                      fixedHeaderScrollHeight="1000px"
                    />
                  </div>
                   )}
                </Form>
            </Modal.Body>
    </Modal>

    <Modal show={showSuccessModal} centered onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h3 className="d-flex justify-content-center" style={{ color: 'green' }}>
            Success <Icon.Check2Circle />
        </h3>
        <p className="d-flex justify-content-center">Transaction has been updated successfully.</p>
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

export default ReportTable;
