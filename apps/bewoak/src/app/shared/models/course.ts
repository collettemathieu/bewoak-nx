import { Article } from './article';

type typeCourseLevel = 'Débutant' | 'Intermédiaire' | 'Expert';

export class Course {
    readonly id: string;
    name: string;
    description: string;
    articles: Article[];
    keywords: Array<string>;
    url: string;
    avatar: string;
    like: number; // Nombre de like.
    userId: string; // id de l'utilisateur ayant créé le parcours.
    level: typeCourseLevel; // Niveau de difficulté du parcours.
    dateAdd: number;
    dateUpdate: number;

    constructor(options: {
        id?: string,
        name: string,
        description: string,
        articles?: Article[],
        keywords: Array<string>,
        url?: string,
        avatar?: string,
        like?: number,
        userId: string,
        level: typeCourseLevel,
        dateAdd: number,
        dateUpdate: number
    }) {
        this.id = options.id || '';
        this.name = options.name || '';
        this.description = options.description || '';
        this.articles = options.articles || [];
        this.keywords = options.keywords || [];
        this.url = options.url || '';
        this.avatar = options.avatar || '';
        this.like = options.like || 0;
        this.userId = options.userId;
        this.level = options.level || 'Débutant';
        this.dateAdd = options.dateAdd || 0;
        this.dateUpdate = options.dateUpdate || 0;
    }
}
