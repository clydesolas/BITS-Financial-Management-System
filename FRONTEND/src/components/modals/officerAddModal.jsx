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
  let [studentNumber, setStudentNumber] = useState('');
  const [isStudentNumberValid, setIsStudentNumberValid] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentFirstname, setStudentFirstname] = useState('');
  const [studentMiddlename, setStudentMiddlename] = useState('');
  const [studentLastname, setStudentLastname] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [role, setRole] = useState('');
    // Generate a temporary password directly
    const generatedPassword = Math.random().toString(36).substring(2, 10);
  const formData = {
    firstName: studentFirstname,
    middleName: studentMiddlename,
    lastName: studentLastname,
    idNumber: studentNumber,
    role: role,
    status: 'ACTIVE',
    password: generatedPassword,
    generatedPassword: generatedPassword,
    email: studentEmail
  };

 
  const handleStudentNumberChange = async (e) => {
    const inputValue = e.target.value;

    const isValidInput = /^\d{0,9}$/.test(inputValue) && inputValue.length <= 9;

    if (isValidInput) {
      setStudentNumber(inputValue);

      // Perform validation against the masterlist API
      try {
        const response = await axios.get(`http://localhost:8001/masterlist/validateStudentNumber/${inputValue}`);
        setIsStudentNumberValid(response.data.valid);
        setAcademicYear(response.data.academicYear);
        setSemester(response.data.semester);

        if (response.data.valid) {
          setStudentFirstname(response.data.firstname);
          setStudentMiddlename(response.data.middlename);
          setStudentLastname(response.data.lastname);
          setStudentEmail(response.data.email);
        } else {
          setStudentFirstname('');
          setStudentMiddlename('');
          setStudentLastname('');
          setStudentEmail('');
        }
      } catch (error) {
        console.error('Error validating student number:', error);
      }
    }
  };
 

  async function submitForm(event) {
    event.preventDefault();
   
    if (
      studentNumber === '' ||
      studentFirstname === '' ||
      studentLastname === '' ||
      role === '' ||
      studentEmail === ''
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    axios.defaults.withCredentials = true;
    try {
      setLoading(true);
      // Send email
      const emailData = {
        email: studentEmail,
        subject: 'Account Registration',
        body: `<p>Hello ${studentFirstname}!</p>
                <p>Welcome to the financial management system. This is your account information:</p>
                <ul>
                    <li>ID Number: <b>${studentNumber}</b></li>
                    <li>Password: <b>${generatedPassword}</b></li>
                </ul>
                <p>Please log in and change your temporary password immediately.</p>
                <p>Thank you!</p>`
      };

      try {
        await axios.post('http://localhost:8001/send-email', emailData);
        const response = await axios.post('http://localhost:8001/register', formData);
        if (response.data === 'Registered successfully!') {
          handleClose();
          setShowSuccessModal(true);
          setSuccess(
            ', the student will be notified through their email with their account login detail.'
          );
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
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        setError(
          ', but failed to send email. Please notify the student for their account details personally.'
        );
        setLoading(false);
        handleClose();
        setShowSuccessModal(true);
      }
     
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setStudentNumber('');
    setStudentFirstname('');
    setStudentMiddlename('');
    setStudentLastname('');
    setStudentEmail('');
    setRole('');
    setValidated(false);
    setError(null);
    setSuccess(null);
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
        <Form  id="officerForm" noValidate validated={validated}  style={{ padding: '20px' }}>
          <Row>
            <Col lg="6">
            <Form.Label><span className='text-danger fs-5'>*</span> Student Number:</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentNumber}
                    pattern="^\d{9}$"
                    onChange={handleStudentNumberChange}
                    required
                    isInvalid={!isStudentNumberValid}
                    isValid={isStudentNumberValid}
                  />
                  <Form.Control.Feedback type="invalid">Invalid student number</Form.Control.Feedback>
                  <Form.Control.Feedback type="valid" className='fw-bold text-bg-light text-success'>{studentEmail && `Valid`}</Form.Control.Feedback>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Role:</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setRole(e.target.value)}
                value={role}
                required
              >
                <option value="" disabled defaultValue>
                  Select Role
                </option>
                <option value="TREASURER">Treasurer</option>
                <option value="AUDITOR">Auditor</option>
                <option value="OTHER_OFFICER">Other Officer</option>
              </Form.Control>
            </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-2">
                <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Email:</Form.Label>
                <Form.Control
                className='bg-light'
                  type="email"
                  placeholder="Email"
                  value={studentEmail}
                  readOnly
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-2">
                <Form.Label><span className='text-danger fw-bold fs-6'>*</span>First Name:</Form.Label>
                <Form.Control
                className='bg-light'
                  type="text"
                  placeholder="First Name"
                  value={studentFirstname}
                  readOnly
                  onChange={(e) => setStudentFirstname(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label>Middle Name:</Form.Label>
              <Form.Control
              className='bg-light'
                type="text"
                placeholder="Middle Name"
                value={studentMiddlename}
                readOnly
                onChange={(e) => setStudentMiddlename(e.target.value)}
                required
              />
              </Form.Group>
              </Col>
            <Col lg="6">
              <Form.Group className="mb-2">
              <Form.Label><span className='text-danger fw-bold fs-6'>*</span>Last Name:</Form.Label>
              <Form.Control
              className='bg-light'
                type="text"
                placeholder="Last Name"
                value={studentLastname}
                readOnly
                onChange={(e) => setStudentLastname(e.target.value)}
                required
              />
            </Form.Group>
            </Col>
            
          </Row>
        </Form>

        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={submitForm} type="submit" >
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
