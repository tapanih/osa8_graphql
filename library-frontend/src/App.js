import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')

  const authors = useQuery(ALL_AUTHORS)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App