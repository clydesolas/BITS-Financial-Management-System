// Userdashboard.jsx
import React, { useState, useEffect } from "react";
import {
    Header,
    Sidebar,
    MainGreetings,
} from "../components/Components.js";
import "bootstrap/dist/css/bootstrap.min.css";
import TotalCashflowChart from "../components/charts/totalCashflowChart.jsx";
import MonthlyCollectionChart from "../components/charts/monthlyCollectionChart.jsx";
import MonthlyDonationChart from "../components/charts/monthlyDonationChart.jsx";
import MonthlyIgpChart from "../components/charts/monthlyIgpChart.jsx";
import * as Icon from "react-bootstrap-icons";
import "../assets/css/global.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import LoginHistory from "../components/tables/loginHistory.jsx";
import OfficerCount from "../components/counter/officerCount.jsx";
import { getBalanceCounts } from "../components/counter/balanceCount.jsx";
import CurrentPrice2 from "../components/counter/currentPrice2.jsx";
import Balances from "../components/cards/balances.jsx";
import axios from 'axios';
import EmailTest from '../components/tables/emailTest.jsx';
import MembershipFeeChart from "../components/charts/membershipFeeChart.jsx";
import OrgShirtChart from "../components/charts/orgShirtChart.jsx";
import RecentTransactions from "../components/tables/recentTranction.jsx";

function Userdashboard() {
    const fetchData = async () => {
        try {
            axios.defaults.withCredentials = true;
            await axios.put('http://localhost:8001/masterlist/status');
            console.log("Masterlist status updated");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount


    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const [count, setCounts] = useState({
        collectionCount: 0,
        donationCount: 0,
        igpCount: 0,
    });
    useEffect(() => {
        const fetchData = async () => {
            const countsData = await getBalanceCounts();
            setCounts(countsData);
        };

        fetchData();
    }, []);

    return (
        <div>
            <Header toggleSidebar={toggleSidebar} />
            <div
                className={`main-content${
                    isSidebarVisible ? " sidebar-open" : ""
                }`}
            >
                <div>
                    <MainGreetings />
                    <div className="dashboard-card">
                        <div className="notice-card">
                            <h2 className="mb-4">Notice</h2>
                            <p>
                                Welcome to Builders Innovative Technologist
                                Society. Please take note that school records
                                are not directly connected to the website
                                records.
                            </p>
                            <p>
                                For questions, inquiries or bug reports
                                regarding the system please contact the BSIT 4D.
                            </p>
                        </div>
                        <div className="card-content">
                            <div className="card-details card1">
                                <h2 className="card-title">Officers</h2>
                                {/* Icon */}
                                <div className="card-counter">
                                    <div className="card-icon">
                                        <Icon.PeopleFill
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="count">
                                        <h3>
                                            <OfficerCount />
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="card-details card2">
                                <h2 className="card-title">Donation</h2>
                                {/* Icon */}
                                <div className="card-counter">
                                    <div className="card-icon">
                                        <Icon.EnvelopeFill
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="count">
                                        <h3>&#x20B1;{count.donationCount}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="card-details card3">
                                <h2 className="card-title">Collection</h2>
                                {/* Icon */}
                                <div className="card-counter">
                                    <div className="card-icon">
                                        <Icon.CurrencyExchange
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="count">
                                        <h3>
                                            &#x20B1;{count.collectionCount}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="card-details card4">
                                <h2 className="card-title">IGP</h2>
                                {/* Icon */}
                                <div className="card-counter">
                                    <div className="card-icon">
                                        <Icon.ShopWindow
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="count">
                                        <h3>&#x20B1;{count.igpCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                
                <Row className="my-3">
                    <Col sm={4}>
                        <div
                            className="rounded-2 border  p-1 shadow-sm"
                            style={{ height: "215px" }}
                        >
                         <MonthlyCollectionChart/>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div
                            className="rounded-2 border  p-1 shadow-sm"
                            style={{ height: "215px" }}
                        >
                            <MonthlyDonationChart />
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div
                            className="rounded-2 border  p-1 shadow-sm"
                            style={{ height: "215px" }}
                        >
                            <MonthlyIgpChart />
                        </div>
                    </Col>
                </Row>
                <Row className="my-3">
                  {/* <Col sm={8}>
                    <Balances/>
                    </Col> */}
                    <Col sm={2}>
                        <div className="pt-0 mb-4">
                        {/* <MembershipFeeChart/> */}
                            <CurrentPrice2 />
                        </div>
                    </Col>
                    <Col sm={5}>
                    <div className="rounded-2 border  p-1 shadow-sm">
                        <MembershipFeeChart/>
                        </div>
                    </Col>
                    <Col sm={5}>
                    <div className="rounded-2 border  p-1 shadow-sm">
                        <OrgShirtChart/>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <div className="rounded-2 border  p-1 shadow-sm">
                            <RecentTransactions />
                        </div>
                    </Col>   
                    <Col sm={5}>
                        <div className="rounded-2 border  p-1 shadow-sm">
                            <TotalCashflowChart />
                        </div>
                    </Col>
                    
                    <Col sm={2}>
                        <div className="rounded-2 border  p-1 shadow-sm">
                            <LoginHistory />
                        </div>
                    </Col>
                </Row>
               
            </div>
            <Sidebar isSidebarVisible={isSidebarVisible} />
        </div>
    );
}

export default Userdashboard;
