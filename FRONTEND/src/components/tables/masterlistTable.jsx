import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Container, Form, ButtonGroup, Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';

const MasterlistTable = () => {
  const [masterlistData, setMasterlistData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showActiveTable, setShowActiveTable] = useState(true);

  const fetchMasterlistData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:8001/masterlist/get');
      setMasterlistData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMasterlistData();
    const intervalId = setInterval(fetchMasterlistData, 50000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchData();
  }, [showActiveTable]); // Trigger fetchData when showActiveTable changes

  const fetchData = async () => {
    try {
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `http://localhost:8001/masterlist/showTable?status=${showActiveTable ? 'ENROLLED' : 'ARCHIVED'}`
      );
      setMasterlistData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleToggleTable = () => {
    setShowActiveTable((prevShowActiveTable) => !prevShowActiveTable);
  };

  const activeColumns = [
    { name: 'Last Name', selector: 'lastName', sortable: true },
    { name: 'First Name', selector: 'firstName', sortable: true },
    { name: 'Middle Name', selector: 'middleName', sortable: true },
    { name: 'Student Number', selector: 'idNumber', sortable: true },
    { name: 'Course', selector: 'course', sortable: true },
    { name: 'Academic Year', selector: 'academicYear', sortable: true },
    { name: 'Semester', selector: 'semester', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
  ];

  const archivedColumns = [
    { name: 'Last Name', selector: 'lastName', sortable: true },
    { name: 'First Name', selector: 'firstName', sortable: true },
    { name: 'Middle Name', selector: 'middleName', sortable: true },
    { name: 'Student Number', selector: 'idNumber', sortable: true },
    { name: 'Course', selector: 'course', sortable: true },
    { name: 'Academic Year', selector: 'academicYear', sortable: true },
    { name: 'Semester', selector: 'semester', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
  ];

  const columns = [
    { name: 'Last Name', selector: 'lastName', sortable: true },
    { name: 'First Name', selector: 'firstName', sortable: true },
    { name: 'Middle Name', selector: 'middleName', sortable: true },
    { name: 'Student Number', selector: 'idNumber', sortable: true },
    { name: 'Course', selector: 'course', sortable: true },
    { name: 'Academic Year', selector: 'academicYear', sortable: true },
    { name: 'Semester', selector: 'semester', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
  ];

  const filteredData = masterlistData.filter((row) =>
    columns.some((column) => String(row[column.selector]).toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <Container className='form-container mt-1 p-3 pt-4 rounded-4 container-bg'>
      <h4 className='d-flex justify-content-center'>Masterlist Data</h4>
      <Form.Group controlId='search' className='my-3'>
        <Form.Control type='text' placeholder='Search...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </Form.Group>
      <ButtonGroup className='mb-2'>
        <Button
          variant={showActiveTable ? 'success' : 'secondary'}
          onClick={handleToggleTable}
        >
          Enrolled Students
        </Button>

        <Button
          variant={showActiveTable ? 'secondary' : 'success'}
          onClick={handleToggleTable}
        >
          Archived
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
        fixedHeader={true}
        fixedHeaderScrollHeight="375px"
      />
    </Container>
  );
};

export default MasterlistTable;
