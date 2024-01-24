import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Form, Button, Container, Modal ,ButtonGroup, InputGroup} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { ToastContainer, toast } from 'react-toastify';
const OfficerTable = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
     const [showActiveTable, setShowActiveTable] = useState(true);
  
     const [newRole, setNewRole] = useState('');

     const handleUpdateRole = async () => {
      if (selectedRow && newRole) {
        try {
          // Make a request to the update role endpoint for the selected user
          const response = await axios.post(
            `http://localhost:8001/updateRole/${selectedRow.userId}`,
            null,
            {
              params: {
                newRole: newRole,
              },
            }
          );
  
          if (response.data === 'User role updated successfully') {
            toast.success('User role updated successfully');
            handleCloseModal();
            fetchData();
          } else {
            toast.error("Something went wrong. Can't update user role.");
          }
        } catch (error) {
          console.error('Error updating user role:', error);
          toast.error("Something went wrong. Can't update user role.");
        }
      }
    };

  
    const columns = [
      { name: 'No.', selector: 'userId', sortable: true },
      { name: 'Name', selector: 'firstName', sortable: true, cell: (row) => `${row.firstName} ${row.middleName} ${row.lastName}` },
      { name: 'ID Number', selector: 'idNumber', sortable: true },
      { name: 'Date Added', selector: 'dateAdded', sortable: true, cell: (row) => formatDateAdded(row) },
      { name: 'Status', selector: 'status', sortable: true },
      { name: 'Role', selector: 'role', sortable: true },
    ];

 

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
          const response = await axios.put(`http://localhost:8001/archive/${selectedRow.userId}/ARCHIVED`);
    
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

    const handleUnarchive = async () => {
      if (selectedRow) {
        try {
          // Make a request to the archive endpoint for the selected user
          const response = await axios.put(`http://localhost:8001/archive/${selectedRow.userId}/ACTIVE`);
    
          if (response.data === "User unarchived successfully") {
            toast.success("User unarchived successfully");
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

  
 
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 50000);
      return () => clearInterval(intervalId);
    }, [showActiveTable]); // Include showActiveTable as a dependency
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/userList?status=${showActiveTable ? 'ACTIVE' : 'ARCHIVED'}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const handleToggleTable = () => {
      setShowActiveTable((prevShowActiveTable) => !prevShowActiveTable);
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
        variant={showActiveTable ? 'success' : 'secondary'}
        onClick={handleToggleTable}
      >
        Active Users
      </Button>

      <Button
        variant={showActiveTable ? 'secondary' : 'success'}
        onClick={handleToggleTable}
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
                  {/* Form for updating role */}
                  {selectedRow && selectedRow.status === 'ACTIVE' && (
              <Form>
                <Form.Group controlId='newRole'>
                  <Form.Label>Update Role:</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      as='select'
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value=''>Select Role</option>
                      <option value='TREASURER'>Treasurer</option>
                      <option value='AUDITOR'>Auditor</option>
                      <option value='OTHER_OFFICER'>Other Officer</option>
                    </Form.Control>
                   
                      <Button variant="secondary" onClick={handleUpdateRole}>
                        Update Role
                      </Button>
                   
                  </InputGroup>
                </Form.Group>
              </Form>
            )}
             
              </>
            )}
          </Modal.Body>
         <Modal.Footer>
             {/* Form for archiving */}
             {selectedRow && selectedRow.status=="ACTIVE" && (
              <Form className='d-flex justify-content-end my-3'>
                <Button variant='danger' onClick={handleArchive}>
                  Archive User
                </Button>
              </Form>
                )}
                 {selectedRow && selectedRow.status=="ARCHIVED" && (
              <Form>
                <Button variant='secondary' onClick={handleUnarchive}>
                  Unarchive User
                </Button>
              </Form>
                )}
               
         </Modal.Footer>
        </Modal>
      </Container>
    );
  };
  
  export default OfficerTable;