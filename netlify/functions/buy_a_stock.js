let firebase = require('./firebase')

exports.handler = async function(event) {
//   let data = [] // sample only...

  let db = firebase.firestore()
    console.log(event)
  let body = JSON.parse(event.body)

  let stockTicker = body.stockTicker
  let stockOwned = body.stockOwned
  let orderTotal = body.orderTotal
  let userId = body.userId

  console.log(stockTicker)

  let newOrder = {
    stockTicker: stockTicker,
    stockOwned: stockOwned,
    orderTotal: orderTotal,
    userId: userId
  }

  let docRef = await db.collection('Portfolio').add(newOrder)
  
  return {
    statusCode: 200,    
  }

}