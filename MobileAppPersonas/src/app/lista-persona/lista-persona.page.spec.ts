import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPersonasPage } from './lista-persona.page';

describe('PersonaListPage', () => {
  let component: ListaPersonasPage;
  let fixture: ComponentFixture<ListaPersonasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPersonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
