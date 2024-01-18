import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Button, 
  Container, 
  Row, 
  Col, 
  Modal ,
  Alert
} from 'react-bootstrap';
import '../../assets/css/global.css';
import axios from 'axios';
import session from '../session.jsx';
import * as Icon from 'react-bootstrap-icons';
import { getBalanceCounts } from "../counter/balanceCount.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState('');
  const [allocationType, setAllocationType] = useState('');
  let [particular, setParticular] = useState('');
  let [orNumber, setOrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [total, setTotal] = useState('');
  const [remark, setRemark] = useState('');
  let [studentNumber, setStudentNumber] = useState('');
  let [academicYear, setAcademicYear] = useState('');
  let [semester, setSemester] = useState('');
  const [otherParticular, setOtherParticular] = useState('');
  const [membershipFeePrice, setMembershipFeePrice] = useState(0);
  const [organizationShirtPrice, setOrganizationShirtPrice] = useState(0);
  const [transactionDate, setTransactionDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [readOnlyFields, setReadOnlyFields] = useState(false);
  const [isStudentNumberValid, setIsStudentNumberValid] = useState('');
  const [studentName, setStudentName] = useState('');
  const [validated, setValidated] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [count, setCounts] = useState({
    collection: 0,
    donation: 0,
    igp: 0,
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
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);


  
  const handleAlertClose = () => {
    toast.error('');
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
          setStudentName(response.data.name);
        }
        else {
          setStudentName(''); 
        }
      } catch (error) {
        console.error('Error validating student number:', error);
      }
    }
  };
  
  

  
    const fetchPrice = async () => {
      try {
        const response = await axios.get('http://localhost:8001/price/get');
        setMembershipFeePrice(response.data.membershipFee);
        setOrganizationShirtPrice(response.data.shirtPrice);
      } catch (error) {
        console.error('Error fetching membership fee price:', error);
      }
    };
  
    useEffect(() => {
      fetchPrice();
    }, []);
  
    const handleAllocationParticularChange = (newAllocationType, newParticular) => {
      
      if (newAllocationType === 'IGP'  && isNaN(particular)) {
        setParticular('');
        setAmount('');
        setStudentNumber('');
        setQuantity('');
        setStudentName('');
      }
      else if (newAllocationType === 'COLLECTION' && isNaN(particular)) {
        setParticular('');
        setAmount('');
        setStudentNumber('');
        setStudentName('');
        setQuantity('');
      }
      else if (newAllocationType === 'COLLECTION' && newParticular === 'MEMBERSHIP_FEE') {
        setAmount(membershipFeePrice.toFixed(2));
        setQuantity('1');
        setReadOnlyFields(true);
      }
      else if (newAllocationType === 'IGP' && newParticular === 'ORGANIZATION_SHIRT') {
        setAmount(organizationShirtPrice.toFixed(2));
        setQuantity('1');
        setReadOnlyFields(true);
      }
       else {
        setAmount('');
        setStudentNumber('');
        setStudentName('');
        setQuantity('');
        setReadOnlyFields(false);
      }
    };

  const toggleFields = () => {
    setParticular('');
    setOrNumber('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    clearForm();
  };

  const handleModalShow = () => setShowModal(true);

  const updateTotal = () => {
    const amountValue = parseFloat(amount) || 0;
    const quantityValue = parseFloat(quantity) || 0;
    const totalValue = amountValue * quantityValue;
    setTotal(totalValue.toFixed(2));
  };

  useEffect(() => {
    updateTotal();
  }, [amount, quantity]);

  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setQuantity(inputValue);
    }
  };

  const clearForm = () => {
    setTransactionType('');
    setAllocationType('');
    toggleFields();
    setAmount('');
    setQuantity('');
    setTotal('');
    setRemark('');
    setRemark('');
    setStudentNumber('');
    setStudentName('');
    setOtherParticular('');
    setImageFile('');
  };

  const isAuthenticated = session();
  console.log(isAuthenticated);

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setValidated(true);
    axios.defaults.withCredentials = true;

    try {
      if (transactionType === 'INFLOW' && allocationType === 'DONATION') {
        particular = allocationType+' RECEIVED'; 
        orNumber = 'N/A';
        studentNumber= 'N/A';
        academicYear = 'N/A';
        semester= 'N/A';
      }
      if (transactionType === 'INFLOW' && particular === 'OTHERS') {
        particular = allocationType+' RECEIVED'; 
        orNumber = 'N/A';
        academicYear = 'N/A';
        semester= 'N/A';
      }
      if (transactionType === 'INFLOW' && allocationType === 'COLLECTION' && particular === 'OTHERS') {
        particular = otherParticular; 
        orNumber = 'N/A';
        academicYear = 'N/A';
        semester= 'N/A';
      }
      if (transactionType === 'INFLOW' && allocationType === 'IGP' && particular === 'OTHERS' ) {
        particular = otherParticular; 
        orNumber = 'N/A';
        academicYear = 'N/A';
        semester= 'N/A';
      }
      if (transactionType === 'INFLOW' && allocationType === 'COLLECTION' && particular === 'MEMBERSHIP_FEE' && !isStudentNumberValid) {
        toast.error('Invalid student number');
        return;
      }
      if (transactionType === 'OUTFLOW'){
        studentNumber='N/A';
      }
      if (
        transactionType === 'INFLOW' &&
        (allocationType === 'COLLECTION' || allocationType === 'IGP') &&
        (particular === 'MEMBERSHIP_FEE' || particular === 'ORGANIZATION_SHIRT') &&
        isStudentNumberValid
      ) {
        // Check if the  student number, academic year, and semester already exists
        const response = await axios.post('http://localhost:8001/transaction/checkExistence', {
          studentNumber: studentNumber,
          academicYear: academicYear, 
          semester: semester,
          particular: particular
        });

        if (response.data.exists) {
          toast.error('Student has already paid for A.Y.'+academicYear+': '+semester);
          return;
        }
      }
      
      if (transactionType === 'INFLOW' && allocationType === 'IGP' && particular === 'ORGANIZATION_SHIRT'  && !isStudentNumberValid ) {
        toast.error('Invalid student number');
        return;
      }
      else if(transactionType === 'OUTFLOW'){
        studentNumber = 'N/A';
        academicYear = 'N/A';
        semester= 'N/A';
      }
      if(transactionType === 'OUTFLOW' && allocationType === 'IGP' && total > count.igp){
        toast.error('IGP balance is not enough.');
        return;
      }
      if(transactionType === 'OUTFLOW' && allocationType === 'DONATION' && total> count.donation){
        toast.error('Donation balance is not enough.');
        return;
      }
      if(transactionType === 'OUTFLOW' && allocationType === 'COLLECTION' && total> count.collection){
        toast.error('Collection balance is not enough.');
        return;
      }
      if (
        !transactionType ||
        !allocationType ||
        !particular ||
        (particular === 'MEMBERSHIP_FEE' && !isStudentNumberValid) ||
        (particular === 'ORGANIZATION_SHIRT' && !isStudentNumberValid) ||
        !amount ||
        !quantity ||
        !total ||
        !remark ||
        !transactionDate
      ) {
        setValidated(true);
        toast.error('Please fill up all required fields.');
        return;
      }
      
      else{
        const formData = new FormData();
        formData.append('file', imageFile); 
        formData.append('transactionDate', transactionDate);
        formData.append('transactionType', transactionType);
        formData.append('allocationType', allocationType);
        formData.append('amount', amount);
        formData.append('quantity', quantity);
        formData.append('total', total);
        formData.append('remark', remark);
        formData.append('particular', particular);
        formData.append('orNumber', orNumber);
        formData.append('studentNumber', studentNumber);
        formData.append('academicYear', academicYear);
        formData.append('semester', semester);
        formData.append('transactionStatus', 'OK');
        formData.append('auditorRemark', 'NONE');
        // formData.append('auditorRemark', 'PENDING');
        
        const response = await axios.post('http://localhost:8001/transaction/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json', 
          },
        });

      if (response.data === 'Success') {
        console.log('Success'+count.igp);
        handleModalShow();
        clearForm();
      } else {
        console.error('Unexpected response:', response.data);
        toast.error('Please fill up the form.');
      }
    }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error status:', error.response.status);
        toast.error('Error: ' + (error.response.data.message || 'Unknown error'));
      } 
      if (error.request) {
        console.error('No response received from the server');
        toast.error('No response received from the server');
      } else {
        console.error('Error setting up the request:', error.message);
        toast.error('Error setting up the request');
      }
    }
    
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 14); 
    const formattedDate = formatDate(minDate);
    console.log('Min Date:', formattedDate);
    return formattedDate;
  };
  
  const getMaxDate = () => {
    const today = new Date();
    const formattedDate = formatDate(today);
    console.log('Max Date:', formattedDate);
    return formattedDate;
  };
  

  return (
    <Container className="form-container mt-1 p-4 rounded-4 container-bg">
      <h4 className="d-flex justify-content-center mb-3">Transaction Form</h4>
      <Form>
        <ToastContainer/>

        <Form noValidate validated={validated} method="post" enctype="multipart/form-data">
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label><span className='text-danger fs-5'>*</span> Transaction Type:</Form.Label>
              <Form.Select
                value={transactionType}
                id="transactionType"
                name="transactionType"
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  toggleFields();
                }}
                required
              >
                <option value="" disabled>Select..</option>
                <option value="INFLOW">Inflow</option>
                <option value="OUTFLOW">Outflow</option>
              </Form.Select>
            </Col>
            <Col sm={6}>
            <Form.Label><span className='text-danger fs-5'>*</span> Allocation Type:</Form.Label>
              <Form.Select
                value={allocationType}
                onChange={(e) => {
                  setAllocationType(e.target.value);
                  handleAllocationParticularChange(e.target.value, particular);
                }}
                required
              >
                <option value="" disabled>Select..</option>
                <option value="COLLECTION">Collection</option>
                <option value="IGP">IGP</option>
                <option value="DONATION">Donation</option>
              </Form.Select>
            </Col>
          </Row>
            {/* Additional fields for Inflow and Collection */}
            {transactionType === 'INFLOW' && allocationType === 'COLLECTION' && (
            <Row className="mb-3">
              
              <Col sm={6}>
                <Form.Label><span className='text-danger fs-5'>*</span> Particulars:</Form.Label>
                <Form.Select
                  value={particular}
                  onInput={(e) => {
                    setParticular(e.target.value);
                    handleAllocationParticularChange(allocationType, e.target.value);
                  }}
                  required
                >
                  <option value="" disabled>Select..</option>
                  <option value="MEMBERSHIP_FEE">Membership Fee</option>
                  <option value="OTHERS">Others</option>
                  {/* Add other options as needed */}
                </Form.Select>
              </Col>
               {/* Additional fields based on selected particulars */}
               {particular === 'MEMBERSHIP_FEE' && (
                <Col sm={6}>
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
                  <Form.Control.Feedback type="valid" className='fw-bold text-bg-light text-success'>{studentName && `Name: ${studentName}`}</Form.Control.Feedback>
                </Col>
              )}
              {particular === 'OTHERS' && (
                <Col sm={6}>
                  <Form.Label><span className='text-danger fs-5'>*</span> Specify Particular:</Form.Label>
                  <Form.Control
                    type="text"
                    value={otherParticular}
                    onChange={(e) => setOtherParticular(e.target.value)}
                    required
                  />
                </Col>
              )}
            </Row>
          )}

          {/* Additional fields for Inflow and IGP */}
          {transactionType === 'INFLOW' && allocationType === 'IGP' && (
            <Row className="mb-3">
              <Col sm={6}>
                <Form.Label><span className='text-danger fs-5'>*</span> Particulars:</Form.Label>
                <Form.Select
                  value={particular}
                  onInput={(e) => {
                    setParticular(e.target.value);
                    handleAllocationParticularChange(allocationType, e.target.value);
                  }}
                  required
                >
                  <option value="" disabled>Select..</option>
                  <option value="ORGANIZATION_SHIRT">Organization Shirt</option>
                  <option value="OTHERS">Others</option>
                  {/* Add other options as needed */}
                </Form.Select>
              </Col>
              {/* Additional fields based on selected particulars */}
              {particular === 'ORGANIZATION_SHIRT' && (
                <Col sm={6}>
                  <Form.Label><span className='text-danger fs-5'>*</span> Student Number:</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentNumber}
                    pattern="^\d{9}$"
                    onInput={handleStudentNumberChange}
                    isInvalid={!isStudentNumberValid}
                    isValid={isStudentNumberValid}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Invalid student number</Form.Control.Feedback>
                  <Form.Control.Feedback type="valid">{studentName && `Name: ${studentName}`}</Form.Control.Feedback>
                </Col>
              )}
              {particular === 'OTHERS' && (
                <Col sm={6}>
                  <Form.Label><span className='text-danger fs-5'>*</span> Specify Particular:</Form.Label>
                  <Form.Control
                    type="text"
                    value={otherParticular}
                    onChange={(e) => setOtherParticular(e.target.value)}
                    required
                  />
                </Col>
              )}
            </Row>
          )}

          {transactionType === 'OUTFLOW' && (
            <>
              <Row className="mb-3">
                <Col sm={6}>
                  <Form.Label><span className='text-danger fs-5'>*</span> Particular:</Form.Label>
                  <Form.Select
                    value={particular}
                    onChange={(e) => setParticular(e.target.value)}
                    required
                  >
                     <option value="" disabled>Select..</option>
                      <option value="FOOD EXPENSE">Food Expense</option>
                      <option value="SUPPLIES EXPENSE">Supplies Expense</option>
                      <option value="TRANSPORTATION EXPENSE">Transportation Expense</option>
                      <option value="RENT EXPENSE">Rent Expense</option>
                      <option value="REPRESENTATION EXPENSE">Representation Expense</option>
                      <option value="MEDICAL EXPENSE">Medical Expense</option>
                      <option value="COMMUNICATION EXPENSE">Communication Expense</option>
                      <option value="MISCELLANEOUS EXPENSE">Miscellaneous Expense</option>
                      <option value="TOKEN EXPENSE">Token Expense</option>
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Label><span className='text-danger fs-5'>*</span> OR No.:</Form.Label>
                  <Form.Control
                    type="text"
                    id="orNumber"
                    value={orNumber}
                    onChange={(e) => setOrNumber(e.target.value)}
                    required
                  />
                </Col>
                <Col sm={12}>
                <Form.Label><span className='text-danger fs-5'>*</span> Expense Receipt:</Form.Label>
                <Form.Control
                  type="file"
                  id="imageFile"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  accept="image/*"
                  required
                />
              </Col>
              </Row>
            </>
          )}

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label><span className='text-danger fs-5'>*</span> Amount:</Form.Label>
              <Form.Control
                type="text"
                id="amount"
                value={amount}
                pattern="^\d+(\.\d{1,2})?$"
                required
                readOnly={readOnlyFields}
                onChange={handleAmountChange}
              />
            </Col>
            <Col sm={6}>
              <Form.Label><span className='text-danger fs-5'>*</span> Quantity:</Form.Label>
              <Form.Control
                type="text"
                id="quantity"
                value={quantity}
                pattern="^\d+$"
                readOnly={readOnlyFields}
                onChange={handleQuantityChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label><span className='text-danger fs-5'>*</span> Total:</Form.Label>
              <Form.Control type="text" id="total" value={total} readOnly />
            </Col>
            <Col sm={6}>
              <Form.Label className="mb-0"><span className='text-danger fs-5'>*</span> Date:</Form.Label>
              <Form.Control 
                type="date" 
                id="transactionDate" 
                value={transactionDate} 
                onChange={(e) => setTransactionDate(e.target.value)} 
                min={getMinDate()}  // Set minimum date
                max={getMaxDate()}  // Set maximum date
                required 
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Label><span className='text-danger fs-5'>*</span> Remark:</Form.Label>
              <Form.Control
                as="textarea"
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col sm={12} className="d-flex justify-content-end">
              <div>
                <Button className="mx-2" variant="secondary" onClick={clearForm}>
                  Clear
                </Button>
                <Button variant="success"  onClick={submitForm} type="submit"  className="button-bg">
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Form>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
           
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h3 className="d-flex justify-content-center" style={{ color: 'green' }}>
              Success <Icon.Check2Circle />
            </h3>
          <p className="d-flex justify-content-center">Transaction has been submitted successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransactionForm;
