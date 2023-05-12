import {  useQuery } from '@apollo/client'
import { FAVORITE, ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Reccom = (props) => {
    const result = useQuery(ALL_BOOKS)
    const fav = useQuery(FAVORITE)

    

    if (!props.show) {
        return null
    }
    
    if (result.loading && fav.loading) {
        return <div>loading...</div>
    }
    
    const books = result.data.allBooks
    const genre = fav.data.me.favoriteGenre

    const reccs = () => {
      let fav
      books.forEach(a => {
        let flag = false
        a.genres.forEach(b => {
          if(b === genre) {
            flag = true
            return
          }
        })
        if(flag){
           fav = a
        }
      })
      return fav
    }
    
    const favorite = reccs()

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
              <tr key={favorite.title}>
                <td>{favorite.title}</td>
                <td>{favorite.author.name}</td>
                <td>{favorite.published}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    
}

export default Reccom