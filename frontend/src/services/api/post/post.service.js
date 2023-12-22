import axios from '@services/axios';

class PostService {
  async createPost(body) {
    const response = await axios.post('/post', body);
    return response;
  }

  async createPostWithImage(body) {
    const response = await axios.post('/post/image/post', body);
    return response;
  }
}

export const postService = new PostService();
