import React, {Component} from 'react';
import Autocomplete from "react-autocomplete"


const user = JSON.parse(localStorage.getItem('user'));

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            redirect: false
        }
    }

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


    getUsers = () => {
        const array = [];
        const users = JSON.parse(localStorage.getItem("users"));
        if (users && user) {
            array.push({
                name: user.lastName + " " + user.firstName,
                email: user.email
            });
            users.forEach(user => {
                if (user.isVerified) {
                    array.push({
                        name: user.lastName + " " + user.firstName,
                        email: user.email
                    })
                }
                if(array.length === 5)  return array;
            });
        }

        return array
    };

    matchUsers = (state, value) => {

        return (
            this.toSlug(state.name.toLowerCase()).indexOf(this.toSlug(value.toLowerCase().trim())) !== -1 ||
            state.email.toLowerCase().indexOf(value.toLowerCase().trim()) !== -1
        )
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users"));
        users.push(user);
        users.forEach(user => {
            let name = user.lastName + " " + user.firstName;
            if (this.toSlug(name.toLowerCase()) === this.toSlug(this.state.value.toLowerCase().trim()) ||
                user.email.toLowerCase() === this.state.value.toLowerCase().trim()) {
                return this.setState({redirect: true, redirectId: user._id})
            }

        })
    };
    removeItem = () => {
        const item = document.getElementById("search-form").querySelectorAll(".item");
        for (let i = 0; i < 5; i++) {
            item[i].remove()
        }
    };

    render() {
        const {redirect, redirectId} = this.state;

        if (redirect) {
            return window.location.assign("/home/profile/" + redirectId);
        }
        return (
            <div>
                <form className="searchform"
                      id="search-form"
                      onSubmit={this.handleSubmit}
                >
                    <Autocomplete
                        value={this.state.value}
                        inputProps={{id: 'states-autocomplete', required: true, type: 'search'}}
                        wrapperStyle={{position: 'relative', display: 'inline-block'}}
                        items={this.getUsers()}
                        getItemValue={item => item.name}
                        shouldItemRender={(state, value) => this.matchUsers(state, value)}
                        onChange={(event, value) => this.setState({value})}
                        onSelect={value => this.setState({value})}
                        renderMenu={children => (
                            <div className="menu">
                                {children}
                            </div>
                        )}
                        renderItem={(item, isHighlighted) => (
                            <div
                                className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                                key={item.abbr}>
                                {item.name}
                            </div>
                        )}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
        );
    }
}

export default Search;
