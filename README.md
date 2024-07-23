# Photo-Binding-App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

1. Changed mock API start/endx to reflect numbers since they are coordinate points
2. Added start/endY in mock data to correct missing variables
3. Fix mock API start/End so they appear on the horizon above their respective images
4. Changed Mock api FieldStartX to reflect true width span of photo to controll bounds
5. Changed Mock api FieldStartY to reflect true height span of photo to controll bounds
6. Added a field box with drag functionalities so when a new object is added to the field it renders with a red or green box that the user is able to control
7. Reflected changing inputs based on draggable boxes in the control types
8. Loaded in photo from api url, can change to be any photo with the box containing the url on the front end
9. Created a table to store all of the object properties after making an interface and threading it through the html -> is updatable regarding the add and delete boxes
10. Created a navbar, currently it only holds one value for the page website. It is set up to reflect easy changes upon the event we need more pages
11. Purposely made a broken save box to be able to reflect error and error handling will not ever be able to post actual data without a server
12. Wrote basic testing in Jest to configure the field component and trigger inital data binding:
    tests:

    1. Check if component is created successfully
    2. test if component initalizes with objects from MOCKAPI
    3. Test if deleteObejct method works as expected
    4. Test if onDragEnd method works as expected
    5. Tests to check if newObject function initalizes correctly

13. Created input types to be able to turn ObjectID in the table into a clickable menu, the box will render red or green depending on whether the use selects a barn or a tree
14. Integrated two way data binding so updating the typescript file will automically update inside of the HMTL
    1. [(ng model)] <- two way data binding, between consumer and businesLogic
    2. (Change) <- 1 way data binging from the consumer to businessLogic
