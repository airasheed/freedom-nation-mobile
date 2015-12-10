/*global angular */

/**
 * Services that persists and retrieves attendee information from PODIO API
 * PODIO API URL : api.podio.com
 *
 * Both Attendee and Attendees Controller use this service, returning promises for all changes to the
 * model.
 */

angular.module('freedomnation.services')
    .factory('AttendeeService', ['Podio', '$q', '$http', 'utils','fnCache', function (Podio,$q,$http,utils,fnCache) {

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

        function getAttendees(attendeeIds,eventId) {


            var attendees = $q.defer();
            var requestData = {
                "filters" : {
                    "item_id" : attendeeIds
                }
            };
            var cache = fnCache.get('attendees:' + eventId);
            //If object cached
            if(cache) {
                attendees.resolve(cache);
                return attendees.promise;
            }
            //Object not cached
            Podio.podio.request('post', '/item/app/10462146/filter', requestData)
                .then(function (response) {
                    newAttendees = arrangeAttendees(response);

                    for(var i = 0; i < newAttendees.length; i++) {
                        //capture value of i with IIFE
                        (function (j) {
                            $http.get(fileAPIUrl + newAttendees[j].img.file_id
                                + '/raw',{responseType:'arraybuffer'})
                                .then(function(response) {
                                    newAttendees[j].img.src = utils.convertDataUrl(response);
                                })
                                .catch(function(error) {
                                    console.log('for loop response: ', error);
                                }).then(function() {

                                })
                        })(i);
                    }
                    fnCache.put('attendees:' + eventId, newAttendees);
                    attendees.resolve(newAttendees);
                })
                .catch(function(error) {
                    console.log(error)
                });

            return attendees.promise;

        }

        /*
         * Get Single Attendee
         * @params: attendeeId
         *
         * */

        function getAttendee (attendeeId) {

            var attendee = $q.defer();
            var cache = fnCache.get(attendeeId);

            /*
             * Check for cached object
             * */
            if(cache) {
                console.log('it was cached');
                attendee.resolve(cache);
                return attendee.promise;
            }
            //If no cached object was found make request to podio
            Podio.podio.request('get', '/item/' + attendeeId)
                .then(function (responseEvent) {
                    newAttendee = arrangeAttendee(responseEvent);
                    return newAttendee.img.file_id;
                })
                .then(function(imgId) {
                    return $http.get(fileAPIUrl + imgId + '/raw', {responseType: 'arraybuffer'});
                }).then(function(response) {
                    newAttendee.img.src = utils.convertDataUrl(response);
                    fnCache.put(attendeeId, newAttendee);
                    attendee.resolve(newAttendee);
                })
                .catch(function(error) {
                    console.log(error);
                });
            return attendee.promise;
        }

        function getAttendeeByBarcode(barcode) {
            var attendee = $q.defer();

            var requestData = {
                "filters" : {
                    "barcode-2" : barcode
                }
            };

            Podio.podio.request('post', '/item/app/10462146/filter', requestData)
                .then(function (responseEvent) {
                    newAttendee = arrangeAttendee(responseEvent.items[0]);
                    return newAttendee.img.file_id;
                })
                .then(function(imgId) {
                    return $http.get(fileAPIUrl+ imgId + '/raw', {responseType: 'arraybuffer'});
                }).then(function(response) {
                    newAttendee.img.src = utils.convertDataUrl(response);
                    attendee.resolve(newAttendee);
                })
                .catch(function(error) {
                    console.log(error);
                });
            return attendee.promise;
        }

        function getImg(imgId) {
            var qImgUrl = $q.defer();

            $http.get(fileAPIUrl + imgId + '/raw', {responseType: 'arraybuffer'})
                .then(function (response) {
                    var dataUrl = utils.convertDataUrl(response);
                    qImgUrl.resolve(dataURL);
                }).catch(function (error) {
                    console.log(error);
                });

            return qImgUrl.promise;
        }

        /*
         * Add to Event
         * @params: eventId, attendeeId
         * */

        function addToEvent(eventId,attendeeId) {

            var requestData = {
                fields: {
                    "attendees" : parseInt(attendeeId)
                } //must parse string into integer
            };

            return Podio.podio.request('put', '/item/' + eventId, requestData)
                .catch(function(error) {
                    console.log(error);
                });
        }
    }]);