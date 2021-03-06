import {
  fetchPosts,
  createPost,
  revisePost,
  postUpvote,
  postDownvote,
  deletePost
} from '../../utils/ReadableAPI'

export const GET_POSTS = 'GET_POSTS'
export const ADD_POST = 'ADD_POST'
export const EDIT_POST = 'EDIT_POST'
export const UPVOTE_POST = 'UPVOTE_POST'
export const DOWNVOTE_POST = 'DOWNVOTE_POST'
export const REMOVE_POST = 'REMOVE_POST'

export const getPosts = () =>
  dispatch =>
  	fetchPosts()
      .then( posts =>
    		dispatch({
    			type: GET_POSTS,
    			posts
    		})
      )
    	.catch( () =>
      	alert('Error getting posts!')
  	  )

export const addPost = d =>
  dispatch =>
    createPost(d)
      .then( post =>
        dispatch({
          type: ADD_POST,
          post
        })
      )
      .catch( () =>
        alert('Error adding post!')
      )

export const editPost = d =>
  dispatch =>
    revisePost(d)
      .then( post =>
        dispatch({
          type: EDIT_POST,
          post
        })
      )
      .catch( () =>
        alert('Error editing post!')
      )

export const upvotePost = d =>
  dispatch =>
    postUpvote(d)
      .then( post =>
        dispatch({
          type: UPVOTE_POST,
          post
        })
      )
      .catch( () =>
        alert('Error upvoting post!')
      )

export const downvotePost = d =>
  dispatch =>
    postDownvote(d)
      .then( post =>
        dispatch({
          type: DOWNVOTE_POST,
          post
        })
      )
      .catch( () =>
        alert('Error downvoting post!')
      )

export const removePost = d =>
  dispatch =>
    deletePost(d)
      .then( post =>
        dispatch({
          type: REMOVE_POST,
          post
        })
      )
      .catch( () =>
        alert('Error removing post!')
      )
