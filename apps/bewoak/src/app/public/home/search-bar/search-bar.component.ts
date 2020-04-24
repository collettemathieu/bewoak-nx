import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesStateSearchService } from '../../../core/services/course/courses-state-search.service';

@Component({
  selector: 'bw-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  public searchForm: FormGroup;

  constructor(private fb: FormBuilder, private coursesStateSearchService: CoursesStateSearchService) { }

  ngOnInit() {
    this.searchForm = this.createForm();
  }

  /**
   * Création du formulaire de recherche des parcours pédagogiques.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      search: ['']
    });
  }

  /**
   * Soumission du formulaire de recherche.
   */
  public submit(): void {
    this.coursesStateSearchService.searchCourse(this.search.value).subscribe();
  }

  get search() {
    return this.searchForm.get('search');
  }

}
