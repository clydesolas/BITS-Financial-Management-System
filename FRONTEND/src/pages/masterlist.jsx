import React, { useState, useRef } from "react";
import { Header, Sidebar, MainGreetings } from "../components/Components.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/global.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import MasterlistForm from "../components/forms/masterlistForm.jsx";
import MasterlistTable from "../components/tables/masterlistTable.jsx";
function Masterlist() {
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
                        <Col sm={8}>
                        <MasterlistTable/>
                        </Col>
                        <Col sm={4}>
                        <MasterlistForm /> 
                        </Col>
                    </Row>
              
               
            </div>
            <Sidebar isSidebarVisible={isSidebarVisible} />
        </div>
    );
}

export default Masterlist;
