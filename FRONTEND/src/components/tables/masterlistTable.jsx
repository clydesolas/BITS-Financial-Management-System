import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Container, Form } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';

const MasterlistTable = () => {
  const [masterlistData, setMasterlistData] = useState([]);
  const [searchText, setSearchText] = useState('');
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
    const intervalId = setInterval(fetchMasterlistData, 5000);
    return () => clearInterval(intervalId);
  }, []);
  

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
      <DataTable
        columns={columns}
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