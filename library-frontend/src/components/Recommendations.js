import React, {useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

const ALL_BOOKS = gql`
  query allBooksByGenre($genreToSearch: String!) {
    allBooks(genre: $genreToSearch) {
      title
      author {
        name
      }
      published
      id
      genres
    }
  }
`

const USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

const Recommendations = ({ show }) => {
  const [books, setBooks] = useState(null)
  const [user, setUser] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await client.query({
        query: USER
      })
      setUser(data.me)
    }
    fetchUser()
  }, [client])


  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await client.query({
        query: ALL_BOOKS,
        variables: { genreToSearch: user.favoriteGenre }
      })
      setBooks(data.allBooks)
    }
    if (user) {
      fetchBooks()
    }
  }, [client, user])

  if (!show) {
    return null
  }

  if (!books) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations