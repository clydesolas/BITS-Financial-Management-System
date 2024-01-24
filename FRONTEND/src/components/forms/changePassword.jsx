import React, { useState } from 'react';
import { Container, Form, Button,  Card } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      // Validate password and confirm password
      if (!oldPassword || !newPassword || !confirmPassword) {
        toast.error('Please fill in all fields.');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('New password and confirm password do not match.');
        return;
      }
      axios.defaults.withCredentials = true;

      // Make API call to change the password
      const response = await axios.post('http://localhost:8001/changePassword', null, {
        params: {
          oldPassword,
          newPassword,
        },
      });
      

      // Handle success
      toast.success(response.data);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Handle error
      toast.error(error.response?.data || 'Error changing password.');
    }
  };

  return (
    <Container>
        <Card>
            <Card.Header>
            <h5>Change Password</h5>
            </Card.Header>
            <Card.Body>
            <Form>
        <Form.Group controlId="oldPassword" className='pb-2'>
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="newPassword" className='pb-2'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className='pb-2'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className='d-flex justify-content-end'>
        <Button variant="success" onClick={handleChangePassword}>
          Change Password
        </Button>
        </div>
       
      </Form>
            </Card.Body>
        </Card>
     
      <ToastContainer />
    </Container>
  );
};

export default ChangePassword;
