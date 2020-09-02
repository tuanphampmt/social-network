import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import * as postActions from "../../Actions/post.action";
import {connect} from "react-redux";
import upload from "../images/profile/upload.png"
import {ObjectID} from 'bson';

const user = JSON.parse(localStorage.getItem('user'));


class MainNotFixed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            quotes: "",
            userPosts: [],
            profileImage: null,
            comment: "",
            editedQuotes: "",
            editPostImg: "",
            commentId: "",
            editContent: "",
            isCommentEdit: true,
            isCommentClose: false,
            cm: "",
            location: -1
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            userPosts: nextProps.userPosts,
            profileImage: nextProps.profileImage
        })
    }

    componentDidMount() {
        this.props.getCurrentUserPosts();

    }


    isChangeUpLoad = async (e) => {

        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('upload_preset', 'tuanpham');
        const res = await fetch("https://api.cloudinary.com/v1_1/tuanpham/image/upload", {
            method: "POST",
            body: formData
        });
        const file = await res.json();
        const {url} = file;
        console.log(url)
        this.setState({
            file: url,
        })

    };
    isChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const x = 0;
        let arr = this.state.userPosts;
        const post = {
            like: 0,
            dislike: 0,
            liked: [],
            disliked: [],
            comments: [],
            postId: new ObjectID(),
            userId: user._id,
            quotes: this.state.quotes,
            postImg: this.state.file,
        };

        this.props.addPost(post.postId, this.state.file, this.state.quotes);
        arr.unshift({...post, firstName: user.firstName, lastName: user.lastName});
        this.setState({
            userPosts: arr,
            quotes: "",
            file: ""
        });
    };


    increase = (postId, likeRec, dislikeRec, thumbSupRec, thumbsDownRec) => {
        console.log(likeRec, dislikeRec, thumbSupRec, thumbsDownRec);
        const idName1 = likeRec;
        const idName2 = dislikeRec;
        const thumbSup = thumbSupRec;
        const thumbsDown = thumbsDownRec;

        const like = document.getElementById(idName1);
        this.props.like(postId, parseInt(like.innerHTML) + 1, "pull");
        like.innerHTML = parseInt(like.innerHTML) + 1;


        const up = document.getElementById(thumbSup);
        up.style.color = "#dc3545";
        up.style.pointerEvents = "none";
        const down = document.getElementById(thumbsDown);
        if (down.style.color == "rgb(220, 53, 69)") {
            const dislike = document.getElementById(idName2);
            console.log(parseInt(dislike.innerHTML))
            this.props.dislike(postId, parseInt(dislike.innerHTML) - 1, "notpull");
            dislike.innerHTML = parseInt(dislike.innerHTML) - 1;
        }
        down.style.color = "#000";
        down.style.pointerEvents = "all";
    };


    decrease = (postId, likeRec, dislikeRec, thumbSupRec, thumbsDownRec) => {
        const idName1 = likeRec;
        const idName2 = dislikeRec;
        const thumbSup = thumbSupRec;
        const thumbsDown = thumbsDownRec;

        const dislike = document.getElementById(idName2);
        this.props.dislike(postId, parseInt(dislike.innerHTML) + 1, "pull");
        dislike.innerHTML = parseInt(dislike.innerHTML) + 1;

        const down = document.getElementById(thumbsDown);
        down.style.color = "#dc3545";
        down.style.pointerEvents = "none";
        const up = document.getElementById(thumbSup);
        if (up.style.color == "rgb(220, 53, 69)") {
            const like = document.getElementById(idName1);
            console.log(parseInt(like.innerHTML))
            this.props.like(postId, parseInt(like.innerHTML) - 1, "notpull");
            like.innerHTML = parseInt(like.innerHTML) - 1;
        }
        up.style.color = "black";
        up.style.pointerEvents = "all";
    };

    enableModal() {
        let modal = document.getElementsByClassName('modal');
        modal[0].className = modal[0].className.replace(" deanimate", " animate");
        document.getElementsByClassName('modal')[0].style.display = 'block';
    }

    disableModal(n) {
        let modal = document.getElementsByClassName('modal');
        modal[n].className = modal[n].className.replace(" animate", " deanimate");
        setTimeout(function () {
            document.getElementsByClassName('modal')[n].style.display = 'none';
        }, 500);
    }

    handleSubmitComment = (e, postId) => {
        e.preventDefault();
        console.log(postId);
        const arr = this.state.userPosts;
        const post = arr.find(post => post.postId === postId);
        const comment = {
            commentId: new ObjectID(),
            content: this.state.comment,
            userId: user._id
        };
        post.comments.push(comment);

        console.log(post.comments);
        this.props.postComment(postId, comment.commentId, this.state.comment);
        this.setState({
            userPosts: arr
        });
        this.resetForm();
    };

    onClickRemovePost = (postID) => {
        this.props.removePost(postID);
        const rm = this.state.userPosts.filter(post => post.postId !== postID);
        console.log(rm)
        this.setState({
            userPosts: rm
        });

    };
    editSubmit = (postId) => {

        this.props.editPost(postId, this.state.file, this.state.editedQuotes);

        this.state.userPosts.map(post => {
            if (post.postId === postId) {
                post.quotes = this.state.editedQuotes;
                if (this.state.file) {
                    post.postImg = this.state.file;
                }
                return post;
            }
            return null;
        });
        this.setState({
            userPosts: this.state.userPosts,
            quotes: "",
            file: ""
        });
    };
    funcEditSetTimeout = (e, postId) => {
        e.preventDefault();
        let _this = this;
        setTimeout(() => {
            _this.editSubmit(postId);
        }, 1000);
    };
    getEditPostInfo = (quotes, postImg) => {
        this.setState({
            editedQuotes: quotes,
            editPostImg: postImg
        })
    };
    onClickRemoveComment = (postId, commentId) => {
        this.props.removeComment(postId, commentId);
        const arr = this.state.userPosts;
        const post = arr.find(post => post.postId === postId);
        post.comments = post.comments.filter(comment => comment.commentId !== commentId);

        this.setState({
            userPosts: arr
        })
    };

    getEditCommentInfo = (commentId, content, location) => {
        console.log(location)
        this.setState({
            commentId: commentId,
            editContent: content,
            isCommentClose: !this.state.isCommentClose,
            location: location
        })
    };

    handleEditComment = (e, postId, commentId) => {
        e.preventDefault();
        this.props.editComment(commentId, this.state.editContent);
        const arr = this.state.userPosts;
        const post = arr.find(post => post.postId === postId);
        post.comments.map(comment => {
            if (comment.commentId === commentId) {
                comment.content = this.state.editContent;
                return comment;
            }
        });

        this.setState({
            userPosts: arr,
            isCommentEdit: !this.state.isCommentEdit
        })

    };
    resetForm = () => {
        const formComment = document.getElementsByClassName("form-comment");
        for (let i = 0; i < formComment.length; i++) {
            formComment[i].reset();
        }
    };

    render() {
        let profileImage = this.props.profileImage;
        const users = JSON.parse(localStorage.getItem("users"));
        if (users) users.push(user);
        console.log(user.profileImage)
        return (
            <div className="mainnotfixed" id="mainnotfixed">
                <div
                    className="main mainpost"
                    style={{marginBottom: 20, paddingBottom: 10}}
                >
                    <form onSubmit={this.handleSubmit}>
                        <div className="userimg">
                            {profileImage ? <img src={profileImage} alt="profile"/> : user.profileImage ?
                                <img src={user.profileImage} alt="profile"/> : <img src={upload} alt="profile"/>}
                        </div>
                        <p className="quotes">
                          <textarea
                              id="mypara"
                              className="txtarea"
                              placeholder={user.firstName + " ơi, bạn đang nghỉ gì?"}
                              onChange={this.isChange}
                              value={this.state.quotes}
                              name="quotes"
                              required
                          />
                        </p>
                        {/* image load to post */}
                        {this.state.file ? (
                            <div className="post">
                                <img className="postimg" src={this.state.file} alt=" "/>
                            </div>
                        ) : ""}

                        <div className="postbar">
                            <input
                                type="file"
                                id="chooseimg"
                                name="file"
                                onChange={this.isChangeUpLoad}
                                onClick={e => (e.target.value = null)}
                            />
                            <button type="button" className="imgbttn" id="imgbttn">
                                📷 Images
                            </button>
                            <button
                                type="submit"
                                id="postmypost"
                                className="postmypost button gradient-button text-center"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>

                <div className="allpost">
                    {
                        this.state.userPosts.map((value, i) => (
                            <div className="mainpost" key={i}>
                                {user._id === value.userId ?
                                    <div>
                                        <a href="#remove"
                                           onClick={() => this.onClickRemovePost(value.postId)}
                                        >
                                            <i className="fas fa-trash-alt"/>
                                        </a>
                                        <a href="#edit"
                                           onClick={() => {
                                               this.enableModal();
                                               this.getEditPostInfo(value.quotes, value.postImg);
                                           }}
                                        >
                                            <i className="fas fa-edit"/>
                                        </a>
                                    </div>
                                    : ""
                                }

                                <div
                                    className="modal animate main mainpost"
                                    style={{marginBottom: 20, paddingBottom: 10}}
                                >
                                    <span className="close" title="Close Modal"
                                          onClick={() => this.disableModal(0)}>×</span>
                                    <form>
                                        <div className="userimg">
                                            {profileImage ?
                                                <img src={profileImage} alt="profile"/> : user.profileImage ?
                                                    <img src={user.profileImage} alt="profile"/> :
                                                    <img src={upload} alt="profile"/>}
                                        </div>
                                        <p className="quotes">
                                          <textarea
                                              id="mypara"
                                              className="txtarea"
                                              name="editedQuotes"
                                              placeholder={user.firstName + "ơi, bạn đang nghỉ gì?"}
                                              onChange={this.isChange}
                                              defaultValue={this.state.editedQuotes}
                                              required
                                          />
                                        </p>
                                        {/* image load to post */}
                                        <div className="post">
                                            <img id="load2" className="postimg" src=" "/>
                                        </div>
                                        <div className="postbar">
                                            <input
                                                type="file"
                                                id="chooseimg"
                                                name="file"
                                                onChange={this.isChangeUpLoad}

                                                onClick={e => (e.target.value = null)}
                                            />
                                            <button type="button" className="imgbttn" id="imgbttn">
                                                📷 Images
                                            </button>
                                            <button
                                                type="submit"
                                                id="postmypost"
                                                className="postmypost button gradient-button text-center"
                                                onClick={(e) => {
                                                    this.funcEditSetTimeout(e, value.postId);
                                                    this.disableModal(0);
                                                }}
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </form>
                                </div>


                                <div className="userimg">
                                    {value.userId === user._id && profileImage ?
                                        <img src={profileImage}
                                             alt="anh dai dien"/> : value.userId === user._id && user.profileImage ?
                                            <img src={user.profileImage} alt="anh dai dien"/> : value.profileImage ?
                                                <img src={value.profileImage} alt="anh dai dien"/> :
                                                <img src={upload} alt="anh dai dien"/>}
                                </div>
                                <div className="username">
                                    {" "}
                                    <p className="name">{value.lastName} {value.firstName}</p>
                                </div>
                                <p className="time">8min ago</p>
                                <p className="quotes">
                                    {value.quotes}
                                </p>
                                <div className="post">
                                    <img className="postimg" src={value.postImg}/>
                                </div>
                                <div className="likedislike">
                                    <p className="like">
                                        <span className="nooflike"
                                              id={"like" + parseInt(i + 1)}>{value.like}{" "}
                                        </span>{" "}likes &nbsp;{" "}
                                        <span className="noofdislike"
                                              id={"dislike" + parseInt(i + 1)}>{value.dislike}{" "}
                                         </span>{" "}dislikes
                                    </p>
                                    <p className="likedisbttn">
                                        {
                                            typeof value.liked !== "undefined" && typeof value.disliked !== "undefined" && value.liked.find(id => id === user._id) && !value.disliked.find(id => id === user._id) ? (
                                                <div>
                                                    <span
                                                        id={"thumbsup" + parseInt(i + 1)}
                                                        className="fa fa-thumbs-up"
                                                        style={{
                                                            color: "rgb(220, 53, 69)",
                                                            pointerEvents: "none"
                                                        }}
                                                        onClick={() => this.increase(value.postId, 'like' + parseInt(i + 1), 'dislike' + +parseInt(i + 1), 'thumbsup' + +parseInt(i + 1), 'thumbsdown' + +parseInt(i + 1))}
                                                    />
                                                    <span
                                                        id={"thumbsdown" + parseInt(i + 1)}
                                                        className="fa fa-thumbs-down"
                                                        onClick={() => this.decrease(value.postId, 'like' + parseInt(i + 1), 'dislike' + +parseInt(i + 1), 'thumbsup' + +parseInt(i + 1), 'thumbsdown' + +parseInt(i + 1))}
                                                    />
                                                </div>
                                            ) : typeof value.liked !== "undefined" && typeof value.disliked !== "undefined" && !value.liked.find(id => id === user._id) && value.disliked.find(id => id === user._id) ? (
                                                <div>
                                                    <span
                                                        id={"thumbsup" + parseInt(i + 1)}
                                                        className="fa fa-thumbs-up"
                                                        onClick={() => this.increase(value.postId, 'like' + parseInt(i + 1), 'dislike' + +parseInt(i + 1), 'thumbsup' + +parseInt(i + 1), 'thumbsdown' + +parseInt(i + 1))}
                                                    />
                                                    <span
                                                        id={"thumbsdown" + parseInt(i + 1)}
                                                        className="fa fa-thumbs-down"
                                                        style={{
                                                            color: "rgb(220, 53, 69)",
                                                            pointerEvents: "none"
                                                        }}
                                                        onClick={() => this.decrease(value.postId, 'like' + parseInt(i + 1), 'dislike' + +parseInt(i + 1), 'thumbsup' + +parseInt(i + 1), 'thumbsdown' + +parseInt(i + 1))}
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <span
                                                        id={"thumbsup" + parseInt(i + 1)}
                                                        className="fa fa-thumbs-up"
                                                        onClick={() => this.increase(value.postId, 'like' + parseInt(i + 1), 'dislike' + +parseInt(i + 1), 'thumbsup' + +parseInt(i + 1), 'thumbsdown' + +parseInt(i + 1))}
                                                    />
                                                    <span
                                                        id={"thumbsdown" + parseInt(i + 1)}
                                                        className="fa fa-thumbs-down"
                                                        onClick={() => this.decrease(value.postId, 'like' + parseInt(i + 1), 'dislike' + +parseInt(i + 1), 'thumbsup' + +parseInt(i + 1), 'thumbsdown' + +parseInt(i + 1))}
                                                    />
                                                </div>
                                            )
                                        }

                                    </p>
                                </div>
                                <div className="commentContainer">
                                    <div className={value.comments.length !== 0 ? "comment-content" : ""}>
                                        {
                                            value.comments.map((m, i) => {
                                                let u;
                                                if (users) {
                                                    u = users.find(user => user._id === m.userId);
                                                }

                                                if (u) return (
                                                    <div className="cm" key={i}
                                                         style={this.state.isCommentEdit ? {marginBottom: "15px"} : {marginBottom: "0"}}>
                                                        <p>
                                                            <Link to={"/home/profile/" + m.userId}
                                                            >{u.lastName} {u.firstName}:
                                                            </Link>{" "}
                                                            <span>
                                                                    {this.state.editContent && this.state.commentId === m.commentId ? this.state.editContent : m.content}
                                                                {user._id === m.userId ? (
                                                                    <div>
                                                                        <a href="#remove" className="remove-comment"
                                                                           onClick={() => this.onClickRemoveComment(value.postId, m.commentId)}
                                                                        >
                                                                            <i className="fas fa-trash-alt"/>
                                                                        </a>
                                                                        {/*{*/}
                                                                        {/*    !this.state.isCommentClose && this.state.isCommentEdit && user._id === m.userId  ? (*/}

                                                                        {/*        <a href="#edit"*/}
                                                                        {/*           className="edit-comment"*/}
                                                                        {/*           onClick={() => {*/}
                                                                        {/*               this.getEditCommentInfo(m.commentId, m.content, i);*/}
                                                                        {/*           }}*/}
                                                                        {/*        >*/}
                                                                        {/*            <i className="fas fa-edit"/>*/}
                                                                        {/*        </a>*/}
                                                                        {/*    ) : ""*/}
                                                                        {/*}*/}
                                                                    </div>
                                                                ) : ""
                                                                }
                                                                {/*{*/}
                                                                {/*    this.state.isCommentEdit && (*/}
                                                                {/*        <a href="#close" className="close-comment"*/}
                                                                {/*           onClick={() => this.setState({isCommentEdit: !this.state.isCommentEdit})}*/}
                                                                {/*        >*/}
                                                                {/*            <i className="fas fa-times"/>*/}
                                                                {/*        </a>*/}
                                                                {/*    )*/}
                                                                {/*}*/}

                                                                {
                                                                    this.state.isCommentClose && this.state.commentId === m.commentId ? (
                                                                        <a href="#close" className="close-comment"
                                                                           onClick={() => this.setState({
                                                                               isCommentClose: !this.state.isCommentClose
                                                                           })}
                                                                        >
                                                                            <i className="fas fa-times"/>
                                                                        </a>
                                                                    ) : user._id === m.userId ? (
                                                                        <a href="#edit"
                                                                           className="edit-comment"
                                                                           onClick={() => {
                                                                               this.getEditCommentInfo(m.commentId, m.content, i);
                                                                           }}
                                                                        >
                                                                            <i className="fas fa-edit"/>
                                                                        </a>
                                                                    ) : ""
                                                                }
                                                            </span>
                                                        </p>
                                                        {
                                                            this.state.isCommentClose && this.state.commentId === m.commentId ? (
                                                                <div className="edit-comment-form">
                                                                    <form
                                                                        onSubmit={(e) => this.handleEditComment(e, value.postId, m.commentId)}>
                                                                        <input type="text"
                                                                               value={this.state.editContent}
                                                                               name="editContent"
                                                                               placeholder="Edit comment..."
                                                                               required
                                                                               onChange={this.isChange}
                                                                        />
                                                                        <button type="submit"
                                                                                className="button-submit-comment">
                                                                            Edit
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            ) : ""
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>

                                    <form onSubmit={(e) => this.handleSubmitComment(e, value.postId)}
                                          className="form-comment">
                                        <input type="text"
                                            // value={this.state.comment}
                                               name="comment"
                                               placeholder="Comment..."
                                               required
                                               onChange={this.isChange}
                                        />
                                        <button type="submit" className="button-submit-comment"
                                        >
                                            Comment
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <button type="button" id="viewmore" className="viewmore">
                    View More
                </button>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    userPosts: state.postReducer
});
const mapDispatchToProps = dispatch => ({
    getCurrentUserPosts: () => dispatch(postActions.getCurrentUserPosts()),
    like: (postId, like, isCheckPull) => dispatch(postActions.like(postId, like, isCheckPull)),
    dislike: (postId, dislike, isCheckPull) => dispatch(postActions.dislike(postId, dislike, isCheckPull)),
    addPost: (postId, url, quotes) => dispatch(postActions.addPost(postId, url, quotes)),
    postComment: (postId, commentId, content) => dispatch(postActions.postComment(postId, commentId, content)),
    removePost: (postID) => dispatch(postActions.removePost(postID)),
    editPost: (postId, url, quotes) => dispatch(postActions.editPost(postId, url, quotes)),
    removeComment: (postId, commentId) => dispatch(postActions.removeComment(postId, commentId)),
    editComment: (commentId, content) => dispatch(postActions.editComment(commentId, content))
});
export default connect(mapStateToProps, mapDispatchToProps)(MainNotFixed);
