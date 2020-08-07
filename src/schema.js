const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query{
        getFilms(title:String):[Film]
        getUsers(email:String):[User]
        getDirectors(firstName:String,lastName:String):[Director]
        getGenres(genreName:String):[Genre]
    }
    input RegisterInput{
        username:String!
        email:String!
        password:String
        confirmPassword:String!
    }
    type Mutation{
        register(registerInput: RegisterInput):User!
        login(email:String!,password:String!):User!
        deleteUser(username:String!):String!
        toggleFilmOfList(title:String!):User

        createFilm(title:String!,year:String,img:String,,directorId:ID!,genreName:String!,synopsis:String!):Film!
        createDirector(firstName:String!,lastName:String!,birthYear:Int!,img:String):Director!
        createGenre(genreName:String!):Genre
    }
    type Film{
        id:ID!
        title:String
        year:String
        img:String
        synopsis:String
        director:Director
        genre:Genre
        createdAt:String
    }
    type Genre{
        id:ID!
        genreName:String!
        films:[Film]
    }
    type Director{
        id:ID!
        firstName:String!
        lastName:String!
        birthYear:Int!
        createdAt:String!
        films:[Film]
        img:String
    }
    type User{
        id:ID!
        username:String!
        email:String!
        token:String
        isAdmin:Boolean
        createdAt:String!
        filmsList:[Film]
    }
    
 `;
module.exports = typeDefs