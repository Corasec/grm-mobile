/**
 * Files (photo / document / audio) added to an issue action: a step, a rejection, a resolution
 * or an escalation. They are uploaded as issue attachments whose description says which action
 * they document, e.g. "Étape : réunion avec le chef de village".
 */

export type AttachmentActionType = 'record_steps' | 'reject' | 'record_resolution' | 'escalate';

const ACTION_LABEL_KEYS: Record<AttachmentActionType, string> = {
  record_steps: 'attachment_for_step',
  reject: 'attachment_for_rejection',
  record_resolution: 'attachment_for_resolution',
  escalate: 'attachment_for_escalation',
};

// Same limit as the server (IssueAttachment.description)
export const ATTACHMENT_DESCRIPTION_MAX_LENGTH = 500;

export function isAttachmentAction(type: string | null | undefined): type is AttachmentActionType {
  return !!type && type in ACTION_LABEL_KEYS;
}

/** "<Action> : <text>" (text optional), cut to the server limit. */
export function actionAttachmentDescription(
  type: AttachmentActionType,
  text: string | null | undefined,
  t: (key: string) => string
): string {
  const label = t(ACTION_LABEL_KEYS[type]);
  const details = (text ?? '').trim();
  return (details ? `${label} : ${details}` : label).slice(0, ATTACHMENT_DESCRIPTION_MAX_LENGTH);
}

/** Attachments to create for the file and/or the audio recording picked in an action dialog. */
export function buildActionAttachments({
  attachment,
  recordingURI,
  parentId,
  description,
}: {
  attachment?: { uri?: string } | null;
  recordingURI?: string | null;
  parentId: string | number;
  description: string;
}) {
  const files: { uri: string; isAudio: boolean }[] = [];
  if (attachment?.uri) files.push({ uri: attachment.uri, isAudio: false });
  if (recordingURI) files.push({ uri: recordingURI, isAudio: true });

  return files.map(({ uri, isAudio }) => {
    const name = uri.split('/').pop() || uri;
    return {
      id: '',
      name,
      file_name: name,
      is_audio: isAudio,
      local_url: uri,
      url: '',
      parent_id: String(parentId),
      created_date: '',
      description,
    };
  });
}
