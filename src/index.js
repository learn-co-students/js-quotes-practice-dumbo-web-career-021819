// This file should only run after the DOM has finished loading


// Tags
const ulQuoteListTag = document.querySelector('ul#quote-list');
const newQuoteFormTag = document.querySelector('form#new-quote-form');
let editForm = false;


// Helper Functions


const createQuote = quoteObj => {
  return fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(quoteObj)
  }).then(response => {
    return response.json();
  });
};


const createQuoteCardHTML = quoteObj => {
  return `<li class='quote-card' data-id="${quoteObj["id"]}" data-likes-count="${quoteObj["likes"]}">
            <blockquote class="blockquote">
              <p class="mb-0">${quoteObj["quote"]}</p>
              <footer class="blockquote-footer">${quoteObj["author"]}</footer>
              <br>
              <button class='btn-success'>Likes: ${quoteObj["likes"]}</button>
              <button class='btn-edit'>Edit</button>
              <button class='btn-danger'>Delete</button>
            </blockquote>
          </li>`;
};


const addEditFormHTML = quoteObj => {
  return `<br>
          <br>
          <div class="edit-form-container">
            <form id="edit-quote-form">
              <div class="form-group">
                <label for="edit-quote">Edit Quote</label>
                <input type="text" class="form-control" id="edit-quote" value="${quoteObj["quote"]}">
              </div>
              <div class="form-group">
                <label for="edit-author">Edit Author</label>
                <input type="text" class="form-control" id="edit-author" value="${quoteObj["author"]}">
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>`;
};


const deleteQuote = (id) => {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  });
};

const updateLikesCount = (id, likesCount) => {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "likes": likesCount
    })
  }).then(response => {
    return response.json();
  });
};


const updateQuote = (id, newQuoteContent, newQuoteAuthor) => {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "quote": newQuoteContent,
      "author": newQuoteAuthor
    })
  }).then(response => {
    return response.json();
  });
};


document.addEventListener('DOMContentLoaded', event => {

  // Fetches quotes from URL and creates a display card for each quote
  const quotesUrl = "http://localhost:3000/quotes";
  fetch(quotesUrl).then(response => {
    return response.json();
  }).then(arrayOfQuoteObjects => {
    arrayOfQuoteObjects.forEach(quoteObj => {
      ulQuoteListTag.innerHTML += createQuoteCardHTML(quoteObj);
    });
  });


  // Adding a quote
  newQuoteFormTag.addEventListener('submit', event => {
    event.preventDefault();
    const quoteContent = document.getElementById('new-quote').value;
    const quoteAuthor = document.getElementById('author').value;
    const quoteObj = {
      "quote": quoteContent,
      "author": quoteAuthor,
      "likes": 0
    };
    createQuote(quoteObj).then(newQuote => {
      ulQuoteListTag.innerHTML += createQuoteCardHTML(newQuote);
    });
  });


  ulQuoteListTag.addEventListener('click', event => {
    let currentButton = event.target;
    let currentListItem = currentButton.parentElement.parentElement;
    let id = currentListItem.dataset.id;
    // <div class="edit-form-container">
    // <form id="edit-quote-form">
    let editFormContainer = currentListItem.querySelector('div.edit-form-container');
    let editQuoteFormTag = currentListItem.querySelector('form#edit-quote-form');

    // Deleting a quote
    if (event.target.className === 'btn-danger') {
      deleteQuote(id);
      currentListItem.remove();

    // Updating the likes count of a quote
    } else if (event.target.className === 'btn-success') {
      let likesCount = parseInt(currentListItem.dataset.likesCount);
      likesCount++;
      updateLikesCount(id, likesCount).then(quoteObj => {
        currentListItem.dataset.likesCount = quoteObj["likes"];
        let newLikesText = `Likes: ${quoteObj["likes"]}`;
        let likeButton = currentListItem.querySelector('button.btn-success');
        likeButton.innerText = newLikesText;
      });

    // BONUS

    // Updating the content of a quote

    // } else if (event.target.className === 'btn-edit') {
    //   editForm = !editForm;
    //   if (editForm) {
    //     editFormContainer.style.display = "block";
    //     editQuoteFormTag.addEventListener('submit', event => {
    //       event.preventDefault();
    //       let newQuoteContent = currentListItem.querySelector('input#edit-quote').value;
    //       let newQuoteAuthor = currentListItem.querySelector('input#edit-author').value;
    //       updateQuote(id, newQuoteContent, newQuoteAuthor).then(quoteObj => {
    //         // <p class="mb-0">${quoteObj["quote"]}</p>
    //         // <footer class="blockquote-footer">${quoteObj["author"]}</footer>
    //         let pQuoteTag = currentListItem.querySelector('p.mb-0');
    //         pQuoteTag.innerText = `${quoteObj["quote"]}`;
    //         let footerTag = currentListItem.querySelector('footer.blockquote-footer');
    //         footerTag.innerText = `${quoteObj["author"]}`;
    //       });
    //     });
    //   } else {
    //     editFormContainer.style.display = "none";
    //   };

    };

  }); // This is the closing tag for the ul tag event

}); // This is the closing tag for the document event
