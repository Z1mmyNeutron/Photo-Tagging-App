import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';

//interface from given json string,
//split up date into date and time so it's in two columns
//added fields S
export interface IObject {
  ObjectId: number;
  ObjectType: string;
  ObjectStartX: number;
  ObjectEndX: number;
  ObjectStartY: number;
  ObjectEndY: number;
  ObjectLabelDate: string;
  ObjectLabelTime?: string;
  color?: string;
}

// Interface representing the structure of a Field containing Objects
export interface IField {
  FieldId: number;
  FieldUrl: string;
  FieldSizeX: number;
  FieldSizeY: number;
  Objects: IObject[];
}

// Function to create a new Object with a given date
export function newObject(date: string, color: string = ''): IObject {
  return {
    ObjectId: 0,
    ObjectType: '',
    ObjectStartX: 100,
    ObjectEndX: 200,
    ObjectStartY: 0,
    ObjectEndY: 0,
    ObjectLabelDate: date,
    color: color,
  };
}

@Component({
  selector: 'field-detail',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent implements OnInit {
  //Component Properties
  FieldId: number;
  FieldUrl: string;
  Objects: IObject[];

  FieldObject = {
    ObjectId: -1,
    ObjectType: 'Field',
    FieldSizeX: 0,
    FieldSizeY: 0,
  };

  // Inputs configuration for the table
  // Each entry defines a field, its display type ('input' or 'select'),
  //data type, and optional dropdown options
  newOption: string = '';
  newOptionColor: string = '';

  inputs: {
    field: keyof IObject;
    display: 'input' | 'select';
    type: 'number' | 'text' | 'date' | 'time' | 'boolean' | 'any';
    options?: { text: string; color: string }[];
  }[] = [
    { field: 'ObjectId', display: 'input', type: 'number' },
    {
      field: 'ObjectType',
      display: 'select',
      type: 'text',
      options: [
        { text: 'Tree', color: this.getRandomColor() },
        { text: 'Barn', color: this.getRandomColor() },
        { text: 'Scarecrow', color: this.getRandomColor() },
      ],
    },
    { field: 'ObjectStartX', display: 'input', type: 'number' },
    { field: 'ObjectEndX', display: 'input', type: 'number' },
    { field: 'ObjectStartY', display: 'input', type: 'number' },
    { field: 'ObjectEndY', display: 'input', type: 'number' },
    { field: 'ObjectLabelDate', display: 'input', type: 'date' },
    { field: 'ObjectLabelTime', display: 'input', type: 'time' },
  ];
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  addOption() {
    const objectTypeInput = this.inputs.find(
      (input) => input.field === 'ObjectType'
    );
    if (objectTypeInput && objectTypeInput.options && this.newOption.trim()) {
      const newColor = this.getRandomColor();
      objectTypeInput.options.push({
        text: this.newOption.trim(),
        color: newColor,
      });
      this.newOptionColor = newColor;
      this.newOption = ''; // Clear the input field after adding the new option
    }
  }

  // Private variables for drag functionality
  private initialMouseX: number = 0;
  private initialMouseY: number = 0;
  private InitialObjectStartX: number = 0;
  private InitialObjectStartY: number = 0;
  private InitialObjectEndX: number = 0;
  private InitialObjectEndY: number = 0;

  constructor(apiService: ApiService) {
    // Mock API call to fetch field data
    const field = apiService.mockFieldRequest();
    this.FieldUrl = field.FieldUrl;
    this.FieldId = field.FieldId;
    this.FieldObject.FieldSizeX = field.FieldSizeX;
    this.FieldObject.FieldSizeY = field.FieldSizeY;

    // Process Objects to split ObjectLabelDate into separate date and time fields
    this.Objects = field.Objects.map((object) => {
      return {
        ...object,
        ObjectLabelDate: object.ObjectLabelDate.split(' ')[0] ?? '',
        ObjectLabelTime: object.ObjectLabelDate.split(' ')[1] ?? '',
        color: object.color ?? '',
      };
    });
    this.newOptionColor;
  }

  ngOnInit(): void {}

  // Add a new object with the current date
  addObject() {
    const currentDate = this.getCurrentDateString();
    const newColor = this.newOptionColor;
    this.Objects.push(newObject(currentDate, newColor));
  }

  // Delete an object by index
  deleteObject(index: number) {
    this.Objects = this.Objects.filter((_, i) => i !== index);
  }

  // Would save field data to the backend server, right now throws alert for the error
  async saveField() {
    const apiUrl = `http://localhost:4200/field/:id/`; // Replace with actual API endpoint
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          FieldUrl: this.FieldUrl,
          FieldId: this.FieldId,
          FieldSizeX: this.FieldObject.FieldSizeX,
          FieldSizeY: this.FieldObject.FieldSizeY,
          Objects: this.Objects.map((object) => {
            return {
              ...object,
              ObjectLabelDate:
                object.ObjectLabelDate + ' ' + (object.ObjectLabelTime ?? ''), // Stitch the date and time together
            };
          }),
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Success:', data);
      alert('Objects saved successfully!');
      return data;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save objects.');
      // Handle error appropriately, e.g., show error message to user
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook.
    //Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    console.log('event :: ', changes);
  }

  //date for the table in ISO format
  getCurrentDateString(): string {
    const currentDate = new Date();
    const isoDateString = currentDate.toISOString(); // Get ISO format date string
    return isoDateString;
  }

  //Drag Properties - 1 of the most important parts of this demo is the ability to control drag events on the ui
  // The following properties allow you to do it, by tracking which object is being dragged, and which edges of the object
  // are allowed to be dragged..
  isDragging: boolean = false;
  dragObject: IObject | undefined;
  dragEnabledStartX: boolean = false;
  dragEnabledStartY: boolean = false;
  dragEnabledEndX: boolean = false;
  dragEnabledEndY: boolean = false;

  // Drag and Drop Handlers
  //Handles the start event
  onDragStart(event: MouseEvent, object: IObject) {
    this.isDragging = true;
    this.dragObject = object;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;

    //Calc length and width (dimensions)
    const length: number = object.ObjectEndX - object.ObjectStartX;
    const width: number = object.ObjectEndY - object.ObjectStartY;

    //calc tolerance as a ratio of length/width
    const toleranceX: number = 5;
    const toleranceY: number = 5;

    //calc basic "enabled"
    this.dragEnabledStartX = event.offsetX <= length - toleranceX;
    this.dragEnabledStartY = event.offsetY <= width - toleranceY;
    this.dragEnabledEndX = event.offsetX >= toleranceX;
    this.dragEnabledEndY = event.offsetY >= toleranceY;
    // Adjust drag directions to prevent excessive movement
    //but wait, that gets too jittery. So, under certain conditions, "lock" the X/Y drag freedom...

    //these conditions are, any time you are either at the far start or far end, but not both, AND both of the other directions are free, then disable the other directions.
    // if only 1 of the other directions is free, then that means you're also in a corner, if you are on the far side of 1 but not the other in the X also.

    if (
      ((this.dragEnabledStartX && !this.dragEnabledEndX) ||
        (!this.dragEnabledStartX && this.dragEnabledEndX)) &&
      this.dragEnabledStartY &&
      this.dragEnabledEndY
    ) {
      this.dragEnabledEndY = false;
      this.dragEnabledStartY = false;
    }

    if (
      ((this.dragEnabledStartY && !this.dragEnabledEndY) ||
        (!this.dragEnabledStartY && this.dragEnabledEndY)) &&
      this.dragEnabledStartX &&
      this.dragEnabledEndX
    ) {
      this.dragEnabledEndX = false;
      this.dragEnabledStartX = false;
    }

    //set initial posiiton to use later, in the onDrag()
    this.InitialObjectStartX = object.ObjectStartX;
    this.InitialObjectStartY = object.ObjectStartY;
    this.InitialObjectEndX = object.ObjectEndX;
    this.InitialObjectEndY = object.ObjectEndY;
  }
  //handle drag event
  onDrag(event: MouseEvent, object: IObject) {
    if (this.isDragging && this.dragObject === object) {
      //get the offset
      const offsetX: number = event.clientX - this.initialMouseX;
      const offsetY: number = event.clientY - this.initialMouseY;

      //relying on the last drag frame to tell the out of bounds, if out of bounds cant move it anymore
      if (
        this.dragEnabledStartX &&
        this.dragObject.ObjectEndX <= this.FieldObject.FieldSizeX
      ) {
        this.dragObject.ObjectStartX = Math.max(
          0,
          Math.min(
            this.FieldObject.FieldSizeX - 15,
            this.InitialObjectStartX + offsetX
          )
        );
      }
      if (
        this.dragEnabledStartY &&
        this.dragObject.ObjectEndY <= this.FieldObject.FieldSizeY
      ) {
        this.dragObject.ObjectStartY = Math.max(
          0,
          Math.min(
            this.FieldObject.FieldSizeY - 15,
            this.InitialObjectStartY + offsetY
          )
        );
      }
      if (this.dragEnabledEndX && this.dragObject.ObjectStartX >= 0) {
        this.dragObject.ObjectEndX = Math.min(
          this.FieldObject.FieldSizeX,
          Math.max(
            this.dragObject.ObjectStartX,
            this.InitialObjectEndX + offsetX
          )
        );
      }

      if (this.dragEnabledEndY && this.dragObject.ObjectStartY >= 0) {
        this.dragObject.ObjectEndY = Math.min(
          this.FieldObject.FieldSizeY,
          Math.max(
            this.dragObject.ObjectStartY,
            this.InitialObjectEndY + offsetY
          )
        );
      }
    }
  }
  //Handle drag and event
  onDragEnd(event: MouseEvent, object: IObject) {
    this.isDragging = false;
    this.dragEnabledStartX = false;
    this.dragEnabledStartY = false;
    this.dragEnabledEndX = false;
    this.dragEnabledEndY = false;
  }

  // Object Type Checks
  isTree(object: IObject): boolean {
    return object.ObjectType === 'Tree';
  }
  isBarn(object: IObject): boolean {
    return object.ObjectType === 'Barn';
  }
  isNewObject(object: IObject): boolean {
    const objectTypeInput = this.inputs.find(
      (input) => input.field === 'ObjectType'
    );
    if (objectTypeInput && objectTypeInput.options) {
      return objectTypeInput.options.some(
        (option) =>
          option.text === object.ObjectType && option.color === object.color
      );
    }
    return false;
  }
}
