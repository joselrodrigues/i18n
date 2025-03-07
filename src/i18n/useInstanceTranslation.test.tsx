import { useInstanceTranslation } from './useInstanceTranslation';
import i18nService from './i18nService';
import { useTranslation } from 'react-i18next';
import { Resource } from 'i18next';

jest.mock('./i18nService', () => ({
  getOrCreateI18nInstance: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useInstanceTranslation', () => {
  it('should call getOrCreateI18nInstance with correct params and return useTranslation', () => {
    const instanceName = 'testInstance';
    const resources: Resource = {
      en: {
        translation: {
          test: 'test',
        },
      },
    };

    const options = { key: 'value' };
    const filename = 'test';
    const mockI18nInstance = { language: 'en' };
    const expectedReturn = 'mockedReturn';

    (
      i18nService.getOrCreateI18nInstance as jest.MockedFunction<
        typeof i18nService.getOrCreateI18nInstance
      >
    ).mockReturnValue(mockI18nInstance);

    (
      useTranslation as jest.MockedFunction<typeof useTranslation>
    ).mockReturnValue(expectedReturn);

    const result = useInstanceTranslation(
      instanceName,
      resources,
      options,
    )(filename);

    expect(i18nService.getOrCreateI18nInstance).toHaveBeenCalledWith(
      instanceName,
      {
        resources,
        ...options,
      },
    );
    expect(useTranslation).toHaveBeenCalledWith(filename, {
      i18n: mockI18nInstance,
    });
    expect(result).toBe(expectedReturn);
  });

  it('should work correctly without options', () => {
    const instanceName = 'testInstance';
    const resources: Resource = {
      en: {
        translation: {
          test: 'test',
        },
      },
    };

    const filename = 'test';
    const mockI18nInstance = { options: { language: 'en' } };
    const expectedReturn = 'mockedReturn';

    (
      i18nService.getOrCreateI18nInstance as jest.MockedFunction<
        typeof i18nService.getOrCreateI18nInstance
      >
    ).mockReturnValue(mockI18nInstance);
    (
      useTranslation as jest.MockedFunction<typeof useTranslation>
    ).mockReturnValue(expectedReturn);

    const result = useInstanceTranslation(instanceName, resources)(filename);

    expect(i18nService.getOrCreateI18nInstance).toHaveBeenCalledWith(
      instanceName,
      { resources },
    );

    expect(useTranslation).toHaveBeenCalledWith(filename, {
      i18n: mockI18nInstance,
    });

    expect(result).toBe(expectedReturn);
  });
});
