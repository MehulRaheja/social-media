import { createSearchParams } from 'react-router-dom';

export class ProfileUtils {
  static navigateToProfile(data, navigate) {
    const url = `/app/social/profile/${data?.username}`;
    navigate({ pathname: url, search: `?${createSearchParams({ id: data?._id, uId: data?.uId })}` });
  }
}
