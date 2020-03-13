import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, ListGroup, ProgressBar, Button } from 'react-bootstrap';
import { storage, database } from '../../Firebase';
import ImageGrid from '../ImageGrid';
import InfoMessage from '../Common/Message/InfoMessage';


class ImageUpload extends React.Component {

  state = {
    imagesCollection: [],
    imagesCollectionByDate: [],
    uploadedFiles: [],
    showinfoMessage: false,
    allFilesUploaded: false,
  }

  componentDidMount(){
    this.getAllImages();
  }

  getImagesCollection(){
    return this.state.imagesCollection;
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
      this.setState({ imagesCollection: imagesCollection });
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
      fileError: null
    }));

    this.setState({ uploadedFiles: uploadFilesList });
  }

  UpdateFile = (value, file) => {
    const uploadedFiles = this.state.uploadedFiles.map(f =>
      f.fileDetail === file.fileDetail ? value === '' ?
          { ...f, fileName: value, fileError: 'Image Tag cannot be empty'} : { ...f, fileName: value, fileError: null } : f
    );
    this.setState({ uploadedFiles: uploadedFiles});
  }

  removeImageFile = (file) => {
    const uploadedFile = this.state.uploadedFiles.filter(f => f.fileDetail !== file.fileDetail);
    this.setState({ uploadedFiles: uploadedFile });
  }

  closeinfoMessage = () => {
    this.setState({ showinfoMessage: false });
  }

  clearUploadedFiles = () => {
    this.setState({ allFilesUploaded: false, uploadedFiles: [], showinfoMessage: false });
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
                <Button variant="outline-danger" size='sm' onClick={() => this.removeImageFile(file)}>X</Button>
                <FileNameText>{file.fileDetail.name}</FileNameText>
                <InputField
                  type="text"
                  placeholder="Image Tag"
                  defaultValue={file.fileName || ''}
                  onChange={(e) => this.UpdateFile(e.target.value, file)}
                  />
                  {file.fileError ? <ErrorText><br></br>{file.fileError}</ErrorText> : null}
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
          imagesCollection={this.state.imagesCollection}
        />
        </Row> : null }
      </Container>
    );
  }

  areFilesInValid = () => {
    if(this.state.uploadedFiles.some(file => file.fileError)){
      return true;
    }
    return false;
  }

  uploadImages = () => {
    const { uploadedFiles } = this.state;
    database.collection('imageDetails').where('imageName', 'in', uploadedFiles.map(f => f.fileName)).get()
      .then((data) => {
        if(!data.docs.length){
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
        } else {
          let files = this.state.uploadedFiles;
          data.forEach(imageData => {
            files = files.map(f =>
              f.fileName === imageData.data().imageName ?
                {...f, fileError: 'Image Tag already exist'} : f
            );
          });
          this.setState({ uploadedFiles: files})
        }
      })
  }
}

export default ImageUpload;

export const DropzoneContainer = styled.div`
  min-width: 50%;
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
  min-width: 70%;
`

export const FileNameText = styled.span`
`;

export const InputField = styled.input`
  width: 50%;
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
