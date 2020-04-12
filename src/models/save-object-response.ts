export interface SaveObjectResponse {
  bucket: string;
  objectName: string;
  wasSuccessful: boolean;
  errorMessage?: string;
}
