import React from 'react'
import { Route, Link } from 'react-router-dom'

import * as BooksAPI from './BooksAPI'

import SearchBar from './components/SearchBar'
import Bookshelf from './components/Bookshelf'

import './App.css'

class BooksApp extends React.Component {

  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  }

  filterBooksByShelf = (books, shelf) => {
    return books.filter((book) => {
      return (book.shelf === shelf)
    })
  }

  takeBookFromShelf = (updatedBook, shelf) => {
    return this.state[shelf].filter(book => updatedBook.id !== book.id)
  }

  updateBookshelf = (evt, book) => {
    const shelf = evt.target.value

    BooksAPI.update(book, shelf).then((result) => {
      const updatedShelfs = {};
      updatedShelfs[book.shelf] = this.takeBookFromShelf(book, book.shelf);
      updatedShelfs[shelf] = this.state[shelf].concat([book])
      book.shelf = shelf;
      this.setState(updatedShelfs)
    })
  }
  

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      const currentlyReading = this.filterBooksByShelf(books, 'currentlyReading')
      const wantToRead = this.filterBooksByShelf(books, 'wantToRead')
      const read = this.filterBooksByShelf(books, 'read')

      this.setState({ currentlyReading, wantToRead, read });
    })
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" component={SearchBar} />
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <Bookshelf title="Currently Reading" books={this.state.currentlyReading} 
                  updateBookshelf={this.updateBookshelf}/>
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
    )
  }
}

export default BooksApp
