import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// file is base64 string
// when we upload a file cloudinary will generate public id for us automatically & we can also set public id manually
// all file's public id will be set automatically and for user's profile picture we will manually set public id
export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve) => {
    // we will only use resolve and not reject, and handle errors where we use this function
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error); // we are not throwing an error here just returning the error. So that error handling can be done where the funciton is called
        resolve(result);
      }
    );
  });
}
