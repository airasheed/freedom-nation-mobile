/*global angular */

(function () {

    'use strict'

    /**
     * Service that persists and retrieves event information from PODIO API
     * PODIO API URL : api.podio.com
     *
     * Both Event and Events Controller use this service, returning promises for all changes to the
     * model.
     */

    angular
        .module('app.events')
        .factory('EventService',EventService);


    EventService.$inject = ['Podio','$q', '$http', 'utilsService','fnCache','DEFAULT_IMG','exception'];

    function EventService (Podio,$q,$http,utilsService,fnCache,DEFAULT_IMG,exception) {


        var Mappings = utilsService.Mappings;

        //Podio returns a large complicated array, with field and values based upon ides
        //Use the mappings object to create a smaller array based upon field ids
        var mappings = {
            '89107336' : new Mappings('name'),
            '89107340' : new Mappings('price'),
            '89107344' : new Mappings('description'),
            '89107337' : new Mappings('date', function(values) {
                return new Date(values[0].start_date);
            }),
            '89107348': new Mappings('img', function(values) {
                return { file_id: values[0].value.file_id};
            }),
            '89107415' : new Mappings('attendees',function(values) {
                var items = values.map(function(v){return v.value.item_id});
                return JSON.stringify(items);
            })
        };

        var service = {
            getEvent: getEvent,
            getEvents: getEvents
        };

        return service;


        ////////////////////////////////////////
            /*
             * Arrange Event Data for exposing to the model
             * @param {Object} Promise Response Object
             * @returns {Object} Rearranged event information based upon event field ids
             */

            function arrangeEvent(responseEvent) {

                var newEvent = responseEvent.fields.reduce(function (output, obj) {
                    var mapper = mappings[obj.field_id];
                    if (mapper) {
                            output[mapper.name] = mapper.converter(obj.values);
                    }
                    return output;
                }, {});
                newEvent.id = responseEvent.item_id;
                return newEvent;
            }


            /*
             * Get a single event
             * @param {String} eventId - Id of the event
             * @returns {Object} Returns a promise with event information
             */
            function getEvent(eventId,reload) {
                var deferred = $q.defer();
                var cache = fnCache.get(eventId);

                if(cache && !reload) {
                    deferred.resolve(cache);
                    return deferred.promise;
                }else{
                    Podio.request('get', '/item/' + eventId)
                        .then(function (responseEvent) {
                            var newEvent = arrangeEvent(responseEvent);
                            if(newEvent.img === undefined){
                                newEvent.img = {
                                    src : DEFAULT_IMG.event
                                };
                                fnCache.put(eventId, newEvent);
                                deferred.resolve(newEvent);
                                return deferred.promise;
                            }else{
                                $http.get('https://api.podio.com/file/' + newEvent.img.file_id + '/raw', {responseType: 'arraybuffer'})
                                    .then(function(response) {
                                    newEvent.img.src = utilsService.convertDataUrl(response);
                                    fnCache.put(eventId, newEvent);
                                    deferred.resolve(newEvent);
                                });
                            }
                        })
                        .catch(function(message){
                            exception.catcher('Error Fetching Event')(message)
                        }
                    );
                    return deferred.promise;
                }



            }

            /*
             * Get multiple events
             * @returns {Object} Returns a promise with event information
             */
            function getEvents(reload) {

                var deferred = $q.defer();
                var cache = fnCache.get('allEvents');

                if(cache && !reload){
                    deferred.resolve(cache);
                    return deferred.promise;
                }else{
                    Podio.request('post', '/item/app/11602319/filter')
                        .then(function (response) {
                            var newEvents = response.items.map(function(event) {
                                return arrangeEvent(event);
                            });
                            fnCache.put('allEvents', newEvents);
                            deferred.resolve(newEvents);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });

                    return deferred.promise;
                };
            }

        }
})();