import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import ImageCard from './ImageCard';
import ImagePreview from '../ImagePreview';

class ImageGrid extends React.Component {
  render() {
    const { imagesCollectionByDate } = this.props;
    return (
      <Container>
        {imagesCollectionByDate.map((imageGroup, i) => (
            <ImgGrid key={i}>
              <DateText>{imageGroup.date}</DateText>
              <Row className="justify-content-md-center mt-2">
              {imageGroup.images.map((image, j) => (
                <Col xs={6} md={4} key={j}>
                  <ImageCard
                  imageDetails={image}
                />
                </Col>

                // </ListGroup.Item>
              ))}
              </Row>
            </ImgGrid>
          ))}
      </Container>
    );
  }
}

export default ImageGrid;

const ImgGrid = styled.div`
  border: 3px solid grey;
  border-radius: 1%;
  text-align: center;
  margin-bottom: 1%;
`;

const DateText = styled.span`
  background-color: #F5F7FA;
  font-weight: bold;
  font-size: 4vh;
`;
