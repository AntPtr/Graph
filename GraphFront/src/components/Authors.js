import {  useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_NUMBER } from '../queries'
import { useState } from 'react'
import Select from 'react-select';

const Birth = ({authors}) => {
 const [born, setBirth] = useState('')
 const [selectedOption, setSelectedOption] = useState(null);

 const options = authors.map(a => {
  return {
    value: a.name,
    label: a.name
  }
 })
 const [editAuthor] = useMutation(EDIT_NUMBER, {
  refetchQueries: [ { query: ALL_AUTHORS } ]
})

const editDate = async(event) => {
  event.preventDefault()
  const name = selectedOption.value
 
  editAuthor({ variables: { name, born } })


  setBirth('')
  setSelectedOption('')
}

const birth = () => {
  if (!selectedOption)
    return null
  return (
    <div>
      Born
      <input
        value={born}
        onChange={({ target }) => setBirth(Number(target.value))}
      />
      <button onClick={editDate} type="button">Save</button>
    </div>
  )
}
  
 return(
  <div>
     <h2>Set birthyear</h2>
     <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
    {birth()}
  </div>
 )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Birth authors={authors}/>
    </div>
  )
}

export default Authors
