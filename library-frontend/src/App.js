import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import LoginForm from './components/LoginForm'

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  author {
    name
  }
  published
  genres
}
`

const ALL_BOOKS = gql`
  {
    allBooks {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')

  const client = useApolloClient()

  const handleError = (error) => {
    console.log(error.graphQLErrors[0].message)
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(book => book.title).includes(object.title)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      })
    }
  }

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    },
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
        <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
        </>
        :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
        editAuthor={editAuthor}
      />
      <Books
        show={page === 'books'}
        result={books}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

      <Recommendations
        show={page === 'recommend'}
        result={books}
      />

      <LoginForm
        show={page === 'login'}
        login={login}
        setToken={(token) => setToken(token)}
      />
    </div>
  )
}

export default App