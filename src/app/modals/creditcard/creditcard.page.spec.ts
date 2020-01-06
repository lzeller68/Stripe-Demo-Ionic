import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreditcardPage } from './creditcard.page';

describe('CreditcardPage', () => {
  let component: CreditcardPage;
  let fixture: ComponentFixture<CreditcardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditcardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
