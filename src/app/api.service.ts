import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IField } from './field/field.component';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  mockFieldRequest(): IField {
    return {
      FieldId: 1,
      FieldUrl:
        'https://cdn.stradoslabs.com/docs/careers/interview_materials/interview_angdev_horizon.png',
      FieldSizeX: 935,
      FieldSizeY: 133,
      Objects: [
        {
          ObjectId: 1,
          ObjectType: 'Tree',
          ObjectStartX: 464,
          ObjectEndX: 469,
          ObjectStartY: 16,
          ObjectEndY: 0,
          ObjectLabelDate: '2024-07-09 13:21:00',
        },
        {
          ObjectId: 2,
          ObjectType: 'Barn',
          ObjectStartX: 214,
          ObjectEndX: 448,
          ObjectStartY: 15,
          ObjectEndY: 5,
          ObjectLabelDate: '2024-07-09 13:27:00',
        },
        {
          ObjectId: 5,
          ObjectType: 'Tree',
          ObjectStartX: 843,
          ObjectEndX: 888,
          ObjectStartY: 11,
          ObjectEndY: 2,
          ObjectLabelDate: '2024-07-09 13:51:00',
        },
      ],
    };
  }
}
