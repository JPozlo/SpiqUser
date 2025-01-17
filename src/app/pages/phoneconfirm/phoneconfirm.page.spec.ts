import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhoneconfirmPage } from './phoneconfirm.page';

describe('PhoneconfirmPage', () => {
  let component: PhoneconfirmPage;
  let fixture: ComponentFixture<PhoneconfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneconfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneconfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
