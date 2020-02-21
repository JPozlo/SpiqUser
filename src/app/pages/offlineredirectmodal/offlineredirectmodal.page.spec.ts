import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfflineredirectmodalPage } from './offlineredirectmodal.page';

describe('OfflineredirectmodalPage', () => {
  let component: OfflineredirectmodalPage;
  let fixture: ComponentFixture<OfflineredirectmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineredirectmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineredirectmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
