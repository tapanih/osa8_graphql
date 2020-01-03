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

const Books = ({ show, result }) => {
  const [books, setBooks] = useState(null)
  const [genre, setGenre] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    const fetchData = async (genre) => {
      if (!genre) {
        setBooks(result.data.allBooks)
      } else {
        const { data } = await client.query({
          query: ALL_BOOKS,
          variables: { genreToSearch: genre }
        })
        setBooks(data.allBooks)
      }
    }
    fetchData(genre)
  }, [genre, client, result.data.allBooks])

  if (!show) {
    return null
  }

  if (result.loading || !books) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

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
        <div>
          {result.data.allBooks.map(b => b.genres)
                .reduce((flat, arr) => flat.concat(arr), [])
                .sort()
                .filter((i, p, arr) => !p || i !== arr[p-1])
                .map(genre =>
                  <button
                    value={genre}
                    onClick={({ target }) => setGenre(target.value)}
                    key={genre}>
                      {genre}
                  </button>)}
          <button onClick={() => setGenre(null)}>all books</button>
        </div>
    </div>
  )
}

export default Books