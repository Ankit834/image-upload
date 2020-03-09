import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, ListGroup, ProgressBar, Button } from 'react-bootstrap';
import { storage, database } from '../../Firebase';
import ImageGrid from '../ImageGrid';
import InfoMessage from '../Common/Message/InfoMessage';


class ImageUpload extends React.Component {

  state = {
    imagesCollectionByDate: [],
    uploadedFiles: [],
    showinfoMessage: false,
    allFilesUploaded: false,
  }

  componentDidMount(){
    this.getAllImages();
  }

  getAllImages(){
    let imagesCollection = [];
    database.collection('imageDetails').orderBy('createdDate', 'desc').limit(30).get().then((data) => {
      data.forEach((imageData) => {
        imagesCollection.push({
          imageName: imageData.data().imageName,
          imageUrl: imageData.data().imageUrl,
          createdDate: imageData.data().createdDate.toDate()
        });
      });
      const groups = imagesCollection.reduce((groups, image) => {
        const date = image.createdDate.toDateString();
        if(!groups[date]){
          groups[date] = [];
        }
        groups[date].push(image);
        return groups;
      }, {});

      const imagesCollectionByDate = Object.keys(groups).map((date) => {
        return {
          date,
          images: groups[date]
        };
      });
      this.setState({ imagesCollectionByDate: imagesCollectionByDate });

    });
  }

  onDrop = (acceptedFiles) => {
    this.clearUploadedFiles();
    const uploadFilesList = acceptedFiles.map((file) => ({
      fileDetail: file,
      fileName: null,
      percentageUploaded: 0,
    }));

    this.setState({ uploadedFiles: uploadFilesList });
  }

  UpdateFile = (value, file) => {

    const uploadedFiles = this.state.uploadedFiles.map(f =>
      f.fileDetail === file.fileDetail ? value === '' ?
          { ...f, fileName: value, isFileNameValid: false} : { ...f, fileName: value, isFileNameValid: true } : f
    );
    this.setState({ uploadedFiles: uploadedFiles});
  }

  closeinfoMessage = () => {
    this.setState({ showinfoMessage: false });
  }

  clearUploadedFiles = () => {
    this.setState({ allFilesUploaded: false, uploadedFiles: [] });
  }

  render() {
    return (
      <Container>
        {this.state.showinfoMessage ?
        <InfoMessage
          onCloseMessage={this.closeinfoMessage}
          messageType='info'
          messageText="All Images are uploaded successfully"
        /> : null}
        <Row className="justify-content-md-center mt-2">
          <Dropzone
            onDrop={this.onDrop}
            accept={"image/png, image/jpeg"}>
            {({getRootProps, getInputProps}) => (
            <DropzoneContainer>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <UploadIcon
                  icon={faUpload}
                  size="5x"
                />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </DropzoneContainer>
            )}
          </Dropzone>
        </Row>

        {this.state.uploadedFiles.length > 0 ?
        <Container>
          <Row className="justify-content-md-center mt-2">
            <UploadFilesList>
              {this.state.uploadedFiles.map(file => (
              <ListGroup.Item key={file.fileDetail.path}>
                <Button variant="outline-danger">X</Button>
                {file.fileDetail.name}
                <InputField
                  type="text"
                  placeholder="Image Tag"
                  defaultValue={file.fileName || ''}
                  onChange={(e) => this.UpdateFile(e.target.value, file)} />
                  {!file.isFileNameValid ? <ErrorText>Please enter the Image Tag</ErrorText> : null}
                  {file.percentageUploaded > 0 ? <ProgressBar now={file.percentageUploaded} label={`${file.percentageUploaded}%`} /> : null}
              </ListGroup.Item>
              ))}
            </UploadFilesList>
          </Row>
          <Row className="justify-content-md-center mt-2">
            {!this.state.allFilesUploaded ? <Button
              variant="primary"
              onClick={this.uploadImages}
              disabled={this.areFilesInValid()}
            >
              Upload
            </Button> :
            <Button
            variant="primary"
            onClick={this.clearUploadedFiles}
          >
            Thank You
          </Button>
            }

          </Row>
        </Container>
         : null
        }

        {this.state.imagesCollectionByDate.length > 0 ?
        <Row className="justify-content-md-center mt-2">
        <ImageGrid
          imagesCollectionByDate={this.state.imagesCollectionByDate}
        />
        </Row> : null }
      </Container>
    );
  }

  areFilesInValid = () => {
    if(this.state.uploadedFiles.some(file => !file.fileName)){
      return true;
    }
    return false;
  }

  uploadImages = () => {
    const { uploadedFiles } = this.state;
    console.log(uploadedFiles);
    uploadedFiles.forEach((file, i) => {
      const uploadTask = storage.ref(`images/${file.fileName}`).put(file.fileDetail);
      uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        const files = this.state.uploadedFiles.map(f =>
            f.fileDetail === file.fileDetail ? { ...f, percentageUploaded: progress} : f
          );
        this.setState({ uploadedFiles: files });
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage.ref('images').child(file.fileName).getDownloadURL().then(url => {
          database.collection('imageDetails').add({
            imageName: file.fileName,
            imageUrl: url,
            createdDate: new Date()
          })
          .then((docRef) => {
            console.log(i);
            file.isFileUploaded = true
            if(i === uploadedFiles.length - 1){
              this.getAllImages();
              this.setState({
                allFilesUploaded: true,
                showinfoMessage: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          })
        })
      });
    })
  }
}

export default ImageUpload;

export const DropzoneContainer = styled.div`
  min-height: 30vh;
  min-width: 80vh;
  border: 1px dashed #505963;
  padding: 20px 33px 15px;
  background: #F5F7FA;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  border-radius: 4px;
  margin-bottom: 10px;
  text-align: center;

  :hover {
    cursor: pointer;
  }
`;

export const UploadIcon = styled(FontAwesomeIcon)`
  text-align: center;
`;

export const UploadFilesList = styled(ListGroup)`
  min-width: 50%
`

export const InputField = styled.input`
  color: #330033;
  font-size: 1em;
  border: 2px solid #6699cc;
  border-radius: 3px;
  float: right;
  text-align: center;
`;

const ErrorText = styled.span`
  color: red;
`;
