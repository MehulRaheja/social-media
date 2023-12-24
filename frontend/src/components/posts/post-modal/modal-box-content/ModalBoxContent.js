import Avatar from '@components/avatar/Avatar';
import SelectDropdown from '@components/select-dropdown/SelectDropdown';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { privacyList } from '@services/utils/static.data';
import { find } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ModalBoxContent = () => {
  const { profile } = useSelector((state) => state.user);
  const { privacy } = useSelector((state) => state.post);
  const { feeling } = useSelector((state) => state.modal);
  const privacyRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState({
    topText: 'Public',
    subText: 'Anyone on Socialiser',
    icon: <FaGlobe className="globe-icon globe" />
  });
  const [togglePrivacy, setTogglePrivacy] = useDetectOutsideClick(privacyRef, false);

  const displayPostPrivacy = useCallback(() => {
    if (privacy) {
      const postPrivacy = find(privacyList, (data) => data.topText === privacy);
      setSelectedItem(postPrivacy);
    }
  }, [privacy]);

  useEffect(() => {
    displayPostPrivacy();
  }, [displayPostPrivacy]);

  return (
    <div className="modal-box-content" data-testid="modal-box-content">
      <div className="user-post-image" data-testid="box-avatar">
        <Avatar
          name={profile?.username}
          bgColor={profile?.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={profile?.profilePicture}
        />
      </div>
      <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
          {profile?.username}
        </h5>
        {feeling?.name ? (
          <p className="inline-display" data-testid="box-feeling">
            is feeling <img className="feeling-icon" src={`${feeling?.image}`} alt="" /> <span>{feeling?.name}</span>
          </p>
        ) : null}
        <div
          data-testid="box-text-display"
          className="time-text-display"
          onClick={() => setTogglePrivacy(!togglePrivacy)}
        >
          <div className="selected-item-text" data-testid="box-item-text">
            {selectedItem.topText}
          </div>
          <div ref={privacyRef}>
            <SelectDropdown isActive={togglePrivacy} items={privacyList} setSelectedItem={setSelectedItem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBoxContent;
