import { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert, Image , Modal} from 'react-bootstrap';
import axios from 'axios';
import excelLayout from '../../assets/img/excel_format.png';
import '../../assets/css/global.css';

const MasterlistForm = () => {
  const [file, setFile] = useState(null);
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [years, setYears] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('academicYear', academicYear);
      formData.append('semester', semester);

      const response = await axios.post('http://localhost:8001/masterlist/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        if (response.data) {
          setUploadMessage(response.data);
        }
      } else {
        setUploadMessage('File upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Error uploading file. Please try again.');
    }
  };

  useEffect(() => {
    // Dynamically generate academic years starting from the last part of the current year
    const currentYear = new Date().getFullYear();
    const generatedYears = Array.from({ length: 2 }, (_, index) => `${currentYear - 1 + index}-${currentYear + index}`);
    setYears(generatedYears);
    setAcademicYear(generatedYears[0]); // Set the current academic year as the default
  }, []);
  

  const semesters = ["First Semester", "Second Semester"]; // Adjust as needed
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container>
          <Card className='rounded-4'>
            <Card.Body  className='container-bg2 rounded-4'>
              <Card.Title className='d-flex justify-content-center'><h4>Masterlist Upload Form</h4></Card.Title>
              {uploadMessage && <Alert variant="info" className="mt-3">{uploadMessage}</Alert>}

              <Form>
                <Form.Group className="pt-1">
                  <Form.Label><span className='text-danger fs-5'>*</span>Excel File:</Form.Label>
                  <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} />
                </Form.Group>
                <Form.Group className="pt-3">
                  <Form.Label><span className='text-danger fs-5'>*</span>Academic Year:</Form.Label>
                  <Form.Control as="select" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="pt-3">
                  <Form.Label><span className='text-danger fs-5'>*</span>Semester:</Form.Label>
                  <Form.Control as="select" value={semester} onChange={(e) => setSemester(e.target.value)}>
                    <option value="" disabled>Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="py-3 d-flex justify-content-end">
                  <Button variant="secondary" className=' button-bg' onClick={handleUpload}>
                    Upload File
                  </Button>
                </Form.Group>
              </Form>
        
           <Alert variant="dark" className="image-container py-2 mt-2" onClick={handleToggleModal}>
            Note: Please follow the Excel layout of the masterlist as shown in the image below.
            <Image className="pt-2"  src={excelLayout} alt="Masterlist Layout" fluid/>
            <Modal show={showModal} onHide={handleToggleModal} centered size="lg">
              <Modal.Body className="p-0">
                <img src={excelLayout} alt="Masterlist Layout" className="modal-image" />
              </Modal.Body>
            </Modal>
         </Alert>
            </Card.Body>
            
          </Card>
          
    </Container>
  );
};

export default MasterlistForm;
