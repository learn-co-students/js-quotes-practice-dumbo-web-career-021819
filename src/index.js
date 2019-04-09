// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const quoteList = document.getElementById('quote-list')
const newQuoteForm = document.getElementById('new-quote-form')
const submitButton = document.querySelector('.btn.btn-primary')

const deleteButton = document.querySelector('.btn-danger')

const createQuoteHTMl = (quoteObject) => {
  // debugger
  return `<li class='quote-card'>
            <blockquote class="blockquote">
              <p class="mb-0">"${quoteObject.quote}"</p>
              <footer class="blockquote-footer">"${quoteObject.author}"</footer>
              <br>
              <button class='btn-success'>Likes: <span>0</span></button>
              <button class='btn-danger'>Delete</button>
            </blockquote>
          </li>`
}

// const likeFunction = () => {
  // debugger


// }

fetch('http://localhost:3000/quotes')
.then(response => response.json())
.then(quoteResponse => quoteResponse.forEach(quote => {
  quoteList.innerHTML += createQuoteHTMl(quote)
}))//.then( likeFunction() )



const createNewQuote = (quote) => {
  return fetch ('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
    body: JSON.stringify(quote)
  }).then(response => response.json())
}



submitButton.addEventListener('submit', (event) => {
  event.preventDefault();
  if(event.target.tagName === "BUTTON"){
    const quoteObject= {

      quote: newQuoteForm.quote.value,
      author: newQuoteForm.author.value
    }

    createNewQuote(quoteObject).then(quoteObject => {
      quoteList.innerHTML += createQuoteHTMl(quoteObject)
    })
  }
})

const likeButton = document.querySelector('.btn-success')
// debugger
likeButton.addEventListener('click', (event) => {
  // debugger
// if(event.target.tagName === 'BUTTON'){
//   console.log("hi")
//   }

})
