import { useTranslation } from '@shinkai_network/shinkai-i18n';
import { useGetInboxes } from '@shinkai_network/shinkai-node-state/v2/queries/getInboxes/useGetInboxes';
import { useGetLLMProviders } from '@shinkai_network/shinkai-node-state/v2/queries/getLLMProviders/useGetLLMProviders';
import {
  Button,
  // ChatBubbleIcon,
  // DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuPortal,
  // DropdownMenuTrigger,
  // JobBubbleIcon,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shinkai_network/shinkai-ui';
import { ActiveIcon, ArchiveIcon } from '@shinkai_network/shinkai-ui/assets';
// import { cn } from '@shinkai_network/shinkai-ui/utils';
import { Plus } from 'lucide-react';
import React, { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../store/auth/auth';
// import { EditInboxNameDialog } from '../edit-inbox-name-dialog/edit-inbox-name-dialog';
import { EmptyAgents } from '../empty-agents/empty-agents';
import { EmptyInboxes } from '../empty-inboxes/empty-inboxes';
import { ActiveInboxItem, ArchiveInboxItem } from './inbox-item';

export const Inboxes = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const auth = useAuth((state) => state.auth);
  const dialContainerRef = useRef<HTMLDivElement>(null);
  // const [dialOpened, setDialOpened] = useState<boolean>(false);
  const sender = auth?.shinkai_identity ?? '';
  // const [isEditInboxNameDialogOpened, setIsEditInboxNameDialogOpened] =
  //   useState<{ isOpened: boolean; inboxId: string; name: string }>({
  //     isOpened: false,
  //     inboxId: '',
  //     name: '',
  //   });
  const {
    inboxes,
    isSuccess: isInboxesSuccess,
    isPending: isInboxesPending,
  } = useGetInboxes({
    nodeAddress: auth?.node_address ?? '',
    token: auth?.api_v2_key ?? '',
  });
  const { llmProviders, isSuccess: isAgentsSuccess } = useGetLLMProviders({
    nodeAddress: auth?.node_address ?? '',
    token: auth?.api_v2_key ?? '',
  });

  const onCreateJobClick = () => {
    navigate('/inboxes/create-job');
  };
  // const onCreateInboxClick = () => {
  //   navigate('/inboxes/create-inbox');
  // };

  // const openEditInboxNameDialog = (inboxId: string, name: string) => {
  //   setIsEditInboxNameDialogOpened({
  //     isOpened: true,
  //     inboxId: decodeURIComponent(inboxId),
  //     name: name,
  //   });
  // };
  // const closeEditInboxNameDialog = () => {
  //   setIsEditInboxNameDialogOpened({
  //     isOpened: false,
  //     inboxId: '',
  //     name: '',
  //   });
  // };
  // const editInboxNameClick = (
  //   event: React.MouseEvent,
  //   inboxId: string,
  //   name: string,
  // ) => {
  //   event.stopPropagation();
  //   openEditInboxNameDialog(inboxId, name);
  // };

  const activesInboxes = useMemo(() => {
    return inboxes?.filter((inbox) => !inbox.is_finished);
  }, [inboxes]);

  const archivesInboxes = useMemo(() => {
    return inboxes?.filter((inbox) => inbox.is_finished);
  }, [inboxes]);

  return (
    <div className="flex h-full flex-col justify-between space-y-3 overflow-hidden">
      {isAgentsSuccess &&
        isInboxesSuccess &&
        !llmProviders?.length &&
        !inboxes.length && <EmptyAgents data-testid="empty-agents" />}

      {isInboxesSuccess &&
        isAgentsSuccess &&
        !inboxes?.length &&
        llmProviders?.length > 0 && (
          <EmptyInboxes data-testid="empty-inboxes" />
        )}

      {isInboxesPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              className="mb-1 flex h-[69px] items-center justify-between gap-2 rounded-lg bg-gray-400 py-3"
              key={idx}
            />
          ))}
        </div>
      )}

      {isInboxesSuccess && inboxes.length > 0 && (
        <div className="flex grow flex-col overflow-hidden">
          <ScrollArea className="pr-4 [&>div>div]:!block">
            <Tabs defaultValue="actives">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  className="flex items-center gap-1.5"
                  value="actives"
                >
                  <ActiveIcon className="h-4 w-4" />
                  {t('chat.actives.label')}
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-1.5"
                  value="archives"
                >
                  <ArchiveIcon className="h-4 w-4" />
                  {t('chat.archives.label')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="actives">
                <div className="space-y-4" data-testid="inboxes-container">
                  {activesInboxes?.length ? (
                    activesInboxes.map((inbox) => (
                      <ActiveInboxItem inbox={inbox} key={inbox.inbox_id} />
                    ))
                  ) : (
                    <p className="py-5 text-center">
                      {t('chat.actives.notFound')}{' '}
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="archives">
                <div className="space-y-4" data-testid="inboxes-container">
                  {archivesInboxes?.length ? (
                    archivesInboxes.map((inbox) => (
                      <ArchiveInboxItem inbox={inbox} key={inbox.inbox_id} />
                    ))
                  ) : (
                    <p className="py-5 text-center">
                      {t('chat.archives.notFound')}{' '}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      )}
      <div className="fixed bottom-4 right-4" ref={dialContainerRef}>
        {/* auth?.shinkai_identity.includes('localhost') ? (*/}
        <Button
          className="h-[60px] w-[60px]"
          onClick={() => onCreateJobClick()}
          size="icon"
        >
          <Plus />
        </Button>
        {/*) : (*/}
        {/*  <DropdownMenu onOpenChange={(isOpen) => setDialOpened(isOpen)}>*/}
        {/*    <DropdownMenuTrigger asChild>*/}
        {/*      <Button className="h-[60px] w-[60px]" size="icon">*/}
        {/*        <Plus*/}
        {/*          className={cn(*/}
        {/*            'h-7 w-7 transition-transform',*/}
        {/*            dialOpened && 'rotate-45',*/}
        {/*          )}*/}
        {/*        />*/}
        {/*      </Button>*/}
        {/*    </DropdownMenuTrigger>*/}
        {/*    <DropdownMenuPortal container={dialContainerRef.current}>*/}
        {/*      <DropdownMenuContent align="end" className="px-2.5 py-2">*/}
        {/*        <DropdownMenuItem onClick={() => onCreateJobClick()}>*/}
        {/*          <JobBubbleIcon className="mr-2 h-4 w-4" />*/}
        {/*          <span>*/}
        {/*            <FormattedMessage id="create-job" />*/}
        {/*          </span>*/}
        {/*        </DropdownMenuItem>*/}
        {/*        <DropdownMenuItem onClick={() => onCreateInboxClick()}>*/}
        {/*          <ChatBubbleIcon className="mr-2 h-4 w-4" />*/}
        {/*          <span>*/}
        {/*            <FormattedMessage id="create-inbox" />*/}
        {/*          </span>*/}
        {/*        </DropdownMenuItem>*/}
        {/*      </DropdownMenuContent>*/}
        {/*    </DropdownMenuPortal>*/}
        {/*  </DropdownMenu>*/}
        {/*)}*/}
      </div>
      {/*<EditInboxNameDialog*/}
      {/*  inboxId={isEditInboxNameDialogOpened.inboxId || ''}*/}
      {/*  name={isEditInboxNameDialogOpened.name}*/}
      {/*  onCancel={() => closeEditInboxNameDialog()}*/}
      {/*  onSaved={() => closeEditInboxNameDialog()}*/}
      {/*  open={isEditInboxNameDialogOpened.isOpened}*/}
      {/*/>*/}
    </div>
  );
};
