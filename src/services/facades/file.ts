import { FileApi } from '@services/apis';
import { ImageData } from '@components/molecules/InputImages';
import { FileUploadRequest } from '@services/types';

export const uploadImageIfNotUploaded = async (
  fileApi: ReturnType<typeof FileApi>,
  imageData: ImageData,
  query: FileUploadRequest,
): Promise<ImageData> => {
  if (imageData.file && imageData.hashId === undefined) {
    const { url, hashId } = await fileApi.uploadFile(imageData.file, query);

    URL.revokeObjectURL(imageData.src);

    return { src: url, hashId };
  }

  return imageData;
};
