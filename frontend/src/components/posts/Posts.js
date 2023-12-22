import PropTypes from 'prop-types';
import '@components/posts/Po./,sts.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import Post from '@components/posts/post/Post';

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {posts.map((post) => (
        <div key={Utils.generateString(10)} data-testid>
          <Post post={post} showIcons={false} />
        </div>
      ))}
    </div>
  );
};

Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool
};

export default Posts;
