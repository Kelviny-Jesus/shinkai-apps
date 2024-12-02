import { httpClient } from '../../http-client';
import { urlJoin } from '../../utils/url-join';
import {
  AddToolRequest,
  CreatePromptRequest,
  CreatePromptResponse,
  CreateToolCodeRequest,
  CreateToolCodeResponse,
  CreateToolMetadataRequest,
  CreateToolMetadataResponse,
  DeletePromptRequest,
  ExecuteToolCodeRequest,
  ExecuteToolCodeResponse,
  GetAllPromptsResponse,
  GetPlaygroundToolRequest,
  GetPlaygroundToolResponse,
  GetPlaygroundToolsResponse,
  GetToolResponse,
  GetToolsResponse,
  PayInvoiceRequest,
  SaveToolCodeRequest,
  SaveToolCodeResponse,
  SearchPromptsResponse,
  UndoToolImplementationRequest,
  UndoToolImplementationResponse,
  UpdatePromptRequest,
  UpdateToolCodeImplementationRequest,
  UpdateToolCodeImplementationResponse,
  UpdateToolRequest,
  UpdateToolResponse,
} from './types';

export const createTool = async (
  nodeAddress: string,
  bearerToken: string,
  payload: AddToolRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/add_shinkai_tool'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as UpdateToolResponse;
};

export const getTool = async (
  nodeAddress: string,
  bearerToken: string,
  toolKey: string,
) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/get_shinkai_tool'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params: { tool_name: toolKey },
      responseType: 'json',
    },
  );
  return response.data as GetToolResponse;
};

export const getTools = async (nodeAddress: string, bearerToken: string) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/list_all_shinkai_tools'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as GetToolsResponse;
};

export const searchTools = async (
  nodeAddress: string,
  bearerToken: string,
  query: string,
) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/search_shinkai_tool'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params: { query },
      responseType: 'json',
    },
  );
  return response.data as GetToolsResponse;
};

export const updateTool = async (
  nodeAddress: string,
  bearerToken: string,
  toolKey: string,
  payload: UpdateToolRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/set_shinkai_tool'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params: { tool_name: encodeURI(toolKey) },
      responseType: 'json',
    },
  );
  return response.data as UpdateToolResponse;
};

export const payInvoice = async (
  nodeAddress: string,
  bearerToken: string,
  payload: PayInvoiceRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/pay_invoice'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data;
};
export const getAllPrompts = async (
  nodeAddress: string,
  bearerToken: string,
) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/get_all_custom_prompts'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as GetAllPromptsResponse;
};

export const searchPrompt = async (
  nodeAddress: string,
  bearerToken: string,
  query: string,
) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/search_custom_prompts'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params: { query },
      responseType: 'json',
    },
  );
  return response.data as SearchPromptsResponse;
};

export const createPrompt = async (
  nodeAddress: string,
  bearerToken: string,
  payload: CreatePromptRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/add_custom_prompt'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as CreatePromptResponse;
};
export const updatePrompt = async (
  nodeAddress: string,
  bearerToken: string,
  payload: UpdatePromptRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/update_custom_prompt'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data;
};

export const removePrompt = async (
  nodeAddress: string,
  bearerToken: string,
  payload: DeletePromptRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/delete_custom_prompt'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data;
};

export const toolImplementation = async (
  nodeAddress: string,
  bearerToken: string,
  payload: CreateToolCodeRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/tool_implementation'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as CreateToolCodeResponse;
};
export const toolMetadataImplementation = async (
  nodeAddress: string,
  bearerToken: string,
  payload: CreateToolMetadataRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/tool_metadata_implementation'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as CreateToolMetadataResponse;
};

export const executeToolCode = async (
  nodeAddress: string,
  bearerToken: string,
  payload: ExecuteToolCodeRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/code_execution'),
    payload,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        // TODO: remove hardcoded values
        'x-shinkai-app-id': 'app-test',
        'x-shinkai-tool-id': 'tool-test',
      },
      responseType: 'json',
    },
  );
  return response.data as ExecuteToolCodeResponse;
};

export const saveToolCode = async (
  nodeAddress: string,
  bearerToken: string,
  payload: SaveToolCodeRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/set_playground_tool'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as SaveToolCodeResponse;
};
export const getPlaygroundTools = async (
  nodeAddress: string,
  bearerToken: string,
) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/list_playground_tools'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as GetPlaygroundToolsResponse;
};

export const getPlaygroundTool = async (
  nodeAddress: string,
  bearerToken: string,
  payload: GetPlaygroundToolRequest,
) => {
  const response = await httpClient.get(
    urlJoin(nodeAddress, '/v2/get_playground_tool'),
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params: { tool_key: payload.tool_key },
      responseType: 'json',
    },
  );
  return response.data as GetPlaygroundToolResponse;
};

export const restoreToolConversation = async (
  nodeAddress: string,
  bearerToken: string,
  payload: UndoToolImplementationRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/tool_implementation_undo_to'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as UndoToolImplementationResponse;
};

export const updateToolCodeImplementation = async (
  nodeAddress: string,
  bearerToken: string,
  payload: UpdateToolCodeImplementationRequest,
) => {
  const response = await httpClient.post(
    urlJoin(nodeAddress, '/v2/tool_implementation_code_update'),
    payload,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
      responseType: 'json',
    },
  );
  return response.data as UpdateToolCodeImplementationResponse;
};
