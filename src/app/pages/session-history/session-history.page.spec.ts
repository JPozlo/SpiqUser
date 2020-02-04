import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SessionHistoryPage } from './session-history.page';

describe('SessionHistoryPage', () => {
  let component: SessionHistoryPage;
  let fixture: ComponentFixture<SessionHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionHistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
