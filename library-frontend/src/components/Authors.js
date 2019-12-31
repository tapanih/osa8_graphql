import React, { useState } from 'react'
import { printIntrospectionSchema } from 'graphql'

const Authors = ({ show, result, editAuthor }) => {
  const [ born, setBorn ] = useState('')
  const [ selected, setSelected ] = useState('')

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const submit = async (e) => {
    e.preventDefault()

    await editAuthor({
      variables: {
        name: selected,
        setBornTo: Number(born)
      }
    })

    setBorn('')
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <select
          value={selected}
          onChange={({ target }) => setSelected(target.value)}>
          {authors.map(a =>
            <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
        <input
          type="number"
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors