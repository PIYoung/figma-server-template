import { makeDirectory, resourcePath } from '../utils';

export const generateDirs = () => {
  makeDirectory(resourcePath);
};
