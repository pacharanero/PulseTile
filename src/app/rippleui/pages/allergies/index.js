/*
 ~  Copyright 2016 Ripple Foundation C.I.C. Ltd
 ~  
 ~  Licensed under the Apache License, Version 2.0 (the "License");
 ~  you may not use this file except in compliance with the License.
 ~  You may obtain a copy of the License at
 ~  
 ~    http://www.apache.org/licenses/LICENSE-2.0

 ~  Unless required by applicable law or agreed to in writing, software
 ~  distributed under the License is distributed on an "AS IS" BASIS,
 ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~  See the License for the specific language governing permissions and
 ~  limitations under the License.
 */
import routes from "./index.route";
import reducer from "./allergies-reducer-all";
import allergiesListComponent from './allergies-list.component';
import allergiesCreateComponent from './allergies-create.component';
import allergiesDetailComponent from './allergies-detail.component';
import allergiesActions from './allergies-actions';

export default {
  "name": 'allergies',
  "routes": routes,
  "reducer": reducer,
  "components": {
    allergiesListComponent,
    allergiesCreateComponent,
    allergiesDetailComponent
  },
  "actions": {
    allergiesActions
  },
  "sidebarInfo": {
    name: 'allergies',
    link: 'allergies',
    linkDetail: 'allergies-detail',
    title: 'Allergies'
  }
}