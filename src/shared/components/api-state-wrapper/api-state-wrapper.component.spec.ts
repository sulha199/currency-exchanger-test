import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStateWrapperComponent } from './api-state-wrapper.component';

describe('ApiStateWrapperComponent', () => {
  let component: ApiStateWrapperComponent;
  let fixture: ComponentFixture<ApiStateWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiStateWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiStateWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
