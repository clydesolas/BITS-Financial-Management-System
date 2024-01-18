import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Form, Button, Container, Modal, Alert } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';

const TransactionTable = () => {
  // State Hooks
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTransactionVersionModal, setShowTransactionVersionModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [formValues, setFormValues] = useState({
    amount: 0,
    quantity: 0,
    total: 0,
    remark: '',
  });

  // Axios Configuration
  axios.defaults.withCredentials = true;

  // Fetch Data
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8001/transaction/fetchAll');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect for Initial Data Fetch and Interval Fetch
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

  // Handle Update Function
  const handleUpdate = async () => {
    if (
      !formValues.orNumber||
      !formValues.amount ||
      !formValues.quantity ||
      !formValues.total ||
      !formValues.remark ||
      !formValues.transactionDate
    ) {
      setErrorMessage('Please fill up all required fields.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8001/transaction/updateRequest/${selectedRow.transactionId}`, {
        transactionId: formValues.transactionId,
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
        
        <Button variant='link' size='md' onClick={() => handleOpenTransactionVersionModal(row)}>
        <Icon.ClockHistory variant='dark'/>
      </Button>
        <Button variant='link' size='md' onClick={() => handleOpenModal(row)}>
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
      {/* ... (your existing JSX structure) */}
    </Container>
  );
};

export default TransactionTable;
