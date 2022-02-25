import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>

              <h2>Create NFT</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.uploadImage()
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                <button type="submit" className="mt-2 btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
              <div className='mt-2'>
                { this.props.accountSNFTs.map((accountSNFT, key) => {
                      return(
                        <img
                          key={key}
                          alt={key}
                          src={accountSNFT}
                        />
                      )
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;