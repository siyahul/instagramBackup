import {
  UPDATE_POSTS,
  LIST_POSTS_REQUESTS,
  LIST_POSTS_SUCCESS,
  LIST_POSTS_FAIL,
} from "../Constants/postConstants";

export const postUpdate = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_POSTS,
    payload: data,
  });
};

export const fetchPosts = (data) => async (dispatch,getState) => {
    const value = Object.values(data)[0]
    const newValue = value.map((post) =>{
      const {userSignIn:{userInfo}} = getState();
      const liked = post.likes.find(like => like.userId === userInfo?.id)
      if(liked){
        return {...post,liked: true}
      }else{
        return {...post,liked: false}
      }
    })
    
    dispatch({
      type:LIST_POSTS_SUCCESS,
      payload: newValue,
    })
};
