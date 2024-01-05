import PropTypes from 'prop-types';
import CommentArea from '@components/posts/comment-area/CommentArea';
import ReactionsAndCommentsDisplay from '@components/posts/reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay';

const PostCommentSection = ({ post }) => {
  return (
    <div>
      <ReactionsAndCommentsDisplay post={post} />
      <CommentArea post={post} />
    </div>
  );
};

PostCommentSection.propTypes = {
  post: PropTypes.object
};

export default PostCommentSection;
