import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://en.wikipedia.org/wiki/Self-service"
          target="_blank"
          rel="noopener noreferrer"
        >
          Self NFT
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              {
                this.props.account ?
                <small id="account" className='text-white'>{this.props.account}</small> :
                <button onClick={this.props.startWeb3} className="btn btn-warning">Connect Wallet</button>
              }
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;