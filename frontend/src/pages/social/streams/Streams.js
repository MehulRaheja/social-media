import { useEffect, useRef, useState } from 'react';
import '@pages/social/streams/Streams.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSuggestions } from '@redux/api/suggestion';
import useEffectOnce from '@hooks/useEffectOnce';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import { getPosts } from '@redux/api/posts';
import { uniqBy } from 'lodash';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';

const Streams = () => {
  const { allPosts } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  const pageCount = useRef(1); // state was time updating on time, so we used ref for page count
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  let appPosts = useRef([]);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  const storedUsername = useLocalStorage('username', 'get');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 10;

  // function declaration is used here, because hoisting will throw an error, because function is used in infinite scroll hook,
  // that function can not be used before difining it,
  // but with function declaration we can do that
  function fetchPostData() {
    let pageNum = pageCount.current;
    if (pageCount.current <= Math.ceil(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      // setCurrentPage(pageNum);
      pageCount.current = pageNum;
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try {
      // const response = await postService.getAllPosts(currentPage);
      const response = await postService.getAllPosts(pageCount.current);
      if (response.data.posts.length) {
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id'); // remove all the duplicate posts on basis of _id
        setPosts(allPosts);
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getReactionsByUsername = async () => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getReactionsByUsername();
  });

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getUserSuggestions());
  }, [dispatch]);

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    setPosts(allPosts?.posts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{ backgroundColor: 'white' }}>
          <PostForm />
          <Posts allPosts={posts} userFollowing={[]} postsLoading={loading} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
