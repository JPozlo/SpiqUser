import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhoneauthPage } from './phoneauth.page';

describe('PhoneauthPage', () => {
  let component: PhoneauthPage;
  let fixture: ComponentFixture<PhoneauthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneauthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneauthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
