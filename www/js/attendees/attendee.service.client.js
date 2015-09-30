angular.module('freedomnation.services')
    .factory('AttendeeService', ['Podio', '$q', '$http', 'utils', function (Podio,$q,$http,utils) {

        var citizenFieldIds = {
            info: 80911192,
            barcode: 102793685,
            status: 92390772,
            description: 80910890,
            img: 80911195
        };

        var newAttendee = {};
        var newAttendees = [];


        var arrangeAttendee = function(responseEvent) {
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
        };

        var arrangeAttendees = function(response) {

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
        };


        return {


            getAttendees: function(attendeeIds) {

                var attendees = $q.defer();

                var requestData = {
                    "filters" : {
                        "item_id" : attendeeIds
                    }
                };

                Podio.podio.request('post', '/item/app/10462146/filter', requestData)
                    .then(function (response) {
                        newAttendees = arrangeAttendees(response);

                        for(var i = 0; i < newAttendees.length; i++) {
                            (function (j) {
                                $http.get('https://api.podio.com/file/' + newAttendees[j].img.file_id + '/raw',{responseType:'arraybuffer'})
                                    .then(function(response) {
                                        newAttendees[j].img.src = utils.convertDataUrl(response);
                                    })
                                    .catch(function(error) {
                                        console.log('for loop response: ', error);
                                    }).then(function() {

                                    })
                            })(i);
                        }
                        attendees.resolve(newAttendees);
                    })
                    .catch(function(error) {
                        console.log(error)
                    });

                return attendees.promise;

            },

            /*
            * Get Single Attendee
            * @params: attendeeId
            *
            * */


            getAttendee: function (attendeeId) {
                var attendee = $q.defer();

                Podio.podio.request('get', '/item/' + attendeeId)
                    .then(function (responseEvent) {
                        newAttendee = arrangeAttendee(responseEvent);
                        return newAttendee.img.file_id;
                    })
                    .then(function(imgId) {
                        return $http.get('https://api.podio.com/file/' + imgId + '/raw', {responseType: 'arraybuffer'});
                    }).then(function(response) {
                        newAttendee.img.src = utils.convertDataUrl(response);
                        attendee.resolve(newAttendee);

                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                return attendee.promise;
            },

            getAttendeeByBarcode: function (barcode) {
                var attendee = $q.defer();

                var requestData = {
                    "filters" : {
                        "barcode-2" : barcode
                    }
                };

                Podio.podio.request('post', '/item/app/10462146/filter', requestData)
                    .then(function (responseEvent) {

/*                        if(responseEvent.items[0] == null ){
                            console.log(Podio.podio.request);
                            return;
                        }*/

                        newAttendee = arrangeAttendee(responseEvent.items[0]);
                        return newAttendee.img.file_id;
                    })
                    .then(function(imgId) {
                        return $http.get('https://api.podio.com/file/' + imgId + '/raw', {responseType: 'arraybuffer'});
                    }).then(function(response) {
                        newAttendee.img.src = utils.convertDataUrl(response);
                        attendee.resolve(newAttendee);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                return attendee.promise;
            },

            getImg: function(imgId) {
                var qImgUrl = $q.defer();

                $http.get('https://api.podio.com/file/' + imgId+ '/raw',{responseType:'arraybuffer'}).then(function(response) {
                    var dataUrl = utils.convertDataUrl(response);
                    qImgUrl.resolve(dataURL);
                }).catch(function(error) {
                    console.log(error);
                });

                return qImgUrl.promise;
            },

            /*
            * Add to Event
            * @params: eventId, attendeeId
            * */

            addToEvent: function(eventId,attendeeId) {

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
        };
    }]);