import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database-deprecated';
import {environment} from '../../environments/environment';
// @ts-ignore
import {Stripe} from '@ionic-native/stripe/ngx';
import {HttpClient} from '@angular/common/http';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {CreditcardPage} from '../modals/creditcard/creditcard.page';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    afToken: string;

    constructor(
        private actionSheetController: ActionSheetController,
        private modalCtrl: ModalController,
        private afAuth: AngularFireAuth) {
    }


    ngOnInit(): void {
        this.login();
    }

    login() {
        this.afAuth.auth.signInWithEmailAndPassword('lorenz@zeller.com', '123456').then(x => {
            this.afAuth.auth.currentUser.getIdToken(true)
                .then(token => {
                    this.afToken = token;
                });
        });
    }

    async openCreditCardModal() {
        const modal = await this.modalCtrl.create({
            component: CreditcardPage,
            cssClass: 'credit-card-modal'
        });
        return await modal.present();
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Bezahlen mit',
            mode: 'md',
            buttons: [
                {
                    text: 'Kreditkarte',
                    icon: 'card',
                    handler: () => {
                        console.log('Credit Card clicked');
                        this.openCreditCardModal();
                        //this.payWithStripe();
                    }
                }, {
                    text: 'Schließen',
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
        });
        await actionSheet.present();
    }
}
