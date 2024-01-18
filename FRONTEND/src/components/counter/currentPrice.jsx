// Create a new file, e.g., CurrentPrice.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, FormControl,  OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import '../../assets/css/global.css';


const CurrentPrice = () => {
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
  }, []);

  return (
    <div>
        <Card>
            <Card.Header className="fw-bold">
                Current Price for
            </Card.Header>
            <Row  className=' m-2 py-2'>
                <Col sm="6" >
                <div className='container-bg2 p-2'><b>Membership Fee:</b> {membershipFeePrice.toFixed(2)}</div>
                </Col>
                <Col sm="6">
                <div className='container-bg2 p-2'><b>Organization Shirt:</b> {organizationShirtPrice.toFixed(2)}</div>
                </Col>
            </Row>
        </Card>
    
    </div>
  );
};

export default CurrentPrice;
