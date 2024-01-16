import React, { useState } from "react";
import { Header, Sidebar, MainGreetings } from "../components/Components.js";
import { Button, Form, Table, Modal, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/global.css";
import OfficerTable from "../components/tables/officerTable.jsx";
import OfficerAddModal from "../components/modals/officerAddModal.jsx";
function Officer() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    // Function of Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            <Header toggleSidebar={toggleSidebar} />
            <div
                className={`main-content${
                    isSidebarVisible ? " sidebar-open" : ""
                }`}
            >
                <MainGreetings />
                <Container className="p-4 container-bg2 rounded-4">
                    <h4 className="d-flex justify-content-center">
                        Officer List
                    </h4>
                    <div className="d-flex justify-content-end mx-3">
                        <OfficerAddModal />
                    </div>
                    <OfficerTable />
                </Container>
            </div>
            <Sidebar isSidebarVisible={isSidebarVisible} />
        </div>
    );
}

export default Officer;
