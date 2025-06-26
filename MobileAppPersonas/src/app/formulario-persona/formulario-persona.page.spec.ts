import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioPersonaPage } from './formulario-persona.page';

describe('FormularioPersonaPage', () => {
  let component: FormularioPersonaPage;
  let fixture: ComponentFixture<FormularioPersonaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPersonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
