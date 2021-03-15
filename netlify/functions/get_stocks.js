let firebase = require('./firebase')

exports.handler = async function(event) {
  let queryStringUserId = event.queryStringParameters.userId
 
  let stockData = [] // sample only...
  let db = firebase.firestore()

  let querySnapshot2 = await db.collection('Portfolio').where('userId', '==', queryStringUserId).get()
  
  let stocks = querySnapshot2.docs

  for (let i=0; i<stocks.length; i++) {
    let stockTicker = stocks[i].data().stockTicker
    let stockOwned = stocks[i].data().stockOwned
    let orderTotal = stocks[i].data().orderTotal
    let userId = stocks[i].data().userId
    
    stockData.push({
      stockTicker: stockTicker,
      stockOwned: stockOwned,
      orderTotal: orderTotal,
      userId: userId
    })
    
  }

  return {
    statusCode: 200,
    body: JSON.stringify(stockData)
  }
}