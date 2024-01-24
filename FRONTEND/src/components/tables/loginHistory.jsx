import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';

const LoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    axios.defaults.withCredentials = true;

    const fetchLoginHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8001/loginHistory');
        const sortedDates = response.data.sort((a, b) => new Date(b) - new Date(a));
        setLoginHistory(sortedDates);
      } catch (error) {
        console.error('Error fetching login history:', error);
      }
    };

    fetchLoginHistory();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container className='mx-0 px-0'>
      <div className='d-flex justify-content-center mb-2'>
        <b className='text-secondary'>Login History</b>
      </div>
      <Container className="mt-3 px-0 mx-0" style={{ height: '220px', overflowY: 'auto' }}>
      <Table striped hover>
       
        <tbody>
          {loginHistory.map((entry) => (
            <tr key={entry}>
              <td>{formatDate(entry)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Container>
    </Container>
  );
};

export default LoginHistory;
