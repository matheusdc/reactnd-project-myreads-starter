import React from 'react';
import SearchBar from '../components/SearchBar';
import Bookshelf from '../components/Bookshelf';

const SearchPage = (props) => {
    return (
        <div>
            <SearchBar searchBook={props.searchBook}/>
            <div className="list-books-content">
                <Bookshelf title="Search Results..." books={props.searchResults} 
                    updateBookshelf={props.updateBookshelf} />
            </div>
        </div>
    );
}

export default SearchPage;
