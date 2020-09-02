import React, {Component} from 'react';
import Topbar from "../Header/Topbar";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import * as adminActions from "../../../../Actions/admin.action";
import {withAlert} from "react-alert";

// const admin = JSON.parse(localStorage.getItem('user'));


const API_URL_ADMIN = "/api/admin";

class TablePosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            data: [],
            perPage: 5,
            currentPage: 0,
            totalItemsCount: 0,
            postData: [],
            textSearch: "",
            dataTable_length: 5,
            stateShow: false
        };
    }

    isChangeSearch = (e) => {
        const arr = [];
        this.state.data.forEach(user => {
            const fullName = user.lastName + " " + user.firstName;
            console.log(e.target.value.length)
            if ((user.email.toLowerCase().trim().indexOf(e.target.value.toLowerCase().trim()) !== -1
                || this.toSlug(fullName).toLowerCase().trim().indexOf(e.target.value.toLowerCase().trim()) !== -1)
                && e.target.value.length !== 0) {
                arr.push(user)
            }
        });
        if (arr.length === 0) {
            const array = this.state.data.slice(this.state.offset, this.state.offset + this.state.perPage);
            this.setState({postData: array})
        } else {
            this.setState({postData: arr})
        }

    };
    isChange = (e) => {
        const array = this.state.data.slice(this.state.offset, this.state.offset + e.target.value);
        this.setState({
            postData: array,
            stateShow: true
        })
    };
    toSlug = (str) => {
        // Chuyển hết sang chữ thường
        str = str.toLowerCase();

        // xóa dấu
        str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
        str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
        str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
        str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
        str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
        str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
        str = str.replace(/(đ)/g, 'd');

        // Xóa ký tự đặc biệt
        str = str.replace(/([^0-9a-z-\s])/g, '');

        return str;
    };
    receivedData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("jwt"));
            if (token) {
                const res = await axios.get(API_URL_ADMIN + "/showUsers", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const {data} = res;
                const slice = data.users.slice(this.state.offset, this.state.offset + this.state.perPage);
                this.setState({
                    data: data.users,
                    pageCount: Math.ceil(data.users.length / this.state.perPage),
                    postData: slice,
                    totalItemsCount: this.state.offset + slice.length
                })
            }
        } catch (err) {

        }

    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset,
            stateShow: false
        }, () => {
            this.receivedData()
        });

    };

    componentDidMount() {
        this.receivedData()
    }

    accountLock = (userId, permissions, isVerified) => {
        const admin = JSON.parse(localStorage.getItem('user'));
        const permissionsAdmin = admin.permissions;
        const arr = this.state.data;
        const user = arr.find(user => user._id === userId);
        if (permissionsAdmin === 2 && permissions === 3) {
            user.isVerified = !isVerified;
        } else if (permissionsAdmin === 1 && permissions === 2) {
            user.isVerified = !isVerified;
        } else if (permissionsAdmin === 1 && permissions === 3) {
            user.isVerified = !isVerified;
        }
        (async () => {
            try {
                const res = await adminActions.userAccountLock(userId, permissions, !isVerified);
                const {data} = res;
                this.props.alert.success(data.message)
            } catch (error) {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.props.alert.error(resMessage)
            }

        })();
        this.setState({data: arr})

    };
    isChangePermissions = (userId, permissions) => {
        const admin = JSON.parse(localStorage.getItem('user'));
        const permissionsAdmin = admin.permissions;
        const arr = this.state.data;
        const user = arr.find(user => user._id === userId);

        if (permissionsAdmin === 1 && permissions === 2) {
            user.permissions = 3;
        } else if (permissionsAdmin === 1 && permissions === 3) {
            user.permissions = 2;
        }
        (async () => {
            try {
                const res = await adminActions.changePermissions(userId, permissions);
                const {data} = res;
                this.props.alert.success(data.message)
            } catch (error) {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.props.alert.error(resMessage)
            }

        })();
        this.setState({data: arr})
    };

    onClickRemoveUser = (userId, permissions) => {
        const admin = JSON.parse(localStorage.getItem('user'));
        const permissionsAdmin = admin.permissions;

        if (permissionsAdmin === 2 && permissions === 3) {
            const arr = this.state.postData.filter(user => user._id !== userId);
            this.setState({postData: arr})
        } else if (permissionsAdmin === 1 && permissions === 2) {
            const arr = this.state.postData.filter(user => user._id !== userId);
            this.setState({postData: arr})
        } else if (permissionsAdmin === 1 && permissions === 3) {
            const arr = this.state.postData.filter(user => user._id !== userId);
            this.setState({postData: arr})
        }
        (async () => {
            try {
                const res = await adminActions.removeUser(userId, permissions);
                const {data} = res;
                this.props.alert.success(data.message)
            } catch (error) {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.props.alert.error(resMessage)
            }

        })();

    };
    sort = (field, typeSort) => {
        const arr = this.state.data.slice(this.state.offset, this.state.offset + this.state.perPage);
        if (typeSort === "DESC" && field === "email") {
            arr.sort((a, b) => a.email.toLowerCase() !== b.email.toLowerCase()
                ? a.email.toLowerCase() > b.email.toLowerCase() ? -1 : 1 : 0
            );
            this.setState({postData: arr})
        } else if (typeSort === "ASC" && field === "email") {
            arr.sort((a, b) =>
                a.email.toLowerCase() !== b.email.toLowerCase()
                    ? a.email.toLowerCase() < b.email.toLowerCase() ? -1 : 1 : 0
            );
            this.setState({postData: arr})
        } else if (typeSort === "DESC" && field === "firstName") {
            arr.sort((a, b) => a.firstName.toLowerCase() !== b.firstName.toLowerCase()
                ? a.firstName.toLowerCase() > b.firstName.toLowerCase() ? -1 : 1 : 0
            );
            this.setState({postData: arr})
        } else if (typeSort === "ASC" && field === "firstName") {
            arr.sort((a, b) =>
                a.firstName.toLowerCase() !== b.firstName.toLowerCase()
                    ? a.firstName.toLowerCase() < b.firstName.toLowerCase() ? -1 : 1 : 0
            );
            this.setState({postData: arr})
        } else if (typeSort === "male" && field === "sex") {
            const array = arr.filter((user) => user.sex === true);
            this.setState({postData: array})
        } else if (typeSort === "female" && field === "sex") {
            const array = arr.filter((user) => user.sex === false);
            this.setState({postData: array})
        } else if (typeSort === "DESC" && field === "age") {
            arr.sort((a, b) => {
                const ageA = parseInt((new Date()).getFullYear()) - parseInt((new Date(a.birthday)).getFullYear());
                const ageB = parseInt((new Date()).getFullYear()) - parseInt((new Date(b.birthday)).getFullYear());
                return ageB - ageA;
            });
            this.setState({postData: arr})
        } else if (typeSort === "ASC" && field === "age") {
            arr.sort((a, b) => {
                const ageA = parseInt((new Date()).getFullYear()) - parseInt((new Date(a.birthday)).getFullYear());
                const ageB = parseInt((new Date()).getFullYear()) - parseInt((new Date(b.birthday)).getFullYear());
                return ageA - ageB;
            });
            this.setState({postData: arr})
        } else if (typeSort === "no" && field === "isVerified") {
            const array = arr.filter((user) => user.isVerified === false);
            this.setState({postData: array})
        } else if (typeSort === "yes" && field === "isVerified") {
            const array = arr.filter((user) => user.isVerified === true);
            this.setState({postData: array})
        } else if (typeSort === "admin" && field === "permissions") {
            const array = arr.filter((user) => user.permissions === 1);
            this.setState({postData: array})
        } else if (typeSort === "moderator" && field === "permissions") {
            const array = arr.filter((user) => user.permissions === 2);
            this.setState({postData: array})
        } else if (typeSort === "normal-user" && field === "permissions") {
            const array = arr.filter((user) => user.permissions === 3);
            this.setState({postData: array})
        }
    };

    render() {

        return (
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Topbar/>
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Users Table</h1>
                        <p className="mb-4">
                            DataTables Users is the place to display user information with functions of deletion,
                            authorization, and account lock.
                        </p>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">DataTables Users</h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="dataTables_length" id="dataTable_length">
                                                <label>Show
                                                    <select name="dataTable_length"
                                                            aria-controls="dataTable"
                                                            className="custom-select custom-select-sm form-control form-control-sm"
                                                            onChange={this.isChange}
                                                    >
                                                        <option value="5">5</option>
                                                        <option value="10">10</option>
                                                        <option value="25">25</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                    </select> entries</label></div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div id="dataTable_filter" className="dataTables_filter">
                                                <div id="form-search">
                                                    <input type="search" placeholder="Search"
                                                           onChange={this.isChangeSearch}
                                                           name="textSearch"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <table
                                        className="table table-bordered"
                                        id="dataTable"
                                        width="100%"
                                        cellSpacing={0}
                                    >
                                        <thead>
                                        <tr>
                                            <th>STT
                                            </th>
                                            <th>Email
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-up"
                                                           onClick={() => this.sort("email", "ASC")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-down-alt"
                                                           onClick={() => this.sort("email", "DESC")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>FullName
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-up"
                                                           onClick={() => this.sort("firstName", "ASC")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-down-alt"
                                                           onClick={() => this.sort("firstName", "DESC")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>Gender
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-male"
                                                           onClick={() => this.sort("sex", "male")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-female"
                                                           onClick={() => this.sort("sex", "female")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>Age
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-up"
                                                           onClick={() => this.sort("age", "ASC")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-down-alt"
                                                           onClick={() => this.sort("age", "DESC")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>Verified
                                                <div className="dropdown">
                                                    <button className="btn btn-outline-primary dropdown-toggle"
                                                            type="button"
                                                            id="dropdownMenuButton" data-toggle="dropdown"
                                                            aria-haspopup="true" aria-expanded="false">
                                                        Sort
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <a className="dropdown-item" href="#"
                                                           onClick={() => this.sort("isVerified", "no")}
                                                        >No
                                                        </a>
                                                        <a className="dropdown-item" href="#"
                                                           onClick={() => this.sort("isVerified", "yes")}
                                                        >Yes
                                                        </a>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>Permissions
                                                <div className="dropdown">
                                                    <button className="btn btn-outline-primary dropdown-toggle"
                                                            type="button"
                                                            id="dropdownMenuButton" data-toggle="dropdown"
                                                            aria-haspopup="true" aria-expanded="false">
                                                        Sort
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <a className="dropdown-item" href="#"
                                                           onClick={() => this.sort("permissions", "admin")}
                                                        >Admin
                                                        </a>
                                                        <a className="dropdown-item" href="#"
                                                           onClick={() => this.sort("permissions", "moderator")}
                                                        >Moderator
                                                        </a>
                                                        <a className="dropdown-item" href="#"
                                                           onClick={() => this.sort("permissions", "normal-user")}
                                                        >Normal User
                                                        </a>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {
                                            this.state.postData.map((user, i) => (
                                                <tr key={i}>
                                                    <td>{this.state.stateShow ? i + 1 : this.state.totalItemsCount - this.state.postData.length + i + 1}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.lastName} {user.firstName}</td>
                                                    <td>{user.sex ? "Male" : "Female"}</td>
                                                    <td>{parseInt((new Date()).getFullYear()) - parseInt((new Date(user.birthday)).getFullYear())}</td>
                                                    <td id="verified" className="center">
                                            <span
                                                style={user.isVerified ? {backgroundColor: "#dc3545"} : {backgroundColor: "#6c757d"}}
                                                onClick={() => this.accountLock(user._id, user.permissions, user.isVerified)}
                                            >
                                            {user.isVerified ? "Yes" : "No"}
                                            </span>
                                                    </td>
                                                    <td id="permissions" className="center">
                                            <span
                                                onClick={() => this.isChangePermissions(user._id, user.permissions)}
                                                style={user.permissions === 2 ? {backgroundColor: "#ffc107"} : user.permissions === 3 ? {backgroundColor: "#28a745"} : {backgroundColor: "#dc3545"}}
                                            >
                                            {user.permissions === 2 ? "Moderator" : user.permissions === 3 ? "Normal User" : "Admin"}
                                            </span>
                                                    </td>
                                                    <td className="center">
                                                        <a href="#remove-user"
                                                        >
                                                            <i className="fas fa-trash-alt"
                                                               onClick={() => this.onClickRemoveUser(user._id, user.permissions)}
                                                            />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            Showing {this.state.offset + 1} to {this.state.totalItemsCount} of {this.state.data.length} entries
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <ReactPaginate
                                                previousLabel={"prev"}
                                                nextLabel={"next"}
                                                breakLabel={"..."}
                                                breakClassName={"break-me"}
                                                pageCount={this.state.pageCount}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={1}
                                                onPageChange={this.handlePageClick}
                                                containerClassName={"pagination"}
                                                subContainerClassName={"pages pagination"}
                                                activeClassName={"active"}/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default withAlert()(TablePosts);
// export default compose(withAlert(), connect(mapStateToProps, mapDispatchToProps))(TableUsers)



