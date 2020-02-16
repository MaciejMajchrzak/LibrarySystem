$(function () {
    const URL = 'http://localhost:51614/api/';    
    const booksTableBodyElement = $('#books-table-body');
    const bookButtonAddNew = $('#new-book-button');
    const bookButtonEdit = $(`#confirm-edit-book-button`)
    const bookButtonCancel = $(`#cancel-edit-book-button`)
    const inputAuthorElement = $('#book-author-input');
    const inputTitleElement = $('#book-title-input');
    const bookFormElement = $('#book-form');
    const readersTableBodyElement = $(`#readers-table-body`);
    const readerButtonAddNew = $('#new-reader-button');
    const readerButtonEdit = $(`#confirm-edit-reader-button`)
    const readerButtonCancel = $(`#cancel-edit-reader-button`)
    const inputNameElement = $('#reader-name-input');
    const inputAgeElement = $('#reader-age-input');
    const readerFormElement = $('#reader-form');
    const lendsTableBodyElement = $(`#lends-table-body`);
    
    function standardErrorHandler(xhr, err, status){
      console.error(xhr, err, status);
    }

    function getRowFromButton(button){
      return $(button).closest('[data-id]')
    }

    function createBookRow(book){
      return `<tr data-id="${book.ID}">
                <td>${book.Title}</td>
                <td>${book.Author}</td>
                <td>
                    <div class="button-group">
                        <button class="btn btn-primary btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                        <button class="btn btn-info btn-sm">Borrow</button>
                    </div>
                </td>
              </tr>`;
    }
  
    function createReaderRow(reader){
      return `<tr data-id="${reader.ID}">
                <td>${reader.Name}</td>
                <td>${reader.Age}</td>
                <td>
                    <div class="button-group">
                        <button class="btn btn-primary btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                        <button class="btn btn-info btn-sm">Borrow</button>
                    </div>
                </td>
              </tr>`;
    }

    function createLendRow(lend){
      return `<tr data-id="${lend.ID}">
                <td>${lend.Title}</td>
                <td>${lend.Name}</td>
                <td>${lend.LendDate}</td>
                <td>
                    <div class="button-group">
                        <button class="btn btn-warning btn-sm">Give</button>
                    </div>
                </td>
              </tr>`;
    }
  
    function loadBooksToTable(){
      $.getJSON(URL + `books`).done((books) => {
  
        books.forEach(book => {
          booksTableBodyElement.append(createBookRow(book));
        })
  
      }).fail(standardErrorHandler)
    }
  
    function loadReadersToTable(){
      $.getJSON(URL + `readers`).done((readers) => {
  
        readers.forEach(reader => {
          readersTableBodyElement.append(createReaderRow(reader));
        })
  
      }).fail(standardErrorHandler)
    }

    function loadLendsToTable(){
      $.getJSON(URL + `lend`).done((lends) => {
  
        lends.forEach(lend => {
          lendsTableBodyElement.append(createLendRow(lend));
        })
  
      }).fail(standardErrorHandler)
    }

    function activeBookButtonAddNew(){
      bookButtonAddNew.on('click',function(e){
        e.preventDefault();
        postBook();
        clearBoookForm();
      });
    }

    function activeBookButtonEdit(){
      bookButtonEdit.on('click',function(e){
        e.preventDefault();
        putBook();
        inactiveBookForm();
      });
    }

    function activeBookButtonCancel(){
      bookButtonCancel.on('click',function(e){
        e.preventDefault();
        inactiveBookForm();
      });
    }

    function clearBoookForm(){
      bookFormElement.removeData('id');
      inputAuthorElement.val('');
      inputTitleElement.val('');
    }

    function inactiveBookForm(){
      clearBoookForm();

      bookButtonAddNew.removeClass('d-none');
      bookButtonEdit.addClass('d-none');
      bookButtonCancel.addClass('d-none');
    }

    function activeReaderButtonAddNew(){
      readerButtonAddNew.on('click',function(e){
        e.preventDefault();
        postReader();
        clearReaderForm();
      });
    }

    function activeReaderButtonEdit(){
      readerButtonEdit.on('click',function(e){
        e.preventDefault();
        putReader();
        inactiveReaderForm();
      });
    }

    function activeReaderButtonCancel(){
      readerButtonCancel.on('click',function(e){
        e.preventDefault();
        inactiveReaderForm();
      });
    }

    function clearReaderForm(){
      readerFormElement.removeData('id');
      inputNameElement.val('');
      inputAgeElement.val('');
    }

    function inactiveReaderForm(){
      clearReaderForm();

      readerButtonAddNew.removeClass('d-none');
      readerButtonEdit.addClass('d-none');
      readerButtonCancel.addClass('d-none');
    }

    function getDataFromBookForm(){
      return {
        ID: bookFormElement.data('id'),
        Author: inputAuthorElement.val(),
        Title: inputTitleElement.val()
      };
    }

    function getDataFromReaderForm(){
      return {
        ID: readerFormElement.data('id'),
        Name: inputNameElement.val(),
        Age: inputAgeElement.val()
      };
    }

    function bookDataUrlString(book){
      return '?author='
        + encodeURIComponent(book.Author)
        + '&title='
        + encodeURIComponent(book.Title);
    }

    function readerDataUrlString(reader){
      return '?name='
        + encodeURIComponent(reader.Name)
        + '&age='
        + encodeURIComponent(reader.Age);
    }

    function lendDataUrlString(bookId, readerId){
      const date = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()}`;
      return '?bookid='
        + encodeURIComponent(bookId)
        + '&readerid='
        + encodeURIComponent(readerId)
        + '&lenddate='
        + encodeURIComponent(date);
    }
    
    function postBook(){
      const book = getDataFromBookForm();

      if(book.Title != "" && book.Author != ""){
        $.post(URL + `books` + bookDataUrlString(book))
        .done()
        .fail(standardErrorHandler);

        booksTableBodyElement.html(``);

        loadBooksToTable();
      }
    }

    function postReader(){
      const reader = getDataFromReaderForm();

      if(reader.Name != "" && reader.Age != ""){
        $.post(URL + `readers` + readerDataUrlString(reader))
        .done()
        .fail(standardErrorHandler);

        readersTableBodyElement.html(``);

        loadReadersToTable();
      }
    }

    function postLend(bookId, readerId){
      
      $.post(URL + `lend` + lendDataUrlString(bookId, readerId))
      .done()
      .fail(standardErrorHandler);

      lendsTableBodyElement.html(``);

      loadLendsToTable();
    }

    function activateBookDeleteButtons(){
      booksTableBodyElement.on('click', 'button.btn-danger',
        function(){
          const row = getRowFromButton(this);
          const id = row.data('id');
          $.ajax(URL + 'books/' + id, {
            type: 'DELETE'
          }).done(() => {
            row.remove();
          }).fail(standardErrorHandler)
        });
    }

    function activateReaderDeleteButtons(){
      readersTableBodyElement.on('click', 'button.btn-danger',
        function(){
          const row = getRowFromButton(this);
          const id = row.data('id');
          $.ajax(URL + 'readers/' + id, {
            type: 'DELETE'
          }).done(() => {
            row.remove();
          }).fail(standardErrorHandler)
        });
    }
    
    function setEditModeForBooks(book){
      bookFormElement.data('id', book.ID);
      inputAuthorElement.val(book.Author);
      inputTitleElement.val(book.Title);
  
      bookButtonAddNew.addClass('d-none');
      bookButtonEdit.removeClass('d-none');
      bookButtonCancel.removeClass('d-none');
    }

    function setEditModeForReaders(reader){
      readerFormElement.data('id', reader.ID);
      inputNameElement.val(reader.Name);
      inputAgeElement.val(reader.Age);
  
      readerButtonAddNew.addClass('d-none');
      readerButtonEdit.removeClass('d-none');
      readerButtonCancel.removeClass('d-none');
    }

    function getBookObjectFromRow(row){
      return {
        ID: row.data('id'),
        Title: row.children('td').eq(0).text(),
        Author: row.children('td').eq(1).text(),
      }
    }

    function getReaderObjectFromRow(row){
      return {
        ID: row.data('id'),
        Name: row.children('td').eq(0).text(),
        Age: row.children('td').eq(1).text(),
      }
    }

    function activateBookEditButtons(){
      booksTableBodyElement.on('click', 'button.btn-primary', 
      function(){
        const row = getRowFromButton(this);
        const book = getBookObjectFromRow(row);
        setEditModeForBooks(book);
      });
    }

    function activateReaderEditButtons(){
      readersTableBodyElement.on('click', 'button.btn-primary', 
      function(){
        const row = getRowFromButton(this);
        const book = getReaderObjectFromRow(row);
        setEditModeForReaders(book);
      });
    }

    function putBook(){
      const book = getDataFromBookForm();

      $.ajax(URL + 'books/' + book.ID + bookDataUrlString(book),
      {
        type: "PUT"
      })
      .done()
      .fail(standardErrorHandler);
      
      booksTableBodyElement.html(``);

      loadBooksToTable();
    }

    function putReader(){
      const reader = getDataFromReaderForm();

      $.ajax(URL + 'readers/' + reader.ID + readerDataUrlString(reader),
      {
        type: "PUT"
      })
      .done()
      .fail(standardErrorHandler);
      
      readersTableBodyElement.html(``);

      loadReadersToTable();
    }

    function activateBookBorrowButtons(){
      booksTableBodyElement.on('click', 'button.btn-info',
        function(){
          const row = getRowFromButton(this);
          const id = row.data('id');
          activateReaderBorrowButtons(id);
        });
    }

    function activateReaderBorrowButtons(bookId){
      readersTableBodyElement.on('click', 'button.btn-info',
        function(){
          const row = getRowFromButton(this);
          const id = row.data('id');
          postLend(bookId, id);
        });
    }

    function activateLendGiveButtons(){
      lendsTableBodyElement.on('click', 'button.btn-warning',
        function(){
          const row = getRowFromButton(this);
          const id = row.data('id');
          $.ajax(URL + 'lend/' + id, {
            type: 'DELETE'
          }).done(() => {
            row.remove();
          }).fail(standardErrorHandler)
        });
    }

    loadBooksToTable();
    loadReadersToTable();
    loadLendsToTable();
    activeBookButtonAddNew();
    activeBookButtonEdit();
    activeBookButtonCancel();
    activeReaderButtonAddNew();
    activeReaderButtonEdit();
    activeReaderButtonCancel();
    activateBookDeleteButtons();
    activateBookEditButtons();
    activateReaderDeleteButtons();
    activateReaderEditButtons();
    activateBookBorrowButtons();
    activateLendGiveButtons();
  });

  