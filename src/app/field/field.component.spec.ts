import '@angular/compiler';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldComponent, IObject, newObject } from './field.component';
import { ApiService } from '../api.service';
import { of } from 'rxjs';

//Mocking the ApiService: A MockApiService class is created to mock the API service's behavior.
//This allows for isolated testing of the component without making actual HTTP requests.
class MockApiService {
  mockFieldRequest() {
    return {
      FieldId: 1,
      FieldUrl: 'http://example.com',
      FieldSizeX: 1000,
      FieldSizeY: 1000,
      Objects: [
        {
          ObjId: 1,
          ObjectType: 'Tree',
          ObjectStartX: 100,
          ObjectEndX: 200,
          ObjectStartY: 100,
          ObjectEndY: 200,
          ObjectLabelDate: '2024-01-01 12:00',
        },
      ],
    };
  }
}
describe('FieldComponent', () => {
  let component: FieldComponent;
  let fixture: ComponentFixture<FieldComponent>;

  // Before each test, set up the testing module
  beforeEach(async () => {
    // Configure the testing module with the FieldComponent and a mock ApiService
    await TestBed.configureTestingModule({
      declarations: [FieldComponent], // Declare the FieldComponent
      providers: [{ provide: ApiService, useClass: MockApiService }], // Provide a mock ApiService
    }).compileComponents(); // Compile the component and its template

    // Create a fixture of the FieldComponent
    fixture = TestBed.createComponent(FieldComponent);
    // Get an instance of the component
    component = fixture.componentInstance;
    // Trigger initial data binding
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create the Field Component', () => {
    expect(component).toBeTruthy(); // The component instance should be truthy (i.e., created)
  });

  // Test to check if the component initializes with objects from the mock API service
  it('should initialize with objects from API service ', () => {
    expect(component.Objects.length).toBe(1); // The Objects array should contain one object
    expect(component.Objects[0].ObjectType).toBe('Tree'); // The type of the first object should be 'Tree'
  });

  // Test to check if the deleteObject method works as expected
  it('should delete an object', () => {
    component.deleteObject(0); // Delete the first object
    expect(component.Objects.length).toBe(0); // The Objects array should be empty
  });

  // Test to check if the onDragEnd method works as expected
  it('should handle drag end', () => {
    const object: IObject = component.Objects[0]; // Get the first object
    component.onDragEnd(new MouseEvent('dragend'), object); // Call the onDragEnd method with a dragend event
    expect(component.isDragging).toBe(false); // The isDragging flag should be set to false
  });
});

describe('Field Tests', () => {
  // Test case to check if the newObject function initializes an object with default values as expected
  it('Should test new object default values works as expected', () => {
    expect('1').toEqual('1'); // Dummy assertion to ensure the test framework is working

    // Call the newObject function with a specific date
    const obj = newObject('date');

    // Check if the ObjectLabelDate property is set correctly
    expect(obj.ObjectLabelDate).toEqual('date');
    // Check if the ObjectEndX property is set to the default value of 200
    expect(obj.ObjectEndX).toEqual(200);
    // Check if the ObjectEndY property is set to the default value of 0
    expect(obj.ObjectEndY).toEqual(0);
    // Check if the ObjectStartX property is set to the default value of 100
    expect(obj.ObjectStartX).toEqual(100);
    // Duplicate check for ObjectStartX (could be removed if redundant)
    expect(obj.ObjectStartX).toEqual(100);
    // Check if the ObjectId property is set to the default value of 0
    expect(obj.ObjectId).toEqual(0);
    // Check if the ObjectType property is set to the default empty string value
    expect(obj.ObjectType).toEqual('');
  });
});
