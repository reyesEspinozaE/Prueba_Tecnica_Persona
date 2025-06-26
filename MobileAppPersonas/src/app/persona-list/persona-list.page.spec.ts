import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaListPage } from './persona-list.page';

describe('PersonaListPage', () => {
  let component: PersonaListPage;
  let fixture: ComponentFixture<PersonaListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
