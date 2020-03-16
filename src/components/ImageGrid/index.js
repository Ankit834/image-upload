import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import ImageCard from './ImageCard';
import ImagePreview from '../ImagePreview';

class ImageGrid extends React.Component {

  state = {
    imagesCollection: [],
    showModal: false,
    activeIndex: 0,
  }

  componentDidMount(){
    this.setState({ imagesCollection: this.props.imagesCollection});
  }

  componentDidUpdate(prevProps){
    if(prevProps.imagesCollection.length !== this.props.imagesCollection.length){
      this.setState({ imagesCollection: this.props.imagesCollection})
    }
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  onImageClick = (image) => {
    const imagesCollection = this.props.imagesCollection;
    const activeIndex = imagesCollection.findIndex((i) => i === image);
    this.setState({ showModal: true, activeIndex: activeIndex });
  }

  render() {
    const { imagesCollectionByDate } = this.props;
    return (
      <Fragment>
        {this.state.showModal ? <ImagePreview
          show={this.state.showModal}
          onHide={this.hideModal}
          images={this.state.imagesCollection}
          activeIndex={this.state.activeIndex}
        />: null}
        {imagesCollectionByDate.map((imageGroup, i) => (
            <ImgGrid key={i}>
              <DateText>{imageGroup.date}</DateText>
              <Row className="justify-content-md-center mt-2">
              {imageGroup.images.map((image, j) => (
                <Col xs={6} md={4} key={j}>
                  <ImageCard
                  imageDetails={image}
                  onImageClick={() => this.onImageClick(image)}
                />
                </Col>
              ))}
              </Row>
            </ImgGrid>
          ))}
      </Fragment>
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
