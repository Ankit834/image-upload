import React from 'react';
import styled from 'styled-components'
import { Container, Modal, Image } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ImagePreview extends React.Component {
  render() {
    const {show, onHide, image } = this.props;
    return (
      <Modal show={show} onHide={onHide} size='xl' dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>
            {image.imageName}
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ImageContainer src={image.imageUrl} />
          </Modal.Body>
        <Modal.Footer>
          Created Date:- {image.createdDate.toString()}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ImagePreview;

const ImageContainer = styled(Image)`
  max-width: 100%;
`;