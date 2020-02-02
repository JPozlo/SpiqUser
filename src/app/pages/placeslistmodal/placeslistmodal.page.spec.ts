import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceslistmodalPage } from './placeslistmodal.page';

describe('PlaceslistmodalPage', () => {
  let component: PlaceslistmodalPage;
  let fixture: ComponentFixture<PlaceslistmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceslistmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceslistmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
