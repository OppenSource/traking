import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptPage } from './opt.page';

describe('OptPage', () => {
  let component: OptPage;
  let fixture: ComponentFixture<OptPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
