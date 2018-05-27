import React from 'react'
import { Route, Link } from 'react-router-dom'

import * as BooksAPI from './BooksAPI'

import SearchBar from './components/SearchBar';
import Bookshelf from './components/Bookshelf';

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
                <Bookshelf title="Currently Reading" books={this.state.currentlyReading} />
                <Bookshelf title="Want to Read" books={this.state.wantToRead} />
                <Bookshelf title="Read" books={this.state.read} />
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
