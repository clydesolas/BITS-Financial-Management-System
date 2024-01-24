// Userdashboard.jsx
import React, { useState } from "react";
import { Header, Sidebar, MainGreetings } from "../components/Components.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/global.css";
import TransactionForm from "../components/forms/transactionForm.jsx";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import TransactionTable from "../components/tables/transactionTable.jsx";
import Balances from "../components/cards/balances.jsx";
import PriceForm from "../components/forms/priceForm.jsx";
function Transaction() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    return (
        <div>
            <Header toggleSidebar={toggleSidebar} />
            <div
                className={`main-content${
                    isSidebarVisible ? " sidebar-open" : ""
                }`}
            >
                <MainGreetings />
               
               <Row>
               <Col md={8}>
               <Balances/>
                </Col>
                <Col md={4}>
                <PriceForm/>
                </Col>
               </Row>
                <div className="container-fluid ">
                    <Row>
                        <Col lg={8}>
                            <TransactionTable />
                        </Col>
                        <Col lg={4}>
                            <TransactionForm />
                        </Col>
                    </Row>
                </div>
              
            </div>
            <Sidebar isSidebarVisible={isSidebarVisible} />
        </div>
    );
}

export default Transaction;
