import React from 'react';
import { Route, Link } from 'react-router-dom';

import * as BooksAPI from './BooksAPI';

import SearchPage from './screens/SearchPage';
import Bookshelf from './components/Bookshelf';

import './App.css';

class BooksApp extends React.Component {

  state = {
    currentlyReading: [],
    wantToRead: [],
    read: [],
    query: '',
    searchResults: []
  }

  filterBooksByShelf = (books, shelf) => {
    return books.filter((book) => {
      return (book.shelf === shelf);
    })
  }

  takeBookFromShelf = (updatedBook, shelf) => {
    delete updatedBook.shelf;
    return this.state[shelf].filter(book => updatedBook.id !== book.id);
  }

  addBookToShelf = (updatedBook, shelf) => {
    updatedBook.shelf = shelf;
    return this.state[shelf].concat([updatedBook]);
  }

  updateBookshelf = (evt, book) => {
    const newShelf = evt.target.value;

    BooksAPI.update(book, newShelf).then((result) => {
      const updatedShelfs = {};

      if (book.shelf) {
        updatedShelfs[book.shelf] = this.takeBookFromShelf(book, book.shelf);
      }

      if (newShelf !== 'none') {
        updatedShelfs[newShelf] = this.addBookToShelf(book, newShelf);
      }

      this.setState(updatedShelfs);
    })
  }

  searchShelf = (book, shelf) => {
    const booksFound = this.state[shelf].filter(bookInTheShelf => bookInTheShelf.id === book.id);
    if (booksFound.length > 0) {
      return booksFound[0];
    }
    return null;
  }

  searchBook = (evt) => {
    if (evt.target.value.length > 0) {
      BooksAPI.search(evt.target.value).then((rawSearchResults) => {

        if (!rawSearchResults || typeof rawSearchResults.error !== 'undefined') {
          return this.setState({ searchResults: [] });
        }
        // Checking if the book is not available in any other bookshelfs
        // API doesn't provide shelf property, so it displays shelfs incorrectly on search results
        const searchResults = rawSearchResults.map(book => {
          const currentlyReading = this.searchShelf(book, 'currentlyReading');
          const wantToRead = this.searchShelf(book, 'wantToRead');
          const read = this.searchShelf(book, 'read');
          return (currentlyReading || wantToRead || read || book);
        });

        this.setState({ searchResults });
      })
    }
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      const currentlyReading = this.filterBooksByShelf(books, 'currentlyReading');
      const wantToRead = this.filterBooksByShelf(books, 'wantToRead');
      const read = this.filterBooksByShelf(books, 'read');

      this.setState({ currentlyReading, wantToRead, read });
    })
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <SearchPage searchBook={this.searchBook}
            searchResults={this.state.searchResults}
            updateBookshelf={this.updateBookshelf} />
        )} />
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <Bookshelf title="Currently Reading" books={this.state.currentlyReading}
                  updateBookshelf={this.updateBookshelf} />
                <Bookshelf title="Want to Read" books={this.state.wantToRead}
                  updateBookshelf={this.updateBookshelf} />
                <Bookshelf title="Read" books={this.state.read}
                  updateBookshelf={this.updateBookshelf} />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    );
  }
}

export default BooksApp;
