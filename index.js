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
    let docRef = await db.collection('Portfolio').doc(`${orderCost}-${stockQuantity}-${stockTicker}-${firebase.auth().currentUser.uid}`).set({
      stockTicker: stockTicker,
      stockOwned: stockQuantity,
      orderTotal: orderCost
    })
    document.location.href = "index.html"
    console.log(docRef)
    })



  console.log(result)
  })
    let db = firebase.firestore()
    let querySnapshot = await db.collection('Portfolio').get()
              
      let items = querySnapshot.docs

      for (let i=0; i<items.length; i++) {
        let item = items[i].data() // each member of the docs Array is a reference, so use .data() to get it into an Object
        item.stockTicker // => e.g. 'grapes'
       
        
      document.querySelector(".stockTable2").insertAdjacentHTML('beforeend', `
      <tr>
        <td class='border border-blue-300 text-center'>${item.stockTicker}</td>
        <td class='border border-blue-300 text-center'>${item.stockOwned}</td>
        <td class='border border-blue-300 text-center'>$${item.orderTotal}</td>
      </tr>
      `)
      }

      

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
