import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, FormControl,  OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import '../../assets/css/global.css';

const CurrentPrice2 = () => {
  const [membershipFeePrice, setMembershipFeePrice] = useState(0);
  const [organizationShirtPrice, setOrganizationShirtPrice] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get('http://localhost:8001/price/get');
        setMembershipFeePrice(response.data.membershipFee);
        setOrganizationShirtPrice(response.data.shirtPrice);
      } catch (error) {
        console.error('Error fetching membership fee price:', error);
      }
    };

    fetchPrice();

    const intervalId = setInterval(fetchPrice, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Card>
        <Card.Header className="fw-bold">Current Price for</Card.Header>
        <Row className="m-0 py-2">
          <Col lg="12" className='pb-3'>
            <div className="container-bg2 px-2 py-3 my-2">
              <b>Membership Fee:</b><br/>PHP {membershipFeePrice.toFixed(2)}
            </div>
          </Col>
          <Col lg="12">
            <div className="container-bg2 px-2 py-3 my-2">
              <b>Organization Shirt:</b><br/>PHP  {organizationShirtPrice.toFixed(2)}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CurrentPrice2;