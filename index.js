firebase.auth().onAuthStateChanged(async function(user) {
 
  if (user) {
    let currentUserName = firebase.auth().currentUser.displayName

   // Signout button
   document.querySelector(".sign-in-or-sign-out").innerHTML = `
   <p class="font-bold text-right pr-5">Welcome ${currentUserName}</p>
   <a href="#" class="sign-out-button text-pink-500 underline text-right pr-5">Sign Out</a>
 `
    document.querySelector(".sign-out-button").addEventListener("click", function(event){
      event.preventDefault()
      firebase.auth().signOut()
      document.location.href = "index.html"
    })

  document.querySelector('.submitButton').addEventListener('click', async function(event){
    event.preventDefault()
    document.querySelector('.stockSearch').innerHTML = ``
    document.querySelector('.submitOrderDiv').innerHTML = ``
        
    let stockTicker = document.getElementById("stock-ticker-input").value
    let stockQuantity = document.getElementById("stock-quantity-input").value
    
    let stocks = new Stocks('CF0SLZCQGPR7G3PA')
    let result = await stocks.timeSeries({
      symbol: stockTicker,
      interval: '1min',
      amount: 1
    });
    
    let orderCost = result[0].close * stockQuantity
    console.log(orderCost)

    document.querySelector('.stockSearch').insertAdjacentHTML('beforeend', `
    <div class="w-full p-4">
    The stock price of ${stockTicker} as of ${result[0].date} was $${result[0].close}
    </div>

    <div class="w-full p-4 text-blue-500 font-bold text-xl text-center">
    Order Summary: For ${stockQuantity} share(s), it would cost $${orderCost}.
    </div>

    `)
    
    document.querySelector(".submitOrderDiv").insertAdjacentHTML('beforeend', `
    <div class="w-full">
    <button class="submitOrderButton bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl w-full">Submit Order</button>
    </div>
    `)

    let db = firebase.firestore()
    document.querySelector(".submitOrderButton").addEventListener("click", async function(event){

    let response = await fetch ('/.netlify/functions/buy_a_stock', {
      method: 'POST',
      body: JSON.stringify({
        stockTicker: stockTicker,
        stockOwned: stockQuantity,
        orderTotal: orderCost,
        userId: firebase.auth().currentUser.uid
      })
    })
    document.location.href = "index.html"
    })

  })
    let db = firebase.firestore()
    
    // let querySnapshot2 = await db.collection('Portfolio').where('userId', '==', firebase.auth().currentUser.uid).get()
    
    //   let items = querySnapshot2.docs

      let response = await fetch(`/.netlify/functions/get_stocks?userId=${firebase.auth().currentUser.uid}`)
      let stocks = await response.json()
     

      for (let i=0; i<stocks.length; i++) {
       
        let stock = stocks[i]
          
        document.querySelector(".stockTable2").insertAdjacentHTML('beforeend', `
        <tr>
          <td class='border border-blue-300 text-center'>${stock.stockTicker}</td>
          <td class='border border-blue-300 text-center'>${stock.stockOwned}</td>
          <td class='border border-blue-300 text-center'>$${stock.orderTotal}</td>
        </tr>
        `)

      }

      document.querySelector(".portfolioHeader").insertAdjacentHTML('beforeend', `
      My Portfolio
      `)
      

} else {

  document.querySelector(".stockTable").classList.add("hidden")
  // Initializes FirebaseUI Auth
  let ui = new firebaseui.auth.AuthUI(firebase.auth())

  // FirebaseUI configuration
  let authUIConfig = {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: 'index.html'
  }

  // Starts FirebaseUI Auth
  ui.start('.sign-in-or-sign-out', authUIConfig)

}})
