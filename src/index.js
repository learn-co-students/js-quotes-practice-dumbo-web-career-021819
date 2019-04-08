// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const ulTag = document.querySelector('#quote-list');
const newQuoteForm = document.querySelector('#new-quote-form');

const quoteTemplate = (quoteObj) => {
  return `<li class='quote-card' id="${quoteObj.id}">
  <blockquote class="blockquote">
  <p class="mb-0" id="quote">${quoteObj.quote}</p>
  <footer class="blockquote-footer" name="author">${quoteObj.author}</footer>
  <br>
  <button class='btn-success' name="like-btn" id="quote-${quoteObj.id}">Likes: <span>${quoteObj.likes}</span></button>
  <button class='btn-danger' name="delete">Delete</button>
  </blockquote>
  </li>
  `
};
// <button class='btn-default' name="edit">Edit</button>

fetch('http://localhost:3000/quotes/')
.then((resp)=>{return resp.json();})
.then((quotes)=>{
  quotes.forEach((quote)=>{ulTag.innerHTML += quoteTemplate(quote);
  })
});

const addNewQuote = (quoteObj)=>{
  return fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
  		'Content-Type': 'application/json',
  		'Accept': 'application/json'
  	},
    body: JSON.stringify(quoteObj)
  }).then(response => {
    return response.json()
  })
};

const updateQuote = (quote)=>{
  return fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'PATCH',
    headers: {
  		'Content-Type': 'application/json',
  		'Accept': 'application/json'
  	},
    body: JSON.stringify(quote)
  }).then(response => {
    return response.json()
  })
};

const deleteQuote = (quote) => {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'DELETE'
  })
};

ulTag.addEventListener('click', (event)=>{
  if (event.target.name == "like-btn") {
    let likeCount = parseInt(event.target.firstElementChild.innerText);
    let newLikes = likeCount+1;
    const liTagId = parseInt(event.target.parentElement.parentElement.id);
    const likeObj = {
      "id": liTagId,
      "likes": newLikes
    };
    updateQuote(likeObj).then((object)=>{
    document.querySelector(`#quote-${object.id}`).firstElementChild.innerText = `${object.likes}`;
    })
  } else if (event.target.name == "delete") {
    const quote = event.target.parentElement.parentElement;
    quote.remove();
    deleteQuote(quote)
    }
    else if (event.target.name == "edit") {
      console.log('you clicked on the Edit button')
    }
});

newQuoteForm.addEventListener('submit',(event)=>{
  event.preventDefault()
  let newQuote = event.target.newquote.value;
  let newQuoteAuthor = event.target.author.value;
  const newQuoteObj = {
    "quote": newQuote,
    "author": newQuoteAuthor,
    "likes": 0
  };
  addNewQuote(newQuoteObj).then(
    (quote)=>{
      ulTag.innerHTML += quoteTemplate(quote);
      newQuoteForm.author.value = '';
      newQuoteForm.newquote.value = '';
    })
});
