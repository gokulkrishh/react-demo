import React, { Component } from 'react';
import Loader from './Loader';
import deleteIconImage from './delete.png';
import createIconImage from './create.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      isLoaded: false
    };
    this.createNewUser = this.createNewUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteThisUser = this.deleteThisUser.bind(this);
  }

  componentDidMount() {
    this.showLoader();
   fetch("https://reqres.in/api/users?page=2").then((data) => {return data.json()})
    .then((users) => {
      this.hideLoader();
      this.setState({users, isLoaded: true});
   });
  }

  deleteThisUser(data) {
    const {users} = this;
    const url = `https://reqres.in/api/users/${data.id}`;
    this.showLoader();
    fetch(url, {method: "DELETE"})
      .then(() => {
        this.hideLoader();
        var newUsers = users.data.filter((user) => {
          return user.id !== data.id;
        });
        this.setState({users: {data: newUsers}}); // updating the new user information to render
     });
  }

  createNewUser() {
    const {users} = this.state;
    const url = `https://reqres.in/api/users`;
    var body = {
      "first_name": "Steve",
      "last_name": "Jobs",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
    };
    this.showLoader();
    fetch(url, {method: "POST", body: JSON.stringify(body)}).then((data) => {return data.json()})
      .then((data) => {
        this.hideLoader();
        body.id = data.id;
        users.data.push(body);
        this.setState({users});
     });
  }

  editUser(event) {
    event.target.setAttribute("contenteditable", true);
  }

  updateUser(data, event) {
    data.first_name = event.target.textContent;
    event.target.removeAttribute("contenteditable");
    event.target.classList.add("new");
    event.persist();
    const url = `https://reqres.in/api/users/${data.id}`;
    this.showLoader();
    fetch(url, {method: "PUT"}).then((data) => {return data.json()})
      .then((data) => {
        this.hideLoader();
        console.log(data);
        event.target.classList.remove("new");
     });
  }

  showLoader() {
    this.setState({show: true});
  }

  hideLoader() {
    this.setState({show: false});
  }

  render() {
    const {users, isLoaded, show} = this.state;  
    if (!isLoaded) return <div className="loading">Loading...</div>
    var userInfo =  users.data.map((data, index) => {
      return (
        <tr key={data.id}>
          <td>{data.id}</td>
          <td onDoubleClick={this.editUser} onBlur={this.updateUser.bind(null, data)}>{data.first_name}</td>
          <td onDoubleClick={this.editUser} onBlur={this.updateUser.bind(null, data)}>{data.last_name}</td>
          <td><img alt="Avatar" src={data.avatar}/> </td>
          <td><img alt="Delete" onClick={this.deleteThisUser.bind(null, data)} src={deleteIconImage}/></td>
        </tr>
      );
    });
    return (
      <div className="users">
        <Loader show={show} />
        <table>
          <tbody>
            <tr><th>id</th><th>First Name</th><th>Last Name</th><th>Avatar</th><th>Actions</th></tr>
            {userInfo}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td><img alt="Create" onClick={this.createNewUser} src={createIconImage} /></td>
            </tr>
          </tbody>
        </table>
      </div> 
    );
  }
}

export default App;
