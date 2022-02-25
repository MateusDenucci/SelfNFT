const selfNFT = artifacts.require('./selfNFT.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('selfNFT', (accounts) => {

  let token;

  before(async () => {
    token = await selfNFT.deployed()
  })

  describe('deployment', async() => {
    it('deploys successfully', async() => {
      const address = token.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'SelfNFT')
    })

    it('has a symbol', async () => {
      const symbol = await token.symbol()
      assert.equal(symbol, 'sNFT')
    })
  })

  describe('token distribution', async () => {
    let result;

    it('mints tokens', async () => {
      await token.mint(accounts[0], 'https://i.kym-cdn.com/entries/icons/mobile/000/021/807/ig9OoyenpxqdCQyABmOQBZDI0duHk2QZZmWg2Hxd4ro.jpg')

      result = await token.totalSupply()
      assert.equal(result.toString(), '1', 'total supply is correct')

      result = await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'balanceOf is correct')
      
      result = await token.ownerOf('1')
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct')

      let balanceOf = await token.balanceOf(accounts[0])
      let tokenIds = []
      for(let i=0; i < balanceOf; i++){
        let id = await token.tokenOfOwnerByIndex(accounts[0], i)
        tokenIds.push(id.toString())
      }
      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(), 'tokenIds are correct')

      result = await token.tokenURI('1')
      assert.equal(result, 'https://i.kym-cdn.com/entries/icons/mobile/000/021/807/ig9OoyenpxqdCQyABmOQBZDI0duHk2QZZmWg2Hxd4ro.jpg', 'tokenURI is correct')

    })
  })
})
