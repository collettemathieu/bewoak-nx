import { Chapter } from './chapter';

type typeArticle = 'book' | 'article' | 'video' | 'other';
type typeLevel = 'bac' | 'bac+1' | 'bac+2' | 'bac+3' | 'bac+4' | 'bac+5' | 'bac+>5';

export class Article {
    id: string;
    title: string;
    doi: string;
    courseIds: Array<string>; // Id des parcours dans lequel l'article apparaît
    orderByCourseId: { [key: string]: number }; // Ordre d'apparition de l'article par Id de parcours
    avatarUrl: string;
    linkUrl: string; // Lien url de l'article
    dateAdd: number; // Date d'ajout de l'article en base
    dateUpdate: number; // Date de modification de l'article en base
    releaseDate: number; // Date de publication de l'article
    type: typeArticle;
    keywords: string;
    trainingTime: number; // Temps moyen d'apprentissage
    thematic: string; // Thématique de l'article
    chapters: Chapter[]; // Liste des chapitres de l'article
    level: typeLevel; // Niveau d'apprentissage
    complexity: number; // Complexité d'apprentissage

    constructor(options: {
        id?: string,
        doi?: string,
        title: string,
        courseIds?: Array<string>,
        orderByCourseId?: { [key: string]: number },
        avatarUrl?: string,
        linkUrl?: string,
        dateAdd?: number,
        dateUpdate?: number,
        releaseDate?: number,
        type?: typeArticle,
        keywords?: string,
        trainingTime?: number,
        thematic?: string,
        chapters?: Chapter[],
        level?: typeLevel,
        complexity?: number
    }) {
        this.id = options.id || '';
        this.title = options.title || '';
        this.doi = options.doi || '';
        this.courseIds = options.courseIds || [];
        this.orderByCourseId = options.orderByCourseId || {};
        this.avatarUrl = options.avatarUrl || '';
        this.linkUrl = options.linkUrl || '';
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
