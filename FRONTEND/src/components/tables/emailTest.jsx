import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import axios from 'axios';

import DataTable from 'react-data-table-component';
import { Form, Button, Container, Row, Col, InputGroup, FormControl,  OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image,PDFViewer, BlobProvider, pdf } from '@react-pdf/renderer';  // Import PDFViewer
import pdfLogo from '../../assets/img/pdfLogo.png';
import * as Icon from 'react-bootstrap-icons';
import '../../assets/css/global.css';
import coverImage from '../../assets/img/cover.jpg';
import TransactionVersionModal from '../modals/transactionVersionModal';
import Balances from '../cards/balances.jsx';
import CurrentPrice from '../counter/currentPrice.jsx';
import VoidTransactions from './voidTransactions.jsx';
const EmailTest = () => {
    const [pdfBlob, setPdfBlob] = useState(null);
    useEffect(() => {
        if (pdfBlob) {
          // Now you can use pdfBlob
          console.log('PDF Blob is ready:', pdfBlob);
    
          // Example: You might want to trigger some action, such as sending the PDF, here
          // handleSendPdf();
        }
      }, [pdfBlob]);
    // Create styles
const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#f0faf4',
    },
    backgroundImageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      opacity: 0.1,  // 50% opacity
    },
    section: {
      margin: 10,
      flexGrow: 1,
      textAlign: 'center',
    },
    section3: {
      margin: 10,
      display: 'block',
      textAlign: 'right',
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      right: '10px',
      fontSize: '11px',
      fontStyle: 'italic',
      color: 'grey',
    },
    header: {
      fontSize: '13px',
      fontWeight: 'bold',
      marginTop: '13px',
      marginBottom: '15px',
    },
    subtitle: {
      fontSize: '13px',
      marginTop: '5px',
      paddingLeft: '35px',
      textAlign: 'left',
    },
  });
    const generateAndSetPdf = async () => {
      try {
        const MyDoc = (
      
          <Document>
            <Page size={{ width: 420, height: 298 }} style={styles.page}>
            <Image src={coverImage} style={styles.backgroundImageContainer} />
            <View style={styles.section}>
                <Image src={pdfLogo} style={{ width: '45px', height: '45px', margin: '15px 0 0 15px', padding: '0 0 0 0' }} />
                <Text style={{fontSize: '14px', fontWeight: 'bold' , marginTop: '-35px'}}>{'Builders of Innovative Technologist Society'}</Text>
                <Text style={styles.header}>{'INVOICE RECORD'}</Text>
                <Text style={styles.subtitle}>{'Transaction ID:     BITS2024-231C3D'}</Text>
                <Text style={styles.subtitle}>{'Date:                    2024-1-20'}</Text>
                <Text style={styles.subtitle}>{'Particular:             COLLECTION'}</Text>
                <Text style={styles.subtitle}>{'Amount:               PHP 200'}</Text>
                <Text style={styles.subtitle}>{'Quantity:               1'}</Text>
                <Text style={styles.subtitle}>{'Total:                    PHP 200'}</Text>
                <Text style={styles.subtitle}>{'Remark:               NONE'}</Text>
              </View>
              <View style={styles.section3}>
            <Text>{'Generated from BITS Financial Management System'}</Text>
          </View>
            </Page>
          </Document>
       
     );

    //  const blobPdf = await pdf(MyDoc);
    //  blobPdf.updateContainer(MyDoc);
     const result = await pdf(MyDoc).toBlob();
     setPdfBlob(result);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSendPdf = async () => {
    try {
      if (!pdfBlob) {
        console.error('PDF Blob is missing.');
        return;
      }
  
      // Log the content and type of the PDF blob
      console.log('PDF Blob Content:', pdfBlob);
      console.log('PDF Blob Type:', pdfBlob.type);
  
      // Create a FormData object and append the PDF blob
      const formData = new FormData();
      formData.append('pdfFile', pdfBlob, 'invoice.pdf');
  
      // Make a POST request using axios
      const response = await axios.post('http://localhost:8001/transaction/send-pdf-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('PDF sent successfully!', response.data);
    } catch (error) {
      console.error('Error sending PDF:', error);
    }
  };
  

  return (
    <div>
       <PDFViewer>
          <Document
            // Set a valid docBaseUrl to resolve relative URLs
            // Replace 'http://localhost:8000/' with the actual base URL of your application
            docBaseUrl="http://localhost:8001/"
          >
        <Page size={{ width: 420, height: 298 }} style={styles.page}>
        <Image src={coverImage} style={styles.backgroundImageContainer} />
          <View style={styles.section}>
          <Image style={{width: '45px', height: '45px', margin: '15px 0 0 15px', padding: '0 0 0 0'}} src={pdfLogo}></Image>
          <Text style={{fontSize: '14px', fontWeight: 'bold' , marginTop: '-35px'}}>Builders of Innovative Technologist Society</Text>
          <Text style={styles.header}>{'INVOICE RECORD'}</Text>
          <Text style={styles.subtitle}>{'Transaction ID:     BITS2024-231C3D'}</Text>
          <Text style={styles.subtitle}>{'Date:                    2024-1-20'}</Text>
          <Text style={styles.subtitle}>{'Particular:             COLLECTION'}</Text>
          <Text style={styles.subtitle}>{'Amount:               PHP 200'}</Text>
          <Text style={styles.subtitle}>{'Quantity:               1'}</Text>
          <Text style={styles.subtitle}>{'Total:                    PHP 200'}</Text>
          <Text style={styles.subtitle}>{'Remark:               NONE'}</Text>
        </View>
        <View style={styles.section3}>
          <Text>{'Generated from BITS Financial Management System'}</Text>
        </View>
    </Page>
      </Document>
      </PDFViewer>
      
      <Button variant="primary" onClick={generateAndSetPdf}>
        Generate PDF
      </Button>
      <Button variant="success" onClick={handleSendPdf} disabled={!pdfBlob}>
        Send PDF
      </Button>
    </div>
  );
};

export default EmailTest;
