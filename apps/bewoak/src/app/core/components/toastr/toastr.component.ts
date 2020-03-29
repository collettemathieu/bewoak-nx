import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from '../../services/toastr.service';
import { Toastr } from '../../../shared/interface/toastr';
import { take } from 'rxjs/operators';
import { timer, Subscription } from 'rxjs';

// Temps de vie d'un toastr (en ms)
const lifeTime = 7000;

@Component({
  selector: 'bw-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit, OnDestroy {

  public toastrs: Toastr[] = [];
  private subscription: Subscription;

  constructor(private toastrService: ToastrService) { }

  ngOnInit() {
    // On s'abonne au service d'envoi de message
    this.subscription = this.toastrService.toastr$.subscribe(
      toastr => {
        // On ignore les messages vides
        if (toastr === null) {
          return;
        }
        // On applique à chaque toastr un temps d'apparition
        timer(0, lifeTime).pipe(take(2)).subscribe(
          index => {
            if (index === 0) {
              this.toastrs.push(toastr);
            } else {
              this.closeToastr(toastr);
            }
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /* Ferme le message d'avertissement à l'utilisateur
    @return void
  */
  closeToastr(toastr: Toastr) {
    // On récupère l'index du toastr
    const index = this.toastrs.findIndex(t => {
      return t === toastr;
    });
    // On l'écarte du tableau
    if (index !== -1) {
      this.toastrs.splice(index, 1);
    }
  }
}
