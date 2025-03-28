import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useTranslation } from '@shinkai_network/shinkai-i18n';
import { DirectoryContent } from '@shinkai_network/shinkai-message-ts/api/vector-fs/types';
import {
  buttonVariants,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shinkai_network/shinkai-ui';
import {
  AISearchContentIcon,
  DirectoryTypeIcon,
  SharedFolderIcon,
} from '@shinkai_network/shinkai-ui/assets';
import { formatDateToUSLocaleString } from '@shinkai_network/shinkai-ui/helpers';
import { cn } from '@shinkai_network/shinkai-ui/utils';
import { CopyIcon, FolderInputIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useVectorFsStore, VectorFSLayout } from './node-file-context';
import { VectorFsFolderAction } from './vector-fs-drawer';

export const VectorFsFolderInfo = ({
  folder,
  totalItem,
  allowFolderNameOnly,
  layout,
}: {
  folder: DirectoryContent;
  totalItem?: number;
  allowFolderNameOnly?: boolean;
  layout?: VectorFSLayout;
}) => {
  return (
    <div className="flex-1 truncate text-left">
      <div className="truncate text-sm font-medium">{folder.name}</div>
      {layout === VectorFSLayout.List && !allowFolderNameOnly && (
        <p className="text-xs font-medium text-gray-100">
          <span>
            {formatDateToUSLocaleString(new Date(folder.created_time ?? ''))}
          </span>{' '}
          - <span>{totalItem} items</span>
        </p>
      )}
    </div>
  );
};

const VectorFsFolder = ({
  onClick,
  folder,
  handleSelectFolders,
  isSelectedFolder,
  isSharedFolder,
}: {
  onClick: () => void;
  folder: DirectoryContent;
  handleSelectFolders: (folder: DirectoryContent) => void;
  isSelectedFolder: boolean;
  isSharedFolder?: boolean;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setActiveDrawerMenuOption = useVectorFsStore(
    (state) => state.setActiveDrawerMenuOption,
  );
  const setSelectedFolder = useVectorFsStore(
    (state) => state.setSelectedFolder,
  );

  const layout = useVectorFsStore((state) => state.layout);
  const isVRSelectionActive = useVectorFsStore(
    (state) => state.isVRSelectionActive,
  );
  const wrapperClassName = cn(
    'flex items-center justify-between gap-2 truncate rounded-lg py-3.5 pr-2 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400',
    layout === VectorFSLayout.Grid && 'bg-gray-400/30 p-2',
  );
  const totalItem = (folder.children ?? [])?.length ?? 0;

  const FolderIcon = isSharedFolder ? SharedFolderIcon : DirectoryTypeIcon;

  if (isVRSelectionActive) {
    return (
      <div className={wrapperClassName}>
        <Checkbox
          checked={isSelectedFolder}
          id={`item-${folder.name}`}
          onCheckedChange={() => {
            handleSelectFolders(folder);
          }}
        />
        <label
          className="flex flex-1 items-center gap-3"
          htmlFor={`item-${folder.name}`}
        >
          <FolderIcon />
          <VectorFsFolderInfo
            folder={folder}
            layout={layout}
            totalItem={totalItem}
          />
        </label>
      </div>
    );
  }

  return (
    <button className={wrapperClassName} onClick={onClick}>
      <FolderIcon />
      <VectorFsFolderInfo
        folder={folder}
        layout={layout}
        totalItem={totalItem}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              buttonVariants({
                variant: 'tertiary',
                size: 'icon',
              }),
              'border-0 hover:bg-gray-500/40',
            )}
            onClick={(event) => {
              event.stopPropagation();
            }}
            role="button"
            tabIndex={0}
          >
            <span className="sr-only">{t('common.moreOptions')}</span>
            <DotsVerticalIcon className="text-gray-100" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[160px] border bg-gray-500 px-2.5 py-2"
        >
          {[
            {
              name: t('vectorFs.actions.move'),
              icon: <FolderInputIcon className="mr-3 h-4 w-4" />,
              onClick: () => {
                setActiveDrawerMenuOption(VectorFsFolderAction.Move);
              },
            },
            {
              name: t('vectorFs.actions.copy'),
              icon: <CopyIcon className="mr-3 h-4 w-4" />,
              onClick: () => {
                setActiveDrawerMenuOption(VectorFsFolderAction.Copy);
              },
            },
            {
              name: t('vectorFs.actions.searchWithinFolder'),
              icon: <AISearchContentIcon className="mr-3 h-4 w-4" />,
              onClick: () => {
                navigate('/search-node-files', {
                  state: {
                    folderPath: folder.path,
                  },
                });
              },
            },
            {
              name: t('vectorFs.actions.delete'),
              icon: <TrashIcon className="mr-3 h-4 w-4" />,
              onClick: () => {
                setActiveDrawerMenuOption(VectorFsFolderAction.Delete);
              },
            },
          ]
            .filter((item) => !!item)
            .map((option, idx) => (
              <React.Fragment key={option?.name}>
                {(idx === 3 || idx === 5 || idx === 2) && (
                  <DropdownMenuSeparator className="bg-gray-300" />
                )}
                <DropdownMenuItem
                  key={option?.name}
                  onClick={(event) => {
                    event.stopPropagation();
                    option?.onClick();
                    setSelectedFolder(folder);
                  }}
                >
                  {option?.icon}
                  {option?.name}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );
};

export default VectorFsFolder;
