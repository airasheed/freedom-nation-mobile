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


            var newEvent = {},
                newEvents = [],
                eventFieldIds = {
                    title: 89107336,
                    date: 89107337,
                    attendees: 89107415,
                    price: 89107340,
                    desc: 89107344,
                    img: 89107348
                };
            var service = {
                getEvent: getEvent,
                getEvents: getEvents

            };

            return service;


            /*
             * Arrange Event Data for exposing to the model
             * @param {Object} Promise Response Object
             * @returns {Object} Rearranged event information based upon event field ids
             */

            function arrangeEvent(responseEvent) {

                var fields = responseEvent.fields;
                var newEvent = {};
                newEvent.id = responseEvent.item_id;

                for(var j = 0, m = fields.length; j < m; j++) {

                    switch (fields[j].field_id) {

                        case eventFieldIds.title : {
                            newEvent.name =  fields[j].values[0].value;
                            break;
                        }
                        case eventFieldIds.date :
                        {
                            newEvent.date = new Date(fields[j].values[0].start_date);
                            break;
                        }
                        case eventFieldIds.attendees:{
                            var tempArray = [];
                            for(var k = 0, o = fields[j].values.length; k < o; k++) {
                                tempArray.push(fields[j].values[k].value.item_id);
                            }
                            newEvent.attendees = JSON.stringify(tempArray);
                            break;
                        }
                        case eventFieldIds.price: {
                            newEvent.price = fields[j].values[0].value;
                            break;
                        }
                        case eventFieldIds.desc : {
                            newEvent.description = fields[j].values[0].value;
                            break;
                        }
                        case eventFieldIds.img : {
                            newEvent.img = {
                                file_id: fields[j].values[0].value.file_id
                            };
                            break;
                        }
                    }
                }

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
                            newEvent = arrangeEvent(responseEvent);

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
                        .catch(exception.catcher('Error Fetching Event'));
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

                            newEvents = [];
                            var responseEvents = response.items;

                            for (var i = 0, n = responseEvents.length; i < n; i++) {
                                newEvents.push(arrangeEvent(responseEvents[i]));
                            }
                            fnCache.put('allEvents', newEvents);
                            deferred.resolve(newEvents);
                        })
                        .catch(exception.catcher('Error Fetching Event'));

                    return deferred.promise;
                };
            }

        }
})();