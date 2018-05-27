import React from 'react'
import Book from './Book'

const Bookshelf = (props) => {
    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{props.title}</h2>
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {props.books.map(book => 
                        (<Book key={book.id} title={book.title} authors={book.authors} cover={book.imageLinks.smallThumbnail} />)
                    )}
                </ol>
            </div>
        </div>
    )
}

export default Bookshelf






