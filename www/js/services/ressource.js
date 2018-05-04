/**
 * Created by user on 28/02/2018.
 */
app
  .factory('Users',function(API){
    return API.service('user');
  })
  .factory('Kiosques',function(API){
    return API.service('kiosque');
  })
  .factory('Persons',function(API){
    return API.service('person');
  })
  .factory('Services',function(API){
    return API.service('service');
  })
  .factory('Kiosque_service',function(API){
    return API.service('kiosque_service');
  });
