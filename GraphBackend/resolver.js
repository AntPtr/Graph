const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require ('./schemas/book')
const Author = require('./schemas/author')
const User = require('./schemas/user')
const jwt = require('jsonwebtoken')

const SECRET_WORD = 'X-Files'


const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if(!args.author && !args.genre)
          return Book.find({})
        if(!args.genre){
          const auth = await Author.findOne({ name: args.author })
          return Book.find( { author: auth.id } )
        }
        if(!args.author)
          return Book.find({ genres: { $in: args.genre } })
        if(args.author && args.genre){
          const auth = await Author.findOne({ name: args.author })
          return Book.find({ genres: { $in: args.genre } ,  author: auth.id })
        }
          
      },
      allAuthors: async() => Author.find( {} ),
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Author: {
      bookCount: async(root) => {
        return Book.collection.countDocuments({ author:  root._id  })
      }
    },
  
    Book: {
      author: async (root) => {
        return Author.findById(root.author)
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
        if (!context.currentUser){
          const error = {
            message: 'User not logged in'
          }
          throw new UserInputError(error.message, {
            invalidArgs: args.context,
          })
        }
  
        const fAuth = await Author.findOne({name: args.author})
        const fBook = await Book.findOne({title: args.title})
  
        console.log(fAuth)
        console.log(fBook)
          
        if(fAuth && !fBook){
          const nBook = new Book ({
            title: args.title,
            author: fAuth,
            genres: args.genres,
            published: args.published
            })
  
            try {
              await nBook.save()
            } catch (error) {
              throw new UserInputError(error.message, {
              invalidArgs: args,
              })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: nBook })

            return nBook
        }
  
        if(!fAuth && !fBook){
          const nAuth =new Author ({
            name: args.author
          })
  
          const nBook = new Book ({
            title: args.title,
            author: nAuth,
            genres: args.genres,
            published: args.published
            })
            try {
              await nAuth.save()
            } catch (error) {
              throw new UserInputError(error.message, {
                invalidArgs: args,
              })
            }
            try {
              await nBook.save()
            } catch (error) {
              throw new UserInputError(error.message, {
                invalidArgs: args,
              })
            }
          pubsub.publish('BOOK_ADDED', { bookAdded: nBook })

          return nBook
        }
  
        if(fAuth && fBook) {
          const error = {
            message: "Book already insert"
          }
          return new UserInputError(error.message, {
            invalidArgs: args.title + " already insert",
          })
        }
      },
        
      editAuthor: async(root, args, context) => {
        if (!context.currentUser){
          const error = {
            message: 'User not logged in'
          }
          throw new UserInputError(error.message, {
            invalidArgs: args.context,
          })
        }
  
        const auth = await Author.findOne({ name: args.name}) 
        if (!auth) {
          return null
        }
        auth.born = args.born
  
        try {
          await auth.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return auth
      },
  
      createUser: async(root, args) => {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre
        })
        try{
          user.save()
        }catch(error){
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return user
      },
  
      login: async(root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if ( !user || args.password !== 'molder' ) {
          throw new UserInputError("wrong credentials")
        }
        
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, SECRET_WORD) }
      }
    },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },  
}

module.exports = resolvers