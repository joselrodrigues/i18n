import i18nService from './i18nService';

let changedLang = '';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('i18next', () => {
  return {
    __esModule: true,
    default: {
      createInstance: jest.fn().mockReturnValue({
        use: jest.fn().mockReturnValue({
          use: jest.fn().mockReturnValue({
            init: jest.fn(),
            changeLanguage: (language: string) => {
              changedLang = language;
            },
          }),
        }),
      }),
    },
  };
});

describe('i18nService', () => {
  beforeEach(() => {
    i18nService.registeredInstances.clear();
  });

  it('should create and register a new i18n instance if not already registered', () => {
    const instanceName = 'testInstance';
    const instance = i18nService.getOrCreateI18nInstance(
      instanceName,
      undefined,
    );

    expect(i18nService.registeredInstances.has(instanceName)).toBe(true);
    expect(i18nService.registeredInstances.get(instanceName)).toBe(instance);
  });

  it('should return an existing i18n instance if already registered', () => {
    const instanceName = 'testInstance';
    const instance1 = i18nService.getOrCreateI18nInstance(
      instanceName,
      undefined,
    );
    const instance2 = i18nService.getOrCreateI18nInstance(
      instanceName,
      undefined,
    );

    expect(instance1).toBe(instance2);
  });

  it('should return the current language of the first registered instance', () => {
    const instanceName = 'testInstance';
    const instance = i18nService.getOrCreateI18nInstance(
      instanceName,
      undefined,
    );

    const updateLang = ((lang: string) =>
      i18nService.changeLanguage(lang)).bind(instance);

    updateLang('es');

    expect(changedLang).toBe('es');
  });

  it('should change the language of all registered instances', () => {
    const instanceName1 = 'testInstance1';
    const defaultOptions = {
      debug: false,
      fallbackLng: 'ptBr',
      supportedLngs: ['ptBr', 'es'],
      interpolation: {
        escapeValue: false,
      },
    };

    const instance1 = i18nService.getOrCreateI18nInstance(
      instanceName1,
      defaultOptions,
    );

    const getCurrentLanguage = (() => i18nService.getCurrentLanguage()).bind(
      instance1,
    );

    expect(getCurrentLanguage()).toBe('ptBr');
  });
});
