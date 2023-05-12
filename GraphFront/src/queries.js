import { gql } from '@apollo/client'
 
export const ALL_AUTHORS = gql`
query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
query {
    allBooks {
    title
    published
    genres
    author{
      name
    }
    id
    }
  }
`

export const CREATE_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    id
    published
    genres
  }
}
`
export const EDIT_NUMBER = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password){
      value
    }
  }
  `

export const FAVORITE = gql`
query {
  me {
    favoriteGenre
  }
}
`
export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title
    id
    published
    genres
  }
}
`

