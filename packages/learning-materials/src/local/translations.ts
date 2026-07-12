export interface LearningMaterialTranslations {
  mins: string;
}

const DEFAULT_TRANSLATIONS: LearningMaterialTranslations = {
  mins: 'mins',
};

let translations: LearningMaterialTranslations = { ...DEFAULT_TRANSLATIONS };

export function configureLearningMaterialsTranslations(
  overrides: Partial<LearningMaterialTranslations>,
): void {
  translations = { ...DEFAULT_TRANSLATIONS, ...overrides };
}

export function t(key: keyof LearningMaterialTranslations): string {
  return translations[key] ?? DEFAULT_TRANSLATIONS[key];
}
