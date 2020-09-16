type roles = 'USER' | 'EXPERT' | 'ADMIN' | 'ROOT';

export class User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: Array<roles>;
  avatarUrl: string;
  jobBackground: string;
  dateAdd: number;
  dateUpdate: number;

  constructor(options: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    roles?: roles[];
    avatarUrl?: string;
    jobBackground?: string;
    dateAdd?: number;
    dateUpdate?: number;
  }) {
    this.id = options.id || '';
    this.firstname = options.firstname || '';
    this.lastname = options.lastname || '';
    this.email = options.email || '';
    this.roles = options.roles || ['USER'];
    this.avatarUrl = options.avatarUrl || '';
    this.jobBackground = options.jobBackground || '';
    this.dateAdd = options.dateAdd || 0;
    this.dateUpdate = options.dateUpdate || 0;
  }

  /**
   * Détermine si l'utilisateur possède tel rôle.
   * @param role Le rôle que l'on souhaite contrôler.
   */
  public hasRole(role: roles): boolean {
    return this.roles.includes(role);
  }
}
