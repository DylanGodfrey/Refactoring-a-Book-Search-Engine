import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          email
          password
        }
      }
    }
`;

export const ADD_USER = gql`
    mutation Mutation($username: String!, $email: String!, $password: String!) {
      addUser(username: $username, email: $email, password: $password) {
        _id
        bookCount
        email
        password
      }
    }
`;
export const SAVE_BOOK = gql`
    mutation Mutation($description: String!, $title: String!, $bookId: String!, $image: String, $authors: [String]) {
      saveBook(description: $description, title: $title, bookId: $bookId, image: $image, authors: $authors) {
        _id
        username
        email
        password
        bookCount
        savedBooks {
          bookId
          authors 
          title
          description
          link
          image
        }
      }
    }
`;

export const REMOVE_BOOK = gql`
    mutation Login($bookId: String!) {
      removeBook(bookId: $bookId) {
        _id
        bookCount
        email
        password
        savedBooks {
          authors
          bookId
          description
          image
          link
          title
        }
      }
    }
`;