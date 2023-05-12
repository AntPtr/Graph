import { useState } from 'react'
import { useApolloClient, useSubscription, useQuery, useMutation } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Reccom from './components/Reccom'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title}${addedBook.genres} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if(!token) {
    return(
      <div>
        <div>
          <Notify errorMessage={errorMessage} />
          <button onClick={() => setPage('login')}>login</button>
          <button onClick={() => setPage('books')}>books</button>
        </div>

        <div>
          {page === 'login'? <Login setError={notify} setToken={setToken}  /> : null}
          <Books show={page === 'books'} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => logout()}>logout</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('reccom')}>reccomandations</button>

      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />
 
      <NewBook show={page === 'add'} />

      <Reccom show={page === 'reccom'}/>

    </div>
  )
}

export default App
