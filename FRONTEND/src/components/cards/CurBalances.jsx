import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const CurBalances = () => {
  return (
    <Card>
      <Card.Header>Current Balance</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Icon.PiggyBank size={30} />
                <Card.Title>IGP</Card.Title>
                <Card.Text>Static Count: 1000</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Icon.HandThumbsUp size={30} />
                <Card.Title>Collection</Card.Title>
                <Card.Text>Static Count: 500</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Icon.Donate size={30} />
                <Card.Title>Donation</Card.Title>
                <Card.Text>Static Count: 200</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CurBalances;
