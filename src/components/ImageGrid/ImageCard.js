import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import ImagePreview from '../ImagePreview';

class ImageCard extends React.Component {
  state = {
    showModal: false,
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  openImagePreview = () => {
    this.setState({ showModal: true });
  }
  render() {
    const{ imageDetails } = this.props;
    return (
      <Fragment>
        <ImagePreview
          show={this.state.showModal}
          onHide={this.hideModal}
          image={imageDetails}
        />
        <ImgCard>
          <ImgBox variant='top' src={imageDetails.imageUrl} onClick={this.openImagePreview} />
          <ImageText>{imageDetails.imageName}</ImageText>
      </ImgCard>
      </Fragment>
    );
  }
}

export default ImageCard;

const ImgCard = styled(Card)`
  height: 50vh;
  text-align: center;
  margin: 1vh;
  cursor: pointer;
`;

const ImgBox = styled(Card.Img)`
  height: 90%;
`

const ImageText = styled.span`
  font-weight: bold;
`;
