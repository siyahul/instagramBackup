import {
  UPDATE_POSTS,
  LIST_POSTS_REQUESTS,
  LIST_POSTS_SUCCESS,
  LIST_POSTS_FAIL,
} from "../Constants/postConstants";
import axios from "axios";

export const postUpdate = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_POSTS,
    payload: data,
  });
};

export const fetchPosts = () => async (dispatch,getState) => {
  const {token} = getState().userSignIn.userInfo;
  axios
    .post(
      "http://192.168.1.12:5000",
      {
        query:
          " query {getNews{id caption image createdAt comments{ _id createdAt userName body}user{ id email userName photoUrl createdAt } likes{ _id userName userId createdAt } likesCount commentsCount}}",
      },
      {
        headers: { authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => {
      const posts = Object.values(data.data)[0];
      const newValue = posts.map((post) => {
        const {
          userSignIn: { userInfo },
        } = getState();
        const liked = post.likes.find((like) => like.userId === userInfo?.id);
        const likes = post.likes.map((like) => like.userId);
    
        if (liked) {
          return { ...post, liked: true, likes };
        } else {
          return { ...post, liked: false, likes };
        }
      });
    
      dispatch({
        type: LIST_POSTS_SUCCESS,
        payload: newValue,
      });

    }).catch(err=>{
      console.log(err);
    });
};
