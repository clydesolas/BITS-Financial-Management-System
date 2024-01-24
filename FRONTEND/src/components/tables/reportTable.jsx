import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Form, Button, Container, Row, Col, InputGroup, FormControl,  OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';  // Import PDFViewer
import pdfLogo from '../../assets/img/pdfLogo.png';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';
import coverImage from '../../assets/img/cover.jpg';
import TransactionVersionModal from '../modals/transactionVersionModal';
import Balances from '../cards/balances.jsx';
import CurrentPrice from '../counter/currentPrice.jsx';
import VoidTransactions from './voidTransactions.jsx';
import PriceUpdates from "./priceUpdates.jsx";
import VoidTransactionsButton from '../modals/voidTransactionsButton.jsx';

const ReportTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showTransactionVersionModal, setShowTransactionVersionModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState('all');
  const [selectedAllocationType, setSelectedAllocationType] = useState('all');
  const [selectedParticular, setSelectedParticular] = useState('all');


  const getInitialStartDate = () => {
    const lastYear = new Date().getFullYear() - 1;
    return `${lastYear}-01-01`;
  };

  const getInitialEndDate = () => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-12-31`;
  };

  const [startDate, setStartDate] = useState(getInitialStartDate());
  const [endDate, setEndDate] = useState(getInitialEndDate());


  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedTransactionType, selectedAllocationType, selectedParticular]);
  


  
  const handleOpenTransactionVersionModal = (row) => {
    setSelectedRow(row);
    
    setShowTransactionVersionModal(true);
  };

  const handleCloseModalVer = () => {
    setShowTransactionVersionModal(false);
  };



  const handleParticularChange = (e) => {
    setSelectedParticular(e.target.value);
  };
  

  const outflowParticularOptions = [
    'all',
    'FOOD EXPENSE',
    'SUPPLIES EXPENSE',
    'TRANSPORTATION EXPENSE',
    'RENT EXPENSE',
    'REPRESENTATION EXPENSE',
    'MEDICAL EXPENSE',
    'COMMUNICATION EXPENSE',
    'MISCELLANEOUS EXPENSE',
    'TOKEN EXPENSE',
  ];
  const allParticularOptions = [
    'all',
  ];

  const [particularOptions, setParticularOptions] = useState(allParticularOptions);

  
  const handleTransactionTypeChange = (e) => {
    setSelectedTransactionType(e.target.value);

    if (e.target.value === 'INFLOW') {
      if (selectedAllocationType === 'COLLECTION') {
        setParticularOptions(['all', 'MEMBERSHIP_FEE']);
      } else if (selectedAllocationType === 'IGP') {
        setParticularOptions(['all', 'ORGANIZATION_SHIRT']);
      } else if (selectedAllocationType === 'DONATION') {
        setParticularOptions(['all']);
      } else {
        setParticularOptions(allParticularOptions);
      }
    }
    else if (e.target.value === 'OUTFLOW') {
      setParticularOptions(outflowParticularOptions);
    } else {
      setParticularOptions(allParticularOptions);
    }
  };

  const handleAllocationTypeChange = (e) => {
    setSelectedAllocationType(e.target.value);

    if (selectedTransactionType === 'INFLOW') {
      if (e.target.value === 'COLLECTION') {
        setParticularOptions(['all', 'MEMBERSHIP_FEE']);
      } else if (e.target.value === 'IGP') {
        setParticularOptions(['all', 'ORGANIZATION_SHIRT']);
      } else if (e.target.value === 'DONATION') {
        setParticularOptions(['all']);
      } else {
        setParticularOptions(allParticularOptions);
      }
    } else if (selectedTransactionType === 'OUTFLOW') {
      setParticularOptions(outflowParticularOptions);
    } else {
      setParticularOptions(allParticularOptions);
    }
  };


  const fetchData = async () => {
    axios.defaults.withCredentials = true;
    try {
      let url = 'http://localhost:8001/transaction/fetchAll';

      if (selectedAllocationType == 'all' && selectedTransactionType != 'all' && startDate && endDate) {
        url = `http://localhost:8001/transaction/findByDateRange?startDate=${startDate}&endDate=${endDate}&transactionTypes=${selectedTransactionType}`;
      } else if (selectedAllocationType != 'all' && selectedTransactionType == 'all' && startDate && endDate) {
        url = `http://localhost:8001/transaction/findByDateRange?startDate=${startDate}&endDate=${endDate}&allocationTypes=${selectedAllocationType}`;
      } else if (selectedAllocationType != 'all' && selectedTransactionType != 'all' && startDate && endDate) {
        url = `http://localhost:8001/transaction/findByDateRange?startDate=${startDate}&endDate=${endDate}&allocationTypes=${selectedAllocationType}&transactionTypes=${selectedTransactionType}`;
      } else {
        url = `http://localhost:8001/transaction/findByDateRange?startDate=${startDate}&endDate=${endDate}`;
      }
      if (selectedParticular != 'all') {
        url += `&particular=${selectedParticular}`;
      }
      console.log(selectedTransactionType);
      console.log('API Request URL:', url); // Add this line to log the API request URL

      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

 
  const handleExcelExport = () => {
    let url;
  
    if (startDate && endDate) {
      // Include new parameters for allocationTypes and transactionTypes
      if (selectedAllocationType === 'all' && selectedTransactionType !== 'all') {
        url = `http://localhost:8001/transaction/groupReport?startDate=${startDate}&endDate=${endDate}&transactionTypes=${selectedTransactionType}`;
      } else if (selectedAllocationType !== 'all' && selectedTransactionType === 'all') {
        url = `http://localhost:8001/transaction/groupReport?startDate=${startDate}&endDate=${endDate}&allocationTypes=${selectedAllocationType}`;
      } else if (selectedAllocationType !== 'all' && selectedTransactionType !== 'all') {
        url = `http://localhost:8001/transaction/groupReport?startDate=${startDate}&endDate=${endDate}&allocationTypes=${selectedAllocationType}&transactionTypes=${selectedTransactionType}`;
      } else {
        url = `http://localhost:8001/transaction/groupReport?startDate=${startDate}&endDate=${endDate}`;
      }
  
      // Append particular parameter if it's not 'all'
      if (selectedParticular !== 'all') {
        url += `&particular=${selectedParticular}`;
      }
  
      // Redirect to the generated URL
      window.location.href = url;
    } else {
      console.error('Please select start and end dates');
    }
  };
  const handleClear = () => {
    setSelectedTransactionType('all');
    setSelectedAllocationType('all');
    setSelectedParticular('all');
    setStartDate(getInitialStartDate());
    setEndDate(getInitialEndDate());

    fetchData();
  };

  const formatTransactionDate = (row) => {
    const transactionDate = new Date(row.transactionDate);
    return transactionDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#f0faf4',
    },
    backgroundImageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      opacity: 0.1,  // 50% opacity
    },
    section: {
      margin: 10,
      flexGrow: 1,
      textAlign: 'center',
    },
    section3: {
      margin: 10,
      display: 'block',
      textAlign: 'right',
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      right: '10px',
      fontSize: '11px',
      fontStyle: 'italic',
      color: 'grey',
    },
    header: {
      fontSize: '13px',
      fontWeight: 'bold',
      marginTop: '13px',
      marginBottom: '15px',
    },
    subtitle: {
      fontSize: '13px',
      marginTop: '5px',
      paddingLeft: '35px',
      textAlign: 'left',
    },
  });



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
    { name: 'Student Number', selector: 'studentNumber', minWidth: '150px', grow: 5, sortable: true },

    {
      name: 'Action',
      selector: 'actionModal',
      sortable: false,
      minWidth: '50px',
      grow: 5,
      cell: (row) => (
        <>
        
        <PDFDownloadLink document={
          <Document>
          <Page size={{ width: 420, height: 298 }} style={styles.page}>
          <Image src={coverImage} style={styles.backgroundImageContainer} />
            <View style={styles.section}>
            <Image style={{width: '45px', height: '45px', margin: '15px 0 0 15px', padding: '0 0 0 0'}} src={pdfLogo}></Image>
            <Text style={{fontSize: '14px', fontWeight: 'bold' , marginTop: '-35px'}}>Builders of Innovative Technologist Society</Text>
            <Text style={styles.header}>{'INVOICE RECORD'}</Text>
            <Text style={styles.subtitle}>{'Transaction ID:     '+ row.transactionId}</Text>
            <Text style={styles.subtitle}>{'Date:                    '+formatTransactionDate(row)}</Text>
            <Text style={styles.subtitle}>{'Particular:             '+row.particular}</Text>
            <Text style={styles.subtitle}>{'Amount:               PHP '+ Number(row.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={styles.subtitle}>{'Quantity:               '+row.quantity}</Text>
            <Text style={styles.subtitle}>{'Total:                    PHP '+ Number(row.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={styles.subtitle}>{'Remark:               '+row.remark}</Text>
          </View>
          <View style={styles.section3}>
            <Text>{'Generated from BITS Financial Management System'}</Text>
          </View>
      </Page>
        </Document>}
         fileName={`${row.transactionId}.pdf`}>
           {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-pdf-${row.transactionId}`}>Export PDF</Tooltip>}
              >
            <Button variant="link" size="md">
            <Icon.FileEarmarkArrowDown />
          </Button>
          </OverlayTrigger>
          }
        </PDFDownloadLink>
        

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-history-${row.transactionId}`}>Transaction Details</Tooltip>}
        >
         <Button variant='link' size='md' onClick={() => handleOpenTransactionVersionModal(row)}>
         <Icon.MenuButton variant='dark'/>
        </Button>
        </OverlayTrigger>
        </>
      ),
    },
  ];

  const filteredData = data.filter((row) =>
    columns.some((column) => String(row[column.selector]).toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className='mt-0 p-3 pt-4 rounded-4 container-bg'>
      <h4 className='d-flex justify-content-center mb-4'>Report</h4>
<Row>
 
  <div className="">
  <Balances/>
  </div>
  <Col lg="6">
    
    <Card>
  <Card.Header>
        <h6 className='px-2'>Generate Report:</h6>
  </Card.Header>
      <Row className=" p-4 my-2">
      <Col lg="6">
          <Form.Group controlId='startDate'>
            <InputGroup>
              <InputGroup.Text className="my-2">Start Date:</InputGroup.Text>
              <FormControl type='date' value={startDate} onChange={handleStartDateChange} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group controlId='endDate'>
            <InputGroup>
              <InputGroup.Text className="my-2">End Date:</InputGroup.Text>
              <FormControl type='date' value={endDate} onChange={handleEndDateChange} />
            </InputGroup>
          </Form.Group>
        </Col>
     <Col lg="6">
    <Form.Group controlId='transactionType'>
      <InputGroup  className='my-2'>
        <InputGroup.Text>Transaction Type:</InputGroup.Text>
        <Form.Control as='select' value={selectedTransactionType} onChange={handleTransactionTypeChange}>
          <option value='all'>All</option>
          <option value='INFLOW'>Inflow</option>
          <option value='OUTFLOW'>Outflow</option>
        </Form.Control>
      </InputGroup>
    </Form.Group>
  </Col>
  <Col lg="6">
    <Form.Group controlId='allocationType'>
      <InputGroup className='my-2'>
        <InputGroup.Text >Allocation Type:</InputGroup.Text>
        <Form.Control as='select' value={selectedAllocationType} onChange={handleAllocationTypeChange}>
          <option value='all'>All</option>
          <option value='DONATION'>Donation</option>
          <option value='COLLECTION'>Collection</option>
          <option value='IGP'>IGP</option>
          {/* Add other allocation types as needed */}
        </Form.Control>
      </InputGroup>
    </Form.Group>
  </Col>
  <Col lg="6">
    <Form.Group controlId='particular'>
      <InputGroup className='my-2'>
        <InputGroup.Text>Particular:</InputGroup.Text>
        <Form.Control as='select' value={selectedParticular} onChange={handleParticularChange}>
          {particularOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
    </Form.Group>
  </Col>
        <Col lg="6" className="d-flex justify-content-center">
        <Button variant='secondary' type="clear" className="my-2 mx-2 w-100" onClick={handleClear}>
            Clear
          </Button>
          <Button variant='success' className="my-2 w-100" onClick={handleExcelExport}>
            Excel
          </Button>
        </Col>
      </Row>
      </Card>
   
  </Col>
  <Col lg="6">
    <Row>
    <Col lg="6">
     <CurrentPrice/>
     </Col>
     <Col lg="6">
     <PriceUpdates/>
     </Col>
    </Row>
   
      <VoidTransactions/>
   
  </Col>
</Row>

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
        fixedHeaderScrollHeight='600px'
        onRowClicked={handleOpenTransactionVersionModal}
      />
      <TransactionVersionModal
        showTransactionVersionModal={showTransactionVersionModal}
        handleCloseModalVer={handleCloseModalVer}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default ReportTable;
