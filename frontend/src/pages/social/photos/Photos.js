import GalleryImage from '@components/gallery-image/GalleryImage';
import useEffectOnce from '@hooks/useEffectOnce';
import '@pages/social/photos/Photos.scss';
import { followerService } from '@services/api/followers/follower-service';
import { postService } from '@services/api/post/post.service';
import { PostUtils } from '@services/utils/post-utils.service';
import { Utils } from '@services/utils/utils.service';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Photos = () => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getPostsWithImages = async () => {
    try {
      const response = await postService.getPostsWithImages(1);
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const postImageUrl = (post) => {
    const imageUrl = Utils.getImage(post?.imgId, post?.imageVersion);
    return post?.gifUrl ? post.gifUrl : imageUrl;
  };

  const emptyPost = (post) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || PostUtils.checkPrivacy(post, profile, following)
    );
  };

  useEffectOnce(() => {
    getPostsWithImages();
    getUserFollowing();
  });

  return (
    <>
      <div className="photos-container">
        <div className="photos">Photos</div>
        {posts.length && (
          <div className="gallery-images">
            {posts.map((post, index) => (
              <div
                key={Utils.generateString(10)}
                className={`${!emptyPost(post) ? 'empty-post-div' : ''}`}
                data-testid="gallery-images"
              >
                {(!Utils.checkIfUserIsFollowed(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
                  <>
                    {PostUtils.checkPrivacy(post, profile, following) && (
                      <>
                        <GalleryImage
                          post={post}
                          showCaption={true}
                          showDelete={false}
                          imgSrc={`${postImageUrl(post)}`}
                          onClick={() => {}}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && !posts.length ? <div className="card-element" style={{ height: '350px' }}></div> : null}

        {!loading && !posts.length ? (
          <div className="empty-page" data-testid="empty-page">
            There are no photos to display
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Photos;
