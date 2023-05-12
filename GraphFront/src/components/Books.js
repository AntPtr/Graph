import {  useQuery } from '@apollo/client'
import { ALL_BOOKS, useEffect } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState('')
  

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }


  const books = result.data.allBooks
  console.log(books)

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genre === ''? books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )): books.filter(a => a.genres === genre).map((a) =>(
            <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
          ))

          }
        </tbody>
      </table>
      {books.map((a) => (
          <button onClick={() => setGenre(a.genres)}>{a.genres}</button>
          ))}
     <button onClick={() => setGenre('')}>nessuno</button>
    </div>
  )
}

export default Books
