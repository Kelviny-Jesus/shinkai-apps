import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@shinkai_network/shinkai-i18n';
import { LLMProviderInterface } from '@shinkai_network/shinkai-message-ts/api/jobs/types';
import {
  addAgentFormDefault,
  AddAgentFormSchema,
  addAgentSchema,
} from '@shinkai_network/shinkai-node-state/forms/agents/add-agent';
import { useScanOllamaModels } from '@shinkai_network/shinkai-node-state/lib/queries/scanOllamaModels/useScanOllamaModels';
import {
  Models,
  modelsConfig,
} from '@shinkai_network/shinkai-node-state/lib/utils/models';
import { useAddLLMProvider } from '@shinkai_network/shinkai-node-state/v2/mutations/addLLMProvider/useAddLLMProvider';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  TextField,
} from '@shinkai_network/shinkai-ui';
import { cn } from '@shinkai_network/shinkai-ui/utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../../store/auth/auth';

export const getModelObject = (
  model: Models | string,
  modelType: string,
): LLMProviderInterface => {
  switch (model) {
    case Models.OpenAI:
      return { OpenAI: { model_type: modelType } };
    case Models.TogetherComputer:
      return { TogetherAI: { model_type: modelType } };
    case Models.Ollama:
      return { Ollama: { model_type: modelType } };
    case Models.Groq:
      return { Groq: { model_type: modelType } };
    case Models.OpenRouter:
      return { OpenRouter: { model_type: modelType } };
    case Models.Claude:
      return { Claude: { model_type: modelType } };
    default:
      return { [model]: { model_type: modelType } };
  }
};

export const AddAgent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth((state) => state.auth);
  const form = useForm<AddAgentFormSchema>({
    resolver: zodResolver(addAgentSchema),
    defaultValues: addAgentFormDefault,
  });

  const {
    model: currentModel,
    isCustomModel: isCustomModelMode,
    modelType: currentModelType,
  } = form.watch();

  const {
    data: ollamaModels,
    isError: isOllamaModelsError,
    error: ollamaModelsError,
  } = useScanOllamaModels(
    {
      nodeAddress: auth?.node_address ?? '',
      sender: auth?.shinkai_identity ?? '',
      senderSubidentity: auth?.profile ?? '',
      shinkaiIdentity: auth?.shinkai_identity ?? '',
      my_device_encryption_sk: auth?.my_device_encryption_sk ?? '',
      my_device_identity_sk: auth?.my_device_identity_sk ?? '',
      node_encryption_pk: auth?.node_encryption_pk ?? '',
      profile_encryption_sk: auth?.profile_encryption_sk ?? '',
      profile_identity_sk: auth?.profile_identity_sk ?? '',
    },
    {
      enabled: !isCustomModelMode && currentModel === Models.Ollama,
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 0,
    },
  );

  useEffect(() => {
    if (isOllamaModelsError) {
      toast.error(
        'Failed to fetch local Ollama models. Please ensure Ollama is running correctly.',
        {
          description: ollamaModelsError?.message,
        },
      );
    }
  }, [isOllamaModelsError, ollamaModelsError?.message]);

  const { mutateAsync: addLLMProvider, isPending } = useAddLLMProvider({
    onSuccess: () => {
      navigate(
        { pathname: '/inboxes/create-job' },
        { state: { agentName: form.getValues().agentName } },
      );
    },
    onError: (error) => {
      toast.error(t('llmProviders.errors.createAgent'), {
        description: error?.response?.data?.message ?? error.message,
      });
    },
  });
  const modelOptions: { value: Models; label: string }[] = [
    {
      value: Models.OpenAI,
      label: 'OpenAI',
    },
    {
      value: Models.TogetherComputer,
      label: 'Together AI',
    },
    {
      value: Models.Ollama,
      label: 'Ollama',
    },
  ];
  const submit = async (values: AddAgentFormSchema) => {
    if (!auth) return;
    let model = getModelObject(values.model, values.modelType);
    if (isCustomModelMode && values.modelCustom && values.modelTypeCustom) {
      model = getModelObject(values.modelCustom, values.modelTypeCustom);
    }
    await addLLMProvider({
      nodeAddress: auth?.node_address ?? '',
      token: auth?.api_v2_key ?? '',
      agent: {
        allowed_message_senders: [],
        api_key: values.apikey,
        external_url: values.externalUrl,
        full_identity_name: `${auth.shinkai_identity}/${auth.profile}/agent/${values.agentName}`,
        id: values.agentName,
        perform_locally: false,
        storage_bucket_permissions: [],
        toolkit_permissions: [],
        model,
      },
    });
  };
  const [modelTypeOptions, setModelTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isCustomModelType, setIsCustomModelType] = useState(false);

  useEffect(() => {
    if (isCustomModelMode) {
      form.setValue('externalUrl', '');
      return;
    }
    if (currentModel === Models.Ollama) {
      form.setValue('externalUrl', modelsConfig[Models.Ollama].apiUrl);

      setModelTypeOptions(
        (ollamaModels ?? []).map((model) => ({
          label: model.model,
          value: model.model,
        })).concat({ label: 'Custom Model', value: 'custom' }),
      );
      return;
    }
    const modelConfig = modelsConfig[currentModel as Models];
    form.setValue('externalUrl', modelConfig.apiUrl);
    setModelTypeOptions(
      modelsConfig[currentModel as Models].modelTypes.map((modelType) => ({
        label: modelType.name,
        value: modelType.value,
      })).concat({ label: 'Custom Model', value: 'custom' }),
    );
  }, [currentModel, form, isCustomModelMode, ollamaModels]);
  useEffect(() => {
    if (!modelTypeOptions?.length) {
      return;
    }
    form.setValue('modelType', modelTypeOptions[0].value);
  }, [modelTypeOptions, form]);
  useEffect(() => {
    if (!modelTypeOptions?.length) {
      return;
    }
    form.setValue('agentName', currentModelType.replace(/[^a-zA-Z0-9_]/g, '_'));
  }, [form, currentModelType, modelTypeOptions?.length]);
  useEffect(() => {
    setIsCustomModelType(currentModelType === 'custom');
  }, [currentModelType]);

  return (
    <div className="flex h-full flex-col space-y-3">
      <Form {...form}>
        <form
          className="flex h-full flex-col justify-between space-y-3"
          onSubmit={form.handleSubmit(submit)}
        >
          <div className="flex grow flex-col space-y-3">
            <FormField
              control={form.control}
              name="isCustomModel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 py-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      id={'custom-model'}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div
                    className={cn(
                      'text-gray-80 space-y-1 text-sm leading-none',
                      field.value && 'text-white',
                    )}
                  >
                    <label htmlFor="custom-model">
                      {t('llmProviders.form.toggleCustomModel')}
                    </label>
                  </div>
                </FormItem>
              )}
            />
            {!isCustomModelMode && (
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      defaultValue={field.value as unknown as string}
                      disabled={isCustomModelMode}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormLabel>
                        {t('llmProviders.form.selectModel')}
                      </FormLabel>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={' '} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modelOptions.map((model) => (
                          <SelectItem
                            key={model.value}
                            value={model.value.toString()}
                          >
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!isCustomModelMode && (
              <FormField
                control={form.control}
                name="modelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('llmProviders.form.modelType')}</FormLabel>
                    <Select
                      defaultValue={field.value as unknown as string}
                      disabled={isCustomModelMode}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[150px] overflow-y-auto text-xs">
                        {modelTypeOptions.map((modelType) => (
                          <SelectItem
                            key={modelType.value}
                            value={modelType.value}
                          >
                            {modelType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isCustomModelMode && (
              <>
                <FormField
                  control={form.control}
                  name="modelCustom"
                  render={({ field }) => (
                    <TextField
                      field={field}
                      label={t('llmProviders.form.modelName')}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelTypeCustom"
                  render={({ field }) => (
                    <TextField
                      field={field}
                      label={t('llmProviders.form.modelId')}
                    />
                  )}
                />
              </>
            )}

            {isCustomModelType && (
              <FormField
                control={form.control}
                name="modelTypeCustom"
                render={({ field }) => (
                  <TextField
                    field={field}
                    label={t('llmProviders.form.customModelType')}
                  />
                )}
              />
            )}

            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <TextField
                  autoFocus
                  data-testid="agent-name-input"
                  field={field}
                  label={t('llmProviders.form.agentName')}
                />
              )}
            />

            <FormField
              control={form.control}
              name="externalUrl"
              render={({ field }) => (
                <TextField
                  field={field}
                  label={t('llmProviders.form.externalUrl')}
                />
              )}
            />

            <FormField
              control={form.control}
              name="apikey"
              render={({ field }) => (
                <TextField
                  field={field}
                  label={t('llmProviders.form.apiKey')}
                />
              )}
            />
          </div>
          <Button
            className="w-full"
            data-testid="add-agent-submit-button"
            disabled={isPending}
            isLoading={isPending}
            type="submit"
          >
            {t('llmProviders.add')}
          </Button>
        </form>
      </Form>
    </div>
  );
};
