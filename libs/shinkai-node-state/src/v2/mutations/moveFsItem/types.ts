import { Token } from '@shinkai_network/shinkai-message-ts/api/general/types';
import { MoveFsItemResponse } from '@shinkai_network/shinkai-message-ts/api/vector-fs/types';

export type MoveFsItemOutput = MoveFsItemResponse;

export type MoveFsItemInput = Token & {
  nodeAddress: string;
  originPath: string;
  destinationPath: string;
};
