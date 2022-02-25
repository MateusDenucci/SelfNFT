import React, { Component } from 'react';

class NFTGallery extends Component {

  render() {
    return (
        <div className="container mt-2">
          <h2>Your minted sNFTs:</h2>
          <div className="row">
            { this.props.accountSNFTs.map((accountSNFT, key) => {
              return(
                <div className="col-md-3 mt-2" key={key}>
                  <img className='img-thumbnail'
                      alt={`this is your sNFT #${key}`}
                      src={accountSNFT}
                  />
                </div>
              )
            })}
          </div>
        </div>

    );
  }
}

export default NFTGallery;
