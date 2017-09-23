import { Connect, SimpleSigner } from 'uport-connect'

export const uport = new Connect('HiveCommons (hackathon)', {
  clientId: '2p1xwmSYcpNXKjcw2z5WP4xj9YMzED6vw8e',
  network: 'rinkeby',
  signer: SimpleSigner('0f45804cf6eecde876dd3db6933e15b166b15fb0756e3afe03db1bca7235f51d')
})



export const web3 = uport.getWeb3()
