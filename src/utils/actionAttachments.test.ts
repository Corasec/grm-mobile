import {
  ATTACHMENT_DESCRIPTION_MAX_LENGTH,
  actionAttachmentDescription,
  buildActionAttachments,
  isAttachmentAction,
} from './actionAttachments';

const t = (key: string) =>
  ({
    attachment_for_step: 'Étape',
    attachment_for_rejection: 'Rejet',
    attachment_for_resolution: 'Résolution',
    attachment_for_escalation: 'Remontée',
  }[key] ?? key);

describe('actionAttachmentDescription', () => {
  it('says which action the file documents', () => {
    expect(actionAttachmentDescription('record_steps', 'Réunion avec le chef de village', t)).toBe(
      'Étape : Réunion avec le chef de village'
    );
    expect(actionAttachmentDescription('reject', 'Hors projet', t)).toBe('Rejet : Hors projet');
  });

  it('keeps only the label without text', () => {
    expect(actionAttachmentDescription('escalate', '  ', t)).toBe('Remontée');
  });

  it('is cut to the server limit', () => {
    expect(actionAttachmentDescription('record_resolution', 'x'.repeat(800), t)).toHaveLength(
      ATTACHMENT_DESCRIPTION_MAX_LENGTH
    );
  });
});

describe('isAttachmentAction', () => {
  it('accepts the actions that can carry files only', () => {
    expect(isAttachmentAction('record_steps')).toBe(true);
    expect(isAttachmentAction('escalate')).toBe(true);
    expect(isAttachmentAction('accept')).toBe(false);
    expect(isAttachmentAction(null)).toBe(false);
  });
});

describe('buildActionAttachments', () => {
  it('creates one attachment per picked file and recording', () => {
    const items = buildActionAttachments({
      attachment: { uri: 'file:///data/photo-1.jpg' },
      recordingURI: 'file:///data/audio-1.m4a',
      parentId: 42,
      description: 'Étape : visite',
    });

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ name: 'photo-1.jpg', is_audio: false, parent_id: '42', description: 'Étape : visite' });
    expect(items[1]).toMatchObject({ name: 'audio-1.m4a', is_audio: true, local_url: 'file:///data/audio-1.m4a' });
  });

  it('creates nothing when no file was picked', () => {
    expect(buildActionAttachments({ attachment: {}, recordingURI: undefined, parentId: 1, description: '' })).toEqual([]);
  });
});
