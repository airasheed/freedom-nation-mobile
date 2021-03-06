(function () {

    'use strict'

    /*global angular */

    /**
     * Services that persists and retrieves attendee information from PODIO API
     * PODIO API URL : api.podio.com
     *
     * Both Attendee and Attendees Controller use this service, returning promises for all changes to the
     * model.
     */

    angular
        .module('app.attendees')
        .factory('AttendeeService', AttendeeService);

    AttendeeService.$inject = ['Podio', '$q', '$http', 'utilsService','fnCache','EventService','DEFAULT_IMG','exception'];

    function AttendeeService (Podio,$q,$http,utilsService,fnCache,EventService,DEFAULT_IMG,exception) {

            var newAttendee = {},
                newAttendees = [],
                fileAPIUrl = 'https://api.podio.com/file/',
                citizenFieldIds = {
                    info: 80911192,
                    barcode: 102793685,
                    status: 92390772,
                    description: 80910890,
                    img: 80911195
                };

            var service = {
                getAttendees : getAttendees,
                getAttendee : getAttendee,
                getAttendeeByBarcode : getAttendeeByBarcode,
                getImg : getImg,
                addToEvent : addToEvent
            };

            return service;


            /*
             * Arrange Attendee data for exposing to the model
             * @param {Object} Promise Response Object
             * @returns {Object} Rearranged attendee information based upon citizen field ids
             */
            function arrangeAttendee(responseEvent) {
                var att = {};
                var fields = responseEvent.fields;
                att.id = responseEvent.item_id;

                for (var j = 0, m = fields.length; j < m; j++) {

                    switch (fields[j].field_id) {

                        case citizenFieldIds.info :
                        {
                            att.name = fields[j].values[0].value.name || '';
                            break;
                        }

                        case citizenFieldIds.barcode :
                        {
                            att.barcode = fields[j].values[0].value || '';
                            break;
                        }
                        case citizenFieldIds.status:
                        {
                            att.status = fields[j].values[0].value.text || '';
                            break;
                        }
                        case citizenFieldIds.description:
                        {
                            att.description = fields[j].values[0].value || '';
                            break;
                        }
                        case citizenFieldIds.img :
                        {
                            att.img = {
                                file_id: fields[j].values[0].value.file_id
                            };
                            break;
                        }
                    }
                }

                return att;
            }

            /*
             * Arrange Attendees data for exposing to the model
             * @param {Object} Promise Response Object
             * @returns {Object} Rearranged attendee information based upon citizen field ids
             */

            function arrangeAttendees(response) {

                var tempArray = [];
                var tempItems = response.items;

                for(var i = 0, n = tempItems.length; i < n; i++) {
                    var fields = tempItems[i].fields;
                    var att = {};
                    att.id = tempItems[i].item_id;
                    for (var j = 0, m = fields.length; j < m; j++) {

                        switch (fields[j].field_id) {

                            case citizenFieldIds.info :
                            {
                                att.name = fields[j].values[0].value.name || '';
                                break;
                            }

                            case citizenFieldIds.barcode :
                            {
                                att.barcode = fields[j].values[0].value || '';
                                break;
                            }
                            case citizenFieldIds.status:
                            {
                                att.status = fields[j].values[0].value.text || '';
                                break;
                            }
                            case citizenFieldIds.description:
                            {
                                att.description = fields[j].values[0].value || '';
                                break;
                            }
                            case citizenFieldIds.img :
                            {
                                att.img = {
                                    file_id : fields[j].values[0].value.file_id
                                };
                                break;
                            }
                        }
                    }
                    tempArray.push(att);
                }
                return tempArray;
            }

            /*
             * Get a Multiple Attendees
             * @param {Array} attendeeIds - Attendee Ids
             * @returns {Object} Returns a promise with event information
             */

            function getAttendees(attendeeIds,eventId,refresh) {


                var attendees = $q.defer();
                var requestData = {
                    "filters" : {
                        "item_id" : attendeeIds
                    }
                };
                var cache = fnCache.get('attendees:' + eventId);
                //If object cached

                if(cache && !refresh) {
                    attendees.resolve(cache);
                    return attendees.promise;
                }
                //Object not cached
                Podio.request('post', '/item/app/10462146/filter', requestData)
                    .then(function (response) {
                        newAttendees = arrangeAttendees(response);

                        for(var i = 0; i < newAttendees.length; i++) {
                            //capture value of i with IIFE
                            (function (j) {
                                if(newAttendees[j].img !== undefined){
                                    $http.get(fileAPIUrl + newAttendees[j].img.file_id
                                        + '/raw',{responseType:'arraybuffer'})
                                        .then(function(response) {
                                            newAttendees[j].img.src = utilsService.convertDataUrl(response);
                                        })
                                        .catch(exception.catcher('Fetching Image Error'));
                                }else{
                                    newAttendees[j].img = {src : DEFAULT_IMG.attendee};
                                }

                            })(i);
                        }
                        fnCache.put('attendees:' + eventId, newAttendees);
                        attendees.resolve(newAttendees);
                    })
                    .catch(exception.catcher('Fetching Attendees Error'));

                return attendees.promise;

            }

            /*
             * Get Single Attendee
             * @params: attendeeId
             *
             * */

            function getAttendee (attendeeId,refresh) {

                var attendee = $q.defer();
                var cache = fnCache.get(attendeeId);

                /*
                 * Check for cached object
                 * */
                if(cache && !refresh) {
                    attendee.resolve(cache);
                    return attendee.promise;
                }


                //If no cached object was found make request to podio
                Podio.request('get', '/item/' + attendeeId)
                    .then(function (responseEvent) {
                        newAttendee = arrangeAttendee(responseEvent);

                        if(newAttendee.img !== undefined) {
                            return $http.get(fileAPIUrl + newAttendee.img.file_id + '/raw', {responseType: 'arraybuffer'})
                                .then(function(response) {
                                newAttendee.img.src = utilsService.convertDataUrl(response);
                                fnCache.put(attendeeId, newAttendee);
                                attendee.resolve(newAttendee);
                            });
                        }

                        newAttendee.img = {src : DEFAULT_IMG.attendee};

                        fnCache.put(attendeeId, newAttendee);
                        attendee.resolve(newAttendee);
                    })
                    .catch(exception.catcher('Fetching Attendee Error'));
                return attendee.promise;
            }

            function getAttendeeByBarcode(barcode) {
                var attendee = $q.defer();

                var requestData = {
                    "filters" : {
                        "barcode-2" : barcode
                    }
                };

                Podio.request('post', '/item/app/10462146/filter', requestData)
                    .then(function (responseEvent) {
                        newAttendee = arrangeAttendee(responseEvent.items[0]);

                        if(newAttendee.img !== undefined){
                            return $http.get(fileAPIUrl+ imgId + '/raw', {responseType: 'arraybuffer'})
                                .then(function(response) {
                                    newAttendee.img.src = utilsService.convertDataUrl(response);
                                    attendee.resolve(newAttendee);
                                });
                        }

                        newAttendee.img = {
                            src : DEFAULT_IMG.attendee
                        }
                        attendee.resolve(newAttendee);
                    })
                    .catch(function(error) {
                        attendee.resolve('not found');
                    });
                return attendee.promise;
            }

            function getImg(imgId) {
                var qImgUrl = $q.defer();

                $http.get(fileAPIUrl + imgId + '/raw', {responseType: 'arraybuffer'})
                    .then(function (response) {
                        var dataUrl = utilsService.convertDataUrl(response);
                        qImgUrl.resolve(dataURL);
                    }).catch(exception.catcher('Get Image Error'));

                return qImgUrl.promise;
            }

            /*
             * Add to Event
             * @params: eventId, attendeeId
             * */

            function addToEvent(eventId,attendeeId) {

                return EventService.getEvent(eventId, true)
                    .then(function (response) {
                        //retreive attendee array
                        console.log(response);
                        var attendees = [];
                        if(response.attendees !== undefined) {
                            attendees = JSON.parse(response.attendees);
                        }
                        //push new attendee id
                        attendees.push(parseInt(attendeeId));

                        //prepare request data
                        var requestData = {
                            fields: {
                                "attendees" : attendees
                            } //must parse string into integer
                        };

                        return Podio.request('put', '/item/' + eventId, requestData)
                    })
                    .catch(exception.catcher('Add to Event Error'));

            }
        }

})();