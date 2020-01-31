import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoffeePage } from './coffee.page';

describe('CoffeePage', () => {
  let component: CoffeePage;
  let fixture: ComponentFixture<CoffeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoffeePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CoffeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
