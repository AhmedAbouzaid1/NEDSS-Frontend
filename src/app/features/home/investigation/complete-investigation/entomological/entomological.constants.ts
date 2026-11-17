export enum EntomologicalVector {
  Mosquito = 1,
  SandFly = 2,
}

export const ENTOMOLOGICAL_ROUTES: Record<number, string> = {
  [EntomologicalVector.Mosquito]: 'entomological-mosquito',
  [EntomologicalVector.SandFly]: 'entomological-sandfly',
};

export type MosquitoGenus = 'culex' | 'anopheles' | 'aedes' | 'other';

export interface SpeciesDef {
  key: string;
  ar: string;
  en: string;
}

export interface GenusDef {
  key: MosquitoGenus | 'phlebotomus';
  ar: string;
  en: string;
  species: SpeciesDef[];
}

export const MOSQUITO_GENERA: GenusDef[] = [
  {
    key: 'culex',
    ar: 'جنس كيولكس',
    en: 'Genus Culex',
    species: [
      { key: 'culex_pipiens', ar: 'كيولكس ببيانز', en: 'Culex pipiens' },
      { key: 'culex_quinquefasciatus', ar: 'كيولكس كونكفاشياتس', en: 'Culex quinquefasciatus' },
      { key: 'culex_antennatus', ar: 'كيولكس أنتيناتس', en: 'Culex antennatus' },
      { key: 'culex_univittatus', ar: 'كيولكس يونيفتاتس', en: 'Culex univittatus' },
      { key: 'culex_salri', ar: 'كيولكس سالري', en: 'Culex salri' },
      { key: 'culex_pusillus', ar: 'كيولكس باسيلس', en: 'Culex pusillus' },
      { key: 'culex_adari', ar: 'كيولكس أداري', en: 'Culex adari' },
      { key: 'culex_poicilipes', ar: 'كيولكس بويسيليبس', en: 'Culex poicilipes' },
    ],
  },
  {
    key: 'anopheles',
    ar: 'جنس أنوفيلس',
    en: 'Genus Anopheles',
    species: [
      { key: 'anopheles_coustani', ar: 'أنوفليس كوستاني', en: 'Anopheles coustani' },
      { key: 'anopheles_tenebrosus', ar: 'أنوفليس تنيبروسس', en: 'Anopheles tenebrosus' },
      { key: 'anopheles_algeriensis', ar: 'أنوفليس ألجيرينسز', en: 'Anopheles algeriensis' },
      { key: 'anopheles_pharoensis', ar: 'أنوفليس فرعوني', en: 'Anopheles pharoensis' },
      { key: 'anopheles_multicolor', ar: 'أنوفليس مالتيكلر', en: 'Anopheles multicolor' },
      { key: 'anopheles_sergentii', ar: 'أنوفليس سرجنتي', en: 'Anopheles sergentii' },
      { key: 'anopheles_stephensi', ar: 'أنوفليس استيفينساي', en: 'Anopheles stephensi' },
      { key: 'anopheles_gambiae', ar: 'أنوفليس جامبيا', en: 'Anopheles gambiae' },
    ],
  },
  {
    key: 'aedes',
    ar: 'جنس آيدس',
    en: 'Genus Aedes',
    species: [
      { key: 'aedes_aegypti', ar: 'آيدس إيجبتاي', en: 'Aedes aegypti' },
      { key: 'aedes_albopictus', ar: 'آيدس ألبوبيكتوس', en: 'Aedes albopictus' },
      { key: 'aedes_caspius', ar: 'آيدس كاسبيس', en: 'Aedes caspius' },
      { key: 'aedes_detritus', ar: 'آيدس ديترايتس', en: 'Aedes detritus' },
    ],
  },
  {
    key: 'other',
    ar: 'أجناس أخرى من البعوض',
    en: 'Other mosquito genera',
    species: [
      { key: 'theobaldia', ar: 'بعوض جنس ثيوبالديا', en: 'Genus Theobaldia' },
      { key: 'uranotaenia', ar: 'بعوض جنس يورانوتينيا', en: 'Genus Uranotaenia' },
    ],
  },
];

export const SAND_FLY_GENERA: GenusDef[] = [
  {
    key: 'phlebotomus',
    ar: 'ذباب الرمل',
    en: 'Sand flies',
    species: [
      { key: 'phlebotomus_papatasi', ar: 'باباتاسي', en: 'Phlebotomus papatasi' },
      { key: 'phlebotomus_langeroni', ar: 'لانجروني', en: 'Phlebotomus langeroni' },
    ],
  },
];

export const AEDES_AEGYPTI_KEY = 'aedes_aegypti';

export const OTHER_PESTICIDE = 'other';

export type SpaceDevice = 'fog' | 'mist';

export interface PesticideDef {
  key: string;
  name: string;
  activeIngredient: string;
  mixRatio: string;
  perUnit: number;
  unitsPerDose: number;
  device?: SpaceDevice;
}

export const LARVICIDES: PesticideDef[] = [
  { key: 'diflucin_wp', name: 'ديفلوسين WP', activeIngredient: 'ديفلوبنزيرون 50%', mixRatio: '1 جرام / 10 لتر', perUnit: 1, unitsPerDose: 1 },
];

export const RESIDUAL_PESTICIDES: PesticideDef[] = [
  { key: 'lambda_wp', name: 'لمبادا WP', activeIngredient: 'لمباداسيهالوثرين 10%', mixRatio: '9 جرام / 10 لتر', perUnit: 9, unitsPerDose: 1 },
  { key: 'malathion_wp', name: 'ملاثيون كزد WP', activeIngredient: 'ملاثيون 50%', mixRatio: '160 جرام / 10 لتر', perUnit: 160, unitsPerDose: 1 },
];

export const SPACE_PESTICIDES: PesticideDef[] = [
  { key: 'lambda_5_fog', name: 'لمبادا 5% (جهاز ضباب)', activeIngredient: 'لمباداسيهالوثرين 5%', mixRatio: '1 لتر مبيد / 2500 لتر سولار', perUnit: 1000, unitsPerDose: 2500, device: 'fog' },
  { key: 'cordon_mist', name: 'كوردون (جهاز رذاذ)', activeIngredient: 'لمباداسيهالوثرين 7.5%', mixRatio: '1 لتر مبيد / 150 لتر ماء', perUnit: 1000, unitsPerDose: 150, device: 'mist' },
];

export const SPACE_DEVICES: { value: SpaceDevice; ar: string; en: string }[] = [
  { value: 'fog', ar: 'جهاز ضباب', en: 'Fogger' },
  { value: 'mist', ar: 'جهاز رذاذ', en: 'Mist blower' },
];
