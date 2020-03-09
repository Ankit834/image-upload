import React from 'react';
import { Alert } from 'react-bootstrap';

class InfoMessage extends React.Component {
  render() {
    const { onCloseMessage, messageType, messageText } = this.props;
    return (
      <Alert variant={messageType} onClose={onCloseMessage} dismissible>
        {messageText}
      </Alert>
    );
  }
}

export default InfoMessage;
