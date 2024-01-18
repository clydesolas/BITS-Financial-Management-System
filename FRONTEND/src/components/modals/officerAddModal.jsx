import React, { useState } from 'react';
import { Button, Form, Modal, InputGroup, FormControl, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OfficerAddModal = ({ onAddOfficer }) => {
  const [show, setShow] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);

  // Generate a temporary password directly
  const generatedPassword = Math.random().toString(36).substring(2, 10);
  const [formData, setFormData] = useState({
    idNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    status: 'ACTIVE',
    email: '',
    password: generatedPassword,
      generatedPassword: generatedPassword,
  });

  const handleInputChange = (field, value) => {
    let validatedValue = value;
  
    
  // Email validation
  if (field === 'email') {
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value !== '' && !emailRegex.test(value)) {
      // setValidated(false);
      // toast.error('Please enter a valid email address.');
    }
  }
  // Student number validation (9-digit number)
  if (field === 'idNumber') {
    const studentNumberRegex = /^\d{0,9}$/;  // Allowing up to 9 digits
    if (value !== '' && !studentNumberRegex.test(value)) {
      toast.error('Student number must be a valid number up to 9 digits.');
      setValidated(false);
      return;
    }
  }
  
    // Names validation (letters only)
    if ((field === 'firstName' || field === 'middleName' || field === 'lastName') && value !== '') {
      const nameRegex = /^[A-Za-z]+$/;
      if (!nameRegex.test(value)) {
        toast.error('Please enter a valid name with letters only.');
        setValidated(false);
        return;
      }
    }
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: validatedValue,
    }));
  };

 

  const handleAddOfficer = async () => {
    if (
      formData.idNumber === '' ||
      formData.firstName === '' ||
      formData.lastName === '' ||
      formData.role === '' ||
      formData.email === ''
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

  


    axios.defaults.withCredentials = true;
    try {
      setLoading(true);

      const response = await axios.post('http://localhost:8001/register', formData);

      if (response.data === 'Registered successfully!') {
        // Send email
        const emailData = {
          email: formData.email,
          subject: 'Account Registration',
          body: `<p>Hello ${formData.firstName}!</p>
                  <p>Welcome to the financial management system. This is your account information:</p>
                  <ul>
                      <li>ID Number: <b>${formData.idNumber}</b></li>
                      <li>Password: <b>${generatedPassword}</b></li>
                  </ul>
                  <p>Please log in and change your temporary password immediately.</p>
                  <p>Thank you!</p>`
        };

        try {
          await axios.post('http://localhost:8001/send-email', emailData);
          handleClose();
          setShowSuccessModal(true);
          setSuccess(
            ', the student will be notified through their email with their account login detail.'
          );
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          setError(
            ', but failed to send email. Please notify the student for their account details personally.'
          );
          setLoading(false);
          handleClose();
          setShowSuccessModal(true);
        }
      }
      if (response.data === 'ID number already exists') {
        toast.error('ID number already exists');
        setLoading(false);
      }
      else{
        toast.error(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error adding officer:', error);
      toast.error("Error submitting");
      setLoading(false);

    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setFormData({
      idNumber: '',
      firstName: '',
      middleName: '',
      lastName: '',
      role: '',
      status: 'ACTIVE',
      email: '',
    });
    setLoading(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Add Officer
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Officer</Modal.Title>
        </Modal.Header>
        <ToastContainer />
        {/* Form Inside the MODAL */}
        <Form noValidate validated={validated} style={{ padding: '20px' }}>
          <Row>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Student Number:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Student Number"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                required
              />
            </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-2">
                <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                 <Form.Control.Feedback type="invalid">Invalid student number</Form.Control.Feedback>
                  <Form.Control.Feedback type="valid" className='fw-bold text-bg-light text-success'>Invalid email format</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-2">
                <Form.Label><span className='text-danger fw-bold fs-6'>*</span>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label>Middle Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                required
              />
              </Form.Group>
              </Col>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Last Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Role:</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => handleInputChange('role', e.target.value)}
                required
              >
                <option value="" disabled selected>
                  Select Role
                </option>
                <option value="TREASURER">Treasurer</option>
                <option value="AUDITOR">Auditor</option>
                <option value="OFFICER">Officer</option>
                <option value="OTHER_OFFICER">Other Officers</option>
              </Form.Control>
            </Form.Group>
            </Col>
          </Row>
        </Form>

        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddOfficer}>
            {loading ? (
              <>
                Loading... <Spinner animation="border" variant="light" size="sm" />
              </>
            ) : (
              'Add'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="d-flex justify-content-center" style={{ color: 'green' }}>
            Success <Icon.Check2Circle />
          </h3>
          <p className="p-2">
            Officer added successfully
            {error && <span>{error}</span>}
            {success && <span>{success}</span>}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={handleSuccessModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OfficerAddModal;
