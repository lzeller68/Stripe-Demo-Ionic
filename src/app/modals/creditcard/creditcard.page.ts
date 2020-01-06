import {Component, OnInit, Renderer} from '@angular/core';
import {AlertController, LoadingController, ModalController, NavParams} from '@ionic/angular';
import {} from '@ionic/core';
import {environment} from '../../../environments/environment';
import {Stripe} from '@ionic-native/stripe/ngx';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-creditcard',
    templateUrl: './creditcard.page.html',
    styleUrls: ['./creditcard.page.scss'],
})
export class CreditcardPage implements OnInit {

    amount: string;
    currency = 'EUR';
    key = environment.stripeKey;
    cardDetails: any;
    errorMessage: string;

    cNumber: string = '4242424242424242';
    cMonth: number = 12;
    cYear: number = 24;
    cvv: string = '226';


    constructor(private modalCtrl: ModalController,
                private stripe: Stripe,
                private http: HttpClient,
                private afStore: AngularFirestore,
                private afAuth: AngularFireAuth,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.amount = '1000';
    }

    async closeModal() {
        await this.modalCtrl.dismiss();
    }

    async presentLoader() {
        const loading = await this.loadingCtrl.create({
            message: 'Zahlung wird bearbeitet',
            backdropDismiss: false,
            translucent: true
        });

        await loading.present();
    }

    async presentAlert(header, message) {
        const alert = await this.alertCtrl.create({
            header: header,
            subHeader: message,
            buttons: ['OK']
        });
        await alert.present();
    }


    payWithStripe() {
        if (this.checkFormEntries()) {
            this.presentLoader();
            this.stripe.setPublishableKey(this.key);

            this.cardDetails = {
                number: this.cNumber.toString(),
                expMonth: this.cMonth,
                expYear: this.cYear,
                cvc: this.cvv.toString()
            };

            this.stripe.createCardToken(this.cardDetails)
                .then(token => {
                    console.log(token);
                    this.makePayment(token.id);
                })
                .catch(err => {
                    console.error(err);
                    this.loadingCtrl.dismiss();
                    this.presentAlert('Fehler', 'Fehler beim bezahlen. Bitte überprüfen Sie Ihre Kartendetails.');
                });
        }
    }

    private makePayment(id: string) {

        console.log(`makePayment() called`);
        console.log(`Token in makePayment() --> ${id}`);
        this.http.post('https://us-central1-stripe-firebase-demo-a341f.cloudfunctions.net/payWithStripe',
            {
                amount: 1000,
                currency: 'eur',
                token: id,
                description: 'Weckerl'
            })
            .subscribe(data => {
                console.log(data);
                if (data !== 'error') {
                    this.afStore.collection('payments').doc(Date.now().toString()).set({
                        uid: this.afAuth.auth.currentUser.uid,
                        charge: data
                    }).then(x => {
                        this.loadingCtrl.dismiss();
                        this.modalCtrl.dismiss();
                        this.presentAlert('Abgeschlossen', 'Ihre Bestellung ist abgeschlossen.');
                    });
                } else {
                    console.log('Fehler beim bezahlen.');
                }

                console.log('Payment successfully completed');

            });

    }

    private checkFormEntries(): boolean {
        console.log();

        this.errorMessage = '';
        if (this.cNumber.length !== 16) {
            this.errorMessage = 'Bitte Kartennummer überprüfen.';
            return false;
        }

        if (this.cMonth.toString().length !== 2 || this.cMonth > 12 || this.cMonth === 0) {
            this.errorMessage = 'Bitte Exp. Monat überprüfen.';
            return false;
        }

        if (this.cYear.toString().length !== 2 || this.cYear < 20) {
            this.errorMessage = 'Bitte Exp. Jahr überprüfen.';
            return false;
        }

        if (this.cvv.length !== 3) {
            this.errorMessage = 'Bitte CVV überprüfen.';
            return false;
        }

        return true;
    }
}
