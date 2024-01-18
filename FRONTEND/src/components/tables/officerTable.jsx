import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Form, Button, Container, Modal ,ButtonGroup} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { ToastContainer, toast } from 'react-toastify';
const OfficerTable = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
  
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }, []);
  
  
    const columns = [
      { name: 'No.', selector: 'userId', sortable: true },
      { name: 'Name', selector: 'firstName', sortable: true, cell: (row) => `${row.firstName} ${row.middleName} ${row.lastName}` },
      { name: 'ID Number', selector: 'idNumber', sortable: true },
      { name: 'Date Added', selector: 'dateAdded', sortable: true, cell: (row) => formatDateAdded(row) },
      { name: 'Status', selector: 'status', sortable: true },
      { name: 'Role', selector: 'role', sortable: true },
    ];

    const [showActiveTable, setShowActiveTable] = useState(true);

  const activeColumns = [
    { name: 'No.', selector: 'userId', sortable: true },
    { name: 'Name', selector: 'firstName', sortable: true, cell: (row) => `${row.firstName} ${row.middleName} ${row.lastName}` },
    { name: 'ID Number', selector: 'idNumber', sortable: true },
    { name: 'Date Added', selector: 'dateAdded', sortable: true, cell: (row) => formatDateAdded(row) },
    { name: 'Status', selector: 'status', sortable: true },
    { name: 'Role', selector: 'role', sortable: true },
  ];

  const archivedColumns = [
    { name: 'No.', selector: 'userId', sortable: true },
    { name: 'Name', selector: 'firstName', sortable: true, cell: (row) => `${row.firstName} ${row.middleName} ${row.lastName}` },
    { name: 'ID Number', selector: 'idNumber', sortable: true },
    { name: 'Date Added', selector: 'dateAdded', sortable: true, cell: (row) => formatDateAdded(row) },
    { name: 'Status', selector: 'status', sortable: true },
    { name: 'Role', selector: 'role', sortable: true },
  ];
  
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

    const handleArchive = async () => {
      if (selectedRow) {
        try {
          // Make a request to the archive endpoint for the selected user
          const response = await axios.put(`http://localhost:8001/archive/${selectedRow.userId}`);
    
          if (response.data === "User archived successfully") {
            toast.success("User archived successfully");
            handleCloseModal();
            fetchData();
          } else {
            toast.error("Something went wrong. Can't archive user.");
          }
        } catch (error) {
          console.error('Error archiving user:', error);
          toast.error("Something went wrong. Can't archive user.");
        }
      }
    };
    
  
    const handleOpenModal = (row) => {
      setSelectedRow(row);
    };
  
    const handleCloseModal = () => {
      setSelectedRow(null);
    };
  
    const filteredData = data.filter((row) =>
      columns.some((column) => String(row[column.selector]).toLowerCase().includes(searchText.toLowerCase()))
    );

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/userList?status=${showActiveTable ? 'ACTIVE' : 'ARCHIVED'}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleToggleTable = (active) => {
      setShowActiveTable(active);
      fetchData();
    };
  
    return (
      <Container className=' mt-1 p-3 '>
      <ToastContainer />
      <Form.Group controlId='search' className='my-3'>
        <Form.Control
          type='text'
          placeholder='Search...'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Form.Group>

      <ButtonGroup className='mb-2'>
        <Button
          variant={showActiveTable ? 'primary' : 'secondary'}
          onClick={() => handleToggleTable(true)}
        >
          Active Users
        </Button>

        <Button
          variant={showActiveTable ? 'secondary' : 'primary'}
          onClick={() => handleToggleTable(false)}
        >
          Archived Users
        </Button>
      </ButtonGroup>
      <DataTable
        columns={showActiveTable ? activeColumns : archivedColumns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        highlightOnHover
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        persistTableHead={true}
        onRowClicked={handleOpenModal}
      />
        <Modal show={!!selectedRow} centered onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Officer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRow && (
              <>
                <p>Name: {`${selectedRow.firstName} ${selectedRow.middleName} ${selectedRow.lastName}`}</p>
                <p>Date Added: {formatDateAdded(selectedRow)}</p>
                <p>Status: {selectedRow.status}</p>
                <p>Role: {selectedRow.role}</p>
                <p>ID Number: {selectedRow.idNumber}</p>
                {/* Form for archiving */}
                {selectedRow && selectedRow.status=="ACTIVE" && (
              <Form>
                <Button variant='danger' onClick={handleArchive}>
                  Archive User
                </Button>
              </Form>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };
  
  export default OfficerTable;