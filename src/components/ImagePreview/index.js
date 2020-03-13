import React from 'react';
import styled from 'styled-components'
import { Carousel, Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

class ImagePreview extends React.Component {
  state = {
    index: 0
  }

  componentDidMount(){
    console.log(this.props.activeIndex);
    this.setState({ index: this.props.activeIndex })
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({ index: selectedIndex });
  }

  nextIcon = <Icons><FontAwesomeIcon icon={faArrowCircleRight} size="2x" /></Icons>
  prevIcon = <Icons><FontAwesomeIcon icon={faArrowCircleLeft} size="2x" /></Icons>


  render() {
    const {show, onHide, images } = this.props;
    return (
      <Modal show={show} onHide={onHide} size='xl' centered>
        <CarouselContainer
          nextIcon ={this.nextIcon}
          prevIcon={this.prevIcon}
          interval={null}
          indicators={false}
          activeIndex={this.state.index}
          onSelect={this.handleSelect}>
          {images.map((image, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100"
                src={image.imageUrl}
                alt={image.imageName}
              />
              <CarouselCaption>
                <h3>{image.imageName}</h3>
                <p>Created Date {image.createdDate.toString()}</p>
              </CarouselCaption>
            </Carousel.Item>
          ))}
        </CarouselContainer>
      </Modal>
    );
  }
}

export default ImagePreview;


const CarouselContainer = styled(Carousel)`
  max-height: 80vh;
  overflow-y: scroll;
`

const CarouselCaption = styled(Carousel.Caption)`
  position: fixed;
  margin-bottom: 5%;
`

const Icons = styled.span`
  position: fixed;
`;
