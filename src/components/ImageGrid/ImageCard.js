import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';

class ImageCard extends React.Component {

  render() {
    const{ imageDetails, onImageClick } = this.props;
    return (
      <Fragment>
        <ImgCard>
          <ImgBox variant='top' src={imageDetails.imageUrl} onClick={onImageClick} />
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
