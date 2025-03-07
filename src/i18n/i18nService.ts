import i18next, {
  i18n,
  i18n as I18n,
  InitOptions as I18nInitOptions,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const i18nService = {
  registeredInstances: new Map<string, i18n>(),
  getOrCreateI18nInstance(
    instanceName: string,
    initOptions: I18nAvailableInitOptions | undefined,
  ): i18n {
    if (this.registeredInstances.has(instanceName)) {
      return this.registeredInstances.get(instanceName) as i18n;
    }
    return this.createAndRegisterI18nInstance(instanceName, initOptions);
  },
  getCurrentLanguage(): string {
    return [...this.registeredInstances.values()][0]?.language ?? 'ptBr';
  },
  createAndRegisterI18nInstance(
    instanceName: string,
    options?: I18nAvailableInitOptions,
  ): I18n {
    const initOptions = {
      ...options,
      initImmediate: false,
    };
    const newInstance = i18next
      .createInstance()
      .use(initReactI18next)
      .use(LanguageDetector);
    newInstance.init(initOptions);
    this.registeredInstances.set(instanceName, newInstance);
    return newInstance;
  },
  changeLanguage(language: string): void {
    const i18nInstancesArray = Array.from(this.registeredInstances.values());
    for (const i18nInstance of i18nInstancesArray) {
      i18nInstance.changeLanguage(language);
    }
  },
};

export type I18nAvailableInitOptions = Omit<
  I18nInitOptions,
  | 'initImmediate'
  | 'debug'
  | 'fallbackLng'
  | 'supportedLngs'
  | 'interpolation'
  | 'detection'
>;

export default Object.freeze(i18nService);
