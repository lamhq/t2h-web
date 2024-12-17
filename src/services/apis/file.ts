import { throwIfError, FileResponse, FileUploadRequest } from '@services/types';
import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';

const FileApi = (ctx: ServiceContext) => {
  return {
    /**
     * Upload Image File
     * @param file - File
     * @param query - FileUploadRequest
     */
    uploadFile: async (file: File, query: FileUploadRequest): Promise<FileResponse> => {
      const formData = new FormData();

      formData.append('file', file);
      const response = await isofetch(ctx, 'POST', '/files/upload', {
        body: formData,
        query: query,
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default FileApi;
