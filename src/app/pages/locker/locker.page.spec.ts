import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LockerPage } from './locker.page';

describe('LockerPage', () => {
  let component: LockerPage;
  let fixture: ComponentFixture<LockerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LockerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
