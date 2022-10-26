import { S3Credentials } from '@urbit/api';
import { S3Client } from '@aws-sdk/client-s3';
import create from 'zustand';
import produce from 'immer';
import { FileStore, FileStoreFile } from '@/types/storage';

export function prefixEndpoint(endpoint: string) {
  return endpoint.match(/https?:\/\//) ? endpoint : `https://${endpoint}`;
}

export const useFileStore = create<FileStore>((set) => ({
  client: null,
  status: 'initial',
  files: {} as FileStoreFile[],
  createClient: (credentials: S3Credentials) => {
    const endpoint = new URL(prefixEndpoint(credentials.endpoint));
    const client = new S3Client({
      endpoint: {
        protocol: endpoint.protocol.slice(0, -1),
        hostname: endpoint.host,
        path: endpoint.pathname || '/',
      },
      // this is necessary for compatibility with other S3 providers
      region: 'us-east-1',
      apiVersion: '2006-03-01',
      credentials,
      forcePathStyle: true,
    });
    set({ client });
  },
  setStatus: (status) =>
    set(
      produce((draft) => {
        draft.status = status;
      })
    ),
  setFiles: (file) =>
    set(
      produce((draft) => {
        draft.files[file.key] = file;
      })
    ),
  setFileStatus: (file) =>
    set(
      produce((draft) => {
        const [key, status] = file;
        draft.files[key].status = status;
      })
    ),
  setFileURL: (file) =>
    set(
      produce((draft) => {
        const [key, url] = file;
        draft.files[key].url = url;
      })
    ),
}));
