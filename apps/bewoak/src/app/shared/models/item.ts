import { Chapter } from './chapter';

export type typeItem = 'book' | 'article' | 'video' | 'other';
export type typeLevel =
  | 'bac'
  | 'bac+1'
  | 'bac+2'
  | 'bac+3'
  | 'bac+4'
  | 'bac+5'
  | 'bac+>5';

export class Item {
  id: string;
  title: string;
  abstract: string;
  journal: string;
  year: number;
  url: string; // Lien url de l'item.
  authors: string[];
  doi: string;
  courseIds: Array<string>; // Id des parcours dans lequel l'item apparaît.
  orderByCourseId: { [key: string]: number }; // Ordre d'apparition de l'item par Id de parcours.
  avatarUrl: string;
  dateAdd: number; // Date d'ajout de l'item en base.
  dateUpdate: number; // Date de modification de l'item en base.
  releaseDate: number; // Date de publication de l'item.
  type: typeItem;
  keywords: string;
  trainingTime: number; // Temps moyen d'apprentissage.
  thematic: string; // Thématique de l'item.
  chapters: Chapter[]; // Liste des chapitres de l'item.
  level: typeLevel; // Niveau d'apprentissage.
  complexity: number; // Complexité d'apprentissage.

  constructor(options: {
    id?: string;
    doi?: string;
    title: string;
    abstract?: string;
    journal?: string;
    year: number;
    url: string;
    authors: string[];
    courseIds?: Array<string>;
    orderByCourseId?: { [key: string]: number };
    avatarUrl?: string;
    dateAdd?: number;
    dateUpdate?: number;
    releaseDate?: number;
    type: typeItem;
    keywords?: string;
    trainingTime?: number;
    thematic?: string;
    chapters?: Chapter[];
    level?: typeLevel;
    complexity?: number;
  }) {
    this.id = options.id || '';
    this.title = options.title || '';
    this.abstract = options.abstract || '';
    this.journal = options.journal || '';
    this.year = options.year || 0;
    this.url = options.url || '';
    this.authors = options.authors || [];
    this.doi = options.doi || '';
    this.courseIds = options.courseIds || [];
    this.orderByCourseId = options.orderByCourseId || {};
    this.avatarUrl = options.avatarUrl || '';
    this.dateAdd = options.dateAdd || 0;
    this.dateUpdate = options.dateUpdate || 0;
    this.releaseDate = options.releaseDate || 0;
    this.type = options.type || 'other';
    this.keywords = options.keywords || '';
    this.trainingTime = options.trainingTime || 0;
    this.thematic = options.thematic || '';
    this.chapters = options.chapters || [];
    this.level = options.level || 'bac';
    this.complexity = options.complexity || 0;
  }
}
