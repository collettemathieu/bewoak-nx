import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SearchAction } from '../../store';

@Component({
  selector: 'bw-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  public searchForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit() {
    this.searchForm = this.createForm();
  }

  /**
   * Création du formulaire de recherche des parcours pédagogiques.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      search: [''],
    });
  }

  /**
   * Soumission du formulaire de recherche.
   */
  public submit(): void {
    this.store.dispatch(new SearchAction({ searchQuery: this.search.value }));
  }

  get search() {
    return this.searchForm.get('search');
  }
}
