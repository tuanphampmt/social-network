import React, {Component} from 'react';
import Topbar from "./Header/Topbar";
import { Doughnut } from 'react-chartjs-2';
import Chart from "../Chart";

class Content extends Component {
    render() {
        return (
            <div id="content-wrapper" className="d-flex flex-column">
                {/* Main Content */}
                <div id="content">
                    <Topbar/>
                    {/* Begin Page Content */}
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                            <a
                                href="#"
                                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                            >
                                <i className="fas fa-download fa-sm text-white-50"/> Generate Report
                            </a>
                        </div>
                        {/* Content Row */}

                        {/*<Chart/>*/}

                    </div>
                    {/* /.container-fluid */}
                </div>
                {/* End of Main Content */}
                {/* Footer */}
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>Copyright © Your Website 2020</span>
                        </div>
                    </div>
                </footer>
                {/* End of Footer */}
            </div>
        );
    }
}

export default Content;
