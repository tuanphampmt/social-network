import React, {Component} from 'react';
import Topbar from "../Header/Topbar";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import * as adminActions from "../../../../Actions/admin.action";
import {withAlert} from "react-alert";

const API_URL_ADMIN = "/api/admin";
const users_admin = JSON.parse(localStorage.getItem("users-admin"));

class TablePosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            data: [],
            perPage: 5,
            currentPage: 0,
            totalItemsCount: 0,
            postsData: [],
            textSearch: "",
            dataTable_length: 5,
            stateShow: false,
        };
    }

    isChangeSearch = (e) => {
        const arr = [];
        pushFullName(this.state.data).forEach(item => {
            const fullName = item.lastName + " " + item.firstName;
            if ((this.toSlug(fullName).toLowerCase().trim().indexOf(e.target.value.toLowerCase().trim()) !== -1)
                && e.target.value.length !== 0) {
                arr.push(item)
            }
        });
        if (arr.length === 0) {
            const array = this.state.data.slice(this.state.offset, this.state.offset + this.state.perPage);
            this.setState({postsData: array})
        } else {
            this.setState({postsData: arr})
        }

    };
    isChange = (e) => {
        const array = this.state.data.slice(this.state.offset, this.state.offset + parseInt(e.target.value));
        this.setState({
            postsData: array,
            stateShow: true,
            totalItemsCount: this.state.offset + array.length
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
                const res = await axios.get(API_URL_ADMIN + "/showPosts", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const {data} = res;
                const slice = data.posts.slice(this.state.offset, this.state.offset + this.state.perPage);

                this.setState({
                    data: data.posts,
                    pageCount: Math.ceil(data.posts.length / this.state.perPage),
                    postsData: slice,
                    totalItemsCount: this.state.offset + slice.length
                })
            }
        } catch (err) {

        }

    };
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


    onClickRemovePost = (postId, userId) => {
        const admin = JSON.parse(localStorage.getItem('user'));
        const user = users_admin.find(u => u._id === userId);

        if (admin.permissions === 1 && user.permissions === 1) console.log("Không được xoá.");
        else if (admin.permissions === 2
            && (user.permissions === 1 || (user.permissions === 2 && user._id.toString() !== admin._id.toString()))) console.log("Không được xoá.");
        else {
            const array = this.state.postsData.filter(post => post.postId !== postId);
            this.setState({postsData: array});
        }


        (async () => {
            try {
                const res = await adminActions.removePost(postId, userId);
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

        if (typeSort === "DESC" && field === "firstName") {
            let arrSort = pushFullName(arr).sort((a, b) => a.firstName.toLowerCase() !== b.firstName.toLowerCase()
                ? a.firstName.toLowerCase() > b.firstName.toLowerCase() ? -1 : 1 : 0
            );
            this.setState({postsData: arrSort})

        } else if (typeSort === "ASC" && field === "firstName") {
            let arrSort = pushFullName(arr).sort((a, b) =>
                a.firstName.toLowerCase() !== b.firstName.toLowerCase()
                    ? a.firstName.toLowerCase() < b.firstName.toLowerCase() ? -1 : 1 : 0
            );
            this.setState({postsData: arrSort})
        } else if (typeSort === "DESC" && field === "like") {
            arr.sort((a, b) => b.like - a.like);
            this.setState({postsData: arr})
        } else if (typeSort === "ASC" && field === "like") {
            arr.sort((a, b) => a.like - b.like);
            this.setState({postsData: arr})
        } else if (typeSort === "DESC" && field === "dislike") {
            arr.sort((a, b) => b.dislike - a.dislike);
            this.setState({postsData: arr})
        } else if (typeSort === "ASC" && field === "dislike") {
            arr.sort((a, b) => a.dislike - b.dislike);
            this.setState({postsData: arr})
        } else if (typeSort === "DESC" && field === "createdAt") {
            arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            this.setState({postsData: arr})
        } else if (typeSort === "ASC" && field === "createdAt") {
            arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            this.setState({postsData: arr})
        }
    };
    displayFullName = (userId) => {
        const user = {};
        users_admin.forEach(u => {
            if (u._id === userId) {
                user.lastName = u.lastName;
                user.firstName = u.firstName;
                return user;
            }
        });
        return user;
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
                                            <th>Article owner
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
                                            <th>Quotes of article</th>
                                            <th>Photo of article</th>
                                            <th>Like
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-up"
                                                           onClick={() => this.sort("like", "ASC")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-down-alt"
                                                           onClick={() => this.sort("like", "DESC")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>Dislike
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-up"
                                                           onClick={() => this.sort("dislike", "ASC")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-down-alt"
                                                           onClick={() => this.sort("dislike", "DESC")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>Date created
                                                <div className="sorting_asc">
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-up"
                                                           onClick={() => this.sort("createdAt", "ASC")}
                                                        />
                                                    </a>
                                                    <a href="#sort">
                                                        <i className="fas fa-sort-alpha-down-alt"
                                                           onClick={() => this.sort("createdAt", "DESC")}
                                                        />
                                                    </a>
                                                </div>
                                            </th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {
                                            this.state.postsData.map((post, i) => (
                                                <tr key={i}>
                                                    <td>{this.state.stateShow ? i + 1 : this.state.totalItemsCount - this.state.postsData.length + i + 1}</td>
                                                    <td>{this.displayFullName(post.userId).lastName} {this.displayFullName(post.userId).firstName}</td>
                                                    <td id="quotes-post">{post.quotes}</td>
                                                    <td id="img-post">{post.postImg ?
                                                        <img src={post.postImg} alt=" "/> : ""}</td>
                                                    <td>{post.like}</td>
                                                    <td>{post.dislike}</td>
                                                    <td>
                                                        {new Date(post.createdAt).getHours()}:{new Date(post.createdAt).getMinutes()}:{new Date(post.createdAt).getSeconds()}, {(new Date(post.createdAt)).getDate()}/{(new Date(post.createdAt)).getMonth() + 1}/{(new Date(post.createdAt)).getFullYear()}
                                                    </td>
                                                    <td className="center">
                                                        <a href="#remove-post"
                                                        >
                                                            <i className="fas fa-trash-alt"
                                                               onClick={() => this.onClickRemovePost(post.postId, post.userId)}
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

const pushFullName = (arr) => {
    let arrayPosts = [];
    arr.forEach(item => {
        const user = users_admin.find(u => u._id === item.userId);
        item = {...item, firstName: user.firstName, lastName: user.lastName};
        arrayPosts.push(item);
    });
    return arrayPosts
};
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default withAlert()(TablePosts);

// export default compose(withAlert(), connect(mapStateToProps, mapDispatchToProps))(TablePosts)



