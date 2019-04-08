// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const ulTag = document.querySelector('#quote-list')
const quoteCard = (quote) => {
  // data-id was added so that each id will identify with each quote
  return `
    <li class='quote-card' data-id="${quote.id}">
     <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-quote-likes="${quote.likes}">Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
     </blockquote>
    </li>
    `
    // note the back ticks.. it is very important
    // js won't be able to read it
}

fetch('http://localhost:3000/quotes')
.then((response) => {
  return response.json();
})
.then((allQuotesObj) => {
  allQuotesObj.forEach((quoteObj) => {
      ulTag.innerHTML += quoteCard(quoteObj)
    })
  })

const formTag = document.querySelector('#new-quote-form')
formTag.addEventListener("submit", (event) => {
  event.preventDefault();
  // debugger
  let quote = event.target.querySelector('#new-quote').value;
  let author = event.target.querySelector('#author').value;
  createNewQuote(quote, author);

})
// submit is an event and when an event happens, you want a function to happen
// when a page refreshes and saves the information BUT it doesn't stay on the page..... preventDefault(); is a built in function in js
// to run a function ();
// to call a function , you dont need ();


const createNewQuote = (quote, author) => {
  // Submitting a new form
  fetch("http://localhost:3000/quotes", {
    // method is looking for a const or let, SO it should be in *QUOTES*
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    // memorize this ^^
    // after the bracket, comma is needed because it's reading like a sentence
  // brackets are needed when passing in multiple items
    body: JSON.stringify({
      quote: quote,
      likes: 0,
      author: author
    })
  }).then((response) => {
    return response.json();
  })
  // second .then is to iterate and then with the iteration is to create a function
  // in here, we are trying to create a new quote card and ADD it to the list of quote cards.. so we need quoteCard and ulTag
  // going from parent to children
  .then((quote) => {
    ulTag.innerHTML += quoteCard(quote)
  })
}

// DELETE BUTTON

    ulTag.addEventListener("click", (event) => {
      const id = event.target.parentElement.parentElement.dataset.id
      if (event.target.className === "btn-danger"){
        fetch(`http://localhost:3000/quotes/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }}).then(() => {
          event.target.parentElement.parentElement.remove()
        })
        // pesstimistic delete
      }
    })





// *********** be comfortable with create and update








//
