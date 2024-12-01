# Starting the App

## Install

In root folder execute:

```
npm run:install
```

This installs dependecies for frontend and backend.

## Run the app

### Backend

```
npm run start:backend
```

### Frontend

```
npm run start:frontend
```

--debugging

TODO:
Changes for refactoring:
--create utils class for access to backend (right now api path of backend is directly written in component javascript bwp- home.jsx)
--update function for all backend models (prevent multiple calls to getAllNotes())
--Show how navbar was changed to possibly exclude searchbar
-- move getUserInfo to parent component that all pages inherit from
