import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterTestingModule } from '@angular/router/testing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule]
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Si cambiaste el diseño original y ya no tienes un <h1> que diga "Hello, Frontend",
    // puedes simplemente borrar este bloque 'it' completo para que no falle buscando ese texto.
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Frontend');
  });
});