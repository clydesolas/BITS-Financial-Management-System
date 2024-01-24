import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap'; // Assuming you are using Bootstrap components
import * as Icon from 'react-bootstrap-icons';

const RecentTransactions = () => {
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const fetchLatestTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8001/transaction/latestTransactions');
        setLatestTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching latest transactions:', error);
        setLoading(false);
      }
    };

    fetchLatestTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (latestTransactions.length === 0) {
    return <div>No latest transactions available.</div>;
  }

  const formatDate = (dateString) => {
    // Add your date formatting logic here
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container className='mx-0 px-0'>
      <div className='d-flex justify-content-center mb-2'>
        <b className='text-secondary'>Recent Transactions</b>
      </div>
      <Container className="mt-3" style={{ height: '220px', overflowY: 'auto' }}>
        <Table striped hover>
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>
            {latestTransactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td>
                <span>
          {transaction.transactionType === 'INFLOW' ? (
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
                </td>
                <td>
                    {formatDate(transaction.transactionDate)}</td>
                    <td><div style={{ width: "130px", wordWrap: 'break-word' }}>{transaction.particular}</div></td>
                <td>PHP {transaction.total.toFixed(2)}</td>
               
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Container>
  );
};

export default RecentTransactions;
