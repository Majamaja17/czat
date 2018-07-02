import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';

import styles from './App.css';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

import React, { Component } from 'react';
import io from 'socket.io-client';

const io = socketIo(server);
const UsersService = require('./UsersService');

const userService = new UsersService();

const socket = io('/');

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default;
    render(NewApp)
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {users: [], messages: [], text: '', name: ''};
  }
};

render() {
    return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
}

render() {
    return this.state.name !== '' ? (
      this.renderLayout()
    ) : this.renderUserForm() //
  }

  renderUserForm() {
   return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)
}

renderLayout() {
   return (
      <div className={styles.App}>
        <div className={styles.AppHeader}>
          <div className={styles.AppTitle}>
            ChatApp
          </div>
          <div className={styles.AppRoom}>
            App room
          </div>
        </div>
        <div className={styles.AppBody}>
          <UsersList
            users={this.state.users}
          />
          <div className={styles.MessageWrapper}>
            <MessageList
              messages={this.state.messages}
            />
            <MessageForm
              onMessageSubmit={message => this.handleMessageSubmit(message)}
              name={this.state.name}
            />
          </div>
        </div>
      </div>
   );
}