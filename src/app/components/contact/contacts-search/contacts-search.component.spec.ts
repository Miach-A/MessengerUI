import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsSearchComponent } from './contacts-search.component';

describe('ContactsSearchComponent', () => {
  let component: ContactsSearchComponent;
  let fixture: ComponentFixture<ContactsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
