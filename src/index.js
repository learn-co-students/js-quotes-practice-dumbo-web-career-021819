// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteListUlTag = document.body.querySelector('ul#quote-list');
const submitQuoteFormTag = document.body.querySelector('form#new-quote-form')

document.addEventListener("DOMContentLoaded", event => {
  console.log('DOM Content loaded');
  grabQuoteInfo();
});

//function for loading quotes / creating cards from database DOM;
const createQuotesCards = (quotesInfoObj) => {
  return `
      <li class='quote-card'>
    <blockquote class="blockquote" data-id="${quotesInfoObj.id}">
      <p class="mb-0">${quotesInfoObj.quote}</p>
      <footer class="blockquote-footer">${quotesInfoObj.author}</footer>
      <br>
      <button class='btn-success' name='liker'>Likes: <span data-likesCount="${quotesInfoObj.likes}">${quotesInfoObj.likes}</span></button>
      <button class='btn-danger'name='deleter'>Delete</button>
    </blockquote>
      </li>
  `
}

const grabQuoteInfo = () => {
  fetch('http://localhost:3000/quotes')
    .then(response => {
      return response.json();
    })
    .then(parsedJson => {
      for (let quoteObj of parsedJson) {
        quoteListUlTag.innerHTML += createQuotesCards(quoteObj);
      }
    })
}

const addNewQuote = (newQuoteObj) => {
  return fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newQuoteObj)
  })
    .then(response => {
      return response.json();
    })
}

submitQuoteFormTag.addEventListener('submit', event => {
  event.preventDefault();
  const newQuote = submitQuoteFormTag.querySelector('input#new-quote').value;
  const newAuthor = submitQuoteFormTag.querySelector('input#author').value;

  let newQuoteObj = {
    "quote": newQuote,
    "likes": 0,
    "author": newAuthor
  };

  addNewQuote(newQuoteObj)
    .then(newQuoteObjWithId => {
      quoteListUlTag.innerHTML = createQuotesCards(newQuoteObjWithId) + quoteListUlTag.innerHTML;
  })
});

const updateQuoteLikes = (id, newLikeCount) => {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({likes: newLikeCount})
  })
    .then(response => {
      return response.json();
    })
};

const deleteQuote = (id) => {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  })
}

quoteListUlTag.addEventListener('click', event => {
  if (event.target.name === 'liker') {
    const spanTag = event.target.querySelector('span');
    const currentTargetId = parseInt(event.target.parentElement.dataset.id);
    let likesCount = parseInt(spanTag.dataset.likescount);
    likesCount ++;

    updateQuoteLikes(currentTargetId, likesCount).then(updatedLikesObj => {
      spanTag.dataset.likescount = updatedLikesObj.likes;
      spanTag.innerText = spanTag.dataset.likescount;
    })
  } else if (event.target.name === 'deleter') {
    deleteQuote(parseInt(event.target.parentElement.dataset.id));
    event.target.parentElement.parentElement.remove();
  }
});
