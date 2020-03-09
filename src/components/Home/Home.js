import React from 'react';
import { Container, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboard } from '@fortawesome/free-solid-svg-icons';
import ImageUpload from '../ImageUpload/ImageUpload';

class Home extends React.Component {
  render() {
    return (
      <Container>
        <Row className="justify-content-md-center mt-2">
          <FontAwesomeIcon
            icon={faChalkboard}
            size="2x"
          />
          <h3>Image Upload</h3>
        </Row>
        <Row className="justify-content-md-center mt-2">
          <ImageUpload />
        </Row>
      </Container>
    );
  }
}

export default Home;