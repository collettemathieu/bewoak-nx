export class Chapter {
    name: string; // Nom du chapitre.
    complexity: number; // Difficulté d'apprentissage du chapitre.

    constructor(options: {
        name?: string,
        complexity?: number
    }) {
        this.name = options.name || '';
        this.complexity = options.complexity || 0;
    }
}
