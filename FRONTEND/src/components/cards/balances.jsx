import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import "../../assets/css/global.css";
import { getBalanceCounts } from "../counter/balanceCount.jsx";


const Balances = () => {
    const [count, setCounts] = useState({
        collectionCount: 0,
        donationCount: 0,
        igpCount: 0,
    });
    useEffect(() => {
        const fetchData = async () => {
          try {
            const countsData = await getBalanceCounts();
            setCounts(countsData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      
        // Set up interval for periodic fetch (adjust the interval duration as needed)
        const intervalId = setInterval(fetchData, 5000);
      
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, []);
      

  return (
    <>
    <Card className='my-2 mb-3'>
      <Card.Header><b>Current Balance</b></Card.Header>
      <Card.Body>
        <Row>
        <Col lg={4}>
          <Card className='card2'>
              <Card.Body  className='text-light'>
                <Card.Title className='d-flex justify-content-between fs-5'>
                    <div className='align-items-center d-flex'>
                    <Icon.EnvelopeFill  size={25} />&nbsp;Donation
                    </div>
                    <div>
                        &#x20B1;{count.donationCount}
                    </div>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
          <Card className='card3'>
              <Card.Body  className='text-light'>
                <Card.Title className='d-flex justify-content-between  fs-5'>
                    <div className='align-items-center d-flex'>
                    <Icon.CurrencyExchange  size={25} />&nbsp;Collection
                    </div>
                    <div>
                        &#x20B1;{count.collectionCount}
                    </div>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className='card4'>
              <Card.Body  className='text-light'>
                <Card.Title className='d-flex justify-content-between  fs-5'>
                    <div className='align-items-center d-flex'>
                    <Icon.ShopWindow  size={25} />&nbsp;IGP
                    </div>
                    <div>
                        &#x20B1;{count.igpCount}
                    </div>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Card.Body>
    </Card>
    </>
  );
};

export default Balances;
