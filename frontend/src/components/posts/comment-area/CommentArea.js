import PropTypes from 'prop-types';
import { FaRegCommentAlt } from 'react-icons/fa';
import '@components/posts/comment-area/CommentArea.scss';
import Reactions from '../reactions/Reactions';
import { useCallback, useEffect, useState } from 'react';
import { find } from 'lodash';
import { Utils } from '@services/utils/utils.service';
import { reactionsMap } from '@services/utils/static.data';
import { useSelector } from 'react-redux';

const CommentArea = ({ post }) => {
  const { reactions } = useSelector((state) => state.userPostReactions);
  const [userSelectedReaction, setUserSelectedReaction] = useState('');

  const selectedUserReaction = useCallback(
    (postReactions) => {
      const userReaction = find(postReactions, (reaction) => reaction.postId === post._id);
      const result = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : '';
      setUserSelectedReaction(result);
    },
    [post]
  );

  const addReactionPost = async (reaction) => {};

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [selectedUserReaction, reactions]);

  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block">
          <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
            {userSelectedReaction && (
              <div className={`reaction-display ${userSelectedReaction.toLowerCase()}`} data-testid="selected-reaction">
                <img className="reaction-img" src={reactionsMap[userSelectedReaction.toLowerCase()]} alt="" />
                <span>{userSelectedReaction}</span>
              </div>
            )}
            {!userSelectedReaction && (
              <div className="reaction-display" data-testid="default-reaction">
                <img className="reaction-img" src={`${reactionsMap.like}`} alt="" /> <span>Like</span>
              </div>
            )}
          </div>
        </div>
        <div className="reactions-container app-reactions">
          <Reactions handleClick={addReactionPost} />
        </div>
      </div>
      <div className="comment-block">
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
      </div>
    </div>
  );
};

CommentArea.propTypes = {
  post: PropTypes.object
};

export default CommentArea;
