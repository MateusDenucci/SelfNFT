import React, { Component } from 'react';

class UploadForm extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>

              <h2>Mint your own NFT</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.uploadImage()
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                <button type="submit" className="mt-2 btn btn-primary btn-block btn-lg">Create NTF!</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadForm;