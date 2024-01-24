import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';

const VoidTransactionsButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [voidData, setVoidData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const handleButtonClick = async () => {
    try {
      const response = await axios.get('http://localhost:8001/transaction/fetchAllVoid');
      const voidData = response.data;
      setVoidData(voidData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching void data:', error);
    }
  };
 
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
  const handleCloseModal = () => setShowModal(false);

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
    { name: 'Student Number', selector: 'studentNumber', sortable: true, minWidth: '160px', grow: 5 },
    { name: 'Academic Year', selector: 'academicYear', sortable: true, minWidth: '160px', grow: 5 },
    { name: 'Semester', selector: 'semester', sortable: true, minWidth: '160px', grow: 5 },
    { name: 'Remark', selector: 'remark', sortable: true, minWidth: '150px', grow: 5 },
    { name: 'Status', selector: 'transactionStatus', sortable: true, minWidth: '160px', grow: 5 },

  ];
  
  const filteredData = voidData.filter((row) =>
  columns.some((column) => String(row[column.selector]).toLowerCase().includes(searchText.toLowerCase()))
);

  return (
    <>
      <Button variant="secondary" className="btn-sm py-0 my-0" onClick={handleButtonClick}>
        View Void Transactions
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} className='modal-xl '>
        <Modal.Header closeButton className='container-bg2'>
        <Modal.Title style={{fontSize: "19px"}}>Void Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body className='container-bg2'>
        <Form.Group controlId='search' className='my-3'>
        <Form.Control type='text' placeholder='Search...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </Form.Group>
          <DataTable
           columns={columns}
           data={filteredData}
           pagination
           paginationPerPage={10}
           highlightOnHover
           paginationRowsPerPageOptions={[10, 25, 50, 100]}
           persistTableHead={true}
           fixedHeader={true}
           fixedHeaderScrollHeight="550px"
          />
        </Modal.Body>
        
      </Modal>
    </>
  );
};

export default VoidTransactionsButton;

