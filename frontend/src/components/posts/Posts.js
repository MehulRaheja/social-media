import PropTypes from 'prop-types';
import '@components/posts/Posts.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import Post from '@components/posts/post/Post';
import { PostUtils } from '@services/utils/post-utils.service';
import PostSkeleton from '@components/posts/post/PostSkeleton';

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading, following, loading, profile]);

  return (
    <div className="posts-container" data-testid="posts">
      {!loading && posts.length
        ? posts.map((post) => (
            <div key={Utils.generateString(10)} data-testid="posts-item">
              {(!Utils.checkIfUserIsFollowed(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
                <>
                  {PostUtils.checkPrivacy(post, profile, following) && (
                    <>
                      <Post post={post} showIcons={true} />
                    </>
                  )}
                </>
              )}
            </div>
          ))
        : null}

      {loading && !posts.length
        ? [1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <PostSkeleton />
            </div>
          ))
        : null}
    </div>
  );
};

Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool
};

export default Posts;
